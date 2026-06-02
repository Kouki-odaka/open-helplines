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
  /** Phone number for tel: links (E.164 or local short-code) */
  phone?: string;
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
    countryCode: 'BR',
    name: 'CVV — Ligue 188',
    phone: '+55188',
    chatUrl: 'https://cvv.org.br/chat/',
    hours: '24/7',
    free: true,
  },
  CA: {
    countryCode: 'CA',
    name: 'Talk Suicide Canada',
    phone: '+18336456428',
    smsNumber: '45645',
    hours: '24/7',
    free: true,
  },
  CN: {
    countryCode: 'CN',
    name: 'National Hope 24 Hotline',
    phone: '+864001161161',
    hours: '24/7',
    free: true,
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
    countryCode: 'FR',
    name: '3114 — Numéro national prévention suicide',
    phone: '+333114',
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
    countryCode: 'ID',
    name: 'Into The Light Indonesia',
    phone: '+62119',
    hours: '24/7',
    free: true,
  },
  IN: {
    countryCode: 'IN',
    name: 'Vandrevala Foundation',
    phone: '+911860-2662-345',
    chatUrl: 'https://www.vandrevalafoundation.com/',
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
    countryCode: 'KR',
    name: '자살예방상담전화 1393',
    phone: '+821393',
    hours: '24/7',
    free: true,
  },
  MX: {
    countryCode: 'MX',
    name: 'SAPTEL',
    phone: '+525555259121',
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
    countryCode: 'PH',
    name: 'NCMH Crisis Hotline',
    phone: '+631553',
    hours: '24/7',
    free: true,
  },
  RU: {
    countryCode: 'RU',
    name: 'Телефон доверия',
    phone: '+78002000122',
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
    countryCode: 'US',
    name: '988 Suicide & Crisis Lifeline',
    phone: '+1988',
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
