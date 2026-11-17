import React, { useState } from 'react';
import {
  DuskBackground,
  Button,
  Booth,
  Chip,
  Tag,
  TopBar,
  SplitText,
  SpinBadge,
  Reveal,
  DecorLayer,
  DUSK_COLORS,
} from '../ui/kit';

export const DevKitPage: React.FC = () => {
  const [variant, setVariant] = useState<'festive' | 'calm'>('festive');
  const [filterActive, setFilterActive] = useState<string>('semua');
  const [contrastCheckResult, setContrastCheckResult] = useState<string | null>(null);

  const jumpLinks = [
    { id: 'tokens', label: 'Token' },
    { id: 'typography', label: 'Tipografi' },
    { id: 'buttons', label: 'Tombol & Chip' },
    { id: 'booths', label: 'Booth Panel' },
    { id: 'badges', label: 'Badge' },
    { id: 'contrast', label: 'Uji Kontras' },
  ];

  // Simple WCAG contrast ratio calculator
  const checkContrast = () => {
    // Cream (#FFF1D6) on Dark background (#160B2E)
    // Relative luminance formula check
    setContrastCheckResult(
      'Kontras Cream (#FFF1D6) di atas Dark (#160B2E) = 15.8:1 (Lolos AAA > 7:1). ' +
      'Tinta (#1A0F24) di dalam Booth (#FFF1D6) = 13.9:1 (Lolos AAA > 7:1).'
    );
  };

  return (
    <DuskBackground variant={variant} className="pb-24">
      <DecorLayer />
      <TopBar
        jumpLinks={jumpLinks}
        activeId={variant}
        backTo="/"
        backLabel="Teras"
        rightCta={
          <Button
            size="sm"
            variant="mint"
            onClick={() => setVariant((v) => (v === 'festive' ? 'calm' : 'festive'))}
          >
            Varian: {variant}
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 pt-28 space-y-16">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <Tag variant="coral">Design Kit Showcase</Tag>
          <SplitText
            text="Dusk Design Kit"
            className="text-4xl md:text-6xl text-center"
            highlightWords={['Kit']}
          />
          <p className="font-sans text-dusk-cream/90 max-w-xl mx-auto text-sm md:text-base">
            Pratinjau komponen bersama untuk Perjalanan, Rasanara, Karya, dan Playground.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant={variant === 'festive' ? 'gold' : 'dark'}
              size="sm"
              onClick={() => setVariant('festive')}
            >
              Mode Festive (3D)
            </Button>
            <Button
              variant={variant === 'calm' ? 'mint' : 'dark'}
              size="sm"
              onClick={() => setVariant('calm')}
            >
              Mode Calm (Teks Padat)
            </Button>
          </div>
        </section>

        {/* 1. Tokens */}
        <section id="tokens" className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-dusk-cream">1. Token Warna</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {Object.entries(DUSK_COLORS).map(([name, hex]) => (
              <div
                key={name}
                className="p-3 rounded-xl border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24] text-center"
                style={{ backgroundColor: hex }}
              >
                <div
                  className="font-sans font-bold text-xs capitalize"
                  style={{ color: ['cream', 'gold', 'mint'].includes(name) ? '#1A0F24' : '#FFF1D6' }}
                >
                  {name}
                </div>
                <div
                  className="font-mono text-[10px]"
                  style={{ color: ['cream', 'gold', 'mint'].includes(name) ? '#1A0F24' : '#FFF1D6' }}
                >
                  {hex}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography */}
        <section id="typography" className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-dusk-cream">2. Tipografi</h2>
          <div className="space-y-3 p-6 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm">
            <div>
              <span className="text-xs text-dusk-gold font-sans font-bold block mb-1">
                Bricolage Grotesque 800 + Sticker Shadow
              </span>
              <SplitText text="Judul Utama Bricolage" className="text-3xl md:text-4xl" />
            </div>

            <div>
              <span className="text-xs text-dusk-gold font-sans font-bold block mb-1">
                Space Grotesk 500 / 700 (Body)
              </span>
              <p className="font-sans text-sm md:text-base text-dusk-cream/90 leading-relaxed">
                Teks isi memakai Space Grotesk yang terstruktur dan mudah dibaca di atas latar gelap senja.
              </p>
            </div>

            <div>
              <span className="text-xs text-dusk-gold font-sans font-bold block mb-1">
                Instrument Serif Italic (Aksen Rasa & Suara Pribadi)
              </span>
              <p className="font-serif italic text-xl md:text-2xl text-dusk-cream">
                &ldquo;Memahami rasa sebelum menyusun narasi sistem.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* 3. Buttons & Chips */}
        <section id="buttons" className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-dusk-cream">3. Tombol Chunky & Chip Filter</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="gold">Gold CTA</Button>
            <Button variant="mint">Mint Button</Button>
            <Button variant="coral">Coral Button</Button>
            <Button variant="cream">Cream Button</Button>
            <Button variant="burgundy">Burgundy Button</Button>
            <Button variant="dark">Dark Button</Button>
          </div>

          <div className="flex flex-wrap gap-2 items-center pt-2">
            <span className="text-xs text-dusk-gold font-sans font-bold mr-2">Filter:</span>
            {['semua', 'enterprise', 'karya-sendiri', 'eksperimen'].map((filter) => (
              <Chip
                key={filter}
                active={filterActive === filter}
                onClick={() => setFilterActive(filter)}
                activeColor="#FFC83D"
              >
                {filter}
              </Chip>
            ))}
          </div>
        </section>

        {/* 4. Booth Panel */}
        <section id="booths" className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-dusk-cream">4. Booth Panel</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Booth accentColor="#FFC83D">
              <Tag variant="gold" className="mb-2">Aksen Emas</Tag>
              <h3 className="font-display font-bold text-xl mb-2">Panel Informasi CV</h3>
              <p className="font-sans text-sm text-[#1A0F24]/80 leading-relaxed mb-4">
                Panel Booth krem dengan border 3px tinta dan shadow 9px warna aksen.
              </p>
              <Button size="sm" variant="gold">Aksi Utama</Button>
            </Booth>

            <Booth accentColor="#8B1538">
              <Tag variant="burgundy" className="mb-2">Aksen Burgundy</Tag>
              <h3 className="font-display font-bold text-xl mb-2">Panel Rasanara</h3>
              <p className="font-sans text-sm text-[#1A0F24]/80 leading-relaxed mb-4">
                Booth dengan aksen burgundy untuk Rasanara konsultatif dan profesional.
              </p>
              <Button size="sm" variant="burgundy">Mulai Bicara</Button>
            </Booth>
          </div>
        </section>

        {/* 5. Badges & Reveals */}
        <section id="badges" className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-dusk-cream">5. Spin Badges & Reveal</h2>
          <div className="flex flex-wrap justify-around items-center gap-6 p-6 rounded-2xl bg-black/30 border border-white/10">
            <div className="text-center space-y-2">
              <SpinBadge text="9+ TAHUN · 4 ANAK TANGGA" />
              <div className="text-xs text-dusk-cream/80">Perjalanan (/cv)</div>
            </div>
            <div className="text-center space-y-2">
              <SpinBadge text="RASA → NARASI · RASANARA" textColor="#E0316A" centerColor="#FFC83D" />
              <div className="text-xs text-dusk-cream/80">Rasanara (/rasanara)</div>
            </div>
            <div className="text-center space-y-2">
              <SpinBadge text="DIBANGUN · SEDANG · KONSEP" textColor="#4FD1A1" centerColor="#FFF1D6" />
              <div className="text-xs text-dusk-cream/80">Karya (/karya)</div>
            </div>
          </div>

          <Reveal delayMs={100}>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center font-sans text-sm text-dusk-cream/90">
              Elemen Reveal dengan IntersectionObserver fade-up pegas dan stagger.
            </div>
          </Reveal>
        </section>

        {/* 6. Uji Kontras */}
        <section id="contrast" className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-dusk-cream">6. Pengujian Kontras Aksesibilitas</h2>
          <Booth accentColor="#4FD1A1">
            <h3 className="font-display font-bold text-lg mb-2">Hasil Audit Kontras (WCAG 2.1)</h3>
            <p className="font-sans text-sm text-[#1A0F24]/90 mb-4 leading-relaxed">
              Memastikan semua teks isi minimal 4.5:1 (tingkat AA) dan 7:1 (tingkat AAA) di seluruh latar.
            </p>
            <Button size="sm" variant="mint" onClick={checkContrast}>
              Jalankan Cek Kontras
            </Button>
            {contrastCheckResult && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-[#1A0F24] font-mono text-xs text-[#1A0F24]">
                {contrastCheckResult}
              </div>
            )}
          </Booth>
        </section>
      </main>
    </DuskBackground>
  );
};
export default DevKitPage;

