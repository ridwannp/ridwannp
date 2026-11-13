import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DOORS, Door } from '../data/doors';
import { Lamp } from './Lamp';
import { DustParticles } from './DustParticles';
import { SP, SHADE_HEIGHTS } from '../constants/terrace';

interface SceneContentProps {
  scrollOffset: number;
  hoveredIndex: number | null;
  onHoverDoor: (index: number | null) => void;
  onSelectDoor: (door: Door) => void;
  labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  prefersReducedMotion?: boolean;
}

const SceneContent: React.FC<SceneContentProps> = ({
  scrollOffset,
  hoveredIndex,
  onHoverDoor,
  onSelectDoor,
  labelRefs,
  prefersReducedMotion = false,
}) => {
  const { camera, size } = useThree();
  const railGroupRef = useRef<THREE.Group>(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // Update Camera Z based on prompt formula:
  // z = max(10, SP*1.9/(0.6887*aspect)), y = 0.8, lookAt (0, 0.7, 0)
  useEffect(() => {
    const aspect = Math.max(0.1, size.width / size.height);
    const cameraZ = Math.max(10, (SP * 1.9) / (0.6887 * aspect));
    camera.position.set(0, 0.8, cameraZ);
    camera.lookAt(0, 0.7, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(({ pointer }) => {
    const aspect = Math.max(0.1, size.width / size.height);
    const baseCameraZ = Math.max(10, (SP * 1.9) / (0.6887 * aspect));

    // Subtle Parallax
    if (!prefersReducedMotion) {
      const targetParallaxX = pointer.x * 0.35;
      const targetParallaxY = pointer.y * 0.2;
      parallaxRef.current.x += (targetParallaxX - parallaxRef.current.x) * 0.05;
      parallaxRef.current.y += (targetParallaxY - parallaxRef.current.y) * 0.05;

      camera.position.x = parallaxRef.current.x;
      camera.position.y = 0.8 + parallaxRef.current.y;
      camera.position.z = baseCameraZ;
      camera.lookAt(parallaxRef.current.x * 0.4, 0.7 + parallaxRef.current.y * 0.4, 0);
    } else {
      camera.position.set(0, 0.8, baseCameraZ);
      camera.lookAt(0, 0.7, 0);
    }

    // Move rail
    if (railGroupRef.current) {
      railGroupRef.current.position.x = scrollOffset;
    }

    // Project 3D positions to 2D HTML labels
    const currentRailX = railGroupRef.current ? railGroupRef.current.position.x : scrollOffset;

    for (let i = 0; i < DOORS.length; i++) {
      const el = labelRefs.current[i];
      if (!el) continue;

      const restingBaseY = SHADE_HEIGHTS[i % SHADE_HEIGHTS.length];
      // Target world position just below the lamp shade
      tempVec.set(i * SP + currentRailX, restingBaseY - 0.75, 0);
      tempVec.project(camera);

      // Screen coordinates in pixels
      const screenX = (tempVec.x * 0.5 + 0.5) * size.width;
      const screenY = (-tempVec.y * 0.5 + 0.5) * size.height;

      // Calculate edge fading: smooth fade when approaching left/right boundaries
      const absNdcX = Math.abs(tempVec.x);
      let opacity = 1;
      if (absNdcX > 1.05 || tempVec.z > 1) {
        opacity = 0;
      } else if (absNdcX > 0.7) {
        opacity = Math.max(0, (1.05 - absNdcX) / 0.35);
      }

      el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.visibility = opacity > 0.02 ? 'visible' : 'hidden';
    }
  });

  return (
    <>
      {/* Lights: ambient 0.8, directional 0.9 */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 8, 4]} intensity={0.9} color="#FFFDF7" />

      {/* Floating Dust Particles */}
      <DustParticles prefersReducedMotion={prefersReducedMotion} />

      {/* Rail Group of Lamps */}
      <group ref={railGroupRef}>
        {DOORS.map((door, index) => (
          <Lamp
            key={door.id}
            door={door}
            index={index}
            isHovered={hoveredIndex === index}
            onHover={onHoverDoor}
            onClick={onSelectDoor}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </group>
    </>
  );
};

export interface LampSceneProps {
  scrollOffset: number;
  hoveredIndex: number | null;
  onHoverDoor: (index: number | null) => void;
  onSelectDoor: (door: Door) => void;
  labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  prefersReducedMotion?: boolean;
  onWebGLError?: () => void;
}

export const LampScene: React.FC<LampSceneProps> = ({
  scrollOffset,
  hoveredIndex,
  onHoverDoor,
  onSelectDoor,
  labelRefs,
  prefersReducedMotion = false,
  onWebGLError,
}) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-auto" aria-hidden="true">
      <Canvas
        dpr={[1, 2]} // Performance: dpr capped at max 2
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{
          fov: 38,
          near: 0.1,
          far: 50,
          position: [0, 0.8, 12],
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent canvas
        }}
        onError={() => {
          if (onWebGLError) onWebGLError();
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <SceneContent
          scrollOffset={scrollOffset}
          hoveredIndex={hoveredIndex}
          onHoverDoor={onHoverDoor}
          onSelectDoor={onSelectDoor}
          labelRefs={labelRefs}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
};

export default LampScene;
