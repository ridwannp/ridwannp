import { useState, useEffect, useRef } from 'react';

export interface ViewportSize {
  width: number;
  height: number;
  aspect: number;
}

export function useViewportSize(containerRef?: React.RefObject<HTMLElement>): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768, aspect: 1024 / 768 };
    }
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    return { width: w, height: h, aspect: w / h };
  });

  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measure = () => {
      let w = 1;
      let h = 1;

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        w = Math.max(1, rect.width || containerRef.current.clientWidth || 1);
        h = Math.max(1, rect.height || containerRef.current.clientHeight || 1);
      } else {
        w = Math.max(1, window.innerWidth);
        h = Math.max(1, window.innerHeight);
      }

      const aspect = isNaN(w / h) ? 1 : Math.max(0.1, w / h);

      setSize((prev) => {
        if (Math.abs(prev.width - w) < 0.5 && Math.abs(prev.height - h) < 0.5) {
          return prev;
        }
        return { width: w, height: h, aspect };
      });
    };

    measure();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        measure();
      });
      resizeObserver.observe(containerRef.current);
    }

    const onWindowResize = () => {
      measure();
    };

    window.addEventListener('resize', onWindowResize, { passive: true });

    // Safety check on subsequent animation frame if initial size was 1
    frameIdRef.current = requestAnimationFrame(() => {
      measure();
    });

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', onWindowResize);
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [containerRef]);

  return size;
}

