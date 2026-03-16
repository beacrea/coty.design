import pg from 'pg';
import type { Request, Response, NextFunction } from 'express';
import { isAIAgent, identifyAgent, classifyCrawlerRole } from './agent-detection.js';

const { Pool } = pg;

let pool: InstanceType<typeof Pool> | null = null;

export async function initAnalyticsDb() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not set — analytics disabled');
      return;
    }

    pool = new Pool({ connectionString: process.env.DATABASE_URL });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS agent_visits (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        user_agent TEXT NOT NULL,
        agent_name TEXT,
        crawler_role TEXT,
        request_path TEXT NOT NULL,
        referrer TEXT,
        response_type TEXT,
        ip_address TEXT
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_agent_visits_timestamp ON agent_visits(timestamp)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_agent_visits_agent_name ON agent_visits(agent_name)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_agent_visits_crawler_role ON agent_visits(crawler_role)`);
  } catch (err) {
    console.error('Analytics DB init failed (non-fatal):', err);
  }
}

export function logAgentVisit(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';

  if (pool && isAIAgent(userAgent)) {
    const agentName = identifyAgent(userAgent);
    const crawlerRole = classifyCrawlerRole(userAgent);

    pool.query(
      `INSERT INTO agent_visits (user_agent, agent_name, crawler_role, request_path, referrer, response_type, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userAgent,
        agentName,
        crawlerRole,
        req.path,
        req.headers['referer'] || null,
        req.path === '/' ? 'dossier' : 'standard',
        req.ip || req.headers['x-forwarded-for'] || null,
      ]
    ).catch(err => {
      console.error('Failed to log agent visit:', err);
    });
  }

  next();
}

export function getPool(): pg.Pool | null {
  return pool;
}
