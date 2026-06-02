/**
 * Country detection for the Emergency First Resolver.
 *
 * Priority order (no localStorage — privacy-first):
 *   1. URL ?country=XX query param (most explicit)
 *   2. Browser Geolocation API (requires explicit user opt-in)
 *   3. navigator.language / navigator.languages (BCP-47 → country)
 *   4. Intl.DateTimeFormat timezone (IANA → country)
 *   5. 'XX' (unknown) → international fallback
 */

/** ISO 3166-1 alpha-2 country code or 'XX' for unknown */
export type CountryCode = string;

/** Source that produced the detected country */
export type DetectionSource = 'url_param' | 'geolocation' | 'language' | 'timezone' | 'unknown';

export interface CountryDetectionResult {
  countryCode: CountryCode;
  source: DetectionSource;
}

/** BCP-47 region subtag or common language → country mapping (most specific first) */
const LANGUAGE_TO_COUNTRY: Readonly<Record<string, string>> = {
  // Region-tagged locales (highest confidence)
  'en-us': 'US',
  'en-gb': 'GB',
  'en-au': 'AU',
  'en-nz': 'NZ',
  'en-ca': 'CA',
  'en-in': 'IN',
  'en-ng': 'NG',
  'en-za': 'ZA',
  'en-ph': 'PH',
  'en-sg': 'SG',
  'ja-jp': 'JP',
  'ja': 'JP',
  'ko-kr': 'KR',
  'ko': 'KR',
  'zh-cn': 'CN',
  'zh-hans': 'CN',
  'zh-tw': 'TW',
  'zh-hant': 'TW',
  'de-de': 'DE',
  'de-at': 'AT',
  'de-ch': 'CH',
  'de': 'DE',
  'fr-fr': 'FR',
  'fr-ca': 'CA',
  'fr-be': 'BE',
  'fr': 'FR',
  'pt-br': 'BR',
  'pt-pt': 'PT',
  'pt': 'BR',
  'es-mx': 'MX',
  'es-es': 'ES',
  'es-ar': 'AR',
  'es-co': 'CO',
  'es': 'MX',
  'id': 'ID',
  'in': 'ID',
  'ru': 'RU',
  'uk': 'UA',
  'ar-eg': 'EG',
  'bn-bd': 'BD',
  'bn': 'BD',
  'hi': 'IN',
  'ta': 'IN',
};

/** IANA timezone prefix → country (best-effort, ambiguous cases map to dominant country) */
const TIMEZONE_PREFIX_TO_COUNTRY: Readonly<Record<string, string>> = {
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Anchorage': 'US',
  'America/Honolulu': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Montreal': 'CA',
  'America/Sao_Paulo': 'BR',
  'America/Mexico_City': 'MX',
  'America/Buenos_Aires': 'AR',
  'America/Bogota': 'CO',
  'Europe/London': 'GB',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Amsterdam': 'NL',
  'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT',
  'Europe/Moscow': 'RU',
  'Europe/Kiev': 'UA',
  'Europe/Kyiv': 'UA',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Beijing': 'CN',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Dhaka': 'BD',
  'Asia/Jakarta': 'ID',
  'Asia/Manila': 'PH',
  'Asia/Dubai': 'AE',
  'Asia/Cairo': 'EG',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Pacific/Auckland': 'NZ',
  'Africa/Lagos': 'NG',
  'Africa/Johannesburg': 'ZA',
};

/**
 * Reads ?country=XX from the current URL search params.
 * Returns the value uppercased if it matches a 2-letter country code pattern.
 */
function detectFromUrlParam(searchParams: URLSearchParams): CountryCode | null {
  const rawParam = searchParams.get('country');
  if (!rawParam) {
    return null;
  }
  const upper = rawParam.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper)) {
    return upper;
  }
  return null;
}

/**
 * Infers country from navigator.languages BCP-47 tags.
 * Tries each language in order of preference.
 */
function detectFromLanguage(): CountryCode | null {
  if (typeof navigator === 'undefined') {
    return null;
  }
  const languages = navigator.languages ?? [navigator.language];
  for (const lang of languages) {
    if (!lang) {
      continue;
    }
    const lower = lang.toLowerCase();
    const direct = LANGUAGE_TO_COUNTRY[lower];
    if (direct) {
      return direct;
    }
    // Try base language tag (e.g. "en-AU" → "en")
    const base = lower.split('-')[0];
    const fromBase = LANGUAGE_TO_COUNTRY[base];
    if (fromBase) {
      return fromBase;
    }
  }
  return null;
}

/**
 * Infers country from the IANA timezone string.
 */
function detectFromTimezone(): CountryCode | null {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_PREFIX_TO_COUNTRY[timezone] ?? null;
  } catch {
    return null;
  }
}

/**
 * Requests the browser Geolocation API and resolves to a country code using a
 * reverse-geocoding endpoint. This is the only source that requires explicit
 * user permission.
 *
 * Uses https://nominatim.openstreetmap.org/reverse — no API key, OSM data.
 * Returns null on permission denial, timeout, or network error.
 *
 * @param timeoutMs - Maximum time to wait for geolocation (default 5 s)
 */
async function detectFromGeolocation(timeoutMs = 5000): Promise<CountryCode | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return null;
  }

  return new Promise<CountryCode | null>((resolve) => {
    const timeoutId = setTimeout(() => resolve(null), timeoutMs);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        try {
          const { latitude, longitude } = position.coords;
          const url =
            `https://nominatim.openstreetmap.org/reverse` +
            `?lat=${latitude}&lon=${longitude}&format=json&zoom=3`;
          const response = await fetch(url, {
            headers: { 'Accept-Language': 'en' },
          });
          if (!response.ok) {
            resolve(null);
            return;
          }
          const data = await response.json() as { address?: { country_code?: string } };
          const countryCode = data?.address?.country_code?.toUpperCase() ?? null;
          resolve(countryCode);
        } catch {
          resolve(null);
        }
      },
      () => {
        clearTimeout(timeoutId);
        resolve(null);
      },
      { timeout: timeoutMs, maximumAge: 0 }
    );
  });
}

/**
 * Detects the user's country with the following priority:
 *   URL param > geolocation (opt-in) > accept-language > timezone > unknown
 *
 * @param searchParams - Current URL search params
 * @param useGeolocation - Whether to request the Geolocation API (requires opt-in)
 * @returns Detected country code and source
 */
export async function detectCountry(
  searchParams: URLSearchParams,
  useGeolocation = false
): Promise<CountryDetectionResult> {
  // 1. URL param (most explicit)
  const fromUrl = detectFromUrlParam(searchParams);
  if (fromUrl) {
    return { countryCode: fromUrl, source: 'url_param' };
  }

  // 2. Geolocation (explicit opt-in only)
  if (useGeolocation) {
    const fromGeo = await detectFromGeolocation();
    if (fromGeo) {
      return { countryCode: fromGeo, source: 'geolocation' };
    }
  }

  // 3. Accept-Language
  const fromLang = detectFromLanguage();
  if (fromLang) {
    return { countryCode: fromLang, source: 'language' };
  }

  // 4. Timezone
  const fromTz = detectFromTimezone();
  if (fromTz) {
    return { countryCode: fromTz, source: 'timezone' };
  }

  // 5. Unknown → caller should use international fallback
  return { countryCode: 'XX', source: 'unknown' };
}
