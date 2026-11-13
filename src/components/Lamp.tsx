import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Door } from '../data/doors';
import { SP, RY, FLOOR_Y, SHADE_RADIUS, SHADE_HEIGHTS } from '../constants/terrace';

interface LampProps {
  door: Door;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  onClick: (door: Door) => void;
  prefersReducedMotion?: boolean;
}

export const Lamp: React.FC<LampProps> = ({
  door,
  index,
  isHovered,
  onHover,
  onClick,
  prefersReducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bulbMeshRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const coneMeshRef = useRef<THREE.Mesh>(null);
  const floorPuddleRef = useRef<THREE.Mesh>(null);

  // Impulse timer for single swing on hover
  const hoverStartTimeRef = useRef<number | null>(null);
  const prevHoveredRef = useRef(isHovered);

  // Track hover start
  if (isHovered && !prevHoveredRef.current) {
    hoverStartTimeRef.current = null; // Will initialize in next frame
  }
  prevHoveredRef.current = isHovered;

  // Lamp resting position calculation
  const restingBaseY = useMemo(() => {
    return SHADE_HEIGHTS[index % SHADE_HEIGHTS.length];
  }, [index]);

  const cordLength = useMemo(() => {
    // Cord hangs from RY down to top of shade (restingBaseY + SHADE_RADIUS)
    return RY - (restingBaseY + SHADE_RADIUS);
  }, [restingBaseY]);

  const coneHeight = useMemo(() => {
    return Math.max(0.1, restingBaseY - FLOOR_Y);
  }, [restingBaseY]);

  const floorRadius = 1.35;

  // Materials & Geometries
  const isSoon = door.status === 'soon';
  const shadeColor = useMemo(() => (isSoon ? '#D9D4DD' : door.color), [isSoon, door.color]);

  // Entrance timing
  const delaySec = useMemo(() => Math.min(index, 3) * 0.3, [index]);
  const entranceDurationSec = 0.85;
  const flickerDurationSec = 0.45;

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. Entrance animation
    let dropProgress = 1;
    let flickerFactor = 1;

    if (!prefersReducedMotion) {
      if (time < delaySec) {
        dropProgress = 0;
      } else if (time < delaySec + entranceDurationSec) {
        const t = (time - delaySec) / entranceDurationSec;
        // Ease-out cubic: 1 - (1 - t)^3
        dropProgress = 1 - Math.pow(1 - t, 3);
      } else {
        dropProgress = 1;
        // Post-drop flicker
        const flickerTime = time - (delaySec + entranceDurationSec);
        if (flickerTime < flickerDurationSec) {
          // Rapid flicker
          flickerFactor = Math.sin(flickerTime * 35) > 0.1 ? 1 : 0.15;
        }
      }
    }

    const dropOffsetY = (1 - dropProgress) * 6.5;

    // 2. Swing animation
    let swingAngle = 0;
    if (!prefersReducedMotion && dropProgress >= 0.8) {
      // Idle gentle swing
      const idleSwing = Math.sin(time * 1.15 + index * 1.4) * 0.02;

      // Hover impulse single swing
      let hoverImpulse = 0;
      if (isHovered) {
        if (hoverStartTimeRef.current === null) {
          hoverStartTimeRef.current = time;
        }
        const elapsed = time - hoverStartTimeRef.current;
        if (elapsed < 1.8) {
          // Damped sine impulse
          hoverImpulse = Math.sin(elapsed * 6.0) * Math.exp(-elapsed * 2.2) * 0.085;
        }
      }

      swingAngle = idleSwing + hoverImpulse;
    }

    // Apply rotation at pivot (RY)
    groupRef.current.rotation.z = swingAngle;
    groupRef.current.position.y = RY + dropOffsetY;

    // 3. Bulb glow & flicker
    if (bulbMeshRef.current) {
      const bulbMat = bulbMeshRef.current.material as THREE.MeshStandardMaterial;
      if (isSoon) {
        bulbMat.emissiveIntensity = 0;
      } else {
        const baseIntensity = isHovered ? 2.5 : 0.9;
        bulbMat.emissiveIntensity = baseIntensity * flickerFactor * dropProgress;
      }
    }

    // 4. Point light intensity
    if (pointLightRef.current) {
      if (isSoon || dropProgress < 0.5) {
        pointLightRef.current.intensity = 0;
      } else {
        const targetLight = isHovered ? 2.2 : 0.7;
        pointLightRef.current.intensity = targetLight * flickerFactor;
      }
    }

    // 5. Cone opacity transition (Normal blending)
    if (coneMeshRef.current) {
      const coneMat = coneMeshRef.current.material as THREE.MeshBasicMaterial;
      if (isSoon || dropProgress < 0.7) {
        coneMat.opacity = 0;
      } else {
        const targetOpacity = isHovered ? 0.24 : 0.06;
        coneMat.opacity += (targetOpacity * flickerFactor - coneMat.opacity) * 0.15;
      }
    }

    // 6. Floor puddle opacity transition (Normal blending)
    if (floorPuddleRef.current) {
      const puddleMat = floorPuddleRef.current.material as THREE.MeshBasicMaterial;
      if (isSoon || dropProgress < 0.7) {
        puddleMat.opacity = 0;
      } else {
        const targetOpacity = isHovered ? 0.32 : 0.08;
        puddleMat.opacity += (targetOpacity * flickerFactor - puddleMat.opacity) * 0.15;
      }
    }
  });

  const posX = index * SP;

  return (
    <group position={[posX, 0, 0]}>
      {/* Floor puddle at world FLOOR_Y = -2.39 (independent of swing group for static floor puddle) */}
      {!isSoon && (
        <mesh
          ref={floorPuddleRef}
          position={[0, FLOOR_Y + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[floorRadius, 32]} />
          <meshBasicMaterial
            color={door.color}
            transparent
            opacity={0.08}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}

      {/* Hanging pendulum group pivoting at suspension point (0, RY, 0) */}
      <group ref={groupRef} position={[0, RY, 0]}>
        {/* Cord from (0, 0, 0) down to (0, -cordLength, 0) */}
        <mesh position={[0, -cordLength / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, cordLength, 8]} />
          <meshStandardMaterial color="#1A1720" roughness={0.6} />
        </mesh>

        {/* Lamp Shade group positioned at bottom of cord */}
        <group position={[0, -cordLength, 0]}>
          {/* Top cord cap / connector where cord meets the dome apex */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.07, 12]} />
            <meshStandardMaterial color="#1A1720" roughness={0.4} />
          </mesh>

          {/* Lampshade: Semi-sphere kap (radius 0.85, DoubleSide) */}
          {/* Natural dome orientation: apex at (0, 0, 0), open rim facing downward at (0, -SHADE_RADIUS, 0) */}
          <mesh
            position={[0, -SHADE_RADIUS, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(index);
            }}
            onPointerOut={() => onHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              onClick(door);
            }}
          >
            <sphereGeometry args={[SHADE_RADIUS, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial
              color={shadeColor}
              roughness={0.28}
              metalness={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Thin dark ring at bottom rim edge */}
          <mesh position={[0, -SHADE_RADIUS, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[SHADE_RADIUS, 0.02, 16, 48]} />
            <meshStandardMaterial color="#1A1720" roughness={0.5} />
          </mesh>

          {/* Warm bulb tucked inside the dome */}
          <mesh ref={bulbMeshRef} position={[0, -SHADE_RADIUS + 0.35, 0]}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial
              color={isSoon ? '#B8B3BE' : '#FFF9E8'}
              emissive={isSoon ? '#000000' : '#FFE7B0'}
              emissiveIntensity={isSoon ? 0 : 0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Point light for open doors */}
          {!isSoon && (
            <pointLight
              ref={pointLightRef}
              position={[0, -SHADE_RADIUS + 0.25, 0]}
              color="#FFE7B0"
              intensity={0.7}
              distance={7.0}
              decay={2}
            />
          )}

          {/* Light cone extending from lamp rim down to the floor */}
          {!isSoon && (
            <mesh
              ref={coneMeshRef}
              position={[0, -SHADE_RADIUS - coneHeight / 2, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(index);
              }}
              onPointerOut={() => onHover(null)}
              onClick={(e) => {
                e.stopPropagation();
                onClick(door);
              }}
            >
              <cylinderGeometry
                args={[SHADE_RADIUS, floorRadius, coneHeight, 32, 1, true]}
              />
              <meshBasicMaterial
                color="#FFF8EA"
                transparent
                opacity={0.06}
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.NormalBlending}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
};
