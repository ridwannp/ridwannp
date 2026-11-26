export type DistrictId = 0 | 1 | 2;
export type ProjectStatus = 'built' | 'building' | 'concept';

export interface CaseStudyDecision {
  number: number;
  title: string;
  rationale: string;
}

export interface CaseStudy {
  problem: string;
  decisions: CaseStudyDecision[];
  lessons: string[];
}

export interface ProjectRaw {
  slug: string;
  name: string;
  sub: string;
  district: DistrictId;
  status: ProjectStatus;
  height: number;
  role: string;
  summary: string;
  tech: string[];
  hasCaseStudy: boolean;
  caseStudy?: CaseStudy;
}

export interface Project extends ProjectRaw {
  number: string;
  worldX: number;
  worldZ: number;
}

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  label: string;
  tagline: string;
}

export const DISTRICTS: DistrictInfo[] = [
  {
    id: 0,
    name: 'Enterprise',
    label: 'Enterprise',
    tagline: 'Sistem skala besar, alur kerja finansial, dan platform pelaporan terintegrasi.',
  },
  {
    id: 1,
    name: 'Personal',
    label: 'Personal',
    tagline: 'Eksplorasi produk digital independen dari riset, arsitektur, hingga implementasi.',
  },
  {
    id: 2,
    name: 'Eksperimen',
    label: 'Eksperimen',
    tagline: 'Rancang bangun automasi agen AI, repositori kecerdasan, dan validasi konsep masa depan.',
  },
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  built: 'Dibangun',
  building: 'Sedang dibangun',
  concept: 'Konsep',
};

export const RAW_PROJECTS: ProjectRaw[] = [
  // Enterprise (District 0)
  {
    slug: 'billing-system',
    name: 'Billing & Customer Management',
    sub: 'Perusahaan Gas Negara (PGN)',
    district: 0,
    status: 'built',
    height: 3.0,
    role: 'Lead Frontend Developer',
    summary:
      'Aplikasi enterprise untuk sistem Billing, Account Management, dan Customer Management milik PT Perusahaan Gas Negara (PGN). Sistem ini dirancang untuk menangani operasional bisnis penagihan (billing), manajemen pelanggan korporasi/retail, promosi produk, serta pengaturan sistem korporat secara terpusat.',
    tech: ['Enterprise Application Development', 'Billing Management', 'Customer Management', 'Business Process Digitalization'],
    hasCaseStudy: false,
  },
  {
    slug: 'billing-dashboard',
    name: 'Billing Data Integration, Monitoring, & Reporting Platform',
    sub: 'Telkom Indonesia',
    district: 0,
    status: 'built',
    height: 3.6,
    role: 'Lead Frontend Developer',
    summary:
      'Sebuah enterprise data platform untuk Telkom Indonesia yang mengelola kompleksitas data telekomunikasi, hal yang terkait dengan CDR billing system internal perusahaan. Saya berkontribusi membangun arsitektur frontend untuk data processing monitoring, operational analytics, reporting, serta server dan pipeline health visualization.',
    tech: ['Frontend Architecture', 'State Management', 'Security & Access Control', 'Enterprise Integration'],
    hasCaseStudy: false,
  },
  {
    slug: 'integrasi-data',
    name: 'Data Integration & ETL Orchestration',
    sub: 'Product Owner',
    district: 0,
    status: 'built',
    height: 3.3,
    role: 'Product Owner',
    summary:
      'Platform integrasi data dan otomasi alur kerja tingkat enterprise yang memungkinkan organisasi merancang, mengorkestrasi, dan memantau pipeline data kompleks secara visual. Platform ini menggabungkan pemrosesan ETL, pengelolaan kualitas data, otomasi workflow, pemantauan runtime, serta pelaporan otomatis dalam satu ekosistem terintegrasi.',
    tech: ['Product Strategy & Roadmap', 'ETL & Data Pipeline', 'Agile Product Management', 'Enterprise Data Integration'],
    hasCaseStudy: false,
  },
  {
    slug: 'layanan-keuangan',
    name: 'Identity Matching & Risk Assessment',
    sub: 'Astra Group (TAF, ACC, FIFGROUP)',
    district: 0,
    status: 'built',
    height: 2.7,
    role: 'Frontend Engineer',
    summary:
      'Mengembangkan aplikasi untuk menelusuri riwayat pengajuan leasing dan mendeteksi potensi pengajuan ganda melalui pencocokan identitas, termasuk relasi istri dan anak. Sistem membantu mengidentifikasi kemiripan data antar-pengajuan sebagai dasar analisis risiko dan mendukung keputusan approval atau rejection secara lebih akurat.',
    tech: ['Identity Matching & Data Reconciliation', 'Similarity Detection', 'Financial Data Integration', 'Decision Support System'],
    hasCaseStudy: false,
  },
  {
    slug: 'infrastruktur-pelaporan',
    name: 'Printer Monitoring & Management',
    sub: 'HM Sampoerna',
    district: 0,
    status: 'built',
    height: 2.3,
    role: 'Frontend Developer',
    summary:
      'Mengembangkan platform monitoring terpusat yang terintegrasi dengan perangkat printer untuk memantau status, penggunaan, volume cetak, dan kondisi perangkat secara real-time. Dilengkapi dashboard, usage analytics, reporting, serta monitoring consumables dan error status untuk meningkatkan efisiensi operasional, mengoptimalkan pemeliharaan perangkat, dan mengendalikan biaya printing perusahaan.',
    tech: ['Printer Device Integration', 'Dashboard & Data Visualization', 'Usage Analytics & Reporting', 'Operational Efficiency'],
    hasCaseStudy: false,
  },

  // Dibangun sendiri (District 1)
  {
    slug: 'ppdb-system',
    name: 'Online Student Admission System',
    sub: 'Side Project',
    district: 1,
    status: 'built',
    height: 2.4,
    role: 'Frontend Developer (Nextjs)',
    summary:
      'Platform penerimaan mahasiswa baru yang mendigitalisasi proses pendaftaran, pembayaran, pelaksanaan CBT, hingga pengumuman hasil seleksi. Dilengkapi panel administrasi dan dashboard analytics untuk pengelolaan proses penerimaan.',
    tech: ['Digital Registration', 'Payment Integration', 'CBT System', 'Data Analytics'],
    hasCaseStudy: true,
    caseStudy: {
      problem:
        'Kreator dan agensi konten kesulitan mengidentifikasi pola video yang sedang naik daun secara objektif. Mengamati feed secara manual membutuhkan waktu berjam-jam tanpa metrik terukur, sehingga peluang tren sering kali terlewatkan sebelum sempat diadaptasi.',
      decisions: [
        {
          number: 1,
          title: 'Arsitektur Scraping Paralel Multi-Kueri',
          rationale:
            'Menggunakan Apify actor dengan worker paralel dan rate limiting adaptif untuk mengumpulkan ribuan video per kueri tanpa terblokir oleh mekanisme anti-bot platform.',
        },
        {
          number: 2,
          title: 'Algoritma Skoring Viralitas Berbasis Rasio Kecepatan',
          rationale:
            'Alih-alih hanya mengandalkan total tayangan absolut, skor viralitas dihitung dari rasio pertumbuhan engagement terhadap usia tayang konten, memberikan sinyal lebih akurat untuk video yang baru mulai meroket.',
        },
        {
          number: 3,
          title: 'Kurasi dan Ekstraksi Hook Menggunakan Claude API',
          rationale:
            'Transkripsi audio 3 detik pertama dianalisis oleh LLM untuk mengkategorikan pola hook emosional dan visual yang dapat langsung direplikasi oleh tim kreatif.',
        },
      ],
      lessons: [
        'Metrik rasio kecepatan tayang jauh lebih prediktif daripada total penayangan kumulatif untuk menemukan tren mikro di tahap awal.',
        'Penanganan error pada proses scraping pihak ketiga harus bersifat desentralisasi; kegagalan satu batch tidak boleh menghentikan proses kurasi batch lainnya.',
        'Penyajian wawasan berbasis visual ringkas meningkatkan retensi pengguna aktif harian sebesar 40% dibandingkan tabel data mentah.',
      ],
    },
  },
  {
    slug: 'task-management-system',
    name: 'Internal Task Management System',
    sub: 'Side Project',
    district: 1,
    status: 'built',
    height: 2.9,
    role: 'Fullstack Developer',
    summary:
      'Aplikasi manajemen pekerjaan internal untuk digital agency yang mengadopsi konsep Kanban seperti Trello. Memungkinkan tim mengelola task, memantau progres pekerjaan, dan mengatur akses berdasarkan peran pengguna.',
    tech: ['Workflow Management', 'Kanban Board', 'RBAC', 'Role Access'],
    hasCaseStudy: false,
  },
  {
    slug: 'kosan-discovery-matching-platform',
    name: 'Kosan Discovery & Matching Platform',
    sub: 'Proyek pribadi',
    district: 1,
    status: 'building',
    height: 2.2,
    role: 'Maker & Fullstack Developer',
    summary: 'Platform pencarian kos di sekitar kampus yang tidak hanya berdasarkan harga dan lokasi, tetapi juga mencocokkan preferensi calon penghuni dengan karakteristik dan fasilitas tempat tinggal.',
    tech: ['Marketplace Platform', 'Preference Matching', 'AI Recommendation', 'Search & Filtering'],
    hasCaseStudy: false,
  },

  // Eksperimen (District 2)
  {
    slug: 'engineering-sdlc-automation',
    name: 'Engineering Knowledge dan SDLC Automation',
    sub: 'Sedang dikerjakan',
    district: 2,
    status: 'building',
    height: 2.8,
    role: 'Lead Frontend Engineer',
    summary:
      'Platform berbasis AI yang membantu tim engineering mengelola pengetahuan teknis, menstandarkan proses pengembangan software, dan mengotomatisasi aktivitas Software Development Life Cycle (SDLC). Tujuannya mengurangi ketergantungan pada pengetahuan individual, mempercepat onboarding developer, menjaga konsistensi engineering practices, dan meningkatkan efisiensi proses delivery software.',
    tech: ['n8n', 'RAG & Knowledge Retrieval', 'Workflow Orchestration', 'AI-Assisted Software Development'],
    hasCaseStudy: false,
  },
  {
    slug: 'personal-ai-automation-ecosystem',
    name: 'Personal AI Automation Ecosystem',
    sub: 'Sedang dikerjakan',
    district: 2,
    status: 'building',
    height: 2.1,
    role: 'Tahap: Validasi Kebutuhan',
    summary:
      'Ekosistem AI Agent untuk otomasi bisnis, social media automation, Telegram approval, integrasi API, dan workflow orchestration menggunakan hermes, n8n, telegram.',
    tech: ['AI Agent Orchestration', 'Workflow Automation', 'Human-in-the-Loop', 'Process Automation'],
    hasCaseStudy: false,
  },
  {
    slug: 'commerce-intelligence-ai',
    name: 'Commerce Intelligence AI',
    sub: 'Product Concept',
    district: 2,
    status: 'concept',
    height: 3.0,
    role: 'Tahap: Konseptual & Riset',
    summary:
      'Platform business intelligence untuk produsen dan bisnis yang menggabungkan inventory intelligence, sales analytics, purchasing, live commerce monitoring, dan AI-driven recommendations.',
    tech: ['Business Intelligence', 'AI-Powered Analytics', 'Live Commerce Analytics', 'Decision Support System'],
    hasCaseStudy: false,
  },
  {
    slug: 'revenue-opportunity-intelligence',
    name: 'Revenue Opportunity Intelligence',
    sub: 'Product Concept',
    district: 2,
    status: 'concept',
    height: 2.5,
    role: 'Tahap: Konseptual & Riset',
    summary:
      'Platform berbasis AI dan business intelligence yang membantu bisnis mengidentifikasi pertumbuhan revenue melalui analisis penjualan, perilaku pelanggan, performa produk, dan potensi pasar. Menghasilkan insight serta rekomendasi strategis untuk meningkatkan penjualan, mengoptimalkan profitabilitas, dan menemukan sumber pendapatan baru.',
    tech: ['Revenue Intelligence', 'Business Intelligence', 'Market Opportunity Discovery', 'Revenue Growth Strategy'],
    hasCaseStudy: false,
  },
];

// Calculate building positions automatically
// Distance within district: 2.1, Gap between districts: 1.5, Zig-zag z: 0 / -2.0
export function computeProjectPositions(items: ProjectRaw[]): Project[] {
  let currentX = 0;
  let lastDistrict: DistrictId | null = null;

  return items.map((raw, idx) => {
    if (lastDistrict !== null) {
      if (raw.district !== lastDistrict) {
        currentX += 1.5;
      } else {
        currentX += 2.1;
      }
    }
    lastDistrict = raw.district;

    const z = idx % 2 === 0 ? 0 : -2.0;
    const num = (idx + 1).toString().padStart(2, '0');

    return {
      ...raw,
      number: num,
      worldX: currentX,
      worldZ: z,
    };
  });
}

export const PROJECTS: Project[] = computeProjectPositions(RAW_PROJECTS);

export const KARYA_COPY = {
  eyebrow: 'KARYA',
  h1: 'Setiap karya adalah bagian dari perjalanan kami.',
  lede: 'Ada yang telah berdiri, ada yang sedang dibangun, dan ada yang masih menunggu untuk diwujudkan. Jelajahi setiap cerita di baliknya.',
  indexHeading: 'Semua karya',
  enterpriseFootnote:
    'Mari bangun solusi digital yang membuka peluang baru dan mendorong pertumbuhan bisnis Anda.',
  caseStudyAvailable: 'Buka studi kasus lengkap →',
  caseStudyUpcoming: 'Studi kasus lengkap menyusul',
  backToCity: '← Kembali ke kota karya',
  prevWork: 'Karya sebelumnya',
  nextWork: 'Karya selanjutnya',
  fallbackNotice:
    'Tampilan 3D tidak bisa dimuat di browser ini. Daftar karya lengkap tetap tersedia di bawah.',
  legend: {
    built: 'Dibangun',
    building: 'Sedang dibangun',
    concept: 'Konsep',
  },
  districtLabels: {
    0: 'Enterprise',
    1: 'Personal',
    2: 'Eksperimen',
  },
  filterAll: 'Semua',
};

