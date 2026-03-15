import type { Request, Response } from 'express';
import { getDb } from '../middleware/analytics.js';

export function agentInsightsData(_req: Request, res: Response) {
  const db = getDb();

  const totalVisits = db.prepare('SELECT COUNT(*) as count FROM agent_visits').get() as any;
  const last24h = db.prepare("SELECT COUNT(*) as count FROM agent_visits WHERE timestamp > datetime('now', '-1 day')").get() as any;
  const last7d = db.prepare("SELECT COUNT(*) as count FROM agent_visits WHERE timestamp > datetime('now', '-7 days')").get() as any;

  const byAgent = db.prepare(`
    SELECT agent_name, COUNT(*) as count
    FROM agent_visits
    GROUP BY agent_name
    ORDER BY count DESC
  `).all();

  const byRole = db.prepare(`
    SELECT crawler_role, COUNT(*) as count
    FROM agent_visits
    GROUP BY crawler_role
    ORDER BY count DESC
  `).all();

  const topPaths = db.prepare(`
    SELECT request_path, COUNT(*) as count
    FROM agent_visits
    GROUP BY request_path
    ORDER BY count DESC
    LIMIT 10
  `).all();

  const referrers = db.prepare(`
    SELECT referrer, COUNT(*) as count
    FROM agent_visits
    WHERE referrer IS NOT NULL AND referrer != ''
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT 10
  `).all();

  const recentVisits = db.prepare(`
    SELECT timestamp, agent_name, crawler_role, request_path, referrer
    FROM agent_visits
    ORDER BY timestamp DESC
    LIMIT 50
  `).all();

  const dailyTrend = db.prepare(`
    SELECT date(timestamp) as day, COUNT(*) as count
    FROM agent_visits
    WHERE timestamp > datetime('now', '-30 days')
    GROUP BY date(timestamp)
    ORDER BY day
  `).all();

  res.json({
    summary: { total: totalVisits.count, last24h: last24h.count, last7d: last7d.count },
    byAgent,
    byRole,
    topPaths,
    referrers,
    recentVisits,
    dailyTrend
  });
}

export function agentInsights(_req: Request, res: Response) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Insights — AI Visitor Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #0f0f0f; color: #e0e0e0; line-height: 1.6; }
    .banner { background: #1a1a2e; border-bottom: 2px solid #6366f1; padding: 16px 24px; text-align: center; }
    .banner h1 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #6366f1; margin-bottom: 4px; }
    .banner p { font-size: 13px; color: #888; }
    .content { max-width: 1000px; margin: 0 auto; padding: 32px 24px; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .summary-card { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; text-align: center; }
    .summary-card .num { font-size: 36px; font-weight: bold; color: #6366f1; }
    .summary-card .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; margin-bottom: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; }
    .bar-chart .bar-item { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .bar-chart .bar-label { flex: 0 0 140px; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-chart .bar-track { flex: 1; height: 24px; background: #222; border-radius: 4px; overflow: hidden; }
    .bar-chart .bar-fill { height: 100%; background: #6366f1; border-radius: 4px; transition: width 0.3s; display: flex; align-items: center; padding: 0 8px; font-size: 11px; color: white; min-width: 30px; }
    .bar-fill.training { background: #ef4444; }
    .bar-fill.search { background: #f59e0b; }
    .bar-fill.user-retrieval { background: #22c55e; }
    .role-legend { display: flex; gap: 16px; margin-bottom: 12px; font-size: 12px; }
    .role-legend span { display: flex; align-items: center; gap: 4px; }
    .role-legend .dot { width: 10px; height: 10px; border-radius: 50%; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 8px 12px; border-bottom: 1px solid #333; color: #888; font-weight: normal; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
    td { padding: 8px 12px; border-bottom: 1px solid #1a1a1a; }
    .role-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
    .role-badge.training { background: #ef444433; color: #ef4444; }
    .role-badge.search { background: #f59e0b33; color: #f59e0b; }
    .role-badge.user-retrieval { background: #22c55e33; color: #22c55e; }
    .empty { color: #555; text-align: center; padding: 40px; }
    .refresh { margin-top: 16px; text-align: center; }
    .refresh button { background: #6366f1; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .refresh button:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="banner">
    <h1>Agent Insights</h1>
    <p>AI agent visitor analytics for coty.design</p>
  </div>

  <div class="content" id="dashboard">
    <div class="empty">Loading analytics data...</div>
  </div>

  <script>
    function esc(str) {
      const d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    }

    function safeHostname(url) {
      try { return new URL(url).hostname; } catch { return esc(url); }
    }

    const validRoles = ['training', 'search', 'user-retrieval'];
    function safeRoleClass(role) { return validRoles.includes(role) ? role : ''; }

    async function loadData() {
      try {
        const resp = await fetch('/api/agent-insights');
        const data = await resp.json();
        render(data);
      } catch (err) {
        document.getElementById('dashboard').innerHTML = '<div class="empty">Failed to load analytics data.</div>';
      }
    }

    function render(data) {
      const el = document.getElementById('dashboard');
      const maxAgent = Math.max(...data.byAgent.map(a => a.count), 1);
      const maxRole = Math.max(...data.byRole.map(r => r.count), 1);

      el.innerHTML = \`
        <div class="summary">
          <div class="summary-card"><div class="num">\${parseInt(data.summary.total) || 0}</div><div class="label">Total Agent Visits</div></div>
          <div class="summary-card"><div class="num">\${parseInt(data.summary.last24h) || 0}</div><div class="label">Last 24 Hours</div></div>
          <div class="summary-card"><div class="num">\${parseInt(data.summary.last7d) || 0}</div><div class="label">Last 7 Days</div></div>
        </div>

        <div class="section">
          <h2>Crawler Role Distribution</h2>
          <div class="role-legend">
            <span><div class="dot" style="background:#22c55e"></div> User-Retrieval (someone asked an AI about you)</span>
            <span><div class="dot" style="background:#f59e0b"></div> Search Indexing</span>
            <span><div class="dot" style="background:#ef4444"></div> Training</span>
          </div>
          <div class="card bar-chart">
            \${data.byRole.length ? data.byRole.map(r => \`
              <div class="bar-item">
                <div class="bar-label">\${esc(r.crawler_role)}</div>
                <div class="bar-track"><div class="bar-fill \${safeRoleClass(r.crawler_role)}" style="width:\${(r.count/maxRole*100)}%">\${parseInt(r.count)}</div></div>
              </div>
            \`).join('') : '<div class="empty">No visits recorded yet</div>'}
          </div>
        </div>

        <div class="section grid-2">
          <div>
            <h2>By Agent</h2>
            <div class="card bar-chart">
              \${data.byAgent.length ? data.byAgent.map(a => \`
                <div class="bar-item">
                  <div class="bar-label">\${esc(a.agent_name)}</div>
                  <div class="bar-track"><div class="bar-fill" style="width:\${(a.count/maxAgent*100)}%">\${parseInt(a.count)}</div></div>
                </div>
              \`).join('') : '<div class="empty">No visits yet</div>'}
            </div>
          </div>
          <div>
            <h2>Top Paths</h2>
            <div class="card bar-chart">
              \${data.topPaths.length ? data.topPaths.map(p => \`
                <div class="bar-item">
                  <div class="bar-label">\${esc(p.request_path)}</div>
                  <div class="bar-track"><div class="bar-fill" style="width:\${(p.count/data.topPaths[0].count*100)}%">\${parseInt(p.count)}</div></div>
                </div>
              \`).join('') : '<div class="empty">No visits yet</div>'}
            </div>
          </div>
        </div>

        \${data.referrers.length ? \`
        <div class="section">
          <h2>Referrers</h2>
          <div class="card bar-chart">
            \${data.referrers.map(r => \`
              <div class="bar-item">
                <div class="bar-label" title="\${esc(r.referrer)}">\${safeHostname(r.referrer)}</div>
                <div class="bar-track"><div class="bar-fill" style="width:\${(r.count/data.referrers[0].count*100)}%">\${parseInt(r.count)}</div></div>
              </div>
            \`).join('')}
          </div>
        </div>\` : ''}

        <div class="section">
          <h2>Recent Visits</h2>
          <div class="card">
            \${data.recentVisits.length ? \`
            <table>
              <thead><tr><th>Time</th><th>Agent</th><th>Role</th><th>Path</th><th>Referrer</th></tr></thead>
              <tbody>
                \${data.recentVisits.map(v => \`
                  <tr>
                    <td>\${esc(new Date(v.timestamp + 'Z').toLocaleString())}</td>
                    <td>\${esc(v.agent_name || '—')}</td>
                    <td><span class="role-badge \${safeRoleClass(v.crawler_role)}">\${esc(v.crawler_role)}</span></td>
                    <td>\${esc(v.request_path)}</td>
                    <td>\${esc(v.referrer || '—')}</td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>\` : '<div class="empty">No visits recorded yet. AI agents will appear here when they visit your site.</div>'}
          </div>
        </div>

        <div class="refresh"><button onclick="loadData()">Refresh Data</button></div>
      \`;
    }

    loadData();
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
}
