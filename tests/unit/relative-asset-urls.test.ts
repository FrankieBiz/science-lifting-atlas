import { describe, expect, it } from 'vitest';

import { rewriteAssetPrefix } from '../../scripts/portability/rewrite-relative-assets.mjs';

describe('relative asset URL rewriting', () => {
  it('rewrites quoted attribute values', () => {
    expect(
      rewriteAssetPrefix('<img src="./assets/a.webp">', '../../assets/'),
    ).toBe('<img src="../../assets/a.webp">');
  });

  it('rewrites every candidate in a srcset', () => {
    expect(
      rewriteAssetPrefix(
        '<img srcset="./assets/a.webp 862w, ./assets/b.webp 1724w,./assets/c.webp 2586w">',
        '../assets/',
      ),
    ).toBe(
      '<img srcset="../assets/a.webp 862w, ../assets/b.webp 1724w,../assets/c.webp 2586w">',
    );
  });

  it('leaves prose that mentions the folder alone', () => {
    const html = '<p>Files live in ./assets/ and, ./assets/ again.</p>';
    expect(rewriteAssetPrefix(html, '../assets/')).toBe(html);
  });
});
