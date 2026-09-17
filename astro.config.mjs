import { defineConfig } from 'astro/config';

import { relativeAssetUrls } from './scripts/portability/rewrite-relative-assets.mjs';

export default defineConfig({
  build: {
    assets: 'assets',
    assetsPrefix: '.',
  },
  integrations: [relativeAssetUrls()],
  output: 'static',
});
