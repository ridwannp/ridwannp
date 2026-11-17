export type AnalyticsEvent =
  | { name: 'kenali_start' }
  | { name: 'kenali_step'; questionId: string; stepIndex: number }
  | {
      name: 'kenali_complete';
      findingsCount: number;
      prioritiesCount: { tinggi: number; perhatian: number; peluang: number };
    }
  | { name: 'kenali_clear' }
  | { name: 'product_view'; slug: string }
  | { name: 'product_click_cta'; slug: string }
  | { name: 'result_copy' }
  | { name: 'result_print' }
  | { name: 'result_whatsapp'; withSummary: boolean };

/**
 * Tracks an anonymous user action. Strictly refuses any user-entered text or PII.
 */
export function trackEvent(event: AnalyticsEvent): void {
  // In development, log safe non-PII events
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[Playground Analytics]', event.name, event);
  }

  // Future integration with privacy-first analytics provider (e.g. Plausible) can be added here
}

