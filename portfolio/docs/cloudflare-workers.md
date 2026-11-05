# Cloudflare Workers deploy (ADR-005)

The site runs the same Express app on two runtimes:

| | Node (Replit, legacy) | Cloudflare Worker |
|---|---|---|
| Entry | `server/index.ts` | `worker/index.ts` (`httpServerHandler` from `cloudflare:node`) |
| Shared app | `server/app.ts` (`createCoreApp` + `mountSpa`) | same |
| Corpus, doctrine, `index.html` | read from disk | bundled at build time |
| Agent analytics | Postgres (`DATABASE_URL`) via `server/lib/analytics-pg.ts` | D1 (`DB` binding) via `server/lib/analytics-d1.ts`, writes in `waitUntil` |
| Static files | `express.static(dist)` | Workers Static Assets; `/assets/*` and `/fonts/*` skip the Worker |
| `POST /api/sync-doctrine` | GitHub sync (dormant) | 503, disabled |

Anything platform-specific is injected into `server/app.ts`, never imported by it.

## Commands (from `portfolio/`)

- `npm run dev:worker`: build, apply D1 migrations locally, run `wrangler dev` on :8787
- `npm run typecheck:worker`
- `npm run deploy:worker`: build and `wrangler deploy` (account "Personal Site (coty.design)")

`build:worker` copies `worker/_headers` into `dist/` so hashed bundles get a 1-year immutable cache, matching the Node server.

## Analytics database

D1 `coty-design-analytics` (ENAM) was created 2026-11-05 with migration `0001_agent_visits.sql` applied and recorded in `d1_migrations`. New migrations: add a file under `migrations/`, then `npx wrangler d1 migrations apply DB --remote`.

History from Replit Postgres can be imported before cutover; convert `timestamp` to ISO-8601 UTC text (`2026-11-05T15:24:27.000Z`).
