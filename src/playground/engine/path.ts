import { QUESTIONS } from '../data/questions';
import { Answers } from './types';

/**
 * Computes the list of question IDs along the active path according to user answers.
 */
export function computeActivePath(answers: Answers): string[] {
  const path: string[] = [];
  const visited = new Set<string>();
  let currentId: string | 'selesai' = 'bidang';

  while (currentId && currentId !== 'selesai' && !visited.has(currentId)) {
    visited.add(currentId);
    const question = QUESTIONS.find((q) => q.id === currentId);
    if (!question) break;

    path.push(question.id);
    currentId = question.next(answers);
  }

  return path;
}

/**
 * Filters answers to only keep entries that belong to the active question path.
 * Strips out answers given in abandoned branches.
 */
export function filterValidAnswers(answers: Answers): Answers {
  const activePath = new Set(computeActivePath(answers));
  const valid: Answers = {};

  for (const [key, value] of Object.entries(answers)) {
    // If the key is an active question ID or a custom "other" note associated with an active question
    const baseQuestionId = key.endsWith('_lainnya') ? key.replace(/_lainnya$/, '') : key;
    if (activePath.has(baseQuestionId)) {
      valid[key] = value;
    }
  }

  return valid;
}

