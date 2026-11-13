import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HERO_COPY, NAV_COPY } from '../content/rasanara';
import { TopBar } from '../components/rasanara/TopBar';
import { Hero } from '../components/rasanara/Hero';
import { ProblemsSection } from '../components/rasanara/ProblemsSection';
import { ProcessTimeline } from '../components/rasanara/ProcessTimeline';
import { ServicesIndex } from '../components/rasanara/ServicesIndex';
import { PrinciplesSpotlight } from '../components/rasanara/PrinciplesSpotlight';
import { RasaNarasi } from '../components/rasanara/RasaNarasi';
import { ContactSection } from '../components/rasanara/ContactSection';

export const RasanaraPage: React.FC = () => {
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
    <div className="min-h-screen bg-[#FBFAF7] text-[#15120F] font-sans selection:bg-[#8B1538]/15 selection:text-[#8B1538] overflow-x-clip">
      {/* Fixed Top Bar */}
      <TopBar />

      {/* Main Content */}
      <main id="main-content">
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
      <footer className="py-10 px-4 sm:px-6 md:px-8 border-t border-[#E4DED3] bg-[#FBFAF7] text-xs font-sans text-[#6B6458]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-[#15120F] text-sm">
              {NAV_COPY.brand}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" aria-hidden="true" />
            <span>Bogor, Jawa Barat · Indonesia</span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="hover:text-[#8B1538] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B1538] rounded"
            >
              {NAV_COPY.backToTerrace}
            </Link>
            <Link
              to="/cv"
              className="hover:text-[#8B1538] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B1538] rounded"
            >
              {NAV_COPY.toCv}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RasanaraPage;
