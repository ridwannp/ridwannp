import React, { useState } from 'react';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import styles from '../styles/Playground.module.css';

export const ProductsList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedAccess, setSelectedAccess] = useState<string>('Semua');

  const categories: string[] = [
    'Semua',
    'Templat & Prompt',
    'Alat Mini',
    'Paket Otomasi',
  ];

  const accessOptions: string[] = ['Semua', 'gratis', 'berbayar'];

  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedCategory !== 'Semua' && product.category !== selectedCategory) {
      return false;
    }
    if (selectedAccess !== 'Semua' && product.access !== selectedAccess) {
      return false;
    }
    return true;
  });

  return (
    <PlaygroundLayout>
      <div className={styles.container} style={{ paddingTop: '3rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <span className={styles.eyebrow}>Digital Playground</span>
          <h1 className={styles.pageTitle}>Produk &amp; Alat</h1>
          <p className={styles.pageLede}>
            Koleksi templat spreadsheet, dokumen alur kerja, dan alat digital praktis untuk membantu aktivitas bisnis sehari-hari.
          </p>

          <div
            style={{
              backgroundColor: '#f7f5ef',
              borderLeft: '3px solid var(--accent)',
              padding: '0.875rem 1.25rem',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.875rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              maxWidth: '720px',
            }}
          >
            <strong>Prinsip:</strong> Pahami dulu apa yang perlu diperbaiki, baru pilih alatnya. Tidak semua masalah butuh aplikasi baru—terkadang kebiasaan rapi sudah cukup.
          </div>
        </header>

        {/* Filter Controls */}
        <section
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 0',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            marginBottom: '2rem',
          }}
          aria-label="Filter Produk"
        >
          {/* Categories Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginRight: '0.375rem' }}>
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? 'var(--ink)' : '#f1ede4',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--ink)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.375rem 0.875rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Access Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginRight: '0.375rem' }}>
              Akses:
            </span>
            {accessOptions.map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => setSelectedAccess(acc)}
                style={{
                  backgroundColor: selectedAccess === acc ? 'var(--accent)' : '#f1ede4',
                  color: selectedAccess === acc ? '#ffffff' : 'var(--ink)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textTransform: acc === 'Semua' ? 'none' : 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {acc}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: 'var(--card)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
            }}
          >
            <p style={{ color: 'var(--muted)', margin: '0 0 1rem 0' }}>
              Belum ada produk yang cocok dengan kombinasi filter yang dipilih.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedAccess('Semua');
              }}
              style={{
                backgroundColor: '#f1ede4',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </PlaygroundLayout>
  );
};

