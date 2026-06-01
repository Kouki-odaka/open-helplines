'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useTranslations } from 'next-intl';
import { useHelplinesData } from '@/lib/use-helplines-data';
import { mapCountToBlueColor } from '@/lib/viz-tokens';
import type { CountryGlobeData, HelplineCategory } from '@/types/helpline';

// ─── Constants ───────────────────────────────────────────────────────────────

const WORLD_TOPOJSON_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const TIME_RANGE_START = '2024-01';
const TIME_RANGE_END = '2026-06';
const PLAYBACK_DEFAULT_INTERVAL_MS = 600;
const PLAYBACK_FAST_INTERVAL_MS = 200;

// ISO numeric code → alpha-2 mapping for countries in mock data
const ISO_NUMERIC_TO_ALPHA2: Record<string, string> = {
  '840': 'US', // United States of America
  '826': 'GB', // United Kingdom
  '036': 'AU', // Australia
  '124': 'CA', // Canada
  '392': 'JP', // Japan
  '276': 'DE', // Germany
  '356': 'IN', // India
  '076': 'BR', // Brazil
  '250': 'FR', // France
  '410': 'KR', // South Korea
  '710': 'ZA', // South Africa
  '032': 'AR', // Argentina
  '566': 'NG', // Nigeria
  '484': 'MX', // Mexico
  '704': 'VN', // Vietnam
  '050': 'BD', // Bangladesh
  '586': 'PK', // Pakistan
  '818': 'EG', // Egypt
  '792': 'TR', // Turkey
  '528': 'NL', // Netherlands
  '752': 'SE', // Sweden
  '578': 'NO', // Norway
  '208': 'DK', // Denmark
  '246': 'FI', // Finland
  '756': 'CH', // Switzerland
  '040': 'AT', // Austria
  '724': 'ES', // Spain
  '380': 'IT', // Italy
  '620': 'PT', // Portugal
  '616': 'PL', // Poland
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CountrySnapshot {
  helplineCount: number;
  categories: HelplineCategory[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateMonthRange(start: string, end: string): string[] {
  const months: string[] = [];
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = end.split('-').map(Number);
  let year = startYear ?? 2024;
  let month = startMonth ?? 1;
  while (
    year < (endYear ?? 2026) ||
    (year === (endYear ?? 2026) && month <= (endMonth ?? 6))
  ) {
    months.push(`${year}-${String(month).padStart(2, '0')}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return months;
}

/**
 * Build per-country snapshots filtered to records verified before `upToMonth`.
 * Returns a Map<alpha2Code, snapshot> for quick lookup in Geographies render.
 */
function buildCountrySnapshots(
  countries: CountryGlobeData[],
  upToMonth: string,
  filterCategory: string
): Map<string, CountrySnapshot> {
  const snapshots = new Map<string, CountrySnapshot>();
  const cutoffDate = `${upToMonth}-31`; // inclusive end of month

  for (const country of countries) {
    const filteredRecords = country.records.filter((record) => {
      const isBeforeCutoff = record.verified_at <= cutoffDate;
      const matchesCategory =
        !filterCategory ||
        record.category === filterCategory ||
        (record.secondary_categories ?? []).includes(filterCategory as HelplineCategory);
      return isBeforeCutoff && matchesCategory;
    });

    if (filteredRecords.length > 0) {
      const categorySet = new Set<HelplineCategory>();
      for (const rec of filteredRecords) {
        categorySet.add(rec.category);
        for (const secCat of rec.secondary_categories ?? []) {
          categorySet.add(secCat);
        }
      }
      snapshots.set(country.countryCode, {
        helplineCount: filteredRecords.length,
        categories: Array.from(categorySet) as HelplineCategory[],
      });
    }
  }

  return snapshots;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChoroplethMap() {
  const t = useTranslations('heatmap');
  const { data: helplinesData } = useHelplinesData();
  const allCountries = helplinesData.countries;
  const allMonths = useMemo(
    () => generateMonthRange(TIME_RANGE_START, TIME_RANGE_END),
    []
  );
  const totalMonths = allMonths.length;
  const maxHelplineCount = useMemo(
    () => Math.max(...allCountries.map((c) => c.helplineCount), 1),
    [allCountries]
  );

  const [currentMonthIndex, setCurrentMonthIndex] = useState(totalMonths - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFastPlay, setIsFastPlay] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    code: string;
    count: number;
    categories: string[];
  } | null>(null);

  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMonth = allMonths[currentMonthIndex] ?? TIME_RANGE_END;

  // Derive all category names for the filter dropdown
  const allCategoryNames = useMemo(
    () =>
      Array.from(new Set(allCountries.flatMap((c) => c.categories))).sort(),
    [allCountries]
  );

  // Build snapshot for current time + filter
  const countrySnapshots = useMemo(
    () => buildCountrySnapshots(allCountries, currentMonth, filterCategory),
    [allCountries, currentMonth, filterCategory]
  );

  // ── Playback ─────────────────────────────────────────────────────────────

  const stopPlayback = useCallback(() => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    const intervalMs = isFastPlay
      ? PLAYBACK_FAST_INTERVAL_MS
      : PLAYBACK_DEFAULT_INTERVAL_MS;

    playIntervalRef.current = setInterval(() => {
      setCurrentMonthIndex((prev) => {
        if (prev >= totalMonths - 1) {
          stopPlayback();
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);
    setIsPlaying(true);
  }, [isFastPlay, totalMonths, stopPlayback]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      if (currentMonthIndex >= totalMonths - 1) {
        setCurrentMonthIndex(0);
      }
      startPlayback();
    }
  }, [isPlaying, currentMonthIndex, totalMonths, startPlayback, stopPlayback]);

  // Restart playback when speed changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFastPlay]);

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  // ── Geography color helper ────────────────────────────────────────────────

  function getGeoFillColor(geoNumericId: string): string {
    const alpha2 = ISO_NUMERIC_TO_ALPHA2[geoNumericId];
    if (!alpha2) return '#1F2937'; // unmapped country: dark gray

    const snapshot = countrySnapshots.get(alpha2);
    if (!snapshot) return '#111827'; // no data: near-black

    return mapCountToBlueColor(snapshot.helplineCount, maxHelplineCount);
  }

  function handleGeoHover(geoNumericId: string, geoName: string) {
    const alpha2 = ISO_NUMERIC_TO_ALPHA2[geoNumericId];
    if (!alpha2) {
      setHoveredCountry(null);
      return;
    }
    const snapshot = countrySnapshots.get(alpha2);
    setHoveredCountry({
      name: geoName,
      code: alpha2,
      count: snapshot?.helplineCount ?? 0,
      categories: snapshot?.categories.map((c) => c.replace(/_/g, ' ')) ?? [],
    });
  }

  const totalHelplinesVisible = useMemo(
    () =>
      Array.from(countrySnapshots.values()).reduce(
        (sum, s) => sum + s.helplineCount,
        0
      ),
    [countrySnapshots]
  );

  const totalCountriesVisible = countrySnapshots.size;

  return (
    <div className="w-full h-full flex flex-col">
      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-2.5 border-b border-gray-800 bg-gray-950/60"
        role="toolbar"
        aria-label="Heatmap controls"
      >
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[140px]"
          aria-label={t('filterCategory')}
        >
          <option value="">{t('allCategories')}</option>
          {allCategoryNames.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {/* Stats summary */}
        <div className="text-xs text-gray-500 ml-1">
          <span className="text-gray-300 font-medium">{totalHelplinesVisible}</span>{' '}
          helplines ·{' '}
          <span className="text-gray-300 font-medium">{totalCountriesVisible}</span>{' '}
          countries
        </div>

        {/* Playback controls */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setIsFastPlay((prev) => !prev)}
            className={`text-xs px-2.5 py-1 rounded transition-colors ${
              isFastPlay
                ? 'bg-blue-800 text-blue-200'
                : 'bg-gray-800 text-gray-500 hover:text-gray-300'
            }`}
            aria-label={isFastPlay ? 'Switch to normal speed' : 'Switch to fast speed'}
            title="Playback speed"
          >
            {isFastPlay ? '2×' : '1×'}
          </button>

          <button
            onClick={togglePlayback}
            className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md transition-colors"
            aria-label={isPlaying ? 'Pause time playback' : 'Play time playback'}
          >
            <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
            {isPlaying ? t('pause') : t('play')}
          </button>

          <button
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            onClick={() => {
              stopPlayback();
              setCurrentMonthIndex(totalMonths - 1);
            }}
            aria-label="Reset to latest date"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Map canvas ────────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden bg-gray-950">
        <ComposableMap
          projectionConfig={{ scale: 147, center: [0, 15] }}
          style={{ width: '100%', height: '100%' }}
          aria-label={`World choropleth map showing ${totalHelplinesVisible} helplines as of ${currentMonth}`}
        >
          <Geographies geography={WORLD_TOPOJSON_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoId = String(geo.id).padStart(3, '0');
                const fillColor = getGeoFillColor(geoId);
                const isDataCountry = ISO_NUMERIC_TO_ALPHA2[geoId] !== undefined;
                const hasData = countrySnapshots.has(
                  ISO_NUMERIC_TO_ALPHA2[geoId] ?? ''
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#374151"
                    strokeWidth={0.4}
                    onMouseEnter={() =>
                      handleGeoHover(geoId, geo.properties.name ?? '')
                    }
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: {
                        fill: fillColor,
                        outline: 'none',
                        transition: 'fill 0.3s ease',
                      },
                      hover: {
                        fill: hasData
                          ? fillColor
                          : isDataCountry
                          ? '#374151'
                          : '#2D3748',
                        outline: '2px solid rgba(147,197,253,0.6)',
                        cursor: isDataCountry ? 'pointer' : 'default',
                      },
                      pressed: { fill: fillColor, outline: 'none' },
                    }}
                    aria-label={
                      hasData
                        ? `${geo.properties.name}: ${countrySnapshots.get(ISO_NUMERIC_TO_ALPHA2[geoId] ?? '')?.helplineCount ?? 0} helplines`
                        : `${geo.properties.name}: no data`
                    }
                    tabIndex={isDataCountry ? 0 : -1}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Country hover tooltip */}
        {hoveredCountry && hoveredCountry.count > 0 && (
          <div
            className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2.5 text-xs max-w-[200px] pointer-events-none"
            aria-live="polite"
          >
            <div className="font-semibold text-white mb-1">
              {hoveredCountry.name}
            </div>
            <div className="text-gray-400">
              {hoveredCountry.count} helpline
              {hoveredCountry.count !== 1 ? 's' : ''}
            </div>
            {hoveredCountry.categories.length > 0 && (
              <div className="text-gray-500 mt-1 text-[10px] leading-relaxed">
                {hoveredCountry.categories.slice(0, 3).join(' · ')}
                {hoveredCountry.categories.length > 3 && ' …'}
              </div>
            )}
          </div>
        )}

        {/* Color scale legend */}
        <div className="absolute bottom-3 left-3 bg-gray-950/85 border border-gray-800 rounded-lg px-3 py-2.5">
          <div className="text-xs text-gray-500 mb-2">Helpline count</div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-600">Low</span>
            <div className="flex gap-0.5">
              {[0.1, 0.3, 0.5, 0.7, 0.9, 1.0].map((ratio) => (
                <div
                  key={ratio}
                  className="w-5 h-3 rounded-sm"
                  style={{
                    backgroundColor: mapCountToBlueColor(
                      Math.round(ratio * maxHelplineCount),
                      maxHelplineCount
                    ),
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-600">High</span>
          </div>
          <div className="text-[10px] text-gray-600 mt-1.5 border-t border-gray-800 pt-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm mr-1 align-middle"
              style={{ backgroundColor: '#111827' }}
              aria-hidden="true"
            />
            No data
          </div>
        </div>
      </div>

      {/* ── Time slider ───────────────────────────────────────────────────── */}
      <div
        className="border-t border-gray-800 bg-gray-950/60 px-4 py-3"
        role="group"
        aria-label="Time slider"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-16 shrink-0 font-mono">
            {TIME_RANGE_START}
          </span>

          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={totalMonths - 1}
              value={currentMonthIndex}
              onChange={(e) => {
                stopPlayback();
                setCurrentMonthIndex(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-blue-400
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-gray-950
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue-400
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-gray-950"
              aria-label="Select time period"
              aria-valuenow={currentMonthIndex}
              aria-valuemin={0}
              aria-valuemax={totalMonths - 1}
              aria-valuetext={currentMonth}
            />
          </div>

          <span className="text-xs text-gray-600 w-16 shrink-0 font-mono text-right">
            {TIME_RANGE_END}
          </span>
          <span className="text-xs font-mono text-blue-400 w-16 shrink-0 text-right">
            {currentMonth}
          </span>
        </div>
      </div>

      {/* SR-only accessibility table */}
      <table className="sr-only" aria-label="Helplines by country choropleth data">
        <caption>Number of crisis helplines per country</caption>
        <thead>
          <tr>
            <th>Country</th>
            <th>Helpline Count</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          {allCountries.map((country) => (
            <tr key={country.countryCode}>
              <td>{country.countryName}</td>
              <td>{country.helplineCount}</td>
              <td>{country.categories.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
