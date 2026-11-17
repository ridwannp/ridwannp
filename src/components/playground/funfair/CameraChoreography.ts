import * as THREE from 'three';

interface Keyframe {
  pos: [number, number, number];
  look: [number, number, number];
  narrowOffset: [number, number, number]; // [dx, dy, dz]
}

const KEYFRAMES: Keyframe[] = [
  // 0: Hero
  {
    pos: [2.4, 3.6, 16],
    look: [0.8, 3.8, 0],
    narrowOffset: [0, 1.7, 6],
  },
  // 1: Discovery
  {
    pos: [-6.6, 3.2, 13.5],
    look: [-7.6, 2.5, 0],
    narrowOffset: [-3.4, -2.1, 5],
  },
  // 2: Produk
  {
    pos: [11.4, 3.3, 13],
    look: [10.6, 2.6, 0],
    narrowOffset: [3.4, -2.1, 5],
  },
  // 3: Penutup
  {
    pos: [2.6, 5.8, 34],
    look: [2.6, 4.4, 0],
    narrowOffset: [0, -0.5, 10],
  },
];

export function computeCameraTargets(
  progress: number, // 0 to 3
  isNarrow: boolean,
  pointerOffset: { x: number; y: number }
): { position: THREE.Vector3; lookAt: THREE.Vector3 } {
  const pClamped = Math.max(0, Math.min(3, isNaN(progress) ? 0 : progress));

  const i0 = Math.floor(pClamped);
  const i1 = Math.min(3, i0 + 1);
  const t = pClamped - i0;

  const k0 = KEYFRAMES[i0];
  const k1 = KEYFRAMES[i1];

  const getPos = (k: Keyframe): [number, number, number] => {
    if (!isNarrow) return k.pos;
    return [
      k.pos[0] + k.narrowOffset[0],
      k.pos[1],
      k.pos[2] + k.narrowOffset[2],
    ];
  };

  const getLook = (k: Keyframe): [number, number, number] => {
    if (!isNarrow) return k.look;
    return [
      k.look[0] + k.narrowOffset[0],
      k.look[1] + k.narrowOffset[1],
      k.look[2],
    ];
  };

  const p0 = getPos(k0);
  const p1 = getPos(k1);
  const l0 = getLook(k0);
  const l1 = getLook(k1);

  const posX = p0[0] + (p1[0] - p0[0]) * t + pointerOffset.x * 0.8;
  const posY = p0[1] + (p1[1] - p0[1]) * t + pointerOffset.y * 0.4;
  const posZ = p0[2] + (p1[2] - p0[2]) * t;

  const lookX = l0[0] + (l1[0] - l0[0]) * t;
  const lookY = l0[1] + (l1[1] - l0[1]) * t;
  const lookZ = l0[2] + (l1[2] - l0[2]) * t;

  return {
    position: new THREE.Vector3(
      isNaN(posX) ? 2.4 : posX,
      isNaN(posY) ? 3.6 : posY,
      isNaN(posZ) ? 16 : posZ
    ),
    lookAt: new THREE.Vector3(
      isNaN(lookX) ? 0.8 : lookX,
      isNaN(lookY) ? 3.8 : lookY,
      isNaN(lookZ) ? 0 : lookZ
    ),
  };
}

