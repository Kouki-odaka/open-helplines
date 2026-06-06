// SPDX-License-Identifier: Apache-2.0

/**
 * Validator module — Strategy + Chain of Responsibility pattern
 *
 * Validates HelplineRecord objects against the JSON Schema and business rules.
 */

export type { ValidationResult, ValidationError, Result } from "./types.js";
export type { Validator } from "./validator-chain.js";
export { ValidatorChain } from "./validator-chain.js";
export { loadHelplineFile, loadRecords } from "./loader.js";
export type { HelplineDataFile } from "./loader.js";
