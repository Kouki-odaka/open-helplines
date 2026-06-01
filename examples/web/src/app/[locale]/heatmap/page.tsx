import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeatmapView } from '@/components/heatmap/HeatmapView';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface HeatmapPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: HeatmapPageProps): Promise<Metadata> {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'heatmap' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

/**
 * Heatmap View page — choropleth map with temporal timeline.
 */
export default function HeatmapPage({ params: { locale } }: HeatmapPageProps) {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  setRequestLocale(validLocale);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-4rem)] min-h-[500px]">
      <HeatmapView />
    </div>
  );
}
