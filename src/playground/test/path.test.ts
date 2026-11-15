import { test } from 'node:test';
import assert from 'node:assert';
import { computeActivePath, filterValidAnswers } from '../engine/path';
import { Answers } from '../engine/types';

test('computeActivePath: walks normal path for online store with spreadsheet', () => {
  const answers: Answers = {
    bidang: 'online',
    proses: 'pesanan',
    terima: 'marketplace',
    setelah: 'spreadsheet',
    lanjut_spreadsheet: ['sering_keliru'],
    pelaku: 'sendiri',
    kendala: ['stok_beda'],
    frekuensi: 'harian',
    dampak: 'waktu_habis',
    tujuan: 'waktu',
  };

  const path = computeActivePath(answers);

  assert.ok(path.includes('bidang'));
  assert.ok(path.includes('proses'));
  assert.ok(path.includes('terima'));
  assert.ok(path.includes('setelah'));
  assert.ok(path.includes('lanjut_spreadsheet'));
  assert.ok(!path.includes('lanjut_catat_manual'));
  assert.ok(!path.includes('lanjut_langsung_chat'));
  assert.ok(path.includes('pelaku'));
  assert.ok(path.includes('kendala'));
  assert.ok(path.includes('frekuensi'));
  assert.ok(path.includes('dampak'));
  assert.ok(path.includes('tujuan'));
});

test('computeActivePath: skips frekuensi & dampak when kendala includes tidak_ada', () => {
  const answers: Answers = {
    bidang: 'toko',
    proses: 'pesanan',
    terima: 'langsung',
    setelah: 'catat_manual',
    lanjut_catat_manual: ['rekap_lama'],
    pelaku: 'tim',
    kendala: ['tidak_ada'],
    tujuan: 'rekap',
  };

  const path = computeActivePath(answers);

  assert.ok(path.includes('kendala'));
  assert.ok(!path.includes('frekuensi'));
  assert.ok(!path.includes('dampak'));
  assert.ok(path.includes('tujuan'));
});

test('filterValidAnswers: removes answers from abandoned branch', () => {
  const answers: Answers = {
    bidang: 'online',
    proses: 'pesanan',
    terima: 'marketplace',
    setelah: 'spreadsheet', // user chose spreadsheet
    lanjut_spreadsheet: ['sering_keliru'],
    lanjut_catat_manual: ['buku_hilang'], // leftover from previous click
    lanjut_langsung_chat: ['chat_tenggelam'], // leftover
    pelaku: 'sendiri',
    kendala: ['tidak_ada'],
    frekuensi: 'harian', // should be excluded because kendala: ['tidak_ada'] skips frekuensi
    tujuan: 'waktu',
  };

  const cleaned = filterValidAnswers(answers);

  assert.strictEqual(cleaned.setelah, 'spreadsheet');
  assert.deepStrictEqual(cleaned.lanjut_spreadsheet, ['sering_keliru']);
  assert.strictEqual(cleaned.lanjut_catat_manual, undefined);
  assert.strictEqual(cleaned.lanjut_langsung_chat, undefined);
  assert.strictEqual(cleaned.frekuensi, undefined);
  assert.strictEqual(cleaned.tujuan, 'waktu');
});

