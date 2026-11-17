import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FUNFAIR_COLORS } from './materials';
import { createFerrisWheel } from './FerrisWheel';
import { createCircusTent } from './CircusTent';
import { createProductTurntable } from './ProductTurntable';
import { createStringLights } from './StringLights';
import { createDecorations } from './Decorations';
import { computeCameraTargets } from './CameraChoreography';
import { QualityTier } from '../hooks/useQualityTier';

interface FunfairSceneProps {
  sectionProgress: number; // 0 to 3
  selectedProductIndex: number;
  onSelectProduct: (index: number) => void;
  triggerFireworks?: boolean;
  isReducedMotion: boolean;
  tier: QualityTier;
  onRecordFrameTime: (deltaMs: number) => void;
}

export const FunfairScene: React.FC<FunfairSceneProps> = ({
  sectionProgress,
  selectedProductIndex,
  onSelectProduct,
  triggerFireworks,
  isReducedMotion,
  tier,
  onRecordFrameTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep updated values in animation loop without recreation
  const progressRef = useRef(sectionProgress);
  progressRef.current = sectionProgress;

  const productIdxRef = useRef(selectedProductIndex);
  productIdxRef.current = selectedProductIndex;

  const reducedMotionRef = useRef(isReducedMotion);
  reducedMotionRef.current = isReducedMotion;

  const triggerFwRef = useRef(triggerFireworks);
  triggerFwRef.current = triggerFireworks;

  const decorationsRef = useRef<ReturnType<typeof createDecorations> | null>(null);

  // Watch triggerFireworks changes
  useEffect(() => {
    if (triggerFireworks && decorationsRef.current && !isReducedMotion) {
      decorationsRef.current.triggerResultFireworks();
    }
  }, [triggerFireworks, isReducedMotion]);

  useEffect(() => {
    if (tier === 'minimal' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    let animId: number | null = null;
    let isDisposed = false;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(FUNFAIR_COLORS.fog, 34, 100);

    // 2. Camera
    const initialWidth = Math.max(1, window.innerWidth);
    const initialHeight = Math.max(1, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(30, initialWidth / initialHeight, 0.1, 200);
    camera.position.set(2.4, 3.6, 16);
    camera.lookAt(0.8, 3.8, 0);

    // 3. Lighting
    const hemiLight = new THREE.HemisphereLight(FUNFAIR_COLORS.ambient, FUNFAIR_COLORS.ground, 0.75);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(FUNFAIR_COLORS.directional, 0.85);
    dirLight.position.set(-6, 10, 9);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(FUNFAIR_COLORS.gold, 0.9, 26);
    pointLight.position.set(3.8, 5, 4);
    scene.add(pointLight);

    // 4. Renderer
    const isMobileDpr = window.devicePixelRatio >= 2;
    const maxPixelRatio = tier === 'low' ? 1.25 : 1.5;
    const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobileDpr, // disabled if dpr >= 2 for performance
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(initialWidth, initialHeight, false);
      renderer.setClearColor(0x000000, 0);
    } catch {
      return;
    }

    // 5. Build Subsystems
    const ferrisWheel = createFerrisWheel();
    scene.add(ferrisWheel.group);

    const circusTent = createCircusTent();
    scene.add(circusTent.group);

    const turntable = createProductTurntable();
    scene.add(turntable.group);

    const stringLights = createStringLights();
    scene.add(stringLights.group);

    const decorations = createDecorations(tier === 'low');
    decorationsRef.current = decorations;
    scene.add(decorations.group);

    // 6. Pointer Parallax
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    const isFineHover =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const onPointerMove = (e: MouseEvent) => {
      if (!isFineHover) return;
      targetPointerX = (e.clientX / window.innerWidth) * 2 - 1;
      targetPointerY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (isFineHover) {
      window.addEventListener('mousemove', onPointerMove, { passive: true });
    }

    // 7. Raycasting Click on Products
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onWindowClick = (e: MouseEvent) => {
      // Only active when product section is visible (progress between ~1.4 and 2.6)
      const currentProg = progressRef.current;
      if (currentProg < 1.3 || currentProg > 2.7) return;

      // Don't intercept if click is over interactive HTML elements
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.pg-booth-interactive')) return;

      mouseCoord.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseCoord.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseCoord, camera);
      const clickedIdx = turntable.handleClick(raycaster);
      if (clickedIdx !== null) {
        onSelectProduct(clickedIdx);
      }
    };

    window.addEventListener('click', onWindowClick);

    // 8. Resize Observer
    const handleResize = () => {
      if (!renderer || isDisposed) return;
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let smoothedScrollVel = 0;
    const currentCamPos = new THREE.Vector3(2.4, 3.6, 16);
    const currentLookAt = new THREE.Vector3(0.8, 3.8, 0);

    const tick = () => {
      if (isDisposed) return;

      const now = performance.now();
      const deltaMs = Math.min(100, now - lastTime);
      const deltaSec = deltaMs * 0.001;
      lastTime = now;

      // Frame time recording
      onRecordFrameTime(deltaMs);

      if (!document.hidden) {
        try {
          // Zero-dimension fallback check every frame
          const w = Math.max(1, window.innerWidth);
          const h = Math.max(1, window.innerHeight);
          if (camera.aspect !== w / h) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
          }

          // Scroll velocity calculation
          const currentY = window.scrollY;
          const scrollDelta = Math.abs(currentY - lastScrollY);
          lastScrollY = currentY;
          smoothedScrollVel += (scrollDelta - smoothedScrollVel) * 0.1;

          // Pointer lerp
          pointerX += (targetPointerX - pointerX) * 0.05;
          pointerY += (targetPointerY - pointerY) * 0.05;

          const prog = progressRef.current;
          const isNarrow = w <= 900;
          const isReduced = reducedMotionRef.current;

          // Compute Camera Position & LookAt
          const targets = computeCameraTargets(prog, isNarrow, { x: pointerX, y: pointerY });

          if (isReduced) {
            currentCamPos.copy(targets.position);
            currentLookAt.copy(targets.lookAt);
          } else {
            // Damped camera motion: 1 - pow(0.0009, dt)
            const lerpFactor = 1 - Math.pow(0.0009, deltaSec);
            currentCamPos.lerp(targets.position, Math.max(0.01, Math.min(1, lerpFactor)));
            currentLookAt.lerp(targets.lookAt, Math.max(0.01, Math.min(1, lerpFactor)));
          }

          camera.position.copy(currentCamPos);
          camera.lookAt(currentLookAt);

          // Update subsystems
          const timeSec = now * 0.001;
          ferrisWheel.update(deltaSec, smoothedScrollVel, isReduced);
          circusTent.update(prog, timeSec, isReduced);
          turntable.update(deltaSec, productIdxRef.current, isReduced);
          stringLights.update(timeSec, isReduced);
          decorations.update(deltaSec, timeSec, prog, smoothedScrollVel, camera.position.x, isReduced);

          renderer.render(scene, camera);
        } catch {
          // Prevent individual frame error from breaking the animation loop
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      isDisposed = true;
      if (animId) cancelAnimationFrame(animId);

      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('click', onWindowClick);
      window.removeEventListener('resize', handleResize);

      ferrisWheel.dispose();
      circusTent.dispose();
      turntable.dispose();
      stringLights.dispose();
      decorations.dispose();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [tier, onSelectProduct, onRecordFrameTime]);

  if (tier === 'minimal') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100svh',
      }}
    />
  );
};
