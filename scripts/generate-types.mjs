/**
 * generate-types.mjs
 *
 * Generates TypeScript types from schemas/helpline.schema.json.
 * Output: packages/core/src/generated/helpline.generated.ts
 *
 * Run: npm run build:types
 * Requires: json-schema-to-typescript (devDependency)
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SCHEMA_PATH = resolve(REPO_ROOT, "schemas", "helpline.schema.json");
const OUTPUT_DIR = resolve(REPO_ROOT, "packages", "core", "src", "generated");
const OUTPUT_FILE = resolve(OUTPUT_DIR, "helpline.generated.ts");

async function main() {
  // Dynamically import json-schema-to-typescript (ESM-only in v14+)
  let compile;
  try {
    ({ compile } = await import("json-schema-to-typescript"));
  } catch {
    console.error(
      "json-schema-to-typescript not found. Run: npm install (root workspace)"
    );
    process.exit(1);
  }

  const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));

  const ts = await compile(schema, "HelplineSchema", {
    bannerComment:
      "/**\n * AUTO-GENERATED — do not edit manually.\n * Source: schemas/helpline.schema.json\n * Regenerate: npm run build:types\n */",
    additionalProperties: false,
    strictIndexSignatures: true,
    style: {
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      printWidth: 100,
    },
  });

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, ts, "utf8");
  console.log(`✓ Generated TypeScript types → ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
