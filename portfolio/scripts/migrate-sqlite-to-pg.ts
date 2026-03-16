import Database from 'better-sqlite3';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SqliteAgentVisit {
  id: number;
  timestamp: string;
  user_agent: string;
  agent_name: string | null;
  crawler_role: string | null;
  request_path: string;
  referrer: string | null;
  response_type: string | null;
  ip_address: string | null;
}

const DB_PATH = path.resolve(__dirname, '../data/agent-analytics.db');

async function migrate() {
  if (!fs.existsSync(DB_PATH)) {
    console.log('No SQLite database found at', DB_PATH, '— nothing to migrate.');
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Cannot migrate.');
    process.exit(1);
  }

  const sqlite = new Database(DB_PATH, { readonly: true });
  const { Pool } = pg;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
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

    const rows = sqlite.prepare('SELECT * FROM agent_visits').all() as SqliteAgentVisit[];
    console.log(`Found ${rows.length} rows in SQLite database.`);

    if (rows.length === 0) {
      console.log('No rows to migrate.');
      return;
    }

    let migrated = 0;
    for (const row of rows) {
      await pool.query(
        `INSERT INTO agent_visits (timestamp, user_agent, agent_name, crawler_role, request_path, referrer, response_type, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          row.timestamp ? new Date(row.timestamp + 'Z') : new Date(),
          row.user_agent,
          row.agent_name,
          row.crawler_role,
          row.request_path,
          row.referrer,
          row.response_type,
          row.ip_address,
        ]
      );
      migrated++;
    }

    console.log(`Successfully migrated ${migrated} rows to PostgreSQL.`);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    sqlite.close();
    await pool.end();
  }
}

migrate();
