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
    name: 'Dibangun sendiri',
    label: 'Dibangun sendiri',
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
    slug: 'billing-dashboard',
    name: 'Billing Dashboard',
    sub: 'Telkom Indonesia Retail',
    district: 0,
    status: 'built',
    height: 3.6,
    role: 'Frontend Developer',
    summary:
      'Dashboard dan sistem pemantauan billing dengan arsitektur frontend yang dapat diskalakan, komponen UI reusable, dan modul pelaporan dinamis.',
    tech: ['Frontend', 'REST API'],
    hasCaseStudy: false,
  },
  {
    slug: 'platform-pelaporan',
    name: 'Platform Pelaporan dan Administrasi',
    sub: 'Telkom Indonesia Wholesale',
    district: 0,
    status: 'built',
    height: 3.1,
    role: 'Frontend Developer',
    summary:
      'Sistem pelaporan untuk proses administrasi dan billing, terintegrasi dengan REST API dan layanan backend enterprise, dengan visualisasi data untuk pemantauan operasional.',
    tech: ['React.js', 'REST API', 'Ant Design'],
    hasCaseStudy: false,
  },
  {
    slug: 'layanan-keuangan',
    name: 'Aplikasi Layanan Keuangan',
    sub: 'Astra Group (TAF, ACC, FIFGROUP)',
    district: 0,
    status: 'built',
    height: 2.7,
    role: 'Frontend Engineer',
    summary:
      'Aplikasi web untuk alur kerja operasional layanan keuangan, mengubah kebutuhan bisnis menjadi solusi web yang responsif dan skalabel.',
    tech: ['React.js', 'Bootstrap'],
    hasCaseStudy: false,
  },
  {
    slug: 'infrastruktur-pelaporan',
    name: 'Infrastruktur Pelaporan',
    sub: 'HM Sampoerna',
    district: 0,
    status: 'built',
    height: 2.3,
    role: 'Frontend Developer',
    summary:
      'Infrastruktur pelaporan web dengan penyajian data interaktif untuk pengguna internal.',
    tech: ['React.js', 'REST API'],
    hasCaseStudy: false,
  },
  {
    slug: 'integrasi-data',
    name: 'Produk Integrasi Data (ETL)',
    sub: 'Associate Product Owner',
    district: 0,
    status: 'built',
    height: 3.3,
    role: 'Associate Product Owner',
    summary:
      'Mengelola backlog, perencanaan sprint, dan prioritas fitur, serta menjembatani tim teknis dan pemangku kepentingan bisnis.',
    tech: ['Product Management', 'Data Architecture', 'Agile'],
    hasCaseStudy: false,
  },

  // Dibangun sendiri (District 1)
  {
    slug: 'tiktok-viral-explorer',
    name: 'TikTok Viral Explorer',
    sub: 'Proyek pribadi',
    district: 1,
    status: 'built',
    height: 2.4,
    role: 'Creator & Engineer',
    summary:
      'Alat riset konten viral dengan skor viralitas, scraping paralel multi-kueri, dan modul pencarian prospek dari Google Maps.',
    tech: ['Next.js 14', 'Apify', 'Claude API'],
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
    slug: 'sekolah-app',
    name: 'SekolahApp',
    sub: 'Proyek pribadi',
    district: 1,
    status: 'built',
    height: 2.9,
    role: 'Fullstack Developer',
    summary:
      'Sistem manajemen sekolah multi-tenant dengan PSB dan hak akses berbasis peran, beserta audit keamanan kodenya.',
    tech: ['Next.js 15', 'Prisma', 'NextAuth v5', 'PostgreSQL'],
    hasCaseStudy: false,
  },
  {
    slug: 'community-hub',
    name: 'communityHub',
    sub: 'Proyek pribadi',
    district: 1,
    status: 'building',
    height: 2.2,
    role: 'Maker & Frontend Lead',
    summary: 'Aplikasi full-stack.',
    tech: ['React', 'Laravel', 'Sanctum'],
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
      'Platform otomasi pengetahuan dan SDLC dengan lima modul di n8n, alur Repository Intelligence sudah dimulai.',
    tech: ['n8n', 'LLM Agent', 'CI/CD'],
    hasCaseStudy: false,
  },
  {
    slug: 'commerce-intelligence-ai',
    name: 'Commerce Intelligence AI',
    sub: 'Konsep',
    district: 2,
    status: 'concept',
    height: 3.0,
    role: 'Tahap: Konseptual & Riset',
    summary:
      'Konsep platform pendukung keputusan commerce dengan Executive Dashboard, Product Management, Inventory Management, dan Live Commerce Command Center.',
    tech: ['ReactJS', 'Tailwind', 'RTK Query'],
    hasCaseStudy: false,
  },
  {
    slug: 'reseller-order-portal',
    name: 'Reseller Order Portal',
    sub: 'Konsep',
    district: 2,
    status: 'concept',
    height: 2.1,
    role: 'Tahap: Validasi Kebutuhan',
    summary:
      'Portal pemesanan mandiri terintegrasi WhatsApp untuk reseller dan distributor lokal.',
    tech: ['WhatsApp Business API', 'Order Management'],
    hasCaseStudy: false,
  },
  {
    slug: 'devskripsi',
    name: 'devskripsi',
    sub: 'Konsep',
    district: 2,
    status: 'concept',
    height: 2.5,
    role: 'Tahap: Desain Antarmuka',
    summary:
      'Konsep platform pendukung skripsi dengan rencana MVP Thesis Topic Generator.',
    tech: ['Knowledge Graph', 'Next.js'],
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
  h1: 'Yang sudah jadi, yang sedang dibangun, dan yang masih gagasan.',
  lede: 'Setiap bangunan adalah satu karya. Bentuknya menunjukkan seberapa jauh ia berjalan. Scroll untuk menyusuri kotanya.',
  indexHeading: 'Semua karya',
  enterpriseFootnote:
    'Pekerjaan enterprise dijelaskan tanpa data internal. Studi kasus lengkap, termasuk keputusan dan pelajarannya, menyusul satu per satu.',
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
    1: 'Dibangun sendiri',
    2: 'Eksperimen',
  },
  filterAll: 'Semua',
};

