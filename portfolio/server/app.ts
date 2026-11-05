import express from 'express';
import type { Express, RequestHandler } from 'express';
import { agentDetectionMiddleware } from './middleware/agent-detection.js';
import { serveDossier } from './routes/dossier.js';
import { agentPreview } from './routes/agent-preview.js';
import { agentInsights, agentInsightsData } from './routes/agent-insights.js';
import { serveLlmsTxt, serveLlmsFullTxt } from './routes/llms-txt.js';
import { serveSitemap } from './routes/sitemap.js';
import { logAgentVisit } from './middleware/analytics.js';
import { registerRoute, mountRegisteredRoutes } from './lib/routes.js';
import { resolvePageMeta, injectMetaTags, injectDoctrinePage, HOME_META } from './lib/og-meta.js';

/**
 * Runtime-neutral app shared by the Node server (Replit) and the Cloudflare
 * Worker. Anything that touches the filesystem, a database driver or a
 * platform binding is passed in, never imported here.
 */
export interface CoreOptions {
  /** Handler for POST /api/sync-doctrine (Node: GitHub sync; Worker: disabled). */
  syncDoctrine: RequestHandler;
  /** Serves /.well-known/* (Node: express.static). Omit when the asset layer covers it. */
  wellKnown?: RequestHandler;
  /** Mounted first (Node: compression; Workers compress at the edge). */
  before?: RequestHandler[];
}

export function createCoreApp(opts: CoreOptions): Express {
  const app = express();

  for (const handler of opts.before ?? []) {
    app.use(handler);
  }

  app.use((req, res, next) => {
    const acceptsHtml = (req.headers.accept ?? '').includes('text/html');
    const isPageRequest = req.method === 'GET'
      && !req.path.startsWith('/api/')
      && !/\.\w+$/.test(req.path);
    if (acceptsHtml || isPageRequest) {
      res.setHeader('Link', '</llms.txt>; rel="describedby"; type="text/markdown"; title="LLM-readable site description"');
    }
    next();
  });

  app.post('/api/sync-doctrine', express.json({
    verify: (req, _res, buf) => {
      (req as typeof req & { rawBody?: string }).rawBody = buf.toString('utf-8');
    },
  }), opts.syncDoctrine);

  registerRoute({ path: '/', method: 'get', handlers: [], noindex: false, changefreq: 'monthly', priority: 1.0, mountManually: true });
  registerRoute({ path: '/agent-preview', method: 'use', handlers: [agentPreview], noindex: true, changefreq: 'monthly', priority: 0.0 });
  registerRoute({ path: '/agent-insights', method: 'get', handlers: [agentInsights], noindex: true, changefreq: 'weekly', priority: 0.0 });
  registerRoute({ path: '/api/agent-insights', method: 'get', handlers: [agentInsightsData], noindex: true, changefreq: 'weekly', priority: 0.0 });
  registerRoute({ path: '/doctrine', method: 'get', handlers: [], noindex: false, changefreq: 'monthly', priority: 0.8, mountManually: true });
  registerRoute({ path: '/llms.txt', method: 'get', handlers: [serveLlmsTxt], noindex: false, changefreq: 'monthly', priority: 0.8 });
  registerRoute({ path: '/llms-full.txt', method: 'get', handlers: [serveLlmsFullTxt], noindex: false, changefreq: 'monthly', priority: 0.7 });

  mountRegisteredRoutes(app);

  app.get('/sitemap.xml', serveSitemap);

  app.get('/api/dossier-preview', (req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    serveDossier(req, res);
  });

  if (opts.wellKnown) {
    app.use('/.well-known', opts.wellKnown);
  }

  app.use(logAgentVisit);
  app.use(agentDetectionMiddleware);

  return app;
}

export interface SpaOptions {
  /** Built dist/index.html. */
  getIndexHtml: () => string;
  /** Static file middleware(s) for the built assets, mounted after `/`. */
  staticHandlers: RequestHandler[];
}

/**
 * Production tail: agent dossier on `/`, meta-injected SPA shell for page
 * routes, static files, and real 404s with noindex.
 */
export function mountSpa(app: Express, opts: SpaOptions): void {
  const sendShell = (path: string, res: express.Response) => {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const meta = resolvePageMeta(path);
    const html = opts.getIndexHtml();
    if (!meta) {
      res.status(404).setHeader('X-Robots-Tag', 'noindex, nofollow');
      return res.send(injectMetaTags(html, HOME_META));
    }
    res.send(injectDoctrinePage(injectMetaTags(html, meta), path));
  };

  app.get('/', (req, res) => {
    if (res.locals.isAIAgent) {
      return serveDossier(req, res);
    }
    sendShell('/', res);
  });

  for (const handler of opts.staticHandlers) {
    app.use(handler);
  }

  app.get('/{*splat}', (req, res) => {
    sendShell(req.path, res);
  });
}
