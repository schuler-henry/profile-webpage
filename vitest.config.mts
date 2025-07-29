import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          include: ['src/**/*.unit.test.ts', 'src/**/*.unit.test.tsx'],
          name: 'unit',
          testTimeout: 10000,
        },
      },
      {
        extends: true,
        test: {
          include: [
            'src/**/*.integrated.test.ts',
            'e2e/**/*.integrated.test.tsx',
          ],
          name: 'integrated',
          testTimeout: 20000,
          setupFiles: ['./vitest-setup-integrated.js'],
        },
      },
    ],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest-setup.js'],
  },
});
