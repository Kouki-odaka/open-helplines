'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { containsEmergencyTrigger } from '@/lib/emergency-triggers';
import { detectCountry } from '@/lib/country-detector';
import { getEmergencyContact } from '@/lib/emergency-helplines';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';

/**
 * EmergencyBannerController — reads URL search params, runs trigger detection,
 * detects the user's country, and manages the banner's show/hide state.
 *
 * Must be used inside a <Suspense> boundary because useSearchParams() requires
 * it in Next.js App Router.
 *
 * Privacy contract:
 *  - No geolocation without explicit user opt-in (requestGeo state)
 *  - Detection result is NOT written to localStorage
 *  - Query strings are tested and discarded; not logged anywhere
 */
export function EmergencyBannerController() {
  const searchParams = useSearchParams();
  const t = useTranslations('emergency');

  const [isDismissed, setIsDismissed] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [countryCode, setCountryCode] = useState('XX');
  const [requestGeo, setRequestGeo] = useState(false);

  // Check query params for trigger words on every navigation
  useEffect(() => {
    const queryValue = searchParams.get('q') ?? searchParams.get('search') ?? '';
    if (containsEmergencyTrigger(queryValue)) {
      setIsTriggered(true);
      setIsDismissed(false);
    }
  }, [searchParams]);

  // Detect country when the banner is triggered (runs once per trigger event)
  useEffect(() => {
    if (!isTriggered) {
      return;
    }

    let cancelled = false;

    async function runDetection() {
      const result = await detectCountry(searchParams, requestGeo);
      if (!cancelled) {
        setCountryCode(result.countryCode);
      }
    }

    void runDetection();
    return () => {
      cancelled = true;
    };
  }, [isTriggered, requestGeo, searchParams]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  const handleRequestGeo = useCallback(() => {
    setRequestGeo(true);
  }, []);

  if (!isTriggered || isDismissed) {
    return null;
  }

  const contact = getEmergencyContact(countryCode);

  return (
    <>
      <EmergencyBanner contact={contact} onDismiss={handleDismiss} />
      {/* Spacer so page content is not obscured by the fixed banner */}
      <div className="h-[var(--emergency-banner-height,96px)]" aria-hidden="true" />
      {/* Re-show hint if user dismissed (rendered below the spacer, not visible in normal flow) */}
      {countryCode === 'XX' && (
        <div className="sr-only" role="status">
          <button onClick={handleRequestGeo} className="sr-only focus:not-sr-only">
            {t('allowLocationForBetterResults')}
          </button>
        </div>
      )}
    </>
  );
}
