import * as THREE from 'three';
import { PATH, clamp, smoothstep, lerp } from './path';

export type CharacterStyle = 'low-poly' | 'mannequin' | 'silhouette';

export interface JourneySceneOptions {
  prefersReducedMotion?: boolean;
}

export interface JourneySceneInstance {
  update: (
    pos: number,
    dpos: number,
    doorFraction?: number
  ) => { lit: number; doorCardOpacity: number };
  resize: () => void;
  setStyle: (style: CharacterStyle) => void;
  dispose: () => void;
}

export function createJourneyScene(
  host: HTMLElement,
  options?: JourneySceneOptions
): JourneySceneInstance {
  const prefersReducedMotion = Boolean(options?.prefersReducedMotion);

  // 1. Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const canvas = renderer.domElement;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  host.appendChild(canvas);

  // 2. Scene & Camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x4a1236, 0.008);
  const camera = new THREE.PerspectiveCamera(40, host.clientWidth / host.clientHeight, 0.1, 300);

  // 3. Lights (Dusk atmosphere)
  const hemiLight = new THREE.HemisphereLight(0x9a7ab8, 0x2b1026, 0.65);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffe0b0, 0.85);
  dirLight.position.set(-6, 12, 9);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x8b1538, 0.35);
  fillLight.position.set(6, -8, -6);
  scene.add(fillLight);

  // Disposables tracking
  const disposables: { dispose: () => void }[] = [];
  function track<T extends { dispose: () => void }>(obj: T): T {
    disposables.push(obj);
    return obj;
  }

  // 4. Geometries & Staircases
  const geomCache: Record<number, { box: THREE.BoxGeometry; edges: THREE.EdgesGeometry }> = {};
  function getGeometries(width: number) {
    if (!geomCache[width]) {
      const box = track(new THREE.BoxGeometry(width, 40, 7));
      const edges = track(new THREE.EdgesGeometry(box));
      geomCache[width] = { box, edges };
    }
    return geomCache[width];
  }

  const stairMaterial = track(new THREE.MeshLambertMaterial({ color: 0x351d38 }));
  const edgeLineMaterial = track(
    new THREE.LineBasicMaterial({ color: 0x6e386a, opacity: 0.6, transparent: true })
  );

  const floorMaterials: THREE.MeshLambertMaterial[] = [];
  for (let k = 0; k < 5; k++) {
    const mat = track(
      new THREE.MeshLambertMaterial({
        color: 0x3a213e,
        emissive: new THREE.Color(0x000000),
      })
    );
    floorMaterials.push(mat);
  }

  // Build stairs & landing meshes
  PATH.segments.forEach((seg) => {
    const width = seg.x1 - seg.x0;
    const { box, edges } = getGeometries(width);

    const isLanding = typeof seg.land === 'number';
    const mat = isLanding ? floorMaterials[seg.land!] : stairMaterial;

    const mesh = new THREE.Mesh(box, mat);
    mesh.position.set(seg.x0 + width / 2, seg.top - 20, 0);
    scene.add(mesh);

    const line = new THREE.LineSegments(edges, edgeLineMaterial);
    line.position.copy(mesh.position);
    scene.add(line);
  });

  // 5. Lamps (k = 0..3)
  interface LampItem {
    group: THREE.Group;
    bulbMat: THREE.MeshBasicMaterial;
    coneMat: THREE.MeshBasicMaterial;
    circleMat: THREE.MeshBasicMaterial;
  }
  const lamps: LampItem[] = [];

  // Canvas texture for cone light vertical gradient
  const coneCanvas = document.createElement('canvas');
  coneCanvas.width = 4;
  coneCanvas.height = 128;
  const ctx = coneCanvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, 'rgba(255, 200, 61, 0.85)');
    grad.addColorStop(1, 'rgba(255, 200, 61, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 4, 128);
  }
  const coneTexture = track(new THREE.CanvasTexture(coneCanvas));

  const BASE = 3.7;
  const R = 1.15;

  const domeGeom = track(new THREE.SphereGeometry(R, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2));
  const domeMat = track(
    new THREE.MeshLambertMaterial({ color: 0x241128, side: THREE.DoubleSide })
  );
  const rimGeom = track(new THREE.CylinderGeometry(R + 0.03, R + 0.03, 0.08, 32));
  const rimMat = track(new THREE.MeshLambertMaterial({ color: 0x140a18 }));
  const cableGeom = track(new THREE.CylinderGeometry(0.025, 0.025, 60, 8));
  const bulbGeom = track(new THREE.CircleGeometry(R * 0.62, 24));
  const coneGeom = track(new THREE.CylinderGeometry(0.18, 2.5, BASE - 0.05, 36, 1, true));
  const floorCircleGeom = track(new THREE.CircleGeometry(2.4, 48));

  for (let k = 0; k < 4; k++) {
    const group = new THREE.Group();
    group.position.set(PATH.CX[k], PATH.LT[k], 0);

    // Dome
    const dome = new THREE.Mesh(domeGeom, domeMat);
    dome.scale.set(1, 0.85, 1);
    dome.position.set(0, BASE, 0);
    group.add(dome);

    // Rim
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.set(0, BASE, 0);
    group.add(rim);

    // Cable
    const cable = new THREE.Mesh(cableGeom, rimMat);
    cable.position.set(0, BASE + R * 0.85 + 30, 0);
    group.add(cable);

    // Bulb
    const bulbMat = track(
      new THREE.MeshBasicMaterial({ color: 0xffc83d, transparent: true, opacity: 1 })
    );
    const bulb = new THREE.Mesh(bulbGeom, bulbMat);
    bulb.rotation.x = Math.PI / 2;
    bulb.position.set(0, BASE - 0.02, 0);
    group.add(bulb);

    // Light cone
    const coneMat = track(
      new THREE.MeshBasicMaterial({
        map: coneTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    const cone = new THREE.Mesh(coneGeom, coneMat);
    cone.position.set(0, 0.05 + (BASE - 0.05) / 2, 0);
    group.add(cone);

    scene.add(group);

    // Floor light circle (placed directly on scene)
    const circleMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xffc83d,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      })
    );
    const floorCircle = new THREE.Mesh(floorCircleGeom, circleMat);
    floorCircle.rotation.x = -Math.PI / 2;
    floorCircle.position.set(PATH.CX[k], PATH.LT[k] + 0.03, 0);
    scene.add(floorCircle);

    lamps.push({
      group,
      bulbMat,
      coneMat,
      circleMat,
    });
  }

  // 6. Stop 4: Final Landing, Wall, Door & Light Spill
  // Back wall: Box 12 x 4.8 x 0.3 at z = -3.2, bottom touches floor (LT[4] = 20.0)
  const wallBox = track(new THREE.BoxGeometry(12, 4.8, 0.3));
  const wallMat = track(new THREE.MeshLambertMaterial({ color: 0x2e142c }));
  const wallMesh = new THREE.Mesh(wallBox, wallMat);
  wallMesh.position.set(66.0, 20.0 + 4.8 / 2, -3.2);
  scene.add(wallMesh);

  const wallEdges = track(new THREE.EdgesGeometry(wallBox));
  const wallLine = new THREE.LineSegments(wallEdges, edgeLineMaterial);
  wallLine.position.copy(wallMesh.position);
  scene.add(wallLine);

  // Door Frame: 4 boxes around 1.7 x 3.3 opening, thickness 0.15, depth 0.35
  const frameMat = track(new THREE.MeshLambertMaterial({ color: 0x170a1a }));
  const frameGroup = new THREE.Group();

  const leftPostGeom = track(new THREE.BoxGeometry(0.15, 3.3, 0.35));
  const leftPost = new THREE.Mesh(leftPostGeom, frameMat);
  leftPost.position.set(62.5 - 1.7 / 2 - 0.15 / 2, 20.0 + 3.3 / 2, -3.2);
  frameGroup.add(leftPost);

  const rightPost = new THREE.Mesh(leftPostGeom, frameMat);
  rightPost.position.set(62.5 + 1.7 / 2 + 0.15 / 2, 20.0 + 3.3 / 2, -3.2);
  frameGroup.add(rightPost);

  const headerGeom = track(new THREE.BoxGeometry(1.7 + 0.3, 0.15, 0.35));
  const header = new THREE.Mesh(headerGeom, frameMat);
  header.position.set(62.5, 20.0 + 3.3 + 0.15 / 2, -3.2);
  frameGroup.add(header);

  scene.add(frameGroup);

  // Door leaf: Box 1.7 x 3.3 x 0.12 color 0xfff1d6 (dusk cream), pivot at left hinge (x = 61.65, z = -3.05)
  const doorPivot = new THREE.Group();
  doorPivot.position.set(61.65, 20.0, -3.05);

  const doorLeafGeom = track(new THREE.BoxGeometry(1.7, 3.3, 0.12));
  const doorLeafMat = track(new THREE.MeshLambertMaterial({ color: 0xfff1d6 }));
  const doorLeafMesh = new THREE.Mesh(doorLeafGeom, doorLeafMat);
  doorLeafMesh.position.set(1.7 / 2, 3.3 / 2, 0);
  doorPivot.add(doorLeafMesh);

  const doorEdges = track(new THREE.EdgesGeometry(doorLeafGeom));
  const doorLine = new THREE.LineSegments(doorEdges, edgeLineMaterial);
  doorLine.position.copy(doorLeafMesh.position);
  doorPivot.add(doorLine);

  // Doorknob: sphere r = 0.07 color 0xffc83d (gold)
  const knobGeom = track(new THREE.SphereGeometry(0.07, 16, 16));
  const knobMat = track(new THREE.MeshLambertMaterial({ color: 0xffc83d }));
  const knobMesh = new THREE.Mesh(knobGeom, knobMat);
  knobMesh.position.set(1.7 - 0.18, 1.5, 0.09);
  doorPivot.add(knobMesh);

  scene.add(doorPivot);

  // Warm light plane behind door: 0xffc83d, MeshBasic
  const doorBackLightGeom = track(new THREE.PlaneGeometry(1.7, 3.3));
  const doorBackLightMat = track(
    new THREE.MeshBasicMaterial({ color: 0xffc83d, transparent: true, opacity: 0 })
  );
  const doorBackLight = new THREE.Mesh(doorBackLightGeom, doorBackLightMat);
  doorBackLight.position.set(62.5, 20.0 + 3.3 / 2, -3.25);
  scene.add(doorBackLight);

  // Floor light spill: trapezoid from door to camera with gradient
  const spillCanvas = document.createElement('canvas');
  spillCanvas.width = 64;
  spillCanvas.height = 128;
  const sCtx = spillCanvas.getContext('2d');
  if (sCtx) {
    const sGrad = sCtx.createLinearGradient(0, 0, 0, 128);
    sGrad.addColorStop(0, 'rgba(255, 200, 61, 1.0)');
    sGrad.addColorStop(0.5, 'rgba(255, 200, 61, 0.6)');
    sGrad.addColorStop(1, 'rgba(255, 200, 61, 0.0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 128);
  }
  const spillTexture = track(new THREE.CanvasTexture(spillCanvas));
  const spillMat = track(
    new THREE.MeshBasicMaterial({
      map: spillTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0,
      side: THREE.DoubleSide,
    })
  );

  // Create trapezoid geometry on X-Z floor plane
  // Near door: x from -0.85 to +0.85 at z = 0 (world 62.5, -3.05)
  // Far front: x from -2.4 to +2.4 at z = 4.8 (world 62.5, 1.75)
  const spillGeom = track(new THREE.BufferGeometry());
  const spillVerts = new Float32Array([
    -0.85, 0, 0,
     0.85, 0, 0,
     2.4,  0, 4.8,

    -0.85, 0, 0,
     2.4,  0, 4.8,
    -2.4,  0, 4.8,
  ]);
  const spillUvs = new Float32Array([
    0.2, 0,
    0.8, 0,
    1.0, 1,

    0.2, 0,
    1.0, 1,
    0.0, 1,
  ]);
  spillGeom.setAttribute('position', new THREE.BufferAttribute(spillVerts, 3));
  spillGeom.setAttribute('uv', new THREE.BufferAttribute(spillUvs, 2));

  const floorSpillMesh = new THREE.Mesh(spillGeom, spillMat);
  floorSpillMesh.position.set(62.5, 20.0 + 0.02, -3.05);
  scene.add(floorSpillMesh);

  // 7. Figure (Tokoh)
  const charGroup = new THREE.Group();
  scene.add(charGroup);

  const yawGroup = new THREE.Group();
  charGroup.add(yawGroup);

  // Materials for styles
  const lowPolyMaterials = {
    pants: track(new THREE.MeshLambertMaterial({ color: 0x1a0f24 })),
    torso: track(new THREE.MeshLambertMaterial({ color: 0xfff1d6 })),
    skin: track(new THREE.MeshLambertMaterial({ color: 0xe2bf9c })),
    hair: track(new THREE.MeshLambertMaterial({ color: 0x1a0f24 })),
    backpack: track(new THREE.MeshLambertMaterial({ color: 0x8b1538 })),
  };

  const mannequinMaterials = {
    all: track(new THREE.MeshLambertMaterial({ color: 0xe6dfd0 })),
    head: track(new THREE.MeshLambertMaterial({ color: 0xfff1d6 })),
  };

  const silhouetteMaterial = track(new THREE.MeshBasicMaterial({ color: 0xfff1d6 }));

  // Geometry definitions for character
  const legBox = track(new THREE.BoxGeometry(0.22, 0.88, 0.24));
  const torsoBox = track(new THREE.BoxGeometry(0.36, 0.6, 0.52));
  const armBox = track(new THREE.BoxGeometry(0.15, 0.56, 0.16));
  const handBox = track(new THREE.BoxGeometry(0.14, 0.12, 0.15));
  const headBox = track(new THREE.BoxGeometry(0.3, 0.3, 0.3));
  const hairTopBox = track(new THREE.BoxGeometry(0.34, 0.14, 0.34));
  const hairBackBox = track(new THREE.BoxGeometry(0.1, 0.22, 0.34));
  const backpackBox = track(new THREE.BoxGeometry(0.2, 0.5, 0.38));
  const shadowGeom = track(new THREE.CircleGeometry(0.5, 32));

  // Shadow
  const shadowMat = track(
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
  );
  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.scale.set(1.4, 1.4, 1);
  shadowMesh.position.set(0, 0.04, 0);
  charGroup.add(shadowMesh);

  // Legs with hip pivots (y 0.88, z +-0.14)
  const leftHip = new THREE.Group();
  leftHip.position.set(0, 0.88, -0.14);
  const leftLegMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(legBox, lowPolyMaterials.pants);
  leftLegMesh.position.set(0, -0.44, 0);
  leftHip.add(leftLegMesh);
  yawGroup.add(leftHip);

  const rightHip = new THREE.Group();
  rightHip.position.set(0, 0.88, 0.14);
  const rightLegMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(legBox, lowPolyMaterials.pants);
  rightLegMesh.position.set(0, -0.44, 0);
  rightHip.add(rightLegMesh);
  yawGroup.add(rightHip);

  // Upper Body container for bobbing and torso tilt
  const bodyGroup = new THREE.Group();
  yawGroup.add(bodyGroup);

  const torsoMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(torsoBox, lowPolyMaterials.torso);
  torsoMesh.position.set(0, 1.18, 0);
  bodyGroup.add(torsoMesh);

  // Arms with shoulder pivots (y 1.42, z +-0.34)
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(0, 1.42, -0.34);
  const leftArmMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(armBox, lowPolyMaterials.torso);
  leftArmMesh.position.set(0, -0.28, 0);
  leftShoulder.add(leftArmMesh);
  const leftHandMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(handBox, lowPolyMaterials.skin);
  leftHandMesh.position.set(0, -0.62, 0);
  leftShoulder.add(leftHandMesh);
  bodyGroup.add(leftShoulder);

  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0, 1.42, 0.34);
  const rightArmMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(armBox, lowPolyMaterials.torso);
  rightArmMesh.position.set(0, -0.28, 0);
  rightShoulder.add(rightArmMesh);
  const rightHandMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(handBox, lowPolyMaterials.skin);
  rightHandMesh.position.set(0, -0.62, 0);
  rightShoulder.add(rightHandMesh);
  bodyGroup.add(rightShoulder);

  // Head and Hair
  const headMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(headBox, lowPolyMaterials.skin);
  headMesh.position.set(0.02, 1.63, 0);
  bodyGroup.add(headMesh);

  const hairTopMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(hairTopBox, lowPolyMaterials.hair);
  hairTopMesh.position.set(0, 1.79, 0);
  bodyGroup.add(hairTopMesh);

  const hairBackMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(hairBackBox, lowPolyMaterials.hair);
  hairBackMesh.position.set(-0.13, 1.66, 0);
  bodyGroup.add(hairBackMesh);

  // Backpack
  const backpackMesh = new THREE.Mesh<THREE.BoxGeometry, THREE.Material>(backpackBox, lowPolyMaterials.backpack);
  backpackMesh.position.set(-0.3, 1.2, 0);
  bodyGroup.add(backpackMesh);

  // Style switcher
  function applyStyle(style: CharacterStyle) {
    if (style === 'silhouette') {
      leftLegMesh.material = silhouetteMaterial;
      rightLegMesh.material = silhouetteMaterial;
      torsoMesh.material = silhouetteMaterial;
      leftArmMesh.material = silhouetteMaterial;
      leftHandMesh.material = silhouetteMaterial;
      rightArmMesh.material = silhouetteMaterial;
      rightHandMesh.material = silhouetteMaterial;
      headMesh.material = silhouetteMaterial;
      hairTopMesh.material = silhouetteMaterial;
      hairBackMesh.material = silhouetteMaterial;
      backpackMesh.material = silhouetteMaterial;
      backpackMesh.visible = true;
      shadowMesh.visible = false;
    } else if (style === 'mannequin') {
      leftLegMesh.material = mannequinMaterials.all;
      rightLegMesh.material = mannequinMaterials.all;
      torsoMesh.material = mannequinMaterials.all;
      leftArmMesh.material = mannequinMaterials.all;
      leftHandMesh.material = mannequinMaterials.all;
      rightArmMesh.material = mannequinMaterials.all;
      rightHandMesh.material = mannequinMaterials.all;
      headMesh.material = mannequinMaterials.head;
      hairTopMesh.material = mannequinMaterials.all;
      hairBackMesh.material = mannequinMaterials.all;
      backpackMesh.visible = false;
      shadowMesh.visible = true;
    } else {
      // low-poly
      leftLegMesh.material = lowPolyMaterials.pants;
      rightLegMesh.material = lowPolyMaterials.pants;
      torsoMesh.material = lowPolyMaterials.torso;
      leftArmMesh.material = lowPolyMaterials.torso;
      leftHandMesh.material = lowPolyMaterials.skin;
      rightArmMesh.material = lowPolyMaterials.torso;
      rightHandMesh.material = lowPolyMaterials.skin;
      headMesh.material = lowPolyMaterials.skin;
      hairTopMesh.material = lowPolyMaterials.hair;
      hairBackMesh.material = lowPolyMaterials.hair;
      backpackMesh.material = lowPolyMaterials.backpack;
      backpackMesh.visible = true;
      shadowMesh.visible = true;
    }
  }

  // Animation state variables
  let walkPhase = 0;
  let walkAmp = 0;
  let currentYaw = 0;
  const TAN = Math.tan((20 * Math.PI) / 180);
  const dirVec = new THREE.Vector3(-0.4, 0.26, 1).normalize();
  const targetLookAt = new THREE.Vector3();

  // Resize handler
  function handleResize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h || isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  handleResize();

  // Update function per frame
  function update(pos: number, dpos: number, doorFraction?: number) {
    if (isNaN(pos) || !isFinite(pos)) pos = 0;
    if (isNaN(dpos) || !isFinite(dpos)) dpos = 0;
    const N = 5;
    // 1. Calculate figure position on path
    const k0 = Math.min(N - 2, Math.floor(pos));
    const t = clamp(pos - k0, 0, 1);
    const charX = lerp(PATH.CX[k0], PATH.CX[k0 + 1], t);
    const charY = PATH.heightAt(charX);

    // 2. Door sequence (Stop 4, k = 4)
    const isAtDoorStop = pos >= 3.999;
    let f = doorFraction ?? 0;
    if (!isAtDoorStop) f = 0;

    let targetZ = 0;
    let targetYaw = 0;
    let doorOpenProgress = 0;
    let doorCardOpacity = 0;

    if (isAtDoorStop) {
      // Step 1: f 0 -> 0.25 (face door, walk to z = -1.4)
      const tWalk = clamp(f / 0.25, 0, 1);
      targetYaw = Math.PI / 2; // Face towards -Z (door)
      targetZ = lerp(0, -1.4, tWalk);

      // Step 2: f 0.30 -> 0.65 (door opens smoothly)
      const tDoor = clamp((f - 0.3) / 0.35, 0, 1);
      doorOpenProgress = smoothstep(tDoor);

      // Step 3: f 0.60 -> 0.85 (card appears)
      const tCard = clamp((f - 0.6) / 0.25, 0, 1);
      doorCardOpacity = smoothstep(tCard);
    } else {
      // Normal walk orientation: +X when moving forward, -X (PI) when moving backward
      if (dpos > 0.00005) {
        targetYaw = 0;
      } else if (dpos < -0.00005) {
        targetYaw = Math.PI;
      } else {
        targetYaw = 0;
      }
    }

    // Apply door rotation (max 100 degrees = 1.745 rad)
    doorPivot.rotation.y = -doorOpenProgress * (100 * (Math.PI / 180));
    doorBackLightMat.opacity = doorOpenProgress;
    spillMat.opacity = doorOpenProgress * 0.8;

    // 3. Walk cycle & limb animation
    const stepDist = Math.abs(dpos) * (PATH.CX[1] - PATH.CX[0]) * 3.3;
    walkPhase += stepDist;

    const isMoving = Math.abs(dpos) > 0.00012 || (isAtDoorStop && f > 0.005 && f < 0.245);
    const targetAmp = isMoving ? 1 : 0;

    if (prefersReducedMotion) {
      walkAmp = 0;
      currentYaw = targetYaw;
    } else {
      walkAmp += (targetAmp - walkAmp) * 0.18;
      currentYaw += (targetYaw - currentYaw) * 0.2;
    }

    const s = Math.sin(walkPhase) * 0.7 * walkAmp;
    leftHip.rotation.z = s;
    rightHip.rotation.z = -s;
    leftShoulder.rotation.z = -0.9 * s;
    rightShoulder.rotation.z = 0.9 * s;
    bodyGroup.rotation.z = -0.09 * walkAmp;
    bodyGroup.position.y = Math.abs(Math.cos(walkPhase)) * 0.05 * walkAmp;

    yawGroup.rotation.y = currentYaw;
    charGroup.position.set(charX, charY, targetZ);

    // 4. Lamps animation (k = 0..3)
    let maxLit = 0;
    for (let k = 0; k < 4; k++) {
      const lamp = lamps[k];
      const dist = Math.abs(charX - PATH.CX[k]);
      const rawA = 1 - smoothstep((dist - 1.2) / 2.4);
      // Previous phase lamps stay gently illuminated
      const isPast = charX > PATH.CX[k] + 1.2;
      const minA = isPast ? 0.15 : 0.0;
      const a = Math.max(minA, rawA);

      if (a > maxLit) maxLit = a;

      lamp.group.visible = a > 0.004;
      lamp.group.position.y = PATH.LT[k] + (1 - Math.min(1, rawA)) * 10;
      lamp.bulbMat.opacity = a;
      lamp.coneMat.opacity = a * a;
      lamp.circleMat.opacity = 0.55 * a;
      floorMaterials[k].emissive.setRGB(0.35 * a, 0.28 * a, 0.12 * a);
    }

    // 5. Camera positioning & follow
    const w = host.clientWidth;
    const aspect = Math.max(0.1, w / host.clientHeight);

    let d: number;
    let sx: number;
    let cy: number;

    if (w > 760) {
      // Landscape
      d = Math.max(9.6, 11 / (2 * TAN * aspect));
      sx = 2 * d * TAN * aspect * 0.17;
      cy = 1.9;
    } else {
      // Portrait
      d = Math.max(10, 6.8 / (2 * TAN * aspect));
      sx = 0;
      cy = 2 * d * TAN * 0.31;
    }

    targetLookAt.set(charX - sx, charY + cy, 0);
    camera.position.copy(targetLookAt).addScaledVector(dirVec, d);
    camera.lookAt(targetLookAt);

    // Render scene
    renderer.render(scene, camera);

    return {
      lit: maxLit,
      doorCardOpacity,
    };
  }

  function dispose() {
    disposables.forEach((d) => {
      try {
        d.dispose();
      } catch {
        // ignore
      }
    });
    renderer.dispose();
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }

  return {
    update,
    resize: handleResize,
    setStyle: applyStyle,
    dispose,
  };
}

