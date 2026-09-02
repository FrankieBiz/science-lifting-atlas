import { defineConfig } from 'vitest/config';

/**
 * The portability check runs against dist/, so it must execute after a build.
 * It lives in its own config rather than the default `pnpm test` include list,
 * which runs before the build in the verify pipeline.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'tests/integration/portability.test.ts',
      'tests/integration/portability/**/*.test.ts',
    ],
    passWithNoTests: false,
  },
});
