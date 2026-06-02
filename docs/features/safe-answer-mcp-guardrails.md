# Safe Answer MCP Guardrails

> **Status:** ✅ Implemented (Phase 2) — `@open-helplines/mcp` v0.2.0  
> **Impact:** Prevents stale data, misrouting, and LLM hallucination when surfacing crisis helplines

---

## Overview

When LLMs (Claude, ChatGPT, Gemini) use the `open-helplines` MCP server to suggest crisis helplines,
they can inadvertently cause harm by:

- Providing **outdated phone numbers** (disconnected, changed)
- **Routing to the wrong country** (US lines for Japanese callers)
- **Hallucinating** helpline data not in the registry
- Omitting the **source and verification date**

The Safe Answer guardrails prevent all of these automatically.

---

## Guardrails

### 1. Staleness Check

**Trigger:** `verified_at` is older than 6 months.  
**Effect:** Response includes a `STALE_DATA` warning in the `warnings` array.  
**LLM guidance:** Disclose the staleness to the user and recommend calling the organization's main website to confirm the number is still active.

```json
{
  "code": "STALE_DATA",
  "message": "STALE_DATA: verified_at (2025-10-01) is older than 6 months. Verify this helpline is still active."
}
```

### 2. Cross-Country Misroute Prevention

**Trigger:** `record.country` ≠ the `country` parameter passed to `find_helplines`.  
**Effect:** Response includes a `DIFFERENT_COUNTRY_CONTEXT` warning.  
**LLM guidance:** Always pass the caller's ISO 3166-1 alpha-2 country code. Do not suggest a US helpline to a Japanese caller without explicit cross-country consent.

```json
{
  "code": "DIFFERENT_COUNTRY_CONTEXT",
  "message": "DIFFERENT_COUNTRY_CONTEXT: This helpline serves US but the request was for JP. Confirm this is appropriate."
}
```

### 3. Fallback Chain

When the requested country has no data in the registry:

```
Requested country (no data)
  → Nearby/regional country records  [FALLBACK_USED warning]
  → IASP / Befrienders Worldwide     [FALLBACK_INTERNATIONAL warning]
```

Regional proximity is defined by `REGIONAL_NEIGHBOURS` in `guardrails.ts`.
International fallbacks are the IASP and Befrienders Worldwide directories, which
list local crisis centres for virtually every country.

### 4. Mandatory Citation

**Every record** returned by the MCP server includes a `citation` object:

```json
{
  "citation": {
    "source": "https://www.since2011.net/yorisoi/",
    "verified_at": "2026-06-02",
    "last_checked_url_status": "unchecked"
  }
}
```

| Field | Description |
|-------|-------------|
| `source` | Authoritative URL for this helpline's data |
| `verified_at` | ISO 8601 date of last manual verification |
| `last_checked_url_status` | `200` / `4xx` / `5xx` / `unchecked` (see URL Health Check below) |

### 5. Hallucination Refusal (DATA_NOT_FOUND)

When a helpline or country is **not in the registry**, the server returns a `DATA_NOT_FOUND` sentinel
instead of an empty list. This explicitly signals to LLMs that they must not invent data.

```json
{
  "sentinel": "DATA_NOT_FOUND",
  "reason": "No helplines found for country='XX'.",
  "hint": "not in registry"
}
```

**LLM integration rule:** When you receive `DATA_NOT_FOUND`, tell the user "I don't have verified
helpline data for this country" and refer them to `https://www.iasp.info/resources/Crisis_Centres/`.

---

## MCP Tools

All three tools have guardrails enabled (shown as `[guardrails enabled]` in their descriptions).

### `find_helplines`

Search helplines by country, with optional category filter.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `country` | string | ✅ | ISO 3166-1 alpha-2 (e.g. `JP`, `US`, `GB`) |
| `category` | string | ❌ | `suicide_prevention` \| `mental_health` \| ... (see schema) |
| `limit` | number | ❌ | Max records (default 10, max 50) |

### `list_countries`

Returns all country codes with helpline data in the registry.
Always check this before calling `find_helplines` with an unknown country.

### `get_helpline_by_id`

Fetch a single record by its unique slug ID (e.g. `jp-inochi-no-denwa`).
Returns `DATA_NOT_FOUND` if the ID does not exist — never hallucinate IDs.

---

## LLM Integration Example

```
System prompt addition:
"When providing crisis helpline information, use the open-helplines MCP server.
Always check warnings[] for STALE_DATA and DIFFERENT_COUNTRY_CONTEXT.
If sentinel DATA_NOT_FOUND is returned, say 'I don't have verified data for this country'
and refer to https://www.iasp.info/resources/Crisis_Centres/."
```

---

## URL Health Check (Future — Phase 3)

`last_checked_url_status` currently returns `"unchecked"` for all records.
A future GitHub Actions workflow will:
1. Run weekly, HEAD-checking all `source` URLs
2. Write results to `data/index/url-health.json`
3. The MCP server will read this file on startup

See [Issue tracker] for the URL Health Check implementation (Phase 3 scope).

---

## Architecture

```
packages/mcp/src/
  types.ts        — Response types: Citation, GuardrailWarning, DataNotFoundResult
  registry.ts     — HelplinesRegistry: scans data/countries/*/helplines.json
  guardrails.ts   — Individual guardrail checks + fallback chain
  server.ts       — McpServer with 3 registered tools
  cli.ts          — stdio transport entrypoint
  index.ts        — Public API
packages/mcp/tests/
  guardrails.test.ts  — 19 unit tests (node:test)
```

---

## Testing

```bash
npm test -w packages/mcp
# 19 tests, 0 failures
# Covers: staleness / misroute / fallback / citation / hallucination refusal
```

---

## Using with Claude Desktop

Add to `claude_desktop_config.json`:

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
