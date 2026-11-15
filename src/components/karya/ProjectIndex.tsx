import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useKaryaContext } from '../../context/KaryaContext';
import {
  DISTRICTS,
  DistrictId,
  KARYA_COPY,
  STATUS_LABELS,
  Project,
} from '../../content/karya';

export const ProjectIndex: React.FC = () => {
  const {
    projects,
    openSlug,
    toggleOpenSlug,
    hoveredSlug,
    setHoveredSlug,
    districtFilter,
    setDistrictFilter,
    statusFilter,
    setStatusFilter,
  } = useKaryaContext();

  // Filter projects by district and status
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchDistrict = districtFilter === null || p.district === districtFilter;
      const matchStatus = statusFilter === null || p.status === statusFilter;
      return matchDistrict && matchStatus;
    });
  }, [projects, districtFilter, statusFilter]);

  return (
    <section
      id="project-index"
      className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 bg-[#FBFAF7]"
      aria-labelledby="all-works-heading"
    >
      {/* Gold Accent Bar */}
      <div className="w-12 h-1 bg-[#D4AF37] mb-3.5" aria-hidden="true" />

      {/* Heading */}
      <h2
        id="all-works-heading"
        className="font-serif text-3xl sm:text-5xl font-normal text-[#1B1A2E] tracking-tight mb-8"
      >
        {KARYA_COPY.indexHeading}
      </h2>

      {/* Filter Row: District pills + Status filter reset indicator */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-10 pb-2 border-b border-[#E4DED3]">
        {/* District Pills */}
        <nav className="flex items-center gap-2 flex-wrap" aria-label="Filter kawasan karya">
          <button
            type="button"
            onClick={() => setDistrictFilter(null)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-150 ${districtFilter === null
                ? 'bg-[#1B1A2E] text-white'
                : 'bg-transparent text-[#1B1A2E] border border-[#E4DED3] hover:border-[#1B1A2E]'
              }`}
            aria-pressed={districtFilter === null}
          >
            {KARYA_COPY.filterAll}
          </button>

          {DISTRICTS.map((d) => {
            const isActive = districtFilter === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDistrictFilter(isActive ? null : (d.id as DistrictId))}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-150 ${isActive
                    ? 'bg-[#1B1A2E] text-white'
                    : 'bg-transparent text-[#1B1A2E] border border-[#E4DED3] hover:border-[#1B1A2E]'
                  }`}
                aria-pressed={isActive}
              >
                {d.name}
              </button>
            );
          })}
        </nav>

        {/* Clear Status Filter Pill if active */}
        {statusFilter !== null && (
          <div className="flex items-center gap-2 text-xs font-sans text-[#5F5A66]">
            <span>Filter status: <strong>{STATUS_LABELS[statusFilter]}</strong></span>
            <button
              type="button"
              onClick={() => setStatusFilter(null)}
              className="text-[#8B1538] hover:underline font-semibold"
            >
              (Reset filter)
            </button>
          </div>
        )}
      </div>

      {/* Typographical Project Rows */}
      <div className="flex flex-col border-b border-[#E4DED3]" role="list">
        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center text-[#5F5A66] font-sans text-sm">
            Tidak ada karya yang sesuai dengan kombinasi filter saat ini.
          </div>
        ) : (
          filteredProjects.map((project, idx) => {
            const isOpen = openSlug === project.slug;
            const isHovered = hoveredSlug === project.slug;

            return (
              <ProjectRowItem
                key={project.slug}
                project={project}
                isOpen={isOpen}
                isHovered={isHovered}
                index={idx}
                onToggle={() => toggleOpenSlug(project.slug)}
                onHover={(hover) => setHoveredSlug(hover ? project.slug : null)}
              />
            );
          })
        )}
      </div>

      {/* Enterprise Footnote */}
      <p className="mt-8 text-xs sm:text-sm font-sans text-[#5F5A66] leading-relaxed max-w-2xl">
        {KARYA_COPY.enterpriseFootnote}
      </p>
    </section>
  );
};

interface ProjectRowItemProps {
  project: Project;
  isOpen: boolean;
  isHovered: boolean;
  index: number;
  onToggle: () => void;
  onHover: (hover: boolean) => void;
}

const ProjectRowItem: React.FC<ProjectRowItemProps> = ({
  project,
  isOpen,
  isHovered,
  index,
  onToggle,
  onHover,
}) => {
  return (
    <article
      id={`project-row-${project.slug}`}
      className={`border-t border-[#E4DED3] transition-all duration-200 ${isHovered
          ? 'bg-gradient-to-r from-[#D4AF37]/8 via-[#D4AF37]/3 to-transparent pl-2.5 sm:pl-3.5'
          : 'bg-transparent pl-0'
        }`}
      style={{
        animationDelay: `${index * 0.04}s`,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Header Button / Trigger */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-5 sm:py-6 flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1A2E] rounded-md transition-colors"
        aria-expanded={isOpen}
        aria-controls={`detail-${project.slug}`}
      >
        {/* Red Number Index */}
        <span className="font-serif font-bold text-base sm:text-lg text-[#8B1538] w-9 sm:w-12 flex-shrink-0">
          {project.number}
        </span>

        {/* Project Name */}
        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#1B1A2E] tracking-tight font-normal hover:text-[#8B1538] transition-colors pr-3">
          {project.name}
        </h3>

        {/* Context / Client Subtitle */}
        <span className="font-sans text-xs sm:text-sm text-[#5F5A66] ml-auto mr-4 hidden md:block">
          {project.sub}
        </span>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          {project.status === 'built' && (
            <span className="px-3 py-1 rounded-full text-[11px] font-sans font-semibold bg-[#1B1A2E] text-white tracking-wide">
              Dibangun
            </span>
          )}
          {project.status === 'building' && (
            <span className="px-3 py-0.5 rounded-full text-[11px] font-sans font-semibold border border-[#1B1A2E] text-[#1B1A2E] bg-white tracking-wide">
              Sedang dibangun
            </span>
          )}
          {project.status === 'concept' && (
            <span className="px-3 py-0.5 rounded-full text-[11px] font-sans font-semibold border border-dashed border-[#5F5A66] text-[#5F5A66] bg-transparent tracking-wide">
              Konsep
            </span>
          )}
        </div>

        {/* Toggle Icon */}
        <span
          className="w-8 h-8 flex items-center justify-center font-sans text-lg text-[#1B1A2E] ml-3 sm:ml-4 flex-shrink-0 font-light select-none transition-transform duration-200"
          aria-hidden="true"
        >
          {isOpen ? '×' : '+'}
        </span>
      </button>

      {/* Collapsible Details (CSS Grid transition 0fr -> 1fr) */}
      <div
        id={`detail-${project.slug}`}
        className="grid transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="min-h-0 pl-9 sm:pl-12 pb-6 pr-4 sm:pr-8">
          {/* Mobile context label if hidden in row */}
          <div className="font-sans text-xs text-[#5F5A66] font-medium mb-2.5 md:hidden">
            {project.sub}
          </div>

          {/* Summary description */}
          <p className="font-sans text-sm sm:text-base text-[#4A453E] leading-relaxed max-w-3xl mb-4">
            {project.summary}
          </p>

          {/* Tech Pills */}
          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3.5" aria-label="Teknologi yang digunakan">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-[#F1ECE1]/80 text-[#4A453E] border border-[#E4DED3]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Role and Case Study Link */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-[#E4DED3]/60 text-xs sm:text-sm font-sans">
            <span className="text-[#5F5A66] italic">
              Peran: {project.role}
            </span>

            {project.hasCaseStudy ? (
              <Link
                to={`/karya/${project.slug}`}
                className="font-semibold text-[#8B1538] hover:text-[#1B1A2E] transition-colors inline-flex items-center gap-1 group"
              >
                <span>{KARYA_COPY.caseStudyAvailable}</span>
              </Link>
            ) : (
              <span className="text-[#5F5A66] text-xs">
                {KARYA_COPY.caseStudyUpcoming}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

