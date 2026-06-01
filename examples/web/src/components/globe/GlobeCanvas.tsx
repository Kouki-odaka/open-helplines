'use client';

/**
 * GlobeCanvas — WebGL globe renderer using react-globe.gl.
 *
 * This component is dynamically imported (no SSR) since WebGL requires browser APIs.
 * Awaiting team-lead approval for react-globe.gl selection before full implementation.
 *
 * Planned features:
 * - Arc / point representation per country (uiux-viz decision pending)
 * - CVD-safe color palette from tailwind.config.ts
 * - Country hover tooltip
 * - Country click → CountryDetailPanel
 */

import { useState, useCallback } from 'react';
import type { CountryGlobeData } from '@/types/helpline';
import { MOCK_GLOBAL_DATA } from '@/lib/mock-data';
import { CountryDetailPanel } from './CountryDetailPanel';
import { GlobeStatsOverlay } from './GlobeStatsOverlay';

// TODO: Replace with: import Globe from 'react-globe.gl';
// (Awaiting plan_approval_response from team-lead for react-globe.gl vs globe.gl choice)

export default function GlobeCanvas() {
  const [selectedCountry, setSelectedCountry] = useState<CountryGlobeData | null>(null);
  const globeData = MOCK_GLOBAL_DATA;

  const handleCountryClose = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* Globe placeholder — will be replaced with react-globe.gl component */}
      <GlobePlaceholder
        countries={globeData.countries}
        onCountrySelect={setSelectedCountry}
      />

      {/* Stats overlay (top-left) */}
      <GlobeStatsOverlay
        totalCountries={globeData.countries.length}
        totalHelplines={globeData.totalRecords}
      />

      {/* Country detail panel (right sidebar) */}
      <CountryDetailPanel
        countryData={selectedCountry}
        onClose={handleCountryClose}
      />
    </div>
  );
}

/** Temporary placeholder for the actual globe — shows a grid of country cards */
interface GlobePlaceholderProps {
  countries: CountryGlobeData[];
  onCountrySelect: (country: CountryGlobeData) => void;
}

function GlobePlaceholder({ countries, onCountrySelect }: GlobePlaceholderProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4" aria-hidden="true">🌍</div>
        <h2 className="text-xl font-semibold mb-2">Globe Visualization</h2>
        <p className="text-neutral-muted text-sm max-w-md">
          3D WebGL globe is being implemented. Click on a country card below to preview the
          detail panel.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-4xl w-full">
        {countries.map((country) => (
          <button
            key={country.countryCode}
            onClick={() => onCountrySelect(country)}
            className="bg-neutral-surface border border-neutral-border hover:border-brand rounded-lg p-3 text-left transition-colors group"
            aria-label={`View helplines for ${country.countryName}`}
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform" aria-hidden="true">
              {getFlagEmoji(country.countryCode)}
            </div>
            <div className="text-xs font-medium text-neutral-text truncate">
              {country.countryName}
            </div>
            <div className="text-xs text-neutral-muted mt-0.5">
              {country.helplineCount} helpline{country.helplineCount !== 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Converts ISO 2-letter country code to flag emoji */
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
