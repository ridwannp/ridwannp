import React from 'react';
import './kit.css';

export interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'aria-pressed'?: boolean;
  'aria-label'?: string;
  activeColor?: string;
  inactiveColor?: string;
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onClick,
  onKeyDown,
  children,
  className = '',
  style = {},
  'aria-pressed': ariaPressed,
  'aria-label': ariaLabel,
  activeColor = '#FFC83D',
  inactiveColor = '#FFF1D6',
  size = 'md',
}) => {
  const isPressed = ariaPressed !== undefined ? ariaPressed : active;
  const padding = size === 'sm' ? '0.3rem 0.65rem' : '0.45rem 0.95rem';
  const fontSize = size === 'sm' ? '0.75rem' : '0.8125rem';

  return (
    <button
      type="button"
      role="button"
      aria-pressed={isPressed}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`inline-flex items-center gap-1.5 font-sans font-bold border-2 border-[#1A0F24] rounded-full transition-all duration-150 cursor-pointer select-none ${className}`}
      style={{
        backgroundColor: isPressed ? activeColor : inactiveColor,
        color: '#1A0F24',
        padding,
        fontSize,
        boxShadow: isPressed ? '3px 3px 0 #1A0F24' : '2px 2px 0 #1A0F24',
        transform: isPressed ? 'translate(-1px, -1px)' : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export interface TagProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'gold' | 'coral' | 'mint' | 'cream' | 'burgundy' | 'outline';
}

const TAG_COLOR_MAP = {
  gold: { bg: '#FFC83D', text: '#1A0F24', border: '#1A0F24' },
  coral: { bg: '#E0316A', text: '#FFF1D6', border: '#1A0F24' },
  mint: { bg: '#4FD1A1', text: '#1A0F24', border: '#1A0F24' },
  cream: { bg: '#FFF1D6', text: '#1A0F24', border: '#1A0F24' },
  burgundy: { bg: '#8B1538', text: '#FFF1D6', border: '#1A0F24' },
  outline: { bg: 'transparent', text: '#FFF1D6', border: 'rgba(255, 241, 214, 0.4)' },
};

export const Tag: React.FC<TagProps> = ({
  children,
  className = '',
  style = {},
  variant = 'cream',
}) => {
  const { bg, text, border } = TAG_COLOR_MAP[variant] || TAG_COLOR_MAP.cream;

  return (
    <span
      className={`inline-flex items-center font-sans font-bold text-xs px-2.5 py-1 rounded-full border border-solid ${className}`}
      style={{
        backgroundColor: bg,
        color: text,
        borderColor: border,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
