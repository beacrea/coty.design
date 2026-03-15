import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { Request, Response, NextFunction } from 'express';
import { isAIAgent, identifyAgent, classifyCrawlerRole } from './agent-detection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../../data/agent-analytics.db');

let db: Database.Database;

export function initAnalyticsDb() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS agent_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      user_agent TEXT NOT NULL,
      agent_name TEXT,
      crawler_role TEXT,
      request_path TEXT NOT NULL,
      referrer TEXT,
      response_type TEXT,
      ip_address TEXT
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_agent_visits_timestamp ON agent_visits(timestamp);
    CREATE INDEX IF NOT EXISTS idx_agent_visits_agent_name ON agent_visits(agent_name);
    CREATE INDEX IF NOT EXISTS idx_agent_visits_crawler_role ON agent_visits(crawler_role);
  `);
}

export function logAgentVisit(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';

  if (isAIAgent(userAgent)) {
    const agentName = identifyAgent(userAgent);
    const crawlerRole = classifyCrawlerRole(userAgent);

    try {
      const stmt = db.prepare(`
        INSERT INTO agent_visits (user_agent, agent_name, crawler_role, request_path, referrer, response_type, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        userAgent,
        agentName,
        crawlerRole,
        req.path,
        req.headers['referer'] || null,
        req.path === '/' ? 'dossier' : 'standard',
        req.ip || req.headers['x-forwarded-for'] || null
      );
    } catch (err) {
      console.error('Failed to log agent visit:', err);
    }
  }

  next();
}

export function getDb(): Database.Database {
  return db;
}
