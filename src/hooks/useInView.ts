import { useState, useEffect, useRef } from 'react';

export interface UseInViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.15, root = null, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(el);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return [ref, isInView];
}

