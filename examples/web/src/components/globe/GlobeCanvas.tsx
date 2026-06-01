'use client';

/**
 * GlobeCanvas — WebGL globe renderer using globe.gl.
 *
 * Uses Globe from globe.gl (Three.js based) for WebGL rendering.
 * Dynamically imported (no SSR) since WebGL requires browser APIs.
 *
 * Visual encoding (per visualization.md §2.1):
 * - Points/columns representing helpline count per country
 * - Height: log scale (helpline_count → 0.01..0.35)
 * - Color mode: Count (sequential blue) | Category (Okabe-Ito) | Languages (sequential green)
 * - Hover: GlobeTooltip with flag + stats
 * - Click: CountryDetailPanel (right sidebar, 320px)
 * - Auto-rotate: 0.5 deg/frame, pauses on interaction, resumes after 5s
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { CountryGlobeData } from '@/types/helpline';
import { MOCK_GLOBAL_DATA } from '@/lib/mock-data';
import {
  mapCountToColumnHeight,
  mapCountToBlueColor,
  getCategoryColor,
  vizTokens,
} from '@/lib/viz-tokens';
import { CountryDetailPanel } from './CountryDetailPanel';
import { GlobeStatsOverlay } from './GlobeStatsOverlay';
import { GlobeTooltip } from './GlobeTooltip';

/** Color mode options for globe columns */
export type ColorMode = 'count' | 'category' | 'languages';

/** Data point for globe.gl point layer */
interface GlobePoint {
  lat: number;
  lng: number;
  altitude: number;
  color: string;
  countryData: CountryGlobeData;
}

function buildGlobePoints(countries: CountryGlobeData[], colorMode: ColorMode): GlobePoint[] {
  const maxCount = Math.max(...countries.map((c) => c.helplineCount), 1);
  const maxLanguages = Math.max(...countries.map((c) => c.languages.length), 1);

  return countries.map((country) => {
    const altitude = mapCountToColumnHeight(country.helplineCount, maxCount);

    let color: string;
    switch (colorMode) {
      case 'category': {
        const primaryCategory = country.categories[0] ?? 'other';
        color = getCategoryColor(primaryCategory, 'dark');
        break;
      }
      case 'languages': {
        const langRatio = country.languages.length / maxLanguages;
        const shades = [300, 400, 500, 600, 700] as const;
        const idx = Math.min(Math.floor(langRatio * shades.length), shades.length - 1);
        color = vizTokens.colors.sequential.green[shades[idx] ?? 400];
        break;
      }
      case 'count':
      default:
        color = mapCountToBlueColor(country.helplineCount, maxCount);
    }

    return { lat: country.lat, lng: country.lng, altitude, color, countryData: country };
  });
}

export default function GlobeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeInstanceRef = useRef<any>(null);
  const autoRotateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<CountryGlobeData | null>(null);
  const [tooltip, setTooltip] = useState<{ point: GlobePoint; x: number; y: number } | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>('count');
  const [isReady, setIsReady] = useState(false);

  const globeData = MOCK_GLOBAL_DATA;

  const resumeAutoRotate = useCallback(() => {
    const globe = globeInstanceRef.current;
    if (!globe) return;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = vizTokens.animation.globe.autoRotateSpeed;
  }, []);

  const pauseAutoRotateAndScheduleResume = useCallback(() => {
    const globe = globeInstanceRef.current;
    if (!globe) return;
    globe.controls().autoRotate = false;
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(resumeAutoRotate, 5000);
  }, [resumeAutoRotate]);

  // Initialize globe on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isMounted = true;

    const initGlobe = async () => {
      // globe.gl is a factory function; TypeScript types declare it as a class
      // but it's actually callable as Globe()(element) in JS. Use type cast.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { default: GlobeCtor } = await import('globe.gl') as any;
      if (!isMounted || !container) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globe: any = (GlobeCtor as any)()(container);

      // Visual style
      globe
        .globeImageUrl('')
        .backgroundColor(vizTokens.colors.surface['globe-bg'].dark)
        .showAtmosphere(true)
        .atmosphereColor(vizTokens.globe.atmosphere.color)
        .atmosphereAltitude(0.25)
        .showGraticules(false);

      // Initial camera
      globe.pointOfView({ lat: 20, lng: 0, altitude: vizTokens.globe.camera.initialAltitude });
      globe.controls().minDistance = 150;
      globe.controls().maxDistance = 800;

      // Auto-rotate (respect reduced motion)
      if (!prefersReducedMotion) {
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = vizTokens.animation.globe.autoRotateSpeed;
      }

      // Country points (light columns)
      const points = buildGlobePoints(globeData.countries, 'count');
      globe
        .pointsData(points)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointLat((d: any) => (d as GlobePoint).lat)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointLng((d: any) => (d as GlobePoint).lng)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointAltitude((d: any) => (d as GlobePoint).altitude)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointColor((d: any) => (d as GlobePoint).color)
        .pointRadius(0.45)
        .pointsMerge(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .onPointHover((point: any, event: any) => {
          if (point && event) {
            setTooltip({
              point: point as GlobePoint,
              x: (event as MouseEvent).clientX,
              y: (event as MouseEvent).clientY,
            });
            container.style.cursor = 'pointer';
          } else {
            setTooltip(null);
            container.style.cursor = 'default';
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .onPointClick((point: any) => {
          if (point && !prefersReducedMotion) {
            setSelectedCountry((point as GlobePoint).countryData);
            pauseAutoRotateAndScheduleResume();
          }
        });

      // Pause auto-rotate on user interaction
      if (!prefersReducedMotion) {
        globe.controls().addEventListener('start', pauseAutoRotateAndScheduleResume);
      }

      globeInstanceRef.current = globe;
      setIsReady(true);
    };

    initGlobe().catch((err) => {
      // globe.gl failed to load (e.g., WebGL unavailable)
      // Fall through to the fallback grid view
      // globe.gl failed to load (e.g., WebGL unavailable) — fall through to fallback
      void err;
      setIsReady(true);
    });

    return () => {
      isMounted = false;
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update point colors/altitudes when color mode changes
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !isReady) return;
    const updated = buildGlobePoints(globeData.countries, colorMode);
    globe.pointsData(updated);
  }, [colorMode, isReady, globeData.countries]);

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: vizTokens.colors.surface['globe-bg'].dark }}
    >
      {/* WebGL Globe container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        onDoubleClick={() => {
          setSelectedCountry(null);
          resumeAutoRotate();
        }}
        aria-label="Interactive 3D globe showing global crisis helpline coverage by country"
        role="application"
      />

      {/* Accessible data table (screen readers) */}
      <GlobeAccessibilityTable countries={globeData.countries} />

      {/* Hover tooltip */}
      {tooltip && (
        <GlobeTooltip
          countryData={tooltip.point.countryData}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}

      {/* Bottom stats bar with color mode toggle */}
      <GlobeStatsOverlay
        totalCountries={globeData.countries.length}
        totalHelplines={globeData.totalRecords}
        colorMode={colorMode}
        onColorModeChange={setColorMode}
      />

      {/* Right sidebar: country detail panel */}
      <CountryDetailPanel
        countryData={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />

      {/* Loading state */}
      {!isReady && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: vizTokens.colors.surface['globe-bg'].dark }}
          aria-live="polite"
          aria-label="Loading globe"
        >
          <div className="text-5xl mb-3" style={{ animation: 'spin 3s linear infinite' }} aria-hidden="true">
            🌍
          </div>
          <p className="text-gray-500 text-sm">Loading globe…</p>
        </div>
      )}
    </div>
  );
}

/** Screen-reader accessible table for globe data (per visualization.md §5.4) */
function GlobeAccessibilityTable({ countries }: { countries: CountryGlobeData[] }) {
  return (
    <table
      className="sr-only"
      aria-label="Helplines by country — globe data"
    >
      <caption>
        Number of crisis helplines per country, visualized as columns on the 3D globe.
        Countries with more helplines have taller columns.
      </caption>
      <thead>
        <tr>
          <th scope="col">Country</th>
          <th scope="col">Helpline Count</th>
          <th scope="col">Primary Category</th>
          <th scope="col">Languages</th>
          <th scope="col">Contact Methods</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <tr key={country.countryCode}>
            <td>{country.countryName} ({country.countryCode})</td>
            <td>{country.helplineCount}</td>
            <td>{country.categories[0]?.replace(/_/g, ' ') ?? '—'}</td>
            <td>{country.languages.join(', ')}</td>
            <td>{country.contactMethods.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
