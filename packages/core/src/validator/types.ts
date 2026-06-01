/**
 * Shared types for the validator subsystem
 */

export interface ValidationError {
  /** JSON Pointer path to the failing field */
  path: string;
  /** Machine-readable error code */
  code: string;
  /** Human-readable description */
  message: string;
  /** Severity level */
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
