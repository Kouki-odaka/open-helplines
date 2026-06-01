# NPO / Mental Health Organisation Outreach Template (English)

> Usage: Personalise [BRACKETS] before sending. Send from a personal email address, not a noreply.

---

## Template A: Initial Outreach to NPO / Helpline Organisation

**Subject**: Your crisis line is part of an open-access global registry — would you like to review it?

---

Dear [Name / Communications Team],

My name is [Your Name], and I'm the creator of **open-helplines** — a free, open-access registry of mental health crisis lines worldwide ([https://github.com/Kouki-odaka/open-helplines](https://github.com/Kouki-odaka/open-helplines)).

I'm reaching out because **[Organisation Name]'s contact information is already listed in our registry** — and I want to make sure every detail is accurate.

open-helplines is used by:
- AI developers building mental health tools (so their apps can provide *verified* phone numbers instead of hallucinated ones)
- Researchers studying global crisis line coverage
- Journalists and policy makers mapping mental health infrastructure

The data is licensed **CC0** — completely free, no attribution required, usable by anyone.

**What I'm asking**: Would someone at [Organisation] be willing to review the [COUNTRY] entry and flag any inaccuracies? It takes about 5 minutes, and corrections can be submitted as a simple GitHub pull request (or emailed to me directly).

If you'd like to see your organisation's entry: [LINK TO SPECIFIC COUNTRY DATA FILE]

I'd also love to explore whether [Organisation] would be interested in a **data partnership** — where your team receives an advance notification whenever data changes that may affect your listings.

Thank you for the work you do. I built this project precisely because accurate contact information can be a matter of life and death.

With respect,
[Your Name]
[GitHub Profile URL]
[Personal Email / Website]

---

## Template B: Follow-Up (2 weeks after Template A, no response)

**Subject**: Re: Your crisis line in open-helplines registry

---

Dear [Name],

I sent a note two weeks ago about open-helplines, the open-access crisis line registry — I wanted to follow up briefly.

Since my last email, [X] AI applications have integrated our data, and developers have made [Y] data corrections for countries around the world.

I understand your inbox is full. If reviewing the data is low priority right now, completely understood. But if there's a better person to contact about this — a data coordinator, a communications lead, or a technology partner — I'd be grateful for an introduction.

The project remains free, CC0, and open forever: [GitHub URL]

Thank you again for everything [Organisation] does.

Warm regards,
[Your Name]

---

## Template C: Partnership Proposal (after initial positive response)

**Subject**: open-helplines × [Organisation]: data partnership proposal

---

Dear [Name],

Thank you for your response — it's genuinely encouraging to hear from you.

I'd like to propose a simple **data accuracy partnership** between open-helplines and [Organisation]:

**What we offer**:
1. **Priority notification**: We alert you whenever data for [COUNTRY] is updated in the registry — before it's merged.
2. **Contributor credit**: [Organisation] is credited as a verified data partner in our README and documentation.
3. **API access**: Priority access to any future premium features (we're CC0-first, but some tooling may be paid).

**What we ask**:
1. **Data review**: A member of your team reviews the [COUNTRY] entry once per quarter (~20 minutes).
2. **Social mention**: If you're comfortable, a single social post mentioning the registry (no obligation).
3. **Data corrections**: Share any updates to your lines (number changes, new services, closures) by emailing or opening a GitHub PR.

This costs you nothing financially. It costs us very little. And it means that when an AI assistant is asked for a crisis line in [COUNTRY], it returns your correct, current number.

Would you be open to a 20-minute call to discuss?

I can be reached at [email] or we can schedule via [Calendly/cal.com link].

With gratitude,
[Your Name]

---

## Template D: AI / Tech Company Outreach (Anthropic, OpenAI, Hugging Face, etc.)

**Subject**: open-helplines: MCP-native crisis line registry for Claude/GPT integrations

---

Dear [Name / Developer Relations Team],

I'm building **open-helplines** — a CC0-licensed, JSON-Schema-validated registry of mental health crisis lines worldwide, with an MCP server for direct integration with Claude Desktop and any MCP host.

**Why this matters for [Company]**:

AI assistants increasingly encounter users who express distress. When they do, they need to surface *verified* contact information — not hallucinated phone numbers. open-helplines provides exactly that: a stable, free, always-available data source with explicit safety constraints built into the tool descriptions.

- **MCP server**: `npx @open-helplines/mcp` — three tools: `find_helplines`, `get_helpline`, `list_countries`
- **Safety constraint built in**: ADR-004 mandates that all tool descriptions instruct the model to return numbers verbatim, never paraphrase
- **License**: CC0 data + Apache-2.0 code — no restrictions on any use
- **No API key**: Works offline, no account required

I'm reaching out because [Company]'s [product/platform] is used by developers who may be building exactly this kind of feature.

**Proposed collaboration**:
- Listing in [Company]'s MCP server registry / integration showcase
- Co-authored blog post about safe LLM integration with crisis data
- OR: simply a retweet / social mention from [Company]'s account

I'd be happy to provide a demo, a technical write-up, or answer any questions about the project's safety design.

GitHub: [https://github.com/Kouki-odaka/open-helplines](https://github.com/Kouki-odaka/open-helplines)

Thank you for your time.

Best,
[Your Name]

---

## Template E: Academic / Research Institution Outreach

**Subject**: CC0 mental health crisis line dataset — suitable for citation in research

---

Dear Professor/Dr [Name],

I'm writing to introduce **open-helplines**, an open-access, CC0-licensed dataset of mental health crisis lines worldwide — structured, versioned, and suitable for academic citation.

The dataset provides:
- Verified crisis line data for [N] countries
- JSON Schema Draft 2020-12 validation
- CHANGELOG with version history (suitable for methods sections: "data retrieved from open-helplines v1.X, verified [date]")
- Python Pydantic models for easy analysis

I noticed your lab's work on [SPECIFIC PAPER/RESEARCH AREA] — this dataset may be relevant for studies on:
- Global helpline accessibility and coverage
- AI systems encountering users in mental health distress
- Crisis intervention technology design

The data is CC0, meaning it can be freely used, modified, and redistributed without restriction — including in published research.

I'd welcome any feedback on the dataset's structure, coverage gaps, or potential improvements that would make it more useful for research purposes.

Dataset: [https://github.com/Kouki-odaka/open-helplines](https://github.com/Kouki-odaka/open-helplines)  
Cite as: `open-helplines v[VERSION], Kouki Odaka (2026), https://github.com/Kouki-odaka/open-helplines, CC0-1.0`

Thank you for your consideration.

Sincerely,
[Your Name]

---

## Template F: Journalist / Newsletter Pitch

**Subject**: PITCH: The open-source project fixing AI's mental health hallucination problem

---

Dear [Name],

Quick pitch — I think this fits your [publication/newsletter] audience.

**The story**: AI assistants are increasingly being asked for mental health crisis resources. The problem: they hallucinate. Phone numbers get garbled, hotlines get confused, outdated numbers get served. In a crisis, a wrong number isn't just inconvenient — it can be fatal.

**The project**: I built **open-helplines** — a CC0 registry of crisis lines worldwide with an MCP server built specifically for LLM integration. The entire point is that a developer building a mental health feature should have a verified, free data source that doesn't require an API key or account.

**What makes it a story**:
1. It's CC0 — completely free, not even attribution required. Unusual for this kind of infrastructure.
2. It already powers AI integrations at [X] companies (if applicable at time of pitch)
3. The alternative — commercial directories — charge per query even for public-domain contact information
4. The MCP (Model Context Protocol) angle is timely given Claude's growing adoption

**What I can offer**:
- Demo (Claude Desktop showing verified crisis lines in real-time)
- Technical interview about the MCP safety design (ADR-004: why LLMs must never paraphrase crisis contacts)
- Data angle: coverage gaps by country/region

Would this fit your editorial calendar? Happy to adjust the angle — the data story, the AI safety angle, or the open-source community story all work.

Best,
[Your Name]
[GitHub URL]
[Demo URL]
