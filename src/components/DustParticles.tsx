import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DOORS } from '../data/doors';
import { SP } from '../constants/terrace';

interface DustParticlesProps {
  prefersReducedMotion?: boolean;
}

export const DustParticles: React.FC<DustParticlesProps> = ({ prefersReducedMotion = false }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Responsive particle count: fewer on smaller viewports
  const count = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 35;
    }
    return 75;
  }, []);

  const maxX = (DOORS.length - 1) * SP + 3;
  const minX = -3;
  const minY = -2.3;
  const maxY = 4.3;

  // Initialize randomized positions & speeds
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = minX + Math.random() * (maxX - minX);
      pos[i * 3 + 1] = minY + Math.random() * (maxY - minY);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;

      spd[i] = 0.12 + Math.random() * 0.18; // Slow upward float
    }

    return { positions: pos, speeds: spd };
  }, [count, maxX, minX, minY, maxY]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#4A4553',
      size: 0.045,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (prefersReducedMotion || !pointsRef.current) return;

    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1; // y coordinate
      array[idx] += speeds[i] * delta;

      // Wrap around when reaching top
      if (array[idx] > maxY) {
        array[idx] = minY;
      }
    }

    positionAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};
