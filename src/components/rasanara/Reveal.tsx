import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RevealProps {
  children: React.ReactNode;
  delayIndex?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delayIndex = 0,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [prefersReduced]);

  const delayMs = prefersReduced ? 0 : delayIndex * 100;

  return (
    <div
      ref={ref}
      className={`reveal-element ${isVisible || prefersReduced ? 'is-revealed' : ''} ${className}`}
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
};

