'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/** Primary view tabs shown in the middle of the navbar */
const viewTabs = [
  { href: '/globe',   label: 'Globe',   shortLabel: 'Globe',   icon: '🌍' },
  { href: '/network', label: 'Network', shortLabel: 'Net.',    icon: '🕸️' },
  { href: '/heatmap', label: 'Heatmap', shortLabel: 'Heat.',   icon: '🔥' },
] as const;

/** Menu items accessible from the hamburger (≡) */
const menuItems = [
  { href: '/about',      label: 'About' },
  { href: '/contribute', label: 'Contribute' },
  {
    href: 'https://github.com/Kouki-odaka/open-helplines',
    label: 'GitHub',
    external: true,
  },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-navbar-bg border-b border-navbar-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-seq-blue-400 transition-colors flex-shrink-0"
          aria-label="Open Helplines — Home"
          onClick={closeMenu}
        >
          <span className="font-semibold text-sm sm:text-base tracking-tight">
            open-helplines
          </span>
        </Link>

        {/* View tabs (center) */}
        <nav aria-label="Visualization views" className="flex-1 flex justify-center">
          <ul className="flex items-center gap-0.5 sm:gap-1" role="list">
            {viewTabs.map(({ href, label, shortLabel, icon }) => {
              const isActive = pathname === href;
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
                    {/* Full label on larger screens, short on mobile */}
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{shortLabel}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Hamburger menu (right) */}
        <div className="relative flex-shrink-0">
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <span aria-hidden="true" className="text-lg">≡</span>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <button
                className="fixed inset-0 z-40"
                onClick={closeMenu}
                aria-label="Close menu"
                tabIndex={-1}
              />
              {/* Menu panel */}
              <nav
                className="absolute right-0 top-full mt-1 w-44 bg-panel-bg border border-panel-border rounded-lg shadow-lg z-50 py-1"
                aria-label="Secondary navigation"
              >
                {menuItems.map(({ href, label, ...rest }) => {
                  const isExternal = 'external' in rest && rest.external;
                  const isActive = pathname === href;
                  const sharedClass =
                    'block px-4 py-2 text-sm transition-colors ' +
                    (isActive
                      ? 'text-seq-blue-400 bg-seq-blue-900/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800');

                  if (isExternal) {
                    return (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={sharedClass}
                        onClick={closeMenu}
                      >
                        {label} ↗
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={sharedClass}
                      onClick={closeMenu}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
