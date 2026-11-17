import React from 'react';
import { CLOSING_CONTENT, EMAIL, SHOW_FREE_OFFER } from '../../content/rasanara';
import { Reveal, Booth, Button, SpinBadge, SplitText } from '../../ui/kit';

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
    <section id="mulai" className="py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <Booth accentColor="#8B1538" className="text-center relative">
          {/* SpinBadge in corner of Booth */}
          <div className="flex justify-center mb-6">
            <SpinBadge
              text="RASA → NARASI · RASANARA"
              size={84}
              textColor="#8B1538"
              centerColor="#FFC83D"
            />
          </div>

          {/* Optional Free Offer banner only if SHOW_FREE_OFFER is true */}
          {SHOW_FREE_OFFER && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B1538]/10 border border-[#8B1538]/20 text-[#8B1538] text-xs font-sans font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC83D]" aria-hidden="true" />
              <span>{CLOSING_CONTENT.freeOfferText}</span>
            </div>
          )}

          {/* Heading with SplitText */}
          <Reveal>
            <div className="mb-6 sm:mb-8">
              <SplitText
                text={CLOSING_CONTENT.heading}
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl text-[#1A0F24]"
                shadowColor="#E0316A"
              />
            </div>
          </Reveal>

          {/* Intro */}
          <Reveal delayMs={80}>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#1A0F24]/80 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-12 text-pretty">
              {CLOSING_CONTENT.intro}
            </p>
          </Reveal>

          {/* Actions (Email, and WhatsApp if configured) */}
          <Reveal delayMs={140}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                as="a"
                href={mailtoUrl}
                variant="burgundy"
                size="lg"
                className="w-full sm:w-auto"
              >
                {CLOSING_CONTENT.ctaEmail}
              </Button>

              {waUrl && (
                <Button
                  as="a"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="mint"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {CLOSING_CONTENT.ctaWhatsApp}
                </Button>
              )}
            </div>
          </Reveal>

          {/* Decorative divider */}
          <div className="w-16 h-[2px] bg-[#1A0F24]/20 mx-auto my-6" aria-hidden="true" />

          {/* Closing Italic Sentence with Instrument Serif */}
          <Reveal delayMs={200}>
            <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#8B1538] max-w-2xl mx-auto leading-relaxed">
              &ldquo;{CLOSING_CONTENT.closingItalic}&rdquo;
            </p>
          </Reveal>
        </Booth>
      </div>
    </section>
  );
};


