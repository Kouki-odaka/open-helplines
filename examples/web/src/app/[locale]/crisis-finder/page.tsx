import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';
import { PrivacyModeBadge } from '@/components/privacy/PrivacyModeBadge';
import { CrisisFinderSearch } from '@/components/crisis-finder/CrisisFinderSearch';

interface CrisisFinderPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: CrisisFinderPageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'privacy' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    robots: { index: false, follow: false },
  };
}

/**
 * No-Log Crisis Finder page.
 *
 * Provides a fully private, ephemeral-state-only search over the crisis
 * helpline registry. No cookies, no localStorage, no analytics, no server-side
 * query logging. All data is served from bundled static files.
 *
 * Explicitly set robots noindex to avoid search engine result pages appearing
 * in crisis-related searches that should instead surface the real helplines.
 */
export default async function CrisisFinderPage({ params: { locale } }: CrisisFinderPageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  const t = await getTranslations({ locale: validLocale, namespace: 'privacy' });

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold">{t('pageHeading')}</h1>
          <PrivacyModeBadge variant="compact" />
        </div>
        <p className="text-neutral-muted leading-relaxed">{t('pageSubtitle')}</p>
      </div>

      {/* Full privacy guarantee card */}
      <PrivacyModeBadge variant="full" className="w-full mb-8" />

      {/* Privacy details */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRIVACY_GUARANTEES.map(({ icon, key }) => (
          <div
            key={key}
            className="flex items-start gap-2.5 bg-neutral-surface border border-neutral-border rounded-lg px-3 py-2.5"
          >
            <span className="text-lg flex-shrink-0" aria-hidden="true">{icon}</span>
            <p className="text-xs text-neutral-muted leading-snug">
              {t(key as Parameters<typeof t>[0])}
            </p>
          </div>
        ))}
      </section>

      {/* Search */}
      <section>
        <h2 className="text-base font-semibold mb-4">{t('searchTitle')}</h2>
        <CrisisFinderSearch />
      </section>

      {/* Crisis note */}
      <aside className="mt-10 border-t border-neutral-border pt-6 text-xs text-neutral-muted leading-relaxed">
        <p>{t('crisisNote')}</p>
      </aside>
    </article>
  );
}

const PRIVACY_GUARANTEES = [
  { icon: '🚫', key: 'guarantee1' },
  { icon: '📵', key: 'guarantee2' },
  { icon: '🗑️', key: 'guarantee3' },
  { icon: '📦', key: 'guarantee4' },
] as const;
