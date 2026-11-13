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
  chips: string[];
}

export const JOURNEY_INTRO: JourneyIntroData = {
  eyebrow: 'Tokoh / Perjalanan',
  h1: 'Perjalanan karir yang saya mulai dari 2017',
  lede: 'Dari design dan development user interface untuk sistem enterprise, sampai membawa ilmunya ke usaha-usaha kecil lewat Rasanara. Scroll untuk menaiki tangganya.',
  chips: [
    'Enterprise Architecture',
    'Product Management',
    'Technical Experience',
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
    quote: '“Dulu, saya mengira pekerjaan selesai saat tampilan sudah sama dengan desain.”',
    points: [
      'Dashboard billing dan reporting untuk Telkom Indonesia (Retail dan Wholesale)',
      'Aplikasi web layanan finansial untuk Astra Group (TAF, ACC, FIFGROUP)',
      'Antarmuka pelaporan operasional untuk HM Sampoerna',
    ],
    tags: ['Frontend Development', 'React.js & Next.js', 'JavaScript & TypeScript', 'API Integration & State Management'],
  },
  {
    type: 'year',
    nav: '2021',
    when: '2021 – 2023',
    role: 'Product Owner',
    quote: '“Setelah jadi Product Owner, saya belajar bahwa fitur paling mahal adalah fitur yang tidak dipakai.”',
    points: [
      'Mengelola backlog dan prioritas berdasarkan dampak bisnis',
      'Menulis user story dan acceptance criteria, serta memimpin UAT',
      'Associate Product Owner untuk produk integrasi data (ETL)',
    ],
    tags: ['Agile & Scrum', 'Product Strategy & Roadmapping', 'Stakeholder management'],
  },
  {
    type: 'year',
    nav: '2024',
    when: '2024 – Sekarang',
    role: 'Lead Frontend Developer',
    quote: '“Setelah jadi Lead, pekerjaan saya bergeser dari menulis kode menjadi membuat tim bisa menulis kode dengan tenang.”',
    points: [
      'Memimpin pengembangan frontend aplikasi enterprise dan dashboard internal',
      'Merancang komponen reusable dan arsitektur frontend',
      'Sprint planning, code review, dan mentoring',
    ],
    tags: ['Frontend Architecture & System Design', 'Code Quality & Engineering Best Practices', 'Technical Team Management & Mentoring', 'Agile Delivery & Technical Project Management'],
  },
  {
    type: 'year',
    nav: 'Sekarang',
    when: 'Sekarang',
    role: 'Founder, Rasanara',
    quote: '“Sekarang, saya membawa semua itu ke usaha yang sedang saya bangun.”',
    points: [
      'Otomasi alur kerja dengan n8n dan WhatsApp Business API',
      'Integrasi AI dengan Claude API dan Azure OpenAI',
      'Digitalisasi untuk UKM Indonesia, dan alat buatan sendiri seperti TikTok Viral Explorer',
    ],
    tags: ['n8n', 'Claude API', 'Azure OpenAI', 'Next.js'],
  },
  {
    type: 'door',
    nav: 'Kontak',
    when: 'Pintu terakhir',
    role: 'Ngobrol dengan saya',
    text: 'Untuk kerja sama, lowongan, atau sekadar bertukar pikiran.',
  },
];

