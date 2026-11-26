import React, { Suspense, lazy } from 'react';
import { useKaryaContext } from '../../context/KaryaContext';
import { KARYA_COPY, DISTRICTS, ProjectStatus } from '../../content/karya';
import { CityFallbackSvg } from './CityFallbackSvg';
import { SplitText, SpinBadge, Chip } from '../../ui/kit';

const LazyCityScene = lazy(() => import('./CityScene'));

export const KaryaHero: React.FC = () => {
  const { statusFilter, setStatusFilter, activeBuildingIndex } = useKaryaContext();

  const handleToggleStatus = (status: ProjectStatus) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  const activeDistrict = DISTRICTS[activeBuildingIndex] || DISTRICTS[0];

  return (
    <section
      className="relative w-full h-[200svh] bg-transparent"
      aria-label="Panggung 3D Kota Karya"
    >
      {/* Sticky 100svh container */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden select-none">
        {/* Dusk Sky Background Gradient (Festive) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, #160B2E 0%, #3B0F39 36%, #8B1538 66%, #E9A23B 100%)',
          }}
        />

        {/* Twinkling Stars in Hero */}
        <div className="kit-stars-layer" aria-hidden="true" />

        {/* 3D City Scene Canvas */}
        <div className="absolute inset-0 z-10">
          <Suspense fallback={<CityFallbackSvg />}>
            <LazyCityScene />
          </Suspense>
        </div>

        {/* Hero Copy & Status Legend Overlay (Top Left) */}
        <div
          className="absolute top-[74px] sm:top-[96px] left-4 right-4 sm:right-auto sm:left-10 z-20 max-w-xl pointer-events-none"
          style={{ paddingLeft: 'max(0px, env(safe-area-inset-left))' }}
        >
          {/* Eyebrow & SpinBadge */}
          <div className="flex items-center gap-4 mb-2.5 sm:mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#8B1538] text-[#FFF1D6] border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24] text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FFC83D]" aria-hidden="true" />
              {KARYA_COPY.eyebrow}
            </span>

            <div className="hidden sm:block">
              <SpinBadge
                text="DIBANGUN · SEDANG · KONSEP"
                size={72}
                textColor="#FFC83D"
                centerColor="#4FD1A1"
              />
            </div>
          </div>

          {/* H1 Heading with SplitText */}
          <div className="mb-2.5 sm:mb-3.5">
            <SplitText
              text={KARYA_COPY.h1}
              as="h1"
              className="text-[1.75rem] sm:text-[3.2rem] lg:text-[3.6rem] leading-[1.08] text-[#FFF1D6]"
              shadowColor="#E0316A"
            />
          </div>

          {/* Lede paragraph */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#FFF1D6]/90 leading-relaxed max-w-lg mb-4 sm:mb-6 drop-shadow-sm">
            {KARYA_COPY.lede}
          </p>

          {/* Status Legend & Filter Chips */}
          <div
            className="flex items-center gap-2 sm:gap-3 flex-wrap pointer-events-auto"
            aria-label="Filter status karya"
          >
            {/* Built Pill */}
            <Chip
              active={statusFilter === 'built'}
              onClick={() => handleToggleStatus('built')}
              aria-pressed={statusFilter === 'built'}
              activeColor="#FFC83D"
              inactiveColor="#FFF1D6"
            >
              <div className="w-3 h-3 rounded-[2px] bg-[#FFC83D] border border-[#1A0F24]" aria-hidden="true" />
              <span>{KARYA_COPY.legend.built}</span>
            </Chip>

            {/* Building Pill */}
            <Chip
              active={statusFilter === 'building'}
              onClick={() => handleToggleStatus('building')}
              aria-pressed={statusFilter === 'building'}
              activeColor="#FFC83D"
              inactiveColor="#FFF1D6"
            >
              <div className="w-3 h-3 rounded-[2px] border-2 border-[#1A0F24] bg-white" aria-hidden="true" />
              <span>{KARYA_COPY.legend.building}</span>
            </Chip>

            {/* Concept Pill */}
            <Chip
              active={statusFilter === 'concept'}
              onClick={() => handleToggleStatus('concept')}
              aria-pressed={statusFilter === 'concept'}
              activeColor="#4FD1A1"
              inactiveColor="#FFF1D6"
            >
              <div className="w-3 h-3 rounded-[2px] border-2 border-dashed border-[#1A0F24] bg-transparent" aria-hidden="true" />
              <span>{KARYA_COPY.legend.concept}</span>
            </Chip>
          </div>
        </div>

        {/* District Watermark Label (Bottom Corner) */}
        <div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-10 z-20 pointer-events-none select-none"
          style={{ paddingRight: 'max(0px, env(safe-area-inset-right))' }}
        >
          <div className="font-serif italic text-xl sm:text-4xl text-[#FFF1D6]/85 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {activeDistrict.name}
          </div>
        </div>
      </div>
    </section>
  );
};


