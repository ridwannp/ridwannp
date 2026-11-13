import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_COPY } from '../../content/rasanara';

export const TopBar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBFAF7]/90 backdrop-blur-md border-b border-[#E4DED3] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-3"
           style={{ paddingTop: 'max(0.875rem, env(safe-area-inset-top))' }}>
        
        {/* Left: Navigation back links */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center min-h-[44px] text-xs sm:text-sm font-sans font-medium text-[#6B6458] hover:text-[#8B1538] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B1538] rounded-md px-1"
            aria-label="Kembali ke halaman Teras"
          >
            {NAV_COPY.backToTerrace}
          </Link>
          <span className="text-[#E4DED3] select-none" aria-hidden="true">/</span>
          <Link
            to="/cv"
            className="inline-flex items-center min-h-[44px] text-xs sm:text-sm font-sans font-medium text-[#6B6458] hover:text-[#8B1538] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B1538] rounded-md px-1"
          >
            {NAV_COPY.toCv}
          </Link>
        </div>

        {/* Center/Brand */}
        <div className="hidden md:flex items-center gap-2">
          <span className="font-serif italic text-xl font-bold text-[#15120F]">
            {NAV_COPY.brand}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
          <span className="text-xs font-sans tracking-wide uppercase text-[#6B6458]">
            {NAV_COPY.tagline}
          </span>
        </div>

        {/* Right: CTA button */}
        <div className="shrink-0 flex items-center">
          <a
            href="#mulai"
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-sans font-medium text-white bg-[#8B1538] hover:bg-[#6e102c] active:scale-[0.98] transition-all rounded-full shadow-sm focus-visible:outline-2 focus-visible:outline-[#8B1538] focus-visible:outline-offset-2 whitespace-nowrap"
          >
            {NAV_COPY.ctaTopBar}
          </a>
        </div>
      </div>
    </header>
  );
};

