# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅ Yes    |

## Reporting a Vulnerability

We take security seriously in **open-helplines**. If you discover a security
vulnerability, please report it responsibly.

### Preferred: GitHub Private Vulnerability Reporting

Use GitHub's [private vulnerability reporting](https://github.com/Kouki-odaka/open-helplines/security/advisories/new):

1. Go to the **Security** tab of this repository
2. Click **"Report a vulnerability"**
3. Fill in the details

This keeps the report private until a fix is released.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

### Response Timeline

| Stage | SLA |
|-------|-----|
| Acknowledgement | 48 hours |
| Initial assessment | 5 business days |
| Fix + disclosure | 30 days (critical) / 90 days (others) |

## Scope

### In scope
- Vulnerabilities in `packages/core` or `packages/mcp` that could lead to code execution or data exfiltration
- Supply chain issues (compromised dependencies, workflow injection)
- Authentication bypasses in CI/CD pipeline

### Out of scope
- Accuracy of hotline data (use the [data issue template](.github/ISSUE_TEMPLATE/data-correction.md) instead)
- Availability of external hotline URLs
- GitHub Actions workflow linting issues

## Security Design Principles

This project follows defense-in-depth:
- All GitHub Actions are SHA-pinned (no mutable tags)
- npm publishes with OIDC provenance; PyPI uses Trusted Publishing
- CycloneDX SBOM + cosign signatures on each release
- Gitleaks scans all PRs and pushes for leaked secrets
- CODEOWNERS enforces review on `data/`, `schemas/`, `.github/`
