import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GlobeView } from '@/components/globe/GlobeView';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface GlobePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: GlobePageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'globe' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

/**
 * Globe View page — 3D WebGL visualization of global helpline coverage.
 */
export default function GlobePage({ params: { locale } }: GlobePageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  return (
    <div
      className="relative w-full"
      style={{ height: 'calc(100vh - 3.5rem)' }}
    >
      <GlobeView />
    </div>
  );
}
