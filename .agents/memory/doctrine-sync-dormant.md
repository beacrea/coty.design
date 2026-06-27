---
name: Doctrine sync dormant by design
description: Why the portfolio's GitHub doctrine auto-sync is intentionally left disabled.
---

The portfolio's doctrine page is served from a manually-maintained `portfolio/public/doctrine.jsonld`. The `/api/sync-doctrine` endpoint (pull-from-GitHub via `GITHUB_TOKEN`) is left in place but **intentionally dormant**.

**Why:** Restoring auto-sync requires the personal site to hold a credential that can read the company private repo `nrfta/product-docs`. The owner decided against coupling their personal portfolio to company-repo access for that benefit. This is a deliberate product/security choice, not a bug.

**How to apply:** Do not "fix" the sync 404 by wiring up a company token unless the owner explicitly asks to re-enable it. To re-enable later: supply a `GITHUB_TOKEN` (fine-grained, resource owner = nrfta org, Contents: Read-only on product-docs, org-approved). The existing `GITHUB_TOKEN` secret is a fine-grained PAT for user `beacrea` that has NO access to nrfta/product-docs (repo returns 404), so it cannot drive the sync as-is.
