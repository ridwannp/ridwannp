import React, { useState, useEffect, Suspense } from 'react';
import { TopBar } from '../components/playground/TopBar';
import { Hero } from '../components/playground/Hero';
import { DiscoveryBooth } from '../components/playground/DiscoveryBooth';
import { ProductBooth } from '../components/playground/ProductBooth';
import { Finale } from '../components/playground/Finale';
import { DecorLayer } from '../components/playground/DecorLayer';
import { StaticFallback } from '../components/playground/funfair/StaticFallback';
import { useSectionProgress } from '../components/playground/hooks/useSectionProgress';
import { useQualityTier } from '../components/playground/hooks/useQualityTier';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { HERO_COPY } from '../content/playground';
import '../components/playground/Playground.css';

// Lazy-load Three.js Funfair 3D scene
const FunfairScene = React.lazy(() =>
  import('../components/playground/funfair/FunfairScene').then((m) => ({
    default: m.FunfairScene,
  }))
);

export const PlaygroundPage: React.FC = () => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [triggerFireworks, setTriggerFireworks] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const sectionProgress = useSectionProgress();
  const isReducedMotion = useReducedMotion();
  const { tier, recordFrameTime } = useQualityTier();

  // Set SEO Meta
  useEffect(() => {
    document.title = 'Digital Playground – Rasanara';

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    let createdDesc = false;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      createdDesc = true;
    }
    const prevDesc = metaDesc.content;
    metaDesc.content = HERO_COPY.lead;

    // OpenGraph Title & Desc
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = 'Digital Playground – Rasanara';

    return () => {
      if (metaDesc) {
        if (createdDesc) {
          document.head.removeChild(metaDesc);
        } else {
          metaDesc.content = prevDesc;
        }
      }
    };
  }, []);

  // Update active section from scroll position
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const discoveryEl = document.getElementById('discovery');
      const produkEl = document.getElementById('produk');

      const discTop = discoveryEl ? discoveryEl.offsetTop - vh * 0.4 : vh;
      const prodTop = produkEl ? produkEl.offsetTop - vh * 0.4 : vh * 2;

      if (scrollY >= prodTop) {
        setActiveSection('produk');
      } else if (scrollY >= discTop) {
        setActiveSection('discovery');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pg-dusk-canvas">
      {/* Twinkling Stars Background */}
      <div className="pg-stars-layer" aria-hidden="true" />

      {/* 3D Scene or Static Fallback */}
      {tier === 'minimal' ? (
        <StaticFallback />
      ) : (
        <Suspense fallback={<StaticFallback />}>
          <FunfairScene
            sectionProgress={sectionProgress}
            selectedProductIndex={selectedProductIndex}
            onSelectProduct={setSelectedProductIndex}
            triggerFireworks={triggerFireworks}
            isReducedMotion={isReducedMotion}
            tier={tier}
            onRecordFrameTime={recordFrameTime}
          />
        </Suspense>
      )}

      {/* Parallax SVG Decor Elements */}
      <DecorLayer isReducedMotion={isReducedMotion} />

      {/* Navigation TopBar */}
      <TopBar activeSection={activeSection} />

      {/* Main Content Container */}
      <main
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1120px',
          margin: '0 auto',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
        }}
      >
        <Hero isReducedMotion={isReducedMotion} />
        <DiscoveryBooth onResultAppeared={() => setTriggerFireworks(true)} />
        <ProductBooth
          selectedIndex={selectedProductIndex}
          onSelectIndex={setSelectedProductIndex}
        />
        <Finale />
      </main>
    </div>
  );
};

export default PlaygroundPage;

