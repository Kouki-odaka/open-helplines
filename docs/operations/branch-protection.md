# Branch Protection Configuration

> **GitHub UI setup required.** Branch protection rules cannot be set via API without
> admin tokens. Apply these settings manually at:
> `Settings → Branches → Add rule` for the `main` branch.

## Main Branch (`main`) — Required Settings

### Protect matching branches

| Setting | Value | Rationale |
|---------|-------|-----------|
| Require a pull request before merging | ✅ Enabled | No direct pushes to main |
| Required approvals | **1** | At least one human review |
| Dismiss stale reviews on new commits | ✅ Enabled | Force re-review after updates |
| Require review from code owners | ✅ Enabled | CODEOWNERS enforced on data/ + schemas/ + .github/ |
| Require status checks to pass | ✅ Enabled | See required checks below |
| Require branches to be up to date | ✅ Enabled | Prevents stale-base merges |
| Require conversation resolution | ✅ Enabled | All review comments must be resolved |
| Require signed commits | ✅ Enabled | Supply chain integrity |
| Do not allow bypassing the above settings | ✅ Enabled | Applies to admins too |
| Allow force pushes | ❌ Disabled | History immutability |
| Allow deletions | ❌ Disabled | Main branch cannot be deleted |

### Required Status Checks (must pass before merge)

These are the job names as reported by GitHub Actions:

```
Preflight — lint + typecheck
Validate [jp]
Validate [us]
Validate [gb]
Validate [cn]
Validate [in]
Validate [id]
Validate [br]
Validate [mx]
Validate [pk]
Validate [bd]
Validate [ru]
Validate [de]
Validate [fr]
Validate [eg]
Validate [ng]
Validate [ph]
Validate [vn]
Validate [kr]
Validate [tr]
Validate [ca]
Cross-cutting — index integrity + Python
Secret Scan (Gitleaks)
```

> **Note:** The `External URL health check (bulkhead)` job uses `continue-on-error: true`
> and is **NOT** a required status check — it is informational only.

## Tag Protection (`v*`)

Create a tag protection rule for `v*` to prevent manual tag creation:

`Settings → Tags → Add rule` → Pattern: `v*`

This ensures only the semantic-release bot (via `secrets.GITHUB_TOKEN`) can
create version tags during the release workflow.

## Secrets Required

Configure these repository secrets before the first release:

| Secret | Required | Used By | Notes |
|--------|----------|---------|-------|
| `NPM_TOKEN` | ✅ Yes | `release.yml` → `_publish.yml` | Granular npm access token for `@open-helplines/core` |
| `GITLEAKS_LICENSE` | Optional | `gitleaks.yml` | Enables team features; community plan works without it |

## Environments Required

Configure these GitHub Environments for deployment gates:

### `pypi` environment

`Settings → Environments → New environment` → Name: `pypi`

| Setting | Value |
|---------|-------|
| Deployment branches | `main` only |
| Required reviewers | (optional — leave empty for automated releases) |
| PyPI Trusted Publisher | Configure at https://pypi.org/manage/account/publishing/ |

**PyPI Trusted Publisher configuration:**

| Field | Value |
|-------|-------|
| Owner | `Kouki-odaka` |
| Repository | `open-helplines` |
| Workflow filename | `_publish.yml` |
| Environment name | `pypi` |

### `github-pages` environment

Auto-created when Pages is first enabled. No additional configuration needed.

## Repository Settings

Additional settings to configure in `Settings → General`:

| Setting | Value |
|---------|-------|
| Allow merge commits | ❌ Disabled (squash + rebase only) |
| Allow squash merging | ✅ Enabled |
| Default commit message | Pull request title and description |
| Allow rebase merging | ✅ Enabled |
| Automatically delete head branches | ✅ Enabled |
| Allow auto-merge | ✅ Enabled |

## Verification Checklist

After applying settings, verify with a test PR:

- [ ] Push to `main` directly returns "protected branch" error
- [ ] PR without status checks cannot merge
- [ ] `Validate [jp]` (and all other country checks) appear as required checks
- [ ] `External URL health check (bulkhead)` does NOT block merge when it fails
- [ ] CODEOWNERS review request auto-triggers on `data/` changes
- [ ] Secrets `NPM_TOKEN` and `GITLEAKS_LICENSE` (optional) are set
- [ ] PyPI Trusted Publisher is configured for the `pypi` environment
