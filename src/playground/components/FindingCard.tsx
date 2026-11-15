import React from 'react';
import { EvaluatedFinding } from '../engine/types';
import styles from '../styles/Playground.module.css';

interface FindingCardProps {
  finding: EvaluatedFinding;
  index: number;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, index }) => {
  const getBadgeClass = (priority: string) => {
    switch (priority) {
      case 'tinggi':
        return styles.badgeTinggi;
      case 'perhatian':
        return styles.badgePerhatian;
      default:
        return styles.badgePeluang;
    }
  };

  return (
    <article className={styles.findingCard} aria-labelledby={`finding-title-${index}`}>
      <header className={styles.findingHeader}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--accent)',
            }}
          >
            #{index}
          </span>
          <h3 id={`finding-title-${index}`} className={styles.findingTitle}>
            {finding.title}
          </h3>
        </div>
        <span className={`${styles.badge} ${getBadgeClass(finding.priority)}`}>
          {finding.priorityLabel}
        </span>
      </header>

      {/* Lapisan 1: Indikasi */}
      <p className={styles.findingIndication}>{finding.indication}</p>

      {/* Lapisan 2: Fakta Pendukung */}
      {finding.supportingFacts.length > 0 && (
        <div className={styles.factsBox}>
          <div className={styles.factsTitle}>Berdasarkan jawaban Anda:</div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.5 }}>
            {finding.supportingFacts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Lapisan 3: Rekomendasi Langkah Awal & Peluang Digital */}
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ink)' }}>
          Rekomendasi langkah awal:
        </div>
        <ol className={styles.stepsList}>
          {finding.firstSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        {finding.digitalOpportunity && (
          <div className={styles.digitalOpportunity}>
            <span aria-hidden="true">💡</span>
            <div>
              <strong>Peluang digital:</strong> {finding.digitalOpportunity.text}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

