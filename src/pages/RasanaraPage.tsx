import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HERO_COPY, NAV_COPY } from '../content/rasanara';
import { Hero } from '../components/rasanara/Hero';
import { ProblemsSection } from '../components/rasanara/ProblemsSection';
import { ProcessTimeline } from '../components/rasanara/ProcessTimeline';
import { ServicesIndex } from '../components/rasanara/ServicesIndex';
import { PrinciplesSpotlight } from '../components/rasanara/PrinciplesSpotlight';
import { RasaNarasi } from '../components/rasanara/RasaNarasi';
import { ContactSection } from '../components/rasanara/ContactSection';
import { TopBar } from '../components/rasanara/TopBar';
import { DuskBackground, DecorLayer } from '../ui/kit';

export const RasanaraPage: React.FC = () => {
  const [variant, setVariant] = useState<'festive' | 'calm'>('festive');

  useEffect(() => {
    const handleScroll = () => {
      // After hero (1.2 * vh), transition background to calm for reading comfort
      const scrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 1.2;
      setVariant(scrollY > heroThreshold ? 'calm' : 'festive');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update document title and meta description dynamically
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Rasanara – Digital Partner';

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : null;

    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', HERO_COPY.subtitle);

    // Add JSON-LD Organization
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'rasanara-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Rasanara',
      description: HERO_COPY.subtitle,
    });
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      if (originalDesc && metaDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      const existingScript = document.getElementById('rasanara-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <DuskBackground variant={variant} className="overflow-x-clip selection:bg-[#E0316A]/30 selection:text-[#FFF1D6]">
      {/* Fixed Top Bar */}
      <TopBar />

      {/* Floating Parallax SVG Decor Layer */}
      <DecorLayer />

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        {/* 1. Hero Section (200svh scroll-driven 3D) */}
        <Hero />

        {/* 2. Problems & Challenges Section (Segment Tabs) */}
        <ProblemsSection />

        {/* 3. Methodology & Process (Timeline) */}
        <ProcessTimeline />

        {/* 4. Scope & Services (Numbered Index) */}
        <ServicesIndex />

        {/* 5. Philosophy & Principles (Spotlight) */}
        <PrinciplesSpotlight />

        {/* 6. Rasa and Narasi Story & Definition */}
        <RasaNarasi />

        {/* 7. Closing & Contact Block */}
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-[#160B2E]/90 text-xs font-sans text-[#FFF1D6]/70 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-[#FFF1D6] text-sm">
              {NAV_COPY.brand}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC83D]" aria-hidden="true" />
            <span>Bogor, Jawa Barat · Indonesia</span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="hover:text-[#FFC83D] transition-colors focus-visible:outline-2 focus-visible:outline-[#FFC83D] rounded"
            >
              {NAV_COPY.backToTerrace}
            </Link>
            <Link
              to="/profile"
              className="hover:text-[#FFC83D] transition-colors focus-visible:outline-2 focus-visible:outline-[#FFC83D] rounded"
            >
              {NAV_COPY.toCv}
            </Link>
          </div>
        </div>
      </footer>
    </DuskBackground>
  );
};

export default RasanaraPage;
