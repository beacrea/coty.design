---
title: "Monorepo Structure"
version: "1.0.0"
status: "Accepted"
date: "2024-12-27"
authors:
  - "Coty Beasley"
supersedes: null
revision_history:
  - version: "1.0.0"
    date: "2024-12-27"
    changes: "Initial ADR documenting monorepo structure and project organization"
---

# ADR-001: Monorepo Structure

## Context

Coty Beasley's personal web presence consists of multiple related but distinct projects:

- **Portfolio site** (`/main`) - Svelte + Vite, lives at coty.design
- **Q&A chatbot** (`/ask`) - React + Express, lives at ask.coty.design
- **Blog** (`/blog`) - Harp.js static site, lives at coty.blog
- **Labs** (`/labs`) - Experimental design sandbox

These projects share some conceptual overlap (design tokens, content about Coty) but have distinct technology stacks and deployment targets.

### Problem Statement

1. **Shared Context** - Some decisions affect multiple projects (port allocation, documentation strategy)
2. **Independent Development** - Each project needs its own tooling, dependencies, and deployment
3. **Multiple Replit Projects** - Each app is developed in its own Replit environment but shares the same GitHub repository

### Goals

- Enable independent development of each project
- Share common documentation and decisions across projects
- Avoid configuration conflicts between Replit projects
- Maintain clear boundaries between project codebases

## Decision

### Use a Monorepo with Subdirectory Isolation

Each project lives in its own subdirectory with complete isolation:

```
coty.design/
├── docs/                    # Monorepo-level documentation
│   └── adrs/               # Monorepo-wide ADRs
├── main/                   # Portfolio site (Svelte)
│   ├── docs/adrs/         # Main-specific ADRs
│   └── ...
├── ask/                    # Q&A chatbot (React + Express)
│   ├── docs/adrs/         # Ask-specific ADRs
│   └── ...
├── blog/                   # Blog (Harp.js)
└── labs/                   # Experiments
```

### Documentation Strategy

**Two-level ADR structure:**

| Level | Location | Scope |
|-------|----------|-------|
| Monorepo | `/docs/adrs/` | Decisions affecting multiple projects or the repo structure itself |
| Project | `/<project>/docs/adrs/` | Decisions specific to one project's architecture |

**Examples:**
- Monorepo ADR: Port allocation, Replit configuration strategy
- Project ADR: RAG architecture for the Q&A chatbot

### Replit Configuration Strategy

Each project has its own Replit environment. To avoid conflicts:

1. **`.replit` is gitignored** - Each Replit project maintains its own local `.replit` file
2. **`replit.md` at project root** - Contains project-specific context for the Replit Agent
3. **Separate workflows** - Each project runs independently on its assigned port

## Consequences

### Positive

- **Clear Boundaries** - Each project is self-contained with its own dependencies
- **Independent Deployment** - Projects can be deployed separately to different domains
- **Shared Documentation** - Monorepo-level ADRs provide context for all projects
- **No Configuration Conflicts** - Gitignored `.replit` prevents Replit projects from overwriting each other

### Negative

- **Duplication** - Some tooling configuration may be duplicated across projects
- **Coordination Required** - Changes affecting multiple projects need cross-project awareness
- **Repository Size** - Single repo grows with all projects (mitigated by clean separation)

### Neutral

- **Learning Curve** - Contributors need to understand the two-level documentation structure

## Status

**Accepted** - Structure implemented and in use.
