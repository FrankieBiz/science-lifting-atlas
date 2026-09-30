import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '../../');
const PUBLIC = resolve(ROOT, 'public');

describe('digital assets contract', () => {
  it('supplies a valid vector favicon SVG with the Luminous Anatomy plate', async () => {
    const svgPath = resolve(PUBLIC, 'favicon.svg');
    const content = await readFile(svgPath, 'utf8');

    expect(content).toContain('<svg');
    expect(content).toContain('viewBox="0 0 512 512"');
    expect(content).toContain('#d46a5f'); // tissue core
    expect(content).toContain('#8ea0ad'); // mineral silver orbit
    expect(content).toContain('#0b0e11'); // dark mineral background
  });

  it('supplies a multi-resolution binary favicon.ico with valid ICO header', async () => {
    const icoPath = resolve(PUBLIC, 'favicon.ico');
    const buffer = await readFile(icoPath);

    // Standard Windows ICO magic number: 0x0000 0x0001
    expect(buffer.readUInt16LE(0)).toBe(0);
    expect(buffer.readUInt16LE(2)).toBe(1);
    const imageCount = buffer.readUInt16LE(4);
    expect(imageCount).toBeGreaterThanOrEqual(1);
    expect(buffer.length).toBeGreaterThan(500);
  });

  it('supplies apple-touch-icon and PWA icons with valid PNG signatures and dimensions', async () => {
    const icons = [
      {
        path: resolve(PUBLIC, 'apple-touch-icon.png'),
        width: 180,
        height: 180,
      },
      { path: resolve(PUBLIC, 'icons/icon-192.png'), width: 192, height: 192 },
      { path: resolve(PUBLIC, 'icons/icon-512.png'), width: 512, height: 512 },
      {
        path: resolve(PUBLIC, 'icons/icon-maskable-192.png'),
        width: 192,
        height: 192,
      },
      {
        path: resolve(PUBLIC, 'icons/icon-maskable-512.png'),
        width: 512,
        height: 512,
      },
    ];

    for (const icon of icons) {
      const buffer = await readFile(icon.path);
      // PNG signature: 89 50 4E 47 0D 0A 1A 0A
      expect(buffer.subarray(0, 8)).toEqual(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
      // IHDR chunk begins at offset 12; width at 16 (BE), height at 20 (BE)
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      expect(width).toBe(icon.width);
      expect(height).toBe(icon.height);
    }
  });

  it('supplies 1200x630 social share cards for Open Graph and Twitter', async () => {
    const cards = [
      resolve(PUBLIC, 'og-image.png'),
      resolve(PUBLIC, 'twitter-image.png'),
    ];

    for (const card of cards) {
      const buffer = await readFile(card);
      expect(buffer.subarray(0, 8)).toEqual(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      expect(width).toBe(1200);
      expect(height).toBe(630);
    }
  });

  it('supplies valid web app manifests referencing real icon files', async () => {
    const manifestPaths = [
      resolve(PUBLIC, 'site.webmanifest'),
      resolve(PUBLIC, 'manifest.json'),
    ];

    for (const manifestPath of manifestPaths) {
      const raw = await readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(raw);

      expect(manifest.name).toBe('Science-Based Lifting Atlas');
      expect(manifest.short_name).toBe('Lifting Atlas');
      expect(manifest.theme_color).toBe('#0b0e11');
      expect(manifest.background_color).toBe('#0b0e11');
      expect(manifest.icons).toBeInstanceOf(Array);
      expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

      for (const icon of manifest.icons) {
        const cleanPath = icon.src.replace(/^\.\//, '');
        const targetPath = resolve(PUBLIC, cleanPath);
        const iconStat = await stat(targetPath);
        expect(iconStat.isFile()).toBe(true);
      }
    }
  });

  it('supplies robots.txt allowing search indexing', async () => {
    const robotsPath = resolve(PUBLIC, 'robots.txt');
    const content = await readFile(robotsPath, 'utf8');
    expect(content).toContain('User-agent:');
    expect(content).toContain('Allow: /');
  });

  it('links digital assets from the shared layout using depth-relative URLs', async () => {
    const layoutPath = resolve(ROOT, 'src/layouts/AtlasLayout.astro');
    const content = await readFile(layoutPath, 'utf8');

    expect(content).toContain('href={`${rootHref}favicon.svg`}');
    expect(content).toContain('href={`${rootHref}favicon.ico`}');
    expect(content).toContain('href={`${rootHref}apple-touch-icon.png`}');
    expect(content).toContain('rel="apple-touch-icon"');
    expect(content).toContain('href={`${rootHref}site.webmanifest`}');
    // Social images go through socialImage(), which stays depth-relative
    // unless PUBLIC_SITE_URL is set at build time.
    expect(content).toContain("content={socialImage('og-image.png')}");
    expect(content).toContain("content={socialImage('twitter-image.png')}");
    expect(content).toContain('`${rootHref}${file}`');
  });

  it('renders every icon edge-to-edge: no white page margin, art not clipped', async () => {
    const isLight = (r: number, g: number, b: number) =>
      r > 200 && g > 200 && b > 200;
    const icons = [
      { file: 'icons/icon-192.png', size: 192, rounded: true },
      { file: 'icons/icon-512.png', size: 512, rounded: true },
      { file: 'icons/icon-maskable-192.png', size: 192, rounded: false },
      { file: 'icons/icon-maskable-512.png', size: 512, rounded: false },
      { file: 'apple-touch-icon.png', size: 180, rounded: false },
    ];

    for (const icon of icons) {
      const { data, info } = await sharp(resolve(PUBLIC, icon.file))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const at = (x: number, y: number) => {
        const i = (y * info.width + x) * 4;
        return [
          data[i] ?? 0,
          data[i + 1] ?? 0,
          data[i + 2] ?? 0,
          data[i + 3] ?? 0,
        ] as [number, number, number, number];
      };
      const last = icon.size - 1;
      const inset = Math.ceil(icon.size * 0.04);

      // Rounded tiles are transparent at the corner; square art is opaque dark.
      const corners: [number, number][] = [
        [0, 0],
        [last, 0],
        [0, last],
        [last, last],
      ];
      for (const [x, y] of corners) {
        const [r, g, b, a] = at(x, y);
        if (icon.rounded) expect(a, `${icon.file} corner`).toBe(0);
        else {
          expect(a, `${icon.file} corner alpha`).toBe(255);
          expect(isLight(r, g, b), `${icon.file} corner is dark`).toBe(false);
        }
      }

      // A page-margin bug leaves a light strip along the top and left edges.
      for (let i = inset; i < icon.size - inset; i++) {
        const edges: [number, number][] = [
          [i, 0],
          [0, i],
        ];
        for (const [x, y] of edges) {
          const [r, g, b, a] = at(x, y);
          expect(
            a === 0 || !isLight(r, g, b),
            `${icon.file} has no light edge strip`,
          ).toBe(true);
        }
      }

      // A clipped render loses the red tissue core near the centre.
      const c = Math.round(icon.size / 2);
      const reach = Math.round(icon.size * 0.06);
      let hasCore = false;
      for (let y = c - reach; y <= c + reach; y++) {
        for (let x = c - reach; x <= c + reach; x++) {
          const [r, g, b] = at(x, y);
          if (r > g + 40 && r > b + 40) hasCore = true;
        }
      }
      expect(hasCore, `${icon.file} shows the tissue core`).toBe(true);
    }
  });
});
