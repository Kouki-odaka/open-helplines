# OIDC Setup — npm Provenance + PyPI Trusted Publishing

One-time setup required before the first release can publish to npm and PyPI.

## npm — Granular Access Token + OIDC Provenance

### 1. Create a Granular Access Token on npmjs.com

1. Log in to https://www.npmjs.com
2. Navigate to **Account Settings → Access Tokens → Generate New Token**
3. Select **Granular Access Token**
4. Settings:
   - Token name: `open-helplines-ci`
   - Expiration: 365 days (renew annually)
   - Permissions: **Read and write** on packages
   - Packages: `@open-helplines/core` (or `@open-helplines/*` for all scoped packages)
5. Copy the token value

### 2. Add Token as GitHub Repository Secret

```bash
gh secret set NPM_TOKEN --body "<token-value>" \
  --repo Kouki-odaka/open-helplines
```

Or via GitHub UI: `Settings → Secrets and variables → Actions → New repository secret`

- Name: `NPM_TOKEN`
- Value: `<token from step 1>`

### 3. npm Provenance (OIDC) — How It Works

The `_publish.yml` workflow uses `npm publish --provenance` with `NODE_AUTH_TOKEN`.
This generates a signed provenance attestation on npm automatically — no extra
configuration needed beyond the token.

Verify after first publish:
```bash
npm view @open-helplines/core dist-tags
# Provenance visible at: https://www.npmjs.com/package/@open-helplines/core?activeTab=provenance
```

---

## PyPI — Trusted Publishing (OIDC, no long-lived secrets)

PyPI Trusted Publishing uses GitHub's OIDC to authenticate — no API tokens needed.

### 1. Create a PyPI Project (first time only)

If `open-helplines` doesn't exist on PyPI yet, publish manually once:

```bash
cd ~/tools/open-helplines
pip install build twine
python -m build packages/python --outdir dist/
twine upload dist/* --username __token__ --password <pypi-api-token>
```

This creates the project and establishes ownership.

### 2. Configure Trusted Publisher on PyPI

1. Log in to https://pypi.org
2. Go to your project: https://pypi.org/manage/project/open-helplines/settings/
3. Scroll to **"Trusted Publishers"** → **"Add a new publisher"**
4. Fill in:

| Field | Value |
|-------|-------|
| Owner | `Kouki-odaka` |
| Repository name | `open-helplines` |
| Workflow filename | `_publish.yml` |
| Environment name | `pypi` |

5. Click **Add**

### 3. Create `pypi` Environment in GitHub

```bash
gh api repos/Kouki-odaka/open-helplines/environments/pypi \
  --method PUT \
  --field wait_timer=0 \
  --silent
```

Or via GitHub UI:
1. `Settings → Environments → New environment`
2. Name: `pypi`
3. Deployment branches: **Selected branches** → `main` only
4. Required reviewers: (leave empty for automated releases)

### 4. Verify Setup

After the first automated release:

```bash
# Check PyPI attestations
pip download open-helplines==<version> --dest /tmp/test
# Provenance visible at: https://pypi.org/project/open-helplines/<version>/#provenance
```

---

## GitHub Pages — No Extra Configuration

GitHub Pages deployment uses OIDC automatically via the `github-pages` environment,
which is created when Pages is first enabled.

To enable Pages:
1. `Settings → Pages`
2. Source: **GitHub Actions**
3. The first successful `release.yml` run will deploy automatically

---

## Verification Checklist

- [ ] `NPM_TOKEN` secret set in repository secrets
- [ ] PyPI Trusted Publisher configured for `_publish.yml` + `pypi` environment
- [ ] `pypi` GitHub Environment created with `main`-only deployment branches
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] Test release triggers successfully (push a `feat:` commit to main)
