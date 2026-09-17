# Agentic Browsing Audit Diagnosis

Date: 2026-09-17

## Outcome

The PageSpeed report for `https://coty.design/` scores Agentic Browsing at **1/3** on both mobile and desktop. The result is fully explained by three weighted audits:

| Audit | Result | Diagnostic |
| --- | --- | --- |
| Cumulative Layout Shift | Pass | CLS is `0`. |
| Agent accessibility tree | Fail | A definition list contains an invalid child structure. |
| `llms.txt` | Fail | `File does not appear to contain any links.` |

The WebMCP audits are all **Not Applicable** and have zero category weight. WebMCP is not responsible for the 1/3 result.

## Audit environment

The PageSpeed result contains both form factors:

- Desktop: Lighthouse `13.4.1`, Headless Chrome `151.0.7922.71`
- Mobile: Lighthouse `13.4.1`, Headless Chrome `151.0.7922.173`

The local Replit environment currently provides:

- Lighthouse `12.8.2`
- Chromium `138.0.7204.100`

Lighthouse 12.8.2 does not contain the Agentic Browsing category or its `llms.txt` audit. Chromium 138 is also older than the Chrome 150+ requirement for the experimental category. A local run with these versions is not an exact reproduction, so the PageSpeed Lighthouse result is the authoritative production-like audit for this diagnosis.

Source report:

`https://pagespeed.web.dev/analysis/https-coty-design/nzzpy3v22y?form_factor=mobile`

## Failure 1: Agent accessibility tree

Lighthouse reports:

> `<dl>` elements must only directly contain properly-ordered `<dt>` and `<dd>` groups, `<script>`, `<template>` or `<div>` elements

Failing element:

- Selector: `main#main-content > div.content > section.section > dl.rows`
- Component: `src/components/ProofStrip.svelte`
- Content label begins with: `Previously`

The component wraps each definition group in a direct `<div class="row">`, which is allowed, but that wrapper contains a decorative `<span>` and another nested `<div>` before the `<dt>` and `<dd>`. A `<div>` used as a definition-list group must contain properly ordered `<dt>` and `<dd>` elements rather than unrelated or additional wrapper content.

This is an actionable semantic HTML defect. The smallest correction should preserve the current appearance while making each definition-list group valid.

### Remediation validation

The Track Record markup was corrected on 2026-09-17 by keeping each `<dt>` and `<dd>` pair directly inside its permitted definition-group `<div>` and moving the decorative bullet to CSS.

Local Lighthouse 12.8.2 validation now reports:

- Accessibility score: `1.0`
- `definition-list`: pass, zero failing elements
- `dlitem`: pass, zero failing elements

A tall viewport snapshot confirms the existing bullets, labels, values, wrapping, spacing, and responsive presentation remain intact. The production Agentic Browsing audit cannot reflect this change until it is deployed. Its final 3/3 verification also depends on the separate `/llms.txt` correction in Task #26.

## Failure 2: llms.txt

Lighthouse reports:

> File does not appear to contain any links.

The current `/llms.txt` response returns HTTP 200 with `text/plain; charset=utf-8`, but its links are written as bare URLs:

```text
- Website: https://coty.design
- Doctrine: https://coty.design/doctrine
```

The response contains seven bare URLs and zero Markdown links. The Lighthouse 13.4.1 audit expects links in standard Markdown form:

```markdown
- [Website](https://coty.design): Main portfolio
- [Doctrine](https://coty.design/doctrine): Evidence-tracked positions on AI-assisted development
```

This is an actionable formatting defect and is already covered by Task #26, which also brings the file into line with the August 2026 llms.txt v2 proposal.

## WebMCP classification

The following audits are Not Applicable on both mobile and desktop:

- `webmcp-form-coverage`
- `webmcp-registered-tools`
- `webmcp-schema-validity`

They each have weight `0` in this report. Adding WebMCP would not repair either failed weighted audit and should not be pursued solely to change this PageSpeed fraction.

## Implementation boundaries

1. Complete Task #26 for the `llms.txt` formatting and discovery changes.
2. Correct the ProofStrip definition-list semantics in a focused accessibility change.
3. Re-run PageSpeed with Lighthouse 13.4.1 or newer after both changes.
4. Keep WebMCP evaluation separate and require a useful agent action before adding tools.


## llms.txt v2 compliance baseline

The August 2026 llms.txt v2 proposal remains an emerging convention, not a W3C or IETF standard. Its document format starts with an H1 site name, followed by an optional blockquote summary and concise context, then H2 sections containing described Markdown links to canonical resources. YAML frontmatter before the H1 is not part of that format.

V2 adds discovery through `rel="describedby"` in HTML and/or HTTP `Link` headers. `rel="alternate" type="text/markdown"` is reserved for a page's actual Markdown representation, not for a site-level summary or full dossier.

This portfolio treats `/llms-full.txt`, JSON-LD `subjectOf`, and `/.well-known/ai-plugin.json` as useful extensions. They are retained but are not requirements of the llms.txt proposal.

The installed Lighthouse 12.8.2 and Chromium 138 cannot run the Agentic Browsing category. The closest current check is therefore the structural and endpoint validation in `npm run validate-agent`, combined with the production PageSpeed audit documented above. The official JavaScript parser package is not available from this environment's package registry, so the local validator directly enforces the proposal's published grammar. A current Lighthouse 13.4.1+ production re-run remains necessary after deployment.
