import React, { useState } from 'react';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { Hero } from '../components/Hero';
import { DiscoveryDemo } from '../components/DiscoveryDemo';
import { CatalogPreview } from '../components/CatalogPreview';
import { ClosingStatement } from '../components/ClosingStatement';
import { useReducedMotion } from '../motion/useReducedMotion';

export const PlaygroundPage: React.FC = () => {
  const [reducedMotion] = useReducedMotion();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  return (
    <PlaygroundLayout activeCardIndex={activeCardIndex}>
      <Hero isReducedMotion={reducedMotion} />
      <DiscoveryDemo
        isReducedMotion={reducedMotion}
        onActiveCardChange={setActiveCardIndex}
      />
      <CatalogPreview isReducedMotion={reducedMotion} />
      <ClosingStatement isReducedMotion={reducedMotion} />
    </PlaygroundLayout>
  );
};

export default PlaygroundPage;

