import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// Set test environment variables directly
process.env.NODE_ENV = 'test';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
    testTimeout: 30000, // 30 seconds for E2E tests
    hookTimeout: 10000, // 10 seconds for setup/teardown
    teardownTimeout: 10000,
    // Run tests sequentially to avoid database conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
});