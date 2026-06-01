import type { Metadata } from 'next';
import { NetworkView } from '@/components/network/NetworkView';

export const metadata: Metadata = {
  title: 'Open Helplines — Network View',
  description:
    'Force-directed network graph showing relationships between helplines, categories, and languages.',
};

export default function NetworkPage() {
  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-4rem)] min-h-[500px]">
      <NetworkView />
    </div>
  );
}
