import { Product } from '../engine/types';

export const PRODUCTS: Product[] = [
  {
    slug: 'templat-pencatatan-pesanan-terpusat',
    name: 'Templat Pencatatan Pesanan Terpusat',
    category: 'Templat & Prompt',
    summary:
      'Lembar kerja Google Sheets dan Excel terstruktur untuk mencatat, melacak status, dan merekap transaksi pesanan harian dalam satu tempat.',
    benefit:
      'Membantu Anda mengetahui posisi setiap pesanan pelanggan dan total omzet harian tanpa harus menggabungkan banyak catatan terpisah.',
    problemSolved:
      'Mengatasi catatan pesanan yang tercecer di berbagai ruang obrolan, buku catatan fisik, atau file yang terpisah-pisah.',
    format: 'Spreadsheet',
    access: 'gratis',
    previewText:
      'Tabel siap pakai dengan kolom Tanggal, Nomor Pesanan, Nama Pelanggan, Produk, Jumlah, Status Pembayaran, Status Pengiriman, dan ringkasan bulanan otomatis.',
    usage:
      'Salin templat ke akun Google Drive Anda atau unduh sebagai file Excel, lalu mulai catat setiap pesanan yang masuk.',
    requirements: 'Aplikasi Google Sheets di peramban atau Microsoft Excel.',
    solvesTags: ['pencatatan-terpusat', 'data-tersebar', 'rekap', 'status'],
    featured: true,
    ctaHref: '#',
    updatedAt: '2026-11-01',
    isExample: true,
  },
  {
    slug: 'templat-sop-penanganan-pesanan',
    name: 'Templat SOP Penanganan Pesanan',
    category: 'Templat & Prompt',
    summary:
      'Panduan alur operasional standar tertulis dan daftar periksa (checklist) penanganan pesanan pelanggan dari penerimaan hingga pengiriman.',
    benefit:
      'Memudahkan pendelegasian tugas kepada anggota tim atau staf baru agar proses kerja tetap rapi dan tidak bergantung pada satu orang saja.',
    problemSolved:
      'Mengurangi risiko pesanan terlewat, salah kirim barang, atau timbingan tugas yang tidak jelas antar staf.',
    format: 'PDF',
    access: 'gratis',
    previewText:
      'Dokumen 4 halaman berisi diagram alur proses sederhana, tanggung jawab per peran, daftar periksa harian, dan templat catatan komplain.',
    usage:
      'Cetak atau bagikan dokumen ke tim Anda, sesuaikan bagian nama petugas, dan tempelkan di ruang kerja sebagai panduan harian.',
    requirements: 'Aplikasi pembaca PDF standar.',
    solvesTags: ['sop', 'tindak-lanjut', 'delegasi'],
    featured: true,
    ctaHref: '#',
    updatedAt: '2026-11-01',
    isExample: true,
  },
  {
    slug: 'paket-otomasi-whatsapp-ke-spreadsheet',
    name: 'Paket Otomasi Pesanan WhatsApp ke Spreadsheet',
    category: 'Paket Otomasi',
    summary:
      'Alur kerja yang menghubungkan pesan konfirmasi pesanan dari WhatsApp agar langsung tercatat rapi di Google Sheets tanpa perlu disalin manual.',
    benefit:
      'Menghemat waktu pengerjaan administrasi harian dan meminimalkan kesalahan ketik saat memindahkan data pesanan dari chat.',
    problemSolved:
      'Menghilangkan pekerjaan menyalin data secara berulang dari pesan chat ke lembar pembukuan.',
    format: 'Workflow',
    access: 'berbayar',
    price: undefined, // Harga menyusul
    previewText:
      'File alur kerja n8n atau Make siap impor beserta panduan konfigurasi webhook dan panduan format pesan WhatsApp terstruktur.',
    usage:
      'Impor file konfigurasi alur kerja, hubungkan nomor WhatsApp Business Anda, dan arahkan kolom data ke Google Sheets toko Anda.',
    requirements:
      'Akun Google Workspace/Sheets dan platform alur kerja (seperti n8n atau Make self-hosted). Panduan penyambungan disediakan.',
    solvesTags: ['input-ganda', 'pencatatan-terpusat'],
    featured: true,
    ctaHref: '#',
    updatedAt: '2026-11-01',
    isExample: true,
  },
  {
    slug: 'kalkulator-harga-jual',
    name: 'Kalkulator Harga Jual & Margin Usaha',
    category: 'Alat Mini',
    summary:
      'Alat bantu hitung sederhana berbasis web untuk menentukan harga jual produk berdasarkan biaya bahan baku, operasional, dan target laba.',
    benefit:
      'Menghindarkan bisnis dari salah hitung biaya yang dapat menyebabkan penjualan ramai tetapi pembukuan akhir merugi.',
    problemSolved:
      'Kesulitan menghitung porsi biaya tersembunyi seperti kemasan, ongkos kirim rata-rata, dan biaya admin marketplace.',
    format: 'Aplikasi web',
    access: 'gratis',
    previewText:
      'Antarmuka interaktif yang langsung menampilkan rekomendasi harga jual, persentase margin kotor, dan titik impas penjualan.',
    usage:
      'Masukkan komponen biaya bahan dan biaya operasional per unit, tentukan persentase laba yang diinginkan, dan lihat hasilnya.',
    requirements: 'Peramban web modern di komputer atau ponsel.',
    solvesTags: ['rekap'],
    featured: false,
    ctaHref: '#',
    updatedAt: '2026-11-01',
    isExample: true,
  },
  {
    slug: 'prompt-presentasi-ppt',
    name: 'Prompt Panduan Struktur Presentasi Bisnis',
    category: 'Templat & Prompt',
    summary:
      'Kumpulan instruksi teks terstruktur untuk asisten kecerdasan buatan dalam merancang alur slide presentasi bisnis yang ringkas dan terfokus.',
    benefit:
      'Mempercepat penyusunan narasi slide presentasi penawaran atau laporan bulanan tanpa harus mulai dari halaman kosong.',
    problemSolved:
      'Waktu tersita untuk memikirkan urutan penyampaian materi presentasi agar mudah dipahami mitra atau calon pelanggan.',
    format: 'Prompt',
    access: 'gratis',
    previewText:
      'Teks instruksi siap salin dengan bagian pengisian profil bisnis, tujuan presentasi, poin masalah, dan solusi yang ditawarkan.',
    usage:
      'Salin teks prompt, isi bagian dalam tanda kurung siku sesuai bisnis Anda, lalu kirimkan ke asisten AI seperti ChatGPT atau Claude.',
    requirements: 'Aplikasi asisten AI teks pilihan Anda.',
    solvesTags: ['delegasi'],
    featured: false,
    ctaHref: '#',
    updatedAt: '2026-11-01',
    isExample: true,
  },
  {
    slug: 'prompt-laporan-dan-analisis',
    name: 'Prompt Laporan dan Analisis Data Penjualan',
    category: 'Templat & Prompt',
    summary:
      'Panduan instruksi AI untuk menganalisis data rekap penjualan bulanan menjadi kesimpulan produk terlaris dan saran langkah bulan depan.',
    benefit:
      'Membantu Anda membaca pola penjualan toko dan tren musiman tanpa harus menyewa analis data profesional.',
    problemSolved:
      'Data penjualan yang sudah dicatat rapi sering kali hanya menumpuk tanpa ditindaklanjuti menjadi keputusan bisnis.',
    format: 'Prompt',
    access: 'berbayar',
    price: undefined, // Harga menyusul
    previewText:
      'Paket prompt tingkat lanjut dengan formula pembacaan ringkasan tabel dan panduan identifikasi penurunan performa produk.',
    usage:
      'Tempelkan data ringkasan penjualan bulanan ke dalam instruksi prompt untuk mendapatkan ringkasan wawasan secara instan.',
    requirements: 'Aplikasi asisten AI teks pilihan Anda.',
    solvesTags: ['rekap'],
    featured: false,
    ctaHref: '#',
    updatedAt: '2026-11-01',
    isExample: true,
  },
];

