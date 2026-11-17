import * as THREE from 'three';
import { FUNFAIR_COLORS } from './materials';

export interface StringLightsInstance {
  group: THREE.Group;
  update: (timeSeconds: number, isReducedMotion: boolean) => void;
  dispose: () => void;
}

interface StrandConfig {
  p0: [number, number, number];
  p1: [number, number, number];
  sag: number;
  count: number;
}

export function createStringLights(): StringLightsInstance {
  const group = new THREE.Group();

  const strands: StrandConfig[] = [
    { p0: [-11, 5.4, -3], p1: [3.8, 7.8, -3], sag: 2.2, count: 24 },
    { p0: [3.8, 7.8, -3], p1: [14, 5, -3], sag: 1.6, count: 20 },
    { p0: [-4, 6.6, 2], p1: [8, 6.8, 2], sag: 1.4, count: 18 },
  ];

  // Cable material
  const cableMat = new THREE.LineBasicMaterial({
    color: 0x3a2f44,
    transparent: true,
    opacity: 0.7,
  });

  // Calculate catenary points for cables
  strands.forEach(({ p0, p1, sag }) => {
    const points: THREE.Vector3[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = p0[0] + (p1[0] - p0[0]) * t;
      const z = p0[2] + (p1[2] - p0[2]) * t;
      // Parabolic catenary sag formula: 4 * sag * t * (1 - t)
      const y = p0[1] + (p1[1] - p0[1]) * t - 4 * sag * t * (1 - t);
      points.push(new THREE.Vector3(x, y, z));
    }
    const cableGeo = new THREE.BufferGeometry().setFromPoints(points);
    const cable = new THREE.Line(cableGeo, cableMat);
    group.add(cable);
  });

  // Collect bulb positions
  const bulbPositions: THREE.Vector3[] = [];
  strands.forEach(({ p0, p1, sag, count }) => {
    for (let i = 1; i < count; i++) {
      const t = i / count;
      const x = p0[0] + (p1[0] - p0[0]) * t;
      const z = p0[2] + (p1[2] - p0[2]) * t;
      const y = p0[1] + (p1[1] - p0[1]) * t - 4 * sag * t * (1 - t);
      bulbPositions.push(new THREE.Vector3(x, y - 0.05, z));
    }
  });

  const totalBulbs = bulbPositions.length;
  const bulbColors = [FUNFAIR_COLORS.gold, FUNFAIR_COLORS.cream, FUNFAIR_COLORS.coral];
  const instancedMeshes: THREE.InstancedMesh[] = [];

  const bulbGeo = new THREE.SphereGeometry(0.09, 8, 8);

  bulbColors.forEach((col) => {
    const mat = new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.9,
    });
    // Divide total bulbs roughly among 3 colors
    const countForCol = Math.ceil(totalBulbs / 3);
    const mesh = new THREE.InstancedMesh(bulbGeo, mat, countForCol);
    instancedMeshes.push(mesh);
    group.add(mesh);
  });

  // Assign matrices
  const dummy = new THREE.Object3D();

  const colorIndices = [0, 0, 0];
  bulbPositions.forEach((pos, idx) => {
    const colIdx = idx % 3;
    const mesh = instancedMeshes[colIdx];
    const itemIdx = colorIndices[colIdx];

    dummy.position.copy(pos);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    mesh.setMatrixAt(itemIdx, dummy.matrix);

    colorIndices[colIdx]++;
  });

  instancedMeshes.forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
  });

  const update = (timeSeconds: number, isReducedMotion: boolean) => {
    if (isReducedMotion) {
      instancedMeshes.forEach((m) => {
        (m.material as THREE.MeshBasicMaterial).opacity = 0.9;
      });
      return;
    }

    // Twinkle with sine opacity at different phases
    instancedMeshes.forEach((m, idx) => {
      const phase = idx * 2.1;
      const op = 0.65 + Math.sin(timeSeconds * 4 + phase) * 0.35;
      (m.material as THREE.MeshBasicMaterial).opacity = Math.max(0.2, op);
    });
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
