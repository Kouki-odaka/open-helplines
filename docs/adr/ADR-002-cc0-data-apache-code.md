# ADR-002: Dual-license — CC0 1.0 for data, Apache-2.0 for code

**Status:** Accepted  
**Date:** 2026-06-02  
**Author:** Kouki-odaka  

---

## Context

The open-helplines project has two distinct artifact classes:

1. **Data** (`data/`) — factual records about helpline organizations (phone numbers, hours,
   categories). Facts are not copyrightable in most jurisdictions, but placing an explicit
   waiver removes any ambiguity.

2. **Code** (`packages/`, `scripts/`, `.github/`) — original creative expression
   (validator logic, MCP server, build tooling). Code is copyrightable and benefits from
   an OSS license that allows commercial use while protecting contributors from liability.

The target audience for the data includes:

- AI assistants embedding the data in responses (requires maximum permissiveness)
- Non-profit crisis organizations re-publishing the data
- For-profit tech companies building mental health apps on top of the data
- Governments and NGOs creating local mirrors

The target audience for the code includes:

- Developers building tools on top of the registry
- Organizations self-hosting the MCP server
- Contributors adding new validators or data sources

## Decision

Apply a **dual-license strategy**:

| Artifact | License | Rationale |
|----------|---------|-----------|
| `data/` | CC0 1.0 Universal | Public domain dedication; no attribution required; maximum compatibility with AI training, redistribution, derivative works |
| `packages/`, `scripts/`, `.github/` | Apache-2.0 | Permissive OSS; explicit patent grant; compatible with CC0; allows commercial use without requiring source disclosure |
| `schemas/` | Apache-2.0 | Schema is code (not data); governs structure, not facts |
| `docs/` | Apache-2.0 (unless noted) | Documentation is part of the code artifact |

### Root LICENSE files

- `LICENSE` — Apache-2.0 (applies to code)
- `LICENSE-DATA` — CC0 1.0 (applies to `data/`)

### Why not MIT instead of Apache-2.0?

Apache-2.0 includes an explicit **patent grant** clause (Section 3) and a **patent
termination** clause (Section 3, condition 3). For a project that may become widely
adopted, this reduces patent risk for both contributors and users. The additional
verbosity of Apache-2.0 over MIT is worth this protection.

### Why not CC-BY for data?

CC-BY requires attribution. Attribution in machine-generated outputs (e.g., an LLM
answer) is technically possible but operationally difficult. For a public-good dataset
about crisis resources, maximizing adoption takes priority over attribution. CC0 is
unambiguous: anyone can do anything with the data, no strings attached.

## Consequences

**Positive:**
- LLMs can embed data in responses without license concerns.
- Non-profits and governments can re-publish without legal overhead.
- Developers know exactly what they can do with each artifact.
- Apache-2.0 patent grant protects contributors.

**Negative:**
- Dual-license is slightly more complex to communicate to contributors.
- The `CONTRIBUTING.md` must clearly explain which license applies to each PR type.
- AI training datasets must document the CC0 provenance (though no action is required).

## Compliance

- All data PRs: contributor agrees data is CC0 (stated in `CONTRIBUTING.md`).
- All code PRs: contributor agrees code is Apache-2.0 via DCO or CLA (TBD — see ADR-005 if adopted).
- `REUSE.toml` or SPDX headers may be added in a future ADR.
