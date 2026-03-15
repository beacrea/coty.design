import type { Express, RequestHandler } from 'express';

/**
 * Route metadata entry. All public routes should be registered here so the
 * sitemap and noindex headers stay in sync automatically.
 *
 * Set `mountManually: true` for routes that require special ordering with
 * middleware (e.g. `/` needs agent-detection middleware first). These routes
 * are included in the sitemap but must be mounted via app.get() in index.ts.
 */
export interface RouteEntry {
  path: string;
  method: 'get' | 'use';
  handlers: RequestHandler[];
  noindex: boolean;
  changefreq: string;
  priority: number;
  mountManually?: boolean;
}

const registry: RouteEntry[] = [];

export function registerRoute(entry: RouteEntry): void {
  registry.push(entry);
}

export function mountRegisteredRoutes(app: Express): void {
  for (const entry of registry) {
    if (entry.mountManually) continue;
    if (entry.noindex) {
      const noindexMiddleware: RequestHandler = (_req, res, next) => {
        res.setHeader('X-Robots-Tag', 'noindex');
        next();
      };
      app[entry.method](entry.path, noindexMiddleware, ...entry.handlers);
    } else {
      app[entry.method](entry.path, ...entry.handlers);
    }
  }
}

export function getIndexableRoutes(): RouteEntry[] {
  return registry.filter(r => !r.noindex);
}

export function getAllRoutes(): RouteEntry[] {
  return [...registry];
}
