// SPDX-License-Identifier: Apache-2.0

/**
 * SchemaValidator — validates a HelplineRecord against the JSON Schema
 * (schemas/helpline.schema.json) using Ajv Draft 2020-12.
 *
 * Strategy pattern: this class is one Strategy in the ValidatorChain.
 */

// Ajv Draft 2020-12 — must use Ajv2020 variant, not the default (Draft 7) variant
import Ajv2020, { type ErrorObject } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync } from "node:fs";
import type { HelplineRecord } from "../../types/helpline.js";
import type { ValidationError, ValidationResult, Validator } from "../index.js";

// ---------------------------------------------------------------------------
// Ajv singleton per schema path (avoid repeated compilation)
// ---------------------------------------------------------------------------

const compiledRecordValidators = new Map<string, ReturnType<Ajv2020["compile"]>>();
const compiledRootValidators = new Map<string, ReturnType<Ajv2020["compile"]>>();

function buildAjv(): Ajv2020 {
  // strict: false — schema has non-standard annotation keywords (e.g. "version")
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv;
}

function loadSchema(schemaPath: string): Record<string, unknown> {
  const schemaContent = readFileSync(schemaPath, "utf8");
  return JSON.parse(schemaContent) as Record<string, unknown>;
}

function getCompiledValidator(schemaPath: string): ReturnType<Ajv2020["compile"]> {
  const cached = compiledRecordValidators.get(schemaPath);
  if (cached !== undefined) return cached;

  const schema = loadSchema(schemaPath);
  // Compile the HelplineRecord sub-schema (not the root HelplineDataFile)
  const recordSchema = extractRecordSchema(schema);
  const compiled = buildAjv().compile(recordSchema);
  compiledRecordValidators.set(schemaPath, compiled);
  return compiled;
}

function getCompiledRootValidator(schemaPath: string): ReturnType<Ajv2020["compile"]> {
  const cached = compiledRootValidators.get(schemaPath);
  if (cached !== undefined) return cached;

  // Compile root schema: validates the full HelplineDataFile (country + records)
  const compiled = buildAjv().compile(loadSchema(schemaPath));
  compiledRootValidators.set(schemaPath, compiled);
  return compiled;
}

function extractRecordSchema(schema: Record<string, unknown>): object {
  const defs = schema["$defs"] as Record<string, unknown> | undefined;
  if (defs?.["HelplineRecord"]) {
    // Inline $defs into the record schema so Ajv resolves $ref correctly
    return { ...schema, $ref: "#/$defs/HelplineRecord" };
  }
  return schema;
}

// ---------------------------------------------------------------------------
// SchemaValidator
// ---------------------------------------------------------------------------

export class SchemaValidator implements Validator {
  readonly name = "SchemaValidator";
  private readonly validateFn: ReturnType<Ajv2020["compile"]>;

  constructor(schemaPath: string) {
    this.validateFn = getCompiledValidator(schemaPath);
  }

  validate(record: HelplineRecord): ValidationResult {
    const isValid = this.validateFn(record);

    if (isValid) {
      return { valid: true, errors: [], warnings: [] };
    }

    const errors = (this.validateFn.errors ?? []).map(convertAjvError);
    return {
      valid: false,
      errors: errors.filter((e) => e.severity === "error"),
      warnings: errors.filter((e) => e.severity === "warning"),
    };
  }
}

// ---------------------------------------------------------------------------
// Ajv → ValidationError conversion
// ---------------------------------------------------------------------------

function convertAjvError(ajvError: ErrorObject): ValidationError {
  return {
    path: ajvError.instancePath || "/",
    code: `SCHEMA_${ajvError.keyword.toUpperCase()}`,
    message: buildMessage(ajvError),
    severity: "error",
  };
}

function buildMessage(ajvError: ErrorObject): string {
  const fieldPath = ajvError.instancePath || "(root)";
  return `${fieldPath} ${ajvError.message ?? "failed schema validation"}`;
}

// ---------------------------------------------------------------------------
// Root-level file validation (HelplineDataFile — country + records)
// ---------------------------------------------------------------------------

/**
 * Validate a full helpline data file against the root HelplineDataFile schema.
 * Catches errors invisible to per-record validation:
 *   - country code not matching ^[A-Z]{2}$ (e.g. lowercase "us")
 *   - records array empty (minItems: 1)
 *
 * @internal — exported for CLI and unit-test use only
 */
export function validateHelplineFileRoot(
  schemaPath: string,
  fileData: unknown,
): ValidationError[] {
  const validate = getCompiledRootValidator(schemaPath);
  const isValid = validate(fileData);
  if (isValid) return [];
  return (validate.errors ?? []).map(convertAjvError);
}
