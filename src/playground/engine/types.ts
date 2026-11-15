export type QuestionType = 'single' | 'multi' | 'text';

export interface QuestionOption {
  id: string;
  label: string;
  exclusive?: boolean;
  disabled?: boolean;
  disabledNote?: string;
}

export type Answers = Record<string, string | string[]>;

export interface Question {
  id: string;
  phase: 1 | 2 | 3 | 4;
  type: QuestionType;
  text: string;
  textVariants?: (answers: Answers) => string;
  help?: string;
  maxSelect?: number;
  optional?: boolean;
  options: QuestionOption[];
  allowOther: boolean;
  next: (answers: Answers) => string | 'selesai';
}

export type MapNodeId = 'masuk' | 'catat' | 'tindak' | 'rekap';

export type PriorityLevel = 'tinggi' | 'perhatian' | 'peluang';

export interface DigitalOpportunity {
  kind: 'sop' | 'template' | 'spreadsheet' | 'aplikasi' | 'terhubung' | 'otomatis';
  text: string;
}

export interface Finding {
  id: string;
  title: string;
  trigger: (answers: Answers) => boolean;
  supportingAnswers: (answers: Answers) => { questionId: string; optionId: string }[];
  tags: string[]; // problemTags
  mapNode: MapNodeId;
  indication: string;
  firstSteps: string[];
  digitalOpportunity?: DigitalOpportunity;
  reviewStatus: 'draft';
}

export interface EvaluatedFinding extends Finding {
  priority: PriorityLevel;
  priorityLabel: 'Prioritas tinggi' | 'Perlu diperhatikan' | 'Peluang pengembangan';
  supportingFacts: string[]; // Answer labels
}

export interface ProcessMapNode {
  id: MapNodeId;
  title: string;
  sublabel: string;
  hasInfo: boolean;
  findingNumbers: number[];
}

export interface AnalysisResult {
  summary: string;
  isLimitedInfo: boolean;
  limitedInfoNotice?: string;
  nodes: ProcessMapNode[];
  findings: EvaluatedFinding[];
  priorities: {
    tinggi: EvaluatedFinding[];
    perhatian: EvaluatedFinding[];
    peluang: EvaluatedFinding[];
  };
  generalFirstSteps: string[];
  recommendedProducts: RecommendedProduct[];
  generatedAt: string;
}

export type ProductCategory = 'Templat & Prompt' | 'Alat Mini' | 'Paket Otomasi';
export type ProductFormat = 'Aplikasi web' | 'PDF' | 'Spreadsheet' | 'Prompt' | 'Workflow';
export type ProductAccess = 'gratis' | 'berbayar' | 'langganan';

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  summary: string;
  benefit: string;
  problemSolved: string;
  format: ProductFormat;
  access: ProductAccess;
  price?: number; // in IDR
  previewText?: string;
  previewImage?: string;
  usage: string;
  requirements: string;
  solvesTags: string[];
  featured?: boolean;
  ctaHref: string;
  updatedAt: string;
  isExample?: boolean;
}

export interface RecommendedProduct {
  product: Product;
  matchedFindingTitle: string;
  reason: string;
}

