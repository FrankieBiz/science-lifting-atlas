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

  it('gives the abstract plate a text alternative without implying anatomy detail', async () => {
    const home = await read('src/pages/index.astro');

    expect(home).toContain('role="img"');
    expect(home).toContain('aria-labelledby="plate-title plate-desc"');
    expect(home).toContain('does not convey anatomical detail');
  });

  it('provides visible focus treatment and reduced-motion behavior', async () => {
    const styles = await read('src/styles/global.css');

    expect(styles).toContain(':focus-visible');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styles).toContain('animation-iteration-count: 1 !important');
  });
});
