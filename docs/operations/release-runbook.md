# Release Runbook

## Overview

Releases are triggered automatically when code is merged to `main`.
semantic-release analyzes commit messages, determines the version bump,
generates release notes, updates `CHANGELOG.md`, and tags the release.
GitHub Actions then builds and publishes to npm, PyPI, and GitHub Pages.

**You do not need to bump versions or write release notes manually.**

---

## Normal release

### 1. Merge a PR to `main`

```sh
# Ensure your branch is up to date
git fetch origin
git rebase origin/main

# Merge via GitHub UI or CLI
gh pr merge <PR number> --squash --delete-branch
```

semantic-release determines the version bump from commit types:

| Commit prefix | Version bump |
|---------------|-------------|
| `fix:`, `data:`, `perf:` | patch (0.0.x) |
| `feat:` | minor (0.x.0) |
| `BREAKING CHANGE:` in footer | major (x.0.0) |
| `docs:`, `chore:`, `ci:`, `test:` | no release |

### 2. Monitor the Release workflow

```sh
gh run watch --workflow release.yml
```

Or in the GitHub UI: **Actions → Release**.

### 3. Confirm publication

```sh
# npm
npm view @open-helplines/core version

# PyPI
pip index versions open-helplines

# GitHub release
gh release view --json tagName,publishedAt
```

---

## Hotfix release

Use this procedure when a critical bug or stale/harmful data is discovered
and must be released outside the normal PR flow.

### 1. Create a hotfix branch from the release tag

```sh
git fetch --tags
git checkout -b hotfix/<short-description> v<last-release-tag>
```

### 2. Apply the minimum necessary fix

```sh
# Edit only what is needed
git add <changed files>
git commit -m "fix(<scope>): <description of the fix>"
```

### 3. Open a PR targeting `main`

```sh
gh pr create \
  --base main \
  --title "fix(<scope>): <description>" \
  --body "Hotfix for <issue URL>. See docs/operations/incident-response.md."
```

### 4. Fast-track review

- Tag the PR with `urgent` and `hotfix`.
- Request review from at least one other maintainer.
- For critical safety issues (wrong phone number in crisis line), a single
  maintainer approval is sufficient to merge.

### 5. Merge and monitor

Same as normal release — merge to `main`, watch the Release workflow,
confirm publication.

---

## Rollback

semantic-release does not support automated rollback. If a release causes
problems, the remediation steps depend on the issue type.

### Data error (wrong phone number, stale record)

1. Open a data-correction PR immediately (see [incident-response.md](incident-response.md)).
2. Do **not** unpublish the npm/PyPI package — consumers who pinned the version
   will break. Instead, release a corrected patch version.

### Code bug in `@open-helplines/core` or MCP server

1. Deprecate the broken version on npm: `npm deprecate @open-helplines/core@<version> "Critical bug — upgrade to <next version>"`
2. Release a corrected patch as above.
3. If the bug is a security vulnerability, follow [GitHub Security Advisory](https://github.com/Kouki-odaka/open-helplines/security/advisories/new) disclosure.

### Accidental publish (wrong content)

1. For npm: `npm unpublish @open-helplines/core@<version>` (only within 72 hours).
2. For PyPI: Contact PyPI support — PyPI does not support unpublish after download.
3. For GitHub release: Delete via `gh release delete v<version>` and re-tag if needed.

---

## Pre-release / beta

To release a beta without triggering production publish:

1. Create a branch named `beta` or `next`.
2. Add it to `.releaserc.json` `branches` array:
   ```json
   { "name": "beta", "prerelease": true }
   ```
3. Merge commits to `beta` — semantic-release will publish as `0.2.0-beta.1`, etc.

---

## Semantic-release devDependencies

The Release workflow uses `npx semantic-release` — it installs plugins at runtime.
Ensure the following are listed in `package.json` devDependencies or installed globally:

```json
{
  "devDependencies": {
    "semantic-release": "^24.0.0",
    "@semantic-release/changelog": "^6.0.0",
    "@semantic-release/git": "^10.0.0",
    "@semantic-release/release-notes-generator": "^14.0.0",
    "conventional-changelog-conventionalcommits": "^8.0.0"
  }
}
```
