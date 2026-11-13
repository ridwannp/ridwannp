import React from 'react';
import { SERVICES_CONTENT } from '../../content/rasanara';
import { Reveal } from './Reveal';

export const ServicesIndex: React.FC = () => {
  return (
    <section id="layanan" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-t border-[#E4DED3] bg-[#FBFAF7]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
            <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B1538]">
              {SERVICES_CONTENT.sectionEyebrow}
            </span>
          </div>
          <h2 className="font-serif italic font-bold text-2xl sm:text-3xl md:text-4xl text-[#15120F] tracking-tight mb-4">
            {SERVICES_CONTENT.sectionTitle}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#6B6458] max-w-2xl leading-relaxed mb-12 sm:mb-16">
            {SERVICES_CONTENT.subtitle}
          </p>
        </Reveal>

        {/* Numbered Index List */}
        <div className="divide-y divide-[#E4DED3]">
          {SERVICES_CONTENT.services.map((service, index) => (
            <Reveal key={service.number} delayIndex={index % 3}>
              <div
                className="group py-6 sm:py-8 px-3 sm:px-5 rounded-2xl transition-all duration-300 [@media(hover:hover)]:hover:translate-x-3 [@media(hover:hover)]:hover:bg-gradient-to-r [@media(hover:hover)]:hover:from-[#8B1538]/[0.05] [@media(hover:hover)]:hover:to-transparent"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start">
                  {/* Number */}
                  <div className="md:col-span-1">
                    <span className="font-sans font-bold text-xs sm:text-sm text-[#8B1538] tracking-widest">
                      {service.number}
                    </span>
                  </div>

                  {/* Title (Large Serif) */}
                  <div className="md:col-span-5">
                    <h3 className="font-serif italic font-bold text-xl sm:text-2xl text-[#15120F] group-hover:text-[#8B1538] transition-colors leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {/* One benefit sentence (No numbers) */}
                  <div className="md:col-span-6">
                    <p className="font-sans text-xs sm:text-sm md:text-base text-[#6B6458] leading-relaxed">
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

