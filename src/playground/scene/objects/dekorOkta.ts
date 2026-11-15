import * as THREE from 'three';
import { createFlatMaterial, createFakeShadow, PLAYGROUND_COLORS } from '../materials';

export function createDekorOkta(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'dekorOkta';

  const octGeo = new THREE.OctahedronGeometry(0.5, 0);
  const octMat = createFlatMaterial(PLAYGROUND_COLORS.gold);
  const oct = new THREE.Mesh(octGeo, octMat);
  group.add(oct);

  const shadow = createFakeShadow(0.5);
  shadow.position.y = -0.6;
  group.add(shadow);

  return group;
}

