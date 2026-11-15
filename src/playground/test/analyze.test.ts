import { test } from 'node:test';
import assert from 'node:assert';
import { analyzeAnswers } from '../engine/analyze';
import { Answers } from '../engine/types';

test('analyzeAnswers: evaluates findings and calculates priority correctly', () => {
  const answers: Answers = {
    bidang: 'fnb',
    proses: 'pesanan',
    terima: 'chat',
    setelah: 'langsung_chat',
    lanjut_langsung_chat: ['sering_lupa', 'rekap_manual'],
    pelaku: 'sendiri',
    kendala: ['pesanan_terlewat'],
    frekuensi: 'harian',
    dampak: 'komplain',
    tujuan: 'waktu',
  };

  const result = analyzeAnswers(answers);

  assert.strictEqual(result.isLimitedInfo, false);
  assert.ok(result.findings.length > 0);

  // Finding F1 (pesanan-tersebar-di-chat) should trigger
  const f1 = result.findings.find((f) => f.id === 'pesanan-tersebar-di-chat');
  assert.ok(f1, 'Finding F1 should be triggered');
  // It has evidence in cara kerja and kendala, and frequency is harian -> prioritas tinggi
  assert.strictEqual(f1.priority, 'tinggi');
  assert.strictEqual(f1.priorityLabel, 'Prioritas tinggi');

  // Summary contains narrative
  assert.ok(result.summary.includes('Usaha Anda'));
  assert.ok(result.summary.includes('pesanan'));

  // Process map has 4 nodes
  assert.strictEqual(result.nodes.length, 4);
});

test('analyzeAnswers: detects limited info condition on minimal answers', () => {
  const answers: Answers = {
    bidang: 'lainnya',
    proses: 'pesanan',
    terima: 'lainnya',
    setelah: 'lainnya',
  };

  const result = analyzeAnswers(answers);

  assert.strictEqual(result.isLimitedInfo, true);
  assert.ok(result.limitedInfoNotice);
  assert.ok(result.generalFirstSteps.length >= 2);
});

