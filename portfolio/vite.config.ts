import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import pkg from './package.json';

export default defineConfig({
  plugins: [svelte()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  server: {
    host: '0.0.0.0',
    port: 5001,
    allowedHosts: true
  }
});
