import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://coty.design';

export interface PageMeta {
  title: string;
  description: string;
  twitterDescription?: string;
  url: string;
}

interface RawClaim {
  '@id'?: string;
  shortName?: string;
  title?: string;
  statement?: string;
}

interface RawDoctrine {
  name?: string;
  description?: string;
  thesis?: string;
  claims?: RawClaim[];
}

const HOME_META: PageMeta = {
  title: 'Coty Beasley - Design and Product Leader',
  description: 'Good design brings clarity to complexity and makes technology actually useful. Design and product leadership portfolio.',
  twitterDescription: 'Good design brings clarity to complexity and makes technology actually useful.',
  url: `${BASE_URL}/`,
};

let doctrineCache: RawDoctrine | null = null;

function loadDoctrine(): RawDoctrine {
  if (doctrineCache) return doctrineCache;
  const docPath = path.resolve(__dirname, '../../public/doctrine.jsonld');
  const raw = fs.readFileSync(docPath, 'utf-8');
  doctrineCache = JSON.parse(raw) as RawDoctrine;
  return doctrineCache;
}

function getDoctrineMeta(): PageMeta {
  const doctrine = loadDoctrine();
  const title = doctrine.name
    ? `${doctrine.name} — Coty Beasley`
    : 'Doctrine — Coty Beasley';
  const description = doctrine.thesis ?? doctrine.description ?? '';
  return { title, description, url: `${BASE_URL}/doctrine` };
}

function getClaimMeta(claimId: string): PageMeta | null {
  const doctrine = loadDoctrine();
  const claims = doctrine.claims ?? [];
  const decoded = decodeURIComponent(claimId);
  const claim = claims.find((c) => {
    const id = (c['@id'] ?? '').replace('#', '');
    return id === decoded || c.shortName === decoded || id === claimId || c.shortName === claimId;
  });
  if (!claim) return null;
  const claimTitle = claim.title ?? claimId;
  const resolvedId = (claim['@id'] ?? '').replace('#', '') || claimId;
  return {
    title: `${claimTitle} — Coty Beasley`,
    description: claim.statement ?? '',
    url: `${BASE_URL}/doctrine/${resolvedId}`,
  };
}

export function resolvePageMeta(urlPath: string): PageMeta {
  const normalized = urlPath.replace(/\/$/, '') || '/';

  if (normalized === '/') return HOME_META;

  if (normalized === '/doctrine') return getDoctrineMeta();

  const claimMatch = normalized.match(/^\/doctrine\/(.+)$/);
  if (claimMatch) {
    const claimId = claimMatch[1];
    const meta = getClaimMeta(claimId);
    if (meta) return meta;
    return { ...getDoctrineMeta(), url: `${BASE_URL}${normalized}` };
  }

  return { ...HOME_META, url: `${BASE_URL}${normalized}` };
}

export function injectMetaTags(html: string, meta: PageMeta): string {
  let result = html;

  result = result.replace(
    /(<title>)[^<]*(<\/title>)/,
    `$1${escapeHtml(meta.title)}$2`,
  );

  result = result.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${escapeHtml(meta.description)}$2`,
  );

  result = result.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${escapeHtml(meta.url)}$2`,
  );

  result = result.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${escapeHtml(meta.title)}$2`,
  );

  result = result.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${escapeHtml(meta.description)}$2`,
  );

  result = result.replace(
    /(<meta\s+name="twitter:url"\s+content=")[^"]*(")/,
    `$1${escapeHtml(meta.url)}$2`,
  );

  result = result.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${escapeHtml(meta.title)}$2`,
  );

  const twitterDesc = meta.twitterDescription ?? meta.description;
  result = result.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${escapeHtml(twitterDesc)}$2`,
  );

  result = result.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${escapeHtml(meta.url)}$2`,
  );

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

let cachedIndexHtml: string | null = null;

export function getIndexHtml(distPath: string): string {
  if (cachedIndexHtml) return cachedIndexHtml;
  cachedIndexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
  return cachedIndexHtml;
}
