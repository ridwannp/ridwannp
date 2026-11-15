import { Question } from '../engine/types';

export const QUESTIONS: Question[] = [
  // -------------------------------------------------------------
  // FASE 1: MENGENAL BISNIS
  // -------------------------------------------------------------
  {
    id: 'bidang',
    phase: 1,
    type: 'single',
    text: 'Bisnis Anda paling mirip dengan yang mana?',
    allowOther: true,
    options: [
      { id: 'toko', label: 'Toko atau penjualan langsung' },
      { id: 'fnb', label: 'Makanan dan minuman' },
      { id: 'jasa', label: 'Jasa atau layanan' },
      { id: 'produksi', label: 'Produksi atau pembuatan barang' },
      { id: 'online', label: 'Jualan online' },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'proses',
  },
  {
    id: 'proses',
    phase: 1,
    type: 'single',
    text: 'Proses apa yang ingin Anda tinjau lebih dulu?',
    allowOther: false,
    options: [
      { id: 'pesanan', label: 'Menerima dan memproses pesanan' },
      {
        id: 'penagihan',
        label: 'Penagihan dan pembayaran',
        disabled: true,
        disabledNote: 'Segera hadir',
      },
      {
        id: 'stok',
        label: 'Stok dan persediaan',
        disabled: true,
        disabledNote: 'Segera hadir',
      },
      {
        id: 'laporan',
        label: 'Laporan dan rekap',
        disabled: true,
        disabledNote: 'Segera hadir',
      },
    ],
    next: () => 'terima',
  },

  // -------------------------------------------------------------
  // FASE 2: CARA KERJA SAAT INI
  // -------------------------------------------------------------
  {
    id: 'terima',
    phase: 2,
    type: 'single',
    text: 'Bagaimana bisnis Anda biasanya menerima pesanan?',
    allowOther: true,
    options: [
      { id: 'wa_chat', label: 'Melalui WhatsApp atau chat pelanggan' },
      { id: 'marketplace', label: 'Melalui marketplace atau platform online' },
      { id: 'langsung', label: 'Secara langsung atau datang ke toko' },
      { id: 'campuran', label: 'Campuran dari beberapa cara' },
      { id: 'lainnya', label: 'Cara lainnya' },
    ],
    next: () => 'setelah',
  },
  {
    id: 'setelah',
    phase: 2,
    type: 'single',
    text: 'Setelah pesanan masuk, apa yang biasanya Anda lakukan selanjutnya?',
    textVariants: (answers) => {
      if (answers.terima === 'wa_chat') {
        return 'Setelah pesanan masuk melalui WhatsApp atau chat, apa yang biasanya Anda lakukan selanjutnya?';
      }
      return 'Setelah pesanan masuk, apa yang biasanya Anda lakukan selanjutnya?';
    },
    allowOther: true,
    options: [
      { id: 'catat_manual', label: 'Mencatat pesanan secara manual' },
      { id: 'spreadsheet', label: 'Memasukkan ke Excel atau Google Sheets' },
      { id: 'aplikasi', label: 'Memasukkan ke aplikasi atau sistem' },
      { id: 'teruskan_staf', label: 'Meneruskan pesan ke bagian lain' },
      { id: 'langsung_chat', label: 'Langsung diproses berdasarkan chat' },
      { id: 'lainnya', label: 'Cara lainnya' },
    ],
    next: (answers) => {
      const val = answers.setelah;
      if (val === 'catat_manual') return 'lanjut_catatan_manual';
      if (val === 'spreadsheet') return 'lanjut_spreadsheet';
      if (val === 'aplikasi') return 'lanjut_aplikasi';
      if (val === 'teruskan_staf') return 'lanjut_staf';
      if (val === 'langsung_chat') return 'lanjut_chat';
      return 'lanjut_umum';
    },
  },

  // Cabang setelah
  {
    id: 'lanjut_catatan_manual',
    phase: 2,
    type: 'multi',
    text: 'Apa yang paling sulit dari mencatat pesanan secara manual?',
    allowOther: true,
    options: [
      { id: 'sulit_cari', label: 'Sulit mencari catatan lama' },
      { id: 'sulit_perbarui', label: 'Sulit memperbarui status pesanan' },
      { id: 'sulit_rekap', label: 'Sulit merekap di akhir hari atau bulan' },
      { id: 'catatan_hilang', label: 'Catatan kadang hilang atau rusak' },
      { id: 'tidak_ada', label: 'Tidak ada kesulitan berarti', exclusive: true },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'pelaku',
  },
  {
    id: 'lanjut_spreadsheet',
    phase: 2,
    type: 'multi',
    text: 'Bagaimana data di spreadsheet itu diisi dan dipakai?',
    allowOther: true,
    options: [
      { id: 'salin_berulang', label: 'Saya menyalin dari chat atau pesan secara berulang' },
      { id: 'banyak_file', label: 'Datanya tersebar di beberapa file atau lembar' },
      { id: 'satu_orang', label: 'Hanya satu orang yang bisa mengisinya' },
      { id: 'rapi', label: 'Sudah rapi dan tidak ada kendala', exclusive: true },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'pelaku',
  },
  {
    id: 'lanjut_aplikasi',
    phase: 2,
    type: 'single',
    text: 'Apakah informasi di aplikasi itu sudah terhubung dengan bagian lain, seperti stok, pengiriman, atau keuangan?',
    allowOther: true,
    options: [
      { id: 'terhubung_semua', label: 'Ya, sudah terhubung' },
      { id: 'terhubung_sebagian', label: 'Sebagian saja' },
      { id: 'input_ulang', label: 'Belum, saya harus memasukkan ulang di tempat lain' },
      { id: 'tidak_tahu', label: 'Saya belum yakin' },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'pelaku',
  },
  {
    id: 'lanjut_staf',
    phase: 2,
    type: 'single',
    text: 'Bagaimana Anda memastikan pesanan diterima dan ditindaklanjuti?',
    allowOther: true,
    options: [
      { id: 'tanya_langsung', label: 'Saya tanya langsung atau telepon' },
      { id: 'grup_chat', label: 'Lewat grup chat' },
      { id: 'daftar_tugas', label: 'Ada daftar atau papan tugas bersama' },
      { id: 'tanpa_cara', label: 'Tidak ada cara khusus' },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'pelaku',
  },
  {
    id: 'lanjut_chat',
    phase: 2,
    type: 'single',
    text: 'Bagaimana Anda mengingat pesanan yang sedang berjalan?',
    allowOther: true,
    options: [
      { id: 'ingatan', label: 'Mengandalkan ingatan' },
      { id: 'scroll_chat', label: 'Membuka ulang riwayat chat' },
      { id: 'tandai_chat', label: 'Menandai atau menyematkan chat' },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'pelaku',
  },
  {
    id: 'lanjut_umum',
    phase: 2,
    type: 'text',
    optional: true,
    text: 'Bisa ceritakan singkat bagaimana pesanan ditangani setelah masuk?',
    allowOther: false,
    options: [],
    next: () => 'pelaku',
  },

  {
    id: 'pelaku',
    phase: 2,
    type: 'single',
    text: 'Siapa saja yang terlibat mengurus pesanan?',
    allowOther: false,
    options: [
      { id: 'saya_sendiri', label: 'Saya sendiri' },
      { id: 'dua_tiga', label: 'Saya dan 1–3 orang lain' },
      { id: 'lebih_tiga', label: 'Lebih dari 3 orang' },
    ],
    next: () => 'kendala',
  },

  // -------------------------------------------------------------
  // FASE 3: KENDALA DAN DAMPAK
  // -------------------------------------------------------------
  {
    id: 'kendala',
    phase: 3,
    type: 'multi',
    maxSelect: 3,
    text: 'Kendala apa yang paling sering terjadi?',
    help: 'Pilih sampai 3 kendala utama.',
    allowOther: true,
    options: [
      { id: 'terlewat', label: 'Pesanan terlewat atau lupa diproses' },
      { id: 'salah', label: 'Salah catat atau salah kirim' },
      { id: 'tanya_ulang', label: 'Harus menanyakan ulang informasi ke pelanggan atau rekan' },
      { id: 'status_tak_jelas', label: 'Status pesanan sulit diketahui' },
      { id: 'rekap_lama', label: 'Merekap atau membuat laporan memakan waktu' },
      { id: 'stok_beda', label: 'Jumlah stok tidak sesuai dengan pesanan' },
      { id: 'bayar_tak_tercatat', label: 'Pembayaran atau tagihan terlambat atau tidak tercatat' },
      { id: 'tidak_ada', label: 'Tidak ada kendala berarti', exclusive: true },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: (answers) => {
      const k = answers.kendala;
      if (Array.isArray(k) && k.includes('tidak_ada')) {
        return 'tujuan'; // Lewati frekuensi dan dampak
      }
      return 'frekuensi';
    },
  },
  {
    id: 'frekuensi',
    phase: 3,
    type: 'single',
    text: 'Seberapa sering kendala itu terjadi?',
    allowOther: false,
    options: [
      { id: 'harian', label: 'Hampir setiap hari' },
      { id: 'mingguan', label: 'Beberapa kali seminggu' },
      { id: 'sesekali', label: 'Sesekali dalam sebulan' },
      { id: 'jarang', label: 'Jarang sekali' },
    ],
    next: () => 'dampak',
  },
  {
    id: 'dampak',
    phase: 3,
    type: 'multi',
    text: 'Apa dampaknya bagi bisnis Anda?',
    allowOther: true,
    options: [
      { id: 'komplain', label: 'Pelanggan kecewa atau komplain' },
      { id: 'ulang', label: 'Pekerjaan harus diulang' },
      { id: 'waktu', label: 'Waktu banyak terbuang' },
      { id: 'rugi', label: 'Ada kerugian barang atau uang' },
      { id: 'belum', label: 'Belum terasa dampaknya', exclusive: true },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'tujuan',
  },

  // -------------------------------------------------------------
  // FASE 4: TUJUAN
  // -------------------------------------------------------------
  {
    id: 'tujuan',
    phase: 4,
    type: 'single',
    text: 'Perubahan apa yang paling ingin Anda capai?',
    allowOther: true,
    options: [
      { id: 'rapi', label: 'Pekerjaan lebih rapi dan terdokumentasi' },
      { id: 'cepat', label: 'Pekerjaan lebih cepat' },
      { id: 'sedikit_salah', label: 'Lebih sedikit kesalahan' },
      { id: 'tahu_kondisi', label: 'Tahu kondisi bisnis tanpa harus bertanya ke banyak orang' },
      { id: 'delegasi', label: 'Lebih mudah dibagi ke orang lain' },
      { id: 'lainnya', label: 'Lainnya' },
    ],
    next: () => 'catatan',
  },
  {
    id: 'catatan',
    phase: 4,
    type: 'text',
    optional: true,
    text: 'Ada hal lain yang ingin Anda ceritakan?',
    help: 'Jangan memasukkan data pelanggan atau data pribadi.',
    allowOther: false,
    options: [],
    next: () => 'selesai',
  },
];

