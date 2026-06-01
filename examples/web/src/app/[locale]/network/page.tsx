import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { NetworkView } from '@/components/network/NetworkView';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface NetworkPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: NetworkPageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'network' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

/**
 * Network View page — force-directed graph of helpline relationships.
 */
export default function NetworkPage({ params: { locale } }: NetworkPageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-4rem)] min-h-[500px]">
      <NetworkView />
    </div>
  );
}
