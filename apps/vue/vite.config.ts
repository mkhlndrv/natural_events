/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [vue(), process.env.ANALYZE === 'true' && analyzer()].filter(
    Boolean
  ),
  server: {
    port: 3001,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          leaflet: ['leaflet', '@vue-leaflet/vue-leaflet'],
          chartjs: ['chart.js', 'vue-chartjs'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
