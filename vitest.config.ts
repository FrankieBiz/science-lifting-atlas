import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'tests/unit/**/*.test.ts',
      'tests/accessibility/**/*.test.ts',
      'tests/visual/**/*.test.ts',
      'tests/performance/**/*.test.ts',
    ],
    passWithNoTests: false,
  },
});
