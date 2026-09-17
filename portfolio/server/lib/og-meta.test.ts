import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  HOME_META,
  injectDoctrinePage,
  injectMetaTags,
  resolvePageMeta,
} from './og-meta.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productionHtml = fs.readFileSync(
  path.resolve(__dirname, '../../dist/index.html'),
  'utf8',
);

function renderProductionResponse(urlPath: string) {
  const meta = resolvePageMeta(urlPath);
  if (!meta) {
    return {
      status: 404,
      headers: { 'x-robots-tag': 'noindex, nofollow' },
      body: injectMetaTags(productionHtml, HOME_META),
    };
  }
  return {
    status: 200,
    headers: {},
    body: injectDoctrinePage(injectMetaTags(productionHtml, meta), urlPath),
  };
}

test('production doctrine landing response includes static content and CollectionPage schema', () => {
  const response = renderProductionResponse('/doctrine');

  assert.equal(response.status, 200);
  assert.match(response.body, /<h1>Doctrine<\/h1>/);
  assert.match(response.body, /Technology roles are shifting/);
  assert.match(response.body, /href="\/doctrine\/execution-constraint"/);
  assert.match(response.body, /"@type":"CollectionPage"/);
  assert.doesNotMatch(response.body, /"jobTitle": "Technologist/);
});

test('production claim response includes static supporting content and claim schema', () => {
  const response = renderProductionResponse('/doctrine/execution-constraint');

  assert.equal(response.status, 200);
  assert.match(response.body, /<h1>Execution is no longer the dominant constraint<\/h1>/);
  assert.match(response.body, /<h2>Rationale<\/h2>/);
  assert.match(response.body, /<h2>Evidence<\/h2>/);
  assert.match(response.body, /"@type":"WebPage"/);
  assert.match(response.body, /"@type":"CreativeWork"/);
  assert.match(response.body, /https:\/\/coty\.design\/doctrine\/execution-constraint/);
});

test('invalid doctrine claim remains a noindex 404 response', () => {
  const response = renderProductionResponse('/doctrine/not-a-real-claim');

  assert.equal(response.status, 404);
  assert.equal(response.headers['x-robots-tag'], 'noindex, nofollow');
  assert.doesNotMatch(response.body, /<h1>Doctrine<\/h1>/);
  assert.doesNotMatch(response.body, /"@type":"CollectionPage"/);
});