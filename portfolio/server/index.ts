import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { agentDetectionMiddleware } from './middleware/agent-detection.js';
import { serveDossier } from './routes/dossier.js';
import { agentPreview } from './routes/agent-preview.js';
import { agentInsights, agentInsightsData } from './routes/agent-insights.js';
import { serveLlmsTxt, serveLlmsFullTxt } from './routes/llms-txt.js';
import { logAgentVisit, initAnalyticsDb } from './middleware/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || '5000', 10);

initAnalyticsDb();

app.use('/agent-preview', agentPreview);
app.get('/agent-insights', (req, res, next) => { res.setHeader('X-Robots-Tag', 'noindex'); next(); }, agentInsights);
app.get('/api/agent-insights', (req, res, next) => { res.setHeader('X-Robots-Tag', 'noindex'); next(); }, agentInsightsData);

app.get('/llms.txt', serveLlmsTxt);
app.get('/llms-full.txt', serveLlmsFullTxt);

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
