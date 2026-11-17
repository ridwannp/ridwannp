import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { HeroFallbackSvg } from './HeroFallbackSvg';

interface HeroSceneProps {
  progress: number; // 0 to 1
  isPastHero: boolean; // scrollY > 2.4 * vh
}

interface NavigatorExtended extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

function checkIsLowSpec(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const nav = window.navigator as NavigatorExtended;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return true;
    if (nav.deviceMemory && nav.deviceMemory <= 2) return true;
    if (nav.connection && (nav.connection.saveData || nav.connection.effectiveType === '2g')) return true;
  } catch {
    // fallback
  }
  return false;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ progress, isPastHero }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [useFallback, setUseFallback] = useState<boolean>(() => checkIsLowSpec());

  // Store progress in ref for high-performance animation frames
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const isPastRef = useRef(isPastHero);
  isPastRef.current = isPastHero;

  useEffect(() => {
    if (useFallback) return;

    let isDisposed = false;
    let animFrameId: number;
    let cleanupThree: (() => void) | null = null;

    // Dynamically import three only in hero
    import('three')
      .then((THREE) => {
        if (isDisposed || !containerRef.current) return;

        const container = containerRef.current;
        let width = Math.max(1, container.clientWidth || window.innerWidth);
        let height = Math.max(1, container.clientHeight || window.innerHeight);

        // 1. Renderer
        let renderer: THREE.WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          });
        } catch {
          setUseFallback(true);
          return;
        }

        const isMobileWidth = width <= 640;
        const maxDpr = isMobileWidth ? 1.5 : Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(maxDpr);
        renderer.setSize(width, height, false);
        renderer.setClearColor(0x000000, 0);

        const canvas = renderer.domElement;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.setAttribute('aria-hidden', 'true');
        container.innerHTML = '';
        container.appendChild(canvas);

        // 2. Scene & Camera
        const scene = new THREE.Scene();
        let aspect = Math.max(0.1, width / height);
        const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);

        // 3. Lighting (Dusk lighting: ambient 0.75, directional 0.85 from (-6, 10, 9))
        const ambientLight = new THREE.AmbientLight(0x9a7ab8, 0.75);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffe0b0, 0.85);
        dirLight.position.set(-6, 10, 9);
        scene.add(dirLight);

        // 4. Cards setup
        const N = isMobileWidth ? 16 : 22;
        const cardGeom = new THREE.BoxGeometry(0.72, 0.48, 0.05);

        // Shared Shiny Phong Materials: burgundy, gold, graphite, taupe, mint
        const cardColors = [0x8b1538, 0xffc83d, 0x3a2f44, 0xc9bda5, 0x4fd1a1];
        const cardMaterials = cardColors.map(
          (color) =>
            new THREE.MeshPhongMaterial({
              color,
              shininess: 70,
              flatShading: true,
            })
        );

        // Pre-generate deterministic pseudo-random state for "Rasa" (p=0)
        interface CardData {
          mesh: THREE.Mesh;
          rasaPos: THREE.Vector3;
          rasaRot: THREE.Euler;
          narasiPos: THREE.Vector3;
          narasiRot: THREE.Euler;
          floatSpeed: number;
          floatOffset: number;
        }

        const cardsData: CardData[] = [];

        // Precompute points for "Narasi" (p=1) along curve:
        // x in -5.4..5.4, y = -1.5 + sin(t * PI * 1.8) * 0.8
        for (let i = 0; i < N; i++) {
          const t = i / (N - 1);
          const nx = -5.4 + t * 10.8;
          const ny = -1.5 + Math.sin(t * Math.PI * 1.8) * 0.8;
          const nz = (i % 2 === 0 ? 0.02 : -0.02);

          // Tangent calculation
          const dx = 10.8;
          const dy = Math.cos(t * Math.PI * 1.8) * Math.PI * 1.8 * 0.8;
          const tangentAngle = Math.atan2(dy, dx);

          // "Rasa" random state: x -4..6.5, y -3..3, z -2..2
          // Deterministic seed based on index
          const rx = -4 + ((i * 17) % 10.5);
          const ry = -3 + ((i * 13) % 6);
          const rz = -2 + ((i * 19) % 4);

          const rotX = (((i * 7) % 60) - 30) * (Math.PI / 180);
          const rotY = (((i * 11) % 60) - 30) * (Math.PI / 180);
          const rotZ = (((i * 23) % 90) - 45) * (Math.PI / 180);

          const mat = cardMaterials[i % cardMaterials.length];
          const mesh = new THREE.Mesh(cardGeom, mat);
          scene.add(mesh);

          cardsData.push({
            mesh,
            rasaPos: new THREE.Vector3(rx, ry, rz),
            rasaRot: new THREE.Euler(rotX, rotY, rotZ),
            narasiPos: new THREE.Vector3(nx, ny, nz),
            narasiRot: new THREE.Euler(0, 0, tangentAngle),
            floatSpeed: 1.0 + (i % 5) * 0.2,
            floatOffset: i * 0.8,
          });
        }

        // 5. Golden Curve Line (TubeGeometry radius 0.03 along curve)
        class SineCurve extends THREE.Curve<THREE.Vector3> {
          getPoint(t: number): THREE.Vector3 {
            const cx = -5.4 + t * 10.8;
            const cy = -1.5 + Math.sin(t * Math.PI * 1.8) * 0.8;
            return new THREE.Vector3(cx, cy, 0);
          }
        }

        const curve = new SineCurve();
        const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.035, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: 0xffc83d,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        scene.add(tubeMesh);

        // Entrance scale animation: 0 -> 1 over 1.2s
        const startTime = performance.now();
        let entranceProgress = prefersReduced ? 1 : 0;

        // Position camera responsively based on width and aspect
        function updateCamera(w: number, h: number) {
          if (w <= 0 || h <= 0) return;
          aspect = Math.max(0.1, w / h);
          camera.aspect = aspect;
          camera.updateProjectionMatrix();

          // Responsive camera placement:
          // In mobile / narrow aspect (w <= 900), text is at top, so shift camera down and back
          if (w <= 900) {
            const camZ = Math.max(11.5, 9.5 / aspect);
            camera.position.set(0.6, -0.6, camZ);
            camera.lookAt(0.6, -0.9, 0);
          } else {
            // Desktop
            const camZ = Math.max(8.2, 9.2 / aspect);
            camera.position.set(0.5, -0.3, camZ);
            camera.lookAt(0.2, -0.5, 0);
          }
        }

        updateCamera(width, height);

        // Main animation loop
        const smoothstep = (x: number) => {
          const c = Math.max(0, Math.min(1, x));
          return c * c * (3 - 2 * c);
        };

        const renderLoop = (time: number) => {
          if (isDisposed) return;

          // Pause rendering when scrolled past 2.4 viewports
          if (isPastRef.current) {
            animFrameId = requestAnimationFrame(renderLoop);
            return;
          }

          try {
            // Safety check container size on every frame
            const currentW = Math.max(1, container.clientWidth || window.innerWidth);
            const currentH = Math.max(1, container.clientHeight || window.innerHeight);
            if (Math.abs(currentW - width) > 1 || Math.abs(currentH - height) > 1) {
              width = currentW;
              height = currentH;
              renderer.setSize(width, height, false);
              updateCamera(width, height);
            }

            // Entrance scale
            if (entranceProgress < 1 && !prefersReduced) {
              const elapsed = (time - startTime) / 1000;
              entranceProgress = Math.min(1, elapsed / 1.2);
            }

            const p = progressRef.current;
            const sec = time / 1000;

            // Interpolate each card
            for (let i = 0; i < N; i++) {
              const card = cardsData[i];
              // Stagger formula: q = clamp(p * 1.5 - (i / N) * 0.5, 0, 1)
              const rawQ = p * 1.5 - (i / N) * 0.5;
              const q = Math.max(0, Math.min(1, rawQ));
              const ease = smoothstep(q);

              // Floating subtle sine motion in "Rasa" state
              const floatMag = (1 - ease) * (prefersReduced ? 0 : 0.12);
              const floatY = Math.sin(sec * card.floatSpeed + card.floatOffset) * floatMag;
              const floatX = Math.cos(sec * 0.8 + card.floatOffset) * (floatMag * 0.6);

              // Position lerp
              card.mesh.position.x = card.rasaPos.x + (card.narasiPos.x - card.rasaPos.x) * ease + floatX;
              card.mesh.position.y = card.rasaPos.y + (card.narasiPos.y - card.rasaPos.y) * ease + floatY;
              card.mesh.position.z = card.rasaPos.z + (card.narasiPos.z - card.rasaPos.z) * ease;

              // Rotation lerp
              card.mesh.rotation.x = card.rasaRot.x * (1 - ease) + card.narasiRot.x * ease;
              card.mesh.rotation.y = card.rasaRot.y * (1 - ease) + card.narasiRot.y * ease;
              card.mesh.rotation.z = card.rasaRot.z * (1 - ease) + card.narasiRot.z * ease;

              // Entrance scale
              const s = entranceProgress;
              card.mesh.scale.set(s, s, s);
            }

            // Gold line appears when p > 0.55
            if (p > 0.55) {
              tubeMat.opacity = Math.min(1, (p - 0.55) / 0.3) * 0.9;
              tubeMesh.visible = true;
            } else {
              tubeMat.opacity = 0;
              tubeMesh.visible = false;
            }

            renderer.render(scene, camera);
          } catch (err) {
            console.warn('HeroScene render exception recovered:', err);
          }

          animFrameId = requestAnimationFrame(renderLoop);
        };

        animFrameId = requestAnimationFrame(renderLoop);

        cleanupThree = () => {
          isDisposed = true;
          cancelAnimationFrame(animFrameId);
          cardGeom.dispose();
          tubeGeom.dispose();
          tubeMat.dispose();
          cardMaterials.forEach((m) => m.dispose());
          renderer.dispose();
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        };
      })
      .catch((err) => {
        console.warn('Failed to load Three.js dynamically, switching to fallback SVG:', err);
        setUseFallback(true);
      });

    return () => {
      isDisposed = true;
      if (cleanupThree) {
        cleanupThree();
      }
    };
  }, [useFallback, prefersReduced]);

  if (useFallback) {
    return <HeroFallbackSvg />;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      aria-hidden="true"
    />
  );
};
