import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import pkg from './package.json';

function nonBlockingCssPlugin(): Plugin {
  return {
    name: 'non-blocking-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link\s+rel="stylesheet"\s*([^>]*?)href="(\/assets\/[^"]+\.css)"([^>]*)>/g,
        '<link rel="preload" as="style" $1href="$2"$3 onload="this.rel=\'stylesheet\';this.onload=null"><noscript><link rel="stylesheet" $1href="$2"$3></noscript>'
      );
    }
  };
}

export default defineConfig({
  plugins: [svelte(), nonBlockingCssPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    modulePreload: {
      polyfill: true
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5001,
    allowedHosts: true,
    fs: {
      allow: ['..']
    }
  }
});
