import { defineConfig, devices } from '@playwright/test';

if (process.env.CI === 'true' || process.env.DEPLOYMENT_ENV === 'production') {
  throw new Error('The SBLA-012 unpublished prototype is local-only.');
}

export default defineConfig({
  testDir: './tests/prototype',
  fullyParallel: false,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4322',
    javaScriptEnabled: false,
  },
  webServer: {
    command: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4322',
    env: {
      ...process.env,
      SBLA_012_PROTOTYPE: 'local-owner-review',
      ASTRO_PREVIEW_BACKGROUND: '0',
    },
    url: 'http://127.0.0.1:4322/health.txt',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
