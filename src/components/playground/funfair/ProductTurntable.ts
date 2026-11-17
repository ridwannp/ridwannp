import * as THREE from 'three';
import { FUNFAIR_COLORS, createPhongMaterial, createLightPool } from './materials';

export interface ProductTurntableInstance {
  group: THREE.Group;
  update: (
    deltaSeconds: number,
    selectedIndex: number,
    isReducedMotion: boolean
  ) => void;
  handleClick: (raycaster: THREE.Raycaster) => number | null;
  dispose: () => void;
}

export function createProductTurntable(): ProductTurntableInstance {
  const group = new THREE.Group();
  group.position.set(14, 0, 0);

  const burgundyMat = createPhongMaterial(FUNFAIR_COLORS.burgundy);
  const goldMat = createPhongMaterial(FUNFAIR_COLORS.gold);
  const mintMat = createPhongMaterial(FUNFAIR_COLORS.mint);
  const creamMat = createPhongMaterial(FUNFAIR_COLORS.cream);
  const graphiteMat = createPhongMaterial(FUNFAIR_COLORS.graphite);

  // Ground light pool
  const lightPool = createLightPool(4.2, FUNFAIR_COLORS.mint, 0.4);
  group.add(lightPool);

  // 1. Arch: 2 pillars & beam at height 5 with 20 bulbs
  const archPillarGeo = new THREE.CylinderGeometry(0.12, 0.14, 5, 8);
  const pillarL = new THREE.Mesh(archPillarGeo, burgundyMat);
  pillarL.position.set(-2.8, 2.5, 0);
  group.add(pillarL);

  const pillarR = new THREE.Mesh(archPillarGeo, burgundyMat);
  pillarR.position.set(2.8, 2.5, 0);
  group.add(pillarR);

  const beamGeo = new THREE.BoxGeometry(6.0, 0.35, 0.35);
  const beam = new THREE.Mesh(beamGeo, burgundyMat);
  beam.position.set(0, 5, 0);
  group.add(beam);

  // 20 Bulbs along the arch beam
  const archBulbGeo = new THREE.SphereGeometry(0.08, 6, 6);
  const bulbMat = new THREE.MeshBasicMaterial({ color: FUNFAIR_COLORS.gold });
  for (let b = 0; b < 20; b++) {
    const bulb = new THREE.Mesh(archBulbGeo, bulbMat);
    bulb.position.set(-2.7 + b * (5.4 / 19), 4.75, 0.18);
    group.add(bulb);
  }

  // 2. Turntable Disc (radius 3) with gold ring
  const discGeo = new THREE.CylinderGeometry(3.0, 3.1, 0.25, 32);
  const disc = new THREE.Mesh(discGeo, graphiteMat);
  disc.position.y = 0.125;
  group.add(disc);

  const ringGeo = new THREE.TorusGeometry(3.02, 0.08, 8, 36);
  const ring = new THREE.Mesh(ringGeo, goldMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.25;
  group.add(ring);

  // 3. Rotating Platter Group
  const platter = new THREE.Group();
  platter.position.y = 0.25;
  group.add(platter);

  // 4 Low-Poly 3D Product Models at radius 1.85 (angle 0, PI/2, PI, 3PI/2)
  const productModels: THREE.Group[] = [];
  const modelRadius = 1.85;

  // --- Model 0: Sheet stack (Tumpukan lembar) ---
  const model0 = new THREE.Group();
  model0.name = 'product_0';
  for (let s = 0; s < 3; s++) {
    const sheetGeo = new THREE.BoxGeometry(0.9, 0.05, 1.2);
    const sheet = new THREE.Mesh(sheetGeo, creamMat);
    sheet.position.y = 0.6 + s * 0.08;
    sheet.rotation.y = (s - 1) * 0.08;
    model0.add(sheet);
  }
  const tabGeo = new THREE.BoxGeometry(0.25, 0.06, 0.1);
  const tab = new THREE.Mesh(tabGeo, mintMat);
  tab.position.set(0.2, 0.82, -0.55);
  model0.add(tab);
  productModels.push(model0);

  // --- Model 1: Clipboard with mint checkmark (Papan jalan) ---
  const model1 = new THREE.Group();
  model1.name = 'product_1';
  const boardGeo = new THREE.BoxGeometry(0.85, 1.2, 0.08);
  const board = new THREE.Mesh(boardGeo, burgundyMat);
  board.position.y = 0.8;
  model1.add(board);

  const clipPaperGeo = new THREE.BoxGeometry(0.7, 0.95, 0.09);
  const clipPaper = new THREE.Mesh(clipPaperGeo, creamMat);
  clipPaper.position.set(0, 0.78, 0.02);
  model1.add(clipPaper);

  const clipGeo = new THREE.BoxGeometry(0.35, 0.12, 0.14);
  const clip = new THREE.Mesh(clipGeo, goldMat);
  clip.position.set(0, 1.35, 0.03);
  model1.add(clip);

  // Checkmark shape
  const checkL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.06), mintMat);
  checkL.position.set(-0.06, 0.75, 0.1);
  checkL.rotation.z = -Math.PI / 4;
  model1.add(checkL);

  const checkR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.06), mintMat);
  checkR.position.set(0.08, 0.82, 0.1);
  checkR.rotation.z = Math.PI / 4;
  model1.add(checkR);

  productModels.push(model1);

  // --- Model 2: Cream speech bubble (Balon ucapan) ---
  const model2 = new THREE.Group();
  model2.name = 'product_2';
  const bubbleGeo = new THREE.BoxGeometry(1.0, 0.75, 0.2);
  const bubble = new THREE.Mesh(bubbleGeo, creamMat);
  bubble.position.y = 0.85;
  model2.add(bubble);

  const tailGeo = new THREE.ConeGeometry(0.18, 0.35, 4);
  const tail = new THREE.Mesh(tailGeo, creamMat);
  tail.rotation.z = Math.PI * 0.75;
  tail.position.set(-0.35, 0.45, 0);
  model2.add(tail);

  // Text line bars on bubble
  const barGeo = new THREE.BoxGeometry(0.6, 0.06, 0.06);
  const bar1 = new THREE.Mesh(barGeo, goldMat);
  bar1.position.set(0, 0.95, 0.1);
  model2.add(bar1);

  const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.06), burgundyMat);
  bar2.position.set(-0.1, 0.75, 0.1);
  model2.add(bar2);

  productModels.push(model2);

  // --- Model 3: Three sphere nodes connected with rods (Simpul terhubung) ---
  const model3 = new THREE.Group();
  model3.name = 'product_3';
  const sphereGeo = new THREE.SphereGeometry(0.18, 10, 10);

  const node1 = new THREE.Mesh(sphereGeo, mintMat);
  node1.position.set(-0.35, 0.65, 0);
  model3.add(node1);

  const node2 = new THREE.Mesh(sphereGeo, goldMat);
  node2.position.set(0.35, 0.65, 0);
  model3.add(node2);

  const node3 = new THREE.Mesh(sphereGeo, burgundyMat);
  node3.position.set(0, 1.15, 0);
  model3.add(node3);

  // Connecting rods
  const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6);
  const rod1 = new THREE.Mesh(rodGeo, graphiteMat);
  rod1.position.set(0, 0.65, 0);
  rod1.rotation.z = Math.PI / 2;
  model3.add(rod1);

  const rod2 = new THREE.Mesh(rodGeo, graphiteMat);
  rod2.position.set(-0.18, 0.9, 0);
  rod2.rotation.z = -Math.PI / 6;
  model3.add(rod2);

  const rod3 = new THREE.Mesh(rodGeo, graphiteMat);
  rod3.position.set(0.18, 0.9, 0);
  rod3.rotation.z = Math.PI / 6;
  model3.add(rod3);

  productModels.push(model3);

  // Position models around the platter
  // Front facing index 0 is at angle -PI/2 (facing -z towards camera)
  productModels.forEach((m, idx) => {
    const angle = (idx / 4) * Math.PI * 2;
    m.position.set(Math.cos(angle) * modelRadius, 0, Math.sin(angle) * modelRadius);
    platter.add(m);
  });

  let currentPlatterAngle = 0;

  const update = (
    deltaSeconds: number,
    selectedIndex: number,
    isReducedMotion: boolean
  ) => {
    // Target rotation so selected product faces towards front (towards camera: angle = PI/2)
    const targetAngle = -(selectedIndex * Math.PI * 0.5) + Math.PI / 2;

    if (isReducedMotion) {
      currentPlatterAngle = targetAngle;
    } else {
      currentPlatterAngle += (targetAngle - currentPlatterAngle) * 0.08;
    }
    platter.rotation.y = currentPlatterAngle;

    // Animate individual product models
    productModels.forEach((m, idx) => {
      const isSelected = idx === selectedIndex;
      const targetScale = isSelected ? 1.3 : 1.0;
      m.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      if (!isReducedMotion) {
        // Selected spins faster
        const spinSpeed = isSelected ? 1.5 : 0.3;
        m.rotation.y += spinSpeed * deltaSeconds;
      }
    });
  };

  const handleClick = (raycaster: THREE.Raycaster): number | null => {
    for (let i = 0; i < productModels.length; i++) {
      const intersects = raycaster.intersectObjects(productModels[i].children, true);
      if (intersects.length > 0) {
        return i;
      }
    }
    return null;
  };

  const dispose = () => {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).geometry?.dispose();
      }
    });
  };

  return { group, update, handleClick, dispose };
}

