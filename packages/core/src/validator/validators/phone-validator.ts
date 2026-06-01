// SPDX-License-Identifier: Apache-2.0

/**
 * PhoneValidator — checks that every phone/text contact has a valid E.164 number.
 *
 * Uses libphonenumber-js for authoritative E.164 validation beyond the schema
 * regex (e.g. detects valid-format but unallocated numbers).
 *
 * Strategy pattern: one rule, one validator.
 */

import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import type { HelplineRecord } from "../../types/helpline.js";
import type { ValidationError, ValidationResult, Validator } from "../index.js";

const PHONE_METHODS = new Set(["phone", "text"]);

export class PhoneValidator implements Validator {
  readonly name = "PhoneValidator";

  validate(record: HelplineRecord): ValidationResult {
    const errors: ValidationError[] = [];

    record.contacts.forEach((contact, contactIndex) => {
      if (!PHONE_METHODS.has(contact.method)) return;

      const contactPath = `/contacts/${contactIndex}`;

      if (!contact.number) {
        errors.push({
          path: `${contactPath}/number`,
          code: "PHONE_NUMBER_REQUIRED",
          message: `Contact method "${contact.method}" requires a 'number' field`,
          severity: "error",
        });
        return;
      }

      if (!validateE164(contact.number)) {
        errors.push({
          path: `${contactPath}/number`,
          code: "PHONE_INVALID_E164",
          message: `"${contact.number}" is not a valid E.164 phone number`,
          severity: "error",
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function validateE164(number: string): boolean {
  if (!number.startsWith("+")) return false;

  try {
    const parsed = parsePhoneNumber(number);
    return parsed.isValid() && isValidPhoneNumber(number);
  } catch {
    return false;
  }
}
