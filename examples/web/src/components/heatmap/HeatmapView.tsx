'use client';

import dynamic from 'next/dynamic';

const ChoroplethMap = dynamic(() => import('./ChoroplethMap'), {
  ssr: false,
  loading: () => <HeatmapLoadingState />,
});

export function HeatmapView() {
  return (
    <div className="w-full h-full relative bg-[#0a0e1a]">
      <ChoroplethMap />
    </div>
  );
}

function HeatmapLoadingState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="text-6xl animate-pulse-gentle" aria-hidden="true">🔥</div>
      <p className="text-gray-500 text-sm animate-pulse">Loading heatmap…</p>
    </div>
  );
}
