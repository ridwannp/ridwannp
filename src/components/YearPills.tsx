import React, { memo } from 'react';
import { STOPS } from '../data/journey';
import styles from '../styles/YearPills.module.css';

interface YearPillsProps {
  activeStop: number;
  onScrollToStop: (k: number) => void;
}

export const YearPills: React.FC<YearPillsProps> = memo(({ activeStop, onScrollToStop }) => {
  return (
    <div className={styles.container} aria-label="Navigasi perjalanan">
      {STOPS.map((stop, k) => (
        <button
          key={stop.nav + k}
          className={`${styles.pill} ${activeStop === k ? styles.pillActive : ''}`}
          aria-current={activeStop === k ? 'step' : undefined}
          onClick={() => onScrollToStop(k)}
        >
          {stop.nav}
        </button>
      ))}
    </div>
  );
});

YearPills.displayName = 'YearPills';

