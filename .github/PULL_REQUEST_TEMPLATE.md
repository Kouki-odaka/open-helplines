## Summary

<!-- One sentence describing what this PR does -->

## Type

- [ ] Data addition / update (`data/`)
- [ ] Schema change (`schemas/`)
- [ ] Code change (`packages/`)
- [ ] Documentation
- [ ] CI / tooling

## Data changes (if applicable)

- **Country**: <!-- ISO 3166-1 alpha-2 -->
- **Records added / updated / removed**: <!-- count -->
- **Verification source**: <!-- URL or citation -->
- **Last verified date**: <!-- YYYY-MM-DD -->

## Checklist

- [ ] All new/modified JSON files pass `npm run validate`
- [ ] Phone numbers are in E.164 format
- [ ] `verified_at` is set to a date within the last 12 months
- [ ] No personally identifiable information (PII) included
- [ ] `source` field points to an accessible, authoritative URL
- [ ] Tests pass (`npm test`)

## Safety note

<!-- If this PR includes crisis hotlines, confirm that all numbers have been
     manually verified as operational. Stale numbers can harm people in crisis. -->
