'use client';

import type { CountryGlobeData } from '@/types/helpline';

interface GlobeTooltipProps {
  countryData: CountryGlobeData;
  /** Mouse cursor X position in viewport coordinates */
  x: number;
  /** Mouse cursor Y position in viewport coordinates */
  y: number;
}

/**
 * GlobeTooltip — floating tooltip shown on country hover.
 *
 * Per visualization.md §2.4.2:
 * - Flag + country name
 * - Helpline count, language count, category count
 * - Positioned to avoid viewport edges
 */
export function GlobeTooltip({ countryData, x, y }: GlobeTooltipProps) {
  // Offset tooltip so it doesn't overlap cursor
  const OFFSET_X = 12;
  const OFFSET_Y = 12;
  const TOOLTIP_WIDTH = 200;
  const TOOLTIP_HEIGHT = 90;

  // Flip horizontally if near right edge
  const flipX = x + TOOLTIP_WIDTH + OFFSET_X > window.innerWidth;
  const flipY = y + TOOLTIP_HEIGHT + OFFSET_Y > window.innerHeight;

  const left = flipX ? x - TOOLTIP_WIDTH - OFFSET_X : x + OFFSET_X;
  const top = flipY ? y - TOOLTIP_HEIGHT - OFFSET_Y : y + OFFSET_Y;

  return (
    <div
      className="fixed pointer-events-none z-50 bg-gray-950/95 border border-gray-700 rounded-lg shadow-lg px-3 py-2.5 text-sm"
      style={{ left, top, width: TOOLTIP_WIDTH }}
      role="tooltip"
      aria-label={`${countryData.countryName}: ${countryData.helplineCount} helplines`}
    >
      {/* Country flag + name */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg leading-none" aria-hidden="true">
          {getFlagEmoji(countryData.countryCode)}
        </span>
        <span className="font-semibold text-white truncate">
          {countryData.countryName}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mb-1.5" />

      {/* Stats */}
      <div className="space-y-0.5 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Helplines</span>
          <span className="text-white font-medium">{countryData.helplineCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Languages</span>
          <span className="text-white font-medium">{countryData.languages.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Categories</span>
          <span className="text-white font-medium">{countryData.categories.length}</span>
        </div>
      </div>
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
