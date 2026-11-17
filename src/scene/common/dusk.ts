import * as THREE from 'three';

export const DUSK_SCENE_COLORS = {
  ambient: 0x9a7ab8,
  directional: 0xffe0b0,
  fog: 0x4a1236,
  ground: 0x2b1026,
  gold: 0xffc83d,
  coral: 0xe0316a,
  cream: 0xfff1d6,
  mint: 0x4fd1a1,
  burgundy: 0x8b1538,
  graphite: 0x3a2f44,
  hillFar: 0x1f0b24,
  hillNear: 0x260d2b,
};

/**
 * Creates standardized Phong Material with shininess 70
 */
export function createDuskPhongMaterial(
  color: number,
  opts: Partial<THREE.MeshPhongMaterialParameters> = {}
): THREE.MeshPhongMaterial {
  return new THREE.MeshPhongMaterial({
    color,
    shininess: 70,
    flatShading: true,
    ...opts,
  });
}

/**
 * Creates a circular light pool on the ground using canvas radial gradient and AdditiveBlending
 */
export function createLightPool(
  radius: number,
  color: number,
  opacity = 0.45
): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    const hex = '#' + color.toString(16).padStart(6, '0');
    gradient.addColorStop(0, hex);
    gradient.addColorStop(0.5, hex);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.02;
  return mesh;
}

/**
 * Creates dusk moon mesh (MeshBasicMaterial without fog interference)
 */
export function createDuskMoon(radius = 1.8): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 16, 16);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xfff1d6,
    fog: false,
  });
  const moon = new THREE.Mesh(geo, mat);
  moon.position.set(-14, 18, -35);
  return moon;
}

/**
 * Creates silhouette hills for dusk background horizon
 */
export function createDuskHills(): THREE.Group {
  const group = new THREE.Group();

  const hillMat1 = new THREE.MeshBasicMaterial({
    color: DUSK_SCENE_COLORS.hillFar,
    fog: false,
  });
  const hillMat2 = new THREE.MeshBasicMaterial({
    color: DUSK_SCENE_COLORS.hillNear,
    fog: false,
  });

  // Far hill left
  const h1 = new THREE.Mesh(new THREE.ConeGeometry(22, 9, 8), hillMat1);
  h1.position.set(-18, 2, -40);
  group.add(h1);

  // Far hill right
  const h2 = new THREE.Mesh(new THREE.ConeGeometry(26, 11, 8), hillMat1);
  h2.position.set(16, 2, -44);
  group.add(h2);

  // Mid hill center
  const h3 = new THREE.Mesh(new THREE.ConeGeometry(18, 7, 8), hillMat2);
  h3.position.set(-3, 1, -36);
  group.add(h3);

  return group;
}

/**
 * Instanced confetti particles
 */
export function createDuskConfetti(count = 50): THREE.InstancedMesh {
  const geo = new THREE.PlaneGeometry(0.12, 0.2);
  const mat = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });

  const instanced = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  const colors = [0xffc83d, 0x4fd1a1, 0xe0316a, 0xfff1d6];

  for (let i = 0; i < count; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 16,
      1 + Math.random() * 8,
      (Math.random() - 0.5) * 12
    );
    dummy.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    dummy.scale.setScalar(0.7 + Math.random() * 0.6);
    dummy.updateMatrix();
    instanced.setMatrixAt(i, dummy.matrix);

    const color = new THREE.Color(colors[i % colors.length]);
    instanced.setColorAt(i, color);
  }

  instanced.instanceMatrix.needsUpdate = true;
  if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;

  return instanced;
}

/**
 * Setup standard dusk lighting & fog on scene
 */
export function setupDuskLights(scene: THREE.Scene): {
  ambient: THREE.AmbientLight;
  directional: THREE.DirectionalLight;
  fog: THREE.Fog;
} {
  const ambient = new THREE.AmbientLight(DUSK_SCENE_COLORS.ambient, 0.75);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(DUSK_SCENE_COLORS.directional, 0.85);
  directional.position.set(-6, 10, 9);
  scene.add(directional);

  const fog = new THREE.Fog(DUSK_SCENE_COLORS.fog, 34, 100);
  scene.fog = fog;

  return { ambient, directional, fog };
}

