import React, { useState, useRef, useEffect, useCallback } from 'react';
import { soundManager } from '../../utils/audio';
import { shuffleArray } from '../../utils/shuffle';
import { useMediaPipeHands } from '../../hooks/useMediaPipeHands';
import {
  drawMediaPipeHand,
  drawRealisticForestryTree,
  drawRealisticForestryTool,
} from '../../utils/realisticCanvasDraw';
import { Camera, CameraOff, Sparkles, Hand, MousePointer } from 'lucide-react';

export type ForestryToolKey =
  | 'gembor'
  | 'pupuk'
  | 'sekop'
  | 'semprotan'
  | 'ajir'
  | 'gunting'
  | 'kapak'
  | 'api';

interface ForestryChallenge {
  id: number;
  title: string;
  species: string;
  diagnosis: string;
  conditionType: 'dehidrasi' | 'klorosis' | 'gulma' | 'hama' | 'miring' | 'ranting_patah';
  description: string;
  correctTool: ForestryToolKey;
  correctToolName: string;
  explanation: string;
  points: number;
}

interface Mission2ForestryProps {
  onPlotCared: (isCorrect: boolean, feedback: string, points: number) => void;
  onMissionComplete: () => void;
  arEnabled?: boolean;
  onToggleAR?: () => void;
}

const FORESTRY_CHALLENGES: ForestryChallenge[] = [
  {
    id: 1,
    title: 'Bibit Pohon Jati Dehidrasi Akut (Kemarau Wonogiri)',
    species: 'Tectona grandis (Taman Konservasi SDN 2 Girimarto)',
    diagnosis: 'Dehidrasi Akut & Tanah Rekah',
    conditionType: 'dehidrasi',
    description: 'Tanah petak retak-retak gersang dan daun bibit layu terkulai akibat kemarau panjang tanpa hujan.',
    correctTool: 'gembor',
    correctToolName: 'Gembor Air Bersih',
    explanation: 'Siraman air bersih segera meresap ke zona perakaran bibit jati, melarutkan mineral tanah dan mengembalikan kesegaran daun!',
    points: 100,
  },
  {
    id: 2,
    title: 'Bibit Pohon Mahoni Daun Menguning / Klorosis',
    species: 'Swietenia mahagoni (Hutan Rakyat Girimarto)',
    diagnosis: 'Klorosis Defisiensi Unsur Hara Organik (N-P-K)',
    conditionType: 'klorosis',
    description: 'Tanah tandus kekurangan humus. Daun bibit mahoni memucat kekuningan dan terancam kerdil permanen.',
    correctTool: 'pupuk',
    correctToolName: 'Pupuk Kompos Organik',
    explanation: 'Pupuk kompos kaya cacing tanah dan mikoriza menyuburkan tanah alami tanpa polusi kimia sintetik!',
    points: 110,
  },
  {
    id: 3,
    title: 'Pohon Trembesi Muda Dibelit Gulma & Alang-Alang',
    species: 'Samanea saman (Pohon Peneduh & Penyerap Emisi CO₂)',
    diagnosis: 'Invasif Gulma Liar & Pencekikan Akar',
    conditionType: 'gulma',
    description: 'Rumput alang-alang liar dan sulur parasit melilit batang pohon muda, merampas air dan unsur hara tanah.',
    correctTool: 'sekop',
    correctToolName: 'Sekop Penyiang Gulma',
    explanation: 'Penyiangan gulma membersihkan zona perakaran sehingga trembesi bebas bertumbuh sebagai raksasa penyerap karbon!',
    points: 120,
  },
  {
    id: 4,
    title: 'Bibit Meranti Diserang Kutu Daun & Hama Penggerek',
    species: 'Shorea leprosula (Pohon Penjaga Rimba Hujan Tropis)',
    diagnosis: 'Investasi Koloni Hama Kutu Daun (Aphids)',
    conditionType: 'hama',
    description: 'Ratusan kutu daun dan ulat memakan pucuk daun meranti muda hingga berlubang-lubang dan menghambat fotosintesis.',
    correctTool: 'semprotan',
    correctToolName: 'Semprotan Pestisida Nabati',
    explanation: 'Pestisida nabati daun mimba efektif mengendalikan hama tanpa meracuni serangga penyerbuk lebah dan tanpa mencemari air tanah!',
    points: 130,
  },
  {
    id: 5,
    title: 'Bibit Beringin Muda Miring Condong Diterjang Badai',
    species: 'Ficus benjamina (Pohon Konservasi Mata Air Wonogiri)',
    diagnosis: 'Dislokasi Batang & Terancam Roboh',
    conditionType: 'miring',
    description: 'Hembusan angin kencang membuat bibit muda condong 25 derajat dan akar tunggangnya terancam tercabut longgar.',
    correctTool: 'ajir',
    correctToolName: 'Ajir Bambu & Tali Penyangga',
    explanation: 'Pemasangan ajir bambu menstabilkan batang dari goncangan badai sampai sistem perakaran menembus tanah dalam!',
    points: 130,
  },
  {
    id: 6,
    title: 'Ranting Bibit Damar Patah & Mengering Terinfeksi Jamur',
    species: 'Agathis dammara (Penghasil Resin Alami & Oksigen)',
    diagnosis: 'Patah Ranting Infeksi Jamur Patogen',
    conditionType: 'ranting_patah',
    description: 'Ranting samping patah terkulai dan mulai timbul bercak jamur busuk yang berbahaya jika menyebar ke batang utama.',
    correctTool: 'gunting',
    correctToolName: 'Gunting Pruning (Pangkas Ranting)',
    explanation: 'Pemangkasan tepat memotong ranting yang terinfeksi dan memusatkan energi pertumbuhan ke tunas utama yang sehat!',
    points: 140,
  },
];

const TOOLS_CONFIG: {
  key: ForestryToolKey;
  name: string;
  desc: string;
  category: 'care' | 'danger';
}[] = [
  { key: 'gembor', name: '💧 Gembor Air', desc: 'Menyiram tanah dehidrasi', category: 'care' },
  { key: 'pupuk', name: '🌱 Pupuk Kompos', desc: 'Menyuplai nutrisi humus tanah', category: 'care' },
  { key: 'sekop', name: '🧑‍🌾 Sekop Penyiang', desc: 'Mencabut gulma liar parasit', category: 'care' },
  { key: 'semprotan', name: '🌿 Pestisida Nabati', desc: 'Membasmi kutu & ulat daun', category: 'care' },
  { key: 'ajir', name: '🎋 Ajir Bambu', desc: 'Menegakkan pohon miring badai', category: 'care' },
  { key: 'gunting', name: '✂️ Gunting Pruning', desc: 'Memotong ranting busuk/patah', category: 'care' },
  { key: 'kapak', name: '🪓 Kapak Penebang', desc: 'Penebangan Liar (Perusak)', category: 'danger' },
  { key: 'api', name: '🔥 Api Pembakar', desc: 'Membakar Hutan (Bencana)', category: 'danger' },
];

export const Mission2Forestry: React.FC<Mission2ForestryProps> = ({
  onPlotCared,
  onMissionComplete,
  arEnabled = false,
  onToggleAR,
}) => {
  const [challenges] = useState<ForestryChallenge[]>(() => shuffleArray(FORESTRY_CHALLENGES));
  const [toolsList] = useState(() => shuffleArray(TOOLS_CONFIG));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSuccessSolved, setIsSuccessSolved] = useState<boolean>(false);
  const [isARActive, setIsARActive] = useState<boolean>(arEnabled);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentChallenge = challenges[currentIndex];

  // MediaPipe Hands Hook
  const {
    videoRef,
    cameraActive,
    cameraError,
    isModelLoading,
    handState,
    startCamera,
    stopCamera,
  } = useMediaPipeHands(false);

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

  // Tool dragging physics
  const draggedToolRef = useRef<{
    key: ForestryToolKey | null;
    x: number;
    y: number;
    isDragging: boolean;
  }>({
    key: null,
    x: 0,
    y: 0,
    isDragging: false,
  });

  const mousePosRef = useRef<{ x: number; y: number; isDown: boolean }>({
    x: 0,
    y: 0,
    isDown: false,
  });

  const handleApplyTool = useCallback(
    (tool: ForestryToolKey) => {
      if (isSuccessSolved) return;

      // 1. Check illegal destructive distractors
      if (tool === 'kapak') {
        soundManager.playError();
        onPlotCared(
          false,
          'Bahaya Penebangan Liar! Menebang pohon merusak ekosistem hutan nusantara, menyebabkan erosi tanah longsor, dan memicu krisis iklim!',
          0
        );
        return;
      }

      if (tool === 'api') {
        soundManager.playError();
        onPlotCared(
          false,
          'Bahaya Kebakaran Hutan (Karhutla)! Membakar lahan memusnahkan mikroorganisme humus tanah, memicu polusi kabut asap ISPA, dan membinasakan satwa!',
          0
        );
        return;
      }

      // 2. Check if chosen tool matches the clinical diagnosis
      if (tool === currentChallenge.correctTool) {
        soundManager.playSuccess();
        setIsSuccessSolved(true);

        onPlotCared(
          true,
          `Tepat Sekali! Kamu menggunakan ${currentChallenge.correctToolName}. ${currentChallenge.explanation}`,
          currentChallenge.points
        );

        setTimeout(() => {
          if (currentIndex + 1 < challenges.length) {
            setCurrentIndex((prev) => prev + 1);
            setIsSuccessSolved(false);
            draggedToolRef.current = { key: null, x: 0, y: 0, isDragging: false };
          } else {
            onMissionComplete();
          }
        }, 1600);
      } else {
        soundManager.playError();
        let customErrorMsg = 'Alat ini kurang sesuai dengan gejala tanaman saat ini!';
        if (currentChallenge.correctTool === 'gembor') {
          customErrorMsg = 'Tanah bibit ini sedang kering retak dan dehidrasi akut. Ambil 💧 Gembor Air Bersih untuk menyiram!';
        } else if (currentChallenge.correctTool === 'pupuk') {
          customErrorMsg = 'Daun menguning (klorosis) menandakan kekurangan unsur hara. Berikan 🌱 Pupuk Kompos Organik!';
        } else if (currentChallenge.correctTool === 'sekop') {
          customErrorMsg = 'Akar bibit sedang tercekik alang-alang parasit. Ambil 🧑‍🌾 Sekop Penyiang Gulma untuk mencabut rumput liar!';
        } else if (currentChallenge.correctTool === 'semprotan') {
          customErrorMsg = 'Daun sedang dirusak koloni kutu dan hama. Semprotkan 🌿 Pestisida Nabati Ekstrak Daun Mimba!';
        } else if (currentChallenge.correctTool === 'ajir') {
          customErrorMsg = 'Batang pohon miring terancam roboh oleh badai. Pasangkan 🎋 Ajir Bambu & Tali Penyangga!';
        } else if (currentChallenge.correctTool === 'gunting') {
          customErrorMsg = 'Ranting yang patah dan membusuk harus dipotong dengan ✂️ Gunting Pruning agar infeksi jamur tidak menjalar!';
        }
        onPlotCared(false, customErrorMsg, 0);
      }
    },
    [isSuccessSolved, currentChallenge, currentIndex, challenges.length, onPlotCared, onMissionComplete]
  );

  // Canvas coordinate helpers
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
    const { x, y } = getCanvasCoords(e);
    mousePosRef.current = { x, y, isDown: true };

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if clicked in bottom tool rack
    if (y > canvas.height - 85) {
      const toolWidth = canvas.width / toolsList.length;
      const index = Math.floor(x / toolWidth);
      if (index >= 0 && index < toolsList.length) {
        const selected = toolsList[index].key;
        draggedToolRef.current = {
          key: selected,
          x,
          y,
          isDragging: true,
        };
        soundManager.playClick();
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    mousePosRef.current.x = x;
    mousePosRef.current.y = y;

    if (draggedToolRef.current.isDragging) {
      draggedToolRef.current.x = x;
      draggedToolRef.current.y = y;
    }
  };

  const handlePointerUp = () => {
    mousePosRef.current.isDown = false;
    if (draggedToolRef.current.isDragging) {
      const toolKey = draggedToolRef.current.key;
      draggedToolRef.current.isDragging = false;

      const canvas = canvasRef.current;
      if (canvas && toolKey) {
        // Dropped on center plant zone?
        const plantCenterX = canvas.width / 2;
        const plantCenterY = canvas.height * 0.44;
        const distToPlant = Math.hypot(draggedToolRef.current.x - plantCenterX, draggedToolRef.current.y - plantCenterY);

        if (distToPlant < 160 || draggedToolRef.current.y < canvas.height - 110) {
          handleApplyTool(toolKey);
        }
      }
      draggedToolRef.current.key = null;
    }
  };

  // Main Canvas Render Loop (Realistic Tree + Symptoms + Tools + MediaPipe Hands + Dual Control)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Canvas Background (Webcam stream OR High-Fidelity Conservation Lab)
      if (cameraActive && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, w, h);
        ctx.restore();

        // Dark forest tint for legibility
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(0, 0, w, h);

        // Futuristic grid
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
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
        // Realistic Wonogiri Rainforest Sanctuary Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#022c22');
        bgGrad.addColorStop(0.5, '#064e3b');
        bgGrad.addColorStop(0.85, '#0f172a');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Warm sunlight rays from top canopy
        const sunRadial = ctx.createRadialGradient(w * 0.75, 40, 10, w * 0.75, 40, 260);
        sunRadial.addColorStop(0, 'rgba(253, 224, 71, 0.25)');
        sunRadial.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = sunRadial;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Draw Single Focal Realistic Tree at Center
      const treeCenterX = w / 2;
      const treeCenterY = h * 0.44;

      // Drop zone target circle if tool is dragged
      const isTargetActive = draggedToolRef.current.isDragging;
      if (isTargetActive) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(treeCenterX, treeCenterY + 10, 110, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      drawRealisticForestryTree(
        ctx,
        treeCenterX,
        treeCenterY,
        currentChallenge.conditionType,
        isSuccessSolved
      );

      // Species Tag Badge on Canvas
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = isSuccessSolved ? '#34d399' : '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 150, 16, 300, 30, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = isSuccessSolved ? '#4ade80' : '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(
        isSuccessSolved ? '🎉 BIBIT BERHASIL PULIH & SUBUR!' : `🌳 ${currentChallenge.species}`,
        w / 2,
        36
      );
      ctx.restore();

      // 3. Draw Bottom Tool Rack Directly on Canvas
      const toolRackY = h - 42;
      const toolWidth = w / toolsList.length;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, h - 80, w, 80);
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h - 80);
      ctx.lineTo(w, h - 80);
      ctx.stroke();

      for (let i = 0; i < toolsList.length; i++) {
        const tool = toolsList[i];
        const toolX = i * toolWidth + toolWidth / 2;
        const isHovered =
          Math.hypot(mousePosRef.current.x - toolX, mousePosRef.current.y - toolRackY) < toolWidth / 2;

        drawRealisticForestryTool(ctx, tool.key, toolX, toolRackY - 14, 46, isHovered);

        // Tool label
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = tool.category === 'danger' ? '#f87171' : '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(tool.name, toolX, toolRackY + 22);
      }

      // 4. MediaPipe Hands Skeleton & Dual Control Gestures
      const handCanvasX = handState.x * w;
      const handCanvasY = handState.y * h;

      if (cameraActive && handState.landmarks) {
        drawMediaPipeHand(ctx, handState.landmarks, handState.isGrabbing, w, h, true);

        // MediaPipe Pinch Tool Detection:
        if (handState.isGrabbing && !draggedToolRef.current.isDragging) {
          // If pinching in the tool rack:
          if (handCanvasY > h - 85) {
            const index = Math.floor(handCanvasX / toolWidth);
            if (index >= 0 && index < toolsList.length) {
              const selected = toolsList[index].key;
              draggedToolRef.current = {
                key: selected,
                x: handCanvasX,
                y: handCanvasY,
                isDragging: true,
              };
              soundManager.playClick();
            }
          }
        }

        // If dragging via hand pinch, follow hand
        if (draggedToolRef.current.isDragging && handState.isGrabbing) {
          draggedToolRef.current.x = handCanvasX;
          draggedToolRef.current.y = handCanvasY;
        }

        // Release check when pinch is opened
        if (draggedToolRef.current.isDragging && !handState.isGrabbing && !mousePosRef.current.isDown) {
          const toolKey = draggedToolRef.current.key;
          draggedToolRef.current.isDragging = false;
          if (toolKey) {
            const distToPlant = Math.hypot(draggedToolRef.current.x - treeCenterX, draggedToolRef.current.y - treeCenterY);
            if (distToPlant < 160 || draggedToolRef.current.y < h - 110) {
              handleApplyTool(toolKey);
            }
          }
          draggedToolRef.current.key = null;
        }
      }

      // 5. Draw Currently Dragged Tool floating on cursor/hand
      if (draggedToolRef.current.isDragging && draggedToolRef.current.key) {
        drawRealisticForestryTool(
          ctx,
          draggedToolRef.current.key,
          draggedToolRef.current.x,
          draggedToolRef.current.y,
          64,
          true
        );

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(
          'Lepaskan di pohon untuk menerapkan!',
          draggedToolRef.current.x,
          draggedToolRef.current.y + 45
        );
      }

      // 6. Dual Control HUD Banner on Canvas
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(14, 14, 270, 48, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('🌿 DUAL CONTROL: KLINIK POHON', 24, 32);

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(
        cameraActive
          ? (handState.isDetected ? '📷 Tangan Terdeteksi (Jepit Alat)' : '📷 Mencari Tangan... / Pakai Mouse')
          : '🖱️ Sentuh/Mouse Aktif (Nyalakan AR Kamera)',
        24,
        48
      );
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    cameraActive,
    currentChallenge,
    handState,
    handleApplyTool,
    isSuccessSolved,
    toolsList,
    videoRef,
  ]);

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-4xl mx-auto h-full min-h-[540px] p-2 sm:p-4 text-slate-100 select-none">
      {/* Header Info & Dual Control Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Misi 2: Dokter Pohon & Konservasi
            </span>
            <span className="text-xs font-mono text-cyan-300 bg-slate-800 px-2 py-0.5 rounded-md">
              Situasi {currentIndex + 1} / {challenges.length}
            </span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
            Benda Muncul Satu per Satu — Analisis Gejala & Ambil Alat yang Tepat!
          </h2>
        </div>

        {/* Dual Control & AR Toggle Button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300">
            <Hand className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gestur Jepit</span>
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
          <span>Memuat MediaPipe Hands & Sensor Kamera AR... Silakan tunggu sejenak!</span>
        </div>
      )}
      {cameraError && (
        <div className="w-full bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs py-1.5 px-3 rounded-xl mb-2 flex items-center justify-between">
          <span>⚠️ {cameraError}</span>
          <span className="font-bold underline">Mode Sentuh/Mouse Tetap Aktif!</span>
        </div>
      )}

      {/* MAIN AR CANVAS (Direct MediaPipe Hands + Realistic Tree & Tools + Dual Control) */}
      <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9.5] rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl bg-slate-950">
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

        {/* Clinical Symptom Observation Overlay (No giveaway actions) */}
        <div className="absolute top-3 right-3 max-w-[280px] bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-xs shadow-xl hidden md:block">
          <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
            <span className="flex items-center gap-1">🩺 Gejala Klinis</span>
            <span className="text-[10px] bg-amber-950 border border-amber-500/50 px-1.5 py-0.5 rounded text-amber-200">
              {currentChallenge.diagnosis}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {currentChallenge.description}
          </p>
        </div>
      </div>

      {/* Direct Interactive Tool Rack Buttons (Touch / Click Access) */}
      <div className="w-full max-w-3xl mt-2.5">
        <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center justify-between">
          <span>🧰 Rak Peralatan Konservasi (Klik langsung atau seret ke pohon):</span>
          <span className="text-cyan-400 font-semibold">Pilih tindakan konservasi yang tepat</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {toolsList.map((tool) => {
            const isDanger = tool.category === 'danger';

            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => handleApplyTool(tool.key)}
                disabled={isSuccessSolved}
                className={`py-2 px-2.5 rounded-xl border flex items-center gap-2 text-left transition-all duration-150 cursor-pointer ${
                  isSuccessSolved
                    ? 'opacity-50 cursor-not-allowed'
                    : isDanger
                    ? 'bg-slate-900 hover:bg-rose-950/60 border-rose-500/40 text-rose-300 hover:scale-101'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-400 text-slate-200 hover:scale-101 shadow-sm'
                }`}
              >
                <span className="text-xl shrink-0">
                  {tool.key === 'gembor'
                    ? '💧'
                    : tool.key === 'pupuk'
                    ? '🌱'
                    : tool.key === 'sekop'
                    ? '🧑‍🌾'
                    : tool.key === 'semprotan'
                    ? '🌿'
                    : tool.key === 'ajir'
                    ? '🎋'
                    : tool.key === 'gunting'
                    ? '✂️'
                    : tool.key === 'kapak'
                    ? '🪓'
                    : '🔥'}
                </span>
                <div className="truncate">
                  <div className="text-xs font-bold truncate">{tool.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{tool.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
