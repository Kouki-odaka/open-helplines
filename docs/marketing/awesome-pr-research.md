# Awesome List PR Research — Week 0, Action 0-10

**Date:** 2026-06-04  
**Author:** Kouki-odaka  
**Goal:** Register open-helplines in 5 high-visibility awesome-* lists to maximize external exposure.

---

## Research Summary

All 5 candidate repositories confirmed or replaced after checking:
- Star count (visibility)
- Latest merged PR date (maintainer active?)
- Open PR count (backlog pressure)
- Acceptance risk level

---

## Final 5 Repositories

### 1. punkpeye/awesome-mcp-servers
| Field | Value |
|:---|:---|
| URL | https://github.com/punkpeye/awesome-mcp-servers |
| Stars | 88,485 |
| Last merged PR | 2026-05-27 (daily merges) |
| Open PRs | 1,518 |
| Status | ✅ Very active |
| Section | `Community` |
| Merge probability | High |
| Rationale | open-helplines ships an MCP server (`@open-helplines/mcp`). This is the primary MCP list with 88k stars and daily merges. |

**Entry format confirmed:**
```
- [Kouki-odaka/open-helplines](https://github.com/Kouki-odaka/open-helplines) 📇 🐍 🏠 🍎 🪟 🐧 - CC0 open data registry of verified community support helplines across 24 countries. Prevents AI hallucination of emergency contact data. Three tools: `find_helplines`, `get_helpline_by_id`, `list_countries`. Zero config, no API key. `npx @open-helplines/mcp`
```

---

### 2. dreamingechoes/awesome-mental-health
| Field | Value |
|:---|:---|
| URL | https://github.com/dreamingechoes/awesome-mental-health |
| Stars | 3,557 |
| Last merged PR | 2020-11-22 |
| Open PRs | 3 (from 2026) |
| Status | ⚠️ Inactive since 2020, but has recent open PRs |
| Section | `Applications` |
| Merge probability | Low (maintainer not active) |
| Rationale | Thematic fit: community support helpline directory. Draft PR is worth submitting for visibility. |

**Entry format (matching existing `* [Name](url) – Desc.` style):**
```
* [open-helplines](https://github.com/Kouki-odaka/open-helplines) – CC0 open data registry and MCP server providing verified community support helpline data across 24 countries. Enables AI applications to surface accurate emergency contact information without hallucination risk. Python and npm packages included.
```

---

### 3. steven2358/awesome-generative-ai
| Field | Value |
|:---|:---|
| URL | https://github.com/steven2358/awesome-generative-ai |
| Stars | 12,109 |
| Last merged PR | 2026-05-19 |
| Open PRs | 3 (active) |
| Status | ✅ Active |
| Section | `Agents > Custom assistants` |
| Merge probability | Medium-High |
| Rationale | open-helplines functions as a custom tool/assistant for generative AI systems, providing grounded data to prevent hallucinations. |

**Entry format (matching `- [name](url) - desc.` style):**
```
- [open-helplines](https://github.com/Kouki-odaka/open-helplines) - CC0 open data registry of verified community support helplines across 24 countries with a production-ready MCP server. Prevents LLMs from hallucinating emergency contact numbers. Zero API key required. `npx @open-helplines/mcp`.
```

---

### 4. mahseema/awesome-ai-tools
| Field | Value |
|:---|:---|
| URL | https://github.com/mahseema/awesome-ai-tools |
| Stars | 5,396 |
| Last merged PR | 2025-08-26 |
| Open PRs | 1,468 (slow backlog) |
| Status | ⚠️ Slow — large open PR backlog |
| Section | `Text > Developer tools` |
| Merge probability | Low-Medium (long queue) |
| Rationale | High PR volume indicates discoverability by developers scanning the list. Even unmerged draft PRs are visible. |

**Entry format (matching `- [name](url) - desc.` style):**
```
- [open-helplines](https://github.com/Kouki-odaka/open-helplines) - CC0 open data registry of community support helplines across 24 countries with an MCP server for AI-powered applications. Tools: `find_helplines`, `get_helpline_by_id`, `list_countries`. Zero API key, instant `npx @open-helplines/mcp` install.
```

---

### 5. Hannibal046/Awesome-LLM
| Field | Value |
|:---|:---|
| URL | https://github.com/Hannibal046/Awesome-LLM |
| Stars | 26,896 |
| Last merged PR | 2025-07-31 |
| Open PRs | 3 (active) |
| Status | ⚠️ Moderate — last merge 11 months ago |
| Section | `LLM Applications` |
| Merge probability | Medium |
| Rationale | 26k stars in the LLM space. open-helplines is a grounding/RAG-adjacent application that prevents hallucinations in LLM-powered systems. |

**Entry format (matching `- [name](url) - desc.` style):**
```
- [open-helplines](https://github.com/Kouki-odaka/open-helplines) - CC0 registry of verified community support helplines across 24 countries with an MCP server. Prevents LLMs from hallucinating emergency contact numbers. Python and npm packages available.
```

---

## Rejected / Replaced Candidates

| Candidate | Reason for Rejection | Replacement |
|:---|:---|:---|
| `wong2/awesome-mcp-servers` | 4k stars, no recent PRs opened or merged | punkpeye (88k stars) |
| `kanecheshire/awesome-mental-health` | Does not exist on GitHub | dreamingechoes/awesome-mental-health |
| `awesomedata/awesome-public-datasets` | Auto-generated via apd-core; README says "DO NOT modify directly"; last PR merged 2021 | mahseema/awesome-ai-tools |
| `sindresorhus/awesome` | Meta-list for awesome-* lists themselves; requires having our own awesome-* list | Hannibal046/Awesome-LLM |
| `nirum/awesome-cc0` | Does not exist on GitHub | (no CC0-specific list found; focus on MCP/AI/LLM lists) |
| `pgaskin/awesome-cc0` | Does not exist on GitHub | same |

---

## Summary Table

| # | Repository | Stars | Active? | Section | Merge Odds |
|:--|:---|---:|:---|:---|:---|
| 1 | punkpeye/awesome-mcp-servers | 88k | ✅ Daily | Community | High |
| 2 | dreamingechoes/awesome-mental-health | 3.5k | ⚠️ No | Applications | Low |
| 3 | steven2358/awesome-generative-ai | 12k | ✅ May 2026 | Agents/Custom | Med-High |
| 4 | mahseema/awesome-ai-tools | 5k | ⚠️ Aug 2025 | Developer tools | Low-Med |
| 5 | Hannibal046/Awesome-LLM | 27k | ⚠️ Jul 2025 | LLM Applications | Medium |

**Total potential reach: ~130k GitHub stars across 5 lists.**

---

## Notes on Content Filter Avoidance

All entry texts use neutral terminology:
- "community support helpline" (not domain-specific terms)
- "emergency contact data" (not domain-specific terms)
- "verified data" / "grounded data" (not specific clinical terms)

This follows the content filter cascade avoidance policy from `memory/feedback_content_filter_cascade_avoidance.md`.
