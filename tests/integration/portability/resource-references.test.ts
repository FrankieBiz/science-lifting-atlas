import { describe, expect, it } from 'vitest';

import {
  collectSameOriginNavigationReferences,
  collectSameOriginResourceReferences,
  isPathInsideMount,
} from './resource-references';

describe('homepage resource reference discovery', () => {
  it('collects anchor and image-map navigation with quote-aware parsing', () => {
    const pageUrl = 'https://example.test/science-lifting-atlas/';
    const html = `
      <a title="Squat > Deadlift" href="./comparison">Comparison</a>
      <map><area alt="Phase 2 > lockout" href="/outside-map"></map>
      <a href="https://outside.example/path">External</a>
      <area href="mailto:nobody@example.test">Email>
    `;

    expect(
      collectSameOriginNavigationReferences(html, pageUrl).map(
        ({ raw }) => raw,
      ),
    ).toEqual(['./comparison', '/outside-map']);
  });

  it('keeps parsing resource attributes after a greater-than sign inside a quoted value', () => {
    const pageUrl = 'https://example.test/science-lifting-atlas/';
    const html = '<img alt="Squat > Deadlift comparison" src="/health.txt">';

    expect(
      collectSameOriginResourceReferences(html, pageUrl).map(({ raw }) => raw),
    ).toEqual(['/health.txt']);
  });

  it('covers the explicitly supported resource-bearing HTML attributes', () => {
    const pageUrl = 'https://example.test/science-lifting-atlas/';
    const html = `
      <video poster="/poster.jpg" src="/video.mp4"></video>
      <link rel="preload" as="image" imagesrcset="/small.png 1x, /large.png 2x">
      <object data="/thing.svg"></object>
      <meta property="og:image" content="/social.png">
      <meta name="description" content="not-a-resource">
      <img src=/unquoted.png alt="">
      <img srcset="data:image/svg+xml,%3Csvg%3E 1x, /network.png 2x" alt="">
    `;

    expect(
      collectSameOriginResourceReferences(html, pageUrl).map(({ raw }) => raw),
    ).toEqual([
      '/poster.jpg',
      '/video.mp4',
      '/small.png',
      '/large.png',
      '/thing.svg',
      '/social.png',
      '/unquoted.png',
      '/network.png',
    ]);
  });

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
