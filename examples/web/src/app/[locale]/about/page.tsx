import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface AboutPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: AboutPageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'about' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

/**
 * About page — project background, data schema, license info.
 */
export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  const t = await getTranslations({ locale: validLocale, namespace: 'about' });
  const tNav = await getTranslations({ locale: validLocale, namespace: 'nav' });
  const dataItems = t.raw('dataItems') as string[];

  // Use t.raw() to get template without ICU formatting, then split manually
  const cc0LinkLabel = t('whatIsThisText1CC0Link');
  const whatIsThisText1Template = t.raw('whatIsThisText1') as string;
  const whatIsThisText1Parts = whatIsThisText1Template.split('{cc0link}');

  const vizCards = [
    { href: '/globe' as const, emoji: '🌍', label: tNav('globe') },
    { href: '/network' as const, emoji: '🕸️', label: tNav('network') },
    { href: '/heatmap' as const, emoji: '🔥', label: tNav('heatmap') },
  ];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">{t('whatIsThisTitle')}</h2>
        <p className="text-neutral-muted leading-relaxed mb-4">
          {whatIsThisText1Parts[0]}
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-light hover:underline"
          >
            {cc0LinkLabel}
          </a>
          {whatIsThisText1Parts[1] ?? ''}
        </p>
        <p className="text-neutral-muted leading-relaxed">{t('whatIsThisText2')}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">{t('dataTitle')}</h2>
        <ul className="list-disc list-inside text-neutral-muted space-y-2">
          {dataItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">{t('visualizationsTitle')}</h2>
        <div className="space-y-4">
          {vizCards.map(({ href, emoji, label }) => (
            <div key={href} className="bg-neutral-surface border border-neutral-border rounded-lg p-4">
              <h3 className="font-medium">
                <Link href={href} className="text-brand-light hover:underline">
                  {emoji} {label}
                </Link>
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">{t('contributeTitle')}</h2>
        <p className="text-neutral-muted leading-relaxed mb-4">{t('contributeText')}</p>
        <a
          href="https://github.com/Kouki-odaka/open-helplines/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {t('contributeButton')}
        </a>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-brand-light">{t('licenseTitle')}</h2>
        <div className="bg-neutral-surface border border-neutral-border rounded-lg p-4 text-sm text-neutral-muted">
          <p className="mb-2">
            <strong className="text-neutral-text">{t('licenseData')}</strong>{' '}
            {t('licenseDataText')}
          </p>
          <p>
            <strong className="text-neutral-text">{t('licenseCode')}</strong>{' '}
            {t('licenseCodeText')}
          </p>
        </div>
      </section>
    </article>
  );
}
