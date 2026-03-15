import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORPUS_PATH = path.resolve(__dirname, '../../content/agent-corpus.json');

let cachedCorpus: any = null;
let cachedMtime: number = 0;

export function loadCorpus(): any {
  const stat = fs.statSync(CORPUS_PATH);
  if (cachedCorpus && stat.mtimeMs === cachedMtime) {
    return cachedCorpus;
  }
  const raw = fs.readFileSync(CORPUS_PATH, 'utf-8');
  cachedCorpus = JSON.parse(raw);
  cachedMtime = stat.mtimeMs;
  return cachedCorpus;
}

export function getCorpusPath(): string {
  return CORPUS_PATH;
}
