import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface WhyPrivatePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: WhyPrivatePageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'private' });
  return {
    title: t('whyPageTitle'),
    description: t('whyPageDescription'),
    robots: { index: false, follow: false },
  };
}

const PRIVACY_SECTIONS = [
  {
    key: 'whySection1Title',
    bodyKey: 'whySection1Body',
    icon: '🏗️',
  },
  {
    key: 'whySection2Title',
    bodyKey: 'whySection2Body',
    icon: '🛡️',
  },
  {
    key: 'whySection3Title',
    bodyKey: 'whySection3Body',
    icon: '🔗',
  },
  {
    key: 'whySection4Title',
    bodyKey: 'whySection4Body',
    icon: '💾',
  },
] as const;

/**
 * /private/why — Technical explanation of the privacy architecture behind
 * the No-Log Crisis Finder. Provides transparent, factual rationale for each
 * privacy guarantee so users can make an informed decision about using this tool.
 */
export default async function WhyPrivatePage({ params: { locale } }: WhyPrivatePageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  const t = await getTranslations({ locale: validLocale, namespace: 'private' });

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href={`/${validLocale}/private`}
        className="inline-flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 transition-colors mb-8"
      >
        {t('whyBackLink')}
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl" aria-hidden="true">🔒</span>
          <h1 className="text-2xl font-bold">{t('whyPageHeading')}</h1>
        </div>
        <p className="text-neutral-muted leading-relaxed text-sm">{t('whyPageSubtitle')}</p>
      </div>

      {/* Privacy sections */}
      <div className="space-y-6">
        {PRIVACY_SECTIONS.map(({ key, bodyKey, icon }) => (
          <section
            key={key}
            className="bg-neutral-surface border border-neutral-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl" aria-hidden="true">{icon}</span>
              <h2 className="text-sm font-semibold text-neutral-text">
                {t(key as Parameters<typeof t>[0])}
              </h2>
            </div>
            <p className="text-xs text-neutral-muted leading-relaxed">
              {t(bodyKey as Parameters<typeof t>[0])}
            </p>
          </section>
        ))}
      </div>

      {/* CSP code block */}
      <section className="mt-6 bg-neutral-surface border border-neutral-border rounded-xl p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xl" aria-hidden="true">📋</span>
          <h2 className="text-sm font-semibold text-neutral-text">{t('whyCspTitle')}</h2>
        </div>
        <p className="text-xs text-neutral-muted leading-relaxed mb-3">{t('whyCspBody')}</p>
        <pre className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-lg p-3 overflow-x-auto leading-relaxed">
{`default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
img-src 'self' data: blob:;
connect-src 'self' https://nominatim.openstreetmap.org;
media-src 'none';
object-src 'none';
frame-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';`}
        </pre>
        <p className="text-[10px] text-neutral-muted mt-2 leading-relaxed">{t('whyCspNote')}</p>
      </section>

      {/* Back link (bottom) */}
      <div className="mt-10 pt-6 border-t border-neutral-border">
        <Link
          href={`/${validLocale}/private`}
          className="inline-flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {t('whyBackLink')}
        </Link>
      </div>
    </article>
  );
}
