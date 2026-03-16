import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  TRAINING_CRAWLERS,
  SEARCH_CRAWLERS,
  USER_RETRIEVAL_AGENTS,
  ALL_AI_AGENTS,
} from '../server/middleware/agent-detection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.VALIDATE_AGENT_URL || 'http://localhost:5000';

interface Corpus {
  lastUpdated: string;
  canonicalUrl: string;
  canonicalBio: string;
  identity: {
    name: string;
    jobTitle: string;
    organization: string;
    organizationUrl: string;
    currentLocation: string;
    currentLocationSince: string;
    birthPlace: string;
    description: string;
    linkedin: string;
    github: string;
    education: Array<{
      institution: string;
      degree?: string;
      fieldOfStudy?: string;
      completed: boolean;
      note?: string;
    }>;
    simultaneousModes: string[];
  };
  narrativeThroughLine: {
    theme: string;
    description: string;
    evidence: string[];
    propheticVision: string;
  };
  expertiseDomains: Array<{ domain: string; evidence: string; depth: string }>;
  differentiators: {
    coreCapability: string;
    rareCombination: string[];
    bridgesVerticals: string[];
  };
  professionalAffiliations: Array<{ organization: string; role: string; since?: string }>;
  geographicJourney: Array<{ location: string; period: string; context: string }>;
  contactAndDiscovery: Record<string, string>;
  careerTimeline: Array<Record<string, unknown>>;
  speakingTopics: string[];
  publishedWork: { topics: string[]; note: string; articles?: Array<Record<string, string>> };
  pressCoverage: Array<{ title: string; publication: string; date: string; url: string; note?: string }>;
}

interface JsonLdPerson {
  '@type': string;
  name: string;
  jobTitle: string;
  description: string;
  worksFor?: { name: string };
  homeLocation?: { name: string };
  alumniOf?: Array<{ name: string }>;
  knowsAbout?: Array<{ name: string } | string>;
  sameAs?: string[];
}

interface JsonLdProfile {
  '@context': string;
  '@type': string;
  name: string;
  mainEntity?: JsonLdPerson;
}

const corpus: Corpus = JSON.parse(
  readFileSync(resolve(__dirname, '../content/agent-corpus.json'), 'utf-8')
);

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function pass(name: string, details?: string) {
  results.push({ name, passed: true, details });
}

function fail(name: string, details: string) {
  results.push({ name, passed: false, details });
}

async function fetchText(path: string, userAgent?: string): Promise<{ status: number; headers: Headers; body: string }> {
  const headers: Record<string, string> = {};
  if (userAgent) headers['User-Agent'] = userAgent;
  const res = await fetch(`${BASE_URL}${path}`, { headers, redirect: 'follow' });
  const body = await res.text();
  return { status: res.status, headers: res.headers, body };
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

async function testAgentDossierServed() {
  const categories = [
    { name: 'Training Crawlers', agents: TRAINING_CRAWLERS },
    { name: 'Search Crawlers', agents: SEARCH_CRAWLERS },
    { name: 'User Retrieval Agents', agents: USER_RETRIEVAL_AGENTS },
  ];

  for (const category of categories) {
    for (const agent of category.agents) {
      const testName = `Dossier served to ${agent} (${category.name})`;
      try {
        const { status, headers, body } = await fetchText('/', agent);
        if (status !== 200) {
          fail(testName, `Expected status 200, got ${status}`);
          continue;
        }

        const contentSource = headers.get('x-content-source');
        if (contentSource !== 'agent-dossier') {
          fail(testName, `Expected X-Content-Source: agent-dossier, got: ${contentSource}`);
          continue;
        }

        if (!body.includes('Professional Dossier')) {
          fail(testName, 'Response body does not contain "Professional Dossier"');
          continue;
        }

        pass(testName);
      } catch (err: unknown) {
        fail(testName, `Request failed: ${getErrorMessage(err)}`);
      }
    }
  }
}

async function testDossierContentMatchesCorpus() {
  const testName = 'Dossier HTML content matches corpus';
  try {
    const { body } = await fetchText('/', 'GPTBot');

    const checks = [
      { field: 'identity.name', expected: corpus.identity.name },
      { field: 'identity.jobTitle', expected: corpus.identity.jobTitle },
      { field: 'identity.organization', expected: corpus.identity.organization },
      { field: 'identity.currentLocation', expected: corpus.identity.currentLocation },
      { field: 'canonicalBio', expected: corpus.canonicalBio },
      { field: 'lastUpdated', expected: corpus.lastUpdated },
      { field: 'canonicalUrl', expected: corpus.canonicalUrl },
      { field: 'narrativeThroughLine.theme', expected: corpus.narrativeThroughLine.theme },
    ];

    const missing: string[] = [];
    for (const check of checks) {
      if (!body.includes(check.expected)) {
        missing.push(`${check.field}: "${check.expected}"`);
      }
    }

    for (const domain of corpus.expertiseDomains) {
      if (!body.includes(domain.domain)) {
        missing.push(`expertiseDomain: "${domain.domain}"`);
      }
    }

    for (const edu of corpus.identity.education) {
      if (!body.includes(edu.institution)) {
        missing.push(`education.institution: "${edu.institution}"`);
      }
    }

    for (const affiliation of corpus.professionalAffiliations) {
      if (!body.includes(affiliation.organization)) {
        missing.push(`affiliation: "${affiliation.organization}"`);
      }
    }

    if (missing.length > 0) {
      fail(testName, `Missing from dossier HTML:\n    - ${missing.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testJsonLdMatchesCorpus() {
  const testName = 'JSON-LD matches corpus data';
  try {
    const { body } = await fetchText('/', 'GPTBot');

    const jsonLdMatch = body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!jsonLdMatch) {
      fail(testName, 'No JSON-LD script tag found in dossier HTML');
      return;
    }

    let jsonLd: JsonLdProfile;
    try {
      jsonLd = JSON.parse(jsonLdMatch[1]) as JsonLdProfile;
    } catch {
      fail(testName, 'JSON-LD is not valid JSON');
      return;
    }

    const issues: string[] = [];

    if (jsonLd['@type'] !== 'ProfilePage') {
      issues.push(`Expected @type "ProfilePage", got "${jsonLd['@type']}"`);
    }
    if (jsonLd['@context'] !== 'https://schema.org') {
      issues.push(`Expected @context "https://schema.org", got "${jsonLd['@context']}"`);
    }
    if (jsonLd.name !== corpus.identity.name) {
      issues.push(`name mismatch: expected "${corpus.identity.name}", got "${jsonLd.name}"`);
    }

    const person = jsonLd.mainEntity;
    if (!person) {
      fail(testName, 'JSON-LD missing mainEntity');
      return;
    }

    if (person['@type'] !== 'Person') {
      issues.push(`mainEntity @type: expected "Person", got "${person['@type']}"`);
    }
    if (person.name !== corpus.identity.name) {
      issues.push(`mainEntity.name mismatch: expected "${corpus.identity.name}", got "${person.name}"`);
    }
    if (person.jobTitle !== corpus.identity.jobTitle) {
      issues.push(`mainEntity.jobTitle mismatch: expected "${corpus.identity.jobTitle}", got "${person.jobTitle}"`);
    }
    if (person.description !== corpus.identity.description) {
      issues.push(`mainEntity.description mismatch`);
    }
    if (person.worksFor?.name !== corpus.identity.organization) {
      issues.push(`mainEntity.worksFor.name mismatch: expected "${corpus.identity.organization}", got "${person.worksFor?.name}"`);
    }
    if (person.homeLocation?.name !== corpus.identity.currentLocation) {
      issues.push(`mainEntity.homeLocation mismatch: expected "${corpus.identity.currentLocation}", got "${person.homeLocation?.name}"`);
    }

    const alumniNames = (person.alumniOf ?? []).map((a) => a.name);
    for (const edu of corpus.identity.education) {
      if (!alumniNames.includes(edu.institution)) {
        issues.push(`Missing alumniOf institution: "${edu.institution}"`);
      }
    }

    const knowsAboutNames = (person.knowsAbout ?? []).map((k) =>
      typeof k === 'string' ? k : k.name
    );
    for (const domain of corpus.expertiseDomains) {
      if (!knowsAboutNames.includes(domain.domain)) {
        issues.push(`Missing knowsAbout domain: "${domain.domain}"`);
      }
    }

    if (person.sameAs) {
      if (!person.sameAs.includes(corpus.identity.linkedin)) {
        issues.push(`sameAs missing LinkedIn: ${corpus.identity.linkedin}`);
      }
      if (!person.sameAs.includes(corpus.identity.github)) {
        issues.push(`sameAs missing GitHub: ${corpus.identity.github}`);
      }
    } else {
      issues.push('JSON-LD missing sameAs array');
    }

    if (issues.length > 0) {
      fail(testName, `JSON-LD issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testLlmsTxt() {
  const testName = '/llms.txt content matches corpus';
  try {
    const { status, body } = await fetchText('/llms.txt');
    if (status !== 200) {
      fail(testName, `Expected status 200, got ${status}`);
      return;
    }

    const issues: string[] = [];

    if (!body.startsWith('---')) {
      issues.push('Expected to start with YAML frontmatter delimiter "---"');
    }
    if (!body.includes(`# ${corpus.identity.name}`)) {
      issues.push(`Expected to contain heading "# ${corpus.identity.name}"`);
    }
    if (!body.includes(corpus.canonicalBio)) {
      issues.push('Missing canonicalBio');
    }
    if (!body.includes(corpus.identity.jobTitle)) {
      issues.push(`Missing jobTitle: ${corpus.identity.jobTitle}`);
    }
    if (!body.includes(corpus.identity.organization)) {
      issues.push(`Missing organization: ${corpus.identity.organization}`);
    }
    if (!body.includes(corpus.identity.currentLocation)) {
      issues.push(`Missing currentLocation: ${corpus.identity.currentLocation}`);
    }
    if (!body.includes(corpus.lastUpdated)) {
      issues.push(`Missing lastUpdated: ${corpus.lastUpdated}`);
    }

    for (const domain of corpus.expertiseDomains) {
      if (!body.includes(domain.domain)) {
        issues.push(`Missing expertise domain: "${domain.domain}"`);
      }
    }

    for (const edu of corpus.identity.education) {
      if (!body.includes(edu.institution)) {
        issues.push(`Missing education institution: "${edu.institution}"`);
      }
    }

    if (issues.length > 0) {
      fail(testName, `llms.txt issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testLlmsFullTxt() {
  const testName = '/llms-full.txt content matches corpus';
  try {
    const { status, body } = await fetchText('/llms-full.txt');
    if (status !== 200) {
      fail(testName, `Expected status 200, got ${status}`);
      return;
    }

    const issues: string[] = [];

    if (!body.includes(corpus.identity.name)) {
      issues.push('Missing identity.name');
    }
    if (!body.includes(corpus.canonicalBio)) {
      issues.push('Missing canonicalBio');
    }
    if (!body.includes(corpus.identity.jobTitle)) {
      issues.push('Missing jobTitle');
    }
    if (!body.includes(corpus.identity.organization)) {
      issues.push('Missing organization');
    }
    if (!body.includes(corpus.identity.description)) {
      issues.push('Missing identity.description');
    }
    if (!body.includes(corpus.narrativeThroughLine.theme)) {
      issues.push('Missing narrativeThroughLine.theme');
    }
    if (!body.includes(corpus.narrativeThroughLine.propheticVision)) {
      issues.push('Missing narrativeThroughLine.propheticVision');
    }
    if (!body.includes(corpus.differentiators.coreCapability)) {
      issues.push('Missing differentiators.coreCapability');
    }

    for (const domain of corpus.expertiseDomains) {
      if (!body.includes(domain.domain)) {
        issues.push(`Missing expertise domain: "${domain.domain}"`);
      }
    }

    for (const geo of corpus.geographicJourney) {
      if (!body.includes(geo.location)) {
        issues.push(`Missing geographic location: "${geo.location}"`);
      }
    }

    for (const affiliation of corpus.professionalAffiliations) {
      if (!body.includes(affiliation.organization)) {
        issues.push(`Missing affiliation: "${affiliation.organization}"`);
      }
    }

    if (issues.length > 0) {
      fail(testName, `llms-full.txt issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testRobotsTxt() {
  const testName = 'robots.txt explicitly allows all known AI agents';
  try {
    const { status, body } = await fetchText('/robots.txt');
    if (status !== 200) {
      fail(testName, `Expected status 200, got ${status}`);
      return;
    }

    const issues: string[] = [];

    for (const agent of ALL_AI_AGENTS) {
      const escapedAgent = agent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`User-agent:\\s*${escapedAgent}`, 'i');
      if (!pattern.test(body)) {
        issues.push(`Missing explicit User-agent directive for: ${agent}`);
      }
    }

    if (!body.includes('Sitemap:')) {
      issues.push('Missing Sitemap directive');
    }

    const lines = body.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Disallow: /') && trimmed !== 'Disallow:') {
        issues.push(`Found Disallow directive that may block agents: "${trimmed}"`);
      }
    }

    if (issues.length > 0) {
      fail(testName, `robots.txt issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

function parseXmlSitemap(xml: string): { valid: boolean; error?: string; urls: string[] } {
  const urls: string[] = [];
  const trimmed = xml.trimStart();

  if (!trimmed.startsWith('<?xml')) {
    return { valid: false, error: 'Missing XML declaration', urls };
  }

  const urlsetOpen = xml.match(/<urlset[^>]*>/);
  if (!urlsetOpen) {
    return { valid: false, error: 'Missing <urlset> element', urls };
  }
  if (!xml.includes('</urlset>')) {
    return { valid: false, error: 'Missing closing </urlset> tag', urls };
  }

  const urlsetContent = xml.slice(
    xml.indexOf(urlsetOpen[0]) + urlsetOpen[0].length,
    xml.indexOf('</urlset>')
  );

  const urlBlocks = urlsetContent.match(/<url>[\s\S]*?<\/url>/g);
  if (!urlBlocks || urlBlocks.length === 0) {
    return { valid: false, error: 'No <url> entries found', urls };
  }

  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/);
    if (!locMatch) {
      return { valid: false, error: `<url> block missing <loc>: ${block.slice(0, 80)}`, urls };
    }
    urls.push(locMatch[1].trim());

    if (!block.includes('<lastmod>') || !block.includes('</lastmod>')) {
      return { valid: false, error: `<url> block missing <lastmod> for ${locMatch[1]}`, urls };
    }
  }

  const requiredClosingTags = ['</url>', '</loc>', '</lastmod>', '</urlset>'];
  for (const tag of requiredClosingTags) {
    if (!xml.includes(tag)) {
      return { valid: false, error: `Missing required closing tag: ${tag}`, urls };
    }
  }

  const urlOpenCount = (xml.match(/<url>/g) ?? []).length;
  const urlCloseCount = (xml.match(/<\/url>/g) ?? []).length;
  if (urlOpenCount !== urlCloseCount) {
    return { valid: false, error: `<url> tag mismatch: ${urlOpenCount} open vs ${urlCloseCount} close`, urls };
  }

  const locOpenCount = (xml.match(/<loc>/g) ?? []).length;
  const locCloseCount = (xml.match(/<\/loc>/g) ?? []).length;
  if (locOpenCount !== locCloseCount) {
    return { valid: false, error: `<loc> tag mismatch: ${locOpenCount} open vs ${locCloseCount} close`, urls };
  }

  return { valid: true, urls };
}

async function testSitemapXml() {
  const testName = 'sitemap.xml is valid and contains expected URLs';
  try {
    const { status, headers, body } = await fetchText('/sitemap.xml');
    if (status !== 200) {
      fail(testName, `Expected status 200, got ${status}`);
      return;
    }

    const issues: string[] = [];

    const contentType = headers.get('content-type') ?? '';
    if (!contentType.includes('xml')) {
      issues.push(`Expected XML content type, got: ${contentType}`);
    }

    const parsed = parseXmlSitemap(body);
    if (!parsed.valid) {
      fail(testName, `XML parsing failed: ${parsed.error}`);
      return;
    }

    const baseUrl = corpus.canonicalUrl;
    const expectedPaths = ['/', '/llms.txt', '/llms-full.txt'];
    for (const path of expectedPaths) {
      const expectedUrl = `${baseUrl}${path}`;
      if (!parsed.urls.includes(expectedUrl)) {
        issues.push(`Missing expected URL: ${expectedUrl}`);
      }
    }

    if (issues.length > 0) {
      fail(testName, `sitemap.xml issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName, `${parsed.urls.length} URLs found`);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testBrowserDoesNotGetDossier() {
  const testName = 'Browser User-Agent does NOT receive dossier';
  try {
    const { status, headers, body } = await fetchText('/', BROWSER_UA);
    if (status !== 200) {
      fail(testName, `Expected status 200, got ${status}`);
      return;
    }

    const contentSource = headers.get('x-content-source');
    if (contentSource === 'agent-dossier') {
      fail(testName, 'Browser received X-Content-Source: agent-dossier — agent detection is broken');
      return;
    }

    if (body.includes('Professional Dossier') && body.includes('application/ld+json')) {
      fail(testName, 'Browser received dossier content — agent detection middleware is not filtering correctly');
      return;
    }

    pass(testName);
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testDossierPreviewEndpoint() {
  const testName = '/api/dossier-preview returns dossier content';
  try {
    const { status, headers, body } = await fetchText('/api/dossier-preview');
    if (status !== 200) {
      fail(testName, `Expected status 200, got ${status}`);
      return;
    }

    const issues: string[] = [];

    const contentType = headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
      issues.push(`Expected text/html content type, got: ${contentType}`);
    }

    if (!body.includes(corpus.identity.name)) {
      issues.push(`Missing identity.name: ${corpus.identity.name}`);
    }
    if (!body.includes(corpus.identity.jobTitle)) {
      issues.push(`Missing jobTitle: ${corpus.identity.jobTitle}`);
    }
    if (!body.includes('application/ld+json')) {
      issues.push('Missing JSON-LD script tag');
    }

    if (issues.length > 0) {
      fail(testName, `Dossier preview issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testContentTypes() {
  const testName = 'Endpoints return correct Content-Type headers';
  const endpoints = [
    { path: '/', expectedType: 'text/html', ua: 'GPTBot' },
    { path: '/llms.txt', expectedType: 'text/plain', ua: undefined },
    { path: '/llms-full.txt', expectedType: 'text/plain', ua: undefined },
    { path: '/sitemap.xml', expectedType: 'application/xml', ua: undefined },
  ];

  const issues: string[] = [];
  for (const ep of endpoints) {
    try {
      const { headers } = await fetchText(ep.path, ep.ua);
      const ct = headers.get('content-type') ?? '';
      if (!ct.includes(ep.expectedType)) {
        issues.push(`${ep.path}: expected ${ep.expectedType}, got ${ct}`);
      }
    } catch (err: unknown) {
      issues.push(`${ep.path}: request failed — ${getErrorMessage(err)}`);
    }
  }

  if (issues.length > 0) {
    fail(testName, `Content-Type issues:\n    - ${issues.join('\n    - ')}`);
  } else {
    pass(testName);
  }
}

async function testNoUserAgentDoesNotGetDossier() {
  const testName = 'Request with no User-Agent does NOT receive dossier';
  try {
    const { headers } = await fetchText('/');
    const contentSource = headers.get('x-content-source');
    if (contentSource === 'agent-dossier') {
      fail(testName, 'Empty User-Agent received dossier — agent detection should not match');
      return;
    }
    pass(testName);
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testHttpLinkHeaders() {
  const testName = 'Root response includes Link headers for LLM content';
  try {
    const { headers } = await fetchText('/', BROWSER_UA);
    const linkHeader = headers.get('link') ?? '';

    const issues: string[] = [];

    if (!linkHeader.includes('/llms.txt')) {
      issues.push('Missing Link header entry for /llms.txt');
    }
    if (!linkHeader.includes('/llms-full.txt')) {
      issues.push('Missing Link header entry for /llms-full.txt');
    }
    if (!linkHeader.includes('rel="alternate"')) {
      issues.push('Link header missing rel="alternate"');
    }
    if (!linkHeader.includes('type="text/plain"')) {
      issues.push('Link header missing type="text/plain"');
    }

    if (issues.length > 0) {
      fail(testName, `Link header issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testHtmlLinkAlternateTags() {
  const testName = 'SPA HTML contains <link rel="alternate"> tags for LLM content';
  try {
    const { body } = await fetchText('/', BROWSER_UA);

    const issues: string[] = [];

    const llmsTxtPattern = /<link[^>]+rel="alternate"[^>]+href="\/llms\.txt"[^>]*>/;
    const llmsFullTxtPattern = /<link[^>]+rel="alternate"[^>]+href="\/llms-full\.txt"[^>]*>/;

    if (!llmsTxtPattern.test(body)) {
      issues.push('Missing <link rel="alternate" href="/llms.txt"> tag');
    }
    if (!llmsFullTxtPattern.test(body)) {
      issues.push('Missing <link rel="alternate" href="/llms-full.txt"> tag');
    }

    if (issues.length > 0) {
      fail(testName, `HTML link tag issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testJsonLdSubjectOf() {
  const testName = 'SPA JSON-LD contains subjectOf pointing to llms.txt';
  try {
    const { body } = await fetchText('/', BROWSER_UA);

    const jsonLdMatch = body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!jsonLdMatch) {
      fail(testName, 'No JSON-LD script tag found in SPA HTML');
      return;
    }

    let jsonLd: Record<string, unknown>;
    try {
      jsonLd = JSON.parse(jsonLdMatch[1]) as Record<string, unknown>;
    } catch {
      fail(testName, 'JSON-LD is not valid JSON');
      return;
    }

    const issues: string[] = [];

    const subjectOf = jsonLd.subjectOf as Record<string, unknown> | undefined;
    if (!subjectOf) {
      fail(testName, 'JSON-LD missing subjectOf property');
      return;
    }

    if (subjectOf['@type'] !== 'TextDigitalDocument') {
      issues.push(`Expected subjectOf.@type "TextDigitalDocument", got "${subjectOf['@type']}"`);
    }
    if (typeof subjectOf.url !== 'string' || !subjectOf.url.includes('/llms.txt')) {
      issues.push(`Expected subjectOf.url to contain "/llms.txt", got "${subjectOf.url}"`);
    }
    if (subjectOf.encodingFormat !== 'text/plain') {
      issues.push(`Expected subjectOf.encodingFormat "text/plain", got "${subjectOf.encodingFormat}"`);
    }

    if (issues.length > 0) {
      fail(testName, `subjectOf issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

interface AiPluginManifest {
  schema_version: string;
  name: string;
  description: string;
  llms_txt: string;
  llms_full_txt: string;
}

async function testWellKnownAiPlugin() {
  const testName = '.well-known/ai-plugin.json is valid';
  try {
    const { status, headers, body } = await fetchText('/.well-known/ai-plugin.json');
    if (status !== 200) {
      fail(testName, `Expected status 200, got ${status}`);
      return;
    }

    const contentType = headers.get('content-type') ?? '';
    if (!contentType.includes('json')) {
      fail(testName, `Expected JSON content type, got: ${contentType}`);
      return;
    }

    let manifest: AiPluginManifest;
    try {
      manifest = JSON.parse(body) as AiPluginManifest;
    } catch {
      fail(testName, 'Response is not valid JSON');
      return;
    }

    const issues: string[] = [];

    if (!manifest.schema_version) {
      issues.push('Missing schema_version');
    }
    if (!manifest.name) {
      issues.push('Missing name');
    }
    if (!manifest.description) {
      issues.push('Missing description');
    }
    if (!manifest.llms_txt || !manifest.llms_txt.includes('/llms.txt')) {
      issues.push(`llms_txt should point to /llms.txt, got: "${manifest.llms_txt}"`);
    }
    if (!manifest.llms_full_txt || !manifest.llms_full_txt.includes('/llms-full.txt')) {
      issues.push(`llms_full_txt should point to /llms-full.txt, got: "${manifest.llms_full_txt}"`);
    }

    if (issues.length > 0) {
      fail(testName, `ai-plugin.json issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

async function testLlmsTxtFrontmatter() {
  const testName = 'llms.txt contains YAML frontmatter with full URL and updated date';
  try {
    const { body } = await fetchText('/llms.txt');

    const issues: string[] = [];

    if (!body.startsWith('---')) {
      issues.push('Does not start with YAML frontmatter delimiter "---"');
    }

    const frontmatterMatch = body.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      fail(testName, 'No valid YAML frontmatter block found (expected --- ... ---)');
      return;
    }

    const frontmatter = frontmatterMatch[1];

    const fullMatch = frontmatter.match(/^full:\s*(.+)$/m);
    if (!fullMatch) {
      issues.push('Missing "full:" field in frontmatter');
    } else if (!fullMatch[1].includes('/llms-full.txt')) {
      issues.push(`"full:" should point to /llms-full.txt, got: "${fullMatch[1]}"`);
    }

    const updatedMatch = frontmatter.match(/^updated:\s*(.+)$/m);
    if (!updatedMatch) {
      issues.push('Missing "updated:" field in frontmatter');
    } else if (updatedMatch[1].trim() !== corpus.lastUpdated) {
      issues.push(`"updated:" should be "${corpus.lastUpdated}", got: "${updatedMatch[1].trim()}"`);
    }

    if (issues.length > 0) {
      fail(testName, `Frontmatter issues:\n    - ${issues.join('\n    - ')}`);
    } else {
      pass(testName);
    }
  } catch (err: unknown) {
    fail(testName, `Request failed: ${getErrorMessage(err)}`);
  }
}

function printReport() {
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log('\n' + '='.repeat(70));
  console.log('  AGENT DATA VALIDATION REPORT');
  console.log('='.repeat(70));
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Corpus last updated: ${corpus.lastUpdated}`);
  console.log(`  Run at: ${new Date().toISOString()}`);
  console.log('='.repeat(70) + '\n');

  if (failed > 0) {
    console.log(`  FAILURES (${failed}):\n`);
    for (const r of results.filter(r => !r.passed)) {
      console.log(`  \u2717 ${r.name}`);
      if (r.details) {
        console.log(`    ${r.details}`);
      }
      console.log('');
    }
    console.log('-'.repeat(70) + '\n');
  }

  const passesWithDetails = results.filter(r => r.passed && r.details);
  const passesClean = results.filter(r => r.passed && !r.details);

  console.log(`  PASSES (${passed}):\n`);
  for (const r of passesClean) {
    console.log(`  \u2713 ${r.name}`);
  }
  if (passesWithDetails.length > 0) {
    console.log('');
    for (const r of passesWithDetails) {
      console.log(`  \u2713 ${r.name}`);
      if (r.details) {
        console.log(`    ${r.details}`);
      }
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`  SUMMARY: ${passed}/${total} passed, ${failed}/${total} failed`);
  if (failed === 0) {
    console.log('  STATUS: ALL CHECKS PASSED');
  } else {
    console.log('  STATUS: SOME CHECKS FAILED');
  }
  console.log('='.repeat(70) + '\n');
}

async function main() {
  console.log(`\nValidating agent-facing endpoints at ${BASE_URL}...\n`);

  await testAgentDossierServed();
  await testDossierContentMatchesCorpus();
  await testJsonLdMatchesCorpus();
  await testLlmsTxt();
  await testLlmsFullTxt();
  await testLlmsTxtFrontmatter();
  await testRobotsTxt();
  await testSitemapXml();
  await testDossierPreviewEndpoint();
  await testContentTypes();
  await testHttpLinkHeaders();
  await testHtmlLinkAlternateTags();
  await testJsonLdSubjectOf();
  await testWellKnownAiPlugin();
  await testBrowserDoesNotGetDossier();
  await testNoUserAgentDoesNotGetDossier();

  printReport();

  const failed = results.filter(r => !r.passed).length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err: unknown) => {
  console.error('Validation script crashed:', err);
  process.exit(2);
});
