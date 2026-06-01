'use client';

import { useTranslations } from 'next-intl';
import type { CountryGlobeData } from '@/types/helpline';

interface GlobeTooltipProps {
  countryData: CountryGlobeData;
  /** Mouse cursor X position in viewport coordinates */
  x: number;
  /** Mouse cursor Y position in viewport coordinates */
  y: number;
}

const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 90;
const CURSOR_OFFSET = 12;

/**
 * GlobeTooltip — floating tooltip shown on country hover.
 * Per visualization.md §2.4.2: flag, country name, helpline/language/category counts.
 */
export function GlobeTooltip({ countryData, x, y }: GlobeTooltipProps) {
  const t = useTranslations('globe.tooltip');

  const flipX = x + TOOLTIP_WIDTH + CURSOR_OFFSET > window.innerWidth;
  const flipY = y + TOOLTIP_HEIGHT + CURSOR_OFFSET > window.innerHeight;
  const left = flipX ? x - TOOLTIP_WIDTH - CURSOR_OFFSET : x + CURSOR_OFFSET;
  const top = flipY ? y - TOOLTIP_HEIGHT - CURSOR_OFFSET : y + CURSOR_OFFSET;

  return (
    <div
      className="fixed pointer-events-none z-50 bg-gray-950/95 border border-gray-700 rounded-lg shadow-lg px-3 py-2.5 text-sm"
      style={{ left, top, width: TOOLTIP_WIDTH }}
      role="tooltip"
      aria-label={`${countryData.countryName}: ${countryData.helplineCount} ${t('helplines')}`}
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
          <span>{t('helplines')}</span>
          <span className="text-white font-medium">{countryData.helplineCount}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('languages')}</span>
          <span className="text-white font-medium">{countryData.languages.length}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('categories')}</span>
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
