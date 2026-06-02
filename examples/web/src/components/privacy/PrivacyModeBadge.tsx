'use client';

import { useTranslations } from 'next-intl';

interface PrivacyModeBadgeProps {
  /** 'compact' shows icon + short label; 'full' shows icon + full description */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * PrivacyModeBadge — visual indicator that the current page operates in
 * No-Log Privacy Mode.
 *
 * Communicates to users that:
 *  - No search queries are logged
 *  - No cookies or local storage are used
 *  - No third-party tracking scripts are loaded
 *  - All data is served from bundled static files
 */
export function PrivacyModeBadge({ variant = 'compact', className = '' }: PrivacyModeBadgeProps) {
  const t = useTranslations('privacy');

  if (variant === 'full') {
    return (
      <div
        className={`inline-flex items-start gap-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl px-4 py-3 ${className}`}
        role="note"
        aria-label={t('badgeAriaLabel')}
      >
        <span className="text-emerald-400 text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
          🔒
        </span>
        <div>
          <p className="text-emerald-300 text-sm font-semibold leading-snug">
            {t('badgeTitle')}
          </p>
          <p className="text-emerald-600 text-xs mt-0.5 leading-relaxed">
            {t('badgeDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full ${className}`}
      title={t('badgeDescription')}
      aria-label={t('badgeAriaLabel')}
    >
      <span aria-hidden="true">🔒</span>
      {t('badgeTitle')}
    </span>
  );
}
