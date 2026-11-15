import React, { useRef, useEffect } from 'react';
import { registerRenderCallback } from '../motion/scrollSync';

interface RotatingBadgeProps {
  isReducedMotion?: boolean;
}

export const RotatingBadge: React.FC<RotatingBadgeProps> = ({ isReducedMotion = false }) => {
  const badgeRef = useRef<SVGSVGElement | null>(null);
  const angleRef = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isReducedMotion) return;

    let unregister: (() => void) | null = null;

    unregister = registerRenderCallback(() => {
      if (!badgeRef.current) return;

      const currentY = window.scrollY;
      const velocity = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;

      // Base speed: 0.3 deg/frame, increases up to 2x with velocity
      const speed = 0.35 + Math.min(velocity * 0.05, 0.7);
      angleRef.current = (angleRef.current + speed) % 360;

      badgeRef.current.style.transform = `rotate(${angleRef.current}deg)`;
    });

    return () => {
      if (unregister) unregister();
    };
  }, [isReducedMotion]);

  return (
    <div
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100px',
        height: '100px',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <svg
        ref={badgeRef}
        viewBox="0 0 100 100"
        width="100"
        height="100"
        style={{
          transformOrigin: 'center center',
          transition: isReducedMotion ? 'none' : undefined,
        }}
      >
        <defs>
          <path
            id="textcircle"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>

        <text
          fontSize="9.5"
          fontFamily="var(--font-display)"
          fontWeight="600"
          letterSpacing="0.16em"
          fill="var(--accent)"
        >
          <textPath xlinkHref="#textcircle" href="#textcircle">
            DIGITAL PLAYGROUND · RASANARA ·
          </textPath>
        </text>
      </svg>

      {/* Center gold dot */}
      <div
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '9999px',
          backgroundColor: 'var(--gold)',
        }}
      />
    </div>
  );
};

