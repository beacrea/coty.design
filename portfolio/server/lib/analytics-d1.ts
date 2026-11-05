import { castCounts, type AnalyticsStore } from './analytics-store.js';

/**
 * Structural subset of the D1 binding, so this file type-checks without
 * pulling Workers types into the Node build.
 */
interface D1Like {
  prepare(sql: string): {
    bind(...values: unknown[]): { run(): Promise<unknown> };
    all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
    first<T = Record<string, unknown>>(): Promise<T | null>;
  };
}

// Timestamps are stored as ISO-8601 UTC strings (see migrations/0001), so
// lexical comparison against the same format is chronological.
const ISO_NOW = "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')";
const isoAgo = (modifier: string) => `strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '${modifier}')`;

/** D1 (SQLite) store used by the Cloudflare Worker. Schema lives in migrations/. */
export function createD1Store(db: D1Like): AnalyticsStore {
  const count = async (sql: string) =>
    Number((await db.prepare(sql).first<{ count: number }>())?.count ?? 0);
  const rows = async (sql: string) => (await db.prepare(sql).all()).results;

  return {
    async logVisit(v) {
      await db
        .prepare(
          `INSERT INTO agent_visits (timestamp, user_agent, agent_name, crawler_role, request_path, referrer, response_type, ip_address)
           VALUES (${ISO_NOW}, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(v.userAgent, v.agentName, v.crawlerRole, v.requestPath, v.referrer, v.responseType, v.ipAddress)
        .run();
    },

    async getInsights() {
      const [total, last24h, last7d, byAgent, byRole, topPaths, referrers, recentVisits, dailyTrend] = await Promise.all([
        count('SELECT COUNT(*) as count FROM agent_visits'),
        count(`SELECT COUNT(*) as count FROM agent_visits WHERE timestamp > ${isoAgo('-1 day')}`),
        count(`SELECT COUNT(*) as count FROM agent_visits WHERE timestamp > ${isoAgo('-7 days')}`),
        rows(`SELECT agent_name, COUNT(*) as count FROM agent_visits GROUP BY agent_name ORDER BY count DESC`),
        rows(`SELECT crawler_role, COUNT(*) as count FROM agent_visits GROUP BY crawler_role ORDER BY count DESC`),
        rows(`SELECT request_path, COUNT(*) as count FROM agent_visits GROUP BY request_path ORDER BY count DESC LIMIT 10`),
        rows(`
          SELECT referrer, COUNT(*) as count
          FROM agent_visits
          WHERE referrer IS NOT NULL AND referrer != ''
          GROUP BY referrer
          ORDER BY count DESC
          LIMIT 10
        `),
        rows(`
          SELECT timestamp, agent_name, crawler_role, request_path, referrer
          FROM agent_visits
          ORDER BY timestamp DESC
          LIMIT 50
        `),
        rows(`
          SELECT DATE(timestamp) as day, COUNT(*) as count
          FROM agent_visits
          WHERE timestamp > ${isoAgo('-30 days')}
          GROUP BY DATE(timestamp)
          ORDER BY day
        `),
      ]);

      return {
        summary: { total, last24h, last7d },
        byAgent: castCounts(byAgent),
        byRole: castCounts(byRole),
        topPaths: castCounts(topPaths),
        referrers: castCounts(referrers),
        recentVisits,
        dailyTrend: castCounts(dailyTrend),
      };
    },
  };
}
