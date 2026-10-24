import React from 'react';
import { LogoWithFallback } from './Svgs';
import { Volume2, VolumeX, Camera, Pause, Play, LogOut, ZoomIn, ZoomOut, Heart } from 'lucide-react';

interface HeaderHUDProps {
  currentMissionIndex: number; // 0 to 5
  missionTitle: string;
  earthHealth: number; // 0 to 100
  score: number;
  lives: number;
  maxLives: number;
  timeRemaining: number;
  isPaused: boolean;
  soundEnabled: boolean;
  arEnabled: boolean;
  fontSizeMultiplier: number;
  onTogglePause: () => void;
  onToggleSound: () => void;
  onToggleAR: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExitGame: () => void;
  onOpenInfo: () => void;
  onOpenMissionMap: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  currentMissionIndex,
  missionTitle,
  earthHealth,
  score,
  lives,
  maxLives,
  timeRemaining,
  isPaused,
  soundEnabled,
  arEnabled,
  fontSizeMultiplier,
  onTogglePause,
  onToggleSound,
  onToggleAR,
  onZoomIn,
  onZoomOut,
  onExitGame,
  onOpenInfo,
  onOpenMissionMap,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800 text-slate-100 px-3 sm:px-6 py-2.5 backdrop-blur-md sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Creator Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <LogoWithFallback
              src="https://i.imgur.com/5isghy7.png"
              alt="Logo Resmi PGRI"
              type="pgri"
              size={36}
            />
            <LogoWithFallback
              src="https://i.imgur.com/RVQBxN6.png"
              alt="Logo Resmi Wonogiri"
              type="wonogiri"
              size={36}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-emerald-400 font-display">
                  PENJAGA BUMI
                </span>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                  FASE C
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[210px] sm:max-w-xs">
                Bachtiar Imani, S.Pd. · SDN 2 Girimarto (Wonogiri)
              </p>
            </div>
          </div>

          {/* Quick Action Buttons Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenMissionMap}
              className="text-xs bg-emerald-950 hover:bg-emerald-900 text-emerald-300 px-2.5 py-1.5 rounded-lg border border-emerald-500/50 flex items-center gap-1 font-bold cursor-pointer shadow-sm"
              title="Buka Peta Misi"
            >
              🗺️ Peta
            </button>
            <button
              onClick={onOpenInfo}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              📖 Info
            </button>
          </div>
        </div>

        {/* Central HUD Metrics (Mission, Health Bar, Lives, Score, Timer) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full md:w-auto">
          {/* Mission & Health Bar */}
          <div className="flex flex-col items-center min-w-[130px] sm:min-w-[170px]">
            <div className="flex items-center justify-between w-full text-[11px] font-semibold text-slate-300">
              <span className="truncate max-w-[110px] text-emerald-300">
                Misi {currentMissionIndex + 1}/6: {missionTitle}
              </span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(earthHealth)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700 mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(4, Math.min(100, earthHealth))}%` }}
              />
            </div>
          </div>

          {/* Lives (Hearts) */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 transition-colors ${
                  i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Score (Poin Amal) */}
          <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-center">
            <span className="text-[9px] text-slate-400 block -mb-0.5">Poin Amal</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 tabular-nums">
              {score}
            </span>
          </div>

          {/* Timer */}
          <div
            className={`px-2.5 py-1 rounded-lg border text-center font-mono text-xs sm:text-sm font-bold tabular-nums ${
              timeRemaining <= 10
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-cyan-300'
            }`}
          >
            <span className="text-[9px] text-slate-400 block -mb-0.5">Sisa Waktu</span>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Right Controls Deck */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer ${
              isPaused
                ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isPaused ? 'Lanjutkan Permainan' : 'Jeda Permainan'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
                : 'bg-slate-800/60 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* AR Camera Toggle */}
          <button
            onClick={onToggleAR}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer ${
              arEnabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Kamera AR Eco-Scanner"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AR</span>
          </button>

          {/* UI Font Zoom Controls */}
          <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg border border-slate-700 p-0.5">
            <button
              onClick={onZoomOut}
              disabled={fontSizeMultiplier <= 0.9}
              className="px-1.5 py-0.5 text-xs text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Perkecil Teks (A-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onZoomIn}
              disabled={fontSizeMultiplier >= 1.25}
              className="px-1.5 py-0.5 text-xs text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Perbesar Teks (A+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Peta Misi Button Desktop */}
          <button
            onClick={onOpenMissionMap}
            className="hidden md:flex text-xs bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold px-3 py-1.5 rounded-lg border border-emerald-500/50 items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            title="Buka Peta & Lompat ke Misi Lain"
          >
            🗺️ Peta Misi
          </button>

          {/* Info Button Desktop */}
          <button
            onClick={onOpenInfo}
            className="hidden md:flex text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 items-center gap-1 cursor-pointer"
          >
            📖 Info
          </button>

          {/* Exit Game */}
          <button
            onClick={onExitGame}
            className="p-1.5 rounded-lg text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-colors cursor-pointer"
            title="Keluar ke Menu Utama"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
