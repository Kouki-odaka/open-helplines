'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  EMERGENCY_HELPLINES_BY_COUNTRY,
  INTERNATIONAL_FALLBACK,
  type EmergencyContact,
} from '@/lib/emergency-helplines';

/** Display names for all 21 dataset countries, alphabetically sorted */
const COUNTRY_OPTIONS = [
  { code: 'AU', name: 'Australia' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'DE', name: 'Germany' },
  { code: 'EG', name: 'Egypt' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'RU', name: 'Russia' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'US', name: 'United States' },
  { code: 'ZA', name: 'South Africa' },
] as const;

/** Available method filters */
const METHOD_OPTIONS = ['phone', 'text', 'chat'] as const;
type MethodFilter = (typeof METHOD_OPTIONS)[number] | 'all';

interface CrisisEntry {
  countryCode: string;
  countryName: string;
  contact: EmergencyContact;
}

/** Build the full list once */
const ALL_ENTRIES: CrisisEntry[] = COUNTRY_OPTIONS.map(({ code, name }) => ({
  countryCode: code,
  countryName: name,
  contact: EMERGENCY_HELPLINES_BY_COUNTRY[code]!,
}));

function applyFilters(
  entries: CrisisEntry[],
  text: string,
  countryCode: string,
  method: MethodFilter
): CrisisEntry[] {
  return entries.filter(({ countryCode: code, countryName, contact }) => {
    // Country select filter
    if (countryCode !== '' && code !== countryCode) {
      return false;
    }
    // Text filter (country name, code, or helpline name)
    if (text.trim().length > 0) {
      const q = text.toLowerCase();
      const matches =
        code.toLowerCase().includes(q) ||
        countryName.toLowerCase().includes(q) ||
        contact.name.toLowerCase().includes(q);
      if (!matches) {
        return false;
      }
    }
    // Contact method filter
    if (method === 'phone' && !contact.phone) {
      return false;
    }
    if (method === 'text' && !contact.smsNumber) {
      return false;
    }
    if (method === 'chat' && !contact.chatUrl) {
      return false;
    }
    return true;
  });
}

/**
 * PrivateCrisisSearch — enhanced search UI for the /private page.
 *
 * Privacy contract (identical to CrisisFinderSearch):
 *  - All state is ephemeral React state — cleared on unmount
 *  - NO localStorage / sessionStorage / cookie / IndexedDB writes
 *  - NO URL query params written (query stays in React state only)
 *  - All data from bundled static emergency-helplines.ts
 *  - Zero external network requests during search
 */
export function PrivateCrisisSearch() {
  const t = useTranslations('private');

  const [textQuery, setTextQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<MethodFilter>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const results = useMemo(
    () => applyFilters(ALL_ENTRIES, textQuery, selectedCountry, selectedMethod),
    [textQuery, selectedCountry, selectedMethod]
  );

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTextQuery(event.target.value);
  }, []);

  const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  }, []);

  const handleMethodChange = useCallback((method: MethodFilter) => {
    setSelectedMethod(method);
  }, []);

  const handleCopyNumber = useCallback((key: string, value: string) => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setTextQuery('');
    setSelectedCountry('');
    setSelectedMethod('all');
  }, []);

  const hasActiveFilters = textQuery.trim().length > 0 || selectedCountry !== '' || selectedMethod !== 'all';

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="bg-neutral-surface border border-neutral-border rounded-xl p-4 space-y-3">
        {/* Text search */}
        <div className="relative">
          <label htmlFor="private-search" className="sr-only">
            {t('searchLabel')}
          </label>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true">
            🔍
          </span>
          <input
            id="private-search"
            type="search"
            value={textQuery}
            onChange={handleTextChange}
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-neutral-bg border border-neutral-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-neutral-text placeholder-neutral-muted focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-colors"
          />
        </div>

        {/* Country select + method filter row */}
        <div className="flex flex-wrap gap-2">
          {/* Country select */}
          <div className="flex-1 min-w-[160px]">
            <label htmlFor="country-select" className="sr-only">
              {t('countryLabel')}
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full bg-neutral-bg border border-neutral-border rounded-lg px-3 py-2.5 text-sm text-neutral-text focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-colors"
            >
              <option value="">{t('allCountries')}</option>
              {COUNTRY_OPTIONS.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </div>

          {/* Method filter pills */}
          <div className="flex gap-1 items-center flex-wrap">
            {(['all', ...METHOD_OPTIONS] as const).map((method) => (
              <button
                key={method}
                onClick={() => handleMethodChange(method)}
                className={[
                  'px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                  selectedMethod === method
                    ? 'bg-emerald-900/60 border-emerald-700 text-emerald-300'
                    : 'border-neutral-border text-neutral-muted hover:text-neutral-text hover:border-neutral-text',
                ].join(' ')}
              >
                {method === 'all' ? t('allMethods') : t(`method_${method}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter summary + clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-neutral-muted">
            <span role="status" aria-live="polite">
              {results.length === 0
                ? t('noResults')
                : t('showingFiltered', { count: results.length, total: ALL_ENTRIES.length })}
            </span>
            <button
              onClick={handleClearAll}
              className="text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              {t('clearAll')}
            </button>
          </div>
        )}

        {!hasActiveFilters && (
          <p className="text-xs text-neutral-muted" role="status">
            {t('showingAll', { count: ALL_ENTRIES.length })}
          </p>
        )}
      </div>

      {/* Results */}
      <ul className="space-y-3" role="list" aria-label={t('resultsLabel')}>
        {results.map(({ countryCode, countryName, contact }) => (
          <PrivateResultCard
            key={countryCode}
            countryCode={countryCode}
            countryName={countryName}
            contact={contact}
            copiedKey={copiedKey}
            onCopy={handleCopyNumber}
          />
        ))}

        {results.length === 0 && (
          <li className="text-center py-10 text-neutral-muted">
            <p className="mb-3 text-sm">{t('noResults')}</p>
            <a
              href={INTERNATIONAL_FALLBACK.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              🌐 {t('internationalDirectory')}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

interface PrivateResultCardProps {
  countryCode: string;
  countryName: string;
  contact: EmergencyContact;
  copiedKey: string | null;
  onCopy: (key: string, value: string) => void;
}

function PrivateResultCard({
  countryCode,
  countryName,
  contact,
  copiedKey,
  onCopy,
}: PrivateResultCardProps) {
  const t = useTranslations('private');

  const flagEmoji = String.fromCodePoint(
    ...countryCode.split('').map((c) => 127397 + c.charCodeAt(0))
  );

  return (
    <li className="bg-neutral-surface border border-neutral-border rounded-xl p-4">
      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden="true">{flagEmoji}</span>
        <div>
          <span className="font-semibold text-sm">{countryName}</span>
          <span className="ml-2 text-xs text-neutral-muted font-mono">{countryCode}</span>
        </div>
        <div className="ml-auto flex gap-1.5">
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
      </div>

      <p className="text-xs text-neutral-muted mb-3">{contact.name}</p>

      {/* Contact actions + copy buttons */}
      <div className="flex flex-wrap gap-2">
        {contact.phone && (
          <div className="flex items-stretch rounded-lg overflow-hidden border border-emerald-800/50">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1 bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-medium px-3 py-1.5 transition-colors"
              aria-label={`${t('callLabel')} ${countryName}`}
            >
              📞 {t('callButton')}
            </a>
            <button
              onClick={() => onCopy(`phone-${countryCode}`, contact.phone!)}
              className="bg-emerald-900/20 hover:bg-emerald-900/50 text-emerald-500 hover:text-emerald-300 text-xs px-2 border-l border-emerald-800/50 transition-colors"
              aria-label={`${t('copyLabel')} ${contact.phone}`}
              title={t('copyLabel')}
            >
              {copiedKey === `phone-${countryCode}` ? '✓' : '⎘'}
            </button>
          </div>
        )}

        {contact.smsNumber && (
          <div className="flex items-stretch rounded-lg overflow-hidden border border-sky-800/50">
            <a
              href={`sms:${contact.smsNumber}`}
              className="flex items-center gap-1 bg-sky-900/40 hover:bg-sky-900/60 text-sky-300 text-xs font-medium px-3 py-1.5 transition-colors"
              aria-label={`${t('textLabel')} ${countryName}`}
            >
              💬 {t('textButton')} {contact.smsNumber}
            </a>
            <button
              onClick={() => onCopy(`sms-${countryCode}`, contact.smsNumber!)}
              className="bg-sky-900/20 hover:bg-sky-900/50 text-sky-500 hover:text-sky-300 text-xs px-2 border-l border-sky-800/50 transition-colors"
              aria-label={`${t('copyLabel')} ${contact.smsNumber}`}
            >
              {copiedKey === `sms-${countryCode}` ? '✓' : '⎘'}
            </button>
          </div>
        )}

        {contact.chatUrl && (
          <a
            href={contact.chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1 bg-violet-900/40 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            aria-label={`${t('chatLabel')} ${countryName}`}
          >
            🖥️ {t('chatButton')}
          </a>
        )}
      </div>
    </li>
  );
}
