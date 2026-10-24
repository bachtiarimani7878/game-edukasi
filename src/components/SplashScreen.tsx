import React from 'react';
import { LogoWithFallback } from './Svgs';
import { ThreeEarth } from './ThreeEarth';
import { DifficultyLevel, GameMode } from '../types/game';
import { Play, BookOpen, Users, User, ShieldCheck, Map } from 'lucide-react';

interface SplashScreenProps {
  difficulty: DifficultyLevel;
  mode: GameMode;
  onSelectDifficulty: (d: DifficultyLevel) => void;
  onSelectMode: (m: GameMode) => void;
  onStartGame: () => void;
  onOpenEducationInfo: () => void;
  onOpenMissionMap: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  difficulty,
  mode,
  onSelectDifficulty,
  onSelectMode,
  onStartGame,
  onOpenEducationInfo,
  onOpenMissionMap,
}) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full max-w-6xl mx-auto p-4 sm:p-6 text-slate-100 animate-fadeIn">
      {/* Top Header Logos & Competition Banner */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Logos & Institution Lockup */}
        <div className="flex items-center gap-3">
          <LogoWithFallback
            src="https://i.imgur.com/5isghy7.png"
            alt="Logo Resmi PGRI"
            type="pgri"
            size={48}
          />
          <LogoWithFallback
            src="https://i.imgur.com/RVQBxN6.png"
            alt="Logo Resmi Pemkab Wonogiri"
            type="wonogiri"
            size={48}
          />
          <div>
            <span className="text-[11px] font-bold text-emerald-400 block tracking-wide uppercase">
              HUT Ke-81 PGRI & Hari Guru Nasional (HGN) Tahun 2026
            </span>
            <span className="text-xs text-slate-300">
              PGRI Kabupaten Wonogiri — Jawa Tengah
            </span>
          </div>
        </div>

        {/* Creator Identity Badge */}
        <div className="bg-slate-800/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-right sm:text-left">
            <span className="font-bold text-white block">Bachtiar Imani, S.Pd.</span>
            <span className="text-[10px] text-slate-400">
              SDN 2 Girimarto · PGRI Cabang Girimarto
            </span>
          </div>
        </div>
      </div>

      {/* Main Hero Section (Title + 3D Earth Globe + Subtitle) */}
      <div className="flex flex-col items-center text-center my-4 space-y-3">
        <div className="inline-block px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-xs font-bold text-emerald-300">
          🌱 TEMA: GURU KREATIF, AI PRODUKTIF, PEMBELAJARAN INTERAKTIF
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight">
          PENJAGA BUMI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">NUSANTARA</span>
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed">
          Game Edukasi Interaktif Pelestarian Lingkungan Biotik & Abiotik berbasis Artificial Intelligence untuk <strong>Peserta Didik SD/MI Fase C (Kelas 5–6)</strong>
        </p>

        {/* Interactive 3D Planet Earth */}
        <div className="py-2 flex flex-col items-center">
          <div className="w-[240px] h-[240px] aspect-square rounded-full flex items-center justify-center relative">
            <ThreeEarth healthIndex={85} size={240} interactive={true} />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 font-mono">
            🔄 Sentuh & geser bola bumi 3D untuk memutar 360°
          </span>
        </div>
      </div>

      {/* Setup Options (Game Mode & Difficulty) */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        {/* Game Mode Selector */}
        <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wide">
            1. Pilih Mode Permainan:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectMode('solo')}
              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                mode === 'solo'
                  ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <User className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-xs">1 Pemain</span>
              <span className="text-[10px] text-slate-400">Petualangan Solo</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('two_player')}
              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                mode === 'two_player'
                  ? 'bg-blue-950/80 border-blue-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-xs">2 Pemain</span>
              <span className="text-[10px] text-slate-400">Split-Screen Duel</span>
            </button>
          </div>
        </div>

        {/* Difficulty Level Selector */}
        <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wide">
            2. Tingkat Kesulitan:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSelectDifficulty('mudah')}
              className={`p-2 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                difficulty === 'mudah'
                  ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className="text-sm">🌱</span>
              <span className="font-bold text-xs">Mudah</span>
              <span className="text-[9px] text-slate-400 mt-0.5">90 dtk · 5❤️</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDifficulty('sedang')}
              className={`p-2 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                difficulty === 'sedang'
                  ? 'bg-amber-950/80 border-amber-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className="text-sm">🌿</span>
              <span className="font-bold text-xs">Sedang</span>
              <span className="text-[9px] text-slate-400 mt-0.5">60 dtk · 3❤️</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDifficulty('sulit')}
              className={`p-2 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                difficulty === 'sulit'
                  ? 'bg-rose-950/80 border-rose-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className="text-sm">🌳</span>
              <span className="font-bold text-xs">HOTS</span>
              <span className="text-[9px] text-slate-400 mt-0.5">45 dtk · 3❤️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 my-4 w-full max-w-xl">
        <button
          type="button"
          onClick={onStartGame}
          className="w-full sm:flex-1 py-3.5 px-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-transform hover:scale-102 active:scale-98 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>🚀 MULAI DARI AWAL</span>
        </button>

        <button
          type="button"
          onClick={onOpenMissionMap}
          className="w-full sm:flex-1 py-3.5 px-5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-extrabold text-xs sm:text-sm rounded-2xl border-2 border-emerald-500/60 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/15 cursor-pointer hover:scale-102"
        >
          <Map className="w-4 h-4 text-emerald-400" />
          <span>🗺️ PETA MISI (PILIH MISI)</span>
        </button>

        <button
          type="button"
          onClick={onOpenEducationInfo}
          className="w-full sm:w-auto py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>📖 Info</span>
        </button>
      </div>

      {/* Footer Copyright */}
      <footer className="text-center text-[11px] text-slate-400 border-t border-slate-800 pt-3 w-full">
        Hak Cipta © 2026 Bachtiar Imani, S.Pd. · SDN 2 Girimarto · PGRI Cabang Girimarto, Kab. Wonogiri
      </footer>
    </div>
  );
};
