import React, { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PROJECTS, KARYA_COPY } from '../content/karya';
import { TopBar } from '../components/karya/TopBar';

export const CaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { project, prevProject, nextProject } = useMemo(() => {
    const idx = PROJECTS.findIndex((p) => p.slug === slug);
    if (idx === -1) {
      return { project: null, prevProject: null, nextProject: null };
    }
    return {
      project: PROJECTS[idx],
      prevProject: idx > 0 ? PROJECTS[idx - 1] : null,
      nextProject: idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null,
    };
  }, [slug]);

  // Update SEO Document Title and Meta
  useEffect(() => {
    if (project) {
      document.title = `${project.name} — Studi Kasus Karya Ridwan Nurdiyanto Putra`;
    }
  }, [project]);

  if (!project) {
    return <Navigate to="/karya" replace />;
  }

  const cs = project.caseStudy;

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-[#1B1A2E] font-sans antialiased selection:bg-[#FFE7B0]">
      {/* Top Bar with Back and Download CV */}
      <TopBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-24">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            to="/karya"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-medium text-[#5F5A66] hover:text-[#1B1A2E] transition-colors"
          >
            {KARYA_COPY.backToCity}
          </Link>
        </div>

        {/* Header Block */}
        <header className="mb-14 pb-8 border-b border-[#E4DED3]">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif font-bold text-lg text-[#8B1538]">
              {project.number}
            </span>
            <div className="w-8 h-[1px] bg-[#D4AF37]" aria-hidden="true" />
            <span className="font-sans text-xs uppercase tracking-wider text-[#5F5A66]">
              {project.sub}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight mb-4 text-[#1B1A2E]">
            {project.name}
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#4A453E] leading-relaxed mb-6">
            {project.summary}
          </p>

          {/* Meta Attributes: Status, Role, Tech */}
          <div className="flex items-center gap-3 flex-wrap pt-4 text-xs sm:text-sm">
            <div className="flex-shrink-0">
              {project.status === 'built' && (
                <span className="px-3 py-1 rounded-full text-xs font-sans font-semibold bg-[#1B1A2E] text-white tracking-wide">
                  Dibangun
                </span>
              )}
              {project.status === 'building' && (
                <span className="px-3 py-0.5 rounded-full text-xs font-sans font-semibold border border-[#1B1A2E] text-[#1B1A2E] bg-white tracking-wide">
                  Sedang dibangun
                </span>
              )}
              {project.status === 'concept' && (
                <span className="px-3 py-0.5 rounded-full text-xs font-sans font-semibold border border-dashed border-[#5F5A66] text-[#5F5A66] bg-transparent tracking-wide">
                  Konsep
                </span>
              )}
            </div>

            <span className="text-[#5F5A66] italic">Peran: {project.role}</span>
          </div>

          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4" aria-label="Teknologi">
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
        </header>

        {/* Case Study Editorial Sections */}
        <div className="space-y-14">
          {/* Section 1: Masalah */}
          <section aria-labelledby="section-masalah">
            <h2 id="section-masalah" className="font-serif text-2xl sm:text-3xl font-normal text-[#1B1A2E] mb-4">
              Masalah & Konteks
            </h2>
            {cs?.problem ? (
              <p className="font-sans text-base sm:text-lg text-[#4A453E] leading-relaxed">
                {cs.problem}
              </p>
            ) : (
              <p className="font-sans text-sm italic text-[#5F5A66]">
                Menyusul
              </p>
            )}
          </section>

          {/* Section 2: Keputusan */}
          <section aria-labelledby="section-keputusan">
            <h2 id="section-keputusan" className="font-serif text-2xl sm:text-3xl font-normal text-[#1B1A2E] mb-6">
              Keputusan & Arsitektur
            </h2>
            {cs?.decisions && cs.decisions.length > 0 ? (
              <div className="space-y-6">
                {cs.decisions.map((dec) => (
                  <div key={dec.number} className="p-5 sm:p-6 rounded-xl bg-white/70 border border-[#E4DED3]">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-serif font-bold text-base text-[#8B1538]">
                        0{dec.number}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#1B1A2E]">
                        {dec.title}
                      </h3>
                    </div>
                    <p className="font-sans text-sm sm:text-base text-[#4A453E] leading-relaxed pl-7">
                      {dec.rationale}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm italic text-[#5F5A66]">
                Menyusul
              </p>
            )}
          </section>

          {/* Section 3: Pelajaran */}
          <section aria-labelledby="section-pelajaran">
            <h2 id="section-pelajaran" className="font-serif text-2xl sm:text-3xl font-normal text-[#1B1A2E] mb-4">
              Pelajaran yang Didapat
            </h2>
            {cs?.lessons && cs.lessons.length > 0 ? (
              <ul className="space-y-3 pl-5 list-disc text-base text-[#4A453E] leading-relaxed marker:text-[#8B1538]">
                {cs.lessons.map((lesson, idx) => (
                  <li key={idx}>{lesson}</li>
                ))}
              </ul>
            ) : (
              <p className="font-sans text-sm italic text-[#5F5A66]">
                Menyusul
              </p>
            )}
          </section>
        </div>

        {/* Previous & Next Navigation */}
        <nav
          className="mt-20 pt-8 border-t border-[#E4DED3] flex items-center justify-between gap-4 flex-wrap"
          aria-label="Navigasi karya"
        >
          {prevProject ? (
            <Link
              to={`/karya/${prevProject.slug}`}
              className="group flex flex-col text-left"
            >
              <span className="font-sans text-xs text-[#5F5A66] group-hover:text-[#1B1A2E]">
                ← {KARYA_COPY.prevWork}
              </span>
              <span className="font-serif text-lg sm:text-xl text-[#1B1A2E] group-hover:text-[#8B1538] transition-colors">
                {prevProject.name}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              to={`/karya/${nextProject.slug}`}
              className="group flex flex-col text-right ml-auto"
            >
              <span className="font-sans text-xs text-[#5F5A66] group-hover:text-[#1B1A2E]">
                {KARYA_COPY.nextWork} →
              </span>
              <span className="font-serif text-lg sm:text-xl text-[#1B1A2E] group-hover:text-[#8B1538] transition-colors">
                {nextProject.name}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs font-sans text-[#5F5A66] border-t border-[#E4DED3]">
        <p>© Ridwan Nurdiyanto Putra</p>
      </footer>
    </div>
  );
};

export default CaseStudyPage;

