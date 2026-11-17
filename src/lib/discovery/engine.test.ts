import { test } from 'node:test';
import assert from 'node:assert';
import {
  nextQuestionId,
  buildResult,
  DiscoveryState,
} from './engine';
import { FINDINGS } from '../../content/playground';

test('Discovery Engine: Scenario (a) wa -> sheet -> scatter -> daily -> tidy', () => {
  let state: DiscoveryState = {
    currentStep: 'recv',
    answers: { recv: 'wa' },
    history: [],
  };
  assert.strictEqual(nextQuestionId(state), 'proc');

  state = {
    currentStep: 'proc',
    answers: { ...state.answers, proc: 'sheet' },
    history: ['recv'],
  };
  assert.strictEqual(nextQuestionId(state), 'p_sheet');

  state = {
    currentStep: 'p_sheet',
    answers: { ...state.answers, p_sheet: 'scatter' },
    history: ['recv', 'proc'],
  };
  assert.strictEqual(nextQuestionId(state), 'freq');

  state = {
    currentStep: 'freq',
    answers: { ...state.answers, freq: 'daily' },
    history: ['recv', 'proc', 'p_sheet'],
  };
  assert.strictEqual(nextQuestionId(state), 'goal');

  state = {
    currentStep: 'goal',
    answers: { ...state.answers, goal: 'tidy' },
    history: ['recv', 'proc', 'p_sheet', 'freq'],
  };
  assert.strictEqual(nextQuestionId(state), 'result');

  // Build result
  const result = buildResult(state.answers);
  assert.strictEqual(result.priority, 'Prioritas tinggi');
  assert.strictEqual(result.finding, FINDINGS.sheet_scatter.finding);
  assert.strictEqual(result.step, FINDINGS.sheet_scatter.step);
  assert.strictEqual(result.isLimited, false);
  assert.ok(result.relevantProducts.length > 0);
  assert.ok(result.summary.includes('lewat whatsapp atau chat pelanggan'));
});

test('Discovery Engine: Scenario (b) direct -> book -> none -> rare -> fast', () => {
  const answers = {
    recv: 'direct',
    proc: 'book',
    p_book: 'none',
    freq: 'rare',
    goal: 'fast',
  };

  const result = buildResult(answers);
  assert.strictEqual(result.priority, 'Peluang perbaikan');
  assert.ok(result.finding.includes('tidak menyebut kendala berarti'));
  assert.strictEqual(result.isLimited, false);
  assert.strictEqual(result.processMap.length, 4);
});

test('Discovery Engine: Scenario (c) wa -> other -> free text -> weekly -> fewerr', () => {
  const answers = {
    recv: 'wa',
    proc: { otherText: 'Pencatatan khusus di sistem POS kasir kustom' },
    p_free: { otherText: 'Sering tertunda karena kasir sibuk melayani antrean' },
    freq: 'weekly',
    goal: 'fewerr',
  };

  const result = buildResult(answers);
  assert.strictEqual(result.priority, 'Perlu diperhatikan');
  assert.strictEqual(result.isLimited, true);
  assert.ok(result.finding.includes('analisis di sini masih terbatas'));
  assert.ok(result.limitedNote?.includes('masih terbatas'));
  // No invented findings:
  assert.strictEqual(result.relevantProducts.length, 0);
});

