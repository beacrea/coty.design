---
title: "AI Optimization Architecture"
version: "1.0.0"
status: "Accepted"
date: "2026-03-16"
authors:
  - "Coty Beasley"
supersedes: null
revision_history:
  - version: "1.0.0"
    date: "2026-03-16"
    changes: "Initial ADR documenting AI optimization system architecture, research basis, and design rationale"
---

# ADR-004: AI Optimization Architecture

## Context

AI systems have become a significant channel for professional discovery and reputation. Large language models summarize professional backgrounds, AI-powered search engines synthesize content for users, and retrieval-augmented generation (RAG) pipelines pull structured data from the web in real time. As of early 2026, a professional portfolio that ignores machine-readable content risks being misrepresented — or invisible — in AI-mediated contexts.

The coty.design portfolio site needed a comprehensive strategy to ensure that when AI systems encounter the site, they receive accurate, structured, and complete information about Coty Beasley's professional identity. This ADR documents the architecture that was built across Tasks #4, #5, #7, and #14, the emerging standards and research that informed each component, and the rationale behind key decisions.

### The Emerging Landscape (as of March 2026)

Several developments shaped this architecture:

1. **llms.txt convention** — The llmstxt.org proposal (Jeremy Howard / Answer.AI, ~2024) established a convention for websites to provide LLM-friendly content at `/.well-known/llms.txt` or `/llms.txt`, with a comprehensive version at `/llms-full.txt`. The format is plain Markdown optimized for LLM context windows. Adoption has grown among developer-facing sites and personal portfolios. (Source: https://llmstxt.org/)

2. **Schema.org structured data and JSON-LD** — Google's structured data documentation and the broader schema.org vocabulary have long been the standard for machine-readable web content. The `ProfilePage`, `Person`, `Organization`, `EducationalOccupationalCredential`, and `Occupation` types are directly applicable to professional portfolios. Google's Rich Results guidelines reinforce that structured data improves content understanding by automated systems. (Source: https://schema.org/, https://developers.google.com/search/docs/appearance/structured-data)

3. **AI crawler proliferation and identification** — Major AI companies now operate distinct crawler user-agents, documented publicly:
   - **OpenAI:** GPTBot (training), OAI-SearchBot (search indexing), ChatGPT-User (live retrieval for ChatGPT conversations). (Source: https://platform.openai.com/docs/bots)
   - **Anthropic:** ClaudeBot (training), Claude-SearchBot (search), Claude-User / Claude-Web (live retrieval). (Source: https://docs.anthropic.com/en/docs/claude-ai-bots)
   - **Google:** Google-Extended (AI training, separate from Googlebot for search). (Source: https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)
   - **Others:** PerplexityBot, CCBot (Common Crawl), Bytespider (ByteDance), Meta-ExternalAgent, Amazonbot.
   - The `isbot` npm package provides supplementary bot detection heuristics.

4. **Crawler role taxonomy** — The industry has converged on a three-role pattern: **training** (bulk data collection for model training), **search** (indexing for AI-powered search products), and **user-retrieval** (real-time fetching when a user asks an AI about something). Each role has different implications for content strategy.

5. **robots.txt as AI policy mechanism** — Since 2023, robots.txt has become the primary mechanism for websites to express AI crawler policy. Major publishers have blocked training crawlers while allowing search crawlers. This site takes the opposite approach: deliberately allowing all AI agents, treating AI visibility as a feature rather than a threat. (Sources: "A robots.txt explainer for AI companies," The Verge, 2023-09-28, https://www.theverge.com/24048285/ai-robots-txt-web-crawlers; "Blocking AI crawlers with robots.txt," Ars Technica, 2023-08-22, https://arstechnica.com/information-technology/2023/08/openai-lets-websites-opt-out-of-training-gpt-bot/; Google's robots.txt specification, https://developers.google.com/search/docs/crawling-indexing/robots/intro)

6. **AI-mediated discovery** — Perplexity (https://www.perplexity.ai/), SearchGPT / ChatGPT Search (OpenAI, launched 2024, https://openai.com/index/searchgpt-prototype/), Google AI Overviews (launched 2024, https://blog.google/products/search/generative-ai-google-search-may-2024/), and similar products synthesize content rather than linking to it. Structured, machine-readable data becomes critical for accurate representation in these contexts, since the AI system may never show the user the original page.

### Problem Statement

Without a deliberate AI optimization strategy, the portfolio's content would be interpreted through raw HTML parsing — losing nuance, structure, and context. AI systems would piece together fragments rather than receiving a coherent professional narrative. The site needed to:

1. Provide machine-optimized content in multiple formats for different consumption patterns
2. Detect and classify AI visitors to understand the landscape
3. Track AI agent behavior for ongoing optimization
4. Maintain a single source of truth that drives all outputs
5. Express a clear, permissive policy toward AI crawlers

## Decision

### 1. Corpus-Driven Architecture

**All machine-readable outputs are generated from a single canonical data source: `portfolio/content/agent-corpus.json`.**

The corpus contains the complete professional dataset — identity, career timeline, expertise domains, geographic journey, differentiators, press coverage, professional affiliations, speaking topics, published work, and contact information. Every output format is a downstream transformation of this corpus.

**Data flow:**

```
agent-corpus.json (single source of truth)
        │
        ├── /llms.txt         (summary Markdown for LLM context windows)
        ├── /llms-full.txt    (comprehensive Markdown dossier)
        ├── / (AI dossier)    (semantic HTML + JSON-LD for crawlers)
        ├── /sitemap.xml      (XML sitemap, corpus-driven lastmod)
        └── /agent-preview    (human-readable preview of all AI outputs)
```

**Implementation:** `portfolio/server/lib/corpus.ts` loads and caches the corpus with mtime-based invalidation. All route handlers call `loadCorpus()` and transform the data into their respective formats.

**Rationale:** A corpus-driven architecture eliminates content drift between formats. When the corpus is updated, all outputs reflect the change immediately. This is particularly important for professional content where inconsistencies between what different AI systems see could cause confusion.

### 2. Multi-Format Output Strategy

The system serves content in multiple formats because different AI consumers have different needs:

| Route | Format | Primary Consumer | Purpose |
|-------|--------|-----------------|---------|
| `/llms.txt` | Markdown | LLM context windows | Concise summary optimized for token efficiency |
| `/llms-full.txt` | Markdown | RAG pipelines, deep research | Comprehensive professional dossier |
| `/` (AI dossier) | HTML + JSON-LD | Web crawlers, search engines | Semantic structure + structured data for indexing |
| `/sitemap.xml` | XML | All crawlers | Route discovery with priority hints |

**Implementation:**
- `portfolio/server/routes/llms-txt.ts` — Generates both `llms.txt` (summary) and `llms-full.txt` (full dossier) from the corpus
- `portfolio/server/routes/dossier.ts` — Generates semantic HTML with embedded JSON-LD structured data using `ProfilePage`, `Person`, `Organization`, `EducationalOccupationalCredential`, and `Occupation` schema types
- `portfolio/server/routes/sitemap.ts` — Generates XML sitemap from the route registry, using corpus `lastUpdated` for `<lastmod>`

**Rationale:** Different AI systems consume content differently. LLMs operating within context windows benefit from concise Markdown. RAG pipelines need comprehensive plain text. Traditional crawlers need HTML with structured data. Serving all formats from one corpus ensures consistency without manual synchronization.

### 3. Three-Tier Agent Detection and Classification

**AI visitors are detected via user-agent string matching and classified into one of three roles: training, search, or user-retrieval.**

**Implementation:** `portfolio/server/middleware/agent-detection.ts` defines three arrays:

- `TRAINING_CRAWLERS` — GPTBot, ClaudeBot, Google-Extended, anthropic-ai, CCBot, Bytespider, Meta-ExternalAgent, Amazonbot
- `SEARCH_CRAWLERS` — OAI-SearchBot, Claude-SearchBot, PerplexityBot
- `USER_RETRIEVAL_AGENTS` — ChatGPT-User, Claude-User, Claude-Web

The `agentDetectionMiddleware` function sets `res.locals.isAIAgent`, `res.locals.crawlerRole`, and `res.locals.agentName` on every request. The `classifyCrawlerRole()` function prioritizes more specific roles (user-retrieval > search > training) when matching.

**Rationale:** The three-role taxonomy reflects how major AI companies have structured their crawler fleets. Understanding *why* an AI agent is visiting — training data collection vs. real-time user query — enables future response optimization and provides meaningful analytics. User-retrieval visits are the highest-signal events, indicating someone is actively asking an AI about the portfolio owner.

### 4. Analytics Pipeline

**All AI agent visits are logged to a local SQLite database for analysis.**

**Implementation:** `portfolio/server/middleware/analytics.ts` uses `better-sqlite3` to maintain an `agent_visits` table with timestamp, user-agent, agent name, crawler role, request path, referrer, response type, and IP address. The database uses WAL mode for concurrent read performance. Indexes on timestamp, agent_name, and crawler_role support the analytics queries.

`portfolio/server/routes/agent-insights.ts` provides both a JSON API (`/api/agent-insights`) and an HTML dashboard (`/agent-insights`) showing visit summaries, agent distribution, role breakdown, top paths, referrers, and recent visits.

**Rationale:** Understanding which AI agents visit, how often, and what they access provides actionable intelligence for content optimization. The analytics distinguish between training crawls (bulk, periodic), search indexing (regular), and user-retrieval (high-value, on-demand), each of which indicates different things about the portfolio's AI presence.

### 5. Deliberately Permissive robots.txt

**The robots.txt explicitly allows all known AI crawlers rather than blocking any.**

**Implementation:** `portfolio/public/robots.txt` contains individual `User-agent` / `Allow: /` blocks for GPTBot, ClaudeBot, anthropic-ai, Google-Extended, OAI-SearchBot, Claude-SearchBot, ChatGPT-User, Claude-User, PerplexityBot, Amazonbot, CCBot, plus the default `User-agent: *` allow-all. It also declares the sitemap location.

**Rationale:** For a personal portfolio, AI visibility is a feature. The site *wants* to be included in training data, search indexes, and retrieval results. Being accurately represented by AI systems is a form of professional presence. The explicit per-agent `Allow` blocks serve as documentation of awareness — signaling to crawler operators that the site has considered their specific agent and made a deliberate policy choice.

### 6. Route Registry and Discoverability

**All public routes are registered in a central registry that drives both the sitemap and noindex headers.**

**Implementation:** `portfolio/server/lib/routes.ts` provides `registerRoute()`, `mountRegisteredRoutes()`, and `getIndexableRoutes()`. Each route entry specifies path, HTTP method, handlers, noindex status, sitemap changefreq, and priority. Routes marked `noindex` automatically receive an `X-Robots-Tag: noindex` header. The sitemap is generated from indexable routes only.

**Rationale:** A centralized route registry prevents the common problem of forgetting to add new routes to the sitemap or accidentally indexing internal pages. It also provides a single place to reason about the site's public surface area for both human and AI visitors.

### 7. Human Preview of AI Outputs

**A dedicated preview page shows site owners exactly what AI agents see.**

**Implementation:** `portfolio/server/routes/agent-preview.ts` serves an interactive page at `/agent-preview` with tabs for the rendered dossier, JSON-LD, llms.txt, llms-full.txt, raw corpus JSON, and corpus statistics. This is marked `noindex` so it doesn't appear in search results.

**Rationale:** AI optimization is invisible by nature — the outputs are consumed by machines, not humans. A preview page provides transparency and debugging capability, making the AI layer auditable.

## Alternatives Considered

### Block training crawlers, allow only search and retrieval

Many publishers block GPTBot, ClaudeBot, and other training crawlers while permitting search indexing. This protects content from being used for model training without compensation.

**Rejected because:** A personal portfolio benefits from broad AI awareness. Being part of training data increases the likelihood that AI systems can accurately discuss the portfolio owner. The content is public professional information, not proprietary intellectual property.

### Static llms.txt files instead of dynamic generation

The llms.txt files could be hand-written Markdown files served statically, which is simpler than dynamic generation from a corpus.

**Rejected because:** Static files create a synchronization problem. When career information changes, every file must be updated manually. Corpus-driven generation ensures all outputs are always consistent and current.

### PDF-only dossier instead of HTML + JSON-LD

A PDF dossier could serve as a comprehensive, printable professional overview.

**Rejected because:** PDFs are opaque to most AI systems. They require specialized parsing, lose semantic structure, and can't embed JSON-LD. HTML with structured data is natively understood by web crawlers and AI systems alike.

### JSON-LD only, without llms.txt

Schema.org structured data via JSON-LD is the established standard for machine-readable web content. The llms.txt format is newer and less widely adopted.

**Rejected because:** JSON-LD and llms.txt serve different consumers. JSON-LD is embedded in HTML and consumed by crawlers that parse web pages. llms.txt is a standalone plain-text format optimized for direct injection into LLM context windows. Supporting both maximizes coverage across the AI ecosystem.

### Generic bot detection (isbot) instead of curated agent lists

The `isbot` npm package detects a broad range of bots. Using it alone would be simpler than maintaining curated lists.

**Rejected because:** Generic detection doesn't support role classification. Knowing that a visitor is GPTBot vs. ChatGPT-User vs. OAI-SearchBot provides fundamentally different signals. The curated lists enable the three-tier taxonomy that drives meaningful analytics. `isbot` is used as a supplementary signal, not a replacement.

## Consequences

### Positive

- **Accurate AI representation** — When AI systems encounter coty.design, they receive structured, comprehensive, and consistent data across multiple formats
- **Single source of truth** — The corpus-driven architecture eliminates content drift between outputs
- **Actionable analytics** — The three-tier classification provides insight into *why* AI systems visit, not just that they do
- **Future-proof extensibility** — New output formats (e.g., a hypothetical `agents.json` standard) can be added as corpus transformations without restructuring
- **Transparency** — The agent preview page makes the AI optimization layer visible and auditable

### Negative

- **Maintenance burden** — The agent detection lists require updating as new AI crawlers emerge; user-agent strings may change
- **Corpus coupling** — All outputs depend on the corpus schema; schema changes require updating all transformation functions
- **SQLite limitations** — The analytics database is local and ephemeral; it doesn't survive container resets without backup
- **Emergent standards** — The llms.txt convention and AI crawler landscape are evolving rapidly; the architecture may need adaptation as standards mature

### Neutral

- **No content differentiation by role** — Currently, all AI agents receive the same content regardless of role. The classification is used for analytics only. Future iterations could serve different content depths based on crawler role.
- **No rate limiting** — AI crawlers are not rate-limited. If aggressive crawling becomes an issue, rate limiting can be added at the middleware layer.

## Related

- [ADR-001: Monorepo Structure](ADR-001-Monorepo-Structure.md) — Repository organization context
- [DER-005: Convergence](../eras/DER-005-convergence.md) — Era document covering the broader design philosophy, including AI as audience

## Status

**Accepted** — System implemented and operational across Tasks #4, #5, #7, and #14.
