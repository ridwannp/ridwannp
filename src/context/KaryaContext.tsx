import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DistrictId, ProjectStatus, Project, PROJECTS } from '../content/karya';

interface KaryaContextValue {
  projects: Project[];
  hoveredSlug: string | null;
  setHoveredSlug: (slug: string | null) => void;
  openSlug: string | null;
  setOpenSlug: (slug: string | null) => void;
  toggleOpenSlug: (slug: string) => void;
  districtFilter: DistrictId | null;
  setDistrictFilter: (id: DistrictId | null) => void;
  statusFilter: ProjectStatus | null;
  setStatusFilter: (status: ProjectStatus | null) => void;
  activeBuildingIndex: number;
  setActiveBuildingIndex: (idx: number) => void;
  scrollToSlug: (slug: string) => void;
}

const KaryaContext = createContext<KaryaContextValue | null>(null);

export const KaryaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(PROJECTS[0]?.slug || null);
  const [districtFilter, setDistrictFilter] = useState<DistrictId | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | null>(null);
  const [activeBuildingIndex, setActiveBuildingIndex] = useState<number>(0);

  const toggleOpenSlug = useCallback((slug: string) => {
    setOpenSlug((prev) => (prev === slug ? null : slug));
  }, []);

  const scrollToSlug = useCallback((slug: string) => {
    const project = PROJECTS.find((p) => p.slug === slug);
    if (!project) return;

    // Open detail
    setOpenSlug(slug);

    // If project is filtered out, clear filters so it's visible
    if (districtFilter !== null && project.district !== districtFilter) {
      setDistrictFilter(null);
    }
    if (statusFilter !== null && project.status !== statusFilter) {
      setStatusFilter(null);
    }

    // Scroll smoothly to row in index
    setTimeout(() => {
      const el = document.getElementById(`project-row-${slug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  }, [districtFilter, statusFilter]);

  const value = useMemo(
    () => ({
      projects: PROJECTS,
      hoveredSlug,
      setHoveredSlug,
      openSlug,
      setOpenSlug,
      toggleOpenSlug,
      districtFilter,
      setDistrictFilter,
      statusFilter,
      setStatusFilter,
      activeBuildingIndex,
      setActiveBuildingIndex,
      scrollToSlug,
    }),
    [
      hoveredSlug,
      openSlug,
      toggleOpenSlug,
      districtFilter,
      statusFilter,
      activeBuildingIndex,
      scrollToSlug,
    ]
  );

  return <KaryaContext.Provider value={value}>{children}</KaryaContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useKaryaContext(): KaryaContextValue {
  const ctx = useContext(KaryaContext);
  if (!ctx) {
    throw new Error('useKaryaContext must be used within a KaryaProvider');
  }
  return ctx;
}
