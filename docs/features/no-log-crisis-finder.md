# No-Log Crisis Finder

**Status:** Implemented (Phase 3)  
**Branch:** `feat/no-log-crisis-finder`  
**Impact:** 5 / M (High impact, medium scope)

---

## Overview

The No-Log Crisis Finder is a dedicated search page (`/crisis-finder`) that allows users to
find crisis support helplines **with a complete privacy guarantee**:

- No IP address or query logging (static export — no server to log)
- No cookies, localStorage, or sessionStorage
- No analytics or third-party tracking scripts
- All helpline data is bundled — zero external API calls during search
- CSP meta tag blocks any injected tracking

This feature is designed for users who may be in a vulnerable state and concerned about their
search history, or who use privacy-first browsers (Tor, Brave, Safari Private Browsing).

---

## Privacy Architecture

### Why a static export is inherently privacy-preserving

Open Helplines uses `next build` with `output: 'export'` — there is no application server.
Every request is served from GitHub Pages (static CDN), which:

- Receives only standard HTTP request logs (outside our control)
- Does **not** receive search query strings (they stay in the browser)
- Does **not** run any server-side code that could log searches

The No-Log Crisis Finder makes this explicit to users via UI badges and documentation.

### Content Security Policy

A CSP meta tag is set in `app/layout.tsx` (root layout, applies to all pages):

```
default-src 'self';
script-src 'self' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
img-src 'self' data: blob:;
connect-src 'self' https://nominatim.openstreetmap.org;
media-src 'none';
object-src 'none';
frame-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**`unsafe-eval`**: Required by Three.js for GLSL shader compilation on the globe view.  
**nominatim.openstreetmap.org**: The only permitted external connection; used only when the
user explicitly grants geolocation permission in the Emergency Banner.

The CSP blocks: Google Analytics, Mixpanel, Segment, HotJar, Facebook Pixel, and any other
injected third-party tracking payload.

### Referrer Policy

`<meta name="referrer" content="no-referrer">` is set globally. When a user navigates from the
crisis finder to an external helpline website, the Referer header is suppressed — the helpline
site does not see that the user came from a crisis-related search.

### No-store directive

The crisis finder page sets `robots: { index: false, follow: false }` in its metadata. This
prevents the page from appearing in search engine results for crisis-related queries (the real
helplines should appear instead, not a directory site).

---

## Technical Implementation

### Data source

`CrisisFinderSearch` uses the `EMERGENCY_HELPLINES_BY_COUNTRY` static map from
`src/lib/emergency-helplines.ts` — the same dataset used by the Emergency Banner. All 21
dataset countries are represented with their primary 24/7 crisis contact.

### State management

All search state is held in `React.useState`. On unmount (page navigation), the state is
garbage-collected. No write to any persistent storage occurs.

### Search algorithm

Simple substring match on country code, country name (English), and helpline name.
Case-insensitive. No fuzzy matching (avoids algorithmic surprises for crisis queries).

---

## Browser Compatibility

| Browser | Mode | Expected behaviour |
|:--------|:-----|:-------------------|
| Chrome / Edge | Normal | Full functionality |
| Firefox | Normal | Full functionality |
| Brave | Normal + Shields | Full functionality; no 3rd-party blocked (none present) |
| Safari | Private Browsing | Full functionality; no storage APIs accessed |
| Tor Browser | Standard | Full functionality; JS required for search UI |
| iOS Safari | Private | Full functionality |

**Note on Tor:** The page loads Three.js for the globe (a separate route). The crisis finder
page itself has no WebGL dependency and is text + CSS only.

---

## Testing

### Manual test plan

```bash
# Start dev server
cd examples/web && npm run dev

# Test 1: Privacy badge visible
open http://localhost:3000/en/crisis-finder
# Expected: "Private · No logs" badge visible; privacy guarantees grid shown

# Test 2: Search filters results
# Type "Japan" → only JP row visible
# Type "free" → all 'Free' rows visible (15+)
# Clear → all 21 rows visible

# Test 3: No storage writes (DevTools)
# Open DevTools → Application → Storage
# Type a search query, navigate around
# Expected: Local Storage, Session Storage, Cookies all empty

# Test 4: CSP blocks external scripts
# DevTools → Network → reload page
# Expected: no requests to analytics.google.com, cdn.segment.com, etc.

# Test 5: Referrer suppressed
# Click any helpline external link
# On destination site → check Referer header
# Expected: empty / no-referrer

# Test 6: i18n
open http://localhost:3000/ja/crisis-finder  # Japanese UI
open http://localhost:3000/es/crisis-finder  # Spanish UI
```

### Automated

- `tsc --noEmit` — type safety
- `next build` — all 3 locale routes generated (/en/crisis-finder, /ja/crisis-finder, /es/crisis-finder)

---

## Roadmap

- **Service Worker**: Pre-cache all helpline data for offline operation (critical for users
  in areas with unstable connectivity)
- **Expand data**: Include all helplines from the full registry (not just the 21 priority
  emergency contacts), with client-side filtering by category/language/contact method
- **Tor-specific UI**: Detect Tor exit node and surface `.onion` mirror if one is created
- **Additional languages**: Expand search to support non-Latin scripts (Arabic, Bengali, etc.)
- **Accessibility audit**: WCAG 2.1 AA verification with a screen reader on the search results
