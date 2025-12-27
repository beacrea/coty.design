---
title: "Port Allocation"
version: "1.0.0"
status: "Accepted"
date: "2024-12-27"
authors:
  - "Coty Beasley"
supersedes: null
revision_history:
  - version: "1.0.0"
    date: "2024-12-27"
    changes: "Initial ADR documenting port allocation strategy"
---

# ADR-002: Port Allocation

## Context

Multiple projects in this monorepo need to run development servers simultaneously during local development or when multiple Replit projects are active.

### Problem Statement

- Each project needs a consistent, predictable port
- Ports must not conflict when multiple projects run together
- Replit exposes port 5000 externally by default (mapped to port 80)

### Constraints

- Replit maps `localPort: 5000` to `externalPort: 80` for web preview
- Each Replit project can only expose one port externally at a time
- Projects may need to reference each other's URLs during development

## Decision

### Assign Fixed Ports by Project

| Project | Port | Purpose |
|---------|------|---------|
| `/ask` | 5000 | Q&A chatbot (primary Replit focus) |
| `/main` | 5001 | Portfolio site |
| `/blog` | 5002 | Blog (if running locally) |
| `/labs` | 5003 | Experiments |

### Implementation

Each project's development server is configured to use its assigned port:

**Ask Chatbot (`/ask`):**
```bash
npm run dev  # Runs on port 5000
```

**Portfolio (`/main`):**
```bash
npm run dev -- --port 5001
```

### Replit Workflow Configuration

Each Replit project's `.replit` file specifies its workflow:

```toml
# Ask Chatbot Replit
[[workflows.workflow]]
name = "Ask Chatbot"
args = "cd ask && npm run dev"
waitForPort = 5000

[[ports]]
localPort = 5000
externalPort = 80
```

```toml
# Main Site Replit
[[workflows.workflow]]
name = "Main Site"
args = "cd main && npm run dev -- --port 5001"
waitForPort = 5001

[[ports]]
localPort = 5001
externalPort = 80
```

## Consequences

### Positive

- **No Conflicts** - Fixed allocation prevents port collisions
- **Predictable** - Developers always know which port to use
- **External Access** - Each Replit project exposes its primary app on port 80

### Negative

- **Configuration Required** - Each project must be configured with its specific port
- **Single External Port** - Only one project visible per Replit environment

### Neutral

- **Port Numbers Arbitrary** - The specific numbers don't matter, just the consistency

## Status

**Accepted** - Port allocation in use across all projects.
