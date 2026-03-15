import type { Request, Response } from 'express';
import { loadCorpus } from '../lib/corpus.js';
import { getIndexableRoutes } from '../lib/routes.js';

export function serveSitemap(_req: Request, res: Response) {
  const corpus = loadCorpus();
  const baseUrl = corpus.canonicalUrl || 'https://coty.design';
  const lastmod = corpus.lastUpdated || new Date().toISOString().split('T')[0];
  const entries = getIndexableRoutes();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${escapeXml(`${baseUrl}${e.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(xml);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
