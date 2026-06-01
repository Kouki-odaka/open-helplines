// SPDX-License-Identifier: Apache-2.0

/**
 * CLI entry point for @open-helplines/core.
 *
 * Commands:
 *   validate [--country <cc>] [--schema <path>] [--output json]
 *     Validate country data files against the JSON Schema.
 *     --country  : only validate one country (ISO 3166-1 alpha-2, lowercase)
 *     --schema   : override schema path (default: schemas/helpline.schema.json)
 *     --output   : "json" emits machine-readable JSON; default is human text
 *
 * Exit codes:
 *   0   all files pass validation (or were skipped — no data file)
 *   1   one or more validation errors (or unexpected error)
 */

import { readdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { loadHelplineFile } from "./validator/loader.js";
import { ValidatorChain } from "./validator/validator-chain.js";
import { SchemaValidator } from "./validator/validators/schema-validator.js";
import type { ValidationError } from "./validator/types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_DATA_DIR = "data/countries";
const DEFAULT_SCHEMA_PATH = "schemas/helpline.schema.json";
const HELPLINES_FILE = "helplines.json";

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  command: string;
  country: string | null;
  schemaPath: string | null;
  outputJson: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const command = args[0] ?? "";
  let country: string | null = null;
  let schemaPath: string | null = null;
  let outputJson = false;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--country" && args[i + 1] !== undefined) {
      country = args[++i] ?? null;
    } else if (arg === "--schema" && args[i + 1] !== undefined) {
      schemaPath = args[++i] ?? null;
    } else if (arg === "--output" && args[i + 1] === "json") {
      outputJson = true;
      i++;
    }
  }

  return { command, country, schemaPath, outputJson };
}

// ---------------------------------------------------------------------------
// CLI router
// ---------------------------------------------------------------------------

const cliArgs = parseArgs();

if (cliArgs.command === "validate") {
  runValidate(cliArgs);
} else {
  console.error(`Unknown command: ${cliArgs.command || "(none)"}`);
  console.error("Usage: node dist/cli.js validate [--country <cc>] [--schema <path>] [--output json]");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// validate command
// ---------------------------------------------------------------------------

interface ValidationReport {
  country: string;
  status: "pass" | "fail" | "skip";
  records_checked: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

function runValidate(args: CliArgs): void {
  const repoRoot = findRepoRoot();
  const dataDir = join(repoRoot, DEFAULT_DATA_DIR);
  const schemaPath = args.schemaPath
    ? resolve(args.schemaPath)
    : join(repoRoot, DEFAULT_SCHEMA_PATH);

  if (!existsSync(schemaPath)) {
    console.error(`Schema not found: ${schemaPath}`);
    process.exit(1);
  }

  const chain = new ValidatorChain().add(new SchemaValidator(schemaPath));

  // Determine which countries to validate
  const allCountries = readdirSync(dataDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const targetCountries = args.country !== null
    ? [args.country]
    : allCountries;

  const reports: ValidationReport[] = targetCountries.map((cc) =>
    buildReport(cc, dataDir, chain),
  );

  const failCount = reports.filter((r) => r.status === "fail").length;

  if (args.outputJson) {
    emitJson(reports, args.country);
  } else {
    emitText(reports);
  }

  process.exit(failCount > 0 ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Per-country report
// ---------------------------------------------------------------------------

function buildReport(
  country: string,
  dataDir: string,
  chain: ValidatorChain,
): ValidationReport {
  const filePath = join(dataDir, country, HELPLINES_FILE);

  if (!existsSync(filePath)) {
    return { country, status: "skip", records_checked: 0, errors: [], warnings: [] };
  }

  const loaded = loadHelplineFile(filePath);
  if (!loaded.ok) {
    return {
      country,
      status: "fail",
      records_checked: 0,
      errors: loaded.errors,
      warnings: [],
    };
  }

  const records = loaded.value.records;
  const results = chain.validateBatch(records);

  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];

  results.forEach((result, idx) => {
    const id = records[idx]?.id ?? `record[${idx}]`;
    result.errors.forEach((e) => allErrors.push({ ...e, path: `/${id}${e.path}` }));
    result.warnings.forEach((w) => allWarnings.push({ ...w, path: `/${id}${w.path}` }));
  });

  return {
    country,
    status: allErrors.length > 0 ? "fail" : "pass",
    records_checked: records.length,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// ---------------------------------------------------------------------------
// Output formatters
// ---------------------------------------------------------------------------

function emitText(reports: ValidationReport[]): void {
  let totalErrors = 0;
  let totalRecords = 0;

  for (const r of reports) {
    totalRecords += r.records_checked;
    if (r.status === "pass") {
      console.log(`[PASS] ${r.country}: ${r.records_checked} record(s)`);
    } else if (r.status === "skip") {
      console.log(`[SKIP] ${r.country}: no data file`);
    } else {
      r.errors.forEach((e) => {
        console.error(`[FAIL] ${r.country}${e.path}: ${e.message}`);
        totalErrors++;
      });
    }
    r.warnings.forEach((w) => console.warn(`[WARN] ${r.country}${w.path}: ${w.message}`));
  }

  const passCount = reports.filter((r) => r.status === "pass").length;
  const skipCount = reports.filter((r) => r.status === "skip").length;
  console.log(
    `\nValidation complete: ${passCount} passed, ${skipCount} skipped, ` +
      `${totalRecords} records checked, ${totalErrors} error(s)`,
  );
}

function emitJson(reports: ValidationReport[], singleCountry: string | null): void {
  if (singleCountry !== null && reports.length === 1) {
    // Single-country mode: write validation-{cc}.json matching action contract
    const report = reports[0];
    if (report !== undefined) {
      const outPath = `validation-${singleCountry}.json`;
      writeFileSync(outPath, JSON.stringify(report, null, 2));
      console.log(JSON.stringify(report, null, 2));
    }
  } else {
    // All-countries mode: print array to stdout
    console.log(JSON.stringify(reports, null, 2));
  }
}

// ---------------------------------------------------------------------------
// Repo root detection
// ---------------------------------------------------------------------------

function findRepoRoot(): string {
  // Walk up from the compiled dist/ directory until we find schemas/helpline.schema.json
  // __dirname is available in CommonJS output (no "type":"module" in package.json)
  let dir = resolve(__dirname);
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, DEFAULT_SCHEMA_PATH))) return dir;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}
