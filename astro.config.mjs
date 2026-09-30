import { copyFile, readFile } from 'node:fs/promises';

import { defineConfig } from 'astro/config';

import { relativeAssetUrls } from './scripts/portability/rewrite-relative-assets.mjs';

const reviewModel = new URL(
  './assets/derived/bodyparts3d/sbla013-pectoralis.glb',
  import.meta.url,
);

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
        'astro:server:setup': async ({ server }) => {
          if (process.env.SBLA_012_PROTOTYPE !== 'local-owner-review') return;
          const bytes = await readFile(reviewModel);
          server.middlewares.use(
            '/assets/sbla013-pectoralis.glb',
            (_request, response) => {
              response.setHeader('Content-Type', 'model/gltf-binary');
              response.end(bytes);
            },
          );
        },
        'astro:build:done': async ({ dir }) => {
          if (process.env.SBLA_012_PROTOTYPE !== 'local-owner-review') return;
          await copyFile(
            reviewModel,
            new URL('assets/sbla013-pectoralis.glb', dir),
          );
        },
      },
    },
  ],
  output: 'static',
});
