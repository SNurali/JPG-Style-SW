import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    // Playwright e2e specs live under e2e/ and are run by `npm run e2e`,
    // not by vitest — without this exclude vitest tries to import them
    // and crashes on Playwright's test() runtime guard.
    exclude: ['node_modules/**', 'dist/**', '.next/**', 'e2e/**'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '.next/', 'coverage/', '**/*.config.*', '**/index.ts'],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './packages/shared'),
    },
  },
});
