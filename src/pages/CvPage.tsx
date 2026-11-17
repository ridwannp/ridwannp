import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useJourneyScroll } from '../hooks/useJourneyScroll';
import { JOURNEY_INTRO, STOPS } from '../data/journey';
import { DownloadCvButton } from '../components/DownloadCvButton';
import { YearPills } from '../components/YearPills';
import { InfoCard } from '../components/InfoCard';
import { DuskBackground, SpinBadge, DecorLayer, SplitText } from '../ui/kit';
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

  const { activeStop, webGlFailed, scrollToStop } =
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
      {/* <DuskBackground variant="calm" /> */}
      <DecorLayer />

      {/* Fixed download button */}
      <DownloadCvButton cvUrl={cvUrl} />

      {/* Back link */}
      <Link to="/" className={styles.backLink} aria-label="Kembali ke halaman utama teras">
        ← Teras
      </Link>

      {/* Intro section */}
      <section className={styles.intro} aria-labelledby="journey-h1">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-3xl">
            <p className={styles.eyebrow}>{JOURNEY_INTRO.eyebrow}</p>
            <h1 id="journey-h1" className={styles.h1}>
              <SplitText text={JOURNEY_INTRO.h1} />
            </h1>
            <p className={styles.lede}>
              {JOURNEY_INTRO.lede} {JOURNEY_INTRO.description}
            </p>
            <div className={styles.chips} aria-label="Latar belakang singkat">
              {JOURNEY_INTRO.chips.map((chip) => (
                <span key={chip} className={styles.chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden md:flex justify-end pt-4 pr-4 shrink-0">
            <SpinBadge text="9+ TAHUN · 4 TAHAP KARIER · 1 MISI" size={130} />
          </div>
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
            cvUrl={cvUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default CvPage;
