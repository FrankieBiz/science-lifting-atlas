import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    assets: 'assets',
    assetsPrefix: '.',
  },
  output: 'static',
});
