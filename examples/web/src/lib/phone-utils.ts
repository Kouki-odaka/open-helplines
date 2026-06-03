/**
 * Phone number formatting utilities for the Emergency Banner.
 *
 * Extracted from EmergencyBanner.tsx so the pure logic can be unit-tested
 * without a React rendering environment.
 */

/**
 * Exact-match lookup table: E.164 string → display label.
 *
 * Listed before any generic stripping so short-code pseudo-numbers such as
 * +1988 (+1 country-prefix fused with short-code 988) are returned correctly
 * instead of being mangled by the greedy country-code strip regex.
 */
const PHONE_DISPLAY_EXACT: Readonly<Record<string, string>> = {
  // United States
  '+1988': '988',
  '+18002738255': '988',
  // Brazil — CVV Ligue 188
  '+55188': '188',
  // France — 3114 Numéro national prévention suicide
  '+333114': '3114',
  // United Kingdom — Samaritans
  '+44116123': '116 123',
  // Japan — Yorisoi Hotline
  '+81120279338': '0120-279-338',
  // Germany — Telefonseelsorge
  '+498001110111': '0800 111 0 111',
  // Australia — Lifeline
  '+61131114': '13 11 14',
  // New Zealand — Lifeline Aotearoa
  '+640800543354': '0800 543 354',
  // Korea — 109 Suicide Prevention Crisis Line (consolidated Jan 2024)
  '+82109': '109',
  // India — Tele MANAS
  '+9114416': '14416',
  // Indonesia — Into The Light (119)
  '+62119': '119',
  // Philippines — NCMH Crisis Hotline (1553)
  '+6321553': '1553',
};

/**
 * Formats an E.164 phone number for human-readable display in the banner.
 *
 * Resolution order:
 *   1. Exact-match dictionary (handles short-code pseudo-E.164 like +1988)
 *   2. Generic country-code strip → last 7 digits fallback
 *
 * @param e164 - E.164 phone number string (e.g. "+18002738255")
 * @returns Human-readable label (e.g. "988", "116 123", "0120-279-338")
 */
export function formatPhoneDisplay(e164: string): string {
  // 1. Exact-match first — prevents greedy strip from mangling short codes
  const exact = PHONE_DISPLAY_EXACT[e164];
  if (exact !== undefined) {
    return exact;
  }

  // 2. Generic fallback: strip leading +<1-3 digits> country code
  const stripped = e164.replace(/^\+[0-9]{1,3}/, '');

  // Short residuals (≤ 4 digits) are already display-ready
  if (stripped.length <= 4) {
    return stripped;
  }

  // Last 7 digits for longer numbers
  return stripped.slice(-7);
}

/**
 * Returns the `tel:` href value for an emergency contact.
 *
 * Prefers `dialable` (local short-code) over raw `phone` so that services
 * such as 988 (US/CA), 188 (BR), and 3114 (FR) can be reached with a single
 * tap without the OS mis-routing the call as an international E.164 number.
 *
 * @param phone    - E.164 phone string from EmergencyContact.phone
 * @param dialable - Optional local short-code from EmergencyContact.dialable
 */
export function buildTelHref(phone: string, dialable?: string): string {
  return `tel:${dialable ?? phone}`;
}
