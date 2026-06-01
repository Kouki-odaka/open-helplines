/**
 * Validator module — Strategy + Chain of Responsibility pattern
 *
 * Validates HelplineRecord objects against the JSON Schema and business rules.
 * Detailed implementation lives in Task #7 (se-core).
 * This file is the public interface stub.
 */

export type { ValidationResult, ValidationError } from "./types.js";
export { HelplineValidator } from "./helpline-validator.js";
