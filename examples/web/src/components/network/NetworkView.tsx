'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with D3
const NetworkGraph = dynamic(() => import('./NetworkGraph'), {
  ssr: false,
  loading: () => <NetworkLoadingState />,
});

export function NetworkView() {
  return (
    <div className="w-full h-full relative bg-[#0a0e1a]">
      <NetworkGraph />
    </div>
  );
}

function NetworkLoadingState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="text-6xl animate-pulse-gentle" aria-hidden="true">🕸️</div>
      <p className="text-gray-500 text-sm animate-pulse">Loading network graph…</p>
    </div>
  );
}
