/**
 * Static emergency helpline dataset for the Emergency First Resolver.
 *
 * Contains the single most-accessible 24/7 suicide-prevention contact per country.
 * Sourced from the project's helplines.json data, prioritising:
 *   1. government-backed or well-established services
 *   2. 24/7 availability
 *   3. free-of-charge
 *
 * This dataset is intentionally separate from the full registry so the banner
 * can render instantly without fetching helplines.json.
 */

export interface EmergencyContact {
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  /** Organisation name */
  name: string;
  /** Phone number in E.164 format for storage and display */
  phone?: string;
  /**
   * Local short-code or national format for `tel:` href one-tap dialling.
   * When present, use this value for `tel:` links instead of `phone`.
   * Examples: "988" (US/CA), "188" (BR), "3114" (FR), "119" (ID).
   */
  dialable?: string;
  /** SMS number for sms: links */
  smsNumber?: string;
  /** Web chat or app URL */
  chatUrl?: string;
  /** Operating hours (should always be 24/7 for entries here) */
  hours: string;
  /** True if the call is free to the caller */
  free: boolean;
}

/** International fallback for countries not in the dataset */
export const INTERNATIONAL_FALLBACK: EmergencyContact = {
  countryCode: 'XX',
  name: 'Befrienders Worldwide (IASP)',
  chatUrl: 'https://www.befrienders.org/find-a-helpline',
  hours: '24/7 (worldwide directory)',
  free: true,
};

/**
 * Map of ISO 3166-1 alpha-2 country code → priority emergency contact.
 * Covers all 21 countries present in the open-helplines dataset.
 */
export const EMERGENCY_HELPLINES_BY_COUNTRY: Readonly<Record<string, EmergencyContact>> = {
  AU: {
    countryCode: 'AU',
    name: 'Lifeline Australia',
    phone: '+61131114',
    chatUrl: 'https://www.lifeline.org.au/crisis-chat/',
    hours: '24/7',
    free: true,
  },
  BD: {
    countryCode: 'BD',
    name: 'Kaan Pete Roi',
    phone: '+8809612119911',
    hours: 'Daily 15:00–03:00 BST',
    free: false,
  },
  BR: {
    // canonical: data/countries/br/helplines.json — CVV, id: br-cvv-ligue-188
    countryCode: 'BR',
    name: 'CVV — Ligue 188',
    phone: '+55188',
    dialable: '188',
    chatUrl: 'https://cvv.org.br/chat/',
    hours: '24/7',
    free: true,
  },
  CA: {
    // canonical: data/countries/ca/helplines.json — id: ca-988-suicide-crisis-helpline
    countryCode: 'CA',
    name: '9-8-8: Suicide Crisis Helpline',
    phone: '+1988',
    dialable: '988',
    smsNumber: '988',
    chatUrl: 'https://talksuicide.ca/',
    hours: '24/7',
    free: true,
  },
  CN: {
    // canonical: data/countries/cn/helplines.json — id: cn-beijing-crisis-hotline
    countryCode: 'CN',
    name: 'Beijing Suicide Research and Prevention Center Hotline',
    phone: '+864001619995',
    chatUrl: 'https://www.crisis.org.cn/',
    hours: '24/7',
    free: false,
  },
  DE: {
    countryCode: 'DE',
    name: 'Telefonseelsorge',
    phone: '+498001110111',
    chatUrl: 'https://online.telefonseelsorge.de/',
    hours: '24/7',
    free: true,
  },
  EG: {
    countryCode: 'EG',
    name: 'Mental Health Crisis Line (Egypt)',
    phone: '+20224156600',
    hours: '24/7',
    free: false,
  },
  FR: {
    // canonical: data/countries/fr/helplines.json — id: fr-3114-prevention-suicide
    countryCode: 'FR',
    name: '3114 — Numéro national prévention suicide',
    phone: '+333114',
    dialable: '3114',
    hours: '24/7',
    free: true,
  },
  GB: {
    countryCode: 'GB',
    name: 'Samaritans',
    phone: '+44116123',
    chatUrl: 'https://www.samaritans.org/how-we-can-help/contact-samaritan/',
    hours: '24/7',
    free: true,
  },
  ID: {
    // canonical: data/countries/id/helplines.json — id: id-into-the-light
    countryCode: 'ID',
    name: 'Into The Light Indonesia',
    phone: '+62119',
    dialable: '119',
    hours: '24/7',
    free: true,
  },
  IN: {
    // canonical: data/countries/in/helplines.json — id: in-tele-manas
    countryCode: 'IN',
    name: 'Tele MANAS',
    phone: '+9114416',
    dialable: '14416',
    chatUrl: 'https://telemanas.mohfw.gov.in/',
    hours: '24/7',
    free: true,
  },
  JP: {
    countryCode: 'JP',
    name: 'よりそいホットライン (Yorisoi Hotline)',
    phone: '+81120279338',
    hours: '24/7',
    free: true,
  },
  KR: {
    // canonical: data/countries/kr/helplines.json — id: kr-109-suicide-crisis
    // Note: 1393 was consolidated into 109 in January 2024.
    countryCode: 'KR',
    name: '109 Suicide Prevention Crisis Line',
    phone: '+82109',
    dialable: '109',
    hours: '24/7',
    free: true,
  },
  MX: {
    // canonical: data/countries/mx/helplines.json — id: mx-saptel
    countryCode: 'MX',
    name: 'SAPTEL — Suicide & Crisis Intervention',
    phone: '+525552598121',
    hours: '24/7',
    free: false,
  },
  NG: {
    countryCode: 'NG',
    name: 'NEMA Distress Line',
    phone: '+2348186627555',
    hours: '24/7',
    free: false,
  },
  NZ: {
    countryCode: 'NZ',
    name: 'Lifeline Aotearoa',
    phone: '+640800543354',
    smsNumber: '4357',
    hours: '24/7',
    free: true,
  },
  PH: {
    // canonical: data/countries/ph/helplines.json — id: ph-ncmh-crisis-hotline
    countryCode: 'PH',
    name: 'NCMH Crisis Hotline',
    phone: '+6321553',
    dialable: '1553',
    hours: '24/7',
    free: false,
  },
  RU: {
    // canonical: data/countries/ru/helplines.json — id: ru-national-psychological-helpline
    countryCode: 'RU',
    name: 'National Psychological Help Hotline',
    phone: '+78003334434',
    chatUrl: 'https://pomoschryadom.ru/',
    hours: '24/7',
    free: true,
  },
  UA: {
    countryCode: 'UA',
    name: 'Lifeline Ukraine',
    phone: '+380732424049',
    hours: '24/7',
    free: true,
  },
  US: {
    // canonical: data/countries/us/helplines.json — id: us-988-lifeline
    countryCode: 'US',
    name: '988 Suicide & Crisis Lifeline',
    phone: '+1988',
    dialable: '988',
    smsNumber: '988',
    chatUrl: 'https://988lifeline.org/chat/',
    hours: '24/7',
    free: true,
  },
  ZA: {
    countryCode: 'ZA',
    name: 'SADAG Suicide Crisis Line',
    phone: '+27800567567',
    hours: '24/7',
    free: true,
  },
};

/**
 * Returns the best emergency contact for a given country code.
 * Falls back to the international IASP directory if no specific entry exists.
 *
 * @param countryCode - ISO 3166-1 alpha-2 (e.g. "JP", "US"). Case-insensitive.
 */
export function getEmergencyContact(countryCode: string): EmergencyContact {
  const key = countryCode.toUpperCase();
  return EMERGENCY_HELPLINES_BY_COUNTRY[key] ?? INTERNATIONAL_FALLBACK;
}
