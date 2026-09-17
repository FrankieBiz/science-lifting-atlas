import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('SBLA-012 clinical-cinematic visual contract', () => {
  it('defines the restrained palette, type scale, spacing, and focus colors as tokens', async () => {
    const tokens = await readFile('src/styles/tokens.css', 'utf8');

    for (const token of [
      '--ink-950',
      '--paper-100',
      '--tissue-500',
      '--signal-500',
      '--font-display',
      '--font-mono',
      '--step-4',
      '--space-7',
    ]) {
      expect(tokens).toContain(`${token}:`);
    }
    expect(tokens).not.toMatch(/:\s*#000(?:000)?\s*;/i);
  });

  it('defines desktop, tablet, and narrow reflow behavior without hiding content', async () => {
    const styles = await readFile('src/styles/global.css', 'utf8');

    expect(styles).toContain('@media (max-width: 82rem)');
    expect(styles).toContain('@media (max-width: 62rem)');
    expect(styles).toContain('@media (max-width: 44rem)');
    for (const selector of [
      '.hero-statement',
      '.specimen',
      '.focus-index',
      '.claim-vault',
      '.evidence-trace',
    ]) {
      expect(styles).not.toMatch(
        new RegExp(
          `${selector.replace('.', '\\\\.')}\\s*\\{[^}]*display:\\s*none`,
        ),
      );
    }
  });
});
