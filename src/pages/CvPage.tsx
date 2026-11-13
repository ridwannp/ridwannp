import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useJourneyScroll } from '../hooks/useJourneyScroll';
import { JOURNEY_INTRO, STOPS } from '../data/journey';
import { DownloadCvButton } from '../components/DownloadCvButton';
import { YearPills } from '../components/YearPills';
import { CharacterToggle } from '../components/CharacterToggle';
import { InfoCard } from '../components/InfoCard';
import styles from '../styles/JourneyPage.module.css';
import '../styles/tokens.css';

interface CvPageProps {
  cvUrl?: string;
  email?: string;
  rasanaraUrl?: string;
}

const N_STOPS = STOPS.length; // 5

const CvPage: React.FC<CvPageProps> = ({
  cvUrl = '/cv.pdf',
  email = 'ridwannurdiyanto93@gmail.com',
  rasanaraUrl = '#rasanara',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneHostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { activeStop, characterStyle, setCharacterStyle, webGlFailed, scrollToStop } =
    useJourneyScroll({
      trackRef,
      stageRef,
      sceneHostRef,
      cardRef,
      prefersReducedMotion,
    });

  // When WebGL fails, show card at full opacity immediately
  useEffect(() => {
    if (webGlFailed && cardRef.current) {
      cardRef.current.style.opacity = '1';
      cardRef.current.style.pointerEvents = 'auto';
    }
  }, [webGlFailed]);

  return (
    <div className={styles.outer}>
      {/* Fixed download button */}
      <DownloadCvButton cvUrl={cvUrl} />

      {/* Back link */}
      <Link to="/" className={styles.backLink} aria-label="Kembali ke halaman utama teras">
        ← Teras
      </Link>

      {/* Intro section */}
      <section className={styles.intro} aria-labelledby="journey-h1">
        <p className={styles.eyebrow}>{JOURNEY_INTRO.eyebrow}</p>
        <h1 id="journey-h1" className={styles.h1}>
          {JOURNEY_INTRO.h1}
        </h1>
        <p className={styles.lede}>{JOURNEY_INTRO.lede}</p>
        <div className={styles.chips} aria-label="Latar belakang singkat">
          {JOURNEY_INTRO.chips.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* Scroll-driven track: 135dvh × N stops */}
      <div
        ref={trackRef}
        className={styles.track}
        style={{ height: `${135 * N_STOPS}vh` }}
      >
        {/* Sticky viewport stage */}
        <div ref={stageRef} className={styles.stage}>
          {/* Year Pills: absolute top-center */}
          <YearPills activeStop={activeStop} onScrollToStop={scrollToStop} />

          {/* 3D Scene host */}
          <div
            ref={sceneHostRef}
            className={styles.scene}
            role="img"
            aria-label="Tangga 3D dengan seseorang yang menaikinya. Di tiap tahun tangga berubah menjadi lantai dan lampu menyala."
          >
            {webGlFailed && (
              <p className={styles.fallback}>
                Tampilan 3D tidak bisa dimuat di browser ini. Kartu di samping tetap mengikuti
                scroll.
              </p>
            )}
          </div>

          {/* Info Card: left vertical-center, driven by scroll */}
          <InfoCard
            activeStop={activeStop}
            cardRef={cardRef}
            email={email}
            rasanaraUrl={rasanaraUrl}
          />

          {/* Character Style Toggle: bottom-left */}
          <CharacterToggle current={characterStyle} onChange={setCharacterStyle} />
        </div>
      </div>
    </div>
  );
};

export default CvPage;
