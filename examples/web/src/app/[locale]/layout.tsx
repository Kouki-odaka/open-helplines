import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';
import { LocaleHtmlUpdater } from '@/components/layout/LocaleHtmlUpdater';
import { EmergencyBannerController } from '@/components/emergency/EmergencyBannerController';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

/** Generate static paths for all supported locales */
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: 'Open Helplines — Global Crisis Support Data',
    template: '%s — Open Helplines',
  },
  description:
    'Open data registry of mental health and crisis helplines worldwide. ' +
    'Free · CC0 · No API key required.',
};

/**
 * Locale layout — wraps all locale-specific pages.
 * Provides NextIntlClientProvider with pre-loaded messages,
 * the shared SiteHeader and SiteFooter, and the skip-to-content link.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  // Validate and set the locale for next-intl static rendering
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';

  setRequestLocale(validLocale);

  // Load messages server-side — passed to client via NextIntlClientProvider
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      {/* Updates <html lang> attribute on the client to match current locale */}
      <LocaleHtmlUpdater locale={validLocale} />

      {/* Skip-to-content link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:text-gray-900 focus:font-medium focus:text-sm focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Emergency First Resolver: useSearchParams requires Suspense in App Router */}
      <Suspense fallback={null}>
        <EmergencyBannerController />
      </Suspense>

      <SiteHeader locale={validLocale} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </NextIntlClientProvider>
  );
}
