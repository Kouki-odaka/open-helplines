# Incident Response

Procedures for handling data quality incidents and security issues in the open-helplines registry.

---

## Severity levels

| Level | Definition | Response time |
|-------|-----------|--------------|
| **P0 — Critical** | Active harm possible: wrong number for a working crisis line, or number routes to a harmful service | Immediate (< 2 hours) |
| **P1 — High** | Stale/disconnected number; service closed but still listed | Same business day |
| **P2 — Medium** | Missing data field; wrong hours or language; incorrect category | Within 1 week |
| **P3 — Low** | Cosmetic errors; missing optional fields; translation issue | Next sprint / PR welcome |

---

## P0 / P1: Data error in a crisis line

### Step 1 — Triage (< 30 minutes)

1. Reproduce the report: dial the number or visit the URL yourself.
2. Classify as P0 (number active but wrong destination) or P1 (number disconnected).
3. Comment on the Issue with your findings.

### Step 2 — Immediate hotfix branch

```sh
git fetch --tags
git checkout -b fix/data-<country>-<record-id> origin/main
```

### Step 3 — Apply the minimum change

**Option A — Update the record** (if correct info is known):
```sh
# Edit data/countries/{cc}/{slug}.yaml
# Set verified_at to today
git add data/countries/{cc}/{slug}.yaml
git commit -m "fix(data): update {record-id} — <one-line reason>"
```

**Option B — Remove the record** (if the service is closed):
```sh
git rm data/countries/{cc}/{slug}.yaml
git commit -m "fix(data): remove {record-id} — service closed as of {date}"
```

### Step 4 — PR with `urgent` label

```sh
gh pr create \
  --base main \
  --title "fix(data): {record-id} — <short description>" \
  --label urgent \
  --body "Fixes #<issue>. Verified by <your-name> on <YYYY-MM-DD>. Source: <URL>"
```

### Step 5 — Fast-track merge

- Single maintainer approval is sufficient for P0.
- Merge immediately after approval.

### Step 6 — Post-incident

After the release is published:
1. Close the Issue with a comment: "Fixed in v{version}. Record updated/removed."
2. Update this runbook if the incident reveals a gap in process.

---

## Security vulnerability in code

### Scope

Code vulnerabilities in `packages/core`, `packages/mcp`, or `packages/python`
that could affect consumers of the npm or PyPI packages.

### Disclosure

**Do not open a public Issue.** Use [GitHub Security Advisories](https://github.com/Kouki-odaka/open-helplines/security/advisories/new):

1. Open a draft advisory.
2. Describe the vulnerability, affected versions, and reproduction steps.
3. Coordinate a fix in a private fork.
4. Publish the advisory and release a patched version simultaneously (coordinated disclosure).

### Severity guide (CVSS)

| CVSS | Disclosure timeline |
|------|---------------------|
| Critical (9.0–10.0) | Fix ASAP, disclose within 48 hours |
| High (7.0–8.9) | Fix within 7 days, disclose at release |
| Medium / Low | Fix in next regular release |

---

## Post-incident review

For all P0 and P1 incidents, complete a brief post-mortem within 1 week:

```markdown
## Post-mortem: {record-id} / {date}

**What happened**: 
**How it was detected**: 
**Time to fix**: 
**Root cause**: 
**Prevention**: 
```

Add the post-mortem to the GitHub Issue thread. If it reveals a systemic gap
(e.g., CI not catching a class of error), open a follow-up Issue or PR to
address it.
