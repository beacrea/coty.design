# Coty.Design Monorepo

## Overview

This is the monorepo for Coty Beasley's personal web presence, containing multiple projects:

- **`/portfolio`** — Portfolio site (Svelte + Vite), live at coty.design
- **`/ask`** — AI-powered Q&A chatbot (React + Express), live at ask.coty.design
- **`/blog`** — Static blog (Harp.js), live at coty.blog
- **`/labs`** — Experimental sandbox

## Replit Project Context

**This is a shared monorepo.** Two Replit projects point to this repository:

| Replit Project | Directory | Workflow | Port |
|----------------|-----------|----------|------|
| Main Site | `/portfolio` | `cd portfolio && PORT=5000 npm run dev` | 5000 |
| Ask Chatbot | `/ask` | `cd ask && npm run dev` | 5000 |

Each app has its own subdirectory-specific documentation:
- See `portfolio/replit.md` for portfolio-specific context
- See `ask/replit.md` for chatbot-specific context

The `.replit` file is gitignored since each Replit project has its own configuration.

## Documentation Structure

```
docs/
├── adrs/               # Architecture Decision Records (technical)
│   ├── ADR-001-Monorepo-Structure.md
│   ├── ADR-002-Port-Allocation.md
│   └── ADR-003-Replit-Config-Strategy.md
├── eras/               # Design Era Records (philosophy & strategy)
│   ├── README.md
│   ├── DER-000-template.md
│   └── DER-005-convergence.md
├── systems/            # Technical system documentation
│   └── portfolio-generative-background.md
└── BACKLOG.md          # Future enhancements and ideas
```

### ADRs vs DERs

- **ADRs (Architecture Decision Records)** — Technical implementation decisions
- **DERs (Design Era Records)** — Design philosophy, strategy, and evolution across major versions

## User Preferences

- Simple language in explanations
- Functional programming patterns preferred
- Iterative development approach
- Ask before making major architectural changes
- Detailed explanations welcomed

## Current Version

**Portfolio:** v5.0 "Convergence" — See [DER-005](docs/eras/DER-005-convergence.md) for design philosophy

Key characteristics:
- Dynamic version display fetched from GitHub Releases API at runtime (`src/lib/github-version.ts`), with local `package.json` version as fallback
- OKLCH color space for perceptual uniformity
- DTCG v2025.10 compliant design tokens
- WCAG AA accessibility compliance
- AI agent detection with enhanced structured data
- Generative background with evolving geometric organisms
- Deferred canvas initialization via requestIdleCallback for improved mobile TTI
- Decorative elements (canvas, SVG icons) hidden from assistive technology via aria-hidden
- Screen reader announcements for external links opening in new tabs (.sr-only utility)
- Observe mode properly hides content from screen readers via aria-hidden on main landmark
- Vite module preload polyfill enabled for faster LCP

### Generative Background

The portfolio features a subtle canvas-based generative background (`GenerativeBackground.svelte`) that evokes an underwater/fluid environment. Geometric organisms (3-5 sided polygons) float softly and interact when they encounter each other through morphing, evolution, repulsion bursts, and size pulses.

**Key Features**:
- Boids-style flocking behavior (cohesion, alignment, separation)
- Food competition system with aggressive speed boosts
- Subtle bioluminescence glow on eating and interactions
- Depth layers with 40-100% opacity variation
- Environmental bubbles following flow field currents (top-down view)
- Lobes, tendrils, chain links, and internal spokes
- Population density control with configurable target and aggressiveness
- 3D rotation effect: organisms use full 3-axis rotation (yaw, pitch, roll) with perspective projection, creating convincing depth as they navigate through fluid from a top-down view
- Flow field background: drifting gradient bands with time-based displacement

**Configuration**: `src/lib/generative-config.ts`

> **Full Documentation**: See [docs/systems/portfolio-generative-background.md](docs/systems/portfolio-generative-background.md) for comprehensive technical reference including architecture, behavioral systems, visual effects, configuration, and maintenance guidance.

## External Dependencies

### Portfolio (`/portfolio`)
- **Svelte 4** + **Vite 5** — Framework and build tool
- **Red Hat Mono** — Typography (Google Fonts)
- **Express.js** — Server for AI agent detection and dossier serving
- **better-sqlite3** — Agent analytics logging
- **isbot** — AI agent detection

### Agent Infrastructure (`/portfolio/server/`)
- Agent detection middleware with crawler-role classification (training/search/user-retrieval)
- Structured dossier HTML served to AI agents at `/` (humans get normal Svelte app)
- Auto-generated `/llms.txt` and `/llms-full.txt` from corpus
- `/agent-preview` — Diagnostic view of what AI agents see
- `/agent-insights` — Analytics dashboard for agent visit tracking
- `/api/dossier-preview` — API for rendered dossier content
- Professional ontology corpus: `portfolio/content/agent-corpus.json`
- Corpus validation: `npm run validate-corpus`

### Chatbot (`/ask`)
- **React** + **Vite** — Frontend
- **Express.js** — Backend
- **OpenAI API** — LLM responses (GPT-4o-mini)
- **PostgreSQL** + **Drizzle ORM** — Database

## Build Commands

### Portfolio
```bash
cd portfolio && PORT=5000 npm run dev       # Development (Express + Vite middleware)
cd portfolio && npm run build               # Production build
cd portfolio && npm run validate-corpus     # Validate agent corpus
```

### Chatbot
```bash
cd ask && npm run dev         # Development
cd ask && npm run build       # Production build
cd ask && npm run db:push     # Push Drizzle schema
```

## Agent Content Maintenance

The professional ontology corpus at `portfolio/content/agent-corpus.json` is the single source of truth for all AI-facing content. When updating professional information:

1. Edit `agent-corpus.json`
2. Run `npm run validate-corpus` to verify (all 53 checks should pass)
3. The dossier, llms.txt, and llms-full.txt auto-generate from the corpus
4. Check `/agent-preview` to see how AI agents will consume the content
5. Monitor `/agent-insights` to track which agents are visiting

### SEO Assets
- `portfolio/public/robots.txt` — Crawler-role-aware rules with sitemap pointer
- `portfolio/public/sitemap.xml` — XML sitemap for search engines
- `portfolio/index.html` — Contains OG/Twitter meta tags, canonical URL, JSON-LD structured data

### Deployment
The Express server handles both AI agent and human traffic. Deployment target is `autoscale`:
- **Build:** `npm run build --prefix portfolio` (Vite builds static assets to `portfolio/dist`)
- **Run:** `npm run start --prefix portfolio` (starts Express with `NODE_ENV=production`)
- In production, Express serves Vite-built static files for humans and the structured dossier for AI agents
- In dev, Vite runs in middleware mode through Express with HMR websocket sharing the same HTTP server

---

_Last updated: 2026-03-15_
