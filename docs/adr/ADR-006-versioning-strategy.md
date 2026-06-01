# ADR-006: Hybrid SemVer + CalVer versioning strategy

**Status:** Accepted  
**Date:** 2026-06-02  
**Author:** Kouki-odaka  

---

## Context

The open-helplines registry has two orthogonal evolution axes:

1. **Schema/API evolution** — changes to `helpline.schema.json`, TypeScript types, Python models,
   MCP tool signatures. These have backward-compatibility implications for consumers.

2. **Data evolution** — additions, corrections, and removals of helpline records. These happen
   continuously and don't change the API contract but are important to track for data consumers
   who want to know how fresh their copy is.

Common versioning strategies:

| Strategy | Description |
|----------|-------------|
| **Pure SemVer** (`MAJOR.MINOR.PATCH`) | Communicates API breaking changes but nothing about data freshness |
| **Pure CalVer** (`YYYY.MM.DD`) | Communicates data freshness but nothing about API compatibility |
| **Hybrid SemVer + CalVer** (`MAJOR.MINOR.PATCH+YYYYMMDD`) | Communicates both, using SemVer as base and CalVer as build metadata |
| **Separate versions per axis** | One version for schema, another for data | Operationally complex; two tags per release |

## Decision

Use **Hybrid SemVer with CalVer build metadata**:

```
MAJOR.MINOR.PATCH+YYYYMMDD
```

Examples:
- `0.1.0+20260602` — first release of schema v0.1.0, data snapshot dated 2026-06-02
- `0.2.0+20261115` — breaking schema change (v0.2.0), data snapshot dated 2026-11-15
- `1.0.0+20270101` — stable schema release, data snapshot dated 2027-01-01

### Axis rules

| Version component | Triggers | Example change |
|-------------------|----------|----------------|
| **MAJOR** bump | Schema breaking change — removed field, renamed field, changed type, removed enum value | Remove `notes` field from `HelplineRecord` |
| **MINOR** bump | Schema additive change — new optional field, new enum value, new MCP tool | Add `crisis_text_line` to `ContactMethod` enum |
| **PATCH** bump | Data-only release — added/corrected/removed records, no schema change | Add 5 new Japan records |
| **+YYYYMMDD** metadata | Every release — records the data snapshot date in the build metadata field (SemVer §10) | Always updated |

### Why not a MAJOR bump for data-only releases?

Data corrections (stale numbers, closed services) happen frequently. If each correction
triggered a MAJOR or MINOR bump, the version number would lose its signal about API compatibility.
Using `PATCH` for data-only releases is intentional: consumers can safely upgrade any patch
release without code changes.

### Stability guarantee

- **Pre-1.0**: No backward-compatibility guarantee on schema or data structure. Consumers
  should pin to an exact version or commit SHA.
- **Post-1.0**: MAJOR bumps are announced with a migration guide at minimum 4 weeks in advance.
  MINOR bumps are always backward-compatible.

## Release automation

`semantic-release` drives the MAJOR/MINOR/PATCH component via Conventional Commits analysis.
The CalVer metadata (`+YYYYMMDD`) is appended by the release workflow using `date -u +%Y%m%d`.

```yaml
# In .github/workflows/release.yml:
- name: Append CalVer metadata
  run: |
    BASE=$(node -p "require('./package.json').version")
    DATE=$(date -u +%Y%m%d)
    echo "RELEASE_VERSION=${BASE}+${DATE}" >> $GITHUB_ENV
```

npm and PyPI accept build metadata in version strings (SemVer spec §10 metadata is ignored
in dependency resolution, so `1.0.0+20260602` and `1.0.0+20261115` resolve as equal —
this is expected behavior; the metadata is for human/audit consumption only).

## Changelog structure

Each release entry in `CHANGELOG.md` uses the format:

```markdown
## [1.2.3+20261115] — 2026-11-15

### Schema changes (MINOR)
- feat(schema): add `crisis_text_line` contact method

### Data updates
- data(jp): add 3 new suicide prevention lines
- data(us): update 988 Lifeline hours (now 24/7)
- data(gb): mark Papyrus number as verified 2026-11-14
```

## Consequences

**Positive:**
- SemVer MAJOR/MINOR/PATCH communicates API compatibility clearly to package managers.
- CalVer metadata provides a human-readable data freshness signal without polluting the
  version comparison logic.
- `semantic-release` can drive MAJOR/MINOR/PATCH automatically from commit messages.
- Consumers using npm/pip version ranges (`^0.1.0`, `~0.1.0`) get expected behavior.

**Negative:**
- Build metadata is ignored by npm and PyPI version resolution. Consumers wanting to pin
  to a specific data snapshot must use git tags (e.g. `v0.1.0+20260602`) or commit SHAs.
- CalVer metadata in npm versions may confuse some tooling that doesn't understand
  SemVer metadata fields. Mitigation: document this clearly in README.
