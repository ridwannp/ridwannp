import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export interface SceneGuardsOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  cameraRef: React.RefObject<THREE.Camera | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  onRenderFrame?: () => void;
  onAutoDowngrade?: () => void;
}

export function useSceneGuards({
  containerRef,
  cameraRef,
  rendererRef,
  onRenderFrame,
  onAutoDowngrade,
}: SceneGuardsOptions) {
  const isTabVisibleRef = useRef<boolean>(true);
  const isInViewportRef = useRef<boolean>(true);
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  // 1. Tab visibility guard (stop rendering when tab is hidden)
  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // 2. IntersectionObserver guard (stop rendering when scene element is out of viewport)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewportRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  // 3. Viewport size safety & resize helper
  const getSafeDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { width: 1, height: 1 };
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    return { width, height };
  }, [containerRef]);

  // 4. NaN / Infinity guard for vector / position / rotation
  const sanitizeVector = useCallback((v: THREE.Vector3, fallback: [number, number, number] = [0, 0, 0]) => {
    if (isNaN(v.x) || !isFinite(v.x)) v.x = fallback[0];
    if (isNaN(v.y) || !isFinite(v.y)) v.y = fallback[1];
    if (isNaN(v.z) || !isFinite(v.z)) v.z = fallback[2];
  }, []);

  // 5. Frame tick execution with try/catch, performance measurement & auto-downgrade check
  const executeGuardedFrame = useCallback(() => {
    // If tab hidden or not in viewport, skip frame
    if (!isTabVisibleRef.current || !isInViewportRef.current) {
      return false;
    }

    const now = performance.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Track frame times for auto-downgrade (downgrade if avg frame > 24ms for ~2 seconds / 60 frames)
    if (onAutoDowngrade) {
      const times = frameTimesRef.current;
      times.push(delta);
      if (times.length > 60) times.shift();

      if (times.length >= 60) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        if (avg > 24) {
          onAutoDowngrade();
          frameTimesRef.current = []; // reset window
        }
      }
    }

    // Camera check
    const camera = cameraRef.current;
    if (camera) {
      sanitizeVector(camera.position, [0, 5, 10]);
    }

    // Execute render frame safely
    try {
      if (rendererRef.current && onRenderFrame) {
        onRenderFrame();
      }
      return true;
    } catch (err) {
      console.warn('[SceneGuards] Render frame error caught:', err);
      return false;
    }
  }, [cameraRef, rendererRef, onRenderFrame, onAutoDowngrade, sanitizeVector]);

  return {
    isTabVisibleRef,
    isInViewportRef,
    getSafeDimensions,
    sanitizeVector,
    executeGuardedFrame,
  };
}
