# ADR-001: Use JSON Schema Draft 2020-12 as the single source of truth

**Status:** Accepted  
**Date:** 2026-06-02  
**Author:** Kouki-odaka  

---

## Context

The open-helplines registry stores structured data about mental health helplines across 20+
countries. This data is consumed by:

1. **TypeScript tooling** (`@open-helplines/core`) — validator, DistBuilder
2. **Python client** (`open-helplines` PyPI) — Pydantic models
3. **MCP server** (`@open-helplines/mcp`) — LLM tool calling
4. **LLM agents** — directly reading JSON for RAG or tool use
5. **Human contributors** — adding/updating records via PR

We need a single authoritative specification that can be used to:
- Validate data files at CI time
- Generate TypeScript types automatically
- Generate Pydantic models automatically
- Provide context to LLMs editing the registry

The main alternatives considered were:

| Option | Pros | Cons |
|--------|------|------|
| **JSON Schema Draft 2020-12** | Tooling ecosystem, `ajv` supports it, `json-schema-to-typescript` and `datamodel-codegen` generate types from it, widely understood by LLMs | Verbose |
| TypeScript as source of truth | Ergonomic for TS devs | Requires a TypeScript-to-JSON-Schema step; Python consumers are second-class |
| Pydantic as source of truth | Ergonomic for Python devs | Requires pydantic-to-JSON-Schema step; TypeScript consumers are second-class |
| Protobuf / Thrift | Excellent cross-language | Heavy toolchain, poor LLM support, overkill for a data registry |
| Zod | TS-native, composable | Cannot generate Python models without extra steps |

## Decision

Use **JSON Schema Draft 2020-12** (`schemas/helpline.schema.json`) as the single source of truth.

- TypeScript types in `packages/core/src/types/helpline.ts` are **manually maintained but
  derived** from the schema, with automated generation available via `npm run build:types`.
- Pydantic models in `packages/python/open_helplines/models.py` are **manually maintained but
  derived**, with automated generation via `scripts/generate_python_models.py`.
- The schema is embedded in each data file via the `$schema` field for IDE autocompletion.

### Key schema constraints

- `additionalProperties: false` on all `$defs` objects → LLM-generated entries with unknown
  fields fail immediately at validation time, not silently.
- `if/then/else` conditionals for phone vs. non-phone contacts → only valid combinations
  pass validation.
- Pattern constraints on `id`, `country`, `phone number`, `date` → prevent common data entry
  errors.

## Consequences

**Positive:**
- One file to update when adding a new field; types in TS and Python regenerate automatically.
- `additionalProperties: false` catches AI hallucinations early.
- LLMs can read `schemas/helpline.schema.json` directly and know exactly what fields to emit.
- Ajv (used in `@open-helplines/core`) supports Draft 2020-12 natively.

**Negative:**
- JSON Schema is verbose. Contributors editing the schema must understand `$defs` and `$ref`.
- Draft 2020-12 tooling is more mature than Draft 2019-09 but still has edge cases with
  some generators (e.g., `json-schema-to-typescript` may require option tuning for `if/then`).
- Manual sync between schema and handwritten TS/Python types until CI enforces the generator.

## Compliance

All data files MUST have a `$schema` field pointing to the canonical schema URL.
CI validates all `data/countries/**/*.json` files against the schema on every push.
