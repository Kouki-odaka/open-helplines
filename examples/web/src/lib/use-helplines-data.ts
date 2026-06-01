'use client';

/**
 * useHelplinesData — React hook that loads the aggregated helplines dataset.
 *
 * Fetches `/open-helplines/data/helplines.json` (generated at build time by
 * scripts/collect-data.mjs) and returns the parsed GlobalHelplinesData.
 * Falls back to FALLBACK_GLOBAL_DATA when the fetch fails so that the UI
 * is always renderable even without a network request.
 *
 * basePath is hardcoded to `/open-helplines` to match next.config.js.
 * fetch() does not inherit Next.js basePath automatically, so we prefix it.
 */

import { useState, useEffect } from 'react';
import type { GlobalHelplinesData } from '@/types/helpline';
import { FALLBACK_GLOBAL_DATA } from '@/lib/fallback-data';

/** Path to the pre-generated JSON file, including the Next.js basePath prefix */
const HELPLINES_DATA_URL = '/open-helplines/data/helplines.json';

interface UseHelplinesDataResult {
  data: GlobalHelplinesData;
  isLoading: boolean;
  isFallback: boolean;
}

/**
 * Loads the real helplines dataset and falls back to static data on error.
 *
 * @returns Data object, loading state, and whether the fallback is in use.
 */
export function useHelplinesData(): UseHelplinesDataResult {
  const [data, setData] = useState<GlobalHelplinesData>(FALLBACK_GLOBAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch(HELPLINES_DATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const parsed: GlobalHelplinesData = await response.json();
        if (!cancelled) {
          setData(parsed);
          setIsFallback(false);
        }
      } catch {
        // Network error or JSON parse failure — silently use fallback
        if (!cancelled) {
          setIsFallback(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, isFallback };
}
