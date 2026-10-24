import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WasteItem } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { shuffleArray } from '../../utils/shuffle';
import { useMediaPipeHands } from '../../hooks/useMediaPipeHands';
import {
  drawMediaPipeHand,
  drawRealisticWasteItem,
  drawRealisticSniBin,
  drawEcoSplashParticles,
  drawShockwaveRing,
  drawFloatingScorePopups,
  EcoSplashParticle,
  FloatingScorePopup,
} from '../../utils/realisticCanvasDraw';
import { Camera, CameraOff, Sparkles, Hand, MousePointer, Info, Box } from 'lucide-react';
import { ThreeMission1Scene } from '../ThreeMission1Scene';

interface Mission1WasteProps {
  onItemSorted: (isCorrect: boolean, feedback: string, points: number) => void;
  onMissionComplete: () => void;
  arEnabled?: boolean;
  onToggleAR?: () => void;
}

interface EnteringItemAnim {
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
}

interface ShockwaveRingState {
  x: number;
  y: number;
  rx: number;
  ry: number;
  maxRx: number;
  color: string;
  alpha: number;
}

const INITIAL_WASTE_ITEMS: WasteItem[] = [
  {
    id: 'w1',
    name: 'Kulit Pisang Segar',
    category: 'organik',
    description: 'Sisa kulit buah alami yang mudah membusuk menjadi kompos tanah subur.',
    decompositionFact: '⏱️ Waktu Urai Alami: ±2–5 minggu (Cepat & ramah mikroba)',
    svgKey: 'kulit_pisang',
    points: 100,
  },
  {
    id: 'w2',
    name: 'Sisa Apel & Sayuran',
    category: 'organik',
    description: 'Sisa makanan organik kaya unsur hara untuk nutrisi mikroorganisme tanah.',
    decompositionFact: '⏱️ Waktu Urai Alami: ±1–2 bulan',
    svgKey: 'sisa_apel',
    points: 100,
  },
  {
    id: 'w3',
    name: 'Daun Kering Gugur',
    category: 'organik',
    description: 'Rontokan daun pohon di halaman yang menjadi bahan baku utama pupuk kompos.',
    decompositionFact: '⏱️ Waktu Urai Alami: ±1–3 bulan',
    svgKey: 'daun_kering',
    points: 100,
  },
  {
    id: 'w4',
    name: 'Botol Plastik Air Mineral',
    category: 'anorganik',
    description: 'Wadah plastik polimer PET yang wajib didaur ulang agar tidak menumpuk di laut.',
    decompositionFact: '⏱️ Waktu Urai Alami: ±450 TAHUN! (Sangat berbahaya bila dibuang sembarangan)',
    svgKey: 'botol_plastik',
    points: 100,
  },
  {
    id: 'w5',
    name: 'Kaleng Minuman Aluminium',
    category: 'anorganik',
    description: 'Kemasan logam ringan yang 100% dapat dilebur dan dicetak ulang berulang kali.',
    decompositionFact: '⏱️ Waktu Urai Alami: ±80–200 tahun di alam terbuka',
    svgKey: 'kaleng_aluminium',
    points: 100,
  },
  {
    id: 'w6',
    name: 'Kardus & Kertas Koran',
    category: 'anorganik',
    description: 'Serat selulosa kayu yang dapat didaur ulang menjadi bubur kertas (pulp) baru.',
    decompositionFact: '⏱️ Waktu Urai Alami: ±2–5 bulan (Daur ulang menyelamatkan pohon)',
    svgKey: 'kardus_koran',
    points: 100,
  },
  {
    id: 'w7',
    name: 'Baterai Bekas Jam/Remote',
    category: 'b3',
    description: 'Limbah B3 berbahaya! Mengandung logam berat merkuri, timbal, dan kadmium beracun.',
    decompositionFact: '⚠️ Bahaya Toksik: Logam berat meresap ke air tanah dan membahayakan kesehatan!',
    svgKey: 'baterai_bekas',
    points: 120,
  },
  {
    id: 'w8',
    name: 'Bohlam Lampu Neon Pecah',
    category: 'b3',
    description: 'Kaca berujung tajam dengan lapisan uap merkuri (raksa) yang beracun bila terhirup.',
    decompositionFact: '⚠️ Bahaya Cedera & Kimia: Wajib ditangani khusus dengan proteksi!',
    svgKey: 'bohlam_neon',
    points: 120,
  },
  {
    id: 'w9',
    name: 'Kaleng Semprot Pestisida',
    category: 'b3',
    description: 'Kaleng bertekanan gas berisi sisa racun insektisida pembasmi serangga.',
    decompositionFact: '⚠️ Bahaya Ledakan & Racun: Berisiko meledak bila terkena panas dan mencemari udara!',
    svgKey: 'pestisida',
    points: 120,
  },
];

export const Mission1Waste: React.FC<Mission1WasteProps> = ({
  onItemSorted,
  onMissionComplete,
  arEnabled = false,
  onToggleAR,
}) => {
  const [wasteItems] = useState<WasteItem[]>(() => shuffleArray(INITIAL_WASTE_ITEMS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isARActive, setIsARActive] = useState<boolean>(arEnabled);
  const [renderMode, setRenderMode] = useState<'3d' | '2d'>('3d');

  // Canvas ref & interaction state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentItem = wasteItems[currentIndex];

  // Dual Control: MediaPipe Hands Hook
  const {
    videoRef,
    cameraActive,
    cameraError,
    isModelLoading,
    handState,
    startCamera,
    stopCamera,
  } = useMediaPipeHands(false);

  // Synchronize with external AR toggle if provided
  useEffect(() => {
    if (arEnabled && !cameraActive) {
      setIsARActive(true);
      startCamera();
    } else if (!arEnabled && cameraActive) {
      setIsARActive(false);
      stopCamera();
    }
  }, [arEnabled, cameraActive, startCamera, stopCamera]);

  const handleToggleCamera = () => {
    if (cameraActive) {
      stopCamera();
      setIsARActive(false);
      if (onToggleAR) onToggleAR();
    } else {
      setIsARActive(true);
      startCamera();
      if (onToggleAR) onToggleAR();
    }
  };

  // Item physics/position state on canvas (elevated for comfortable pickup clearance)
  const itemPosRef = useRef<{ x: number; y: number; vx: number; vy: number; isDragging: boolean }>({
    x: 380,
    y: 80,
    vx: 0,
    vy: 0,
    isDragging: false,
  });

  const mousePosRef = useRef<{ x: number; y: number; isDown: boolean }>({
    x: 380,
    y: 80,
    isDown: false,
  });

  const hoveredBinRef = useRef<'organik' | 'anorganik' | 'b3' | null>(null);
  const isSortingRef = useRef<boolean>(false);

  // 3D Layered Animation and Physics Dynamics State
  const enteringAnimRef = useRef<EnteringItemAnim | null>(null);
  const binDynamicsRef = useRef<{
    organik: { squish: number; lid: number };
    anorganik: { squish: number; lid: number };
    b3: { squish: number; lid: number };
  }>({
    organik: { squish: 0, lid: 0 },
    anorganik: { squish: 0, lid: 0 },
    b3: { squish: 0, lid: 0 },
  });

  const particlesRef = useRef<EcoSplashParticle[]>([]);
  const shockwavesRef = useRef<ShockwaveRingState[]>([]);
  const scorePopupsRef = useRef<Array<FloatingScorePopup & { vy: number }>>([]);

  // Spawn Eco Splash Burst when entering bin
  const spawnBinSplash = useCallback(
    (binType: 'organik' | 'anorganik' | 'b3', mouthX: number, mouthY: number) => {
      const colors = {
        organik: ['#34d399', '#10b981', '#059669', '#6ee7b7'],
        anorganik: ['#fbbf24', '#f59e0b', '#d97706', '#fde047'],
        b3: ['#f87171', '#ef4444', '#dc2626', '#fca5a5'],
      }[binType];

      const particleType: 'leaf' | 'star' | 'spark' =
        binType === 'organik' ? 'leaf' : binType === 'anorganik' ? 'star' : 'spark';

      // 18 physical burst particles
      for (let i = 0; i < 18; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const speed = 3.5 + Math.random() * 5.5;
        particlesRef.current.push({
          x: mouthX + (Math.random() - 0.5) * 20,
          y: mouthY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 5 + Math.random() * 7,
          alpha: 1.0,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: particleType,
        });
      }

      // Expanding Shockwave Ring
      shockwavesRef.current.push({
        x: mouthX,
        y: mouthY,
        rx: 20,
        ry: 6,
        maxRx: 75,
        color: colors[0],
        alpha: 0.95,
      });
    },
    []
  );

  // Handle Sort Action with 3D Layered Entrance
  const performSort = useCallback(
    (chosenBin: 'organik' | 'anorganik' | 'b3') => {
      if (!currentItem || isSortingRef.current || enteringAnimRef.current) return;
      isSortingRef.current = true;

      const canvas = canvasRef.current;
      const w = canvas ? canvas.width : 760;
      const h = canvas ? canvas.height : 480;

      const binX =
        chosenBin === 'organik'
          ? w * 0.2
          : chosenBin === 'anorganik'
          ? w * 0.5
          : w * 0.8;
      const binY = h - 75;
      const targetMouthY = binY - 110 / 2 + 12;

      const isCorrect = chosenBin === currentItem.category;

      // Play suction whoosh sound into bin opening
      soundManager.playBinSuck();

      // Initiate 3D entering animation
      enteringAnimRef.current = {
        item: currentItem,
        chosenBin,
        startX: itemPosRef.current.x,
        startY: itemPosRef.current.y,
        targetX: binX,
        targetY: targetMouthY,
        startTime: performance.now(),
        duration: 700,
        isCorrect,
        hasImpacted: false,
      };

      // Release any user drag immediately
      itemPosRef.current.isDragging = false;
      mousePosRef.current.isDown = false;

      // Handle 3D mode score feedback and transition
      if (renderMode === '3d') {
        setTimeout(() => {
          if (isCorrect) {
            soundManager.playBinPlop(true);
            onItemSorted(
              true,
              `Tepat Sekali! "${currentItem.name}" masuk ke Tong ${
                chosenBin === 'organik'
                  ? 'Hijau (Organik)'
                  : chosenBin === 'anorganik'
                  ? 'Kuning (Anorganik)'
                  : 'Merah (B3 Beracun)'
              }. ${currentItem.decompositionFact}`,
              currentItem.points
            );
          } else {
            soundManager.playBinPlop(false);
            onItemSorted(
              false,
              `Kurang Tepat! "${currentItem.name}" seharusnya masuk ke Tong ${
                currentItem.category === 'organik'
                  ? 'Hijau (Organik)'
                  : currentItem.category === 'anorganik'
                  ? 'Kuning (Anorganik)'
                  : 'Merah (B3 Beracun)'
              }.`,
              0
            );
          }
        }, 360);

        setTimeout(() => {
          if (currentIndex + 1 < wasteItems.length) {
            setCurrentIndex((prev) => prev + 1);
            enteringAnimRef.current = null;
            isSortingRef.current = false;
          } else {
            onMissionComplete();
          }
        }, 760);
      }
    },
    [
      currentItem,
      renderMode,
      currentIndex,
      wasteItems.length,
      onItemSorted,
      onMissionComplete,
    ]
  );

  // Mouse / Touch Event Handlers (Dual Control: Touch & Mouse on Canvas)
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (enteringAnimRef.current) return;
    const { x, y } = getCanvasCoords(e);
    mousePosRef.current = { x, y, isDown: true };

    // Check if clicked near current item
    const dx = x - itemPosRef.current.x;
    const dy = y - itemPosRef.current.y;
    if (Math.hypot(dx, dy) < 65) {
      itemPosRef.current.isDragging = true;
      soundManager.playClick();
    }

    // Check if clicked directly on bins
    const canvas = canvasRef.current;
    if (canvas && y > canvas.height - 150) {
      if (x < canvas.width * 0.35) {
        performSort('organik');
      } else if (x < canvas.width * 0.65) {
        performSort('anorganik');
      } else {
        performSort('b3');
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    mousePosRef.current.x = x;
    mousePosRef.current.y = y;

    if (itemPosRef.current.isDragging && !enteringAnimRef.current) {
      itemPosRef.current.x = x;
      itemPosRef.current.y = y;
    }
  };

  const handlePointerUp = () => {
    mousePosRef.current.isDown = false;
    if (itemPosRef.current.isDragging && !enteringAnimRef.current) {
      itemPosRef.current.isDragging = false;

      // Drop check onto bins
      const canvas = canvasRef.current;
      if (canvas && itemPosRef.current.y > canvas.height - 180) {
        const itemX = itemPosRef.current.x;
        if (itemX < canvas.width * 0.35) {
          performSort('organik');
          return;
        } else if (itemX < canvas.width * 0.65) {
          performSort('anorganik');
          return;
        } else {
          performSort('b3');
          return;
        }
      }

      // Spring back to center
      if (canvas) {
        itemPosRef.current.x = canvas.width / 2;
        itemPosRef.current.y = 130;
      }
    }
  };

  // Main Canvas Render Loop (3D Layered Bins + MediaPipe + Dual Control)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const now = performance.now();
      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Background: Live Webcam Feed (Mirrored) OR Sci-Fi Eco-Lab Canvas
      ctx.clearRect(0, 0, w, h);

      if (cameraActive && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, w, h);
        ctx.restore();

        // Dark subtle overlay for contrast & readability
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fillRect(0, 0, w, h);

        // Futuristic AR scanning grid overlay
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < w; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = 0; gy < h; gy += 40) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
      } else {
        // High-tech Eco-Lab Studio Canvas Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.5, '#064e3b');
        bgGrad.addColorStop(1, '#022c22');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Ambient cyber lighting
        const radial = ctx.createRadialGradient(w / 2, 130, 20, w / 2, 130, 240);
        radial.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
        radial.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Bin Coordinates & Hover Calculations
      const binY = h - 75;
      const binWidth = Math.min(130, w * 0.26);
      const binHeight = 110;

      const bin1X = w * 0.2;
      const bin2X = w * 0.5;
      const bin3X = w * 0.8;

      let hovered: 'organik' | 'anorganik' | 'b3' | null = null;
      const activeX = itemPosRef.current.isDragging ? itemPosRef.current.x : -1;
      const activeY = itemPosRef.current.isDragging ? itemPosRef.current.y : -1;

      if (activeY > h - 170) {
        if (activeX < w * 0.35) hovered = 'organik';
        else if (activeX < w * 0.65) hovered = 'anorganik';
        else hovered = 'b3';
      }
      hoveredBinRef.current = hovered;

      // Update spring dynamics (squish bounce & lid relaxation)
      const binTypes: Array<'organik' | 'anorganik' | 'b3'> = ['organik', 'anorganik', 'b3'];
      const binPositions = { organik: bin1X, anorganik: bin2X, b3: bin3X };

      binTypes.forEach((type) => {
        const bd = binDynamicsRef.current[type];
        if (bd.squish > 0.01) {
          bd.squish *= 0.84; // spring damping
        } else {
          bd.squish = 0;
        }

        // Lid opens when hovered or when item is actively entering this bin
        const isEnteringThis = enteringAnimRef.current?.chosenBin === type;
        const targetLid = isEnteringThis ? 1.0 : hovered === type ? 0.45 : 0;
        bd.lid += (targetLid - bd.lid) * 0.18;
      });

      // ========================================================
      // LAYER 1: DRAW BACK CAVITY & OPEN LIDS FOR ALL 3 BINS
      // ========================================================
      binTypes.forEach((type) => {
        const bx = binPositions[type];
        const bd = binDynamicsRef.current[type];
        const bounceOsc = Math.sin(now / 35) * (bd.squish * 0.22);
        const bounceY = 1.0 - bounceOsc;
        const bounceX = 1.0 + bounceOsc * 0.8;

        drawRealisticSniBin(ctx, bx, binY, binWidth, binHeight, type, {
          isHovered: hovered === type,
          lidOpen: bd.lid,
          bounceX,
          bounceY,
          layer: 'back',
        });
      });

      // ========================================================
      // LAYER 2: THE WASTE ITEM (Either Regular or Entering 3D)
      // ========================================================
      const enteringAnim = enteringAnimRef.current;

      if (enteringAnim) {
        const elapsed = now - enteringAnim.startTime;
        const t = Math.max(0, Math.min(1, elapsed / enteringAnim.duration));

        let curX: number;
        let curY: number;
        let curScale: number;
        let curAlpha: number = 1.0;
        let curRot: number;

        if (t < 0.52) {
          // PHASE 1: Suction parabolic arc into bin opening
          const arcT = t / 0.52;
          const easeT = arcT * arcT; // accelerate into mouth
          curX = enteringAnim.startX + (enteringAnim.targetX - enteringAnim.startX) * easeT;
          const linearY = enteringAnim.startY + (enteringAnim.targetY - enteringAnim.startY) * easeT;
          const archH = Math.sin(arcT * Math.PI) * -35;
          curY = linearY + archH;

          curScale = 1.0 - easeT * 0.28; // 1.0 -> 0.72
          curRot = easeT * Math.PI * 1.5;
        } else {
          // IMPACT MOMENT CHECK
          if (!enteringAnim.hasImpacted) {
            enteringAnim.hasImpacted = true;

            // Trigger physical bin squish bounce
            binDynamicsRef.current[enteringAnim.chosenBin].squish = 1.0;

            // Play impact sound (resonant thud + chime/buzz)
            soundManager.playBinPlop(enteringAnim.isCorrect);

            // Spawn particle puff & shockwave ring
            spawnBinSplash(
              enteringAnim.chosenBin,
              enteringAnim.targetX,
              enteringAnim.targetY
            );

            // Spawn floating score badge directly over bin mouth
            const scoreColor = enteringAnim.isCorrect ? '#34d399' : '#f87171';
            scorePopupsRef.current.push({
              x: enteringAnim.targetX,
              y: enteringAnim.targetY - 20,
              text: enteringAnim.isCorrect
                ? `+${enteringAnim.item.points} POIN AMAL ⭐`
                : '⚠️ SALAH TONG!',
              subtext: enteringAnim.isCorrect
                ? 'Tepat Masuk Wadah!'
                : `Seharusnya Tong ${
                    enteringAnim.item.category === 'organik'
                      ? 'Hijau (Organik)'
                      : enteringAnim.item.category === 'anorganik'
                      ? 'Kuning (Anorganik)'
                      : 'Merah (B3)'
                  }`,
              color: scoreColor,
              alpha: 1.0,
              scale: 0.7,
              vy: -2.2,
            });

            // Trigger external score & feedback toast
            if (enteringAnim.isCorrect) {
              onItemSorted(
                true,
                `Tepat Sekali! "${enteringAnim.item.name}" masuk ke Tong ${
                  enteringAnim.chosenBin === 'organik'
                    ? 'Hijau (Organik)'
                    : enteringAnim.chosenBin === 'anorganik'
                    ? 'Kuning (Anorganik)'
                    : 'Merah (B3 Beracun)'
                }. ${enteringAnim.item.decompositionFact}`,
                enteringAnim.item.points
              );
            } else {
              onItemSorted(
                false,
                `Kurang Tepat! "${enteringAnim.item.name}" seharusnya masuk ke Tong ${
                  enteringAnim.item.category === 'organik'
                    ? 'Hijau (Organik)'
                    : enteringAnim.item.category === 'anorganik'
                    ? 'Kuning (Anorganik)'
                    : 'Merah (B3 Beracun)'
                }.`,
                0
              );
            }
          }

          // PHASE 2: Sinking deep inside the 3D cavity behind front hull
          const deepT = (t - 0.52) / 0.48;
          curX = enteringAnim.targetX + Math.sin(deepT * Math.PI * 2) * 2;
          curY = enteringAnim.targetY + deepT * 42; // moves downwards into cavity depth
          curScale = 0.72 * (1.0 - deepT * 0.82); // shrinks down to ~0.13
          curRot = Math.PI * 1.5 + deepT * Math.PI;
          curAlpha = Math.max(0, 1.0 - deepT * 0.95);
        }

        // Draw entering item inside cavity
        ctx.save();
        ctx.globalAlpha = curAlpha;
        ctx.translate(curX, curY);
        ctx.rotate(curRot);
        drawRealisticWasteItem(ctx, enteringAnim.item.svgKey, 0, 0, 96 * curScale);

        // Apply depth darkening shadow as it plunges down
        if (t >= 0.52) {
          const darkAlpha = ((t - 0.52) / 0.48) * 0.8;
          ctx.fillStyle = `rgba(0, 0, 0, ${darkAlpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, 48 * curScale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Complete animation sequence
        if (t >= 1.0) {
          enteringAnimRef.current = null;
          isSortingRef.current = false;

          if (currentIndex + 1 < wasteItems.length) {
            setCurrentIndex((prev) => prev + 1);
            itemPosRef.current = {
              x: w / 2,
              y: 130,
              vx: 0,
              vy: 0,
              isDragging: false,
            };
          } else {
            onMissionComplete();
          }
        }
      } else if (currentItem) {
        // Regular Item when idle or dragging
        if (!itemPosRef.current.isDragging) {
          itemPosRef.current.y = 130 + Math.sin(now / 400) * 5;
        }

        drawRealisticWasteItem(
          ctx,
          currentItem.svgKey,
          itemPosRef.current.x,
          itemPosRef.current.y,
          itemPosRef.current.isDragging ? 110 : 96
        );

        // Item Label on Canvas
        ctx.save();
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 6;
        ctx.fillText(currentItem.name, itemPosRef.current.x, itemPosRef.current.y + 60);

        // Control hint under item
        if (!itemPosRef.current.isDragging) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = cameraActive ? '#6ee7b7' : '#93c5fd';
          ctx.fillText(
            cameraActive
              ? '✊ Jepit telunjuk/jempol atau seret dengan mouse/sentuhan'
              : '🖱️ Seret sampah ke tong pilihan atau klik tong di bawah',
            itemPosRef.current.x,
            itemPosRef.current.y + 76
          );
        }
        ctx.restore();
      }

      // ========================================================
      // LAYER 3: DRAW FRONT HULL & FRONT OCCLUSION LIP
      // (This covers the entering item as it plunges down!)
      // ========================================================
      binTypes.forEach((type) => {
        const bx = binPositions[type];
        const bd = binDynamicsRef.current[type];
        const bounceOsc = Math.sin(now / 35) * (bd.squish * 0.22);
        const bounceY = 1.0 - bounceOsc;
        const bounceX = 1.0 + bounceOsc * 0.8;

        drawRealisticSniBin(ctx, bx, binY, binWidth, binHeight, type, {
          isHovered: hovered === type,
          lidOpen: bd.lid,
          bounceX,
          bounceY,
          layer: 'front',
        });
      });

      // ========================================================
      // LAYER 4: 3D SPLASH PARTICLES, SHOCKWAVES & FLOATING SCORES
      // ========================================================
      // Update and draw shockwaves
      const activeShockwaves: ShockwaveRingState[] = [];
      for (const sw of shockwavesRef.current) {
        sw.rx += 3.5;
        sw.ry += 1.2;
        sw.alpha -= 0.05;
        if (sw.alpha > 0 && sw.rx < sw.maxRx) {
          drawShockwaveRing(ctx, sw.x, sw.y, sw.rx, sw.ry, sw.color, sw.alpha);
          activeShockwaves.push(sw);
        }
      }
      shockwavesRef.current = activeShockwaves;

      // Update and draw eco-splash particles
      const activeParticles: EcoSplashParticle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity pull
        p.rotation += p.vRot;
        p.alpha -= 0.035; // fade out
        if (p.alpha > 0) {
          activeParticles.push(p);
        }
      }
      particlesRef.current = activeParticles;
      drawEcoSplashParticles(ctx, activeParticles);

      // Update and draw floating score popups
      const activePopups: Array<FloatingScorePopup & { vy: number }> = [];
      for (const pop of scorePopupsRef.current) {
        pop.y += pop.vy;
        pop.vy *= 0.94; // decelerate upward
        pop.scale = Math.min(1.0, pop.scale + 0.06);
        pop.alpha -= 0.022;
        if (pop.alpha > 0) {
          activePopups.push(pop);
        }
      }
      scorePopupsRef.current = activePopups;
      drawFloatingScorePopups(ctx, activePopups);

      // ========================================================
      // LAYER 5: MEDIAPIPE HANDS SKELETON & DUAL CONTROL
      // ========================================================
      const handCanvasX = handState.x * w;
      const handCanvasY = handState.y * h;

      if (cameraActive && handState.landmarks) {
        drawMediaPipeHand(ctx, handState.landmarks, handState.isGrabbing, w, h, true);

        // MediaPipe Pinch Grab Interaction:
        if (handState.isGrabbing && !itemPosRef.current.isDragging && !enteringAnimRef.current) {
          const dHandItem = Math.hypot(handCanvasX - itemPosRef.current.x, handCanvasY - itemPosRef.current.y);
          if (dHandItem < 90) {
            itemPosRef.current.isDragging = true;
          }
        }

        // If grabbed via MediaPipe Hand, follow hand
        if (itemPosRef.current.isDragging && handState.isGrabbing && !enteringAnimRef.current) {
          itemPosRef.current.x = handCanvasX;
          itemPosRef.current.y = handCanvasY;
        }

        // Release check when MediaPipe un-pinches
        if (
          itemPosRef.current.isDragging &&
          !handState.isGrabbing &&
          !mousePosRef.current.isDown &&
          !enteringAnimRef.current
        ) {
          itemPosRef.current.isDragging = false;
          if (itemPosRef.current.y > h - 180) {
            if (itemPosRef.current.x < w * 0.35) performSort('organik');
            else if (itemPosRef.current.x < w * 0.65) performSort('anorganik');
            else performSort('b3');
          } else {
            itemPosRef.current.x = w / 2;
            itemPosRef.current.y = 130;
          }
        }
      }

      // 6. Dual Control HUD Status Banner on Canvas
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(14, 14, 280, 48, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('🎮 DUAL CONTROL AKTIF', 26, 32);

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(
        cameraActive
          ? (handState.isDetected ? '📷 Tangan Terdeteksi (Jepit/Pinch)' : '📷 Mencari Tangan... / Pakai Mouse')
          : '🖱️ Sentuh/Mouse Aktif (Nyalakan AR Kamera)',
        26,
        48
      );
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    cameraActive,
    handState,
    currentItem,
    performSort,
    spawnBinSplash,
    currentIndex,
    wasteItems.length,
    onItemSorted,
    onMissionComplete,
    videoRef,
  ]);

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-4xl mx-auto h-full min-h-[540px] p-2 sm:p-4 text-slate-100 select-none">
      {/* Top Header & Dual Control Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Misi 1: Pilah Sampah SNI 19-3983
            </span>
            <span className="text-xs font-mono text-cyan-300 bg-slate-800 px-2 py-0.5 rounded-md">
              Item {currentIndex + 1} / {wasteItems.length}
            </span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
            Visual Benda Realistis & Layar AR MediaPipe Hands Langsung di Canvas
          </h2>
        </div>

        {/* Dual Control, Mode Switcher & AR Toggle Button */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher: 3D Three.js vs 2D Canvas */}
          <button
            type="button"
            onClick={() => setRenderMode((m) => (m === '3d' ? '2d' : '3d'))}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              renderMode === '3d'
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30 ring-2 ring-cyan-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Ganti Mode Visualisasi Antara 3D Three.js dan 2D Canvas"
          >
            <Box className="w-3.5 h-3.5" />
            <span>{renderMode === '3d' ? '🧊 3D Three.js' : '🎨 2D Canvas'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300">
            <Hand className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gestur Tangan</span>
            <span className="text-slate-500">+</span>
            <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sentuh/Mouse</span>
          </div>

          <button
            onClick={handleToggleCamera}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              cameraActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
            }`}
          >
            {cameraActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                <span>Matikan AR Kamera</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 animate-pulse" />
                <span>Nyalakan AR Kamera</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Model Loading or Camera Notice */}
      {isModelLoading && (
        <div className="w-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs py-1.5 px-3 rounded-xl mb-2 flex items-center justify-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Memuat MediaPipe Hands & Sensor AR Kamera... Silakan tunggu sejenak!</span>
        </div>
      )}
      {cameraError && (
        <div className="w-full bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs py-1.5 px-3 rounded-xl mb-2 flex items-center justify-between">
          <span>⚠️ {cameraError}</span>
          <span className="font-bold underline">Mode Sentuh/Mouse Tetap Aktif!</span>
        </div>
      )}

      {/* MAIN AR INTERACTIVE VIEWPORT (Three.js 3D WebGL OR 2D Canvas) */}
      <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9.5] rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl bg-slate-950">
        {renderMode === '3d' ? (
          <ThreeMission1Scene
            currentItem={currentItem}
            cameraActive={cameraActive}
            videoRef={videoRef}
            handState={handState}
            onSortAttempt={performSort}
            enteringAnim={enteringAnimRef.current}
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={760}
            height={480}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full object-contain cursor-grab active:cursor-grabbing touch-none"
          />
        )}

        {/* Floating Fact Card inside Canvas Overlay */}
        {currentItem && (
          <div className="absolute top-3 right-3 max-w-[260px] bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-xs shadow-xl hidden md:block z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>{currentItem.name}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug mb-1">
              {currentItem.description}
            </p>
            <div className="p-1 rounded bg-slate-950/80 text-[10px] text-amber-300 font-medium">
              {currentItem.decompositionFact}
            </div>
          </div>
        )}
      </div>

      {/* Direct Bin Buttons for Fast Touch Accessibility (Dual Control) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-3xl mt-3">
        <button
          type="button"
          onClick={() => performSort('organik')}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 border-2 border-emerald-500/60 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 cursor-pointer"
        >
          <span>🌱</span>
          <span>Tong Hijau (Organik)</span>
        </button>

        <button
          type="button"
          onClick={() => performSort('anorganik')}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-800 border-2 border-amber-500/60 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 cursor-pointer"
        >
          <span>♻</span>
          <span>Tong Kuning (Anorganik)</span>
        </button>

        <button
          type="button"
          onClick={() => performSort('b3')}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-800 border-2 border-rose-500/60 text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 cursor-pointer"
        >
          <span>☣</span>
          <span>Tong Merah (B3)</span>
        </button>
      </div>
    </div>
  );
};
