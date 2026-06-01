// SPDX-License-Identifier: Apache-2.0

/**
 * Validator interface (Strategy pattern) and ValidatorChain (Chain of Responsibility).
 *
 * Each Validator implements a single validation rule — the Strategy pattern ensures
 * rules are independently testable and composable.
 *
 * ValidatorChain collects validators and runs them in insertion order.
 * All validators run even when earlier ones fail (allErrors semantics).
 */

import type { HelplineRecord } from "../types/helpline.js";
import type { ValidationError, ValidationResult } from "./types.js";

// ---------------------------------------------------------------------------
// Strategy: single-record validator contract
// ---------------------------------------------------------------------------

export interface Validator {
  /** Stable identifier used in logs and error attribution */
  readonly name: string;
  validate(record: HelplineRecord): ValidationResult;
}

// ---------------------------------------------------------------------------
// Chain of Responsibility: ordered validator pipeline
// ---------------------------------------------------------------------------

export class ValidatorChain {
  private readonly validators: Validator[] = [];

  /** Append a validator and return `this` for fluent chaining */
  add(validator: Validator): this {
    this.validators.push(validator);
    return this;
  }

  /** Run all validators against a single record and merge results */
  validate(record: HelplineRecord): ValidationResult {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    for (const validator of this.validators) {
      const result = validator.validate(record);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /** Validate an array of records; each result corresponds to the same index */
  validateBatch(records: HelplineRecord[]): ValidationResult[] {
    return records.map((record) => this.validate(record));
  }
}
