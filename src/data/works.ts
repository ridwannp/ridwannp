export type WorkCategory = 'Enterprise' | 'Dibangun sendiri' | 'Eksperimen';
export type WorkStatus = 'dibangun' | 'sedang dibangun' | 'konsep';

export interface Work {
  id: string;
  index: string; // '01', '02', etc.
  title: string;
  clientOrContext: string;
  category: WorkCategory;
  status: WorkStatus;
  year?: string;
  summary: string;
  points: string[];
  tags: string[];
  roleNote?: string;
  floors: number; // 3..8 for 3D building height
  href?: string;
}

export const WORK_CATEGORIES = ['Semua', 'Enterprise', 'Dibangun sendiri', 'Eksperimen'] as const;
export type FilterCategory = (typeof WORK_CATEGORIES)[number];

export const WORKS_INTRO = {
  eyebrow: 'KARYA',
  h1: 'Yang sudah jadi, yang sedang dibangun, dan yang masih gagasan.',
  lede: 'Setiap bangunan adalah satu karya. Bentuknya menunjukkan seberapa jauh ia berjalan. Scroll untuk menyusuri kotanya.',
  allSectionH2: 'Semua karya',
  allSectionParagraph:
    'Pekerjaan enterprise dijelaskan tanpa data internal. Studi kasus lengkap, termasuk keputusan dan pelajarannya, menyusul satu per satu.',
  footer: '© Ridwan Nurdiyanto Putra',
  fallbackText: 'Tampilan 3D tidak bisa dimuat di browser ini. Daftar karya ada di bawah.',
  enterpriseNote: 'Pekerjaan enterprise dijelaskan tanpa data internal. Studi kasus lengkap, termasuk keputusan dan pelajarannya, menyusul satu per satu.',
};

export const WORKS: Work[] = [
  {
    id: 'billing-dashboard',
    index: '01',
    title: 'Billing Dashboard',
    clientOrContext: 'Telkom Indonesia Retail',
    category: 'Enterprise',
    status: 'dibangun',
    year: '2017–2021',
    floors: 7,
    summary:
      'Dashboard dan sistem pemantauan billing dengan arsitektur frontend yang dapat diskalakan, komponen UI reusable, dan modul pelaporan dinamis.',
    points: [
      'Arsitektur dashboard billing enterprise untuk transaksi masif',
      'Komponen UI modular dan reusable lintas modul pelaporan',
      'Integrasi data pelaporan real-time dengan latensi rendah',
    ],
    tags: ['Frontend', 'REST API'],
    roleNote: 'Peran: Frontend Developer · Studi kasus lengkap menyusul.',
  },
  {
    id: 'platform-pelaporan-administrasi',
    index: '02',
    title: 'Platform Pelaporan dan Administrasi',
    clientOrContext: 'Telkom Indonesia Wholesale',
    category: 'Enterprise',
    status: 'dibangun',
    year: '2020–2022',
    floors: 6,
    summary:
      'Antarmuka administrasi transaksi dan pelaporan data operasional wholesale berskala nasional dengan sistem audit terpadu.',
    points: [
      'Visualisasi data transaksi wholesale multi-regional',
      'Sistem pemfilteran tabel kompleks dan ekspor laporan terenkripsi',
      'Standardisasi desain antarmuka operasional staf internal',
    ],
    tags: ['React.js', 'REST API', 'Ant Design'],
    roleNote: 'Peran: Frontend Developer · Studi kasus lengkap menyusul.',
  },
  {
    id: 'aplikasi-layanan-keuangan',
    index: '03',
    title: 'Aplikasi Layanan Keuangan',
    clientOrContext: 'Astra Group (TAF, ACC, FIFGROUP)',
    category: 'Enterprise',
    status: 'dibangun',
    year: '2021–2023',
    floors: 7,
    summary:
      'Aplikasi web layanan keuangan dan pembiayaan untuk grup otomotif dan multifinance dengan formulir multi-langkah dan verifikasi data.',
    points: [
      'Optimasi performa form aplikasi kredit dinamis',
      'Komponen terpadu lintas unit bisnis Astra multifinance',
      'Antarmuka responsif ramah pengguna untuk pengajuan cepat',
    ],
    tags: ['React.js', 'Bootstrap', 'Design System'],
    roleNote: 'Peran: Frontend Engineer · Studi kasus lengkap menyusul.',
  },
  {
    id: 'infrastruktur-pelaporan',
    index: '04',
    title: 'Infrastruktur Pelaporan',
    clientOrContext: 'HM Sampoerna',
    category: 'Enterprise',
    status: 'dibangun',
    year: '2023',
    floors: 5,
    summary:
      'Sistem pelaporan operasional terdistribusi untuk monitoring harian rantai pasok dan operasional logistik tembakau.',
    points: [
      'Monitoring real-time metrik distribusi dan pergudangan',
      'Dashboard analitik performa armada dan ketersediaan stok',
    ],
    tags: ['React.js', 'Data Visualization', 'REST API'],
    roleNote: 'Peran: Frontend Developer · Studi kasus lengkap menyusul.',
  },
  {
    id: 'produk-integrasi-data',
    index: '05',
    title: 'Produk Integrasi Data (ETL)',
    clientOrContext: 'Associate Product Owner',
    category: 'Enterprise',
    status: 'dibangun',
    year: '2023–2024',
    floors: 6,
    summary:
      'Manajemen siklus hidup produk platform integrasi data dan analitik alur kerja bisnis dari tahap riset hingga perilisan versi produksi.',
    points: [
      'Penyusunan product backlog, PRD, dan metrik keberhasilan fitur',
      'Penyelarasan kebutuhan stakeholder teknis dan non-teknis',
    ],
    tags: ['Product Management', 'Data Architecture', 'Agile'],
    roleNote: 'Peran: Associate Product Owner · Studi kasus lengkap menyusul.',
  },
  {
    id: 'tiktok-viral-explorer',
    index: '06',
    title: 'TikTok Viral Explorer',
    clientOrContext: 'Proyek pribadi',
    category: 'Dibangun sendiri',
    status: 'dibangun',
    year: '2024',
    floors: 6,
    summary:
      'Alat kurasi dan eksplorasi analitik tren konten video pendek berbasis kecerdasan buatan untuk mengidentifikasi pola viralitas.',
    points: [
      'Agregasi data tren dan pengelompokan tema konten',
      'Pemanfaatan model AI untuk perangkuman dan wawasan kreator',
    ],
    tags: ['Next.js', 'Claude API', 'Tailwind CSS'],
    roleNote: 'Peran: Creator & Engineer · Eksplorasi aktif.',
  },
  {
    id: 'sekolah-app',
    index: '07',
    title: 'SekolahApp',
    clientOrContext: 'Proyek pribadi',
    category: 'Dibangun sendiri',
    status: 'dibangun',
    year: '2023–2024',
    floors: 5,
    summary:
      'Platform sistem informasi manajemen sekolah modern untuk efisiensi administrasi guru, penilaian akademik, dan komunikasi wali murid.',
    points: [
      'Modul absensi digital dan rekapitulasi nilai otomatis',
      'Portal terintegrasi dengan aksesibilitas tinggi di perangkat seluler',
    ],
    tags: ['React.js', 'Node.js', 'PostgreSQL'],
    roleNote: 'Peran: Fullstack Developer.',
  },
  {
    id: 'community-hub',
    index: '08',
    title: 'communityHub',
    clientOrContext: 'Proyek pribadi',
    category: 'Dibangun sendiri',
    status: 'sedang dibangun',
    year: '2024',
    floors: 5,
    summary:
      'Platform interaksi dan kolaborasi komunitas dengan integrasi percakapan dan manajemen kegiatan terdesentralisasi.',
    points: [
      'Ruang percakapan berbasis topik dengan sinkronisasi instan',
      'Sistem RSVP acara dan direktori anggota terverifikasi',
    ],
    tags: ['Next.js', 'TypeScript', 'Supabase'],
    roleNote: 'Peran: Maker & Frontend Lead.',
  },
  {
    id: 'engineering-sdlc-automation',
    index: '09',
    title: 'Engineering Knowledge dan SDLC Automation',
    clientOrContext: 'Sedang dikerjakan',
    category: 'Dibangun sendiri',
    status: 'sedang dibangun',
    year: '2024',
    floors: 6,
    summary:
      'Automasi alur pengembangan perangkat lunak dan repositori pengetahuan teknis berbasis alur kerja bot dan agent AI.',
    points: [
      'Automasi checklist tinjauan kode dan ringkasan PR otomatis',
      'Repositori pengetahuan internal yang dapat dicari lewat obrolan',
    ],
    tags: ['n8n', 'LLM Agent', 'CI/CD'],
    roleNote: 'Peran: Lead Frontend Engineer.',
  },
  {
    id: 'commerce-intelligence-ai',
    index: '10',
    title: 'Commerce Intelligence AI',
    clientOrContext: 'Konsep',
    category: 'Eksperimen',
    status: 'konsep',
    year: 'Konsep',
    floors: 4,
    summary:
      'Asisten analitik cerdas untuk rekomendasi harga dan prediksi permintaan pada toko daring UKM berbasis model bahasa besar.',
    points: [
      'Prakiraan inventaris dan rekomendasi pemesanan ulang bahan baku',
      'Simulasi respons harga kompetitor secara otomatis',
    ],
    tags: ['AI Agent', 'Analytics', 'Automation'],
    roleNote: 'Tahap: Konseptual & Riset Pengguna.',
  },
  {
    id: 'reseller-order-portal',
    index: '11',
    title: 'Reseller Order Portal',
    clientOrContext: 'Konsep',
    category: 'Eksperimen',
    status: 'konsep',
    year: 'Konsep',
    floors: 4,
    summary:
      'Portal pemesanan mandiri terintegrasi WhatsApp untuk reseller dan distributor lokal tanpa instalasi aplikasi tambahan.',
    points: [
      'Sinkronisasi katalog produk instan lewat webhook WhatsApp',
      'Format checkout ringkas yang dapat diselesaikan dalam 30 detik',
    ],
    tags: ['WhatsApp Business API', 'Order Management'],
    roleNote: 'Tahap: Validasi Kebutuhan Pasar.',
  },
  {
    id: 'devskripsi',
    index: '12',
    title: 'devskripsi',
    clientOrContext: 'Konsep',
    category: 'Eksperimen',
    status: 'konsep',
    year: 'Konsep',
    floors: 4,
    summary:
      'Ruang kerja terstruktur dan kurasi referensi komputasi untuk mahasiswa teknik informatika dalam menyusun arsitektur skripsi.',
    points: [
      'Pemetaan graf relasi topik dan referensi paper ilmiah',
      'Templat kode boilerplates untuk validasi eksperimen cepat',
    ],
    tags: ['Knowledge Graph', 'Next.js'],
    roleNote: 'Tahap: Desain Antarmuka & Riset.',
  },
];
