export interface ObjectPose {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  opacity: number;
}

export type SceneObjectId =
  | 'lensa'
  | 'kartu1'
  | 'kartu2'
  | 'kartu3'
  | 'kubus'
  | 'rodaGigi'
  | 'tombolGeser'
  | 'gelembungChat'
  | 'dekorOkta';

export type SectionPoseKey = 'hero' | 'discovery' | 'produk' | 'penutup';

export type SectionPoses = Record<SceneObjectId, ObjectPose>;

export interface ResponsivePoses {
  desktop: Record<SectionPoseKey, SectionPoses>;
  portrait: Record<SectionPoseKey, SectionPoses>;
}

export const POSES: ResponsivePoses = {
  desktop: {
    hero: {
      lensa: { x: 3.2, y: 0.2, z: 0.5, rotX: 0.1, rotY: -0.2, rotZ: -0.15, scale: 1.1, opacity: 1 },
      kartu1: { x: 2.1, y: 0.9, z: -0.6, rotX: 0.1, rotY: 0.2, rotZ: 0.1, scale: 0.9, opacity: 1 },
      kartu2: { x: 3.8, y: 1.4, z: -0.8, rotX: -0.05, rotY: -0.25, rotZ: -0.12, scale: 0.9, opacity: 1 },
      kartu3: { x: 4.2, y: -0.6, z: -0.5, rotX: 0.15, rotY: -0.1, rotZ: 0.08, scale: 0.85, opacity: 1 },
      kubus: { x: 1.6, y: -1.2, z: -0.3, rotX: 0.4, rotY: 0.6, rotZ: 0.2, scale: 0.75, opacity: 1 },
      rodaGigi: { x: 4.6, y: 0.6, z: -1.2, rotX: 0.3, rotY: 0.1, rotZ: 0.5, scale: 0.8, opacity: 1 },
      tombolGeser: { x: 2.7, y: -1.7, z: 0.2, rotX: -0.2, rotY: 0.3, rotZ: 0.1, scale: 0.7, opacity: 1 },
      gelembungChat: { x: 4.4, y: -1.8, z: -0.6, rotX: 0.1, rotY: -0.2, rotZ: 0.05, scale: 0.75, opacity: 1 },
      dekorOkta: { x: 1.2, y: 1.5, z: 0.1, rotX: 0.5, rotY: 0.5, rotZ: 0.2, scale: 0.4, opacity: 0.9 },
    },
    discovery: {
      lensa: { x: 1.8, y: 0.8, z: 0.4, rotX: 0.05, rotY: 0.1, rotZ: -0.05, scale: 0.85, opacity: 1 },
      kartu1: { x: 3.2, y: 0.4, z: 0.3, rotX: 0.05, rotY: -0.1, rotZ: 0.04, scale: 1.15, opacity: 1 },
      kartu2: { x: 3.5, y: -0.2, z: -0.2, rotX: 0.08, rotY: -0.12, rotZ: -0.06, scale: 0.95, opacity: 0.6 },
      kartu3: { x: 3.8, y: -0.8, z: -0.7, rotX: 0.12, rotY: -0.15, rotZ: 0.08, scale: 0.85, opacity: 0.4 },
      kubus: { x: 5.2, y: 1.8, z: -2.0, rotX: 0.2, rotY: 0.4, rotZ: 0.1, scale: 0.45, opacity: 0.5 },
      rodaGigi: { x: 5.4, y: -1.6, z: -2.0, rotX: 0.1, rotY: 0.2, rotZ: 0.3, scale: 0.45, opacity: 0.5 },
      tombolGeser: { x: 5.0, y: 0.2, z: -2.0, rotX: 0.1, rotY: -0.1, rotZ: 0.2, scale: 0.4, opacity: 0.4 },
      gelembungChat: { x: 5.5, y: -0.8, z: -2.0, rotX: 0.0, rotY: 0.2, rotZ: 0.0, scale: 0.4, opacity: 0.3 },
      dekorOkta: { x: 4.8, y: 2.2, z: -2.0, rotX: 0.2, rotY: 0.2, rotZ: 0.1, scale: 0.25, opacity: 0.4 },
    },
    produk: {
      lensa: { x: 5.5, y: 3.0, z: -3.0, rotX: 0.1, rotY: 0.1, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kartu1: { x: 4.5, y: 3.0, z: -3.0, rotX: 0.1, rotY: 0.1, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kartu2: { x: 5.0, y: 3.0, z: -3.0, rotX: 0.1, rotY: 0.1, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kartu3: { x: 5.5, y: 3.0, z: -3.0, rotX: 0.1, rotY: 0.1, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kubus: { x: -3.8, y: -0.2, z: -0.5, rotX: 0.3, rotY: 0.5, rotZ: 0.1, scale: 0.9, opacity: 0.95 },
      rodaGigi: { x: 3.8, y: 1.2, z: -0.3, rotX: 0.2, rotY: 0.1, rotZ: 0.4, scale: 0.95, opacity: 0.95 },
      tombolGeser: { x: 4.2, y: -1.2, z: -0.2, rotX: -0.1, rotY: 0.2, rotZ: 0.15, scale: 0.85, opacity: 0.95 },
      gelembungChat: { x: -3.5, y: 1.4, z: -0.8, rotX: 0.1, rotY: -0.2, rotZ: 0.05, scale: 0.85, opacity: 0.9 },
      dekorOkta: { x: 0.0, y: 2.2, z: -1.0, rotX: 0.4, rotY: 0.4, rotZ: 0.2, scale: 0.45, opacity: 0.8 },
    },
    penutup: {
      lensa: { x: 0.0, y: 1.4, z: 0.0, rotX: 0.05, rotY: 0.05, rotZ: -0.05, scale: 0.6, opacity: 0.9 },
      kartu1: { x: -0.6, y: 1.6, z: -0.3, rotX: 0.1, rotY: 0.1, rotZ: 0.05, scale: 0.45, opacity: 0.8 },
      kartu2: { x: 0.6, y: 1.5, z: -0.4, rotX: -0.1, rotY: -0.1, rotZ: -0.05, scale: 0.45, opacity: 0.8 },
      kartu3: { x: 0.0, y: 1.8, z: -0.6, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.4, opacity: 0.7 },
      kubus: { x: -1.0, y: 1.2, z: -0.2, rotX: 0.2, rotY: 0.3, rotZ: 0.1, scale: 0.4, opacity: 0.85 },
      rodaGigi: { x: 1.0, y: 1.3, z: -0.2, rotX: 0.1, rotY: 0.1, rotZ: 0.2, scale: 0.45, opacity: 0.85 },
      tombolGeser: { x: -0.4, y: 1.0, z: 0.1, rotX: 0.0, rotY: 0.1, rotZ: 0.0, scale: 0.4, opacity: 0.85 },
      gelembungChat: { x: 0.5, y: 1.0, z: 0.1, rotX: 0.0, rotY: -0.1, rotZ: 0.0, scale: 0.4, opacity: 0.85 },
      dekorOkta: { x: 0.0, y: 2.2, z: -0.2, rotX: 0.3, rotY: 0.3, rotZ: 0.1, scale: 0.3, opacity: 0.9 },
    },
  },
  portrait: {
    hero: {
      lensa: { x: 0.2, y: 1.6, z: 0.2, rotX: 0.1, rotY: -0.15, rotZ: -0.1, scale: 0.8, opacity: 1 },
      kartu1: { x: -0.8, y: 2.0, z: -0.4, rotX: 0.1, rotY: 0.15, rotZ: 0.05, scale: 0.65, opacity: 0.9 },
      kartu2: { x: 0.9, y: 2.1, z: -0.5, rotX: -0.05, rotY: -0.2, rotZ: -0.1, scale: 0.65, opacity: 0.9 },
      kartu3: { x: 0.0, y: 2.5, z: -0.7, rotX: 0.1, rotY: 0.0, rotZ: 0.0, scale: 0.6, opacity: 0.7 },
      kubus: { x: -1.2, y: 1.0, z: -0.5, rotX: 0.3, rotY: 0.4, rotZ: 0.1, scale: 0.5, opacity: 0.7 },
      rodaGigi: { x: 1.2, y: 1.2, z: -0.6, rotX: 0.2, rotY: 0.1, rotZ: 0.3, scale: 0.5, opacity: 0.7 },
      tombolGeser: { x: 0.0, y: 0.8, z: 0.1, rotX: 0.0, rotY: 0.1, rotZ: 0.0, scale: 0.45, opacity: 0.6 },
      gelembungChat: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      dekorOkta: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
    },
    discovery: {
      lensa: { x: 0.0, y: 2.1, z: 0.1, rotX: 0.05, rotY: 0.05, rotZ: -0.05, scale: 0.65, opacity: 1 },
      kartu1: { x: 0.0, y: 1.3, z: 0.2, rotX: 0.05, rotY: -0.05, rotZ: 0.02, scale: 0.85, opacity: 1 },
      kartu2: { x: 0.2, y: 0.9, z: -0.2, rotX: 0.08, rotY: -0.1, rotZ: -0.04, scale: 0.75, opacity: 0.5 },
      kartu3: { x: 0.4, y: 0.5, z: -0.5, rotX: 0.1, rotY: -0.12, rotZ: 0.05, scale: 0.65, opacity: 0.3 },
      kubus: { x: -1.4, y: 2.2, z: -1.5, rotX: 0.2, rotY: 0.3, rotZ: 0.1, scale: 0.35, opacity: 0.4 },
      rodaGigi: { x: 1.4, y: 2.0, z: -1.5, rotX: 0.1, rotY: 0.2, rotZ: 0.2, scale: 0.35, opacity: 0.4 },
      tombolGeser: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      gelembungChat: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      dekorOkta: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
    },
    produk: {
      lensa: { x: 0.0, y: 3.0, z: -3.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kartu1: { x: 0.0, y: 3.0, z: -3.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kartu2: { x: 0.0, y: 3.0, z: -3.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kartu3: { x: 0.0, y: 3.0, z: -3.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      kubus: { x: -0.9, y: 1.8, z: -0.5, rotX: 0.3, rotY: 0.4, rotZ: 0.1, scale: 0.6, opacity: 0.8 },
      rodaGigi: { x: 0.9, y: 1.9, z: -0.4, rotX: 0.2, rotY: 0.1, rotZ: 0.3, scale: 0.6, opacity: 0.8 },
      tombolGeser: { x: -0.6, y: 1.1, z: 0.0, rotX: 0.0, rotY: 0.1, rotZ: 0.1, scale: 0.5, opacity: 0.8 },
      gelembungChat: { x: 0.6, y: 1.2, z: 0.0, rotX: 0.1, rotY: -0.1, rotZ: 0.0, scale: 0.5, opacity: 0.8 },
      dekorOkta: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
    },
    penutup: {
      lensa: { x: 0.0, y: 1.4, z: 0.0, rotX: 0.05, rotY: 0.05, rotZ: -0.05, scale: 0.5, opacity: 0.85 },
      kartu1: { x: -0.4, y: 1.6, z: -0.3, rotX: 0.1, rotY: 0.1, rotZ: 0.05, scale: 0.35, opacity: 0.7 },
      kartu2: { x: 0.4, y: 1.5, z: -0.4, rotX: -0.1, rotY: -0.1, rotZ: -0.05, scale: 0.35, opacity: 0.7 },
      kartu3: { x: 0.0, y: 1.8, z: -0.6, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.3, opacity: 0.6 },
      kubus: { x: -0.7, y: 1.2, z: -0.2, rotX: 0.2, rotY: 0.3, rotZ: 0.1, scale: 0.35, opacity: 0.75 },
      rodaGigi: { x: 0.7, y: 1.3, z: -0.2, rotX: 0.1, rotY: 0.1, rotZ: 0.2, scale: 0.35, opacity: 0.75 },
      tombolGeser: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      gelembungChat: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
      dekorOkta: { x: 0.0, y: 0.0, z: -2.0, rotX: 0.0, rotY: 0.0, rotZ: 0.0, scale: 0.01, opacity: 0 },
    },
  },
};

export function interpolatePose(a: ObjectPose, b: ObjectPose, progress: number): ObjectPose {
  const p = Math.max(0, Math.min(1, progress));
  return {
    x: a.x + (b.x - a.x) * p,
    y: a.y + (b.y - a.y) * p,
    z: a.z + (b.z - a.z) * p,
    rotX: a.rotX + (b.rotX - a.rotX) * p,
    rotY: a.rotY + (b.rotY - a.rotY) * p,
    rotZ: a.rotZ + (b.rotZ - a.rotZ) * p,
    scale: a.scale + (b.scale - a.scale) * p,
    opacity: a.opacity + (b.opacity - a.opacity) * p,
  };
}

