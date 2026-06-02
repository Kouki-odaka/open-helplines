# Emergency First Resolver

**Status:** Implemented (Phase 1)  
**Branch:** `feat/emergency-first-resolver`  
**Impact:** 5 / S (High impact, small scope)

---

## Overview

When a user searches for crisis-related terms (e.g. "suicide", "死にたい", "suicidio"), the
Emergency First Resolver immediately surfaces the most-accessible 24/7 crisis helpline for their
country as a fixed banner at the top of the page.

The goal is to reduce friction to zero: one tap to call, text, or chat — without leaving the site.

---

## Architecture

```
URL ?q= or ?search=
        │
        ▼
EmergencyBannerController (client)
        │
        ├─ containsEmergencyTrigger() → bool
        │       └─ emergency-triggers.ts (en / ja / es word lists)
        │
        ├─ detectCountry() → { countryCode, source }
        │       └─ country-detector.ts
        │               ├─ 1. URL ?country=XX (highest priority)
        │               ├─ 2. Geolocation API (opt-in only)
        │               ├─ 3. navigator.languages (BCP-47 → ISO 3166)
        │               └─ 4. Intl timezone (IANA → ISO 3166)
        │
        └─ getEmergencyContact(countryCode)
                └─ emergency-helplines.ts (static map, 21 countries)
                        └─ INTERNATIONAL_FALLBACK (Befrienders / IASP)
```

---

## Trigger Word Design

Trigger words are in `src/lib/emergency-triggers.ts`.

### Principles

1. **High recall over precision** — A false positive (showing the banner to someone who just
   researched the topic) is far less harmful than a false negative (not showing it to someone
   in crisis). The banner is dismissible.

2. **Language parity** — Three initial languages: English, Japanese, Spanish.
   The same sensitivity level is applied to each.

3. **Phrase-level matching** — Multi-word phrases ("kill myself", "死ぬ方法") are included
   because they carry higher intent signal than single nouns.

4. **No PII retention** — Query strings are tested in memory and discarded.
   They are never logged to analytics or localStorage.

### Adding triggers

Add terms to the relevant array in `emergency-triggers.ts`. Annotate with a comment if the
trigger is easily confused with non-crisis usage (e.g. "overdose" in a medication research
context).

### False positive mitigation

- The banner is **dismissible** with a single click.
- Medical/academic/news queries will sometimes trigger the banner. This is intentional —
  if someone is researching these topics, the banner's presence is harmless.
- Future improvement: weight triggers by count/co-occurrence to reduce academic-context FPs.

---

## Country Detection

Priority chain (no localStorage writes at any step):

| Priority | Method | Notes |
|:---------|:-------|:------|
| 1 | `?country=XX` URL param | Explicit override; useful for testing |
| 2 | Geolocation API | Requires explicit user permission; nominatim.org for reverse-geocode |
| 3 | `navigator.languages` | BCP-47 region tag → ISO 3166; covers most common cases |
| 4 | `Intl` timezone | IANA zone → country; covers cases where language tag lacks region |
| 5 | `'XX'` unknown | → Befrienders Worldwide / IASP international directory |

### Privacy contract

- Geolocation is **not requested** without explicit user action.
- The `requestGeo` state defaults to `false`; only set to `true` when user clicks the
  "Allow location" button.
- Detection results are ephemeral (React state); not persisted across sessions.

---

## Emergency Helplines Dataset

`src/lib/emergency-helplines.ts` contains a static map of the single most-accessible 24/7
crisis contact per country, covering all 21 countries in the open-helplines dataset.

### Update cadence

This static map should be audited against `data/countries/*/helplines.json` at each major
data update. The field to check: `category: "suicide_prevention"` + `hours: "24/7"`.

### International fallback

When no country-specific entry is found, the banner links to Befrienders Worldwide
(https://www.befrienders.org/find-a-helpline), the IASP-affiliated global directory.

---

## UI / Accessibility

- `role="alert"` + `aria-live="assertive"` — screen readers announce the banner immediately
- `aria-atomic="true"` — the entire banner is read as a unit (not incrementally)
- CVD-safe vermillion accent: `#D55E00` (Okabe-Ito palette) — distinguishable by all common
  colour-vision deficiency types
- Background: `#1a0800` — near-black warm tone for contrast ratio ≥ 7:1 against all text
- Dismiss button has explicit `aria-label`
- Contact action buttons include `aria-label` with the service name

---

## Testing

### Manual

```bash
# US scenario
open "http://localhost:3000/en/globe?q=suicide"
# Expected: banner showing "988 Suicide & Crisis Lifeline", phone 988

# JP scenario (language-based detection)
# Set browser language to ja-JP, then:
open "http://localhost:3000/ja/globe?q=死にたい"
# Expected: banner showing "よりそいホットライン", phone 0120-279-338

# Override country
open "http://localhost:3000/en/globe?q=crisis+hotline&country=JP"
# Expected: Japanese helpline regardless of browser language

# International fallback
open "http://localhost:3000/en/globe?q=suicide&country=XY"
# Expected: Befrienders Worldwide fallback with chat link
```

### Trigger word additions

Run `containsEmergencyTrigger('<word>')` in the browser console.

---

## Roadmap

- **Phase 2** (Safe Answer MCP Guardrails): Add safe-messaging guidelines next to the banner
  for contributors reviewing data
- **Phase 3** (No-Log Crisis Finder): Private, zero-log search mode for users actively in crisis
- Expand trigger words to additional languages (French, German, Portuguese, Korean)
- A/B test banner copy for best engagement with the dismiss rate as a signal
