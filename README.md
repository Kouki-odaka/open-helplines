<div align="center">

# open-helplines

**Stop hallucinating crisis numbers. One MCP import — always verified.**

*Open data registry of mental health helplines worldwide. CC0. No API key. No lock-in.*

[![CI](https://github.com/Kouki-odaka/open-helplines/actions/workflows/pr.yml/badge.svg)](https://github.com/Kouki-odaka/open-helplines/actions/workflows/pr.yml)
[![npm](https://img.shields.io/npm/v/@open-helplines/mcp?label=MCP%20server&color=6941C6)](https://www.npmjs.com/package/@open-helplines/mcp)
[![Glama MCP](https://glama.ai/mcp/servers/Kouki-odaka/open-helplines/badge)](https://glama.ai/mcp/servers/Kouki-odaka/open-helplines)
[![npm](https://img.shields.io/npm/v/@open-helplines/core?label=%40open-helplines%2Fcore)](https://www.npmjs.com/package/@open-helplines/core)
[![PyPI](https://img.shields.io/pypi/v/open-helplines)](https://pypi.org/project/open-helplines/)
[![Countries](https://img.shields.io/badge/countries%20covered-24-brightgreen)](data/countries/)
[![License: CC0-1.0 (data)](https://img.shields.io/badge/data-CC0--1.0-blue.svg)](LICENSE-DATA)
[![License: Apache-2.0 (code)](https://img.shields.io/badge/code-Apache--2.0-green.svg)](LICENSE)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/Kouki-odaka/open-helplines/badge)](https://securityscorecards.dev/viewer/?uri=github.com/Kouki-odaka/open-helplines)
[![Contributors](https://img.shields.io/github/contributors/Kouki-odaka/open-helplines)](https://github.com/Kouki-odaka/open-helplines/graphs/contributors)
[![Star History](https://img.shields.io/github/stars/Kouki-odaka/open-helplines?style=social)](https://star-history.com/#Kouki-odaka/open-helplines&Date)

<!-- DEMO: Replace the placeholder below once the demo GIF from Task #16 is ready -->
![Demo: Claude Desktop + open-helplines MCP](examples/web/public/assets/demo.gif)

[🌐 Visualization Site](https://kouki-odaka.github.io/open-helplines/en/) ·
[📖 Docs](docs/) ·
[💬 Discussions](https://github.com/Kouki-odaka/open-helplines/discussions) ·
[❤️ Sponsor](https://kouki-odaka.github.io/open-helplines/en/donate/)

</div>

---

## Quick Start — MCP (Claude Desktop, any MCP host)

Add to your `claude_desktop_config.json` and restart Claude Desktop — zero configuration, zero API key:

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

Then just ask Claude:

> *"What are the 24/7 crisis lines in Japan?"*  
> *"Find a mental health helpline in Brazil that supports English."*  
> *"My user seems to be in distress — what's the nearest crisis line for Australia?"*

Claude returns verified numbers and URLs **verbatim from the registry** — never hallucinated.

Three MCP tools available: `find_helplines`, `get_helpline_by_id`, `list_countries`.  
See [examples/mcp-claude-desktop/README.md](examples/mcp-claude-desktop/README.md) for full setup.

---

## Why it matters

### The problem: LLMs hallucinate crisis numbers

Mental health chatbots, AI companionship apps, and LLM agents regularly encounter users in crisis. When they try to surface a helpline, they face two bad options:

1. **Commercial lock-in** — directories like ThroughLine charge per query and impose restrictive terms, even when the underlying data is public-domain fact.
2. **Hallucination risk** — without a verified data source, LLMs generate plausible-looking phone numbers that may be wrong. A wrong number when someone is in crisis is not a UX bug — it's a safety failure.

### The solution: open-helplines

open-helplines fills the gap with **verified, structured, CC0 data** and a production-ready MCP server:

| Feature | Detail |
|:---|:---|
| **CC0 data** | Public domain. Use in any commercial or non-commercial product, including AI training, without attribution. |
| **JSON Schema** | Draft 2020-12. TypeScript types and Python Pydantic models generated from the schema. |
| **MCP server** | `npx @open-helplines/mcp` — Safe Answer guardrails built in. |
| **Emergency First Resolver** | Crisis keywords trigger an instant CVD-safe banner with one-tap call/text/chat links. |
| **No-Log Crisis Finder** | Privacy-preserving search — no query logging, no user fingerprinting. |
| **24 countries, growing** | AU, BD, BR, CA, CN, DE, EG, FR, GB, ID, IN, JP, KR, MX, NG, NZ, PH, PK, RU, TR, UA, US, VN, ZA |

---

## Features

### 🛡️ Safe Answer Guardrails

All MCP tools enforce five guardrails automatically — no configuration needed:

| Guardrail | Behaviour |
|:---|:---|
| **Staleness check** | `verified_at` > 6 months → `STALE_DATA` warning in response |
| **Misroute prevention** | `record.country` ≠ requested country → `DIFFERENT_COUNTRY_CONTEXT` warning |
| **Fallback chain** | No data → nearby country → IASP/Befrienders international directory |
| **Mandatory citation** | Every record includes `source` + `verified_at` + `last_checked_url_status` |
| **Hallucination refusal** | Unknown country/ID → `DATA_NOT_FOUND` sentinel (never hallucinate) |

See [`docs/features/safe-answer-mcp-guardrails.md`](docs/features/safe-answer-mcp-guardrails.md) for the full specification.

### 🚨 Emergency First Resolver

When a user on the [visualization site](https://kouki-odaka.github.io/open-helplines/en/) searches crisis-related terms, a CVD-safe banner instantly surfaces the nearest 24/7 helpline with one-tap call/text/chat links.

See [`docs/features/emergency-first-resolver.md`](docs/features/emergency-first-resolver.md).

### 🔍 No-Log Crisis Finder

Privacy-preserving crisis search: no query logging, no user fingerprinting, no analytics on what people are searching for. See [`docs/features/no-log-crisis-finder.md`](docs/features/no-log-crisis-finder.md).

### 🌍 Visualization Site

Explore the registry visually:
- **Globe view** — interactive 3D globe with helpline coverage
- **Heatmap** — choropleth map of coverage density
- **Network graph** — relationships between organisations

→ [kouki-odaka.github.io/open-helplines/en](https://kouki-odaka.github.io/open-helplines/en/)

---

## Integration examples

### TypeScript / Node.js

```ts
import { loadCountry } from "@open-helplines/core";

const records = await loadCountry("JP");
const crisis = records.filter(r => r.category === "suicide_prevention");

for (const r of crisis) {
  console.log(r.name, r.contacts[0].number);
}
```

### Python

```python
from open_helplines import Registry

registry = Registry.from_github()          # fetches data/index.json + country files
records = registry.find(country="JP", category="suicide_prevention")

for r in records:
    print(r.name, r.contacts[0].number)
```

### Plain JSON (no dependencies)

```sh
# Discover all covered countries
curl -s https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data/index.json | \
  jq '.countries[] | {country, record_count}'

# All helplines for Japan
curl -s https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data/countries/jp/helplines.json | \
  jq '.records[] | select(.category == "suicide_prevention") | {name, contacts: [.contacts[].number]}'
```

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

## JSON Schema

```
https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/schemas/helpline.schema.json
```

JSON Schema Draft 2020-12 — single source of truth for all types and validation. ([ADR-001](docs/adr/ADR-001-json-schema-draft-2020-12.md))

---

## Contributing

**Data corrections and additions are always welcome — no Discussion needed, open a PR directly.**

Data PRs are the fastest way to help: if you know the correct number for a country, add or fix it.

Schema changes require a [GitHub Discussion](https://github.com/Kouki-odaka/open-helplines/discussions) first.

See [CONTRIBUTING.md](CONTRIBUTING.md) for data format, quality requirements, and commit conventions.

---

## Community

💬 **[GitHub Discussions](https://github.com/Kouki-odaka/open-helplines/discussions)** — feature requests, country coverage questions, schema proposals, and general conversation.

We especially welcome contributions from mental health professionals and NPO staff who can verify data accuracy for their country.

| Document | Description |
|:---|:---|
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards (Contributor Covenant 2.1) |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting policy |
| [GOVERNANCE.md](GOVERNANCE.md) | Project governance and decision flow |
| [Press kit](docs/press-kit/README.md) | Logos, descriptions, and key facts for media use |

---

## Sponsor

open-helplines is free, open, and CC0 — and will always be. If you find it useful, consider sponsoring to keep the data verified and the tooling maintained:

- ❤️ [Donate via the project site](https://kouki-odaka.github.io/open-helplines/en/donate/)
- 🌟 GitHub Sponsors — coming soon (see [FUNDING.yml](.github/FUNDING.yml))
- 🏛️ Open Collective — coming soon

---

## License

open-helplines uses **dual licensing**:

| Component | License | Why |
|:---|:---|:---|
| **Data** (`data/**`, `dist/by-*/*.json`) | [CC0 1.0](LICENSE-DATA) | Maximally usable — no friction for crisis tools, AI training, or commercial use |
| **Code** (TypeScript, Python, scripts, workflows) | [Apache-2.0](LICENSE) | Patent protection, attribution-friendly |

You may use the data in any commercial or non-commercial product, including AI systems, without attribution. The code requires the Apache-2.0 notice.

See [NOTICE](NOTICE) for the dual-license declaration and [docs/LICENSING.md](docs/LICENSING.md) for a detailed explanation including commercial use, AI training, and derivative work policies.

---

## Architecture decisions

| ADR | Decision |
|:---|:---|
| [ADR-001](docs/adr/ADR-001-json-schema-draft-2020-12.md) | JSON Schema Draft 2020-12 as single source of truth |
| [ADR-002](docs/adr/ADR-002-cc0-data-apache-code.md) | CC0 data + Apache-2.0 code dual-license |
| [ADR-003](docs/adr/ADR-003-per-country-files.md) | Per-country file structure |
| [ADR-004](docs/adr/ADR-004-mcp-server-design.md) | MCP server — stdio transport, 3 tools |

---

## Disclaimer

open-helplines is a **developer tool** — a directory of contact information, not a crisis service.

- It cannot assess risk, provide counseling, or respond to emergencies.
- Phone numbers are verified periodically, not in real time. Always show the `verified_at` date to end users.
- **If someone is in immediate danger, direct them to local emergency services (911, 119, 999…) first.**

See [docs/safety/SAFETY.md](docs/safety/SAFETY.md) for the full safety policy and responsible LLM integration guidelines.

---

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=Kouki-odaka/open-helplines&type=Date)](https://star-history.com/#Kouki-odaka/open-helplines&Date)

*If open-helplines saves someone from receiving a wrong crisis number, it's worth a ⭐.*

</div>
