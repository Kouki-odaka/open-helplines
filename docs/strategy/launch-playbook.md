# Launch Playbook — open-helplines

> Version 1.0 · 2026-06-02  
> Covers: Week 0 (Preparation) → Week 1 (Stealth) → Week 2 (Soft Launch) → Week 3 (Amplification) → Week 4+ (Sustained)

---

## Week 0 — Preparation (Days −14 to −1)

**Goal**: All assets ready before any public announcement. No half-baked README on launch day.

### Actions

| # | Action | Owner | Output | KPI |
|---|--------|-------|--------|-----|
| 0-1 | **README international polish** | Maintainer | README.md + README.ja.md reviewed, all links working, demo section prominent | — |
| 0-2 | **README badge additions** | Maintainer | Star History, contributor count, countries covered, MCP badge, OpenSSF Scorecard added | — |
| 0-3 | **Demo video / GIF** | Maintainer | 60-second screen recording: Claude Desktop → "find crisis lines in Japan" → MCP returns verified data | Uploaded to GitHub README + YouTube |
| 0-4 | **Press kit** | BA / Maintainer | `docs/press-kit/` with: logo (SVG), product description (100 words EN/JA), key facts sheet, screenshot gallery | — |
| 0-5 | **Anthropic MCP registry PR** | Maintainer | PR opened to `modelcontextprotocol/servers` to add `@open-helplines/mcp` | PR URL recorded |
| 0-6 | **Hugging Face dataset listing** | Maintainer | Dataset card published at `hf.co/datasets/open-helplines/registry` | Dataset URL |
| 0-7 | **CODE_OF_CONDUCT + SECURITY + GOVERNANCE** | Maintainer | Files committed to main | Linked from README |
| 0-8 | **FUNDING.yml** | Maintainer | GitHub Sponsors + Open Collective linked | Visible on repo sidebar |
| 0-9 | **GitHub Discussions setup** | Maintainer | 5 pinned discussion threads created (see strategy doc §4.2) | — |
| 0-10 | **awesome-* PRs (Top 5)** | Maintainer | PRs opened: awesome-mcp-servers, awesome-mental-health, awesome-public-datasets, awesome-opendata, awesome-cc0 | 5 PRs opened |
| 0-11 | **Product Hunt hunter outreach** | Maintainer | 1 PH influencer (1,000+ followers) confirmed to hunt on Week 2 Thursday | Confirmed DM |
| 0-12 | **Stealth reviewer list** | Maintainer | List of 8–12 trusted peers (developers + one mental health professional) who will Star + comment on Day 1 | List ready |

### KPI Gate (must pass before Week 1)
- [ ] README.md loads in < 3 seconds (no broken images)
- [ ] `npx @open-helplines/mcp` works end-to-end
- [ ] Demo video uploaded and embedded
- [ ] Press kit available at `docs/press-kit/`
- [ ] At least 3 awesome-* PRs submitted

---

## Week 1 — Stealth Launch (Days 1–7)

**Goal**: First real-world Stars, early feedback, and technical issues caught before public launch.

### Actions

| # | Action | Channel | Output | KPI |
|---|--------|---------|--------|-----|
| 1-1 | **Peer outreach — developers** | Direct message (Discord, email, X DM) | 5–8 trusted AI/LLM developers install, test, and Star | +10–20 Stars |
| 1-2 | **Peer outreach — mental health contact** | Email | 1–2 mental health professionals or NPO contacts review SAFETY.md and data accuracy | Feedback received |
| 1-3 | **GitHub Discussions: Welcome post** | GitHub | Pinned welcome thread opened with personal story from maintainer | 0 → 1 thread active |
| 1-4 | **Hacker News Ask HN (warm-up)** | HN | Comment in relevant threads (MCP, mental health AI, crisis support) with helpful info + link | No self-promotion; just helpfulness |
| 1-5 | **X/Twitter: Teaser thread** | X | 3-tweet thread: "I've been quietly building something…" personal origin story. No CTA to Star yet. | 500–2,000 impressions |
| 1-6 | **Bluesky: Same content** | Bluesky | Cross-post the teaser thread | — |
| 1-7 | **Fix any issues found by peers** | GitHub | Issues closed, bugs fixed, CONTRIBUTING.md updated based on feedback | — |
| 1-8 | **Anthropic MCP PR follow-up** | GitHub | If not yet merged, ping reviewer politely | PR status updated |

### KPI Gate (end of Week 1)
- [ ] 15+ Stars
- [ ] 0 broken links in README
- [ ] At least 1 piece of feedback from mental health domain
- [ ] `npx @open-helplines/mcp` tested by at least 3 external people

---

## Week 2 — Soft Launch (Days 8–14)

**Goal**: First major public wave. Developer audience. Target: 100–200 Stars by end of week.

### Actions

| # | Day | Action | Channel | Output | KPI |
|---|-----|--------|---------|--------|-----|
| 2-1 | Mon | **Show HN post published** | Hacker News | `Show HN: open-helplines – CC0 registry of crisis lines with MCP server` | Front-page attempt; 50–500 Stars |
| 2-2 | Mon | **Comment engagement on HN** | HN | Respond to every comment within 2 hours for first 6 hours | Thread stays active |
| 2-3 | Mon | **X/Twitter announcement thread** | X | 6-tweet thread with demo GIF: origin story → problem → solution → code snippet → demo → CTA Star | 2,000–10,000 impressions |
| 2-4 | Mon | **LinkedIn post** | LinkedIn | 500-word personal post: "Why I built this for free" | 500–3,000 reach |
| 2-5 | Tue | **Bluesky + Mastodon** | Bluesky / fosstodon | Cross-post Monday content | — |
| 2-6 | Tue | **TLDR submission** | tldr.tech/submit | Submit project for "Cool Project" feature | Potential 750k impressions |
| 2-7 | Wed | **Dev.to article published** | Dev.to | "How I designed an MCP server for safety-critical data" — technical deep dive | 1,000–5,000 reads; 20–50 Stars |
| 2-8 | Thu | **Product Hunt launch** | Product Hunt | Full PH listing goes live (hunted by confirmed influencer) | 100–300 upvotes; 30–100 Stars |
| 2-9 | Thu | **Reddit /r/MachineLearning** | Reddit | Post: "CC0 worldwide crisis line dataset + MCP server — for LLMs that encounter users in distress" | 30–100 Stars |
| 2-10 | Fri | **Zenn article (Japanese)** | Zenn | 「MCPサーバーでClaudeから世界のメンタルヘルス窓口を検索する」 | 30–100 Stars (JA audience) |
| 2-11 | Fri | **awesome-* PRs (remaining 5)** | GitHub | PRs for: awesome-llm-tools, awesome-healthcare, awesome-ai-safety, awesome-claude, awesome-crisis-tech | 5 more PRs opened |

### KPI Gate (end of Week 2)
- [ ] 100+ Stars
- [ ] Show HN reached top 30
- [ ] 2+ awesome-* PRs merged
- [ ] npm downloads > 500/week
- [ ] At least 1 external blog or social share from community (organic)

---

## Week 3 — Amplification (Days 15–21)

**Goal**: Extend reach beyond developer audience. NPO first contact. Media pitches. Target: 300+ Stars.

### Actions

| # | Day | Action | Channel | Output | KPI |
|---|-----|--------|---------|--------|-----|
| 3-1 | Mon | **Reddit /r/mentalhealth** | Reddit | Non-promotional post: "We're building an open database of crisis lines — is your country's line accurate?" | Community engagement; 20–60 Stars |
| 3-2 | Mon | **Reddit /r/datasets** | Reddit | Data angle post | 20–50 Stars |
| 3-3 | Mon | **Reddit /r/LocalLLaMA** | Reddit | Local AI + no API key angle | 30–70 Stars |
| 3-4 | Tue | **NPO outreach — Batch 1** | Email | Personalised emails to 5 NPOs (NAMI, Mind UK, Samaritans, Lifeline AU, 日本いのちの電話) | 5 emails sent; 2+ replies expected |
| 3-5 | Tue | **Newsletter pitches — Batch 1** | Email | Pitch to TLDR (if not featured), Pointer, Console.dev, Hacker Newsletter | 4 pitches sent |
| 3-6 | Wed | **note article (Japanese)** | note | 非エンジニア向け記事「AIが間違った電話番号を教えないために」 | 20–60 Stars (JA non-dev audience) |
| 3-7 | Wed | **Podcast outreach** | Email | Pitch to "Practical AI" and "Software Engineering Daily" | 2 pitches sent |
| 3-8 | Thu | **X/Twitter: data spotlight thread** | X | "Did you know? Here are the 5 countries with the most crisis lines in our dataset" — data storytelling | 1,000–5,000 impressions |
| 3-9 | Thu | **Hugging Face community post** | Hugging Face | Community post announcing dataset | 500–2,000 views |
| 3-10 | Fri | **GitHub Discussions: Use case showcase** | GitHub | Invite early users to share what they built; share one example yourself | 3+ discussion replies |
| 3-11 | Fri | **Qiita article (Japanese)** | Qiita | JSON Schema Draft 2020-12 design article (technical) | 20–60 Stars |

### KPI Gate (end of Week 3)
- [ ] 300+ Stars
- [ ] 2+ NPO replies received
- [ ] 1+ newsletter feature confirmed
- [ ] 10+ GitHub Discussions posts
- [ ] 3+ external contributors

---

## Week 4 — Transition to Sustained Growth (Days 22–28)

**Goal**: Establish rhythm for ongoing community activity. Synthesise learnings. Plan Month 2.

### Actions

| # | Action | Output |
|---|--------|--------|
| 4-1 | **Retrospective**: What worked? Star sources analysis via GitHub traffic | Insights documented |
| 4-2 | **NPO follow-up emails** | 2nd contact to non-responders from Week 3 |
| 4-3 | **First community release blog** | Feature post: "What's been added since launch" — new countries, corrections, MCP updates |
| 4-4 | **Community Discord/Slack setup** | Create `open-helplines` server on Discord; link from README |
| 4-5 | **Academic outreach — Batch 1** | 3 university mental health research labs contacted |
| 4-6 | **WHO / IASP submission** | Formal dataset submission package prepared and sent |
| 4-7 | **Anthropic MCP showcase application** | Apply for official showcase listing (if not already merged) |
| 4-8 | **KPI review and Month 2 plan** | Adjust strategy based on Week 2–3 data |

### KPI Gate (end of Week 4)
- [ ] 500+ Stars
- [ ] Discord/Slack community live
- [ ] 1+ NPO partnership confirmed (formal or informal)
- [ ] 10+ contributors (data or code)
- [ ] npm > 2,000 downloads/week

---

## Month 2–6 — Sustained Growth

**Goal**: Compound community, data, and media flywheel. Target: 2,000 Stars by Month 6.

### Monthly Rhythm

| Cadence | Action |
|---------|--------|
| **Monthly** | Release blog post (new countries, corrections, community highlights) |
| **Monthly** | X/Twitter data spotlight thread |
| **Monthly** | NPO outreach batch (5 new orgs) |
| **Monthly** | "What did you build?" showcase post in GitHub Discussions |
| **Bi-monthly** | Zenn or note article (Japanese rotation) |
| **Quarterly** | Podcast appearance (target 1 per quarter) |
| **Quarterly** | Conference presentation proposal (IASP, AFSP, IMHCN, HIMSS) |
| **Ongoing** | Respond to all GitHub issues + Discussions within 48 hours |
| **Ongoing** | Review and merge data PRs weekly |

### Month 2 Priority Actions
1. **Python package promotion on PyPI** — dedicated blog post for data science community
2. **Hugging Face Spaces demo** — interactive globe + search (integrates with packages/web)
3. **OpenAI GPT Actions** — register as a GPT action in the GPT Store
4. **Japanese media article** — ITmedia or Aera pitch confirmed

### Month 3 Priority Actions
1. **First academic citation** — outreach to 10 research labs; at least 1 paper citing the dataset
2. **WHO formal response** — follow up on Month 1 submission
3. **GitHub Sponsors milestone** — first 10 sponsors; sponsor wall in README

### Month 6 Review
- Assess Star count vs 2,000 target
- Identify top 3 driver channels for next 6-month plan
- Evaluate governance model (solo maintainer → community governance)

---

## Appendix A: Weekly Social Content Templates

### X/Twitter Thread Template — Data Spotlight
```
🌍 [EMOJI] Country Spotlight: [COUNTRY]

Did you know [COUNTRY] has [N] mental health crisis lines covering [categories]?

Most people don't. And when an AI assistant gets asked for help, it often gets the numbers wrong.

That's why we built @open_helplines 🧵

[Tweet 2]: The problem with existing directories is [problem].
[Tweet 3]: Our solution: CC0 data, JSON Schema, MCP server — free forever, no API key.
[Tweet 4]: Here's how to use it in Claude Desktop in 2 minutes: [demo link]
[Tweet 5]: ⭐ Star the project if you work on AI that might encounter users in crisis.
```

### LinkedIn Post Template
```
I built [PROJECT] for a reason most tech founders don't talk about openly.

[Personal story — 2 sentences]

The problem: [Problem statement]

The solution: [Brief description]

What makes it different:
• CC0 licensed — free to use, no attribution required
• JSON Schema validated — no hallucinated phone numbers
• MCP compatible — works directly in Claude Desktop

If you work at an AI company, a mental health organisation, or a university, I'd love to connect.

[GitHub URL]
```

---

## Appendix B: Press Kit Checklist

Location: `docs/press-kit/`

- [ ] `logo.svg` — project logo (if available)
- [ ] `product-description-en.md` — 50-word and 200-word versions
- [ ] `product-description-ja.md` — 50字・200字バージョン
- [ ] `key-facts.md` — countries covered, records count, license, launch date, maintainer name
- [ ] `screenshots/` — 3+ screenshots (Globe view, Claude Desktop MCP demo, code snippet)
- [ ] `demo-video-url.txt` — link to hosted demo video
- [ ] `contact.md` — press contact email
