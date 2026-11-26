import React, { useRef } from 'react';
import { HERO_COPY } from '../../content/rasanara';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { HeroScene } from './HeroScene';
import { SplitText, SpinBadge, Button } from '../../ui/kit';

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
        className="sticky top-0 w-full overflow-hidden flex flex-col justify-between gap-3"
        style={{
          height: '100svh',
          minHeight: '100dvh',
          paddingTop: 'max(4.25rem, calc(env(safe-area-inset-top) + 3.25rem))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Fixed 3D Canvas / Fallback behind content */}
        <HeroScene progress={progress} isPastHero={isPastHero} />

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex-1 flex flex-col justify-center pointer-events-none min-h-0">
          <div className="max-w-3xl pointer-events-auto">
            {/* Eyebrow & SpinBadge */}
            <div className="flex items-center gap-4 mb-3 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#8B1538] text-[#FFF1D6] border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24] text-[11px] sm:text-xs font-sans font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#FFC83D]" aria-hidden="true" />
                {HERO_COPY.eyebrow}
              </span>

              <div className="hidden sm:block">
                <SpinBadge
                  text="RASA → NARASI · RASANARA"
                  size={70}
                  textColor="#FFC83D"
                  centerColor="#4FD1A1"
                />
              </div>
            </div>

            {/* H1 Headline with SplitText and sticker shadow */}
            <div className="mb-3 sm:mb-6">
              <SplitText
                text={HERO_COPY.title}
                as="h1"
                className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.1]"
                shadowColor="#8B1538"
              />
            </div>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-base md:text-lg text-[#FFF1D6]/90 leading-relaxed max-w-2xl mb-4 sm:mb-8 text-pretty drop-shadow-sm">
              {HERO_COPY.subtitle}
            </p>

            {/* Chunky CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
              <Button
                as="a"
                href={HERO_COPY.primaryCtaHref}
                variant="burgundy"
                size="md"
                className="shadow-[4px_4px_0_#1A0F24] sm:px-7 sm:py-3.5 sm:text-base"
              >
                {HERO_COPY.primaryCta}
              </Button>
              <Button
                as="a"
                href={HERO_COPY.secondaryCtaHref}
                variant="cream"
                size="md"
                className="shadow-[4px_4px_0_#1A0F24] sm:px-7 sm:py-3.5 sm:text-base"
              >
                {HERO_COPY.secondaryCta}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Captions: Rasa -> Narasi */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between pointer-events-none select-none text-xs sm:text-sm font-sans font-bold tracking-wide">
          <div
            className="transition-opacity duration-300 flex items-center gap-2 bg-[#1A0F24]/80 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
            style={{ opacity: rasaOpacity }}
          >
            <span className="w-2 h-2 rounded-full bg-[#E0316A]" aria-hidden="true" />
            <span className="text-[#FFF1D6]">{HERO_COPY.captions.rasa}</span>
          </div>

          <div
            className="transition-opacity duration-300 flex items-center gap-2 text-right bg-[#1A0F24]/80 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
            style={{ opacity: narasiOpacity }}
          >
            <span className="text-[#FFC83D] font-bold">{HERO_COPY.captions.narasi}</span>
            <span className="w-2 h-2 rounded-full bg-[#4FD1A1]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};


