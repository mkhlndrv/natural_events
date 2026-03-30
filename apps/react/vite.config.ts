/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [react(), process.env.ANALYZE === 'true' && analyzer()].filter(
    Boolean
  ),
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
          recharts: ['recharts'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
