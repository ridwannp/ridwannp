import { AnalysisResult } from '../engine/types';

export interface ResultRepository {
  saveResult(result: AnalysisResult): Promise<string>;
  getResult(id: string): Promise<AnalysisResult | null>;
  clearResult?(id?: string): Promise<void>;
}

const LOCAL_RESULT_PREFIX = 'playground.kenali.result.';

export class LocalResultRepository implements ResultRepository {
  private memoryMap = new Map<string, AnalysisResult>();

  async saveResult(result: AnalysisResult): Promise<string> {
    const id = 'terbaru';
    this.memoryMap.set(id, result);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          `${LOCAL_RESULT_PREFIX}${id}`,
          JSON.stringify(result)
        );
      }
    } catch {
      // Memory fallback holds result
    }

    return id;
  }

  async getResult(id: string = 'terbaru'): Promise<AnalysisResult | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(`${LOCAL_RESULT_PREFIX}${id}`);
        if (item) {
          return JSON.parse(item) as AnalysisResult;
        }
      }
    } catch {
      // Ignore error
    }

    return this.memoryMap.get(id) || null;
  }

  async clearResult(id: string = 'terbaru'): Promise<void> {
    this.memoryMap.delete(id);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(`${LOCAL_RESULT_PREFIX}${id}`);
      }
    } catch {
      // Ignore
    }
  }
}

/**
 * Typed stub for remote storage if needed in the future.
 */
export class RemoteResultRepository implements ResultRepository {
  constructor(private baseUrl: string) {}

  async saveResult(result: AnalysisResult): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
    if (!response.ok) throw new Error('Failed to save result remotely');
    const data = (await response.json()) as { id: string };
    return data.id;
  }

  async getResult(id: string): Promise<AnalysisResult | null> {
    const response = await fetch(`${this.baseUrl}/api/results/${id}`);
    if (!response.ok) return null;
    return (await response.json()) as AnalysisResult;
  }
}

export const localResultRepo = new LocalResultRepository();

