import {
  QUESTIONS,
  FINDINGS,
  PRODUCTS,
  ProductItem,
} from '../../content/playground';

export type UserAnswer = string | { otherText: string };

export type DiscoveryAnswers = Record<string, UserAnswer>;

export interface DiscoveryState {
  currentStep: string;
  answers: DiscoveryAnswers;
  history: string[];
}

export interface ProcessNode {
  stepNumber: number;
  title: string;
  label: string;
  isIssue?: boolean;
}

export interface DiscoveryResult {
  summary: string;
  processMap: ProcessNode[];
  finding: string;
  step: string;
  priority: 'Prioritas tinggi' | 'Perlu diperhatikan' | 'Peluang perbaikan';
  reason: string;
  isLimited: boolean;
  limitedNote?: string;
  relevantProducts: ProductItem[];
}

export function getAnswerText(answer?: UserAnswer, questionId?: string): string {
  if (!answer) return '-';
  if (typeof answer === 'object' && 'otherText' in answer) {
    return answer.otherText;
  }

  if (questionId && QUESTIONS[questionId]) {
    const opt = QUESTIONS[questionId].options?.find((o) => o.value === answer);
    if (opt) return opt.label;
  }

  return answer;
}

export function nextQuestionId(state: DiscoveryState): string {
  const currentQ = QUESTIONS[state.currentStep];
  if (!currentQ) return 'result';

  const currentAns = state.answers[state.currentStep];
  if (!currentAns) return state.currentStep;

  if (typeof currentAns === 'object' && 'otherText' in currentAns) {
    if (state.currentStep === 'proc') {
      return 'p_free';
    }
    if (state.currentStep === 'recv') {
      return 'proc';
    }
    if (state.currentStep.startsWith('p_')) {
      return 'freq';
    }
    if (state.currentStep === 'freq') {
      return 'goal';
    }
    if (state.currentStep === 'goal') {
      return 'result';
    }
  }

  const val = typeof currentAns === 'string' ? currentAns : '';
  return currentQ.next(val);
}

export function buildResult(answers: DiscoveryAnswers): DiscoveryResult {
  const recvText = getAnswerText(answers.recv, 'recv');
  const procAns = answers.proc;
  const procText = getAnswerText(procAns, 'proc');

  // Identify which pain question was asked
  let painQId = 'p_free';
  if (typeof procAns === 'string') {
    if (procAns === 'book') painQId = 'p_book';
    else if (procAns === 'sheet') painQId = 'p_sheet';
    else if (procAns === 'app') painQId = 'p_app';
    else if (procAns === 'fwd') painQId = 'p_fwd';
    else if (procAns === 'chat') painQId = 'p_chat';
  }

  const painAns = answers[painQId];
  const painText = getAnswerText(painAns, painQId);
  const freqAns = typeof answers.freq === 'string' ? answers.freq : '';
  const freqText = getAnswerText(answers.freq, 'freq');
  const goalText = getAnswerText(answers.goal, 'goal');

  // Check if user answered with custom text
  const isCustomProc = typeof procAns === 'object' && 'otherText' in procAns;
  const isCustomPain = typeof painAns === 'object' && 'otherText' in painAns;
  const isFreeText = painQId === 'p_free';

  const isLimited = isCustomProc || isCustomPain || isFreeText;

  // Build Summary Sentence
  const summary = `Pesanan masuk ${recvText.toLowerCase()}, lalu ${procText.toLowerCase()}. Kendala yang Anda sebut: ${painText.toLowerCase()}. Terjadi ${freqText.toLowerCase()}. Yang paling ingin Anda capai: ${goalText.toLowerCase()}.`;

  // Process Map (4 nodes)
  const processMap: ProcessNode[] = [
    {
      stepNumber: 1,
      title: 'Pesanan masuk',
      label: recvText,
    },
    {
      stepNumber: 2,
      title: 'Diproses',
      label: procText,
    },
    {
      stepNumber: 3,
      title: 'Kendala',
      label: painText,
      isIssue: true,
    },
    {
      stepNumber: 4,
      title: 'Yang ingin dicapai',
      label: goalText,
    },
  ];

  // Priority from freq
  let priority: 'Prioritas tinggi' | 'Perlu diperhatikan' | 'Peluang perbaikan' = 'Peluang perbaikan';
  if (freqAns === 'daily') {
    priority = 'Prioritas tinggi';
  } else if (freqAns === 'weekly') {
    priority = 'Perlu diperhatikan';
  }

  let finding = '';
  let step = '';
  let relevantKey = '';

  if (isLimited) {
    finding = 'Karena sebagian proses Anda ceritakan dengan kata-kata sendiri, analisis di sini masih terbatas.';
    step = 'Tuliskan alur kerja utama ini ke satu lembar bersama tim Anda untuk memetakan titik yang bisa disederhanakan.';
  } else if (typeof painAns === 'string' && painAns === 'none') {
    finding = 'Anda tidak menyebut kendala berarti pada langkah ini. Peluangnya ada pada pemantauan.';
    step = 'Tentukan satu angka sederhana yang rutin Anda lihat, misalnya jumlah pesanan yang belum selesai.';
  } else if (typeof procAns === 'string' && typeof painAns === 'string') {
    relevantKey = `${procAns}_${painAns}`;
    const item = FINDINGS[relevantKey];
    if (item) {
      finding = item.finding;
      step = item.step;
    } else {
      finding = 'Analisis alur ini masih memerlukan penelusuran lebih lanjut.';
      step = 'Diskusikan alur ini bersama tim untuk menemukan langkah perbaikan terbaik.';
    }
  }

  const reason = `Karena Anda menyebut: ${painText}.`;
  const limitedNote = isLimited ? 'Analisis masih terbatas karena menggunakan jawaban bebas.' : undefined;

  // Find relevant products matching proc_pain key
  const relevantProducts = relevantKey
    ? PRODUCTS.filter((p) => p.tags.includes(relevantKey))
    : [];

  return {
    summary,
    processMap,
    finding,
    step,
    priority,
    reason,
    isLimited,
    limitedNote,
    relevantProducts,
  };
}

