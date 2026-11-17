import React, { useId } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './kit.css';

export interface SpinBadgeProps {
  text: string;
  size?: number;
  centerIcon?: React.ReactNode;
  textColor?: string;
  centerColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SpinBadge: React.FC<SpinBadgeProps> = ({
  text,
  size = 84,
  centerIcon = '★',
  textColor = '#FFC83D',
  centerColor = '#4FD1A1',
  className = '',
  style = {},
}) => {
  const isReducedMotion = useReducedMotion();
  const rawId = useId();
  const circleId = `spin-badge-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <div
      aria-hidden="true"
      className={`relative select-none pointer-events-none inline-block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className={isReducedMotion ? '' : 'kit-badge-spin'}
        style={{ transformOrigin: 'center center' }}
      >
        <defs>
          <path
            id={circleId}
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          />
        </defs>
        <text
          fontSize="8"
          fontFamily='"Space Grotesk", sans-serif'
          fontWeight="700"
          letterSpacing="0.16em"
          fill={textColor}
        >
          <textPath xlinkHref={`#${circleId}`} href={`#${circleId}`}>
            {text}
          </textPath>
        </text>
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: centerColor,
          fontSize: `${size * 0.22}px`,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {centerIcon}
      </div>
    </div>
  );
};

