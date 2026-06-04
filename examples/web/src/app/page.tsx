'use client';

/**
 * Root redirect — sends visitors to the default locale prefix (/en/).
 * With output: 'export' and no middleware, we redirect via client-side.
 *
 * 3-layer defence (ensures redirect even when JS/hydration stalls):
 *  1. window.location.replace() — bypasses router/basePath confusion
 *  2. <meta http-equiv="refresh"> in rendered HTML — fires even if React
 *     hydration is delayed (present in the static export output)
 *  3. <noscript> direct links — accessible when JS is fully disabled
 */

import { useEffect } from 'react';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/open-helplines';
const SUPPORTED_LOCALES = ['en', 'ja', 'es'] as const;
const DEFAULT_LOCALE = 'en' as const;

function detectLocale(): string {
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(browserLang)
    ? browserLang
    : DEFAULT_LOCALE;
}

export default function RootRedirectPage() {
  useEffect(() => {
    // Layer 1: direct window.location redirect — bypasses Next.js router
    // basePath ambiguity and works reliably on static GitHub Pages exports.
    const locale = detectLocale();
    window.location.replace(`${BASE_PATH}/${locale}/`);
  }, []);

  const defaultRedirectUrl = `${BASE_PATH}/${DEFAULT_LOCALE}/`;

  return (
    <>
      {/* Layer 2: meta refresh — triggers even if React hydration stalls */}
      <meta httpEquiv="refresh" content={`0; url=${defaultRedirectUrl}`} />
      {/* Layer 3: noscript links — works when JS is fully disabled */}
      <noscript>
        <p>Redirecting to Open Helplines…</p>
        <a href={`${BASE_PATH}/en/`}>English</a>
        {' · '}
        <a href={`${BASE_PATH}/ja/`}>日本語</a>
        {' · '}
        <a href={`${BASE_PATH}/es/`}>Español</a>
      </noscript>
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <span>Redirecting…</span>
      </div>
    </>
  );
}
