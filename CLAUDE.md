# open-helplines — Claude Code Instructions

## Project purpose

Open-source, CC0-licensed global registry of mental health and crisis helplines.
LLMs and AI assistants should be able to query this registry to answer questions like
"What crisis hotlines are available in Japan?" or "Find a free, English-language suicide
prevention line in the UK."

## Repository layout

```
open-helplines/
├── data/
│   ├── index.json                    # Machine-generated global index (do not edit manually)
│   └── countries/{cc}/helplines.json # Per-country data files (CC0)
├── schemas/
│   └── helpline.schema.json          # Source of truth — JSON Schema Draft 2020-12
├── packages/
│   ├── core/                         # @open-helplines/core — TypeScript validator + builder
│   ├── mcp/                          # @open-helplines/mcp — MCP server
│   └── python/                       # open-helplines PyPI package
├── docs/
│   ├── adr/                          # Architecture Decision Records
│   └── safety/                       # Data quality and safety policies
├── scripts/
│   ├── generate-types.mjs            # JSON Schema → TypeScript types
│   └── generate_python_models.py     # JSON Schema → Pydantic models
└── llms.txt                          # AI/LLM integration guide (llms.txt standard)
```

## Non-negotiable rules (apply to all code changes)

1. **Schema is the source of truth.** `schemas/helpline.schema.json` defines all data shapes.
   TypeScript types in `packages/core/src/types/` and Pydantic models in
   `packages/python/open_helplines/models.py` must stay in sync with it.
   When in doubt, re-read the schema.

2. **Data is CC0; code is Apache-2.0.** Never add a non-CC0 data file under `data/`.
   Never add a non-Apache-2.0 source file under `packages/` or `scripts/`.

3. **`additionalProperties: false` everywhere.** All new JSON objects in `data/` must
   pass schema validation. Run `npm run validate` before committing data changes.

4. **E.164 phone numbers only.** Reject bare numbers like `0120-783-556`. Store as
   `+81120783556`. The schema enforces this; do not bypass it.

5. **No PII.** Data files must not contain names, personal emails, or phone numbers of
   individual people.

6. **Verified data only.** `verified_at` must be within the past 24 months.
   Do not invent or guess helpline data — every record must have a `source` URL.

7. **Conventional Commits.** All commits must use the format:
   `<type>(<scope>): <description>`
   Types: `feat`, `fix`, `chore`, `docs`, `data`, `test`, `refactor`
   Scopes: `schema`, `core`, `mcp`, `python`, `data`, `ci`, `docs`

8. **No `Co-Authored-By: Claude` in commit messages.** Use `Kouki-odaka` as the
   git author for all commits in this repository.

## Common tasks

### Add a helpline record

1. Find or create `data/countries/{cc}/helplines.json`
2. Add a `HelplineRecord` object following `schemas/helpline.schema.json`
3. Verify: `npm run validate`
4. Commit: `git commit -m "data(jp): add Inochi no Denwa record"`

### Validate all data

```bash
npm run validate
```

### Generate TypeScript types from schema

```bash
npm run build:types
# Output: packages/core/src/generated/helpline.generated.ts
```

### Generate Python models from schema

```bash
python3 scripts/generate_python_models.py
# Requires: pip install datamodel-code-generator
```

### Build TypeScript packages

```bash
npm run build
```

## Architecture decisions

See `docs/adr/` for rationale on major decisions:

- [ADR-001](docs/adr/ADR-001-json-schema-draft-2020-12.md) — Why JSON Schema Draft 2020-12
- [ADR-002](docs/adr/ADR-002-cc0-data-apache-code.md) — Dual-license strategy
- [ADR-003](docs/adr/ADR-003-per-country-files.md) — Per-country file structure
- [ADR-004](docs/adr/ADR-004-mcp-server-design.md) — MCP server design

## Safety note

This registry is used by AI assistants to answer questions about mental health support.
**Stale or incorrect helpline numbers can harm people in crisis.**
Before committing any data change, manually verify the number/URL is operational.
Do not rely solely on web scraping or LLM knowledge.
