export interface YearStop {
  type: 'year';
  nav: string;
  when: string;
  role: string;
  quote: string;
  points: string[];
  tags: string[];
}

export interface DoorStop {
  type: 'door';
  nav: string;
  when: string;
  role: string;
  text: string;
}

export type Stop = YearStop | DoorStop;

export interface JourneyIntroData {
  eyebrow: string;
  h1: string;
  lede: string;
  description: string;
  chips: string[];
}

export const JOURNEY_INTRO: JourneyIntroData = {
  eyebrow: 'Tokoh / Perjalanan',
  h1: 'Perjalanan karir yang saya mulai dari 2017',
  lede: 'Seiring waktu, peran saya berkembang dari menulis kode, memahami solusi sesuai dengan kebutuhan pengguna, hingga memimpin pengembangan teknologi.',
  description: 'Scroll untuk menaiki setiap anak tangga perjalanan karier saya',
  chips: [
    'Enterprise Architecture',
    'Product Management',
    'Software Development',
    'AI & Business Automation',
  ],
};

export const STOPS: Stop[] = [
  {
    type: 'year',
    nav: '2017',
    when: '2017 – 2021',
    role: 'Frontend Developer',
    quote: '"Lebih dari sekadar antarmuka untuk membangun solusi digital yang bermakna."',
    points: [
      'Telkom Indonesia — Solusi Digital Billing & Reporting',
      'Astra Group — Platform Layanan Finansial Digital',
      'HM Sampoerna — Portal Laporan Operasional',
    ],
    tags: ['Frontend Development', 'UI Architecture', 'React.js & Next.js', 'JavaScript & TypeScript', 'API Integration & State Management'],
  },
  {
    type: 'year',
    nav: '2021',
    when: '2021 – 2023',
    role: 'Product Owner',
    quote: '“Saya belajar melihat teknologi dari sudut pandang yang lebih luas, memahami kebutuhan bisnis, dan arah pengembangan produk.”',
    points: [
      'Mengidentifikasi kebutuhan dan permasalahan bisnis',
      'Menentukan prioritas pengembangan produk',
      'Menerjemahkan kebutuhan menjadi solusi digital',
      'Mengawal pengembangan produk integrasi dan pengolahan data'
    ],
    tags: ['Agile & Scrum', 'Product Strategy & Roadmapping', 'Stakeholder management'],
  },
  {
    type: 'year',
    nav: '2024',
    when: '2024 – Sekarang',
    role: 'Technical Lead',
    quote: '“Memastikan tim bergerak ke arah yang sama dan menghasilkan solusi digital yang berkualitas.”',
    points: [
      'Memimpin pengembangan aplikasi enterprise dan dashboard bisnis',
      'Menentukan standar dan struktur pengembangan aplikasi',
      'Mengarahkan tim melalui perencanaan, evaluasi, dan pendampingan teknis',
    ],
    tags: ['Architecture & System Design', 'Code Quality & Engineering Best Practices', 'Technical Team Management & Mentoring', 'Agile Delivery & Technical Project Management'],
  },
  {
    type: 'year',
    nav: 'Sekarang',
    when: 'Sekarang',
    role: 'Founder, Rasanara',
    quote: '“Sekarang, saya membangun solusi teknologi yang membantu bisnis bekerja lebih efisien dan berkembang.”',
    points: [
      'Mengembangkan solusi otomasi untuk menyederhanakan proses bisnis',
      'Mengintegrasikan AI untuk meningkatkan produktivitas dan efisiensi operasional',
      'Membantu bisnis beradaptasi melalui digitalisasi dan solusi berbasis teknologi',
    ],
    tags: ['AI Automation', 'Workflow Automation', 'Web Scraping', 'LLM Integration'],
  },
  {
    type: 'door',
    nav: 'Kontak',
    when: 'Ruang Kolaborasi',
    role: 'Terbuka untuk Kolaborasi.',
    text: 'Semua peluang profesional, proyek digital, kemitraan bisnis, atau diskusi seputar teknologi, AI, dan inovasi.',
  },
];

