/**
 * Data aggregation utilities for transforming raw helplines JSON
 * into formats suitable for globe, network, and heatmap visualizations.
 */

import type {
  CountryHelplines,
  CountryGlobeData,
  GlobalHelplinesData,
} from '@/types/helpline';
import {
  getCountryCoordinates,
  getCountryDisplayName,
} from '@/lib/country-coordinates';

/**
 * Transforms per-country helplines data into globe-ready aggregated format.
 * Skips countries with no coordinate data.
 */
export function aggregateCountryData(
  countryHelplinesArray: CountryHelplines[]
): CountryGlobeData[] {
  const globeData: CountryGlobeData[] = [];

  for (const countryData of countryHelplinesArray) {
    const countryCode = countryData.country.toUpperCase();
    const coordinates = getCountryCoordinates(countryCode);

    if (!coordinates) {
      // Silently skip countries without coordinate data
      continue;
    }

    const [lat, lng] = coordinates;
    const records = countryData.records;
    const allCategories = records.flatMap((record) => [
      record.category,
      ...(record.secondary_categories ?? []),
    ]);
    const allContactMethods = records.flatMap((record) =>
      record.contacts.map((contact) => contact.method)
    );
    const allLanguages = records.flatMap((record) =>
      record.contacts.flatMap((contact) => contact.languages)
    );

    globeData.push({
      countryCode,
      countryName: getCountryDisplayName(countryCode),
      lat,
      lng,
      helplineCount: records.length,
      categories: [...new Set(allCategories)],
      contactMethods: [...new Set(allContactMethods)],
      languages: [...new Set(allLanguages)],
      records,
    });
  }

  return globeData;
}

/**
 * Builds GlobalHelplinesData from an array of CountryHelplines.
 */
export function buildGlobalData(
  countryHelplinesArray: CountryHelplines[]
): GlobalHelplinesData {
  const countries = aggregateCountryData(countryHelplinesArray);
  const totalRecords = countries.reduce(
    (sum, country) => sum + country.helplineCount,
    0
  );

  return {
    generatedAt: new Date().toISOString(),
    totalRecords,
    countries,
  };
}

/** Maps a category to a human-readable label. */
export function formatCategoryLabel(category: string): string {
  const labelMap: Record<string, string> = {
    suicide_prevention: 'Suicide Prevention',
    mental_health: 'Mental Health',
    crisis: 'Crisis Support',
    general_crisis: 'General Crisis',
    domestic_violence: 'Domestic Violence',
    child_abuse: 'Child Protection',
    substance_abuse: 'Substance Abuse',
    lgbtq: 'LGBTQ+',
    veteran: 'Veterans',
    other: 'Other',
  };
  return labelMap[category] ?? category;
}

/** Maps a contact method to a human-readable label. */
export function formatContactMethodLabel(method: string): string {
  const labelMap: Record<string, string> = {
    phone: 'Phone',
    text: 'Text/SMS',
    chat: 'Online Chat',
    email: 'Email',
    app: 'Mobile App',
  };
  return labelMap[method] ?? method;
}
