---
title: "Replit Configuration Strategy"
version: "1.0.0"
status: "Accepted"
date: "2024-12-27"
authors:
  - "Coty Beasley"
supersedes: null
revision_history:
  - version: "1.0.0"
    date: "2024-12-27"
    changes: "Initial ADR documenting Replit configuration strategy for shared monorepo"
---

# ADR-003: Replit Configuration Strategy

## Context

This monorepo is developed using multiple Replit projects, each focusing on a different subdirectory:

- **Ask Chatbot Replit** - Develops `/ask`
- **Main Site Replit** - Develops `/main`

Both Replit projects connect to the same GitHub repository.

### Problem Statement

Replit uses two configuration files at the repository root:

1. **`.replit`** - Runtime configuration (workflows, ports, modules)
2. **`replit.md`** - Agent context (project documentation, preferences)

If both files are committed to git, changes from one Replit project would affect the other.

### Goals

- Each Replit project should have independent runtime configuration
- Agent context should be project-specific
- Changes shouldn't create git conflicts between projects

## Decision

### `.replit` - Gitignored (Local to Each Replit)

The `.replit` file is added to `.gitignore`:

```gitignore
# Replit configuration (each project has its own local config)
.replit
```

**Rationale:**
- Each Replit project maintains its own local `.replit`
- Workflows and port mappings differ per project
- No git conflicts when switching between projects

**Each project configures:**
- Workflow command (`cd ask && npm run dev` vs `cd main && npm run dev`)
- Port mappings (5000 for ask, 5001 for main)
- Language modules

### `replit.md` - Committed (Project-Specific at Root)

The `replit.md` file at the repository root contains project-specific context for the Replit Agent. Each Replit project maintains its own version.

**Structure:**
```markdown
# Project Title

## Monorepo Context
- Working directory and path prefixes
- Key files for this project
- Workflow information

## Overview
- Project-specific documentation

## User Preferences
- Development style preferences
```

**Key Sections:**
- **Monorepo Context** - Explains that files are in a subdirectory (e.g., `ask/`)
- **Key Files** - Lists important files with full paths from repo root
- **Project-specific docs** - Architecture, patterns, technical reference

### Alternative Considered: Subdirectory `replit.md`

Placing `replit.md` in each project subdirectory (`/ask/replit.md`, `/main/replit.md`) was considered but rejected:

- Replit Agent only reads `replit.md` from the repository root
- Subdirectory files are not automatically detected

## Consequences

### Positive

- **No Conflicts** - `.replit` is local, so projects don't overwrite each other
- **Agent Context** - Each Replit Agent gets project-specific documentation
- **Independence** - Projects can evolve their configuration independently

### Negative

- **Manual Setup** - Each new Replit project must configure its own `.replit`
- **Root File Ownership** - Only one project's `replit.md` can be committed at a time

### Mitigation for Root File

When working in a Replit project:
1. The `replit.md` reflects that project's context
2. Before pushing, ensure the file is appropriate for the primary development focus
3. Use the **Monorepo Context** section to remind the Agent about subdirectory structure

## Status

**Accepted** - Strategy implemented and in use.
