import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { RotatingBadge } from './RotatingBadge';
import { attachMagnetic } from '../motion/magnet';
import { scrollToTarget } from '../motion/lenis';

interface HeroProps {
  isReducedMotion?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isReducedMotion = false }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const btn1Ref = useRef<HTMLAnchorElement | null>(null);
  const btn2Ref = useRef<HTMLAnchorElement | null>(null);

  const titleLines = [
    'Tempat mencoba, menemukan,',
    'dan membawa pulang',
    'alat yang berguna.',
  ];

  const fullTitle = 'Tempat mencoba, menemukan, dan membawa pulang alat yang berguna.';

  useEffect(() => {
    if (!btn1Ref.current || !btn2Ref.current) return;
    const clean1 = attachMagnetic(btn1Ref.current);
    const clean2 = attachMagnetic(btn2Ref.current);

    return () => {
      clean1();
      clean2();
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const lineEls = containerRef.current?.querySelectorAll('.pg-hero-line-inner');
      const paragraph = containerRef.current?.querySelector('.pg-hero-p');
      const buttons = containerRef.current?.querySelector('.pg-hero-buttons');
      const badge = containerRef.current?.querySelector('.pg-hero-badge');

      if (lineEls && lineEls.length > 0) {
        gsap.fromTo(
          lineEls,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }
        );
      }

      if (paragraph && buttons) {
        gsap.fromTo(
          [paragraph, buttons, badge],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.35,
            stagger: 0.1,
            ease: 'power2.out',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    scrollToTarget(hash, { offset: -24, duration: 1.2 });
    window.history.replaceState(null, '', hash);
    const targetEl = document.querySelector(hash) as HTMLElement | null;
    targetEl?.focus();
  };

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '88svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem 0 3rem 0',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            Digital Playground
          </span>
          <div className="pg-hero-badge" style={{ opacity: isReducedMotion ? 1 : undefined }}>
            <RotatingBadge isReducedMotion={isReducedMotion} />
          </div>
        </div>

        {/* H1 Line-masked reveal */}
        <h1
          aria-label={fullTitle}
          style={{
            fontFamily: 'var(--font-quote)',
            fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
            lineHeight: 1.1,
            color: 'var(--ink)',
            margin: '0 0 1.5rem 0',
            fontWeight: 400,
          }}
        >
          {titleLines.map((line, idx) => (
            <span
              key={idx}
              style={{
                display: 'block',
                overflow: 'hidden',
                lineHeight: 1.15,
              }}
            >
              <span
                className="pg-hero-line-inner"
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  transform: isReducedMotion ? 'none' : undefined,
                  opacity: isReducedMotion ? 1 : undefined,
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="pg-hero-p"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'var(--muted)',
            marginBottom: '2.5rem',
            maxWidth: '580px',
            opacity: isReducedMotion ? 1 : undefined,
          }}
        >
          Dua hal ada di sini: penelusuran sederhana untuk pemilik usaha yang ingin memahami proses kerjanya, dan produk digital buatan Rasanara untuk pekerjaan sehari-hari.
        </p>

        {/* Action Buttons */}
        <div
          className="pg-hero-buttons"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            opacity: isReducedMotion ? 1 : undefined,
          }}
        >
          <a
            ref={btn1Ref}
            href="#discovery"
            onClick={(e) => handleScrollClick(e, '#discovery')}
            className="pg-btn-primary"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              padding: '0.875rem 1.75rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(139, 21, 56, 0.2)',
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Mulai telusuri bisnis Anda</span>
            <span style={{ position: 'relative', zIndex: 1 }} aria-hidden="true">&darr;</span>
          </a>

          <a
            ref={btn2Ref}
            href="#produk"
            onClick={(e) => handleScrollClick(e, '#produk')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#efe9dc',
              color: 'var(--ink)',
              padding: '0.875rem 1.75rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
          >
            <span>Lihat produk digital</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};

