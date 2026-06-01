'use client';

import { useState, useCallback } from 'react';
import { MOCK_GLOBAL_DATA } from '@/lib/mock-data';
import { mapCountToBlueColor } from '@/lib/viz-tokens';
import type { CountryGlobeData } from '@/types/helpline';

/**
 * ChoroplethMap — geographic heatmap with time slider.
 *
 * Implementation plan (per visualization.md §4):
 * - Base map: react-simple-maps + d3-geo Natural Earth projection
 * - Encoding: Choropleth (country fill by helpline density)
 * - Time axis: verified_at field → monthly slider
 * - Controls: Country filter, Category filter, Play/Pause, Speed
 *
 * Current state: Placeholder showing countries as cards with density colors.
 * Full react-simple-maps integration follows in feat/viz-c-heatmap branch.
 */

export default function ChoroplethMap() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDate, setCurrentDate] = useState('2026-06');
  const [hoveredCountry, setHoveredCountry] = useState<CountryGlobeData | null>(null);

  const countries = MOCK_GLOBAL_DATA.countries;
  const maxCount = Math.max(...countries.map((c) => c.helplineCount));

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls bar */}
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-950/50"
        role="toolbar"
        aria-label="Heatmap controls"
      >
        <FilterBadge label="All Countries" />
        <FilterBadge label="All Categories" />

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md transition-colors"
            aria-label={isPlaying ? 'Pause time playback' : 'Play time playback'}
          >
            <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            onClick={() => setCurrentDate('2026-06')}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden p-6">
        {/* Placeholder grid map */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">
              Choropleth map (react-simple-maps implementation in feat/viz-c-heatmap)
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-w-3xl">
              {countries.map((country) => {
                const color = mapCountToBlueColor(country.helplineCount, maxCount);
                return (
                  <button
                    key={country.countryCode}
                    className="aspect-square rounded-lg border border-gray-800 hover:border-gray-600 transition-colors flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: color + '33', color }}
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    aria-label={`${country.countryName}: ${country.helplineCount} helplines`}
                  >
                    {country.countryCode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCountry && (
          <div className="absolute top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm shadow-lg pointer-events-none">
            <div className="font-medium text-white">{hoveredCountry.countryName}</div>
            <div className="text-gray-400 text-xs mt-0.5">
              {hoveredCountry.helplineCount} helpline{hoveredCountry.helplineCount !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {/* Color scale legend */}
        <div className="absolute bottom-4 left-4 bg-gray-950/80 border border-gray-800 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500 mb-1.5">Helpline count</div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Low</span>
            <div className="flex gap-0.5">
              {['300', '400', '500', '600', '700'].map((shade) => (
                <div
                  key={shade}
                  className={`w-5 h-3 rounded-sm bg-seq-blue-${shade}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">High</span>
          </div>
        </div>
      </div>

      {/* Time slider */}
      <TimeSlider
        currentDate={currentDate}
        onChange={setCurrentDate}
        minDate="2024-01"
        maxDate="2026-06"
      />

      {/* Screen-reader accessible data table */}
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
          {countries.map((country) => (
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

interface TimeSliderProps {
  currentDate: string;
  minDate: string;
  maxDate: string;
  onChange: (date: string) => void;
}

function TimeSlider({ currentDate, minDate, maxDate, onChange }: TimeSliderProps) {
  const months = generateMonthRange(minDate, maxDate);
  const currentIndex = months.indexOf(currentDate);

  return (
    <div className="border-t border-gray-800 bg-gray-950/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 w-16 flex-shrink-0">{minDate}</span>
        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={months.length - 1}
            value={currentIndex >= 0 ? currentIndex : months.length - 1}
            onChange={(e) => onChange(months[Number(e.target.value)] ?? currentDate)}
            className="w-full h-1 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-seq-blue-400"
            aria-label="Time period selector"
            aria-valuenow={currentIndex >= 0 ? currentIndex : months.length - 1}
            aria-valuemin={0}
            aria-valuemax={months.length - 1}
            aria-valuetext={currentDate}
            role="slider"
          />
        </div>
        <span className="text-xs text-gray-600 w-16 flex-shrink-0 text-right">{maxDate}</span>
        <span className="text-xs font-mono text-seq-blue-400 w-16 flex-shrink-0 text-right">
          {currentDate}
        </span>
      </div>
    </div>
  );
}

function FilterBadge({ label }: { label: string }) {
  return (
    <button className="text-xs bg-gray-800 text-gray-400 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors">
      {label} ▾
    </button>
  );
}

function generateMonthRange(start: string, end: string): string[] {
  const months: string[] = [];
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = end.split('-').map(Number);
  let year = startYear ?? 2024;
  let month = startMonth ?? 1;
  while (year < (endYear ?? 2026) || (year === (endYear ?? 2026) && month <= (endMonth ?? 6))) {
    months.push(`${year}-${String(month).padStart(2, '0')}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return months;
}
