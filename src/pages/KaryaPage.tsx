import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { DOORS } from '../data/doors';
import { Sparkles, ExternalLink, Code2, Cpu } from 'lucide-react';

interface ProjectItem {
  title: string;
  category: string;
  description: string;
  tech: string[];
  metrics: string;
  linkText?: string;
}

export const KaryaPage: React.FC = () => {
  const door = DOORS[2]; // Karya

  const projects: ProjectItem[] = [
    {
      title: 'Teras — 3D Spatial Gateway',
      category: 'Interactive WebGL Experience',
      description:
        'Situs personal berekayasa 3D interaktif dengan Three.js dan React Three Fiber. Menggunakan konsep pendant lamp gateway dengan proyeksi koordinat 3D ke 2D, raycasting dinamis, dan fallback aksesibel.',
      tech: ['React 18', 'TypeScript', 'Three.js', 'R3F', 'Tailwind CSS'],
      metrics: '60 FPS stabil · Zero bundle bloat · Full keyboard navigation',
      linkText: 'Anda sedang berada di sini',
    },
    {
      title: 'Enterprise Design System & Token Engine',
      category: 'Frontend Infrastructure',
      description:
        'Sistem desain multi-brand untuk 5 produk web skala besar dengan 150+ komponen aksesibel. Dilengkapi automated regression testing visual dan sinkronisasi design token dari Figma Tokens ke CSS/Tailwind.',
      tech: ['TypeScript', 'Storybook', 'Tailwind CSS', 'Playwright', 'NPM Package'],
      metrics: 'Mengurangi waktu delivery UI hingga 45% · 99.8% test coverage',
    },
    {
      title: 'High-Throughput Analytics Dashboard',
      category: 'Web App & Data Visualization',
      description:
        'Aplikasi dashboard analitik performa finansial real-time yang menangani ribuan pembaruan data per detik tanpa jeda rendering antarmuka, memanfaatkan virtualized lists dan Web Workers.',
      tech: ['React', 'WebSocket', 'Canvas API', 'Chart.js', 'Zustand'],
      metrics: 'LCP 0.8s · Mendukung render 50k+ baris data tanpa lag',
    },
    {
      title: 'Omnichannel Commerce Gateway',
      category: 'Product Engineering',
      description:
        'Platform belanja headless berorientasi konversi dengan arsitektur checkout cepat, offline-first sync untuk koneksi buruk, dan skor Core Web Vitals hijau sempurna.',
      tech: ['Next.js', 'React Query', 'TypeScript', 'Edge Workers', 'Stripe'],
      metrics: 'Skor Lighthouse 98/100 · Peningkatan konversi checkout 28%',
    },
  ];

  return (
    <PageLayout
      doorTitle={door.title}
      doorBadge="Karya & Portofolio Rekayasa"
      doorColor={door.color}
      doorTextColor={door.textColor}
      title="Karya, Eksperimen & Rekayasa Produk"
      subtitle="Koleksi proyek terpilih yang memadukan keunggulan arsitektur kode frontend, ketajaman desain interaksi, dan dampak nyata pada pengguna."
    >
      <div className="space-y-12">
        {/* Intro Banner */}
        <div className="p-6 rounded-2xl bg-[#FFB547]/10 border border-[#FFB547]/30 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-[#FFB547]/20 text-[#A86A00] mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#141218]">
              Prinsip Pembangunan: Cepat, Presisi, dan Bertahan Lama
            </h3>
            <p className="text-xs sm:text-sm text-[#5E5669] mt-1 leading-relaxed">
              Setiap karya di bawah ini dibangun dengan standar strict TypeScript, memperhatikan performa perangkat rendah, serta mengedepankan aksesibilitas universal.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#141218]/10 bg-white/70 shadow-sm hover:border-[#FFB547] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#FFB547]/15 text-[#A86A00]">
                    {proj.category}
                  </span>
                  <span className="text-xs font-mono text-[#8F879A]">0{idx + 1}</span>
                </div>

                <h3 className="font-bold text-lg text-[#141218] mt-2 mb-2">
                  {proj.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#5E5669] leading-relaxed mb-6">
                  {proj.description}
                </p>
              </div>

              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#141218]/5 text-[#5E5669]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="pt-3 border-t border-[#141218]/10 flex items-center justify-between text-xs text-[#8F879A]">
                  <span className="flex items-center gap-1.5 font-medium text-[#141218]">
                    <Cpu className="w-3.5 h-3.5 text-[#A86A00]" />
                    <span>{proj.metrics}</span>
                  </span>
                  {proj.linkText && (
                    <span className="italic text-[11px] text-[#A86A00] flex items-center gap-1">
                      <span>{proj.linkText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Github / Code showcase footnote */}
        <div className="p-8 rounded-3xl bg-[#141218] text-[#FBFAF7] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif italic text-2xl text-white">Ingin melihat pendekatan kode lebih detail?</h3>
            <p className="text-xs text-[#8F879A]">
              Eksplorasi repositori arsitektur kode, boilerplate modular, dan eksperimen open-source.
            </p>
          </div>
          <a
            href="mailto:ridwannurdiyanto93@gmail.com?subject=Inquiry%20Portofolio%20Karya"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#141218] hover:bg-[#FFB547] hover:text-[#141218] text-xs font-bold transition-colors"
          >
            <Code2 className="w-4 h-4" />
            <span>Minta Code Walkthrough</span>
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default KaryaPage;

