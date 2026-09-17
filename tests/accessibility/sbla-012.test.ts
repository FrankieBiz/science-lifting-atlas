import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const read = (path: string) => readFile(path, 'utf8');

describe('SBLA-012 static-slice accessibility contract', () => {
  it('keeps language, bypass navigation, and named navigation landmarks', async () => {
    const [layout, header] = await Promise.all([
      read('src/layouts/AtlasLayout.astro'),
      read('src/components/sbla-012/SiteHeader.astro'),
    ]);

    expect(layout).toContain('<html lang="en">');
    expect(layout).toContain('class="skip-link" href="#main"');
    expect(layout).toContain('id="main"');
    expect(header).toContain('aria-label="Primary navigation"');
  });

  it('gives the lawful 2D fallback a direct text alternative', async () => {
    const [home, specimen, styles] = await Promise.all([
      read('src/pages/index.astro'),
      read('src/components/sbla-012/EntitySpecimen.astro'),
      read('src/styles/global.css'),
    ]);
    const attribution =
      'BodyParts3D, © The Database Center for Life Science licensed under CC';

    expect(home).toContain('<img');
    expect(home).toContain(
      'BodyParts3D anterior muscular-system render used as a non-interactive two-dimensional fallback.',
    );
    expect(home).toMatch(/2D fallback is\s+authoritative/);
    expect(home).toContain(attribution);
    expect(specimen).toMatch(
      /BodyParts3D, © The Database Center for Life Science licensed under\s+CC/,
    );
    expect(styles).not.toMatch(
      /\.entity-hero__specimen figcaption\s*\{[^}]*display:\s*none/su,
    );
  });

  it('provides visible focus treatment and reduced-motion behavior', async () => {
    const styles = await read('src/styles/global.css');

    expect(styles).toContain(':focus-visible');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styles).toContain('animation-iteration-count: 1 !important');
  });

  it('marks every local evidence archetype as noindex and visibly unpublished', async () => {
    const paths = [
      'src/pages/muscles/[slug].astro',
      'src/pages/exercises/[slug].astro',
      'src/pages/sources/[sourceId].astro',
    ];

    for (const path of paths) {
      const page = await read(path);
      expect(page).toContain('<PrototypeBanner />');
      expect(page).toContain('noindex');
    }
  });
});
