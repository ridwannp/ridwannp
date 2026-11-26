import React, { memo } from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';

export const TopBar: React.FC = memo(() => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between safe-top safe-left safe-right px-4 sm:px-6 md:px-12 py-3.5 sm:py-5 bg-gradient-to-b from-[#FBFAF7]/90 via-[#FBFAF7]/50 to-transparent backdrop-blur-[2px]">
      {/* Brand / Identity */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 min-w-0 pr-2">
        <a
          href="/"
          className="font-sans font-bold text-sm sm:text-base md:text-lg text-[#141218] tracking-tight hover:opacity-80 transition-opacity truncate"
        >
          Rasanara Group
        </a>
        <span className="hidden sm:inline text-xs text-[#8F879A] font-medium">/</span>
        <p className="font-sans text-[11px] sm:text-xs text-[#5E5669] font-medium tracking-normal truncate">
          Digital Business Transformation Partner
        </p>
        <span className="hidden md:inline text-xs text-[#8F879A] font-medium">/</span>
        <p className="hidden md:block font-sans text-xs text-[#5E5669] font-medium tracking-normal">
          Business · Data · Technology
        </p>

      </div>

      {/* Direct Contact */}
      <div className="flex items-center gap-2">
        <a
          href="mailto:ridwannurdiyanto93@gmail.com"
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#141218]/15 bg-[#FBFAF7]/80 hover:bg-[#141218] hover:text-[#FBFAF7] text-[#141218] text-xs font-sans font-medium transition-all duration-200 shadow-sm"
          aria-label="Kirim email ke ridwannurdiyanto93@gmail.com"
        >
          <Mail className="w-3.5 h-3.5 text-inherit transition-transform group-hover:scale-110" />
          <span className="hidden md:inline">ridwannurdiyanto93@gmail.com</span>
          <span className="md:hidden">Kontak</span>
          <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';

