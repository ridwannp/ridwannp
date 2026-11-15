import React, { useRef, useState, useEffect } from 'react';
import { RASA_NARASI_CONTENT } from '../../content/rasanara';
import { Reveal } from './Reveal';
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
    <section className="py-20 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-[#E4DED3] bg-[#FBFAF7] overflow-hidden">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
            <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B1538]">
              {RASA_NARASI_CONTENT.eyebrow}
            </span>
          </div>
        </Reveal>

        {/* Two Giant Words with expanding Gold Line */}
        <div className="my-8 sm:my-14">
          {/* Desktop Layout: Horizontal with long expanding line between */}
          <div className="hidden sm:flex items-center justify-between gap-6">
            <span className="font-serif italic font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#8B1538] shrink-0">
              {RASA_NARASI_CONTENT.titleWord1}
            </span>

            {/* Expanding gold line */}
            <div className="flex-1 h-[2px] bg-[#E4DED3] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-[#D4AF37] transition-transform duration-1000 ease-out origin-left"
                style={{
                  transform: isIntersecting || prefersReduced ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </div>

            <span className="font-serif italic font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#15120F] shrink-0">
              {RASA_NARASI_CONTENT.titleWord2}
            </span>
          </div>

          {/* Mobile Layout: Stacked vertically with short horizontal gold line between */}
          <div className="flex sm:hidden flex-col items-start gap-3">
            <span className="font-serif italic font-bold text-5xl text-[#8B1538]">
              {RASA_NARASI_CONTENT.titleWord1}
            </span>
            <div className="w-24 h-[2px] bg-[#E4DED3] relative overflow-hidden my-1">
              <div
                className="absolute inset-0 bg-[#D4AF37] transition-transform duration-1000 ease-out origin-left"
                style={{
                  transform: isIntersecting || prefersReduced ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </div>
            <span className="font-serif italic font-bold text-5xl text-[#15120F]">
              {RASA_NARASI_CONTENT.titleWord2}
            </span>
          </div>
        </div>

        {/* Definitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 my-8 sm:my-12">
          <Reveal delayIndex={1}>
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4DED3] shadow-sm">
              <span className="font-serif italic text-lg sm:text-xl font-bold text-[#8B1538] block mb-2">
                Rasa
              </span>
              <p className="font-sans text-xs sm:text-sm text-[#6B6458] leading-relaxed">
                {RASA_NARASI_CONTENT.rasaDefinition}
              </p>
            </div>
          </Reveal>

          <Reveal delayIndex={2}>
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E4DED3] shadow-sm">
              <span className="font-serif italic text-lg sm:text-xl font-bold text-[#15120F] block mb-2">
                Narasi
              </span>
              <p className="font-sans text-xs sm:text-sm text-[#6B6458] leading-relaxed">
                {RASA_NARASI_CONTENT.narasiDefinition}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Story Paragraph */}
        <Reveal delayIndex={3} className="my-4 sm:my-8">
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#15120F] leading-relaxed max-w-6xl">
            {RASA_NARASI_CONTENT.paragraph}
          </p>
        </Reveal>
      </div>
    </section>
  );
};

