import React from 'react';
import { HERO_COPY } from '../../content/playground';

interface HeroProps {
  isReducedMotion: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isReducedMotion }) => {
  const lettersWord1 = HERO_COPY.titleWord1.split('');
  const lettersWord2 = HERO_COPY.titleWord2.split('');

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '780px' }}>
        {/* Eyebrow & Rotating Circular Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#E0316A',
              color: '#FFF1D6',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              border: '2px solid #1A0F24',
              boxShadow: '2.5px 2.5px 0 #1A0F24',
            }}
          >
            {HERO_COPY.eyebrow}
          </span>

          {/* Rotating Circular Badge */}
          <div
            aria-hidden="true"
            style={{
              position: 'relative',
              width: '84px',
              height: '84px',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              className={isReducedMotion ? '' : 'pg-badge-spin'}
              style={{ transformOrigin: 'center center' }}
            >
              <defs>
                <path
                  id="hero-badge-circle"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                />
              </defs>
              <text
                fontSize="8"
                fontFamily='"Space Grotesk", sans-serif'
                fontWeight="700"
                letterSpacing="0.16em"
                fill="#FFC83D"
              >
                <textPath xlinkHref="#hero-badge-circle" href="#hero-badge-circle">
                  {HERO_COPY.badgeText}
                </textPath>
              </text>
            </svg>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#4FD1A1',
                fontSize: '1rem',
              }}
            >
              ★
            </div>
          </div>
        </div>

        {/* Bouncing Letter H1 with Coral Sticker Shadow */}
        <h1
          aria-label="Digital Playground"
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontSize: 'clamp(2.15rem, 7.5vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#FFF1D6',
            textShadow: '3.5px 3.5px 0 #E0316A',
            margin: '0 0 1.5rem 0',
            letterSpacing: '-0.02em',
          }}
        >
          {/* Word 1: Digital */}
          <span style={{ display: 'inline-block', marginRight: '0.4em' }}>
            {lettersWord1.map((char, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="pg-bounce-letter"
                style={{
                  display: 'inline-block',
                  animationDelay: `${i * 45}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </span>

          {/* Word 2: Playground */}
          <span style={{ display: 'inline-block' }}>
            {lettersWord2.map((char, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="pg-bounce-letter"
                style={{
                  display: 'inline-block',
                  animationDelay: `${(lettersWord1.length + i) * 45}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Lead */}
        <p
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 'clamp(1.0625rem, 2.2vw, 1.35rem)',
            lineHeight: 1.6,
            color: '#FFF1D6',
            maxWidth: '620px',
            marginBottom: '2.5rem',
            textShadow: '1px 1px 2px rgba(22, 11, 46, 0.8)',
          }}
        >
          {HERO_COPY.lead}
        </p>

        {/* Chunky CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <a
            href="#discovery"
            className="pg-chunky-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#4FD1A1',
              color: '#1A0F24',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '0.85rem 1.85rem',
              borderRadius: '9999px',
              border: '3px solid #1A0F24',
              boxShadow: '4px 4px 0 #1A0F24',
              textDecoration: 'none',
            }}
          >
            <span>{HERO_COPY.ctaDiscovery}</span>
            <span aria-hidden="true">&darr;</span>
          </a>

          <a
            href="#produk"
            className="pg-chunky-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFF1D6',
              color: '#1A0F24',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '0.85rem 1.85rem',
              borderRadius: '9999px',
              border: '3px solid #1A0F24',
              boxShadow: '4px 4px 0 #1A0F24',
              textDecoration: 'none',
            }}
          >
            <span>{HERO_COPY.ctaProduct}</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};

