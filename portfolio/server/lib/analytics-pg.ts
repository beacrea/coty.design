import pg from 'pg';
import { castCounts, type AnalyticsStore } from './analytics-store.js';

/** Postgres store used by the Node server (Replit). Not bundled into the Worker. */
export async function createPgStore(connectionString: string): Promise<AnalyticsStore> {
  const pool = new pg.Pool({ connectionString });

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

  return {
    async logVisit(v) {
      await pool.query(
        `INSERT INTO agent_visits (user_agent, agent_name, crawler_role, request_path, referrer, response_type, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [v.userAgent, v.agentName, v.crawlerRole, v.requestPath, v.referrer, v.responseType, v.ipAddress],
      );
    },

    async getInsights() {
      const [totalVisits, last24h, last7d, byAgent, byRole, topPaths, referrers, recentVisits, dailyTrend] = await Promise.all([
        pool.query('SELECT COUNT(*) as count FROM agent_visits'),
        pool.query("SELECT COUNT(*) as count FROM agent_visits WHERE timestamp > NOW() - INTERVAL '1 day'"),
        pool.query("SELECT COUNT(*) as count FROM agent_visits WHERE timestamp > NOW() - INTERVAL '7 days'"),
        pool.query(`SELECT agent_name, COUNT(*) as count FROM agent_visits GROUP BY agent_name ORDER BY count DESC`),
        pool.query(`SELECT crawler_role, COUNT(*) as count FROM agent_visits GROUP BY crawler_role ORDER BY count DESC`),
        pool.query(`SELECT request_path, COUNT(*) as count FROM agent_visits GROUP BY request_path ORDER BY count DESC LIMIT 10`),
        pool.query(`
          SELECT referrer, COUNT(*) as count
          FROM agent_visits
          WHERE referrer IS NOT NULL AND referrer != ''
          GROUP BY referrer
          ORDER BY count DESC
          LIMIT 10
        `),
        pool.query(`
          SELECT timestamp, agent_name, crawler_role, request_path, referrer
          FROM agent_visits
          ORDER BY timestamp DESC
          LIMIT 50
        `),
        pool.query(`
          SELECT DATE(timestamp) as day, COUNT(*) as count
          FROM agent_visits
          WHERE timestamp > NOW() - INTERVAL '30 days'
          GROUP BY DATE(timestamp)
          ORDER BY day
        `),
      ]);

      return {
        summary: {
          total: Number(totalVisits.rows[0].count),
          last24h: Number(last24h.rows[0].count),
          last7d: Number(last7d.rows[0].count),
        },
        byAgent: castCounts(byAgent.rows),
        byRole: castCounts(byRole.rows),
        topPaths: castCounts(topPaths.rows),
        referrers: castCounts(referrers.rows),
        recentVisits: recentVisits.rows,
        dailyTrend: castCounts(dailyTrend.rows),
      };
    },
  };
}
