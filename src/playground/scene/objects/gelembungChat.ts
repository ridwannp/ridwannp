import * as THREE from 'three';
import { createFlatMaterial, createFakeShadow, PLAYGROUND_COLORS } from '../materials';

export function createGelembungChat(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'gelembungChat';

  // Bubble main box (cream)
  const boxGeo = new THREE.BoxGeometry(1.2, 0.8, 0.2);
  const boxMat = createFlatMaterial(PLAYGROUND_COLORS.creamLight);
  const box = new THREE.Mesh(boxGeo, boxMat);
  group.add(box);

  // Tail (cone)
  const tailGeo = new THREE.ConeGeometry(0.18, 0.35, 4);
  const tail = new THREE.Mesh(tailGeo, boxMat);
  tail.rotation.z = Math.PI * 0.75;
  tail.position.set(-0.5, -0.45, 0);
  group.add(tail);

  // 3 dots inside (ink)
  const dotMat = createFlatMaterial(PLAYGROUND_COLORS.ink);
  const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);

  const dot1 = new THREE.Mesh(dotGeo, dotMat);
  dot1.position.set(-0.3, 0, 0.11);
  group.add(dot1);

  const dot2 = new THREE.Mesh(dotGeo, dotMat);
  dot2.position.set(0, 0, 0.11);
  group.add(dot2);

  const dot3 = new THREE.Mesh(dotGeo, dotMat);
  dot3.position.set(0.3, 0, 0.11);
  group.add(dot3);

  // Shadow
  const shadow = createFakeShadow(0.8);
  shadow.position.y = -0.65;
  group.add(shadow);

  return group;
}

