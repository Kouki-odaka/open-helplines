# GitHub Discussions — Pinned Thread Drafts

> Closes: Issue #37  
> Author: Koki Odaka (Kouki-odaka)  
> Last updated: 2026-06-04  
> Usage: Copy each section below into a new GitHub Discussion. Pin the 5 threads in the order listed.

---

## How to pin a Discussion

1. Open the [Discussions tab](https://github.com/Kouki-odaka/open-helplines/discussions) → **New discussion**
2. Choose the appropriate category (see each thread header below)
3. Paste the title + body
4. After posting: click ⋯ → **Pin discussion**

---

## Thread 1 — Welcome

**Category:** `Announcements` (or `General`)  
**Title:** `👋 Welcome to open-helplines — start here`  
**Pin order:** 1 (top)

---

### Body

Welcome to the **open-helplines** community! 👋

I'm Koki, the creator and maintainer. This space is for questions, ideas, data contributions, and conversations about what you're building with this project.

---

#### What is open-helplines?

**open-helplines** is an open-source registry of verified support-line contact records worldwide. The data is **CC0 public domain** (free to use, commercially or otherwise, no attribution required), and the code ships as an MCP server so AI assistants can surface accurate, verified contact information instead of generating plausible-but-wrong numbers.

Three entry points:

| Use case | Tool |
|----------|------|
| Add to Claude / any MCP host | `npx @open-helplines/mcp` |
| Use in Node.js / TypeScript | `npm install @open-helplines/core` |
| Use in Python | `pip install open-helplines` |

Full details: [README](https://github.com/Kouki-odaka/open-helplines/blob/main/README.md)

---

#### Community guidelines

This community follows the [Contributor Covenant v2.1](https://github.com/Kouki-odaka/open-helplines/blob/main/CODE_OF_CONDUCT.md). The short version: be kind, be constructive, and focus on the project.

Please report any conduct concerns to the email in `CODE_OF_CONDUCT.md`.

---

#### How to get involved

| I want to… | Where to go |
|------------|-------------|
| Fix incorrect data | Open a PR: `data/countries/{cc}/helplines.json` |
| Request a new country | Open an Issue |
| Discuss a schema change | Start a Discussion here first |
| Report a bug in the MCP | Open an Issue with `bug` label |
| Show what you built | **Reply to the "What did you build?" thread** (pinned) |
| Review data quality | **Reply to the "Help us verify data" thread** (pinned) |

We follow a [CONTRIBUTING guide](https://github.com/Kouki-odaka/open-helplines/blob/main/CONTRIBUTING.md) — all skill levels welcome.

Looking forward to building this together. — Koki

---

## Thread 2 — Use Cases Showcase

**Category:** `Show and Tell`  
**Title:** `💬 What did you build with open-helplines?`  
**Pin order:** 2

---

### Body

Whether it's a Claude Desktop integration, a web app, a research dataset pull, or a simple script that routes users to the right contact — **I want to see what you built.**

Reply with:

- **What you built** (one sentence)
- **How you use the data or MCP** (e.g. "call `find_helplines()` inside a Claude tool")
- **Link** (optional — repo, demo, screenshot, anything)
- **Country / language focus** (if applicable)

---

### Starter examples

> *"I integrated open-helplines into a Claude Desktop workflow so my mental-health-focused Slack bot can respond with verified local contacts instead of generic web searches."*

> *"I pulled the CC0 dataset into a university research project comparing global support-line coverage by population."*

> *"Built a simple CLI tool that wraps `@open-helplines/core` to look up contacts from the terminal."*

No project is too small. If you found any edge cases or gaps in the data while building, please mention them — that feedback directly improves coverage for everyone.

---

## Thread 3 — Data Verification

**Category:** `Ideas` or `General`  
**Title:** `🔍 Help us verify data — report outdated or missing records`  
**Pin order:** 3

---

### Body

The quality of this registry depends on the community. Phone numbers change. Organisations restructure. New services launch. **You can help keep the data accurate.**

---

#### What to check

Each record in `data/countries/{cc}/helplines.json` has:

```
name        — organisation name
phone       — primary phone number(s)
url         — website URL
hours       — operating hours (or "24/7")
languages   — languages supported
verified_at — date of last manual verification
```

A record may be outdated if:
- The phone number rings to the wrong service or goes unanswered
- The website URL is dead or redirects elsewhere
- Operating hours listed no longer match reality
- A service has been discontinued entirely

---

#### How to report

**Option A — Quick report (no GitHub account needed):**  
Reply to this thread with:
```
Country: [ISO code, e.g. JP]
Organisation: [name]
Problem: [what's wrong]
Source: [how you know — e.g. called the number, checked the website]
```

**Option B — Direct PR:**  
Edit `data/countries/{cc}/helplines.json` and open a pull request.  
See [CONTRIBUTING.md](https://github.com/Kouki-odaka/open-helplines/blob/main/CONTRIBUTING.md) for the schema.

**Option C — Open an Issue:**  
[File a data issue](https://github.com/Kouki-odaka/open-helplines/issues/new) with label `data-quality`.

All contributions are attributed in the commit history. Thank you.

---

## Thread 4 — Domain Professional Feedback

**Category:** `Ideas` or `General`  
**Title:** `🤝 Domain professionals: your feedback matters — review our data schema and coverage`  
**Pin order:** 4

---

### Body

open-helplines is primarily built by software engineers. The data quality improves significantly when people with direct operational knowledge in community services, social care, public health, or related fields review it.

If you work in — or closely with — **organisations that operate or refer to support lines**, this thread is for you.

---

#### What we're asking for

1. **Data accuracy review** — does the information in your country's records match what you know on the ground?
2. **Schema feedback** — are there fields missing that matter to practitioners? (e.g. service type, referral pathway, specific populations served)
3. **Coverage gaps** — are there well-known services in your region that are not yet listed?
4. **Terminology** — does the way we describe services align with how practitioners refer to them?

---

#### How to share feedback

You don't need to know how to use GitHub to contribute here:

- **Reply to this thread** with your observations — we'll handle the technical update
- **Email** (see maintainer contact in the README) if you prefer a private conversation
- **Open an Issue** if you've identified a specific data error

Your expertise is genuinely valuable. Data errors in a registry like this have real-world consequences — your review helps prevent them.

---

#### Non-disclosure / privacy note

Please don't share personal contact information in this public thread. If you're representing an organisation and would like to be credited for a data correction, let us know in your message and we'll add an acknowledgement in the commit notes.

---

## Thread 5 — Roadmap & Priorities

**Category:** `Ideas` or `Announcements`  
**Title:** `🗺️ Roadmap & priorities — what's coming next`  
**Pin order:** 5

---

### Body

Here's where we're headed. This thread is updated as milestones are reached.

---

### Current status (Week 0 — 2026-06-04)

| Area | Status |
|------|--------|
| Core MCP server (`@open-helplines/mcp`) | ✅ Released v0.2.0 |
| npm library (`@open-helplines/core`) | ✅ Released v0.1.0 |
| Python library (`open-helplines`) | ✅ Released |
| Countries covered | ✅ 24+ |
| Visualization site | ✅ Live at [kouki-odaka.github.io/open-helplines](https://kouki-odaka.github.io/open-helplines/en/) |
| Emergency-first resolver | ✅ Shipped |
| MCP safety guardrails | ✅ Shipped |
| i18n (EN / JA) | ✅ Shipped |
| Donation page | ✅ Live |

---

### Near-term (Weeks 1–4)

- [ ] **Anthropic MCP registry submission** — formal submission to `modelcontextprotocol/registry`
- [ ] **Hugging Face dataset publish** — CC0 data available at `hf.co/datasets/open-helplines/registry`
- [ ] **awesome-* listings** — PRs to top-5 curated lists
- [ ] **Community data review** — first round of community-verified updates
- [ ] **Expanded country coverage** — PRs from community contributors

---

### Medium-term (Month 2–3)

- [ ] Per-country completeness scores
- [ ] Automated freshness checks (CI pings contact URLs weekly)
- [ ] Structured multilingual descriptions per record
- [ ] REST API layer (lightweight, read-only, hosted)
- [ ] Integration examples: LangChain, LlamaIndex, OpenAI function calling

---

### How to influence the roadmap

- 👍 React to this post to signal which items matter most to you
- 💬 Reply to this thread with a feature request
- 🔗 Link to a use case that would be unlocked by a specific feature

All feedback shapes prioritisation. The maintainer reads every reply.

---

*Last updated: 2026-06-04 by Koki Odaka*
