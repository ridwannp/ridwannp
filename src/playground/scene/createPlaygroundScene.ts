import * as THREE from 'three';
import { QualityGovernor } from './qualityGovernor';
import { POSES, ObjectPose, SceneObjectId, SectionPoseKey, interpolatePose } from './poses';
import { createLensa } from './objects/lensa';
import { createKartu } from './objects/kartu';
import { createKubus } from './objects/kubus';
import { createRodaGigi } from './objects/rodaGigi';
import { createTombolGeser } from './objects/tombolGeser';
import { createGelembungChat } from './objects/gelembungChat';
import { createDekorOkta } from './objects/dekorOkta';

export interface PlaygroundSceneInstance {
  update: (scrollProgress: number, activeCardIndex?: number) => void;
  resize: () => void;
  dispose: () => void;
  getQualityGovernor: () => QualityGovernor;
}

export function createPlaygroundScene(
  canvas: HTMLCanvasElement,
  onContextLost?: () => void
): PlaygroundSceneInstance | null {
  const governor = new QualityGovernor();
  if (governor.getTier() === 'off') {
    return null;
  }

  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;

  // 1. Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 0, 12);

  // 2. Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcfc5ad, 0.75);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(-5, 8, 6);
  scene.add(dirLight);

  // 3. Renderer
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  const config = governor.getConfig();
  renderer.setPixelRatio(config.pixelRatio);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);

  // 4. Build 3D Objects
  const objectsMap = new Map<SceneObjectId, THREE.Group>();
  const isPortrait = width < 768;

  const lensa = createLensa();
  const kartu1 = createKartu('kartu1', 0.5);
  const kartu2 = createKartu('kartu2', 0.8);
  const kartu3 = createKartu('kartu3', 1.1);
  const kubus = createKubus();
  const rodaGigi = createRodaGigi();
  const tombolGeser = createTombolGeser();
  const gelembungChat = createGelembungChat();
  const dekorOkta = createDekorOkta();

  const allObjects: { id: SceneObjectId; group: THREE.Group; minTier: number }[] = [
    { id: 'lensa', group: lensa, minTier: 1 },
    { id: 'kartu1', group: kartu1, minTier: 1 },
    { id: 'kartu2', group: kartu2, minTier: 1 },
    { id: 'kartu3', group: kartu3, minTier: 1 },
    { id: 'kubus', group: kubus, minTier: 2 },
    { id: 'rodaGigi', group: rodaGigi, minTier: 2 },
    { id: 'tombolGeser', group: tombolGeser, minTier: 2 },
    { id: 'gelembungChat', group: gelembungChat, minTier: 3 },
    { id: 'dekorOkta', group: dekorOkta, minTier: 3 },
  ];

  allObjects.forEach(({ id, group }) => {
    objectsMap.set(id, group);
    scene.add(group);
  });

  // 5. Pointer Parallax
  let targetPointerX = 0;
  let targetPointerY = 0;
  let currentPointerX = 0;
  let currentPointerY = 0;

  const isFinePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const onMouseMove = (e: MouseEvent) => {
    if (!governor.getConfig().enablePointerParallax || !isFinePointer) return;
    targetPointerX = ((e.clientX / window.innerWidth) * 2 - 1) * 0.4;
    targetPointerY = (-(e.clientY / window.innerHeight) * 2 + 1) * 0.4;
  };

  if (isFinePointer) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // 6. Context loss handling
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    if (onContextLost) onContextLost();
  };

  const handleContextRestored = () => {
    // Re-render
  };

  canvas.addEventListener('webglcontextlost', handleContextLost, false);
  canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

  // 7. Pose Evaluation
  const getSectionPose = (section: SectionPoseKey, objId: SceneObjectId): ObjectPose => {
    const layoutPoses = isPortrait ? POSES.portrait : POSES.desktop;
    return layoutPoses[section][objId];
  };

  let lastTime = performance.now();

  const update = (scrollProgress: number, activeCardIndex = 0) => {
    if (!renderer) return;

    const now = performance.now();
    const deltaMs = now - lastTime;
    lastTime = now;
    governor.recordFrame(deltaMs);

    // Camera dolly z: 12 -> 10.5
    camera.position.z = 12 - scrollProgress * 1.5;

    // Pointer parallax lerp 0.06
    if (governor.getConfig().enablePointerParallax) {
      currentPointerX += (targetPointerX - currentPointerX) * 0.06;
      currentPointerY += (targetPointerY - currentPointerY) * 0.06;
      camera.position.x = currentPointerX;
      camera.position.y = currentPointerY;
    }

    // Determine current section progress:
    // 0.0 - 0.33: hero -> discovery
    // 0.33 - 0.66: discovery -> produk
    // 0.66 - 1.0: produk -> penutup
    let poseAKey: SectionPoseKey = 'hero';
    let poseBKey: SectionPoseKey = 'discovery';
    let sectionProgress = 0;

    if (scrollProgress < 0.33) {
      poseAKey = 'hero';
      poseBKey = 'discovery';
      sectionProgress = scrollProgress / 0.33;
    } else if (scrollProgress < 0.66) {
      poseAKey = 'discovery';
      poseBKey = 'produk';
      sectionProgress = (scrollProgress - 0.33) / 0.33;
    } else {
      poseAKey = 'produk';
      poseBKey = 'penutup';
      sectionProgress = (scrollProgress - 0.66) / 0.34;
    }

    const t = now * 0.001;
    const enableIdle = governor.getConfig().enableIdleFloat;

    allObjects.forEach(({ id, group }, index) => {
      const poseA = getSectionPose(poseAKey, id);
      const poseB = getSectionPose(poseBKey, id);
      const pose = interpolatePose(poseA, poseB, sectionProgress);

      // Active card highlighting in Discovery stage
      if (
        scrollProgress >= 0.25 &&
        scrollProgress <= 0.65 &&
        (id === 'kartu1' || id === 'kartu2' || id === 'kartu3')
      ) {
        const cardNum = id === 'kartu1' ? 0 : id === 'kartu2' ? 1 : 2;
        if (cardNum === activeCardIndex) {
          pose.y += 0.25;
          pose.scale *= 1.15;
          pose.opacity = 1.0;
        } else {
          pose.opacity = 0.55;
        }
      }

      // Idle float: sin on y +-0.12 with phase
      const idleY = enableIdle ? Math.sin(t * 1.5 + index * 0.8) * 0.12 : 0;
      const idleRot = enableIdle ? Math.cos(t * 1.2 + index * 0.5) * 0.08 : 0;

      group.position.set(pose.x, pose.y + idleY, pose.z);
      group.rotation.set(pose.rotX, pose.rotY + idleRot, pose.rotZ);
      group.scale.setScalar(Math.max(0.001, pose.scale));

      // Update opacity for meshes
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.transparent = pose.opacity < 0.99;
              mat.opacity = pose.opacity;
            });
          } else if (mesh.material) {
            mesh.material.transparent = pose.opacity < 0.99;
            mesh.material.opacity = pose.opacity;
          }
        }
      });
    });

    renderer.render(scene, camera);
  };

  const resize = () => {
    if (!renderer) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  const dispose = () => {
    if (isFinePointer) {
      window.removeEventListener('mousemove', onMouseMove);
    }
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });

    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
  };

  return {
    update,
    resize,
    dispose,
    getQualityGovernor: () => governor,
  };
}

