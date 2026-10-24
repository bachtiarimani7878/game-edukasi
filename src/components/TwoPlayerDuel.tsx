import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Trophy, Swords, RefreshCw, X } from 'lucide-react';
import { WasteItemSvg } from './Svgs';

interface TwoPlayerDuelProps {
  onClose: () => void;
}

interface DuelQuestion {
  item: string;
  svgKey: string;
  category: 'organik' | 'anorganik' | 'b3';
  fact: string;
}

const DUEL_QUESTIONS: DuelQuestion[] = [
  { item: 'Kulit Pisang', svgKey: 'kulit_pisang', category: 'organik', fact: 'Alami membusuk jadi kompos (±2–5 minggu)' },
  { item: 'Botol Plastik PET', svgKey: 'botol_plastik', category: 'anorganik', fact: 'Wajib didaur ulang, urai ±450 tahun!' },
  { item: 'Baterai Bekas', svgKey: 'baterai_bekas', category: 'b3', fact: 'Beracun! Mengandung logam berat berbahaya' },
  { item: 'Sisa Apel', svgKey: 'sisa_apel', category: 'organik', fact: 'Menyuburkan tanah tanaman' },
  { item: 'Kaleng Minuman', svgKey: 'kaleng_aluminium', category: 'anorganik', fact: 'Logam bisa dilebur kembali di pabrik' },
  { item: 'Bohlam Neon Pecah', svgKey: 'bohlam_neon', category: 'b3', fact: 'Pecahan tajam & uap merkuri beracun' },
  { item: 'Daun Kering', svgKey: 'daun_kering', category: 'organik', fact: 'Bahan baku utama pupuk kompos' },
  { item: 'Kardus Karton', svgKey: 'kardus_koran', category: 'anorganik', fact: 'Dapat didaur ulang menjadi bubur kertas' },
  { item: 'Kaleng Pestisida', svgKey: 'pestisida', category: 'b3', fact: 'Kemasan zat kimia bertekanan tinggi' },
];

export const TwoPlayerDuel: React.FC<TwoPlayerDuelProps> = ({ onClose }) => {
  const [qIndex, setQIndex] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Answered, setP1Answered] = useState<string | null>(null);
  const [p2Answered, setP2Answered] = useState<string | null>(null);
  const [roundOver, setRoundOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentQ = DUEL_QUESTIONS[qIndex];

  const handleP1Choice = (choice: 'organik' | 'anorganik' | 'b3') => {
    if (p1Answered || roundOver) return;
    soundManager.playClick();
    setP1Answered(choice);
    checkRoundStatus(choice, p2Answered);
  };

  const handleP2Choice = (choice: 'organik' | 'anorganik' | 'b3') => {
    if (p2Answered || roundOver) return;
    soundManager.playClick();
    setP2Answered(choice);
    checkRoundStatus(p1Answered, choice);
  };

  const checkRoundStatus = (ans1: string | null, ans2: string | null) => {
    if (ans1 && ans2) {
      setRoundOver(true);
      const p1Correct = ans1 === currentQ.category;
      const p2Correct = ans2 === currentQ.category;

      if (p1Correct) setP1Score((prev) => prev + 100);
      if (p2Correct) setP2Score((prev) => prev + 100);

      if (p1Correct || p2Correct) {
        soundManager.playSuccess();
      } else {
        soundManager.playError();
      }

      setTimeout(() => {
        if (qIndex + 1 < DUEL_QUESTIONS.length) {
          setQIndex(qIndex + 1);
          setP1Answered(null);
          setP2Answered(null);
          setRoundOver(false);
        } else {
          setGameOver(true);
        }
      }, 1500);
    }
  };

  const handleRestart = () => {
    setQIndex(0);
    setP1Score(0);
    setP2Score(0);
    setP1Answered(null);
    setP2Answered(null);
    setRoundOver(false);
    setGameOver(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border-2 border-emerald-500/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h2 className="font-extrabold text-sm sm:text-base text-emerald-400 font-display">
              MODE 2 PEMAIN: KOMPETISI SPLIT-SCREEN DUEL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Arena Screen */}
        {!gameOver ? (
          <div className="flex-1 flex flex-col justify-between p-4">
            {/* Center Target Card */}
            <div className="flex flex-col items-center text-center py-2 bg-slate-950/60 rounded-2xl border border-slate-800 max-w-md mx-auto w-full shadow-inner">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Ronde #{qIndex + 1} dari {DUEL_QUESTIONS.length}
              </span>
              <div className="py-2">
                <WasteItemSvg itemKey={currentQ.svgKey} size={76} />
              </div>
              <h3 className="font-bold text-base text-white">{currentQ.item}</h3>
              <p className="text-xs text-amber-300 mt-0.5">{currentQ.fact}</p>
              {roundOver && (
                <div className="mt-2 text-xs font-bold text-emerald-400 animate-pulse">
                  Jawaban Benar: TONG {currentQ.category.toUpperCase()}!
                </div>
              )}
            </div>

            {/* SPLIT SCREEN CONTROLLERS */}
            <div className="grid grid-cols-2 gap-4 flex-1 mt-4">
              {/* PLAYER 1 (KIRI) */}
              <div className="bg-emerald-950/30 border-2 border-emerald-600/60 rounded-2xl p-4 flex flex-col justify-between text-center shadow-lg">
                <div className="space-y-1">
                  <span className="font-extrabold text-emerald-400 text-sm block">
                    👤 PEMAIN 1 (Kiri)
                  </span>
                  <div className="text-2xl font-black font-mono text-white">
                    {p1Score} <span className="text-xs text-emerald-300 font-sans">Poin</span>
                  </div>
                  {p1Answered && (
                    <span className="inline-block text-xs font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded-full border border-cyan-500/40">
                      Telah Memilih: {p1Answered.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => handleP1Choice('organik')}
                    disabled={!!p1Answered || roundOver}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform disabled:opacity-40 cursor-pointer"
                  >
                    🟢 ORGANIK
                  </button>
                  <button
                    onClick={() => handleP1Choice('anorganik')}
                    disabled={!!p1Answered || roundOver}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform disabled:opacity-40 cursor-pointer"
                  >
                    🟡 ANORGANIK
                  </button>
                  <button
                    onClick={() => handleP1Choice('b3')}
                    disabled={!!p1Answered || roundOver}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform disabled:opacity-40 cursor-pointer"
                  >
                    🔴 B3 BERACUN
                  </button>
                </div>
              </div>

              {/* PLAYER 2 (KANAN) */}
              <div className="bg-blue-950/30 border-2 border-blue-600/60 rounded-2xl p-4 flex flex-col justify-between text-center shadow-lg">
                <div className="space-y-1">
                  <span className="font-extrabold text-blue-400 text-sm block">
                    👥 PEMAIN 2 (Kanan)
                  </span>
                  <div className="text-2xl font-black font-mono text-white">
                    {p2Score} <span className="text-xs text-blue-300 font-sans">Poin</span>
                  </div>
                  {p2Answered && (
                    <span className="inline-block text-xs font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded-full border border-cyan-500/40">
                      Telah Memilih: {p2Answered.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => handleP2Choice('organik')}
                    disabled={!!p2Answered || roundOver}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform disabled:opacity-40 cursor-pointer"
                  >
                    🟢 ORGANIK
                  </button>
                  <button
                    onClick={() => handleP2Choice('anorganik')}
                    disabled={!!p2Answered || roundOver}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform disabled:opacity-40 cursor-pointer"
                  >
                    🟡 ANORGANIK
                  </button>
                  <button
                    onClick={() => handleP2Choice('b3')}
                    disabled={!!p2Answered || roundOver}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform disabled:opacity-40 cursor-pointer"
                  >
                    🔴 B3 BERACUN
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* DUEL GAME OVER CHAMPION ANNOUNCEMENT */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              {p1Score > p2Score
                ? '🏆 PEMAIN 1 ADALAH JUARA KHALIFAH BUMI!'
                : p2Score > p1Score
                ? '🏆 PEMAIN 2 ADALAH JUARA KHALIFAH BUMI!'
                : '🤝 HASIL SERI! DUA KHALIFAH HEBAT BERSAUDARA!'}
            </h3>
            <div className="flex items-center gap-8 text-lg font-mono">
              <span className="text-emerald-400 font-bold">Pemain 1: {p1Score} Poin</span>
              <span className="text-slate-500">VS</span>
              <span className="text-blue-400 font-bold">Pemain 2: {p2Score} Poin</span>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tanding Ulang</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer"
              >
                Kembali ke Solo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
