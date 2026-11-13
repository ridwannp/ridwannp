import React, { memo, useState, useEffect } from 'react';

interface HeroHeadlineProps {
  prefersReducedMotion?: boolean;
}

export const HeroHeadline: React.FC<HeroHeadlineProps> = memo(({ prefersReducedMotion = false }) => {
  const words = [
    'Think',
    'like',
    'a',
    'product',
    'owner.',
    'Build',
    'like',
    'an',
    'engineer',
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger transition after mount
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute top-20 md:top-24 left-6 md:left-12 max-w-xl z-20 pointer-events-none select-none">
      <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] text-[#141218] tracking-tight">
        {words.map((word, index) => {
          // Stagger 0.1s per word
          const delay = prefersReducedMotion ? '0s' : `${index * 0.1}s`;
          const isRevealed = prefersReducedMotion || mounted;

          return (
            <span
              key={index}
              className="inline-block mr-[0.28em] overflow-visible"
            >
              <span
                className="inline-block transition-all duration-700 ease-out transform"
                style={{
                  transitionDelay: delay,
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed
                    ? 'translateY(0) rotate(0deg)'
                    : 'translateY(24px) rotate(3deg)',
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </h1>
      <p className="mt-3 font-sans text-xs md:text-sm text-[#8F879A] font-medium tracking-wide">
        Teras perjumpaan · Pilih lentera untuk membuka ruang
      </p>
    </div>
  );
});

HeroHeadline.displayName = 'HeroHeadline';

