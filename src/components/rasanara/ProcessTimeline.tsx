import React, { useRef, useEffect, useState } from 'react';
import { PROCESS_CONTENT } from '../../content/rasanara';
import { Reveal, SplitText } from '../../ui/kit';

export const ProcessTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
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
    <section id="cara-kerja" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4FD1A1]" aria-hidden="true" />
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#4FD1A1]">
              {PROCESS_CONTENT.sectionEyebrow}
            </span>
          </div>
          <div className="mb-4">
            <SplitText
              text={PROCESS_CONTENT.sectionTitle}
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl text-[#FFF1D6]"
              shadowColor="#8B1538"
            />
          </div>
          <p className="font-sans text-sm sm:text-base text-[#FFF1D6]/85 max-w-2xl leading-relaxed mb-12 sm:mb-16">
            {PROCESS_CONTENT.intro}
          </p>
        </Reveal>

        {/* Timeline container */}
        <div ref={containerRef} className="relative pl-6 sm:pl-8 md:pl-10">
          {/* Vertical Track Line (Background) */}
          <div
            className="absolute left-[7px] sm:left-[9px] md:left-[11px] top-3 bottom-8 w-[2px] bg-white/15"
            aria-hidden="true"
          />

          {/* Dynamic Golden Glowing Fill Line driven by scroll */}
          <div
            className="absolute left-[7px] sm:left-[9px] md:left-[11px] top-3 w-[2px] bg-[#FFC83D] shadow-[0_0_12px_rgba(255,200,61,0.8)] transition-[height] duration-150 ease-out origin-top"
            style={{
              height: `${scrollProgress * 100}%`,
              maxHeight: 'calc(100% - 2rem)',
            }}
            aria-hidden="true"
          />

          {/* Steps */}
          <div className="space-y-12 sm:space-y-16">
            {PROCESS_CONTENT.steps.map((step, idx) => {
              const stepThreshold = idx / (PROCESS_CONTENT.steps.length - 1);
              const isPassed = scrollProgress >= stepThreshold * 0.85;

              return (
                <div key={step.number} className="relative group">
                  {/* Glowing Mint/Gold Dot */}
                  <div
                    className={`absolute -left-[24px] sm:-left-[28px] md:-left-[32px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      isPassed
                        ? 'bg-[#4FD1A1] border-[#1A0F24] shadow-[0_0_12px_#4FD1A1] scale-110'
                        : 'bg-[#1A0F24] border-[#FFC83D]'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Two columns on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-start">
                    <div className="md:col-span-4 flex items-baseline gap-2">
                      <span className="font-sans font-bold text-xs text-[#FFC83D] tracking-widest uppercase">
                        {step.number}
                      </span>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-[#FFF1D6] group-hover:text-[#FFC83D] transition-colors">
                        {step.title}
                      </h3>
                    </div>

                    <div className="md:col-span-8">
                      <p className="font-sans text-xs sm:text-sm md:text-base text-[#FFF1D6]/80 leading-relaxed">
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

