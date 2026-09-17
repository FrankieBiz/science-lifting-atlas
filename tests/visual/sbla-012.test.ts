import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('SBLA-012 applied-strength editorial visual contract', () => {
  it('defines the carbon, paper, tissue, and evidence palette as reusable tokens', async () => {
    const tokens = await readFile('src/styles/tokens.css', 'utf8');

    for (const token of [
      '--ink-1000',
      '--ink-950',
      '--paper-100',
      '--tissue-500',
      '--signal-500',
      '--font-display',
      '--font-serif',
      '--font-mono',
      '--step-4',
      '--space-7',
    ]) {
      expect(tokens).toContain(`${token}:`);
    }
    expect(tokens).not.toMatch(/:\s*#000(?:000)?\s*;/i);
  });

  it('styles the masthead, training-first hero, evidence chain, and record pages', async () => {
    const styles = await readFile('src/styles/global.css', 'utf8');

    for (const selector of [
      '.site-header',
      '.home-hero',
      '.home-hero__visual',
      '.evidence-trace',
      '.home-principles',
      '.entity-hero',
      '.entity-hero__specimen--exercise',
      '.entity-summary',
      '.prototype-claim',
      '.source-page',
      '.method-page',
    ]) {
      expect(styles).toContain(selector);
    }
  });

  it('defines desktop, tablet, and narrow reflow behavior without hiding core content', async () => {
    const styles = await readFile('src/styles/global.css', 'utf8');

    expect(styles).toContain('@media (max-width: 82rem)');
    expect(styles).toContain('@media (max-width: 62rem)');
    expect(styles).toContain('@media (max-width: 44rem)');
    for (const selector of [
      '.site-header',
      '.home-hero',
      '.home-hero__visual',
      '.evidence-trace',
      '.home-principles',
      '.entity-hero',
      '.entity-summary',
      '.prototype-claim',
      '.source-page',
      '.method-page',
    ]) {
      expect(styles).not.toMatch(
        new RegExp(
          `${selector.replace('.', '\\\\.')}\\s*\\{[^}]*display:\\s*none`,
        ),
      );
    }
  });
});
