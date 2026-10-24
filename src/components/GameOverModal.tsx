import React from 'react';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  reason: 'lives' | 'time';
  onRetry: () => void;
  onExit: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  reason,
  onRetry,
  onExit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-600/70 rounded-3xl p-6 text-center space-y-4 shadow-2xl text-slate-100">
        <div className="w-16 h-16 rounded-full bg-rose-950 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white font-display">
          {reason === 'lives' ? 'NYAWA HABIS!' : 'WAKTU MISI BERAKHIR!'}
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          {reason === 'lives'
            ? 'Bumi membutuhkan lebih banyak ketelitian dan keteladanan. Jangan putus asa, setiap kesalahan adalah proses belajar menjadi Khalifah Bumi sejati!'
            : 'Waktu misi telah habis. Latih kecepatan dan ketepatan berpikir kritis (Critical Thinking) kamu kembali!'}
        </p>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Poin Amal Terkumpul</span>
          <span className="text-2xl font-black font-mono text-amber-400">{score}</span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
          <button
            onClick={onExit}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar ke Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
