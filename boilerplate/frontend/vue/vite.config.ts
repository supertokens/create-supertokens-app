// vite.config.js
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { websitePort } from './src/config';

// Vite resolve alias configuration
export default defineConfig({
  plugins: [vue()],
  server: {
    port: websitePort,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    preserveSymlinks: true,
  },
  optimizeDeps: {
    force: true,
  },
});
