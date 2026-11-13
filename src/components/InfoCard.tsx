import React, { useRef, useState, useCallback, memo } from 'react';
import { STOPS, YearStop, DoorStop } from '../data/journey';
import styles from '../styles/InfoCard.module.css';

interface InfoCardProps {
  activeStop: number;
  cardRef: React.RefObject<HTMLDivElement>;
  email?: string;
  rasanaraUrl?: string;
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
  rasanaraUrl,
}: {
  stop: DoorStop;
  email: string;
  rasanaraUrl: string;
}) {
  const [copyLabel, setCopyLabel] = useState<string>('Salin email');
  const emailRef = useRef<HTMLSpanElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyLabel('Tersalin');
    } catch {
      // Fallback: select text
      if (emailRef.current) {
        const range = document.createRange();
        range.selectNodeContents(emailRef.current);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      setCopyLabel('Teks terpilih');
    }

    setTimeout(() => setCopyLabel('Salin email'), 1800);
  }, [email]);

  return (
    <>
      <div className={styles.when}>{stop.when}</div>
      <h2 className={styles.role}>{stop.role}</h2>
      <p className={styles.doorText}>{stop.text}</p>
      <div className={styles.doorActions}>
        <a href={`mailto:${email}`} className={styles.btnDark}>
          Kirim email
        </a>
        <a href={rasanaraUrl} className={styles.btnOutline}>
          Lihat Rasanara
        </a>
      </div>
      <div className={styles.emailRow}>
        <span ref={emailRef} className={styles.emailText} aria-label={`Alamat email: ${email}`}>
          {email}
        </span>
        <button className={styles.copyBtn} onClick={handleCopy} aria-live="polite">
          {copyLabel}
        </button>
      </div>
    </>
  );
}

export const InfoCard: React.FC<InfoCardProps> = memo(
  ({ activeStop, cardRef, email = 'ridwannurdiyanto93@gmail.com', rasanaraUrl = '#rasanara' }) => {
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

