import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { attachCardTilt } from '../motion/tilt';

interface CatalogPreviewProps {
  isReducedMotion?: boolean;
}

interface SampleCardData {
  title: string;
  summary: string;
  access: 'Gratis' | 'Berbayar';
  format: string;
  svgIcon: React.ReactNode;
}

const SAMPLE_CARDS: SampleCardData[] = [
  {
    title: 'Templat Pencatatan Pesanan Terpusat',
    summary: 'Lembar kerja terstruktur untuk mencatat, melacak status, dan merekap transaksi pesanan harian tanpa catatan berserakan.',
    access: 'Gratis',
    format: 'Spreadsheet',
    svgIcon: (
      <svg width="100%" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill="#EFE5D2" />
        <rect x="20" y="24" width="200" height="72" rx="4" fill="#FBFAF7" stroke="#E2DED3" strokeWidth="1.5" />
        <line x1="20" y1="44" x2="220" y2="44" stroke="#8B1538" strokeWidth="2" />
        <line x1="80" y1="24" x2="80" y2="96" stroke="#E2DED3" strokeWidth="1" />
        <line x1="140" y1="24" x2="140" y2="96" stroke="#E2DED3" strokeWidth="1" />
        <circle cx="50" cy="34" r="4" fill="#8B1538" />
        <rect x="90" y="52" width="40" height="6" rx="2" fill="#D4AF37" />
        <rect x="150" y="52" width="50" height="6" rx="2" fill="#C5BEB1" />
        <rect x="90" y="70" width="30" height="6" rx="2" fill="#D4AF37" />
        <rect x="150" y="70" width="40" height="6" rx="2" fill="#C5BEB1" />
      </svg>
    ),
  },
  {
    title: 'Templat SOP Penanganan Pesanan',
    summary: 'Panduan alur tertulis dan daftar periksa penanganan pesanan pelanggan dari penerimaan hingga pengiriman untuk delegasi tim.',
    access: 'Gratis',
    format: 'PDF',
    svgIcon: (
      <svg width="100%" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill="#EAE3D2" />
        <rect x="45" y="16" width="150" height="88" rx="6" fill="#FBFAF7" stroke="#E2DED3" strokeWidth="1.5" />
        <rect x="65" y="32" width="70" height="8" rx="2" fill="#8B1538" />
        <rect x="65" y="48" width="110" height="5" rx="2" fill="#D5CEBF" />
        <rect x="65" y="60" width="90" height="5" rx="2" fill="#D5CEBF" />
        <circle cx="68" cy="78" r="4" fill="#D4AF37" />
        <rect x="78" y="76" width="70" height="5" rx="2" fill="#D5CEBF" />
      </svg>
    ),
  },
  {
    title: 'Paket Otomasi Pesanan WhatsApp ke Spreadsheet',
    summary: 'Alur otomatis yang memindahkan format pesan pesanan pelanggan di chat langsung ke baris spreadsheet tanpa salin-tempel manual.',
    access: 'Berbayar',
    format: 'Alur Sistem',
    svgIcon: (
      <svg width="100%" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill="#E5DFCF" />
        <circle cx="65" cy="60" r="24" fill="#8B1538" />
        <circle cx="175" cy="60" r="24" fill="#D4AF37" />
        <path d="M 95 60 L 145 60" stroke="#15130F" strokeWidth="2" strokeDasharray="4 4" />
        <polygon points="145,55 153,60 145,65" fill="#15130F" />
        <circle cx="65" cy="60" r="8" fill="#FBFAF7" />
        <rect x="167" y="52" width="16" height="16" rx="2" fill="#FBFAF7" />
      </svg>
    ),
  },
  {
    title: 'Kalkulator Harga Jual & Estimasi Margin',
    summary: 'Alat bantu hitung cepat HPP, biaya operasional, diskon platform, dan batas aman margin keuntungan usaha Anda.',
    access: 'Berbayar',
    format: 'Alat Web',
    svgIcon: (
      <svg width="100%" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="120" fill="#DFD7C4" />
        <rect x="50" y="20" width="140" height="80" rx="8" fill="#15130F" />
        <rect x="62" y="32" width="116" height="24" rx="4" fill="#FBFAF7" />
        <circle cx="75" cy="72" r="5" fill="#D4AF37" />
        <circle cx="95" cy="72" r="5" fill="#D4AF37" />
        <circle cx="115" cy="72" r="5" fill="#D4AF37" />
        <circle cx="135" cy="72" r="5" fill="#8B1538" />
        <circle cx="155" cy="72" r="5" fill="#8B1538" />
      </svg>
    ),
  },
];

export const CatalogPreview: React.FC<CatalogPreviewProps> = ({ isReducedMotion = false }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isReducedMotion) return;

    const cleanups: (() => void)[] = [];
    cardRefs.current.forEach((card) => {
      if (card) {
        const glare = card.querySelector('.pg-card-glare') as HTMLElement | null;
        cleanups.push(attachCardTilt(card, glare));
      }
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [isReducedMotion]);

  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Column vertical parallax offsets: [0, -32, -64, -32]
      const offsets = [0, -32, -64, -32];
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 0 },
          {
            y: offsets[idx],
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <section
      id="produk"
      ref={containerRef}
      tabIndex={-1}
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '5rem 0',
        outline: 'none',
      }}
    >
      <header style={{ marginBottom: '3.5rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          Katalog
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-quote)',
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            color: 'var(--ink)',
            margin: '0 0 1rem 0',
            fontWeight: 400,
          }}
        >
          Produk Digital
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            lineHeight: 1.6,
            color: 'var(--muted)',
            marginBottom: '1rem',
            maxWidth: '620px',
          }}
        >
          Template, alat kecil, dan paket otomasi yang kami buat untuk menyelesaikan masalah yang sering muncul di Discovery.
        </p>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#efe9dc',
            border: '1px solid var(--line)',
            borderRadius: '6px',
            padding: '0.5rem 0.875rem',
            fontSize: '0.8125rem',
            color: 'var(--muted)',
          }}
        >
          Isi katalog ini masih contoh untuk prototipe. Produk nyata akan menggantikan daftar ini.
        </div>
      </header>

      {/* 4 Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {SAMPLE_CARDS.map((card, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            style={{
              backgroundColor: '#fdfcfa',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(21, 19, 15, 0.04)',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Glare overlay */}
            <div
              className="pg-card-glare"
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 200ms ease',
                zIndex: 2,
              }}
            />

            {/* Thumbnail */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              {card.svgIcon}
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: '#efe9dc',
                    color: 'var(--muted)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  Contoh
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: card.access === 'Gratis' ? '#e6f4ea' : '#fef7e0',
                    color: card.access === 'Gratis' ? '#137333' : '#b06000',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  {card.access}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
                  {card.format}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.35,
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: 'var(--muted)',
                  margin: '0 0 1.5rem 0',
                  flex: 1,
                }}
              >
                {card.summary}
              </p>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.875rem', marginTop: 'auto' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                  }}
                >
                  Lihat rincian <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

