import { Answers, EvaluatedFinding, MapNodeId, ProcessMapNode } from './types';
import { QUESTIONS } from '../data/questions';

function getOptionLabel(questionId: string, optionIdOrArray: string | string[] | undefined): string {
  if (!optionIdOrArray) return '';
  const q = QUESTIONS.find((item) => item.id === questionId);
  if (!q) return '';

  if (Array.isArray(optionIdOrArray)) {
    return optionIdOrArray
      .map((id) => q.options.find((opt) => opt.id === id)?.label || id)
      .filter(Boolean)
      .join(', ');
  }

  return q.options.find((opt) => opt.id === optionIdOrArray)?.label || String(optionIdOrArray);
}

export function buildProcessMap(
  answers: Answers,
  findings: EvaluatedFinding[]
): ProcessMapNode[] {
  // Determine sublabels from answers
  const terimaLabel = getOptionLabel('terima', answers.terima);
  const setelahLabel = getOptionLabel('setelah', answers.setelah);
  const pelakuLabel = getOptionLabel('pelaku', answers.pelaku);

  let rekapLabel = '';
  if (answers.kendala) {
    if (Array.isArray(answers.kendala) && answers.kendala.includes('tidak_ada')) {
      rekapLabel = 'Alur berjalan tanpa kendala berarti';
    } else if (Array.isArray(answers.kendala) && answers.kendala.length > 0) {
      rekapLabel = `${answers.kendala.length} catatan kendala`;
    }
  }

  const nodesConfig: { id: MapNodeId; title: string; defaultSublabel: string; dynamicSublabel: string; hasInfoKey: string }[] = [
    {
      id: 'masuk',
      title: '1. Penerimaan',
      defaultSublabel: 'Pintu masuk pesanan',
      dynamicSublabel: terimaLabel,
      hasInfoKey: 'terima',
    },
    {
      id: 'catat',
      title: '2. Pencatatan',
      defaultSublabel: 'Menyimpan dan mengelola data',
      dynamicSublabel: setelahLabel,
      hasInfoKey: 'setelah',
    },
    {
      id: 'tindak',
      title: '3. Tindak Lanjut',
      defaultSublabel: 'Pemrosesan dan pengerjaan',
      dynamicSublabel: pelakuLabel,
      hasInfoKey: 'pelaku',
    },
    {
      id: 'rekap',
      title: '4. Rekap & Evaluasi',
      defaultSublabel: 'Pemeriksaan hasil dan kendala',
      dynamicSublabel: rekapLabel || 'Peninjauan berkala',
      hasInfoKey: 'kendala',
    },
  ];

  return nodesConfig.map((node) => {
    // Find all 1-based indices of findings associated with this node
    const findingNumbers: number[] = [];
    findings.forEach((finding, index) => {
      if (finding.mapNode === node.id) {
        findingNumbers.push(index + 1);
      }
    });

    const hasInfo = Boolean(answers[node.hasInfoKey]);

    return {
      id: node.id,
      title: node.title,
      sublabel: node.dynamicSublabel || node.defaultSublabel,
      hasInfo,
      findingNumbers,
    };
  });
}

