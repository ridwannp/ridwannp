import {
  AnalysisResult,
  Answers,
  EvaluatedFinding,
  PriorityLevel,
} from './types';
import { FINDINGS } from '../data/findings';
import { QUESTIONS } from '../data/questions';
import { PLAYGROUND_CONFIG } from '../data/config';
import { filterValidAnswers } from './path';
import { buildProcessMap } from './processMap';
import { recommendProducts } from './recommend';

function getQuestionAndOptionLabel(
  questionId: string,
  optionId: string,
  answers: Answers
): string {
  const q = QUESTIONS.find((item) => item.id === questionId);
  if (!q) return optionId;

  if (optionId === 'lainnya') {
    const customText = answers[`${questionId}_lainnya`];
    return customText ? `Lainnya: "${customText}"` : 'Lainnya';
  }

  const opt = q.options.find((item) => item.id === optionId);
  return opt ? opt.label : optionId;
}

function generateSummary(answers: Answers): string {
  const bidangQ = QUESTIONS.find((q) => q.id === 'bidang');
  const terimaQ = QUESTIONS.find((q) => q.id === 'terima');
  const setelahQ = QUESTIONS.find((q) => q.id === 'setelah');
  const pelakuQ = QUESTIONS.find((q) => q.id === 'pelaku');
  const tujuanQ = QUESTIONS.find((q) => q.id === 'tujuan');

  const bidangLabel =
    answers.bidang === 'lainnya' && answers.bidang_lainnya
      ? `bidang ${answers.bidang_lainnya}`
      : bidangQ?.options.find((o) => o.id === answers.bidang)?.label?.toLowerCase() || 'bisnis Anda';

  const terimaLabel =
    answers.terima === 'lainnya' && answers.terima_lainnya
      ? answers.terima_lainnya
      : terimaQ?.options.find((o) => o.id === answers.terima)?.label || 'saluran komunikasi langsung';

  const setelahLabel =
    setelahQ?.options.find((o) => o.id === answers.setelah)?.label?.toLowerCase() ||
    'pencatatan yang berjalan';

  const pelakuLabel =
    pelakuQ?.options.find((o) => o.id === answers.pelaku)?.label?.toLowerCase() ||
    'tim operasional';

  const p1 = `Usaha Anda yang bergerak di bidang ${bidangLabel} menerima sebagian besar pesanan melalui saluran ${terimaLabel}.`;
  const p2 = `Setelah pesanan diterima, proses pengelolaan dilanjutkan dengan cara ${setelahLabel}, serta dieksekusi oleh ${pelakuLabel}.`;

  let p3 = '';
  if (Array.isArray(answers.kendala) && answers.kendala.includes('tidak_ada')) {
    p3 =
      'Secara keseluruhan alur saat ini berjalan cukup lancar tanpa hambatan kritis. Fokus utama dapat diarahkan pada menjaga konsistensi dan mempersiapkan kapasitas bila volume bertambah.';
  } else if (Array.isArray(answers.kendala) && answers.kendala.length > 0) {
    p3 = `Terdapat beberapa catatan kendala dalam alur kerja harian yang perlu diselaraskan agar penanganan pesanan lebih teratur dan beban kerja tim berkurang.`;
  } else {
    p3 =
      'Langkah evaluasi berikut dapat membantu menata alur agar lebih rapi, terukur, dan mudah didelegasikan.';
  }

  if (answers.tujuan) {
    const tujuanOpt = tujuanQ?.options.find((o) => o.id === answers.tujuan);
    if (tujuanOpt) {
      p3 += ` Sasaran perbaikan terpenting yang Anda harapkan adalah: ${tujuanOpt.label.toLowerCase()}.`;
    }
  }

  return `${p1}\n\n${p2}\n\n${p3}`;
}

export function analyzeAnswers(rawAnswers: Answers): AnalysisResult {
  const validAnswers = filterValidAnswers(rawAnswers);

  // 1. Evaluate Findings
  const evaluatedFindings: EvaluatedFinding[] = [];

  for (const finding of FINDINGS) {
    if (finding.trigger(validAnswers)) {
      const supporting = finding.supportingAnswers(validAnswers);

      // Convert supporting answers to human-readable strings
      const supportingFacts = supporting.map((item) =>
        getQuestionAndOptionLabel(item.questionId, item.optionId, validAnswers)
      );

      // Determine evidence groups in the context of this finding and the overall workflow:
      // Group 1: Cara kerja (terima, setelah, lanjut_*, pelaku)
      const hasCaraKerja =
        supporting.some((item) =>
          [
            'terima',
            'setelah',
            'lanjut_langsung_chat',
            'lanjut_catat_manual',
            'lanjut_spreadsheet',
            'lanjut_aplikasi',
            'lanjut_marketplace',
            'lanjut_staf',
            'pelaku',
          ].includes(item.questionId)
        ) || Boolean(validAnswers.setelah);

      // Group 2: Kendala (kendala reported and not 'tidak_ada')
      const hasKendala =
        supporting.some((item) => item.questionId === 'kendala') ||
        (Array.isArray(validAnswers.kendala) &&
          validAnswers.kendala.length > 0 &&
          !validAnswers.kendala.includes('tidak_ada'));

      // Group 3: Dampak (dampak reported and not 'belum')
      const hasDampak =
        (supporting.some((item) => item.questionId === 'dampak') ||
          Boolean(validAnswers.dampak)) &&
        validAnswers.dampak !== 'belum';

      let evidenceGroupCount = 0;
      if (hasCaraKerja) evidenceGroupCount++;
      if (hasKendala) evidenceGroupCount++;
      if (hasDampak) evidenceGroupCount++;

      const isFrequent =
        validAnswers.frekuensi === 'harian' || validAnswers.frekuensi === 'mingguan';

      // Priority formula:
      // Prioritas tinggi: Evidence in >= 2 groups AND frequency is harian/mingguan
      // Perlu diperhatikan: Evidence in >= 2 groups, OR evidence in kendala with frequency harian/mingguan
      // Peluang pengembangan: all other triggered findings
      let priority: PriorityLevel = 'peluang';
      let priorityLabel: EvaluatedFinding['priorityLabel'] = 'Peluang pengembangan';

      if (evidenceGroupCount >= 2 && isFrequent) {
        priority = 'tinggi';
        priorityLabel = 'Prioritas tinggi';
      } else if (evidenceGroupCount >= 2 || (hasKendala && isFrequent)) {
        priority = 'perhatian';
        priorityLabel = 'Perlu diperhatikan';
      }

      evaluatedFindings.push({
        ...finding,
        priority,
        priorityLabel,
        supportingFacts,
      });
    }
  }

  // Sort findings by priority: tinggi -> perhatian -> peluang
  const priorityOrder: Record<PriorityLevel, number> = {
    tinggi: 3,
    perhatian: 2,
    peluang: 1,
  };

  evaluatedFindings.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  // Check limited info condition:
  // 0 findings OR < 4 answers that are not empty, 'lainnya', or 'tidak_ada'
  let substantiveAnswersCount = 0;
  for (const [key, value] of Object.entries(validAnswers)) {
    if (key.endsWith('_lainnya')) continue;
    if (!value) continue;
    if (value === 'lainnya') continue;
    if (Array.isArray(value)) {
      const nonLainnya = value.filter((v) => v !== 'lainnya' && v !== 'tidak_ada');
      if (nonLainnya.length > 0) substantiveAnswersCount++;
    } else if (value !== 'tidak_ada') {
      substantiveAnswersCount++;
    }
  }

  const isLimitedInfo =
    evaluatedFindings.length === 0 || substantiveAnswersCount < 4;

  const limitedInfoNotice = isLimitedInfo
    ? PLAYGROUND_CONFIG.result.limitedInfoNotice
    : undefined;

  const nodes = buildProcessMap(validAnswers, evaluatedFindings);
  const recommendedProducts = recommendProducts(evaluatedFindings);

  const priorities = {
    tinggi: evaluatedFindings.filter((f) => f.priority === 'tinggi'),
    perhatian: evaluatedFindings.filter((f) => f.priority === 'perhatian'),
    peluang: evaluatedFindings.filter((f) => f.priority === 'peluang'),
  };

  return {
    summary: generateSummary(validAnswers),
    isLimitedInfo,
    limitedInfoNotice,
    nodes,
    findings: evaluatedFindings,
    priorities,
    generalFirstSteps: PLAYGROUND_CONFIG.generalFirstSteps,
    recommendedProducts,
    generatedAt: new Date().toISOString(),
  };
}
