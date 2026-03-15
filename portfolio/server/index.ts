import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { agentDetectionMiddleware } from './middleware/agent-detection.js';
import { serveDossier } from './routes/dossier.js';
import { agentPreview } from './routes/agent-preview.js';
import { agentInsights, agentInsightsData } from './routes/agent-insights.js';
import { serveLlmsTxt, serveLlmsFullTxt } from './routes/llms-txt.js';
import { serveSitemap } from './routes/sitemap.js';
import { logAgentVisit, initAnalyticsDb } from './middleware/analytics.js';
import { registerRoute, mountRegisteredRoutes } from './lib/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || '5000', 10);

initAnalyticsDb();

registerRoute({ path: '/', method: 'get', handlers: [], noindex: false, changefreq: 'monthly', priority: 1.0, mountManually: true });
registerRoute({ path: '/agent-preview', method: 'use', handlers: [agentPreview], noindex: false, changefreq: 'monthly', priority: 0.5 });
registerRoute({ path: '/agent-insights', method: 'get', handlers: [agentInsights], noindex: true, changefreq: 'weekly', priority: 0.0 });
registerRoute({ path: '/api/agent-insights', method: 'get', handlers: [agentInsightsData], noindex: true, changefreq: 'weekly', priority: 0.0 });
registerRoute({ path: '/llms.txt', method: 'get', handlers: [serveLlmsTxt], noindex: false, changefreq: 'monthly', priority: 0.8 });
registerRoute({ path: '/llms-full.txt', method: 'get', handlers: [serveLlmsFullTxt], noindex: false, changefreq: 'monthly', priority: 0.7 });

mountRegisteredRoutes(app);

app.get('/sitemap.xml', serveSitemap);

app.get('/api/dossier-preview', (req, res) => serveDossier(req, res));

app.use(logAgentVisit);
app.use(agentDetectionMiddleware);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');

  app.get('/', (req, res, next) => {
    if (res.locals.isAIAgent) {
      return serveDossier(req, res);
    }
    next();
  });

  app.use(express.static(distPath));

  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
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

  app.use(vite.middlewares);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running on port ${PORT}`);
  console.log(`Agent preview: http://localhost:${PORT}/agent-preview`);
  console.log(`Agent insights: http://localhost:${PORT}/agent-insights`);
});
