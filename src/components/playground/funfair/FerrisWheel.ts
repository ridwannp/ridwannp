import * as THREE from 'three';
import { FUNFAIR_COLORS, createPhongMaterial, createLightPool } from './materials';

export interface FerrisWheelInstance {
  group: THREE.Group;
  update: (deltaSeconds: number, scrollVelocity: number, isReducedMotion: boolean) => void;
  dispose: () => void;
}

export function createFerrisWheel(): FerrisWheelInstance {
  const group = new THREE.Group();
  group.position.set(3.8, 0, -6);

  // Materials
  const burgundyMat = createPhongMaterial(FUNFAIR_COLORS.burgundy);
  const goldMat = createPhongMaterial(FUNFAIR_COLORS.gold);
  const coralMat = createPhongMaterial(FUNFAIR_COLORS.coral);
  const mintMat = createPhongMaterial(FUNFAIR_COLORS.mint);
  const creamMat = createPhongMaterial(FUNFAIR_COLORS.cream);

  // 1. Legs / A-frame stand (from ground y=0 to hub y=4.1)
  const legGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.8, 8);
  const legZOffset = 0.8;
  const legXAngle = 0.28;

  const legFL = new THREE.Mesh(legGeo, burgundyMat);
  legFL.position.set(-1.1, 2.05, legZOffset);
  legFL.rotation.z = -legXAngle;
  group.add(legFL);

  const legFR = new THREE.Mesh(legGeo, burgundyMat);
  legFR.position.set(1.1, 2.05, legZOffset);
  legFR.rotation.z = legXAngle;
  group.add(legFR);

  const legBL = new THREE.Mesh(legGeo, burgundyMat);
  legBL.position.set(-1.1, 2.05, -legZOffset);
  legBL.rotation.z = -legXAngle;
  group.add(legBL);

  const legBR = new THREE.Mesh(legGeo, burgundyMat);
  legBR.position.set(1.1, 2.05, -legZOffset);
  legBR.rotation.z = legXAngle;
  group.add(legBR);

  // Ground light pool
  const lightPool = createLightPool(4.5, FUNFAIR_COLORS.gold, 0.45);
  group.add(lightPool);

  // 2. Rotating Wheel Group at hub y = 4.1
  const wheelGroup = new THREE.Group();
  wheelGroup.position.set(0, 4.1, 0);
  group.add(wheelGroup);

  // Central axle
  const axleGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 12);
  const axle = new THREE.Mesh(axleGeo, goldMat);
  axle.rotation.x = Math.PI / 2;
  wheelGroup.add(axle);

  // Two Torus rings (burgundy) at z = +0.5 and -0.5
  const torusRadius = 3.3;
  const torusGeo = new THREE.TorusGeometry(torusRadius, 0.07, 8, 36);
  const torusFront = new THREE.Mesh(torusGeo, burgundyMat);
  torusFront.position.z = 0.5;
  wheelGroup.add(torusFront);

  const torusBack = new THREE.Mesh(torusGeo, burgundyMat);
  torusBack.position.z = -0.5;
  wheelGroup.add(torusBack);

  // 8 Spokes per side
  const spokeGeo = new THREE.CylinderGeometry(0.03, 0.03, torusRadius * 2, 6);
  for (let s = 0; s < 4; s++) {
    const angle = (s / 4) * Math.PI;

    const spokeF = new THREE.Mesh(spokeGeo, goldMat);
    spokeF.position.z = 0.5;
    spokeF.rotation.z = angle;
    wheelGroup.add(spokeF);

    const spokeB = new THREE.Mesh(spokeGeo, goldMat);
    spokeB.position.z = -0.5;
    spokeB.rotation.z = angle;
    wheelGroup.add(spokeB);
  }

  // 24 Bulbs on edge per side
  const bulbGeo = new THREE.SphereGeometry(0.06, 6, 6);
  const bulbMat = new THREE.MeshBasicMaterial({ color: FUNFAIR_COLORS.gold });
  for (let b = 0; b < 24; b++) {
    const angle = (b / 24) * Math.PI * 2;
    const bx = Math.cos(angle) * torusRadius;
    const by = Math.sin(angle) * torusRadius;

    const bulbF = new THREE.Mesh(bulbGeo, bulbMat);
    bulbF.position.set(bx, by, 0.54);
    wheelGroup.add(bulbF);

    const bulbB = new THREE.Mesh(bulbGeo, bulbMat);
    bulbB.position.set(bx, by, -0.54);
    wheelGroup.add(bulbB);
  }

  // 10 Gondolas (boxes with cone roofs)
  const gondolaCount = 10;
  const gondolaPivots: THREE.Group[] = [];
  const gondolaColors = [coralMat, mintMat, goldMat, creamMat];

  const gondolaBoxGeo = new THREE.BoxGeometry(0.65, 0.55, 0.7);
  const gondolaRoofGeo = new THREE.ConeGeometry(0.55, 0.45, 6);

  for (let g = 0; g < gondolaCount; g++) {
    const angle = (g / gondolaCount) * Math.PI * 2;
    const gx = Math.cos(angle) * torusRadius;
    const gy = Math.sin(angle) * torusRadius;

    const pivot = new THREE.Group();
    pivot.position.set(gx, gy, 0);
    wheelGroup.add(pivot);

    const bodyMat = gondolaColors[g % gondolaColors.length];
    const body = new THREE.Mesh(gondolaBoxGeo, bodyMat);
    body.position.y = -0.3;
    pivot.add(body);

    const roof = new THREE.Mesh(gondolaRoofGeo, goldMat);
    roof.position.y = 0.15;
    pivot.add(roof);

    gondolaPivots.push(pivot);
  }

  let wheelAngle = 0;

  const update = (deltaSeconds: number, scrollVelocity: number, isReducedMotion: boolean) => {
    if (isReducedMotion) return;

    // Base rotation speed 0.16 rad/s + smoothed scroll velocity
    const speed = 0.16 + Math.min(scrollVelocity * 0.4, 1.2);
    wheelAngle += speed * deltaSeconds;
    wheelGroup.rotation.z = wheelAngle;

    // Counter-rotate each gondola so it stays hanging upright
    for (const pivot of gondolaPivots) {
      pivot.rotation.z = -wheelAngle;
    }
  };

  const dispose = () => {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
      }
    });
  };

  return { group, update, dispose };
}

