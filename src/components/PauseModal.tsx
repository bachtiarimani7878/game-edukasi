import React from 'react';
import { Play, RotateCcw, LogOut } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onExit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center space-y-4 shadow-2xl text-slate-100">
        <h2 className="text-xl font-black text-white font-display">PERMAINAN DIJEDA</h2>
        <p className="text-xs text-slate-300">
          Istirahat sejenak sambil mengingat peran mulia sebagai Khalifah fil Ardh!
        </p>

        <div className="space-y-2 pt-2">
          <button
            onClick={onResume}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Play className="w-4 h-4" />
            <span>Lanjutkan Permainan</span>
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Misi Ini</span>
          </button>
          <button
            onClick={onExit}
            className="w-full py-2.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-rose-800/60 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar ke Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
