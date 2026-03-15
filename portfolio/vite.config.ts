import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import pkg from './package.json';

function preservePlaceholderPlugin(): Plugin {
  const placeholderHtml = `<div id="app-placeholder">
        <h1>Coty Beasley</h1>
        <p class="placeholder-role">Design and Product Leader</p>
        <p class="placeholder-summary">Good design brings clarity to complexity and makes technology actually useful. With this in mind, I work at the intersection of systems, people, and innovation to help organizations and communities connect, collaborate, and grow.</p>
      </div>`;

  return {
    name: 'preserve-placeholder',
    enforce: 'post',
    transformIndexHtml(html) {
      if (!html.includes('id="app-placeholder"')) {
        html = html.replace(
          /<div id="app">[\s]*<\/div>/,
          `<div id="app">${placeholderHtml}</div>`
        );
      }

      const scriptMatch = html.match(/<script[^>]+src="(\/assets\/[^"]+\.js)"[^>]*>/);
      if (scriptMatch && !html.includes('rel="modulepreload"')) {
        const modulepreloadTag = `<link rel="modulepreload" href="${scriptMatch[1]}" />`;
        html = html.replace(
          scriptMatch[0],
          `${modulepreloadTag}\n    ${scriptMatch[0]}`
        );
      }

      return html;
    }
  };
}

export default defineConfig({
  plugins: [svelte(), preservePlaceholderPlugin()],
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
