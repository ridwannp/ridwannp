import { useState, useEffect, useRef } from 'react';

export interface ScrollProgressState {
  progress: number; // 0 to 1
  scrollY: number;
  isPastHero: boolean; // scrollY > 2.4 * viewportHeight
}

export function useScrollProgress(containerRef: React.RefObject<HTMLElement>): ScrollProgressState {
  const [state, setState] = useState<ScrollProgressState>({
    progress: 0,
    scrollY: 0,
    isPastHero: false,
  });

  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculate = () => {
      const container = containerRef.current;
      const vh = Math.max(1, window.innerHeight);
      const scroll = window.scrollY || window.pageYOffset || 0;

      let p = 0;
      if (container) {
        const rect = container.getBoundingClientRect();
        // Container height is 200svh, sticky content is 100svh
        // Scroll distance across container is container.offsetHeight - stickyContentHeight (which is 1 vh)
        const totalDistance = Math.max(1, container.offsetHeight - vh);
        const scrolled = -rect.top;
        p = Math.max(0, Math.min(1, scrolled / totalDistance));
      } else {
        p = Math.max(0, Math.min(1, scroll / vh));
      }

      const isPast = scroll > vh * 2.4;

      setState((prev) => {
        if (Math.abs(prev.progress - p) < 0.001 && prev.isPastHero === isPast) {
          return prev;
        }
        return {
          progress: isNaN(p) ? 0 : p,
          scrollY: scroll,
          isPastHero: isPast,
        };
      });

      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(calculate);
      }
    };

    calculate();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [containerRef]);

  return state;
}

