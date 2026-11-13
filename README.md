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
│       └── KaryaPage.tsx        # Halaman /karya (Portofolio Rekayasa)
```

---

## Fitur & Aksesibilitas

- **Aksesibilitas Universal**: Kontras warna telah diuji memenuhi standar WCAG AA (rasio kontras minimal 4.5:1). Seluruh kontrol dapat diakses menggunakan keyboard dengan *focus ring* yang jelas. Elemen 3D Canvas diberi `aria-hidden="true"`, sedangkan navigasi tab menggunakan pola ARIA Tabs dengan navigasi tombol panah keyboard.
- **Prefers-Reduced-Motion**: Ketika preferensi pengguna meminta pengurangan gerak (*reduced motion*), animasi masuk, efek ayunan, pergerakan marquee, dan parallax kursor secara otomatis dinonaktifkan tanpa mengurangi kelengkapan konten.
- **Graceful WebGL & Low-Spec Fallback**: Pada perangkat dengan keterbatasan memori (`deviceMemory <= 2`), inti CPU (`hardwareConcurrency <= 4`), atau peramban yang gagal menginisialisasi WebGL, kanvas 3D otomatis digantikan dengan ilustrasi SVG vektor yang bersih dan tajam.
- **Optimasi Performa**: Three.js pada halaman Rasanara dimuat secara *lazy* melalui dynamic import hanya pada bagian Hero. Geometri, material, dan renderer dibersihkan secara bersih saat unmount.
