import React from 'react';

export const StaticFallback: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100vw', height: '100svh' }}
      >
        {/* Distant Hills */}
        <ellipse cx="200" cy="980" rx="450" ry="220" fill="#2B1026" />
        <ellipse cx="800" cy="1020" rx="550" ry="260" fill="#2B1026" fillOpacity="0.8" />
        <ellipse cx="1350" cy="950" rx="420" ry="200" fill="#2B1026" />

        {/* Moon */}
        <circle cx="280" cy="160" r="42" fill="#FFF1D6" fillOpacity="0.9" />

        {/* Circus Tent Silhouette (Left) */}
        <g transform="translate(180, 520)">
          <polygon points="120,40 40,160 200,160" fill="#E0316A" />
          <polygon points="120,40 70,160 170,160" fill="#FFF1D6" />
          <rect x="50" y="160" width="140" height="90" fill="#E0316A" />
          <rect x="75" y="160" width="30" height="90" fill="#FFF1D6" />
          <rect x="135" y="160" width="30" height="90" fill="#FFF1D6" />
          {/* Mint Door */}
          <rect x="95" y="180" width="50" height="70" rx="25" fill="#4FD1A1" fillOpacity="0.8" />
        </g>

        {/* Ferris Wheel Silhouette (Center-Right) */}
        <g transform="translate(880, 360)">
          {/* Wheel Torus Rings */}
          <circle cx="200" cy="200" r="160" stroke="#8B1538" strokeWidth="12" fill="none" />
          <circle cx="200" cy="200" r="8" fill="#FFC83D" />
          {/* Spokes */}
          <line x1="40" y1="200" x2="360" y2="200" stroke="#FFC83D" strokeWidth="3" />
          <line x1="200" y1="40" x2="200" y2="360" stroke="#FFC83D" strokeWidth="3" />
          <line x1="87" y1="87" x2="313" y2="313" stroke="#FFC83D" strokeWidth="3" />
          <line x1="87" y1="313" x2="313" y2="87" stroke="#FFC83D" strokeWidth="3" />
          {/* Stand */}
          <line x1="80" y1="460" x2="200" y2="200" stroke="#8B1538" strokeWidth="10" strokeLinecap="round" />
          <line x1="320" y1="460" x2="200" y2="200" stroke="#8B1538" strokeWidth="10" strokeLinecap="round" />
        </g>

        {/* String Light Cables across sky */}
        <path
          d="M 120 420 Q 500 560, 880 400 Q 1150 520, 1400 440"
          stroke="#3A2F44"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    </div>
  );
};

