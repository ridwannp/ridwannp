import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'playground.reduceMotion';

export function getStoredReducedMotion(): boolean | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(STORAGE_KEY);
      if (val !== null) return val === 'true';
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

export function setStoredReducedMotion(enabled: boolean): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  } catch {
    // Ignore storage errors
  }
}

export function useReducedMotion(): [boolean, (value: boolean) => void] {
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const stored = getStoredReducedMotion();
    if (stored !== null) return stored;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      // Only listen to system change if user has not explicitly set a preference
      if (getStoredReducedMotion() === null) {
        setReducedMotionState(event.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  const setReducedMotion = useCallback((value: boolean) => {
    setStoredReducedMotion(value);
    setReducedMotionState(value);
  }, []);

  return [reducedMotion, setReducedMotion];
}

