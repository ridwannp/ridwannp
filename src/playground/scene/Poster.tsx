import React from 'react';

interface PosterProps {
  opacity?: number;
}

export const Poster: React.FC<PosterProps> = ({ opacity = 1 }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '6vw',
        opacity,
        transition: 'opacity 400ms ease',
      }}
    >
      <svg
        width="480"
        height="440"
        viewBox="0 0 480 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          maxWidth: '55vw',
          maxHeight: '65vh',
          filter: 'drop-shadow(0 12px 24px rgba(21, 19, 15, 0.06))',
        }}
      >
        {/* Soft shadow */}
        <ellipse cx="280" cy="380" rx="140" ry="24" fill="#15130F" fillOpacity="0.06" />

        {/* Fanning question cards */}
        <rect
          x="180"
          y="80"
          width="130"
          height="85"
          rx="6"
          fill="#EFE5D2"
          transform="rotate(12 180 80)"
          stroke="#E2D5BC"
          strokeWidth="1.5"
        />
        <rect
          x="260"
          y="100"
          width="130"
          height="85"
          rx="6"
          fill="#EFE5D2"
          transform="rotate(-8 260 100)"
          stroke="#E2D5BC"
          strokeWidth="1.5"
        />

        {/* Orbiting cube */}
        <rect
          x="120"
          y="230"
          width="64"
          height="64"
          rx="4"
          fill="#EFE5D2"
          stroke="#D4AF37"
          strokeWidth="1.5"
          transform="rotate(22 120 230)"
        />

        {/* Large Lens (Torus + Handle) */}
        <circle cx="280" cy="220" r="76" stroke="#8B1538" strokeWidth="18" fill="#FBFAF7" fillOpacity="0.3" />
        <line x1="280" y1="296" x2="280" y2="368" stroke="#D4AF37" strokeWidth="10" strokeLinecap="round" />

        {/* Gold gear */}
        <circle cx="390" cy="210" r="32" fill="#D4AF37" fillOpacity="0.85" />
        <circle cx="390" cy="210" r="12" fill="#FBFAF7" />

        {/* Toggle switch */}
        <rect x="210" y="320" width="70" height="26" rx="13" fill="#8B1538" />
        <circle cx="260" cy="333" r="10" fill="#EFE5D2" />
      </svg>
    </div>
  );
};

