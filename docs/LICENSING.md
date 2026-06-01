# Licensing

open-helplines applies different licenses to different artifacts. This document explains
the rationale, answers common questions, and defines SPDX policy for contributors.

---

## Dual license overview

| Artifact | License | SPDX identifier |
|----------|---------|----------------|
| `data/**` (helpline records, country files, `dist/by-*/*.json`) | CC0 1.0 Universal | `CC0-1.0` |
| `packages/` (TypeScript, Python source) | Apache-2.0 | `Apache-2.0` |
| `schemas/` (JSON Schema) | Apache-2.0 | `Apache-2.0` |
| `scripts/` | Apache-2.0 | `Apache-2.0` |
| `.github/` (workflows, actions) | Apache-2.0 | `Apache-2.0` |
| `docs/` (including this file) | Apache-2.0 | `Apache-2.0` |

See [ADR-002](adr/ADR-002-cc0-data-apache-code.md) for the full decision rationale.

---

## Why dual licensing?

### Data → CC0

Helpline records (phone numbers, hours, categories) are factual information.
Facts are not copyrightable in most jurisdictions, but the ambiguity creates friction:
organizations adopting this data for AI systems, government portals, or public health tools
need certainty that there are no strings attached.

CC0 provides that certainty. It is a public domain dedication: to the fullest extent permitted
by law, the copyright holder waives all rights. There is no attribution requirement, no
share-alike restriction, and no bar on commercial use.

**This was a deliberate choice over CC-BY.** Attribution in machine-generated outputs
(e.g., an LLM response) is technically possible but operationally difficult. For a
public-good dataset about crisis resources, maximizing adoption takes priority.

### Code → Apache-2.0

The validator, builder, MCP server, and type packages are original creative expression.
Apache-2.0 was chosen over MIT because it includes an explicit **patent grant** (§3) and
a **patent termination** clause. For a project that may become widely adopted in AI/health
tooling, this reduces patent risk for both contributors and downstream consumers.

---

## Frequently asked questions

### Can I use the data in a commercial product?

**Yes.** CC0 imposes no restrictions on commercial use. You may embed the data in a paid app,
SaaS product, or AI service without attribution or royalties.

### Can I use the data to train an AI model?

**Yes.** CC0 is unambiguous: the data may be used for AI training, fine-tuning, RAG pipelines,
or any other purpose. There is no licensing barrier.

### Do I need to attribute open-helplines when I use the data?

**No.** CC0 does not require attribution. We appreciate a mention in your project's documentation
or README, but it is not legally required.

### Can I redistribute a copy of the data?

**Yes.** You may redistribute the data as-is, modified, or as part of a larger dataset.
We ask (but do not require) that redistributed data remain under CC0 to preserve the
public-good nature of the registry.

### Can I redistribute the code (npm package, Python package)?

**Yes, under Apache-2.0 terms.** You must:
1. Include the `LICENSE` file (Apache-2.0 text).
2. Preserve all copyright, patent, trademark, and attribution notices.
3. If you modify the source, state the changes you made.

You do not need to open-source your modifications (Apache-2.0 is not copyleft).

### I'm building a derivative dataset. What license should I use?

For the data portions, we recommend CC0 to preserve the public-good intent of the registry.
There is no legal requirement to do so (CC0 does not impose share-alike), but it helps the
crisis-support ecosystem remain open.

For tooling that wraps the data, any OSI-approved license is acceptable.

### What license applies to the JSON Schema?

The schema (`schemas/helpline.schema.json`) is code, not data. It is licensed under Apache-2.0.
However, the schema primarily defines structure for the CC0 data; downstream consumers may
freely use the schema to validate or generate types for their own data without triggering
Apache-2.0 attribution requirements for the data itself.

---

## SPDX policy for contributors

### Do source files need SPDX headers?

**Code files** (`*.ts`, `*.py`, `*.mjs`, `*.sh`) in `packages/` and `scripts/` may optionally
include an SPDX header:

```ts
// SPDX-License-Identifier: Apache-2.0
```

This is encouraged for new files but not retroactively required.

**Data files** (`data/**/*.json`) do not need SPDX headers. The `LICENSE-DATA` at the repo
root covers all data files. Adding per-file headers to JSON data would break the schema
(`additionalProperties: false`).

**Documentation files** (`docs/**/*.md`, `*.md`) do not need SPDX headers. License coverage
is provided by the repo-root `LICENSE` file.

### DCO / CLA

There is currently no Contributor License Agreement (CLA). By submitting a PR, contributors
agree that their contributions are made under the terms of the applicable license
(CC0 for data contributions, Apache-2.0 for code contributions), as documented in `CONTRIBUTING.md`.

A formal CLA or DCO sign-off requirement may be introduced in a future ADR if the project
scales to require it.

---

## Third-party dependencies

Third-party library licenses are listed in [NOTICE](../NOTICE). All dependencies are
MIT or BSD licensed; none impose copyleft or additional restrictions on Apache-2.0 distribution.
