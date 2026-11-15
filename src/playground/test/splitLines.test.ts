import { test } from 'node:test';
import assert from 'node:assert';
import { prepareAccessibleSplit } from '../motion/splitLines';

test('splitLines: accessible text representation remains completely intact', () => {
  const sentence = 'Tempat mencoba, menemukan, dan membawa pulang alat yang berguna.';
  const result = prepareAccessibleSplit(sentence);

  assert.strictEqual(result.fullText, sentence);
  assert.ok(result.words.length > 5);
  assert.strictEqual(result.words.join(' '), sentence);
});

