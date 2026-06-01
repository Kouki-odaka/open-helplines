import { defineRouting } from 'next-intl/routing';

/** Supported UI locales for the visualization site */
export const SUPPORTED_LOCALES = ['en', 'ja', 'es'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: 'en',
});
