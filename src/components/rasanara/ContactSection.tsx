import React from 'react';
import { CLOSING_CONTENT, EMAIL, SHOW_FREE_OFFER } from '../../content/rasanara';
import { Reveal } from './Reveal';

export const ContactSection: React.FC = () => {
  // Read WhatsApp number from Vite environment variable
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';

  const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(CLOSING_CONTENT.emailSubject)}`;

  // Clean WhatsApp number (digits only for link)
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(CLOSING_CONTENT.whatsappMessage)}`
    : '';

  return (
    <section id="mulai" className="py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-[#15120F] text-[#FBFAF7] relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Optional Free Offer banner only if SHOW_FREE_OFFER is true */}
        {SHOW_FREE_OFFER && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-sans font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
            <span>{CLOSING_CONTENT.freeOfferText}</span>
          </div>
        )}

        {/* Heading */}
        <Reveal>
          <h2 className="font-serif italic font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6 sm:mb-8 text-balance">
            "{CLOSING_CONTENT.heading}"
          </h2>
        </Reveal>

        {/* Intro */}
        <Reveal delayIndex={1}>
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#C9BDA5] max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-12 text-pretty">
            {CLOSING_CONTENT.intro}
          </p>
        </Reveal>

        {/* Actions (Email, and WhatsApp if configured) */}
        <Reveal delayIndex={2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href={mailtoUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[50px] px-8 py-3.5 rounded-full bg-[#8B1538] hover:bg-[#a61c45] active:scale-[0.98] text-white font-sans text-sm sm:text-base font-semibold shadow-lg shadow-[#8B1538]/30 transition-all focus-visible:outline-2 focus-visible:outline-[#D4AF37] focus-visible:outline-offset-2"
            >
              {CLOSING_CONTENT.ctaEmail}
            </a>

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[50px] px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-[#C9BDA5]/30 active:scale-[0.98] text-[#FBFAF7] font-sans text-sm sm:text-base font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#D4AF37] focus-visible:outline-offset-2"
              >
                {CLOSING_CONTENT.ctaWhatsApp}
              </a>
            )}
          </div>
        </Reveal>

        {/* Direct email info */}
        <Reveal delayIndex={3}>
          <div className="mb-14">
            <span className="text-xs font-sans text-[#6B6458] block mb-1">Kontak langsung</span>
            <a
              href={mailtoUrl}
              className="text-xs sm:text-sm font-sans font-medium text-[#C9BDA5] hover:text-white underline underline-offset-4 transition-colors"
            >
              {EMAIL}
            </a>
          </div>
        </Reveal>

        {/* Decorative gold divider */}
        <div className="w-16 h-[1px] bg-[#D4AF37]/50 mx-auto my-8" aria-hidden="true" />

        {/* Closing Italic Sentence */}
        <Reveal delayIndex={4}>
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#C9BDA5] max-w-2xl mx-auto leading-relaxed">
            "{CLOSING_CONTENT.closingItalic}"
          </p>
        </Reveal>
      </div>
    </section>
  );
};

