# ADR-003: Per-country file structure for data storage

**Status:** Accepted  
**Date:** 2026-06-02  
**Author:** Kouki-odaka  

---

## Context

The registry stores helpline records for 20+ countries. We need to decide how to organize
the data files on disk and in the repository.

Alternatives considered:

| Option | Description |
|--------|-------------|
| **Single flat file** | `data/helplines.json` — all records in one array |
| **Per-record files** | One JSON file per helpline record |
| **Per-country files** | One JSON file per country: `data/countries/{cc}/helplines.json` |
| **Per-country + per-category** | `data/countries/{cc}/{category}.json` |
| **Database** | SQLite or DuckDB bundled in the repo |

## Decision

Use **per-country files**: `data/countries/{cc}/helplines.json` where `{cc}` is the
lowercase ISO 3166-1 alpha-2 country code.

Each file is a `HelplineDataFile` object (defined in `schemas/helpline.schema.json`) containing
all records for that country.

A machine-generated `data/index.json` provides a global overview without requiring consumers
to parse all country files.

### Why not a single flat file?

- Git diff is noisy when any record in any country changes.
- All contributors must serialize write access to a single file.
- File size grows unboundedly; GitHub renders JSON files up to 5 MB.

### Why not per-record files?

- Too many files (hundreds → thousands as coverage grows). GitHub repositories degrade above
  ~10,000 files. Directory listings become unwieldy.
- Validator must open one file per record — slow for batch validation.
- No natural grouping for bulk operations (e.g., "re-verify all UK records").

### Why not per-country + per-category?

- Most countries have fewer than 15 records. Splitting by category creates many near-empty files.
- Category changes require moving records between files, complicating git history.
- Can be adopted later (ADR-003b) if a country grows beyond ~50 records without breaking consumers.

### Why not a database?

- Databases require runtime tooling to query; JSON files are readable by any language
  and by LLMs without a driver.
- Git history on a SQLite binary is not human-readable.
- The registry is read-heavy with rare writes; a database's write advantages are irrelevant.

## File naming

```
data/
└── countries/
    ├── jp/
    │   └── helplines.json   # All Japan records
    ├── us/
    │   └── helplines.json   # All US records
    └── ...
```

Country code directory names are **lowercase** even though `CountryCode` in the schema is
uppercase. This avoids case-sensitivity issues on macOS (case-insensitive FS).

## Index generation

`data/index.json` is **generated** by `npm run build` (via `DistBuilder` in `packages/core`).
It is committed to the repository so consumers can fetch one file to discover all countries
without cloning the repo. It must be regenerated and committed whenever country files change.

## Consequences

**Positive:**
- Country maintainers can own a single file; PRs stay small and reviewable.
- Per-country git blame gives clear ownership history.
- Adding a new country = creating a new directory and file; no central file to modify.
- Consumers can lazily load only the countries they need.

**Negative:**
- Consumers wanting all data must discover countries via `index.json` first.
- DistBuilder must be re-run and the generated `index.json` must be committed on every data PR
  (enforced by CI).
- Cross-country queries (e.g., "all English-language lines globally") require reading multiple files.
