import * as THREE from 'three';
import { createFlatMaterial, createFakeShadow, PLAYGROUND_COLORS } from '../materials';

export function createLensa(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'lensa';

  // Torus lens frame (burgundy)
  const torusGeo = new THREE.TorusGeometry(0.9, 0.14, 8, 24);
  const torusMat = createFlatMaterial(PLAYGROUND_COLORS.burgundy);
  const torus = new THREE.Mesh(torusGeo, torusMat);
  group.add(torus);

  // Inner subtle glass disc
  const discGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.04, 16);
  const discMat = createFlatMaterial(PLAYGROUND_COLORS.creamLight, 0.4);
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = Math.PI / 2;
  group.add(disc);

  // Handle (gold)
  const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12);
  const handleMat = createFlatMaterial(PLAYGROUND_COLORS.gold);
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.position.set(0, -1.35, 0);
  group.add(handle);

  // Shadow
  const shadow = createFakeShadow(1.1);
  shadow.position.y = -1.8;
  group.add(shadow);

  return group;
}

