export const SHOW_FREE_NOTE = false;

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionItem {
  id: string;
  text: string;
  help?: string;
  isFreeText?: boolean;
  options?: QuestionOption[];
  next: (val: string) => string;
}

export const QUESTIONS: Record<string, QuestionItem> = {
  recv: {
    id: 'recv',
    text: 'Bagaimana bisnis Anda biasanya menerima pesanan?',
    help: 'Pilih yang paling sering terjadi.',
    options: [
      { value: 'wa', label: 'Lewat WhatsApp atau chat pelanggan' },
      { value: 'mkt', label: 'Lewat marketplace atau platform online' },
      { value: 'direct', label: 'Langsung, pelanggan datang ke toko' },
      { value: 'mix', label: 'Campuran dari beberapa cara' },
    ],
    next: () => 'proc',
  },
  proc: {
    id: 'proc',
    text: 'Setelah pesanan masuk, apa yang biasanya Anda lakukan?',
    options: [
      { value: 'book', label: 'Mencatat di buku atau kertas' },
      { value: 'sheet', label: 'Memasukkan ke Excel atau Google Sheets' },
      { value: 'app', label: 'Memasukkan ke aplikasi atau sistem' },
      { value: 'fwd', label: 'Meneruskan pesan ke bagian lain' },
      { value: 'chat', label: 'Langsung diproses berdasarkan chat' },
    ],
    next: (val) => {
      if (val === 'book') return 'p_book';
      if (val === 'sheet') return 'p_sheet';
      if (val === 'app') return 'p_app';
      if (val === 'fwd') return 'p_fwd';
      if (val === 'chat') return 'p_chat';
      return 'p_free';
    },
  },
  p_book: {
    id: 'p_book',
    text: 'Apa yang paling sulit dari catatan di buku itu?',
    options: [
      { value: 'find', label: 'Sulit dicari kembali' },
      { value: 'recap', label: 'Sulit direkap' },
      { value: 'miss', label: 'Kadang ketinggalan dicatat' },
      { value: 'none', label: 'Tidak ada kendala berarti' },
    ],
    next: () => 'freq',
  },
  p_sheet: {
    id: 'p_sheet',
    text: 'Apa yang paling sering terjadi dengan spreadsheet Anda?',
    options: [
      { value: 'scatter', label: 'Data tersebar di banyak file' },
      { value: 'copy', label: 'Data yang sama disalin berulang' },
      { value: 'share', label: 'Sulit dipakai bersama' },
      { value: 'none', label: 'Tidak ada kendala berarti' },
    ],
    next: () => 'freq',
  },
  p_app: {
    id: 'p_app',
    text: 'Apakah informasi di aplikasi sudah terhubung ke bagian lain, seperti stok, laporan, atau pengiriman?',
    options: [
      { value: 'partial', label: 'Sebagian saja' },
      { value: 'disconnected', label: 'Belum, masih dipindahkan manual' },
      { value: 'none', label: 'Sudah semuanya' },
    ],
    next: () => 'freq',
  },
  p_fwd: {
    id: 'p_fwd',
    text: 'Bagaimana Anda memastikan pesanan yang diteruskan diterima dan ditindaklanjuti?',
    options: [
      { value: 'recheck', label: 'Menanyakan ulang lewat chat' },
      { value: 'lost', label: 'Kadang ada yang terlewat' },
      { value: 'none', label: 'Sudah ada tanda terima yang jelas' },
    ],
    next: () => 'freq',
  },
  p_chat: {
    id: 'p_chat',
    text: 'Bagaimana Anda mengingat pesanan yang masih berjalan?',
    options: [
      { value: 'scroll', label: 'Menggulir riwayat chat' },
      { value: 'later', label: 'Dicatat belakangan' },
      { value: 'none', label: 'Sudah ada daftar tersendiri' },
    ],
    next: () => 'freq',
  },
  p_free: {
    id: 'p_free',
    text: 'Ceritakan singkat bagaimana prosesnya berjalan dan apa kendalanya.',
    help: 'Tuliskan secara singkat alur yang Anda jalankan.',
    isFreeText: true,
    next: () => 'freq',
  },
  freq: {
    id: 'freq',
    text: 'Seberapa sering kendala itu terjadi?',
    options: [
      { value: 'daily', label: 'Hampir setiap hari' },
      { value: 'weekly', label: 'Beberapa kali seminggu' },
      { value: 'rare', label: 'Sesekali' },
    ],
    next: () => 'goal',
  },
  goal: {
    id: 'goal',
    text: 'Perubahan apa yang paling ingin Anda capai?',
    options: [
      { value: 'fast', label: 'Pekerjaan lebih cepat' },
      { value: 'tidy', label: 'Lebih rapi dan mudah dicari' },
      { value: 'fewerr', label: 'Lebih sedikit kesalahan' },
      { value: 'overview', label: 'Melihat gambaran utuh bisnis' },
    ],
    next: () => 'result',
  },
};

export interface FindingDetail {
  finding: string;
  step: string;
}

export const FINDINGS: Record<string, FindingDetail> = {
  book_find: {
    finding: 'Mencari kembali catatan pesanan memakan waktu karena tersebar di halaman-halaman buku.',
    step: 'Mulai catat pesanan baru dalam satu tabel dengan kolom tetap: tanggal, pelanggan, barang, jumlah, status.',
  },
  book_recap: {
    finding: 'Merekap catatan buku menjadi laporan dikerjakan ulang dari awal.',
    step: 'Pakai kolom yang sama di setiap pesanan agar bisa dijumlahkan, dan rekap pada hari yang tetap setiap minggu.',
  },
  book_miss: {
    finding: 'Ada pesanan yang kadang tidak sempat tercatat, sehingga bergantung pada ingatan.',
    step: 'Tetapkan satu titik pencatatan yang wajib dilewati setiap pesanan sebelum diproses.',
  },
  sheet_scatter: {
    finding: 'Data pesanan tersebar di beberapa file, sehingga sulit melihat gambaran utuh.',
    step: 'Satukan ke satu file induk dengan satu baris per pesanan, dan berhenti membuat file baru per periode.',
  },
  sheet_copy: {
    finding: 'Data yang sama disalin berulang ke beberapa tempat, sehingga rawan selisih.',
    step: 'Tetapkan satu tempat sebagai sumber data utama. Tempat lain hanya membaca darinya.',
  },
  sheet_share: {
    finding: 'Spreadsheet sulit dipakai bersama karena tidak jelas versi mana yang terbaru.',
    step: 'Simpan di satu berkas bersama, dan tetapkan siapa yang boleh mengubah kolom mana.',
  },
  app_partial: {
    finding: 'Aplikasi sudah dipakai, tetapi baru sebagian informasinya terhubung ke bagian lain.',
    step: 'Petakan informasi apa yang masih dipindahkan manual, lalu urutkan dari yang paling sering.',
  },
  app_disconnected: {
    finding: 'Informasi di aplikasi belum terhubung ke bagian lain, sehingga dipindahkan manual.',
    step: 'Catat tiga perpindahan data manual yang paling sering. Itu kandidat pertama untuk dirapikan.',
  },
  fwd_recheck: {
    finding: 'Pesanan yang diteruskan harus dipastikan lagi lewat chat, sehingga memakan waktu.',
    step: 'Minta tanda terima singkat dari penerima, misalnya satu kata baku, setiap pesanan diteruskan.',
  },
  fwd_lost: {
    finding: 'Ada pesanan yang terlewat saat diteruskan ke bagian lain.',
    step: 'Buat satu daftar bersama berisi status tiap pesanan (diterima, diproses, selesai) yang bisa dilihat semua pihak.',
  },
  chat_scroll: {
    finding: 'Pesanan yang masih berjalan harus dicari dengan menggulir riwayat chat.',
    step: 'Siapkan satu daftar pesanan berjalan di luar chat, dan perbarui setiap ada perubahan status.',
  },
  chat_later: {
    finding: 'Pesanan baru dicatat belakangan, sehingga mudah ada yang terlewat.',
    step: 'Catat pesanan saat pesan masuk, walau hanya tiga kolom: pelanggan, barang, status.',
  },
};

export interface ProductItem {
  slug: string;
  name: string;
  category: string;
  access: 'free' | 'premium';
  format: string;
  problem: string;
  description: string;
  requirements: string;
  tags: string[];
  shape: 0 | 1 | 2 | 3;
  fileUrl?: string;
  isPlaceholder: boolean;
}

export const PRODUCTS: ProductItem[] = [
  {
    slug: 'template-pencatatan-pesanan',
    name: 'Template pencatatan pesanan',
    category: 'Template',
    access: 'free',
    format: 'Spreadsheet',
    problem: 'Catatan pesanan tercecer atau sulit direkap',
    description:
      'Lembar kerja siap pakai dengan kolom standar tanggal, nama pelanggan, barang, jumlah, dan status pemrosesan. Dilengkapi rekap otomatis untuk memantau pesanan harian.',
    requirements: 'Google Sheets atau Microsoft Excel.',
    tags: [
      'book_find',
      'book_recap',
      'book_miss',
      'sheet_scatter',
      'sheet_copy',
      'chat_scroll',
      'chat_later',
    ],
    shape: 0,
    isPlaceholder: true,
  },
  {
    slug: 'template-sop-penerimaan-pesanan',
    name: 'Template SOP penerimaan pesanan',
    category: 'Template',
    access: 'free',
    format: 'Dokumen',
    problem: 'Pesanan terlewat atau koordinasi antarbagian tidak seragam',
    description:
      'Panduan tertulis langkah demi langkah saat menerima dan meneruskan pesanan. Memuat daftar periksa tanda terima dan pembagian tugas yang jelas.',
    requirements: 'Aplikasi pembaca PDF atau dokumen Word/Docs.',
    tags: ['fwd_recheck', 'fwd_lost', 'book_miss'],
    shape: 1,
    isPlaceholder: true,
  },
  {
    slug: 'paket-prompt-laporan',
    name: 'Paket prompt laporan',
    category: 'Template dan prompt',
    access: 'premium',
    format: 'Kumpulan prompt',
    problem: 'Merekap data mentah menjadi ringkasan membutuhkan waktu lama',
    description:
      'Kumpulan instruksi siap pakai untuk mengolah data catatan pesanan dan keuangan menjadi laporan mingguan ringkas, siap dibagikan ke tim atau pemilik usaha.',
    requirements: 'ChatGPT, Claude, atau Gemini versi gratis maupun berbayar.',
    tags: ['sheet_scatter', 'book_recap'],
    shape: 2,
    isPlaceholder: true,
  },
  {
    slug: 'alur-otomatis-pesanan-whatsapp',
    name: 'Alur otomatis pesanan WhatsApp',
    category: 'Paket otomasi',
    access: 'premium',
    format: 'Alur n8n beserta panduan',
    problem: 'Memindahkan format pesan WhatsApp ke tabel secara manual setiap hari',
    description:
      'Alur kerja otomasi yang menyalin pesan pesanan berformat dari chat langsung ke Google Sheets, lengkap dengan video dan panduan instalasi mandiri.',
    requirements: 'Akun WhatsApp Business, instance n8n (mandiri atau cloud), dan akun Google.',
    tags: ['chat_later', 'sheet_copy', 'app_disconnected'],
    shape: 3,
    isPlaceholder: true,
  },
];

export const HERO_COPY = {
  eyebrow: 'Digital Playground',
  titleWord1: 'Digital',
  titleWord2: 'Playground',
  lead: 'Tempat mencoba, menemukan, dan membawa pulang alat yang berguna. Discovery untuk pemilik usaha, dan produk digital buatan Rasanara.',
  ctaDiscovery: 'Mulai telusuri bisnis Anda',
  ctaProduct: 'Lihat produk digital',
  badgeText: 'DISCOVERY · PRODUK DIGITAL · RASANARA ·',
};

export const FINALE_COPY = {
  eyebrow: 'Prinsip Kerja',
  title: 'Pahami dulu apa yang perlu diperbaiki, baru pikirkan teknologinya.',
  body: 'Itu cara kami bekerja di Rasanara. Jika Anda ingin membahas hasil Discovery atau kebutuhan digital lainnya, mari mengobrol santai.',
  ctaMessage: 'Kirim pesan',
  ctaRasanara: 'Lihat Rasanara',
  email: 'ridwannurdiyanto93@gmail.com',
};

export const DISCLAIMER_NOTE =
  'Hasil Discovery adalah analisis awal berdasarkan jawaban Anda, bukan audit atau diagnosis bisnis resmi.';

export const PRIVACY_NOTE =
  'Jawaban Anda disimpan di peramban ini saja dan tidak dikirimkan ke server mana pun.';

