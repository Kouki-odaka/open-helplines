'use client';

import { useEffect } from 'react';

interface LocaleHtmlUpdaterProps {
  locale: string;
}

/**
 * Updates the <html lang> attribute to match the current locale.
 * The root layout hardcodes lang="en" for static export compatibility;
 * this component patches it on the client immediately after hydration.
 */
export function LocaleHtmlUpdater({ locale }: LocaleHtmlUpdaterProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
