import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingStats } from '@/components/landing/LandingStats';
import { LandingCodeSnippets } from '@/components/landing/LandingCodeSnippets';

export const metadata: Metadata = {
  title: 'Open Helplines — Global Crisis Support Data',
  description:
    'Open data registry of mental health and crisis helplines worldwide. ' +
    'Free · CC0 · No API key required.',
};

/**
 * Landing page — project overview and CTA.
 * Routes users to the Globe visualization at /globe.
 */
export default function LandingPage() {
  return (
    <div className="min-h-full">
      {/* Hero section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-6">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl bg-seq-blue-700 flex items-center justify-center text-2xl flex-shrink-0"
              aria-hidden="true"
            >
              🌍
            </div>
            <div>
              <span className="text-xs font-mono text-seq-blue-400 uppercase tracking-wider">
                Open Data · CC0
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                open-helplines
              </h1>
            </div>
          </div>

          {/* Headline */}
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-white leading-snug max-w-2xl">
              Open data registry of mental health helplines{' '}
              <span className="text-seq-blue-400">worldwide.</span>
            </p>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl">
              Free · CC0 · No API key required.{' '}
              Use it in your app, service, or research — no strings attached.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/globe"
              className="inline-flex items-center gap-2 bg-seq-blue-600 hover:bg-seq-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <span>🌍</span>
              Explore the Globe →
            </Link>
            <a
              href="https://github.com/Kouki-odaka/open-helplines"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              View on GitHub
            </a>
          </div>

          {/* Stats bar */}
          <LandingStats />
        </div>
      </section>

      {/* Visualizations preview */}
      <section className="border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-6">Explore the data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <VisualizationCard
              href="/globe"
              icon="🌍"
              title="Globe View"
              description="Interactive 3D globe with helpline density by country"
            />
            <VisualizationCard
              href="/network"
              icon="🕸️"
              title="Network View"
              description="Force-directed graph of categories, languages and contacts"
            />
            <VisualizationCard
              href="/heatmap"
              icon="🔥"
              title="Heatmap View"
              description="Geographic choropleth with temporal timeline"
            />
          </div>
        </div>
      </section>

      {/* Code snippets */}
      <LandingCodeSnippets />

      {/* Contributing CTA */}
      <section className="border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-lg font-semibold text-gray-300 mb-2">
            Know a helpline that&apos;s missing?
          </h2>
          <p className="text-gray-500 mb-4">
            Add it in minutes — JSON + pull request. We verify and merge quickly.
          </p>
          <Link
            href="/contribute"
            className="inline-flex items-center gap-2 border border-seq-blue-600 text-seq-blue-400 hover:bg-seq-blue-900/30 px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Contribute data →
          </Link>
        </div>
      </section>
    </div>
  );
}

interface VisualizationCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

function VisualizationCard({ href, icon, title, description }: VisualizationCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-gray-900 border border-gray-800 hover:border-seq-blue-700 rounded-xl p-5 transition-colors"
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
