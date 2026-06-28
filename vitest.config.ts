import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '**/*.test.tsx',
        '**/*.test.ts',
      ],
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    deps: {
      inline: ['firebase'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
