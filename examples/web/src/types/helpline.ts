/**
 * Core type definitions for open-helplines data.
 * Mirrors the JSON schema at schemas/helpline.schema.json.
 */

export type ContactMethod = 'phone' | 'text' | 'chat' | 'email' | 'app';

export type HelplineCategory =
  | 'suicide_prevention'
  | 'mental_health'
  | 'crisis'
  | 'general_crisis'
  | 'domestic_violence'
  | 'child_abuse'
  | 'substance_abuse'
  | 'lgbtq'
  | 'veteran'
  | 'other';

export interface HelplineContact {
  method: ContactMethod;
  number?: string;
  url?: string;
  languages: string[];
  hours: string;
  free: boolean;
  anonymous: boolean;
}

export interface HelplineRecord {
  id: string;
  country: string;
  name: string;
  local_name?: string;
  category: HelplineCategory;
  secondary_categories?: HelplineCategory[];
  contacts: HelplineContact[];
  description: string;
  website?: string;
  donate_url?: string;
  verified_at: string;
  source: string;
  government_backed: boolean;
  tags?: string[];
}

export interface CountryHelplines {
  country: string;
  records: HelplineRecord[];
}

/** Aggregated country data used for globe visualization */
export interface CountryGlobeData {
  countryCode: string;       // ISO 3166-1 alpha-2 (e.g. "JP")
  countryName: string;
  lat: number;               // Country centroid latitude
  lng: number;               // Country centroid longitude
  helplineCount: number;
  categories: HelplineCategory[];
  contactMethods: ContactMethod[];
  languages: string[];
  records: HelplineRecord[];
}

/** Props for the country detail panel */
export interface CountryDetailPanelProps {
  countryData: CountryGlobeData | null;
  onClose: () => void;
}

/** Aggregated helplines data for all countries */
export interface GlobalHelplinesData {
  generatedAt: string;
  totalRecords: number;
  countries: CountryGlobeData[];
}
