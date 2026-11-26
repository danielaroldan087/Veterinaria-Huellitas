import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['test-vitest/**/*.test.js'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
});
