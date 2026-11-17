import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface DecorLayerProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DecorLayer: React.FC<DecorLayerProps> = ({ className = '', style = {} }) => {
  const isReducedMotion = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isReducedMotion || typeof window === 'undefined') return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isReducedMotion]);

  const p1 = isReducedMotion ? 0 : scrollY * 0.12;
  const p2 = isReducedMotion ? 0 : scrollY * -0.08;
  const p3 = isReducedMotion ? 0 : scrollY * 0.15;
  const p4 = isReducedMotion ? 0 : scrollY * 0.09;
  const r1 = isReducedMotion ? 0 : scrollY * 0.05;
  const r2 = isReducedMotion ? 0 : scrollY * -0.04;

  return (
    <div
      aria-hidden="true"
      className={`kit-decor-layer absolute inset-0 pointer-events-none overflow-hidden z-[1] ${className}`}
      style={style}
    >
      {/* Mint Star (Top Left) */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="#4FD1A1"
        style={{
          position: 'absolute',
          top: '16vh',
          left: '5vw',
          transform: `translate3d(0, ${p1}px, 0) rotate(${r1}deg)`,
          opacity: 0.85,
        }}
      >
        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
      </svg>

      {/* Gold Ring (Top Right) */}
      <svg
        width="54"
        height="54"
        viewBox="0 0 50 50"
        fill="none"
        stroke="#FFC83D"
        strokeWidth="6"
        style={{
          position: 'absolute',
          top: '32vh',
          right: '7vw',
          transform: `translate3d(0, ${p2}px, 0)`,
          opacity: 0.75,
        }}
      >
        <circle cx="25" cy="25" r="20" />
      </svg>

      {/* Coral Squiggle (Mid Left) */}
      <svg
        width="80"
        height="30"
        viewBox="0 0 80 30"
        fill="none"
        stroke="#E0316A"
        strokeWidth="5"
        strokeLinecap="round"
        style={{
          position: 'absolute',
          top: '95vh',
          left: '6vw',
          transform: `translate3d(0, ${p3}px, 0) rotate(15deg)`,
          opacity: 0.8,
        }}
      >
        <path d="M 5 15 Q 22 0, 40 15 T 75 15" />
      </svg>

      {/* Mint Plus (Mid Right) */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 40 40"
        fill="#4FD1A1"
        style={{
          position: 'absolute',
          top: '145vh',
          right: '8vw',
          transform: `translate3d(0, ${p4}px, 0) rotate(${r2}deg)`,
          opacity: 0.75,
        }}
      >
        <rect x="16" y="4" width="8" height="32" rx="4" />
        <rect x="4" y="16" width="32" height="8" rx="4" />
      </svg>

      {/* Gold Star (Bottom Left) */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="#FFC83D"
        style={{
          position: 'absolute',
          top: '210vh',
          left: '8vw',
          transform: `translate3d(0, ${p2}px, 0) rotate(${r1}deg)`,
          opacity: 0.7,
        }}
      >
        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
      </svg>
    </div>
  );
};

