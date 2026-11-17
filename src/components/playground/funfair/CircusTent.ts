import * as THREE from 'three';
import { FUNFAIR_COLORS, createPhongMaterial, createLightPool } from './materials';

export interface CircusTentInstance {
  group: THREE.Group;
  update: (progress: number, timeSeconds: number, isReducedMotion: boolean) => void;
  dispose: () => void;
}

export function createCircusTent(): CircusTentInstance {
  const group = new THREE.Group();
  group.position.set(-11, 0, -1);

  const coralMat = createPhongMaterial(FUNFAIR_COLORS.coral);
  const creamMat = createPhongMaterial(FUNFAIR_COLORS.cream);
  const goldMat = createPhongMaterial(FUNFAIR_COLORS.gold);

  // Ground light pool
  const lightPool = createLightPool(4.2, FUNFAIR_COLORS.coral, 0.4);
  group.add(lightPool);

  const wedgeCount = 12;
  const wedgeAngle = (Math.PI * 2) / wedgeCount;

  // 1. Body: 12 cylinder wedges (radius 2.3, height 1.8)
  const bodyRadius = 2.3;
  const bodyHeight = 1.8;

  for (let i = 0; i < wedgeCount; i++) {
    const mat = i % 2 === 0 ? coralMat : creamMat;
    const wedgeGeo = new THREE.CylinderGeometry(
      bodyRadius,
      bodyRadius,
      bodyHeight,
      1,
      1,
      false,
      i * wedgeAngle,
      wedgeAngle
    );
    const mesh = new THREE.Mesh(wedgeGeo, mat);
    mesh.position.y = bodyHeight / 2;
    group.add(mesh);
  }

  // 2. Roof: 12 cone wedges (radius 2.7, height 1.9)
  const roofRadius = 2.7;
  const roofHeight = 1.9;

  for (let i = 0; i < wedgeCount; i++) {
    const mat = i % 2 === 0 ? coralMat : creamMat;
    const roofWedgeGeo = new THREE.ConeGeometry(
      roofRadius,
      roofHeight,
      1,
      1,
      false,
      i * wedgeAngle,
      wedgeAngle
    );
    const mesh = new THREE.Mesh(roofWedgeGeo, mat);
    mesh.position.y = bodyHeight + roofHeight / 2;
    group.add(mesh);
  }

  // 3. Peak flag
  const flagPoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6);
  const flagPole = new THREE.Mesh(flagPoleGeo, goldMat);
  flagPole.position.y = bodyHeight + roofHeight + 0.35;
  group.add(flagPole);

  const flagGeo = new THREE.BufferGeometry();
  // Simple triangular flag vertices
  const vertices = new Float32Array([
    0, 0, 0,
    0.5, 0.15, 0,
    0, 0.3, 0,
  ]);
  flagGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  flagGeo.computeVertexNormals();

  const flagMat = new THREE.MeshBasicMaterial({
    color: FUNFAIR_COLORS.gold,
    side: THREE.DoubleSide,
  });
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(0, bodyHeight + roofHeight + 0.35, 0);
  group.add(flag);

  // 4. Glowing Mint Door (faces towards camera/discovery angle: ~0.8 rad rotation)
  const doorGeo = new THREE.PlaneGeometry(0.9, 1.3);
  const doorMat = new THREE.MeshBasicMaterial({
    color: FUNFAIR_COLORS.mint,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
  });
  const door = new THREE.Mesh(doorGeo, doorMat);
  // Positioned along the circumference at angle around -0.4 rad
  const doorAngle = 0.4;
  door.position.set(
    Math.sin(doorAngle) * (bodyRadius + 0.02),
    0.65,
    Math.cos(doorAngle) * (bodyRadius + 0.02)
  );
  door.rotation.y = doorAngle;
  group.add(door);

  const update = (progress: number, timeSeconds: number, isReducedMotion: boolean) => {
    // Flag flutter
    if (!isReducedMotion) {
      flag.rotation.y = Math.sin(timeSeconds * 3) * 0.25;
    }

    // Door glow intensifies when Discovery is active (around progress = 1.0)
    const discoveryProximity = Math.max(0, 1 - Math.abs(progress - 1.0));
    doorMat.opacity = 0.5 + discoveryProximity * 0.5;
  };

  const dispose = () => {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).geometry?.dispose();
      }
    });
  };

  return { group, update, dispose };
}

