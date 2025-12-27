// Knowledge Base Modules for Coty Beasley
// Based on the Professional Knowledge Base for AI Agent Context
// Enhanced with detailed PersonDossier content (v1.0, 2025-12-15)

// Module types for knowledge graph organization
export type ModuleType = "primary" | "auxiliary";

// Relationship types between modules
export type RelationshipType = 
  | "applies-to"      // A skill/concept Coty applies to their work
  | "example-of"      // A concrete example of a concept
  | "related-concept" // Conceptually related topics
  | "deep-dive"       // More detailed exploration of a topic
  | "context-for";    // Provides background context

export interface ModuleRelationship {
  moduleId: string;
  type: RelationshipType;
}

export interface KBModule {
  id: string;
  keywords: string[];
  content: string;
  // Knowledge graph metadata
  moduleType: ModuleType;           // "primary" = about Coty, "auxiliary" = general concepts
  relationships?: ModuleRelationship[];  // Connections to other modules
}

export const modules: KBModule[] = [
  {
    id: "identity",
    keywords: ["who", "what", "do", "does", "about", "coty", "introduction", "overview", "summary", "describe", "tell", "role", "identity"],
    moduleType: "primary",
    relationships: [
      { moduleId: "differentiator", type: "related-concept" },
      { moduleId: "responsibilities", type: "deep-dive" },
      { moduleId: "job_titles", type: "related-concept" },
    ],
    content: `# Identity & Overview

**Name:** Coty Beasley
**Role:** Architect-Operator: Distributed Product Systems Coherence
**Website:** coty.design
**Company Founded:** Underline Technologies (open-access fiber network platform)

**Executive Summary:**
Coty operates at the intersection of distributed product architecture, design infrastructure, and operational systems engineering, architecting product coherence across visual design, technical platforms, and operational workflows.

**Core Capability:** Semantic control - defining canonical rules, schemas, contracts, and interface specifications that prevent complex multi-party products from fracturing into contradiction.

**Identity:** Architect-operator - defines system shape, communicates the rules, and validates they work in practice through hands-on work and implementation-aware design.

**Simultaneous Modes:**
- Design systems architect (foundational infrastructure)
- Product architect (multi-system coherence)
- Context engineer (how AI understands information)
- Technical communicator (alignment via artifacts)
- Pioneer of emerging technologies in domain
- Entrepreneur/infrastructure builder (telecom + civic networks)

**Primary Domains:**
- Design systems architecture
- Product architecture
- Context engineering
- Technical communication
- Emerging technologies
- Infrastructure building`,
  },
  {
    id: "differentiator",
    keywords: ["differentiator", "unique", "different", "special", "stand out", "positioning", "rare", "combination", "why", "choose"],
    moduleType: "primary",
    relationships: [
      { moduleId: "semantic_control", type: "example-of" },
      { moduleId: "methodology", type: "related-concept" },
    ],
    content: `# Unique Positioning & Differentiators

**Key Differentiators:**
- Semantic control (canonical meaning, naming, contracts)
- Cross-domain coherence (UX + API + ops + infra)
- Infrastructure-first design systems (tokens as contracts)
- Workflow semantics and distributed responsibility clarity
- Specs/diagrams as governance artifacts
- Emerging-tech pioneering (AI context, tokens, IoT)

**Bridges Verticals:**
- Design systems + product architecture + infrastructure engineering
- Distributed systems through multiple lenses: technical (IoT, telecom), organizational (workflows), and user-facing (UX)
- Pioneers at intersection of emerging domains: AI + design systems, smart home + medical devices, telecom + civic tech

**Rare Combination:**
- Design depth (tokens, systems, UI, accessibility)
- Technical breadth (APIs, infrastructure, IoT, ML)
- Product thinking (strategy, workflows, operations)
- Communication clarity (specs, diagrams, presentations)
- Pioneer mentality (emerging tech, novel domains, new patterns)

**What I Am (Architect-Operator):**
Someone who defines the system shape, communicates the rules, and validates they work in practice. Defines architecture, encodes governance, ensures practical viability.

**What I Am Not:**
- Not primarily a people manager (though capable)
- Not a pure IC-only contributor (though hands-on)
- Not strategist-only (though sets direction)
- Not pure designer, engineer, or product manager - operates across all three`,
  },
  {
    id: "skills",
    keywords: ["skills", "abilities", "expertise", "technologies", "tech", "stack", "tools", "software", "programs", "proficient", "capable", "competencies", "know", "can"],
    moduleType: "primary",
    relationships: [
      { moduleId: "design_tokens", type: "applies-to" },
      { moduleId: "context_engineering", type: "applies-to" },
    ],
    content: `# Skills & Expertise

## Design & UX Skills

**Design Systems Architecture (Expert - Pioneering level):**
- Design token structure and taxonomy (DTCG-aligned)
- Token authoring + computed values exploration
- Algorithmic token variations and intelligent operations
- Dark/light mode strategy with context transforms
- Component library architecture and governance
- Design infrastructure for organization-wide coherence
- Design-code alignment as architectural discipline

**Visual Design:**
- Color science (OKLCH, perceptual uniformity, accessibility)
- Typography systems
- Spacing systems
- Complex UI design (ops, billing, onboarding)

**User Experience:**
- Multi-party workflow design (subscriber/platform/provider)
- Onboarding and product discovery
- Internal tool UX (ops/admin/support)
- Accessibility-first UX and constraints thinking
- Conversational AI interface design
- Systems-to-UX coherence (surface true state meaningfully)

**Design Tools:**
- Figma (variables, modes, systems, prototyping)
- Token tooling (Tokens Studio + alternatives)
- Diagramming (Mermaid, ERD)
- Storybook/component documentation alignment
- Specification-driven design workflows

## Technical & Engineering Skills

**Software Development:**
- Vue.js (Vue 3)
- JavaScript/TypeScript
- YAML configuration and definitions
- JSON and JSON-LD
- Markdown documentation/spec writing

**Architecture & Systems:**
- API design (RESTful)
- OpenAPI specification authoring
- Database/schema modeling (incl. Zuora objects/structures)
- Multi-party workflow and state machine design
- Event-driven architecture semantics
- Naming conventions and governance systems
- Distributed systems thinking

**Infrastructure & DevOps:**
- Home Assistant automation
- ESPHome device firmware/configuration
- WLED lighting control ecosystems
- WS2811 LED infrastructure design
- Networking integration and reliability practices
- Local-first distributed architecture

**Data & Information Systems:**
- Context engineering for AI systems
- Ontological strategies and knowledge graphs
- Data dictionary design and semantics
- Workflow state/status semantics
- Billing and operational data modeling
- Retrieval-oriented knowledge organization

## AI/LLM & Agent Tooling

**LLM Platforms & APIs:**
- OpenAI Platform (GPT-4, API patterns, function calling, assistants)
- Anthropic Platform (Claude models, API design, system prompts)
- Claude Code (agentic coding assistant, autonomous development workflows)

**Local/Self-Hosted LLM Tools:**
- LM Studio (local model hosting, GGUF model management, API compatibility)
- Ollama patterns and local inference strategies

**Agent Frameworks & Orchestration:**
- LangChain (chains, tools, memory patterns, document loaders)
- LangGraph (stateful agent workflows, cycles, human-in-the-loop)
- LangSmith (tracing, evaluation, debugging agent behavior)
- BAML (Boundary ML - structured generation, type-safe LLM outputs)

**Agentic UI Protocols:**
- AG-UI (Agent-User Interaction Protocol - bi-directional agent-frontend communication)
- A2UI patterns (declarative agent-driven UI components)
- Tool visualization and reasoning display patterns
- Human-in-the-loop approval workflows

**Applied AI Patterns:**
- RAG architecture (retrieval-augmented generation)
- Intent analysis and semantic routing
- Prompt engineering and context window optimization
- Evaluation loops and response quality assessment
- Multi-agent orchestration and coordination`,
  },
  {
    id: "responsibilities",
    keywords: ["responsibilities", "work", "job", "do", "does", "day", "daily", "tasks", "activities", "scope"],
    moduleType: "primary",
    relationships: [
      { moduleId: "design_systems_architecture", type: "applies-to" },
      { moduleId: "context_engineering", type: "applies-to" },
      { moduleId: "semantic_control", type: "applies-to" },
    ],
    content: `# Core Responsibilities

## 1. Design Systems Architecture Infrastructure
Architect foundational infrastructure enabling coherent UX at scale; treat design systems as infrastructural systems, not just component libraries.

**Design Token Architecture Activities:**
- Research token editors supporting computed values and intelligent operations (e.g., contrast-maximizing color selection, algorithmic variations)
- Structure token taxonomy (brand attributes, visual foundations, semantic tokens) aligned to DTCG-style specification principles
- Build dark/light mode strategy using Figma variables and modes; focus on transformation rules across contexts
- Create token categories (fill, text, outline, elevation, motion) with explicit relationships and constraints
- Design naming conventions to prevent entropy and communicate intent to designers and engineers
- Treat tokens as contracts linking design intent to implementation reality

**Implementation-Design Alignment:**
- Tie design libraries to component libraries/Storybook to reduce drift
- Define component schemas with explicit typography references, spacing relationships, and sizing rules
- Treat design-code alignment as a first-class architectural problem
- Build infrastructure that makes synchronization economical and sustainable
- Ensure teams trust rules by making governance explicit and usable

**Why it matters:** Design systems fail at scale when treated as libraries; succeed when treated as governed infrastructure with trusted contracts and maintainable semantics.

## 2. Product Architecture (Multi-System Coherence)
Define conceptual and technical shape of complex products spanning UX, APIs, data, and operational workflows; make products coherent under multi-team and multi-party reality.

**API-as-Product Architecture:**
- Define requirements where API is the product (not an implementation detail)
- Design schema exploration and discovery interfaces for large conceptual spaces
- Build versioning strategies balancing backward compatibility with evolution
- Create sandbox environments for safe experimentation and partner testing
- Distinguish internal vs external APIs with differing governance requirements
- Produce OpenAPI specifications as canonical contracts
- Author structured YAML object models (e.g., Invoice, InvoiceItem, enums, status flows)

**Core View:** API quality is primarily semantic and schema-driven: clarity of mental model, consistency under edge cases, and coherent contracts over time.

## 3. Context Engineering
Architect how AI and human systems discover, organize, and retrieve information; make implicit relationships explicit and machine-reasonable.

**Ontological Strategies for LLM Context:**
- Research open-source AI tools for assembling high-signal context from knowledge bases
- Explore how LLMs discover what data exists and where to find it
- Investigate knowledge graphs and OntologyRAG/OntoRAG approaches
- Define entity types, relationships, hierarchies, constraints, and exceptions
- Aim for reasoning over domain models, not mere keyword matching
- Design context flow: user needs → retrieval structure → coherent answer/action

## 4. Technical Communication
Produce artifacts that enforce alignment: specs, diagrams, and communication that turn implicit assumptions into explicit governance.

**Specification Production:**
- Write OpenAPI specifications as canonical API contracts
- Maintain structured YAML object definitions readable by systems and humans
- Create webhook payload specifications for partner integrations
- Author technical presentations separating vision, impact timing, and construction details
- Capture requirements with semantic precision and enforceable language
- Use specs as pre-work governance, not post-hoc documentation`,
  },
  {
    id: "workflow_orchestration",
    keywords: ["workflow", "orchestration", "multi-party", "handoff", "event", "naming", "status", "state", "order", "fulfillment", "distributed"],
    moduleType: "primary",
    relationships: [
      { moduleId: "semantic_control", type: "applies-to" },
      { moduleId: "projects", type: "example-of" },
    ],
    content: `# Multi-Party Workflow Orchestration

## Core Activities
- Design voice service order fulfillment workflows with explicit state semantics
- Define cross-party handoffs and expectations (subscriber, Underline, provider)
- Specify responsibility at each stage to avoid ambiguous failure modes
- Build components and status systems that reflect distributed work reality
- Iterate heavily on event naming conventions (hierarchy, tense, separators, simplification rules)
- Use aggregation rules for customer-facing status vs internal detail

## Thinking Pattern
Use taxonomy: past-tense for completed events, present-tense for state; hierarchical naming to avoid ambiguity; naming is governance.

## Example: Voice Service Order Fulfillment
**Key Questions Addressed:**
- Which parties are involved? (subscriber, Underline, provider)
- What does each party know at each stage? (context boundaries)
- Which statuses are semantically meaningful to customers and ops?
- How should events be named (taxonomy, tense, hierarchy)?
- What does the UI surface given this architecture?

## Operational Platform Semantics

**Support Routing & Traceability:**
- Design support routing frameworks distinguishing internal handling vs provider escalation
- Maintain historical traceability across channels/systems so requests do not get lost
- Treat support semantics as product surface, not back-office noise

**Billing Migration & Semantics (Zuora):**
- Treat billing migration as product work, not an ops chore
- Design invoice status mapping semantics and filtering constraints
- Create calculated statuses (e.g., autopaid logic) bridging stored truth and customer-comprehensible truth
- Work with Zuora objects/tables (e.g., ProductRatePlanCharge, tier tables)
- Define import field mappings, accounting code IDs, and data model alignment
- Ensure billing UI semantics match underlying financial realities without confusing customers
- Build semantics that support operations, finance, and customer support
- Encode governance so future changes don't fracture meaning

**Why it matters:** Operational platforms fail when semantics are hidden; coherence requires explicit, user-meaningful contracts that reconcile system truth with human understanding.`,
  },
  {
    id: "experience",
    keywords: ["experience", "worked", "career", "history", "background", "companies", "industries", "domains", "sectors", "verticals"],
    moduleType: "primary",
    relationships: [
      { moduleId: "projects", type: "related-concept" },
      { moduleId: "skills", type: "related-concept" },
    ],
    content: `# Experience & Domain Expertise

## Cross-Vertical Problem Solving
Not a vertical specialist; applies coherence/contract architecture to hard distributed problems across domains:

**Design Systems & Token Governance**
- Token architecture, computed values, algorithmic variations
- DTCG-aligned taxonomy and dark/light mode strategies

**Telecommunications Infrastructure:**
- Open-access fiber network platforms (Underline Technologies)
- Multi-party service delivery
- Provisioning/network operations conceptual understanding
- Regulatory/business-model awareness

**Financial & Billing (Zuora expertise):**
- Zuora object modeling and operational semantics
- Invoice and billing meaning design
- Subscription and tiered pricing models
- Accounting code mapping awareness
- Payment status and calculated status patterns

**Medical & Healthcare:**
- HIPAA-aware governance mindset
- Accessibility and compliance constraints
- Provider/patient workflow sensitivity
- MCAT prep platform with tokenized design system
- Educational platform design for sustained learning

**Smart Home & IoT:**
- Home Assistant ecosystem expertise
- Distributed IoT networks and integrations
- LED control systems design (WLED/WS2811)
- Custom hardware integration
- Local-first and cloud-optional architecture

**Civic & Community Technology:**
- Open-access community networks
- Community benefit orientation
- Governance/regulatory context awareness
- Volunteer/community involvement (Rotary)

**Psychiatric Practice IT:**
- HIPAA-aware constraints
- Healthcare workflow sensitivity

## Employment Model
- Holds multiple W-2 roles with distinct focus areas
- Transfers architectural insights across domains
- Maintains consulting/part-time work capability
- Uses autonomy to pursue deep technical and design infrastructure work`,
  },
  {
    id: "methodology",
    keywords: ["methodology", "approach", "how", "process", "philosophy", "principles", "thinking", "work", "style", "method"],
    moduleType: "primary",
    relationships: [
      { moduleId: "semantic_control", type: "context-for" },
      { moduleId: "differentiator", type: "related-concept" },
    ],
    content: `# Methodology & Approach

## 1. Architectural Thinking Pattern
**Rule:** Start with coherence, then add detail.

**Steps:**
1. Semantic clarity (entities, relationships, meanings of status/state/party)
2. Explicit contracts (interfaces, boundaries, responsibilities)
3. Naming governance (conventions preventing ambiguity and drift)
4. Cascade to detail (UI, tokens, workflows, implementation checks)

**Key Insight:** If you can't draw it clearly, the system isn't clear. Diagrams become the architecture.

## 2. Infrastructure-First Mindset
- Infrastructure is not overhead; it determines scalability and coherence
- Sound infrastructure makes new features cheaper and safer
- Chaotic semantics makes every future change harder
- Trust in rules is a product capability

## 3. Abstraction Level Mobility
- High-level strategy (3-year architecture enablement)
- Medium-level design (system support for scale/multi-market)
- Detail-level validation (contrast/token correctness, naming compliance)

## 4. Artifacts Not Just Words
**Outputs:**
- Specifications (OpenAPI, YAML, webhook payloads)
- Diagrams (Mermaid, architecture visuals)
- Design systems (Figma tokens/components)
- Structured documents (ADRs, templates, conventions)
- Governance frameworks (naming, schemas, status models)
- Presentations that persist as reference artifacts

## 5. Validation Through Building
Prove architecture works by building it. Operate as architect-operator who defines, builds, and validates systems rather than just designing on paper.

**Working Style:**
- Collaborative and transparent
- Data-informed but not data-driven
- Balances craft with pragmatism
- Values clarity over cleverness
- Embraces constraints as creative opportunities`,
  },
  {
    id: "projects",
    keywords: ["projects", "portfolio", "examples", "case", "studies", "built", "created", "designed", "made", "shipped", "underline"],
    moduleType: "primary",
    relationships: [
      { moduleId: "experience", type: "related-concept" },
      { moduleId: "design_systems_architecture", type: "example-of" },
    ],
    content: `# Projects & Examples

## Underline Technologies
Founded open-access fiber network platform serving communities.

**Activities:**
- Navigate networking/provisioning complexity and multi-party service delivery
- Address telecom infrastructure + regulatory + community needs
- Build product at intersection of civic tech, infrastructure, and UX
- Encode operational reality into coherent product semantics

**Complexity Navigated:**
- Telecom infrastructure technical complexity
- Multi-party service delivery
- Regulatory environment
- Community needs and civic benefit

## Design Systems Architecture Example
Architecting a design token system with DTCG specification:
- Research token editors supporting computed values and intelligent operations
- Structure token taxonomy aligned to DTCG-style specification principles
- Build dark/light mode strategy using Figma variables and modes
- Create token categories (fill, text, outline, elevation, motion) with explicit relationships
- Design naming conventions that prevent entropy
- Treat tokens as contracts linking design intent to implementation reality

## Product Architecture Example
Multi-party workflow for voice service order fulfillment:
- Defined explicit state semantics for each workflow stage
- Created party responsibility matrix (subscriber, platform, provider)
- Established event naming conventions with hierarchy and tense
- Designed status aggregation and cross-party handoff expectations
- Used taxonomy: past-tense for completed events, present-tense for state

## Internal Tools as Product
- Drive redesign of internal operations tool for multi-market and external partner use
- Define navigation groupings and admin structures that scale with domain complexity
- Name entities carefully (avoid conflating user vs account, etc.)
- Treat multi-market scaling as architecture (not just additional fields)
- Ensure permissions/admin surfaces map to real responsibilities
- Make complexity navigable through clear information architecture`,
  },
  {
    id: "emerging_tech",
    keywords: ["emerging", "technologies", "ai", "iot", "smart", "home", "automation", "future", "frontier", "innovation", "new", "led", "wled", "esphome", "home assistant"],
    moduleType: "primary",
    relationships: [
      { moduleId: "skills", type: "related-concept" },
      { moduleId: "context_engineering", type: "applies-to" },
    ],
    content: `# Emerging Technologies

## AI-Driven Interfaces
- Lead design for conversational AI onboarding and product selection
- Evaluate LLM capabilities and benchmarks for UI generation and visual reasoning
- Design how AI systems interpret design intent and user context
- Build collaboration interfaces for human-AI work
- Emphasize coherent context and intent modeling

## Smart Home & IoT Infrastructure
**Expert in Home Assistant, ESPHome, WLED automation ecosystem:**
- Design LED control systems and WS2811 infrastructure
- Architect distributed IoT networks with local-first automation
- Integrate custom hardware and networking solutions
- Optimize for reliability and cloud-optional control
- Apply distributed-state lessons back into product workflow design

## Color Science & Accessibility
- Deep expertise in OKLCH and perceptually uniform color spaces
- Design accessible color systems with predictable contrast across hues
- Use perceptual uniformity to enable programmatic palette generation
- Treat accessibility as systemic constraint, not a patch

## Medical & Healthcare Platforms
- Design MCAT prep platform with tokenized design system aligned to DTCG principles
- Account for medical constraints, compliance, and accessibility needs
- Design educational interfaces supporting sustained engagement
- Apply precision/clarity lessons from high-stakes domains

## Civic Infrastructure Technology
- Founded Underline Technologies: open-access fiber network platform serving communities
- Design for distributed infrastructure where product is network + operations + UX
- Understand telecom provisioning and multi-party service delivery needs
- Consider community benefit and civic participation implications

**Why This Matters:**
Transferable architecture patterns apply across domains; frontier tech increases the need for explicit semantics and coherent infrastructure. Not a vertical specialist - an architect applying design infrastructure thinking to any domain entered.`,
  },
  {
    id: "value",
    keywords: ["value", "impact", "outcomes", "results", "benefits", "why", "hire", "help", "solve", "problem"],
    moduleType: "primary",
    relationships: [
      { moduleId: "differentiator", type: "related-concept" },
      { moduleId: "semantic_control", type: "context-for" },
    ],
    content: `# Value & Impact

## Core Problem Solved: System Incoherence

**Symptoms of System Incoherence:**
- UI contradicts data model
- API docs contradict implementation
- Billing semantics confuse customers and teams
- Support can't route due to ambiguous statuses
- Tokens work in one surface but break elsewhere
- Multi-party handoffs fail silently

**Root Cause:**
Teams optimize locally (velocity, simplicity, expressiveness, stability) without semantic control and explicit contracts.

## Prevention Mechanisms
- Schema governance (entities/properties/relationships)
- Naming conventions (status/event/party/context meaning)
- Workflow semantics (responsibility, failure handling, proof)
- Design infrastructure (token transforms, design-code alignment)

## Impact Areas

**Design Systems:**
- Infrastructure that scales design decisions
- Reduced maintenance through computed values
- Semantic guarantees preventing inconsistency

**Product Architecture:**
- Explicit contracts defining responsibilities
- Clear handoffs between parties
- Schema governance preventing ambiguity

**Technical Communication:**
- Specifications as governance
- Diagrams that are the architecture
- Visual narratives for mixed audiences

**Organization Building:**
- Teams finding what they need
- Decisions understood and not repeated
- Knowledge structured for retrieval

## Measurable Outcomes
- Reduced rework from misalignment
- Faster integration between systems
- Lower support burden from ambiguity
- Increased team velocity through clarity
- Partners integrate against clear contracts
- Vendor work governed by explicit semantics
- Technical decisions become reproducible`,
  },
  {
    id: "communication",
    keywords: ["communication", "presentation", "specs", "diagrams", "documentation", "artifacts", "mermaid", "openapi", "yaml"],
    moduleType: "primary",
    relationships: [
      { moduleId: "methodology", type: "related-concept" },
    ],
    content: `# Technical Communication & Specification

## Specification Documentation
- OpenAPI specs as canonical contracts
- YAML object model definitions
- Event naming conventions and hierarchies
- Technical requirements capture
- Architecture documentation as governance

## Diagramming & Visualization
- Mermaid diagrams for workflows and system interactions
- ERDs and system architecture diagrams
- Visual communication of complex systems
- Architecture storytelling artifacts
- Prefer drawing the system as a test of clarity; if it can't be drawn, it isn't clear

## Presentation & Teaching
- Technical presentations for mixed audiences
- Vision-impact-timing narrative structure
- Interview-based architecture discovery
- Collaborative facilitation
- Clarity under time constraints

## Cross-Functional Collaboration
- Design ↔ engineering alignment
- Product ↔ operations integration
- Technical ↔ non-technical communication
- Partner communication and integration support
- Vendor evaluation and relationship management

## Key Principle
Use specs as pre-work governance, not post-hoc documentation. Well-written specs prevent ambiguity that otherwise becomes bugs, missed requirements, and partner friction.`,
  },
  {
    id: "product_skills",
    keywords: ["product", "strategy", "operations", "internal", "tools", "marketplace", "multi-tenant", "scaling"],
    moduleType: "primary",
    relationships: [
      { moduleId: "responsibilities", type: "related-concept" },
      { moduleId: "workflow_orchestration", type: "example-of" },
    ],
    content: `# Product & Strategy Skills

## Product Architecture
- API-as-product platform design
- Multi-system coherence and schema governance
- Operational platform semantics (billing/support/provisioning)
- Product-led growth mechanics (landing/onboarding patterns)
- Marketplace and multi-tenant thinking
- Multi-market scaling as architecture

## Product Strategy & Communication
- Technical vision and impact communication
- Cross-functional alignment via specs
- Technical ↔ non-technical translation
- Presentation design for mixed audiences
- Technical presentation under time constraints
- Partner-facing clarity and integration readiness

## Product Operations
- Workflow/handoff design
- Internal tool architecture
- Process documentation and governance
- Support routing/escalation frameworks
- Multi-market scaling and localization strategy
- Traceability across systems/channels

## Internal Tools as Product
- Drive redesign of internal operations tool for multi-market and external partner use
- Define navigation groupings and admin structures that scale with domain complexity
- Name entities carefully (avoid conflating user vs account, etc.)
- Treat multi-market scaling as architecture (not just additional fields)
- Ensure permissions/admin surfaces map to real responsibilities
- Make complexity navigable through clear information architecture

**Why it matters:** Internal tool clarity reduces operational risk; ambiguity in ops tooling propagates into customer experience and partner reliability.`,
  },
  {
    id: "design_tokens",
    keywords: ["design tokens", "tokens", "token", "design", "colors", "fonts", "spacing", "variables", "figma", "css", "consistent", "consistency", "dtcg", "visual"],
    moduleType: "auxiliary",
    relationships: [
      { moduleId: "skills", type: "applies-to" },
      { moduleId: "design_systems_architecture", type: "context-for" },
    ],
    content: `# Design Tokens Explained

## What Are Design Tokens?

Think of design tokens as a **shared vocabulary for visual design decisions**. They're named values - like "brand-blue" or "spacing-medium" - that everyone on a team uses instead of raw numbers or hex codes.

**Simple Example:**
Instead of a designer saying "use #3B82F6" and an engineer typing "color: #3B82F6", both use a token called "primary-color". If the brand color changes, you update it once, and it changes everywhere.

## Why Do They Matter?

**The Problem They Solve:**
- Designer picks one blue, engineer uses a slightly different blue
- Mobile app uses 16px spacing, web uses 14px
- Dark mode looks broken because colors weren't planned together
- Updating the brand requires hunting through thousands of files

**How Tokens Help:**
- **Single source of truth** - one place to update, changes flow everywhere
- **Consistency** - same visual language across platforms
- **Communication** - designers and engineers speak the same language
- **Scalability** - new products automatically inherit the right values

## Coty's Approach to Design Tokens

Coty treats design tokens as **contracts between design and engineering**, not just convenience. Key aspects:

**Infrastructure, Not Library:**
- Tokens aren't just a list of colors - they're organized into a system
- Categories like fill, text, outline, elevation, and motion
- Explicit relationships between tokens (this text color works on this background)

**Computed Values:**
- Tokens that calculate from other tokens (e.g., "lighter" variations computed automatically)
- Dark mode as a transformation layer, not separate values
- Accessibility built in (contrast calculated, not guessed)

**DTCG-Aligned:**
- Following the Design Token Community Group specification
- Tokens work across tools (Figma, code, documentation)
- Machine-readable format that tools can process

## Real-World Application

In a design system, tokens might be organized like:
- **Brand attributes:** Logo colors, brand fonts
- **Visual foundations:** Base palette, type scale, spacing scale
- **Semantic tokens:** "error-color", "success-background", "button-text"
- **Component tokens:** Specific to buttons, cards, inputs

The key insight: tokens make implicit design decisions explicit and enforceable.`,
  },
  {
    id: "context_engineering",
    keywords: ["context engineering", "context", "ai", "llm", "prompt", "rag", "retrieval", "knowledge", "ontology", "information", "machine", "reasoning", "langchain", "langgraph", "langsmith", "baml", "ag-ui", "agui", "openai", "anthropic", "claude", "gpt", "lm studio", "ollama", "agent", "agentic"],
    moduleType: "auxiliary",
    relationships: [
      { moduleId: "skills", type: "applies-to" },
      { moduleId: "responsibilities", type: "applies-to" },
      { moduleId: "emerging_tech", type: "related-concept" },
    ],
    content: `# Context Engineering Explained

## What Is Context Engineering?

Context engineering is the practice of **organizing information so AI can find and use it well**. It's about setting up knowledge in a way that helps AI give you the right answer, not just any answer.

**Simple Analogy:**
Imagine giving directions to someone new in town. Just handing them a map isn't enough - you need to mark landmarks, explain which areas to avoid, note which streets are one-way. Context engineering does this for AI: it prepares information so AI can navigate and understand it.

## Why Does It Matter?

**The Problem:**
AI tools like ChatGPT are impressive, but they can only work with what you give them. If you give AI messy or incomplete information:
- It makes things up (called "hallucinations")
- It gives answers that miss the point
- It can't find information you know exists
- It misses obvious connections between ideas

**Good Context Fixes This:**
- Information organized into clear, findable pieces
- Connections between ideas spelled out
- The right information shows up at the right time
- AI can think through problems, not just search for keywords

## How Coty Approaches This

Coty applies the same organized thinking used in design systems to how information is structured for AI:

**Clear Categories:**
- Define what types of things exist (people, products, events)
- Spell out how things relate to each other
- Note the rules and exceptions
- Help AI understand the domain, not just find words

**Smart Retrieval:**
- Set up knowledge so questions find the right answers
- Design the path from "what the user asked" to "what they need"
- Build a flow: user asks → system finds relevant info → coherent answer

**Connected Information:**
- Ideas linked by meaningful relationships
- AI can follow connections between concepts
- Expert knowledge built into the structure itself

## Practical Examples

**This App Uses Context Engineering:**
- Knowledge organized into topic modules
- Keywords route questions to relevant content
- AI only answers from provided information (so it can't make things up)
- Structure designed to help find things, not just store them

**In Products:**
- How do sign-up flows help AI understand new users?
- How do support systems find the right help article?
- How do design tools help AI understand what you're trying to create?

The key insight: AI is only as good as the information you give it. Organizing that information well is a skill, and Coty treats it as a design discipline.`,
  },
  {
    id: "semantic_control",
    keywords: ["semantic control", "semantic", "semantics", "meaning", "naming", "contracts", "governance", "consistency", "coherence", "ambiguity", "clarity"],
    moduleType: "auxiliary",
    relationships: [
      { moduleId: "differentiator", type: "applies-to" },
      { moduleId: "methodology", type: "applies-to" },
      { moduleId: "value", type: "context-for" },
    ],
    content: `# Semantic Control Explained

## What Is Semantic Control?

Semantic control is about **making sure everyone means the same thing when they use the same words**. It's the practice of agreeing on definitions and keeping them consistent across teams, systems, and time.

**Simple Example:**
In one system, "user" means the person logged in. In another, "user" means the account that pays. In a third, "user" means anyone who visits. When these systems need to work together, chaos follows. Semantic control prevents this by agreeing on one clear definition everyone uses.

## Why Does It Matter?

**Without Semantic Control:**
- Support can't route tickets because "pending" means different things in different systems
- The screen says "Active" but the database says "enabled" - are they the same?
- Two teams accidentally build the same feature because they used different names for it
- Partners try to connect to your system and get confused by inconsistent terms

**With Semantic Control:**
- One definition of "user" that everyone uses
- Status labels that mean the same thing everywhere
- Naming rules that prevent confusion
- Systems that stay organized as they grow

## How Coty Approaches This

Semantic control is central to how Coty approaches complex systems:

**Naming Is Control:**
- Careful naming rules across systems
- Event names organized clearly (past tense for things that happened, present tense for current state)
- A shared vocabulary that teams can reference
- Names that communicate when to use something, not just what it is

**Clear Agreements:**
- Written definitions of what each term means
- One official source that everyone trusts
- Status labels with documented meaning
- Relationships between things clearly spelled out

**Preventing Confusion Over Time:**
- Regular checks that names are being used correctly
- Diagrams that reveal when things don't match
- Keeping teams aligned with shared vocabulary
- Documentation that defines meaning, not just describes features

## Real-World Examples

**When Multiple Parties Are Involved:**
When a customer, your platform, and a service provider all touch the same order, semantic control ensures everyone knows:
- What "submitted" means at each stage
- Who is responsible at each handoff
- What the customer sees vs. internal details

**In Design Systems:**
Names for colors and styles carry meaning:
- "primary-action-background" tells you when to use it; "blue" doesn't
- Names that communicate purpose, not just appearance
- Preventing the "we have 47 shades of blue and no one knows which to use" problem

**In Software Connections:**
- Field names that are obvious to everyone
- Status values with clear meaning
- Error messages that actually help

The key insight: Systems break down not from technical failure, but from meaning confusion. Semantic control prevents the breakdown.`,
  },
  {
    id: "design_systems_architecture",
    keywords: ["design systems", "design system", "architecture", "infrastructure", "component", "library", "scale", "governance", "foundation", "tokens", "components"],
    moduleType: "auxiliary",
    relationships: [
      { moduleId: "skills", type: "applies-to" },
      { moduleId: "responsibilities", type: "applies-to" },
      { moduleId: "design_tokens", type: "deep-dive" },
    ],
    content: `# Design Systems Architecture Explained

## What Is a Design System?

A design system is a **collection of ready-made building blocks** - buttons, forms, cards, colors - that teams use to build products consistently. Instead of every designer and developer creating their own version of a button, everyone uses the same approved one.

**Simple Analogy:**
Like LEGO bricks. Instead of molding custom plastic pieces for every project, you use standardized bricks that fit together predictably. New builders can create immediately because they understand the system.

## Design System vs. Design Systems Architecture

Most people think of design systems as just a collection of pieces. Coty thinks about the bigger picture:

**The Usual View (Just a Collection):**
- A box of components
- A style guide document
- Some pattern examples
- "Here are the pieces, good luck"

**Coty's View (The Whole System):**
- How do these pieces stay consistent as the company grows?
- Who decides when to change things, and how do updates reach everyone?
- How do designers and developers stay on the same page?
- How do colors and fonts flow from design tools to the actual product?
- "Here's how the pieces stay consistent forever"

## Why the Bigger Picture Matters

**Without Thinking About the System:**
- Everything works well for 6 months, then starts falling apart
- Different teams make their own versions
- Changes don't reach everyone who needs them
- New products don't know which pieces to use
- You end up with multiple "design systems" that don't match

**With System Thinking:**
- Clear rules about who owns what
- Updates flow automatically to everyone
- New products look right from day one
- The system can grow without breaking

## How Coty Approaches This

**Tokens as Agreements:**
Design tokens aren't just values - they're promises. If a token named "primary-button-color" exists, both designers and developers agree to use it. No more "my blue is different from your blue."

**Foundation First:**
- Good foundations make adding features cheaper and safer
- Messy naming and organization make every future change harder
- Teams need to trust the system to actually use it

**Designers and Developers in Sync:**
- Design files (Figma) connected to actual code
- Changes in the design tool show up in the product
- No more "the design said one thing, but we built another"

**Clear Rules Built In:**
- Naming conventions that keep things organized
- Clear process for adding new pieces
- Everyone knows who makes decisions

## What You Get

A well-designed system enables:
- **Speed:** Teams build faster using proven pieces
- **Consistency:** Users get the same experience everywhere
- **Quality:** Accessibility and performance built in from the start
- **Growth:** New products look polished by default
- **Easy Updates:** Changes don't require hunting through old code

The key insight: Design systems fall apart when treated as just a collection of pieces. They succeed when treated as a living system with clear rules and ownership.`,
  },
  {
    id: "contact",
    keywords: ["contact", "reach", "email", "hire", "hiring", "available", "connect", "linkedin", "twitter", "social", "website", "portfolio", "location", "where", "based"],
    moduleType: "primary",
    content: `# Contact & Professional Context

## How to Connect
**Website:** coty.design

For professional inquiries, project discussions, or collaboration opportunities, visit coty.design.

## Professional Interests

**Short-term:**
- Design systems architecture projects
- Product architecture for complex distributed systems
- Context engineering for AI applications

**Long-term:**
- Infrastructure companies
- Emerging technology applications
- Civic technology and community impact

## What Coty Is Seeking
- Complex architectural challenges
- Multi-party system coherence problems
- Opportunities to apply design infrastructure thinking
- Projects at the intersection of design, engineering, and product

## Availability
- Open to full-time opportunities
- Contract and consulting work
- Advisory roles
- Speaking engagements
- Design system consulting`,
  },
  {
    id: "common_technologies",
    keywords: ["technologies", "tech", "stack", "tools", "software", "programs", "figma", "zuora", "zendesk", "zapier", "typeform", "openapi", "yaml", "json", "mermaid", "github", "flipper", "home assistant", "esphome", "wled", "common", "frequent", "use", "uses"],
    moduleType: "primary",
    relationships: [
      { moduleId: "skills", type: "related-concept" },
      { moduleId: "emerging_tech", type: "related-concept" },
    ],
    content: `# Common Technologies & Tools

This summarizes the technologies and tools Coty uses most frequently, organized by category. Items are classified as "recurring" (mentioned 2+ times in work history) or noted when less evidenced.

## Design Systems & Tokens
**Recurring:**
- Figma (variables, modes, design system work)
- Token Studio for Figma (token authoring/sync)
- W3C Design Tokens Community Group (DTCG) format/spec
- Design token schema modeling (fill/text/outline structure; sizing/typography scales)

**Adjacent Recurring:**
- Component library / Storybook initiative (design-to-dev alignment context)

**Additional (less evidenced):**
- OKLCH color space
- Style Dictionary
- Supernova

## Product/Platform/Ops Tooling
**Recurring:**
- Zuora (billing migration, object dictionary usage, imports, invoice/charge modeling)
- Zendesk (ticket creation + structured comment formatting)
- Zapier (Code actions, parsing/formatting automation)
- Typeform (intake data + integration IDs)
- Box Sign (authorization/e-signature workflow context)

**Single/Rare Mentions:**
- Intercom (integration mention)
- ServiceNow (support-routing consumer)
- Zoom Call Center (support-routing consumer)

## Docs, Specs & Formats
**Recurring:**
- OpenAPI (API specification/documentation)
- Markdown (documentation + doc-to-md workflows)
- YAML (schema/object modeling)
- JSON (payloads, schemas, integration data)
- Mermaid (sequence/flow diagrams)

**Single/Rare Mentions:**
- Coda (housing QA content)
- Flourish (visualization tooling preference)

## Dev & Automation Utilities
**Recurring:**
- JavaScript (notably Zapier code actions)
- GitHub (shared UI/component work context)
- CSV (Google Calendar import flows)

**Single/Rare Mentions:**
- AppleScript + Alfred (personal automation)
- zsh (shell)

## Smart Home/RF/IoT
**Evidenced:**
- Flipper Zero
- Sub-GHz RF control (multi-button light remote context)

**Additional (less evidenced):**
- Home Assistant
- ESPHome
- WLED
- WS2811 addressable LEDs
- UniFi / UniFi Protect (doorbell/camera ecosystem)

## AI/LLM & Agent Tooling
**Evidenced:**
- Conversational AI interface (product/design direction)

**Additional (less evidenced):**
- OpenAI (API/hosted usage)
- Vercel AI SDK
- Next.js
- LangChain / LangGraph
- Agent delivery patterns for websites

## Key Insight
Coty's highest-frequency "real stack" is enterprise workflow plumbing: billing (Zuora), support (Zendesk/ServiceNow), intake (Typeform), signatures (Box), and glue code (Zapier + schemas). This reflects work that bridges operations, product, and technical systems.`,
  },
  {
    id: "job_titles",
    keywords: ["title", "job", "position", "role", "head", "principal", "architect", "technologist", "industry", "underline", "official"],
    moduleType: "primary",
    relationships: [
      { moduleId: "identity", type: "related-concept" },
      { moduleId: "differentiator", type: "context-for" },
      { moduleId: "responsibilities", type: "context-for" },
      { moduleId: "industry_seniority", type: "context-for" },
    ],
    content: `# Job Titles & Industry Positioning

## Official Title at Underline Technologies
**Head of Product Innovation & Design**

## Industry-Equivalent Title Analysis

Coty's work has been analyzed against industry title standards. Two candidate titles were evaluated:

### Candidate 1: Principal Design Technologist (Design Systems & AI Experiences)
**What it captures:**
- Design systems expertise (tokens, Figma, OKLCH color strategy)
- Front-end implementation bridging design and engineering
- Prototyping and design-code alignment

**What it misses:**
- API-as-product architecture and schema governance
- Multi-party workflow orchestration
- Billing/operational platform semantics (Zuora)
- Event naming conventions and status aggregation
- Full spectrum of product architecture work

### Candidate 2: Head of Product Architecture (Experience + Platform)
**What it captures:**
- Semantic control as core differentiator
- Multi-system coherence (UX + API + ops + infrastructure)
- Schema governance and naming conventions
- Workflow semantics and distributed responsibility
- Operational platforms treated as first-class product surfaces
- Design systems as infrastructure architecture

## Recommended Industry Title
**Head of Product Architecture (Experience + Platform)** is the more apt title.

### Why This Title Fits Better

**Core Insight:** The key differentiator is **semantic control** - preventing products from fracturing into contradictory workflows, statuses, contracts, and UI rules. This is architecture work, not primarily design execution.

**Evidence of Product Architecture Scope:**
1. **Platform-Level Product Definition:**
   - Defined API-as-product requirements with schema exploration, versioning, sandboxing
   - Produced OpenAPI specs and structured YAML object models
   - Built multi-party service delivery workflows with cross-party handoff expectations
   - Established event naming conventions (hierarchy, tense, separators, status aggregation)

2. **Multi-Party Workflow Orchestration:**
   - Designed voice service order fulfillment with components, statuses, and handoffs
   - Created support routing framework with historical traceability
   - Treat support semantics as product surface, not back-office noise

3. **Operational Platform Architecture:**
   - Billing migration treated as product work (Zuora object modeling, invoice semantics)
   - Designed calculated statuses bridging system truth and customer understanding
   - Encode governance so future changes don't fracture meaning

4. **Design Systems as Infrastructure:**
   - Token architecture, computed values, algorithmic variations
   - DTCG-aligned taxonomy and dark/light mode strategies
   - Design-code alignment as architectural discipline

### The "Head of" vs "Principal" Distinction

**Principal (IC Leadership):**
- Individual contributor track with high technical authority
- Typically 8-10+ years experience
- Acts as design architect for the org/product, establishing design principles

**Head of (Organizational Leadership):**
- Most senior position in the product team
- Oversees development and management of the company's product portfolio
- May or may not have direct reports, but owns strategic direction

**Coty's Context:**
- Founded Underline Technologies (infrastructure/fiber network platform)
- Multiple W-2 roles with distinct focus areas
- Strategic technical presentations and product strategy + PM execution
- Owns product direction across experience, platform, and operational systems

**Verdict:** "Head of" accurately reflects ownership of product direction even without managing a large team. The title signals being the accountable architect for product coherence.

### What "Product Architecture" Communicates
A Product Architect acts as a bridge between technology and business objectives, ensuring products align with customer needs and company goals across all surfaces - UX, APIs, data, and operational workflows.

## Summary
While "Principal Design Technologist" accurately captures part of Coty's work (design systems, prototyping, implementation), it undersells the system semantics, schema design, integration surfaces, and operational platform architecture. "Head of Product Architecture (Experience + Platform)" signals defining the conceptual and technical shape of a multi-system product and driving it into reality - which matches the full scope of Coty's actual work.`,
  },
  {
    id: "industry_seniority",
    keywords: ["seniority", "level", "senior", "staff", "principal", "distinguished", "fellow", "director", "head", "career", "ladder", "progression", "hierarchy", "experience", "years"],
    moduleType: "auxiliary",
    relationships: [
      { moduleId: "job_titles", type: "context-for" },
      { moduleId: "experience", type: "context-for" },
    ],
    content: `# Industry Seniority Levels

This explains common seniority levels in design, product, and engineering roles. Understanding these helps contextualize where professionals sit in the industry hierarchy.

## Individual Contributor (IC) Track

### Senior (5-8 years)
**Scope:** Project or feature-level ownership
**Characteristics:**
- Leads projects independently with minimal oversight
- Mentors junior team members
- Makes tactical decisions within established patterns
- Deep expertise in specific areas
- Trusted to deliver complex work on schedule

### Staff (8-12 years)
**Scope:** Cross-team technical leadership
**Characteristics:**
- Influences multiple teams or product areas
- Sets technical direction for major initiatives
- Resolves ambiguous, cross-cutting problems
- Creates reusable patterns others follow
- Often the go-to expert in their domain
- May not have direct reports but has significant influence

### Principal (10-15+ years)
**Scope:** Organization-wide technical authority
**Characteristics:**
- Sets direction for entire product or engineering org
- Establishes architectural principles and standards
- Accountable for technical strategy and coherence
- Recognized expert both internally and externally
- Acts as design/technical architect for the org
- Shapes how the company approaches problems
- "The buck stops here" for major technical decisions

### Distinguished / Fellow (15+ years)
**Scope:** Company-wide or industry-wide impact
**Characteristics:**
- Shapes company's technical direction at executive level
- Often has published thought leadership or patents
- Recognized as industry expert, not just company expert
- May represent company externally at conferences
- Solves problems that define the company's competitive advantage
- Rare - typically only a few per company

## Management / Leadership Track

### Director / Head of
**Scope:** Strategic ownership of a domain or function
**Characteristics:**
- Owns strategy and outcomes for a product area or discipline
- May or may not have direct reports
- Accountable for business outcomes, not just technical delivery
- Sets vision and ensures alignment across teams
- Bridges technology and business objectives
- "Head of" often indicates the most senior person in that function
- More about ownership and accountability than team size

### VP / SVP
**Scope:** Multiple domains or the entire function
**Characteristics:**
- Manages directors or department heads
- Sets strategy at the executive level
- Responsible for budget, hiring, and organizational design
- Reports to C-suite

## Key Insights

**IC vs Management Distinction:**
- IC track rewards technical depth and influence without people management
- Management track rewards organizational leadership and business ownership
- Both can reach equivalent compensation and seniority

**"Head of" Nuance:**
The "Head of" title signals strategic ownership. Unlike "Principal" which emphasizes technical authority on the IC track, "Head of" indicates accountability for the direction and success of a domain - even if the person is highly technical and hands-on. It's about owning outcomes, not just influencing decisions.

**Experience Years Are Guidelines:**
Years of experience are rough indicators, not requirements. Impact, scope of ownership, and demonstrated judgment matter more than tenure.`,
  },
];

// Helper to find a module by ID
function findModuleById(id: string): KBModule | undefined {
  return modules.find(m => m.id === id);
}

// Get related modules by following relationships
function getRelatedModules(module: KBModule): KBModule[] {
  if (!module.relationships) return [];
  
  return module.relationships
    .map(rel => findModuleById(rel.moduleId))
    .filter((m): m is KBModule => m !== undefined);
}

export function selectModules(query: string): KBModule[] {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  
  const scores = modules.map((module) => {
    let score = 0;
    
    // Keyword matching
    for (const keyword of module.keywords) {
      if (queryLower.includes(keyword)) {
        score += 2;
      }
      for (const word of words) {
        if (word.includes(keyword) || keyword.includes(word)) {
          score += 1;
        }
      }
    }
    
    // Primary modules get a small boost to prefer Coty-focused content
    if (module.moduleType === "primary" && score > 0) {
      score += 0.5;
    }
    
    return { module, score };
  });

  scores.sort((a, b) => b.score - a.score);
  
  // Get top matching modules
  const topMatches = scores.filter((s) => s.score > 0).slice(0, 2);
  
  if (topMatches.length === 0) {
    return [modules[0]]; // Default to identity module
  }
  
  // For auxiliary modules, also include related primary modules for context
  const selected = new Set<KBModule>();
  
  for (const match of topMatches) {
    selected.add(match.module);
    
    // If this is an auxiliary module, find related primary modules
    if (match.module.moduleType === "auxiliary") {
      const relatedModules = getRelatedModules(match.module);
      const relatedPrimary = relatedModules.filter(m => m.moduleType === "primary");
      
      // Add up to 1 related primary module for context
      if (relatedPrimary.length > 0) {
        selected.add(relatedPrimary[0]);
      }
    }
  }
  
  // Limit to 3 modules max
  return Array.from(selected).slice(0, 3);
}

// Get module type information for external use
export function getModulesByType(type: ModuleType): KBModule[] {
  return modules.filter(m => m.moduleType === type);
}

// Get module IDs for primary modules (useful for question generation)
export function getPrimaryModuleIds(): string[] {
  return modules.filter(m => m.moduleType === "primary").map(m => m.id);
}

// Get module IDs for auxiliary modules
export function getAuxiliaryModuleIds(): string[] {
  return modules.filter(m => m.moduleType === "auxiliary").map(m => m.id);
}

export const systemPrompt = `You are a friendly Q&A assistant that answers questions about Coty Beasley based ONLY on the provided knowledge base context.

CRITICAL RULES:
1. ONLY answer based on information in the provided context
2. If information is not in the context, respond with: "I don't have that specific information, but I can tell you about Coty's work experience, skills, projects, or background. What would you like to know?"
3. Never make up facts, dates, company names, or numbers
4. Keep answers brief and easy to understand
5. If asked about personal topics, politely guide back to professional information

KEY FACTS:
- Coty helps companies build organized, consistent products across design, technology, and operations
- Founded Underline Technologies (a community internet network company)
- Website is coty.design
- Works at the intersection of design, engineering, and product strategy
- Expert in smart home technology and automation systems

CONTEXT FIRST, THEN IMPACT - VERY IMPORTANT:
Many users have never heard of concepts like "design systems" or "product architecture." Always:
1. **Explain what it is first** - Assume the reader has never encountered this concept. Use a simple analogy or real-world comparison.
2. **Then explain why it matters** - What problem does it solve? What goes wrong without it?
3. **Then position Coty's expertise** - Now that they understand the concept, explain why Coty's skills here are rare or valuable.

KEY VALUE PROPOSITION:
Coty's skills are inherently hybrid and cross-functional. Most companies hire separate specialists for design, engineering, product strategy, and operations. Coty bridges all of these - meaning one person can do work that typically requires coordinating multiple specialists. This is rare and extremely valuable because:
- No translation gaps between disciplines
- Faster decision-making without handoffs
- Coherent vision across design, tech, and business
- Reduced coordination overhead and miscommunication

ESPECIALLY VALUABLE FOR FRONTIER INNOVATION:
Coty's hybrid skills are particularly powerful in cutting-edge and emerging technology contexts. When working on frontier challenges:
- There are no established playbooks - you need someone who can figure things out across multiple disciplines
- Traditional specialist roles don't exist yet for emerging tech - hybrid skills are essential
- Speed matters - waiting for handoffs between specialists means falling behind
- Innovation requires connecting dots across design, technology, and business that specialists in silos would miss
- Coty works with emerging technologies like AI, design tokens, and automation systems where the field is still being defined

When relevant, emphasize that Coty operates at the frontier of these fields, not just following established practices.

When describing Coty's skills, work, or achievements, always explain WHY they matter:
- **Rarity**: Explain why this skill combination is uncommon. Most people specialize in just one area - Coty bridges multiple worlds, doing the job of several specialists.
- **Impact**: Connect the work to real outcomes - time saved, problems prevented, products that actually ship and work.
- **Value**: Explain the business benefit. What would it cost to hire multiple specialists? What coordination problems does this solve?
- **Impressiveness**: Don't be shy about acknowledging when something is genuinely difficult or takes years to develop.

EXAMPLES OF CONTEXT + IMPACT:
- For design systems: "A design system is like a rulebook that keeps an app looking and feeling consistent - same colors, same buttons, same spacing everywhere. Without one, products become a patchwork of mismatched pieces. Coty builds these systems, which is rare because it requires deep expertise in both design AND engineering. Most people only know one side."
- For product architecture: "When a company builds software, someone needs to design how all the different pieces fit together - like an architect drawing up blueprints before construction. This prevents the chaos that causes projects to fail or ship late. Coty does this work, bridging design, engineering, and business strategy."
- For founding a company: "Coty founded and built Underline Technologies from scratch - a company bringing high-speed internet to communities. This meant handling everything from business strategy to technical systems to day-to-day operations, which requires a rare breadth of skills."
- For AI/automation work: "Coty is on the cutting edge of using AI tools to multiply what one person can accomplish. This isn't just about knowing the technology - it's about understanding how to apply it practically to real work."

WRITING STYLE:
- Write in plain, everyday English that anyone can understand
- Avoid technical jargon - if you must use a technical term, briefly explain what it means
- Use short sentences and simple words
- Think of explaining things to a curious friend, not a tech expert
- Be warm and conversational, not formal or stiff
- Use bullet points to make lists easy to scan
- Focus on the "what" and "why" rather than technical "how"
- Be confident when describing Coty's expertise - back it up with specifics from the knowledge base

EXAMPLES OF GOOD PLAIN ENGLISH:
- Instead of "semantic control and schema governance" say "keeping things organized and consistent"
- Instead of "distributed systems architecture" say "designing how different parts of a product work together"
- Instead of "design tokens" say "a system for keeping colors, fonts, and spacing consistent"
- Instead of "API-as-product" say "building tools that other developers can use"

Remember: Your audience may not have a technical background. Make Coty's work understandable, impressive, and interesting to everyone.`;
