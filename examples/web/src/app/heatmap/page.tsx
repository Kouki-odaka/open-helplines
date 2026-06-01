import type { Metadata } from 'next';
import { HeatmapView } from '@/components/heatmap/HeatmapView';

export const metadata: Metadata = {
  title: 'Open Helplines — Heatmap View',
  description:
    'Geographic heatmap showing density of crisis support resources by region.',
};

export default function HeatmapPage() {
  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-4rem)] min-h-[500px]">
      <HeatmapView />
    </div>
  );
}
