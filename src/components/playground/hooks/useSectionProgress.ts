import { useState, useEffect } from 'react';

function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

export function useSectionProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const computeProgress = () => {
      const heroEl = document.getElementById('hero');
      const discoveryEl = document.getElementById('discovery');
      const produkEl = document.getElementById('produk');
      const penutupEl = document.getElementById('penutup');

      if (!heroEl || !discoveryEl || !produkEl || !penutupEl) {
        // Fallback to page scroll ratio * 3
        const scrollY = window.scrollY;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const linear = Math.min(3, Math.max(0, (scrollY / maxScroll) * 3));
        setProgress(linear);
        return;
      }

      const viewportCenter = window.scrollY + window.innerHeight / 2;

      const getCenter = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return window.scrollY + rect.top + rect.height / 2;
      };

      const c0 = getCenter(heroEl);
      const c1 = getCenter(discoveryEl);
      const c2 = getCenter(produkEl);
      const c3 = getCenter(penutupEl);

      let f = 0;
      if (viewportCenter <= c0) {
        f = 0;
      } else if (viewportCenter <= c1) {
        const t = (viewportCenter - c0) / Math.max(1, c1 - c0);
        f = 0 + smoothstep(t);
      } else if (viewportCenter <= c2) {
        const t = (viewportCenter - c1) / Math.max(1, c2 - c1);
        f = 1 + smoothstep(t);
      } else if (viewportCenter <= c3) {
        const t = (viewportCenter - c2) / Math.max(1, c3 - c2);
        f = 2 + smoothstep(t);
      } else {
        f = 3;
      }

      if (isNaN(f)) f = 0;
      setProgress(f);
    };

    computeProgress();
    window.addEventListener('scroll', computeProgress, { passive: true });
    window.addEventListener('resize', computeProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', computeProgress);
      window.removeEventListener('resize', computeProgress);
    };
  }, []);

  return progress;
}

