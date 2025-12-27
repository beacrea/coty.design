# Coty.Design Monorepo

## Overview

This is a monorepo for Coty Beasley's personal web presence, containing four distinct projects:

- **`/main`** - Portfolio site built with Svelte + Vite, live at coty.design
- **`/ask`** - AI-powered Q&A chatbot about Coty's professional work, live at ask.coty.design
- **`/blog`** - Static blog built with Harp.js, live at coty.blog
- **`/labs`** - Experimental design sandbox

The primary active development focuses on the portfolio (`/main`) and the AI chatbot (`/ask`), which represents a sophisticated RAG-based conversational agent with persona adaptation.

## Replit Project Context

**This is a shared monorepo.** Each app has its own Replit project and subdirectory-specific documentation:

- **`/ask`** - See `ask/replit.md` for chatbot-specific context (port 5000)
- **`/main`** - See `main/replit.md` for portfolio-specific context (port 5001)

When working in a Replit project, check the subdirectory's `replit.md` for app-specific file paths, workflows, and important files.

## User Preferences

Preferred communication style: Simple, everyday language.

Additional preferences:
- Functional programming patterns preferred
- Iterative development approach
- Ask before making major architectural changes
- Detailed explanations welcomed

## System Architecture

### Portfolio Site (`/main`)

**Framework:** Svelte 4 with Vite 5 and TypeScript

**Design System:**
- OKLCH color space for perceptual color uniformity
- DTCG v2025.10 compliant design token structure
- CSS custom properties for theming (light/dark modes)
- Red Hat Mono typography with responsive sizing (Minor Third 1.2 scale)
- Mobile-first responsive design with sm/md/lg breakpoints

**Key Features:**
- PWA manifest and service worker ready
- SEO optimization with Open Graph and JSON-LD structured data
- AI agent detection for enhanced content delivery to crawlers

### AI Chatbot (`/ask`)

**Frontend:** React + Vite with TypeScript
- shadcn/ui component library (New York style)
- Tailwind CSS for styling
- TanStack React Query for server state
- Mobile-first PWA with service worker caching

**Backend:** Express.js with TypeScript
- Server-Sent Events (SSE) for streaming responses
- PostgreSQL database with Drizzle ORM
- OpenAI GPT-4o-mini for response generation

**RAG Architecture:**
- Modular knowledge base with keyword-based routing
- Intent analyzer routes queries to relevant KB modules
- Persona engine adapts responses based on inferred user type (evaluator, explorer, peer, default)
- Response evaluator scores quality and tracks knowledge gaps

**Safety Controls:**
- Rate limiting: 5 requests/minute/IP
- FAQ caching with 2-hour TTL
- Token caps (350 max output tokens)
- Grounded responses only from curated knowledge base

**Database Schema (Drizzle + PostgreSQL):**
- `persona_profiles` - Configurable persona definitions
- `suggestion_chips` - Strategic starter prompts that signal persona
- `signal_keywords` - Words/phrases indicating user persona
- `session_signals` / `session_persona` - Per-session persona tracking
- `knowledge_modules` / `module_keywords` - KB content and routing
- `user_questions` / `evaluation_runs` - Quality tracking

### Blog (`/blog`)

**Framework:** Harp.js static site generator
- Markdown content with Jade templating
- SASS preprocessing
- Compile-to-static workflow

### Build & Development

**Ask App Scripts:**
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build (esbuild for server, Vite for client)
- `npm run db:push` - Push Drizzle schema to PostgreSQL

**Main Portfolio Scripts:**
- `npm run dev` - Vite dev server on port 5000
- `npm run build` - Production build

## External Dependencies

### AI & LLM Services
- **OpenAI API** - GPT-4o-mini for chat responses and intent analysis
- Environment variable: `OPENAI_API_KEY`

### Database
- **PostgreSQL** - Primary database for ask.coty.design
- **Drizzle ORM** - Type-safe database queries and migrations
- Environment variable: `DATABASE_URL`

### Frontend Libraries (Ask App)
- **shadcn/ui** - Component library built on Radix UI primitives
- **TanStack React Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **wouter** - Lightweight routing

### Static Site (Blog)
- **Harp.js** - Static site generator with preprocessing
- **Google Fonts** - Typography (Open Sans, Domine, Vollkorn)
- **Font Awesome Pro** - Icons

### CDN & Fonts
- **Google Fonts** - Red Hat Mono (portfolio), DM Sans/Fira Code/Geist Mono (ask app)