import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let bundledCorpus: any = null;
let cachedCorpus: any = null;
let cachedMtime: number = 0;

/**
 * Workers have no filesystem: the Worker entry imports the corpus at build
 * time and hands it over here. Node keeps reading from disk (with mtime-based
 * reload) so editing the corpus in dev needs no restart.
 */
export function setBundledCorpus(corpus: unknown): void {
  bundledCorpus = corpus;
}

export function getCorpusPath(): string {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(dir, '../../content/agent-corpus.json');
}

export function loadCorpus(): any {
  if (bundledCorpus) return bundledCorpus;
  const corpusPath = getCorpusPath();
  const stat = fs.statSync(corpusPath);
  if (cachedCorpus && stat.mtimeMs === cachedMtime) {
    return cachedCorpus;
  }
  const raw = fs.readFileSync(corpusPath, 'utf-8');
  cachedCorpus = JSON.parse(raw);
  cachedMtime = stat.mtimeMs;
  return cachedCorpus;
}
