# Safety Policy

This document defines what open-helplines is, what it is not, and how we prevent harm.

## What we are

open-helplines is a **data registry** — a structured, open-source index of crisis hotlines and mental health contact services. We provide:

- Verified phone numbers, chat links, and app links organized by country and service category
- A machine-readable JSON schema with stable, versioned types for developer integration
- A CC0 public domain dataset that anyone can copy, embed, or redistribute without restriction or attribution

## What we are NOT

| We are NOT | Why it matters |
|---|---|
| A crisis counseling service | We are software; we cannot assess risk or respond to emergencies |
| A substitute for local emergency services | Always call 119/110 (Japan), 911 (US), or your local emergency number when life is at risk |
| A mental health diagnosis tool | Records contain no medical advice |
| A therapy referral network | Inclusion does not imply clinical endorsement |
| A real-time availability system | Numbers are verified periodically, not in real time |
| A commercial directory | For-profit services are excluded by policy |

> **If you or someone you know is in immediate danger, call your local emergency services now.  
> Do not wait to look up a number in this registry.**

## Data quality policy

### Inclusion criteria

A record may be included only if it meets **all** of the following:

- Operated by a non-profit, government body, or established NGO
- Primary purpose is crisis support or mental health resource provision
- Contact information has been manually verified as operational within the last 12 months
- Source is traceable to an official website, government agency, or recognized international body (WHO, PAHO, etc.)

### Exclusion criteria

A record must be **excluded** if any of the following apply:

- Commercial for-profit services where the primary purpose is client acquisition or revenue generation
- Services that include unsolicited religious conversion, proselytizing, or ideological recruitment as part of their support
- Services associated with hate groups, discrimination, or activities that target people based on protected characteristics
- Services that gate primary language access behind a paid membership
- Records where no contact information can be independently verified from an official source

If you believe a record in the registry violates these criteria, open an Issue with the label `data-policy`.

### Stale data policy

| Age of `verified_at` | Action |
|---|---|
| < 12 months | Accepted |
| 12–24 months | Flagged in CI; contributor notified |
| > 24 months | Candidate for removal unless re-verified |

Maintainers run a weekly health check to surface flagged records. Contributors who submitted a record are notified before removal.

## Abuse scenario review

The following misuse scenarios have been identified and mitigated:

### Incorrect data injection

**Scenario**: A contributor submits a phone number that routes to a non-crisis or harmful service.

**Mitigation**: All records require a `source` field linking to an authoritative URL. CI enforces E.164 phone format. Maintainers spot-check new records before merge. Post-merge, the [data-correction issue template](../../.github/ISSUE_TEMPLATE/data-correction.md) allows rapid community reporting; critical corrections are fast-tracked.

### Stale number causing harm

**Scenario**: A hotline number changes or a service closes, but the registry retains the old number. An LLM or app surfaces the stale number to someone in crisis.

**Mitigation**: `verified_at` is a required field; CI flags records older than 12 months. The weekly health check surfaces aged records proactively. The schema exposes `verified_at` to downstream consumers so they can display data freshness warnings.

### Commercial indirection

**Scenario**: A for-profit service is submitted disguised as a nonprofit, using the registry to acquire clients.

**Mitigation**: Inclusion criteria require non-profit or government affiliation. `source` must link to an official domain. Maintainers verify organizational status during review.

### LLM hallucination amplification

**Scenario**: An LLM consumes registry data but generates fabricated phone numbers in its responses.

**Mitigation**: The schema, `llms.txt`, and examples in `examples/` explicitly instruct LLM integrations to extract contact fields (`number`, `url`) verbatim from the schema — never to paraphrase or infer contact information. Function-calling and tool-use examples enforce this pattern with system prompt guidance.

## Responsible use for LLM developers

If you integrate open-helplines into an LLM-powered product, follow these guidelines:

1. **Surface contact info verbatim.** Never allow the model to paraphrase, summarize, or generate phone numbers or URLs. Extract them directly from `contacts[].number` or `contacts[].url`.

2. **Add a staleness disclaimer.** Show `verified_at` to end users, or include a note such as: *"Please verify this number is still operational before calling."*

3. **Direct to emergency services first.** If there is any indication of immediate danger, the system prompt or application logic should direct the user to emergency services (911, 119, 999, etc.) before surfacing any registry entry.

4. **Refresh data regularly.** Cache no longer than weekly, or surface the `verified_at` date so users can judge freshness themselves.

5. **Do not personalize with commercial recommendations.** This registry is not an advertising platform. Do not mix registry results with paid referral links.

## Reporting a problem

| Problem | Action |
|---|---|
| Outdated or wrong phone number | [Open a data-correction issue](../../.github/ISSUE_TEMPLATE/data-correction.md) |
| Service violates inclusion policy | Open an Issue with label `data-policy` |
| Urgent safety concern (service actively harmful) | Open an Issue with label `urgent` — maintainers check daily |
| Security vulnerability in code | Open a [GitHub Security Advisory](https://github.com/Kouki-odaka/open-helplines/security/advisories/new) |
