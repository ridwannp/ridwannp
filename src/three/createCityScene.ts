import * as THREE from 'three';
import { Work } from '../data/works';

export interface CitySceneOptions {
  prefersReducedMotion?: boolean;
}

export interface CitySceneInstance {
  update: (
    curPos: number,
    dpos: number
  ) => { activeLit: number };
  resize: () => void;
  setWorks: (works: Work[]) => void;
  dispose: () => void;
}

// Math helpers
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function smoothstep(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const SPACING = 6.8; // Center-to-center distance between buildings

export function createCityScene(
  host: HTMLElement,
  _options?: CitySceneOptions
): CitySceneInstance {

  // 1. Renderer & Background
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0xdbe9f6, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const canvas = renderer.domElement;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  host.appendChild(canvas);

  // 2. Scene & Fog
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xdbe9f6, 24, 85);

  // 3. Camera
  const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 250);

  // 4. Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd8d4c8, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfffaed, 0.95);
  dirLight.position.set(12, 24, 18);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xbad2e8, 0.45);
  fillLight.position.set(-15, 16, -10);
  scene.add(fillLight);

  // Disposables tracking
  const disposables: { dispose: () => void }[] = [];
  function track<T extends { dispose: () => void }>(obj: T): T {
    disposables.push(obj);
    return obj;
  }

  // 5. Ground & Grid
  const groundGeom = track(new THREE.PlaneGeometry(500, 250));
  const groundMat = track(new THREE.MeshLambertMaterial({ color: 0xf8f6f0 }));
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(50, -0.01, 0);
  scene.add(ground);

  // Subtle grid on ground
  const gridHelper = new THREE.GridHelper(500, 160, 0xd0c8b6, 0xe2ded2);
  gridHelper.position.set(50, 0.01, 0);
  disposables.push(gridHelper.geometry, gridHelper.material as THREE.Material);
  scene.add(gridHelper);

  // 6. Background Distant Buildings (Skyline silhouettes)
  const bgGroup = new THREE.Group();
  scene.add(bgGroup);
  const bgMat = track(new THREE.MeshLambertMaterial({ color: 0xc8d5e2 }));

  for (let bx = -30; bx <= 160; bx += 7.5) {
    const bgFloors = 4 + Math.floor(((Math.sin(bx * 0.4) + 1) / 2) * 8);
    const bgHeight = bgFloors * 1.5;
    const bgWidth = 4.2 + (Math.abs(bx) % 3);
    const bgGeom = track(new THREE.BoxGeometry(bgWidth, bgHeight, 5));
    const bgMesh = new THREE.Mesh(bgGeom, bgMat);
    bgMesh.position.set(bx, bgHeight / 2, -18 - (Math.abs(bx) % 4));
    bgGroup.add(bgMesh);
  }

  // 7. Dynamic City Elements (Buildings, Trees, Cranes)
  const cityGroup = new THREE.Group();
  scene.add(cityGroup);

  let currentWorks: Work[] = [];
  let cityDisposables: { dispose: () => void }[] = [];

  // Common materials
  const roofMat = track(new THREE.MeshLambertMaterial({ color: 0x322f36 }));
  const darkWallMat = track(new THREE.MeshLambertMaterial({ color: 0x36343c }));
  const yellowSlatsMat = track(new THREE.MeshLambertMaterial({ color: 0xd4af37 }));
  const redSlatsMat = track(new THREE.MeshLambertMaterial({ color: 0x8b1538 }));
  const windowGlowMat = track(
    new THREE.MeshBasicMaterial({ color: 0xffce54, transparent: true, opacity: 0.9 })
  );
  const concreteMat = track(new THREE.MeshLambertMaterial({ color: 0xd4cdc0 }));
  const scaffoldPoleMat = track(new THREE.MeshLambertMaterial({ color: 0x6e685f }));
  const craneMastMat = track(new THREE.MeshLambertMaterial({ color: 0xaa2222 }));
  const craneArmMat = track(new THREE.MeshLambertMaterial({ color: 0xd4af37 }));
  const wireMat = track(new THREE.LineBasicMaterial({ color: 0x222026, opacity: 0.5, transparent: true }));
  const treeTrunkMat = track(new THREE.MeshLambertMaterial({ color: 0x60462e }));
  const treeLeafMat = track(
    new THREE.MeshLambertMaterial({ color: 0x56995a })
  );
  const treeLeafDarkMat = track(
    new THREE.MeshLambertMaterial({ color: 0x48834c })
  );

  // Tree template geometries
  const trunkGeom = track(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 7));
  const leafGeom1 = track(new THREE.DodecahedronGeometry(0.55, 0));
  const leafGeom2 = track(new THREE.IcosahedronGeometry(0.65, 0));

  function addTree(x: number, z: number, dark = false) {
    const tGroup = new THREE.Group();
    tGroup.position.set(x, 0, z);

    const trunk = new THREE.Mesh(trunkGeom, treeTrunkMat);
    trunk.position.set(0, 0.6, 0);
    tGroup.add(trunk);

    const leafMesh = new THREE.Mesh(dark ? leafGeom2 : leafGeom1, dark ? treeLeafDarkMat : treeLeafMat);
    leafMesh.position.set(0, 1.5, 0);
    leafMesh.rotation.y = (x * 1.7) % Math.PI;
    tGroup.add(leafMesh);

    cityGroup.add(tGroup);
  }

  function buildCity(works: Work[]) {
    // Clear old city
    cityDisposables.forEach((d) => {
      try {
        d.dispose();
      } catch {
        // ignore
      }
    });
    cityDisposables = [];
    while (cityGroup.children.length > 0) {
      cityGroup.remove(cityGroup.children[0]);
    }

    currentWorks = works;
    const N = works.length;
    if (N === 0) return;

    works.forEach((w, i) => {
      const bx = i * SPACING;
      const bz = -1.5;
      const floors = Math.max(3, Math.min(8, w.floors || 5));
      const height = floors * 1.05;

      // Add a couple of trees around each building
      addTree(bx - 2.1, 1.6, i % 2 === 0);
      addTree(bx + 2.3, 1.8, (i + 1) % 2 === 0);
      if (i % 2 === 1) {
        addTree(bx - 3.2, 0.5, true);
      }

      if (w.status === 'dibangun') {
        // FINISHED / DIBANGUN BUILDING (as seen in Image 1)
        const isDark = i % 3 === 2;
        const wallMat = isDark
          ? darkWallMat
          : new THREE.MeshLambertMaterial({
              color: i % 2 === 0 ? 0xf5efe3 : 0xede4d4,
            });
        if (!isDark) cityDisposables.push(wallMat);

        const bldGeom = new THREE.BoxGeometry(3.2, height, 3.2);
        cityDisposables.push(bldGeom);
        const bldMesh = new THREE.Mesh(bldGeom, wallMat);
        bldMesh.position.set(bx, height / 2, bz);
        cityGroup.add(bldMesh);

        // Dark roof slab with slight overhang
        const roofGeom = new THREE.BoxGeometry(3.4, 0.2, 3.4);
        cityDisposables.push(roofGeom);
        const roofMesh = new THREE.Mesh(roofGeom, roofMat);
        roofMesh.position.set(bx, height + 0.1, bz);
        cityGroup.add(roofMesh);

        // Windows on camera-facing side (z = bz + 1.61)
        const winGeom = new THREE.BoxGeometry(0.55, 0.48, 0.05);
        cityDisposables.push(winGeom);
        const winXOffsets = [-0.9, 0.1];

        for (let fl = 0; fl < floors; fl++) {
          const wy = fl * 1.05 + 0.6;
          for (let col = 0; col < 2; col++) {
            const win = new THREE.Mesh(winGeom, windowGlowMat);
            win.position.set(bx + winXOffsets[col], wy, bz + 1.62);
            cityGroup.add(win);
          }
        }

        // Vertical decorative slats/louvers on the right front corner (Burgundy or Gold)
        const slatMat = i % 2 === 0 ? redSlatsMat : yellowSlatsMat;
        const slatCount = 5;
        const slatGeom = new THREE.BoxGeometry(0.08, height * 0.9, 0.15);
        cityDisposables.push(slatGeom);
        for (let s = 0; s < slatCount; s++) {
          const slat = new THREE.Mesh(slatGeom, slatMat);
          slat.position.set(bx + 0.85 + s * 0.14, height * 0.48, bz + 1.65);
          cityGroup.add(slat);
        }
      } else if (w.status === 'sedang dibangun') {
        // UNDER CONSTRUCTION / SEDANG DIBANGUN (as seen in Image 2)
        // Solid lower base block
        const solidHeight = 2.4;
        const baseGeom = new THREE.BoxGeometry(3.2, solidHeight, 3.2);
        cityDisposables.push(baseGeom);
        const baseMesh = new THREE.Mesh(baseGeom, concreteMat);
        baseMesh.position.set(bx, solidHeight / 2, bz);
        cityGroup.add(baseMesh);

        // Scaffold poles extending upward
        const topHeight = height + 0.6;
        const poleGeom = new THREE.CylinderGeometry(0.04, 0.04, topHeight - solidHeight, 8);
        cityDisposables.push(poleGeom);

        const poleOffsets = [
          [-1.5, -1.5],
          [1.5, -1.5],
          [-1.5, 1.5],
          [1.5, 1.5],
        ];

        poleOffsets.forEach(([px, pz]) => {
          const pole = new THREE.Mesh(poleGeom, scaffoldPoleMat);
          pole.position.set(bx + px, solidHeight + (topHeight - solidHeight) / 2, bz + pz);
          cityGroup.add(pole);
        });

        // Horizontal scaffold rails
        const railGeomX = new THREE.BoxGeometry(3.0, 0.05, 0.05);
        cityDisposables.push(railGeomX);
        const rail1 = new THREE.Mesh(railGeomX, scaffoldPoleMat);
        rail1.position.set(bx, solidHeight + 1.2, bz + 1.5);
        cityGroup.add(rail1);

        const rail2 = new THREE.Mesh(railGeomX, scaffoldPoleMat);
        rail2.position.set(bx, topHeight - 0.2, bz + 1.5);
        cityGroup.add(rail2);

        // Construction Crane nearby
        const craneX = bx + 2.4;
        const craneZ = bz - 0.8;
        const craneMastHeight = height + 3.2;

        // Tall red mast
        const mastGeom = new THREE.BoxGeometry(0.18, craneMastHeight, 0.18);
        cityDisposables.push(mastGeom);
        const mast = new THREE.Mesh(mastGeom, craneMastMat);
        mast.position.set(craneX, craneMastHeight / 2, craneZ);
        cityGroup.add(mast);

        // Yellow horizontal arm/jib
        const armGeom = new THREE.BoxGeometry(4.2, 0.2, 0.2);
        cityDisposables.push(armGeom);
        const arm = new THREE.Mesh(armGeom, craneArmMat);
        arm.position.set(craneX - 0.8, craneMastHeight - 0.1, craneZ);
        cityGroup.add(arm);

        // Thin hanging cable
        const cableGeom = new THREE.BufferGeometry();
        cableGeom.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(
            [craneX - 2.2, craneMastHeight - 0.2, craneZ, craneX - 2.2, solidHeight + 0.8, craneZ],
            3
          )
        );
        cityDisposables.push(cableGeom);
        const cable = new THREE.Line(cableGeom, wireMat);
        cityGroup.add(cable);
      } else {
        // KONSEP / GAGASAN (Minimalist Modern Steel Framework as seen in Image 2)
        const frameHeight = 3.6;
        const frameW = 3.0;

        // 4 dark vertical steel pillars
        const postGeom = new THREE.BoxGeometry(0.12, frameHeight, 0.12);
        cityDisposables.push(postGeom);

        const corners = [
          [-frameW / 2, -frameW / 2],
          [frameW / 2, -frameW / 2],
          [-frameW / 2, frameW / 2],
          [frameW / 2, frameW / 2],
        ];

        corners.forEach(([cx, cz]) => {
          const post = new THREE.Mesh(postGeom, darkWallMat);
          post.position.set(bx + cx, frameHeight / 2, bz + cz);
          cityGroup.add(post);
        });

        // Intermediate floor platform (dark slab)
        const platGeom = new THREE.BoxGeometry(frameW + 0.2, 0.12, frameW + 0.2);
        cityDisposables.push(platGeom);
        const plat1 = new THREE.Mesh(platGeom, darkWallMat);
        plat1.position.set(bx, 1.4, bz);
        cityGroup.add(plat1);

        // Roof slab with top parapet rim
        const plat2 = new THREE.Mesh(platGeom, darkWallMat);
        plat2.position.set(bx, frameHeight - 0.06, bz);
        cityGroup.add(plat2);

        // Low perimeter rim on roof
        const rimGeom = new THREE.BoxGeometry(frameW + 0.2, 0.35, 0.08);
        cityDisposables.push(rimGeom);
        const rimFront = new THREE.Mesh(rimGeom, darkWallMat);
        rimFront.position.set(bx, frameHeight + 0.15, bz + frameW / 2);
        cityGroup.add(rimFront);
      }
    });
  }

  // Camera lookat target
  const targetLookAt = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3(-3.5, 4.2, 13.8);

  function handleResize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  handleResize();

  function update(curPos: number, _dpos: number): { activeLit: number } {
    const N = currentWorks.length;
    if (N === 0) {
      renderer.render(scene, camera);
      return { activeLit: 0 };
    }

    // Camera smoothly tracks x coordinate of curPos
    const focusX = curPos * SPACING;

    const w = host.clientWidth;
    const aspect = Math.max(0.1, w / (host.clientHeight || 1));

    let distMult = 1.0;
    let yOffset = 2.6;
    let xLag = 1.8;

    if (w > 760) {
      // Desktop / Landscape
      distMult = Math.max(1.0, 1.7 / aspect);
      yOffset = 2.8;
      xLag = 2.2;
    } else {
      // Mobile / Portrait
      distMult = Math.max(1.35, 1.55 / aspect);
      yOffset = 3.6;
      xLag = 0.4;
    }

    targetLookAt.set(focusX + xLag, yOffset, -1.0);
    camera.position.set(
      focusX + cameraOffset.x * distMult,
      yOffset + cameraOffset.y * distMult,
      cameraOffset.z * distMult
    );
    camera.lookAt(targetLookAt);

    renderer.render(scene, camera);

    return { activeLit: 1.0 };
  }

  function dispose() {
    cityDisposables.forEach((d) => {
      try {
        d.dispose();
      } catch {
        // ignore
      }
    });
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
    setWorks: buildCity,
    dispose,
  };
}
