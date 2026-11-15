import * as THREE from 'three';
import { Project, ProjectStatus } from '../content/karya';
import { QualityTier } from '../hooks/useQualityTier';

export interface CitySceneCallbacks {
  onHover?: (slug: string | null, screenPos?: { x: number; y: number }) => void;
  onClick?: (slug: string) => void;
  onActiveDistrictChange?: (district: number) => void;
}

export interface CitySceneOptions {
  qualityTier: QualityTier;
  prefersReducedMotion: boolean;
  callbacks?: CitySceneCallbacks;
}

export interface CitySceneInstance {
  updateScroll: (progress: number) => void;
  setHoveredSlug: (slug: string | null) => void;
  setStatusFilter: (status: ProjectStatus | null) => void;
  setDistrictFilter: (district: number | null) => void;
  resize: () => void;
  getRenderStats: () => { drawCalls: number; triangles: number; tier: QualityTier };
  dispose: () => void;
}

export function createRealCityScene(
  host: HTMLElement,
  projects: Project[],
  options: CitySceneOptions
): CitySceneInstance {
  const isHighTier = options.qualityTier === 'high';
  const prefersReducedMotion = options.prefersReducedMotion;
  const callbacks = options.callbacks || {};

  // 1. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    antialias: isHighTier,
    alpha: true,
    powerPreference: isHighTier ? 'high-performance' : 'default',
  });
  renderer.setClearColor(0x000000, 0); // Transparent canvas to show CSS sky gradient
  const maxDpr = isHighTier ? Math.min(window.devicePixelRatio || 1, 2) : 1.25;
  renderer.setPixelRatio(maxDpr);

  if (isHighTier) {
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
  }

  const canvas = renderer.domElement;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  host.appendChild(canvas);

  // 2. Scene & Fog
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xdceaff, 24, 90);

  // 3. Camera
  const initialWidth = Math.max(1, host.clientWidth);
  const initialHeight = Math.max(1, host.clientHeight);
  const camera = new THREE.PerspectiveCamera(26, initialWidth / initialHeight, 0.1, 300);

  // 4. Lights
  const hemiLight = new THREE.HemisphereLight(0xbfd9f5, 0xe8dcc6, isHighTier ? 0.85 : 0.95);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffe6bf, isHighTier ? 1.0 : 0.85);
  sunLight.position.set(-14, 22, 16);
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xa5c4e8, 0.35);
  fillLight.position.set(18, 14, -12);
  scene.add(fillLight);

  // Disposables tracking
  const disposables: { dispose: () => void }[] = [];
  function track<T extends { dispose: () => void }>(obj: T): T {
    disposables.push(obj);
    return obj;
  }

  // 5. Procedural Sky Environment Map (Tier High only)
  let envMap: THREE.Texture | null = null;
  if (isHighTier) {
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();

      const skyCanvas = document.createElement('canvas');
      skyCanvas.width = 128;
      skyCanvas.height = 64;
      const ctx = skyCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 64);
        grad.addColorStop(0, '#78b7f1');
        grad.addColorStop(0.4, '#b2d6f6');
        grad.addColorStop(0.85, '#f1e7d3');
        grad.addColorStop(1, '#efe4d0');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 64);
      }
      const skyTex = track(new THREE.CanvasTexture(skyCanvas));
      const renderTarget = pmrem.fromEquirectangular(skyTex);
      envMap = renderTarget.texture;
      scene.environment = envMap;
      pmrem.dispose();
      track(renderTarget);
    } catch {
      // Graceful fallback without envMap
    }
  }

  // 6. Ground & Plaza Grid
  const groundGeom = track(new THREE.PlaneGeometry(500, 200));
  const groundMat = track(
    new THREE.MeshLambertMaterial({
      color: 0xf8f6f0,
      transparent: true,
      opacity: 0.95,
    })
  );
  const groundMesh = new THREE.Mesh(groundGeom, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(50, -0.01, 0);
  scene.add(groundMesh);

  // Grid Lines
  const gridHelper = new THREE.GridHelper(500, 160, 0xd4cbbb, 0xeae5d9);
  gridHelper.position.set(50, 0.01, 0);
  disposables.push(gridHelper.geometry, gridHelper.material as THREE.Material);
  scene.add(gridHelper);

  // Soft Contact Shadow Texture (baked procedurally)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 64;
  shadowCanvas.height = 64;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sGrad.addColorStop(0, 'rgba(40, 35, 45, 0.35)');
    sGrad.addColorStop(0.5, 'rgba(40, 35, 45, 0.15)');
    sGrad.addColorStop(1, 'rgba(40, 35, 45, 0.0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 64);
  }
  const shadowTexture = track(new THREE.CanvasTexture(shadowCanvas));
  const shadowPlaneGeom = track(new THREE.PlaneGeometry(4.2, 4.2));
  const shadowMat = track(
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: isHighTier ? 0.75 : 0.45,
    })
  );

  // 7. Distant City Silhouettes (Background Skyline)
  const bgMat = track(new THREE.MeshLambertMaterial({ color: 0xc8d5e2 }));
  const bgCount = isHighTier ? 24 : 12;
  for (let i = 0; i < bgCount; i++) {
    const bx = -15 + i * (isHighTier ? 3.8 : 7.5);
    const bgH = 4 + Math.abs(Math.sin(i * 1.3)) * 8;
    const bgW = 3.2 + (i % 3) * 0.8;
    const bgGeom = track(new THREE.BoxGeometry(bgW, bgH, 4));
    const bgMesh = new THREE.Mesh(bgGeom, bgMat);
    bgMesh.position.set(bx, bgH / 2, -18 - (i % 4));
    scene.add(bgMesh);
  }

  // 8. Shared Materials
  const darkRoofMat = track(new THREE.MeshLambertMaterial({ color: 0x2e2c33 }));
  const darkSteelMat = track(new THREE.MeshLambertMaterial({ color: 0x242228 }));
  const concreteMat = track(new THREE.MeshLambertMaterial({ color: 0xd4cdc0 }));
  const scaffoldPoleMat = track(new THREE.MeshLambertMaterial({ color: 0x6e685f }));
  const craneBurgundyMat = track(new THREE.MeshLambertMaterial({ color: 0x8b1538 }));
  const craneGoldMat = track(new THREE.MeshLambertMaterial({ color: 0xd4af37 }));
  const burgundySlatMat = track(new THREE.MeshLambertMaterial({ color: 0x8b1538 }));
  const goldSlatMat = track(new THREE.MeshLambertMaterial({ color: 0xd4af37 }));
  const woodPanelMat = track(new THREE.MeshLambertMaterial({ color: 0xb5824c }));
  const wireMat = track(
    new THREE.LineBasicMaterial({ color: 0x1b1a2e, opacity: 0.45, transparent: true })
  );
  const ghostLineMat = track(
    new THREE.LineBasicMaterial({ color: 0x8b1538, opacity: 0.18, transparent: true })
  );

  // Window Materials
  const windowLitMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xffd060,
      transparent: true,
      opacity: 0.95,
    })
  );
  const windowReflectMat = isHighTier
    ? track(
        new THREE.MeshStandardMaterial({
          color: 0xa8c4db,
          metalness: 0.65,
          roughness: 0.15,
          envMapIntensity: 1.2,
        })
      )
    : track(new THREE.MeshLambertMaterial({ color: 0x98b8d0 }));

  // Foliage & Tree Materials
  const treeTrunkMat = track(new THREE.MeshLambertMaterial({ color: 0x5a412c }));
  const treeLeafMat = track(new THREE.MeshLambertMaterial({ color: 0x529457 }));
  const treeLeafDarkMat = track(new THREE.MeshLambertMaterial({ color: 0x3f7a44 }));

  // Tree template geometries
  const trunkGeom = track(new THREE.CylinderGeometry(0.07, 0.11, 1.1, 7));
  const leafGeom1 = track(new THREE.DodecahedronGeometry(0.52, 0));
  const leafGeom2 = track(new THREE.IcosahedronGeometry(0.62, 0));

  function addTree(x: number, z: number, dark = false) {
    const tGroup = new THREE.Group();
    tGroup.position.set(x, 0, z);

    const trunk = new THREE.Mesh(trunkGeom, treeTrunkMat);
    trunk.position.set(0, 0.55, 0);
    tGroup.add(trunk);

    const leaf = new THREE.Mesh(dark ? leafGeom2 : leafGeom1, dark ? treeLeafDarkMat : treeLeafMat);
    leaf.position.set(0, 1.45, 0);
    leaf.rotation.y = (x * 1.3) % Math.PI;
    tGroup.add(leaf);

    scene.add(tGroup);
  }

  // 9. Buildings Assembly
  interface BuildingEntry {
    slug: string;
    group: THREE.Group;
    hitMesh: THREE.Mesh;
    baseY: number;
    targetY: number;
    currentY: number;
    project: Project;
    materials: THREE.Material[];
    swayingHook?: THREE.Group;
  }

  const buildings: BuildingEntry[] = [];
  const hitMeshes: THREE.Mesh[] = [];

  const buildingHitGeom = track(new THREE.BoxGeometry(3.6, 6.0, 3.6));
  const invisibleMat = track(
    new THREE.MeshBasicMaterial({ visible: false, depthWrite: false })
  );

  projects.forEach((proj, idx) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(proj.worldX, 0, proj.worldZ);

    const bldMaterials: THREE.Material[] = [];
    const height = Math.max(2.1, proj.height);
    const width = 2.9;
    const depth = 2.9;

    // Contact shadow beneath building
    const shadow = new THREE.Mesh(shadowPlaneGeom, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, 0.015, 0);
    bGroup.add(shadow);

    // Tree adjacent to building
    addTree(proj.worldX - 1.25, proj.worldZ + 1.8, idx % 2 === 0);
    if (idx % 3 === 1) {
      addTree(proj.worldX + 1.3, proj.worldZ + 1.9, true);
    }

    let craneHookGroup: THREE.Group | undefined;

    if (proj.status === 'built') {
      // ------------------------------------
      // BUILT (DIBANGUN - JADI)
      // ------------------------------------
      const isDark = idx % 4 === 1;
      const wallMat = isDark
        ? darkRoofMat
        : track(
            new THREE.MeshLambertMaterial({
              color: idx % 2 === 0 ? 0xf5efe3 : 0xeee6d8,
            })
          );
      bldMaterials.push(wallMat);

      // Main facade box
      const mainBoxGeom = track(new THREE.BoxGeometry(width, height, depth));
      const mainMesh = new THREE.Mesh(mainBoxGeom, wallMat);
      mainMesh.position.set(0, height / 2, 0);
      bGroup.add(mainMesh);

      // Roof slab & parapet
      const roofSlabGeom = track(new THREE.BoxGeometry(width + 0.15, 0.18, depth + 0.15));
      const roofMesh = new THREE.Mesh(roofSlabGeom, darkRoofMat);
      roofMesh.position.set(0, height + 0.09, 0);
      bGroup.add(roofMesh);

      // Elevator machine room / rooftop unit
      if (height > 2.6) {
        const machGeom = track(new THREE.BoxGeometry(1.0, 0.55, 1.0));
        const machMesh = new THREE.Mesh(machGeom, darkRoofMat);
        machMesh.position.set(0.4, height + 0.45, -0.4);
        bGroup.add(machMesh);
      }

      // Windows
      const numFloors = Math.max(2, Math.floor(height / 0.75));
      const winW = 0.52;
      const winH = 0.44;
      const winBoxGeom = track(new THREE.BoxGeometry(winW, winH, 0.05));

      for (let fl = 0; fl < numFloors; fl++) {
        const wy = 0.55 + fl * 0.75;
        if (wy > height - 0.3) break;

        // Front windows
        for (let col = -1; col <= 0; col++) {
          const isLit = (fl + col + idx) % 2 === 0;
          const wMat = isLit ? windowLitMat : windowReflectMat;
          const win = new THREE.Mesh(winBoxGeom, wMat);
          win.position.set(col * 0.75 - 0.2, wy, depth / 2 + 0.03);
          bGroup.add(win);
        }
      }

      // Architectural Slats / Fins (Burgundy or Gold)
      const slatMat = idx % 2 === 0 ? burgundySlatMat : (idx % 3 === 0 ? woodPanelMat : goldSlatMat);
      const slatGeom = track(new THREE.BoxGeometry(0.07, height * 0.88, 0.12));
      const slatCount = 4;
      for (let s = 0; s < slatCount; s++) {
        const slat = new THREE.Mesh(slatGeom, slatMat);
        slat.position.set(0.72 + s * 0.14, height * 0.48, depth / 2 + 0.06);
        bGroup.add(slat);
      }
    } else if (proj.status === 'building') {
      // ------------------------------------
      // UNDER CONSTRUCTION (SEDANG DIBANGUN)
      // ------------------------------------
      const solidH = Math.min(height, 1.8);
      const solidGeom = track(new THREE.BoxGeometry(width, solidH, depth));
      const solidMesh = new THREE.Mesh(solidGeom, concreteMat);
      solidMesh.position.set(0, solidH / 2, 0);
      bGroup.add(solidMesh);

      // Rebar Columns & Scaffold
      const scaffoldH = height + 0.8;
      const poleGeom = track(new THREE.CylinderGeometry(0.035, 0.035, scaffoldH - solidH, 6));

      const corners = [
        [-width / 2 + 0.15, -depth / 2 + 0.15],
        [width / 2 - 0.15, -depth / 2 + 0.15],
        [-width / 2 + 0.15, depth / 2 - 0.15],
        [width / 2 - 0.15, depth / 2 - 0.15],
      ];

      corners.forEach(([cx, cz]) => {
        const pole = new THREE.Mesh(poleGeom, scaffoldPoleMat);
        pole.position.set(cx, solidH + (scaffoldH - solidH) / 2, cz);
        bGroup.add(pole);
      });

      // Horizontal Scaffold Rails
      const railGeom = track(new THREE.BoxGeometry(width - 0.1, 0.04, 0.04));
      const rail1 = new THREE.Mesh(railGeom, scaffoldPoleMat);
      rail1.position.set(0, solidH + 0.8, depth / 2 - 0.15);
      bGroup.add(rail1);

      const rail2 = new THREE.Mesh(railGeom, scaffoldPoleMat);
      rail2.position.set(0, scaffoldH - 0.15, depth / 2 - 0.15);
      bGroup.add(rail2);

      // Crane (Burgundy mast, yellow arm & hook)
      const craneGroup = new THREE.Group();
      const craneX = width / 2 + 0.95;
      const craneZ = -depth / 2 + 0.3;
      const mastH = height + 2.5;

      const mastGeom = track(new THREE.BoxGeometry(0.14, mastH, 0.14));
      const mast = new THREE.Mesh(mastGeom, craneBurgundyMat);
      mast.position.set(craneX, mastH / 2, craneZ);
      craneGroup.add(mast);

      // Jib arm
      const armGeom = track(new THREE.BoxGeometry(3.6, 0.14, 0.14));
      const arm = new THREE.Mesh(armGeom, craneGoldMat);
      arm.position.set(craneX - 0.9, mastH - 0.08, craneZ);
      craneGroup.add(arm);

      // Counterweight
      const cwGeom = track(new THREE.BoxGeometry(0.4, 0.28, 0.25));
      const cw = new THREE.Mesh(cwGeom, darkRoofMat);
      cw.position.set(craneX + 0.7, mastH - 0.08, craneZ);
      craneGroup.add(cw);

      // Swaying Hook Group
      craneHookGroup = new THREE.Group();
      craneHookGroup.position.set(craneX - 1.8, mastH - 0.15, craneZ);

      const cableGeom = track(new THREE.BufferGeometry());
      cableGeom.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([0, 0, 0, 0, -1.8, 0], 3)
      );
      const cable = new THREE.Line(cableGeom, wireMat);
      craneHookGroup.add(cable);

      const hookGeom = track(new THREE.SphereGeometry(0.08, 8, 8));
      const hookMesh = new THREE.Mesh(hookGeom, craneGoldMat);
      hookMesh.position.set(0, -1.85, 0);
      craneHookGroup.add(hookMesh);

      craneGroup.add(craneHookGroup);
      bGroup.add(craneGroup);
    } else {
      // ------------------------------------
      // CONCEPT (KONSEP - RANGKA BAJA)
      // ------------------------------------
      const frameH = 2.4;
      const colGeom = track(new THREE.BoxGeometry(0.11, frameH, 0.11));

      const corners = [
        [-width / 2 + 0.1, -depth / 2 + 0.1],
        [width / 2 - 0.1, -depth / 2 + 0.1],
        [-width / 2 + 0.1, depth / 2 - 0.1],
        [width / 2 - 0.1, depth / 2 - 0.1],
      ];

      corners.forEach(([cx, cz]) => {
        const col = new THREE.Mesh(colGeom, darkSteelMat);
        col.position.set(cx, frameH / 2, cz);
        bGroup.add(col);
      });

      // Dark floor plates
      const plateGeom = track(new THREE.BoxGeometry(width, 0.08, depth));
      const p1 = new THREE.Mesh(plateGeom, darkSteelMat);
      p1.position.set(0, 1.2, 0);
      bGroup.add(p1);

      const p2 = new THREE.Mesh(plateGeom, darkSteelMat);
      p2.position.set(0, frameH, 0);
      bGroup.add(p2);

      // Ghost line volume of planned structure
      const ghostBox = track(new THREE.BoxGeometry(width, height - frameH, depth));
      const ghostEdges = track(new THREE.EdgesGeometry(ghostBox));
      const ghostLines = new THREE.LineSegments(ghostEdges, ghostLineMat);
      ghostLines.position.set(0, frameH + (height - frameH) / 2, 0);
      bGroup.add(ghostLines);
    }

    // Hit Testing Box
    const hitMesh = new THREE.Mesh(buildingHitGeom, invisibleMat);
    hitMesh.position.set(0, height / 2, 0);
    hitMesh.userData = { slug: proj.slug, index: idx };
    bGroup.add(hitMesh);
    hitMeshes.push(hitMesh);

    scene.add(bGroup);

    buildings.push({
      slug: proj.slug,
      group: bGroup,
      hitMesh,
      baseY: 0,
      targetY: 0,
      currentY: -height, // Initial stagger growth
      project: proj,
      materials: bldMaterials,
      swayingHook: craneHookGroup,
    });
  });

  // Stagger entrance animation
  let entranceTimer = 0;
  const staggerDelay = 0.07; // seconds per building

  // State
  let targetCameraX = projects[0]?.worldX || 0;
  let currentCameraX = targetCameraX;
  let activeHoveredSlug: string | null = null;
  let activeStatusFilter: ProjectStatus | null = null;
  let activeDistrictFilter: number | null = null;
  let isScenePaused = false;
  let animationFrameId: number | null = null;
  let lastTime = performance.now();
  let hookTime = 0;

  // Raycaster & Pointer
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-999, -999);
  const tempVec = new THREE.Vector3();

  function onPointerMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(hitMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const slug = (hit.userData as { slug?: string }).slug;
      if (slug && slug !== activeHoveredSlug) {
        activeHoveredSlug = slug;
        canvas.style.cursor = 'pointer';

        // Project 3D position to 2D screen coordinates for Tooltip
        hit.getWorldPosition(tempVec);
        tempVec.y += 1.6;
        tempVec.project(camera);

        const screenX = ((tempVec.x + 1) * rect.width) / 2 + rect.left;
        const screenY = ((-tempVec.y + 1) * rect.height) / 2 + rect.top;

        callbacks.onHover?.(slug, { x: screenX, y: screenY });
      }
    } else {
      if (activeHoveredSlug !== null) {
        activeHoveredSlug = null;
        canvas.style.cursor = 'default';
        callbacks.onHover?.(null);
      }
    }
  }

  function onPointerLeave() {
    if (activeHoveredSlug !== null) {
      activeHoveredSlug = null;
      canvas.style.cursor = 'default';
      callbacks.onHover?.(null);
    }
  }

  function onClick(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(hitMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const slug = (hit.userData as { slug?: string }).slug;
      if (slug) {
        callbacks.onClick?.(slug);
      }
    }
  }

  canvas.addEventListener('mousemove', onPointerMove, { passive: true });
  canvas.addEventListener('mouseleave', onPointerLeave);
  canvas.addEventListener('click', onClick);

  // Resize handler with safety against NaN or 0 dimensions
  function handleResize() {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  handleResize();

  // Scroll Progress Updater
  function updateScroll(p: number) {
    const safeP = isNaN(p) ? 0 : Math.max(0, Math.min(1, p));

    const firstX = projects[0]?.worldX || 0;
    const lastX = projects[projects.length - 1]?.worldX || 0;
    targetCameraX = firstX + safeP * (lastX - firstX);

    // Track active district by nearest building
    const N = projects.length;
    if (N > 0) {
      const approximateIndex = Math.min(N - 1, Math.floor(safeP * N));
      const currentDistrict = projects[approximateIndex]?.district ?? 0;
      callbacks.onActiveDistrictChange?.(currentDistrict);
    }
  }

  // Animation Loop (Safe try/catch)
  function animate(now: number) {
    animationFrameId = requestAnimationFrame(animate);

    // Skip render if paused or document is hidden
    if (isScenePaused || (typeof document !== 'undefined' && document.hidden)) {
      return;
    }

    try {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      entranceTimer += dt;
      hookTime += dt;

      // Stagger entrance growth for buildings
      buildings.forEach((bld, idx) => {
        if (prefersReducedMotion) {
          bld.currentY = bld.targetY;
        } else {
          const delay = idx * staggerDelay;
          if (entranceTimer > delay) {
            bld.currentY += (bld.targetY - bld.currentY) * (1 - Math.exp(-dt * 9));
          }
        }

        // Hover elevation
        const isHovered = bld.slug === activeHoveredSlug;
        bld.targetY = isHovered ? 0.18 : 0;
        bld.group.position.y = bld.currentY;

        // Dimming if filtered out
        const isFilteredOut =
          (activeStatusFilter !== null && bld.project.status !== activeStatusFilter) ||
          (activeDistrictFilter !== null && bld.project.district !== activeDistrictFilter);

        bld.group.visible = true;
        // Adjust opacity / visual presence
        if (isFilteredOut) {
          bld.group.position.y = -0.4;
        }

        // Swaying crane hook
        if (bld.swayingHook && !prefersReducedMotion) {
          const sway = Math.sin(hookTime * 1.6 + idx) * 0.08;
          bld.swayingHook.rotation.z = sway;
        }
      });

      // Camera Follow Lerp
      if (prefersReducedMotion) {
        currentCameraX = targetCameraX;
      } else {
        currentCameraX += (targetCameraX - currentCameraX) * (1 - Math.exp(-dt * 6.5));
      }

      // Camera positioning based on viewport aspect
      const w = Math.max(1, host.clientWidth);
      const isWide = w > 900;

      if (isWide) {
        // Wide: text on left, city shifts right (lookAt shifted left)
        camera.position.set(currentCameraX + 7.0, 5.4, 19.0);
        camera.lookAt(currentCameraX - 2.8, 2.1, -1.0);
      } else {
        // Narrow (<=900px): text on top, city below, camera backs up
        camera.position.set(currentCameraX + 5.0, 8.0, 26.0);
        camera.lookAt(currentCameraX, 3.8, -1.0);
      }

      renderer.render(scene, camera);
    } catch (err) {
      console.warn('CityScene render loop caught error:', err);
    }
  }

  animationFrameId = requestAnimationFrame(animate);

  // Scroll threshold culling listener
  function checkScrollCull() {
    if (typeof window === 'undefined') return;
    const vh = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    isScenePaused = scrollY > 2.4 * vh;
  }
  window.addEventListener('scroll', checkScrollCull, { passive: true });

  function dispose() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('scroll', checkScrollCull);
    canvas.removeEventListener('mousemove', onPointerMove);
    canvas.removeEventListener('mouseleave', onPointerLeave);
    canvas.removeEventListener('click', onClick);

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
    updateScroll,
    setHoveredSlug: (slug) => {
      activeHoveredSlug = slug;
    },
    setStatusFilter: (status) => {
      activeStatusFilter = status;
    },
    setDistrictFilter: (district) => {
      activeDistrictFilter = district;
    },
    resize: handleResize,
    getRenderStats: () => ({
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      tier: options.qualityTier,
    }),
    dispose,
  };
}
