---
name: Dependency install portability
description: Tooling constraints and public lockfile URLs for independent npm applications.
---

The package-install callback only targets the repository root and rejects
`--prefix` as an invalid package token. Use directory-scoped npm commands in
the shell when installing or updating dependencies of an existing nested app.

**Why:** Passing prefix flags to the callback was rejected before npm ran;
using the root helper for nested dependencies would modify the wrong manifest.

**How to apply:** Use the package helper for root packages, and use explicit
app-directory scope for nested installs. Do not convert the repository to
workspaces solely to work around this tooling limitation.

Retain public npm tarball URLs in committed lockfiles even when dependencies
were installed through Replit's internal registry.

**Why:** Internal registry hostnames are not accessible to contributors or
build systems outside Replit, so retaining them breaks portable clean installs.

**How to apply:** After package updates, normalize internal tarball URL prefixes
to `https://registry.npmjs.org/`, preserving every version and integrity hash.
Verify clean installs against an empty cache using the public URLs.
