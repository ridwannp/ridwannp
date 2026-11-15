import React, { useState, useCallback } from 'react';
import { Work, FilterCategory, WORK_CATEGORIES, WORKS_INTRO } from '../../data/works';
import styles from '../../styles/KaryaPage.module.css';

interface AllWorksGridProps {
  allWorks: Work[];
  activeCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  onScrollToBuilding?: (index: number) => void;
}

export const AllWorksGrid: React.FC<AllWorksGridProps> = ({
  allWorks,
  activeCategory,
  onSelectCategory,
  onScrollToBuilding,
}) => {
  // Set of expanded project IDs (first project open by default as in screenshot)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([allWorks[0]?.id || 'billing-dashboard'])
  );

  const toggleExpand = useCallback((id: string, index: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    if (onScrollToBuilding) {
      onScrollToBuilding(index);
    }
  }, [onScrollToBuilding]);

  // Filter projects by active category
  const displayedWorks =
    activeCategory === 'Semua'
      ? allWorks
      : allWorks.filter((w) => w.category === activeCategory);

  return (
    <section className={styles.allSection} aria-labelledby="all-works-h2">
      {/* Gold accent bar */}
      <div className={styles.goldBar} aria-hidden="true" />

      {/* H2 Title */}
      <h2 id="all-works-h2" className={styles.allH2}>
        {WORKS_INTRO.allSectionH2}
      </h2>

      {/* Category Filter Pills */}
      <nav className={styles.filterRow} aria-label="Filter kategori semua karya">
        {WORK_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </nav>

      {/* Project Accordion Rows */}
      <div className={styles.projectList}>
        {displayedWorks.map((work, idx) => {
          const isExpanded = expandedIds.has(work.id);

          return (
            <article key={work.id} className={styles.projectRow}>
              <button
                type="button"
                className={styles.projectHeader}
                onClick={() => toggleExpand(work.id, idx)}
                aria-expanded={isExpanded}
                aria-controls={`work-content-${work.id}`}
              >
                <span className={styles.projectIndex}>{work.index}</span>

                <h3 className={styles.projectTitle}>{work.title}</h3>

                <span className={styles.projectContext}>{work.clientOrContext}</span>

                {work.status === 'dibangun' && (
                  <span className={styles.badgeDibangun}>Dibangun</span>
                )}
                {work.status === 'sedang dibangun' && (
                  <span className={styles.badgeSedangDibangun}>Sedang dibangun</span>
                )}
                {work.status === 'konsep' && (
                  <span className={styles.badgeKonsep}>Konsep</span>
                )}

                <span className={styles.toggleBtn} aria-hidden="true">
                  {isExpanded ? '×' : '+'}
                </span>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div id={`work-content-${work.id}`} className={styles.projectBody}>
                  <p className={styles.projectSummary}>{work.summary}</p>

                  {work.tags && work.tags.length > 0 && (
                    <div className={styles.tagRow} aria-label="Teknologi">
                      {work.tags.map((tag) => (
                        <span key={tag} className={styles.projectTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {work.roleNote && (
                    <p className={styles.roleNote}>{work.roleNote}</p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Footnote */}
      <p className={styles.footnote}>{WORKS_INTRO.enterpriseNote}</p>
    </section>
  );
};
