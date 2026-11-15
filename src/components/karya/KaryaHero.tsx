import React, { Suspense, lazy } from 'react';
import { useKaryaContext } from '../../context/KaryaContext';
import { KARYA_COPY, DISTRICTS, ProjectStatus } from '../../content/karya';
import { CityFallbackSvg } from './CityFallbackSvg';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LazyCityScene = lazy(() => import('./CityScene'));

export const KaryaHero: React.FC = () => {
  const { statusFilter, setStatusFilter, activeBuildingIndex } = useKaryaContext();
  const prefersReducedMotion = useReducedMotion();

  const handleToggleStatus = (status: ProjectStatus) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  const activeDistrict = DISTRICTS[activeBuildingIndex] || DISTRICTS[0];

  return (
    <section
      className="relative w-full h-[200svh] bg-[#FBFAF7]"
      aria-label="Panggung 3D Kota Karya"
    >
      {/* Sticky 100svh container */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden select-none">
        {/* Sky Background Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, #78B7F1 0%, #B2D6F6 28%, #F1E7D3 47%, #EFE4D0 100%)',
          }}
        />

        {/* Morning Warm Fog Glow on the Left */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 pointer-events-none opacity-40 mix-blend-soft-light"
          style={{
            background: 'radial-gradient(ellipse at 10% 40%, rgba(255, 240, 210, 0.95), transparent 70%)',
          }}
        />

        {/* 3 Slow CSS Clouds (Paused if reduced motion) */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
            <div
              className="absolute top-[12%] left-[-20%] w-[380px] h-[90px] rounded-full bg-white/40 blur-2xl animate-[cloudDrift_65s_linear_infinite]"
            />
            <div
              className="absolute top-[22%] left-[-35%] w-[480px] h-[110px] rounded-full bg-white/35 blur-3xl animate-[cloudDrift_95s_linear_infinite_15s]"
            />
            <div
              className="absolute top-[8%] left-[-15%] w-[320px] h-[75px] rounded-full bg-white/30 blur-2xl animate-[cloudDrift_80s_linear_infinite_35s]"
            />
          </div>
        )}

        {/* 3D City Scene Canvas */}
        <div className="absolute inset-0 z-10">
          <Suspense fallback={<CityFallbackSvg />}>
            <LazyCityScene />
          </Suspense>
        </div>

        {/* Hero Copy & Status Legend Overlay (Top Left) */}
        <div
          className="absolute top-[72px] sm:top-[88px] left-4 sm:left-10 z-20 max-w-xl pointer-events-none"
          style={{ paddingLeft: 'max(0px, env(safe-area-inset-left))' }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-2.5">
            <span className="font-sans font-bold text-xs tracking-[0.18em] text-[#8B1538]">
              {KARYA_COPY.eyebrow}
            </span>
            <div className="w-16 sm:w-24 h-[1.5px] bg-[#D4AF37]" aria-hidden="true" />
          </div>

          {/* H1 Heading */}
          <h1 className="font-serif text-[2.2rem] sm:text-[3.2rem] lg:text-[3.8rem] font-normal leading-[1.08] text-[#1B1A2E] tracking-tight mb-3.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] text-balance">
            {KARYA_COPY.h1}
          </h1>

          {/* Lede paragraph */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#4A453E] leading-relaxed max-w-lg mb-5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {KARYA_COPY.lede}
          </p>

          {/* Status Legend & Filter Pills */}
          <div
            className="flex items-center gap-2.5 sm:gap-4 flex-wrap pointer-events-auto"
            aria-label="Filter status karya"
          >
            {/* Built Pill */}
            <button
              type="button"
              onClick={() => handleToggleStatus('built')}
              aria-pressed={statusFilter === 'built'}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-150 backdrop-blur-md border ${
                statusFilter === 'built'
                  ? 'bg-[#1B1A2E] text-white border-[#1B1A2E] shadow-sm'
                  : 'bg-white/80 text-[#1B1A2E] border-[#E4DED3] hover:bg-white'
              }`}
            >
              <div className="w-3 h-3 rounded-[2px] bg-[#D4AF37]" aria-hidden="true" />
              <span>{KARYA_COPY.legend.built}</span>
            </button>

            {/* Building Pill */}
            <button
              type="button"
              onClick={() => handleToggleStatus('building')}
              aria-pressed={statusFilter === 'building'}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-150 backdrop-blur-md border ${
                statusFilter === 'building'
                  ? 'bg-[#1B1A2E] text-white border-[#1B1A2E] shadow-sm'
                  : 'bg-white/80 text-[#1B1A2E] border-[#E4DED3] hover:bg-white'
              }`}
            >
              <div className="w-3 h-3 rounded-[2px] border-[1.5px] border-[#1B1A2E] bg-white" aria-hidden="true" />
              <span>{KARYA_COPY.legend.building}</span>
            </button>

            {/* Concept Pill */}
            <button
              type="button"
              onClick={() => handleToggleStatus('concept')}
              aria-pressed={statusFilter === 'concept'}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-150 backdrop-blur-md border ${
                statusFilter === 'concept'
                  ? 'bg-[#1B1A2E] text-white border-[#1B1A2E] shadow-sm'
                  : 'bg-white/80 text-[#1B1A2E] border-[#E4DED3] hover:bg-white'
              }`}
            >
              <div className="w-3 h-3 rounded-[2px] border-[1.5px] border-dashed border-[#5F5A66] bg-transparent" aria-hidden="true" />
              <span>{KARYA_COPY.legend.concept}</span>
            </button>
          </div>
        </div>

        {/* District Watermark Label (Bottom Corner) */}
        <div
          className="absolute bottom-6 right-6 sm:right-10 z-20 pointer-events-none select-none"
          style={{ paddingRight: 'max(0px, env(safe-area-inset-right))' }}
        >
          <div className="font-serif italic text-2xl sm:text-4xl text-white/85 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            {activeDistrict.name}
          </div>
        </div>
      </div>
    </section>
  );
};

