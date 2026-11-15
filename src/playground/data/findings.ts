import { Finding } from '../engine/types';

export const FINDINGS: Finding[] = [
  // F1
  {
    id: 'pesanan-tersebar-di-chat',
    title: 'Pesanan hanya tersimpan di riwayat chat',
    trigger: (a) => a.setelah === 'langsung_chat',
    supportingAnswers: () => [{ questionId: 'setelah', optionId: 'langsung_chat' }],
    tags: ['pencatatan-terpusat', 'status'],
    mapNode: 'catat',
    indication:
      'Pesanan di chat bisa tertimbun percakapan lain, sehingga ada kemungkinan terlewat atau sulit dicari kembali saat diperlukan.',
    firstSteps: [
      'Tentukan satu tempat catatan pesanan (misalnya satu lembar spreadsheet atau buku rekap) dan salin pesanan ke sana segera setelah masuk.',
      'Tulis format catatan minimum: nama pelanggan, rincian barang, jumlah pesanan, tanggal masuk, dan status pemrosesan.',
    ],
    digitalOpportunity: {
      kind: 'template',
      text: 'Templat pencatatan pesanan terpusat bisa menjadi langkah awal yang mudah diterapkan.',
    },
    reviewStatus: 'draft',
  },

  // F2
  {
    id: 'catatan-manual-sulit-diolah',
    title: 'Catatan pesanan manual sulit dicari dan direkap',
    trigger: (a) => {
      if (a.setelah !== 'catat_manual') return false;
      const lanjut = a.lanjut_catatan_manual;
      if (!Array.isArray(lanjut)) return false;
      return lanjut.some((opt) =>
        ['sulit_cari', 'sulit_perbarui', 'sulit_rekap', 'catatan_hilang'].includes(opt)
      );
    },
    supportingAnswers: (a) => {
      const items: { questionId: string; optionId: string }[] = [
        { questionId: 'setelah', optionId: 'catat_manual' },
      ];
      const lanjut = a.lanjut_catatan_manual;
      if (Array.isArray(lanjut)) {
        lanjut.forEach((opt) => {
          if (['sulit_cari', 'sulit_perbarui', 'sulit_rekap', 'catatan_hilang'].includes(opt)) {
            items.push({ questionId: 'lanjut_catatan_manual', optionId: opt });
          }
        });
      }
      return items;
    },
    tags: ['rekap', 'pencatatan-terpusat'],
    mapNode: 'catat',
    indication:
      'Catatan di atas kertas atau buku fisik rentan tercecer, membutuhkan waktu ekstra saat penghitungan akhir bulan, dan tidak bisa diakses bersamaan oleh tim.',
    firstSteps: [
      'Mulailah memindahkan pencatatan harian ke satu lembar spreadsheet berbasis cloud yang bisa dibuka dari ponsel maupun komputer.',
      'Gunakan kolom status yang seragam (misal: Baru, Diproses, Dikirim, Selesai) agar progres pesanan dapat diperbarui dengan cepat.',
    ],
    digitalOpportunity: {
      kind: 'spreadsheet',
      text: 'Format spreadsheet terstandarisasi dengan rumus rekap otomatis dapat menghemat waktu pembukuan harian.',
    },
    reviewStatus: 'draft',
  },

  // F3
  {
    id: 'data-disalin-berulang',
    title: 'Data pesanan disalin berulang kali secara manual',
    trigger: (a) => {
      const lanjut = a.lanjut_spreadsheet;
      return Array.isArray(lanjut) && lanjut.includes('salin_berulang');
    },
    supportingAnswers: () => [{ questionId: 'lanjut_spreadsheet', optionId: 'salin_berulang' }],
    tags: ['input-ganda'],
    mapNode: 'catat',
    indication:
      'Menyalin rincian pesanan dari pesan satu per satu memakan banyak waktu dan membuka peluang salah ketik nama, alamat, atau nominal.',
    firstSteps: [
      'Buat templat pesan pemesanan terstruktur yang meminta pelanggan mengisi data dengan format tetap agar lebih mudah disalin.',
      'Kelompokkan waktu pencatatan di jam-jam tertentu agar fokus kerja tidak terpecah sepanjang hari.',
    ],
    digitalOpportunity: {
      kind: 'otomatis',
      text: 'Sistem yang menghubungkan chat langsung ke spreadsheet secara otomatis dapat meniadakan proses salin-tempel manual.',
    },
    reviewStatus: 'draft',
  },

  // F4
  {
    id: 'data-di-banyak-file',
    title: 'Catatan pesanan tersebar di banyak file atau lembar kerja',
    trigger: (a) => {
      const lanjut = a.lanjut_spreadsheet;
      return Array.isArray(lanjut) && lanjut.includes('banyak_file');
    },
    supportingAnswers: () => [{ questionId: 'lanjut_spreadsheet', optionId: 'banyak_file' }],
    tags: ['data-tersebar', 'pencatatan-terpusat'],
    mapNode: 'catat',
    indication:
      'File yang terpisah-pisah membuat Anda kesulitan mengetahui total penjualan atau stok riil tanpa membuka dan menggabungkan banyak lembar satu per satu.',
    firstSteps: [
      'Satukan seluruh catatan transaksi ke dalam satu file spreadsheet master dengan pembeda kolom bulan atau kategori produk.',
      'Gunakan fitur filter dan pivot table sederhana untuk melihat ringkasan tanpa perlu membuat file baru setiap minggu.',
    ],
    digitalOpportunity: {
      kind: 'template',
      text: 'Templat database penjualan terpadu dapat mencegah tumpang tindih data di berbagai file terpisah.',
    },
    reviewStatus: 'draft',
  },

  // F5
  {
    id: 'aplikasi-belum-terhubung',
    title: 'Aplikasi pencatatan belum terhubung dengan bagian lain',
    trigger: (a) =>
      a.setelah === 'aplikasi' &&
      (a.lanjut_aplikasi === 'terhubung_sebagian' || a.lanjut_aplikasi === 'input_ulang'),
    supportingAnswers: (a) => [
      { questionId: 'setelah', optionId: 'aplikasi' },
      { questionId: 'lanjut_aplikasi', optionId: a.lanjut_aplikasi as string },
    ],
    tags: ['input-ganda', 'status'],
    mapNode: 'catat',
    indication:
      'Memasukkan ulang data yang sudah ada di aplikasi ke catatan pengiriman atau pembukuan lain berpotensi memicu ketidaksinkronan data antar bagian.',
    firstSteps: [
      'Petakan bagian mana yang paling sering meminta data yang sama (misal: bagian kasir dan bagian pengiriman).',
      'Tentukan satu sumber data rujukan agar tim tidak merujuk pada catatan yang berbeda.',
    ],
    digitalOpportunity: {
      kind: 'terhubung',
      text: 'Penyambungan antar aplikasi yang sudah ada dapat memangkas langkah input ganda antar divisi bisnis.',
    },
    reviewStatus: 'draft',
  },

  // F6
  {
    id: 'tindak-lanjut-tidak-terjamin',
    title: 'Tindak lanjut pesanan ke tim belum memiliki alur pasti',
    trigger: (a) =>
      a.setelah === 'teruskan_staf' &&
      (a.lanjut_staf === 'tanya_langsung' || a.lanjut_staf === 'tanpa_cara'),
    supportingAnswers: (a) => [
      { questionId: 'setelah', optionId: 'teruskan_staf' },
      { questionId: 'lanjut_staf', optionId: a.lanjut_staf as string },
    ],
    tags: ['tindak-lanjut', 'sop'],
    mapNode: 'tindak',
    indication:
      'Meneruskan pesanan hanya lewat obrolan lisan atau chat tanpa papan tugas bersama berpotensi membuat pesanan terlupakan saat tim sedang sibuk.',
    firstSteps: [
      'Gunakan satu papan tugas bersama (bisa berupa papan fisik di toko atau tabel tugas bersama online) untuk meletakkan pesanan yang perlu diproses.',
      'Sepakati aturan sederhana: pesanan yang baru masuk diberi tanda belum diproses dan hanya dipindahkan setelah barang siap.',
    ],
    digitalOpportunity: {
      kind: 'sop',
      text: 'Penyusunan SOP alur penanganan pesanan tertulis memastikan setiap staf memahami tanggung jawabnya tanpa perlu ditanya berulang kali.',
    },
    reviewStatus: 'draft',
  },

  // F7
  {
    id: 'bergantung-pada-satu-orang',
    title: 'Operasional pesanan sangat bergantung pada satu orang',
    trigger: (a) => {
      const lanjut = a.lanjut_spreadsheet;
      const isOnePerson = Array.isArray(lanjut) && lanjut.includes('satu_orang');
      const isSoloDelegating = a.pelaku === 'saya_sendiri' && a.tujuan === 'delegasi';
      return Boolean(isOnePerson || isSoloDelegating);
    },
    supportingAnswers: (a) => {
      const items: { questionId: string; optionId: string }[] = [];
      const lanjut = a.lanjut_spreadsheet;
      if (Array.isArray(lanjut) && lanjut.includes('satu_orang')) {
        items.push({ questionId: 'lanjut_spreadsheet', optionId: 'satu_orang' });
      }
      if (a.pelaku === 'saya_sendiri') {
        items.push({ questionId: 'pelaku', optionId: 'saya_sendiri' });
      }
      if (a.tujuan === 'delegasi') {
        items.push({ questionId: 'tujuan', optionId: 'delegasi' });
      }
      return items;
    },
    tags: ['sop', 'delegasi'],
    mapNode: 'tindak',
    indication:
      'Jika hanya satu orang yang memahami cara memproses dan mencatat pesanan, kegiatan bisnis akan tersendat saat orang tersebut berhalangan hadir.',
    firstSteps: [
      'Tuliskan langkah kerja harian dalam bentuk daftar periksa (checklist) yang mudah dibaca oleh anggota tim lain.',
      'Berikan kesempatan kepada rekan kerja untuk mempraktikkan proses tersebut secara mandiri dengan pendampingan bertahap.',
    ],
    digitalOpportunity: {
      kind: 'sop',
      text: 'Panduan operasional standar (SOP) terstruktur mempermudah pendelegasian pekerjaan ke anggota tim baru.',
    },
    reviewStatus: 'draft',
  },

  // F8
  {
    id: 'status-pesanan-tidak-jelas',
    title: 'Status terkini pesanan sulit diketahui secara cepat',
    trigger: (a) => {
      const k = a.kendala;
      return Array.isArray(k) && k.includes('status_tak_jelas');
    },
    supportingAnswers: () => [{ questionId: 'kendala', optionId: 'status_tak_jelas' }],
    tags: ['status'],
    mapNode: 'tindak',
    indication:
      'Ketika status pesanan tidak terlihat jelas, pelanggan atau rekan tim akan sering bertanya balik, sehingga waktu banyak tersita hanya untuk memeriksa ulang posisi barang.',
    firstSteps: [
      'Tetapkan maksimal 4 status pesanan yang mudah dipahami bersama: Diterima, Diproses, Dikirim, Selesai.',
      'Pastikan setiap perubahan status langsung ditandai pada catatan resmi tepat saat tindakan dilakukan.',
    ],
    digitalOpportunity: {
      kind: 'template',
      text: 'Tabel pemantauan pesanan dengan status visual berwarna membantu siapa pun mengetahui progres pesanan dalam sekali lihat.',
    },
    reviewStatus: 'draft',
  },

  // F9
  {
    id: 'rekap-memakan-waktu',
    title: 'Perekapan data dan penyusunan laporan memakan waktu lama',
    trigger: (a) => {
      const k = a.kendala;
      return Array.isArray(k) && k.includes('rekap_lama');
    },
    supportingAnswers: () => [{ questionId: 'kendala', optionId: 'rekap_lama' }],
    tags: ['rekap'],
    mapNode: 'rekap',
    indication:
      'Proses rekap yang lama biasanya disebabkan oleh data yang tidak dicatat seragam sejak awal, sehingga harus dirapikan ulang saat periode tutup buku.',
    firstSteps: [
      'Kunci format pencatatan transaksi agar setiap baris selalu memiliki tanggal, nama barang, dan nominal yang valid.',
      'Lakukan rekapitulasi singkat harian selama 5 menit di akhir jam kerja agar beban tidak menumpuk di akhir bulan.',
    ],
    digitalOpportunity: {
      kind: 'spreadsheet',
      text: 'Templat rekapitulasi otomatis dengan formula terintegrasi dapat langsung memunculkan total penjualan tanpa hitung manual.',
    },
    reviewStatus: 'draft',
  },

  // F10
  {
    id: 'stok-tidak-sinkron',
    title: 'Jumlah stok fisik sering berbeda dengan pesanan yang masuk',
    trigger: (a) => {
      const k = a.kendala;
      return Array.isArray(k) && k.includes('stok_beda');
    },
    supportingAnswers: () => [{ questionId: 'kendala', optionId: 'stok_beda' }],
    tags: ['stok'],
    mapNode: 'tindak',
    indication:
      'Menerima pesanan tanpa pengecekan stok langsung berisiko mengecewakan pembeli karena barang yang dipesan ternyata sudah habis.',
    firstSteps: [
      'Kurangi jumlah stok tercatat tepat saat pesanan dikonfirmasi, bukan saat barang baru akan dikirimkan.',
      'Tetapkan batas persediaan minimum sebagai penanda pengingat kapan barang harus dibuat atau dipesan ulang.',
    ],
    digitalOpportunity: {
      kind: 'template',
      text: 'Sistem pencatatan kartu stok digital sederhana dapat memperingatkan Anda saat persediaan barang menipis.',
    },
    reviewStatus: 'draft',
  },

  // F11
  {
    id: 'pembayaran-tidak-tercatat',
    title: 'Status pembayaran atau tagihan pelanggan rentan terlewat',
    trigger: (a) => {
      const k = a.kendala;
      return Array.isArray(k) && k.includes('bayar_tak_tercatat');
    },
    supportingAnswers: () => [{ questionId: 'kendala', optionId: 'bayar_tak_tercatat' }],
    tags: ['penagihan'],
    mapNode: 'rekap',
    indication:
      'Bukti transfer yang hanya disimpan di galeri ponsel berisiko membuat pesanan dikirim sebelum lunas atau tagihan lupa ditagihkan.',
    firstSteps: [
      'Wajibkan konfirmasi bukti bayar dicatat bersama nomor pesanan sebelum pesanan diteruskan ke bagian penyiapan barang.',
      'Buat daftar pesanan belum lunas yang diperiksa secara berkala setiap pagi.',
    ],
    digitalOpportunity: {
      kind: 'spreadsheet',
      text: 'Lembar kontrol piutang dan pembayaran pelanggan membantu melacak status pelunasan transaksi secara tertib.',
    },
    reviewStatus: 'draft',
  },

  // F12
  {
    id: 'informasi-pesanan-belum-lengkap',
    title: 'Informasi pesanan sering kurang lengkap atau salah catat',
    trigger: (a) => {
      const k = a.kendala;
      return Array.isArray(k) && (k.includes('salah') || k.includes('tanya_ulang'));
    },
    supportingAnswers: (a) => {
      const items: { questionId: string; optionId: string }[] = [];
      const k = a.kendala;
      if (Array.isArray(k)) {
        if (k.includes('salah')) items.push({ questionId: 'kendala', optionId: 'salah' });
        if (k.includes('tanya_ulang')) items.push({ questionId: 'kendala', optionId: 'tanya_ulang' });
      }
      return items;
    },
    tags: ['sop'],
    mapNode: 'catat',
    indication:
      'Harus menanyakan ulang alamat atau rincian barang memperlambat pengiriman dan memberi kesan kurang profesional pada pelanggan.',
    firstSteps: [
      'Gunakan formulir pemesanan ringkas atau draf pesan otomatis yang meminta rincian lengkap sebelum pesanan diproses.',
      'Lakukan konfirmasi ulang rincian pesanan dan total biaya ke pelanggan sebelum barang disiapkan.',
    ],
    digitalOpportunity: {
      kind: 'sop',
      text: 'Format formulir pesanan terstruktur memastikan seluruh data penting terkumpul lengkap sejak awal.',
    },
    reviewStatus: 'draft',
  },

  // F13
  {
    id: 'pesanan-terlewat',
    title: 'Pesanan berpotensi terlewat atau terlambat diproses',
    trigger: (a) => {
      const k = a.kendala;
      return Array.isArray(k) && k.includes('terlewat');
    },
    supportingAnswers: () => [{ questionId: 'kendala', optionId: 'terlewat' }],
    tags: ['tindak-lanjut'],
    mapNode: 'tindak',
    indication:
      'Pesanan yang terlewat langsung berdampak pada kekecewaan pelanggan dan menurunkan reputasi bisnis yang telah Anda bangun.',
    firstSteps: [
      'Terapkan kebiasaan memeriksa daftar pesanan masuk minimal dua kali sehari: sebelum jam makan siang dan sebelum toko tutup.',
      'Beri tanda visual yang jelas (misalnya stiker warna atau baris tebal) untuk pesanan yang belum diproses.',
    ],
    digitalOpportunity: {
      kind: 'sop',
      text: 'Prosedur penanganan pesanan harian terstandarisasi membantu memastikan tidak ada pesanan pelanggan yang tertinggal.',
    },
    reviewStatus: 'draft',
  },
];

