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
  rationale?: string;
  status?: string;
  claimNumber?: string;
  supportingSignals?: string[];
  challenges?: string[];
  evaluationCriteria?: string[];
  evidence?: Array<{
    sourceTitle?: string;
    sourceUrl?: string;
    summary?: string;
  }>;
}

interface RawDoctrine {
  '@id'?: string;
  name?: string;
  description?: string;
  thesis?: string;
  dateModified?: string;
  author?: { name?: string };
  definitions?: Array<{ term?: string; description?: string }>;
  claims?: RawClaim[];
}

export const HOME_META: PageMeta = {
  title: 'Coty Beasley - Design and Product Leader',
  description: 'Good design brings clarity to complexity and makes technology actually useful. Design and product leadership portfolio.',
  twitterDescription: 'Good design brings clarity to complexity and makes technology actually useful.',
  url: `${BASE_URL}/`,
};

let doctrineCache: RawDoctrine | null = null;

export function invalidateDoctrineCache(): void {
  doctrineCache = null;
}

export function loadDoctrine(): RawDoctrine {
  if (doctrineCache) return doctrineCache;
  const docPath = path.resolve(__dirname, '../../public/doctrine.jsonld');
  const raw = fs.readFileSync(docPath, 'utf-8');
  doctrineCache = JSON.parse(raw) as RawDoctrine;
  return doctrineCache;
}

function plainTextSummary(value: string | undefined, maxLength = 155): string {
  const text = (value ?? '')
    .replace(/[*_~`#]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 100 ? lastSpace : maxLength - 1).trimEnd()}…`;
}

function claimSlug(claim: RawClaim): string {
  return claim.shortName || (claim['@id'] ?? '').replace(/^#/, '');
}

function findClaim(claimId: string): RawClaim | undefined {
  const decoded = decodeURIComponent(claimId);
  return (loadDoctrine().claims ?? []).find((claim) => {
    const id = (claim['@id'] ?? '').replace(/^#/, '');
    return id === decoded || claim.shortName === decoded;
  });
}

export function getDoctrineClaimSlugs(): string[] {
  return (loadDoctrine().claims ?? []).map(claimSlug).filter(Boolean);
}

function getDoctrineMeta(): PageMeta {
  const doctrine = loadDoctrine();
  const title = doctrine.name
    ? `${doctrine.name} — Coty Beasley`
    : 'Doctrine — Coty Beasley';
  const description = plainTextSummary(doctrine.thesis ?? doctrine.description);
  return { title, description, url: `${BASE_URL}/doctrine` };
}

function getClaimMeta(claimId: string): PageMeta | null {
  const claim = findClaim(claimId);
  if (!claim) return null;
  const claimTitle = claim.title ?? claimId;
  const resolvedId = claimSlug(claim) || claimId;
  return {
    title: `${claimTitle} — Coty Beasley`,
    description: plainTextSummary(claim.statement),
    url: `${BASE_URL}/doctrine/${resolvedId}`,
  };
}

export function resolvePageMeta(urlPath: string): PageMeta | null {
  const normalized = urlPath.replace(/\/$/, '') || '/';

  if (normalized === '/') return HOME_META;

  if (normalized === '/doctrine') return getDoctrineMeta();

  const claimMatch = normalized.match(/^\/doctrine\/(.+)$/);
  if (claimMatch) {
    const claimId = claimMatch[1];
    return getClaimMeta(claimId);
  }

  return null;
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

export function injectDoctrinePage(html: string, urlPath: string): string {
  const normalized = urlPath.replace(/\/$/, '');
  if (normalized !== '/doctrine' && !normalized.startsWith('/doctrine/')) return html;

  const doctrine = loadDoctrine();
  const claimId = normalized.startsWith('/doctrine/') ? normalized.slice('/doctrine/'.length) : null;
  const claim = claimId ? findClaim(claimId) : undefined;
  const body = claim ? renderClaimBody(doctrine, claim) : renderDoctrineBody(doctrine);
  const jsonLd = claim ? claimStructuredData(doctrine, claim) : doctrineStructuredData(doctrine);

  return html
    .replace(
      /<script id="page-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="page-structured-data" type="application/ld+json">${safeJson(jsonLd)}</script>`,
    )
    .replace(
      /<div id="app-placeholder">[\s\S]*?<\/div>\s*<div id="app"><\/div>/,
      `<div id="app-placeholder">${body}</div>\n    <div id="app"></div>`,
    );
}

function renderDoctrineBody(doctrine: RawDoctrine): string {
  const claims = doctrine.claims ?? [];
  return `<main class="placeholder-content doctrine-static">
    <nav><a href="/">← Back to portfolio</a></nav>
    <header>
      <h1>Doctrine</h1>
      <p>${escapeHtml((doctrine.name ?? 'Doctrine').replace('Doctrine: ', ''))}</p>
      <p>Positions I've taken on how AI-assisted development is evolving, tracked against real-world evidence.</p>
    </header>
    <section aria-labelledby="core-thesis"><h2 id="core-thesis">Core Thesis</h2><blockquote>${escapeHtml(doctrine.thesis ?? '')}</blockquote></section>
    <section aria-labelledby="doctrine-claims"><h2 id="doctrine-claims">Claims</h2>
      <ol>${claims.map((claim) => `<li><article>
        <h3><a href="/doctrine/${encodeURIComponent(claimSlug(claim))}">${escapeHtml(claim.title ?? claimSlug(claim))}</a></h3>
        <p>${escapeHtml(stripMarkdown(claim.statement ?? ''))}</p>
      </article></li>`).join('')}</ol>
    </section>
    ${doctrine.definitions?.length ? `<section aria-labelledby="working-definitions"><h2 id="working-definitions">Working Definitions</h2><dl>${doctrine.definitions.map((definition) => `<dt>${escapeHtml(definition.term ?? '')}</dt><dd>${escapeHtml(definition.description ?? '')}</dd>`).join('')}</dl></section>` : ''}
  </main>`;
}

function renderClaimBody(doctrine: RawDoctrine, claim: RawClaim): string {
  const list = (heading: string, items: string[] | undefined) => items?.length
    ? `<section><h2>${heading}</h2><ul>${items.map((item) => `<li>${escapeHtml(stripMarkdown(item))}</li>`).join('')}</ul></section>`
    : '';
  return `<main class="placeholder-content doctrine-static">
    <nav><a href="/doctrine">← Back to Doctrine</a></nav>
    <article>
      <header><p>Claim ${escapeHtml(claim.claimNumber ?? '')}${claim.status ? ` · ${escapeHtml(claim.status)}` : ''}</p><h1>${escapeHtml(claim.title ?? claimSlug(claim))}</h1></header>
      <section><h2>Claim</h2><p>${escapeHtml(stripMarkdown(claim.statement ?? ''))}</p></section>
      ${claim.rationale ? `<section><h2>Rationale</h2><p>${escapeHtml(stripMarkdown(claim.rationale))}</p></section>` : ''}
      ${list('Supporting Signals', claim.supportingSignals)}
      ${list('Challenges', claim.challenges)}
      ${claim.evidence?.length ? `<section><h2>Evidence</h2><ul>${claim.evidence.map((item) => `<li>${item.sourceUrl ? `<a href="${escapeHtml(item.sourceUrl)}">${escapeHtml(item.sourceTitle ?? item.sourceUrl)}</a>` : escapeHtml(item.sourceTitle ?? '')}${item.summary ? ` — ${escapeHtml(stripMarkdown(item.summary))}` : ''}</li>`).join('')}</ul></section>` : ''}
      ${list('Evaluation Criteria', claim.evaluationCriteria)}
    </article>
  </main>`;
}

function doctrineStructuredData(doctrine: RawDoctrine): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE_URL}/doctrine#webpage`,
    url: `${BASE_URL}/doctrine`,
    name: doctrine.name,
    description: plainTextSummary(doctrine.thesis ?? doctrine.description),
    dateModified: doctrine.dateModified,
    author: { '@type': 'Person', name: doctrine.author?.name ?? 'Coty Beasley' },
    mainEntity: {
      '@type': 'CreativeWorkSeries',
      '@id': doctrine['@id'] ?? `${BASE_URL}/doctrine#doctrine`,
      name: doctrine.name,
      abstract: doctrine.thesis,
      hasPart: (doctrine.claims ?? []).map((claim) => ({
        '@type': 'CreativeWork',
        name: claim.title,
        url: `${BASE_URL}/doctrine/${claimSlug(claim)}`,
      })),
    },
  };
}

function claimStructuredData(doctrine: RawDoctrine, claim: RawClaim): object {
  const url = `${BASE_URL}/doctrine/${claimSlug(claim)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: claim.title,
    description: plainTextSummary(claim.statement),
    dateModified: doctrine.dateModified,
    isPartOf: { '@id': `${BASE_URL}/doctrine#webpage`, name: doctrine.name },
    mainEntity: {
      '@type': 'CreativeWork',
      '@id': `${url}#claim`,
      name: claim.title,
      text: stripMarkdown(claim.statement ?? ''),
      abstract: stripMarkdown(claim.rationale ?? ''),
      author: { '@type': 'Person', name: doctrine.author?.name ?? 'Coty Beasley' },
    },
  };
}

function stripMarkdown(value: string): string {
  return value.replace(/[*_~`#]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function safeJson(value: object): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
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
