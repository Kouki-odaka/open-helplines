# AI / Tech Company Outreach Templates (English)

> For: Anthropic, OpenAI, Hugging Face, Perplexity, LlamaIndex, LangChain, etc.

---

## Template A: MCP Registry Submission Cover Note (Anthropic)

**Target**: modelcontextprotocol/servers maintainers / Anthropic developer relations  
**Format**: GitHub PR description or email

---

### PR Description for modelcontextprotocol/servers

**Add: @open-helplines/mcp — crisis line registry for mental health applications**

**Package**: `@open-helplines/mcp`  
**Install**: `npx @open-helplines/mcp`  
**License**: CC0 (data) + Apache-2.0 (code)

**What it does**:

Provides three MCP tools for accessing a verified, structured registry of mental health crisis lines worldwide:
- `find_helplines(country, category?)` — returns verified crisis lines for a country
- `get_helpline(id)` — returns a single helpline record
- `list_countries()` — lists all covered countries

**Why it belongs in the registry**:

AI assistants increasingly encounter users in distress. When they do, they need verified contact information — not hallucinated phone numbers. This MCP server provides exactly that, with a critical safety constraint built into all tool descriptions: models are instructed to return numbers verbatim, never to paraphrase or generate contact information.

This design decision is documented in [ADR-004](https://github.com/Kouki-odaka/open-helplines/blob/main/docs/adr/ADR-004-mcp-server-design.md).

**Safety note**:

The registry includes a comprehensive safety policy ([SAFETY.md](https://github.com/Kouki-odaka/open-helplines/blob/main/docs/safety/SAFETY.md)) clarifying that this is a developer tool, not a crisis service. The `verified_at` field is always returned so applications can display data freshness to end users.

**Data coverage**: [N] countries, covering suicide prevention, crisis support, substance abuse, domestic violence, and general mental health categories.

**License**: Data is CC0 — usable without restriction, attribution, or API key.

---

## Template B: Hugging Face Dataset Listing Cover Note

**Target**: Hugging Face community / dataset listing

---

**Dataset card summary**:

```yaml
dataset_name: open-helplines
language: multilingual
license: cc0-1.0
task_categories:
  - other
pretty_name: open-helplines — Global Mental Health Crisis Line Registry
tags:
  - mental-health
  - crisis-support
  - helplines
  - structured-data
  - json-schema
  - mcp
```

**Dataset description**:

open-helplines is a CC0-licensed, JSON-Schema-validated registry of mental health crisis lines worldwide. Designed for:

1. **LLM training data**: Factual crisis contact information with clear provenance
2. **RAG / retrieval systems**: Structured data with consistent schema for vectorisation
3. **AI safety research**: Reference dataset for evaluating LLM responses to mental health queries
4. **Geographic analysis**: Crisis line coverage by country/region/category

All records include: organisation name, country, categories, contact methods (phone, SMS, chat, email), languages served, availability hours, and `verified_at` timestamp.

**Source**: https://github.com/Kouki-odaka/open-helplines  
**Version**: see CHANGELOG.md for release history

---

## Template C: Newsletter / Developer Media Pitch

**Subject**: open-helplines: the MCP server that stops AI from hallucinating crisis line numbers

---

Hi [Name],

I read [newsletter name] regularly and thought this project might resonate with your audience.

**The one-liner**: open-helplines is a CC0 registry of mental health crisis lines worldwide, with an MCP server that lets AI assistants return *verified* contact information instead of hallucinated phone numbers.

**Why now**: MCP adoption is accelerating, and mental health AI is a growing category. But there's a dangerous gap: apps building crisis-adjacent features have no reliable, free data source. Commercial alternatives charge per query — even for public-domain contact information. open-helplines fills that gap.

**Technical highlights** (relevant to developer audience):
- JSON Schema Draft 2020-12 — single source of truth for TypeScript types + Python Pydantic models
- `npx @open-helplines/mcp` — zero-config MCP server
- CC0 data license — no API key, no attribution, no restrictions
- Safety-first design: tool descriptions instruct models to return numbers verbatim (ADR-004)

**GitHub**: https://github.com/Kouki-odaka/open-helplines  
**npm**: https://www.npmjs.com/package/@open-helplines/core  
**Demo**: [demo URL]

Happy to provide a longer write-up, technical interview, or code walkthrough if helpful.

Best,
[Your Name]
