# CI Preflight typecheck failure — root cause and fix

## Symptom

`Validate PR / Preflight — lint + typecheck` fails on every PR with:

```
src/guardrails.ts(13,37): error TS2307: Cannot find module '@open-helplines/core' or its corresponding type declarations.
src/registry.ts(10,37): error TS2307: Cannot find module '@open-helplines/core' or its corresponding type declarations.
... (5 × TS2307)
```

Downstream `validate-matrix` jobs are skipped because preflight is a required gate.

## Root cause

`packages/mcp` imports from `@open-helplines/core`.  
TypeScript resolves the import via the npm workspace symlink:

```
node_modules/@open-helplines/core → ../../packages/core
```

It then reads `packages/core/package.json`:

```json
{
  "types": "dist/index.d.ts"
}
```

In a **fresh CI checkout** there is no `packages/core/dist/` — the repo only contains source files.  
The previous root `typecheck` script ran `tsc --noEmit` for all workspaces in parallel; `--noEmit` deliberately produces no output files, so `dist/index.d.ts` is never created.  
Result: `packages/mcp` typecheck fails with TS2307 on every PR run.

**Why it didn't fail locally**: developers already have `packages/core/dist/` from earlier `npm run build` runs.

**Structural note**: `packages/mcp/tsconfig.json` correctly declares a TypeScript Project Reference:

```json
"references": [{ "path": "../core" }]
```

The reference is architecturally correct but is only honoured by `tsc --build` mode, not by `--noEmit` standalone runs.

## Fix (applied in this commit)

`package.json` (root), `scripts.typecheck`:

```diff
- "typecheck": "npm run typecheck --workspaces --if-present",
+ "typecheck": "npm run build -w packages/core && npm run typecheck --workspaces --if-present",
```

`npm run build -w packages/core` compiles `packages/core` (emitting `dist/index.d.ts`) before any workspace typecheck runs. Core is also type-checked as a side-effect of the build step.

This fixes both CI (fresh clone) and local development (after a `git clean -fdx`).

## Alternatives considered

| Option | Verdict |
|--------|---------|
| Fix `_validate.yml` Preflight step only | CI-only fix; local `npm run typecheck` stays broken → rejected |
| Add root `tsconfig.json` + `tsc -b --noEmit` | `tsc --build --noEmit` does not generate `.d.ts` for referenced projects in TS 5.x → same failure would recur |

## How to investigate future Preflight failures

1. Get the failing run ID from the PR checks UI or `gh pr checks <N> --repo Kouki-odaka/open-helplines`.
2. Fetch the logs: `gh run view <RUN_ID> --log-failed --repo Kouki-odaka/open-helplines`.
3. Look for `TS2307 Cannot find module` errors → missing build artifact.
4. Look for `ESLint` errors → lint rule violation in `packages/*/src`.
5. Reproduce locally by deleting `packages/core/dist` and running `npm run typecheck`.
