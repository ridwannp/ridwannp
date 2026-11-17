import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { STOPS, YearStop, DoorStop } from '../data/journey';
import styles from '../styles/InfoCard.module.css';

interface InfoCardProps {
  activeStop: number;
  cardRef: React.RefObject<HTMLDivElement>;
  email?: string;
  rasanaraUrl?: string;
  cvUrl?: string;
}

function YearContent({ stop }: { stop: YearStop }) {
  return (
    <>
      <div className={styles.when}>{stop.when}</div>
      <h2 className={styles.role}>{stop.role}</h2>
      <p className={styles.quote}>{stop.quote}</p>
      <ul className={styles.pointsList}>
        {stop.points.map((pt, i) => (
          <li key={i}>{pt}</li>
        ))}
      </ul>
      {stop.tags.length > 0 && (
        <div className={styles.tags}>
          {stop.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function DoorContent({
  stop,
  email,
  rasanaraUrl
}: {
  stop: DoorStop;
  email: string;
  rasanaraUrl: string;
}) {
  return (
    <>
      <div className={styles.when}>{stop.when}</div>
      <h2 className={styles.role}>{stop.role}</h2>
      <p className={styles.doorText}>{stop.text}</p>
      <div className={styles.doorActions}>
        <Link to="/" className={styles.btnOutline}>
          ← Teras
        </Link>
        <a href={`mailto:${email}`} className={styles.btnDark}>
          Kirim email
        </a>
      </div>
      {/* rasanaraUrl reserved for future use */}
      <span data-rasanara={rasanaraUrl} style={{ display: 'none' }} aria-hidden="true" />
    </>
  );
}

export const InfoCard: React.FC<InfoCardProps> = memo(
  ({ activeStop, cardRef, email = 'ridwannurdiyanto93@gmail.com', rasanaraUrl = '#rasanara', cvUrl = '/cv.pdf' }) => {
    const stop = STOPS[activeStop];

    return (
      <div className={styles.panel} aria-live="polite">
        <div ref={cardRef} className={styles.card} style={{ opacity: 0 }}>
          {stop.type === 'year' ? (
            <YearContent stop={stop} />
          ) : (
            <DoorContent stop={stop} email={email} rasanaraUrl={rasanaraUrl} />
          )}
        </div>
      </div>
    );
  }
);

InfoCard.displayName = 'InfoCard';

