import React from 'react';
import { Link } from 'react-router-dom';
import './kit.css';

export interface ButtonProps {
  variant?: 'gold' | 'mint' | 'coral' | 'cream' | 'burgundy' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a' | 'link';
  href?: string;
  to?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  download?: boolean | string;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

const COLOR_MAP = {
  gold: { bg: '#FFC83D', text: '#1A0F24' },
  mint: { bg: '#4FD1A1', text: '#1A0F24' },
  coral: { bg: '#E0316A', text: '#FFF1D6' },
  cream: { bg: '#FFF1D6', text: '#1A0F24' },
  burgundy: { bg: '#8B1538', text: '#FFF1D6' },
  dark: { bg: '#1A0F24', text: '#FFF1D6' },
};

const SIZE_MAP = {
  sm: { padding: '0.4rem 0.85rem', fontSize: '0.8125rem' },
  md: { padding: '0.65rem 1.4rem', fontSize: '0.875rem' },
  lg: { padding: '0.85rem 1.85rem', fontSize: '1rem' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  size = 'md',
  as = 'button',
  href,
  to,
  onClick,
  disabled = false,
  className = '',
  style = {},
  children,
  target,
  rel,
  download,
  'aria-label': ariaLabel,
  type = 'button',
}) => {
  const { bg, text } = COLOR_MAP[variant] || COLOR_MAP.gold;
  const { padding, fontSize } = SIZE_MAP[size] || SIZE_MAP.md;

  const combinedStyle: React.CSSProperties = {
    backgroundColor: disabled ? '#8F879A' : bg,
    color: disabled ? '#E2DED3' : text,
    padding,
    fontSize,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1,
    ...style,
  };

  if (as === 'link' && to) {
    return (
      <Link
        to={to}
        className={`kit-chunky-btn ${className}`}
        style={combinedStyle}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  if (as === 'a' || href) {
    return (
      <a
        href={href}
        className={`kit-chunky-btn ${className}`}
        style={combinedStyle}
        onClick={onClick}
        target={target}
        rel={rel}
        download={download}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`kit-chunky-btn ${className}`}
      style={combinedStyle}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

