import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface ContributePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: ContributePageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'contribute' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

const JSON_SCHEMA_EXAMPLE = `{
  "$schema": "../../../schemas/helpline.schema.json",
  "country": "XX",
  "records": [
    {
      "id": "xx-helpline-name",
      "country": "XX",
      "name": "Crisis Helpline Name",
      "category": "suicide_prevention",
      "contacts": [
        {
          "method": "phone",
          "number": "+1-800-xxx-xxxx",
          "languages": ["en"],
          "hours": "24/7",
          "free": true,
          "anonymous": true
        }
      ],
      "description": "Brief description of the service.",
      "website": "https://example.org",
      "verified_at": "2026-06-02",
      "source": "https://example.org",
      "government_backed": false
    }
  ]
}`;

/**
 * Contribute page — how to add helpline data via pull request.
 */
export default async function ContributePage({ params: { locale } }: ContributePageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  const t = await getTranslations({ locale: validLocale, namespace: 'contribute' });
  const howToSteps = t.raw('howToSteps') as string[];
  const guidelines = t.raw('guidelines') as string[];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-seq-blue-400">{t('howToTitle')}</h2>
        <ol className="list-decimal list-inside text-gray-400 space-y-3">
          {howToSteps.map((step, index) => (
            <li key={index}>
              {renderHowToStep(step, index)}
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-seq-blue-400">{t('jsonFormatTitle')}</h2>
        <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
          <code>{JSON_SCHEMA_EXAMPLE}</code>
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-seq-blue-400">{t('guidelinesTitle')}</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          {guidelines.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        <a
          href="https://github.com/Kouki-odaka/open-helplines/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-seq-blue-600 hover:bg-seq-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {t('ctaGuide')}
        </a>
        <a
          href="https://github.com/Kouki-odaka/open-helplines/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {t('ctaIssue')}
        </a>
      </div>
    </article>
  );
}

/** Renders a how-to step, injecting GitHub/filePath links where placeholders appear. */
function renderHowToStep(step: string, index: number): React.ReactNode {
  if (index === 0 && step.includes('{githubLink}')) {
    const parts = step.split('{githubLink}');
    return (
      <>
        {parts[0]}
        <a
          href="https://github.com/Kouki-odaka/open-helplines"
          target="_blank"
          rel="noopener noreferrer"
          className="text-seq-blue-400 hover:underline"
        >
          GitHub
        </a>
        {parts[1]}
      </>
    );
  }
  if (index === 1 && step.includes('{filePath}')) {
    const parts = step.split('{filePath}');
    return (
      <>
        {parts[0]}
        <code className="text-seq-blue-300 bg-gray-900 px-1.5 py-0.5 rounded text-sm">
          data/countries/[country-code]/helplines.json
        </code>
        {parts[1]}
      </>
    );
  }
  return step;
}
