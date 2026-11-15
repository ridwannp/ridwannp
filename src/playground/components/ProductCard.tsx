import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../engine/types';
import styles from '../styles/Playground.module.css';

interface ProductCardProps {
  product: Product;
  reason?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, reason }) => {
  const getPriceLabel = () => {
    if (product.access === 'gratis') return 'Gratis';
    if (product.price) return `Rp ${product.price.toLocaleString('id-ID')}`;
    return 'Harga menyusul';
  };

  return (
    <Link
      to={`/playground/produk/${product.slug}`}
      className={styles.productCard}
      aria-label={`Lihat detail ${product.name}`}
    >
      {product.featured && <div className={styles.featuredBar} />}

      <div>
        <div className={styles.productHeader}>
          <div className={styles.productBadges}>
            <span className={`${styles.badge} ${styles.badgeFormat}`}>
              {product.format}
            </span>
            <span
              className={`${styles.badge} ${
                product.access === 'gratis' ? styles.badgeGratis : styles.badgeBerbayar
              }`}
            >
              {product.access === 'gratis' ? 'Gratis' : 'Berbayar'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            {product.category}
          </span>
        </div>

        <h3 className={styles.productTitle}>{product.name}</h3>
        <p className={styles.productSummary}>{product.summary}</p>

        {reason && (
          <div
            style={{
              backgroundColor: '#f6f4ee',
              borderLeft: '3px solid var(--accent)',
              padding: '0.5rem 0.75rem',
              borderRadius: '0 4px 4px 0',
              fontSize: '0.8125rem',
              color: 'var(--ink)',
              marginBottom: '1rem',
            }}
          >
            {reason}
          </div>
        )}
      </div>

      <div className={styles.productFooter}>
        <span className={styles.productPrice}>{getPriceLabel()}</span>
        <span className={styles.productCtaLink}>
          Lihat rincian <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  );
};

