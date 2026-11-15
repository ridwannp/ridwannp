import * as THREE from 'three';

export const PLAYGROUND_COLORS = {
  creamLight: 0xefe5d2,
  creamDark: 0xe2d5bc,
  burgundy: 0x8b1538,
  gold: 0xd4af37,
  ink: 0x15130f,
};

export function createFlatMaterial(color: number, opacity = 1.0): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.85,
    metalness: 0,
    transparent: opacity < 1.0,
    opacity,
  });
}

/**
 * Creates a circular fake shadow plane with soft radial fade
 */
export function createFakeShadow(radius = 0.8): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(21, 19, 15, 0.22)');
    gradient.addColorStop(0.6, 'rgba(21, 19, 15, 0.08)');
    gradient.addColorStop(1, 'rgba(21, 19, 15, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.02;
  return mesh;
}

