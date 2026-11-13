import { useState, useEffect, useRef, useCallback } from 'react';
import { createJourneyScene, JourneySceneInstance, CharacterStyle } from '../three/createJourneyScene';
import { clamp, smoothstep } from '../three/path';

interface UseJourneyScrollProps {
  trackRef: React.RefObject<HTMLElement>;
  stageRef: React.RefObject<HTMLElement>;
  sceneHostRef: React.RefObject<HTMLElement>;
  cardRef: React.RefObject<HTMLElement>;
  prefersReducedMotion: boolean;
}

export function useJourneyScroll({
  trackRef,
  stageRef,
  sceneHostRef,
  cardRef,
  prefersReducedMotion,
}: UseJourneyScrollProps) {
  const [activeStop, setActiveStop] = useState(0);
  const [characterStyle, setCharacterStyle] = useState<CharacterStyle>('low-poly');
  const [webGlFailed, setWebGlFailed] = useState(false);

  const sceneInstanceRef = useRef<JourneySceneInstance | null>(null);
  const curPosRef = useRef(0);
  const prevPosRef = useRef(0);
  const targetPosRef = useRef(0);
  const doorFractionRef = useRef(0);
  const curDoorFractionRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isLoopRunningRef = useRef(false);

  // Compute scroll target pos from DOM
  const computeTargetFromScroll = useCallback(() => {
    if (!trackRef.current || !stageRef.current) return;

    const track = trackRef.current;
    const stage = stageRef.current;
    const trackRect = track.getBoundingClientRect();
    const scrollRange = track.offsetHeight - stage.offsetHeight;

    if (scrollRange <= 0) {
      targetPosRef.current = 0;
      doorFractionRef.current = 0;
      return;
    }

    const stickyTop = parseFloat(window.getComputedStyle(stage).top) || 0;
    const scrolledPastSticky = stickyTop - trackRect.top;
    const p = clamp(scrolledPastSticky / scrollRange, 0, 1);
    const N = 5;
    const s = p * N;
    const k = Math.min(N - 1, Math.floor(s));
    const f = s - k;

    if (k < N - 1) {
      targetPosRef.current = k + smoothstep((f - 0.45) / 0.55);
      doorFractionRef.current = 0;
    } else {
      targetPosRef.current = N - 1;
      doorFractionRef.current = f;
    }
  }, [stageRef, trackRef]);

  // Request Animation Frame loop (only runs when motion is pending)
  const scheduleUpdate = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;
    lastTimeRef.current = performance.now();

    const loop = (time: number) => {
      const dt = Math.max(0.001, Math.min(0.1, (time - lastTimeRef.current) / 1000));
      lastTimeRef.current = time;

      const target = targetPosRef.current;
      let cur = curPosRef.current;

      if (prefersReducedMotion) {
        cur = target;
        curDoorFractionRef.current = doorFractionRef.current;
      } else {
        const factor = 1 - Math.exp(-dt * 7.5);
        cur += (target - cur) * factor;

        if (Math.abs(target - cur) < 0.0006) {
          cur = target;
        }

        // Smooth door fraction in stop 4
        const targetDoorF = doorFractionRef.current;
        curDoorFractionRef.current += (targetDoorF - curDoorFractionRef.current) * factor;
      }

      const dpos = cur - prevPosRef.current;
      prevPosRef.current = cur;
      curPosRef.current = cur;

      // Update 3D scene if available
      let lit = 0;
      let doorCardOpacity = 0;
      if (sceneInstanceRef.current) {
        const res = sceneInstanceRef.current.update(cur, dpos, curDoorFractionRef.current);
        lit = res.lit;
        doorCardOpacity = res.doorCardOpacity;
      }

      // Stop index calculation & React state update
      const newActiveStop = clamp(Math.round(cur), 0, 4);
      setActiveStop((prev) => (prev !== newActiveStop ? newActiveStop : prev));

      // Direct card opacity and pointer-events update
      if (cardRef.current) {
        let opacity = 1;
        if (!webGlFailed) {
          if (newActiveStop < 4) {
            opacity = clamp((lit - 0.15) / 0.5, 0, 1);
          } else {
            opacity = doorCardOpacity;
          }
        }
        cardRef.current.style.opacity = opacity.toFixed(3);
        cardRef.current.style.pointerEvents = opacity < 0.3 ? 'none' : 'auto';
      }

      // Check if settled
      const isSettled =
        Math.abs(cur - target) < 0.0006 &&
        Math.abs(curDoorFractionRef.current - doorFractionRef.current) < 0.001;

      if (!isSettled && !prefersReducedMotion) {
        rafIdRef.current = requestAnimationFrame(loop);
      } else {
        isLoopRunningRef.current = false;
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(loop);
  }, [cardRef, prefersReducedMotion, webGlFailed]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!sceneHostRef.current) return;

    try {
      const instance = createJourneyScene(sceneHostRef.current, {
        prefersReducedMotion,
      });
      sceneInstanceRef.current = instance;
      instance.setStyle(characterStyle);
      setWebGlFailed(false);
    } catch (err) {
      console.warn('WebGL / Three.js scene initialization failed:', err);
      setWebGlFailed(true);
    }

    // Compute initial position from current scroll immediately on mount
    computeTargetFromScroll();
    curPosRef.current = targetPosRef.current;
    prevPosRef.current = targetPosRef.current;
    curDoorFractionRef.current = doorFractionRef.current;
    scheduleUpdate();

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isLoopRunningRef.current = false;
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.dispose();
        sceneInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeTargetFromScroll, prefersReducedMotion, scheduleUpdate, sceneHostRef]);

  // Update style when characterStyle state changes
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setStyle(characterStyle);
      scheduleUpdate();
    }
  }, [characterStyle, scheduleUpdate]);

  // Scroll listener (passive)
  useEffect(() => {
    const handleScroll = () => {
      computeTargetFromScroll();
      scheduleUpdate();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [computeTargetFromScroll, scheduleUpdate]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.resize();
      }
      computeTargetFromScroll();
      scheduleUpdate();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [computeTargetFromScroll, scheduleUpdate]);

  // Click pill scroll navigation
  const scrollToStop = useCallback(
    (k: number) => {
      if (!trackRef.current || !stageRef.current) return;
      const track = trackRef.current;
      const stage = stageRef.current;
      const scrollRange = track.offsetHeight - stage.offsetHeight;
      if (scrollRange <= 0) return;

      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const stickyTop = parseFloat(window.getComputedStyle(stage).top) || 0;
      const fraction = (k + 0.2) / 5;
      const targetY = trackTop - stickyTop + fraction * scrollRange;

      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion, stageRef, trackRef]
  );

  return {
    activeStop,
    characterStyle,
    setCharacterStyle,
    webGlFailed,
    scrollToStop,
  };
}

