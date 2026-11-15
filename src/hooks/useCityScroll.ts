import { useEffect, useRef, useState, useCallback } from 'react';
import { Work } from '../data/works';
import { createCityScene, CitySceneInstance, clamp } from '../three/createCityScene';

interface UseCityScrollOptions {
  trackRef: React.RefObject<HTMLDivElement>;
  stageRef: React.RefObject<HTMLDivElement>;
  sceneHostRef: React.RefObject<HTMLDivElement>;
  works: Work[];
  prefersReducedMotion?: boolean;
}

export function useCityScroll({
  trackRef,
  stageRef,
  sceneHostRef,
  works,
  prefersReducedMotion = false,
}: UseCityScrollOptions) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [webGlFailed, setWebGlFailed] = useState<boolean>(false);

  const sceneInstanceRef = useRef<CitySceneInstance | null>(null);
  const curPosRef = useRef<number>(0);
  const targetPosRef = useRef<number>(0);
  const prevPosRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const worksRef = useRef<Work[]>(works);
  worksRef.current = works;

  // Compute target position from scroll progress
  const getTargetPosFromScroll = useCallback(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return 0;

    const trackRect = track.getBoundingClientRect();
    const trackScrollable = track.offsetHeight - stage.offsetHeight;
    if (trackScrollable <= 0) return 0;

    const p = clamp(-trackRect.top / trackScrollable, 0, 1);
    const N = worksRef.current.length;
    if (N <= 1) return 0;

    return p * (N - 1);
  }, [trackRef, stageRef]);

  // Animation frame loop
  const step = useCallback(
    (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const target = targetPosRef.current;
      let cur = curPosRef.current;

      if (prefersReducedMotion) {
        cur = target;
      } else {
        const factor = 1 - Math.exp(-dt * 6.5);
        cur += (target - cur) * factor;
        if (Math.abs(target - cur) < 0.0006) {
          cur = target;
        }
      }

      const dpos = cur - prevPosRef.current;
      prevPosRef.current = cur;
      curPosRef.current = cur;

      // Update 3D scene
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.update(cur, dpos);
      }

      // Active building index
      const N = worksRef.current.length;
      const rounded = clamp(Math.round(cur), 0, Math.max(0, N - 1));
      setActiveIndex((prev) => (prev !== rounded ? rounded : prev));

      // Continue rAF loop if still moving
      const diff = Math.abs(target - cur);
      if (diff > 0.0001) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        isRunningRef.current = false;
        rafIdRef.current = null;
      }
    },
    [prefersReducedMotion]
  );

  const startLoop = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(step);
    }
  }, [step]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      targetPosRef.current = getTargetPosFromScroll();
      startLoop();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial position on mount
    targetPosRef.current = getTargetPosFromScroll();
    curPosRef.current = targetPosRef.current;
    prevPosRef.current = curPosRef.current;
    startLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isRunningRef.current = false;
    };
  }, [getTargetPosFromScroll, startLoop]);

  // Initialize Three.js scene
  useEffect(() => {
    const host = sceneHostRef.current;
    if (!host) return;

    try {
      const scene = createCityScene(host, { prefersReducedMotion });
      scene.setWorks(worksRef.current);
      sceneInstanceRef.current = scene;
      setWebGlFailed(false);

      scene.update(curPosRef.current, 0);

      const handleResize = () => {
        scene.resize();
        if (!isRunningRef.current) {
          scene.update(curPosRef.current, 0);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        scene.dispose();
        sceneInstanceRef.current = null;
      };
    } catch (err) {
      console.error('Failed to create city 3D scene:', err);
      setWebGlFailed(true);
    }
  }, [sceneHostRef, prefersReducedMotion]);

  // Update scene when works list changes
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setWorks(works);
      targetPosRef.current = 0;
      curPosRef.current = 0;
      prevPosRef.current = 0;
      setActiveIndex(0);
      sceneInstanceRef.current.update(0, 0);
    }
  }, [works]);

  const scrollToBuilding = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const N = worksRef.current.length;
      if (N <= 1) return;

      const trackRect = track.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset;
      const trackTop = trackRect.top + currentScrollY;
      const trackScrollable = track.offsetHeight - stage.offsetHeight;

      const targetP = clamp(index / (N - 1), 0, 1);
      const targetScrollY = trackTop + targetP * trackScrollable;

      window.scrollTo({
        top: targetScrollY,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [trackRef, stageRef, prefersReducedMotion]
  );

  return {
    activeIndex,
    webGlFailed,
    scrollToBuilding,
  };
}
