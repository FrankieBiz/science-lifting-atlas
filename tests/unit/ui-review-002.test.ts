import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';
import {
  figureAspect,
  labelEdge,
  mapPoint,
} from '../../src/lib/body-parts/body-map.ts';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

/** The declaration block of the first rule whose selector is exactly `selector`. */
function ruleBody(css: string, selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\>]/g, '\\$&');
  const match = new RegExp(
    `(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`,
    'm',
  ).exec(css);
  if (!match) throw new Error(`Rule not found: ${selector}`);
  return match[1]!;
}
const declaration = (body: string, property: string) =>
  new RegExp(`(?:^|[;\\s])${property}:\\s*([^;]+);`).exec(body)?.[1]?.trim();

describe('favicon and document head', () => {
  const layout = read('src/layouts/AtlasLayout.astro');

  it('ships a well-formed SVG favicon', () => {
    const svg = read('public/favicon.svg');
    expect(svg).toMatch(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg.trim().endsWith('</svg>')).toBe(true);
  });

  it('links the favicon relative to the page, never root-absolute', () => {
    expect(layout).toMatch(/rel="icon"/);
    expect(layout).toContain('${rootHref}favicon.svg');
    expect(layout).not.toMatch(/href="\/favicon/);
  });

  it('sets an initial scale on the viewport', () => {
    expect(layout).toMatch(
      /name="viewport"\s+content="width=device-width, initial-scale=1"/,
    );
  });
});

describe('explorer small text meets 4.5:1 on its real background', () => {
  const css = read('src/styles/anatomy-explorer.css');
  const cases: ReadonlyArray<[selector: string, background: string]> = [
    ['.anatomy-explorer__sidebar > header span', '#ffffff'],
    ['.anatomy-explorer__selection-label', '#ffffff'],
    ['.anatomy-explorer__source', '#f8f9fb'],
    ['.anatomy-explorer__muscles button > span:last-child', '#ffffff'],
  ];

  it.each(cases)('%s', (selector, background) => {
    const body = ruleBody(css, selector);
    const color = declaration(body, 'color');
    expect(color, `${selector} needs an explicit colour`).toMatch(/^#/);
    expect(contrast(color!, background)).toBeGreaterThanOrEqual(4.5);
    // Fading text with opacity hides the real contrast from this check.
    expect(declaration(body, 'opacity')).toBeUndefined();
  });

  it.each(cases)('%s is at least 12px', (selector) => {
    const size = declaration(ruleBody(css, selector), 'font-size');
    if (size) expect(Number.parseFloat(size)).toBeGreaterThanOrEqual(0.75);
  });

  it('keeps the stage status line at least 12px', () => {
    const css2 = css;
    expect(
      Number.parseFloat(
        declaration(
          ruleBody(
            css2,
            '.anatomy-explorer__status,\n.anatomy-explorer__gesture',
          ),
          'font-size',
        )!,
      ),
    ).toBeGreaterThanOrEqual(0.75);
  });
});

describe('focus rings stay visible on dark surfaces', () => {
  const tokens = read('src/styles/tokens.css');
  const global = read('src/styles/global.css');

  it('defines a light focus colour for dark surfaces and a default', () => {
    const onDark = /--focus-on-dark:\s*(#[0-9a-f]{6})/i.exec(tokens)?.[1];
    expect(onDark).toBeDefined();
    // Lightest stop of the dark explorer and hero gradients.
    expect(contrast(onDark!, '#4b5764')).toBeGreaterThanOrEqual(4.5);
    expect(tokens).toMatch(/--focus:\s*var\(--accent\)/);
  });

  it('draws the global ring from --focus', () => {
    expect(ruleBody(global, ':focus-visible')).toContain('var(--focus)');
  });

  it('switches dark containers to the light ring', () => {
    for (const selector of [
      '.home-hero__visual',
      '.anatomy-explorer__stage',
      '.body-map__frame',
    ]) {
      const source = [
        global,
        read('src/styles/anatomy-explorer.css'),
        read('src/styles/body-map.css'),
      ].join('\n');
      expect(ruleBody(source, selector), selector).toContain(
        '--focus: var(--focus-on-dark)',
      );
    }
  });

  it('uses --focus for the body-map hotspot ring', () => {
    expect(
      ruleBody(
        read('src/styles/body-map.css'),
        '.body-map__spot:focus-visible',
      ),
    ).toContain('var(--focus');
  });
});

describe('body map labels', () => {
  it('anchors labels toward the figure centre near the side edges', () => {
    expect(labelEdge(50)).toBe('center');
    expect(labelEdge(30)).toBe('center');
    expect(labelEdge(70)).toBe('center');
    expect(labelEdge(83)).toBe('end');
    expect(labelEdge(12)).toBe('start');
  });

  // A conservative text model: bold 13px system sans, plus pill padding.
  const labelWidth = (name: string) => name.length * 0.62 * 13 + 26;

  for (const figureWidth of [280, 350, 369]) {
    it(`keeps every real label inside a ${figureWidth}px figure`, () => {
      for (const part of BODY_PARTS) {
        for (const point of part.hotspots) {
          const cx = (mapPoint(point).left / 100) * figureWidth;
          const half = labelWidth(part.name) / 2;
          const edge = labelEdge(mapPoint(point).left);
          // The 44px hotspot target is centred on the point.
          const [left, right] =
            edge === 'end'
              ? [cx + 22 - labelWidth(part.name), cx + 22]
              : edge === 'start'
                ? [cx - 22, cx - 22 + labelWidth(part.name)]
                : [cx - half, cx + half];
          expect(
            left,
            `${part.name} (${point.view}) left`,
          ).toBeGreaterThanOrEqual(0);
          expect(
            right,
            `${part.name} (${point.view}) right`,
          ).toBeLessThanOrEqual(figureWidth);
        }
      }
    });
  }

  it('is unaffected by the figure aspect helper', () => {
    expect(figureAspect('front')).toBeGreaterThan(0);
  });

  it('keeps the index navigation free of duplicate region landmarks', () => {
    const source = read('src/components/body-parts/BodyMap.astro');
    // The page lists the same groups again in .part-groups; two <section>s
    // with the same accessible name are duplicate landmarks.
    expect(source).not.toMatch(/<section[^>]*aria-labelledby/);
    expect(source).toContain('aria-label="Body parts by region"');
  });

  it('shows labels on every displayed figure once JavaScript has run on touch', () => {
    const css = read('src/styles/body-map.css');
    const touch = /@media \(hover: none\) \{([\s\S]*?)\n\}/.exec(css)?.[1];
    expect(touch).toBeDefined();
    expect(touch).toContain("[data-enhanced='true']");
  });
});
