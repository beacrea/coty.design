# ask.coty - Q&A Agent

## Monorepo Context

This app lives in the `/ask` subdirectory of the `coty.design` monorepo. When working in this Replit project:

- **Working directory:** Monorepo root, so prefix paths with `ask/`
- **Workflow:** "Ask Chatbot" runs `cd ask && npm run dev` on port 5000
- **Key files:**
  - `ask/server/routes.ts` - API endpoints, SSE streaming
  - `ask/client/src/pages/chat.tsx` - Main chat UI
  - `ask/server/kb/modules.ts` - Knowledge base content
  - `ask/server/intent-analyzer.ts` - Query routing logic
  - `ask/shared/schema.ts` - Types and database schema

## Overview

This project is a mobile-first Progressive Web App (PWA) Q&A agent designed to answer questions about Coty Beasley's professional profile. It utilizes a curated, grounded knowledge base to prevent AI hallucinations, ensuring responses are based solely on provided context. The application aims to provide a conversational experience with streaming AI responses and discreet persona-aware adaptation, making the interaction feel naturally personalized. The project's ambition is to offer a sophisticated yet user-friendly interface for professional evaluation, casual inquiry, and peer-to-peer technical discussions.

## User Preferences

I prefer simple language in explanations. I like functional programming. I want iterative development. Ask before making major changes. I prefer detailed explanations. Do not make changes to the folder `Z`. Do not make changes to the file `Y`.

## System Architecture

The application adopts a mobile-first PWA design, featuring a React + Vite frontend and an Express backend. The UI/UX emphasizes a clean chat interface with streaming message rendering, PWA installability, and interactive components like suggested questions and follow-up cards.

**Key UI/UX and Design Decisions:**
-   **Chat UI**: Mobile-first, streaming message rendering, PWA support.
-   **Pre-Response Disambiguation**: Broad queries trigger topic chips *before* an AI response, avoiding verbose answers. This is inspired by AG-UI patterns.
-   **Follow-Up Cards**: Interactive `FollowUpCard` component appears as a standalone system prompt to narrow down broad queries.
-   **Persona-Aware Adaptation**: The system discretely infers user intent (evaluator, explorer, peer, default) through behavioral signals like suggestion tap, first question content, and conversation trajectory. This influences tone, depth, and emphasis of responses without explicit user segmentation.

**Technical Implementations and Features:**
-   **Frontend**: React + Vite for a responsive, component-based UI.
-   **Backend**: Express.js handles API requests and SSE for streaming responses.
-   **Streaming API**: `/api/chat` endpoint provides Server-Sent Events (SSE) for real-time response delivery.
-   **Knowledge Base**: Modular, keyword-based routing of questions to relevant KB modules to ground AI responses.
-   **Safety Controls**: Rate limiting (5 req/min/IP), FAQ caching (2hr TTL), and token caps (350) ensure cost efficiency and prevent abuse.
-   **Cost Optimization**: Utilizes `gpt-4o-mini`, hard output token caps, and selective KB module injection.
-   **Safety Rules**: Responses are strictly from the KB context, unknown information triggers a "Not specified in context" message, and facts are not fabricated.

**Core Architectural Patterns:**
-   **Persona Strategy**: Adapt experience invisibly based on user intent. Uses suggestion taps, first question content, and conversation trajectory as signals for persona inference (`evaluator`, `explorer`, `peer`, `default`).
-   **Signal Architecture**: Prioritizes `suggestion tap` for immediate persona signal, followed by `first question content` and `conversation trajectory`.
-   **Response Adaptation**: Persona determines tone (Professional, Warm, Technical, Balanced), depth (High detail, Accessible, Deep, Medium), and emphasis (Impact, Interests, Methods, Breadth).

## Project Structure

```
ask.coty/
├── client/                 # Frontend React + Vite app
│   ├── src/
│   │   ├── components/     # UI components (follow-up-card, etc.)
│   │   ├── pages/          # Page components (chat.tsx)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities (queryClient, etc.)
│   └── public/             # Static assets, PWA manifest
├── server/                 # Backend Express app
│   ├── kb/                 # Knowledge base modules
│   ├── routes.ts           # API endpoints, SSE streaming
│   └── intent-analyzer.ts  # Query routing logic
├── shared/                 # Shared types and schemas
│   └── schema.ts           # TypeScript types, Zod schemas
├── docs/                   # Documentation
│   ├── ADR-001-RAG-Architecture.md
│   └── design_guidelines.md
├── script/                 # Build scripts
├── attached_assets/        # User-provided assets
├── .screenshots/           # Test screenshots (gitignored)
├── replit.md               # Project documentation (this file)
└── [config files]          # vite, tailwind, tsconfig, etc.
```

## External Dependencies

-   **AI/LLM Providers**:
    -   OpenAI Platform (API and hosted usage)
    -   Anthropic Platform (Claude API)
-   **Local AI Development**:
    -   LM Studio (local model hosting)
-   **AI Orchestration & Tools**:
    -   LangChain
    -   LangGraph
    -   LangSmith
    -   BAML (structured LLM output extraction)
    -   AG-UI (Agent-User Interaction Protocol)
-   **Frontend Development**:
    -   React
    -   Vite
-   **Backend Development**:
    -   Express.js
-   **PWA**:
    -   `manifest.json`
-   **Environment Variables**:
    -   `OPENAI_API_KEY`
-   **Design Systems & Tokens (Coty's Stack, indirectly integrated via content)**:
    -   Figma
    -   Token Studio for Figma
    -   W3C Design Tokens Community Group (DTCG)
-   **Product/Platform/Ops Tooling (Coty's Stack, indirectly integrated via content)**:
    -   Zuora
    -   Zendesk
    -   Zapier
    -   Typeform
    -   Box Sign
-   **Docs, Specs & Formats (Coty's Stack, indirectly integrated via content)**:
    -   OpenAPI
    -   Markdown
    -   YAML
    -   JSON
    -   Mermaid
-   **Dev & Automation Utilities (Coty's Stack, indirectly integrated via content)**:
    -   JavaScript
    -   GitHub

---

## Pre-Response Disambiguation Flow (Technical Reference)

When users ask broad questions like "What tools does Coty use?", the system intercepts BEFORE calling OpenAI to prevent walls of text.

### Detection Logic (`isBroadQuery` in server/routes.ts)
1. First check if query is already focused (contains qualifiers like "AI tools", "design tools")
2. If focused → skip disambiguation, proceed to normal response flow
3. If matches broad patterns → trigger disambiguation with topic chips

### Broad Patterns Detected
```regex
^what (tools?|tech|technologies|software|stack)
^tell me about .*(tools?|skills?|experience|background)
^what does coty (use|work with|know)
^what('s| is) coty's? (stack|expertise|skills?)
```

### Focused Patterns (Bypass Disambiguation)
```regex
(ai|llm|design|development|automation|engineering) tools?
design system, context engineering, product architecture
recent project, methodology, agent framework, ag-ui
```

### SSE Event Types
| Event Type | Purpose | Behavior |
|------------|---------|----------|
| `followup_prompt` | Pre-response disambiguation | Short-circuits before LLM call, shows topic chips |
| `delta` | Text content streaming | Normal response flow |
| `done` | Stream complete | Cleanup signal |

### Client Handling (chat.tsx)
1. On `followup_prompt` event:
   - Remove empty assistant placeholder message
   - Set `preResponsePrompt` state with acknowledgment + topic chips
   - Render disambiguation card as standalone system element
2. User clicks chip → `handleFollowUpClick`:
   - Clear disambiguation prompt
   - Submit focused query via `handleSubmit`
3. Focused query bypasses `isBroadQuery` → streams normal AI response

### Example Flow
```
User: "What tools does Coty use?"
  ↓ (detected as broad)
Server: { type: "followup_prompt", acknowledgment: "That's a broad topic!", followups: [...] }
  ↓
Client: Shows disambiguation card with chips: [AI & LLM Tools] [Design Tools] [Development Tools]
  ↓
User clicks: "AI & LLM Tools"
  ↓
New query: "What AI and LLM tools does Coty work with?"
  ↓ (detected as focused - contains "AI" + "tools")
Server: Normal streaming response about Claude, OpenAI, LangChain, etc.
```

### Key Files
| File | Purpose |
|------|---------|
| `client/src/pages/chat.tsx` | SSE handling, `preResponsePrompt` state, renders disambiguation |
| `client/src/components/follow-up-card.tsx` | Topic chip component |
| `server/routes.ts` | `isBroadQuery()`, `getFollowUpSuggestions()`, SSE emission |

### Key Functions (routes.ts)
| Function | Purpose |
|----------|---------|
| `isBroadQuery(question, moduleCount)` | Detects if query needs disambiguation |
| `getFollowUpSuggestions(question, modules)` | Generates topic chips based on matched KB modules |