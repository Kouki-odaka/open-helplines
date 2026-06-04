# @open-helplines/mcp

> Verified community support resource directory for Claude Desktop and MCP clients.  
> **Safe Answer guardrails enabled** — returns `DATA_NOT_FOUND` sentinel instead of hallucinating.

[![npm](https://img.shields.io/npm/v/@open-helplines/mcp?label=npm&color=6941C6)](https://www.npmjs.com/package/@open-helplines/mcp)
[![CI](https://github.com/Kouki-odaka/open-helplines/actions/workflows/pr.yml/badge.svg)](https://github.com/Kouki-odaka/open-helplines/actions/workflows/pr.yml)
[![License: Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-green.svg)](../../LICENSE)
[![Data: CC0](https://img.shields.io/badge/data-CC0--1.0-blue.svg)](../../LICENSE-DATA)

---

## Overview

`@open-helplines/mcp` is an [MCP server](https://modelcontextprotocol.io/) that exposes the [open-helplines](https://github.com/Kouki-odaka/open-helplines) registry to Claude Desktop and other MCP clients. It provides verified, community-maintained records of wellbeing support resources across 24+ countries.

All tools operate with **five built-in guardrails** to ensure accurate, responsible responses:

| Guardrail | Behavior |
|:---|:---|
| **Staleness check** | Warns when a record has not been verified in over 6 months |
| **Misroute prevention** | Refuses to return records from a country that differs from the request |
| **Fallback chain** | Tries nearby countries → international directories when local data is unavailable |
| **Mandatory citation** | Every response includes `source`, `verified_at`, and URL status |
| **Hallucination refusal** | Returns `DATA_NOT_FOUND` sentinel when no data exists — never invents records |

---

## Installation

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "open-helplines": {
      "command": "npx",
      "args": ["-y", "@open-helplines/mcp"]
    }
  }
}
```

**Config file location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### Other MCP clients

```bash
npx @open-helplines/mcp
```

### Global install

```bash
npm install -g @open-helplines/mcp
open-helplines-mcp
```

---

## MCP Tools

### `find_helplines`

Search verified resources by country code and optional category.

**Input:**
| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `country` | string | ✅ | ISO 3166-1 alpha-2 country code (uppercase), e.g. `"JP"`, `"US"`, `"AU"` |
| `category` | string | — | Filter by service type (see categories below) |
| `limit` | integer | — | Max records to return (default: 10, max: 50) |

**Categories:** `suicide_prevention` · `mental_health` · `domestic_violence` · `sexual_violence` · `substance_abuse` · `youth` · `lgbtq` · `veterans` · `elder` · `grief` · `general_crisis` · `other`

**Example response:**
```json
{
  "found": true,
  "records": [
    {
      "id": "jp-inochi-no-denwa",
      "country": "JP",
      "name": "いのちの電話",
      "category": "general_crisis",
      "contacts": [
        { "method": "phone", "value": "0120-783-556", "hours": "毎日16時〜21時", "free": true }
      ],
      "citation": {
        "source": "https://www.inochi.or.jp/",
        "verified_at": "2026-05-01",
        "last_checked_url_status": "ok"
      },
      "warnings": []
    }
  ],
  "total": 1
}
```

---

### `list_countries`

List all country codes that have data in the registry.

**No input required.**

**Example response:**
```json
{
  "countries": ["AU", "CA", "DE", "FR", "GB", "JP", "NZ", "US", ...],
  "total": 24,
  "note": "Use country codes with find_helplines. DATA_NOT_FOUND is returned for unlisted codes."
}
```

---

### `get_helpline_by_id`

Fetch a single resource record by its unique slug ID.

**Input:**
| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | string | ✅ | Unique slug ID, e.g. `"jp-inochi-no-denwa"` |

**Example response:**
```json
{
  "found": true,
  "record": { ... }
}
```

---

## Example Usage with Claude

Once the server is configured, Claude can answer questions like:

> *"What wellbeing support resources are available in Australia?"*  
> → Claude calls `find_helplines({ country: "AU" })` and returns verified records with citations.

> *"Are there youth-focused support services in Canada?"*  
> → Claude calls `find_helplines({ country: "CA", category: "youth" })`.

> *"Tell me about 'au-lifeline'."*  
> → Claude calls `get_helpline_by_id({ id: "au-lifeline" })`.

If a country is not in the registry, the server returns `DATA_NOT_FOUND` — Claude will not hallucinate a phone number.

---

## DATA_NOT_FOUND Sentinel

When no data exists for the requested country or ID, all tools return:

```json
{
  "sentinel": "DATA_NOT_FOUND",
  "reason": "Country 'XX' is not in the registry. Use list_countries to see supported codes.",
  "hint": "not in registry"
}
```

LLM clients should interpret this as: **no verified data available** — do not supplement with training knowledge.

---

## Transport

This server uses **stdio** transport (standard MCP pattern). It is started by the MCP client process and communicates over stdin/stdout.

No API keys or environment variables required.

---

## License

- **Code** (this package): [Apache-2.0](../../LICENSE)
- **Data** (`../../data/`): [CC0-1.0](../../LICENSE-DATA) — Public domain, no restrictions

---

## Contributing

See the [root CONTRIBUTING.md](../../CONTRIBUTING.md) and [open-helplines data contribution guide](../../docs/).

Data pull requests welcome — add new countries, update contacts, fix URLs.

---

## Links

- 🏠 [Project homepage](https://kouki-odaka.github.io/open-helplines/en/)
- 📦 [npm package](https://www.npmjs.com/package/@open-helplines/mcp)
- 🗂️ [GitHub repository](https://github.com/Kouki-odaka/open-helplines)
- 🌐 [Registry visualization](https://kouki-odaka.github.io/open-helplines/en/)
- 💬 [Discussions](https://github.com/Kouki-odaka/open-helplines/discussions)
