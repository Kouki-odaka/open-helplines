/**
 * Locale-aware navigation utilities.
 * Import Link, useRouter, usePathname from here instead of next/link / next/navigation
 * so that generated URLs automatically include the current locale prefix.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './i18n/config';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
