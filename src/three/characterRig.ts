import * as THREE from 'three';

export interface CharacterRig {
  group: THREE.Group;
  update: (
    stepDistance: number,
    isMoving: boolean,
    targetYaw: number,
    prefersReducedMotion: boolean
  ) => void;
  setPosition: (x: number, y: number, z: number) => void;
  dispose: () => void;
}

export function createCharacterRig(trackDisposable: <T extends { dispose: () => void }>(obj: T) => T): CharacterRig {
  const charGroup = new THREE.Group();
  const yawGroup = new THREE.Group();
  charGroup.add(yawGroup);

  // Materials
  const lowPolyMaterials = {
    pants: trackDisposable(new THREE.MeshLambertMaterial({ color: 0x2e2d38 })),
    torso: trackDisposable(new THREE.MeshLambertMaterial({ color: 0xcfc6ae })),
    skin: trackDisposable(new THREE.MeshLambertMaterial({ color: 0xe2bf9c })),
    hair: trackDisposable(new THREE.MeshLambertMaterial({ color: 0x17171d })),
    backpack: trackDisposable(new THREE.MeshLambertMaterial({ color: 0x2b2b32 })),
  };

  // Geometries
  const legBox = trackDisposable(new THREE.BoxGeometry(0.22, 0.88, 0.24));
  const torsoBox = trackDisposable(new THREE.BoxGeometry(0.36, 0.6, 0.52));
  const armBox = trackDisposable(new THREE.BoxGeometry(0.15, 0.56, 0.16));
  const handBox = trackDisposable(new THREE.BoxGeometry(0.14, 0.12, 0.15));
  const headBox = trackDisposable(new THREE.BoxGeometry(0.3, 0.3, 0.3));
  const hairTopBox = trackDisposable(new THREE.BoxGeometry(0.34, 0.14, 0.34));
  const hairBackBox = trackDisposable(new THREE.BoxGeometry(0.1, 0.22, 0.34));
  const backpackBox = trackDisposable(new THREE.BoxGeometry(0.2, 0.5, 0.38));
  const shadowGeom = trackDisposable(new THREE.CircleGeometry(0.5, 32));

  // Shadow
  const shadowMat = trackDisposable(
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
  );
  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.scale.set(1.4, 1.4, 1);
  shadowMesh.position.set(0, 0.04, 0);
  charGroup.add(shadowMesh);

  // Legs with hip pivots (y = 0.88, z = +-0.14)
  const leftHip = new THREE.Group();
  leftHip.position.set(0, 0.88, -0.14);
  const leftLegMesh = new THREE.Mesh(legBox, lowPolyMaterials.pants);
  leftLegMesh.position.set(0, -0.44, 0);
  leftHip.add(leftLegMesh);
  yawGroup.add(leftHip);

  const rightHip = new THREE.Group();
  rightHip.position.set(0, 0.88, 0.14);
  const rightLegMesh = new THREE.Mesh(legBox, lowPolyMaterials.pants);
  rightLegMesh.position.set(0, -0.44, 0);
  rightHip.add(rightLegMesh);
  yawGroup.add(rightHip);

  // Upper Body container
  const bodyGroup = new THREE.Group();
  yawGroup.add(bodyGroup);

  const torsoMesh = new THREE.Mesh(torsoBox, lowPolyMaterials.torso);
  torsoMesh.position.set(0, 1.18, 0);
  bodyGroup.add(torsoMesh);

  // Arms with shoulder pivots (y = 1.42, z = +-0.34)
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(0, 1.42, -0.34);
  const leftArmMesh = new THREE.Mesh(armBox, lowPolyMaterials.torso);
  leftArmMesh.position.set(0, -0.28, 0);
  leftShoulder.add(leftArmMesh);
  const leftHandMesh = new THREE.Mesh(handBox, lowPolyMaterials.skin);
  leftHandMesh.position.set(0, -0.62, 0);
  leftShoulder.add(leftHandMesh);
  bodyGroup.add(leftShoulder);

  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0, 1.42, 0.34);
  const rightArmMesh = new THREE.Mesh(armBox, lowPolyMaterials.torso);
  rightArmMesh.position.set(0, -0.28, 0);
  rightShoulder.add(rightArmMesh);
  const rightHandMesh = new THREE.Mesh(handBox, lowPolyMaterials.skin);
  rightHandMesh.position.set(0, -0.62, 0);
  rightShoulder.add(rightHandMesh);
  bodyGroup.add(rightShoulder);

  // Head and Hair
  const headMesh = new THREE.Mesh(headBox, lowPolyMaterials.skin);
  headMesh.position.set(0.02, 1.63, 0);
  bodyGroup.add(headMesh);

  const hairTopMesh = new THREE.Mesh(hairTopBox, lowPolyMaterials.hair);
  hairTopMesh.position.set(0, 1.79, 0);
  bodyGroup.add(hairTopMesh);

  const hairBackMesh = new THREE.Mesh(hairBackBox, lowPolyMaterials.hair);
  hairBackMesh.position.set(-0.13, 1.66, 0);
  bodyGroup.add(hairBackMesh);

  // Backpack
  const backpackMesh = new THREE.Mesh(backpackBox, lowPolyMaterials.backpack);
  backpackMesh.position.set(-0.3, 1.2, 0);
  bodyGroup.add(backpackMesh);

  let walkPhase = 0;
  let walkAmp = 0;
  let currentYaw = 0;

  function update(
    stepDistance: number,
    isMoving: boolean,
    targetYaw: number,
    prefersReducedMotion: boolean
  ) {
    walkPhase += stepDistance;
    const targetAmp = isMoving ? 1 : 0;

    if (prefersReducedMotion) {
      walkAmp = 0;
      currentYaw = targetYaw;
    } else {
      walkAmp += (targetAmp - walkAmp) * 0.18;
      // Angle interpolation handling wrapping if necessary
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
  }

  function setPosition(x: number, y: number, z: number) {
    charGroup.position.set(x, y, z);
  }

  function dispose() {
    // Meshes/geometries are tracked by parent trackDisposable
  }

  return {
    group: charGroup,
    update,
    setPosition,
    dispose,
  };
}

