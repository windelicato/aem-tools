/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config/)
import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

// Vite is now only used for testing and dev server, not for Node.js library builds.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
  test: {
    globals: true,
  },
});
