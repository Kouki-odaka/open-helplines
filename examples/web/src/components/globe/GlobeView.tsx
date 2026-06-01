'use client';

/**
 * GlobeView — 3D interactive globe showing helpline coverage.
 *
 * Implementation status:
 * - Environment setup: ✅ (this file is the placeholder)
 * - react-globe.gl integration: ⏳ Awaiting team-lead approval (plan_approval_request viz-tech-choices-001)
 * - Real data integration: ⏳ Awaiting Task #1 (se-commit) merge
 * - UX design specs: ⏳ Awaiting Task #3 (uiux-viz)
 *
 * Uses react-globe.gl for WebGL 3D globe rendering (pending approval).
 * Falls back to a loading state until the library choice is confirmed.
 */

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with WebGL
const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), {
  ssr: false,
  loading: () => <GlobeLoadingState />,
});

export function GlobeView() {
  return (
    <div className="w-full h-full relative bg-neutral-bg">
      <GlobeCanvas />
    </div>
  );
}

function GlobeLoadingState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="text-6xl animate-spin-slow" aria-hidden="true">
        🌍
      </div>
      <p className="text-neutral-muted text-sm animate-pulse">
        Loading globe visualization…
      </p>
    </div>
  );
}
