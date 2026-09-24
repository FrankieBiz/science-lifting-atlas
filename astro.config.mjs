import { copyFile } from 'node:fs/promises';

import { defineConfig } from 'astro/config';

import { relativeAssetUrls } from './scripts/portability/rewrite-relative-assets.mjs';

export default defineConfig({
  build: {
    assets: 'assets',
    assetsPrefix: '.',
  },
  integrations: [
    relativeAssetUrls(),
    {
      name: 'local-review-body-model',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          if (process.env.SBLA_012_PROTOTYPE !== 'local-owner-review') return;
          await copyFile(
            new URL(
              './assets/derived/bodyparts3d/sbla013-pectoralis.glb',
              import.meta.url,
            ),
            new URL('assets/sbla013-pectoralis.glb', dir),
          );
        },
      },
    },
  ],
  output: 'static',
});
