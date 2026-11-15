import React, { useRef, useEffect, useState } from 'react';
import { Poster } from './Poster';
import { registerRenderCallback } from '../motion/scrollSync';
import { PlaygroundSceneInstance } from './createPlaygroundScene';

interface PlaygroundCanvasProps {
  scrollProgress: number;
  activeCardIndex?: number;
  isReducedMotion: boolean;
}

export const PlaygroundCanvas: React.FC<PlaygroundCanvasProps> = ({
  scrollProgress,
  activeCardIndex = 0,
  isReducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const sceneInstanceRef = useRef<PlaygroundSceneInstance | null>(null);

  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  const cardRef = useRef(activeCardIndex);
  cardRef.current = activeCardIndex;

  useEffect(() => {
    if (isReducedMotion) {
      setUseFallback(true);
      return;
    }

    let isDisposed = false;
    let unregisterRender: (() => void) | null = null;

    const loadScene = async () => {
      if (!canvasRef.current || isDisposed) return;

      try {
        const { createPlaygroundScene } = await import('./createPlaygroundScene');
        if (isDisposed || !canvasRef.current) return;

        const scene = createPlaygroundScene(canvasRef.current, () => {
          setUseFallback(true);
        });

        if (!scene) {
          setUseFallback(true);
          return;
        }

        sceneInstanceRef.current = scene;

        // Render loop sync
        unregisterRender = registerRenderCallback(() => {
          if (document.hidden) return;
          scene.update(scrollRef.current, cardRef.current);
        });

        const onResize = () => {
          scene.resize();
        };

        window.addEventListener('resize', onResize);

        setSceneReady(true);

        return () => {
          window.removeEventListener('resize', onResize);
        };
      } catch {
        setUseFallback(true);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
        loadScene();
      });
    } else {
      setTimeout(loadScene, 50);
    }

    return () => {
      isDisposed = true;
      if (unregisterRender) unregisterRender();
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.dispose();
        sceneInstanceRef.current = null;
      }
    };
  }, [isReducedMotion]);

  if (useFallback) {
    return <Poster opacity={1} />;
  }

  return (
    <>
      <Poster opacity={sceneReady ? 0 : 1} />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh',
          opacity: sceneReady ? 1 : 0,
          transition: 'opacity 400ms ease',
        }}
      />
    </>
  );
};

