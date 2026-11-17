import React, { useRef, useState, useEffect } from 'react';
import { RASA_NARASI_CONTENT } from '../../content/rasanara';
import { Reveal } from '../../ui/kit';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const RasaNarasi: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setIsIntersecting(true);
      return;
    }

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section id="rasa-dan-narasi" className="py-20 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFC83D]" aria-hidden="true" />
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FFC83D]">
              {RASA_NARASI_CONTENT.eyebrow}
            </span>
          </div>
        </Reveal>

        {/* Two Giant Words with expanding Glowing Gold Line */}
        <div className="my-8 sm:my-14">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between gap-6">
            <span className="font-serif italic font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#E0316A] shrink-0 drop-shadow-[0_2px_12px_rgba(224,49,106,0.35)]">
              {RASA_NARASI_CONTENT.titleWord1}
            </span>

            {/* Expanding glowing gold line */}
            <div className="flex-1 h-[3px] bg-white/15 relative overflow-hidden rounded-full">
              <div
                className="absolute inset-0 bg-[#FFC83D] shadow-[0_0_14px_rgba(255,200,61,0.9)] transition-transform duration-1000 ease-out origin-left rounded-full"
                style={{
                  transform: isIntersecting || prefersReduced ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </div>

            <span
              className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FFF1D6] shrink-0"
              style={{ textShadow: '4px 4px 0 #8B1538' }}
            >
              {RASA_NARASI_CONTENT.titleWord2}
            </span>
          </div>

          {/* Mobile Layout */}
          <div className="flex sm:hidden flex-col items-start gap-3">
            <span className="font-serif italic font-bold text-6xl text-[#E0316A]">
              {RASA_NARASI_CONTENT.titleWord1}
            </span>
            <div className="w-32 h-[3px] bg-white/15 relative overflow-hidden my-1 rounded-full">
              <div
                className="absolute inset-0 bg-[#FFC83D] shadow-[0_0_12px_#FFC83D] transition-transform duration-1000 ease-out origin-left rounded-full"
                style={{
                  transform: isIntersecting || prefersReduced ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </div>
            <span
              className="font-display font-extrabold text-5xl text-[#FFF1D6]"
              style={{ textShadow: '3px 3px 0 #8B1538' }}
            >
              {RASA_NARASI_CONTENT.titleWord2}
            </span>
          </div>
        </div>

        {/* Definitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 my-8 sm:my-12">
          <Reveal delayMs={60}>
            <div className="p-6 rounded-2xl bg-[#FFF1D6] border-2 border-[#1A0F24] shadow-[4px_4px_0_#1A0F24]">
              <span className="font-serif italic text-2xl font-bold text-[#8B1538] block mb-2">
                Rasa
              </span>
              <p className="font-sans text-xs sm:text-sm text-[#1A0F24]/85 leading-relaxed">
                {RASA_NARASI_CONTENT.rasaDefinition}
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="p-6 rounded-2xl bg-[#FFF1D6] border-2 border-[#1A0F24] shadow-[4px_4px_0_#1A0F24]">
              <span className="font-display text-xl font-bold text-[#1A0F24] block mb-2">
                Narasi
              </span>
              <p className="font-sans text-xs sm:text-sm text-[#1A0F24]/85 leading-relaxed">
                {RASA_NARASI_CONTENT.narasiDefinition}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Story Paragraph */}
        <Reveal delayMs={180} className="my-4 sm:my-8">
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#FFF1D6]/90 leading-relaxed max-w-6xl">
            {RASA_NARASI_CONTENT.paragraph}
          </p>
        </Reveal>
      </div>
    </section>
  );
};


