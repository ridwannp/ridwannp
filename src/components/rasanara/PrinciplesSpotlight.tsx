import React, { useState, useEffect, useRef } from 'react';
import { PRINCIPLES_CONTENT } from '../../content/rasanara';
import { Reveal } from './Reveal';

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
    <section id="prinsip" className="py-20 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-[#E4DED3] bg-[#FBFAF7]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left: Sticky Title (Desktop only, stacked on mobile) */}
          <div className="md:col-span-5 md:sticky md:top-28">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
                <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B1538]">
                  {PRINCIPLES_CONTENT.sectionEyebrow}
                </span>
              </div>
              <h2 className="font-serif italic font-bold text-3xl sm:text-4xl md:text-5xl text-[#15120F] tracking-tight leading-[1.1]">
                {PRINCIPLES_CONTENT.sectionTitle}
              </h2>
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
                  className="transition-opacity duration-500 ease-out"
                  style={{
                    opacity: isLit ? 1 : 0.28,
                  }}
                >
                  <span className="block font-sans text-xs font-bold text-[#8B1538] tracking-widest uppercase mb-2">
                    0{idx + 1}
                  </span>
                  <h3
                    className={`font-serif italic font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug transition-colors duration-300 ${
                      isLit ? 'text-[#8B1538]' : 'text-[#15120F]'
                    }`}
                  >
                    "{item.title}"
                  </h3>
                  <p className="mt-4 font-sans text-xs sm:text-sm md:text-base text-[#6B6458] leading-relaxed max-w-lg">
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

