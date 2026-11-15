import { test } from 'node:test';
import assert from 'node:assert';
import { recommendProducts } from '../engine/recommend';
import { EvaluatedFinding } from '../engine/types';

test('recommendProducts: recommends up to 3 products matching finding tags', () => {
  const dummyFindings: EvaluatedFinding[] = [
    {
      id: 'f1',
      title: 'Pesanan tercecer di chat',
      tags: ['pencatatan-terpusat', 'data-tersebar', 'status'],
      mapNode: 'catat',
      indication: 'Catatan berserakan di obrolan.',
      firstSteps: ['Gunakan satu lembar rekap.'],
      reviewStatus: 'draft',
      priority: 'tinggi',
      priorityLabel: 'Prioritas tinggi',
      supportingFacts: ['Chat langsung'],
      trigger: () => true,
      supportingAnswers: () => [],
    },
  ];

  const recommendations = recommendProducts(dummyFindings);

  assert.ok(recommendations.length > 0);
  assert.ok(recommendations.length <= 3);

  // Highest matched product should be templat-pencatatan-pesanan-terpusat
  const topProduct = recommendations[0];
  assert.strictEqual(
    topProduct.product.slug,
    'templat-pencatatan-pesanan-terpusat'
  );
  assert.ok(topProduct.reason.includes('Pesanan tercecer di chat'));
});

test('recommendProducts: returns empty list when no findings or no tag matches', () => {
  const recommendations = recommendProducts([]);
  assert.deepStrictEqual(recommendations, []);

  const noMatchFindings: EvaluatedFinding[] = [
    {
      id: 'f-unknown',
      title: 'Kendala antariksa',
      tags: ['unmatched-tag-xyz'],
      mapNode: 'rekap',
      indication: 'Tidak terkait.',
      firstSteps: ['Langkah umum.'],
      reviewStatus: 'draft',
      priority: 'peluang',
      priorityLabel: 'Peluang pengembangan',
      supportingFacts: [],
      trigger: () => true,
      supportingAnswers: () => [],
    },
  ];

  const noMatchResult = recommendProducts(noMatchFindings);
  assert.deepStrictEqual(noMatchResult, []);
});

