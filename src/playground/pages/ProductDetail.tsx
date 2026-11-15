import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { trackEvent } from '../analytics/track';
import styles from '../styles/Playground.module.css';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (slug) {
      trackEvent({ name: 'product_view', slug });
    }
  }, [slug]);

  if (!product) {
    return (
      <PlaygroundLayout>
        <div className={styles.container} style={{ paddingTop: '4rem', textAlign: 'center' }}>
          <span className={styles.eyebrow}>Digital Playground</span>
          <h1 className={styles.pageTitle}>Produk Tidak Ditemukan</h1>
          <p className={styles.pageLede} style={{ margin: '0 auto 2rem auto' }}>
            Produk atau alat yang Anda cari tidak tersedia atau tautan sudah dipindahkan.
          </p>
          <Link
            to="/playground/produk"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            &larr; Kembali ke Daftar Produk
          </Link>
        </div>
      </PlaygroundLayout>
    );
  }

  const getPriceLabel = () => {
    if (product.access === 'gratis') return 'Gratis';
    if (product.price) return `Rp ${product.price.toLocaleString('id-ID')}`;
    return 'Harga menyusul';
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.slug !== product.slug && (p.category === product.category || p.featured)
  ).slice(0, 2);

  const handleCtaClick = () => {
    trackEvent({ name: 'product_click_cta', slug: product.slug });
  };

  return (
    <PlaygroundLayout>
      <div className={styles.container} style={{ paddingTop: '2.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/playground/produk"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--muted)',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            &larr; Semua Produk &amp; Alat
          </Link>
        </div>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Main Details (Left / Main) */}
          <article>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className={`${styles.badge} ${styles.badgeFormat}`}>{product.format}</span>
              <span
                className={`${styles.badge} ${
                  product.access === 'gratis' ? styles.badgeGratis : styles.badgeBerbayar
                }`}
              >
                {product.access === 'gratis' ? 'Gratis' : 'Berbayar'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{product.category}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-quote)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: 1.2,
                color: 'var(--ink)',
                margin: '0 0 1rem 0',
                fontWeight: 400,
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                lineHeight: 1.6,
                color: 'var(--muted)',
                marginBottom: '2rem',
              }}
            >
              {product.summary}
            </p>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '2rem' }}>
              {/* Masalah yang diatasi */}
              <section style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Masalah yang diatasi
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                  {product.problemSolved}
                </p>
              </section>

              {/* Manfaat */}
              <section style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Manfaat praktis
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                  {product.benefit}
                </p>
              </section>

              {/* Pratinjau / Gambaran Isi */}
              {product.previewText && (
                <section style={{ marginBottom: '2rem' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Gambaran isi
                  </h2>
                  <div
                    style={{
                      backgroundColor: '#f6f4ee',
                      padding: '1rem 1.25rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--ink)',
                    }}
                  >
                    {product.previewText}
                  </div>
                </section>
              )}

              {/* Cara Penggunaan */}
              <section style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Cara penggunaan
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                  {product.usage}
                </p>
              </section>

              {/* Kebutuhan & Syarat */}
              <section style={{ marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Syarat pemakaian
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                  {product.requirements}
                </p>
              </section>
            </div>
          </article>

          {/* Sticky CTA Card (Right) */}
          <aside
            style={{
              position: 'sticky',
              top: '5rem',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '1.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'block' }}>
                Akses produk
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}
              >
                {getPriceLabel()}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <a
                href={product.ctaHref}
                onClick={handleCtaClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  padding: '0.875rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {product.access === 'gratis' ? 'Pakai Sekarang' : 'Dapatkan Produk'} &rarr;
              </a>
            </div>

            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted)',
                lineHeight: 1.5,
                borderTop: '1px solid var(--line)',
                paddingTop: '1rem',
              }}
            >
              <div style={{ marginBottom: '0.375rem' }}>
                <strong>Format:</strong> {product.format}
              </div>
              <div style={{ marginBottom: '0.375rem' }}>
                <strong>Akses:</strong> {product.access === 'gratis' ? 'Langsung diunduh / disalin' : 'Sekali bayar'}
              </div>
              <div>
                <strong>Pembaruan:</strong> {product.updatedAt}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '4rem', borderTop: '1px solid var(--line)', paddingTop: '3rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-quote)',
                fontSize: '1.75rem',
                color: 'var(--ink)',
                margin: '0 0 1.5rem 0',
                fontWeight: 400,
              }}
            >
              Produk Terkait
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PlaygroundLayout>
  );
};

