import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { ProcessMap } from '../components/ProcessMap';
import { FindingCard } from '../components/FindingCard';
import { ProductCard } from '../components/ProductCard';
import { AnalysisResult } from '../engine/types';
import { localResultRepo } from '../storage/resultRepository';
import { clearAnswers, getStoredAnswers } from '../storage/answersStore';
import { analyzeAnswers } from '../engine/analyze';
import { PLAYGROUND_CONFIG } from '../data/config';
import { trackEvent } from '../analytics/track';
import styles from '../styles/Playground.module.css';

export const KenaliResult: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [includeSummary, setIncludeSummary] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Set noindex meta tag
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      metaTag.content = 'noindex';
      document.head.appendChild(metaTag);
      created = true;
    } else {
      metaTag.content = 'noindex';
    }

    return () => {
      if (created && metaTag) {
        document.head.removeChild(metaTag);
      }
    };
  }, []);

  // Load result
  useEffect(() => {
    async function loadData() {
      const storedResult = await localResultRepo.getResult(id || 'terbaru');
      if (storedResult) {
        setResult(storedResult);
        return;
      }

      // If not stored in repo, try calculating from current stored answers
      const storedAnswers = getStoredAnswers();
      if (storedAnswers && Object.keys(storedAnswers.answers).length > 0) {
        const calculated = analyzeAnswers(storedAnswers.answers);
        await localResultRepo.saveResult(calculated);
        setResult(calculated);
      }
    }
    loadData();
  }, [id]);

  if (!result) {
    return (
      <PlaygroundLayout>
        <div className={styles.container} style={{ paddingTop: '4rem', textAlign: 'center' }}>
          <span className={styles.eyebrow}>Kenali Bisnismu</span>
          <h1 className={styles.pageTitle}>Belum Ada Hasil Analisis</h1>
          <p className={styles.pageLede} style={{ margin: '0 auto 2rem auto' }}>
            Anda belum mengisi pertanyaan diagnostik proses kerja bisnis.
          </p>
          <Link
            to="/playground/kenali"
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
            Mulai Sekarang &rarr;
          </Link>
        </div>
      </PlaygroundLayout>
    );
  }

  const handleCopy = () => {
    trackEvent({ name: 'result_copy' });
    const textLines = [
      '--- RINGKASAN PROSES KERJA (DIGITAL PLAYGROUND) ---',
      result.summary,
      '',
      '--- TEMUAN UTAMA ---',
      ...result.findings.map(
        (f, i) =>
          `#${i + 1} [${f.priorityLabel}] ${f.title}\nIndikasi: ${f.indication}\nLangkah awal: ${f.firstSteps.join('; ')}`
      ),
      '',
      `Dihasilkan pada: ${new Date(result.generatedAt).toLocaleDateString('id-ID')}`,
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    trackEvent({ name: 'result_print' });
    window.print();
  };

  const handleDeleteAll = async () => {
    clearAnswers();
    await localResultRepo.clearResult();
    trackEvent({ name: 'kenali_clear' });
    navigate('/playground');
  };

  const buildWhatsAppUrl = (): string => {
    trackEvent({ name: 'result_whatsapp', withSummary: includeSummary });
    const waNumber = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '';

    let text = 'Halo Mas Ridwan / Tim Rasanara, saya baru saja menyelesaikan evaluasi alur kerja di Digital Playground.';
    if (includeSummary) {
      const topFindings = result.findings.slice(0, 3).map((f) => `- ${f.title}`).join('\n');
      text += `\n\nBerikut ringkasan hasil analisis awal usaha saya:\n${result.summary.split('\n\n')[0]}\n\nCatatan kendala yang muncul:\n${topFindings}\n\nSaya ingin berdiskusi lebih lanjut mengenai perbaikan alur kerja ini. Terima kasih!`;
    } else {
      text += '\n\nSaya ingin berdiskusi lebih lanjut mengenai perbaikan alur kerja dan operasional bisnis saya. Terima kasih!';
    }

    if (waNumber.trim()) {
      return `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    }
    return `mailto:ridwannurdiyanto93@gmail.com?subject=Diskusi%20Hasil%20Evaluasi%20Digital%20Playground&body=${encodeURIComponent(text)}`;
  };

  return (
    <PlaygroundLayout>
      <div className={styles.container} style={{ paddingTop: '2.5rem' }}>
        {/* Banner Status */}
        <div
          style={{
            backgroundColor: '#f1ede4',
            border: '1px solid var(--line)',
            borderRadius: '6px',
            padding: '0.625rem 1rem',
            fontSize: '0.8125rem',
            color: 'var(--muted)',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          {PLAYGROUND_CONFIG.result.banner}
        </div>

        {/* Limited Info Warning */}
        {result.isLimitedInfo && (
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.375rem' }}>
              Catatan Informasi Terbatas
            </strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', lineHeight: 1.5 }}>
              {result.limitedInfoNotice}
            </p>
          </div>
        )}

        {/* Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <span className={styles.eyebrow}>Hasil Evaluasi Mandiri</span>
          <h1 className={styles.pageTitle}>Ringkasan &amp; Rekomendasi Alur</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
            Tanggal evaluasi: {new Date(result.generatedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </p>
        </header>

        {/* Section 1: Ringkasan Naratif */}
        <section style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-quote)',
              fontSize: '1.75rem',
              color: 'var(--ink)',
              margin: '0 0 1rem 0',
              fontWeight: 400,
            }}
          >
            {PLAYGROUND_CONFIG.result.headings.summary}
          </h2>
          <div
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '1.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--ink)',
              whiteSpace: 'pre-line',
            }}
          >
            {result.summary}
          </div>
        </section>

        {/* Section 2: Peta Alur Kerja */}
        <section style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-quote)',
              fontSize: '1.75rem',
              color: 'var(--ink)',
              margin: '0 0 0.5rem 0',
              fontWeight: 400,
            }}
          >
            {PLAYGROUND_CONFIG.result.headings.map}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Posisi tahapan kerja Anda berdasarkan alur penerimaan hingga rekapitulasi:
          </p>
          <ProcessMap nodes={result.nodes} />
        </section>

        {/* Section 3: Temuan Utama & Prioritas */}
        <section style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-quote)',
              fontSize: '1.75rem',
              color: 'var(--ink)',
              margin: '0 0 1rem 0',
              fontWeight: 400,
            }}
          >
            {PLAYGROUND_CONFIG.result.headings.findings}
          </h2>

          {result.findings.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '1.5rem',
                fontSize: '0.9375rem',
                color: 'var(--muted)',
              }}
            >
              Tidak ada kendala operasional yang spesifik terdeteksi dari jawaban Anda. Alur kerja berjalan relatif tertata.
            </div>
          ) : (
            <div>
              {result.findings.map((finding, idx) => (
                <FindingCard key={finding.id} finding={finding} index={idx + 1} />
              ))}
            </div>
          )}
        </section>

        {/* General First Steps (if limited info or general guidance) */}
        {result.generalFirstSteps && (
          <section style={{ marginBottom: '3rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-quote)',
                fontSize: '1.75rem',
                color: 'var(--ink)',
                margin: '0 0 0.75rem 0',
                fontWeight: 400,
              }}
            >
              {PLAYGROUND_CONFIG.result.headings.steps}
            </h2>
            <div
              style={{
                backgroundColor: '#f7f5ef',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
              }}
            >
              <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6, fontSize: '0.9375rem', color: 'var(--ink)' }}>
                {result.generalFirstSteps.map((step, i) => (
                  <li key={i} style={{ marginBottom: i < result.generalFirstSteps.length - 1 ? '0.5rem' : 0 }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Section 4: Produk & Alat Pendukung */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-quote)',
              fontSize: '1.75rem',
              color: 'var(--ink)',
              margin: '0 0 0.5rem 0',
              fontWeight: 400,
            }}
          >
            {PLAYGROUND_CONFIG.result.headings.products}
          </h2>

          {result.recommendedProducts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginTop: '1.25rem',
              }}
            >
              {result.recommendedProducts.map(({ product, reason }) => (
                <ProductCard key={product.slug} product={product} reason={reason} />
              ))}
            </div>
          ) : (
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--muted)',
                backgroundColor: 'var(--card)',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--line)',
              }}
            >
              {PLAYGROUND_CONFIG.result.noProductsNotice}
            </p>
          )}
        </section>

        {/* Section 5: Aksi & Konsultasi */}
        <section
          className={styles.actionButtons}
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '3rem',
          }}
        >
          <span className={styles.eyebrow}>Langkah Selanjutnya</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.375rem',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: '0.25rem 0 0.75rem 0',
            }}
          >
            {PLAYGROUND_CONFIG.result.headings.actions}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
            }}
          >
            Ingin mendiskusikan temuan ini lebih dalam atau butuh bantuan menerapkan solusinya di lapangan?
          </p>

          {/* Checkbox for WhatsApp summary */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={includeSummary}
                onChange={(e) => setIncludeSummary(e.target.checked)}
              />
              {PLAYGROUND_CONFIG.result.includeSummaryCheckbox}
            </label>
          </div>

          {/* WhatsApp CTA Button */}
          <div style={{ marginBottom: '2rem' }}>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
                padding: '0.875rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              {PLAYGROUND_CONFIG.result.btnWhatsApp} &rarr;
            </a>
          </div>

          {/* Utilities: Copy, Print, Delete */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              borderTop: '1px solid var(--line)',
              paddingTop: '1.5rem',
            }}
          >
            <button
              type="button"
              onClick={handleCopy}
              style={{
                backgroundColor: '#f1ede4',
                color: 'var(--ink)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {copied ? '✓ Ringkasan Tersalin!' : PLAYGROUND_CONFIG.result.btnCopy}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                backgroundColor: '#f1ede4',
                color: 'var(--ink)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {PLAYGROUND_CONFIG.result.btnPrint}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#888070',
                border: 'none',
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginLeft: 'auto',
              }}
            >
              {PLAYGROUND_CONFIG.result.btnDelete}
            </button>
          </div>
        </section>

        {/* Feedback Section */}
        <section
          className={styles.noPrint}
          style={{
            textAlign: 'center',
            padding: '1.5rem 0',
            borderTop: '1px dashed var(--line)',
          }}
        >
          <span style={{ fontSize: '0.875rem', color: 'var(--muted)', marginRight: '1rem' }}>
            {PLAYGROUND_CONFIG.result.feedbackQuestion}
          </span>
          {feedbackGiven ? (
            <span style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 500 }}>
              Terima kasih atas tanggapan Anda!
            </span>
          ) : (
            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setFeedbackGiven('yes')}
                style={{
                  backgroundColor: '#f1ede4',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                {PLAYGROUND_CONFIG.result.feedbackYes}
              </button>
              <button
                type="button"
                onClick={() => setFeedbackGiven('no')}
                style={{
                  backgroundColor: '#f1ede4',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                {PLAYGROUND_CONFIG.result.feedbackNo}
              </button>
            </div>
          )}
        </section>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99,
              padding: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--card)',
                borderRadius: '8px',
                padding: '1.75rem',
                maxWidth: '420px',
                width: '100%',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  margin: '0 0 0.75rem 0',
                }}
              >
                Hapus hasil dan seluruh jawaban?
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                }}
              >
                Tindakan ini akan menghapus riwayat jawaban dan hasil evaluasi dari peramban ini. Anda bisa mengulang evaluasi kapan saja.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    backgroundColor: '#f1ede4',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Hapus Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlaygroundLayout>
  );
};

