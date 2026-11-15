import { test } from 'node:test';
import assert from 'node:assert';
import {
  saveAnswers,
  getStoredAnswers,
  clearAnswers,
} from '../storage/answersStore';

test('answersStore: saves and retrieves answers cleanly with correct bankVersion', () => {
  clearAnswers();
  assert.strictEqual(getStoredAnswers(), null);

  const sample = { bidang: 'toko', terima: 'chat' };
  saveAnswers(sample);

  const stored = getStoredAnswers();
  assert.ok(stored);
  assert.deepStrictEqual(stored.answers, sample);
  assert.strictEqual(stored.isVersionMismatch, false);

  clearAnswers();
  assert.strictEqual(getStoredAnswers(), null);
});

