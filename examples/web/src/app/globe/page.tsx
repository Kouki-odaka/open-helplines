import type { Metadata } from 'next';
import { GlobeView } from '@/components/globe/GlobeView';

export const metadata: Metadata = {
  title: 'Globe View — Open Helplines',
  description:
    'Interactive 3D globe showing crisis helpline coverage by country worldwide.',
};

/**
 * Globe View page (/globe) — 3D visualization (Case A).
 * Displays helpline density per country on an interactive WebGL globe using globe.gl.
 */
export default function GlobePage() {
  return (
    <div
      className="relative w-full"
      style={{ height: 'calc(100vh - 3.5rem)' }}
    >
      <GlobeView />
    </div>
  );
}
