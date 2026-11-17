import React, { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PROJECTS, KARYA_COPY } from '../content/karya';
import { TopBar } from '../components/karya/TopBar';
import { DuskBackground, DecorLayer, Booth, Button, SplitText } from '../ui/kit';

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
    <DuskBackground variant="calm" className="selection:bg-[#FFC83D]/30 selection:text-[#FFF1D6]">
      {/* Top Bar with Back and Download CV */}
      <TopBar />

      {/* Floating Parallax Decor Layer */}
      <DecorLayer />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-24 relative z-10">
        {/* Back navigation button */}
        <div className="mb-8">
          <Link
            to="/karya"
            className="kit-chunky-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#FFF1D6] text-[#1A0F24] border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24]"
          >
            &larr; {KARYA_COPY.backToCity}
          </Link>
        </div>

        {/* Header Block in Dusk Head */}
        <header className="mb-10 pb-6 border-b border-white/15">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-sans font-bold text-lg text-[#E0316A]">
              {project.number}
            </span>
            <div className="w-8 h-[2px] bg-[#FFC83D]" aria-hidden="true" />
            <span className="font-sans text-xs uppercase tracking-wider text-[#FFC83D] font-bold">
              {project.sub}
            </span>
          </div>

          <div className="mb-4">
            <SplitText
              text={project.name}
              as="h1"
              className="text-3xl sm:text-5xl lg:text-6xl text-[#FFF1D6]"
              shadowColor="#8B1538"
            />
          </div>

          <p className="font-sans text-base sm:text-lg text-[#FFF1D6]/85 leading-relaxed mb-6">
            {project.summary}
          </p>

          {/* Meta Attributes: Status, Role, Tech */}
          <div className="flex items-center gap-3 flex-wrap pt-2 text-xs sm:text-sm">
            <div className="flex-shrink-0">
              {project.status === 'built' && (
                <span className="px-3.5 py-1 rounded-full text-xs font-sans font-bold bg-[#FFC83D] text-[#1A0F24] border-2 border-[#1A0F24] shadow-[2px_2px_0_#1A0F24]">
                  Dibangun
                </span>
              )}
              {project.status === 'building' && (
                <span className="px-3.5 py-1 rounded-full text-xs font-sans font-bold border-2 border-[#FFC83D] text-[#FFC83D] bg-transparent">
                  Sedang dibangun
                </span>
              )}
              {project.status === 'concept' && (
                <span className="px-3.5 py-1 rounded-full text-xs font-sans font-bold border-2 border-dashed border-[#FFF1D6] text-[#FFF1D6] bg-transparent">
                  Konsep
                </span>
              )}
            </div>

            <span className="text-[#FFF1D6]/70 italic">Peran: {project.role}</span>
          </div>

          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4" aria-label="Teknologi">
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
        </header>

        {/* Case Study Content Inside Cream Booth Panel */}
        <Booth accentColor="#8B1538" className="space-y-12 mb-12">
          {/* Section 1: Masalah */}
          <section aria-labelledby="section-masalah">
            <h2 id="section-masalah" className="font-display text-2xl sm:text-3xl font-bold text-[#1A0F24] mb-3">
              Masalah & Konteks
            </h2>
            {cs?.problem ? (
              <p className="font-sans text-base sm:text-lg text-[#1A0F24]/90 leading-relaxed">
                {cs.problem}
              </p>
            ) : (
              <p className="font-sans text-sm italic text-[#1A0F24]/60">
                Menyusul
              </p>
            )}
          </section>

          {/* Section 2: Keputusan */}
          <section aria-labelledby="section-keputusan" className="pt-6 border-t border-[#1A0F24]/15">
            <h2 id="section-keputusan" className="font-display text-2xl sm:text-3xl font-bold text-[#1A0F24] mb-5">
              Keputusan & Arsitektur
            </h2>
            {cs?.decisions && cs.decisions.length > 0 ? (
              <div className="space-y-5">
                {cs.decisions.map((dec) => (
                  <div key={dec.number} className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#1A0F24] shadow-[3px_3px_0_#1A0F24]">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-sans font-bold text-base text-[#8B1538]">
                        0{dec.number}
                      </span>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-[#1A0F24]">
                        {dec.title}
                      </h3>
                    </div>
                    <p className="font-sans text-sm sm:text-base text-[#1A0F24]/85 leading-relaxed pl-7">
                      {dec.rationale}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm italic text-[#1A0F24]/60">
                Menyusul
              </p>
            )}
          </section>

          {/* Section 3: Pelajaran */}
          <section aria-labelledby="section-pelajaran" className="pt-6 border-t border-[#1A0F24]/15">
            <h2 id="section-pelajaran" className="font-display text-2xl sm:text-3xl font-bold text-[#1A0F24] mb-3">
              Pelajaran yang Didapat
            </h2>
            {cs?.lessons && cs.lessons.length > 0 ? (
              <ul className="space-y-3 pl-5 list-disc text-base text-[#1A0F24]/90 leading-relaxed marker:text-[#8B1538]">
                {cs.lessons.map((lesson, idx) => (
                  <li key={idx}>{lesson}</li>
                ))}
              </ul>
            ) : (
              <p className="font-sans text-sm italic text-[#1A0F24]/60">
                Menyusul
              </p>
            )}
          </section>
        </Booth>

        {/* Previous & Next Navigation with Chunky Buttons */}
        <nav
          className="pt-6 border-t border-white/15 flex items-center justify-between gap-4 flex-wrap"
          aria-label="Navigasi karya"
        >
          {prevProject ? (
            <Button
              as="link"
              to={`/karya/${prevProject.slug}`}
              variant="cream"
              size="sm"
            >
              &larr; {prevProject.name}
            </Button>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Button
              as="link"
              to={`/karya/${nextProject.slug}`}
              variant="gold"
              size="sm"
              className="ml-auto"
            >
              {nextProject.name} &rarr;
            </Button>
          ) : (
            <div />
          )}
        </nav>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs font-sans text-[#FFF1D6]/70 border-t border-white/10 bg-[#160B2E]/90 relative z-10">
        <p>© {new Date().getFullYear()} Ridwan Nurdiyanto Putra</p>
      </footer>
    </DuskBackground>
  );
};

export default CaseStudyPage;
