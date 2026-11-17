import React, { useState, useMemo, useId } from 'react';
import { PRODUCTS } from '../../content/playground';

interface ProductBoothProps {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export const ProductBooth: React.FC<ProductBoothProps> = ({
  selectedIndex,
  onSelectIndex,
}) => {
  const [query, setQuery] = useState('');
  const searchId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.problem.toLowerCase().includes(q)
    );
  }, [query]);

  // Keep selectedIndex valid within filtered list
  const effectiveIndex = Math.min(selectedIndex, filtered.length - 1);
  const currentProduct = filtered[effectiveIndex] ?? PRODUCTS[0];
  const total = filtered.length;

  const handlePrev = () => {
    onSelectIndex((effectiveIndex - 1 + total) % total);
  };

  const handleNext = () => {
    onSelectIndex((effectiveIndex + 1) % total);
  };

  const mailtoBuyUrl = `mailto:ridwannurdiyanto93@gmail.com?subject=Beli%20Produk%20${encodeURIComponent(
    currentProduct.name
  )}`;

  return (
    <section
      id="produk"
      style={{
        minHeight: '100svh',
        padding: '5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Left-aligned on desktop
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        className="pg-booth-interactive pg-booth-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFF1D6',
          border: '3px solid #1A0F24',
          borderRadius: '28px',
          boxShadow: '9px 9px 0 #FFC83D',
          padding: '2.25rem',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.35rem',
            }}
          >
            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#8B1538',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Etalase Solusi
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#E0316A',
                color: '#FFF1D6',
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
                border: '1.5px solid #1A0F24',
              }}
            >
              Contoh Prototipe
            </span>
          </div>

          <h2
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight: 800,
              color: '#1A0F24',
              lineHeight: 1.2,
              margin: '0 0 0.35rem 0',
            }}
          >
            Produk Digital
          </h2>
          <p
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '0.875rem',
              color: '#6B5E78',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Template, alat kecil, dan paket otomasi buatan Rasanara untuk menyelesaikan masalah operasional harian.
          </p>
        </div>

        {/* Search Form */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor={searchId}
            style={{
              display: 'block',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#6B5E78',
              marginBottom: '0.4rem',
              letterSpacing: '0.04em',
            }}
          >
            Cari produk
          </label>
          <div style={{ position: 'relative' }}>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); onSelectIndex(0); }}
              placeholder="nama, kategori, atau masalah…"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1A0F24',
                backgroundColor: '#ffffff',
                border: '2.5px solid #1A0F24',
                borderRadius: '12px',
                boxShadow: '3px 3px 0 #1A0F24',
                outline: 'none',
              }}
            />
          </div>

          {/* Filtered result pills */}
          {query.trim() && (
            <div
              style={{
                marginTop: '0.6rem',
                display: 'flex',
                gap: '0.35rem',
                flexWrap: 'wrap',
              }}
            >
              {filtered.length === 0 ? (
                <span
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.75rem',
                    color: '#8B1538',
                    fontWeight: 600,
                  }}
                >
                  Tidak ditemukan — coba kata lain
                </span>
              ) : (
                filtered.map((prod, idx) => {
                  const isActive = idx === effectiveIndex;
                  return (
                    <button
                      key={prod.slug}
                      type="button"
                      onClick={() => onSelectIndex(idx)}
                      style={{
                        padding: '0.3rem 0.7rem',
                        borderRadius: '9999px',
                        border: '1.5px solid #1A0F24',
                        backgroundColor: isActive ? '#4FD1A1' : '#FFF1D6',
                        color: '#1A0F24',
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isActive ? '2px 2px 0 #1A0F24' : 'none',
                        transform: isActive ? 'translate(-1px,-1px)' : 'none',
                        transition: 'transform 0.1s, box-shadow 0.1s',
                      }}
                    >
                      {prod.name}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Active Product Details Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: '2.5px solid #1A0F24',
            padding: '1.5rem',
            boxShadow: '4px 4px 0 #1A0F24',
            marginBottom: '1.5rem',
          }}
        >
          {/* Card Header badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: currentProduct.access === 'free' ? '#4FD1A1' : '#FFC83D',
                color: '#1A0F24',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                border: '1.5px solid #1A0F24',
              }}
            >
              {currentProduct.access === 'free' ? 'Gratis' : 'Premium'}
            </span>

            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.75rem',
                color: '#6B5E78',
                fontWeight: 600,
              }}
            >
              Format: {currentProduct.format}
            </span>
          </div>

          {/* Product Name */}
          <h3
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#1A0F24',
              lineHeight: 1.3,
              margin: '0 0 0.5rem 0',
            }}
          >
            {currentProduct.name}
          </h3>

          {/* Problem Solved */}
          <div
            style={{
              fontSize: '0.8125rem',
              color: '#8B1538',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            Mengatasi: {currentProduct.problem}
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '0.875rem',
              lineHeight: 1.55,
              color: '#3A2F44',
              margin: '0 0 1rem 0',
            }}
          >
            {currentProduct.description}
          </p>

          {/* Requirements */}
          <div
            style={{
              backgroundColor: '#FFF1D6',
              border: '1.5px solid #1A0F24',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              fontSize: '0.75rem',
              color: '#1A0F24',
              lineHeight: 1.45,
            }}
          >
            <strong>Kebutuhan:</strong> {currentProduct.requirements}
          </div>
        </div>

        {/* Prototype note */}
        <div
          style={{
            fontSize: '0.75rem',
            color: '#6B5E78',
            marginBottom: '1.5rem',
            fontStyle: 'italic',
          }}
        >
          * Isi katalog ini masih contoh untuk prototipe. Produk nyata akan menggantikan daftar ini.
        </div>

        {/* Footer Actions & Carousel Arrows */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Action CTA */}
          <div>
            {currentProduct.access === 'free' ? (
              currentProduct.fileUrl ? (
                <a
                  href={currentProduct.fileUrl}
                  download
                  className="pg-chunky-btn"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#4FD1A1',
                    color: '#1A0F24',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    padding: '0.65rem 1.4rem',
                    borderRadius: '9999px',
                    border: '2.5px solid #1A0F24',
                    boxShadow: '3px 3px 0 #1A0F24',
                    textDecoration: 'none',
                  }}
                >
                  Unduh sekarang
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  style={{
                    backgroundColor: '#D1C4AF',
                    color: '#6B5E78',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    padding: '0.65rem 1.4rem',
                    borderRadius: '9999px',
                    border: '2px solid #6B5E78',
                    cursor: 'not-allowed',
                  }}
                >
                  Segera tersedia
                </button>
              )
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href={mailtoBuyUrl}
                  className="pg-chunky-btn"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FFC83D',
                    color: '#1A0F24',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    padding: '0.65rem 1.25rem',
                    borderRadius: '9999px',
                    border: '2.5px solid #1A0F24',
                    boxShadow: '3px 3px 0 #1A0F24',
                    textDecoration: 'none',
                  }}
                >
                  Hubungi untuk membeli
                </a>
                <span style={{ fontSize: '0.75rem', color: '#8B1538', fontWeight: 600 }}>
                  Harga menyusul
                </span>
              </div>
            )}
          </div>

          {/* Arrows — hidden when only 1 result */}
          {total > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.7rem',
                color: '#6B5E78',
                fontWeight: 600,
                marginRight: '0.25rem',
              }}
            >
              {effectiveIndex + 1}/{total}
            </span>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Produk sebelumnya"
              className="pg-chunky-btn"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9999px',
                border: '2px solid #1A0F24',
                backgroundColor: '#ffffff',
                boxShadow: '2px 2px 0 #1A0F24',
                color: '#1A0F24',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Produk selanjutnya"
              className="pg-chunky-btn"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9999px',
                border: '2px solid #1A0F24',
                backgroundColor: '#ffffff',
                boxShadow: '2px 2px 0 #1A0F24',
                color: '#1A0F24',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &rarr;
            </button>
          </div>
          )}
        </div>

        {/* Screen Reader only complete product index */}
        <div className="sr-only">
          <h3>Daftar Lengkap Produk Digital</h3>
          <ul>
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <h4>{p.name}</h4>
                <p>{p.description}</p>
                <p>Kategori: {p.category}</p>
                <p>Akses: {p.access}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

