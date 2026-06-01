[![License: Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-blue)](LICENSE)
[![Data: CC0](https://img.shields.io/badge/data-CC0%201.0-lightgrey)](LICENSE-DATA)
[![npm](https://img.shields.io/npm/v/@open-helplines/core)](https://www.npmjs.com/package/@open-helplines/core)
[![PyPI](https://img.shields.io/pypi/v/open-helplines)](https://pypi.org/project/open-helplines/)
[![CI](https://github.com/Kouki-odaka/open-helplines/actions/workflows/pr.yml/badge.svg)](https://github.com/Kouki-odaka/open-helplines/actions/workflows/pr.yml)

# open-helplines

**Open data registry of mental health helplines worldwide — free for any use, no API key required.**

---

## Why this exists

Two gaps in the current landscape:

1. **Commercial lock-in.** Existing directories (ThroughLine and similar) are proprietary. Developers who build crisis support features must pay per query or accept restrictive terms, even when the underlying data is public-domain fact.

2. **Unstructured data.** Community initiatives (Sticks & Stones, wiki pages, spreadsheets) collect this information but in formats that are hard to validate, version, or consume programmatically — and impossible to feed reliably to an LLM without hallucination risk.

open-helplines fills the gap: verified, structured, CC0 data with a stable JSON Schema, TypeScript types, Python models, and an MCP server — so any developer or LLM can access the registry without cost, attribution, or API keys.

---

## For LLM developers

The fastest integration path:

### MCP server (Claude Desktop, any MCP host)

```json
{
  "mcpServers": {
    "open-helplines": {
      "command": "npx",
      "args": ["@open-helplines/mcp"]
    }
  }
}
```

Three tools available: `find_helplines`, `get_helpline`, `list_countries`.  
See [examples/mcp-claude-desktop/README.md](examples/mcp-claude-desktop/README.md) for full setup.

> **Safety constraint:** All tool descriptions instruct the model to extract phone numbers and URLs verbatim from registry data — never to paraphrase or generate contact information. ([ADR-004](docs/adr/ADR-004-mcp-server-design.md))

### Type packages

```sh
npm install @open-helplines/core   # TypeScript types + validator
pip install open-helplines         # Python Pydantic models + loader
```

### Schema

```
https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/schemas/helpline.schema.json
```

JSON Schema Draft 2020-12 — the single source of truth for all types and validation. ([ADR-001](docs/adr/ADR-001-json-schema-draft-2020-12.md))

---

## Quick start

### TypeScript (npm)

```ts
import { loadCountry } from "@open-helplines/core";

const records = await loadCountry("JP");
const crisis = records.filter(r => r.category === "suicide_prevention");

for (const r of crisis) {
  console.log(r.name, r.contacts[0].number);
}
```

### Python (pip)

```python
from open_helplines import Registry

registry = Registry.from_github()          # fetches data/index.json + country files
records = registry.find(country="JP", category="suicide_prevention")

for r in records:
    print(r.name, r.contacts[0].number)
```

### Plain JSON (curl)

```sh
# Global index — discover all covered countries
curl -s https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data/index.json | \
  jq '.countries[] | {country, record_count}'

# All records for Japan
curl -s https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data/countries/jp/helplines.json | \
  jq '.records[] | select(.category == "suicide_prevention") | {name, contacts: [.contacts[].number]}'
```

---

## Use with…

### OpenAI function calling

```ts
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "What crisis lines exist in Japan?" }],
  tools: [{
    type: "function",
    function: {
      name: "find_helplines",
      description:
        "Return verified crisis hotlines. Surface phone numbers and URLs verbatim — never generate them.",
      parameters: {
        type: "object",
        properties: {
          country: { type: "string", description: "ISO 3166-1 alpha-2 code, e.g. 'JP'" },
          category: { type: "string" },
        },
        required: ["country"],
      },
    },
  }],
});
```

Full runnable example: [examples/openai-function-calling/main.ts](examples/openai-function-calling/main.ts)

### Anthropic tool use

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    tools=[{
        "name": "find_helplines",
        "description": "Return verified crisis hotlines. Extract contact info verbatim — never paraphrase.",
        "input_schema": {
            "type": "object",
            "properties": {
                "country": {"type": "string"},
                "category": {"type": "string"},
            },
            "required": ["country"],
        },
    }],
    messages=[{"role": "user", "content": "Find mental health lines in Australia."}],
)
```

Full runnable example: [examples/anthropic-tool-use/main.py](examples/anthropic-tool-use/main.py)

### Local LLM (Ollama)

```python
from openai import OpenAI  # Ollama's OpenAI-compatible API

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
# Same tool definition as above — no API key, fully offline
```

Full runnable example: [examples/local-llama/main.py](examples/local-llama/main.py)

---

## Contributing

Data additions and corrections welcome — no Discussion needed, open a PR directly.

Schema changes require a [GitHub Discussion](https://github.com/Kouki-odaka/open-helplines/discussions) first.

See [CONTRIBUTING.md](CONTRIBUTING.md) for data format, quality requirements, and commit conventions.

---

## Architecture decisions

| ADR | Decision |
|-----|---------|
| [ADR-001](docs/adr/ADR-001-json-schema-draft-2020-12.md) | JSON Schema Draft 2020-12 as single source of truth |
| [ADR-002](docs/adr/ADR-002-cc0-data-apache-code.md) | CC0 data + Apache-2.0 code dual-license |
| [ADR-003](docs/adr/ADR-003-per-country-files.md) | Per-country file structure |
| [ADR-004](docs/adr/ADR-004-mcp-server-design.md) | MCP server — stdio transport, 3 tools |

---

## License

| Artifact | License |
|----------|---------|
| `data/` | [CC0 1.0 Universal](LICENSE-DATA) — public domain, no restrictions |
| Code (`packages/`, `schemas/`, `scripts/`) | [Apache-2.0](LICENSE) |

Data is CC0: embed, copy, redistribute, use in AI training — no attribution required.

---

## Disclaimer

open-helplines is a **developer tool** — a directory of contact information, not a crisis service.

- It cannot assess risk, provide counseling, or respond to emergencies.
- Phone numbers are verified periodically, not in real time. Always show the `verified_at` date to end users.
- **If someone is in immediate danger, direct them to local emergency services (911, 119, 999…) first.**

See [docs/safety/SAFETY.md](docs/safety/SAFETY.md) for the full safety policy and responsible LLM integration guidelines.
