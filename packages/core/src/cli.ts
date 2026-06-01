// SPDX-License-Identifier: Apache-2.0

/**
 * CLI entry point for @open-helplines/core.
 *
 * Commands:
 *   validate   — validate all country data files against the JSON Schema
 *
 * Exit codes:
 *   0   all files pass validation
 *   1   one or more files fail validation (or unexpected error)
 */

import { readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { loadHelplineFile } from "./validator/loader.js";
import { ValidatorChain } from "./validator/validator-chain.js";
import { SchemaValidator } from "./validator/validators/schema-validator.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA_DIR = "data/countries";
const SCHEMA_PATH = "schemas/helpline.schema.json";
const HELPLINES_FILE = "helplines.json";

// ---------------------------------------------------------------------------
// CLI router
// ---------------------------------------------------------------------------

const [, , command] = process.argv;

if (command === "validate") {
  runValidate();
} else {
  console.error(`Unknown command: ${command ?? "(none)"}`);
  console.error("Usage: node dist/cli.js validate");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// validate command
// ---------------------------------------------------------------------------

function runValidate(): void {
  const repoRoot = findRepoRoot();
  const dataDir = join(repoRoot, DATA_DIR);
  const schemaPath = join(repoRoot, SCHEMA_PATH);

  if (!existsSync(schemaPath)) {
    console.error(`Schema not found: ${schemaPath}`);
    process.exit(1);
  }

  const chain = new ValidatorChain().add(new SchemaValidator(schemaPath));

  const countries = readdirSync(dataDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const results = countries.map((country) =>
    validateCountry(country, dataDir, chain),
  );

  const totalFiles = results.length;
  const failedFiles = results.filter((r) => !r.ok).length;
  const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);

  printSummary(totalFiles, failedFiles, totalRecords, totalErrors);
  process.exit(failedFiles > 0 || totalErrors > 0 ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Per-country validation
// ---------------------------------------------------------------------------

interface CountryResult {
  ok: boolean;
  recordCount: number;
  errorCount: number;
}

function validateCountry(
  country: string,
  dataDir: string,
  chain: ValidatorChain,
): CountryResult {
  const filePath = join(dataDir, country, HELPLINES_FILE);

  if (!existsSync(filePath)) {
    return { ok: true, recordCount: 0, errorCount: 0 };
  }

  const loaded = loadHelplineFile(filePath);
  if (!loaded.ok) {
    const msgs = loaded.errors.map((e: { path: string; message: string }) => `  ${e.path}: ${e.message}`).join("\n");
    console.error(`[FAIL] ${country}: file load error\n${msgs}`);
    return { ok: false, recordCount: 0, errorCount: loaded.errors.length };
  }

  const records = loaded.value.records;
  const results = chain.validateBatch(records);

  let errorCount = 0;
  results.forEach((result: { valid: boolean; errors: { path: string; message: string }[]; warnings: { path: string; message: string }[] }, index: number) => {
    if (!result.valid) {
      const id = records[index]?.id ?? `record[${index}]`;
      result.errors.forEach((err: { path: string; message: string }) => {
        console.error(`[FAIL] ${country}/${id}${err.path}: ${err.message}`);
        errorCount++;
      });
    }
    result.warnings.forEach((warn: { path: string; message: string }) => {
      const id = records[index]?.id ?? `record[${index}]`;
      console.warn(`[WARN] ${country}/${id}${warn.path}: ${warn.message}`);
    });
  });

  if (errorCount === 0) {
    console.log(`[PASS] ${country}: ${records.length} record(s) valid`);
  }

  return { ok: errorCount === 0, recordCount: records.length, errorCount };
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

function printSummary(
  totalFiles: number,
  failedFiles: number,
  totalRecords: number,
  totalErrors: number,
): void {
  const passedFiles = totalFiles - failedFiles;
  console.log(
    `\nValidation complete: ${passedFiles}/${totalFiles} countries passed, ` +
      `${totalRecords} records checked, ${totalErrors} error(s)`,
  );
}

// ---------------------------------------------------------------------------
// Repo root detection
// ---------------------------------------------------------------------------

function findRepoRoot(): string {
  // Walk up from the compiled dist/ directory until we find schemas/helpline.schema.json
  // __dirname is available in CommonJS (Node16 output without "type":"module")
  const startDir = resolve(__dirname);
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, SCHEMA_PATH))) return dir;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: cwd
  return process.cwd();
}
