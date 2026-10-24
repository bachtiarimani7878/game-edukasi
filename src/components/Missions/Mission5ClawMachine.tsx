import React, { useState } from 'react';
import { ClawItem } from '../../types/game';
import { ClawItemSvg } from '../Svgs';
import { soundManager } from '../../utils/audio';
import { ArrowLeft, ArrowRight, Target, Coins } from 'lucide-react';
import { shuffleArray } from '../../utils/shuffle';

interface Mission5ClawMachineProps {
  onItemProcessed: (
    isCorrect: boolean,
    feedback: string,
    points: number,
    savingsAdded: number
  ) => void;
  bankSavings: number;
  onMissionComplete: () => void;
}

const CLAW_ITEMS: ClawItem[] = [
  {
    id: 1,
    name: 'Bawa Botol Minum Tumbler ke Sekolah',
    station: 'reduce',
    valueRp: 0,
    description: 'Menghemat uang jajan & mengurangi ±300 botol plastik sekali pakai per murid setiap tahun!',
    svgKey: 'claw_tumbler',
  },
  {
    id: 2,
    name: 'Bawa Tas Belanja Kain (Totebag) ke Pasar',
    station: 'reduce',
    valueRp: 0,
    description: 'Mencegah penggunaan kantong plastik kresek sekali pakai yang mencemari lingkungan.',
    svgKey: 'claw_totebag',
  },
  {
    id: 3,
    name: 'Toples Kaca Bekas Selai Jadi Wadah Bumbu',
    station: 'reuse',
    valueRp: 0,
    description: 'Memanfaatkan kembali wadah kaca tebal yang kuat tanpa perlu dilebur ulang di pabrik.',
    svgKey: 'claw_jam_jar',
  },
  {
    id: 4,
    name: 'Kardus Bekas Sepatu Jadi Tempat Alat Tulis',
    station: 'reuse',
    valueRp: 0,
    description: 'Memakai ulang kardus sepatu bekas agar bermanfaat rapi di meja belajar anak.',
    svgKey: 'claw_shoe_box',
  },
  {
    id: 5,
    name: 'Setor 5 Kg Botol Plastik PET ke Bank Sampah',
    station: 'recycle',
    valueRp: 15000,
    description: 'Dilebur di pabrik daur ulang menjadi serat polyester tekstil baru & menambah saldo tabungan sekolah!',
    svgKey: 'claw_plastic_bales',
  },
  {
    id: 6,
    name: 'Setor 10 Kg Kardus Bekas ke Bank Sampah',
    station: 'recycle',
    valueRp: 20000,
    description: 'Diolah kembali menjadi bubur kertas (pulp) ramah lingkungan sehingga menyelamatkan pohon dari penebangan.',
    svgKey: 'claw_cardboard_bales',
  },
];

export const Mission5ClawMachine: React.FC<Mission5ClawMachineProps> = ({
  onItemProcessed,
  bankSavings,
  onMissionComplete,
}) => {
  // Items shuffled so they do not form a static 2-reduce, 2-reuse, 2-recycle pattern
  const [itemsList] = useState<ClawItem[]>(() => shuffleArray(CLAW_ITEMS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [clawX, setClawX] = useState(50); // percentage 10% to 90%
  const [isLowering, setIsLowering] = useState(false);
  const [hasGrabbed, setHasGrabbed] = useState(false);

  const activeItem = itemsList[currentIdx];

  const handleMoveLeft = () => {
    if (isLowering) return;
    soundManager.playClick();
    setClawX((prev) => Math.max(15, prev - 15));
  };

  const handleMoveRight = () => {
    if (isLowering) return;
    soundManager.playClick();
    setClawX((prev) => Math.min(85, prev + 15));
  };

  const handleDropClaw = () => {
    if (isLowering || hasGrabbed) return;
    soundManager.playClaw();
    setIsLowering(true);

    setTimeout(() => {
      setHasGrabbed(true);
      setIsLowering(false);
    }, 1200);
  };

  const handleDeliverToStation = (chosenStation: 'reduce' | 'reuse' | 'recycle') => {
    if (!activeItem || !hasGrabbed) return;

    const isCorrect = chosenStation === activeItem.station;
    if (isCorrect) {
      soundManager.playSuccess();
      const points = 120;
      onItemProcessed(
        true,
        `Tepat Sekali! "${activeItem.name}" disalurkan ke Stasiun ${chosenStation.toUpperCase()}. ${activeItem.description} ${
          activeItem.valueRp > 0 ? `(+Tabungan: Rp${activeItem.valueRp.toLocaleString('id-ID')})` : ''
        }`,
        points,
        activeItem.valueRp
      );
    } else {
      soundManager.playError();
      onItemProcessed(
        false,
        `Kurang Tepat! "${activeItem.name}" seharusnya masuk ke Stasiun ${activeItem.station.toUpperCase()}.`,
        0,
        0
      );
    }

    setHasGrabbed(false);
    if (currentIdx + 1 < itemsList.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setTimeout(() => {
        onMissionComplete();
      }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-4xl mx-auto h-full min-h-[520px] p-4 text-slate-100">
      {/* Header Info with Bank Savings Counter */}
      <div className="text-center mb-1 w-full flex flex-col items-center">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
          Misi 5: Mesin Capit 3R & Bank Sampah Sekolah
        </span>
        <div className="flex items-center justify-between w-full max-w-2xl mt-2 px-2">
          <span className="text-xs text-slate-300">
            Kendalikan mesin capit, ambil barang, dan salurkan ke stasiun 3R yang tepat!
          </span>
          {/* Live Bank Sampah Savings Counter */}
          <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/60 px-3 py-1 rounded-xl text-amber-300 font-mono text-xs sm:text-sm font-bold shadow-md">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Tabungan: Rp{bankSavings.toLocaleString('id-ID')}</span>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono mt-0.5">
          Barang #{currentIdx + 1} dari {CLAW_ITEMS.length}
        </span>
      </div>

      {/* CLAW MACHINE CHAMBER */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-emerald-600/80 rounded-3xl p-4 shadow-2xl h-72 overflow-hidden flex flex-col justify-between">
        {/* Overhead Track Rail */}
        <div className="absolute top-2 left-6 right-6 h-3 bg-slate-700 rounded-full border border-slate-600 shadow-inner" />

        {/* Mechanical Crane & Claw */}
        <div
          className="absolute top-2 transition-all duration-300 ease-out flex flex-col items-center z-20 pointer-events-none"
          style={{
            left: `${clawX}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Trolley carriage */}
          <div className="w-8 h-4 bg-amber-500 rounded-md border border-amber-300 shadow-md" />
          {/* Cable rod extending down */}
          <div
            className="w-1.5 bg-slate-400 transition-all duration-1000 ease-in-out"
            style={{
              height: isLowering ? '110px' : hasGrabbed ? '70px' : '40px',
            }}
          />
          {/* Claw Prongs */}
          <div className="relative flex items-center justify-center -mt-1">
            <div
              className={`w-10 h-6 border-b-4 border-l-4 border-r-4 border-amber-400 rounded-b-xl transition-transform ${
                hasGrabbed ? 'scale-90 border-emerald-400' : 'scale-100'
              }`}
            />
            {/* Grabbed Item attached to claw */}
            {hasGrabbed && activeItem && (
              <div className="absolute top-6 scale-75 animate-bounce">
                <ClawItemSvg itemKey={activeItem.svgKey} size={54} />
              </div>
            )}
          </div>
        </div>

        {/* Chamber Floor: Active Item Target Zone */}
        <div className="mt-auto w-full flex items-center justify-center pb-2">
          {!hasGrabbed && activeItem && (
            <div className="bg-slate-800/90 border-2 border-emerald-500/50 rounded-2xl p-3 flex items-center gap-4 max-w-md w-full shadow-lg">
              <div className="w-16 h-16 bg-slate-900 rounded-xl p-1 shrink-0 flex items-center justify-center border border-slate-700">
                <ClawItemSvg itemKey={activeItem.svgKey} size={50} />
              </div>
              <div className="text-left space-y-0.5">
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  {activeItem.name}
                </h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {activeItem.description}
                </p>
                {activeItem.valueRp > 0 && (
                  <span className="text-[11px] font-bold text-amber-400 font-mono block">
                    💰 Nilai Setor: Rp{activeItem.valueRp.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          )}

          {hasGrabbed && (
            <div className="text-emerald-400 text-xs font-bold animate-pulse">
              🎯 Benda Berhasil Dicapit! Salurkan ke stasiun yang tepat di bawah:
            </div>
          )}
        </div>
      </div>

      {/* CLAW CONTROLS BAR */}
      <div className="flex items-center gap-3 my-2">
        <button
          type="button"
          onClick={handleMoveLeft}
          disabled={isLowering || hasGrabbed}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-xl border border-slate-600 flex items-center gap-1 shadow-md disabled:opacity-40 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geser Kiri</span>
        </button>

        <button
          type="button"
          onClick={handleDropClaw}
          disabled={isLowering || hasGrabbed}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl border border-amber-300 flex items-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-40 cursor-pointer"
        >
          <Target className="w-4 h-4" />
          <span>{isLowering ? 'Menurunkan...' : '🎯 CAPIT BENDA'}</span>
        </button>

        <button
          type="button"
          onClick={handleMoveRight}
          disabled={isLowering || hasGrabbed}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-xl border border-slate-600 flex items-center gap-1 shadow-md disabled:opacity-40 cursor-pointer"
        >
          <span>Geser Kanan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 PROCESSING STATIONS */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mt-1">
        {/* Station 1: REDUCE */}
        <button
          type="button"
          onClick={() => handleDeliverToStation('reduce')}
          disabled={!hasGrabbed}
          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
            hasGrabbed
              ? 'bg-emerald-950/80 border-emerald-400 hover:bg-emerald-900 cursor-pointer scale-102 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-xl">📦</span>
          <span className="font-extrabold text-xs text-emerald-300 mt-1">STASIUN REDUCE</span>
          <span className="text-[10px] text-slate-400">Cegah & Kurangi Sampah</span>
        </button>

        {/* Station 2: REUSE */}
        <button
          type="button"
          onClick={() => handleDeliverToStation('reuse')}
          disabled={!hasGrabbed}
          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
            hasGrabbed
              ? 'bg-blue-950/80 border-blue-400 hover:bg-blue-900 cursor-pointer scale-102 shadow-lg shadow-blue-500/20'
              : 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-xl">🔄</span>
          <span className="font-extrabold text-xs text-blue-300 mt-1">STASIUN REUSE</span>
          <span className="text-[10px] text-slate-400">Guna Ulang Langsung</span>
        </button>

        {/* Station 3: RECYCLE / BANK SAMPAH */}
        <button
          type="button"
          onClick={() => handleDeliverToStation('recycle')}
          disabled={!hasGrabbed}
          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
            hasGrabbed
              ? 'bg-amber-950/80 border-amber-400 hover:bg-amber-900 cursor-pointer scale-102 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-xl">🏭</span>
          <span className="font-extrabold text-xs text-amber-300 mt-1">BANK SAMPAH</span>
          <span className="text-[10px] text-slate-400">Recycle & Tambah Saldo</span>
        </button>
      </div>
    </div>
  );
};
