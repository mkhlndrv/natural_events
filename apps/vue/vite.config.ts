/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [vue(), process.env.ANALYZE === 'true' && analyzer()].filter(
    Boolean
  ),
  resolve: {
    alias: [
      { find: /^leaflet$/, replacement: 'leaflet/dist/leaflet-src.esm.js' },
    ],
  },
  server: {
    port: 3001,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vue/') && id.includes('node_modules')) {
            if (
              id.includes('/vue/') ||
              id.includes('vue-router') ||
              id.includes('pinia')
            )
              return 'vendor';
          }
          if (id.includes('leaflet')) return 'leaflet';
          if (id.includes('chart.js') || id.includes('vue-chartjs'))
            return 'chartjs';
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/.next/**',
      '**/e2e/**',
    ],
  },
});
