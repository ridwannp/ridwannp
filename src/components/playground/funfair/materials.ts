import * as THREE from 'three';

export const FUNFAIR_COLORS = {
  coral: 0xe0316a,
  gold: 0xffc83d,
  cream: 0xfff1d6,
  mint: 0x4fd1a1,
  graphite: 0x3a2f44,
  burgundy: 0x8b1538,
  ground: 0x2b1026,
  fog: 0x4a1236,
  ambient: 0x9a7ab8,
  directional: 0xffe0b0,
};

export function createPhongMaterial(color: number, opts: Partial<THREE.MeshPhongMaterialParameters> = {}): THREE.MeshPhongMaterial {
  return new THREE.MeshPhongMaterial({
    color,
    shininess: 70,
    flatShading: true,
    ...opts,
  });
}

/**
 * Creates a ground light pool with additive blending
 */
export function createLightPool(radius: number, color: number, opacity = 0.4): THREE.Mesh {
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

