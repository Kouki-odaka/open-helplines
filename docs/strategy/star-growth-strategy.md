# Star & Community Growth Strategy — open-helplines

> Version 1.0 · 2026-06-02  
> Author: Business Analyst (ba-growth)

---

## Executive Summary

**Problem**: Mental health stakeholders (the people who care most about this project) have low GitHub usage rates. Conventional OSS release tactics (Show HN, /r/opensource) reach developers but miss 80% of the target audience.

**Solution**: A dual-track strategy:
1. **Developer track** — fast-convert GitHub-native AI/LLM builders via HN, X, MCP showcases
2. **Mission track** — reach mental health NPOs, clinicians, researchers, and advocates off-GitHub, then bridge them to Star

**Target**: 500 Stars by end of Week 4; 2,000+ Stars by Month 6.

---

## 1. Audience Analysis

See [`audience-personas.md`](audience-personas.md) for full persona sheets.

### Primary Audiences (5–7)

| # | Audience | Platform Habitat | Core Motivation | Star Pathway |
|---|----------|-----------------|-----------------|--------------|
| A | **LLM / AI Developer** | HN, X, Bluesky, GitHub, Discord | Verified crisis data, MCP integration, anti-hallucination | npm install → Star |
| B | **Mental Health NPO Director** | LinkedIn, email, conferences | Ensure accurate data for their org | Email outreach → "my org is here" → Star |
| C | **Academic Researcher** | ResearchGate, arXiv, Twitter | CC0 citable dataset for studies | Paper citation → Star |
| D | **Crisis Counsellor / Clinician** | Reddit, Instagram, clinical Slack | Report wrong numbers, ensure accuracy | Reddit thread → Star |
| E | **Tech Journalist / Newsletter** | X, LinkedIn, HN readers | Social impact + AI safety story | Press kit → article → Star spike |
| F | **Japanese Tech Community** | Zenn, note, Qiita, Twitter/X ja | Bilingual docs, Japanese data | Zenn article → Star |
| G | **Policy Maker / WHO** | LinkedIn, government channels | Reference dataset for policy | Conference → long-term Star |

---

## 2. Channel Strategy

### 2.1 Social Networks

#### X / Twitter
- **Approach**: Thread format (5–8 tweets) telling the origin story: "I built this because [crisis app] gave me the wrong number." Real, emotional hook.
- **Content cadence**: 2–3 posts/week. Mix: product updates, data curiosity posts ("Did you know Japan has 14 different crisis lines?"), retweets of mental health advocates.
- **Hashtags**: `#MentalHealth #OpenSource #MCP #AIForGood #CrisisSupport #OpenData`
- **Estimated reach**: 5,000–15,000 impressions per thread; 50–200 profile visits → 10–30 Stars per post
- **ROI**: High for developer audience, Medium for mental health audience

#### Bluesky
- **Approach**: Starter pack creation: "Mental Health + AI Safety builders." Cross-post X content with Bluesky-native threading.
- **Estimated reach**: Smaller but high signal-to-noise; growing AI/ML community
- **ROI**: Medium, rising over 2026

#### LinkedIn
- **Approach**: Long-form posts (500–800 words) targeting NPO directors and policy makers. "Why crisis hotline data should be free." Professional, mission-driven tone.
- **Content**: 1 post/week during launch; monthly sustained.
- **Estimated reach**: 1,000–5,000 per post (depending on network); NPO/policy audience
- **ROI**: Low for Stars directly; High for partnership conversion (NPO outreach)

#### Instagram / TikTok / Threads
- **Approach**: Infographics and short-form videos. "How to find a crisis line in any country" tutorial. Data visualisation clips (globe from web package).
- **Estimated reach**: 500–2,000 per post; mostly mental health community
- **ROI**: Low for GitHub Stars directly; High for brand awareness with non-developer audience

#### Mastodon (infosec.exchange, mastodon.social, fosstodon.org)
- **Approach**: Privacy-angle posts. "Crisis data that never requires an API key or account."
- **Estimated reach**: Niche but trusted; 100–500 per post
- **ROI**: Low reach, High credibility signal for FOSS community

#### Japanese: Twitter/X (ja), Instagram (ja)
- **Approach**: Separate Japanese-language thread. "日本いのちの電話をはじめ、世界の危機相談窓口を1つのデータセットに。"
- **Estimated reach**: 2,000–8,000; tight-knit Japanese health-tech Twitter community
- **ROI**: High for Japanese Star conversion

---

### 2.2 Developer Communities

#### Hacker News — "Show HN"
- **Timing**: Week 2, Tuesday or Wednesday 9–10am ET (peak HN time)
- **Title**: `Show HN: open-helplines – CC0 registry of crisis lines worldwide, with MCP server`
- **Comment seeding**: Prepare 3–5 technical discussion starters (MCP design, schema decisions, CC0 rationale, safety constraints in ADR-004)
- **Estimated impact**: 50–500 Stars within 48 hours (if top-10 on front page)
- **ROI**: Very High; single highest-leverage action for developer audience

#### Product Hunt
- **Timing**: Week 2, same week as HN but different day (Thursday)
- **Category**: "Developer Tools" + "Open Source" + "Social Impact"
- **Hunter**: Find a Product Hunt influencer (1000+ followers) to hunt the project
- **Estimated impact**: 100–300 upvotes; 30–100 Stars
- **ROI**: High for visibility, Medium for Stars (PH audience less GitHub-aligned than HN)

#### Reddit

| Subreddit | Approach | Est. Stars |
|-----------|----------|------------|
| /r/MachineLearning | "We built an MCP-native crisis line dataset so LLMs stop hallucinating phone numbers" | 50–150 |
| /r/datasets | "CC0 worldwide mental health crisis lines dataset with JSON Schema + MCP" | 30–80 |
| /r/mentalhealth | "An open database of crisis lines — help us add/correct data for your country" | 20–60 |
| /r/opensource | Standard OSS announcement | 20–50 |
| /r/LocalLLaMA | "No API key crisis data for your local AI assistant" | 30–80 |
| /r/Anthropic | MCP showcase | 20–50 |

- **Timing**: Week 3 (after HN momentum)
- **Rules**: Read each subreddit's rules; /r/mentalhealth requires non-promotional framing
- **ROI**: Medium; Reddit can drive meaningful Stars but requires authentic engagement

#### Dev.to, Lobsters
- **Approach**: Technical blog post ("How we designed an MCP server for safety-critical data") cross-posted to Dev.to and Lobsters.
- **Estimated reach**: 1,000–5,000 reads; 20–60 Stars
- **ROI**: Medium; builds long-tail organic traffic

---

### 2.3 Media & Newsletters

#### Priority Tier 1 (highest reach × relevance)

| Channel | Approach | Est. Stars |
|---------|----------|------------|
| **TLDR Newsletter** (tldr.tech) | Submit to "cool projects" section; 750k subscribers | 100–400 |
| **The Pragmatic Engineer** | Pitch "OSS + AI safety" angle; niche but high engagement | 50–200 |
| **Pointer** (pointer.io) | Submit as developer reading | 30–100 |
| **Console.dev** | Open source project listing | 30–80 |
| **Hacker Newsletter** | Aggregates HN; submit post from Show HN | 50–150 |

#### Priority Tier 2 (mission alignment)

| Channel | Approach |
|---------|----------|
| **AI Tools Newsletter** | MCP integration angle |
| **Mental Health Tech Newsletter** | Mission angle; crisis data accuracy |
| **Global Mental Health Action newsletter** | NPO/policy audience |
| **TechCrunch / Wired** | Pitch "crisis AI safety" investigative angle; lower probability but enormous reach |

#### Japanese Media

| Channel | Approach |
|---------|----------|
| **ITmedia** | 「AIが誤った電話番号を教えないために」記事 pitch |
| **Yahoo!JAPAN Tech** | OSS紹介記事 |
| **Aera / 朝日新聞デジタル** | メンタルヘルス×AI特集 pitch |

---

### 2.4 Podcasts & Video

| Channel | Format | Approach |
|---------|--------|----------|
| **Software Engineering Daily** | Guest interview | "Safety constraints in life-critical OSS" |
| **Practical AI (Changelog)** | Guest interview | MCP + mental health data |
| **Mental Health Innovation Network Podcast** | Guest | Mission + data accuracy story |
| **YouTube: Fireship** | Short video | "I built a crisis line MCP server" — 60-second demo format |
| **YouTube: Theo (t3.gg)** | Reaction/review | OSS quality + TypeScript design |
| **日本語 Podcast: Turing Complete FM** | Guest | オープンデータ × メンタルヘルス |

---

### 2.5 Japanese-Specific Channels

| Channel | Approach | Est. Stars |
|---------|----------|------------|
| **Zenn** | 技術記事「MCPサーバーでClaudeから世界のメンタルヘルス窓口を検索する」 | 30–100 |
| **note** | 非エンジニア向け「AIが誤った危機相談番号を教えないために作ったもの」 | 20–60 |
| **Qiita** | JSON Schemaの設計記事 | 20–60 |
| **はてなブックマーク** | Zenn/note記事をブクマ拡散 | 10–40 |
| **Connpass** | AI×メンタルヘルス meetup でLT発表 | 10–30 |

---

## 3. Partnership Strategy

### 3.1 Mental Health NPOs

**Goal**: Data accuracy partnership + credibility endorsement + social amplification.

**Priority targets**:
| Organisation | Country | Approach |
|-------------|---------|----------|
| NAMI (National Alliance on Mental Illness) | US | Email their communications team; offer to list their lines, ask for a social shout-out |
| Mind UK | UK | Same approach; Mind has strong social following |
| Samaritans | UK/International | Offer verified listing; safety-focused story resonates |
| Lifeline Australia | Australia | Technical partnership; they're digitally sophisticated |
| 日本いのちの電話 | Japan | 日本語メールでデータ掲載と修正協力を依頼 |
| JAMHS | Japan | 学会経由でのデータ協力依頼 |
| Crisis Text Line | US | Tech-native NPO; MCP angle fits their digital-first approach |

**Outreach cadence**: Week 3 first contact; follow-up Week 5.  
**Templates**: See `outreach-templates/en/npo-outreach.md` and `outreach-templates/ja/npo-outreach.md`.

### 3.2 International Organisations

| Organisation | Approach |
|-------------|----------|
| **WHO Mental Health** | Formal dataset submission to WHO's mental health data programme |
| **UN Crisis Communications** | Offer as reference dataset for UN crisis response planning |
| **IASP (International Association for Suicide Prevention)** | Conference presentation; dataset listing on their resources page |
| **AFSP (American Foundation for Suicide Prevention)** | Technology partner programme |

**Timeline**: Month 2–3 (sustained phase). These require formal channels and move slowly.

### 3.3 AI / LLM Ecosystem

| Partner | Approach | Priority |
|---------|----------|----------|
| **Anthropic** | Submit to MCP Showcase / official MCP registry (`github.com/modelcontextprotocol/servers`). Already uses Claude in examples. | **Critical** — Week 1 |
| **OpenAI GPT Store** | Submit as a GPT action | High — Week 3 |
| **Hugging Face** | List dataset on HF Hub under `open-helplines` organisation; link from GitHub README | High — Week 2 |
| **Perplexity** | Reach out to their partnerships team for verified data integration | Medium — Month 2 |
| **LlamaIndex / LangChain** | Add to their MCP / tool integrations documentation | Medium — Month 2 |

**Highest-leverage action**: Getting listed in Anthropic's official MCP server registry will expose open-helplines to every Claude Desktop user and developer. This should be pursued in Week 1.

### 3.4 Educational Institutions

| Type | Approach |
|------|----------|
| Mental health research labs | Email department heads; offer dataset for studies; ask to cite in papers |
| Medical schools (psychiatry depts) | LinkedIn outreach to clinical informatics leads |
| Social work / social welfare faculties | Japan: 精神保健福祉士 training programmes |
| AI ethics courses | Request inclusion as a case study in responsible AI curriculum |

---

## 4. GitHub-Specific Tactics

### 4.1 README Enhancement

**Current badges** (already present):
- License (CC0 / Apache-2.0), npm, PyPI, CI

**Proposed additions**:
```markdown
[![Star History](https://api.star-history.com/svg?repos=Kouki-odaka/open-helplines&type=Date)](https://star-history.com/#Kouki-odaka/open-helplines)
[![GitHub Stars](https://img.shields.io/github/stars/Kouki-odaka/open-helplines?style=social)](https://github.com/Kouki-odaka/open-helplines/stargazers)
[![GitHub Contributors](https://img.shields.io/github/contributors/Kouki-odaka/open-helplines)](https://github.com/Kouki-odaka/open-helplines/graphs/contributors)
[![Countries Covered](https://img.shields.io/badge/countries-XX-brightgreen)](data/)
[![MCP Compatible](https://img.shields.io/badge/MCP-compatible-purple)](packages/mcp/)
[![Last Verified](https://img.shields.io/badge/last%20verified-2026--06-blue)](CHANGELOG.md)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/Kouki-odaka/open-helplines/badge)](https://securityscorecards.dev/viewer/?uri=github.com/Kouki-odaka/open-helplines)
```

### 4.2 GitHub Discussions Activation

Create pinned discussions:
1. **Welcome** — "What brought you here? Tell us your use case."
2. **Data gaps** — "Which countries or categories are missing?"
3. **Integration showcase** — "Show us what you built with open-helplines."
4. **Safety policy feedback** — "Questions about our responsible use guidelines."
5. **Schema RFC** — "Propose schema changes here before opening a PR."

### 4.3 Community Health Files

Files to create/improve:
| File | Action |
|------|--------|
| `CODE_OF_CONDUCT.md` | Add if not present; use Contributor Covenant 2.1 with mental health sensitivity addendum |
| `SECURITY.md` | Document responsible disclosure; note that data errors (wrong phone numbers) should be reported via private channel |
| `GOVERNANCE.md` | Define decision-making for data policy, schema changes, new country additions |
| `FUNDING.yml` | Link GitHub Sponsors + Open Collective (coordinates with Task #6) |

### 4.4 "awesome-*" List Registrations

Target lists for open-helplines submission:

| List | Reason |
|------|--------|
| `awesome-mcp-servers` | MCP package |
| `awesome-mental-health` | Core mission |
| `awesome-public-datasets` | CC0 structured dataset |
| `awesome-opendata` | Open data angle |
| `awesome-cc0` | CC0 license |
| `awesome-healthcare` | Health data |
| `awesome-crisis-tech` | If it exists; create if not |
| `awesome-llm-tools` | LLM integration angle |
| `awesome-claude` | Claude/Anthropic ecosystem |
| `awesome-ai-safety` | Safety-critical data |

**Action**: Submit PRs to top 5 lists in Week 2; remaining in Week 3.

### 4.5 GitHub Releases & Semantic Versioning

Semantic-release is already configured. To maximise community engagement:
- Add **release notes template** that highlights: new countries added, corrections applied, schema changes, MCP tool updates
- Pin latest release to GitHub repository
- Announce each release on X/Twitter and Zenn/note with "What's new" thread

---

## 5. KPIs & Metrics

### Primary Metrics
| Metric | Week 2 Target | Week 4 Target | Month 6 Target |
|--------|--------------|--------------|----------------|
| GitHub Stars | 100 | 500 | 2,000 |
| GitHub Forks | 20 | 80 | 300 |
| npm downloads (@open-helplines/core) | 500/week | 2,000/week | 10,000/week |
| PyPI downloads | 200/week | 800/week | 4,000/week |
| Contributors | 5 | 15 | 50 |
| Countries covered | current | +5 | +20 |
| GitHub Discussions threads | 5 | 20 | 80 |

### Secondary Metrics
| Metric | Target |
|--------|--------|
| NPO partnerships confirmed | 3 by Month 2 |
| awesome-* list inclusions | 5 by Week 4 |
| Newsletter features | 2 by Week 4 |
| HN Show HN front page | 1 (Week 2) |
| Anthropic MCP registry listing | Week 1 |

---

## 6. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Mental health community sees as "tech solutionism" | Medium | High | Lead with data accuracy story, not AI hype; foreground NPO partnerships |
| Wrong data causes harm; liability concern | Low | Critical | SAFETY.md + DISCLAIMER prominent; verified_at dates visible |
| HN Show HN doesn't trend | Medium | Medium | Have Reddit + LinkedIn backup posts ready same week |
| NPO outreach ignored | High | Low | Personalise each email; follow up twice; leverage mutual connections |
| GitHub Star bombing (low-quality Stars) | Low | Low | Focus on authentic community channels |
| Japanese media unresponsive | Medium | Low | Japanese tech Twitter/X is more responsive than formal media |

---

## Appendix: Content Calendar Snapshot

| Week | Monday | Wednesday | Friday |
|------|--------|-----------|--------|
| 0 | Press kit draft | Demo video recording | README badge additions |
| 1 | Anthropic MCP PR | Stealth outreach (5 peers) | Feedback synthesis |
| 2 | **Show HN** | **Product Hunt** | LinkedIn post |
| 3 | Reddit /r/ML | Newsletter pitches | NPO first outreach |
| 4 | Zenn article (ja) | note article (ja) | /r/mentalhealth post |
