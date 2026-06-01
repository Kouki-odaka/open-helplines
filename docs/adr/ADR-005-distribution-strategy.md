# ADR-005: Three-channel distribution — npm + PyPI + MCP

**Status:** Accepted  
**Date:** 2026-06-02  
**Author:** Kouki-odaka  

---

## Context

The open-helplines registry is useful to different consumer audiences:

| Audience | Tool they use | What they need |
|----------|--------------|----------------|
| JavaScript / Node.js developers | npm | TypeScript types, validator, registry client |
| Python developers | pip / PyPI | Pydantic models, registry client |
| LLM agents (Claude, GPT, Gemini, local models) | MCP | Tool calling: find_helplines, get_helpline, list_countries |
| Static web pages, CDN consumers | Raw JSON via GitHub CDN | `data/index.json`, `data/countries/*.json` |
| CLI power users | npx | One-shot validation and search without install |

The question is whether to maintain separate distribution channels or consolidate.

## Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| **npm only** | Single channel to maintain | Python ecosystem excluded; MCP hosts can't consume npm packages directly |
| **PyPI only** | Single channel | JavaScript ecosystem excluded |
| **MCP only** | LLM-native | Human developers without LLM orchestration are excluded |
| **Raw JSON / GitHub CDN only** | Zero dependencies | Consumer must implement filtering and validation themselves |
| **npm + PyPI + MCP** | All audiences served natively | Three release pipelines to maintain |

## Decision

Maintain **three distribution channels in parallel**:

### Channel 1: npm (`@open-helplines/core`)

- TypeScript types derived from the JSON Schema
- `HelplineValidator` with Ajv for schema + business rules
- `DistBuilder` for regenerating the global index
- `HelplineRegistry` query interface

### Channel 2: PyPI (`open-helplines`)

- Pydantic v2 models derived from the JSON Schema
- `HelplineRegistry` Python class with the same filter API as the npm package
- Ships with bundled snapshot of current `data/` directory to enable offline usage

### Channel 3: MCP server (`@open-helplines/mcp`)

- stdio-transport MCP server (ADR-004)
- Tools: `find_helplines`, `get_helpline`, `list_countries`
- Usable via `claude_desktop_config.json`, Zed editor MCP, and any MCP-compliant host
- Binary distributed via npm (`npx @open-helplines/mcp`) and PyPI (`pip install open-helplines[mcp]`)

### Raw JSON (no separate channel required)

- All `data/countries/*.json` files accessible via GitHub raw CDN:
  `https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data/countries/{cc}/helplines.json`
- `data/index.json` as discovery endpoint
- No explicit versioning on raw files (consumers pin a git ref if they need stability)

## Release coordination

All three channels release from a single GitHub Actions workflow triggered by a git tag.
The version in `package.json` (workspace root) is the canonical version number that
drives all channel releases. See ADR-006 for versioning strategy.

```
git tag v0.2.0
  → Release workflow triggers
  → npm publish @open-helplines/core@0.2.0
  → npm publish @open-helplines/mcp@0.2.0
  → PyPI publish open-helplines==0.2.0
  → GitHub Release with CHANGELOG section
```

## Consequences

**Positive:**
- Every major developer ecosystem has a first-class integration.
- LLM agents can use MCP without writing any code.
- Python data science users (pandas, polars workflows) have native Pydantic models.
- The three channels share a single schema and a single test suite; consistency is enforced
  at the schema level, not by duplicating logic.

**Negative:**
- Three release pipelines to maintain. Mitigated by the unified release workflow.
- Channel-specific bugs (npm publish auth, PyPI token rotation, MCP SDK version bumps)
  require channel-specific debugging.
- Python bundled data snapshot increases PyPI package size (~500 KB for 20 countries).
  Mitigated by lazy-loading from GitHub CDN as an alternative mode.

## Channel versioning rule

All three channels MUST release the same semantic version simultaneously.
A broken release on one channel must trigger a yanked release on all channels to prevent
version skew between npm and PyPI consumers.
