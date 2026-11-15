import Lenis from 'lenis';

export const ENABLE_SMOOTH_SCROLL = true;

let lenisInstance: Lenis | null = null;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function initLenis(isReducedMotion: boolean): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (!ENABLE_SMOOTH_SCROLL || isReducedMotion) {
    destroyLenis();
    return null;
  }

  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: easeOutExpo,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function scrollToTarget(
  target: string | HTMLElement,
  options?: { offset?: number; duration?: number }
): void {
  const offset = options?.offset ?? -16;
  const duration = options?.duration ?? 1.2;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration,
      easing: easeOutExpo,
    });
  } else {
    // Fallback for native scroll / reduced-motion
    let element: HTMLElement | null = null;
    if (typeof target === 'string') {
      element = document.querySelector(target);
    } else {
      element = target;
    }

    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }
}

