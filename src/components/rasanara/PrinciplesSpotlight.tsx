import React, { useState, useEffect, useRef } from 'react';
import { PRINCIPLES_CONTENT } from '../../content/rasanara';
import { Reveal, SplitText } from '../../ui/kit';

export const PrinciplesSpotlight: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    // Observe each statement with rootMargin focused near viewport center
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0.1,
      }
    );

    itemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="prinsip" className="py-20 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left: Sticky Title (Desktop only, stacked on mobile) */}
          <div className="md:col-span-5 md:sticky md:top-28">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FFC83D]" aria-hidden="true" />
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FFC83D]">
                  {PRINCIPLES_CONTENT.sectionEyebrow}
                </span>
              </div>
              <div className="mb-4">
                <SplitText
                  text={PRINCIPLES_CONTENT.sectionTitle}
                  as="h2"
                  className="text-3xl sm:text-4xl md:text-5xl text-[#FFF1D6] leading-[1.1]"
                  shadowColor="#8B1538"
                />
              </div>
            </Reveal>
          </div>

          {/* Right: 4 Large Statements */}
          <div className="md:col-span-7 space-y-16 sm:space-y-24 py-4 md:py-12">
            {PRINCIPLES_CONTENT.principles.map((item, idx) => {
              const isLit = activeIndex === idx;

              return (
                <div
                  key={item.title}
                  ref={(el) => (itemsRef.current[idx] = el)}
                  data-index={idx}
                  className="transition-all duration-500 ease-out"
                  style={{
                    opacity: isLit ? 1 : 0.3,
                    transform: isLit ? 'translateX(0)' : 'translateX(-4px)',
                  }}
                >
                  <span className="block font-sans text-xs font-bold text-[#FFC83D] tracking-widest uppercase mb-2">
                    0{idx + 1}
                  </span>
                  <h3
                    className={`font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug transition-colors duration-300 ${
                      isLit ? 'text-[#FFC83D]' : 'text-[#FFF1D6]/80'
                    }`}
                  >
                    &ldquo;{item.title}&rdquo;
                  </h3>
                  <p className="mt-4 font-sans text-xs sm:text-sm md:text-base text-[#FFF1D6]/85 leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};


