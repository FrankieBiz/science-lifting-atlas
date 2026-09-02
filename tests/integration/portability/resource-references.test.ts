import { describe, expect, it } from 'vitest';

import {
  collectSameOriginResourceReferences,
  isPathInsideMount,
} from './resource-references';

describe('homepage resource reference discovery', () => {
  it('finds root-absolute resources even when a relative stylesheet is valid', () => {
    const pageUrl = 'https://example.test/science-lifting-atlas/';
    const html = `
      <link rel="stylesheet" href="./assets/shell.css">
      <link rel="icon" href="/favicon.svg">
      <img src="/poster.webp" alt="">
      <script src="/app.js"></script>
      <img srcset="./poster-small.webp 1x, /poster-large.webp 2x" alt="">
      <a href="/outside-navigation">Navigation is tested separately</a>
      <script src="https://cdn.example/app.js"></script>
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP" alt="">
      <img data-src="/lazy-placeholder.webp" alt="">
      <link rel="prefetch" href="mailto:nobody@example.test">
      <script src="blob:https://example.test/not-a-static-file"></script>
    `;

    const references = collectSameOriginResourceReferences(html, pageUrl);
    expect(references.map(({ raw }) => raw)).toEqual([
      './assets/shell.css',
      '/favicon.svg',
      '/poster.webp',
      '/app.js',
      './poster-small.webp',
      '/poster-large.webp',
    ]);

    expect(
      references
        .filter(
          ({ url }) =>
            !isPathInsideMount(url.pathname, '/science-lifting-atlas/'),
        )
        .map(({ raw }) => raw),
    ).toEqual([
      '/favicon.svg',
      '/poster.webp',
      '/app.js',
      '/poster-large.webp',
    ]);
  });
});
