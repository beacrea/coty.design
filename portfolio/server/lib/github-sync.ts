import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { invalidateDoctrineCache } from './og-meta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_OWNER = 'nrfta';
const REPO_NAME = 'product-docs';
const FILE_PATH = 'foundations/ontological-orchestration/doctrine.jsonld';
const LOCAL_PATH = path.resolve(__dirname, '../../public/doctrine.jsonld');

export interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export async function fetchAndWriteDoctrine(): Promise<SyncResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      success: false,
      message: 'GITHUB_TOKEN is not configured',
      timestamp: new Date().toISOString(),
    };
  }

  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.raw+json',
      'User-Agent': 'portfolio-doctrine-sync',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      success: false,
      message: `GitHub API returned ${response.status}: ${body}`,
      timestamp: new Date().toISOString(),
    };
  }

  const content = await response.text();

  JSON.parse(content);

  fs.writeFileSync(LOCAL_PATH, content, 'utf-8');
  invalidateDoctrineCache();

  return {
    success: true,
    message: `doctrine.jsonld synced successfully (${content.length} bytes)`,
    timestamp: new Date().toISOString(),
  };
}

export const DOCTRINE_FILE_PATH = FILE_PATH;
