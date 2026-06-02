'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  EMERGENCY_HELPLINES_BY_COUNTRY,
  INTERNATIONAL_FALLBACK,
  type EmergencyContact,
} from '@/lib/emergency-helplines';

/** Display name mapping for the 21 dataset countries */
const COUNTRY_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  AU: 'Australia',
  BD: 'Bangladesh',
  BR: 'Brazil',
  CA: 'Canada',
  CN: 'China',
  DE: 'Germany',
  EG: 'Egypt',
  FR: 'France',
  GB: 'United Kingdom',
  ID: 'Indonesia',
  IN: 'India',
  JP: 'Japan',
  KR: 'South Korea',
  MX: 'Mexico',
  NG: 'Nigeria',
  NZ: 'New Zealand',
  PH: 'Philippines',
  RU: 'Russia',
  UA: 'Ukraine',
  US: 'United States',
  ZA: 'South Africa',
};

interface CrisisContactEntry {
  countryCode: string;
  countryName: string;
  contact: EmergencyContact;
}

/** All entries sorted alphabetically by country name */
const ALL_ENTRIES: CrisisContactEntry[] = Object.entries(EMERGENCY_HELPLINES_BY_COUNTRY)
  .map(([code, contact]) => ({
    countryCode: code,
    countryName: COUNTRY_DISPLAY_NAMES[code] ?? code,
    contact,
  }))
  .sort((entryA, entryB) => entryA.countryName.localeCompare(entryB.countryName));

/**
 * Filters entries by a query string.
 * Matches country code, country name, or helpline name (case-insensitive).
 */
function filterEntries(entries: CrisisContactEntry[], query: string): CrisisContactEntry[] {
  const normalised = query.toLowerCase().trim();
  if (normalised.length === 0) {
    return entries;
  }
  return entries.filter(
    ({ countryCode, countryName, contact }) =>
      countryCode.toLowerCase().includes(normalised) ||
      countryName.toLowerCase().includes(normalised) ||
      contact.name.toLowerCase().includes(normalised)
  );
}

/**
 * CrisisFinderSearch — fully client-side, ephemeral-state-only search UI.
 *
 * Privacy contract:
 *  - Query string is held only in React useState (cleared on unmount)
 *  - No localStorage / sessionStorage / cookie writes at any point
 *  - All data is from the bundled static emergency-helplines.ts — zero network requests
 */
export function CrisisFinderSearch() {
  const t = useTranslations('privacy');
  const [query, setQuery] = useState('');

  const results = useMemo(() => filterEntries(ALL_ENTRIES, query), [query]);

  const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <label htmlFor="crisis-search" className="sr-only">
          {t('searchLabel')}
        </label>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none" aria-hidden="true">
          <span className="text-gray-500">🔍</span>
        </div>
        <input
          id="crisis-search"
          type="search"
          value={query}
          onChange={handleQueryChange}
          placeholder={t('searchPlaceholder')}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full bg-neutral-surface border border-neutral-border rounded-xl pl-10 pr-10 py-3 text-sm text-neutral-text placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-colors"
          aria-controls="crisis-results"
          aria-label={t('searchLabel')}
        />
        {query.length > 0 && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={t('clearSearch')}
          >
            ×
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-neutral-muted" role="status" aria-live="polite">
        {results.length === ALL_ENTRIES.length
          ? t('showingAll', { count: ALL_ENTRIES.length })
          : t('showingFiltered', { count: results.length, total: ALL_ENTRIES.length })}
      </p>

      {/* Results list */}
      <ul id="crisis-results" className="space-y-3" role="list" aria-label={t('resultsLabel')}>
        {results.map(({ countryCode, countryName, contact }) => (
          <CrisisContactCard
            key={countryCode}
            countryCode={countryCode}
            countryName={countryName}
            contact={contact}
          />
        ))}

        {results.length === 0 && (
          <li className="text-center text-sm text-neutral-muted py-8">
            <p className="mb-3">{t('noResults')}</p>
            <a
              href={INTERNATIONAL_FALLBACK.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              🌐 {t('internationalDirectory')}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

interface CrisisContactCardProps {
  countryCode: string;
  countryName: string;
  contact: EmergencyContact;
}

function CrisisContactCard({ countryCode, countryName, contact }: CrisisContactCardProps) {
  const t = useTranslations('privacy');
  const flagEmoji = getFlagEmoji(countryCode);

  return (
    <li className="bg-neutral-surface border border-neutral-border rounded-xl p-4">
      <div className="flex items-start gap-3">
        {/* Flag + name */}
        <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
          {flagEmoji}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-sm">{countryName}</h3>
            <span className="text-xs text-neutral-muted font-mono">{countryCode}</span>
            {contact.hours === '24/7' && (
              <span className="text-[10px] bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                24/7
              </span>
            )}
            {contact.free && (
              <span className="text-[10px] bg-blue-950/50 border border-blue-800/40 text-blue-400 px-1.5 py-0.5 rounded font-medium">
                {t('freeLabel')}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-muted mb-3">{contact.name}</p>

          {/* Contact action buttons */}
          <div className="flex flex-wrap gap-2">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-1 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                aria-label={`${t('callLabel')} ${countryName}`}
              >
                📞 {t('callButton')}
              </a>
            )}
            {contact.smsNumber && (
              <a
                href={`sms:${contact.smsNumber}`}
                className="inline-flex items-center gap-1 bg-sky-900/40 hover:bg-sky-900/60 border border-sky-800/50 text-sky-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                aria-label={`${t('textLabel')} ${countryName}`}
              >
                💬 {t('textButton')}
              </a>
            )}
            {contact.chatUrl && (
              <a
                href={contact.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-violet-900/40 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                aria-label={`${t('chatLabel')} ${countryName}`}
              >
                🖥️ {t('chatButton')}
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
