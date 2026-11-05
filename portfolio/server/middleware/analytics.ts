import type { Request, Response, NextFunction } from 'express';
import { isAIAgent, identifyAgent, classifyCrawlerRole } from './agent-detection.js';
import { getAnalyticsStore, runInBackground } from '../lib/analytics-store.js';

function clientIp(req: Request): string | null {
  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf) return cf;
  if (req.ip) return req.ip;
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : fwd) || null;
}

export function logAgentVisit(req: Request, _res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';
  const store = getAnalyticsStore();

  if (store && isAIAgent(userAgent)) {
    const task = store
      .logVisit({
        userAgent,
        agentName: identifyAgent(userAgent),
        crawlerRole: classifyCrawlerRole(userAgent),
        requestPath: req.path,
        referrer: req.headers['referer'] || null,
        responseType: req.path === '/' ? 'dossier' : 'standard',
        ipAddress: clientIp(req),
      })
      .catch((err) => {
        console.error('Failed to log agent visit:', err);
      });
    runInBackground(task);
  }

  next();
}
