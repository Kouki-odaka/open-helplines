# Hugging Face Dataset Publishing Guide

> Target: `hf.co/datasets/open-helplines/registry`  
> License: CC0-1.0  
> Last updated: 2026-06-04

---

## Overview

This guide covers publishing the open-helplines registry as a dataset on Hugging Face Hub, including:

1. One-time setup (HF account, access token, `huggingface_hub`)
2. Dataset card (`README.md`) template with YAML frontmatter
3. Step-by-step publish commands
4. Keeping the dataset in sync with future data updates

---

## Step 1 — Hugging Face account setup

### 1-A. Create an account

Go to [https://huggingface.co/join](https://huggingface.co/join) and register with your GitHub account or email.

Recommended: use the same display name as your GitHub handle (`Kouki-odaka`) for consistency.

### 1-B. Create the `open-helplines` organisation (optional but recommended)

1. Log in → click your avatar → **New Organization**
2. Name: `open-helplines`
3. Visibility: Public
4. This allows publishing as `hf.co/datasets/open-helplines/registry` (org-scoped URL)

If you publish under your personal account the URL is `hf.co/datasets/Kouki-odaka/open-helplines-registry`.

### 1-C. Generate an access token

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. **New token** → Name: `open-helplines-publish` → Role: **Write**
3. Copy the token — you'll use it in Step 3

---

## Step 2 — Install `huggingface_hub`

```bash
pip install huggingface_hub datasets
```

Or add to your Python environment:

```bash
pip install "huggingface_hub>=0.23.0" "datasets>=2.18.0"
```

Verify:

```bash
python -c "import huggingface_hub; print(huggingface_hub.__version__)"
```

---

## Step 3 — Authenticate

```bash
huggingface-cli login
# paste your write token when prompted
```

Or set the environment variable (for CI/scripted use):

```bash
export HF_TOKEN="hf_..."
```

---

## Step 4 — Create the dataset card

Create a file at the repo root (for publishing): `hf-dataset-card/README.md`

```markdown
---
language:
- en
- multilingual
license: cc0-1.0
pretty_name: "open-helplines Registry"
size_categories:
- n<1K
task_categories:
- other
tags:
- open-data
- public-resource
- cc0
- helplines
- verified-data
- mcp
- structured-data
annotations_creators:
- expert-generated
language_creators:
- expert-generated
multilinguality:
- multilingual
source_datasets:
- original
---

# open-helplines Registry

## Dataset Description

**open-helplines** is an open-source, CC0-licensed registry of verified support-line contact records worldwide.
The dataset is structured for use by AI assistants (via MCP), developers (npm / PyPI), and researchers.

- **Homepage:** https://github.com/Kouki-odaka/open-helplines
- **Repository:** https://github.com/Kouki-odaka/open-helplines
- **Visualization:** https://kouki-odaka.github.io/open-helplines/en/
- **License:** CC0 1.0 Universal (public domain)

---

## Dataset Summary

The registry provides structured contact information for support-line services in 24+ countries.
Each record is manually source-verified and follows a JSON Schema (draft-07) with standardised fields.

Primary intended use: enabling AI assistants to return accurate, non-hallucinated contact records
when users need to locate a local support service.

---

## Data Schema

Each record (`helpline`) contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g. `jp-inochi-no-denwa`) |
| `name` | string | Organisation name |
| `country` | string | ISO 3166-1 alpha-2 country code |
| `phone` | string[] | Primary phone number(s) |
| `url` | string | Official website URL |
| `hours` | string | Operating hours (e.g. `"24/7"`, `"Mon-Fri 09:00-18:00"`) |
| `languages` | string[] | BCP-47 language tags |
| `categories` | string[] | Service categories |
| `verified_at` | string | ISO 8601 date of last manual verification |
| `notes` | string | Optional free-text notes |

Full schema: https://github.com/Kouki-odaka/open-helplines/blob/main/schemas/helpline.schema.json

---

## Example Usage

### Python (via `open-helplines`)

```python
from open_helplines import load_registry, find_helplines

registry = load_registry()
results = find_helplines(registry, country="jp")
for r in results:
    print(r["name"], r["phone"])
```

### Python (via `datasets`)

```python
from datasets import load_dataset

ds = load_dataset("open-helplines/registry")
print(ds["train"][0])
```

### MCP (Claude Desktop)

```json
{
  "mcpServers": {
    "open-helplines": {
      "command": "npx",
      "args": ["@open-helplines/mcp"]
    }
  }
}
```

---

## Data Coverage

Countries covered as of initial publish: 24+  
Records verified: see repository for current count.

Coverage is community-driven. To add a country or correct a record, open a PR at the GitHub repository.

---

## Source Data

All records are sourced from official organisation websites, government public-health directories,
and verified by human review. No web scraping. No automated ingestion.

Verification date is recorded per-record in `verified_at`.

---

## Licensing

**Data:** CC0 1.0 Universal — public domain dedication. No rights reserved.  
**Code:** Apache-2.0

You may use, copy, modify, and distribute the data without restriction and without attribution.

---

## Citation

If you use this dataset in published work, citation is welcome but not required (CC0):

```bibtex
@misc{open-helplines,
  author       = {Odaka, Koki},
  title        = {open-helplines: A Verified Registry of Support-Line Contact Records},
  year         = {2026},
  howpublished = {\\url{https://github.com/Kouki-odaka/open-helplines}},
  note         = {CC0 1.0 Universal}
}
```

---

## Contributions

Data corrections and new country additions are welcome via GitHub PR.  
See [CONTRIBUTING.md](https://github.com/Kouki-odaka/open-helplines/blob/main/CONTRIBUTING.md).
```

---

## Step 5 — Prepare data files

The export script converts the repo's country-sharded JSON files into a flat JSONL suitable for HF:

```bash
# From the open-helplines repo root:
node scripts/export-hf-dataset.js --output ./hf-dataset-export/data.jsonl
```

> **Note:** If this script does not yet exist, create it (or run the one-liner below):

```bash
# One-liner: flatten all country helplines.json into a single JSONL
node -e "
const fs = require('fs');
const path = require('path');
const countriesDir = './data/countries';
const output = fs.createWriteStream('./hf-export.jsonl');
for (const cc of fs.readdirSync(countriesDir)) {
  const p = path.join(countriesDir, cc, 'helplines.json');
  if (!fs.existsSync(p)) continue;
  const records = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const r of (Array.isArray(records) ? records : records.helplines ?? [])) {
    output.write(JSON.stringify({...r, country: r.country ?? cc}) + '\n');
  }
}
output.end();
console.log('Written hf-export.jsonl');
"
```

---

## Step 6 — Publish to Hugging Face Hub

### Option A — Python script

```python
from huggingface_hub import HfApi, upload_file, create_repo
import os

REPO_ID = "open-helplines/registry"   # change to "Kouki-odaka/open-helplines-registry" if no org
TOKEN   = os.environ["HF_TOKEN"]

api = HfApi()

# Create the dataset repo (idempotent)
api.create_repo(
    repo_id=REPO_ID,
    repo_type="dataset",
    private=False,
    exist_ok=True,
    token=TOKEN,
)

# Upload dataset card
api.upload_file(
    path_or_fileobj="hf-dataset-card/README.md",
    path_in_repo="README.md",
    repo_id=REPO_ID,
    repo_type="dataset",
    token=TOKEN,
)

# Upload data
api.upload_file(
    path_or_fileobj="hf-export.jsonl",
    path_in_repo="data/helplines.jsonl",
    repo_id=REPO_ID,
    repo_type="dataset",
    token=TOKEN,
)

print(f"Published: https://huggingface.co/datasets/{REPO_ID}")
```

### Option B — CLI (`huggingface-cli`)

```bash
# Upload a full local directory to the HF repo
huggingface-cli upload open-helplines/registry ./hf-dataset-export . \
  --repo-type dataset \
  --commit-message "Initial publish: open-helplines registry v0.1.0"
```

---

## Step 7 — Verify the upload

1. Open `https://huggingface.co/datasets/open-helplines/registry` (or your personal URL)
2. Confirm the README renders correctly with the YAML metadata panel on the right
3. Run a quick load test:

```python
from datasets import load_dataset
ds = load_dataset("open-helplines/registry", split="train")
print(len(ds), "records")
print(ds[0])
```

---

## Keeping the dataset in sync

After each data release, re-run Steps 5–6. The upload is idempotent — unchanged files are skipped.

For automated sync, add a GitHub Actions workflow:

```yaml
# .github/workflows/hf-sync.yml
name: Sync to Hugging Face
on:
  push:
    branches: [main]
    paths:
      - 'data/**'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: node -e "/* flatten script above */"
      - run: pip install huggingface_hub
      - run: python scripts/publish-hf.py
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
```

Add `HF_TOKEN` as a repository secret in GitHub Settings → Secrets.

---

## Checklist

- [ ] HF account created (`Kouki-odaka`)
- [ ] Organisation `open-helplines` created (optional)
- [ ] Write token generated and stored as `HF_TOKEN` secret
- [ ] `huggingface_hub` installed (`pip install huggingface_hub`)
- [ ] Dataset card `README.md` created from template above
- [ ] Data exported to JSONL (`hf-export.jsonl`)
- [ ] Repo created: `open-helplines/registry`
- [ ] Files uploaded (README + data)
- [ ] URL verified: https://huggingface.co/datasets/open-helplines/registry
- [ ] `load_dataset("open-helplines/registry")` tested locally
- [ ] GitHub Actions sync workflow added (optional, for automation)
