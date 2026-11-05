import express from 'express';
import compression from 'compression';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCoreApp, mountSpa } from './app.js';
import { serveDossier } from './routes/dossier.js';
import { syncDoctrine } from './routes/sync-doctrine.js';
import { setAnalyticsStore } from './lib/analytics-store.js';
import { resolvePageMeta, injectMetaTags, injectDoctrinePage, getIndexHtml, HOME_META } from './lib/og-meta.js';

// Node entry (Replit). The Cloudflare Worker entry is worker/index.ts; both
// share server/app.ts.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT || '5000', 10);

if (process.env.DATABASE_URL) {
  try {
    const { createPgStore } = await import('./lib/analytics-pg.js');
    setAnalyticsStore(await createPgStore(process.env.DATABASE_URL));
  } catch (err) {
    console.error('Analytics DB init failed (non-fatal):', err);
  }
} else {
  console.warn('DATABASE_URL not set — analytics disabled');
}

const app = createCoreApp({
  before: process.env.NODE_ENV === 'production' ? [compression()] : [],
  syncDoctrine,
  wellKnown: express.static(path.resolve(__dirname, '../public/.well-known'), { dotfiles: 'allow' }),
});
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');

  mountSpa(app, {
    getIndexHtml: () => getIndexHtml(distPath),
    staticHandlers: [
      express.Router().use('/assets', express.static(path.join(distPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })),
      express.static(distPath, {
        maxAge: '1h',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
          }
        },
      }),
    ],
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: 'spa',
    root: path.resolve(__dirname, '..'),
  });

  app.get('/', (req, res, next) => {
    if (res.locals.isAIAgent) {
      return serveDossier(req, res);
    }
    next();
  });

  const rootPath = path.resolve(__dirname, '..');

  app.use((req, res, next) => {
    const accept = req.headers['accept'] ?? '';
    const isHtmlRequest = accept.includes('text/html');
    const hasExtension = /\.\w+$/.test(req.path);
    const isApiRoute = req.path.startsWith('/api/');

    if (!isHtmlRequest || hasExtension || isApiRoute) {
      return next();
    }

    const meta = resolvePageMeta(req.path);
    const sourceHtml = fs.readFileSync(path.join(rootPath, 'index.html'), 'utf-8');
    vite.transformIndexHtml(req.url, sourceHtml)
      .then((html) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        if (!meta) {
          res.status(404).setHeader('X-Robots-Tag', 'noindex, nofollow');
          return res.send(injectMetaTags(html, HOME_META));
        }
        res.send(injectDoctrinePage(injectMetaTags(html, meta), req.path));
      })
      .catch(next);
  });

  app.use(vite.middlewares);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running on port ${PORT}`);
  console.log(`Agent preview: http://localhost:${PORT}/agent-preview`);
  console.log(`Agent insights: http://localhost:${PORT}/agent-insights`);
});
