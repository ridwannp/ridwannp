import React, { useEffect } from 'react';
import { KaryaProvider } from '../context/KaryaContext';
import { TopBar } from '../components/karya/TopBar';
import { KaryaHero } from '../components/karya/KaryaHero';
import { ProjectIndex } from '../components/karya/ProjectIndex';
import { PROJECTS } from '../content/karya';

export const KaryaPage: React.FC = () => {
  // Update Document Title and SEO Metadata
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Karya – Ridwan Nurdiyanto Putra';

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : null;

    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Koleksi proyek rekayasa digital, sistem enterprise, dan eksperimen produk Ridwan Nurdiyanto Putra.'
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
      <div className="min-h-screen bg-[#FBFAF7] text-[#1B1A2E] font-sans antialiased selection:bg-[#FFE7B0] selection:text-[#1B1A2E] overflow-x-clip">
        {/* Fixed Top Bar */}
        <TopBar />

        {/* 1. Hero Section (200svh scroll-driven 3D City Scene) */}
        <KaryaHero />

        {/* 2. Typographical Project Index & Details */}
        <ProjectIndex />

        {/* 3. Footer */}
        <footer className="py-10 px-4 sm:px-8 border-t border-[#E4DED3] bg-[#FBFAF7] text-xs font-sans text-[#5F5A66] text-center">
          <p>© Ridwan Nurdiyanto Putra</p>
        </footer>
      </div>
    </KaryaProvider>
  );
};

export default KaryaPage;
