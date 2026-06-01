# Data Quality Checklist

Use this checklist when reviewing any PR that adds or modifies records in `data/`.

## Pre-merge checklist (reviewer)

### Record structure

- [ ] File is in `data/countries/{ISO-3166-1-alpha-2}/{slug}.yaml`
- [ ] `id` matches `{country_code}-{slug}` (all lowercase, hyphenated, no underscores)
- [ ] `country` is the correct ISO 3166-1 alpha-2 code (uppercase)
- [ ] `npm run validate` passes with no errors

### Contact information

- [ ] At least one contact entry is present
- [ ] All `method: phone` or `method: text` entries have a `number` in E.164 format
- [ ] All `method: chat`, `email`, or `app` entries have a `url` (HTTPS)
- [ ] `hours` is populated and human-readable (e.g. `"24/7"`, `"Mon–Fri 09:00–17:00"`)
- [ ] `free: true/false` is explicitly set
- [ ] `languages` has at least one BCP-47 code

### Verification

- [ ] `verified_at` is set to a date within the **last 12 months**
- [ ] `verified_at` reflects when the *submitter* verified the number, not when the organization was founded
- [ ] `source` points to an accessible, authoritative URL (official org site or government/WHO page)
- [ ] The phone number has been manually dialed or the URL has been visited to confirm operation

### Content quality

- [ ] `description` is ≤ 280 characters
- [ ] `description` is factual English with no marketing language
- [ ] `name` uses the organization's official English name
- [ ] `local_name` is present if the organization name differs in the local language
- [ ] `government_backed` is accurate (true only for government-operated or -funded services)

### Inclusion policy compliance

- [ ] Organization is non-profit, government, or established NGO
- [ ] Service purpose is crisis support or mental health — not for-profit client acquisition
- [ ] No religious conversion component in the service delivery
- [ ] Not affiliated with hate groups or discriminatory organizations
- [ ] Service does not gate primary language access behind a paid membership

---

## Weekly health check (maintainer)

Run monthly or trigger manually:

```sh
npm run validate -- --check-staleness
```

This flags:
- Records with `verified_at` older than 12 months (warning)
- Records with `verified_at` older than 24 months (error — candidate for removal)

### Review flagged records

For each flagged record:

1. Attempt to verify the contact is still operational.
2. If operational: update `verified_at` to today and update `source` if needed.
3. If unreachable or closed: open a PR to remove the record, tagging it `data-removal`.

### Country coverage review

Every 6 months, review the country list against WHO and international crisis support
directories. Identify high-population countries with no coverage and open
[new-country issues](.github/ISSUE_TEMPLATE/new-country.md) to request community contributions.

---

## Automated CI checks

The PR workflow (`pr.yml`) runs the following automatically:

| Check | Trigger |
|-------|---------|
| JSON Schema validation | All `data/` changes |
| E.164 format lint | Phone number fields |
| `verified_at` within 12 months | All `data/` changes |
| `source` URL reachable (HEAD request) | All `data/` changes |
| `description` length ≤ 280 chars | All `data/` changes |
| Type generation (`build:types`) | `schemas/` changes |

External URL health check (full GET) runs only on the release path to avoid rate-limiting.
