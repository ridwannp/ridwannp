export interface Segment {
  id: string;
  title: string;
  pains: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  detail: string;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
}

export interface PrincipleItem {
  title: string;
  description: string;
}

/**
 * Flag penawaran gratis (wajib false secara default sesuai aturan konten)
 */
export const SHOW_FREE_OFFER = false;

export const EMAIL = 'ridwannurdiyanto93@gmail.com';

export const NAV_COPY = {
  backToTerrace: 'Teras',
  toCv: 'Lihat perjalanannya',
  brand: 'Rasanara',
  tagline: 'Digital Partner',
  ctaTopBar: 'Mulai diskusi',
};

export const HERO_COPY = {
  eyebrow: 'Rasanara Digital Bussiness Growth Partner',
  title: 'Memahami masalah bisnisnya. Membangun sistemnya. Meningkatkan efisiensinya',
  subtitle:
    'Rasanara membantu bisnis mengubah tantangan operasional menjadi sistem digital, otomasi, dan solusi berbasis AI yang praktis.',
  primaryCta: 'Ceritakan masalah bisnis Anda',
  primaryCtaHref: '#mulai',
  secondaryCta: 'Lihat cara kerja',
  secondaryCtaHref: '#cara',
  captions: {
    rasa: 'Rasa · memahami',
    narasi: 'Narasi · sistem',
  },
};

export const PROBLEMS_CONTENT = {
  sectionEyebrow: 'Peluang perbaikan dalam proses bisnis',
  sectionTitle: 'Tantangan operasional yang dihadapi bisnis setiap hari',
  note: 'Masalah setiap bisnis berbeda, kami hadir dengan solusi digital yang tepat untuk menyederhanakan dan mengoptimalkan proses kerja.',
  segments: [
    {
      id: 'pendidikan',
      title: 'Pendidikan & Sekolah',
      pains: [
        'Data siswa dan administrasi akademik belum terintegrasi.',
        'Pencatatan administrasi pembayaran masih manual',
        'Komunikasi sekolah dan orang tua belum terpusat',
        'Rekapitulasi nilai, absensi, dan laporan akademik tidak efisien',
        'Proses penerimaan siswa baru belum terotomatisasi'
      ],
    },
    {
      id: 'manufaktur',
      title: 'Manufaktur dan Pabrik',
      pains: [
        'Pencatatan bahan baku dan persediaan masih dilakukan secara manual.',
        'Data stok antara gudang, produksi, dan pembelian sering tidak sesuai',
        'Progres produksi dan penggunaan bahan baku sulit dipantau secara langsung',
        'Pembelian, barang masuk, dan barang keluar tidak tercatat dalam satu sistem',
        'Laporan produksi dan operasional membutuhkan waktu lama untuk dikumpulkan',
      ],
    },
    {
      id: 'umkm',
      title: 'UMKM dan Bisnis Retail',
      pains: [
        'Penjualan dari berbagai platform belum tercatat dalam satu tempat',
        'Pemilik kesulitan mengetahui produk yang paling laku dan paling menguntungkan',
        'Stok sering tidak sesuai dengan jumlah barang yang sebenarnya tersedia',
        'Pencatatan pemasukan, pengeluaran, dan keuntungan masih tersebar',
        'Rekap penjualan dan laporan usaha masih bergantung pada pekerjaan manual'
      ],
    },
    {
      id: 'layanan',
      title: 'Bisnis Jasa dan Reservasi',
      pains: [
        'Permintaan pelanggan masuk dari WhatsApp, media sosial, dan platform lainnya',
        'Jadwal reservasi dan ketersediaan layanan sering mengalami bentrok.',
        'Konfirmasi pembayaran dan pemesanan harus dilakukan satu per satu',
        'Riwayat pelanggan dan status layanan sulit dilacak',
        'Tindak lanjut kepada calon pelanggan sering terlewat karena tidak ada pengingat otomatis'
      ],
    }
  ] as Segment[],
};

export const PROCESS_CONTENT = {
  sectionEyebrow: 'Metodologi',
  sectionTitle: 'Bagaimana kami mengembangkan solusi untuk bisnis Anda',
  intro:
    'Kami mengidentifikasi masalah utama, menentukan solusi yang relevan, dan memastikan setiap langkah memberikan dampak nyata bagi bisnis.',
  steps: [
    {
      number: '01',
      title: 'Memahami',
      detail: 'Mengenali kebutuhan bisnis, memetakan proses kerja, dan mengidentifikasi kendala operasional.',
    },
    {
      number: '02',
      title: 'Merancang',
      detail: 'Menyusun konsep solusi, menentukan prioritas, dan merancang alur kerja sesuai kebutuhan bisnis.',
    },
    {
      number: '03',
      title: 'Mengembangkan',
      detail: 'Membangun dan menguji solusi dalam lingkup terukur sebelum diterapkan secara menyeluruh.',
    },
    {
      number: '04',
      title: 'Mengoptimalkan',
      detail: 'Menerapkan solusi, memberikan dokumentasi dan pelatihan, serta melakukan evaluasi dan pengembangan berkelanjutan.',
    },
  ] as ProcessStep[],
};

export const SERVICES_CONTENT = {
  sectionEyebrow: 'Ruang lingkup',
  sectionTitle: 'Layanan',
  subtitle:
    'Solusi dirancang berdasarkan kebutuhan dan prioritas bisnis untuk memastikan penerapan yang tepat guna dan berkelanjutan.',
  services: [
    {
      number: '01',
      title: 'Website & Digital Presence',
      description:
        'Membangun website profesional untuk memperkuat identitas, informasi, dan kehadiran digital bisnis.',
    },
    {
      number: '02',
      title: 'Custom Business Applications',
      description:
        'Mengembangkan aplikasi berbasis web untuk mendukung kebutuhan dan proses operasional bisnis.',
    },
    {
      number: '03',
      title: 'Dashboard & Business Intelligence',
      description:
        'Mengubah data operasional menjadi informasi yang lebih terstruktur untuk mendukung pengambilan keputusan.',
    },
    {
      number: '04',
      title: 'Workflow & Task Automation',
      description:
        'Mengurangi pekerjaan berulang melalui otomatisasi alur kerja dan pertukaran informasi antarproses.',
    },
    {
      number: '05',
      title: 'AI Solutions & AI Agents',
      description:
        'Mengimplementasikan AI untuk membantu pemrosesan informasi, pencarian pengetahuan, dan pekerjaan operasional.',
    }
  ] as ServiceItem[],
};

export const PRINCIPLES_CONTENT = {
  sectionEyebrow: 'Prinsip',
  sectionTitle: 'Cara kami berpikir',
  principles: [
    {
      title: 'Setiap Bisnis Punya Cerita',
      description:
        'Setiap bisnis memiliki tujuan, tantangan, dan cara kerja yang berbeda. Karena itu, setiap pendekatan perlu dimulai dengan memahami konteksnya.',
    },
    {
      title: 'Berangkat dari Kebutuhan Bisnis',
      description:
        'Kami memahami tujuan, tantangan, dan prioritas bisnis sebelum menentukan solusi dan langkah yang tepat.',
    },
    {
      title: 'Teknologi yang Bekerja untuk Bisnis',
      description:
        'Bukan tentang seberapa canggih teknologinya, tetapi seberapa besar manfaatnya dalam meningkatkan cara kerja dan kinerja bisnis.',
    },
    {
      title: 'Menjaga Bisnis Tetap Adaptif',
      description:
        'Kami ingin menjadi bagian dari perjalanan bisnis dalam menghadapi perubahan, memperbaiki proses, dan menemukan peluang untuk terus berkembang.',
    },
  ] as PrincipleItem[],
};

export const RASA_NARASI_CONTENT = {
  eyebrow: 'Filosofi',
  titleWord1: 'Rasa',
  titleWord2: 'Narasi',
  rasaDefinition:
    'Rasa adalah tentang memahami bisnis, kebutuhan, dan tantangan di balik setiap proses kerja.',
  narasiDefinition:
    'Narasi adalah tentang menerjemahkan pemahaman tersebut menjadi langkah dan solusi nyata melalui teknologi.',
  paragraph:
    'Kami percaya teknologi bukan tujuan akhir. Teknologi adalah salah satu cara untuk membantu bisnis bekerja lebih baik, lebih efisien, dan terus berkembang. Rasanara adalah bagian berikutnya dari perjalanan Founder membawa pengalaman sembilan tahun membangun sistem enterprise ke bisnis yang lebih dekat.',
  caseStudyNotice:
    'Studi kasus akan dipublikasikan setelah ada hasil yang terukur dan izin dari klien.',
};

export const CLOSING_CONTENT = {
  heading: 'Apa yang selama ini menghambat bisnis Anda berkembang?',
  intro:
    'Kami membantu melihat proses bisnis dari sudut pandang yang berbeda, menemukan peluang, dan menentukan langkah perbaikan yang tepat.',
  ctaEmail: 'Kirim pesan',
  emailSubject: 'Konsultasi Rasanara',
  ctaWhatsApp: 'Hubungi via WhatsApp',
  whatsappMessage: 'Halo Rasanara, saya ingin mendiskusikan proses di bisnis saya.',
  closingItalic:
    'Inovasi bukan sekadar menciptakan hal baru, tetapi menghadirkan manfaat yang nyata bagi bisnis.',
  freeOfferText:
    'Sesi evaluasi proses terarah (khusus untuk pemetaan alur operasional awal).',
};

