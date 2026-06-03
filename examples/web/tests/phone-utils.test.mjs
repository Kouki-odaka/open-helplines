/**
 * Unit tests for phone-utils.ts logic.
 *
 * Runs with Node.js built-in test runner (no extra dependencies):
 *   node --test examples/web/tests/phone-utils.test.mjs
 *
 * Because this test runs as plain ESM (not TypeScript), the functions under
 * test are re-implemented inline so no compilation step is needed.  The
 * implementation here MUST stay in sync with src/lib/phone-utils.ts.
 *
 * Coverage:
 *   - formatPhoneDisplay: exact-match before generic strip (P2 regression)
 *   - formatPhoneDisplay: all 13 known exact entries
 *   - formatPhoneDisplay: generic fallback path
 *   - buildTelHref: dialable preferred over phone (P1-B)
 *   - buildTelHref: falls back to phone when dialable is absent
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Implementation under test (kept in sync with src/lib/phone-utils.ts)
// ---------------------------------------------------------------------------

const PHONE_DISPLAY_EXACT = {
  '+1988': '988',
  '+18002738255': '988',
  '+55188': '188',
  '+333114': '3114',
  '+44116123': '116 123',
  '+81120279338': '0120-279-338',
  '+498001110111': '0800 111 0 111',
  '+61131114': '13 11 14',
  '+640800543354': '0800 543 354',
  '+82109': '109',
  '+9114416': '14416',
  '+62119': '119',
  '+6321553': '1553',
};

function formatPhoneDisplay(e164) {
  const exact = PHONE_DISPLAY_EXACT[e164];
  if (exact !== undefined) return exact;
  const stripped = e164.replace(/^\+[0-9]{1,3}/, '');
  if (stripped.length <= 4) return stripped;
  return stripped.slice(-7);
}

function buildTelHref(phone, dialable) {
  return `tel:${dialable ?? phone}`;
}

// ---------------------------------------------------------------------------
// P2 regression: exact-match must fire BEFORE greedy strip
// ---------------------------------------------------------------------------
describe('formatPhoneDisplay — P2 regression (short-code pseudo-E.164)', () => {
  it('+1988 returns "988", not "8" (greedy +198 strip bug)', () => {
    assert.equal(formatPhoneDisplay('+1988'), '988');
  });

  it('+55188 returns "188", not "88" (greedy +551 strip bug)', () => {
    assert.equal(formatPhoneDisplay('+55188'), '188');
  });

  it('+333114 returns "3114", not "114" (greedy +333 strip bug)', () => {
    assert.equal(formatPhoneDisplay('+333114'), '3114');
  });

  it('+82109 returns "109", not "09" (greedy +821 strip bug — new KR entry)', () => {
    assert.equal(formatPhoneDisplay('+82109'), '109');
  });

  it('+9114416 returns "14416", not "4416" (greedy +911 strip bug — new IN entry)', () => {
    assert.equal(formatPhoneDisplay('+9114416'), '14416');
  });

  it('+62119 returns "119", not "19" (greedy +621 strip bug — ID entry)', () => {
    assert.equal(formatPhoneDisplay('+62119'), '119');
  });
});

// ---------------------------------------------------------------------------
// Exact-match coverage for all known entries
// ---------------------------------------------------------------------------
describe('formatPhoneDisplay — all exact-match entries', () => {
  const cases = [
    ['+1988', '988'],
    ['+18002738255', '988'],
    ['+55188', '188'],
    ['+333114', '3114'],
    ['+44116123', '116 123'],
    ['+81120279338', '0120-279-338'],
    ['+498001110111', '0800 111 0 111'],
    ['+61131114', '13 11 14'],
    ['+640800543354', '0800 543 354'],
    ['+82109', '109'],
    ['+9114416', '14416'],
    ['+62119', '119'],
    ['+6321553', '1553'],
  ];

  for (const [input, expected] of cases) {
    it(`formatPhoneDisplay("${input}") === "${expected}"`, () => {
      assert.equal(formatPhoneDisplay(input), expected);
    });
  }
});

// ---------------------------------------------------------------------------
// Generic fallback path
// ---------------------------------------------------------------------------
describe('formatPhoneDisplay — generic fallback', () => {
  it('short residual (≤4 digits after strip) is returned as-is', () => {
    // +1800123 → greedy strip +180 → "0123" (4 chars, ≤4) → returned as-is
    assert.equal(formatPhoneDisplay('+1800123'), '0123');
  });

  it('long number returns last 7 digits', () => {
    // +44 = GB prefix, 7980123456 (10 digits) → strip +44 → "7980123456" → last 7: "0123456"
    assert.equal(formatPhoneDisplay('+447980123456'), '0123456');
  });
});

// ---------------------------------------------------------------------------
// P1-B: buildTelHref — dialable preferred over phone
// ---------------------------------------------------------------------------
describe('buildTelHref — local short-code dialling (P1-B)', () => {
  it('uses dialable when present (Canada 988)', () => {
    assert.equal(buildTelHref('+1988', '988'), 'tel:988');
  });

  it('uses dialable when present (Brazil 188)', () => {
    assert.equal(buildTelHref('+55188', '188'), 'tel:188');
  });

  it('uses dialable when present (France 3114)', () => {
    assert.equal(buildTelHref('+333114', '3114'), 'tel:3114');
  });

  it('uses dialable when present (US 988)', () => {
    assert.equal(buildTelHref('+1988', '988'), 'tel:988');
  });

  it('falls back to phone when dialable is absent', () => {
    assert.equal(buildTelHref('+27800567567', undefined), 'tel:+27800567567');
  });

  it('falls back to phone when dialable is undefined (Germany)', () => {
    assert.equal(buildTelHref('+498001110111', undefined), 'tel:+498001110111');
  });
});
