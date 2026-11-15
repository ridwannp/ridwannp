import React from 'react';

interface ReduceMotionToggleProps {
  reducedMotion: boolean;
  onToggle: (enabled: boolean) => void;
}

export const ReduceMotionToggle: React.FC<ReduceMotionToggleProps> = ({
  reducedMotion,
  onToggle,
}) => {
  return (
    <button
      type="button"
      aria-pressed={reducedMotion}
      onClick={() => onToggle(!reducedMotion)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.45rem 0.85rem',
        borderRadius: '9999px',
        border: '1px solid var(--line)',
        backgroundColor: reducedMotion ? 'var(--card)' : 'transparent',
        color: 'var(--muted)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '9999px',
          backgroundColor: reducedMotion ? '#b45309' : '#10b981',
        }}
      />
      <span>{reducedMotion ? 'Animasi dinonaktifkan' : 'Kurangi animasi'}</span>
    </button>
  );
};

