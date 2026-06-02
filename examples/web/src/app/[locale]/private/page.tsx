import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';
import { PrivacyModeBadge } from '@/components/privacy/PrivacyModeBadge';
import { PrivateCrisisSearch } from '@/components/crisis-finder/PrivateCrisisSearch';

interface PrivatePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: PrivatePageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'private' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    robots: { index: false, follow: false },
  };
}

const PRIVACY_GUARANTEES = [
  { icon: '🚫', key: 'guarantee1' },
  { icon: '📵', key: 'guarantee2' },
  { icon: '🗑️', key: 'guarantee3' },
  { icon: '📦', key: 'guarantee4' },
] as const;

/**
 * Enhanced No-Log Crisis Finder — /private route.
 *
 * Privacy contract:
 *  - All search state is ephemeral React state (cleared on unmount)
 *  - NO localStorage / sessionStorage / cookie / IndexedDB writes
 *  - NO URL query params written (query stays in React state only)
 *  - All data from bundled static emergency-helplines.ts
 *  - Zero external network requests during search
 *  - robots noindex to avoid search engine crisis-query results
 */
export default async function PrivatePage({ params: { locale } }: PrivatePageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  const t = await getTranslations({ locale: validLocale, namespace: 'private' });

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

      {/* Privacy detail grid */}
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

      {/* Why this is private — link to technical explanation */}
      <p className="mb-8 text-xs text-neutral-muted">
        <Link
          href={`/${validLocale}/private/why`}
          className="text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {t('whyLinkLabel')}
        </Link>
      </p>

      {/* Enhanced search */}
      <section>
        <h2 className="text-base font-semibold mb-4">{t('searchTitle')}</h2>
        <PrivateCrisisSearch />
      </section>

      {/* Crisis note */}
      <aside className="mt-10 border-t border-neutral-border pt-6 text-xs text-neutral-muted leading-relaxed">
        <p>{t('crisisNote')}</p>
      </aside>
    </article>
  );
}
