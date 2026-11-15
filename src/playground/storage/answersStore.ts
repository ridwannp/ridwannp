import { BANK_VERSION } from '../data/config';
import { Answers } from '../engine/types';

const STORAGE_KEY = 'playground.kenali.v1';

export interface StoredAnswersData {
  bankVersion: string;
  answers: Answers;
  updatedAt: string;
}

let memoryFallback: StoredAnswersData | null = null;

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getStoredAnswers(): {
  answers: Answers;
  isVersionMismatch: boolean;
} | null {
  try {
    let raw: string | null = null;
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      raw = window.localStorage.getItem(STORAGE_KEY);
    }

    const data: StoredAnswersData | null = raw
      ? (JSON.parse(raw) as StoredAnswersData)
      : memoryFallback;

    if (!data || !data.answers) return null;

    const isVersionMismatch = data.bankVersion !== BANK_VERSION;
    return {
      answers: data.answers,
      isVersionMismatch,
    };
  } catch {
    return null;
  }
}

export function saveAnswers(answers: Answers): void {
  const data: StoredAnswersData = {
    bankVersion: BANK_VERSION,
    answers,
    updatedAt: new Date().toISOString(),
  };

  memoryFallback = data;

  try {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch {
    // Falls back gracefully to memoryFallback
  }
}

export function clearAnswers(): void {
  memoryFallback = null;
  try {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore error
  }
}

