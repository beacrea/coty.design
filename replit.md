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

The portfolio features a subtle canvas-based generative background (`GenerativeBackground.svelte`) that evokes an underwater/fluid environment. Geometric organisms (3-5 sided polygons) float softly and interact when they encounter each other through morphing, evolution, repulsion bursts, and size pulses.

**Configuration** (`src/lib/generative-config.ts`):
- `organismCount` — Number of floating organisms (default: 16)
- `minSize/maxSize` — Size range for organisms
- `minSpeed/maxSpeed` — Drift velocity range (default: 0.01-0.04, intentionally slow for subtle background)
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
- `foodSourceCount/maxFoodSources` — Food particles that organisms compete for

**Behavioral Systems**:

*Flocking*: Organisms exhibit boids-style flocking behavior:
- **Cohesion** — Move toward the center of nearby neighbors
- **Alignment** — Match velocity direction with neighbors
- **Separation** — Avoid collisions with other organisms

*Food Competition*: When food particles are present, organisms become more aggressive:
- Speed increases when approaching food (up to 2x normal speed)
- Eating food triggers growth and bioluminescence glow
- Organisms may evolve or grow lobes after eating

**Interaction Types**: When organisms get close, they may evolve (10%), morph/transfer vertices (25%), incorporate mass (20%), fuse together (17%), burst apart (10%), exchange lobes (8%), or pulse/spin (10%).

**Visual Effects**:

*Bioluminescence*: Organisms glow when:
- Eating food (0.8 intensity)
- Interacting with other organisms (0.4-0.7 intensity)
- Glow decays at 96% per frame, creating a soft fade

*Depth Layers*: Each organism and bubble has a random depth value (0-1):
- Opacity scales from 40% (far) to 100% (near)
- Creates 3D parallax/layered visual effect

*Environmental Bubbles*: Ambient particles that:
- Spawn from screen edges and interior
- Follow a Perlin-noise-like flow field for organic drift
- Get displaced when colliding with organisms
- Vary in size (0.15-1.8px) with most being tiny

*Propulsion Bubbles*: Small particles emitted from the rear of moving organisms:
- Spawn rate proportional to organism speed
- Sparse (8% chance) for subtlety

**Morphological Features**:
- **Tendrils** — Curved lines that grow toward nearby organisms during evolution/morph interactions, then retract
- **Internal spokes** — Lines connecting opposite vertices on organisms with 4+ vertices, intensity varies per organism
- **Chain links** — Wobbling connections that form during morph/pulse interactions, stretch as organisms drift, then break
- **Lobes** — Secondary polygon appendages attached to main organism body
- **Trailing particles** — Small fading dots spawned during burst repulsions and simplifications

**Contrast Ratios**: Values like `1.15` mean 15% more visible than background. Higher values = more visible shapes.

**Design Constraints**:
- Maximum organism bounding radius capped at 42px (maxSize × 1.5)
- Base speed intentionally slow (0.01-0.04) for subtle background effect

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
