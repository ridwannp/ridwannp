import React, { useState, useRef, useEffect } from 'react';
import { PROBLEMS_CONTENT } from '../../content/rasanara';
import { Reveal } from './Reveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const ProblemsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [animKey, setAnimKey] = useState(0);

  const segments = PROBLEMS_CONTENT.segments;
  const currentSegment = segments[activeTab];

  // Trigger stagger re-animation on tab change
  useEffect(() => {
    setAnimKey((prev) => prev + 1);
  }, [activeTab]);

  // Keyboard navigation for ARIA tablist
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % segments.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + segments.length) % segments.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = segments.length - 1;
    }

    if (targetIndex >= 0) {
      setActiveTab(targetIndex);
      const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      if (buttons && buttons[targetIndex]) {
        buttons[targetIndex].focus();
      }
    }
  };

  return (
    <section id="masalah" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-t border-[#E4DED3] bg-[#FBFAF7]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
            <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B1538]">
              {PROBLEMS_CONTENT.sectionEyebrow}
            </span>
          </div>
          <h2 className="font-serif italic font-bold text-2xl sm:text-3xl md:text-4xl text-[#15120F] tracking-tight mb-8 sm:mb-12">
            {PROBLEMS_CONTENT.sectionTitle}
          </h2>
        </Reveal>

        {/* Tab Buttons (Horizontal scrollable with scroll-snap) */}
        <Reveal delayIndex={1}>
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Segmen industri tantangan operasional"
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-4 mb-8 sm:mb-12 snap-x"
          >
            {segments.map((seg, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={seg.id}
                  role="tab"
                  id={`tab-${seg.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${seg.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium whitespace-nowrap snap-start transition-all duration-200 select-none border focus-visible:outline-2 focus-visible:outline-[#8B1538] focus-visible:outline-offset-2 ${
                    isActive
                      ? 'bg-[#8B1538] text-white border-[#8B1538] shadow-sm'
                      : 'bg-white/80 text-[#6B6458] border-[#E4DED3] hover:border-[#8B1538]/40 hover:text-[#15120F]'
                  }`}
                >
                  {seg.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Pain List Panel */}
        <div
          role="tabpanel"
          id={`panel-${currentSegment.id}`}
          aria-labelledby={`tab-${currentSegment.id}`}
          className="min-h-[280px]"
        >
          <ul className="space-y-4 sm:space-y-5" key={animKey}>
            {currentSegment.pains.map((pain, i) => {
              const delaySec = prefersReduced ? 0 : i * 0.07;
              return (
                <li
                  key={`${currentSegment.id}-${i}`}
                  style={{
                    animationDelay: `${delaySec}s`,
                  }}
                  className={`group flex items-start gap-3 sm:gap-4 border-b border-[#E4DED3]/70 pb-4 transition-all duration-300 ${
                    prefersReduced ? '' : 'animate-fadeInLeft'
                  } [@media(hover:hover)]:hover:translate-x-3 [@media(hover:hover)]:hover:text-[#8B1538]`}
                >
                  <span className="font-sans text-xs font-semibold text-[#6B6458] group-hover:text-[#8B1538] mt-1 shrink-0 w-6">
                    0{i + 1}
                  </span>
                  <span className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#15120F] group-hover:text-[#8B1538] transition-colors leading-snug">
                    {pain}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Note Below */}
        <Reveal delayIndex={2} className="mt-12 sm:mt-16">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FBFAF7] border border-[#E4DED3] flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" aria-hidden="true" />
            <p className="font-sans text-xs sm:text-sm text-[#6B6458] leading-relaxed">
              {PROBLEMS_CONTENT.note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

