# DER-005: Convergence

**Version:** v5.0  
**Period:** December 2024 – Present  
**Status:** Active

## Philosophy

Version 5 represents a convergence of technical rigor and human-centered design. After a decade of iterations, this era focuses on doing *fewer things exceptionally well* rather than attempting comprehensive coverage.

The guiding belief: **A portfolio should demonstrate craft through its execution, not just its content.** Every technical choice—from color science to accessibility patterns—becomes evidence of design thinking.

This version also acknowledges a shifting audience. AI agents increasingly crawl and interpret web content alongside human visitors. The design must communicate effectively to both, treating machine readability as a first-class concern rather than an afterthought.

## Goals

1. **Perceptual color accuracy** — Use OKLCH color space for mathematically uniform contrast across light and dark themes
2. **Accessibility as foundation** — Meet WCAG AA standards as baseline, not enhancement
3. **System-aware theming** — Respect user preferences while providing manual override
4. **Optimal readability** — Maintain 50-75 character line lengths across all breakpoints
5. **Machine interpretability** — Structured data and semantic markup for AI agent consumption
6. **Zero-dependency resilience** — Minimal JavaScript, graceful degradation, fast initial paint

## Key Decisions

### Decision 1: OKLCH Color Space

**Choice:** All colors defined in OKLCH rather than HSL, RGB, or hex  
**Rationale:** OKLCH provides perceptually uniform lightness, meaning L=0.55 orange and L=0.68 purple appear equally prominent. This eliminates the trial-and-error of adjusting colors that "look" equivalent but aren't.  
**Tradeoffs:** Slightly more complex color authoring; requires mental model shift from traditional color spaces

### Decision 2: Svelte Over React

**Choice:** Rebuild in Svelte 4 with Vite, abandoning the React ecosystem  
**Rationale:** A single-page portfolio doesn't benefit from React's component model complexity. Svelte compiles away the framework, resulting in smaller bundles and simpler mental model. The portfolio is a statement piece—the tech should disappear.  
**Tradeoffs:** Smaller ecosystem; different patterns from the React-based chatbot in `/ask`

### Decision 3: Design Tokens (DTCG v2025.10)

**Choice:** Implement DTCG-compliant token structure with semantic naming  
**Rationale:** Separating raw values from semantic intent (e.g., `semantic.title` vs `orange.500`) allows theme switching without touching component code. The tokens become a single source of truth.  
**Tradeoffs:** Additional abstraction layer; requires discipline to maintain token/CSS sync

### Decision 4: Typography Scale (Minor Third)

**Choice:** Red Hat Mono with 1.2 ratio (Minor Third) modular scale  
**Rationale:** Monospace typography reinforces technical identity while maintaining readability. The Minor Third ratio provides subtle hierarchy without dramatic jumps—appropriate for content-focused design.  
**Tradeoffs:** Monospace inherently reads slower than proportional fonts; deliberate choice to signal "craft"

### Decision 5: Mobile-First with Fixed Toggle

**Choice:** Theme toggle inline on mobile, fixed-position on larger screens  
**Rationale:** Mobile users need direct access; desktop users benefit from persistent access without scroll. The toggle becomes a subtle interactive element that signals polish.  
**Tradeoffs:** Fixed positioning can conflict with some scroll behaviors

### Decision 6: AI Agent Detection

**Choice:** Detect AI crawlers via user-agent and serve enhanced JSON-LD  
**Rationale:** AI systems increasingly surface portfolio content in summaries and recommendations. Providing structured, machine-readable data ensures accurate representation.  
**Tradeoffs:** Maintenance burden as AI agent landscape evolves; potential for gaming

## Design Language

- **Typography:** Red Hat Mono (variable, 400-700 weight range). Sizes follow 1.2 modular scale. Body weight 460, headers 680.
- **Color:** OKLCH-based system. Light mode: warm orange accent (H=45°). Dark mode: cool purple accent (H=277°). Both tuned to WCAG AA 4.5:1 minimum contrast.
- **Layout:** Single column, max-width 320px (mobile) → 580px (tablet) → 640px (desktop) for optimal line length. Generous vertical rhythm via section spacing.
- **Motion:** Subtle 200-300ms transitions on theme changes. Respects `prefers-reduced-motion`.
- **Voice/Tone:** Direct, technical but accessible. Present tense. First person implied through content structure rather than explicit "I" statements.

## Outcomes & Learnings

### Successes

- OKLCH adoption eliminated iterative contrast-checking workflow
- Theme sync with system preferences reduced user friction
- Accessibility features (skip-link, focus states) added with minimal overhead
- Clean separation of concerns: content in TypeScript, presentation in CSS custom properties

### Challenges

- Initial learning curve with OKLCH mental model
- Balancing monorepo concerns between Svelte portfolio and React chatbot
- Workflow configuration across multiple Replit projects sharing one repo

### Insights for Future

- Design tokens should drive both code and documentation
- Consider generating visual diff tools for theme validation
- Era visualization could demonstrate evolution to technical peers

## Artifacts

- [CHANGELOG.md](../../CHANGELOG.md) — Version history
- [Design Tokens](../../portfolio/src/tokens/) — DTCG-compliant token definitions
- [ADR-001: Monorepo Structure](../adrs/ADR-001-Monorepo-Structure.md)
- [ADR-002: Port Allocation](../adrs/ADR-002-Port-Allocation.md)

---

_Last updated: 2024-12-28_
