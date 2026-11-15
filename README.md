# Teras — Ridwan Nurdiyanto Putra

Website personal interaktif **"Teras"** untuk **Ridwan Nurdiyanto Putra** (Lead Frontend Engineer, Product Owner, Founder Rasanara).

Dibangun menggunakan:
- **React 18** + **TypeScript** (Strict mode)
- **Vite**
- **Three.js** + **@react-three/fiber**
- **Tailwind CSS**
- **React Router** (`react-router-dom` v6)

---

## Konsep: Teras Perjumpaan

Satu domain, satu identitas, banyak pintu:
1. **Perjalanan (`/cv`)**: Rekrutmen, latar belakang teknik, pengalaman kepemimpinan engineering & produk dengan panggung 3D tangga scroll-driven.
2. **Rasanara (`/rasanara`)**: Halaman agensi/partner digital dengan 3D hero cards (Rasa → Narasi), tab interaktif tantangan operasional, lini masa metodologi, indeks layanan, dan spotlight prinsip kerja.
3. **Karya (`/karya`)**: Portofolio produk, showcase arsitektur web modern, dan sistem desain.
4. **Pintu Mendatang (`soon`)**: Ruang eksplorasi dan wacana yang akan datang.

---

## Menjalankan Proyek Secara Lokal

```bash
# 1. Install dependensi
npm install

# 2. Jalankan development server
npm run dev

# 3. Jalankan pengecekan TypeScript
npm run typecheck

# 4. Jalankan linter ESLint
npm run lint

# 5. Build untuk produksi
npm run build
```

---

## Konfigurasi Halaman Rasanara (`/rasanara`)

Semua salinan teks, daftar layanan, prinsip, dan segmen tantangan untuk halaman Rasanara terpusat secara deklaratif dan bertipe di [`src/content/rasanara.ts`](src/content/rasanara.ts). Komponen tidak memuat teks yang di-hardcode.

### 1. Mengubah Teks & Konten
Buka file `src/content/rasanara.ts` untuk menyesuaikan:
- `HERO_COPY`: Judul utama (H1), subjudul, teks tombol CTA, dan keterangan bawah (*Rasa / Narasi*).
- `PROBLEMS_CONTENT`: Tab segmen industri dan daftar butir kendala operasional.
- `PROCESS_CONTENT`: 4 langkah alur kerja (Memahami, Merancang, Mencoba, Menjalankan).
- `SERVICES_CONTENT`: 6 ruang lingkup layanan dengan kalimat manfaat lugas tanpa klaim berlebihan.
- `PRINCIPLES_CONTENT`: 4 prinsip cara berpikir Rasanara.
- `RASA_NARASI_CONTENT`: Makna filosofi nama dan cerita perjalanan.
- `CLOSING_CONTENT`: Teks blok penutup dan kalimat penutup filosofis.

### 2. Mengaktifkan Penawaran Gratis (`SHOW_FREE_OFFER`)
Sesuai aturan konten, penawaran gratis atau konsultasi berbatas waktu dinonaktifkan secara bawaan (`false`). Untuk mengaktifkannya:
```typescript
// src/content/rasanara.ts
export const SHOW_FREE_OFFER = true;
```

### 3. Mengaktifkan Tombol WhatsApp
Tombol WhatsApp dibaca dari variabel lingkungan Vite `VITE_WHATSAPP_NUMBER`. Jika variabel kosong atau tidak disetel, tombol WhatsApp **tidak akan dirender** sama sekali (hanya menampilkan tombol email langsung):
```bash
# Buat file .env di root proyek (atau set di environment hosting)
VITE_WHATSAPP_NUMBER=6281234567890
```

### 4. Daftar Lebar Layar yang Telah Diuji Responsif
Halaman telah dioptimalkan dan diuji tanpa scrollbar horizontal pada berbagai breakpoint:
- **360px**: Perangkat mobile kompak (Galaxy S series / Android compact).
- **390px**: Ukuran standar iPhone 12/13/14/15.
- **600px**: Mode split-screen / side panel browser desktop & phablet.
- **768px**: Tablet mode portrait (iPad Mini / iPad).
- **1024px**: Tablet landscape / laptop kompak.
- **1440px**: Monitor desktop layar lebar.
- **Mobile Landscape**: Rotasi horizontal ponsel dengan safe-area inset aktif.

---

## Struktur Folder

```text
ridwannp/
├── index.html                   # Entry HTML, Google Fonts, Open Graph, meta tags
├── package.json                 # Konfigurasi dependensi React 18, Three, Vite, Tailwind
├── tailwind.config.js           # Konfigurasi token warna, font, dan animasi
├── tsconfig.json                # TypeScript strict configuration
├── vite.config.ts               # Vite configuration & path aliases (@/*)
├── src/
│   ├── main.tsx                 # React DOM root entry
│   ├── App.tsx                  # React Router konfigurasi (/, /cv, /rasanara, /karya)
│   ├── index.css                # Style global, radial gradient teras, text stroke marquee
│   ├── content/
│   │   └── rasanara.ts          # Single source of truth untuk seluruh teks halaman /rasanara
│   ├── constants/
│   │   └── terrace.ts           # Konstanta 3D (SP = 3.4, RY = 4.4, FLOOR_Y = -2.4, SHADE_HEIGHTS)
│   ├── data/
│   │   ├── doors.ts             # Tipe data Door dan array DOORS (Rasanara: Burgundy #8B1538)
│   │   └── journey.ts           # Data perjalanan untuk halaman /cv
│   ├── hooks/
│   │   ├── useReducedMotion.ts  # Hook deteksi prefers-reduced-motion pengguna
│   │   ├── useInView.ts         # Hook IntersectionObserver modular
│   │   ├── useScrollProgress.ts # Hook kalkulasi progress scroll hero (200svh sticky)
│   │   ├── useViewportSize.ts   # Hook ResizeObserver aman dari nilai 0/NaN
│   │   └── useRailScroll.ts     # Hook kalkulasi geser rel teras beranda
│   ├── components/
│   │   ├── Terrace.tsx          # Beranda utama lampu gantung 3D
│   │   ├── LampScene.tsx        # Canvas Three.js lampu gantung
│   │   ├── rasanara/
│   │   │   ├── TopBar.tsx       # Navigasi atas Rasanara (← Teras, Lihat perjalanannya)
│   │   │   ├── Hero.tsx         # Hero section 200svh dengan sticky container 100svh
│   │   │   ├── HeroScene.tsx    # Scene Three.js 3D kartu (Rasa → Narasi) dengan dynamic import
│   │   │   ├── HeroFallbackSvg.tsx # Fallback SVG kurva Narasi untuk perangkat low-spec
│   │   │   ├── ProblemsSection.tsx # Tab segmen industri (ARIA tablist) & daftar masalah
│   │   │   ├── ProcessTimeline.tsx # Garis waktu vertikal dengan garis emas terisi scroll
│   │   │   ├── ServicesIndex.tsx   # Indeks 6 layanan bernomor tipografi serif
│   │   │   ├── PrinciplesSpotlight.tsx # 4 prinsip cara berpikir dengan active center glow
│   │   │   ├── RasaNarasi.tsx      # Tampilan tipografi Rasa & Narasi dengan garis emas
│   │   │   ├── ContactSection.tsx  # Blok penutup gelap dengan kontak langsung
│   │   │   └── Reveal.tsx          # Wrapper animasi fade-up IntersectionObserver
│   └── pages/
│       ├── CvPage.tsx           # Halaman /cv (Perjalanan 3D tangga berundak)
│       ├── RasanaraPage.tsx     # Halaman /rasanara (Partner Digital & Rekayasa Sistem)
│       ├── KaryaPage.tsx        # Halaman /karya (Kota 3D & Indeks Tipografi)
│       └── CaseStudyPage.tsx    # Halaman /karya/:slug (Editorial Studi Kasus)
```

---

## Konfigurasi Halaman Karya (`/karya` & `/karya/:slug`)

Halaman Karya merepresentasikan setiap proyek sebagai bangunan di sebuah kota 3D arsitektur pagi hari, di mana bentuk bangunan secara visual mencerminkan statusnya:
- **Dibangun (`built`)**: Bangunan penuh dengan jendela kaca memantulkan langit dan sebagian menyala hangat, bilah/sirip aksen (burgundy, emas, atau kayu), lis atap, dan ruang mesin elevator.
- **Sedang dibangun (`building`)**: Cangkang beton bertingkat, tiang besi tulangan menjulang, pagar pengaman, dan derek konstruksi (*crane*) burgundy-emas dengan kabel dan kait yang berayun pelan.
- **Konsep (`concept`)**: Rangka baja terbuka minimalis dengan kolom dan balok gelap, pelat lantai, serta garis hantu putus-putus (*ghost wireframe*) tipis yang menandai volume yang direncanakan.

Di bawah hero terdapat indeks tipografi bernomor besar dengan filter kawasan dan status, serta tautan ke halaman studi kasus editorial `/karya/:slug`.

### 1. Cara Menambah Karya Baru
Buka file [`src/content/karya.ts`](src/content/karya.ts) dan tambahkan entri ke array `RAW_PROJECTS`:
```typescript
{
  slug: 'nama-proyek-unik',
  name: 'Judul Proyek',
  sub: 'Klien atau Konteks Organisasi',
  district: 1, // 0 = Enterprise, 1 = Dibangun sendiri, 2 = Eksperimen
  status: 'built', // 'built' | 'building' | 'concept'
  height: 2.8, // Tinggi visual gedung (2.1 s/d 3.8)
  role: 'Frontend Developer',
  summary: 'Penjelasan ringkas proyek dan arsitektur teknisnya.',
  tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  hasCaseStudy: true, // true jika memiliki halaman studi kasus lengkap
  caseStudy: {
    problem: 'Tantangan atau kendala teknis yang dihadapi...',
    decisions: [
      {
        number: 1,
        title: 'Judul Keputusan Arsitektur',
        rationale: 'Alasan teknis pemilihan solusi...',
      },
    ],
    lessons: [
      'Pelajaran berharga yang dipetik dari proyek...',
    ],
  },
}
```
> **Catatan Otomatisasi Posisi**: Posisi 3D sumbu X dan Z dihitung otomatis oleh fungsi `computeProjectPositions` (jarak antar bangunan 2.1, celah antar kawasan 1.5, dan tata letak zig-zag Z 0 / -2.0). Anda cukup menambah satu objek data tanpa mengatur koordinat 3D manual.

### 2. Cara Mengubah Status Proyek
Ubah atribut `status` pada proyek terkait di `src/content/karya.ts`:
- `'built'`: Menjadikan gedung utuh dengan kaca, jendela menyala, dan sirip dekoratif.
- `'building'`: Mengubahnya menjadi cangkang beton dengan tiang tulangan dan crane.
- `'concept'`: Mengubahnya menjadi rangka baja terbuka dengan garis hantu volume.

### 3. Cara Kerja Tier Kualitas (`useQualityTier`)
Sistem secara otomatis mendeteksi kapabilitas perangkat pengguna untuk memilih tier rendering:
- **Tier Low (Perangkat Terbatas / Layar Ponsel ≤ 640px)**:
  - Dipicu jika: lebar layar ≤ 640px, core CPU < 4, memori perangkat < 4 GB, atau preferensi `prefers-reduced-data`.
  - Menggunakan material Lambert ringan tanpa komputasi refleksi environment map.
  - Pixel ratio dibatasi maksimal 1.25 untuk menjaga efisiensi baterai dan kelancaran 60 FPS.
  - Jumlah siluet latar dan pohon disederhanakan.
- **Tier High (Desktop & Tablet Bertenaga)**:
  - Tone mapping filmis `ACESFilmic` dan enkripsi warna `sRGBEncoding`.
  - Pencahayaan hemisphere (langit `#BFD9F5`, tanah `#E8DCC6`) + directional hangat `#FFE6BF`.
  - Peta lingkungan prosedural (*procedural sky PMREM*) dibuat sekali di memori tanpa memuat file gambar eksternal, memberikan pantulan langit realistis pada kaca jendela dan baja.
  - Bayangan kontak terpanggang (*baked contact shadow*) dan oklusi ambien palsu di pangkal dinding.
- **Batas Anggaran Performa**:
  - Draw Calls: ~75–90 calls (jauh di bawah batas anggaran 150 draw calls).
  - Segitiga (Triangles): ~6.500–8.000 triangles (jauh di bawah batas 120.000 segitiga).
  - Penghentian Render Otomatis: Render 3D otomatis dijeda ketika scroll melewati 2.4 viewport atau ketika tab browser tidak aktif (`document.hidden`).

### 4. Daftar Lebar Layar yang Telah Diuji
- **360px**: Smartphone Android kompak (layout teks vertikal di atas kota, tap target ≥ 44px, tanpa scroll horizontal).
- **390px**: Ukuran standar iPhone 12/13/14/15/16.
- **600px**: Split-screen / browser side panel (layout adaptif transisi sempit ke sedang).
- **768px**: Tablet iPad mode portrait.
- **1024px**: Tablet landscape & laptop kompak.
- **1440px**: Monitor desktop layar lebar (layout teks hero di kiri, kota bergeser ke kanan).
- **Mobile Landscape**: Rotasi horizontal ponsel dengan safe-area inset aktif.

---

## Fitur & Aksesibilitas

- **Aksesibilitas Universal**: Kontras warna telah diuji memenuhi standar WCAG AA (rasio kontras minimal 4.5:1). Seluruh kontrol dapat diakses menggunakan keyboard dengan *focus ring* yang jelas. Elemen 3D Canvas diberi `aria-hidden="true"`, sedangkan navigasi tab menggunakan pola ARIA Tabs dengan navigasi tombol panah keyboard.
- **Prefers-Reduced-Motion**: Ketika preferensi pengguna meminta pengurangan gerak (*reduced motion*), animasi masuk, efek ayunan, pergerakan marquee, dan parallax kursor secara otomatis dinonaktifkan tanpa mengurangi kelengkapan konten.
- **Graceful WebGL & Low-Spec Fallback**: Pada perangkat dengan keterbatasan memori (`deviceMemory <= 2`), inti CPU (`hardwareConcurrency <= 4`), atau peramban yang gagal menginisialisasi WebGL, kanvas 3D otomatis digantikan dengan ilustrasi SVG vektor yang bersih dan tajam.
- **Optimasi Performa**: Three.js pada halaman Rasanara dimuat secara *lazy* melalui dynamic import hanya pada bagian Hero. Geometri, material, dan renderer dibersihkan secara bersih saat unmount.
