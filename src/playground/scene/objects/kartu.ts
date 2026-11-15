import * as THREE from 'three';
import { createFlatMaterial, createFakeShadow, PLAYGROUND_COLORS } from '../materials';

export function createKartu(idName: string, progressWidth = 0.6): THREE.Group {
  const group = new THREE.Group();
  group.name = idName;

  // Main card body (cream) 1.6 x 1.0 x 0.06
  const cardGeo = new THREE.BoxGeometry(1.6, 1.0, 0.06);
  const cardMat = createFlatMaterial(PLAYGROUND_COLORS.creamLight);
  const card = new THREE.Mesh(cardGeo, cardMat);
  group.add(card);

  // Top burgundy progress strip
  const stripGeo = new THREE.BoxGeometry(progressWidth, 0.06, 0.07);
  const stripMat = createFlatMaterial(PLAYGROUND_COLORS.burgundy);
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(-0.75 + progressWidth / 2, 0.42, 0.005);
  group.add(strip);

  // Decorative text line representation
  const lineGeo = new THREE.BoxGeometry(0.8, 0.04, 0.07);
  const lineMat = createFlatMaterial(PLAYGROUND_COLORS.creamDark);
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.position.set(-0.25, 0.15, 0.005);
  group.add(line);

  // Shadow
  const shadow = createFakeShadow(0.9);
  shadow.position.y = -0.7;
  group.add(shadow);

  return group;
}

