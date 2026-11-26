import React from 'react';
import { Link } from 'react-router-dom';
import './kit.css';

export interface JumpLinkItem {
  id: string;
  label: string;
}

export interface TopBarProps {
  jumpLinks?: JumpLinkItem[];
  activeId?: string;
  rightCta?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  jumpLinks = [],
  activeId,
  rightCta,
  backTo = '/',
  backLabel = 'Teras',
  className = '',
}) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 pointer-events-none ${className}`}
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
      }}
    >
      <div className="max-w-[1180px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Back Link Button */}
        <Link
          to={backTo}
          className="kit-chunky-btn pointer-events-auto inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#FFF1D6] text-[#1A0F24] border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24] shrink-0 whitespace-nowrap"
          aria-label={`Kembali ke ${backLabel}`}
        >
          <span aria-hidden="true">&larr;</span> {backLabel}
        </Link>

        {/* Jump Navigation Pills */}
        {jumpLinks.length > 0 && (
          <nav
            className="pointer-events-auto inline-flex items-center gap-1 p-1 rounded-full border border-white/20 bg-[#1A0F24]/80 backdrop-blur-md max-w-[48vw] sm:max-w-[65vw] overflow-x-auto no-scrollbar"
            aria-label="Navigasi bagian"
          >
            {jumpLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  className="font-sans text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors duration-150"
                  style={{
                    backgroundColor: isActive ? '#FFC83D' : 'transparent',
                    color: isActive ? '#1A0F24' : '#FFF1D6',
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        )}

        {/* Right Action CTA */}
        <div className="pointer-events-auto flex items-center gap-2">
          {rightCta}
        </div>
      </div>
    </header>
  );
};

