'use client';

import { useTranslations } from 'next-intl';
import type { ColorMode } from './GlobeCanvas';

interface GlobeStatsOverlayProps {
  totalCountries: number;
  totalHelplines: number;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

/**
 * GlobeStatsOverlay — bottom bar with color mode toggle and stats.
 * Per visualization.md §6.2 wireframe.
 */
export function GlobeStatsOverlay({
  totalCountries,
  totalHelplines,
  colorMode,
  onColorModeChange,
}: GlobeStatsOverlayProps) {
  const t = useTranslations('globe');

  const colorModeOptions: { value: ColorMode; label: string }[] = [
    { value: 'count',     label: t('colorMode.count') },
    { value: 'category',  label: t('colorMode.category') },
    { value: 'languages', label: t('colorMode.languages') },
  ];

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-gray-950/85 backdrop-blur-sm border-t border-gray-800 px-4 py-2 flex flex-wrap items-center gap-4 text-sm z-10"
      role="toolbar"
      aria-label="Globe display options"
    >
      {/* Color mode selector */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs" id="color-mode-label">
          {t('colorMode.label')}
        </span>
        <div
          className="flex items-center gap-1"
          role="group"
          aria-labelledby="color-mode-label"
        >
          {colorModeOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onColorModeChange(value)}
              className={[
                'text-xs px-2.5 py-0.5 rounded-full transition-colors',
                colorMode === value
                  ? 'bg-seq-blue-800/80 text-seq-blue-300 font-medium'
                  : 'text-gray-600 hover:text-gray-400',
              ].join(' ')}
              aria-pressed={colorMode === value}
            >
              {colorMode === value && <span aria-hidden="true">● </span>}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="ml-auto text-xs text-gray-500">
        {t('stats.data')}{' '}
        <span className="text-gray-300 font-medium">
          {t('stats.countries', { count: totalCountries })}
        </span>
        {' · '}
        <span className="text-gray-300 font-medium">
          {t('stats.helplines', { count: totalHelplines })}
        </span>
      </div>
    </div>
  );
}
