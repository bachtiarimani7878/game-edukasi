import React from 'react';
import { Map, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MissionMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMissionIndex: number;
  onSelectMission: (index: number) => void;
}

export const MISSION_DETAILS = [
  {
    index: 0,
    title: 'Misi 1: Pemilahan Sampah SNI',
    icon: '🗑️',
    badge: 'SNI 19-3983',
    desc: 'Memilah 9 jenis sampah organik, anorganik, dan limbah B3 beracun beserta data waktu urainya.',
    bgColor: 'border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/40',
  },
  {
    index: 1,
    title: 'Misi 2: Reforestasi Taman',
    icon: '🌱',
    badge: 'Konservasi',
    desc: 'Merawat 3 petak tanah kritis dengan penyiraman air bersih (2L) dan pemupukan kompos (500g).',
    bgColor: 'border-teal-500/50 hover:border-teal-400 bg-teal-950/40',
  },
  {
    index: 2,
    title: 'Misi 3: Sikap Etis HOTS',
    icon: '⚖️',
    badge: 'Keputusan Etis',
    desc: 'Menghadapi 5 dilema moral nyata di Rumah, Sekolah, Tempat Ibadah, Sungai, dan Taman Kota.',
    bgColor: 'border-amber-500/50 hover:border-amber-400 bg-amber-950/40',
  },
  {
    index: 3,
    title: 'Misi 4: Susun Kata 3R',
    icon: '🔤',
    badge: 'Literasi Ekologi',
    desc: 'Menyusun huruf acak membentuk istilah kunci Reduce, Reuse, Recycle, Kompos, dan Hemat.',
    bgColor: 'border-blue-500/50 hover:border-blue-400 bg-blue-950/40',
  },
  {
    index: 4,
    title: 'Misi 5: Mesin Capit 3R',
    icon: '🎯',
    badge: 'Ekonomi Sirkuler',
    desc: 'Mengendalikan pencapit mekanik 3R dan menghitung estimasi saldo Tabungan Bank Sampah.',
    bgColor: 'border-purple-500/50 hover:border-purple-400 bg-purple-950/40',
  },
  {
    index: 5,
    title: 'Misi 6: Radar Nusantara',
    icon: '🗺️',
    badge: 'Analisis Kasus',
    desc: 'Menganalisis 5 krisis ekologi nyata Indonesia (Padang, Wonogiri, Kalimantan, Bali, Parepare).',
    bgColor: 'border-rose-500/50 hover:border-rose-400 bg-rose-950/40',
  },
];

export const MissionMapModal: React.FC<MissionMapModalProps> = ({
  isOpen,
  onClose,
  currentMissionIndex,
  onSelectMission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-emerald-500/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                PETA MISI PENJAGA BUMI
              </h2>
              <p className="text-xs text-emerald-400">
                Pilih dan lompat langsung ke misi manapun yang ingin kamu mainkan atau uji!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Grid List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {MISSION_DETAILS.map((m) => {
            const isCurrent = currentMissionIndex === m.index;

            return (
              <div
                key={m.index}
                className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col justify-between shadow-lg ${
                  m.bgColor
                } ${
                  isCurrent ? 'ring-2 ring-emerald-400 border-emerald-400 shadow-emerald-500/20' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1.5 bg-slate-900/80 rounded-xl border border-slate-700">
                        {m.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold">
                          {m.badge}
                        </span>
                        <h3 className="font-bold text-sm text-white mt-0.5">{m.title}</h3>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-full border border-emerald-500/50">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sedang Aktif
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {m.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectMission(m.index);
                    onClose();
                  }}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow ${
                    isCurrent
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>{isCurrent ? 'Lanjutkan Misi Ini' : `Lompat ke Misi ${m.index + 1}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>Total: 6 Misi Interaktif Berjenjang (Fase C SD/MI)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg cursor-pointer"
          >
            Tutup Peta
          </button>
        </div>
      </div>
    </div>
  );
};
