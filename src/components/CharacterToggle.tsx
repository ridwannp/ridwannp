import React, { memo } from 'react';
import type { CharacterStyle } from '../three/createJourneyScene';
import styles from '../styles/CharacterToggle.module.css';

interface CharacterToggleProps {
  current: CharacterStyle;
  onChange: (style: CharacterStyle) => void;
}

const OPTIONS: { label: string; value: CharacterStyle }[] = [
  { label: 'Siluet', value: 'silhouette' },
  { label: 'Manekin', value: 'mannequin' },
  { label: 'Low-poly', value: 'low-poly' },
];

export const CharacterToggle: React.FC<CharacterToggleProps> = memo(({ current, onChange }) => {
  return (
    <div className={styles.container} aria-label="Gaya tampilan tokoh">
      <span className={styles.label}>Tokoh</span>
      <div className={styles.pills} role="group" aria-label="Pilih gaya tokoh">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.pill} ${current === opt.value ? styles.pillActive : ''}`}
            aria-pressed={current === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
});

CharacterToggle.displayName = 'CharacterToggle';

