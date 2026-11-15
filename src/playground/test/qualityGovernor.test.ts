import { test } from 'node:test';
import assert from 'node:assert';
import { QualityGovernor } from '../scene/qualityGovernor';

test('qualityGovernor: steps down tiers on high frame times and does not step back up', () => {
  const governor = new QualityGovernor();
  governor.forceTier('high');

  assert.strictEqual(governor.getTier(), 'high');
  assert.strictEqual(governor.getConfig().maxObjects, 7);

  // Record 35 frames with 28ms (> 24ms threshold)
  for (let i = 0; i < 35; i++) {
    governor.recordFrame(28);
  }

  assert.strictEqual(governor.getTier(), 'balanced');
  assert.strictEqual(governor.getConfig().maxObjects, 5);

  // Now record 60 frames with 36ms (> 33ms threshold) to flush the 60-sample window
  for (let i = 0; i < 60; i++) {
    governor.recordFrame(36);
  }

  assert.strictEqual(governor.getTier(), 'low');
  assert.strictEqual(governor.getConfig().enableIdleFloat, false);

  // Even if frame times improve (e.g. 10ms), governor does not upgrade in same session
  for (let i = 0; i < 60; i++) {
    governor.recordFrame(10);
  }

  assert.strictEqual(governor.getTier(), 'low');
});
