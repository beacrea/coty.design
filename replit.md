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
- OKLCH color space for perceptual uniformity
- DTCG v2025.10 compliant design tokens
- WCAG AA accessibility compliance
- AI agent detection with enhanced structured data
- Generative background with evolving geometric organisms

### Generative Background

The portfolio features a subtle canvas-based generative background (`GenerativeBackground.svelte`) that evokes an underwater/fluid environment. Geometric organisms (3-5 sided polygons) float softly and interact when they encounter each other through morphing, evolution, repulsion bursts, and size pulses.

**Key Features**:
- Boids-style flocking behavior (cohesion, alignment, separation)
- Food competition system with aggressive speed boosts
- Subtle bioluminescence glow on eating and interactions
- Depth layers with 40-100% opacity variation
- Environmental bubbles following flow field currents
- Lobes, tendrils, chain links, and internal spokes
- Population density control with configurable target and aggressiveness

**Configuration**: `src/lib/generative-config.ts`

> **Full Documentation**: See [docs/systems/portfolio-generative-background.md](docs/systems/portfolio-generative-background.md) for comprehensive technical reference including architecture, behavioral systems, visual effects, configuration, and maintenance guidance.

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

_Last updated: 2025-12-28_
