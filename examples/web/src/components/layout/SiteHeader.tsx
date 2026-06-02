'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, Link } from '@/navigation';
import { useState } from 'react';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config';

interface SiteHeaderProps {
  locale: SupportedLocale;
}

/** Primary view tabs shown in the middle of the navbar */
const VIEW_TAB_KEYS = [
  { href: '/globe',   icon: '🌍', labelKey: 'globe'   },
  { href: '/network', icon: '🕸️', labelKey: 'network' },
  { href: '/heatmap', icon: '🔥', labelKey: 'heatmap' },
] as const;

/** Locale display configuration */
const LOCALE_CONFIG: Record<SupportedLocale, { flag: string }> = {
  en: { flag: '🇬🇧' },
  ja: { flag: '🇯🇵' },
  es: { flag: '🇲🇽' },
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = useTranslations('nav');
  const tLang = useTranslations('language');
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsLangOpen(false);
  };
  const closeMenu = () => setIsMenuOpen(false);
  const toggleLang = () => {
    setIsLangOpen((prev) => !prev);
    setIsMenuOpen(false);
  };
  const closeLang = () => setIsLangOpen(false);

  const switchLocale = (targetLocale: SupportedLocale) => {
    closeLang();
    router.replace(pathname, { locale: targetLocale });
  };

  const menuItems = [
    { href: '/about',         labelKey: 'about' as const },
    { href: '/contribute',    labelKey: 'contribute' as const },
    { href: '/private',       labelKey: 'crisisFinder' as const },
    { href: '/donate',        labelKey: 'donate' as const },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-navbar-bg border-b border-navbar-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-seq-blue-400 transition-colors flex-shrink-0"
          aria-label={`${t('home')} — Home`}
          onClick={closeMenu}
        >
          <span className="font-semibold text-sm sm:text-base tracking-tight">
            open-helplines
          </span>
        </Link>

        {/* View tabs (center) */}
        <nav aria-label="Visualization views" className="flex-1 flex justify-center">
          <ul className="flex items-center gap-0.5 sm:gap-1" role="list">
            {VIEW_TAB_KEYS.map(({ href, icon, labelKey }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      'flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-interactive-tab-bg text-interactive-tab'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800',
                    ].join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeMenu}
                  >
                    <span aria-hidden="true">{icon}</span>
                    <span>{t(labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right controls: donate + language switcher + hamburger */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Donate CTA — visible on sm+ screens */}
          <Link
            href="/donate"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-800 hover:bg-rose-700 text-white text-xs font-medium rounded-md transition-colors"
            onClick={closeMenu}
          >
            {t('donate')}
          </Link>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              aria-label={tLang('label')}
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
            >
              <span aria-hidden="true">{LOCALE_CONFIG[locale].flag}</span>
              <span className="hidden sm:inline font-medium uppercase">{locale}</span>
              <span aria-hidden="true" className="text-gray-600">▾</span>
            </button>

            {isLangOpen && (
              <>
                <button
                  className="fixed inset-0 z-40"
                  onClick={closeLang}
                  aria-label={tLang('label')}
                  tabIndex={-1}
                />
                <ul
                  role="listbox"
                  aria-label={tLang('label')}
                  className="absolute right-0 top-full mt-1 w-36 bg-panel-bg border border-panel-border rounded-lg shadow-lg z-50 py-1"
                >
                  {SUPPORTED_LOCALES.map((loc) => (
                    <li key={loc} role="option" aria-selected={loc === locale}>
                      <button
                        onClick={() => switchLocale(loc)}
                        className={[
                          'w-full text-left flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                          loc === locale
                            ? 'text-seq-blue-400 bg-seq-blue-900/20 font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        ].join(' ')}
                      >
                        <span aria-hidden="true">{LOCALE_CONFIG[loc].flag}</span>
                        <span>{tLang(loc)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Hamburger menu */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              aria-label={t('openMenu')}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <span aria-hidden="true" className="text-lg">≡</span>
            </button>

            {isMenuOpen && (
              <>
                <button
                  className="fixed inset-0 z-40"
                  onClick={closeMenu}
                  aria-label={t('closeMenu')}
                  tabIndex={-1}
                />
                <nav
                  className="absolute right-0 top-full mt-1 w-44 bg-panel-bg border border-panel-border rounded-lg shadow-lg z-50 py-1"
                  aria-label="Secondary navigation"
                >
                  {menuItems.map(({ href, labelKey }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={[
                          'block px-4 py-2 text-sm transition-colors',
                          isActive
                            ? 'text-seq-blue-400 bg-seq-blue-900/20'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        ].join(' ')}
                        onClick={closeMenu}
                      >
                        {t(labelKey)}
                      </Link>
                    );
                  })}
                  <a
                    href="https://github.com/Kouki-odaka/open-helplines"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    onClick={closeMenu}
                  >
                    {t('github')} ↗
                  </a>
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
