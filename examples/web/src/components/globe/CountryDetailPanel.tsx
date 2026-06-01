'use client';

import { useTranslations } from 'next-intl';
import type { CountryDetailPanelProps } from '@/types/helpline';
import { formatCategoryLabel, formatContactMethodLabel } from '@/lib/data-aggregator';

/**
 * CountryDetailPanel — right sidebar showing helpline details for a selected country.
 * Slides in from the right when a country is selected on the globe.
 */
export function CountryDetailPanel({ countryData, onClose }: CountryDetailPanelProps) {
  const t = useTranslations('globe.panel');
  const tCommon = useTranslations('common');

  if (!countryData) {
    return null;
  }

  const helplineCountLabel =
    countryData.helplineCount === 1
      ? t('helplineCount', { count: countryData.helplineCount })
      : t('helplineCountPlural', { count: countryData.helplineCount });

  return (
    <aside
      className={[
        'fixed bottom-0 left-0 right-0 max-h-[60vh] rounded-t-2xl',
        'md:absolute md:bottom-auto md:left-auto md:top-0 md:right-0 md:h-full md:max-h-none md:w-80 md:rounded-none',
        'bg-neutral-surface border-t md:border-t-0 md:border-l border-neutral-border shadow-xl z-10 overflow-y-auto scrollbar-hidden',
      ].join(' ')}
      role="complementary"
      aria-label={`Helplines for ${countryData.countryName}`}
    >
      {/* Mobile drag handle */}
      <div className="md:hidden flex justify-center pt-2.5 pb-1" aria-hidden="true">
        <div className="w-10 h-1 bg-gray-600 rounded-full" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-neutral-surface border-b border-neutral-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            {getFlagEmoji(countryData.countryCode)}
          </span>
          <div>
            <h2 className="font-semibold text-sm leading-tight">{countryData.countryName}</h2>
            <p className="text-xs text-neutral-muted">{helplineCountLabel}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-muted hover:text-neutral-text transition-colors p-1 rounded"
          aria-label={t('close')}
        >
          ✕
        </button>
      </div>

      {/* Categories */}
      <section className="px-4 py-3 border-b border-neutral-border">
        <h3 className="text-xs font-medium text-neutral-muted uppercase tracking-wider mb-2">
          {t('categories')}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {countryData.categories.map((category) => (
            <span
              key={category}
              className="text-xs bg-neutral-border px-2 py-0.5 rounded-full text-neutral-text"
            >
              {formatCategoryLabel(category)}
            </span>
          ))}
        </div>
      </section>

      {/* Contact methods */}
      <section className="px-4 py-3 border-b border-neutral-border">
        <h3 className="text-xs font-medium text-neutral-muted uppercase tracking-wider mb-2">
          {t('contactMethods')}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {countryData.contactMethods.map((method) => (
            <span
              key={method}
              className="text-xs bg-brand/20 text-brand-light px-2 py-0.5 rounded-full"
            >
              {formatContactMethodLabel(method)}
            </span>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="px-4 py-3 border-b border-neutral-border">
        <h3 className="text-xs font-medium text-neutral-muted uppercase tracking-wider mb-2">
          {t('languages', { count: countryData.languages.length })}
        </h3>
        <p className="text-sm text-neutral-muted">{countryData.languages.join(', ')}</p>
      </section>

      {/* Helpline records */}
      {countryData.records.length > 0 ? (
        <section className="px-4 py-3">
          <h3 className="text-xs font-medium text-neutral-muted uppercase tracking-wider mb-3">
            {t('helplines')}
          </h3>
          <ul className="space-y-3">
            {countryData.records.map((record) => (
              <li
                key={record.id}
                className="bg-neutral-bg border border-neutral-border rounded-lg p-3"
              >
                <h4 className="font-medium text-sm mb-1">{record.name}</h4>
                {record.local_name && (
                  <p className="text-xs text-neutral-muted mb-1">{record.local_name}</p>
                )}
                <p className="text-xs text-neutral-muted line-clamp-2 mb-2">
                  {record.description}
                </p>
                {record.contacts.map((contact, index) => (
                  <div key={index} className="text-xs flex items-center gap-2 mt-1">
                    <span className="text-brand-light font-mono">
                      {contact.number ?? contact.url ?? '-'}
                    </span>
                    <span className="text-neutral-muted">{contact.hours}</span>
                  </div>
                ))}
                {record.website && (
                  <a
                    href={record.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-light hover:underline mt-1 inline-block"
                  >
                    {tCommon('visitWebsite')}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="px-4 py-3 text-center text-sm text-neutral-muted">
          <p>{t('noRecords')}</p>
        </section>
      )}
    </aside>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
