# Key Facts Sheet — open-helplines

> One-page reference for journalists, bloggers, and conference talks.  
> Last updated: 2026-06-06

---

## What is it?

**open-helplines** is an open-source database of verified mental health and crisis helpline records, distributed as a CC0 public domain dataset and an MCP (Model Context Protocol) server for AI assistants.

---

## At a Glance

| Fact | Detail |
|------|--------|
| **Project type** | Open-source dataset + MCP server + npm library |
| **Primary use case** | AI assistants (Claude, etc.) surfacing crisis lines in real time |
| **Data license** | CC0 1.0 Universal (public domain) |
| **Code license** | MIT |
| **Countries covered** | 24+ (growing via community contributions) |
| **Verified records** | 5+ (expanding; each manually source-verified) |
| **Languages supported** | Multilingual (per-record language tags) |
| **MCP package** | `@open-helplines/mcp` v0.2.0 |
| **npm package** | `@open-helplines/core` v0.1.0 |
| **PyPI package** | `open-helplines` (Python) |
| **Repository** | https://github.com/Kouki-odaka/open-helplines |
| **Listed on** | [Glama MCP Servers](https://glama.ai/mcp/servers/Kouki-odaka/open-helplines) (quality-scored MCP registry) |
| **Schema** | JSON Schema (draft-07); CycloneDX SBOM on each release |

---

## Key Features

- **MCP-native**: Plug into Claude Desktop or any MCP-compatible AI client with zero code
- **Community-verified data**: E.164 phone numbers, 24/7 vs. hours-based availability, language tags
- **Multi-format distribution**: JSON dataset, TypeScript/npm library, Python/PyPI package
- **Zero-friction integration**: `npx @open-helplines/mcp` — no API key, no account
- **Supply-chain security**: SHA-pinned Actions, OIDC provenance on npm/PyPI, Gitleaks secret scanning

---

## Who Uses It

- **AI developers** integrating crisis support into chatbots and assistants
- **Mental health NGOs and clinicians** needing a free, accurate, machine-readable directory
- **Researchers** studying global crisis support availability
- **Governments and WHO affiliates** seeking open interoperability

---

## Quotes / Messaging

> *"Crisis moments deserve open data—no paywalls, no gatekeepers, no vendor lock-in."*

> *"One npm install. Every verified crisis line. Everywhere."*

> *"Built in the open, so every person on earth can find help in their language."*

---

## Contact & Links

| | |
|--|--|
| **GitHub** | https://github.com/Kouki-odaka/open-helplines |
| **Discussions** | https://github.com/Kouki-odaka/open-helplines/discussions |
| **Security** | See `SECURITY.md` — private GitHub Advisory reporting |
| **Press enquiries** | Open a GitHub Discussion (category: General) |

---

## Media Usage

All assets in `docs/press-kit/` are released under **CC0 1.0** unless otherwise noted.  
You may use the logo, descriptions, and screenshots without attribution (though a link back is appreciated).
