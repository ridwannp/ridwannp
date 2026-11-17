import { useState, useRef, useCallback } from 'react';

export type QualityTier = 'high' | 'low' | 'minimal';

export function useQualityTier(): {
  tier: QualityTier;
  recordFrameTime: (deltaMs: number) => void;
} {
  const [tier, setTier] = useState<QualityTier>(() => {
    if (typeof window === 'undefined') return 'high';

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'minimal';
    } catch {
      return 'minimal';
    }

    // Prefers reduced data
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-data: reduce)').matches
    ) {
      return 'minimal';
    }

    // Mobile screen or low cores/memory
    const cores = navigator.hardwareConcurrency || 4;
    const mem =
      'deviceMemory' in navigator ? (navigator as { deviceMemory?: number }).deviceMemory || 4 : 4;

    if (window.innerWidth <= 640 || cores < 4 || mem < 4) {
      return 'low';
    }

    return 'high';
  });

  const frameTimesRef = useRef<number[]>([]);
  const slowPeriodStartRef = useRef<number | null>(null);

  const recordFrameTime = useCallback((deltaMs: number) => {
    const times = frameTimesRef.current;
    times.push(deltaMs);
    if (times.length > 60) times.shift();

    if (times.length >= 30) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const now = performance.now();

      if (avg > 24) {
        if (!slowPeriodStartRef.current) {
          slowPeriodStartRef.current = now;
        } else if (now - slowPeriodStartRef.current > 2000) {
          // Sustained slow frame rate for 2 seconds -> drop one tier
          setTier((prev) => {
            if (prev === 'high') return 'low';
            if (prev === 'low') return 'minimal';
            return 'minimal';
          });
          slowPeriodStartRef.current = null;
          frameTimesRef.current = [];
        }
      } else {
        slowPeriodStartRef.current = null;
      }
    }
  }, []);

  return { tier, recordFrameTime };
}
