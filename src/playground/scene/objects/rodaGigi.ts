import * as THREE from 'three';
import { createFlatMaterial, createFakeShadow, PLAYGROUND_COLORS } from '../materials';

export function createRodaGigi(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'rodaGigi';

  const goldMat = createFlatMaterial(PLAYGROUND_COLORS.gold);

  // Central 12-sided thin cylinder
  const radius = 0.7;
  const height = 0.16;
  const cylinderGeo = new THREE.CylinderGeometry(radius, radius, height, 12);
  const cylinder = new THREE.Mesh(cylinderGeo, goldMat);
  group.add(cylinder);

  // Center hole detail
  const holeGeo = new THREE.CylinderGeometry(0.25, 0.25, height + 0.02, 8);
  const holeMat = createFlatMaterial(PLAYGROUND_COLORS.creamDark);
  const hole = new THREE.Mesh(holeGeo, holeMat);
  group.add(hole);

  // 8 box teeth
  const toothGeo = new THREE.BoxGeometry(0.2, height, 0.22);
  const toothCount = 8;
  for (let i = 0; i < toothCount; i++) {
    const angle = (i / toothCount) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeo, goldMat);
    tooth.position.set(Math.cos(angle) * (radius + 0.08), 0, Math.sin(angle) * (radius + 0.08));
    tooth.rotation.y = -angle;
    group.add(tooth);
  }

  // Shadow
  const shadow = createFakeShadow(0.9);
  shadow.position.y = -height / 2 - 0.2;
  group.add(shadow);

  return group;
}

