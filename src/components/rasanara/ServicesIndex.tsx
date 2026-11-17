import React from 'react';
import { SERVICES_CONTENT } from '../../content/rasanara';
import { Reveal, SplitText } from '../../ui/kit';

export const ServicesIndex: React.FC = () => {
  return (
    <section id="layanan" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFC83D]" aria-hidden="true" />
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FFC83D]">
              {SERVICES_CONTENT.sectionEyebrow}
            </span>
          </div>
          <div className="mb-4">
            <SplitText
              text={SERVICES_CONTENT.sectionTitle}
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl text-[#FFF1D6]"
              shadowColor="#8B1538"
            />
          </div>
          <p className="font-sans text-sm sm:text-base text-[#FFF1D6]/85 max-w-2xl leading-relaxed mb-12 sm:mb-16">
            {SERVICES_CONTENT.subtitle}
          </p>
        </Reveal>

        {/* Numbered Index List */}
        <div className="divide-y divide-white/15">
          {SERVICES_CONTENT.services.map((service, index) => (
            <Reveal key={service.number} delayMs={(index % 3) * 60}>
              <div
                className="group py-6 sm:py-8 px-3 sm:px-5 rounded-2xl transition-all duration-300 [@media(hover:hover)]:hover:translate-x-3 [@media(hover:hover)]:hover:bg-gradient-to-r [@media(hover:hover)]:hover:from-[#FFC83D]/15 [@media(hover:hover)]:hover:to-transparent"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start">
                  {/* Number */}
                  <div className="md:col-span-1">
                    <span className="font-sans font-bold text-xs sm:text-sm text-[#FFC83D] tracking-widest">
                      {service.number}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="md:col-span-5">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#FFF1D6] group-hover:text-[#FFC83D] transition-colors leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-6">
                    <p className="font-sans text-xs sm:text-sm md:text-base text-[#FFF1D6]/80 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};


