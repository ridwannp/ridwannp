import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { PLAYGROUND_CONFIG } from '../data/config';
import { QUESTIONS } from '../data/questions';
import { Answers, Question } from '../engine/types';
import { computeActivePath, filterValidAnswers } from '../engine/path';
import { analyzeAnswers } from '../engine/analyze';
import {
  clearAnswers,
  getStoredAnswers,
  saveAnswers,
} from '../storage/answersStore';
import { localResultRepo } from '../storage/resultRepository';
import { trackEvent } from '../analytics/track';
import styles from '../styles/Playground.module.css';

export const Kenali: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentId, setCurrentId] = useState<string>('bidang');
  const [versionMismatch, setVersionMismatch] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Initialize from storage
  useEffect(() => {
    trackEvent({ name: 'kenali_start' });
    const stored = getStoredAnswers();
    if (stored) {
      if (stored.isVersionMismatch) {
        setVersionMismatch(true);
      }
      setAnswers(stored.answers);
      const path = computeActivePath(stored.answers);
      // Find the first question on the path without an answer
      const firstUnanswered = path.find((qid) => !stored.answers[qid]);
      if (firstUnanswered) {
        setCurrentId(firstUnanswered);
      } else if (path.length > 0) {
        // All answered or at end
        setCurrentId(path[path.length - 1]);
      }
    }
  }, []);

  const activePath = computeActivePath(answers);
  const currentQuestion: Question | undefined = QUESTIONS.find((q) => q.id === currentId);
  const currentIndex = activePath.indexOf(currentId);
  const totalPathSteps = Math.max(activePath.length, 1);
  const progressPercent = Math.min(
    Math.round(((currentIndex + 1) / totalPathSteps) * 100),
    100
  );

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelectOption = (optionId: string, exclusive?: boolean) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === 'single') {
      const nextAnswers = { ...answers, [currentQuestion.id]: optionId };
      setAnswers(nextAnswers);
      saveAnswers(nextAnswers);
    } else if (currentQuestion.type === 'multi') {
      const currentList = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      let updated: string[];

      if (exclusive) {
        // Exclusive option clears other selections
        updated = [optionId];
      } else {
        // Selecting non-exclusive clears any exclusive options (e.g. 'tidak_ada')
        const filtered = currentList.filter((id) => {
          const opt = currentQuestion.options.find((o) => o.id === id);
          return !opt?.exclusive;
        });

        if (filtered.includes(optionId)) {
          updated = filtered.filter((id) => id !== optionId);
        } else {
          if (currentQuestion.maxSelect && filtered.length >= currentQuestion.maxSelect) {
            return;
          }
          updated = [...filtered, optionId];
        }
      }

      const nextAnswers = { ...answers, [currentQuestion.id]: updated };
      setAnswers(nextAnswers);
      saveAnswers(nextAnswers);
    }
  };

  const handleCustomTextChange = (text: string) => {
    if (!currentQuestion) return;
    const key = `${currentQuestion.id}_lainnya`;
    const nextAnswers = { ...answers, [key]: text };
    setAnswers(nextAnswers);
    saveAnswers(nextAnswers);
  };

  const isCurrentAnswered = (): boolean => {
    if (!currentQuestion) return false;
    if (currentQuestion.optional) return true;
    if (currentAnswer === undefined || currentAnswer === '') return false;
    if (Array.isArray(currentAnswer) && currentAnswer.length === 0) return false;
    return true;
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    trackEvent({
      name: 'kenali_step',
      questionId: currentQuestion.id,
      stepIndex: currentIndex,
    });

    const nextId = currentQuestion.next(answers);

    if (nextId === 'selesai') {
      // Complete!
      const cleaned = filterValidAnswers(answers);
      saveAnswers(cleaned);
      const analysis = analyzeAnswers(cleaned);
      await localResultRepo.saveResult(analysis);

      trackEvent({
        name: 'kenali_complete',
        findingsCount: analysis.findings.length,
        prioritiesCount: {
          tinggi: analysis.priorities.tinggi.length,
          perhatian: analysis.priorities.perhatian.length,
          peluang: analysis.priorities.peluang.length,
        },
      });

      navigate('/playground/kenali/hasil');
    } else {
      setCurrentId(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentId(activePath[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/playground');
    }
  };

  const handleClearAll = () => {
    clearAnswers();
    setAnswers({});
    setCurrentId('bidang');
    setShowClearConfirm(false);
    trackEvent({ name: 'kenali_clear' });
  };

  if (!currentQuestion) {
    return (
      <PlaygroundLayout>
        <div className={styles.container} style={{ paddingTop: '3rem' }}>
          <p>Memuat pertanyaan...</p>
        </div>
      </PlaygroundLayout>
    );
  }

  const phaseName = PLAYGROUND_CONFIG.phases[currentQuestion.phase];
  const questionText = currentQuestion.textVariants
    ? currentQuestion.textVariants(answers)
    : currentQuestion.text;

  return (
    <PlaygroundLayout>
      <div className={styles.container} style={{ paddingTop: '2.5rem', maxWidth: '720px' }}>
        {/* Version Mismatch Notification */}
        {versionMismatch && (
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
              Daftar pertanyaan telah diperbarui. Untuk analisis yang lebih akurat, disarankan mulai dari awal.
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                backgroundColor: '#b45309',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.375rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Mulai Ulang
            </button>
          </div>
        )}

        {/* Phase & Progress Indicator */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8125rem',
              color: 'var(--muted)',
              marginBottom: '0.5rem',
            }}
          >
            <span>
              Fase {currentQuestion.phase}: <strong>{phaseName}</strong>
            </span>
            <span>
              Langkah {currentIndex + 1} dari {totalPathSteps}
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#ede8dc',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--accent)',
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </div>

        {/* Question Heading */}
        <section style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-quote)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.375rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0 0 0.5rem 0',
              fontWeight: 400,
            }}
          >
            {questionText}
          </h2>

          {currentQuestion.help && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--muted)',
                margin: 0,
              }}
            >
              {currentQuestion.help}
            </p>
          )}

          {currentQuestion.type === 'multi' && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--accent)',
                fontWeight: 500,
                marginTop: '0.375rem',
              }}
            >
              {currentQuestion.maxSelect
                ? `Pilih maksimal ${currentQuestion.maxSelect} jawaban yang paling sering terjadi:`
                : 'Pilih semua yang sesuai:'}
            </p>
          )}
        </section>

        {/* Options List */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}
          role="group"
          aria-label={questionText}
        >
          {currentQuestion.options.map((opt) => {
            const isSelected =
              currentQuestion.type === 'single'
                ? currentAnswer === opt.id
                : Array.isArray(currentAnswer) && currentAnswer.includes(opt.id);

            return (
              <button
                key={opt.id}
                type="button"
                disabled={opt.disabled}
                onClick={() => !opt.disabled && handleSelectOption(opt.id, opt.exclusive)}
                className={`${styles.optionCard} ${isSelected ? styles.optionSelected : ''} ${
                  opt.disabled ? styles.optionDisabled : ''
                }`}
                aria-pressed={isSelected}
              >
                <span>{opt.label}</span>
                {opt.disabled && opt.disabledNote && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                    {opt.disabledNote}
                  </span>
                )}
                {isSelected && !opt.disabled && (
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom text for 'lainnya' option */}
        {currentQuestion.allowOther &&
          ((currentQuestion.type === 'single' && currentAnswer === 'lainnya') ||
            (Array.isArray(currentAnswer) && currentAnswer.includes('lainnya'))) && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="lainnya-input"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.375rem',
                  color: 'var(--ink)',
                }}
              >
                Sebutkan rincian lainnya:
              </label>
              <input
                id="lainnya-input"
                type="text"
                maxLength={100}
                placeholder="Tuliskan di sini..."
                value={typeof answers[`${currentQuestion.id}_lainnya`] === 'string' ? answers[`${currentQuestion.id}_lainnya`] as string : ''}
                onChange={(e) => handleCustomTextChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--card)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--ink)',
                }}
              />
            </div>
          )}

        {/* Privacy Note */}
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--muted)',
            lineHeight: 1.4,
            marginBottom: '2rem',
          }}
        >
          🔒 {PLAYGROUND_CONFIG.kenali.privacyInputWarning} Jawaban Anda hanya disimpan di peramban ini.
        </p>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderTop: '1px solid var(--line)',
            paddingTop: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '0.625rem 1rem',
            }}
          >
            &larr; {PLAYGROUND_CONFIG.kenali.btnPrev}
          </button>

          <button
            type="button"
            disabled={!isCurrentAnswered()}
            onClick={handleNext}
            style={{
              backgroundColor: isCurrentAnswered() ? 'var(--accent)' : '#d5cebf',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: isCurrentAnswered() ? 'pointer' : 'not-allowed',
              padding: '0.75rem 1.75rem',
              transition: 'background-color 0.15s ease',
            }}
          >
            {currentIndex === totalPathSteps - 1 || currentQuestion.next(answers) === 'selesai'
              ? 'Selesai & Lihat Hasil'
              : PLAYGROUND_CONFIG.kenali.btnNext}{' '}
            &rarr;
          </button>
        </div>

        {/* Clear Answers Link */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9e978b',
              fontSize: '0.8125rem',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {PLAYGROUND_CONFIG.kenali.btnClear}
          </button>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
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
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  margin: '0 0 0.75rem 0',
                  color: 'var(--ink)',
                }}
              >
                Hapus seluruh jawaban?
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: 'var(--muted)',
                  marginBottom: '1.5rem',
                }}
              >
                {PLAYGROUND_CONFIG.kenali.clearConfirmText}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  style={{
                    backgroundColor: '#f1ede4',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
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
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlaygroundLayout>
  );
};

