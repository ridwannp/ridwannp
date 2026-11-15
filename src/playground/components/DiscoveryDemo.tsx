import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from '../motion/lenis';

interface DiscoveryDemoProps {
  isReducedMotion?: boolean;
  onActiveCardChange?: (index: number) => void;
}

interface DemoQuestion {
  question: string;
  options: string[];
  selectedIndex: number;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    question: 'Bagaimana bisnis Anda biasanya menerima pesanan?',
    options: [
      'Melalui WhatsApp atau chat pelanggan',
      'Melalui marketplace atau platform online',
      'Secara langsung atau datang ke toko',
    ],
    selectedIndex: 0,
  },
  {
    question: 'Setelah pesanan masuk, apa yang biasanya Anda lakukan selanjutnya?',
    options: [
      'Mencatat pesanan secara manual',
      'Memasukkan ke Excel atau Google Sheets',
      'Meneruskan pesan ke bagian lain',
    ],
    selectedIndex: 1,
  },
  {
    question: 'Apa dampaknya bagi bisnis Anda?',
    options: [
      'Pekerjaan harus diulang',
      'Waktu banyak terbuang',
      'Belum terasa dampaknya',
    ],
    selectedIndex: 0,
  },
];

export const DiscoveryDemo: React.FC<DiscoveryDemoProps> = ({
  isReducedMotion = false,
  onActiveCardChange,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const pinTargetRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (onActiveCardChange) {
      onActiveCardChange(currentStep);
    }
  }, [currentStep, onActiveCardChange]);

  useEffect(() => {
    if (isReducedMotion || !containerRef.current || !pinTargetRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=250%',
        pin: pinTargetRef.current,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          let step = 0;
          if (progress > 0.66) {
            step = 2;
          } else if (progress > 0.33) {
            step = 1;
          }
          setCurrentStep(step);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const handleSkipDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget('#produk', { offset: -24 });
  };

  const handleDotClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentQ = DEMO_QUESTIONS[currentStep];

  return (
    <section
      id="discovery"
      ref={containerRef}
      tabIndex={-1}
      style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'var(--pg-band, #efe5d2)',
        borderRadius: '24px',
        margin: '4rem 0',
        padding: '4rem 2rem',
        outline: 'none',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
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
            Langkah Awal
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
            Discovery
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
            Beberapa pertanyaan sederhana, satu per layar, tentang bagaimana pekerjaan Anda berjalan sekarang. Dari jawaban Anda, kami susun gambaran awal dan langkah kecil yang bisa dicoba.
          </p>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#fbfaf7',
              border: '1px solid var(--line)',
              borderRadius: '6px',
              padding: '0.5rem 0.875rem',
              fontSize: '0.8125rem',
              color: 'var(--muted)',
            }}
          >
            Hasilnya adalah analisis awal berdasarkan jawaban Anda, bukan audit bisnis.
          </div>
        </header>

        {/* Pinned Demo Container */}
        <div ref={pinTargetRef} style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: '#fdfcfa',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: '2rem',
              boxShadow: '0 12px 32px rgba(21, 19, 15, 0.05)',
              position: 'relative',
            }}
          >
            {/* Demo Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  backgroundColor: 'rgba(139, 21, 56, 0.08)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                }}
              >
                Contoh tampilan
              </span>

              {/* Progress 3 Segments */}
              <div style={{ display: 'flex', gap: '0.375rem', width: '120px' }}>
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: idx <= currentStep ? 'var(--accent)' : '#e2ded3',
                      transition: 'background-color 300ms ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--ink)',
                lineHeight: 1.4,
                minHeight: '3.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = oIdx === currentQ.selectedIndex;
                return (
                  <div
                    key={oIdx}
                    style={{
                      padding: '0.875rem 1.25rem',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--line)',
                      backgroundColor: isSelected ? 'rgba(139, 21, 56, 0.04)' : '#faf8f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      color: isSelected ? 'var(--accent)' : 'var(--ink)',
                      fontWeight: isSelected ? 600 : 400,
                      transition: 'all 200ms ease',
                    }}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          height: '20px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--accent)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Demo Footer Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--line)',
              }}
            >
              {/* Step dots */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[0, 1, 2].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => handleDotClick(dotIdx)}
                    aria-label={`Lihat contoh pertanyaan ${dotIdx + 1}`}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '9999px',
                      border: dotIdx === currentStep ? '2px solid var(--accent)' : '1px solid var(--line)',
                      backgroundColor: dotIdx === currentStep ? 'var(--accent)' : '#faf8f3',
                      color: dotIdx === currentStep ? '#ffffff' : 'var(--muted)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {dotIdx + 1}
                  </button>
                ))}
              </div>

              {/* Skip button */}
              <a
                href="#produk"
                onClick={handleSkipDemo}
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--muted)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Lewati demo &darr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

