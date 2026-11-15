import React from 'react';

interface GoldPathProps {
  scrollProgress: number; // 0 to 1
}

export const GoldPath: React.FC<GoldPathProps> = ({ scrollProgress }) => {
  // SVG viewBox height 2400, width 100
  const totalLength = 2600;
  const dashOffset = Math.max(0, totalLength * (1 - scrollProgress));

  const isDiscoveryPassed = scrollProgress >= 0.28;
  const isProdukPassed = scrollProgress >= 0.62;
  const isPenutupPassed = scrollProgress >= 0.92;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 2400"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Background faint guideline */}
        <path
          d="M 50 120 C 75 400, 25 700, 50 950 C 75 1200, 20 1500, 50 1800 C 80 2050, 30 2250, 50 2380"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeOpacity="0.15"
          strokeDasharray="4 6"
        />

        {/* Animated active path */}
        <path
          d="M 50 120 C 75 400, 25 700, 50 950 C 75 1200, 20 1500, 50 1800 C 80 2050, 30 2250, 50 2380"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />

        {/* Dot 1: Discovery anchor */}
        <circle
          cx="50"
          cy="950"
          r={isDiscoveryPassed ? 5 : 2.5}
          fill="#8B1538"
          stroke="#D4AF37"
          strokeWidth="1"
          style={{ transition: 'r 300ms ease' }}
        />

        {/* Dot 2: Produk anchor */}
        <circle
          cx="50"
          cy="1800"
          r={isProdukPassed ? 5 : 2.5}
          fill="#8B1538"
          stroke="#D4AF37"
          strokeWidth="1"
          style={{ transition: 'r 300ms ease' }}
        />

        {/* Dot 3: Penutup anchor */}
        <circle
          cx="50"
          cy="2380"
          r={isPenutupPassed ? 6 : 2.5}
          fill="#8B1538"
          stroke="#D4AF37"
          strokeWidth="1.5"
          style={{ transition: 'r 300ms ease' }}
        />
      </svg>
    </div>
  );
};

