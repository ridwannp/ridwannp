import React from 'react';
import { Link } from 'react-router-dom';

interface TopBarProps {
  activeSection: string;
}

export const TopBar: React.FC<TopBarProps> = ({ activeSection }) => {
  const jumpLinks = [
    { id: 'hero', label: 'Gerbang' },
    { id: 'discovery', label: 'Discovery' },
    { id: 'produk', label: 'Produk' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingBottom: '0.75rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        {/* Teras button */}
        <Link
          to="/"
          className="pg-chunky-btn"
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#FFF1D6',
            color: '#1A0F24',
            border: '2.5px solid #1A0F24',
            boxShadow: '3px 3px 0 #1A0F24',
            borderRadius: '9999px',
            padding: '0.4rem 0.85rem',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.8125rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <span aria-hidden="true">&larr;</span> Teras
        </Link>

        {/* Jump Navigation */}
        <nav
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(26, 15, 36, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '2px solid rgba(255, 241, 214, 0.25)',
            borderRadius: '9999px',
            padding: '0.25rem',
            gap: '0.2rem',
          }}
          aria-label="Navigasi bagian"
        >
          {jumpLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'inline-block',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.65rem',
                  borderRadius: '9999px',
                  color: isActive ? '#1A0F24' : '#FFF1D6',
                  backgroundColor: isActive ? '#4FD1A1' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

