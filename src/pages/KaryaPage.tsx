import React, { useEffect, useState } from 'react';
import { KaryaProvider } from '../context/KaryaContext';
import { TopBar } from '../components/karya/TopBar';
import { KaryaHero } from '../components/karya/KaryaHero';
import { ProjectIndex } from '../components/karya/ProjectIndex';
import { PROJECTS } from '../content/karya';
import { DuskBackground, DecorLayer } from '../ui/kit';

export const KaryaPage: React.FC = () => {
  const [variant, setVariant] = useState<'festive' | 'calm'>('festive');

  useEffect(() => {
    const handleScroll = () => {
      // Transition from festive (3D hero) to calm (typographic index)
      const scrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 1.2;
      setVariant(scrollY > heroThreshold ? 'calm' : 'festive');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update Document Title and SEO Metadata
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Karya – Rasanara Group';

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : null;

    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Koleksi proyek rekayasa digital, sistem enterprise, dan eksperimen produk Rasanara Group.'
    );

    // JSON-LD ItemList for SEO indexing
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'karya-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: PROJECTS.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.name,
        description: p.summary,
        url: `https://ridwannp.com/karya/${p.slug}`,
      })),
    });
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      if (originalDesc && metaDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      const existingScript = document.getElementById('karya-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <KaryaProvider>
      <DuskBackground variant={variant} className="overflow-x-clip selection:bg-[#FFC83D]/30 selection:text-[#FFF1D6]">
        {/* Fixed Top Bar */}
        <TopBar />

        {/* Floating Parallax SVG Decor Layer */}
        <DecorLayer />

        {/* 1. Hero Section (200svh scroll-driven 3D City Scene) */}
        <KaryaHero />

        {/* 2. Typographical Project Index & Details */}
        <ProjectIndex />

        {/* 3. Footer */}
        <footer className="py-12 px-4 sm:px-8 border-t border-white/10 bg-[#160B2E]/90 text-xs font-sans text-[#FFF1D6]/70 text-center relative z-20">
          <p>© {new Date().getFullYear()} Rasanara Group. Semua karya dibangun dengan pertimbangan rekayasa yang cermat.</p>
        </footer>
      </DuskBackground>
    </KaryaProvider>
  );
};

export default KaryaPage;
