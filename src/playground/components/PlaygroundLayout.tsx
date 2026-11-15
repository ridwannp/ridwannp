import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlaygroundCanvas } from '../scene/PlaygroundCanvas';
import { GoldPath } from './GoldPath';
import { ReduceMotionToggle } from './ReduceMotionToggle';
import { useReducedMotion } from '../motion/useReducedMotion';
import { initLenis, destroyLenis, scrollToTarget } from '../motion/lenis';
import { bindScrollSync, refreshScrollTrigger } from '../motion/scrollSync';

interface PlaygroundLayoutProps {
  children: React.ReactNode;
  activeCardIndex?: number;
}

export const PlaygroundLayout: React.FC<PlaygroundLayoutProps> = ({
  children,
  activeCardIndex = 0,
}) => {
  const [reducedMotion, setReducedMotion] = useReducedMotion();
  const [activeSection, setActiveSection] = useState<'hero' | 'discovery' | 'produk' | 'penutup'>('hero');
  const [isDarkTone, setIsDarkTone] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lenis & ScrollTrigger single-loop sync
  useEffect(() => {
    const lenis = initLenis(reducedMotion);
    const unbind = bindScrollSync(lenis);

    // Track total page scroll progress for 3D camera & gold path
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Font ready refresh
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        refreshScrollTrigger();
      });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      unbind();
      destroyLenis();
    };
  }, [reducedMotion]);

  // Section observer for pills
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#discovery',
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveSection('discovery'),
        onEnterBack: () => setActiveSection('discovery'),
        onLeaveBack: () => setActiveSection('hero'),
      });

      ScrollTrigger.create({
        trigger: '#produk',
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveSection('produk'),
        onEnterBack: () => setActiveSection('produk'),
        onLeaveBack: () => setActiveSection('discovery'),
      });

      ScrollTrigger.create({
        trigger: '#penutup',
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          setActiveSection('penutup');
          setIsDarkTone(true);
        },
        onEnterBack: () => {
          setActiveSection('penutup');
          setIsDarkTone(true);
        },
        onLeaveBack: () => {
          setActiveSection('produk');
          setIsDarkTone(false);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleNavAnchor = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    scrollToTarget(hash, { offset: -16, duration: 1.2 });
    window.history.replaceState(null, '', hash);
    const el = document.querySelector(hash) as HTMLElement | null;
    el?.focus();
  };

  return (
    <div
      ref={containerRef}
      data-tone={isDarkTone ? 'dark' : 'light'}
      style={{
        position: 'relative',
        minHeight: '100svh',
        backgroundColor: 'var(--bg, #fbfaf7)',
        color: 'var(--ink, #15130f)',
        overflowX: 'hidden',
      }}
    >
      {/* 3D WebGL Canvas or Poster Fallback */}
      <PlaygroundCanvas
        scrollProgress={scrollProgress}
        activeCardIndex={activeCardIndex}
        isReducedMotion={reducedMotion}
      />

      {/* Decorative Gold Path */}
      <GoldPath scrollProgress={scrollProgress} />

      {/* Sticky Top Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: isDarkTone ? 'rgba(90, 17, 40, 0.9)' : 'rgba(251, 250, 247, 0.92)',
          borderBottom: isDarkTone ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--line)',
          padding: '0.875rem 1.25rem',
          transition: 'background-color 300ms ease, border-color 300ms ease',
        }}
      >
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* ← Teras */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isDarkTone ? '#efe5d2' : 'var(--muted)',
              textDecoration: 'none',
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: isDarkTone ? 'rgba(255, 255, 255, 0.12)' : '#efe9dc',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span aria-hidden="true">&larr;</span> Teras
          </Link>

          {/* Subnav Pills */}
          <nav
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: isDarkTone ? 'rgba(0, 0, 0, 0.25)' : '#eae4d5',
              padding: '0.25rem',
              borderRadius: '9999px',
              gap: '0.25rem',
            }}
            aria-label="Bagian Playground"
          >
            <a
              href="#discovery"
              onClick={(e) => handleNavAnchor(e, '#discovery')}
              aria-current={activeSection === 'discovery' ? 'page' : undefined}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                color:
                  activeSection === 'discovery'
                    ? isDarkTone
                      ? '#ffffff'
                      : 'var(--ink)'
                    : isDarkTone
                    ? '#c9bfab'
                    : 'var(--muted)',
                backgroundColor:
                  activeSection === 'discovery'
                    ? isDarkTone
                      ? 'var(--accent)'
                      : '#ffffff'
                    : 'transparent',
                boxShadow: activeSection === 'discovery' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              Discovery
            </a>

            <a
              href="#produk"
              onClick={(e) => handleNavAnchor(e, '#produk')}
              aria-current={activeSection === 'produk' ? 'page' : undefined}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                color:
                  activeSection === 'produk'
                    ? isDarkTone
                      ? '#ffffff'
                      : 'var(--ink)'
                    : isDarkTone
                    ? '#c9bfab'
                    : 'var(--muted)',
                backgroundColor:
                  activeSection === 'produk'
                    ? isDarkTone
                      ? 'var(--accent)'
                      : '#ffffff'
                    : 'transparent',
                boxShadow: activeSection === 'produk' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              Produk Digital
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '0 1.25rem',
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: isDarkTone ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--line)',
          backgroundColor: isDarkTone ? 'var(--pg-wine, #5a1128)' : 'var(--bg, #fbfaf7)',
          padding: '3rem 1.25rem',
          transition: 'background-color 300ms ease',
        }}
      >
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: isDarkTone ? '#efe5d2' : 'var(--muted)',
            }}
          >
            &copy; Rasanara
          </span>

          <ReduceMotionToggle reducedMotion={reducedMotion} onToggle={setReducedMotion} />
        </div>
      </footer>
    </div>
  );
};
