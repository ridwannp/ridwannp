import { test } from 'node:test';
import assert from 'node:assert';
import { trackEvent, AnalyticsEvent } from '../analytics/track';

test('trackEvent: safely accepts typed non-PII events without throwing', () => {
  const events: AnalyticsEvent[] = [
    { name: 'kenali_start' },
    { name: 'kenali_step', questionId: 'bidang', stepIndex: 0 },
    {
      name: 'kenali_complete',
      findingsCount: 3,
      prioritiesCount: { tinggi: 1, perhatian: 1, peluang: 1 },
    },
    { name: 'product_view', slug: 'templat-pencatatan-pesanan-terpusat' },
    { name: 'product_click_cta', slug: 'templat-pencatatan-pesanan-terpusat' },
    { name: 'result_whatsapp', withSummary: true },
  ];

  for (const evt of events) {
    assert.doesNotThrow(() => trackEvent(evt));
  }
});

