/**
 * Cloudflare Workers entry. Wraps the same Express app the Node server uses
 * (server/app.ts) via `httpServerHandler`; everything Node-only is swapped:
 *
 *  - content: corpus, doctrine and index.html are bundled at build time
 *  - analytics: D1 instead of Postgres, writes handed to waitUntil
 *  - static files: Workers Static Assets (ASSETS binding)
 *  - doctrine sync: disabled (dormant by design; no local disk here)
 */
import { env, waitUntil } from 'cloudflare:workers';
import { httpServerHandler } from 'cloudflare:node';
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

import corpus from '../content/agent-corpus.json';
import doctrineText from '../public/doctrine.jsonld';
import indexHtml from '../dist/index.html';

import { createCoreApp, mountSpa } from '../server/app.js';
import { setBundledCorpus } from '../server/lib/corpus.js';
import { setBundledDoctrine, setIndexHtml, getIndexHtml } from '../server/lib/og-meta.js';
import { setAnalyticsStore, setBackgroundRunner } from '../server/lib/analytics-store.js';
import { createD1Store } from '../server/lib/analytics-d1.js';

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
}
const bindings = env as unknown as Env;

setBundledCorpus(corpus);
setBundledDoctrine(JSON.parse(doctrineText));
setIndexHtml(indexHtml);
setBackgroundRunner((task) => waitUntil(task));
if (bindings.DB) {
  setAnalyticsStore(createD1Store(bindings.DB));
}

const PASSTHROUGH_REQUEST_HEADERS = ['if-none-match', 'if-modified-since', 'range'];
const DROP_RESPONSE_HEADERS = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection']);

/** Serve a file from Workers Static Assets, or fall through like express.static. */
async function serveAsset(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  try {
    const headers = new Headers();
    for (const name of PASSTHROUGH_REQUEST_HEADERS) {
      const value = req.headers[name];
      if (typeof value === 'string') headers.set(name, value);
    }
    const url = new URL(req.originalUrl, 'https://assets.local');
    const asset = await bindings.ASSETS.fetch(new Request(url, { method: req.method, headers }));
    if (asset.status === 404) return next();

    res.status(asset.status);
    asset.headers.forEach((value, name) => {
      if (!DROP_RESPONSE_HEADERS.has(name)) res.setHeader(name, value);
    });
    if (req.method === 'HEAD' || asset.status === 304 || !asset.body) return res.end();
    res.end(Buffer.from(await asset.arrayBuffer()));
  } catch (err) {
    next(err);
  }
}

function doctrineSyncDisabled(_req: ExpressRequest, res: ExpressResponse) {
  res.status(503).json({ error: 'Doctrine sync is disabled on this host' });
}

const app = createCoreApp({ syncDoctrine: doctrineSyncDisabled });
mountSpa(app, {
  getIndexHtml: () => getIndexHtml(''),
  staticHandlers: [serveAsset],
});

app.listen(3000);
export default httpServerHandler({ port: 3000 });
