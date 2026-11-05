/**
 * Storage-agnostic agent analytics. Node (Replit) plugs in Postgres via
 * `analytics-pg.ts`; the Cloudflare Worker plugs in D1 via `analytics-d1.ts`.
 * Route and middleware code only ever talks to this interface.
 */

export interface AgentVisit {
  userAgent: string;
  agentName: string | null;
  crawlerRole: string;
  requestPath: string;
  referrer: string | null;
  responseType: string;
  ipAddress: string | null;
}

export interface CountRow {
  count: number;
  [key: string]: string | number | null;
}

export interface AgentInsights {
  summary: { total: number; last24h: number; last7d: number };
  byAgent: CountRow[];
  byRole: CountRow[];
  topPaths: CountRow[];
  referrers: CountRow[];
  recentVisits: Array<Record<string, unknown>>;
  dailyTrend: CountRow[];
}

export interface AnalyticsStore {
  logVisit(visit: AgentVisit): Promise<void>;
  getInsights(): Promise<AgentInsights>;
}

export const EMPTY_INSIGHTS: AgentInsights = {
  summary: { total: 0, last24h: 0, last7d: 0 },
  byAgent: [],
  byRole: [],
  topPaths: [],
  referrers: [],
  recentVisits: [],
  dailyTrend: [],
};

let store: AnalyticsStore | null = null;
let background: (task: Promise<unknown>) => void = () => {};

export function setAnalyticsStore(next: AnalyticsStore | null): void {
  store = next;
}

export function getAnalyticsStore(): AnalyticsStore | null {
  return store;
}

/**
 * Where fire-and-forget writes go. Node lets the promise float; Workers must
 * hand it to `waitUntil` or the isolate may drop it once the response is sent.
 */
export function setBackgroundRunner(runner: (task: Promise<unknown>) => void): void {
  background = runner;
}

export function runInBackground(task: Promise<unknown>): void {
  background(task);
}

export const castCounts = (rows: Array<Record<string, unknown>>): CountRow[] =>
  rows.map((r) => ({ ...r, count: Number(r.count) } as CountRow));
