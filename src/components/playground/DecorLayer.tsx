import React, { useEffect, useState } from 'react';

interface DecorLayerProps {
  isReducedMotion: boolean;
}

export const DecorLayer: React.FC<DecorLayerProps> = ({ isReducedMotion }) => {
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
  const r1 = isReducedMotion ? 0 : scrollY * 0.05;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Mint Star (Hero Left) */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="#4FD1A1"
        style={{
          position: 'absolute',
          top: '18vh',
          left: '6vw',
          transform: `translate3d(0, ${p1}px, 0) rotate(${r1}deg)`,
          opacity: 0.85,
        }}
      >
        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
      </svg>

      {/* Gold Ring (Hero Right) */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 50 50"
        fill="none"
        stroke="#FFC83D"
        strokeWidth="6"
        style={{
          position: 'absolute',
          top: '35vh',
          right: '8vw',
          transform: `translate3d(0, ${p2}px, 0)`,
          opacity: 0.75,
        }}
      >
        <circle cx="25" cy="25" r="20" />
      </svg>

      {/* Coral Squiggle (Discovery Mid) */}
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
          top: '115vh',
          left: '8vw',
          transform: `translate3d(0, ${p3}px, 0) rotate(15deg)`,
          opacity: 0.8,
        }}
      >
        <path d="M 5 15 Q 22 0, 40 15 T 75 15" />
      </svg>

      {/* Mint Plus (Produk) */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 40 40"
        fill="#4FD1A1"
        style={{
          position: 'absolute',
          top: '210vh',
          right: '12vw',
          transform: `translate3d(0, ${p2}px, 0) rotate(${r1 * 1.5}deg)`,
          opacity: 0.85,
        }}
      >
        <rect x="16" y="0" width="8" height="40" rx="4" />
        <rect x="0" y="16" width="40" height="8" rx="4" />
      </svg>

      {/* Gold Star (Finale) */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="#FFC83D"
        style={{
          position: 'absolute',
          top: '310vh',
          left: '14vw',
          transform: `translate3d(0, ${p1}px, 0) rotate(${-r1}deg)`,
          opacity: 0.9,
        }}
      >
        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
      </svg>
    </div>
  );
};

