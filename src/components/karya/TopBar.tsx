import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/kit';

export const TopBar: React.FC = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 pointer-events-none"
      style={{ paddingTop: 'max(14px, env(safe-area-inset-top))' }}
    >
      <Link
        to="/"
        className="kit-chunky-btn pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#FFF1D6] text-[#1A0F24] border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24]"
        aria-label="Kembali ke halaman utama teras"
      >
        <span>&larr; Teras</span>
      </Link>

      <div className="pointer-events-auto">
        <Button
          as="a"
          href="/cv.pdf"
          download
          variant="gold"
          size="sm"
          className="shadow-[3px_3px_0_#1A0F24]"
          aria-label="Unduh CV Rasanara Group"
        >
          Unduh CV
        </Button>
      </div>
    </header>
  );
};

