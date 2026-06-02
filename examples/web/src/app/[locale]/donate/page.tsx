import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface DonatePageProps {
  params: { locale: string };
}

/** Helplines that have confirmed public donation pages */
const DONATABLE_HELPLINES = [
  {
    id: 'us-988-lifeline',
    name: '988 Suicide & Crisis Lifeline',
    country: 'US',
    flag: '🇺🇸',
    donateUrl: 'https://988lifeline.org/donate/',
    website: 'https://988lifeline.org/',
  },
  {
    id: 'gb-samaritans',
    name: 'Samaritans',
    country: 'GB',
    flag: '🇬🇧',
    donateUrl: 'https://www.samaritans.org/donate-now/',
    website: 'https://www.samaritans.org/',
  },
  {
    id: 'gb-shout-crisis-text-line',
    name: 'Shout Crisis Text Line',
    country: 'GB',
    flag: '🇬🇧',
    donateUrl: 'https://giveusashout.org/donate/',
    website: 'https://giveusashout.org/',
  },
  {
    id: 'jp-tell-lifeline',
    name: 'TELL Lifeline',
    country: 'JP',
    flag: '🇯🇵',
    donateUrl: 'https://www.telljp.com/donate/',
    website: 'https://www.telljp.com/',
  },
  {
    id: 'de-telefonseelsorge',
    name: 'Telefonseelsorge',
    country: 'DE',
    flag: '🇩🇪',
    donateUrl: 'https://www.telefonseelsorge.de/spenden/',
    website: 'https://www.telefonseelsorge.de/',
  },
  {
    id: 'br-cvv-188',
    name: 'CVV — Centro de Valorização da Vida',
    country: 'BR',
    flag: '🇧🇷',
    donateUrl: 'https://cvv.org.br/doacoes-e-parcerias/',
    website: 'https://cvv.org.br/',
  },
  {
    id: 'bd-kaan-pete-roi',
    name: 'Kaan Pete Roi',
    country: 'BD',
    flag: '🇧🇩',
    donateUrl: 'https://kaanpeteroi.org/donate-us/',
    website: 'https://kaanpeteroi.org/',
  },
] as const;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: DonatePageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'donate' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

/**
 * Donate page — lists helplines with public donation pages and project sponsorship.
 */
export default async function DonatePage({ params: { locale } }: DonatePageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  const t = await getTranslations({ locale: validLocale, namespace: 'donate' });

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/globe"
          className="text-sm text-neutral-muted hover:text-neutral-text transition-colors"
        >
          {t('backToGlobe')}
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
        <p className="text-neutral-muted leading-relaxed text-lg">{t('subtitle')}</p>
      </div>

      {/* Why donate */}
      <section className="mb-10 bg-neutral-surface border border-neutral-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3 text-brand-light">{t('whyTitle')}</h2>
        <p className="text-neutral-muted leading-relaxed">{t('whyText')}</p>
      </section>

      {/* Helplines with donation pages */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{t('helplinesTitle')}</h2>
        <p className="text-sm text-neutral-muted mb-6">{t('helplinesSubtext')}</p>
        <ul className="space-y-4" role="list">
          {DONATABLE_HELPLINES.map((helpline) => (
            <li
              key={helpline.id}
              className="bg-neutral-surface border border-neutral-border rounded-xl p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {helpline.flag}
                </span>
                <div className="min-w-0">
                  <a
                    href={helpline.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sm hover:text-brand-light transition-colors truncate block"
                  >
                    {helpline.name}
                  </a>
                  <span className="text-xs text-neutral-muted">{helpline.country}</span>
                </div>
              </div>
              <a
                href={helpline.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {t('donateButton')}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Project sponsorship */}
      <section className="bg-neutral-surface border border-neutral-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3 text-brand-light">{t('projectTitle')}</h2>
        <p className="text-neutral-muted leading-relaxed mb-5">{t('projectText')}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/Kouki-odaka/open-helplines"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t('ctaGithub')}
          </a>
          <a
            href="https://github.com/sponsors/Kouki-odaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t('ctaSponsor')}
          </a>
        </div>
      </section>
    </article>
  );
}
