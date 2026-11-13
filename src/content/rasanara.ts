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
  backToTerrace: '← Teras',
  toCv: 'Lihat perjalanannya',
  brand: 'Rasanara',
  tagline: 'Digital Partner',
  ctaTopBar: 'Mulai diskusi',
};

export const HERO_COPY = {
  eyebrow: 'Rasanara · Bussiness Growth Partner',
  title: 'Memahami masalahnya. Membangun sistemnya. Mengotomatiskan pekerjaannya.',
  subtitle:
    'Rasanara membantu bisnis mengubah tantangan operasional menjadi sistem digital, otomasi, dan solusi berbasis AI yang praktis.',
  primaryCta: 'Ceritakan proses yang paling merepotkan',
  primaryCtaHref: '#mulai',
  secondaryCta: 'Lihat cara kerja',
  secondaryCtaHref: '#cara',
  captions: {
    rasa: 'Rasa · memahami',
    narasi: 'Narasi · sistem',
  },
};

export const PROBLEMS_CONTENT = {
  sectionEyebrow: 'Tantangan operasional',
  sectionTitle: 'Masalah nyata yang sering ditemui di lapangan',
  note: 'Tidak semua masalah membutuhkan AI. Banyak yang cukup selesai dengan proses yang lebih baik, aplikasi sederhana, atau integrasi dasar.',
  segments: [
    {
      id: 'manufaktur',
      title: 'Manufaktur dan pabrik',
      pains: [
        'pencatatan inventory manual',
        'data stok tidak sinkron antarbagian',
        'monitoring produksi dan operasional sulit dipantau',
        'laporan tersebar di banyak tempat',
        'pembelian dan pengeluaran barang tidak tercatat rapi',
      ],
    },
    {
      id: 'umkm',
      title: 'UMKM yang sudah berjalan',
      pains: [
        'proses bergantung pada spreadsheet dan chat',
        'pemilik sulit melihat kondisi bisnis secara utuh',
        'operasional makin kompleks, kontrol makin sulit',
        'keputusan diambil tanpa data memadai',
      ],
    },
    {
      id: 'layanan',
      title: 'Bisnis layanan dan reservasi',
      pains: [
        'booking dan jadwal bentrok',
        'data pelanggan tersebar',
        'pembayaran dan rekonsiliasi memakan waktu',
        'pelaporan operasional manual',
      ],
    },
    {
      id: 'ecommerce',
      title: 'Seller live dan e-commerce',
      pains: [
        'stok tidak sinkron antar kanal',
        'kesiapan stok sebelum live tidak terpantau',
        'performa penjualan lintas marketplace sulit dibandingkan',
        'harga kompetitor dipantau manual',
      ],
    },
  ] as Segment[],
};

export const PROCESS_CONTENT = {
  sectionEyebrow: 'Metodologi',
  sectionTitle: 'Cara kami bekerja bersama Anda',
  intro:
    'Kami mulai dari ruang lingkup kecil dan menetapkan titik awal pengukuran sebelum membicarakan hasil.',
  steps: [
    {
      number: '01',
      title: 'Memahami',
      detail: 'discovery dan audit proses untuk memetakan alur kerja serta kendala di lapangan.',
    },
    {
      number: '02',
      title: 'Merancang',
      detail: 'ruang lingkup, alur kerja, prioritas, kriteria penerimaan.',
    },
    {
      number: '03',
      title: 'Mencoba',
      detail: 'pilot kecil pada proses nyata.',
    },
    {
      number: '04',
      title: 'Menjalankan',
      detail: 'implementasi, serah terima dengan dokumentasi dan pelatihan, optimasi dan pemeliharaan.',
    },
  ] as ProcessStep[],
};

export const SERVICES_CONTENT = {
  sectionEyebrow: 'Ruang lingkup',
  sectionTitle: 'Layanan',
  subtitle:
    'Solusi disesuaikan dengan kebutuhan nyata bisnis Anda, tanpa penambahan fitur berlebihan.',
  services: [
    {
      number: '01',
      title: 'Audit proses digital',
      description:
        'Memetakan alur kerja saat ini untuk menemukan bagian yang membuang waktu dan rentan kekeliruan.',
    },
    {
      number: '02',
      title: 'Digitalisasi alur kerja',
      description:
        'Menggantikan pencatatan kertas dan spreadsheet lepas menjadi sistem kerja terpadu.',
    },
    {
      number: '03',
      title: 'Aplikasi web dan dashboard',
      description:
        'Membangun perangkat lunak internal yang menyajikan data operasional secara jelas dan terpusat.',
    },
    {
      number: '04',
      title: 'Otomasi dan integrasi AI',
      description:
        'Menyederhanakan tugas berulang dan memanfaatkan kecerdasan buatan untuk mengolah informasi kontekstual.',
    },
    {
      number: '05',
      title: 'Integrasi API dan sistem',
      description:
        'Menghubungkan berbagai kanal dan aplikasi agar data mengalir lancar tanpa masukan berulang.',
    },
    {
      number: '06',
      title: 'Pemeliharaan dan optimasi',
      description:
        'Menjaga keandalan sistem, pembaruan berkala, serta penyesuaian seiring pertumbuhan bisnis.',
    },
  ] as ServiceItem[],
};

export const PRINCIPLES_CONTENT = {
  sectionEyebrow: 'Prinsip',
  sectionTitle: 'Cara kami berpikir',
  principles: [
    {
      title: 'Masalah dulu, teknologi kemudian.',
      description:
        'Kami tidak memaksakan alat canggih bila alur proses dasarnya belum tertata rapi.',
    },
    {
      title: 'AI hanya bila diperlukan.',
      description:
        'Solusi cerdas hanya berguna jika menyelesaikan friksi nyata, bukan sekadar mengikuti tren sesaat.',
    },
    {
      title: 'Biaya dijelaskan sejak awal.',
      description:
        'Ruang lingkup dan estimasi investasi disampaikan transparan tanpa biaya tersembunyi di tengah jalan.',
    },
    {
      title: 'Data tetap milik Anda.',
      description:
        'Seluruh aset, basis data, dan dokumentasi sistem diserahkan penuh untuk kedaulatan bisnis Anda.',
    },
  ] as PrincipleItem[],
};

export const RASA_NARASI_CONTENT = {
  eyebrow: 'Filosofi',
  titleWord1: 'Rasa',
  titleWord2: 'Narasi',
  rasaDefinition:
    'Rasa = memahami kebutuhan dan pengalaman manusia di balik sebuah masalah.',
  narasiDefinition:
    'Narasi = menerjemahkannya menjadi solusi dan pengalaman digital yang bisa dipakai.',
  paragraph:
    'Teknologi hanya alat untuk menyelesaikan masalah orang, bukan sesuatu yang dijual karena sedang tren. Rasanara adalah bagian berikutnya dari perjalanan Ridwan Nurdiyanto: membawa pengalaman sembilan tahun membangun sistem enterprise ke bisnis yang lebih dekat.',
  caseStudyNotice:
    'Studi kasus akan dipublikasikan setelah ada hasil yang terukur dan izin dari klien.',
};

export const CLOSING_CONTENT = {
  heading: 'Ceritakan satu proses yang paling merepotkan di bisnis Anda.',
  intro:
    'Kami mulai dengan mendengarkan, bukan menjual. Dari situ kita lihat bersama apakah memang ada yang bisa dibantu, dan seberapa kecil langkah pertamanya.',
  ctaEmail: 'Kirim pesan',
  emailSubject: 'Konsultasi Rasanara',
  ctaWhatsApp: 'Hubungi via WhatsApp',
  whatsappMessage: 'Halo Rasanara, saya ingin mendiskusikan proses di bisnis saya.',
  closingItalic:
    'Teknologi baru berarti ketika ia menghargai waktu dan harapan orang yang memakainya.',
  freeOfferText:
    'Sesi evaluasi proses terarah (khusus untuk pemetaan alur operasional awal).',
};

