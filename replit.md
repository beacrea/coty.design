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
| Main Site | `/portfolio` | `cd portfolio && npm run dev -- --port 5000` | 5000 |
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
- OKLCH color space for perceptual uniformity
- DTCG v2025.10 compliant design tokens
- WCAG AA accessibility compliance
- AI agent detection with enhanced structured data
- Generative background with evolving geometric organisms

### Generative Background

The portfolio features a subtle canvas-based generative background (`GenerativeBackground.svelte`). Geometric organisms (3-5 sided polygons) float softly and interact when they encounter each other through morphing, evolution, repulsion bursts, and size pulses.

**Configuration** (`src/lib/generative-config.ts`):
- `organismCount` — Number of floating organisms (default: 16)
- `minSize/maxSize` — Size range for organisms
- `minSpeed/maxSpeed` — Drift velocity range
- `connectionDistance` — Distance to draw connecting lines
- `mergeDistance` — Distance that triggers interactions
- `minStartVertices/maxStartVertices` — Starting vertex count range (3-5 = triangles to pentagons)
- `maxVertices` — Maximum polygon complexity
- `evolutionInterval` — Time-based evolution check interval
- `evolutionChance` — Base probability for time-based evolution
- `interactionChance` — Base probability for proximity-triggered interactions (evolve, morph, burst, simplify)
- `lineContrast` — Contrast ratio for shape outlines (light/dark themes)
- `vertexContrast` — Contrast ratio for vertex dots (light/dark themes)
- `blur` — Blur amount in pixels (0 = sharp, higher = softer/fuzzier)

**Interaction Types**: When organisms get close, they may evolve (35%), morph/transfer vertices (30%), burst apart (13%), simplify (10%), or pulse/spin (12%).

**Contrast Ratios**: Values like `1.15` mean 15% more visible than background. Higher values = more visible shapes.

## External Dependencies

### Portfolio (`/portfolio`)
- **Svelte 4** + **Vite 5** — Framework and build tool
- **Red Hat Mono** — Typography (Google Fonts)
- **isbot** — AI agent detection

### Chatbot (`/ask`)
- **React** + **Vite** — Frontend
- **Express.js** — Backend
- **OpenAI API** — LLM responses (GPT-4o-mini)
- **PostgreSQL** + **Drizzle ORM** — Database

## Build Commands

### Portfolio
```bash
cd portfolio && npm run dev   # Development (port 5001, Replit overrides to 5000)
cd portfolio && npm run build # Production build
```

### Chatbot
```bash
cd ask && npm run dev         # Development
cd ask && npm run build       # Production build
cd ask && npm run db:push     # Push Drizzle schema
```

---

_Last updated: 2024-12-28_
