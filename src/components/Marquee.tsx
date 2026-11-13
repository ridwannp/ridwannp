import React, { memo } from 'react';

interface MarqueeProps {
  hoveredColor?: string;
  isHovered: boolean;
  prefersReducedMotion?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = memo(({
  hoveredColor = '#FF6B6B',
  isHovered,
  prefersReducedMotion = false,
}) => {
  const row1Text = 'Developer · Product · AI · Automation · ';
  const row2Text = 'Ridwan Nurdiyanto Putra — Rasanara Digital Agency & Creative Technology — ';

  const row1Repeated = Array(6).fill(row1Text).join('');
  const row2Repeated = Array(6).fill(row2Text).join('');

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-center items-center z-0 select-none"
      aria-hidden="true"
    >
      {/* Row 1: Outline stroke marquee, moving left */}
      <div className="w-full overflow-hidden whitespace-nowrap mb-2 md:mb-6">
        <div
          className={`flex w-fit ${prefersReducedMotion ? '' : 'animate-marquee-left'}`}
          style={{
            ['--hover-stroke-color' as string]: hoveredColor,
          }}
        >
          <span
            className="marquee-stroke font-sans font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter"
            style={{
              opacity: isHovered ? 0.65 : 0.18,
              WebkitTextStrokeColor: hoveredColor,
            }}
          >
            {row1Repeated}
          </span>
          <span
            className="marquee-stroke font-sans font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter"
            style={{
              opacity: isHovered ? 0.65 : 0.18,
              WebkitTextStrokeColor: hoveredColor,
            }}
          >
            {row1Repeated}
          </span>
        </div>
      </div>

      {/* Row 2: Solid very subtle text, moving right */}
      <div className="w-full overflow-hidden whitespace-nowrap mt-2 md:mt-6">
        <div className={`flex w-fit ${prefersReducedMotion ? '' : 'animate-marquee-left'}`}>
          <span className="font-sans font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight text-[#141218] opacity-[0.05]">
            {row2Repeated}
          </span>
          <span className="font-sans font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight text-[#141218] opacity-[0.05]">
            {row2Repeated}
          </span>
        </div>
      </div>
    </div>
  );
});

Marquee.displayName = 'Marquee';

