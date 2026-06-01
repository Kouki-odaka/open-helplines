import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { LandingStats } from '@/components/landing/LandingStats';
import { LandingCodeSnippets } from '@/components/landing/LandingCodeSnippets';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface LocalePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Open Helplines — Global Crisis Support Data',
    description:
      'Open data registry of mental health and crisis helplines worldwide. Free · CC0 · No API key required.',
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((loc) => [loc, `/${loc}/`])
      ),
    },
  };
}

/**
 * Landing page — hero section, viz cards, code snippets, contribute CTA.
 * Locale-aware version under /[locale]/.
 */
export default async function LocaleLandingPage({ params: { locale } }: LocalePageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';

  setRequestLocale(validLocale);

  const t = await getTranslations({ locale: validLocale, namespace: 'landing' });

  // Use t.raw() to get template string without ICU formatting (no placeholder substitution)
  const headlineTemplate = t.raw('headline') as string;
  const headlineHighlight = t('headlineHighlight');
  const headlineParts = headlineTemplate.split('{highlight}');

  return (
    <div className="min-h-full">
      {/* Hero section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-6">
          {/* Logo and badge */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl bg-seq-blue-700 flex items-center justify-center text-2xl flex-shrink-0"
              aria-hidden="true"
            >
              🌍
            </div>
            <div>
              <span className="text-xs font-mono text-seq-blue-400 uppercase tracking-wider">
                {t('badge')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                open-helplines
              </h1>
            </div>
          </div>

          {/* Headline */}
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-white leading-snug max-w-2xl">
              {headlineParts[0]}
              <span className="text-seq-blue-400">{headlineHighlight}</span>
              {headlineParts[1] ?? ''}
            </p>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl">
              {t('tagline')}
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/globe"
              className="inline-flex items-center gap-2 bg-seq-blue-600 hover:bg-seq-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <span aria-hidden="true">🌍</span>
              {t('ctaExploreGlobe')}
            </Link>
            <a
              href="https://github.com/Kouki-odaka/open-helplines"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              {t('ctaViewOnGithub')}
            </a>
          </div>

          {/* Stats — client component (uses useHelplinesData hook) */}
          <LandingStats />
        </div>
      </section>

      {/* Visualizations preview */}
      <section className="border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-6">
            {t('exploreTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <VisualizationCard
              href="/globe"
              icon="🌍"
              title={t('vizCards.globe.title')}
              description={t('vizCards.globe.description')}
            />
            <VisualizationCard
              href="/network"
              icon="🕸️"
              title={t('vizCards.network.title')}
              description={t('vizCards.network.description')}
            />
            <VisualizationCard
              href="/heatmap"
              icon="🔥"
              title={t('vizCards.heatmap.title')}
              description={t('vizCards.heatmap.description')}
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
            {t('contributeTitle')}
          </h2>
          <p className="text-gray-500 mb-4">
            {t('contributeDescription')}
          </p>
          <Link
            href="/contribute"
            className="inline-flex items-center gap-2 border border-seq-blue-600 text-seq-blue-400 hover:bg-seq-blue-900/30 px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            {t('contributeButton')}
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
      className="group block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-seq-blue-800 transition-colors"
    >
      <div className="text-2xl mb-3" aria-hidden="true">{icon}</div>
      <h3 className="font-semibold text-white mb-1 group-hover:text-seq-blue-300 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
