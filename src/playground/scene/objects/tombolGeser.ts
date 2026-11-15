import * as THREE from 'three';
import { createFlatMaterial, createFakeShadow, PLAYGROUND_COLORS } from '../materials';

export function createTombolGeser(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'tombolGeser';

  // Base track (burgundy rounded box)
  const trackGeo = new THREE.BoxGeometry(1.2, 0.45, 0.16);
  const trackMat = createFlatMaterial(PLAYGROUND_COLORS.burgundy);
  const track = new THREE.Mesh(trackGeo, trackMat);
  group.add(track);

  // Knob (cream sphere)
  const knobGeo = new THREE.SphereGeometry(0.24, 12, 10);
  const knobMat = createFlatMaterial(PLAYGROUND_COLORS.creamLight);
  const knob = new THREE.Mesh(knobGeo, knobMat);
  knob.position.set(0.3, 0, 0.12);
  group.add(knob);

  // Small gold accent dot
  const dotGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8);
  const dotMat = createFlatMaterial(PLAYGROUND_COLORS.gold);
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.rotation.x = Math.PI / 2;
  dot.position.set(-0.35, 0, 0.09);
  group.add(dot);

  // Shadow
  const shadow = createFakeShadow(0.85);
  shadow.position.y = -0.4;
  group.add(shadow);

  return group;
}

