import React, { useRef, useEffect, useState } from 'react';
import { PROCESS_CONTENT } from '../../content/rasanara';
import { Reveal } from './Reveal';

export const ProcessTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Start line filling when top enters viewport, finish near center/bottom
      const totalH = rect.height;
      const scrolled = windowH * 0.7 - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalH));
      setScrollProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="cara" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-t border-[#E4DED3] bg-[#FBFAF7]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
            <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B1538]">
              {PROCESS_CONTENT.sectionEyebrow}
            </span>
          </div>
          <h2 className="font-serif italic font-bold text-2xl sm:text-3xl md:text-4xl text-[#15120F] tracking-tight mb-4">
            {PROCESS_CONTENT.sectionTitle}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#6B6458] max-w-2xl leading-relaxed mb-12 sm:mb-16">
            {PROCESS_CONTENT.intro}
          </p>
        </Reveal>

        {/* Timeline container */}
        <div ref={containerRef} className="relative pl-6 sm:pl-8 md:pl-10">
          {/* Vertical Track Line (Background) */}
          <div
            className="absolute left-[7px] sm:left-[9px] md:left-[11px] top-3 bottom-8 w-[2px] bg-[#E4DED3]"
            aria-hidden="true"
          />

          {/* Dynamic Golden Fill Line driven by scroll */}
          <div
            className="absolute left-[7px] sm:left-[9px] md:left-[11px] top-3 w-[2px] bg-[#D4AF37] transition-[height] duration-150 ease-out origin-top"
            style={{
              height: `${scrollProgress * 100}%`,
              maxHeight: 'calc(100% - 2rem)',
            }}
            aria-hidden="true"
          />

          {/* Steps */}
          <div className="space-y-12 sm:space-y-16">
            {PROCESS_CONTENT.steps.map((step, idx) => {
              // Active threshold roughly matching step position
              const stepThreshold = idx / (PROCESS_CONTENT.steps.length - 1);
              const isPassed = scrollProgress >= stepThreshold * 0.85;

              return (
                <div key={step.number} className="relative group">
                  {/* Glowing Burgundy Dot */}
                  <div
                    className={`absolute -left-[24px] sm:-left-[28px] md:-left-[32px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                      isPassed
                        ? 'bg-[#8B1538] border-[#8B1538] shadow-[0_0_10px_rgba(139,21,56,0.35)] scale-110'
                        : 'bg-[#FBFAF7] border-[#D4AF37]'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Two columns on desktop: Title | Detail, one column on mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-start">
                    <div className="md:col-span-4 flex items-baseline gap-2">
                      <span className="font-sans font-bold text-xs text-[#8B1538] tracking-widest uppercase">
                        {step.number}
                      </span>
                      <h3 className="font-serif italic font-bold text-xl sm:text-2xl text-[#15120F]">
                        {step.title}
                      </h3>
                    </div>

                    <div className="md:col-span-8">
                      <p className="font-sans text-xs sm:text-sm md:text-base text-[#6B6458] leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

