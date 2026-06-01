# Audience Personas — open-helplines

> Version 1.0 · 2026-06-02

---

## Overview

open-helplines occupies a rare intersection: **life-critical public data** + **developer infrastructure**. Its audiences span radically different worlds — those who work in mental health and those who build AI systems — united by a shared need for verified, free-to-use crisis contact data.

The core insight from 小髙さん: *"メンタルヘルス領域に興味ある人が GitHub を使っている率が低い."* Therefore, reaching the mental-health audience requires going **off-GitHub** while keeping GitHub as the conversion endpoint.

---

## Persona 1: The NPO Program Director

**Who**: Staff at mental health NGOs / NPOs (NAMI, Mind UK, Lifeline Australia, 日本いのちの電話, JAMHS).

**Platform presence**: LinkedIn, organisational newsletters, professional conferences (IASP, AFSP, IASPc), Slack workspaces, mailing lists.

**Motivation**:
- Reduce operational burden of maintaining their own directory
- Ensure their contact info is accurate and freely accessible to developers building tools that may refer users to them
- Increase discoverability for people in crisis

**Star journey**:
`LinkedIn post / conference mention → README landing → "my organisation is listed here and I can contribute corrections" → Star + PR`

**Key message**: *"Your helpline data is already in open-helplines — or should be. Help us keep it accurate."*

**Notes**: NPO directors rarely open GitHub issues; they respond to email. Outreach templates (see `outreach-templates/`) are essential for this persona.

---

## Persona 2: The AI / LLM Developer

**Who**: Engineers building crisis-adjacent AI features — mental health chatbots, AI companionship apps, LLM agents that may encounter users in distress.

**Platform presence**: Hacker News, X/Twitter, Bluesky, GitHub itself, Discord (AI/ML servers), Hugging Face, arXiv.

**Motivation**:
- Need verified contact data they can serve to users without fear of hallucination
- Want a stable MCP server to plug into Claude Desktop / any MCP host
- Concerned about liability if their app gives wrong phone numbers

**Star journey**:
`HN "Show HN" / X thread about MCP safety → README → npm install @open-helplines/mcp → Star + spread to team`

**Key message**: *"Stop hallucinating crisis numbers. One MCP import, always verified."*

**Notes**: This is the **primary GitHub-native audience** and the fastest to Star. Prioritise HN + X for Week 2 launch.

---

## Persona 3: The Mental Health Researcher / Academic

**Who**: Professors, PhD students, clinicians researching crisis intervention efficacy, help-seeking behaviour, or AI in mental health.

**Platform presence**: ResearchGate, Google Scholar, PubMed, Twitter (academic circles), university mailing lists, conference proceedings (IMHCN, IEEE Healthcare).

**Motivation**:
- Need a citable, versioned dataset for studies on helpline accessibility
- Want to contribute corrections from field knowledge
- May publish on "global helpline coverage" — open-helplines as a reference

**Star journey**:
`Journal/preprint citation → GitHub → LICENSING.md (CC0 = freely citable) → Star + dataset download`

**Key message**: *"CC0-licensed, JSON-Schema-validated, CHANGELOG-versioned — cite it in your methods section."*

**Notes**: A single mention in a well-read preprint (arXiv cs.AI or psychology) can drive sustained Stars. Reach this persona via research newsletters and preprint communities.

---

## Persona 4: The Crisis Counsellor / Clinician (Digital-Adjacent)

**Who**: Front-line crisis workers, therapists, psychiatric nurses who use or recommend digital tools. Not necessarily developers, but technically curious.

**Platform presence**: Reddit (/r/mentalhealth, /r/therapists, /r/psychology), Twitter, Instagram, Facebook groups (private), clinical Slack channels, continuing education platforms.

**Motivation**:
- Ensure people in distress are directed to accurate resources
- Worry about AI tools giving wrong or outdated numbers
- Want to flag inaccuracies in their country's data

**Star journey**:
`/r/mentalhealth thread or clinical Slack mention → "how do I report a wrong number?" → CONTRIBUTING.md → Star + correction PR`

**Key message**: *"If you've ever seen an app give a wrong crisis number, this is the fix."*

**Notes**: This persona is unlikely to use the npm package but can become a powerful data contributor and evangelist. Engage through Reddit and clinical communities.

---

## Persona 5: The Tech Journalist / Newsletter Author

**Who**: Writers for TLDR, The Pointer, Console.dev, TechCrunch, Wired, ITmedia, Yahoo!JAPAN Tech; podcast hosts (Software Engineering Daily, Practical AI).

**Platform presence**: Twitter/X, LinkedIn, their own newsletters, Hacker News (readers + occasional posters).

**Motivation**:
- Seeking "feel-good OSS story" with a genuine social impact angle
- AI safety + mental health is an underreported intersection
- CC0 dataset angle is novel ("all data is free, no API key, not even attribution required")

**Star journey**:
`Press kit / email pitch → article / newsletter mention → reader HN discussion → Star spike`

**Key message**: *"First CC0 crisis helpline registry with MCP support — built because commercial alternatives cost money even for public data."*

**Notes**: A single TLDR or Hacker News front-page mention can drive 200–500 Stars in 24 hours. The press kit (Week 0) is high-leverage for this persona.

---

## Persona 6: The Japanese Tech / Health Community Member

**Who**: Developers, health-tech practitioners, social entrepreneurs active on Zenn, note, Qiita, はてなブックマーク; readers of Aera, 朝日新聞デジタル; members of JAMHS or メンタルヘルスマネジメント検定 study groups.

**Platform presence**: Zenn, note, Qiita, はてなブックマーク, Twitter/X (ja), Connpass events, Peatix.

**Motivation**:
- Pride in a Japanese contributor maintaining global mental health infrastructure
- Awareness that Japanese mental health data (日本いのちの電話, よりそいホットライン, etc.) is included
- Interest in OSS with bilingual documentation (README.ja.md exists — a strong signal)

**Star journey**:
`Zenn/note article (Japanese) → README.ja.md → "日本語ドキュメントある！" → Star + share on Twitter/X`

**Key message**: *"日本のメンタルヘルスデータが含まれた、世界初のCC0オープンヘルプライン・レジストリ。MCP対応でClaudeからも参照できます。"*

**Notes**: Japanese tech Twitter/X moves in tight community clusters. One retweet from an influential health-tech account can cascade quickly. Zenn is developer-first but is increasingly read by health professionals.

---

## Persona 7: The Policy Maker / Health Tech Regulator

**Who**: Government officials, WHO programme officers, EU digital health regulators, NHS digital transformation staff, MHLW (日本厚生労働省) digital health teams.

**Platform presence**: LinkedIn, WHO newsletters, government procurement channels, conference circuits (HIMSS, Health 2.0).

**Motivation**:
- Need reference datasets for national crisis infrastructure mapping
- Interested in AI regulation compliance (verified data sources for crisis AI)
- Potential for official endorsement or dataset integration

**Star journey**:
`WHO Mental Health newsletter or policy conference → organisation evaluation → GitHub Star (institutional signal) + formal inquiry`

**Key message**: *"A verified, open-access reference dataset for crisis line coverage — suitable for policy mapping and AI safety compliance."*

**Notes**: This persona converts slowly but carries disproportionate legitimacy. A single WHO or NHS mention transforms the project's credibility. Focus during sustained phase (Week 4+), not launch week.

---

## Persona Prioritisation Matrix

| # | Persona | GitHub Fluency | Star Speed | Reach | Launch Priority |
|---|---------|---------------|------------|-------|-----------------|
| 2 | LLM / AI Developer | ⭐⭐⭐⭐⭐ | Fast (days) | Medium | **Week 1–2** |
| 5 | Tech Journalist | ⭐⭐⭐ | Very fast (spike) | Large | **Week 2–3** |
| 6 | Japanese Tech Community | ⭐⭐⭐⭐ | Fast (days) | Medium | **Week 2** |
| 1 | NPO Director | ⭐⭐ | Slow (weeks) | Large | **Week 3+** |
| 3 | Academic Researcher | ⭐⭐ | Medium (weeks) | Medium | **Week 3+** |
| 4 | Crisis Counsellor | ⭐ | Slow (months) | Large | **Sustained** |
| 7 | Policy Maker | ⭐ | Very slow (months) | Very large | **Sustained** |
