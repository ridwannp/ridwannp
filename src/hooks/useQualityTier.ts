import { useState, useEffect } from 'react';

export type QualityTier = 'high' | 'low';

export function useQualityTier(): QualityTier {
  const [tier, setTier] = useState<QualityTier>('high');

  useEffect(() => {
    // 1. Mobile screen (<= 640px) automatically defaults to 'low' for battery and memory efficiency
    if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      setTier('low');
      return;
    }

    // 2. Prefers reduced data
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-data: reduce)').matches
    ) {
      setTier('low');
      return;
    }

    // 3. Hardware concurrency check
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    if (cores < 4) {
      setTier('low');
      return;
    }

    // 4. Device memory check (if supported)
    const mem =
      typeof navigator !== 'undefined' && 'deviceMemory' in navigator
        ? (navigator as { deviceMemory?: number }).deviceMemory || 4
        : 4;
    if (mem < 4) {
      setTier('low');
      return;
    }

    setTier('high');
  }, []);

  return tier;
}

