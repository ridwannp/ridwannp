import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ClosingStatementProps {
  isReducedMotion?: boolean;
  onDarkToneChange?: (isDark: boolean) => void;
}

export const ClosingStatement: React.FC<ClosingStatementProps> = ({
  isReducedMotion = false,
  onDarkToneChange,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const quoteWords = [
    'Pahami',
    'dulu',
    'apa',
    'yang',
    'perlu',
    'diperbaiki,',
    'baru',
    'pikirkan',
    'teknologinya.',
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Dark tone trigger for layout
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => onDarkToneChange?.(true),
        onEnterBack: () => onDarkToneChange?.(true),
        onLeave: () => onDarkToneChange?.(false),
        onLeaveBack: () => onDarkToneChange?.(false),
      });

      // Word by word scrub reveal
      if (!isReducedMotion && wordsRef.current.length > 0) {
        gsap.fromTo(
          wordsRef.current,
          { opacity: 0.25 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'center 40%',
              scrub: 1,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion, onDarkToneChange]);

  return (
    <section
      id="penutup"
      ref={containerRef}
      tabIndex={-1}
      style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'var(--pg-wine, #5a1128)',
        color: '#efe5d2',
        borderRadius: '24px',
        margin: '6rem 0 3rem 0',
        padding: '6rem 2rem',
        outline: 'none',
        boxShadow: '0 16px 40px rgba(90, 17, 40, 0.2)',
      }}
    >
      <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold, #D4AF37)',
            display: 'block',
            marginBottom: '1.25rem',
          }}
        >
          Prinsip Kerja
        </span>

        {/* Word by word scrub reveal */}
        <h2
          aria-label="Pahami dulu apa yang perlu diperbaiki, baru pikirkan teknologinya."
          style={{
            fontFamily: 'var(--font-quote)',
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            lineHeight: 1.2,
            color: '#ffffff',
            margin: '0 0 2rem 0',
            fontWeight: 400,
          }}
        >
          {quoteWords.map((word, wIdx) => (
            <span
              key={wIdx}
              ref={(el) => {
                if (el) wordsRef.current[wIdx] = el;
              }}
              aria-hidden="true"
              style={{
                display: 'inline-block',
                marginRight: '0.3em',
                opacity: isReducedMotion ? 1 : 0.25,
                transition: isReducedMotion ? 'none' : undefined,
              }}
            >
              {word}
            </span>
          ))}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
            lineHeight: 1.65,
            color: '#e2d5bc',
            maxWidth: '620px',
            margin: '0 auto',
          }}
        >
          Itu cara kami bekerja. Kalau Anda ingin membahas hasil Discovery atau kebutuhan lain, lihat{' '}
          <a
            href="/rasanara"
            style={{
              color: '#ffffff',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            Rasanara
          </a>{' '}
          atau kirim pesan (
          <a
            href="mailto:ridwannurdiyanto93@gmail.com?subject=Digital%20Playground"
            style={{
              color: '#ffffff',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            ridwannurdiyanto93@gmail.com
          </a>
          ).
        </p>
      </div>
    </section>
  );
};

