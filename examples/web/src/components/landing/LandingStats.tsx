'use client';

import { useTranslations } from 'next-intl';
import { useHelplinesData } from '@/lib/use-helplines-data';

/**
 * LandingStats — shows high-level statistics on the landing page.
 * Reflects real counts from the collected helplines dataset.
 */
export function LandingStats() {
  const t = useTranslations('landing.stats');
  const { data } = useHelplinesData();
  const { countries, totalRecords } = data;
  const allLanguages = new Set(countries.flatMap((c) => c.languages));

  const stats = [
    { value: countries.length, label: t('countries') },
    { value: `${totalRecords}+`, label: t('helplines') },
    { value: allLanguages.size, label: t('languages') },
  ];

  return (
    <div className="flex flex-wrap gap-6 pt-2" role="list" aria-label="Project statistics">
      {stats.map(({ value, label }) => (
        <div key={label} className="flex items-center gap-2" role="listitem">
          <span className="w-2 h-2 rounded-full bg-seq-blue-400 flex-shrink-0" aria-hidden="true" />
          <span className="text-gray-300">
            <strong className="text-white font-semibold">{value}</strong>{' '}
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
