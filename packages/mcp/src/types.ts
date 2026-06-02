// SPDX-License-Identifier: Apache-2.0
/**
 * MCP tool response types for Safe Answer guardrails.
 * All tool responses include mandatory citation metadata.
 */

import type { HelplineRecord } from "@open-helplines/core";

// ---------------------------------------------------------------------------
// URL Health Check status (Phase 3 — "unchecked" until CI workflow added)
// ---------------------------------------------------------------------------

export type UrlStatus = "200" | "4xx" | "5xx" | "unchecked";

// ---------------------------------------------------------------------------
// Mandatory citation (req 2: mandatory citation)
// ---------------------------------------------------------------------------

export interface Citation {
  /** Authoritative source URL for the helpline data */
  source: string;
  /** ISO 8601 date the record was last manually verified */
  verified_at: string;
  /** HTTP status of source URL from weekly health check, or 'unchecked' */
  last_checked_url_status: UrlStatus;
}

// ---------------------------------------------------------------------------
// Guardrail warning
// ---------------------------------------------------------------------------

export type WarningCode =
  | "STALE_DATA"
  | "DIFFERENT_COUNTRY_CONTEXT"
  | "FALLBACK_USED"
  | "FALLBACK_INTERNATIONAL";

export interface GuardrailWarning {
  code: WarningCode;
  message: string;
}

// ---------------------------------------------------------------------------
// Guarded record (HelplineRecord + guardrail metadata)
// ---------------------------------------------------------------------------

export interface GuardedHelplineRecord extends HelplineRecord {
  citation: Citation;
  warnings: GuardrailWarning[];
}

// ---------------------------------------------------------------------------
// DATA_NOT_FOUND sentinel (req 2: refuse hallucination)
// ---------------------------------------------------------------------------

export interface DataNotFoundResult {
  sentinel: "DATA_NOT_FOUND";
  reason: string;
  hint: "not in registry";
}

// ---------------------------------------------------------------------------
// Tool result discriminated union
// ---------------------------------------------------------------------------

export type FindHelplinesResult =
  | { found: true; records: GuardedHelplineRecord[]; total: number }
  | DataNotFoundResult;

export type GetHelplineByIdResult =
  | { found: true; record: GuardedHelplineRecord }
  | DataNotFoundResult;
