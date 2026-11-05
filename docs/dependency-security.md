# Dependency security maintenance

Use Node.js 22.19 or newer for the root tooling, portfolio, and chatbot.
The `.node-version` file pins the tested version. Lighthouse 13 requires this
runtime; older Lighthouse releases bring in vulnerable browser-download and
telemetry packages. The legacy Harp blog is unchanged.

Each application has its own npm manifest and lockfile. Install dependencies
in each directory independently, and commit the matching lockfile with any
manifest change.

Keep lockfile tarball URLs on `https://registry.npmjs.org/` so clean installs
also work outside Replit. Replit's package tooling can write internal registry
URLs into generated lockfiles; normalize only those URLs after installation,
without changing package versions or integrity hashes.

## Chatbot overrides

- `@esbuild-kit/core-utils` still requires an obsolete esbuild release through
  the latest stable Drizzle Kit. Override only this dependency's esbuild to
  the patched 0.25 line. Do not change the database schema or run migrations
  for this dependency update.
- The latest Tailwind Typography pins `postcss-selector-parser` to an affected
  6.x release. Override 6.x consumers to the patched 6.1.5 release, preserving
  the existing major-version API.

Recheck these overrides when updating the parent packages; remove them when
the parents resolve safe versions themselves.

## Verification

The dependency audit on 2026-11-05 found none of the 90 originally reported
advisory/package-version pairs after the updates. Also verified:

- Portfolio production build, doctrine SEO tests, corpus validation, and
  agent endpoint validation.
- Chatbot TypeScript check and client/server production build.

Two additional advisories appeared in the current dependency database and
were not part of that original list:

- `GHSA-mrhx-c7xc-m3w5`: Zod 3.25.76 in the chatbot. The scanner recommends
  Zod 4.6.6 or newer. This requires a separate major-version migration of
  the schema and form-validation dependencies, not a transitive override.
- `GHSA-gcqx-w48m-w2h4`: Deepmerge 4.3.1 in the root tooling and Svelte
  Vite plugin. The scanner provides no patched release. Do not force a
  dependency downgrade or replacement without checking its merge semantics.

The absence of the original findings is not a claim that the repository
has no remaining vulnerabilities.
