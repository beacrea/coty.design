# Systems-design corpus — Coty Beasley (single-file edition)
*All corpus documents concatenated in recommended reading order for single-pass ingestion. Individual files and the machine-readable evidence index (`09-evidence-index.json`) accompany this bundle.*


---

<!-- FILE: 00-README.md -->

# Systems-design corpus — Coty Beasley, design systems & design tokens

**Purpose.** This corpus is written to be read by an agent evaluating a candidate for a design systems / design engineering / design technology role. It documents *how the author reasons about systems design*, and the concepts and skills he demonstrably operates with, using three primary artifacts as evidence.

**Authorship.** Every artifact, system, specification, and site referenced here was designed and built by Coty Beasley from scratch. No other team member contributed authorship; contributions from colleagues were limited to general feedback, and where a colleague's proposal is *translated* into one of these systems it is attributed inline (e.g. "C. Lynn, 2026-06-15" in the Beacon expression layer). Named tickets (`DSYS-431`) indicate work that fed a real production design system.

---

## How to read this corpus

| File | What it holds |
|---|---|
| `00-README.md` | This file — scope, provenance, reading order |
| `01-practitioner-profile.md` | Who the author is, the lane he works in, scope of ownership |
| `02-reasoning-model.md` | **The core document.** Twenty reasoning patterns, each with the artifact evidence that demonstrates it |
| `03-capability-inventory.md` | Concepts and skills demonstrated, scored against the author's own 44-capability depth model |
| `04-artifact-beacon.md` | Dossier: Beacon design system — full architecture, semantic layer, schemes, governance |
| `05-artifact-dtcg-formulas.md` | Dossier: `dtcg-formulas` — spec design, package architecture, error model, roadmap |
| `06-artifact-capability-map.md` | Dossier: the design system capability map — method, findings, self-audit |
| `07-evolution-thesis.md` | How the author reads the evolution of design systems and tokens, and where he is betting |
| `08-interview-answers.md` | Grounded answers to the questions an evaluating agent is most likely to ask |
| `09-evidence-index.json` | Machine-readable claim → evidence map |
| `10-artifact-underline-design-system.md` | Dossier: `nrfta/design-system` — four years of production ownership, governance, releases, migrations |
| `11-role-alignment.md` | Requirement-by-requirement mapping to a Design Systems Lead role, including honest gaps |
| `artifacts/` | The two attachable source artifacts, verbatim and offline-complete |

**Reading order for an agent with a budget:** `02-reasoning-model.md` → `03-capability-inventory.md` → `11-role-alignment.md` → `07-evolution-thesis.md`. The four dossiers are reference depth; `08-interview-answers.md` is the retrieval-friendly surface.

---

## Primary evidence

1. **Beacon Design System — Complete Archive** (`artifacts/Beacon-Design-System-Complete-Archive-Standalone.html`)
   Underline's brand within the Facet design authority. Resolver identity `beacon` v1.0.0, archived 2026-09-01. One offline file containing: governance readme verbatim (368 lines, 21,663 chars), an agent skill manifest, 31 specimen cards rendered live, the complete live token reference for both schemes, and the verbatim source of all 46 files.

2. **Design System Capability Map** (`artifacts/analysis-design-system-capabilities.html`)
   A capability model of the field: 44 capabilities ordered by computed prerequisite depth (0–6), plotted against two separately-measured adoption axes — field adoption from a 147-respondent practitioner survey, and frontier adoption across 22 publicly documented design systems.

3. **`dtcg-formulas`** — [dtcg-formulas.org](https://dtcg-formulas.org) · [github.com/beacrea/dtcg-formulas](https://github.com/beacrea/dtcg-formulas)
   A documentation-first, pluggable formula layer for DTCG design tokens. MIT. `@dtcg-formulas/spec`, `/parser`, `/registry` published at 0.1.0 on npm; resolver, builtins, and CLI on the 0.2.0 track.

4. **Underline Design System** — `nrfta/design-system` (private repository; dossier at `10-artifact-underline-design-system.md`)
   The production system this all came out of: `@underline/design-system` v8.0.0, first commit 2022-11-14 through 2026-07-23, 1,412 commits (~92% by the author), 20 tagged releases, an eight-article repository constitution with CI-enforced anti-drift, 30+ architecture decision records, a 9-role × 18-intent semantic token system, five platform distribution packages on independent semver, and an enforced contribution and release model. Now unmaintained, following the author's move from Head of Product Design into an innovation role and a change in team leadership.

These are not four unrelated projects. They are one argument in four registers: **the Underline design system** is four years of owning a production system end to end in GitHub, **Beacon** is the clean-slate re-architecture of its token layer, **the capability map** is the field analysis that locates the resulting need at the frontier and shows nobody has met it, and **`dtcg-formulas`** is the standards-track infrastructure built to meet it — with its definition files already in use inside the production repo.


---

<!-- FILE: 01-practitioner-profile.md -->

# Practitioner profile

**Coty Beasley** — product design and design-technology leader. Co-founder and Head of Product Design & Innovation at **Underline** (2019–present), an open-access fiber network infrastructure company; previously VP of Product / Director of Product Design at **Neighborly** (civic fintech, 2017–2019) and co-founder / Head of Product at **Edge Up Sports** (2015–2017, early IBM Watson partnership for AI-driven sports analytics). Background in design, HCI, and computer science.

## The lane

Design systems as **infrastructure**, not as a component library. Concretely, the work in this corpus sits at three levels at once, which is unusual and is the point:

| Level | What it means | Evidence in this corpus |
|---|---|---|
| **Production system** | Owning a brand's token architecture end to end — vocabulary, layer model, generated ramps, semantic roles, dual schemes, component tokens, agent manifest | Beacon (`beacon` v1.0.0 resolver, 46 files, 31 specimen cards, 10 role families, 201-token role vocabulary) |
| **Field analysis** | Modelling what the discipline can actually do and where any given capability sits relative to prerequisites and diffusion | Design System Capability Map (44 capabilities, depth 0–6, n=147 survey + 22-system evidence audit) |
| **Standards-track infrastructure** | Building the missing layer as public, installable, spec-first OSS aligned to DTCG rather than around it | `dtcg-formulas` (3 packages at 0.1.0 on npm, MIT, spec + parser + registry, resolver on the 0.2.0 track) |

Most design systems practitioners operate at level one. The distinguishing claim in this corpus is that the same person produced the production system that generated a need, the field model that shows the need is unmet at the frontier (depth 6, 0.3% field adoption, 0 of 22 audited systems), and the public infrastructure built to meet it — with the strategic argument for *why* it is unmet stated as a falsifiable hypothesis about custody rather than quality.

## Core competency domains

- **Design token architecture** — DTCG format module, `$value` / `$type` / `$extensions`, aliasing, multi-file token sets, resolver/resolution-order modelling, component-scoped tokens
- **Perceptual color science in production** — ColorBox recipe generation with per-family lock hexes, APCA (Lc) contrast targets, Helmholtz-Kohlrausch effects on chromatic backgrounds, Adobe Leonardo, Porter-Duff alpha compositing, contrast-solved foreground derivation
- **Semantic systems and ontology** — role sub-systems with fixed anatomy, one-directional binding models, deployment grammars layered above components, bounded contexts and context maps applied to brand architecture
- **Specification authoring** — three published specs (definition language, DTCG extension convention, registry contract), non-goals-first scoping, preflight contracts, diagnostic/error models as public API
- **OSS engineering and release practice** — TypeScript monorepo, dual ESM+CJS builds via tsup, Vitest, Biome, Changesets, GitHub Actions CI matrix (Node 20/22: build → typecheck → check → test), SECURITY / CONTRIBUTING / CODE_OF_CONDUCT, VitePress docs site on a custom domain
- **Evidence and measurement discipline** — prerequisite-graph modelling, log-scale adoption analysis, separating measurements rather than averaging them, publishing self-audits that invalidate prior versions of one's own work
- **Agent-legible systems** — `SKILL.md` manifests, machine-readable token and schema surfaces, JSON Schema and LSP planning, treating "documentation delivered to agents" as a capability with a measurable adoption level

## Working style, as it shows up in artifacts

Documentation-first and provenance-obsessed: validators, CI checks, computed rather than asserted values, and explicit records of what was inferred, interpolated, renamed, rejected, or deferred. Strong preference for reversible, owner-maintainable systems over bespoke tooling that creates dependency on the author — sets as swap points, adapters as opt-in dependencies, `$value` kept canonical so any DTCG-aware tool can consume the output without knowing the formula layer exists.


---

<!-- FILE: 02-reasoning-model.md -->

# How I think through systems design

Twenty-six patterns, each stated as a rule I actually follow, followed by the evidence in the artifacts that shows it operating. This is the document to read if you only read one. Patterns 1–20 come from Beacon, the capability map, and `dtcg-formulas`; patterns 21–26 come from four years of operating the Underline design system in production.

---

## A. Establishing the system

### 1. Vocabulary is the first deliverable, and it is enforced

Before architecture, before color, Beacon's readme fixes five words and forbids ad-hoc substitutes: **Global** (mode-free math primitives, no color, no brand), **Set** (a swappable instance of a subdomain), **Modifier** (an axis that re-resolves the same token names to different values), **Alias** (a semantic token pointing at another token), **Resolved graph** (the flattened output for one `{set, theme, screen}` selection). The instruction is explicit — "Use these words — not ad-hoc ones."

This is deliberate: the vocabulary section is a DTCG token-layer model with a light domain-driven-design framing on top, which is what lets Beacon be described as "a bounded context in Facet's context map (Beacon ↔ PCI, the sibling brand)" rather than just a folder of CSS. Vocabulary discipline is also how the system retires terms — the semantic layer note says it "replaces what earlier drafts loosely called 'chrome'", and that retirement is later cited as a reason to reject "chrome" as a tier name.

### 2. Document order is resolution order

Beacon's readme states its own structure as an argument: "This readme builds the system the way the resolver does — reading top to bottom is reading the resolution order: vocabulary → the layer map → the raw material (color, type, icons) → the semantic layer that binds it → the expression grammar that deploys it → the schemes that re-resolve it — then voice, provenance, and the card index."

The same ordering governs the 31 specimen cards, grouped 0–8 "the way to learn the system," and the CSS entry point: `styles.css` imports every layer in resolution order and is annotated as "the resolver analogue," with the component layer commented as resolving *after* the semantic layer it aliases. Learning path, file order, and build order are the same order on purpose.

### 3. Swap points are designed, named, and documented as seams

Sets exist because I decided where the system should be able to change without cascading: "Swapping a set (palette → another brand's palette) rebrands without touching anything else — sets are the swap points." `styles.css` carries this as an operational note — "replace a `*-beacon.css` / `*-fontawesome.css` import with another set file to rebrand — nothing else changes."

The same discipline appears in iconography as **swap discipline**: "components reference the `active` alias tokens (`--icon-font`, `--icon-weight-`, `--symbol-`), never a family-specific value — swapping FA → another set touches only the iconography set file."

### 4. Separate by axis, not by convenience

Beacon has exactly two modifiers, theme and screen, and each is an axis that re-resolves the same names. Where a shortcut was available I refused it: **light and dark are treated as two distinct scheme sets that each resolve the names independently, "not one set with a switch."** That costs more to maintain and it is the right cost, because the two schemes have genuinely different interaction semantics (see #10).

Layout is phone-first as a structural commitment, not a preference: `layout.css` *is* the phone baseline and tablet/desktop "add overrides on top" at 320 → 768 → 1280.

---

## B. Deriving values instead of choosing them

### 5. Generate, never hand-tune, and say so in the file

"Ramps are generated, not hand-picked. Each family is a ColorBox recipe (eased lightness/chroma/hue curves) sampled at 11 steps and pinned through a per-family lock hex. To change a ramp, edit the recipe and regenerate — never hand-tweak a single step."

The generation anchor is separated from the interactive value, which is the kind of distinction that prevents a year of confusion: `teal-700 (#01525C)` is the ColorBox lock hex the ramp is pinned through; `teal-600 (#076873)` is `roles.primary.bg.rest`. A flag records that earlier drafts got this wrong and it was corrected.

The global typescale is likewise "formula-derived (1.067 minor second, anchored 16px)" rather than a list of chosen sizes.

### 6. Accessibility is computed, not asserted

`on.*` foreground tokens are "computed per step by APCA contrast (black or white). Regenerated by script — never hand-edit." Every full role family carries an `on` slot set (`rest / hover / pressed / tonal`) described as "the APCA-legible foreground per bg" — legibility is a structural slot in the role anatomy, not a review checklist item.

The same conviction is what became a shipped formula in `dtcg-formulas`: `optimal-foreground($background, $light, $dark)` returns whichever candidate has greater APCA Lc, documented as accounting for "the Helmholtz-Kohlrausch effect on saturated chromatic backgrounds."

### 7. When a derivation is not clean, publish the derivation and its deviations

This is the pattern I would most want an evaluator to look at. Beacon's dark role layer is interpolated, and the flag explains exactly how and where the interpolation was overridden:

- Light (`beacon.light.tokens.json`, **201 tokens**) is the source of truth; the dark source (`theme:Beacon:Dark`) covers only ~40% of the vocabulary, in an older `solid-` naming.
- Dark is derived by **ramp mirroring** (50↔950, 100↔900, 200↔800, 300↔700, 400↔600), **anchored to every value the dark source does define**, then **verified pair-by-pair with APCA** — dark Lc must sit near polarity-adjusted parity with light, and each `on.*` takes the greater-|Lc| of black vs white.
- APCA-driven deviations from the naive mirror are each named with their reason: `text-disabled` pulled brighter (mirrors fell to |Lc| 12–17 against light's 26–38); dark `danger.on-rest` = **white**, overriding the source's black (|−66| > |44| on red-400); disabled solid = base-600 not the mirror's 700; alpha tonals roughly double their alpha to match the overlay ramp.
- Where the source doesn't fit the new model, that is stated rather than forced: the dark source's lone `accent-bg` slots "don't fit the new subtle/highlight/bright stack cleanly — tints are mirrored deep (950/900/800) and the carryovers ignored, pending upstream tuning."
- Lc values are annotated inline in `roles.css` and on the role cards, with the standing instruction to "regenerate them when a ramp changes."

A reproducible method, its anchors, its exceptions with quantities, and a regeneration trigger. That is what I mean by a derivation being auditable.

---

## C. Meaning, and the layer above tokens

### 8. Give every semantic family the same anatomy

Roles are not colors with names; each full family is a sub-system with fixed anatomy — `bg` (rest/hover/pressed solid trio), a tint stack (`tonal` alpha wash · `subtle` · `highlight` · `bright`, faintest → strongest), a text ladder (default/strong/subtle/disabled), `on` (rest/hover/pressed/tonal), `border` (rest/focus/active), and `accent` (brand/key). Ten families: `neutral` (the workhorse), `primary`, `value`, `decorative`, `warning`, `success`, `danger`, `care`, `care-alt`, `disabled`.

Uniform anatomy is what makes the system predictable to consume and mechanically checkable. Where a family legitimately doesn't need the full shape, the exception is typed rather than improvised: accent-only roles (`value`, `decorative`, `care-alt`) carry `brand`/`key` plus tint slots and **no interaction trio**.

### 9. Absence is a design decision and gets documented as one

"**There is no `info` / blue semantic role.** Blue exists in the palette but is not bound to a role. Don't reach for a blue 'info' state." The palette card marks yellow "unbound — no role" in the same spirit, and `--info` in `themes.css` is flagged as "a local convenience only."

The pattern repeats across the system: no emoji as iconography and no decorative unicode glyphs in product UI; predominantly flat backgrounds, "no gradients, no noise"; "nothing gratuitously round" on the radius scale; no bounces on content; no exclamation-point spam in voice. Negative constraints are cheaper to enforce than positive taste and they are what actually holds a system's character over time.

### 10. Semantics can be scheme-relative; keep the asymmetry

Light **lightens on hover, darkens on press**. Dark **darkens on hover, flashes light on press**. The stated principle underneath: "each scheme moves *toward* its page and *away* on press. Keep this inversion; don't flip one scheme to match the other."

This is a real conceptual move — the invariant is the *relationship to the surface*, not the direction of the value change. Beacon also states the local corollary that would otherwise get lost: for a teal brand at 600, "deepen-on-hover would be wrong here."

### 11. Build a deployment grammar above components, and prove it needs no new tokens

The **Expression** layer translates Facet 2.0's five-tier color hierarchy for Product UI (C. Lynn, 2026-06-15) into Beacon's vocabulary. It is explicitly "**not a token layer — a deployment grammar**": given the resolved theme, which role each *category* of product UI is allowed to claim. Because it governs page composition, it sits *above* components in the stack.

The tiers are framed by the user's question, not the designer's intent — shell: "Where am I now and how do I move somewhere else?"; primary: "Which of these are right for me?"; secondary: "What else should I know?"; decorative: "The feels associated to the brand."; value: "What's this worth and is it valuable to me?"

Two things I consider load-bearing about how it was built:

- **Every tier binds to an existing role family — "no new tokens were needed, and dark comes free through the role bindings."** A new abstraction that requires no new primitives is evidence the primitives were factored correctly.
- **Bindings are one-directional.** "A tier always resolves to its role, but roles serve jobs outside the tier model too" — `role.neutral` solids also carry achromatic CTAs, and those are shell "even when pressing them is the page's decisive act." The distinction is stated crisply: "Teal does not mean 'the decision' — it marks the options being weighed against each other… A submit button concludes; an option button chooses among peers — only the latter is primary."

### 12. Rules need scarcity clauses, closure clauses, and worked edge cases

The grammar ships three rules: (1) **lime is reserved for value to the user** — accumulated (cart pill, cost badges) or recommended ("Top choice") — "never FAB, decoration, status, generic category labels, or filter chips"; (2) **shell stays neutral** even when it is the page's most prominent button — "Black is a different category, not a lesser one"; (3) **no sixth tier** — "new cases belong to one of these five."

Then the collisions are pre-resolved: success uses `role.success` (text green-800, distinguishable from lime; never in onboarding); warning/danger pair icon + label, never color alone; "when cart and FAB are both visible, the FAB is tier 3 (teal) — two lime elements compete." A rule with a scarcity clause, a closure clause, and named conflicts is enforceable. One without them is a slogan.

### 13. Components consume meaning, never raw material

"Components consume aliases, never raw steps," stated in the vocabulary and repeated on the palette card: "Only this tier holds hex values — components never touch a raw step, only role aliases."

Button is the worked proof and the largest token file in the system (`tokens/components/button.css`, 417 lines / 20,258 chars): color and state alias to semantic theme tokens, structure (height/pad/gap/icon/radius) aliases to global sizing/spacing/shape, type aliases to the label role, and "render is driven entirely by `--button-*` tokens." Sizes are described as "five ramp-snapped sizes" — component dimensions are snapped to the primitive scale rather than chosen.

---

## D. Provenance, honesty, and self-correction

### 14. Ship the open decisions next to the system, not in a private doc

Beacon has a standing **Flags & open decisions** section and a longer **Substitutions & flags** section, and they record the unglamorous states honestly:

- **Mid-rename states are named as such.** The dark source calls the pink role `program` where light calls it `care` — "treated as one role, mid-rename." Violet was renamed `prince` → `care-alt` (2026-07-06) to match the token source key.
- **Rejected options are recorded with reasons.** Tier 1 settled on "shell"; rejected "chrome" (collides with vocabulary this system already retired), "frame" (collides with Figma), "anchor" (considered, dropped).
- **Reader-facing surfaces stay clean while provenance is preserved elsewhere:** "Cards show only the current names — draft provenance lives here, not in reader-facing specimens."
- **Inferred content is labelled as inferred.** The richer semantic symbol map on the Iconography card "was inferred — treat it as a proposal until the set is expanded," because the token source defines only `alert → warning`. Content fundamentals are marked "(Inferred from brand context; refine with real product copy.)"
- **Upstream work is routed upstream.** The draft's "absolute black" phrasing "should be restated upstream as `role.neutral.bg.rest` so it schemes"; the re-chartering of the value role from "metrics and numbers" to "value to the user" is flagged to "take back to the token source."
- **Open proposals are kept out of the shipped tokens.** Token Naming Proposal v1/v2/v3 exist in the archive as "open working proposals — not applied to `tokens/*.css`."

### 15. Audit your own model and delete what fails

The capability map's method section opens by killing its own previous version. An earlier iteration plotted design systems against designer headcount; an audit "found it did not survive contact with its own numbers: R² 0.53 on 22 hand-picked points, a slope whose 95% confidence interval spanned a factor of 2.4, a third of the fit carried by a dimension that was near-definitionally a restatement of company size, and a 10.5-point scoring advantage for open-source systems that was large enough to explain its headline finding on its own."

The axis was removed entirely, with a second, forward-looking reason given: "agentic tooling is decoupling contributor count from output." The closing commitment is the part that matters — "Nothing on this page depends on knowing how many designers work anywhere."

### 16. State the limits of your own measurement, including the direction of the bias

Every soft edge of the capability map is disclosed and, where possible, made filterable:

- Depth is *computed* from a prerequisite graph (`depth(c) = 0 if requires(c) = ∅, else 1 + max(depth(p))`) — "but somebody had to decide" the edges, so each edge is stated on the capability "so you can disagree with a specific edge and see exactly what it moves."
- Depth measures **scaffolding, not difficulty or value**: "a depth-1 capability can be harder to ship than a depth-4 one."
- The survey (zeroheight, n=147, 45% North America, 40% Western Europe) is "a self-selected sample of people engaged enough to answer a design systems survey, so it almost certainly overstates the field." Subgroup items are labelled "of systems with tokens" rather than silently rescaled.
- Estimated rows are drawn hollow with dashed connectors and can be filtered out entirely; the estimates "cluster at depth 4–6, which is exactly where they are least checkable, so treat the deep end as an ordering rather than a set of values."
- Frontier adoption is "an evidence review, not a census." Closed systems are undercounted, and the absence of Airbnb, Linear, Spotify or Lyft from an exemplar list "is a statement about evidence, not about them." The selection bias is named *and* signed: it "biases toward capability rather than against it: this is a sample of the top tail, and it is labelled as such."
- **"Adoption is not endorsement."** A capability at 5% is not therefore good; one at 86% is not therefore necessary.

### 17. Never average two things that measure different questions

Field adoption and frontier adoption are "two separate measurements per capability, never averaged." They are drawn as two dots, and the distance between them is given a name and a use: the **diffusion lag**, which is also a sort order. Adoption is plotted on a log scale with named bands (<3% experimental, 3–15% frontier, 15–40% emerging, 40–75% common, >75% standard) because a linear axis would collapse the entire frontier into the y-axis.

Quantitative claims are stated with their arithmetic exposed for checking: median field adoption 71% / 66% / 25% / 30% / 5% across depths 0–4; correlation between depth and log adoption r = −0.73, reported honestly as "depth explains roughly 53% of the variance… real, and far from the whole story."

### 18. Read small numbers carefully, and prefer the argument from silence

The frontier analysis is the clearest example of not over-reading data. Tokens Studio Graph Engine — the only shipped implementation of formulas declared in the token graph — sits at 160 weekly npm downloads against style-dictionary's 1,682,990 and Tokens Studio's own `sd-transforms` at 163,156. Rather than declaring it unused, the artifact corrects itself: the Graph Engine's main consumption path "is the hosted platform and the Figma plugin, not `npm install`, so 160 downloads a week means 'almost nobody runs it in their own CI' — not 'almost nobody uses it'. Enterprise use behind a SaaS login is invisible here."

The load-bearing evidence is then relocated to where it is actually strong: "**The stronger evidence is the silence.** No team has published a production design system whose token values are computed by a graph pipeline — no engineering blog, no conference talk, no open repository."

And then a causal hypothesis with a testable mechanism, which is where the strategy comes from: "The likeliest reason is not quality but **custody**: computing tokens in a visual editor moves the source of truth out of git and into a proprietary canvas, and design system teams have spent a decade learning to keep that source reviewable as text. `dtcg-formulas` makes the opposite bet — declare the computation inside the token file so it stays diffable."

---

## E. Building infrastructure other people have to live with

### 19. Bound the thing by writing its non-goals first, and make failure conditions explicit

`dtcg-formulas` names what it will not become before it names what it will: not a replacement for DTCG, not executable Sass, not a general-purpose expression engine, not a full programming language, not a standardization of token compilation for the whole ecosystem, and not a solution to every one-to-many generation workflow in v0. The brief's own framing: "This is a narrow infrastructure layer, not a new religion." Its closing line is a stated failure condition: "**If it starts trying to become a full language runtime, it has already failed.**"

Risks are paired with mitigations rather than listed — over-design (keep the syntax narrow, keep `$value` resolved, scalar functions only in v0), ecosystem drift (align with DTCG extension rules; document provenance rather than redefine token meaning), tooling complexity (parser, extension spec, one resolver path first). Open questions are published unresolved, including whether the extension key should stay `org.dtcg-formulas`.

### 20. Compatibility is a constraint you accept, not one you negotiate

The core compatibility principles are stated as invariants:

- **Resolved `$value` is canonical.** Every output token carries a concrete DTCG `$value`; the formula extension is optional metadata. "Any DTCG-aware tool can read this file without knowing anything about formulas."
- **Extensions are vendor-namespaced** under `org.dtcg-formulas` — and the `org.` prefix is *backed by the `dtcg-formulas.org` domain I own*, which is the difference between following a convention and satisfying it.
- **Output must remain DTCG-compliant**: "The formula layer may be more expressive internally, but what lands in `$value` plays by DTCG's rules."

The thesis is a separation of concerns — "interoperable token output" from "authoring-time formula definitions" — with the goal stated as keeping "DTCG output boring and portable while still preserving how the value was derived." Prior art is credited as architecture, not inspiration: Dart Sass (lexer → parser → AST → visitor evaluator, CLI + JS API — "validates the 'pure core + thin wrappers' split"), Style Dictionary's transitive transforms (identified as the correct hook point: "the resolver runs as a transitive preprocessor, after SD has resolved DTCG aliases but before platform-specific format generation"), and Terrazzo's parser-core/CLI-wrapper shape.

### Corollaries of #20 worth naming separately

- **Sequence by durability.** 0.1.0 shipped the *metadata* surface — parse, register, document — and deliberately deferred compute to 0.2.0. "A consumer can parse, register, and document formulas today; compute comes in 0.2.0." The specs and the documentation are the part that has to be right first, because they are the part consumers depend on irreversibly.
- **Make the cheap check cheap.** `lint` is separated from `compile` on purpose: preflight parses every formula, validates it against the registry, checks references, arity and cycles, and "never executes a formula. Adapter packages don't need to be installed for `lint` to run… so a CI job can fail-fast on syntax problems without pulling in heavy color or contrast engines." The preflight contract is enumerated as eight numbered guarantees, with an explicit boundary: anything requiring execution (e.g. verifying `min <= max` in a `clamp`) belongs to `compile` or `check`, not `lint`.
- **Errors are a public API.** Every diagnostic carries `code` (`DTCG-FORMULAS-L107`), `severity`, `message`, `span` (file/line/column/length), `hint` and `docsUrl` pointing at a troubleshooting anchor — specified before the resolver exists, because "public users will demand codes, spans, and stable error contracts."
- **Cost is opt-in.** Adapters are separate packages with a two-export contract (`definition` + `implement(args, ctx)`); "nobody pays for Leonardo unless they actually use `leo()`."
- **Formulas must be recomputable from the formula alone.** `optimal-foreground`'s documentation states the requirement directly: "All inputs are explicit token references or literal values — no implicit pipeline configuration required. A consumer can recompute `$value` from the formula alone."
- **Scope each function honestly, including for whom it is irrelevant.** `outline-radius()` (from `DSYS-431`) exists to reproduce a CSS `outline-offset` silhouette in tools like Figma that cannot render it natively — and its own docs say "**FE consumers should ignore this — the browser computes it automatically.**"
- **Systems should be legible to agents by design.** Beacon ships a `SKILL.md` manifest specifying how an agent should consume it — read the readme, explore the files, copy assets out and emit static HTML for throwaway visual work, read the rules to work in production code, and if invoked without guidance, ask what the user wants to build. The capability map treats this as a whole family ("Agent-readable": experimenting with AI 46%, AI built into system processes 10%, documentation delivered to agents 12%, machine-readable component schemas 2%), and `dtcg-formulas` plans a JSON Schema for the extension plus an LSP built on stable diagnostic codes.

---

## F. Operating a system in production for four years

Patterns 21–26 come from `nrfta/design-system` (dossier `10`): 1,412 commits, 20 releases, two eras.

### 21. Write the rules once, as data, and make drift a build failure

The Underline repository governs itself through an eight-article **constitution** with a generated machine-readable projection. Article 3 states the rule: rules are authored once, as data, and "every other surface that 'knows the rules' — `CLAUDE.md`, `AGENTS.md`, `.cursor/rules`, `GOVERNANCE.md`, git hooks, CI — is a **pointer or generated projection**, never a hand-kept copy. Generated projections live in `BEGIN/END AUTO-GENERATED` blocks. **Drift is a CI failure** (`governance:verify`)."

Every ADR and rule declares the articles it implements (`implements: [art-3, art-7]`). The two governance domains — repository versus design system — are separated by a one-sentence boundary test, and amendment requires a constitutional-amendment ADR with higher ceremony than an ordinary decision: "Amendments supersede; they do not silently overwrite."

The reason I build governance this way is Article 5: contribution should be "governed and low-friction," such that "a non-technical designer working through an agent can contribute correctly without memorizing the structure." Governance that depends on people remembering it is not governance.

### 22. Evolve by clean breaks; freeze prior eras rather than carrying them forward

Article 6: "The system evolves by **clean breaks**, not perpetual accretion. When direction shifts materially, the prior era is **frozen** — its artifacts preserved in git history (commits and tags), not carried forward as a live in-tree directory — so provenance is retained while the working tree stays scoped to current concerns."

Applied concretely: the Classic era's `archive/classic/` tree was retired from the working tree, and the v8.0.0 breaking-change note publishes the recovery path rather than expecting anyone to reconstruct it — `git log --all -- archive/classic/` then `git show <sha>:<path>`. Twenty releases shipped this way, with breaking changes managed rather than avoided: a 4-level → 8-level intensity migration, an `inverse` role removal, a text-token collapse from 30 tokens to 5, and a 50+ reference dark-theme palette migration — each with its rationale in an ADR and its consequence in a changelog.

### 23. Register every exception and validate the register in both directions

Hand-tuned values that deviate from a computed pattern are a fact of any real color system. The question is whether they are tracked. `.design-system-governance/rules/overrides.registry.json` holds every semantic override that deviates from the computed darken/lighten pattern, and CI validates it **bidirectionally**: every registry entry must exist with the correct value and no modifier in both the canonical and Tokens Studio files, *and* any override-like token in those files must have a registry entry.

One direction catches a stale register. The other catches an undocumented exception. Only both together make "no untracked deviations" a property of the build rather than a promise.

### 24. Design for succession

The Beacon-era pivot is the decision I would most want read as systems thinking rather than as retreat. ADR 001 records the two forces — authoring tooling had improved enough to make native design-system authorship practical outside the repo, and hands-on stewardship was thinning — and draws the conclusion directly: "With lighter hands-on stewardship, an external, automated pipeline that writes built tokens back is more sustainable than maintaining the build in-repo by hand."

So authoring moved to the surface its likely maintainers already use (Figma, via Supernova), the repo kept the parts that must be *enforced* rather than *crafted* (resolvers, schemas, validation, provenance, distribution), and built output became pipeline-owned and never hand-edited. The ADR names its alternatives and rejects them with reasons, states its new obligations (a write-back contract, pipeline-only enforcement on `tokens/dist/**`), and preserves the prior era's decisions for provenance.

The system is now unmaintained. I include that because it is the honest outcome: architecture can reduce a system's dependence on one person, but it cannot substitute for an organization deciding the system matters.

### 25. Decide which layer owns the model when a vendor's model is weaker than yours

Supernova's themes are flat — they mirror Figma variable modes — and cannot express a four-dimensional `brand → sub-brand → scheme → density` model. Rather than flatten the system to fit the tool or fork away from it, the architecture assigns authority explicitly: "**the resolver is the structural authority**: the exporter flattens Supernova's model (applying its flat themes to capture per-scheme raw values) and carves it into sets; the repo-side resolver build composes the `brand → sub-brand → scheme → density` structure Supernova can't."

The same posture shows up as tooling when necessary. When Tokens Studio could not modify Figma variables that carry aliases (a known upstream defect), I wrote a Figma plugin to convert aliases to literals as a baseline pass — with collection and mode selection, a preview of the affected count before mutating anything, and no network access. Working around a vendor bug is fine; letting a vendor's data model become your data model is not.

### 26. Derive enum membership from a contract, and name what does not yet qualify

The Button spec's `intent` enum is not a taste list. Valid intents are "the roles that satisfy the interactive channel contract (`bg.{rest,hover,pressed}`, `border.{rest,focus,active}`, `text.*`, `on.*`)" — membership follows from capability. `care` is included with a flag that its channel shape diverges, and `value` and `care-alt` are documented as joining the enum "when their roles gain interactive channels."

Same instinct as the closure clause in #12 and the documented absences in #9: an API surface should state the rule that produces its options, and should name the candidates the rule currently excludes, so the next person extending it knows what to build rather than what to argue about.


---

<!-- FILE: 03-capability-inventory.md -->

# Capability inventory

Concepts and skills demonstrated in the attached artifacts, scored against the author's own capability model. Depth values and field-adoption percentages are quoted from the Design System Capability Map (44 capabilities, depth 0–6; field = % of a 147-respondent practitioner survey; frontier = n of 22 audited public design systems).

The point of scoring against his own model is that the model was built independently of the self-assessment: depth is computed from a prerequisite graph, and adoption is measured externally. It makes the inventory checkable rather than self-reported.

---

## Demonstrated capabilities, by depth

| Depth | Capability | Field adoption | Evidence |
|---|---|---|---|
| 0 | Design tokens exist | 86% | Beacon: 10 token files across 8 layers |
| 0 | Accessibility guidelines documented | 59% | Beacon: APCA `on.*` doctrine, Lc annotations, icon/contrast rules |
| 0 | Experimenting with AI in the workflow | 46% | Beacon `SKILL.md`; agent-corpus architecture on coty.design |
| 1 | Primitive value layer | 90% | `tokens/global.css` — 50+ sizing steps, spacing aliases, typescale, shape, borders, breakpoints |
| 1 | Tokens present in code | 82% | Entire system is CSS custom properties; `styles.css` single entry point |
| 1 | Tokens documented | 66% | 31 specimen cards + 368-line governance readme |
| 1 | Code component library | 78% | `components/Button/` — `.jsx`, `.d.ts`, specimen card |
| 1 | Generated spacing and type scales | 55% | 1.067 minor-second typescale, formula-derived, anchored 16px |
| 1 | AI built into system processes | 10% | `SKILL.md` manifest specifying agent consumption behaviour |
| 2 | Semantic layer | 85% | `themes.css` + `roles.css` — surfaces, roles, text ladders |
| 2 | Published semver package | 65% | `@dtcg-formulas/spec`, `/parser`, `/registry` at 0.1.0 on npm |
| 2 | Tokens complete across design, code and docs | 54% | Figma export → token CSS → specimen cards, all reconciled with flags |
| 2 | Framework-agnostic delivery | 36% | Tool-agnostic core principle; CSS-variable delivery; DTCG JSON in/out |
| 2 | Perceptual colour ramps | 20% | Nine ColorBox recipe ramps, eased L/C/H curves, 11 steps, per-family lock hex |
| 2 | Documentation delivered to agents | 12% | `SKILL.md`; single-file offline archive built for agent ingestion |
| 3 | Light / dark / contrast modes | 76% | Two fully-defined schemes as independent scheme sets |
| 3 | Component-scoped tokens | 52% | `tokens/components/button.css` — 417 lines of `--button-*` aliases |
| 3 | Tokens vary by platform | 24% | Screen modifier; `outline-radius()` for tools without native `outline-offset` |
| 3 | Aliased parent/child tokens | 21% | Sizing codename → bare alias → spacing flavor → role → component chains |
| 3 | Components mapped design-to-code | 12% | Button card renders from the same tokens the component consumes |
| 3 | **DTCG-conformant token file** | **5%** | `dtcg-formulas` operates on DTCG `$value`/`$type`/`$extensions`; `beacon.light.tokens.json` |
| 3 | **Values solved to a contrast target** | **4%** | `on.*` computed by APCA per step; `optimal-foreground()`; `leo()` defaulted to APCA |
| 4 | Tokens vary by brand | 63% | Beacon ↔ PCI as sibling brands within Facet; palette set as the rebrand swap point |
| 4 | **Perceptual contrast targets (APCA)** | **2%** · 0 of 22 audited | Pair-by-pair APCA verification of the dark role layer with documented deviations |
| 4 | **Machine-readable component schemas** | **2%** | `.module.scssdef` parsed to a typed AST; planned JSON Schema for the extension |
| 5 | **Declarative context resolver** | **3%** | `beacon.v1-0-0.resolver.json` resolution order; `styles.css` as resolver analogue |
| 6 | **Formulas declared in the token graph** | **0.3%** · 0 of 22 audited | `dtcg-formulas` — the capability's own definition; the only alternative implementation is Tokens Studio Graph Engine |

### Additional capabilities evidenced by the Underline production system

The rows above are drawn from Beacon, `dtcg-formulas`, and the capability map. The four-year production system (dossier `10`) adds the operational half of the model:

| Depth | Capability | Field adoption | Evidence |
|---|---|---|---|
| 0 | Dedicated design system team | 83% | Four-year owned repo with governance, release train, and a Linear project (DSYS) |
| 1 | Open contribution model | 65% | Filing map, contribution guide, PR template, reviewer checklist, four-layer branch protection |
| 3 | Release notes per version | 56% | 20 tagged releases, generated changelogs with explicit breaking-change sections |
| 4 | Breaking changes ship with migration guidance | 5% | Migration instructions in release notes (e.g. the archive-recovery command); UUID-preserving renames; ADR-backed deprecations |
| 2 | Framework-agnostic delivery | 36% | Framework-agnostic component specs with optional platform styling/mapping adapters; five format packages incl. a shadcn adapter |
| 2 | Automated design-to-code token pipeline | 29% | Figma → Supernova → custom DTCG exporter → resolver → dist → packages |
| 3 | Tokens vary by breakpoint | 38% | Layout set as a semantic set; responsive layout token workstream |
| 3 | Accessibility conformance measured | 36% | `verify-contrast` grading AA/AAA across both themes in CI |
| 2 | Automated accessibility testing | 21% | Contrast verification and bidirectionally validated override registry wired into CI |
| 4 | Design-to-code drift detected | 3% | Pre-commit Figma CSS sync validation on `.figma.ts` and token changes; `figma:check-sync` |
| 4 | Machine-readable component schemas | 2% | Typed component-spec meta-model + JSON Schema, validated for schema conformance, token existence, and intent-role backing |
| 5 | Declarative context resolver | 3% | Resolvers generated from intent config across four modifier dimensions, schema-conformant and semver-versioned |
| 2 | Documentation delivered to agents | 12% | `knowledge/` as a generated mirror for agentic discovery; TOON rule projections; agentic-access ADRs |

That takes the demonstrated set to roughly 30 of the 44 capabilities in the model, including nine of the eleven capabilities below 6% field adoption.

Bolded rows are capabilities below 6% field adoption. Seven of them, spanning depths 3 through 6, including the two the map identifies as having **zero** evidence across all 22 audited public systems.

## Prerequisite chain for the frontier capability

The map computes that "formulas declared in the token graph" (depth 6) requires this full chain, all of which the author demonstrates:

```
0  Design tokens exist
1  Generated spacing and type scales   ·   Primitive value layer
2  Perceptual colour ramps             ·   Semantic layer
3  Values solved to a contrast target  ·   DTCG-conformant token file
   Aliased parent/child tokens         ·   Tokens vary by platform
4  Tokens vary by brand
5  Declarative context resolver
6  Formulas declared in the token graph
```

This is the substantive claim of the corpus: the frontier capability is not reachable by enthusiasm, and the author holds every rung beneath it in production work.

---

## Technical skills, concretely evidenced

**Token and color engineering.** DTCG format module (stable v1, Oct 2025) and the Resolver module preview draft; ColorBox recipe generation; APCA / Lc contrast math including polarity-adjusted parity across schemes and greater-|Lc| foreground selection; Helmholtz-Kohlrausch effect on saturated chromatic backgrounds; Adobe Leonardo contrast-aware color generation; Porter-Duff alpha compositing; ramp mirroring (50↔950 … 400↔600) as a derivation method with APCA verification; warm-neutral ramp construction and warm-tinted elevation (`rgba(20,11,6,…)` = base-950).

**Type and layout systems.** Seven type roles with independent typescale anchors (`body-md ≠ header-md ≠ marquee-md`); modular scale at 1.067; line-height and tracking ladders; a 50+ step sizing root scale with codenames as canonical names and bare numeric aliases retained for arithmetic; phone-first layout with additive breakpoint overrides at 320/768/1280.

**Language and toolchain.** TypeScript (parser with frontmatter/function/AST modules, typed exports, `tsup` dual ESM+CJS, `tsconfig` project refs); Vitest; Biome; Changesets; GitHub Actions (CI matrix, release, Pages); VitePress docs on a custom domain with CNAME; Sass-inspired DSL design (`.module.scssdef` — YAML frontmatter + SassDoc-style `///` tags + symbolic `@return`); React/JSX components with hand-written `.d.ts`; CSS custom properties and `@import`-ordered cascade layering; Font Awesome Pro self-hosting via `@font-face` with OTF ligature rendering.

**Specification and API design.** Three specs authored (`.module.scssdef`, `org.dtcg-formulas` extension, registry contract); vendor-namespaced extension keys backed by an owned domain; pure-core resolver contract (`compile(input, {definitions, adapters}) → {tokens, diagnostics}`, same input → same output, no I/O beyond config); adapter packaging contract (`definition` + `implement(args, ctx)` with `{tokenPath, registry, diagnostics}`); CLI verb separation (`compile` / `lint` / `check`); eight-point preflight contract including reference resolution, arity checking and cycle detection; structured diagnostics with codes, spans, hints and docs URLs.

**Analysis and research method.** Prerequisite-graph modelling with a stated depth function; log-scale adoption analysis with named bands; two-measure reporting without averaging; diffusion lag as a derived metric and sort order; correlation reported with variance explained and explicit humility (r = −0.73, ~53%); evidence-review methodology with signed selection bias; npm registry download telemetry as a reach proxy with its consumption-path caveat stated; publication of a self-audit that invalidated and removed the prior version's central axis.

**Governance and process.** Documented swap discipline; standing flags-and-open-decisions register; mid-rename and inferred states labelled; rejected naming options preserved with reasons; upstream routing of decisions that belong to the token source; open proposals versioned (Token Naming Proposal v1/v2/v3) and deliberately not applied to shipped tokens; ticket-traceable formula work (`DSYS-431`); attribution of colleagues' source proposals inside translated layers.


---

<!-- FILE: 11-role-alignment.md -->

# Role alignment — Design Systems Lead

Mapping an example Design Systems Lead posting to evidence in this corpus. The posting is treated as illustrative, not prescriptive. Each row cites the artifact and the specific evidence, not a claim.

Artifact keys: **[UDS]** `nrfta/design-system` (dossier `10`) · **[BCN]** Beacon archive (dossier `04`) · **[DTF]** `dtcg-formulas` (dossier `05`) · **[MAP]** capability map (dossier `06`)

---

## Responsibilities

### Bootstrap and own an intuitive semantic token system across platforms and frameworks

**[UDS]** A 9-role semantic system with a uniform 18-intent model per role — one alias (`default`), two translucent backgrounds, six monotonically-progressive solid backgrounds, eight per-background contrast tokens, and one alias contrast token (`on-default`) — versioned as a reviewed spec at v4.1.0 with linked review artifacts. Surfaces modelled as 7 component-context roles over a 12-step achromatic scale that inverts in dark mode, with deliberately non-linear perceptual spacing and a documented rationale.

Distribution across platforms and frameworks: five independently-versioned packages — DTCG (canonical interchange), CSS, JS, Tailwind, and a shadcn/ui slot adapter — built from one resolved source, where build-time selection uses flat namespaced entrypoints and runtime selection uses `[data-theme][data-density]` plus `prefers-color-scheme`.

**[BCN]** A second, independently-built semantic system for the same brand: 10 role families with fixed anatomy (`bg` trio, tint stack, text ladder, `on`, `border`, `accent`), dual schemes as separate scheme sets, and a five-tier deployment grammar layered above components that required no new tokens.

**Bootstrapping specifically:** both systems were built from scratch — the Underline system from its first commit in 2022, and Beacon as a clean-slate re-architecture in 2026 with a new vocabulary, a new layer model, and a resolver-ordered build.

### Own the design system repo on GitHub — source of truth for components, tokens, standards, versioning, release management, changelog

**[UDS]** 1,412 commits over four years, ~92% authored by the candidate. 20 tagged releases from v0.5.0 to v8.0.0, each with a generated changelog carrying explicit breaking-change sections and migration instructions. Release engineering: release-please with a version manifest for independent per-package semver, six CI workflows, three release triggers (manual dispatch, weekly schedule, auto-suggestion at ≥5 commits of delta), and a `guard-dist` workflow enforcing that built output stays pipeline-owned. Two version namespaces held deliberately separate — content version (resolver and theme snapshots, stamped by the pipeline) vs distribution version (npm semver, how consumers pin).

### Set and uphold a high bar for visual design quality

**[BCN]** Foundations specified at a level of visual precision that is checkable rather than asserted: warm-neutral base ramp that warms as it darkens to `#140b06`, warm-tinted elevation using that same value, interaction that lightens on hover for a teal-600 brand with the explicit note that "deepen-on-hover would be wrong here," a restrained radius scale where 8px is the card workhorse and "nothing gratuitously round," flat backgrounds with no gradients or noise, motion at 120–320ms on a single easing curve with no bounces on content, and 31 live specimen cards documenting all of it.

**[UDS]** Quality enforced at the value level: a `gray.500` change shipped with its perceptual consequence measured and disclosed ("~2% lighter"), palette assignments swapped to restore monotonic luminance progression, and surface scale spacing tuned non-linearly for real component needs rather than mathematical tidiness.

### Navigate mobile / web / React differences and encode them into the system

**[UDS]** Encoded rather than documented: framework-agnostic component specs that reference role-channel namespaces and never per-scheme values, with styling and mapping layers made **optional adapter layers** in v8.0.0 so platform differences live in adapters instead of the contract. A shadcn/ui adapter package translates the system into a third-party slot vocabulary. Density (`compact` / `cozy`) is a first-class resolution dimension. Mobile constraints appear in the contract itself — the Button spec requires a 44px minimum touch target and keyboard activation via Enter and Space.

**[BCN]** Phone-first layout as a structural commitment: `layout.css` *is* the phone baseline, with tablet and desktop adding overrides on top at 320 / 768 / 1280.

**[DTF]** Platform divergence handled as computation where it belongs: `outline-radius()` exists because Figma cannot render `outline-offset` while browsers can, and its documentation states "FE consumers should ignore this — the browser computes it automatically."

### Define and run the contribution model and governance

**[UDS]** This is the strongest area of evidence. An eight-article written constitution as apex charter, two separated governance domains with a one-sentence boundary test, rules authored once as machine-readable data with every other surface a generated projection, and **drift as a CI failure**. A canonical filing map that routes every artifact to its home, with hooks validating placement and metadata at write- and commit-time — designed so "a non-technical designer working through an agent can contribute correctly without memorizing the structure."

The contribution mechanics: Conventional Commits enforced locally and in CI with a documented type→semver table, branch naming tied to issue keys, PR title format, required PR metadata, a body template with a fixed milestone taxonomy, a published reviewer checklist, merge requirements, four-layer protected-branch enforcement, and a written violation-response procedure. 30+ ADRs, each declaring the constitutional articles it implements, with constitutional amendment held to higher ceremony than ordinary decisions.

### Keep design and engineering in sync, bridging Figma and code

**[UDS]** Figma is the authoring surface via Supernova sync; the repo owns the resolver as the **structural authority** because Supernova's flat themes cannot express the four-dimensional model. Drift is caught mechanically: pre-commit Figma CSS sync validation on `.figma.ts` and token changes, Code Connect with CSS token injection, and `figma:check-sync`. Renames preserve Figma UUIDs so a code-side rename does not orphan a design-side variable. Where the tooling was broken, the candidate wrote the bridge: the `Tokens Studio Crowbar` Figma plugin, built to route around a specific upstream defect, with mode/collection selection, a pre-mutation preview of affected count, and no network access.

### Own first-class documentation and drive adoption

**[BCN]** A 368-line governance readme structured so that reading order is resolution order, 31 specimen cards grouped as a learning path, and a single self-contained offline archive containing governance, cards, the full dual-scheme token reference, and the verbatim source of all 46 files — "Nothing summarised away."

**[UDS]** A documented documentation model: authored in Supernova, published to a hosted docs site, and mirrored into the repo's `knowledge/` for local discovery, with the generated content marked as generated. Content separated by maturity (`drafts/` → `knowledge/`) with promotion as an explicit act.

**[DTF]** "Education built in" as a stated design principle, delivered as a VitePress site with concepts, getting-started, authoring, integrations, troubleshooting, roadmap and FAQ guides, three published specifications, per-function example pages, and a planned generator that derives documentation from function metadata.

### Bake in accessibility (WCAG) and theming including dark mode as defaults

**[UDS]** Contrast as machinery: a verification script grading every semantic background AA/AAA in both themes; migration of the default contrast model to **APCA**, flipping 21 palette tokens; APCA formula provenance added to 99 `on_` tokens; semantic `on-*` delegated to APCA-computed palette tokens so contrast is computed once at source; alpha-composited backgrounds corrected in the contrast calculation; dedicated ADRs for warm-hue contrast limits, intent-aware thresholds, contrast-target architecture and disabled desaturation; and an overrides registry for hand-tuned exceptions that CI validates **bidirectionally** so an untracked exception fails the build.

**[BCN]** Dark mode as a fully-defined separate scheme set rather than a switch, with `on.*` computed by APCA per step and never hand-edited, pair-by-pair Lc verification of the derived dark layer, and every documented deviation from the naive mirror justified with its Lc arithmetic.

**[MAP]** Field context for how rare this is: values solved to a contrast target 4%, perceptual contrast targets via APCA 2% with **zero** evidence across 22 audited public systems.

### Maintain a roadmap balancing net-new, migrations, and deprecations

**[UDS]** Twenty releases with breaking changes managed rather than avoided: a 4-level → 8-level intensity expansion, removal of the `inverse` role in v7.0.0 in favour of component-level theme switching, a text-token collapse from 30 to 5 tokens, a 50+ reference dark-theme palette migration, and a deliberate era boundary that retired the in-repo build and froze the prior era in git history with the recovery command published in the release note. Deprecation handled as a governance act (Article 6), not as neglect.

**[DTF]** A published version-scoped roadmap where each gap is tagged by the release it blocks, resolved blockers are struck through rather than deleted, and the largest outstanding gap is stated in the project's own documentation.

### Bring AI tooling into the design systems workflow / build in an AI-native way

**[UDS]** Article 1 of the constitution makes agent navigability a design goal, not an add-on: a home "that agents and humans alike can navigate in orthogonal and drift-resistant ways." Concretely: a full agentic operating layer with registries, patterns, policies, hooks and guides including a spec-driven-development guide; a machine-readable rules format (TOON) specified in-repo and used for every governance projection; the `Arbuckle` workstream framework with per-workstream ADRs, an append-only event log and 15+ tracked workstreams; ADRs specifically for agentic access to the token system (component-level targeting schema, component policy schema, validation app architecture); `knowledge/` maintained as a generated mirror "for local agentic discovery"; and agent-authored commits held to the same PR governance as human work.

**[BCN]** A `SKILL.md` manifest specifying how an agent should consume the system, and packaging designed for single-pass ingestion.

**[MAP]** The adoption context, measured: AI built into system processes 10%, documentation delivered to agents 12% (3 of 22), machine-readable component schemas 2% (1 of 22).

### Operate with autonomy in a fast-moving, ambiguous environment

Every artifact in this corpus was built solo. **[UDS]** 1,031 commits in 2025 alone. **[DTF]** A published npm-installable OSS project with CI, release automation, and three specifications. **[MAP]** A field model built from primary sources, then partially demolished and rebuilt after self-audit.

---

## Qualifications

| Requirement | Evidence |
|---|---|
| Extensive experience owning design systems at large organizations | **[UDS]** four years, 20 releases, ~92% of commits, multi-brand (underline / pci) with sub-brand deltas; prior product leadership at Neighborly and Edge Up Sports |
| True 50/50 design-engineer | **[BCN]** visual foundations, ramps, type roles, motion and specimen design; **[UDS]/[DTF]** TypeScript tooling, validators, parsers, CI, release automation, published npm packages, a Figma plugin |
| Impeccable eye for visual design | **[BCN]** warm-neutral ramp construction, warm-tinted elevation, restrained radius scale, editorial type pairing, understated motion spec; **[UDS]** perceptual luminance progression, quantified visual-shift disclosure |
| Deep understanding of mobile / web / React differences | **[UDS]** framework-agnostic specs with optional platform adapter layers, shadcn adapter, density dimension, 44px touch targets; **[BCN]** phone-first layout |
| Strong product sensibilities for evaluating contributions | **[UDS]** spec-last component model where a component "earns its spec by surviving exploration"; enum membership derived from a channel contract rather than preference; milestone taxonomy on every PR |
| Fluency in Figma, primarily living in GitHub | **[UDS]** Figma/Supernova authoring with a custom exporter, Code Connect, sync validation, a hand-written Figma plugin — while the repo holds the enforced source of truth |
| Designing and maintaining semantic tokens and scalable component APIs | **[UDS]** 9 roles × 18 intents, versioned semantic spec, typed component-spec meta-model with schema + token-existence + intent-backing validation; Button API as intent × appearance × size |
| Track record driving adoption through documentation and partnership | **[BCN]** archival documentation model and agent manifest; **[UDS]** Supernova docs pipeline, filing map, contribution guide designed for non-technical contributors working through agents; **[DTF]** education-first public docs |
| Working knowledge of WCAG and how to build it in | **[UDS]** AA/AAA verification in CI, APCA migration, 99-token provenance backfill, alpha-composite correction, bidirectional override registry; **[DTF]** APCA adapters |
| Readiness with new AI tooling, comfort with ambiguity | **[UDS]** agent-collaborative repo with governance designed for machine consumers; **[MAP]** removed a headcount axis partly because "agentic tooling is decoupling contributor count from output" |

## Nice-to-haves

| Requirement | Evidence |
|---|---|
| Semantic token system from scratch across multiple platforms | **[UDS]** built from first commit; five platform packages from one canonical DTCG source |
| Scaling a system through fast org growth | **[UDS]** 2022 → 2026 at a fiber infrastructure company the candidate co-founded, spanning two brands and a sub-brand model |
| Defining contribution models and governance for multi-team systems | **[UDS]** written constitution, two governance domains, filing map, four-layer branch protection, reviewer checklist, 30+ ADRs |
| Familiarity with component tooling and documentation platforms | **[UDS]** Supernova (docs, Figma Sync, Contexts, Forge prototyping), Tokens Studio, Style Dictionary 5, sd-transforms, Leonardo, release-please, commitlint, husky, ajv, ts-morph; a spec-sandbox ADR series covering Vite/Lit architecture and Docker evaluator isolation. **Gap: no Storybook** — the component surface was documented in Supernova and specified as machine-validated contracts instead |
| Mentoring and growing a design systems practice | Partial. Led product design and management with direct reports at Underline and prior leadership at Neighborly; the design system itself was operated as a solo practice. The mentoring surface in this corpus is documentary — governance and contribution design meant to make a non-specialist contribute correctly — rather than a record of mentees |

---

## Honest gaps

Stated plainly, because the rest of this corpus argues that naming limits is part of the method.

- **Storybook.** Not used. Component documentation lived in Supernova; the enforced artifact was a schema-validated spec. Familiar with the category, not with that tool in production.
- **Native mobile.** Platform differences are encoded through density, adapter layers, touch-target rules and framework-agnostic specs — but the shipped distributions are web-oriented (CSS, JS, Tailwind, shadcn, DTCG). No iOS/Android native token pipeline.
- **Team scale.** Both systems were architected and operated substantially solo. Governance was designed for multi-team contribution and enforced mechanically, but the record does not include years of shepherding high inbound PR volume from many feature teams.
- **A published component library.** The Underline system deliberately became token-only, with components specified rather than shipped as a versioned React library; Beacon ships one component (Button) with tokens, types, and a specimen.
- **The Underline system is unmaintained.** It was abandoned after the candidate moved from Head of Product Design into an innovation role and the team changed leadership. The token-only pivot was an explicit attempt to make the system survive reduced stewardship; what followed is a fact about the organization, and it is in the record rather than omitted from it.


---

<!-- FILE: 07-evolution-thesis.md -->

# How I read the evolution of design systems and tokens

A position, with the evidence it rests on and the bets it commits to. Everything here is traceable to the three artifacts.

---

## 1. The format layer is settled; the contested layer moved

DTCG reached its first stable Format Module v1 in October 2025. The ecosystem converged on JSON tokens with `$value` / `$type` / `$extensions`, multi-file sets, theming, and modern color spaces (Display P3, Oklch, CSS Color 4). The build layer is well served — Style Dictionary 4.x, Terrazzo, `design-tokens-format-module`, Tokens Studio as an authoring surface.

The consequence is that "what shape is a token" has stopped being interesting. The contested questions are now **computation** (where does the derivation live?) and **resolution** (how does one set of names produce different values across contexts?). The Resolver Module exists only as a preview draft, which is exactly where a discipline's active argument is.

## 2. Tokens have been climbing an abstraction ladder, and the top rung is not values at all

Read as a sequence: raw values → primitives → aliases → semantic roles → contextual re-resolution → **declared derivation**. Each rung moves authorship further from the value and closer to the *rule that produces* the value.

Beacon sits at the second-to-top rung and shows what that costs and buys: nine ColorBox recipe ramps rather than hand-picked steps, a formula-derived 1.067 typescale, `on.*` foregrounds computed by APCA, a role layer whose dark scheme is derived by documented ramp mirroring with APCA verification, and a resolver-ordered import graph. In Beacon the *rules* are real — but they live in scripts, recipes, and a readme, not in the tokens. The `roles.css` instruction "regenerate them when a ramp changes" is a human-maintained invariant, which is precisely the weakness.

The top rung fixes that: the derivation is declared alongside the token and resolved at build with provenance intact. That is the capability my own map places at depth 6, requiring nine prerequisites and reached by 0.3% of the field and 0 of 22 audited public systems.

## 3. Depth predicts diffusion, and that is a planning tool, not a hierarchy of virtue

Adoption falls by roughly half per step of prerequisite depth (median field adoption 71% → 66% → 25% → 30% → 5% across depths 0–4; r = −0.73 against log adoption, ~53% of variance). This is what a prerequisite chain predicts: each rung multiplies the number of things that must already be true.

Two corollaries I hold to:

- **Depth is scaffolding, not difficulty or value.** A depth-1 capability can be harder to ship than a depth-4 one.
- **Adoption is not endorsement.** 5% is not therefore good; 86% is not therefore necessary. "What exists and how far has it spread" is a prior question to "should we build it."

The practical use is sequencing. A team's next move is not the most impressive capability, it is the shallowest unmet one whose prerequisites are already satisfied — which is why the capability map's self-scoring tool greys out capabilities whose prerequisites are unticked and orders suggestions by how common they are, "so the cheapest moves come first."

## 4. The real fight over computed tokens is custody, not capability

This is my central and most falsifiable claim. Computation in the token graph is already shipped, open-source, and capable — the Tokens Studio Graph Engine has colour, maths, logic and design-token nodes and emits tool-agnostic JSON or CSS variables through a CLI. And yet no team has published a production design system whose token values are computed by a graph pipeline: no engineering blog, no conference talk, no open repository.

I do not read that silence as a quality problem. I read it as custody: **computing tokens in a visual editor moves the source of truth out of git and into a proprietary canvas, and design system teams have spent a decade learning to keep that source reviewable as text.**

Which yields the design constraint I built to: computation must be *diffable*. `dtcg-formulas` declares the formula inside the token file under `$extensions.org.dtcg-formulas`, keeps `$value` resolved so any DTCG tool can read it, and stores a pointer to a definition file that lives in the repo. Review happens in pull requests, in text, where design system teams already work.

This is a bet and I state it as one. If the graph-canvas model crosses over into published production systems, the custody hypothesis is wrong and I should update.

## 5. Provenance is becoming the load-bearing property

The three bad places teams end up when deriving tokens from rules — hidden in proprietary tooling, encoded in ad hoc scripts, or collapsed into resolved values so "nobody remembers where `10px` came from" — are all provenance failures, not computation failures. Nothing prevents the arithmetic; what fails is the record.

So the artifact I care about is not the computed number, it is the tuple: resolved value, the formula that produced it, the definition it called, and enough metadata to regenerate, validate, and document it. Hence the rule inside `optimal-foreground`: all inputs must be explicit token references or literals, "no implicit pipeline configuration required. A consumer can recompute `$value` from the formula alone." A formula that only works inside the pipeline that wrote it has not preserved provenance; it has relocated the problem.

Beacon shows the same instinct without the mechanism: 201-token role vocabulary with the interpolation method, its anchors, its APCA-verified deviations, and its regeneration trigger written down; inferred content labelled as inferred; renames tracked mid-flight; rejected names kept with reasons. Provenance culture first, provenance tooling second.

## 6. Semantics are outrunning the token spec, and grammars are the next layer

Roles were the first move past aliasing: a family with fixed anatomy (`bg` trio, tint stack, text ladder, `on`, `border`, `accent`) instead of a color with a name. But roles still do not answer the question product teams actually ask, which is *which role may this part of the page claim?*

That is a layer above components and above tokens, and it is a grammar rather than a schema. Beacon's expression tiers are my attempt: five tiers keyed to the user's question, each binding to an existing role family, with a scarcity clause (lime is reserved for value to the user), a closure clause (no sixth tier), one-directional bindings (roles serve jobs outside the tier model), and pre-resolved collisions. The evidence that the underlying token model was factored correctly is that the grammar required **no new tokens, and dark came free through the role bindings**.

I expect this layer to formalize next, and I expect the current vocabulary to be inadequate for it. Naming remains genuinely unsolved: the field has "chrome" colliding with retired vocabulary, "frame" colliding with Figma, "primary" meaning both *the brand color* and *the decisive action* — the latter being why the tier model had to state explicitly that "a submit button concludes; an option button chooses among peers — only the latter is primary."

## 7. Accessibility is moving from guideline to computed constraint

The field-wide numbers say this transition has barely begun: values solved to a contrast target 4% (5 of 22), perceptual contrast targets via APCA 2% and **0 of 22 audited public systems**, against accessibility guidelines merely *documented* at 59%.

I treat contrast as a solved value rather than a reviewed one. In Beacon, `on.*` is computed per step by APCA and regenerated by script, never hand-edited; the dark role layer's parity is verified pair-by-pair with Lc annotated inline; `danger.on-rest` in dark is white against the source's black because |−66| > |44| on red-400. In `dtcg-formulas` the same conviction becomes portable infrastructure: `optimal-foreground()` as an adapter, `leo()` defaulted to APCA, `composite()` for Porter-Duff alpha so contrast can be computed against what the user actually sees rather than the nominal background.

The direction of travel is clear: contrast stops being a QA gate and becomes an input to value generation. APCA's perceptual model, including Helmholtz-Kohlrausch effects on saturated chromatic backgrounds, is what makes that computable in the first place.

## 8. Agent-readability is a real new capability family, and it is early

The map treats it as its own family with genuinely low adoption: experimenting with AI in the workflow 46%, AI built into system processes 10%, documentation delivered to agents 12% (3 of 22), machine-readable component schemas 2% (1 of 22).

I build for it directly. Beacon ships a `SKILL.md` manifest telling an agent how to consume the system — read the readme, explore the files, emit static HTML for throwaway visual work, read the rules for production code, and ask what the user wants to build when invoked without guidance — and the entire archive is packaged as one self-contained offline file precisely so it can be ingested whole. `dtcg-formulas` plans a JSON Schema for the extension and an editor LSP built on stable diagnostic codes, and its `.module.scssdef` format is designed to parse deterministically into a typed AST with documentation metadata attached to each function.

The underlying claim: a design system that is legible to an agent is a design system whose semantics are explicit — which is the same property that makes it legible to a new engineer, auditable in review, and safe to change. Agent-readability is not a separate initiative; it is the externally visible consequence of having done the semantic work.

There is also a second-order effect I have already acted on: agentic tooling decouples contributor count from output, which is why I removed designer headcount from my own model rather than keep an axis that no longer measures what it used to.

## 9. What I think happens next

- **The Resolver Module, or something like it, standardizes context resolution.** Declarative context resolvers sit at depth 5 with 3% field adoption but 4 of 22 audited systems — the classic shape of a capability that has crossed over at the top tail and not yet diffused.
- **Computation standardizes as metadata before it standardizes as execution.** This is why `dtcg-formulas` shipped the metadata surface at 0.1.0 (parse, register, document) and deferred compute to 0.2.0. Specs and documentation are the part consumers depend on irreversibly.
- **Adapters, not built-ins, carry the interesting domains.** Contrast, named colors, compositing, elevation and fluid sizing each pin to an external algorithm with its own release cadence. The right architecture makes them opt-in dependencies behind a documented `implement(args, ctx)` contract, not core surface area.
- **Preflight separates from compilation everywhere.** Cheap, adapter-free, fail-fast validation in CI is what makes computed tokens survivable in a real repo — which is why `lint` is contractually defined to never execute a formula.
- **The naming layer gets worse before it gets better.** Every system I have worked in is mid-rename somewhere. The discipline that will matter is recording the rename honestly, not pretending it resolved cleanly — `care` vs `program` in one system, `call` vs `formula` in the other, both logged and both routed to resolution.
- **Maturity models keep failing and capability models keep working.** A stage label tells a team it is "level 2." A prerequisite graph tells it which specific thing to build next and what that thing requires. I built the second because I do not believe the first survives contact with a real backlog.


---

<!-- FILE: 10-artifact-underline-design-system.md -->

# Artifact dossier — Underline Design System (`nrfta/design-system`)

**Repository:** `nrfta/design-system` (private) · **Package:** `@underline/design-system` · **Current version:** 8.0.0
**Lifespan:** first commit 2022-11-14 → last commit 2026-07-23
**Scale:** 1,412 commits · 126 merged PRs in the visible log · 20 tagged releases (v0.5.0 → v8.0.0) · 30+ architecture decision records
**Commit distribution:** Coty Beasley 1,365 + `beacrea` 164 ≈ **92% of all human commits**. Others: `dependabot` 50, `Claude` 22, Josemar Luedke 14, `github-actions` 12, Randall Morey 10, Christina Lynn 3, `voguetheory` 3.
**Activity by year:** 2022: 16 · 2023: 16 · 2024: 2 · **2025: 1,031** · **2026: 347**

**Status: unmaintained.** The system was abandoned after the author transitioned from Head of Product Design into an innovation role and the team changed leadership. This is the production-history layer behind Beacon and `dtcg-formulas`: the multi-year system those artifacts came out of.

---

## 1. Two eras, with a clean break

The repository's own Article 6 states the principle: "The system evolves by **clean breaks**, not perpetual accretion. When direction shifts materially, the prior era is **frozen** — its artifacts preserved in git history (commits and tags), not carried forward as a live in-tree directory."

**Classic era (2022 → mid-2026).** Tokens authored in-repo: DTCG canonical → `tokens-studio/` → built CSS/JS via in-repo generators, with Tokens Studio as the effective source of truth. This is the era that produced the semantic token system, the 8-level intensity model, the contrast architecture, the 20-release train, and the contribution/governance machinery.

**Beacon era (2026).** A deliberate pivot to a **token-only repository**: authorship moves out to Figma + Supernova, an external pipeline writes built DTCG distributions back, and the repo owns build inputs, governance, validation, and distribution. Recorded in ADR 001 (token authorship evolution) with its two stated forces:

- **Lowered authorship barrier** — "Tools like Claude Design (and platforms like Supernova) make flexible, native design-system authorship and multi-format builds practical *outside* the repo."
- **Reduced in-repo curation** — "With lighter hands-on stewardship, an external, automated pipeline that writes built tokens back is more sustainable than maintaining the build in-repo by hand."

The ADR names its alternatives and rejects them with reasons (keep the in-repo build — higher maintenance, counter to the simplify/automate driver; drop DTCG — rejected, DTCG conformance is the interchange contract), states its tradeoffs (a write-back contract and pipeline-only enforcement on `tokens/dist/**` are now required; the migration is phased), and preserves continuity ("Classic DTCG decisions remain available (frozen) for provenance"). The prior era's `archive/classic/` tree was then retired from the working tree in a second ADR, with the recovery command published in the breaking-change note: `git log --all -- archive/classic/` then `git show <sha>:<path>`.

Reading the pivot honestly: it is a succession plan. The author reduced the system's dependence on his own hands-on curation by moving authoring to a designer-facing surface and making the repo enforce contracts instead of hosting craft.

## 2. Governance: a written constitution with machine-checked conformance

Governance is the most distinctive thing in the repository, and it is structural rather than aspirational.

**One apex charter, eight articles** (`.repo-governance/constitution.md`), with a generated machine-readable projection (`constitution.toon`) and the Markdown declared canonical. Every rule, ADR, filing-map entry and hook must declare the articles it implements (`implements: [art-3, art-7]`).

| Article | Principle |
|---|---|
| 1 · North Star | A home for the design system "that agents and humans alike can navigate in orthogonal and drift-resistant ways, contribute to compliantly" |
| 2 · Orthogonality | Each concern has exactly one home along an independent axis; subject/brand/theme/identity are facets surfaced via a generated index, not duplicated folders; content splits first by maturity (`drafts/` vs `knowledge/`) |
| 3 · Single Source of Truth & Anti-Drift | Rules are authored once, as data. Every other surface — `CLAUDE.md`, `AGENTS.md`, `.cursor/rules`, `GOVERNANCE.md`, hooks, CI — is a pointer or generated projection inside `BEGIN/END AUTO-GENERATED` blocks. "**Drift is a CI failure** (`governance:verify`)." |
| 4 · Two Governance Domains | Repository governance and design-system governance are separate, with a stated boundary test |
| 5 · Compliant Contribution | The filing map routes every artifact; hooks validate placement and metadata at write- and commit-time. "A non-technical designer working through an agent can contribute correctly without memorizing the structure." |
| 6 · Era Boundaries | Clean breaks; prior eras frozen in git history |
| 7 · Asset Provenance | Built outputs are generated, provenance-marked, pipeline-owned, never hand-edited; who/what/when/version is recorded |
| 8 · Amendment | The constitution changes only via a constitutional-amendment ADR, after which the projection is regenerated and anti-drift re-verified. "Amendments supersede; they do not silently overwrite." |

**Two domains with a one-sentence boundary test.** *"Would this rule still matter if the design content were entirely different?"* → `.repo-governance/` (structure, filing, naming, root hygiene, commit/release process). *"Is it a statement about color/token/type/a11y/component behavior?"* → `.design-system-governance/` (tokens, semantic roles, contrast/WCAG, DTCG conformance, component contracts).

**Machine-readable rules.** Governance artifacts are authored as data in TOON (a format the author specified in-repo as `.claude/specs/toon-v1.0.md`): `filing-map.toon` for canonical routing, `structure.manifest.toon`, `root-allowlist.toon`, `validation/rules.toon` in both domains, `contracts/manifest.toon`, ADR `MANIFEST.toon` files, and a `frontmatter.schema.json` for required metadata.

**Maturity as a first-class axis.** `drafts/` holds in-flight, pre-authoritative artifacts; `knowledge/` holds settled content; promotion from one to the other is an explicit act.

## 3. Decision record discipline

30+ ADRs across the repository and its history, numbered and cross-referenced from the specs they govern. The design-system series is a genuine record of a color and contrast system being reasoned into existence:

`011` 8-level semantic intensity · `012` surface hierarchy and subtle tokens · `013` elevation-luminance principle · `014` two-track button mapping · `015` achromatic text polarity · `016` inverse surface context · `017` warm-hue contrast limits · `018` intent-aware contrast thresholds · `019` disabled desaturation · `020` contrast-target architecture · `021` inverse removal via theme switching

Plus workstream-scoped ADRs on contrast-driven semantic token generation, dark-mode neutral adjustment, intensity-based state mapping, a blue-700 ratio adjustment, package exports, component-level targeting and policy schemas for agentic token access, five-layer safeguards for the finish-work automation, and a spec-sandbox architecture series (meta-directive self-description, introspection over codegen, Vite/Lit architecture, template scaffolding, Docker evaluator isolation).

ADR numbers are load-bearing rather than decorative — the semantic token spec cites ADR-013 for the elevation-luminance principle and ADR-021 for the inverse removal, and the overrides registry cites ADR-006/DR-006 for its validation contract.

## 4. Token architecture (Facet 2.0, DTCG 2025.10)

**Pipeline.**

```
Figma variables → Supernova (Figma Sync) → custom exporter (flatten + carve)
  → tokens/source/tokensets/ (raw per-set DTCG, refs preserved)
  → tools/resolve-tokens + generated resolvers
  → tokens/dist/dtcg/ (core + per-theme snapshots)
  → format transforms → css · js · tailwind → packages/*
```

`tokens/dist/` is pipeline-only and never hand-edited; the README states the rule twice and the constitution backs it with Article 7.

**Ontology (domain-driven).** Domains: Design Philosophy, Brand Identity, Visual Foundations, Token Production. Visual Foundations subdomains: Core (sizing, spacing, typescales, palettes, border, shape, breakpoints, iconography), Semantic (typography, layout, symbology, surfaces, themes), Components, and **Algorithms** (color families, contrast, modular scale, color mixing) — algorithms treated as a first-class subdomain of the design system, which is the seed of `dtcg-formulas`. Bounded contexts: Beacon ↔ PCI. A published ubiquitous language defines *token*, *token group*, *set*, *modifier*, *resolver*, *theme*, and *resolved graph*.

**Sets (6).** `Global` (core primitives), `Palette`, `Typography`, `Iconography`, `Layout` (semantic), `Themes` (semantic). Every resolver includes Global and selects one of each other set.

**Modifiers (4 dimensions).** `brand` (underline, pci) · `sub-brand` (a brand-scoped codename that is "a sparse delta over its parent brand, not a fork" — `beacon` covers the external website and client-facing app; the innovation studio has its own codename) · `scheme` (light / dark) · `density` (compact / cozy). Resolution order: **core → brand → sub-brand → scheme → density**, later layers winning. A theme is a resolved tuple, not a category.

**Token contract.** Each token carries a valid DTCG `$type`, a `$value` (object form for color, `{value, unit}` for dimension, composites for typography/shadow), and `$extensions`. `$type` is derived from the value unit by rule — `Pixels → dimension`, `Raw`/unitless → `number` — which "handles the typography mix in one rule: the scale ratio (unitless) is a `number`; the base px and the computed typescale ladder are `dimension`." Sub-DTCG semantic roles that DTCG's `$type` enum cannot express (`borderRadius`, `sizing`, `spacing`, `gap`) ride in `$extensions.com.underline.role` — extending the standard through its own extension mechanism rather than deviating from it.

**Resolvers are generated from intent, not hand-written.** `tokens/source/resolvers/resolvers.config.yaml` declares each identity's domain structure — sets, schemes, screens, deltas — with **no file paths**; `tools/gen-resolver.ts` constructs tokenset paths and `$ref` plumbing and emits `tokens/build/resolvers/{brand}.{sub-brand}.v{semver}.resolver.json`, committed, generated, never hand-edited, conforming to a JSON Schema for the DTCG resolver draft. "Adding a new theme, brand, or sub-brand is a few YAML lines + regenerate — not code."

**Where the structural authority sits, stated explicitly.** "Supernova's own themes are flat (they mirror Figma variable modes) and do not express this multi-dimensional structure. So the **resolver is the structural authority**: the exporter flattens Supernova's model (applying its flat themes to capture per-scheme raw values) and carves it into sets; the repo-side resolver build composes the `brand → sub-brand → scheme → density` structure Supernova can't." That is a clean read of a vendor's limits and a decision about which layer owns the model.

**Meta-authorship provenance.** `tokens/authoring/` is explicitly **not** a pipeline input — it versions the derivation provenance upstream of Figma, e.g. the ColorBox config and output that produced a palette ramp (`underline.beacon.v1.colorbox.config.json`, `.output.json`, `.meta.md`). Regenerated values are applied in Figma and flow through the normal pipeline. The provenance of a value's *derivation* is versioned even when the value's *authoring* happens in a design tool.

**Formula layer in production.** `tokens/build/functions/` contains `composite.module.scssdef`, `radius.module.scssdef` and `math.module.scssdef` — the `dtcg-formulas` definition language in use inside the production repo, and a branch `chore/dtcg-formulas-adoption`. The OSS project is not a side project; it is the extraction of a layer this system needed.

## 5. Semantic token system (spec v4.1.0)

The `semantic.spec.yaml` contract is a versioned, reviewed specification with review artifacts linked (7 PRs and Linear issues), a `reviewed_by` field, a review date, and an explicit `breaking_changes` list.

**9 semantic roles:** `neutral`, `brand`, `accent`, `success`, `warning`, `danger`, `warmth`, `growth`, `innovation`.

**18 intents per role, in five groups:**

| Group | Members | Behaviour |
|---|---|---|
| Alias (1) | `default` | Non-brand roles → `firm`; brand → a perceptual alias (light: `medium`, dark: `soft`) |
| Translucent backgrounds (2) | `subtle`, `muted` | Alpha-modified palette refs |
| Solid backgrounds (6) | `soft`, `medium`, `firm`, `strong`, `bolder`, `boldest` | Direct palette refs, **monotonically progressive by luminance** |
| Contrast tokens (8) | `on-subtle` … `on-boldest` | WCAG AA text contrast per background |
| Alias contrast (1) | `on-default` | Tracks the `on-*` counterpart of whatever `default` resolves to |

Luminance progression is scheme-aware: solids darken `soft → boldest` in light and lighten in dark. Translucent intents are **excluded** from the monotonic constraint, with the reason given — "effective luminance depends on compositing surface." That exclusion is exactly the problem `composite()` and alpha-aware contrast later solved.

**Surface system:** 7 component-context roles (`app`, `canvas`, `card`, `panel`, `popover`, `scrim`, `inset`) over a 12-step achromatic `solid` scale (0–11) mapped to the gray family, where dark mode inverts the scale and the spacing is deliberately **non-linear**: "Steps may have unequal perceptual spacing to accommodate practical component needs (e.g., denser steps near canvas for subtle elevation, wider steps in midrange)." Governed by the elevation-luminance principle (ADR-013). Surface roles are ordered aliases → overlays → solids.

**Migrations are documented as engineering events, with impact quantified.** From the spec's own breaking-change list: intensity expanded from a 4-level to an 8-level scale; `inverse` role and `surface.overlay.inverse` removed in v7.0.0 in favour of component-level theme switching (ADR-021); text tokens collapsed from `text.{role}.{emphasis}` to `text.{emphasis}` (**30 → 5 tokens**); the dark theme migrated 50+ palette references from a 100–1000 to a 50–950 scale; achromatic `strong → boldest` renamed with **the Figma UUID preserved** so the design side didn't break; `medium ↔ firm` palette assignments swapped to restore monotonic luminance; `gray.500` changed `#797979 → #767676` with the visual consequence measured and disclosed in the release note ("Visual shift minimal (~2% lighter)").

## 6. Accessibility as machinery

- `tools/verify-contrast.ts` computes luminance and contrast ratios for every semantic background against white and black, labelling each **AA (≥4.5)** and **AAA (≥7.0)**, across both themes.
- The contrast model was migrated from WCAG ratio to **APCA** as the default, flipping 21 `on_` palette tokens (PR #369), and **APCA formula provenance was added to 99 `on_` palette tokens** (PR #379) — the provenance instinct applied at scale, before the formula spec existed as a package.
- Semantic `on-*` tokens were delegated to the palette's APCA-computed `on_` tokens (PR #383), so contrast is computed once at the source rather than restated per layer.
- Alpha compositing was corrected in the contrast calculation (DSYS-425: "correct semantic `on-*` contrast for alpha-composited backgrounds") — contrast measured against what the user actually sees.
- Hand-tuned exceptions are registered rather than tolerated. `.design-system-governance/rules/overrides.registry.json` holds "hand-tuned semantic token overrides that deviate from the computed darken/lighten pattern," and CI validates it **bidirectionally**: every registry entry must exist with the correct `$value` and no modifier in both the canonical and Tokens Studio files, *and* any override-like token in those files must have a registry entry. An untracked exception fails the build in both directions.
- ADRs `017` (warm-hue contrast limits) and `018` (intent-aware contrast thresholds) record where a single global threshold was found inadequate and what replaced it.
- The component spec carries accessibility as contract, not commentary: keyboard activation, focus-visible treatment driven by `roles.{intent}.border.focus`, disabled blocking focus handoff, a 44px minimum touch target on mobile, and the statement that "text/background pairs come from the role's on/text channels, which carry the system's contrast guarantees."

## 7. Multi-platform distribution

`packages/` is an npm workspace of **independently versioned, format-per-package** modules built from `tokens/dist/`:

`@underline/tokens-dtcg` (canonical resolved DTCG + resolver, for interchange) · `@underline/tokens-css` · `@underline/tokens-js` · `@underline/tokens-tailwind` · `@underline/tokens-shadcn` (an adapter to the shadcn/ui slot vocabulary)

Two principles govern distribution:

- **Independent semver** via a release-please manifest, so "multiple apps pin/upgrade each surface on its own cadence; a token change bumps only affected packages."
- **One package = all options; the structure selects.** Each package contains every brand / sub-brand / scheme / density. Consumers select at two different times: **build time** via flat namespaced entrypoints with no nested directories (`./core`, `./underline`, `./underline.beacon`) so a bundle carries only what it imports, and **runtime** via selectors (`[data-theme][data-density]` plus `@media (prefers-color-scheme)`). Multi-brand hosts importing several entrypoints and switching on `[data-brand][data-subbrand]` is documented as "the exception, not the default."

`dist/dtcg/` is canonical and css/js/tailwind are transforms of it. The `core` (shared) vs `theme` (per-scheme delta) split is justified by payload size and runtime theme switching.

**Two version namespaces, explicitly not to be conflated:** *content version* — the resolver (`beacon.v1-0-0`) and theme snapshots (`beacon.dark.v1`), stamped by the pipeline; *distribution version* — npm semver per package, driven by release-please from conventional commits, "how consumers pin."

## 8. Component model: spec-last

Components are modelled so that a component "earns its spec by surviving exploration":

```
Explore (Figma, core + semantic tokens only, no component tokens)
  → Takes (AI/Forge prototypes + developer implementations; divergence expected)
  → Consensus (component tokens authored only where earned)
  → Spec (schema-validated, framework-agnostic contract in the repo)
  → Distribute (packages + agentic development)
```

**Division of homes, stated as a rule:** component *documentation* is authored in Supernova and mirrored into `knowledge/` by a docs pipeline for agent discovery; the *machine spec* lives in the repo as the enforced source of truth. Specs reference tokens by role-channel namespace (`roles.{role}.{channel}.{leaf}`) and **never per-scheme values** — scheme resolution is the pipeline's job, never the spec's.

Validation (`npm run specs:validate`) checks three things: schema conformance, token-reference existence, and intent-role backing. The meta-model itself is a typed package (`schemas/component-spec/` with `component-spec.ts`, `variant.ts`, `behavior.ts`, `styling.ts`, `mappings.ts` plus a JSON Schema), and v8.0.0's breaking change made "ComponentSpec styling/mappings … optional adapter layers" — separating the behavioural contract from platform styling adapters.

**The Button spec** is the worked example of a component API designed as a contract: `intent` (primary, neutral, success, warning, danger, care) × `appearance` (filled, tonal, outlined, ghost) × `size` (xs–2xl), plus `disabled`, `type`, and leading/trailing icon slots; anatomy declared as parts (root, label, unit, leadingIcon, trailingIcon) with a structure string; states mapped to role channels; accessibility enumerated. Notably, the enum is defined by a **contract**, not a taste call: valid intents are "the roles that satisfy the interactive channel contract (`bg.{rest,hover,pressed}`, `border.{rest,focus,active}`, `text.*`, `on.*`)" — with `care` flagged as interactive but structurally divergent, and `value` and `care-alt` documented as joining the enum "when their roles gain interactive channels." Membership is derived from capability, and the not-yet-eligible cases are named.

## 9. Contribution model and release engineering

**Conventional Commits v1.0.0, enforced** by commitlint locally (husky) and in CI (`validate-commits.yml`), documented with an 11-row type table mapping each type to its semver impact and a worked example. Breaking changes require `!` or a `BREAKING CHANGE:` footer and trigger a major bump.

**Branches:** `<type>/<linear-key>-<slug>`, with branch prefixes required to match commit types.

**PRs:** conventional-commit titles; required metadata (assignee, labels covering branch type + milestone + status, and a Linear link); a body template with Summary / Changes / Milestone / Testing, where Milestone is a fixed taxonomy (Infrastructure | Components | Foundations | Pipeline). Automation applies metadata for PRs created through the internal `/finish-work` command; manual PRs must supply it.

**Review:** a published reviewer checklist (commit format, PR title, breaking changes documented, tests, docs updated for user-facing changes, tokens validated for token changes, no direct commits to protected branches) and merge requirements (≥1 approval, all CI green, conventional format verified, branch current with `main`).

**Protected branches, four enforcement layers:** GitHub rulesets → git `pre-push` hooks → agent hooks that warn on protected-branch prompts → AI pre-flight context checks. A written violation-response procedure exists for accidental commits to a protected branch (branch from current state, reset, retroactive PR, document the incident).

**Pre-commit validation:** commit message format, token validation when `tokens/` changed, and **Figma CSS sync** when `.figma.ts` or tokens changed — design-code drift caught at commit time rather than in review.

**Releases** are automated with release-please and a version manifest, triggerable three ways: manual dispatch, a weekly schedule (Friday 17:00 UTC checking the branch delta), and auto-suggestion where a post-merge workflow comments on PRs once the delta reaches ≥5 commits. Six CI workflows: `validate-commits`, `guard-dist` (enforcing that built output stays pipeline-owned), `release-automation`, `release-publish`, `release-backmerge`, `post-pr-merge`. Twenty releases shipped, each with a generated changelog and explicit breaking-change sections.

## 10. Figma ↔ code bridge

- **Supernova** as the Figma Sync surface and documentation home, with a custom exporter re-typing the model to DTCG and carving it into sets.
- **`Tokens Studio Crowbar`**, a purpose-built Figma plugin written to work around a specific upstream defect — Tokens Studio's inability to modify existing Figma variables that carry aliases ([tokens-studio/figma-plugin#3209](https://github.com/tokens-studio/figma-plugin/issues/3209)) — by converting variable aliases to literal values so Tokens Studio can then assign tokens correctly. It ships collection/mode selection, a preview of affected count before mutating, and `networkAccess: none`. Later migrated to the async Figma API with deep alias resolution (PR #366).
- **Figma Code Connect** setup with CSS token injection, plus `figma:check-sync` and a pre-commit sync check on `.figma.ts` files.
- **UUID-preserving renames** (achromatic `strong → boldest`) so a token rename in code does not orphan the Figma variable.

## 11. AI-native operation

This repository was run as an agent-collaborative codebase years before that was common, and Article 1 makes it a design goal: a home "that **agents and humans alike** can navigate in orthogonal and drift-resistant ways."

- `.claude/` holds a full agentic operating layer: registries, patterns (`token-value-change.md`, `token-comparison.md`), policies, agents, workflows, hooks (`user-prompt-submit.sh`), per-workstream progress files, and guides — `spec-driven-development.md`, `agentic-patterns.md`, `command-conventions.md`, `directory-placement.md`, `migration-plans-v2.md`.
- **TOON**, a machine-readable rules format, is specified in-repo (`.claude/specs/toon-v1.0.md`) and used for every governance projection.
- **Arbuckle** (`.arbuckle/`) is a git-resident workstream planning framework the author designed: workstream directories each with their own ADRs and plans, a document-type registry, a harness registry, an append-only `events.log.jsonl`, and an index — 15+ workstreams tracked, including `8-level-semantic-tokens`, `contrast-driven-semantic-token-generation`, `supernova-token-compat`, `responsive-layout-tokens`, `dtcg-exporter`, and `token-governance-agentic-access`.
- ADRs exist specifically for **agentic access to the token system**: component-level targeting schema, component policy schema, and a validation web-app architecture — governance designed for machine consumers.
- Linear is wired into the workflow (DSYS project, work contexts, post-merge Linear sync), and 22 commits are co-authored by an agent under branch conventions (`claude/*`) that keep agent work inside the same PR governance as human work.
- `knowledge/` is a generated mirror of Supernova documentation maintained specifically "for local agentic discovery," with a generated `index.toon` front door.

## 12. What this artifact establishes

Beacon shows the token architecture at rest; `dtcg-formulas` shows the standards-track infrastructure; the capability map shows the field model. This repository shows the thing those three cannot: **a design system owned end to end, in GitHub, across four years and twenty breaking-change-managed releases** — with a written constitution, machine-checked anti-drift, 30+ decision records, a semantic token system that survived a 4→8 level intensity migration and an inverse-role removal, five platform distribution packages on independent semver, an enforced contribution model with four-layer branch protection, WCAG and APCA verification wired into CI with a bidirectionally validated exception registry, a Figma bridge including a custom plugin written to route around a vendor bug, and an agent-collaborative operating layer.

It also shows the author's honest ending: the system is unmaintained. The pivot to an externally-authored, contract-enforced, token-only repository was a deliberate attempt to make the system survive reduced stewardship — and the record of what happened after leadership changed is itself evidence about what design systems need from organizations, not only from architects.


---

<!-- FILE: 04-artifact-beacon.md -->

# Artifact dossier — Beacon Design System

**File:** `artifacts/Beacon-Design-System-Complete-Archive-Standalone.html`
**Identity:** Beacon · Underline's brand within Facet · resolver v1.0.0 · archived 2026-09-01
**Contents:** 5 parts · 31 specimen cards · 46 source files · 2 schemes (light base, dark tuned)

A single offline HTML file containing the governance readme verbatim, the agent skill manifest, all 31 specimen cards rendered live, the complete live token reference for both schemes, and the verbatim source of every file. Its own framing: "Nothing summarised away — this is the archival record."

---

## 1. What Beacon is, ontologically

Beacon is defined as **three things at once**, which is the clearest single example of the author's modelling habits:

1. the **resolver identity** (`beacon`, v1.0.0) that composes the token graph,
2. a **bounded context** in Facet's context map (Beacon ↔ PCI, the sibling brand),
3. the base of the **theme** — Beacon Light / Beacon Dark = `{brand: underline} × {scheme: light | dark}`.

Facet 2.0 is the central design authority across Underline holding the shared token architecture and vocabulary; Beacon is the piece of Facet that belongs to Underline. This is DDD vocabulary (bounded context, context map) applied to brand architecture, combined with a product-of-sets formulation of theming.

## 2. Vocabulary (enforced)

| Term | Definition |
|---|---|
| **Global** | Mode-free math primitives — sizing, spacing, typescale, shape, borders, breakpoints. No color, no brand. |
| **Set** | A swappable instance of a subdomain (palette / typography / iconography). Sets are the swap points. |
| **Modifier** | An axis that re-resolves the same token names to different values. Beacon has two: theme and screen. |
| **Alias** | A semantic token pointing at another token (`surface.page → color.base.50`) rather than a raw value. |
| **Resolved graph** | The flattened output the resolver produces for a given `{set, theme, screen}` selection. |

Rule: components consume aliases, never raw steps. Light is the base scheme; dark is a **separate scheme set**, treated as distinct sets that each resolve the names independently — "not one set with a switch."

## 3. Layer architecture

| Layer | File | Axis / mode |
|---|---|---|
| Global (math only) | `tokens/global.css` (270 lines) | single mode — sizing root scale, spacing flavors, 1.067 typescale, shape, borders, breakpoints |
| Palette **set** | `tokens/palette-beacon.css` (244 lines) | ramps + per-family roles (bg/border/solid/text/icon) + APCA-computed `on.*` |
| Typography **set** | `tokens/typography-beacon.css` (138 lines) | 7 type roles × sizes |
| Iconography **set** | `tokens/iconography-fontawesome.css` (128 lines) | active alias, weight numbers, symbol map |
| **Theme** modifier | `tokens/themes.css` (204 lines) | light (base) · dark, via `[data-theme]` — surfaces, roles, text, elevation |
| **Role** layer | `tokens/roles.css` (355 lines) | scheme-scoped `--role-<family>-<slot>` sub-systems |
| **Screen** modifier | `tokens/layout.css` (72 lines) | phone baseline · tablet · desktop via media queries |
| **Component** tokens | `tokens/components/button.css` (417 lines) | `--button-*` aliases → semantic + global layers |

`styles.css` (20 lines) is the resolver analogue: consumers link that one file, and its comment states the import order mirrors `beacon.v1-0-0.resolver.json` `resolutionOrder`, with the component layer importing after the semantic layer it aliases.

## 4. Visual foundations

**Overall.** "Editorial and grounded — a serif-led, warm-neutral system with a teal brand anchor. Reads more like a confident print magazine than typical tech SaaS." High contrast, generous whitespace, few decorative flourishes.

**Color.** Brand = teal; primary at `--teal-600` `#076873` = `roles.primary.bg.rest`. Interaction *lightens* — hover `teal-400`, pressed `teal-900`; "deepen-on-hover would be wrong here." `teal-700` `#01525C` is the ColorBox lock hex only. Deep hero surface is `teal-900/950` full-bleed behind the white brandmark. The `base` ramp is neutral at the light end (`#f8f8f8 → #ececec`) and **warms as it darkens** to `#140b06` (base-950); "never use a cold/blue grey." Shadows are warm-tinted `rgba(20,11,6,…)`. Nine generated ramps; only the palette tier holds hex values. Accent = `--red-500`, used sparingly. Yellow is unbound.

**Type.** Seven roles — `marquee` (Domine, editorial display), `header` (Open Sans bold), `body` (Open Sans), `code` (Source Code Pro), `caption`, `label`, and `strong` (emphasis role for prices/numerics, replacing the old "general"). Roles anchor at different typescale offsets. Line-height: tight 100% · default 120% · relaxed 150% · easy 140%. Tracking: condensed −1 · tight −0.5 · default 0 · relaxed +1.

**Sizing.** `sizing` is the root scale — a 50+ step ramp with playful codenames where **the codename var IS the canonical name** and the bare `--sizing-N` alias is kept for math: `1-speck, 2-dust, 4-crumb, 6-point, 8-grain, 10-seed, 12-pellet, 14-bead, 16-sequin … 1200-baguette, 1440-croissant, 2448-pizza`. `spacing` aliases it with its own named flavors — `16-subtle`, `12-modest`, `24-relaxed`, `32-airy`, `48-distinct`, plus sliver/squeak/smidge/tight/snug/neat/easy/drafty/generous/grand. Instruction: prefer the named flavors in layout.

**Shape and elevation.** Restrained radius scale — 2 (xs), 4 (sm), 6 (md), **8 (lg — the workhorse for cards)**, 12 (xl), default 20, plus full pills; "nothing gratuitously round." Cards: white surface, 1px warm-neutral border, 8px radius, soft small shadow — "flat and quiet, not glassy," leaning on `--border-subtle` + `--shadow-sm` over heavy drops. Backgrounds predominantly flat, no gradients or noise.

**Motion.** Understated — standard easing `cubic-bezier(0.2,0,0,1)`, 120–320ms, fades and short slides, no bounces on content, respects `prefers-reduced-motion`. Scale transforms reserved for small interactive chips.

**Iconography.** Font Awesome 7 Pro self-hosted (Light 300 / Regular 400 / Solid 900 OTFs via `@font-face`); desktop OTFs ship ligatures so glyph names render as icons. Default style light; regular/solid for emphasis. Monochrome, inheriting `currentColor`, sized on the 4px grid (16/20/24). No emoji as iconography, no decorative unicode in product UI. The only bespoke brand vector is the brandmark, drawn with `currentColor`.

## 5. Semantic layer

Three families bound by the theme modifier (replacing what earlier drafts loosely called "chrome"):

**Surfaces** — `surface.page` · `surface.card` (rest/selected) · `surface.input` · `surface.modal` · `surface.overlay`, where the overlay set is a scrim plus subtle/soft/medium/strong tints, each with a light-on-dark `-lift` variant.

**Roles** — ten families, each a full sub-system in `roles.css` as `--role-<family>-<slot>` across both schemes, with fixed anatomy:

| Slot group | Members |
|---|---|
| `bg` | rest / hover / pressed — the solid interaction trio |
| tint stack | `tonal` (alpha wash) · `subtle` · `highlight` · `bright` — faintest → strongest |
| text ladder | default / strong / subtle / disabled |
| `on` | rest / hover / pressed / tonal — the APCA-legible foreground per bg |
| `border` | rest / focus / active |
| `accent` | brand / key — the family's identity swatches |

Families: `neutral` (greys, text, hairlines, overlays — the workhorse) · `primary` (teal, the brand) · `value` (green/lime — metrics and numbers; the signature lime lives here) · `decorative` (orange) · `warning` (orange) · `success` (green) · `danger` (red) · `care` (pink) · `care-alt` (violet, accent-only — "the emotional tone for human-focused areas of the application, such as social programs") · `disabled`. Accent-only roles carry `brand`/`key` plus tint slots and no interaction trio. `themes.css` keeps shorter friendly aliases (`--brand`, `--success`); `roles.css` is the comprehensive layer new work should prefer. **There is no `info` / blue role.**

**Text** — emphasis ladder `high` (black) · `med` (base-700) · `low` (base-500) · `muted` (base-300), each with an `-inverse` for dark surfaces.

## 6. Expression layer — the deployment grammar (draft)

Facet 2.0's five-tier color hierarchy for Product UI (C. Lynn, 2026-06-15) translated into Beacon vocabulary. Not a token layer: a grammar for which role each category of product UI may claim, sitting above components in the stack, indexed as group 5 so the deployment concept is taught before the scheme detail it draws on.

| Tier | The user is asking | Binds to |
|---|---|---|
| 1 · shell | "Where am I now and how do I move somewhere else?" | `role.neutral` solid trio — absolute black (light) / white (dark) |
| 2 · primary | "Which of these are right for me?" | `role.primary` solids + border (selected) |
| 3 · secondary | "What else should I know?" | `role.primary` tint stack (`bg-subtle`, `bg-tonal`) + text — never the solid |
| 4 · decorative | "The feels associated to the brand." | `role.decorative` (+ primary tint slots) |
| 5 · value | "What's this worth and is it valuable to me?" | `role.value` — brand lime + `bg-subtle` / `bg-highlight` |

Rules: lime is reserved for value to the user (accumulated or recommended) and never for FABs, decoration, status, category labels or filter chips; shell stays neutral even when it is the page's most prominent button; no sixth tier. Edge cases pre-resolved: success uses `role.success` (text green-800, distinguishable from lime, never in onboarding); warning/danger pair icon + label, never color alone; when cart and FAB are both visible the FAB drops to tier 3 because two lime elements compete. Bindings are one-directional — roles serve jobs outside the tier model, so achromatic CTAs are shell "even when pressing them is the page's decisive act."

## 7. Schemes, defined and asymmetric

| Token group | Light (base) | Dark |
|---|---|---|
| `surface.page` | base-50 `#f8f8f8` | base-950 `#140b06` |
| `surface.card` (rest) | white @ 90% `#FFFFFFE6` | base-800 `#39332e` (opaque) |
| `surface.modal` / card selected | white | base-900 `#241c17` |
| `surface.input` / `surface.sunken` | white / base-100 | black / black |
| overlays (subtle→strong) | black 2/4/7/11% | white 3/6/15/24% |
| overlay lifts | white 30/50/70/90% | same — scheme-invariant |
| text high/med/low/muted | black · base-700 · base-500 · base-300 | white · base-400 · base-600 · base-800 |
| primary rest → hover → pressed | teal-600 → teal-400 (lightens) → teal-900 | teal-300 → teal-500 (darkens) → teal-100 (flashes light) |
| link / focus border / ring | teal-600 · teal-400 · teal-400 | teal-300 · teal-300 · teal-300 |
| borders subtle/default/strong | base-200/300/400 | base-800/700/600 |
| success · warning · danger (solid) | green-400 · orange-500 · red-500 | green-400 · orange-300 · red-400 |
| status subtle tints | 50s / 100s | 950s / 900s |
| shadows | warm-tinted `rgba(20,11,6,…)` | deeper, pure black |

Interaction semantics per scheme: light lightens on hover and darkens on press; dark darkens on hover and flashes light on press — "each scheme moves toward its page and away on press. Keep this inversion."

## 8. Content fundamentals

Voice: plain-spoken and confident — "an infrastructure company that refuses to sound like a telecom." Short declaratives over feature lists. The customer is *you*; the company is *we*. Sentence case everywhere, ALL-CAPS reserved for tiny overlines. Numbers concrete and honest — "2 Gbps," "99.99% uptime," "$0 install." Tone words: clear, local, fast, dependable, no-nonsense; avoid hype adjectives. No emoji. Em dashes for asides; no exclamation-point spam. Marked as inferred from brand context, to be refined against real product copy.

## 9. Flags and open decisions (verbatim substance)

- **Dark role layer is interpolated (2026-07-06).** Light (`beacon.light.tokens.json`, 201 tokens) is source of truth; the dark source covers ~40% in an older `solid-` vocabulary. Dark derived by ramp mirroring (50↔950, 100↔900, 200↔800, 300↔700, 400↔600), anchored to every value the dark source defines, then verified pair-by-pair with APCA. Deviations named with quantities: `text-disabled` pulled brighter (mirrors fell to |Lc| 12–17 vs light's 26–38); dark `danger.on-rest` = white, overriding the source's black (|−66| > |44| on red-400); disabled solid = base-600 not the mirror's 700; alpha tonals roughly double their alpha. Lc values annotated inline in `roles.css` and on role cards; regenerate when a ramp changes.
- **Primary is teal-600, not 700.** teal-700 remains only the ColorBox lock hex; earlier drafts pinned `--brand` to 700 — corrected.
- **No `info` role.** Blue is in the palette but unbound; `--info` in `themes.css` is a local convenience only.
- **`care-alt` renamed from "prince" (2026-07-06, C. Lynn)** to match the token source key.
- **`care` vs `program`** — the dark source still names pink "program"; treated as one role mid-rename.
- **Icon token base names "Font Awesome 6 Pro"** and only `alert → warning` exists in the token source; the richer symbol map on the card was inferred — "treat it as a proposal until the set is expanded."
- **Expression tiers are a draft** translated from the Facet 2.0 proposal; tier-1 naming settled on "shell" (rejected: "chrome" — collides with retired vocabulary; "frame" — collides with Figma; "anchor" — dropped). The draft is light-only but Beacon inherits dark automatically because every tier binds to a role; the draft's "absolute black" phrasing should be restated upstream as `role.neutral.bg.rest` so it schemes. The value role's re-chartering from "metrics and numbers" to "value to the user" is to be taken back to the token source.
- **Domine weight** tops out at 700 on Google Fonts; used as the heaviest display weight. Fonts load from the Google CDN with self-hosting instructions in-file.
- **Token Naming Proposal v3** is an open proposal to simplify role-token names, explicitly not applied to `tokens/*.css`.

## 10. Agent manifest (`SKILL.md`, verbatim)

> Read the README.md file within this skill, and explore the other available files. If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
>
> Key files: `styles.css` (link this for all tokens), `tokens/` (colors, typography, fonts, spacing), `guidelines/*.card.html` (foundation specimens), `assets/underline-brandmark.svg`.

## 11. Specimen card index (learning order)

0 · Overview (token architecture, brandmark) — 1 · Global math primitives (typescale, sizing & spacing, shape) — 2 · Palette set (ramp generation, the ramps teal-first, role bindings & `on` tokens) — 3 · Typography set (families & weights, marquee scale, text roles) — 4 · Iconography set (symbol map) — 5 · Expression draft (the five tiers plus an annotated specimen page) — 6 · Theme modifier (surfaces & text, role anatomy with primary as specimen, feedback roles, identity & accent roles, elevation & focus — all dual-scheme with APCA Lc badges) — 7 · Screen modifier (phone-first layout across screens) — 8 · Components (Button: solid & ghost, five ramp-snapped sizes, pill shape, states in the token-source vocabulary, render driven entirely by `--button-*` tokens).

Full file inventory also includes `tokens/fonts.css`, `assets/underline-brandmark.svg`, self-hosted FA 7 Pro OTFs, `uploads/colorbox-recipes.json`, `colorbox-steps.json`, `components/Button/Button.jsx` + `Button.d.ts` + `button.card.html`, `thumbnail.html`, and 30 `guidelines/*.card.html` files — 46 files total, reproduced verbatim in Part V so that "together these reproduce the design system exactly."


---

<!-- FILE: 05-artifact-dtcg-formulas.md -->

# Artifact dossier — `dtcg-formulas`

**Site:** [dtcg-formulas.org](https://dtcg-formulas.org) · **Source:** [github.com/beacrea/dtcg-formulas](https://github.com/beacrea/dtcg-formulas) · **License:** MIT
**Tagline:** "A documentation-first, pluggable formula layer for DTCG design tokens." / "Extensible computation registry for design tokens."
**Status:** `@dtcg-formulas/spec`, `@dtcg-formulas/parser`, `@dtcg-formulas/registry` published at **0.1.0** on npm; resolver, builtins and CLI on the 0.2.0 track.

---

## 1. The problem it addresses

DTCG reached its first stable Format Module v1 in October 2025, and the ecosystem converged on JSON tokens with `$value` / `$type` / `$extensions`, multi-file support, theming, and modern color (Display P3, Oklch, CSS Color 4). The build layer is well covered — Style Dictionary 4.x, Terrazzo, `design-tokens-format-module`, Tokens Studio as an authoring surface.

What none of them standardize is a way to define computed token formulas *inside the tokens themselves*. They resolve aliases and sometimes evaluate basic math, but they "don't preserve formula provenance, don't share function definitions across tools, and don't have a vocabulary for higher-order operations like contrast-aware color, modular scales, or alpha compositing."

Teams that derive tokens from rules therefore end up in one of three bad places, stated in the project's own words:

1. **Hidden in proprietary tooling.** The rule only exists inside a Figma plugin or a design-ops script. Not portable.
2. **Encoded in ad hoc scripts.** A Node script builds one `tokens.json` from a source of truth elsewhere; the formula is lost at the boundary.
3. **Collapsed into resolved values.** The rule ran once, the number was written down, "and now nobody remembers where `10px` came from."

## 2. Core thesis

A design token should be able to contain a resolved DTCG `$value`, an optional formula-provenance extension, a reference to a reusable function definition, and enough metadata to regenerate, validate and document the computed value.

The project separates **interoperable token output** from **authoring-time formula definitions** — keeping "DTCG output boring and portable while still preserving how the value was derived."

## 3. Compatibility invariants

- **Resolved `$value` is canonical.** Every output token carries a concrete DTCG `$value`; the extension is optional metadata. Any DTCG-aware tool can read the file without knowing formulas exist.
- **Extensions are vendor-namespaced** under `org.dtcg-formulas` — and "the `org.` prefix is backed by the `dtcg-formulas.org` domain."
- **Output must remain DTCG-compliant.** A token typed `dimension` emits a valid DTCG dimension. "The formula layer may be more expressive internally, but what lands in `$value` plays by DTCG's rules."

## 4. Non-goals (stated before goals)

Not a replacement for DTCG · not a redefinition of how `$value` works · not a standardization of token compilation for the whole ecosystem · not a full programming language · not executable Sass · not a general-purpose expression engine for arbitrary application logic · not a solution to every one-to-many generation workflow in v0.

> "This is a narrow infrastructure layer, not a new religion."
> "If it starts trying to become a full language runtime, it has already failed."

## 5. The three layers

```
author .module.scssdef ──▶ reference in DTCG $extensions ──▶ lint ──▶ compile
   (definition layer)            (token layer)            (preflight)  (writes $value)
```

**Definition layer** — reusable functions in `.module.scssdef`: YAML front matter for module metadata, SassDoc-style `///` comments for function metadata, a Sass-like function declaration, and a symbolic `@return`. Parsed into a typed AST. Not executable Sass.

**Token layer** — DTCG tokens keep `$value` resolved; a vendor-namespaced `$extensions` entry stores the formula call string, the referenced definition, the syntax version, and optional structured argument or dependency metadata.

**Resolution layer** — a pluggable resolver consuming the definition, the call, token references and registered custom functions; validates and computes `$value`. Intentionally decoupled from the authoring surface.

### Worked example

```json
{
  "shape": { "radius": { "button": {
    "$type": "dimension",
    "$value": "10px",
    "$extensions": {
      "org.dtcg-formulas": {
        "formula": "radius({typography.scale.12}, {shape.ratio.button})",
        "definition": "tokens/functions/radius.module.scssdef#radius"
      }
    }
  }}}
}
```

`$value` is authoritative; `formula` is a call string using DTCG's own `{dotted.path}` reference syntax; `definition` is a file-plus-anchor pointer.

```scss
---
module: radius
title: Shape Radius
summary: Proportional radius derived from size and ratio.
---

/// @name radius
/// @summary Compute proportional radius from size and ratio.
/// @param $size <dimension|ref> Base size reference.
/// @param $ratio <number|ref> Unitless ratio in (0, 1].
/// @returns <dimension>
@function radius($size, $ratio) {
  @return $size * $ratio;
}
```

Doc tags supported: `@name`, `@summary`, `@description`, `@param`, `@returns`, `@example`, `@constraints`, `@since`.

## 6. Package architecture

| Package | Version | Role |
|---|---|---|
| `@dtcg-formulas/spec` | 0.1.0 | Specs for `.module.scssdef`, the extension convention, and the registry contract |
| `@dtcg-formulas/parser` | 0.1.0 | `.module.scssdef` → typed AST (frontmatter, functions, types modules) |
| `@dtcg-formulas/registry` | 0.1.0 | Function declarations; lookup by `path#name` |
| `@dtcg-formulas/resolver` | 0.2.0 | Pure core — walks DTCG, resolves refs, invokes implementations, writes `$value` |
| `@dtcg-formulas/builtins` | 0.2.0 | Executable JS for math built-ins |
| `@dtcg-formulas/cli` | 0.2.0 | Thin CLI: `compile` · `lint` · `check` |
| `@dtcg-formulas/adapter-*` | 0.3.0 | Opt-in adapters: leonardo, color-names, composite, optimal-foreground, material-shadow |
| `@dtcg-formulas/style-dictionary-plugin` | 0.3.0 | Style Dictionary 4.x integration (transitive preprocessor) |
| `@dtcg-formulas/docs` | 0.3.0 | Docs generator derived from `.module.scssdef` metadata |
| `@dtcg-formulas/terrazzo-plugin` | 0.4.0+ | Terrazzo integration |

**Design principles as stated:** tool-agnostic core · streamlined DX (install one package, point at `tokens.json`, get computed tokens; clear errors with codes and spans; `lint` and `compile` as separate verbs) · education built in ("the repo teaches: how DTCG works, why formulas, how to author one, how to integrate") · extendable via a documented adapter contract, where Style Dictionary and Terrazzo integrations are "thin wrappers over the core, not the core itself."

## 7. Contracts

**Resolver** — a pure function: same input, same diagnostics, same output; no I/O beyond config; no SD or Terrazzo dependency in the core.

```ts
const { tokens, diagnostics } = await compile(input, {
  definitions: ['tokens/functions/**/*.module.scssdef'],
  adapters: ['@dtcg-formulas/adapter-leonardo'],
});
```

**Adapter** — every adapter package exports exactly two things: a parsed `definition`, and `implement(args, ctx)` where `args` are positional arguments already resolved to literals and `ctx` is `{ tokenPath, registry, diagnostics }`. Adapters are opt-in dependencies: "nobody pays for Leonardo unless they actually use `leo()`."

**CLI verbs** — `compile` (full resolution, writes computed `$value`s) · `lint` (preflight only, never executes a formula, adapter-free) · `check` (dry-run compile with the full diagnostic report, for CI).

**Preflight contract** — eight guarantees without executing anything: input JSON parses; the token tree is valid DTCG; every extension entry is well-formed (`formula`, `definition`, optional `syntax`); every `definition` ref resolves to a registered function; the call string parses; arity and argument shapes match the declaration; every `{path.to.token}` reference resolves within the tree; no cycles exist in the reference graph. Anything requiring execution — e.g. verifying `min <= max` inside a `clamp` — is deferred to `compile` or `check`.

**Diagnostics** — a stable public contract, specified before the resolver exists:

```ts
interface Diagnostic {
  code: string;        // 'DTCG-FORMULAS-L107'
  severity: 'error' | 'warning';
  message: string;
  span?: { file: string; line: number; column: number; length: number };
  hint?: string;
  docsUrl?: string;    // points at /guide/troubleshooting#code
}
```

## 8. Function catalogue

**Built-ins** (library-maintained, ship pre-registered): `round`, `snap`, `radius`, `clamp`, `min`, `max`, `mix`, `modular-scale`, `shade`, `tint`, `fluid-size`, `composite`.

**Adapters** (wrap an external library or algorithm, often version-pinned): `leo()` (Adobe Leonardo contrast-aware color, defaulted to APCA in #20), `color-name()` (meodai/color-names), `material-shadow()`, `optimal-foreground()`, `outline-radius()`.

The built-in/adapter distinction is explicitly "more about maintenance than capability: built-ins evolve with the library itself; adapters often pin to an external version and live in their own packages."

Two functions worth reading as evidence of how the author scopes work:

**`optimal-foreground($background, $light, $dark)`** — returns whichever candidate has greater APCA Lc against the background, documented as accounting for the Helmholtz-Kohlrausch effect on saturated chromatic backgrounds. Composable with `composite()` and `mix()` as the background argument. Its documentation states the portability requirement directly: "All inputs are explicit token references or literal values — no implicit pipeline configuration required. A consumer can recompute `$value` from the formula alone."

**`outline-radius($inner, $offset, $width)`** — the outer-edge radius of an offset outline's visual silhouette, matching how browsers render `outline` with `outline-offset` on a rounded element. Purpose stated exactly: to drive the corner radius of a compensating rectangle in tools (e.g. Figma) that cannot natively render `outline-offset` — and then, unusually, who should ignore it: "**FE consumers should ignore this — the browser computes it automatically.**" It carries `@constraints` for all three parameters and three worked `@example` lines. It originates from ticket `DSYS-431` in the Underline design system, and its scalar body (`$inner + $offset + $width`) is deliberately trivial — the value is in the documented semantics, not the arithmetic.

Example projects shipped: `radius`, `spacing`, `builtins` (clamp/mix/modular-scale), `leonardo-color`, `compositing` (Porter-Duff alpha), `contrast` (APCA optimal foreground), `color-names`, `shade-tint`, `fluid-size`, `material-shadow`, `outline-radius`.

## 9. Engineering practice

TypeScript monorepo with npm workspaces; dual ESM + CJS builds via `tsup` with typed exports; Vitest test suites for parser and registry; Biome for lint/format; Changesets for versioning with per-package `CHANGELOG.md`; three GitHub Actions workflows (`ci.yml` — Node 20/22 matrix running build → typecheck → check → test; `release.yml`; `docs.yml`); VitePress documentation site deployed to a custom domain via CNAME; `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.

Documentation site structure: guide (index, getting-started, concepts, authoring-a-formula, integrations, troubleshooting, roadmap, FAQ), spec (scssdef, formula-extension, registry-contract), api (parser, registry), architecture (public-readiness), examples (one page per function), and a project vision brief.

## 10. Prior art credited as architecture

- **Dart Sass** — lexer → parser → AST → visitor-based evaluator, exposed as CLI and JS API. "Validates the 'pure core + thin wrappers' split we're recommending. The visitor pattern is also the right shape for our resolver."
- **Style Dictionary** — transitive transforms that run after reference resolution, identified as the correct hook point: "the resolver runs as a transitive preprocessor, after SD has resolved DTCG aliases but before platform-specific format generation."
- **Terrazzo** — `@terrazzo/parser` core + `@terrazzo/cli` thin wrapper; "closest analogue for the CLI shape we want, and proves a tool-agnostic DTCG compiler has market demand."
- **Leonardo** — the contrast-aware color computation engine wrapped rather than reimplemented.

## 11. Roadmap and self-assessment

The `public-readiness.md` document is a north-star analysis that names the objective, compares against prior art, enumerates gaps by the version they block, and proposes a phased rollout. Resolved 0.1.0 blockers are struck through rather than deleted — "kept here as a record" — including no npm publication, no CJS build, no `publishConfig`, a workspace dependency using `*` instead of `workspace:*` ("will publish a broken graph"), and no CI beyond a Pages deploy.

Open blockers are stated plainly, including the one that matters most: "**No resolver.** `@dtcg-formulas/resolver` is a stub. The library cannot compute `$value` from a formula. This is the single biggest blocker against the stated objective." Also listed: no CLI, no executable built-ins, no diagnostics-first error model ("parser throws plain strings"), and no JSON Schema for the extension.

A minor inconsistency is logged and resolved in public: the spec used `"call"` for the formula string while docs used `"formula"`; PR #30 renames the key to `formula` to match user-facing documentation.

**Open questions published unresolved:** whether the extension key should stay `org.dtcg-formulas` or use a project-specific domain; whether the extension should support structured argument metadata by default; whether the resolver should support inline expressions beyond function calls in v0; how scalar functions should reference external engines portably; when generator recipes should be introduced and in what artifact shape.

**Risks with mitigations:** over-design (keep syntax narrow, keep `$value` resolved, scalar functions only in v0) · ecosystem drift (align with DTCG extension rules; document provenance rather than redefine token meaning) · tooling complexity (parser, extension spec, one resolver path first).

**Scalar vs generator** is explicitly deferred: a scalar function resolves to a single token value; a generator produces multiple values or groups from one definition, and "generators should not be forced into the same primitive shape as scalar functions in v0."


---

<!-- FILE: 06-artifact-capability-map.md -->

# Artifact dossier — Design System Capability Map

**File:** `artifacts/analysis-design-system-capabilities.html`
**Subtitle:** "Capability model · adoption evidence · September 2026"
**Headline:** "What design systems can actually do"

44 capabilities, ordered by how much has to exist underneath them, plotted against how many systems have actually adopted each one. "The unit here is the capability, not the company — companies appear as evidence that something is real in production."

| Metric | Value |
|---|---|
| Capabilities mapped | 44 |
| Prerequisite depth range | 0 – 6 |
| Field adoption source | practitioner survey, n = 147 |
| Frontier evidence base | 22 public systems |

---

## 1. Method

**Vertical axis — depth.** "How much scaffolding a capability sits on top of. Depth is not judged — it is computed from a prerequisite graph, where an edge means you cannot have this without first having that." Semantic tokens require primitives; contrast-solved colour requires a perceptual model and a build step. Depth is the longest path back to bedrock:

\[ \text{depth}(c) = 0 \text{ if } \text{requires}(c) = \emptyset, \text{ else } 1 + \max(\text{depth}(p) \text{ for } p \in \text{requires}(c)) \]

Depth bands: 0 bedrock · 1 direct · 2 assembled · 3 compound · 4 derived · 5 orchestrated · 6 frontier.

**Horizontal axis — adoption, measured twice and never averaged.** *Field* is how many design systems in general have a capability, from the 147-respondent survey. *Frontier* is how many of 22 publicly documented systems show verifiable evidence of it. "The distance between the two dots is the diffusion lag." Log scale, banded: <3% experimental · 3–15% frontier · 15–40% emerging · 40–75% common · >75% standard.

**Interaction affordances:** filter by family (token model, context & theming, computation, distribution, quality, design tool, governance, agent-readable), filter to measured-only evidence, reorder rows by depth / adoption / diffusion lag, toggle log vs linear scale, and a self-scoring tool where capabilities unlock only as their prerequisites are ticked — "A capability whose prerequisites you have not ticked is greyed out — that is the model telling you something, not a bug."

## 2. The capability set, by depth

**Depth 0 · bedrock** — design tokens exist 86% (22/22) · dedicated design system team 83% (22/22) · accessibility guidelines documented 59% (21/22) · experimenting with AI in the workflow 46% (12/22)

**Depth 1 · direct** — primitive value layer 90% (22/22) · tokens as design-tool variables 90% (21/22) · tokens present in code 82% (22/22) · code component library 78% (22/22) · tokens documented 66% (20/22) · open contribution model 65% (16/22) · generated spacing and type scales 55% (20/22) · adoption measured not assumed 41% (9/22) · AI built into system processes 10% (4/22)

**Depth 2 · assembled** — semantic layer 85% (22/22) · published semver package 65% (20/22) · tokens complete across design/code/docs 54% (18/22) · framework-agnostic delivery 36% (6/22) · automated design-to-code token pipeline 29% (12/22) · automated accessibility testing 21% (14/22) · perceptual colour ramps 20% (8/22) · federated operating model 13% (5/22) · documentation delivered to agents 12% (3/22) · return on investment measured 5% (1/22)

**Depth 3 · compound** — light/dark/contrast modes 76% (21/22) · release notes per version 56% (19/22) · component-scoped tokens 52% (15/22) · tokens vary by breakpoint 38% (8/22) · component usage instrumented in code 38% (7/22) · accessibility conformance measured 36% (9/22) · tokens vary by platform 24% (13/22) · aliased parent/child tokens 21% (9/22) · components mapped design-to-code 12% (7/22) · automated code-to-design pipeline 6% (3/22) · DTCG-conformant token file 5% (6/22) · values solved to a contrast target 4% (5/22)

**Depth 4 · derived** — tokens vary by brand 63% (11/22) · forced-colors as a first-class context 8% (6/22) · bi-directional token sync 5% (2/22) · breaking changes ship with codemods 5% (4/22) · design-to-code drift detected 3% (2/22) · perceptual contrast targets (APCA) 2% (0/22) · machine-readable component schemas 2% (1/22)

**Depth 5 · orchestrated** — declarative context resolver 3% (4/22)

**Depth 6 · frontier** — formulas declared in the token graph 0.3% (0/22)

## 3. Findings

**The gradient.** "Adoption falls by roughly half for every step of depth." Median field adoption: 71% at depth 0, 66% at depth 1, 25% at depth 2, 30% at depth 3, 5% at depth 4. "The decline is steep and monotonic in the middle of the range, which is what a prerequisite chain predicts: every rung you add multiplies the number of things that have to already be true."

**Correlation, honestly bounded.** Across all 44 capabilities, depth against log adoption gives **r = −0.73**. "Depth explains roughly 53% of the variance in how widely a capability has spread — real, and far from the whole story."

## 4. The depth-6 analysis

Depth 6 "has shipped tooling and no published production user." The only shipped implementation of formulas declared inside the token graph is the **Tokens Studio Graph Engine**, the modelling layer inside Studio Platform: colour nodes for contrast, mixing and colour-blindness simulation; maths nodes for clamp, lerp and trigonometry; logic nodes for conditions; design-token nodes that create tokens, follow references and manipulate whole sets, emitting tool-agnostic JSON or CSS variables through a CLI. It describes itself as "a graph engine for resolvers and generators" — "the same shape the Resolver draft describes." Real, shipped, open-source under MPL-2.0.

Weekly npm downloads (first week of September 2026, public registry API, log scale):

| Package | Weekly downloads |
|---|---|
| `style-dictionary` — the baseline | 1,682,990 |
| `@tokens-studio/sd-transforms` | 163,156 |
| `@terrazzo/cli` — DTCG-native build tool | 55,239 |
| `apca-w3` — APCA contrast | 44,599 |
| `@adobe/leonardo-contrast-colors` | 14,268 |
| `@tokens-studio/graph-engine` | 160 |
| `@tokens-studio/graph-engine-nodes-design-tokens` | 5 |

The interpretation is deliberately conservative: "The Graph Engine's main consumption path is the hosted platform and the Figma plugin, not `npm install`, so 160 downloads a week means 'almost nobody runs it in their own CI' — not 'almost nobody uses it'. Enterprise use behind a SaaS login is invisible here, and that is the market Studio Platform sells into." What the surrounding rows *do* establish is that the gap is specific: Tokens Studio's own token plumbing sits at 163,000 downloads a week — "It is the graph pipeline in particular that has not crossed over."

Then the load-bearing evidence and the causal hypothesis:

> "**The stronger evidence is the silence.** No team has published a production design system whose token values are computed by a graph pipeline — no engineering blog, no conference talk, no open repository. The likeliest reason is not quality but **custody**: computing tokens in a visual editor moves the source of truth out of git and into a proprietary canvas, and design system teams have spent a decade learning to keep that source reviewable as text. `dtcg-formulas` makes the opposite bet — declare the computation inside the token file so it stays diffable."

## 5. Self-audit and stated limitations

**The prior version was deleted, in public.** An earlier version plotted systems against designer headcount. The audit that killed it: "R² 0.53 on 22 hand-picked points, a slope whose 95% confidence interval spanned a factor of 2.4, a third of the fit carried by a dimension that was near-definitionally a restatement of company size, and a 10.5-point scoring advantage for open-source systems that was large enough to explain its headline finding on its own." A second reason is given: "Headcount is also the wrong construct now: agentic tooling is decoupling contributor count from output." Commitment: "Nothing on this page depends on knowing how many designers work anywhere."

**Remaining soft edges, each disclosed:**

- *Depth is structural, but the graph is still authored.* Somebody decided the edges; each is stated on the capability "so you can disagree with a specific edge and see exactly what it moves." Depth measures scaffolding, "not difficulty or value: a depth-1 capability can be harder to ship than a depth-4 one."
- *The survey has real limits.* zeroheight's fifth annual Design Systems Report, n = 147 practitioners, 45% North America, 40% Western Europe — "a self-selected sample of people engaged enough to answer a design systems survey, so it almost certainly overstates the field." Subgroup items are labelled "of systems with tokens" rather than silently rescaled.
- *Estimates are marked and removable.* Where no survey item exists, adoption is estimated from tool-download ratios, specification status, or the audit itself; those rows are hollow with dashed connectors and can be filtered out. "The estimates cluster at depth 4–6, which is exactly where they are least checkable, so treat the deep end as an ordering rather than a set of values."
- *Frontier adoption is an evidence review, not a census.* Credit requires public documentation, a public repository, or published engineering writing. "Closed systems are therefore undercounted — Airbnb, Linear, Spotify and Lyft almost certainly hold capabilities not visible here, and their absence from an exemplar list is a statement about evidence, not about them." The selection bias is signed: it "biases toward capability rather than against it: this is a sample of the top tail, and it is labelled as such."
- *Adoption is not endorsement.* "A capability at 5% is not therefore good, and one at 86% is not therefore necessary. The map answers 'what exists and how far has it spread', which is a prior question to 'should we build it'."

## 6. Sources cited by the artifact

Design Systems Report 2026 — zeroheight (n = 147; the field-adoption source for 31 of 44 capabilities) · Design Tokens Format Module 2025.10 and the stable-release announcement · Design Tokens Resolver Module preview draft · `dtcg-formulas` · Tokens Studio Graph Engine, Studio Platform, repository · npm registry download API (weekly counts, retrieved 8 September 2026) · APCA in a Nutshell (Myndex) · `adobe/spectrum-design-data`, Spectrum for AI tools, Leonardo · Material 3 colour system and `material-color-utilities` · Atlassian tokens and token migration tooling · "Layers of abstraction" (Spotify Engineering) · USWDS colour tokens and grades · Nord token changelog · Ant Design 5 token algorithms · `primer/primitives` · Design System Maturity (NN/g), zeroheight maturity model, Sparkbox maturity model · "The problem with design system maturity models" (Supernova).

## 7. Why this artifact matters in an evaluation

It is the piece of the corpus that is not about the author's own systems. It demonstrates the ability to model a discipline rather than describe a project: to construct a prerequisite graph, quantify diffusion, hold two incompatible measurements apart, mark the boundary of one's own evidence, sign the direction of one's own bias, delete a prior finding that failed audit, and refuse to convert descriptive adoption data into prescriptive advice. It also positions the author's own frontier work honestly — at 0.3% field adoption and 0 of 22 audited systems, with a stated hypothesis for why, rather than as a claim of inevitability.


---

<!-- FILE: 08-interview-answers.md -->

# Grounded answers to likely evaluation questions

Written for retrieval. Each answer is self-contained and traceable to the artifacts.

---

**Q: How do you structure a design token system?**

Eight layers resolved in a fixed order, with the vocabulary fixed first. Global (mode-free math primitives — sizing, spacing, typescale, shape, borders, breakpoints; no color, no brand) → three sets (palette, typography, iconography — each a swappable instance, and therefore the deliberate rebrand seam) → theme modifier → role layer → screen modifier → component tokens. One entry point (`styles.css`) imports them in resolution order and is documented as the resolver analogue. Components consume aliases, never raw ramp steps; only the palette tier holds hex values.

**Q: How do you handle dark mode?**

As a separate scheme set, not a switch on one set. Both schemes define the same token names and resolve them independently, because their interaction semantics genuinely differ: light lightens on hover and darkens on press; dark darkens on hover and flashes light on press. The invariant is relational — each scheme moves *toward* its page surface on hover and *away* on press — and the asymmetry is preserved deliberately: "Keep this inversion; don't flip one scheme to match the other."

When only part of the dark source existed (~40% of a 201-token role vocabulary, in an older naming), I derived dark by ramp mirroring (50↔950 … 400↔600), anchored to every value the source did define, then verified pair-by-pair with APCA and documented every deviation from the naive mirror with its Lc reasoning.

**Q: How do you generate a color ramp?**

Recipes, not picks. Each family is a ColorBox recipe with eased lightness/chroma/hue curves, sampled at 11 steps, pinned through a per-family lock hex. To change a ramp you edit the recipe and regenerate — never hand-tweak a step. The lock hex is kept conceptually separate from any interactive value: in Beacon `teal-700` is the generation anchor and `teal-600` is `roles.primary.bg.rest`. Foreground `on.*` tokens are computed per step by APCA and regenerated by script.

**Q: What is a semantic role in your model?**

Not a named color — a sub-system with fixed anatomy: `bg` (rest/hover/pressed solid trio), a tint stack (`tonal` alpha wash, `subtle`, `highlight`, `bright`), a text ladder (default/strong/subtle/disabled), `on` (the APCA-legible foreground per background state), `border` (rest/focus/active), and `accent` (brand/key). Uniform anatomy makes the system predictable and mechanically checkable. Legitimate exceptions are typed rather than improvised: accent-only roles carry `brand`/`key` plus tints and no interaction trio.

**Q: How do you decide what colors mean?**

With a grammar above the tokens, keyed to the user's question rather than the designer's intent — shell ("where am I and how do I move?"), primary ("which of these are right for me?"), secondary ("what else should I know?"), decorative ("the feels associated to the brand"), value ("what's this worth and is it valuable to me?"). Then three enforceable rules: a scarcity clause (lime is reserved for value to the user; never FAB, decoration, status, category labels or filter chips), a category clause (shell stays neutral even when it is the page's most prominent button — "black is a different category, not a lesser one"), and a closure clause (no sixth tier). Collisions are pre-resolved: when a cart pill and a FAB are both visible, the FAB drops to teal because two lime elements compete.

**Q: What is the difference between primary the color and primary the action?**

Exactly the distinction the grammar had to make explicit: "Teal does not mean 'the decision' — it marks the options being weighed against each other… A submit button concludes; an option button chooses among peers — only the latter is primary." Achromatic CTAs are shell even when pressing them is the page's decisive act. Bindings are one-directional: a tier always resolves to its role, but roles serve jobs outside the tier model.

**Q: How do you know your abstractions are right?**

One test I trust: a new layer that requires no new primitives. Beacon's five-tier expression grammar binds every tier to an existing role family — "no new tokens were needed, and dark comes free through the role bindings." If a new abstraction forces new primitives, the primitives were probably wrong.

**Q: What do you do about accessibility?**

Compute it. `on.*` foregrounds are selected by APCA contrast per step and regenerated by script rather than reviewed by eye; dark-scheme parity is verified pair-by-pair with Lc values annotated inline in the token file and on the specimen cards, and a regeneration trigger is documented ("regenerate them when a ramp changes"). In `dtcg-formulas`, `optimal-foreground()` selects the greater-|Lc| candidate and accounts for the Helmholtz-Kohlrausch effect on saturated chromatic backgrounds; `composite()` exists so contrast can be computed against what the user actually sees. Field-wide these capabilities sit at 4% and 2% adoption respectively, the latter with zero evidence across 22 audited public systems.

**Q: How do you document a design system?**

So that reading order is resolution order. Beacon's readme builds the system the way the resolver does, the 31 specimen cards are grouped 0–8 in the same order, and the archive is one self-contained offline file with governance verbatim, every card rendered live, the full dual-scheme token reference, and the verbatim source of all 46 files — "Nothing summarised away."

And with a standing flags register. Interpolated derivations, mid-rename roles, inferred content, rejected naming options with reasons, decisions that belong upstream, and open proposals deliberately not applied to shipped tokens are all recorded next to the system rather than in a private doc. Reader-facing specimens stay clean; provenance lives in the governance layer.

**Q: How do you scope an open-source project?**

Non-goals first, with a stated failure condition. `dtcg-formulas` declares that it is not a replacement for DTCG, not executable Sass, not a general-purpose expression engine, not a programming language — "a narrow infrastructure layer, not a new religion" — and closes with "If it starts trying to become a full language runtime, it has already failed." Risks are paired with mitigations, open questions are published unresolved, and the deferred design (generators vs scalar functions) is named rather than half-built.

**Q: How do you sequence a release?**

By durability. Version 0.1.0 shipped the metadata surface — spec, parser, registry, docs, release plumbing, CI — and deliberately deferred compute to 0.2.0, because specs and documentation are what consumers depend on irreversibly. The readiness analysis says plainly what is still missing: "No resolver… The library cannot compute `$value` from a formula. This is the single biggest blocker against the stated objective."

**Q: How do you design a developer experience?**

Three verbs with different costs. `lint` is preflight: it parses every formula, validates against the registry, checks references, arity and cycles, and never executes anything, so adapter packages need not be installed and CI can fail fast without pulling in heavy color engines. `check` is a dry-run compile with the full diagnostic report. `compile` writes computed values. The preflight guarantees are enumerated as eight numbered items with an explicit boundary for what belongs to execution instead.

Errors are treated as a public API: every diagnostic carries a stable code, severity, message, span (file/line/column/length), hint, and a docs URL — specified before the resolver existed.

**Q: How do you keep an ecosystem integration from eating your architecture?**

Pure core, thin wrappers, opt-in cost. The resolver is a pure function with no I/O beyond its config and no dependency on Style Dictionary or Terrazzo; those integrations are thin wrappers over the core, "not the core itself." Adapters export a `definition` and an `implement(args, ctx)` function and are opt-in — "nobody pays for Leonardo unless they actually use `leo()`." The hook point into Style Dictionary was chosen structurally: a transitive preprocessor that runs after SD resolves DTCG aliases but before platform format generation.

**Q: Why not just use Tokens Studio's Graph Engine?**

Because of custody, not capability. The Graph Engine is real, shipped, open-source, and has the right node catalogue. But no team has published a production design system whose token values are computed by a graph pipeline — no engineering blog, no talk, no open repository — while Tokens Studio's own token plumbing sits at 163,000 weekly downloads against the graph engine's 160. The likeliest explanation is that computing tokens in a visual editor moves the source of truth out of git into a proprietary canvas, and design system teams have spent a decade learning to keep that source reviewable as text. `dtcg-formulas` takes the opposite bet: declare the computation inside the token file so it stays diffable.

**Q: How do you evaluate whether a design system is mature?**

I don't use maturity stages. I use a prerequisite graph: 44 capabilities with computed depth (`depth(c) = 0 if requires(c) = ∅, else 1 + max(depth(p))`), each plotted against two separately-measured adoption values that are never averaged — field (n = 147 practitioner survey) and frontier (evidence review across 22 public systems) — with the distance between them reported as diffusion lag. A stage label tells a team it is "level 2"; a prerequisite graph tells it which specific capability to build next and what that capability requires. The self-scoring tool greys out anything whose prerequisites are unticked and orders suggestions by commonness, so the cheapest moves come first.

**Q: How do you handle being wrong?**

Delete the finding and say why. An earlier version of the capability map plotted systems against designer headcount; the audit found R² 0.53 on 22 hand-picked points, a slope whose 95% CI spanned a factor of 2.4, a third of the fit carried by a near-restatement of company size, and a 10.5-point open-source scoring advantage large enough to explain the headline finding by itself. The axis was removed, a second structural reason was given (agentic tooling decouples contributor count from output), and the published commitment is that "nothing on this page depends on knowing how many designers work anywhere."

**Q: What are the limits of your own analysis?**

Stated in the artifact: the prerequisite graph's edges are authored even though depth is computed; depth measures scaffolding, not difficulty or value; the survey is self-selected and "almost certainly overstates the field"; estimated rows are hollow, filterable, and cluster at depths 4–6 "which is exactly where they are least checkable, so treat the deep end as an ordering rather than a set of values"; frontier adoption is an evidence review that undercounts closed systems, and its selection bias is signed as biasing toward capability; and adoption is not endorsement.

**Q: How do you make a system readable by an AI agent?**

Ship an explicit consumption manifest and make the semantics machine-readable. Beacon includes a `SKILL.md` telling an agent what to read, what to produce for throwaway visual work versus production code, and what to ask when invoked without guidance; the whole system is packaged as one self-contained offline file so it can be ingested in a single pass. `dtcg-formulas` parses its definition format into a typed AST with documentation metadata attached per function, and plans a published JSON Schema for the extension plus an LSP built on stable diagnostic codes. The general claim: agent-readability is the visible consequence of having made semantics explicit — the same property that makes a system reviewable by humans.

**Q: What did you build alone versus with a team?**

All three artifacts — the Beacon system and its archive, the capability map, and `dtcg-formulas` — were designed and built solo, with colleague input limited to general feedback. Where a colleague's proposal was translated into a system it is attributed in place: the five-tier expression grammar is credited to "C. Lynn, 2026-06-15" as a Facet 2.0 proposal, and the translation into Beacon's vocabulary, the binding decisions, the rules and edge cases, and the naming resolution are mine. Ticket-traceable work (`DSYS-431` → `outline-radius()`) shows the same authorship feeding a production design system.
