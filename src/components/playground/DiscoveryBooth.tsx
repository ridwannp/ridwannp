import React, { useState, useEffect } from 'react';
import {
  QUESTIONS,
  DISCLAIMER_NOTE,
  PRIVACY_NOTE,
  SHOW_FREE_NOTE,
} from '../../content/playground';
import {
  DiscoveryAnswers,
  DiscoveryResult,
  nextQuestionId,
  buildResult,
} from '../../lib/discovery/engine';

const STORAGE_KEY = 'rn_pg2';

interface DiscoveryBoothProps {
  onResultAppeared?: () => void;
}

export const DiscoveryBooth: React.FC<DiscoveryBoothProps> = ({ onResultAppeared }) => {
  const [currentStep, setCurrentStep] = useState<string>('recv');
  const [answers, setAnswers] = useState<DiscoveryAnswers>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return {};
  });

  const [history, setHistory] = useState<string[]>([]);
  const [isOtherActive, setIsOtherActive] = useState(false);
  const [otherText, setOtherText] = useState('');
  const [result, setResult] = useState<DiscoveryResult | null>(null);

  // Sync answers with localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      }
    } catch {
      // Ignore
    }
  }, [answers]);

  const question = QUESTIONS[currentStep];

  const handleSelectOption = (value: string) => {
    setIsOtherActive(false);
    setAnswers((prev) => ({ ...prev, [currentStep]: value }));
  };

  const handleSelectOther = () => {
    setIsOtherActive(true);
    setAnswers((prev) => ({ ...prev, [currentStep]: { otherText } }));
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    setAnswers((prev) => ({ ...prev, [currentStep]: { otherText: text } }));
  };

  const isCurrentAnswerValid = (): boolean => {
    const ans = answers[currentStep];
    if (!ans) return false;
    if (typeof ans === 'object' && 'otherText' in ans) {
      return ans.otherText.trim().length > 0;
    }
    if (question?.isFreeText) {
      return typeof ans === 'string' && ans.trim().length > 0;
    }
    return typeof ans === 'string' && ans.length > 0;
  };

  const handleNext = () => {
    if (!isCurrentAnswerValid()) return;

    const nextId = nextQuestionId({
      currentStep,
      answers,
      history,
    });

    if (nextId === 'result') {
      const res = buildResult(answers);
      setResult(res);
      setCurrentStep('result');
      if (onResultAppeared) {
        onResultAppeared();
      }
    } else {
      setHistory((prev) => [...prev, currentStep]);
      setCurrentStep(nextId);
      setIsOtherActive(false);
      setOtherText('');
    }
  };

  const handleBack = () => {
    if (currentStep === 'result') {
      setCurrentStep(history[history.length - 1] || 'recv');
      setResult(null);
      return;
    }

    if (history.length > 0) {
      const prevStep = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentStep(prevStep);
      setIsOtherActive(false);
    }
  };

  const handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
    setAnswers({});
    setHistory([]);
    setCurrentStep('recv');
    setResult(null);
    setIsOtherActive(false);
    setOtherText('');
  };

  const currentAnswerVal = answers[currentStep];
  const stepCount = history.length + 1;

  // Build mailto link for Result Ticket
  const buildMailtoUrl = () => {
    if (!result) return '#';
    const body = `Halo Mas Ridwan / Rasanara,\n\nSaya telah mengisi penelusuran proses kerja di Digital Playground.\n\nRingkasan:\n${result.summary}\n\nTemuan:\n${result.finding}\n\nLangkah awal:\n${result.step}\n\nSaya ingin berdiskusi lebih lanjut. Terima kasih!`;
    return `mailto:ridwannurdiyanto93@gmail.com?subject=Bahas%20Hasil%20Discovery%20Digital%20Playground&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="discovery"
      style={{
        minHeight: '100svh',
        padding: '5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Right-aligned on desktop
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
        aria-live="polite"
      >
        {/* Booth Header Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: '"Bricolage Grotesque", sans-serif',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#1A0F24',
              }}
            >
              Discovery Booth
            </span>
            {SHOW_FREE_NOTE && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#4FD1A1',
                  color: '#1A0F24',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #1A0F24',
                }}
              >
                Gratis
              </span>
            )}
          </div>

          {/* Balloon Progress Bar */}
          {currentStep !== 'result' && (
            <div
              style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}
              aria-label={`Langkah ${stepCount}`}
            >
              {Array.from({ length: stepCount }).map((_, i) => (
                <span
                  key={i}
                  className="pg-pop-balloon"
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '18px',
                    backgroundColor: i === stepCount - 1 ? '#E0316A' : '#4FD1A1',
                    border: '1.5px solid #1A0F24',
                    borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                    position: 'relative',
                  }}
                  title={`Langkah ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---------------- QUESTION VIEW ---------------- */}
        {currentStep !== 'result' && question && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#8B1538',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.35rem',
                }}
              >
                Pertanyaan {stepCount}
              </span>
              <h2
                style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                  fontSize: 'clamp(1.25rem, 3vw, 1.6rem)',
                  fontWeight: 800,
                  color: '#1A0F24',
                  lineHeight: 1.25,
                  margin: 0,
                }}
              >
                {question.text}
              </h2>
              {question.help && (
                <p
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.875rem',
                    color: '#6B5E78',
                    marginTop: '0.35rem',
                    marginBottom: 0,
                  }}
                >
                  {question.help}
                </p>
              )}
            </div>

            {/* Free text question (p_free) */}
            {question.isFreeText ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea
                  rows={4}
                  placeholder="Contoh: Kami menerima chat lalu membaginya ke grup staf, kendalanya sering lupa konfirmasi stok..."
                  value={
                    typeof currentAnswerVal === 'object' && 'otherText' in currentAnswerVal
                      ? currentAnswerVal.otherText
                      : typeof currentAnswerVal === 'string'
                      ? currentAnswerVal
                      : ''
                  }
                  onChange={(e) => handleOtherTextChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: '2.5px solid #1A0F24',
                    backgroundColor: '#ffffff',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.9375rem',
                    color: '#1A0F24',
                    boxShadow: '3px 3px 0 #1A0F24',
                  }}
                />
              </div>
            ) : (
              /* Options list */
              <div
                role="radiogroup"
                aria-label={question.text}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}
              >
                {question.options?.map((opt) => {
                  const isSelected =
                    !isOtherActive &&
                    typeof currentAnswerVal === 'string' &&
                    currentAnswerVal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(opt.value)}
                      className="pg-chunky-option"
                      style={{
                        textAlign: 'left',
                        padding: '0.85rem 1.15rem',
                        borderRadius: '14px',
                        border: '2.5px solid #1A0F24',
                        backgroundColor: isSelected ? '#4FD1A1' : '#ffffff',
                        color: '#1A0F24',
                        boxShadow: isSelected ? '2px 2px 0 #1A0F24' : '3px 3px 0 #1A0F24',
                        transform: isSelected ? 'translate(1px, 1px)' : 'none',
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '9999px',
                            backgroundColor: '#1A0F24',
                            color: '#4FD1A1',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Cara lainnya Option */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isOtherActive}
                  onClick={handleSelectOther}
                  className="pg-chunky-option"
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '14px',
                    border: '2.5px solid #1A0F24',
                    backgroundColor: isOtherActive ? '#FFC83D' : '#ffffff',
                    color: '#1A0F24',
                    boxShadow: isOtherActive ? '2px 2px 0 #1A0F24' : '3px 3px 0 #1A0F24',
                    transform: isOtherActive ? 'translate(1px, 1px)' : 'none',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: isOtherActive ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  Cara lainnya...
                </button>

                {isOtherActive && (
                  <div style={{ marginTop: '0.25rem' }}>
                    <input
                      type="text"
                      placeholder="Tuliskan cara Anda di sini..."
                      value={otherText}
                      onChange={(e) => handleOtherTextChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '2px solid #1A0F24',
                        backgroundColor: '#ffffff',
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '0.875rem',
                        color: '#1A0F24',
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Privacy notice */}
            <div
              style={{
                fontSize: '0.75rem',
                color: '#6B5E78',
                marginBottom: '1.5rem',
                lineHeight: 1.4,
              }}
            >
              🔒 {PRIVACY_NOTE}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {history.length > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1A0F24',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  &larr; Kembali
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                disabled={!isCurrentAnswerValid()}
                onClick={handleNext}
                className="pg-chunky-btn"
                style={{
                  backgroundColor: isCurrentAnswerValid() ? '#E0316A' : '#D1C4AF',
                  color: '#FFF1D6',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  padding: '0.75rem 1.6rem',
                  borderRadius: '9999px',
                  border: '2.5px solid #1A0F24',
                  boxShadow: isCurrentAnswerValid() ? '3px 3px 0 #1A0F24' : 'none',
                  cursor: isCurrentAnswerValid() ? 'pointer' : 'not-allowed',
                }}
              >
                Selanjutnya &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ---------------- RESULT TICKET VIEW ---------------- */}
        {currentStep === 'result' && result && (
          <div
            id="pg-result-ticket"
            style={{
              backgroundColor: '#FFF1D6',
              borderRadius: '20px',
              border: '3px solid #1A0F24',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(26, 15, 36, 0.1)',
            }}
          >
            {/* Ticket Header */}
            <div
              style={{
                backgroundColor: '#E0316A',
                color: '#FFF1D6',
                padding: '1rem 1.5rem',
                borderBottom: '3px solid #1A0F24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                TIKET HASIL · DIGITAL PLAYGROUND
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#FFC83D',
                  color: '#1A0F24',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #1A0F24',
                }}
              >
                {result.priority}
              </span>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Summary sentence */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#8B1538',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Ringkasan Alur
                </span>
                <p
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.9375rem',
                    lineHeight: 1.55,
                    color: '#1A0F24',
                    margin: 0,
                  }}
                >
                  {result.summary}
                </p>
              </div>

              {/* 4-Node Process Map */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#8B1538',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Peta Proses
                </span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '0.5rem',
                  }}
                >
                  {result.processMap.map((node) => (
                    <div
                      key={node.stepNumber}
                      style={{
                        backgroundColor: node.isIssue ? '#FEE7EF' : '#ffffff',
                        border: node.isIssue ? '2px solid #E0316A' : '1.5px solid #1A0F24',
                        borderRadius: '10px',
                        padding: '0.5rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: node.isIssue ? '#E0316A' : '#6B5E78' }}>
                        {node.stepNumber}. {node.title}
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: '#1A0F24',
                          marginTop: '0.2rem',
                          wordBreak: 'break-word',
                        }}
                      >
                        {node.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semicircle notch divider */}
              <div
                style={{
                  position: 'relative',
                  margin: '1.5rem -1.5rem',
                  borderTop: '2px dashed #1A0F24',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '-2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF1D6',
                    border: '3px solid #1A0F24',
                    borderLeftColor: 'transparent',
                    borderBottomColor: 'transparent',
                    transform: 'rotate(45deg)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF1D6',
                    border: '3px solid #1A0F24',
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent',
                    transform: 'rotate(-45deg)',
                  }}
                />
              </div>

              {/* Findings & Steps */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#8B1538',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Temuan &amp; Langkah Awal
                </span>
                <p
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    color: '#1A0F24',
                    fontWeight: 600,
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  {result.finding}
                </p>
                <p
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: '#4A3E54',
                    margin: 0,
                  }}
                >
                  <strong>Langkah awal:</strong> {result.step}
                </p>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B5E78',
                    marginTop: '0.5rem',
                    fontStyle: 'italic',
                  }}
                >
                  {result.reason}
                </div>
              </div>

              {/* Limited analysis note if applicable */}
              {result.limitedNote && (
                <div
                  style={{
                    backgroundColor: '#FFF8E6',
                    border: '1.5px solid #FFC83D',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.8125rem',
                    color: '#8A5D00',
                    marginBottom: '1.25rem',
                  }}
                >
                  {result.limitedNote}
                </div>
              )}

              {/* Relevant Products */}
              {result.relevantProducts.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <span
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#8B1538',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Produk Yang Mungkin Membantu
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.relevantProducts.map((p) => (
                      <a
                        key={p.slug}
                        href="#produk"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#ffffff',
                          border: '2px solid #1A0F24',
                          borderRadius: '10px',
                          padding: '0.65rem 0.85rem',
                          textDecoration: 'none',
                          color: '#1A0F24',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                        }}
                      >
                        <span>{p.name}</span>
                        <span style={{ color: '#E0316A' }}>Lihat &rarr;</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#6B5E78',
                  lineHeight: 1.4,
                  marginBottom: '1.5rem',
                  borderTop: '1px solid #E2DED3',
                  paddingTop: '0.85rem',
                }}
              >
                {DISCLAIMER_NOTE}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a
                  href={buildMailtoUrl()}
                  className="pg-chunky-btn"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: '#4FD1A1',
                    color: '#1A0F24',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    padding: '0.75rem 1rem',
                    borderRadius: '9999px',
                    border: '2.5px solid #1A0F24',
                    boxShadow: '3px 3px 0 #1A0F24',
                    textDecoration: 'none',
                  }}
                >
                  Bahas dengan Rasanara &rarr;
                </a>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="pg-chunky-btn"
                    style={{
                      flex: 1,
                      backgroundColor: '#ffffff',
                      color: '#1A0F24',
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      padding: '0.65rem',
                      borderRadius: '9999px',
                      border: '2px solid #1A0F24',
                      boxShadow: '2.5px 2.5px 0 #1A0F24',
                      cursor: 'pointer',
                    }}
                  >
                    Simpan / Cetak PDF
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      color: '#8B1538',
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      padding: '0.65rem',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Mulai ulang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
