-- Agent analytics for the Cloudflare Worker (D1 / SQLite).
-- Mirrors the Postgres table the Node server creates. Timestamps are ISO-8601
-- UTC text ('2026-11-05T15:24:27.000Z') so string comparison is chronological.
CREATE TABLE IF NOT EXISTS agent_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  user_agent TEXT NOT NULL,
  agent_name TEXT,
  crawler_role TEXT,
  request_path TEXT NOT NULL,
  referrer TEXT,
  response_type TEXT,
  ip_address TEXT
);
CREATE INDEX IF NOT EXISTS idx_agent_visits_timestamp ON agent_visits(timestamp);
CREATE INDEX IF NOT EXISTS idx_agent_visits_agent_name ON agent_visits(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_visits_crawler_role ON agent_visits(crawler_role);
