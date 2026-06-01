'use client';

interface GlobeStatsOverlayProps {
  totalCountries: number;
  totalHelplines: number;
}

/**
 * GlobeStatsOverlay — bottom stats bar shown on the globe view.
 * Matches wireframe §6.2: "Data: 22 countries · 83 helplines"
 */
export function GlobeStatsOverlay({ totalCountries, totalHelplines }: GlobeStatsOverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm border-t border-gray-800 px-4 py-2 flex flex-wrap items-center gap-4 text-sm z-10">
      {/* Color mode selector */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs">Color:</span>
        <ColorModeButton label="Count" isActive={true} />
        <ColorModeButton label="Category" isActive={false} />
        <ColorModeButton label="Languages" isActive={false} />
      </div>

      {/* Stats */}
      <div className="ml-auto text-xs text-gray-500">
        Data:{' '}
        <span className="text-gray-300 font-medium">{totalCountries} countries</span>
        {' · '}
        <span className="text-gray-300 font-medium">{totalHelplines} helplines</span>
      </div>
    </div>
  );
}

interface ColorModeButtonProps {
  label: string;
  isActive: boolean;
}

function ColorModeButton({ label, isActive }: ColorModeButtonProps) {
  return (
    <button
      className={[
        'text-xs px-2 py-0.5 rounded-full transition-colors',
        isActive
          ? 'bg-seq-blue-800 text-seq-blue-300'
          : 'text-gray-600 hover:text-gray-400',
      ].join(' ')}
      aria-pressed={isActive}
    >
      {isActive && <span aria-hidden="true">● </span>}
      {label}
    </button>
  );
}
