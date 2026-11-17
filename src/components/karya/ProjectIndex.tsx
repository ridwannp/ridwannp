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
import { SplitText, Chip, Booth } from '../../ui/kit';

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
      className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 bg-transparent"
      aria-labelledby="all-works-heading"
    >
      {/* Gold Accent Bar */}
      <div className="w-12 h-1 bg-[#FFC83D] mb-3.5 rounded-full shadow-[0_0_10px_#FFC83D]" aria-hidden="true" />

      {/* Heading with SplitText */}
      <div className="mb-8">
        <SplitText
          text={KARYA_COPY.indexHeading}
          as="h2"
          className="text-3xl sm:text-5xl text-[#FFF1D6]"
          shadowColor="#8B1538"
        />
      </div>

      {/* Filter Row: District chips + Status filter reset indicator */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-10 pb-4 border-b border-white/15">
        {/* District Chips */}
        <nav className="flex items-center gap-2 flex-wrap" aria-label="Filter kawasan karya">
          <Chip
            active={districtFilter === null}
            onClick={() => setDistrictFilter(null)}
            activeColor="#FFC83D"
            inactiveColor="#FFF1D6"
            size="sm"
          >
            {KARYA_COPY.filterAll}
          </Chip>

          {DISTRICTS.map((d) => {
            const isActive = districtFilter === d.id;
            return (
              <Chip
                key={d.id}
                active={isActive}
                onClick={() => setDistrictFilter(isActive ? null : (d.id as DistrictId))}
                activeColor="#FFC83D"
                inactiveColor="#FFF1D6"
                size="sm"
              >
                {d.name}
              </Chip>
            );
          })}
        </nav>

        {/* Clear Status Filter Pill if active */}
        {statusFilter !== null && (
          <div className="flex items-center gap-2 text-xs font-sans text-[#FFF1D6]/80">
            <span>Filter status: <strong className="text-[#FFC83D]">{STATUS_LABELS[statusFilter]}</strong></span>
            <button
              type="button"
              onClick={() => setStatusFilter(null)}
              className="text-[#E0316A] hover:underline font-bold"
            >
              (Reset)
            </button>
          </div>
        )}
      </div>

      {/* Typographical Project Rows */}
      <div className="flex flex-col border-b border-white/15" role="list">
        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center text-[#FFF1D6]/70 font-sans text-sm">
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
      <p className="mt-8 text-xs sm:text-sm font-sans text-[#FFF1D6]/75 leading-relaxed max-w-2xl">
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
      className={`border-t border-white/15 transition-all duration-200 ${isHovered
          ? 'bg-gradient-to-r from-[#FFC83D]/15 via-[#FFC83D]/5 to-transparent pl-2.5 sm:pl-3.5'
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
        className="w-full py-5 sm:py-6 flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC83D] rounded-md transition-colors"
        aria-expanded={isOpen}
        aria-controls={`detail-${project.slug}`}
      >
        {/* Red Number Index */}
        <span className="font-sans font-bold text-base sm:text-lg text-[#E0316A] w-9 sm:w-12 flex-shrink-0">
          {project.number}
        </span>

        {/* Project Name */}
        <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#FFF1D6] tracking-tight font-bold hover:text-[#FFC83D] transition-colors pr-3">
          {project.name}
        </h3>

        {/* Context / Client Subtitle */}
        <span className="font-sans text-xs sm:text-sm text-[#FFF1D6]/70 ml-auto mr-4 hidden md:block">
          {project.sub}
        </span>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          {project.status === 'built' && (
            <span className="px-3 py-1 rounded-full text-[11px] font-sans font-bold bg-[#FFC83D] text-[#1A0F24] border-2 border-[#1A0F24] shadow-[2px_2px_0_#1A0F24] tracking-wide">
              Dibangun
            </span>
          )}
          {project.status === 'building' && (
            <span className="px-3 py-0.5 rounded-full text-[11px] font-sans font-bold border-2 border-[#FFC83D] text-[#FFC83D] bg-transparent tracking-wide">
              Sedang dibangun
            </span>
          )}
          {project.status === 'concept' && (
            <span className="px-3 py-0.5 rounded-full text-[11px] font-sans font-bold border-2 border-dashed border-[#FFF1D6]/80 text-[#FFF1D6]/80 bg-transparent tracking-wide">
              Konsep
            </span>
          )}
        </div>

        {/* Toggle Icon */}
        <span
          className="w-8 h-8 flex items-center justify-center font-sans text-lg text-[#FFF1D6] ml-3 sm:ml-4 flex-shrink-0 font-bold select-none transition-transform duration-200"
          aria-hidden="true"
        >
          {isOpen ? '×' : '+'}
        </span>
      </button>

      {/* Collapsible Details in a Mini Booth */}
      <div
        id={`detail-${project.slug}`}
        className="grid transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="min-h-0 pl-9 sm:pl-12 pb-6 pr-4 sm:pr-8">
          <Booth accentColor="#FFC83D" className="!p-5 sm:!p-6 !rounded-2xl">
            {/* Mobile context label if hidden in row */}
            <div className="font-sans text-xs text-[#1A0F24]/70 font-semibold mb-2 md:hidden">
              {project.sub}
            </div>

            {/* Summary description */}
            <p className="font-sans text-sm sm:text-base text-[#1A0F24]/90 leading-relaxed max-w-3xl mb-4">
              {project.summary}
            </p>

            {/* Tech Pills */}
            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4" aria-label="Teknologi yang digunakan">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-[#FFF1D6] text-[#1A0F24] border border-[#1A0F24]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Role and Case Study Link */}
            <div className="flex items-center justify-between gap-4 flex-wrap pt-3 border-t border-[#1A0F24]/15 text-xs sm:text-sm font-sans">
              <span className="text-[#1A0F24]/70 italic">
                Peran: {project.role}
              </span>

              {project.hasCaseStudy ? (
                <Link
                  to={`/karya/${project.slug}`}
                  className="font-bold text-[#8B1538] hover:text-[#E0316A] transition-colors inline-flex items-center gap-1 group underline"
                >
                  <span>{KARYA_COPY.caseStudyAvailable} &rarr;</span>
                </Link>
              ) : (
                <span className="text-[#1A0F24]/60 text-xs">
                  {KARYA_COPY.caseStudyUpcoming}
                </span>
              )}
            </div>
          </Booth>
        </div>
      </div>
    </article>
  );
};


