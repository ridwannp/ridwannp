import React from 'react';

/**
 * Static SVG illustration of the "Narasi" state:
 * A gentle sine curve with colored cards (burgundy, gold, graphite, taupe)
 */
export const HeroFallbackSvg: React.FC = () => {
  const cards = [
    { x: 60, y: 310, rotate: -15, color: '#8B1538' },
    { x: 130, y: 280, rotate: -18, color: '#D4AF37' },
    { x: 200, y: 245, rotate: -20, color: '#3A3438' },
    { x: 280, y: 215, rotate: -16, color: '#C9BDA5' },
    { x: 360, y: 195, rotate: -8, color: '#8B1538' },
    { x: 440, y: 190, rotate: 2, color: '#D4AF37' },
    { x: 520, y: 205, rotate: 12, color: '#3A3438' },
    { x: 600, y: 235, rotate: 18, color: '#8B1538' },
    { x: 680, y: 275, rotate: 20, color: '#C9BDA5' },
    { x: 760, y: 310, rotate: 16, color: '#D4AF37' },
    { x: 840, y: 335, rotate: 6, color: '#3A3438' },
    { x: 920, y: 340, rotate: -4, color: '#8B1538' },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-80" aria-hidden="true">
      <svg
        viewBox="0 0 1000 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-5xl object-contain"
      >
        {/* Golden Sine Curve */}
        <path
          d="M 40 330 C 260 210, 420 170, 520 205 C 640 250, 780 350, 960 330"
          stroke="#D4AF37"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Cards along the curve */}
        {cards.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y}) rotate(${c.rotate})`}>
            <rect
              x="-24"
              y="-16"
              width="48"
              height="32"
              rx="4"
              fill={c.color}
              stroke="#FBFAF7"
              strokeWidth="1.5"
              filter="drop-shadow(0 4px 8px rgba(21,18,15,0.08))"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

