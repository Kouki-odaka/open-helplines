// SPDX-License-Identifier: Apache-2.0

/**
 * SchemaValidator — validates a HelplineRecord against the JSON Schema
 * (schemas/helpline.schema.json) using Ajv Draft 2020-12.
 *
 * Strategy pattern: this class is one Strategy in the ValidatorChain.
 */

import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { readFileSync } from "node:fs";
import type { HelplineRecord } from "../../types/helpline.js";
import type { ValidationError, ValidationResult, Validator } from "../index.js";

// ---------------------------------------------------------------------------
// Ajv singleton per schema path (avoid repeated compilation)
// ---------------------------------------------------------------------------

const compiledValidators = new Map<string, ReturnType<Ajv["compile"]>>();

function getCompiledValidator(schemaPath: string): ReturnType<Ajv["compile"]> {
  const cached = compiledValidators.get(schemaPath);
  if (cached !== undefined) return cached;

  const ajv = new Ajv({ strict: true, allErrors: true });
  addFormats(ajv);

  const schemaContent = readFileSync(schemaPath, "utf8");
  const schema = JSON.parse(schemaContent) as Record<string, unknown>;

  // Compile the HelplineRecord sub-schema (not the root HelplineDataFile)
  const recordSchema = extractRecordSchema(schema);
  const compiled = ajv.compile(recordSchema);
  compiledValidators.set(schemaPath, compiled);
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
  private readonly validateFn: ReturnType<Ajv["compile"]>;

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
