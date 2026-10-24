/**
 * High-Fidelity Realistic Canvas 2D Renderers
 * Provides realistic textures, lighting, shadows, and anatomical details
 * for Waste Items, SNI Bins, Forestry Plants, Symptoms, Tools, and MediaPipe Hands.
 */

export interface HandLandmark {
  x: number;
  y: number;
  z?: number;
}

// MediaPipe Hand 21 Connections
export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],// Ring
  [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [0, 17],                              // Palm base
];

/**
 * Draws MediaPipe Hand Landmark skeleton, neon holographic connections, and pinch reticle.
 */
export function drawMediaPipeHand(
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmark[],
  isGrabbing: boolean,
  canvasWidth: number,
  canvasHeight: number,
  mirrored: boolean = true
) {
  if (!landmarks || landmarks.length < 21) return;

  const toScreen = (lm: HandLandmark) => {
    const x = mirrored ? (1 - lm.x) * canvasWidth : lm.x * canvasWidth;
    const y = lm.y * canvasHeight;
    return { x, y };
  };

  ctx.save();

  // 1. Draw glowing holographic bones
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.shadowColor = isGrabbing ? '#fbbf24' : '#10b981';
  ctx.shadowBlur = 10;
  ctx.strokeStyle = isGrabbing ? 'rgba(251, 191, 36, 0.85)' : 'rgba(16, 185, 129, 0.75)';

  for (const [start, end] of HAND_CONNECTIONS) {
    const p1 = toScreen(landmarks[start]);
    const p2 = toScreen(landmarks[end]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // 2. Draw glowing joints
  for (let i = 0; i < landmarks.length; i++) {
    const p = toScreen(landmarks[i]);
    const isFingertip = [4, 8, 12, 16, 20].includes(i);
    const radius = isFingertip ? (i === 4 || i === 8 ? 6 : 4.5) : 3.5;

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = isFingertip
      ? (isGrabbing ? '#fef08a' : '#67e8f9')
      : (isGrabbing ? '#f59e0b' : '#34d399');
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  // 3. Pinch Reticle between Thumb (4) and Index (8)
  const pThumb = toScreen(landmarks[4]);
  const pIndex = toScreen(landmarks[8]);
  const midX = (pThumb.x + pIndex.x) / 2;
  const midY = (pThumb.y + pIndex.y) / 2;

  // Connecting laser between thumb and index
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = isGrabbing ? '#f59e0b' : '#06b6d4';
  ctx.moveTo(pThumb.x, pThumb.y);
  ctx.lineTo(pIndex.x, pIndex.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Holographic reticle circle
  const reticleRadius = isGrabbing ? 22 : 16;
  ctx.beginPath();
  ctx.arc(midX, midY, reticleRadius, 0, Math.PI * 2);
  ctx.lineWidth = isGrabbing ? 3 : 2;
  ctx.strokeStyle = isGrabbing ? '#f59e0b' : '#10b981';
  ctx.stroke();

  if (isGrabbing) {
    // Pulsing locked grab circle
    ctx.beginPath();
    ctx.arc(midX, midY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Text badge "JEPIT AKTIF"
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText('✊ JEPIT AKTIF (GRAB)', midX, midY - 26);
  } else {
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'center';
    ctx.fillText('Jepit Telunjuk & Jempol', midX, midY - 20);
  }

  ctx.restore();
}

/**
 * Realistic Waste Item Renderers with depth, lighting, and textures
 */
export function drawRealisticWasteItem(
  ctx: CanvasRenderingContext2D,
  svgKey: string,
  x: number,
  y: number,
  size: number = 90
) {
  ctx.save();
  ctx.translate(x, y);

  // Soft drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 8;

  switch (svgKey) {
    case 'kulit_pisang':
      drawRealisticBananaPeel(ctx, size);
      break;
    case 'sisa_apel':
      drawRealisticAppleCore(ctx, size);
      break;
    case 'daun_kering':
      drawRealisticDryLeaf(ctx, size);
      break;
    case 'botol_plastik':
      drawRealisticPlasticBottle(ctx, size);
      break;
    case 'kaleng_aluminium':
      drawRealisticSodaCan(ctx, size);
      break;
    case 'kardus_koran':
      drawRealisticCardboard(ctx, size);
      break;
    case 'baterai_bekas':
      drawRealisticBattery(ctx, size);
      break;
    case 'bohlam_neon':
      drawRealisticNeonBulb(ctx, size);
      break;
    case 'pestisida':
      drawRealisticPesticideCan(ctx, size);
      break;
    default:
      drawGenericRealisticWaste(ctx, size);
      break;
  }

  ctx.restore();
}

// 1. Realistic Banana Peel
function drawRealisticBananaPeel(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Banana stem
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.roundRect(-8, -42, 16, 12, 3);
  ctx.fill();

  // Peel 1 (Left curl)
  const gradLeft = ctx.createLinearGradient(-35, -30, -5, 35);
  gradLeft.addColorStop(0, '#fef08a');
  gradLeft.addColorStop(0.5, '#eab308');
  gradLeft.addColorStop(1, '#ca8a04');
  ctx.fillStyle = gradLeft;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.bezierCurveTo(-30, -20, -50, 10, -38, 38);
  ctx.bezierCurveTo(-26, 26, -10, 0, 0, -32);
  ctx.fill();
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Peel 2 (Center curl)
  const gradCenter = ctx.createLinearGradient(0, -30, 0, 45);
  gradCenter.addColorStop(0, '#fef9c3');
  gradCenter.addColorStop(0.4, '#facc15');
  gradCenter.addColorStop(1, '#854d0e');
  ctx.fillStyle = gradCenter;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.bezierCurveTo(-15, -10, -18, 25, 0, 44);
  ctx.bezierCurveTo(18, 25, 15, -10, 0, -32);
  ctx.fill();
  ctx.stroke();

  // Peel 3 (Right curl)
  const gradRight = ctx.createLinearGradient(35, -30, 5, 35);
  gradRight.addColorStop(0, '#fef08a');
  gradRight.addColorStop(0.5, '#eab308');
  gradRight.addColorStop(1, '#ca8a04');
  ctx.fillStyle = gradRight;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.bezierCurveTo(30, -20, 50, 10, 38, 38);
  ctx.bezierCurveTo(26, 26, 10, 0, 0, -32);
  ctx.fill();
  ctx.stroke();

  // Brown ripe flecks
  ctx.fillStyle = '#713f12';
  for (const [bx, by, r] of [
    [-18, 12, 2.5], [20, 16, 2], [2, 18, 3], [-5, 30, 2], [25, 28, 2.5], [-28, 20, 1.8]
  ]) {
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 2. Realistic Apple Core
function drawRealisticAppleCore(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Woody curved stem
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(0, -36);
  ctx.quadraticCurveTo(8, -48, 14, -45);
  ctx.stroke();

  // Green leaf on stem
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(8, -43, 7, 3, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Top apple red flesh
  const redGradTop = ctx.createRadialGradient(0, -26, 5, 0, -26, 32);
  redGradTop.addColorStop(0, '#ef4444');
  redGradTop.addColorStop(1, '#991b1b');
  ctx.fillStyle = redGradTop;
  ctx.beginPath();
  ctx.ellipse(0, -26, 30, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bottom apple red flesh
  const redGradBottom = ctx.createRadialGradient(0, 28, 5, 0, 28, 28);
  redGradBottom.addColorStop(0, '#ef4444');
  redGradBottom.addColorStop(1, '#991b1b');
  ctx.fillStyle = redGradBottom;
  ctx.beginPath();
  ctx.ellipse(0, 28, 26, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Core flesh (oxidized cream/brown)
  const coreGrad = ctx.createLinearGradient(-14, 0, 14, 0);
  coreGrad.addColorStop(0, '#fef3c7');
  coreGrad.addColorStop(0.5, '#fde68a');
  coreGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.moveTo(-16, -26);
  ctx.bezierCurveTo(-5, -10, -5, 10, -14, 28);
  ctx.lineTo(14, 28);
  ctx.bezierCurveTo(5, 10, 5, -10, 16, -26);
  ctx.closePath();
  ctx.fill();

  // Dark brown seeds
  ctx.fillStyle = '#291305';
  ctx.beginPath();
  ctx.ellipse(-4, 0, 3, 5, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4, 5, 3, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

// 3. Realistic Dry Leaf
function drawRealisticDryLeaf(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Autumn dried gradient
  const leafGrad = ctx.createLinearGradient(-30, -35, 30, 35);
  leafGrad.addColorStop(0, '#b45309');
  leafGrad.addColorStop(0.35, '#d97706');
  leafGrad.addColorStop(0.7, '#92400e');
  leafGrad.addColorStop(1, '#78350f');

  ctx.fillStyle = leafGrad;
  ctx.beginPath();
  ctx.moveTo(0, -42);
  ctx.bezierCurveTo(-35, -25, -42, 10, -18, 38);
  ctx.quadraticCurveTo(0, 44, 4, 46);
  ctx.quadraticCurveTo(10, 42, 18, 36);
  ctx.bezierCurveTo(42, 12, 35, -25, 0, -42);
  ctx.fill();
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Central vein & branch veins
  ctx.strokeStyle = 'rgba(69, 26, 3, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -40);
  ctx.quadraticCurveTo(0, 0, 4, 48);
  ctx.stroke();

  ctx.lineWidth = 1.2;
  const leafVeins: [number, boolean][] = [
    [-25, true],
    [-20, false],
    [-10, true],
    [-5, false],
    [8, true],
    [12, false],
    [24, true],
  ];
  for (const [vy, left] of leafVeins) {
    ctx.beginPath();
    ctx.moveTo(left ? 0 : 2, vy);
    ctx.lineTo(left ? -22 : 22, vy - 10);
    ctx.stroke();
  }
}

// 4. Realistic PET Plastic Bottle
function drawRealisticPlasticBottle(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Blue cap
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.roundRect(-9, -46, 18, 9, 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-8, -44, 4, 5);

  // Bottle neck
  ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
  ctx.beginPath();
  ctx.moveTo(-6, -37);
  ctx.lineTo(6, -37);
  ctx.lineTo(14, -22);
  ctx.lineTo(-14, -22);
  ctx.closePath();
  ctx.fill();

  // Bottle body (translucent PET with cyan light reflections)
  const bodyGrad = ctx.createLinearGradient(-18, 0, 18, 0);
  bodyGrad.addColorStop(0, 'rgba(186, 230, 253, 0.65)');
  bodyGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
  bodyGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.45)');
  bodyGrad.addColorStop(0.85, 'rgba(125, 211, 252, 0.75)');
  bodyGrad.addColorStop(1, 'rgba(56, 189, 248, 0.85)');

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-17, -22, 34, 62, [3, 3, 7, 7]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Embossed ribs for grip
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  for (const ry of [-10, 0, 10, 20]) {
    ctx.beginPath();
    ctx.moveTo(-13, ry);
    ctx.lineTo(13, ry);
    ctx.stroke();
  }

  // Label with recycling symbol
  ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
  ctx.fillRect(-16, -2, 32, 14);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PET 1 ♻', 0, 8);
}

// 5. Realistic Soda Can (Aluminium)
function drawRealisticSodaCan(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Top metallic rim
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.ellipse(0, -32, 18, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pop-tab ring
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.ellipse(0, -32, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.stroke();

  // Cylindrical metallic gradient body
  const canGrad = ctx.createLinearGradient(-18, 0, 18, 0);
  canGrad.addColorStop(0, '#b91c1c');
  canGrad.addColorStop(0.25, '#ef4444');
  canGrad.addColorStop(0.5, '#ffffff'); // bright light sheen
  canGrad.addColorStop(0.7, '#dc2626');
  canGrad.addColorStop(1, '#7f1d1d');

  ctx.fillStyle = canGrad;
  ctx.beginPath();
  ctx.roundRect(-18, -32, 36, 64, [3, 3, 6, 6]);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Silver aluminum strip & recycle text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(-18, -10, 36, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ALU 100%', 0, 2);
}

// 6. Realistic Cardboard Box
function drawRealisticCardboard(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Corrugated brown box texture
  const boxGrad = ctx.createLinearGradient(-30, -30, 30, 30);
  boxGrad.addColorStop(0, '#d97706');
  boxGrad.addColorStop(0.5, '#b45309');
  boxGrad.addColorStop(1, '#92400e');

  ctx.fillStyle = boxGrad;
  ctx.beginPath();
  ctx.roundRect(-28, -26, 56, 52, 4);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fluted corrugated edge top
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(-26, -26, 52, 6);

  // Brown sealing tape across box
  ctx.fillStyle = 'rgba(120, 53, 15, 0.45)';
  ctx.fillRect(-8, -26, 16, 52);

  // Recycle symbol on box
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📦 ♻', 0, 10);
}

// 7. Realistic Battery
function drawRealisticBattery(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Positive terminal (+) nipple
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-5, -42, 10, 7);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(-5, -42, 10, 7);

  // Gold top band (Duracell style)
  const goldGrad = ctx.createLinearGradient(-15, 0, 15, 0);
  goldGrad.addColorStop(0, '#b45309');
  goldGrad.addColorStop(0.3, '#fde047');
  goldGrad.addColorStop(0.7, '#d97706');
  goldGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = goldGrad;
  ctx.fillRect(-15, -35, 30, 20);

  // Black bottom body
  const blackGrad = ctx.createLinearGradient(-15, 0, 15, 0);
  blackGrad.addColorStop(0, '#1e293b');
  blackGrad.addColorStop(0.4, '#475569');
  blackGrad.addColorStop(0.7, '#1e293b');
  blackGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = blackGrad;
  ctx.fillRect(-15, -15, 30, 48);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, -35, 30, 68);

  // Danger B3 symbol
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ B3', 0, 12);
}

// 8. Realistic Neon Bulb (Broken)
function drawRealisticNeonBulb(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Metal threaded screw socket
  const socketGrad = ctx.createLinearGradient(-10, 0, 10, 0);
  socketGrad.addColorStop(0, '#64748b');
  socketGrad.addColorStop(0.5, '#cbd5e1');
  socketGrad.addColorStop(1, '#475569');
  ctx.fillStyle = socketGrad;
  ctx.fillRect(-11, 16, 22, 18);

  // Thread ridges
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  for (const ty of [20, 25, 30]) {
    ctx.beginPath();
    ctx.moveTo(-11, ty);
    ctx.lineTo(11, ty);
    ctx.stroke();
  }

  // Translucent glass pear bulb
  const glassGrad = ctx.createRadialGradient(-6, -14, 4, 0, -10, 30);
  glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  glassGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.5)');
  glassGrad.addColorStop(1, 'rgba(186, 230, 253, 0.25)');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.arc(0, -12, 26, 0.6, Math.PI - 0.6, true);
  ctx.lineTo(11, 16);
  ctx.lineTo(-11, 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Fracture crack lines (broken glass)
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-14, -22);
  ctx.lineTo(-2, -10);
  ctx.lineTo(12, -14);
  ctx.lineTo(4, 4);
  ctx.lineTo(-6, 12);
  ctx.stroke();

  // Toxic mercury symbol
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('☠ Hg', 0, -8);
}

// 9. Realistic Pesticide Can
function drawRealisticPesticideCan(ctx: CanvasRenderingContext2D, s: number) {
  const scale = s / 100;
  ctx.scale(scale, scale);

  // Red spray nozzle button
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.roundRect(-6, -45, 12, 10, 2);
  ctx.fill();

  // Metallic aerosol body
  const canGrad = ctx.createLinearGradient(-17, 0, 17, 0);
  canGrad.addColorStop(0, '#065f46');
  canGrad.addColorStop(0.3, '#34d399');
  canGrad.addColorStop(0.6, '#059669');
  canGrad.addColorStop(1, '#022c22');
  ctx.fillStyle = canGrad;
  ctx.beginPath();
  ctx.roundRect(-17, -35, 34, 68, [4, 4, 6, 6]);
  ctx.fill();
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Yellow hazard stripe
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-17, -8, 34, 18);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('☣ RACUN', 0, 5);
}

function drawGenericRealisticWaste(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(0, 0, s / 3, 0, Math.PI * 2);
  ctx.fill();
}

export interface BinRenderOptions {
  isHovered?: boolean;
  lidOpen?: number;       // 0 = closed, 1 = open / tilted back
  bounceX?: number;       // spring horizontal stretch (defaults 1)
  bounceY?: number;       // spring vertical squash (defaults 1)
  layer?: 'all' | 'back' | 'front';
}

export interface EcoSplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rotation: number;
  vRot: number;
  color: string;
  type: 'leaf' | 'star' | 'spark' | 'bubble';
}

export interface FloatingScorePopup {
  x: number;
  y: number;
  text: string;
  subtext?: string;
  color: string;
  alpha: number;
  scale: number;
}

/**
 * Realistic SNI Bins (Organik, Anorganik, B3) with 3D Layered Depth
 * Supports multi-pass rendering:
 * 1. 'back': Ground shadow, tilted open lid, and dark inner cavity mouth.
 * 2. 'front': Front rim lip, glossy highlight, cylindrical tapered hull, SNI badge, handles.
 * Items falling into the bin are rendered between 'back' and 'front' for true 3D occlusion!
 */
export function drawRealisticSniBin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  type: 'organik' | 'anorganik' | 'b3',
  options: boolean | BinRenderOptions = false,
  explicitLayer?: 'all' | 'back' | 'front'
) {
  const opts: BinRenderOptions =
    typeof options === 'boolean'
      ? { isHovered: options, layer: explicitLayer || 'all' }
      : { ...options, layer: explicitLayer || options.layer || 'all' };

  const {
    isHovered = false,
    lidOpen = 0,
    bounceX = 1.0,
    bounceY = 1.0,
    layer = 'all',
  } = opts;

  const colors = {
    organik: {
      main: '#047857',
      light: '#10b981',
      dark: '#064e3b',
      border: '#34d399',
      glow: 'rgba(52, 211, 153, 0.7)',
      label: 'ORGANIK',
      icon: '🌱',
      sub: 'Sisa Alam & Makanan',
    },
    anorganik: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#78350f',
      border: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.7)',
      label: 'ANORGANIK',
      icon: '♻',
      sub: 'Plastik, Kertas, Logam',
    },
    b3: {
      main: '#b91c1c',
      light: '#ef4444',
      dark: '#7f1d1d',
      border: '#f87171',
      glow: 'rgba(248, 113, 113, 0.7)',
      label: 'B3 BERACUN',
      icon: '☣',
      sub: 'Baterai, Lampu, Racun',
    },
  }[type];

  const w = width;
  const h = height;
  const rx = w / 2;
  const ry = 14;
  const rxBase = w * 0.38;
  const yRim = -h / 2 + 12;
  const yBase = h / 2 - 4;

  // ==========================================
  // LAYER 1: BACK (Cavity, Shadow, Open Lid)
  // ==========================================
  if (layer === 'back' || layer === 'all') {
    ctx.save();
    ctx.translate(x, y);

    // Apply squash & bounce around bottom ground base
    ctx.translate(0, yBase);
    ctx.scale(bounceX, bounceY);
    ctx.translate(0, -yBase);

    // 1. Floor Ground Ambient Occlusion Shadow
    ctx.beginPath();
    ctx.ellipse(0, yBase + 4, rxBase * 1.35 * bounceX, 9, 0, 0, Math.PI * 2);
    const groundShadow = ctx.createRadialGradient(0, yBase + 4, 4, 0, yBase + 4, rxBase * 1.35);
    groundShadow.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    groundShadow.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
    groundShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = groundShadow;
    ctx.fill();

    // 2. Back Hinges
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-w * 0.26 - 4, yRim - ry - 4, 8, 7);
    ctx.fillRect(w * 0.26 - 4, yRim - ry - 4, 8, 7);

    // 3. 3D Tilted Open Lid (Reveals mouth cavity when hovered or dropped)
    const effectiveLid = Math.max(0, Math.min(1, lidOpen + (isHovered ? 0.35 : 0)));
    if (effectiveLid > 0.05) {
      const lidLift = effectiveLid * 26;
      const lidH = ry * 2.2 * (1 - effectiveLid * 0.25);

      ctx.save();
      ctx.translate(0, yRim - ry);
      // Perspective tilt back
      ctx.beginPath();
      ctx.roundRect(-rx + 2, -lidLift - lidH, (rx - 2) * 2, lidH, [8, 8, 3, 3]);

      const lidUndersideGrad = ctx.createLinearGradient(0, -lidLift - lidH, 0, -lidLift);
      lidUndersideGrad.addColorStop(0, colors.dark);
      lidUndersideGrad.addColorStop(0.6, colors.main);
      lidUndersideGrad.addColorStop(1, colors.light);
      ctx.fillStyle = lidUndersideGrad;
      ctx.fill();
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Underside ribbing structure
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-rx * 0.45, -lidLift - lidH + 4);
      ctx.lineTo(-rx * 0.45, -lidLift - 4);
      ctx.moveTo(rx * 0.45, -lidLift - lidH + 4);
      ctx.lineTo(rx * 0.45, -lidLift - 4);
      ctx.stroke();

      // Top handle on open lid
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-14, -lidLift - lidH - 6, 28, 6, 3);
      ctx.fill();

      ctx.restore();
    }

    // 4. Back Mouth Rim (Upper Arc from PI to 2*PI)
    ctx.beginPath();
    ctx.ellipse(0, yRim, rx, ry, 0, Math.PI, Math.PI * 2, false);
    ctx.strokeStyle = colors.dark;
    ctx.lineWidth = 4;
    ctx.stroke();

    // 5. Deep Inner Cavity (The 3D abyss inside the bin)
    ctx.beginPath();
    ctx.ellipse(0, yRim, rx - 5, ry - 3, 0, 0, Math.PI * 2);
    const cavityGrad = ctx.createRadialGradient(0, yRim - 2, 2, 0, yRim + 6, rx - 4);
    cavityGrad.addColorStop(0, '#000000');
    cavityGrad.addColorStop(0.55, '#04090e');
    cavityGrad.addColorStop(0.85, colors.dark);
    cavityGrad.addColorStop(1, '#09131a');
    ctx.fillStyle = cavityGrad;
    ctx.fill();

    // Inner rim shadow ring
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
  }

  // ==========================================
  // LAYER 2: FRONT (Hull, Front Lip, Badge)
  // ==========================================
  if (layer === 'front' || layer === 'all') {
    ctx.save();
    ctx.translate(x, y);

    // Apply squash & bounce around bottom ground base
    ctx.translate(0, yBase);
    ctx.scale(bounceX, bounceY);
    ctx.translate(0, -yBase);

    // Glow if hovered or active
    if (isHovered) {
      ctx.shadowColor = colors.border;
      ctx.shadowBlur = 22;
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 10;
    }

    // 1. Front Hull (Tapered Bucket with Cylindrical 3D Bottom Curve)
    const bodyGrad = ctx.createLinearGradient(-rx, 0, rx, 0);
    bodyGrad.addColorStop(0, colors.dark);
    bodyGrad.addColorStop(0.18, colors.main);
    bodyGrad.addColorStop(0.38, colors.light); // specular cylindrical reflection
    bodyGrad.addColorStop(0.65, colors.main);
    bodyGrad.addColorStop(0.9, colors.dark);
    bodyGrad.addColorStop(1, '#021811');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(-rx + 4, yRim);
    ctx.lineTo(rx - 4, yRim);
    ctx.lineTo(rxBase, yBase);
    ctx.quadraticCurveTo(0, yBase + 7, -rxBase, yBase); // 3D bottom curvature
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = isHovered ? 2.5 : 1.2;
    ctx.stroke();

    // 2. Embossed Vertical Reinforcement Ribs (Molded HDPE lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.5;
    [-rx * 0.42, 0, rx * 0.42].forEach((ribX) => {
      ctx.beginPath();
      ctx.moveTo(ribX, yRim + 12);
      ctx.lineTo(ribX * 0.82, yBase - 8);
      ctx.stroke();
    });

    // 3. Ground base pads / wheel mounts at bottom corners
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-rxBase - 3, yBase - 3, 8, 9, 2);
    ctx.roundRect(rxBase - 5, yBase - 3, 8, 9, 2);
    ctx.fill();

    // 4. Front Rim Lip (Lower Arc of Mouth 0 -> PI)
    // CRITICAL: This is drawn in front of the cavity and falling item!
    ctx.beginPath();
    ctx.ellipse(0, yRim, rx, ry, 0, 0, Math.PI, false);
    ctx.lineTo(-rx + 4, yRim + 10);
    ctx.ellipse(0, yRim + 10, rx - 4, ry - 3, 0, Math.PI, 0, true);
    ctx.closePath();

    const lipGrad = ctx.createLinearGradient(-rx, yRim, rx, yRim);
    lipGrad.addColorStop(0, colors.dark);
    lipGrad.addColorStop(0.3, colors.light);
    lipGrad.addColorStop(0.7, colors.main);
    lipGrad.addColorStop(1, colors.dark);
    ctx.fillStyle = lipGrad;
    ctx.fill();

    // Specular highlight crest along front rim edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, yRim, rx - 2, ry - 1, 0, 0.1, Math.PI - 0.1, false);
    ctx.stroke();

    // Molded Side Grip Handles on Bin Lip
    ctx.fillStyle = colors.dark;
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-rx - 6, yRim + 2, 7, 9, 2);
    ctx.roundRect(rx - 1, yRim + 2, 7, 9, 2);
    ctx.fill();
    ctx.stroke();

    // 5. Official SNI Recessed Front Badge Plate
    const badgeW = w * 0.72;
    const badgeH = h * 0.44;
    const badgeY = yRim + 18;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(-badgeW / 2, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.strokeStyle = isHovered ? colors.light : colors.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Badge Icon
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(colors.icon, 0, badgeY + 18);

    // Badge Label
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = colors.light;
    ctx.fillText(colors.label, 0, badgeY + 32);

    // Standard Code SNI
    ctx.font = 'bold 8px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('SNI 19-3983', 0, badgeY + 42);

    // Subtitle description
    ctx.font = '7.5px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText(colors.sub, 0, badgeY + 52);

    ctx.restore();
  }
}

/**
 * Renders 3D Eco Splash & Puff Particles bursting from bin mouth
 */
export function drawEcoSplashParticles(
  ctx: CanvasRenderingContext2D,
  particles: EcoSplashParticle[]
) {
  ctx.save();
  for (const p of particles) {
    if (p.alpha <= 0) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

    if (p.type === 'leaf') {
      // Little green leaf flutter
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.45, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(p.size, 0);
      ctx.stroke();
    } else if (p.type === 'star') {
      // 4-point golden star
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? p.size : p.size * 0.4;
        const angle = (i * Math.PI) / 4;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'spark') {
      // Electric neon spark
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft energy bubble
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
  ctx.restore();
}

/**
 * Expanding Shockwave Ring from Bin Mouth on impact
 */
export function drawShockwaveRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string,
  alpha: number
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Floating 3D Score & Feedback Badge popup over bin
 */
export function drawFloatingScorePopups(
  ctx: CanvasRenderingContext2D,
  popups: FloatingScorePopup[]
) {
  ctx.save();
  for (const pop of popups) {
    if (pop.alpha <= 0) continue;
    ctx.save();
    ctx.translate(pop.x, pop.y);
    ctx.scale(pop.scale, pop.scale);
    ctx.globalAlpha = Math.max(0, Math.min(1, pop.alpha));

    // Pill badge background
    ctx.shadowColor = pop.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(-75, -16, 150, 32, 16);
    ctx.fill();
    ctx.strokeStyle = pop.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = pop.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pop.text, 0, pop.subtext ? -4 : 0);

    if (pop.subtext) {
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(pop.subtext, 0, 9);
    }

    ctx.restore();
  }
  ctx.restore();
}

/**
 * Realistic Tree Renderer for Mission 2 with Symptom Overlays
 */
export function drawRealisticForestryTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  conditionType: 'dehidrasi' | 'klorosis' | 'gulma' | 'hama' | 'miring' | 'ranting_patah',
  isSolved: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);

  // Tilt transformation for 'miring'
  if (conditionType === 'miring' && !isSolved) {
    ctx.rotate(0.28); // ~16 deg tilt
  }

  // 1. Ground Soil Mound
  const groundGrad = ctx.createRadialGradient(0, 80, 10, 0, 80, 120);
  if (conditionType === 'dehidrasi' && !isSolved) {
    // Parched dry cracked soil
    groundGrad.addColorStop(0, '#a16207');
    groundGrad.addColorStop(1, '#78350f');
  } else if (isSolved) {
    // Rich moist dark loam
    groundGrad.addColorStop(0, '#15803d');
    groundGrad.addColorStop(0.4, '#3f2e18');
    groundGrad.addColorStop(1, '#1c1309');
  } else {
    groundGrad.addColorStop(0, '#594126');
    groundGrad.addColorStop(1, '#2d1e10');
  }

  ctx.fillStyle = groundGrad;
  ctx.beginPath();
  ctx.ellipse(0, 80, 110, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cracked soil fissures if dehydrated
  if (conditionType === 'dehidrasi' && !isSolved) {
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2.5;
    const cracks = [
      [[-70, 78], [-40, 82], [-10, 76]],
      [[20, 84], [55, 78], [85, 86]],
      [[-30, 88], [0, 92], [35, 90]],
      [[-15, 68], [15, 70]],
    ];
    for (const line of cracks) {
      ctx.beginPath();
      ctx.moveTo(line[0][0], line[0][1]);
      for (let i = 1; i < line.length; i++) {
        ctx.lineTo(line[i][0], line[i][1]);
      }
      ctx.stroke();
    }
  }

  // Ajir Bamboo Support if stabilized or cured 'miring'
  if ((conditionType === 'miring' && isSolved)) {
    // Bamboo stake
    ctx.strokeStyle = '#84cc16';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(25, -50);
    ctx.lineTo(25, 95);
    ctx.stroke();
    // Tied rope
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 0, 14, 6);
  }

  // 2. Tree Trunk & Branches (Wood grain texture)
  const trunkGrad = ctx.createLinearGradient(-25, 0, 25, 0);
  trunkGrad.addColorStop(0, '#3f220c');
  trunkGrad.addColorStop(0.4, '#713f12');
  trunkGrad.addColorStop(0.7, '#854d0e');
  trunkGrad.addColorStop(1, '#2e1505');

  ctx.fillStyle = trunkGrad;
  ctx.beginPath();
  ctx.moveTo(-18, 80);
  ctx.quadraticCurveTo(-14, 20, -10, -20);
  ctx.lineTo(-26, -45); // left branch
  ctx.lineTo(-20, -48);
  ctx.lineTo(-6, -26);
  ctx.lineTo(0, -55);   // center branch
  ctx.lineTo(6, -55);
  ctx.lineTo(8, -24);
  ctx.lineTo(24, -42);  // right branch
  ctx.lineTo(28, -38);
  ctx.quadraticCurveTo(14, 20, 18, 80);
  ctx.closePath();
  ctx.fill();

  // Bark lines
  ctx.strokeStyle = 'rgba(46, 21, 5, 0.6)';
  ctx.lineWidth = 1.5;
  for (const bx of [-8, 0, 8]) {
    ctx.beginPath();
    ctx.moveTo(bx, 75);
    ctx.quadraticCurveTo(bx + (bx === 0 ? 3 : -3), 20, bx * 0.6, -15);
    ctx.stroke();
  }

  // Broken branch symptom if 'ranting_patah'
  if (conditionType === 'ranting_patah' && !isSolved) {
    // Snapped splintered right branch
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, -32);
    ctx.lineTo(38, -20);
    ctx.lineTo(44, -2);
    ctx.stroke();
    // Fungal spots
    ctx.fillStyle = '#f8fafc';
    for (const [fx, fy] of [[28, -26], [35, -18], [40, -10]]) {
      ctx.beginPath();
      ctx.arc(fx, fy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Parasitic weeds wrapping trunk if 'gulma'
  if (conditionType === 'gulma' && !isSolved) {
    ctx.strokeStyle = '#65a30d';
    ctx.lineWidth = 4;
    // Twisted vine
    ctx.beginPath();
    ctx.moveTo(-16, 75);
    ctx.bezierCurveTo(12, 55, -16, 35, 12, 15);
    ctx.stroke();
    // Sharp wild weeds at base
    ctx.fillStyle = '#4d7c0f';
    for (const wx of [-40, -25, -10, 15, 30, 45]) {
      ctx.beginPath();
      ctx.moveTo(wx, 80);
      ctx.lineTo(wx + 8, 45);
      ctx.lineTo(wx + 16, 80);
      ctx.fill();
    }
  }

  // 3. Foliage Canopy
  // Color palette based on situation
  let canopyColor1 = '#15803d';
  let canopyColor2 = '#22c55e';
  let canopyColor3 = '#166534';

  if (conditionType === 'dehidrasi' && !isSolved) {
    canopyColor1 = '#a16207';
    canopyColor2 = '#ca8a04';
    canopyColor3 = '#713f12';
  } else if (conditionType === 'klorosis' && !isSolved) {
    canopyColor1 = '#facc15'; // chlorotic yellow
    canopyColor2 = '#fef08a';
    canopyColor3 = '#84cc16';
  } else if (isSolved) {
    canopyColor1 = '#16a34a';
    canopyColor2 = '#4ade80';
    canopyColor3 = '#14532d';
  }

  const leafPuffs = [
    [-42, -50, 36],
    [42, -50, 36],
    [0, -78, 44],
    [-22, -88, 34],
    [22, -88, 34],
    [0, -108, 32],
  ];

  for (const [lx, ly, lr] of leafPuffs) {
    const puffGrad = ctx.createRadialGradient(lx - 8, ly - 8, 4, lx, ly, lr);
    puffGrad.addColorStop(0, canopyColor2);
    puffGrad.addColorStop(0.7, canopyColor1);
    puffGrad.addColorStop(1, canopyColor3);
    ctx.fillStyle = puffGrad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chlorosis leaf veins pattern
  if (conditionType === 'klorosis' && !isSolved) {
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    for (const [vx, vy] of [[-30, -50], [0, -75], [30, -50]]) {
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx - 10, vy - 10);
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx + 10, vy - 10);
      ctx.stroke();
    }
  }

  // Pests crawling on leaves if 'hama'
  if (conditionType === 'hama' && !isSolved) {
    // Caterpillars & aphids
    ctx.fillStyle = '#dc2626';
    for (const [hx, hy] of [[-38, -60], [-10, -90], [25, -75], [40, -45]]) {
      // Aphid body
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fill();
      // Chewed bite mark
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(hx + 8, hy + 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
    }
  }

  // Restorative Sparkles & Flowers if Sembuh
  if (isSolved) {
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 10;
    for (const [sx, sy] of [[-35, -85], [35, -85], [0, -115], [-20, -40], [25, -40]]) {
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Realistic Forestry Tools Renderers
 */
export function drawRealisticForestryTool(
  ctx: CanvasRenderingContext2D,
  toolKey: string,
  x: number,
  y: number,
  size: number = 50,
  isHovered: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);

  if (isHovered) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
  } else {
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 8;
  }

  const scale = size / 60;
  ctx.scale(scale, scale);

  switch (toolKey) {
    case 'gembor':
      // Galvanized green watering can
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(-16, -10, 32, 22, 6);
      ctx.fill();
      // Spout & Rose
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(14, -2);
      ctx.lineTo(26, -14);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(28, -16, 5, 0, Math.PI * 2);
      ctx.fill();
      // Handle
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -12, 14, Math.PI, 0);
      ctx.stroke();
      break;

    case 'pupuk':
      // Burlap organic fertilizer sack
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(-16, -14, 32, 28, [8, 8, 4, 4]);
      ctx.fill();
      // Rich humus spill
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(0, 10, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Sprout
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, -6, 4, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'sekop':
      // Forged steel trowel with wood handle
      // Handle
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-3, 2, 6, 18);
      // Steel blade
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(-12, 2);
      ctx.lineTo(12, 2);
      ctx.lineTo(0, -22);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();
      break;

    case 'semprotan':
      // Bio-pesticide spray bottle
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(-12, -4, 24, 24, 4);
      ctx.fill();
      // Trigger pump
      ctx.fillStyle = '#065f46';
      ctx.fillRect(-6, -16, 12, 12);
      ctx.fillRect(-14, -14, 10, 4);
      break;

    case 'ajir':
      // Bamboo support stake & ties
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(0, 22);
      ctx.stroke();
      // Ring segments
      ctx.strokeStyle = '#4d7c0f';
      ctx.lineWidth = 2;
      for (const seg of [-10, 0, 10]) {
        ctx.strokeRect(-5, seg, 10, 2);
      }
      break;

    case 'gunting':
      // Bypass pruning shears
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      // Handles
      ctx.beginPath();
      ctx.moveTo(-10, 20);
      ctx.lineTo(0, 0);
      ctx.lineTo(10, 20);
      ctx.stroke();
      // Steel blades
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -18);
      ctx.moveTo(0, 0);
      ctx.lineTo(8, -18);
      ctx.stroke();
      break;

    case 'kapak':
      // Woodcutter's Axe (Distractor)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-3, -18, 6, 38);
      // Axe head
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(18, -24);
      ctx.lineTo(14, -6);
      ctx.closePath();
      ctx.fill();
      break;

    case 'api':
      // Fire Torch (Distractor)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.bezierCurveTo(-14, -10, -12, 12, 0, 22);
      ctx.bezierCurveTo(12, 12, 14, -10, 0, -24);
      ctx.fill();
      // Inner yellow flame
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.bezierCurveTo(-7, -4, -6, 8, 0, 15);
      ctx.bezierCurveTo(6, 8, 7, -4, 0, -12);
      ctx.fill();
      break;
  }

  ctx.restore();
}
