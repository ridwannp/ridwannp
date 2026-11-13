import React, { useState, useRef, lazy, Suspense, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { DOORS, Door } from '../data/doors';
import { useRailScroll } from '../hooks/useRailScroll';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { TopBar } from './TopBar';
import { HeroHeadline } from './HeroHeadline';
import { Marquee } from './Marquee';
import { DoorNav } from './DoorNav';
import { LampLabels } from './LampLabels';

// Performance: Canvas dimuat lazy (React.lazy + Suspense)
const LampScene = lazy(() => import('./LampScene'));

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const Terrace: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [hasWebGL, setHasWebGL] = useState(() => checkWebGLSupport());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Hook for rail scrolling & dragging
  const {
    currentIndex,
    scrollOffset,
    isDragging,
    canPrev,
    canNext,
    scrollToIndex,
    next,
    prev,
    bindContainer,
    hasMovedSinceDown,
  } = useRailScroll(prefersReducedMotion);

  // Array of DOM element refs for projected 2D lamp labels
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hover color for marquee stroke
  const currentHoverColor = useMemo(() => {
    if (hoveredIndex !== null && DOORS[hoveredIndex]) {
      return DOORS[hoveredIndex].color;
    }
    // Default to active lamp's color
    return DOORS[currentIndex]?.color || '#FF6B6B';
  }, [hoveredIndex, currentIndex]);

  // Click on lamp: distinguish drag from click using threshold
  const handleSelectDoor = useCallback(
    (door: Door) => {
      if (hasMovedSinceDown) return; // Prevent navigation if user dragged
      if (door.status === 'open' && door.href && door.href !== '#') {
        navigate(door.href);
      }
    },
    [hasMovedSinceDown, navigate]
  );

  return (
    <main
      className="relative w-screen h-screen overflow-hidden terrace-radial-bg select-none touch-none"
      {...bindContainer}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Top Brand Bar */}
      <TopBar />

      {/* Top-Left Hero Headline */}
      <HeroHeadline prefersReducedMotion={prefersReducedMotion} />

      {/* Two giant marquee lines behind 3D scene */}
      <Marquee
        hoveredColor={currentHoverColor}
        isHovered={hoveredIndex !== null}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* 3D Lamp Scene or 2D Accessible Fallback */}
      {hasWebGL ? (
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-xs font-sans text-[#8F879A] pointer-events-none">
              <span className="animate-pulse">Menyiapkan teras...</span>
            </div>
          }
        >
          <LampScene
            scrollOffset={scrollOffset}
            hoveredIndex={hoveredIndex}
            onHoverDoor={setHoveredIndex}
            onSelectDoor={handleSelectDoor}
            labelRefs={labelRefs}
            prefersReducedMotion={prefersReducedMotion}
            onWebGLError={() => setHasWebGL(false)}
          />
        </Suspense>
      ) : (
        /* WebGL Fallback: Static accessible presentation */
        <div className="absolute inset-0 flex items-center justify-center z-10 p-6 pointer-events-auto">
          <div className="max-w-2xl bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#141218]/10 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FFE7B0] flex items-center justify-center text-[#1A1720]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif italic text-[#141218] mb-2">
              Selamat datang di Teras
            </h2>
            <p className="text-sm font-sans text-[#5E5669] mb-6">
              Akselerasi grafis 3D tidak tersedia di peramban ini. Anda tetap dapat menjelajahi seluruh bagian situs melalui menu pintu di bawah.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DOORS.filter((d) => d.status === 'open').map((door) => (
                <button
                  key={door.id}
                  onClick={() => navigate(door.href)}
                  className="p-4 rounded-xl border border-[#141218]/10 text-left hover:border-black transition-all bg-[#FBFAF7]"
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block mb-2"
                    style={{ backgroundColor: door.color }}
                  />
                  <div className="font-bold text-sm text-[#141218]">{door.title}</div>
                  <div className="text-xs text-[#8F879A] mt-1">{door.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2D Projected HTML Labels under lamps */}
      {hasWebGL && (
        <LampLabels
          labelRefs={labelRefs}
          hoveredIndex={hoveredIndex}
          onHoverDoor={setHoveredIndex}
          onSelectDoor={scrollToIndex}
        />
      )}

      {/* On-screen Arrow Controls for Desktop & Mobile */}
      <div className="absolute inset-y-0 left-3 md:left-6 flex items-center z-30 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          disabled={!canPrev}
          aria-label="Geser ke lentera sebelumnya"
          className={`pointer-events-auto p-2.5 md:p-3 rounded-full bg-white/80 backdrop-blur-md border border-[#141218]/10 text-[#141218] shadow-sm transition-all duration-200 ${
            canPrev
              ? 'hover:bg-white hover:scale-105 active:scale-95 cursor-pointer opacity-80 hover:opacity-100'
              : 'opacity-20 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-3 md:right-6 flex items-center z-30 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          disabled={!canNext}
          aria-label="Geser ke lentera berikutnya"
          className={`pointer-events-auto p-2.5 md:p-3 rounded-full bg-white/80 backdrop-blur-md border border-[#141218]/10 text-[#141218] shadow-sm transition-all duration-200 ${
            canNext
              ? 'hover:bg-white hover:scale-105 active:scale-95 cursor-pointer opacity-80 hover:opacity-100'
              : 'opacity-20 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Bottom Door Navigation */}
      <DoorNav
        currentIndex={currentIndex}
        hoveredIndex={hoveredIndex}
        onHoverDoor={setHoveredIndex}
        onSelectDoor={scrollToIndex}
      />
    </main>
  );
};

export default Terrace;
