# Coty.Design

Personal web presence for [Coty Beasley](https://coty.design) — a monorepo containing portfolio, AI chatbot, blog, and experimental projects.

## Projects

| Project | Description | Stack | Live |
|---------|-------------|-------|------|
| [`/portfolio`](portfolio/) | Portfolio site | Svelte + Vite | [coty.design](https://coty.design) |
| [`/ask`](ask/) | AI Q&A chatbot | React + Express + OpenAI | [ask.coty.design](https://ask.coty.design) |
| [`/blog`](blog/) | Writing and essays | Harp.js | [coty.blog](https://coty.blog) |
| [`/labs`](labs/) | Experimental sandbox | Various | — |

## Current Version

**v5.0 "Convergence"** — The fifth major iteration of coty.design, emerging at an inflection point in design and technology.

### Design Philosophy

This version focuses on doing *fewer things exceptionally well*. Every technical choice becomes evidence of design thinking:

- **Perceptual color accuracy** via OKLCH color space
- **Accessibility as foundation**, not enhancement (WCAG AA baseline)
- **Machine interpretability** — structured data for AI agent consumption
- **Design token maturation** — DTCG v2025.10 compliant system

### The Paradigm Shift

v5 acknowledges that AI systems now participate at every level of content creation and consumption:

- **As consumer:** AI agents crawl, summarize, and surface portfolio content in novel contexts
- **As filter:** AI mediates discovery, shaping how work is found and interpreted
- **As coconspirator:** AI tools participate in the creative process itself

This doesn't diminish human judgment—it amplifies it. Technical choices become more consequential because they determine how well human intent survives translation through AI systems.

## Documentation

```
docs/
├── adrs/           # Architecture Decision Records (technical)
├── eras/           # Design Era Records (philosophy & strategy)
│   └── DER-005-convergence.md  # Current era documentation
└── BACKLOG.md      # Future enhancements
```

### ADRs vs DERs

- **ADRs** capture *how* — technical implementation decisions
- **DERs** capture *why* — design philosophy and strategic evolution across major versions

## Tech Stack

### Portfolio (`/portfolio`)
- Svelte 4 + Vite 5
- OKLCH color system with light/dark themes
- Red Hat Mono typography (Minor Third scale)
- CSS custom properties for theming

### Chatbot (`/ask`)
- React + Vite frontend
- Express.js backend with SSE streaming
- OpenAI GPT-4o-mini for responses
- PostgreSQL + Drizzle ORM
- Persona-aware response adaptation

## Development

```bash
# Portfolio
cd portfolio && npm install && npm run dev

# Chatbot
cd ask && npm install && npm run dev
```

## License

Content and design are personal work. Code patterns may be referenced with attribution.

---

*"A portfolio should demonstrate craft through its execution, not just its content."*
