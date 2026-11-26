import React from 'react';
import './kit.css';

export interface BoothProps {
  accentColor?: string; // hex or color value for 9px offset shadow
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  role?: string;
  'aria-label'?: string;
}

export const Booth: React.FC<BoothProps> = ({
  accentColor = '#FFC83D',
  children,
  className = '',
  style = {},
  id,
  role,
  'aria-label': ariaLabel,
}) => {
  return (
    <div
      id={id}
      role={role}
      aria-label={ariaLabel}
      className={`kit-booth-panel text-[#1A0F24] ${className}`}
      style={{
        boxShadow: `7px 7px 0 ${accentColor}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

