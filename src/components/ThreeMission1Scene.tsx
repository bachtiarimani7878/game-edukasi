import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { WasteItem } from '../types/game';
import { HandLandmark, drawMediaPipeHand } from '../utils/realisticCanvasDraw';

export interface ThreeMission1SceneProps {
  currentItem: WasteItem | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  handState: {
    isDetected: boolean;
    isGrabbing: boolean;
    x: number;
    y: number;
    landmarks: HandLandmark[] | null;
  };
  onSortAttempt: (chosenBin: 'organik' | 'anorganik' | 'b3') => void;
  enteringAnim: {
    item: WasteItem;
    chosenBin: 'organik' | 'anorganik' | 'b3';
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    startTime: number;
    duration: number;
    isCorrect: boolean;
    hasImpacted: boolean;
  } | null;
}

/**
 * Three.js 3D Interactive Mission 1 Stage
 * Features:
 * - 3 Real Procedural 3D SNI Bins (Organik, Anorganik, B3) with 8+ distinct parts each:
 *   tapered outer hull, dark inner cavity liner, base, thick rim, 3D hinged opening lid,
 *   handles, rubber wheels, and procedural SNI 19-3983 badge textures.
 * - Procedural 3D Waste Items (Bottles, cans, batteries, apples, etc.).
 * - Natural 3D depth occlusion: items plunge inside the hollow bin and are occluded by the front wall!
 * - 3D particle bursts (leaves, gold stars, sparks) and expanding shockwave rings.
 * - Dual Control: Mouse/Touch 3D raycasting + MediaPipe Hands Pinch AR integration.
 */
export const ThreeMission1Scene: React.FC<ThreeMission1SceneProps> = ({
  currentItem,
  cameraActive,
  videoRef,
  handState,
  onSortAttempt,
  enteringAnim,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // References to communicate between React props and the Three.js animation loop
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    bins: {
      organik: THREE.Group;
      anorganik: THREE.Group;
      b3: THREE.Group;
    };
    binLidPivots: {
      organik: THREE.Group;
      anorganik: THREE.Group;
      b3: THREE.Group;
    };
    binSquish: {
      organik: number;
      anorganik: number;
      b3: number;
    };
    activeItemMesh: THREE.Group | null;
    particles: Array<{
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      vRot: THREE.Vector3;
      life: number;
      maxLife: number;
    }>;
    shockwaves: Array<{
      mesh: THREE.Mesh;
      radius: number;
      maxRadius: number;
      alpha: number;
    }>;
    videoTexture: THREE.VideoTexture | null;
    dragPlane: THREE.Plane;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    isDragging: boolean;
    itemWorldPos: THREE.Vector3;
    hoveredBin: 'organik' | 'anorganik' | 'b3' | null;
  } | null>(null);

  // Helper to create high-resolution procedural SNI 19-3983 Canvas Texture
  const createBinBadgeTexture = (type: 'organik' | 'anorganik' | 'b3'): THREE.CanvasTexture => {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 256;
    const ctx = cvs.getContext('2d')!;

    const config = {
      organik: {
        bg: '#042a1f',
        accent: '#10b981',
        border: '#34d399',
        icon: '🌱',
        title: 'ORGANIK',
        sub: 'Sisa Alam & Makanan',
      },
      anorganik: {
        bg: '#331703',
        accent: '#f59e0b',
        border: '#fbbf24',
        icon: '♻',
        title: 'ANORGANIK',
        sub: 'Plastik, Kertas, Logam',
      },
      b3: {
        bg: '#380a0a',
        accent: '#ef4444',
        border: '#f87171',
        icon: '☣',
        title: 'B3 BERACUN',
        sub: 'Baterai, Lampu, Racun',
      },
    }[type];

    // High tech plate
    ctx.fillStyle = config.bg;
    ctx.roundRect(10, 10, 492, 236, 16);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = config.border;
    ctx.stroke();

    // Inner glow border
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.strokeRect(20, 20, 472, 216);

    // Icon
    ctx.font = 'bold 58px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(config.icon, 256, 75);

    // Title
    ctx.font = '900 38px sans-serif';
    ctx.fillStyle = config.accent;
    ctx.fillText(config.title, 256, 128);

    // Standard Code
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('SNI 19-3983-1995', 256, 165);

    // Subtitle
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(config.sub, 256, 205);

    const texture = new THREE.CanvasTexture(cvs);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  // Build a realistic 3D SNI Bin with 8+ distinct geometric parts
  const buildRealistic3DBin = (type: 'organik' | 'anorganik' | 'b3') => {
    const group = new THREE.Group();

    const colors = {
      organik: { main: 0x047857, dark: 0x023b2b, rim: 0x10b981 },
      anorganik: { main: 0xd97706, dark: 0x663300, rim: 0xf59e0b },
      b3: { main: 0xb91c1c, dark: 0x550a0a, rim: 0xef4444 },
    }[type];

    // 1. Outer Tapered Bin Body (Open at top and bottom so it is genuinely hollow)
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.38, 1.05, 32, 1, true);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colors.main,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.FrontSide,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.525;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    // 2. Inner Hollow Liner (Dark interior with back-side rendering so items can be seen INSIDE!)
    const innerGeo = new THREE.CylinderGeometry(0.485, 0.37, 1.04, 32, 1, true);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x04080e,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.BackSide,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.position.y = 0.525;
    group.add(innerMesh);

    // 3. Interior Floor Disc
    const floorGeo = new THREE.CylinderGeometry(0.37, 0.37, 0.02, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x020406, roughness: 0.9 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = 0.01;
    group.add(floorMesh);

    // 4. Glossy Upper Rim Collar
    const rimGeo = new THREE.TorusGeometry(0.495, 0.038, 16, 32);
    const rimMat = new THREE.MeshStandardMaterial({
      color: colors.rim,
      roughness: 0.2,
      metalness: 0.15,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 1.05;
    group.add(rimMesh);

    // 5. 3D Hinged Opening Lid
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 1.05, -0.49); // Pivot along the back hinge axis

    // Lid disc slab
    const lidDiscGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.045, 32);
    const lidMat = new THREE.MeshStandardMaterial({
      color: colors.main,
      roughness: 0.3,
      metalness: 0.08,
    });
    const lidMesh = new THREE.Mesh(lidDiscGeo, lidMat);
    lidMesh.position.set(0, 0.025, 0.49); // centered forward from pivot
    lidMesh.castShadow = true;
    lidPivot.add(lidMesh);

    // Molded Handle on Top of Lid
    const handleGeo = new THREE.BoxGeometry(0.24, 0.04, 0.06);
    const handleMat = new THREE.MeshStandardMaterial({ color: colors.dark, roughness: 0.5 });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.set(0, 0.06, 0.49);
    lidPivot.add(handleMesh);

    // Hinge Brackets
    const hingeGeo = new THREE.BoxGeometry(0.06, 0.05, 0.06);
    const hingeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const h1 = new THREE.Mesh(hingeGeo, hingeMat);
    h1.position.set(-0.25, 0, 0);
    const h2 = new THREE.Mesh(hingeGeo, hingeMat);
    h2.position.set(0.25, 0, 0);
    lidPivot.add(h1);
    lidPivot.add(h2);

    group.add(lidPivot);

    // 6. Molded Side Grip Handles on Bin Hull
    const sideGripGeo = new THREE.BoxGeometry(0.08, 0.04, 0.14);
    const sideGripMat = new THREE.MeshStandardMaterial({ color: colors.dark, roughness: 0.4 });
    const gripL = new THREE.Mesh(sideGripGeo, sideGripMat);
    gripL.position.set(-0.51, 1.0, 0);
    const gripR = new THREE.Mesh(sideGripGeo, sideGripMat);
    gripR.position.set(0.51, 1.0, 0);
    group.add(gripL);
    group.add(gripR);

    // 7. Base Rubber Wheels & Front Foot Pads
    const wheelGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.04, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const wheelL = new THREE.Mesh(wheelGeo, wheelMat);
    wheelL.rotation.z = Math.PI / 2;
    wheelL.position.set(-0.35, 0.075, -0.32);
    const wheelR = new THREE.Mesh(wheelGeo, wheelMat);
    wheelR.rotation.z = Math.PI / 2;
    wheelR.position.set(0.35, 0.075, -0.32);
    group.add(wheelL);
    group.add(wheelR);

    // Front rubber stop pads
    const padGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const padL = new THREE.Mesh(padGeo, padMat);
    padL.position.set(-0.26, 0.03, 0.28);
    const padR = new THREE.Mesh(padGeo, padMat);
    padR.position.set(0.26, 0.03, 0.28);
    group.add(padL);
    group.add(padR);

    // 8. SNI 19-3983 Official Badge Plate Curved on Front
    const badgeTexture = createBinBadgeTexture(type);
    const badgeGeo = new THREE.PlaneGeometry(0.54, 0.28);
    const badgeMat = new THREE.MeshStandardMaterial({
      map: badgeTexture,
      transparent: true,
      roughness: 0.3,
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.58, 0.45);
    group.add(badgeMesh);

    // 9. Soft Ground Shadow Disc Beneath Bin
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const shadowCvs = document.createElement('canvas');
    shadowCvs.width = 128;
    shadowCvs.height = 128;
    const sCtx = shadowCvs.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    sGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.2)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCvs);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    group.add(shadowMesh);

    return { group, lidPivot };
  };

  // Build Procedural 3D Waste Items
  const buildProcedural3DWaste = (svgKey: string): THREE.Group => {
    const group = new THREE.Group();

    switch (svgKey) {
      case 'botol_plastik': {
        // Translucent PET plastic body
        const bodyGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.48, 20);
        const bodyMat = new THREE.MeshStandardMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: 0.65,
          roughness: 0.1,
          metalness: 0.05,
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);

        // Conical neck
        const neckGeo = new THREE.CylinderGeometry(0.06, 0.14, 0.15, 20);
        const neck = new THREE.Mesh(neckGeo, bodyMat);
        neck.position.y = 0.31;
        group.add(neck);

        // Blue cap
        const capGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.41;
        group.add(cap);

        // Green recycle label band
        const labelGeo = new THREE.CylinderGeometry(0.142, 0.142, 0.18, 20);
        const labelMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.y = -0.02;
        group.add(label);
        break;
      }

      case 'kaleng_aluminium': {
        // Metallic soda can
        const canGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 24);
        const canMat = new THREE.MeshStandardMaterial({
          color: 0xdc2626,
          metalness: 0.85,
          roughness: 0.2,
        });
        const can = new THREE.Mesh(canGeo, canMat);
        group.add(can);

        // Top aluminum lid
        const lidGeo = new THREE.CylinderGeometry(0.145, 0.145, 0.03, 24);
        const lidMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
        const lid = new THREE.Mesh(lidGeo, lidMat);
        lid.position.y = 0.255;
        group.add(lid);

        // Pop-tab
        const tabGeo = new THREE.BoxGeometry(0.08, 0.01, 0.04);
        const tab = new THREE.Mesh(tabGeo, lidMat);
        tab.position.set(0, 0.275, 0.03);
        group.add(tab);
        break;
      }

      case 'baterai_bekas': {
        // Duracell gold top
        const goldGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.16, 20);
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
        const gold = new THREE.Mesh(goldGeo, goldMat);
        gold.position.y = 0.16;
        group.add(gold);

        // Black body
        const blackGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.34, 20);
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
        const black = new THREE.Mesh(blackGeo, blackMat);
        black.position.y = -0.09;
        group.add(black);

        // Positive pole nub
        const nubGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16);
        const nub = new THREE.Mesh(nubGeo, goldMat);
        nub.position.y = 0.26;
        group.add(nub);
        break;
      }

      case 'kulit_pisang': {
        // 3 curving peel strips
        const peelMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
        for (let i = 0; i < 3; i++) {
          const ang = (i * Math.PI * 2) / 3;
          const stripGeo = new THREE.CylinderGeometry(0.03, 0.08, 0.42, 8);
          const strip = new THREE.Mesh(stripGeo, peelMat);
          strip.rotation.z = 0.55;
          strip.rotation.y = ang;
          strip.position.set(Math.cos(ang) * 0.1, -0.05, Math.sin(ang) * 0.1);
          group.add(strip);
        }
        // Brown crown tip
        const tipGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const tipMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.y = 0.16;
        group.add(tip);
        break;
      }

      case 'sisa_apel': {
        // Top and bottom red apple lobes
        const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.3 });
        const topLobe = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), redMat);
        topLobe.scale.set(1, 0.5, 1);
        topLobe.position.y = 0.14;
        group.add(topLobe);

        const btmLobe = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), redMat);
        btmLobe.scale.set(1, 0.45, 1);
        btmLobe.position.y = -0.14;
        group.add(btmLobe);

        // Core flesh
        const coreGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.26, 16);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.24;
        group.add(stem);
        break;
      }

      case 'bohlam_neon': {
        // Glass pear bulb
        const glassGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const glassMat = new THREE.MeshStandardMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.65,
          roughness: 0.1,
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.scale.set(1, 1.25, 1);
        glass.position.y = 0.08;
        group.add(glass);

        // Threaded base
        const socketGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.16, 16);
        const socketMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
        const socket = new THREE.Mesh(socketGeo, socketMat);
        socket.position.y = -0.16;
        group.add(socket);
        break;
      }

      case 'pestisida': {
        // Aerosol canister
        const canGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.52, 20);
        const canMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.35 });
        const can = new THREE.Mesh(canGeo, canMat);
        group.add(can);

        // Yellow hazard stripe
        const stripeGeo = new THREE.CylinderGeometry(0.132, 0.132, 0.15, 20);
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.y = 0.02;
        group.add(stripe);

        // Red spray nozzle
        const nozzleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
        const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
        const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
        nozzle.position.y = 0.3;
        group.add(nozzle);
        break;
      }

      default: {
        // Generic compostable/recyclable block
        const boxGeo = new THREE.BoxGeometry(0.26, 0.26, 0.26);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        group.add(box);
        break;
      }
    }

    return group;
  };

  // Setup Three.js Scene, Camera, Lighting, and Bins on Mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 760;
    const height = container.clientHeight || 480;

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.95, 4.8); // elevated angle with wide vertical clearance
    camera.lookAt(0, 0.20, 0);

    // 3. Lighting Rig
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
    dirLight.position.set(3, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // 4. Floor Plane (Shadow receiver)
    const floorGeo = new THREE.PlaneGeometry(14, 8);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.95;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 5. Build 3 Procedural SNI Bins (Positioned comfortably at bottom)
    const bOrganik = buildRealistic3DBin('organik');
    bOrganik.group.position.set(-1.45, -0.95, 0);
    scene.add(bOrganik.group);

    const bAnorganik = buildRealistic3DBin('anorganik');
    bAnorganik.group.position.set(0, -0.95, 0);
    scene.add(bAnorganik.group);

    const bB3 = buildRealistic3DBin('b3');
    bB3.group.position.set(1.45, -0.95, 0);
    scene.add(bB3.group);

    // Raycasting & Drag plane at Z = 0
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      bins: {
        organik: bOrganik.group,
        anorganik: bAnorganik.group,
        b3: bB3.group,
      },
      binLidPivots: {
        organik: bOrganik.lidPivot,
        anorganik: bAnorganik.lidPivot,
        b3: bB3.lidPivot,
      },
      binSquish: {
        organik: 0,
        anorganik: 0,
        b3: 0,
      },
      activeItemMesh: null,
      particles: [],
      shockwaves: [],
      videoTexture: null,
      dragPlane,
      raycaster,
      mouse,
      isDragging: false,
      itemWorldPos: new THREE.Vector3(0, 1.35, 0),
      hoveredBin: null,
    };

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Current Waste Item 3D Mesh
  useEffect(() => {
    const s = sceneRef.current;
    if (!s || !currentItem) return;

    if (s.activeItemMesh) {
      s.scene.remove(s.activeItemMesh);
      s.activeItemMesh = null;
    }

    const mesh = buildProcedural3DWaste(currentItem.svgKey);
    mesh.position.copy(s.itemWorldPos);
    s.scene.add(mesh);
    s.activeItemMesh = mesh;
  }, [currentItem]);

  // Video Texture Background when AR Camera is active
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;

    if (cameraActive && videoRef.current) {
      if (!s.videoTexture) {
        const tex = new THREE.VideoTexture(videoRef.current);
        tex.colorSpace = THREE.SRGBColorSpace;
        s.videoTexture = tex;
      }
      s.scene.background = s.videoTexture;
    } else {
      s.scene.background = null; // transparent to show sci-fi eco-lab background
    }
  }, [cameraActive, videoRef]);

  // Trigger Burst Effect Helper in 3D
  const trigger3DBurst = (binType: 'organik' | 'anorganik' | 'b3', mouthPos: THREE.Vector3) => {
    const s = sceneRef.current;
    if (!s) return;

    const colors = {
      organik: [0x34d399, 0x10b981, 0x059669],
      anorganik: [0xfbbf24, 0xf59e0b, 0xd97706],
      b3: [0xf87171, 0xef4444, 0xdc2626],
    }[binType];

    // 25 Burst Particles in 3D
    for (let i = 0; i < 25; i++) {
      const pGeo =
        binType === 'organik'
          ? new THREE.PlaneGeometry(0.08, 0.04)
          : new THREE.SphereGeometry(0.035, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide,
        transparent: true,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(mouthPos);

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 2.8;
      const vel = new THREE.Vector3(
        Math.cos(angle) * (0.8 + Math.random() * 0.8),
        speed,
        Math.sin(angle) * (0.8 + Math.random() * 0.8)
      );
      const vRot = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

      s.scene.add(pMesh);
      s.particles.push({ mesh: pMesh, vel, vRot, life: 1.0, maxLife: 1.0 });
    }

    // 3D Expanding Shockwave Ring
    const ringGeo = new THREE.TorusGeometry(0.48, 0.025, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colors[0],
      transparent: true,
      opacity: 0.95,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.copy(mouthPos);
    s.scene.add(ringMesh);
    s.shockwaves.push({ mesh: ringMesh, radius: 0.48, maxRadius: 1.25, alpha: 0.95 });
  };

  // Main 3D Animation & Render Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const s = sceneRef.current;
      if (!s) return;

      const now = performance.now();
      const dt = 0.016; // ~60fps step

      // 1. Dual Control with MediaPipe Hands
      if (cameraActive && handState.isDetected) {
        // Map normalized hand coords (mirrored horizontal) to 3D space
        const ndcX = (1 - handState.x) * 2 - 1;
        const ndcY = -(handState.y * 2 - 1);

        s.mouse.set(ndcX, ndcY);
        s.raycaster.setFromCamera(s.mouse, s.camera);
        const hitPoint = new THREE.Vector3();
        s.raycaster.ray.intersectPlane(s.dragPlane, hitPoint);

        if (handState.isGrabbing && !s.isDragging && !enteringAnim) {
          const dHandItem = hitPoint.distanceTo(s.itemWorldPos);
          if (dHandItem < 0.95) {
            s.isDragging = true;
          }
        }

        if (s.isDragging && handState.isGrabbing && !enteringAnim) {
          s.itemWorldPos.lerp(hitPoint, 0.4);
        }

        // Release check
        if (s.isDragging && !handState.isGrabbing && !enteringAnim) {
          s.isDragging = false;
          if (s.itemWorldPos.y < 0.45) {
            if (s.itemWorldPos.x < -0.7) onSortAttempt('organik');
            else if (s.itemWorldPos.x < 0.7) onSortAttempt('anorganik');
            else onSortAttempt('b3');
          } else {
            s.itemWorldPos.set(0, 1.35, 0);
          }
        }
      }

      // 2. Hover detection over bins
      let hovered: 'organik' | 'anorganik' | 'b3' | null = null;
      if (s.isDragging) {
        if (s.itemWorldPos.x < -0.7) hovered = 'organik';
        else if (s.itemWorldPos.x < 0.7) hovered = 'anorganik';
        else hovered = 'b3';
      }
      s.hoveredBin = hovered;

      // 3. Update Bins Dynamics (Lid rotation & spring squish rebound)
      (['organik', 'anorganik', 'b3'] as const).forEach((type) => {
        const lidPivot = s.binLidPivots[type];
        const isEnteringThis = enteringAnim?.chosenBin === type;
        const targetLidAngle = isEnteringThis ? -1.25 : hovered === type ? -0.45 : -0.05;

        // Smooth lid open/close swing
        lidPivot.rotation.x += (targetLidAngle - lidPivot.rotation.x) * 0.16;

        // Squish damping
        if (s.binSquish[type] > 0.01) {
          s.binSquish[type] *= 0.84;
        } else {
          s.binSquish[type] = 0;
        }

        const osc = Math.sin(now / 35) * (s.binSquish[type] * 0.22);
        s.bins[type].scale.set(1.0 + osc * 0.8, 1.0 - osc, 1.0 + osc * 0.8);
      });

      // 4. Update Waste Item (Idle bobbing vs 3D Entering Animation)
      if (s.activeItemMesh) {
        if (enteringAnim) {
          const elapsed = now - enteringAnim.startTime;
          const t = Math.max(0, Math.min(1, elapsed / enteringAnim.duration));

          const targetBinX =
            enteringAnim.chosenBin === 'organik'
              ? -1.45
              : enteringAnim.chosenBin === 'anorganik'
              ? 0
              : 1.45;
          const targetMouthY = 0.12; // Top rim of the 3D bin lowered for comfortable reach

          if (t < 0.52) {
            // PHASE 1: Suction trajectory into 3D mouth
            const arcT = t / 0.52;
            const easeT = arcT * arcT;
            const curX = THREE.MathUtils.lerp(s.itemWorldPos.x, targetBinX, easeT);
            const linearY = THREE.MathUtils.lerp(s.itemWorldPos.y, targetMouthY, easeT);
            const arcH = Math.sin(arcT * Math.PI) * 0.35;
            const curY = linearY + arcH;

            s.activeItemMesh.position.set(curX, curY, 0);
            s.activeItemMesh.rotation.x += dt * 8;
            s.activeItemMesh.rotation.y += dt * 10;
            s.activeItemMesh.rotation.z += dt * 6;
            const curScale = 1.0 - easeT * 0.25;
            s.activeItemMesh.scale.set(curScale, curScale, curScale);
          } else {
            // IMPACT EVENT
            if (!enteringAnim.hasImpacted) {
              enteringAnim.hasImpacted = true;
              s.binSquish[enteringAnim.chosenBin] = 1.0;
              trigger3DBurst(
                enteringAnim.chosenBin,
                new THREE.Vector3(targetBinX, targetMouthY, 0)
              );
            }

            // PHASE 2: SINKING DOWN INSIDE THE HOLLOW 3D CAVITY
            // (True 3D Occlusion: Front wall of the bin geometry naturally occludes the item!)
            const deepT = (t - 0.52) / 0.48;
            const plungeY = targetMouthY - deepT * 0.70; // plunges straight down inside the cylinder
            const scaleDown = 0.75 * (1.0 - deepT * 0.85);

            s.activeItemMesh.position.set(targetBinX, plungeY, 0);
            s.activeItemMesh.rotation.x += dt * 14;
            s.activeItemMesh.rotation.y += dt * 16;
            s.activeItemMesh.scale.set(scaleDown, scaleDown, scaleDown);
          }
        } else {
          // Idle floating bobbing high above bins
          if (!s.isDragging) {
            s.itemWorldPos.y = 1.35 + Math.sin(now / 400) * 0.05;
            s.activeItemMesh.rotation.y += dt * 1.2;
            s.activeItemMesh.rotation.x = Math.sin(now / 600) * 0.15;
          }
          s.activeItemMesh.position.copy(s.itemWorldPos);
        }
      }

      // 5. Update 3D Particles
      const nextParticles = [];
      for (const p of s.particles) {
        p.mesh.position.addScaledVector(p.vel, dt);
        p.vel.y -= 9.8 * dt * 0.45; // gravity
        p.mesh.rotation.x += p.vRot.x * dt;
        p.mesh.rotation.y += p.vRot.y * dt;
        p.life -= dt * 1.5;

        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, p.life);

        if (p.life > 0) {
          nextParticles.push(p);
        } else {
          s.scene.remove(p.mesh);
        }
      }
      s.particles = nextParticles;

      // 6. Update 3D Shockwaves
      const nextShockwaves = [];
      for (const sw of s.shockwaves) {
        sw.radius += 0.85 * dt;
        sw.alpha -= dt * 1.6;
        const scale = sw.radius / 0.48;
        sw.mesh.scale.set(scale, scale, 1);
        const mat = sw.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, sw.alpha);

        if (sw.alpha > 0 && sw.radius < sw.maxRadius) {
          nextShockwaves.push(sw);
        } else {
          s.scene.remove(sw.mesh);
        }
      }
      s.shockwaves = nextShockwaves;

      // 7. Render Three.js Scene
      s.renderer.render(s.scene, s.camera);

      // 8. Render 2D MediaPipe AR Hands Skeleton on Overlay Canvas
      const overlayCvs = overlayCanvasRef.current;
      if (overlayCvs) {
        const oCtx = overlayCvs.getContext('2d');
        if (oCtx) {
          oCtx.clearRect(0, 0, overlayCvs.width, overlayCvs.height);
          if (cameraActive && handState.landmarks) {
            drawMediaPipeHand(
              oCtx,
              handState.landmarks,
              handState.isGrabbing,
              overlayCvs.width,
              overlayCvs.height,
              true
            );
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cameraActive, handState, enteringAnim, onSortAttempt]);

  // Pointer Interaction Handlers for Three.js Viewport
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sceneRef.current;
    const container = containerRef.current;
    if (!s || !container || enteringAnim) return;

    const rect = container.getBoundingClientRect();
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    s.mouse.set(ndcX, ndcY);
    s.raycaster.setFromCamera(s.mouse, s.camera);
    const hitPoint = new THREE.Vector3();
    s.raycaster.ray.intersectPlane(s.dragPlane, hitPoint);

    // Check click near item (ample ergonomic grab radius)
    if (hitPoint.distanceTo(s.itemWorldPos) < 0.95) {
      s.isDragging = true;
    }

    // Check direct click on bins at the bottom
    if (hitPoint.y < 0.18) {
      if (hitPoint.x < -0.7) onSortAttempt('organik');
      else if (hitPoint.x < 0.7) onSortAttempt('anorganik');
      else onSortAttempt('b3');
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sceneRef.current;
    const container = containerRef.current;
    if (!s || !container || enteringAnim) return;

    const rect = container.getBoundingClientRect();
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (s.isDragging) {
      s.mouse.set(ndcX, ndcY);
      s.raycaster.setFromCamera(s.mouse, s.camera);
      const hitPoint = new THREE.Vector3();
      s.raycaster.ray.intersectPlane(s.dragPlane, hitPoint);
      s.itemWorldPos.copy(hitPoint);
    }
  };

  const handlePointerUp = () => {
    const s = sceneRef.current;
    if (!s || enteringAnim) return;

    if (s.isDragging) {
      s.isDragging = false;
      if (s.itemWorldPos.y < 0.45) {
        if (s.itemWorldPos.x < -0.7) onSortAttempt('organik');
        else if (s.itemWorldPos.x < 0.7) onSortAttempt('anorganik');
        else onSortAttempt('b3');
      } else {
        s.itemWorldPos.set(0, 1.35, 0);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden"
    >
      {/* 2D Overlay Canvas for MediaPipe Holographic Bones & HUD labels */}
      <canvas
        ref={overlayCanvasRef}
        width={760}
        height={480}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
};
