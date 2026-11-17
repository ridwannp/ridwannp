import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface RevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delayMs = 0,
  className = '',
  style = {},
  threshold = 0.15,
}) => {
  const isReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(isReducedMotion);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isReducedMotion, threshold]);

  if (isReducedMotion) {
    return (
      <div ref={domRef} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0) rotate(0deg)'
          : 'translateY(24px) rotate(0.8deg)',
        transition: `opacity 650ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms, transform 650ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
};

