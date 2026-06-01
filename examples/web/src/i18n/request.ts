import { getRequestConfig } from 'next-intl/server';
import { routing } from './config';

/**
 * next-intl server-side request configuration.
 * Loads the message JSON for the requested locale (falls back to 'en').
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale — fall back to default when unknown
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: (await import(`../messages/${locale}.json`)).default as any,
  };
});
