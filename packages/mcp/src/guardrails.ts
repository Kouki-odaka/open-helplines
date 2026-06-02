// SPDX-License-Identifier: Apache-2.0
/**
 * Safe Answer MCP Guardrails — prevents stale data, misrouting, and hallucination.
 *
 * Guardrails (per task spec):
 *   1. Staleness check      — verified_at > 6 months → STALE_DATA warning
 *   2. Misroute prevention  — record.country ≠ requested country → refuse / warn
 *   3. Fallback chain       — no data → nearby country → IASP international
 *   4. Mandatory citation   — source + verified_at + last_checked_url_status
 *   5. Hallucination refusal — DATA_NOT_FOUND sentinel when not in registry
 */

import type { HelplineRecord } from "@open-helplines/core";
import type {
  Citation,
  GuardedHelplineRecord,
  GuardrailWarning,
  UrlStatus,
} from "./types.js";
import type { HelplinesRegistry } from "./registry.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STALENESS_THRESHOLD_MONTHS = 6;

/** IASP / Befrienders Worldwide international fallback records */
const INTERNATIONAL_FALLBACK_RECORDS: HelplineRecord[] = [
  {
    id: "intl-iasp",
    country: "XX",
    name: "IASP — International Association for Suicide Prevention",
    category: "suicide_prevention",
    contacts: [
      {
        method: "chat",
        url: "https://www.iasp.info/resources/Crisis_Centres/",
        languages: ["en"],
        hours: "24/7 (directory of national centres)",
        free: true,
        anonymous: true,
      },
    ],
    description:
      "Global directory of crisis and suicide prevention centres worldwide." +
      " Find your country's local helpline via the IASP resource page.",
    website: "https://www.iasp.info/resources/Crisis_Centres/",
    verified_at: "2026-06-01",
    source: "https://www.iasp.info/resources/Crisis_Centres/",
    government_backed: false,
    tags: ["international", "directory"],
  },
  {
    id: "intl-befrienders",
    country: "XX",
    name: "Befrienders Worldwide",
    category: "suicide_prevention",
    contacts: [
      {
        method: "chat",
        url: "https://www.befrienders.org/find-a-helpline",
        languages: ["en"],
        hours: "24/7 (directory)",
        free: true,
        anonymous: true,
      },
    ],
    description:
      "International network of emotional support helplines." +
      " Use their directory to locate your nearest centre.",
    website: "https://www.befrienders.org",
    verified_at: "2026-06-01",
    source: "https://www.befrienders.org/find-a-helpline",
    government_backed: false,
    tags: ["international", "directory"],
  },
];

/**
 * Continental / regional groupings for geographic fallback.
 * Values are listed in proximity order (closest first).
 */
const REGIONAL_NEIGHBOURS: Record<string, string[]> = {
  // East Asia
  JP: ["KR", "CN", "TW"],
  KR: ["JP", "CN"],
  CN: ["KR", "JP", "VN"],
  // Southeast Asia
  VN: ["PH", "TH", "ID", "CN"],
  PH: ["ID", "MY", "VN"],
  ID: ["MY", "PH", "AU"],
  // South Asia
  IN: ["BD", "PK", "LK"],
  BD: ["IN", "PK"],
  PK: ["IN", "BD"],
  // Middle East / Africa
  TR: ["EG", "DE"],
  EG: ["ZA", "TR"],
  NG: ["ZA", "EG"],
  ZA: ["NG", "EG"],
  // Europe
  DE: ["GB", "FR"],
  GB: ["IE", "FR", "DE"],
  FR: ["BE", "CH", "DE", "GB"],
  UA: ["DE", "PL"],
  RU: ["UA", "DE"],
  // Oceania
  AU: ["NZ", "PH", "ID"],
  NZ: ["AU"],
  // Americas
  US: ["CA", "MX"],
  CA: ["US"],
  MX: ["US", "BR"],
  BR: ["AR", "MX", "US"],
};

// ---------------------------------------------------------------------------
// Individual guardrail checks
// ---------------------------------------------------------------------------

function isStale(verifiedAt: string, now: Date): boolean {
  const verifiedDate = new Date(verifiedAt);
  const thresholdMs =
    STALENESS_THRESHOLD_MONTHS * 30.44 * 24 * 60 * 60 * 1000;
  return now.getTime() - verifiedDate.getTime() > thresholdMs;
}

/** Returns a STALE_DATA warning if verified_at is older than threshold. */
export function checkStaleness(
  record: HelplineRecord,
  now: Date = new Date(),
): GuardrailWarning | null {
  if (!isStale(record.verified_at, now)) return null;
  return {
    code: "STALE_DATA",
    message:
      `STALE_DATA: verified_at (${record.verified_at}) is older than ` +
      `${STALENESS_THRESHOLD_MONTHS} months. Verify this helpline is still active.`,
  };
}

/** Returns a DIFFERENT_COUNTRY_CONTEXT warning if record.country ≠ requestedCountry. */
export function checkCountryMismatch(
  record: HelplineRecord,
  requestedCountry: string,
): GuardrailWarning | null {
  const requested = requestedCountry.toUpperCase();
  if (record.country === requested || record.country === "XX") return null;
  return {
    code: "DIFFERENT_COUNTRY_CONTEXT",
    message:
      `DIFFERENT_COUNTRY_CONTEXT: This helpline serves ${record.country} ` +
      `but the request was for ${requested}. Confirm this is appropriate.`,
  };
}

/** Builds a mandatory citation object for a record. */
export function buildCitation(
  record: HelplineRecord,
  urlStatus: UrlStatus = "unchecked",
): Citation {
  return {
    source: record.source,
    verified_at: record.verified_at,
    last_checked_url_status: urlStatus,
  };
}

// ---------------------------------------------------------------------------
// Apply guardrails to a list of records
// ---------------------------------------------------------------------------

/** Attaches citation + guardrail warnings to each record. */
export function applyGuardrails(
  records: HelplineRecord[],
  requestedCountry: string,
  getUrlStatus: (url: string) => string,
  now: Date = new Date(),
): GuardedHelplineRecord[] {
  return records.map((record) => {
    const warnings: GuardrailWarning[] = [];

    const stalenessWarning = checkStaleness(record, now);
    if (stalenessWarning) warnings.push(stalenessWarning);

    const mismatchWarning = checkCountryMismatch(record, requestedCountry);
    if (mismatchWarning) warnings.push(mismatchWarning);

    const rawStatus = getUrlStatus(record.source);
    const urlStatus = toUrlStatus(rawStatus);

    return { ...record, citation: buildCitation(record, urlStatus), warnings };
  });
}

// ---------------------------------------------------------------------------
// Fallback chain
// ---------------------------------------------------------------------------

/**
 * Finds helpline records for nearby countries when the requested country
 * has no data in the registry.
 * Returns empty array if no neighbours have data either.
 */
export function findNearbyFallback(
  registry: HelplinesRegistry,
  requestedCountry: string,
): HelplineRecord[] {
  const neighbours =
    REGIONAL_NEIGHBOURS[requestedCountry.toUpperCase()] ?? [];
  for (const neighbour of neighbours) {
    const records = registry.getByCountry(neighbour);
    if (records && records.length > 0) return records;
  }
  return [];
}

/** Returns IASP / Befrienders international fallback records. */
export function getInternationalFallbacks(): HelplineRecord[] {
  return INTERNATIONAL_FALLBACK_RECORDS;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toUrlStatus(raw: string): UrlStatus {
  if (raw === "200") return "200";
  if (raw.startsWith("4")) return "4xx";
  if (raw.startsWith("5")) return "5xx";
  return "unchecked";
}
