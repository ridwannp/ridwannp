import React, { useState, useRef, useEffect } from 'react';
import { PROBLEMS_CONTENT } from '../../content/rasanara';
import { Reveal, Booth, SplitText, Chip } from '../../ui/kit';
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
    <section id="masalah" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFC83D]" aria-hidden="true" />
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FFC83D]">
              {PROBLEMS_CONTENT.sectionEyebrow}
            </span>
          </div>
          <div className="mb-8 sm:mb-12">
            <SplitText
              text={PROBLEMS_CONTENT.sectionTitle}
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl text-[#FFF1D6]"
              shadowColor="#8B1538"
            />
          </div>
        </Reveal>

        {/* Tab Buttons (Horizontal scrollable with chunky Chip style) */}
        <Reveal delayMs={80}>
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Segmen industri tantangan operasional"
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-4 mb-6"
          >
            {segments.map((seg, idx) => {
              const isActive = activeTab === idx;
              return (
                <Chip
                  key={seg.id}
                  active={isActive}
                  aria-pressed={isActive}
                  activeColor="#8B1538"
                  inactiveColor="#FFF1D6"
                  onClick={() => setActiveTab(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={isActive ? '!text-[#FFF1D6]' : ''}
                >
                  {seg.title}
                </Chip>
              );
            })}
          </div>
        </Reveal>

        {/* Booth Panel for Pain List */}
        <Booth accentColor="#8B1538" className="min-h-[280px]">
          <div
            role="tabpanel"
            id={`panel-${currentSegment.id}`}
            aria-labelledby={`tab-${currentSegment.id}`}
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
                    className={`group flex items-start gap-3 sm:gap-4 border-b border-[#1A0F24]/15 pb-4 transition-all duration-300 ${
                      prefersReduced ? '' : 'animate-fadeInLeft'
                    } [@media(hover:hover)]:hover:translate-x-3`}
                  >
                    <span className="font-sans text-xs font-bold text-[#8B1538] mt-1 shrink-0 w-6">
                      0{i + 1}
                    </span>
                    <span className="font-sans font-bold text-base sm:text-lg text-[#1A0F24] group-hover:text-[#8B1538] transition-colors leading-snug">
                      {pain}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Note Below in Booth */}
          <div className="mt-8 pt-6 border-t border-[#1A0F24]/15 flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B1538] mt-1 shrink-0" aria-hidden="true" />
            <p className="font-sans text-xs sm:text-sm text-[#1A0F24]/80 leading-relaxed">
              {PROBLEMS_CONTENT.note}
            </p>
          </div>
        </Booth>
      </div>
    </section>
  );
};


