import React from 'react';
import { Link } from 'react-router-dom';
import { DownloadCvButton } from '../DownloadCvButton';

export const TopBar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 pointer-events-none" style={{ paddingTop: 'max(14px, env(safe-area-inset-top))' }}>
      <Link
        to="/"
        className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-sans font-medium text-[#1B1A2E] bg-white/85 hover:bg-white backdrop-blur-md border border-[#E4DED3] transition-all duration-150 shadow-sm hover:shadow"
        aria-label="Kembali ke halaman utama teras"
      >
        <span>← Teras</span>
      </Link>

      <div className="pointer-events-auto">
        <DownloadCvButton cvUrl="/cv.pdf" />
      </div>
    </header>
  );
};

