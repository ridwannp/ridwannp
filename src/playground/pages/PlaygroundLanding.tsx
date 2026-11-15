import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { ProductCard } from '../components/ProductCard';
import { PLAYGROUND_CONFIG } from '../data/config';
import { PRODUCTS } from '../data/products';
import { getStoredAnswers } from '../storage/answersStore';
import styles from '../styles/Playground.module.css';

export const PlaygroundLanding: React.FC = () => {
  const [hasExistingAnswers, setHasExistingAnswers] = useState(false);

  useEffect(() => {
    const stored = getStoredAnswers();
    if (stored && Object.keys(stored.answers).length > 0) {
      setHasExistingAnswers(true);
    }
  }, []);

  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 3);

  return (
    <PlaygroundLayout>
      <div className={styles.container} style={{ paddingTop: '3rem' }}>
        <header>
          <span className={styles.eyebrow}>{PLAYGROUND_CONFIG.eyebrow}</span>
          <h1 className={styles.pageTitle}>{PLAYGROUND_CONFIG.landingTitle}</h1>
          <p className={styles.pageLede}>{PLAYGROUND_CONFIG.landingLede}</p>
        </header>

        {/* Principle Quote Box */}
        <blockquote className={styles.quoteBox}>
          &ldquo;{PLAYGROUND_CONFIG.principleQuote}&rdquo;
        </blockquote>

        {/* Two main entry cards */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            margin: '2.5rem 0 3.5rem 0',
          }}
          aria-label="Area Utama Playground"
        >
          {/* Card A: Kenali Bisnismu */}
          <div
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span className={styles.eyebrow}>Diagnostik Alur Kerja</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  margin: '0.25rem 0 0.75rem 0',
                  color: 'var(--ink)',
                }}
              >
                Kenali Bisnismu
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: 'var(--muted)',
                  marginBottom: '1.25rem',
                }}
              >
                Tinjau proses kerja harian bisnis Anda dalam ±3–5 menit tanpa istilah rumit. Dapatkan ringkasan alur kerja, titik kendala, dan rekomendasi langkah awal.
              </p>
              <ul
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--ink)',
                  paddingLeft: '1.25rem',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                <li>±3–5 menit pengerjaan</li>
                <li>Langsung tanpa perlu mendaftar</li>
                <li>Analisis awal tersimpan di browser Anda</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link
                to="/playground/kenali"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {hasExistingAnswers ? 'Lanjutkan Pertanyaan' : 'Mulai Kenali Bisnis'} &rarr;
              </Link>
              {hasExistingAnswers && (
                <Link
                  to="/playground/kenali/hasil"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#ede8dc',
                    color: 'var(--ink)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                  }}
                >
                  Lihat Hasil Terakhir
                </Link>
              )}
            </div>
          </div>

          {/* Card B: Produk & Alat */}
          <div
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span className={styles.eyebrow}>Katalog Solusi</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  margin: '0.25rem 0 0.75rem 0',
                  color: 'var(--ink)',
                }}
              >
                Produk & Alat
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: 'var(--muted)',
                  marginBottom: '1.25rem',
                }}
              >
                Kumpulan templat spreadsheet, dokumen SOP praktis, dan alat mini yang dirancang untuk mempermudah operasional harian usaha Anda.
              </p>
              <ul
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--ink)',
                  paddingLeft: '1.25rem',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                <li>Templat lembar kerja siap pakai</li>
                <li>Panduan langkah demi langkah</li>
                <li>Tersedia format gratis dan terstruktur</li>
              </ul>
            </div>

            <div>
              <Link
                to="/playground/produk"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#1b1a2e',
                  color: '#ffffff',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                Jelajahi Produk & Alat &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Showcase */}
        {featuredProducts.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className={styles.eyebrow}>Pilihan Unggulan</span>
              <h2
                style={{
                  fontFamily: 'var(--font-quote)',
                  fontSize: '2rem',
                  color: 'var(--ink)',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Alat bantu siap pakai
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PlaygroundLayout>
  );
};

