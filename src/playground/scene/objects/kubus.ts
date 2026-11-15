import * as THREE from 'three';
import { createFlatMaterial, createFakeShadow, PLAYGROUND_COLORS } from '../materials';

export function createKubus(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'kubus';

  const size = 0.9;
  const boxGeo = new THREE.BoxGeometry(size, size, size);
  const boxMat = createFlatMaterial(PLAYGROUND_COLORS.creamLight);
  const box = new THREE.Mesh(boxGeo, boxMat);
  group.add(box);

  // Gold edges
  const edgesGeo = new THREE.EdgesGeometry(boxGeo);
  const edgesMat = new THREE.LineBasicMaterial({
    color: PLAYGROUND_COLORS.gold,
    linewidth: 2,
  });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  group.add(edges);

  // Shadow
  const shadow = createFakeShadow(0.8);
  shadow.position.y = -size / 2 - 0.1;
  group.add(shadow);

  return group;
}

