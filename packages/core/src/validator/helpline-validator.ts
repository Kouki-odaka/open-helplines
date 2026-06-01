/**
 * HelplineValidator — stub for Task #7 (se-core)
 *
 * Full implementation (Strategy + Chain of Responsibility) to be added by se-core agent.
 * This stub ensures the module graph compiles cleanly before Task #7 lands.
 */

import type { HelplineRecord } from "../types/helpline.js";
import type { ValidationResult } from "./types.js";

export class HelplineValidator {
  validate(_record: HelplineRecord): ValidationResult {
    throw new Error("Not implemented — pending Task #7 (se-core)");
  }

  validateBatch(_records: HelplineRecord[]): ValidationResult[] {
    throw new Error("Not implemented — pending Task #7 (se-core)");
  }
}
