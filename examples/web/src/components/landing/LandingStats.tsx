import { MOCK_GLOBAL_DATA } from '@/lib/mock-data';

/**
 * LandingStats — shows high-level statistics on the landing page.
 * Data will be replaced by real aggregated stats post Task #1 merge.
 */
export function LandingStats() {
  const { countries, totalRecords } = MOCK_GLOBAL_DATA;
  const allLanguages = new Set(countries.flatMap((c) => c.languages));

  const stats = [
    { value: countries.length, label: 'countries' },
    { value: `${totalRecords}+`, label: 'helplines' },
    { value: allLanguages.size, label: 'languages' },
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
