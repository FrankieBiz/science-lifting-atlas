import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    assetsPrefix: '.',
  },
  output: 'static',
});
