import * as THREE from 'three';
import { FUNFAIR_COLORS, createPhongMaterial } from './materials';

export interface DecorationsInstance {
  group: THREE.Group;
  update: (
    deltaSeconds: number,
    timeSeconds: number,
    progress: number,
    scrollVelocity: number,
    cameraX: number,
    isReducedMotion: boolean
  ) => void;
  triggerResultFireworks: () => void;
  dispose: () => void;
}

interface ToyData {
  mesh: THREE.Mesh;
  baseY: number;
  bobPhase: number;
  rotSpeed: THREE.Vector3;
}

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  alpha: number;
  life: number;
  maxLife: number;
}

export function createDecorations(isLowTier: boolean): DecorationsInstance {
  const group = new THREE.Group();

  // 1. Moon at (-8, 20, -80), MeshBasic, without fog
  const moonGeo = new THREE.SphereGeometry(3.5, 16, 16);
  const moonMat = new THREE.MeshBasicMaterial({
    color: FUNFAIR_COLORS.cream,
    fog: false,
  });
  const moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.set(-8, 20, -80);
  group.add(moon);

  // 2. Three dark hills at z = -50 to -58
  const hillMat = createPhongMaterial(FUNFAIR_COLORS.ground);
  const hillConfigs = [
    { pos: [-14, -12, -55], scale: [26, 16, 10] },
    { pos: [4, -14, -58], scale: [32, 18, 12] },
    { pos: [20, -12, -50], scale: [24, 15, 10] },
  ];

  hillConfigs.forEach(({ pos, scale }) => {
    const hillGeo = new THREE.SphereGeometry(1, 16, 12);
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.set(pos[0], pos[1], pos[2]);
    hill.scale.set(scale[0], scale[1], scale[2]);
    group.add(hill);
  });

  // 3. Floating Toys (18 on high tier, 10 on low tier)
  const toyCount = isLowTier ? 10 : 18;
  const toyGeos = [
    new THREE.IcosahedronGeometry(0.35, 0),
    new THREE.TorusGeometry(0.28, 0.08, 6, 16),
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.BoxGeometry(0.45, 0.45, 0.45),
    new THREE.ConeGeometry(0.25, 0.5, 6),
    new THREE.SphereGeometry(0.28, 8, 8),
    new THREE.DodecahedronGeometry(0.3, 0),
  ];

  const toyColors = [
    FUNFAIR_COLORS.coral,
    FUNFAIR_COLORS.gold,
    FUNFAIR_COLORS.mint,
    FUNFAIR_COLORS.cream,
  ];

  const toys: ToyData[] = [];

  for (let i = 0; i < toyCount; i++) {
    const geo = toyGeos[i % toyGeos.length];
    const mat = createPhongMaterial(toyColors[i % toyColors.length]);
    const mesh = new THREE.Mesh(geo, mat);

    // Spread along x: -16 to 18, y: 1 to 9, z: -8 to 4
    const x = -16 + (34 / toyCount) * i + (Math.sin(i * 1.7) * 2);
    const y = 2.0 + (i % 5) * 1.3 + Math.sin(i * 2.3);
    const z = -6 + (i % 4) * 2.5;

    mesh.position.set(x, y, z);
    group.add(mesh);

    toys.push({
      mesh,
      baseY: y,
      bobPhase: i * 0.8,
      rotSpeed: new THREE.Vector3(
        0.4 + (i % 3) * 0.3,
        0.5 + (i % 4) * 0.2,
        0.3 + (i % 2) * 0.4
      ),
    });
  }

  // 4. Confetti (InstancedMesh of small planes)
  const confettiCount = isLowTier ? 50 : 100;
  const confettiGeo = new THREE.PlaneGeometry(0.12, 0.2);
  const confettiMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });

  const confettiMesh = new THREE.InstancedMesh(confettiGeo, confettiMat, confettiCount);
  group.add(confettiMesh);

  interface ConfettiItem {
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    rot: THREE.Vector3;
    rotSpeed: THREE.Vector3;
  }

  const confettiItems: ConfettiItem[] = [];
  const dummyObj = new THREE.Object3D();

  for (let c = 0; c < confettiCount; c++) {
    const col = new THREE.Color(toyColors[c % toyColors.length]);
    confettiMesh.setColorAt(c, col);

    confettiItems.push({
      pos: new THREE.Vector3(
        -16 + Math.random() * 34,
        Math.random() * 12,
        -10 + Math.random() * 16
      ),
      vel: new THREE.Vector3(-0.1 + Math.random() * 0.2, -0.6 - Math.random() * 0.8, 0),
      rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      rotSpeed: new THREE.Vector3(1 + Math.random() * 3, 1 + Math.random() * 3, 0),
    });
  }
  if (confettiMesh.instanceColor) confettiMesh.instanceColor.needsUpdate = true;

  // 5. Fireworks Particles (Points with additive blending)
  const maxParticles = isLowTier ? 90 : 160;
  const fwParticles: Particle[] = [];
  const fwGeo = new THREE.BufferGeometry();
  const fwPositions = new Float32Array(maxParticles * 3);
  const fwColors = new Float32Array(maxParticles * 3);

  fwGeo.setAttribute('position', new THREE.BufferAttribute(fwPositions, 3));
  fwGeo.setAttribute('color', new THREE.BufferAttribute(fwColors, 3));

  const fwMat = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const fwPoints = new THREE.Points(fwGeo, fwMat);
  group.add(fwPoints);

  const spawnBurst = (cx: number, cy: number, cz: number, baseColorHex: number) => {
    const count = 36;
    for (let i = 0; i < count; i++) {
      if (fwParticles.length >= maxParticles) {
        fwParticles.shift();
      }
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 2.0 + Math.random() * 3.5;

      const vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      );

      fwParticles.push({
        pos: new THREE.Vector3(cx, cy, cz),
        vel,
        color: new THREE.Color(baseColorHex),
        alpha: 1.0,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.4,
      });
    }
  };

  let lastAutoFwTime = 0;

  const triggerResultFireworks = () => {
    // 3 rapid bursts
    setTimeout(() => spawnBurst(0, 5, -2, FUNFAIR_COLORS.gold), 0);
    setTimeout(() => spawnBurst(-2, 6.5, -4, FUNFAIR_COLORS.coral), 250);
    setTimeout(() => spawnBurst(2, 6, -3, FUNFAIR_COLORS.mint), 500);
  };

  const update = (
    deltaSeconds: number,
    timeSeconds: number,
    progress: number,
    scrollVelocity: number,
    cameraX: number,
    isReducedMotion: boolean
  ) => {
    if (isReducedMotion) return;

    // A. Toys animation
    toys.forEach((toy) => {
      // Bobbing
      toy.mesh.position.y =
        toy.baseY + Math.sin(timeSeconds * 1.5 + toy.bobPhase) * 0.25;

      // Rotation reacts to scroll velocity
      const speedMult = 1.0 + Math.min(scrollVelocity * 0.5, 3.0);
      toy.mesh.rotation.x += toy.rotSpeed.x * deltaSeconds * speedMult;
      toy.mesh.rotation.y += toy.rotSpeed.y * deltaSeconds * speedMult;
    });

    // B. Confetti animation (falling and parallax with camera on x by 0.85)
    confettiItems.forEach((item, idx) => {
      item.pos.y += item.vel.y * deltaSeconds;
      if (item.pos.y < -1) {
        item.pos.y = 12 + Math.random() * 3;
        item.pos.x = -16 + Math.random() * 34;
      }

      item.rot.x += item.rotSpeed.x * deltaSeconds;
      item.rot.y += item.rotSpeed.y * deltaSeconds;

      dummyObj.position.copy(item.pos);
      // Parallax on x
      dummyObj.position.x += cameraX * 0.15;
      dummyObj.rotation.set(item.rot.x, item.rot.y, item.rot.z);
      dummyObj.updateMatrix();

      confettiMesh.setMatrixAt(idx, dummyObj.matrix);
    });
    confettiMesh.instanceMatrix.needsUpdate = true;

    // C. Automatic Fireworks at Penutup section (progress > 2.5) every 0.7s
    if (progress > 2.5 && timeSeconds - lastAutoFwTime > 0.7) {
      lastAutoFwTime = timeSeconds;
      const x = -4 + Math.random() * 8;
      const y = 5 + Math.random() * 4;
      const z = -2 + Math.random() * 4;
      const colors = [FUNFAIR_COLORS.gold, FUNFAIR_COLORS.coral, FUNFAIR_COLORS.mint];
      spawnBurst(x, y, z, colors[Math.floor(Math.random() * colors.length)]);
    }

    // D. Update Fireworks particles
    for (let p = fwParticles.length - 1; p >= 0; p--) {
      const part = fwParticles[p];
      part.life += deltaSeconds;
      if (part.life >= part.maxLife) {
        fwParticles.splice(p, 1);
        continue;
      }
      part.pos.addScaledVector(part.vel, deltaSeconds);
      part.vel.y -= 3.5 * deltaSeconds; // Gravity
      part.alpha = Math.max(0, 1 - part.life / part.maxLife);
    }

    const posAttr = fwGeo.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = fwGeo.getAttribute('color') as THREE.BufferAttribute;

    const pArray = posAttr.array as Float32Array;
    const cArray = colAttr.array as Float32Array;

    for (let i = 0; i < maxParticles; i++) {
      if (i < fwParticles.length) {
        const part = fwParticles[i];
        pArray[i * 3] = part.pos.x;
        pArray[i * 3 + 1] = part.pos.y;
        pArray[i * 3 + 2] = part.pos.z;

        cArray[i * 3] = part.color.r * part.alpha;
        cArray[i * 3 + 1] = part.color.g * part.alpha;
        cArray[i * 3 + 2] = part.color.b * part.alpha;
      } else {
        pArray[i * 3] = 0;
        pArray[i * 3 + 1] = -100;
        pArray[i * 3 + 2] = 0;
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  };

  const dispose = () => {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).geometry?.dispose();
      }
    });
    fwGeo.dispose();
    fwMat.dispose();
  };

  return {
    group,
    update,
    triggerResultFireworks,
    dispose,
  };
}
