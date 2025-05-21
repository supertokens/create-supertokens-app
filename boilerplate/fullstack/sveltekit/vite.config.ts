import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { websitePort } from './src/config/frontend';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: websitePort,
  },
  optimizeDeps: {
    force: true,
  },
  resolve: {
    preserveSymlinks: true,
  },
});
