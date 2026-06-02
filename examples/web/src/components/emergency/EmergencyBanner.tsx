'use client';

import { useTranslations } from 'next-intl';
import type { EmergencyContact } from '@/lib/emergency-helplines';

interface EmergencyBannerProps {
  contact: EmergencyContact;
  onDismiss: () => void;
}

/**
 * EmergencyBanner — full-width fixed banner shown at the top of the page when
 * an emergency trigger word is detected.
 *
 * Design requirements:
 *  - CVD-safe vermillion accent (Okabe-Ito #D55E00)
 *  - High contrast text on dark background
 *  - aria-live="assertive" for immediate screen-reader announcement
 *  - Dismissible by user; re-show link provided in footer area
 *  - 1-tap phone / SMS / chat links
 */
export function EmergencyBanner({ contact, onDismiss }: EmergencyBannerProps) {
  const t = useTranslations('emergency');

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed top-0 inset-x-0 z-[9999] bg-[#1a0800] border-b-2 border-[#D55E00] shadow-xl"
      style={{ borderColor: '#D55E00' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-start gap-3">
        {/* Urgency icon */}
        <span className="flex-shrink-0 text-xl mt-0.5" aria-hidden="true">
          🆘
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#FF9966] leading-snug mb-1">
            {t('heading')}
          </p>
          <p className="text-xs text-gray-300 mb-2">
            {contact.name}
            {contact.hours === '24/7' && (
              <span className="ml-2 px-1.5 py-0.5 bg-[#D55E00]/30 text-[#FF9966] text-[10px] rounded font-medium">
                24/7
              </span>
            )}
          </p>

          {/* Contact action buttons */}
          <div className="flex flex-wrap gap-2">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-1.5 bg-[#D55E00] hover:bg-[#e06720] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                aria-label={`${t('callAriaLabel')} ${contact.name}`}
              >
                <span aria-hidden="true">📞</span>
                {t('callButton')}
                {contact.phone && (
                  <span className="font-mono">{formatPhoneDisplay(contact.phone)}</span>
                )}
              </a>
            )}
            {contact.smsNumber && (
              <a
                href={`sms:${contact.smsNumber}`}
                className="inline-flex items-center gap-1.5 border border-[#D55E00] text-[#FF9966] hover:bg-[#D55E00]/20 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                aria-label={`${t('smsAriaLabel')} ${contact.smsNumber}`}
              >
                <span aria-hidden="true">💬</span>
                {t('smsButton')} {contact.smsNumber}
              </a>
            )}
            {contact.chatUrl && (
              <a
                href={contact.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                aria-label={`${t('chatAriaLabel')} ${contact.name}`}
              >
                <span aria-hidden="true">🖥️</span>
                {t('chatButton')}
              </a>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-md mt-0.5"
          aria-label={t('dismissAriaLabel')}
        >
          <span aria-hidden="true" className="text-lg leading-none">×</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Formats an E.164 phone number for display.
 * Shows the short-code / national format rather than the full E.164 string.
 * e.g. "+18002738255" → "988"  "+44116123" → "116 123"
 */
function formatPhoneDisplay(e164: string): string {
  // Short codes (≤ 5 digits after the leading +)
  const stripped = e164.replace(/^\+[0-9]{1,3}/, '');
  if (stripped.length <= 4) {
    return stripped;
  }
  // US/CA: well-known short-codes
  if (e164 === '+1988') {
    return '988';
  }
  if (e164 === '+18002738255') {
    return '988';
  }
  // UK Samaritans
  if (e164 === '+44116123') {
    return '116 123';
  }
  // Japan Yorisoi
  if (e164 === '+81120279338') {
    return '0120-279-338';
  }
  // Germany Telefonseelsorge
  if (e164 === '+498001110111') {
    return '0800 111 0 111';
  }
  // France 3114
  if (e164 === '+333114') {
    return '3114';
  }
  // Brazil 188
  if (e164 === '+55188') {
    return '188';
  }
  // Australia Lifeline
  if (e164 === '+61131114') {
    return '13 11 14';
  }
  // NZ Lifeline
  if (e164 === '+640800543354') {
    return '0800 543 354';
  }
  // Return last 7 digits as fallback
  return stripped.slice(-7);
}
