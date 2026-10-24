import React, { useState, useEffect } from 'react';
import { WordScramblePuzzle } from '../../types/game';
import { WordScrambleSvg } from '../Svgs';
import { soundManager } from '../../utils/audio';
import { Lightbulb, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Mission4WordScrambleProps {
  onWordSolved: (isCorrect: boolean, feedback: string, points: number) => void;
  onMissionComplete: () => void;
}

const PUZZLES: WordScramblePuzzle[] = [
  {
    id: 1,
    keyword: 'REDUCE',
    principle: 'Prinsip 3R #1: Cegah & Kurangi Timbulan Sampah',
    clue: 'Prinsip 3R pertama: MENGURANGI penggunaan barang sekali pakai dari sumbernya (seperti membawa botol tumbler & tas kain) agar tidak menumpuk jadi sampah.',
    svgKey: 'REDUCE',
    scrambled: ['D', 'U', 'R', 'C', 'E', 'E'],
  },
  {
    id: 2,
    keyword: 'REUSE',
    principle: 'Prinsip 3R #2: Guna Ulang Langsung',
    clue: 'Prinsip 3R kedua: MEMAKAI KEMBALI barang bekas yang masih layak pakai untuk fungsi yang sama atau disulap menjadi fungsi kreatif baru (seperti toples bumbu atau pot tanaman).',
    svgKey: 'REUSE',
    scrambled: ['E', 'U', 'R', 'E', 'S'],
  },
  {
    id: 3,
    keyword: 'RECYCLE',
    principle: 'Prinsip 3R #3: Daur Ulang Menjadi Produk Baru',
    clue: 'Prinsip 3R ketiga: MENDAUR ULANG sampah melalui proses peleburan pabrik menjadi bahan baku atau produk bernilai ekonomi baru.',
    svgKey: 'RECYCLE',
    scrambled: ['Y', 'C', 'R', 'L', 'E', 'C', 'E'],
  },
  {
    id: 4,
    keyword: 'KOMPOS',
    principle: 'Nutrisi Alami dari Sampah Organik',
    clue: 'Pupuk alami kaya nutrisi hasil penguraian sampah organik daun dan sisa makanan oleh mikroba pengurai.',
    svgKey: 'KOMPOS',
    scrambled: ['M', 'O', 'P', 'K', 'S', 'O'],
  },
  {
    id: 5,
    keyword: 'HEMAT',
    principle: 'Adab Bijak Menggunakan Air & Listrik',
    clue: 'Sikap terpuji menggunakan air bersih dan energi listrik secukupnya sesuai kebutuhan serta tidak mubazir.',
    svgKey: 'HEMAT',
    scrambled: ['T', 'E', 'H', 'M', 'A'],
  },
];

export const Mission4WordScramble: React.FC<Mission4WordScrambleProps> = ({
  onWordSolved,
  onMissionComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentPuzzle = PUZZLES[currentIdx];

  // Available letter tiles (with unique ids so duplicate letters don't collide)
  const [availableTiles, setAvailableTiles] = useState<{ id: number; char: string }[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<{ id: number; char: string }[]>([]);

  useEffect(() => {
    if (!currentPuzzle) return;
    setAvailableTiles(
      currentPuzzle.scrambled.map((c, i) => ({ id: i, char: c }))
    );
    setSelectedTiles([]);
  }, [currentIdx, currentPuzzle]);

  const handleSelectTile = (tile: { id: number; char: string }) => {
    soundManager.playClick();
    setAvailableTiles(availableTiles.filter((t) => t.id !== tile.id));
    const nextSelected = [...selectedTiles, tile];
    setSelectedTiles(nextSelected);

    // Auto-check when all letters are placed
    if (nextSelected.length === currentPuzzle.keyword.length) {
      const formedWord = nextSelected.map((t) => t.char).join('');
      if (formedWord === currentPuzzle.keyword) {
        soundManager.playSuccess();
        onWordSolved(
          true,
          `Hebat! Kata "${currentPuzzle.keyword}" berhasil disusun. ${currentPuzzle.clue}`,
          120
        );

        if (currentIdx + 1 < PUZZLES.length) {
          setTimeout(() => {
            setCurrentIdx(currentIdx + 1);
          }, 800);
        } else {
          setTimeout(() => {
            onMissionComplete();
          }, 800);
        }
      } else {
        soundManager.playError();
        onWordSolved(
          false,
          `Kata "${formedWord}" belum tepat. Tekan tombol [🔄 Acak Ulang] untuk mencoba kembali!`,
          0
        );
      }
    }
  };

  const handleRemoveTile = (tile: { id: number; char: string }) => {
    soundManager.playClick();
    setSelectedTiles(selectedTiles.filter((t) => t.id !== tile.id));
    setAvailableTiles([...availableTiles, tile]);
  };

  const handleResetPuzzle = () => {
    soundManager.playClick();
    setAvailableTiles(
      currentPuzzle.scrambled.map((c, i) => ({ id: i, char: c }))
    );
    setSelectedTiles([]);
  };

  const handleHint = () => {
    soundManager.playClick();
    // Reveal next correct letter if possible
    const currentCorrectLength = selectedTiles.length;
    const targetChar = currentPuzzle.keyword[currentCorrectLength];
    const candidateTile = availableTiles.find((t) => t.char === targetChar);
    if (candidateTile) {
      handleSelectTile(candidateTile);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-4xl mx-auto h-full min-h-[500px] p-4 text-slate-100">
      {/* Header */}
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
          Misi 4: Susun Kata Ekologi & Prinsip 3R
        </span>
        <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
          Klik huruf-huruf acak di bawah untuk merangkai istilah pelestarian lingkungan yang tepat!
        </p>
        <span className="text-xs text-slate-400 font-mono mt-0.5 block">
          Teka-Teki #{currentIdx + 1} dari {PUZZLES.length}
        </span>
      </div>

      {/* Main Puzzle Card */}
      {currentPuzzle && (
        <div className="bg-slate-800/90 border-2 border-slate-700/80 rounded-2xl p-5 w-full max-w-2xl shadow-2xl flex flex-col items-center text-center space-y-4 animate-fadeIn">
          {/* Principle Badge */}
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-xs font-bold text-emerald-300">
            {currentPuzzle.principle}
          </div>

          {/* SVG Illustration */}
          <div className="py-1">
            <WordScrambleSvg wordKey={currentPuzzle.svgKey} size={110} />
          </div>

          {/* Clue Box */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed max-w-lg">
            <strong className="text-amber-400 block mb-0.5">Petunjuk Definisi:</strong>
            {currentPuzzle.clue}
          </div>

          {/* Target Word Slots */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Kata yang Disusun:</span>
            <div className="flex items-center justify-center gap-2 flex-wrap min-h-[52px]">
              {Array.from({ length: currentPuzzle.keyword.length }).map((_, idx) => {
                const tile = selectedTiles[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => tile && handleRemoveTile(tile)}
                    disabled={!tile}
                    className={`w-11 h-12 rounded-xl text-lg font-extrabold flex items-center justify-center transition-all border-2 shadow-inner ${
                      tile
                        ? 'bg-emerald-600 text-white border-emerald-400 cursor-pointer hover:bg-emerald-700'
                        : 'bg-slate-900/80 text-transparent border-dashed border-slate-700'
                    }`}
                  >
                    {tile ? tile.char : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrambled Available Letters */}
          <div className="space-y-1 pt-2 w-full">
            <span className="text-[11px] font-semibold text-slate-400">Pilih Huruf:</span>
            <div className="flex items-center justify-center gap-2 flex-wrap min-h-[48px]">
              {availableTiles.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleSelectTile(tile)}
                  className="w-10 h-11 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-extrabold text-base rounded-xl border border-slate-500 shadow-md transition-transform cursor-pointer"
                >
                  {tile.char}
                </button>
              ))}
              {availableTiles.length === 0 && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Seluruh huruf telah ditempatkan!
                </span>
              )}
            </div>
          </div>

          {/* Control Buttons (Hint & Reset) */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleHint}
              disabled={selectedTiles.length >= currentPuzzle.keyword.length}
              className="px-3.5 py-1.5 bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-amber-500 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Petunjuk Huruf</span>
            </button>
            <button
              type="button"
              onClick={handleResetPuzzle}
              className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Acak Ulang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
