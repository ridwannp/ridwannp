import React from 'react';
import './kit.css';

export interface DuskBackgroundProps {
  variant?: 'festive' | 'calm';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showStars?: boolean;
}

export const DuskBackground: React.FC<DuskBackgroundProps> = ({
  variant = 'festive',
  children,
  className = '',
  style = {},
  showStars = true,
}) => {
  const festiveGradient =
    'linear-gradient(180deg, #160B2E 0%, #3B0F39 36%, #8B1538 66%, #E9A23B 100%)';
  const calmGradient =
    'linear-gradient(180deg, #160B2E 0%, #2A0F3A 45%, #4A1236 100%)';

  const backgroundStyle = variant === 'festive' ? festiveGradient : calmGradient;

  return (
    <div
      className={`min-h-[100svh] text-[#FFF1D6] relative overflow-x-hidden ${className}`}
      style={{
        background: backgroundStyle,
        transition: 'background 600ms ease',
        ...style,
      }}
    >
      {showStars && <div className="kit-stars-layer" aria-hidden="true" />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

