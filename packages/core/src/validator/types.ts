// SPDX-License-Identifier: Apache-2.0

/**
 * Shared types for the validator subsystem.
 *
 * Design patterns:
 * - Discriminated Union: ValidationError.severity ('error' | 'warning')
 * - Result Type: Result<T> avoids throwing for control flow
 */

export interface ValidationError {
  /** JSON Pointer path to the failing field, e.g. "/contacts/0/number" */
  path: string;
  /** Machine-readable error code, e.g. "PHONE_INVALID_E164" */
  code: string;
  /** Human-readable description */
  message: string;
  /** Severity — 'error' blocks publication; 'warning' is advisory only */
  severity: "error" | "warning";
}

export interface ValidationResult {
  /** True only when errors array is empty */
  valid: boolean;
  /** Blocking validation failures */
  errors: ValidationError[];
  /** Non-blocking advisory notices */
  warnings: ValidationError[];
}

/**
 * Result<T> — structured alternative to throwing exceptions.
 *
 * Use when a function can fail with domain-level errors:
 *   const result = loadHelplineFile(path);
 *   if (!result.ok) { ... result.errors ... }
 */
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationError[] };
