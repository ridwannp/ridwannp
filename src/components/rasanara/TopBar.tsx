import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_COPY } from '../../content/rasanara';
import { Button } from '../../ui/kit';

export const TopBar: React.FC = () => {
  const jumpLinks = [
    { id: 'masalah', label: 'Masalah' },
    { id: 'cara-kerja', label: 'Cara Kerja' },
    { id: 'layanan', label: 'Layanan' },
    { id: 'prinsip', label: 'Prinsip' },
    { id: 'rasa-dan-narasi', label: 'Rasa & Narasi' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 pointer-events-none"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Teras button */}
        <Link
          to="/"
          className="kit-chunky-btn pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#FFF1D6] text-[#1A0F24] border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24]"
          aria-label="Kembali ke halaman Teras"
        >
          <span aria-hidden="true">&larr;</span> {NAV_COPY.backToTerrace}
        </Link>

        {/* Center: Jump nav */}
        <nav
          className="pointer-events-auto hidden md:inline-flex items-center gap-1 p-1 rounded-full border border-white/20 bg-[#1A0F24]/85 backdrop-blur-md"
          aria-label="Navigasi bagian Rasanara"
        >
          {jumpLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="font-sans text-xs font-bold px-3 py-1 rounded-full text-[#FFF1D6] hover:bg-[#8B1538] hover:text-white transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTA button */}
        <div className="pointer-events-auto">
          <Button
            as="a"
            href="#mulai"
            size="sm"
            variant="burgundy"
            className="shadow-[3px_3px_0_#1A0F24]"
          >
            {NAV_COPY.ctaTopBar}
          </Button>
        </div>
      </div>
    </header>
  );
};


