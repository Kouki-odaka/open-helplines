'use client';

/**
 * Root redirect — sends visitors to the default locale prefix (/en/).
 * This is necessary because the site is entirely under [locale]/ routes.
 * With output: 'export' and no middleware, we redirect via client-side script.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEFAULT_LOCALE = 'en';

export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Detect browser language and redirect to matching locale
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    const supportedLocales = ['en', 'ja', 'es'];
    const locale = supportedLocales.includes(browserLang) ? browserLang : DEFAULT_LOCALE;
    router.replace(`/${locale}/`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      <span>Redirecting…</span>
    </div>
  );
}
