import React from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './kit.css';

export interface SplitTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  staggerMs?: number;
  highlightWords?: string[];
  highlightColor?: string;
  shadowColor?: string;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  as: Component = 'h1',
  className = '',
  style = {},
  staggerMs = 45,
  highlightWords = [],
  highlightColor = '#FFC83D',
  shadowColor = '#E0316A',
}) => {
  const isReducedMotion = useReducedMotion();

  // Split text by space to preserve word wrapping
  const words = text.split(' ');
  let charCounter = 0;

  return (
    <Component
      aria-label={text}
      className={`font-display font-extrabold text-[#FFF1D6] ${className}`}
      style={{
        textShadow: `3.5px 3.5px 0 ${shadowColor}`,
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {words.map((word, wIdx) => {
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        );

        const letters = word.split('');

        return (
          <span
            key={wIdx}
            style={{
              display: 'inline-block',
              marginRight: wIdx === words.length - 1 ? 0 : '0.3em',
              color: isHighlight ? highlightColor : undefined,
            }}
          >
            {letters.map((char, cIdx) => {
              const delay = isReducedMotion ? 0 : charCounter * staggerMs;
              charCounter++;

              return (
                <span
                  key={cIdx}
                  aria-hidden="true"
                  className={isReducedMotion ? '' : 'kit-bounce-letter'}
                  style={{
                    display: 'inline-block',
                    animationDelay: `${delay}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
};

