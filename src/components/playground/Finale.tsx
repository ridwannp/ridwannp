import React from 'react';
import { Link } from 'react-router-dom';
import { FINALE_COPY } from '../../content/playground';

export const Finale: React.FC = () => {
  const mailtoUrl = `mailto:${FINALE_COPY.email}?subject=Digital%20Playground`;

  return (
    <section
      id="penutup"
      style={{
        minHeight: '80svh',
        padding: '6rem 0 4rem 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#FFC83D',
            color: '#1A0F24',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            border: '2px solid #1A0F24',
            boxShadow: '2.5px 2.5px 0 #1A0F24',
            marginBottom: '1.25rem',
          }}
        >
          {FINALE_COPY.eyebrow}
        </span>

        <h2
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#FFF1D6',
            textShadow: '3.5px 3.5px 0 #E0316A',
            margin: '0 0 1.5rem 0',
          }}
        >
          {FINALE_COPY.title}
        </h2>

        <p
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.6,
            color: '#FFF1D6',
            maxWidth: '580px',
            margin: '0 auto 2.5rem auto',
            textShadow: '1px 1px 2px rgba(22, 11, 46, 0.8)',
          }}
        >
          {FINALE_COPY.body}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <a
            href={mailtoUrl}
            className="pg-chunky-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#E0316A',
              color: '#FFF1D6',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '0.85rem 1.85rem',
              borderRadius: '9999px',
              border: '3px solid #1A0F24',
              boxShadow: '4px 4px 0 #1A0F24',
              textDecoration: 'none',
            }}
          >
            <span>{FINALE_COPY.ctaMessage}</span>
            <span aria-hidden="true">&rarr;</span>
          </a>

          <Link
            to="/rasanara"
            className="pg-chunky-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFF1D6',
              color: '#1A0F24',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '0.85rem 1.85rem',
              borderRadius: '9999px',
              border: '3px solid #1A0F24',
              boxShadow: '4px 4px 0 #1A0F24',
              textDecoration: 'none',
            }}
          >
            <span>{FINALE_COPY.ctaRasanara}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: '6rem',
          borderTop: '1px solid rgba(255, 241, 214, 0.2)',
          paddingTop: '2rem',
          width: '100%',
          maxWidth: '1080px',
          color: '#FFF1D6',
          fontSize: '0.8125rem',
          fontFamily: '"Space Grotesk", sans-serif',
          opacity: 0.8,
        }}
      >
        &copy; {new Date().getFullYear()} Ridwan Nurdiyanto Putra &middot; Rasanara
      </footer>
    </section>
  );
};

