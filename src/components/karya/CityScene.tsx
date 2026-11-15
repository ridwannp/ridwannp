import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useKaryaContext } from '../../context/KaryaContext';
import { useQualityTier } from '../../hooks/useQualityTier';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CityFallbackSvg } from './CityFallbackSvg';
import { STATUS_LABELS } from '../../content/karya';

interface TooltipData {
  slug: string;
  name: string;
  statusText: string;
  x: number;
  y: number;
}

export const CityScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    projects,
    hoveredSlug,
    setHoveredSlug,
    scrollToSlug,
    statusFilter,
    districtFilter,
    setActiveBuildingIndex,
  } = useKaryaContext();

  const qualityTier = useQualityTier();
  const prefersReducedMotion = useReducedMotion();

  const [webGlFailed, setWebGlFailed] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const sceneInstanceRef = useRef<{
    updateScroll: (p: number) => void;
    setHoveredSlug: (slug: string | null) => void;
    setStatusFilter: (status: import('../../content/karya').ProjectStatus | null) => void;
    setDistrictFilter: (district: number | null) => void;
    resize: () => void;
    getRenderStats: () => { drawCalls: number; triangles: number; tier: string };
    dispose: () => void;
  } | null>(null);

  // Initialize 3D Engine
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;

    async function init() {
      try {
        const { createRealCityScene } = await import('../../three/createRealCityScene');
        if (!isMounted || !container) return;

        const instance = createRealCityScene(container, projects, {
          qualityTier,
          prefersReducedMotion,
          callbacks: {
            onHover: (slug, screenPos) => {
              setHoveredSlug(slug);
              if (slug && screenPos) {
                const proj = projects.find((p) => p.slug === slug);
                if (proj) {
                  setTooltip({
                    slug,
                    name: proj.name,
                    statusText: STATUS_LABELS[proj.status],
                    x: screenPos.x,
                    y: screenPos.y,
                  });
                }
              } else {
                setTooltip(null);
              }
            },
            onClick: (slug) => {
              scrollToSlug(slug);
            },
            onActiveDistrictChange: (districtId) => {
              setActiveBuildingIndex(districtId);
            },
          },
        });

        sceneInstanceRef.current = instance;
        setWebGlFailed(false);
      } catch (err) {
        console.error('WebGL CityScene failed to initialize:', err);
        if (isMounted) setWebGlFailed(true);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.dispose();
        sceneInstanceRef.current = null;
      }
    };
  }, [projects, qualityTier, prefersReducedMotion, setHoveredSlug, scrollToSlug, setActiveBuildingIndex]);

  // Synchronize external hoveredSlug to 3D scene
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setHoveredSlug(hoveredSlug);
    }
  }, [hoveredSlug]);

  // Synchronize filters
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setStatusFilter(statusFilter);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setDistrictFilter(districtFilter);
    }
  }, [districtFilter]);

  // Scroll Progress listener
  const handleScroll = useCallback(() => {
    if (!sceneInstanceRef.current || typeof window === 'undefined') return;
    const vh = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    // Hero section is 200svh, with 100svh scrollable distance
    const progress = Math.max(0, Math.min(1, scrollY / Math.max(1, vh)));
    sceneInstanceRef.current.updateScroll(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ResizeObserver for canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      sceneInstanceRef.current?.resize();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, []);

  if (webGlFailed) {
    return <CityFallbackSvg />;
  }

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      {/* Tooltip following hovered building (hover devices only) */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-1.5 rounded-lg bg-[#1B1A2E]/92 text-white text-xs font-sans shadow-lg backdrop-blur-md border border-white/10 hidden md:block transition-all duration-150"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 12}px`,
          }}
        >
          <div className="font-semibold text-sm tracking-tight">{tooltip.name}</div>
          <div className="text-[11px] text-[#D4AF37] mt-0.5">{tooltip.statusText}</div>
        </div>
      )}
    </div>
  );
};

export default CityScene;
