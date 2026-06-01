# Contributing to open-helplines

Thank you for helping make mental health resources more accessible worldwide.

## What you can contribute

| Type | Path | Process |
|------|------|---------|
| Add data for a new service | `data/countries/{cc}/{slug}.yaml` | PR directly |
| Fix outdated number or URL | `data/countries/{cc}/{slug}.yaml` | PR directly |
| Request a new country | _(no existing directory)_ | Open Issue first |
| Schema change | `schemas/helpline.schema.json` | GitHub Discussion first |
| Code change | `packages/` | PR directly |

## Adding or updating data

### Directory layout

One JSON file per country, under `data/countries/{ISO-3166-1-alpha-2}/helplines.json`:

```
data/
  countries/
    jp/
      helplines.json    ← all Japan records
    us/
      helplines.json    ← all US records
```

The top-level `data/index.json` is generated automatically by `npm run build` — do not edit it manually.

### Minimum viable record

Add your record to the `"records"` array in the appropriate country file:

```json
{
  "id": "jp-inochi-no-denwa",
  "country": "JP",
  "name": "Inochi no Denwa",
  "category": "suicide_prevention",
  "contacts": [
    {
      "method": "phone",
      "number": "+810120783556",
      "languages": ["ja"],
      "hours": "24/7",
      "free": true
    }
  ],
  "description": "24-hour crisis line operated by JFSS. Japan's longest-running suicide prevention hotline.",
  "verified_at": "2026-05-01",
  "source": "https://www.inochi.or.jp/",
  "government_backed": false
}
```

All allowed `category` values are defined in `schemas/helpline.schema.json` (`$defs.ServiceCategory`).

### Data quality requirements

Check every field before submitting:

- **`verified_at`** — the date you personally confirmed the service is operational. Set it to today, not the date you found the reference.
- **`source`** — the official organization website or a government/WHO/PAHO page. Wikipedia is not acceptable.
- **`number`** — E.164 format: `+{country_code}{subscriber_number}`, no spaces, no dashes. Dial it if at all possible.
- **`description`** — 280 characters max, factual English. No marketing language ("best", "leading", "premier").
- **Excluded content** — commercial for-profit services, religious conversion programs, hate group affiliates. See [docs/safety/SAFETY.md](docs/safety/SAFETY.md) for the full inclusion/exclusion policy.

Validate before opening a PR:

```sh
npm run validate
```

## Pull requests

Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Every checklist item must be ticked.

Keep PRs focused: one country per PR unless records are closely related (e.g., national + regional variants of the same service).

### Commit message format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
data(jp): add Inochi no Denwa crisis line
data(us): update 988 Lifeline phone to E.164
fix(jp): correct yorisoi-hotline verified_at date
docs: clarify data quality requirements in CONTRIBUTING
chore: bump @open-helplines/core to 0.2.0
```

Commit author must be the human responsible for verifying the data. Do **not** include `Co-Authored-By: Claude` or similar AI-attribution lines — the person who verifies the phone number is the author.

## Schema changes

Schema changes affect all consumers (npm, PyPI, MCP server). They require broader review before implementation:

1. Open a [GitHub Discussion](https://github.com/Kouki-odaka/open-helplines/discussions) in the **Schema** category.
2. Describe: the new field, its type, whether required, default value, and migration impact on existing records.
3. Wait for maintainer approval before opening a PR against `schemas/`.

Data additions and corrections do not require a Discussion — open a PR directly.

## Code changes

Source lives in `packages/`. Each sub-package has its own test suite.

| Package | Purpose |
|---------|---------|
| `packages/core` | Validator, builder, TypeScript types (`@open-helplines/core`) |
| `packages/mcp` | MCP server — `find_helplines`, `list_countries`, `get_helpline_by_id` |
| `packages/python` | PyPI package (`open-helplines`) |

Run the full test suite before pushing:

```sh
npm test
```

Type-check without building:

```sh
npm run typecheck
```
