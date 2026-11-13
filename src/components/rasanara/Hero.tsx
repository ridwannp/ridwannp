import React, { useRef } from 'react';
import { HERO_COPY } from '../../content/rasanara';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { HeroScene } from './HeroScene';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { progress, isPastHero } = useScrollProgress(heroRef);

  // Caption opacities based on progress
  // "Rasa" fades as p rises
  const rasaOpacity = Math.max(0, Math.min(1, 1 - progress * 2.2));
  // "Narasi" strengthens when p > 0.45
  const narasiOpacity = progress > 0.45 ? Math.max(0, Math.min(1, (progress - 0.45) / 0.4)) : 0;

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full"
      style={{
        height: '200svh',
        minHeight: '200vh',
      }}
    >
      {/* Sticky 100svh viewport window */}
      <div
        className="sticky top-0 w-full overflow-hidden flex flex-col justify-between"
        style={{
          height: '100svh',
          minHeight: '100vh',
          paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Fixed 3D Canvas / Fallback behind content */}
        <HeroScene progress={progress} isPastHero={isPastHero} />

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex-1 flex flex-col justify-start md:justify-center pointer-events-none">
          <div className="max-w-3xl pointer-events-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B1538]/10 border border-[#8B1538]/20 mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
              <span className="text-xs font-sans font-medium tracking-wide text-[#8B1538] uppercase">
                {HERO_COPY.eyebrow}
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-serif italic text-[#15120F] text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-tight text-balance mb-4 sm:mb-6">
              {HERO_COPY.title}
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#6B6458] leading-relaxed max-w-2xl mb-6 sm:mb-8 text-pretty">
              {HERO_COPY.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={HERO_COPY.primaryCtaHref}
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full bg-[#8B1538] hover:bg-[#6e102c] active:scale-[0.98] text-white text-xs sm:text-sm font-sans font-medium shadow-md shadow-[#8B1538]/15 transition-all text-center focus-visible:outline-2 focus-visible:outline-[#8B1538] focus-visible:outline-offset-2"
              >
                {HERO_COPY.primaryCta}
              </a>
              <a
                href={HERO_COPY.secondaryCtaHref}
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full bg-white/80 hover:bg-white border border-[#E4DED3] hover:border-[#15120F]/30 active:scale-[0.98] text-[#15120F] text-xs sm:text-sm font-sans font-medium transition-all text-center focus-visible:outline-2 focus-visible:outline-[#15120F] focus-visible:outline-offset-2"
              >
                {HERO_COPY.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Captions: Rasa -> Narasi */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between pointer-events-none select-none text-xs sm:text-sm font-sans font-medium tracking-wide">
          <div
            className="transition-opacity duration-300 flex items-center gap-2"
            style={{ opacity: rasaOpacity }}
          >
            <span className="w-2 h-2 rounded-full bg-[#8B1538]" aria-hidden="true" />
            <span className="text-[#6B6458]">{HERO_COPY.captions.rasa}</span>
          </div>

          <div
            className="transition-opacity duration-300 flex items-center gap-2 text-right"
            style={{ opacity: narasiOpacity }}
          >
            <span className="text-[#8B1538] font-semibold">{HERO_COPY.captions.narasi}</span>
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

