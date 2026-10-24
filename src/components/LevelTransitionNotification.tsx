import React, { useEffect } from 'react';
import { ArrowRight, Clock, ShieldCheck, Sparkles, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface LevelInfo {
  number: number;
  title: string;
  objective: string;
  icon: string;
  badge: string;
  hint: string;
}

export const LEVEL_INFO: LevelInfo[] = [
  {
    number: 1,
    title: 'Pemilahan Sampah Standar SNI',
    objective: 'Pilah sampah ke Tong Hijau (Organik), Kuning (Anorganik), atau Merah (B3) sesuai standar SNI 19-3983!',
    icon: '♻️',
    badge: 'SNI 19-3983',
    hint: 'Perhatikan waktu urai sampah alami vs plastik dan limbah B3 beracun.',
  },
  {
    number: 2,
    title: 'Aksi Reforestasi & Perawatan Pohon',
    objective: 'Rawat bibit pohon di petak tanah kering retak secara berurutan: Gembor Air (Langkah 1) lalu Pupuk Kompos (Langkah 2)!',
    icon: '🌱',
    badge: 'Konservasi Lahan',
    hint: 'Siram 2 liter air dahulu agar tanah lembap dan kompos dapat larut diserap akar.',
  },
  {
    number: 3,
    title: 'Simulasi Sikap Etis Khalifah fil Ardh (HOTS)',
    objective: 'Pilih solusi terpuji dan berakhlak mulia menghadapi 5 dilema ekologis di sekolah, masjid, dan sungai!',
    icon: '⚖️',
    badge: 'Akhlak Mulia',
    hint: 'Gunakan nalar kritis dan kepedulian terhadap lingkungan sekitar.',
  },
  {
    number: 4,
    title: 'Susun Kata Kunci Prinsip 3R',
    objective: 'Susun huruf acak membentuk istilah ekologi kunci: REDUCE, REUSE, RECYCLE, KOMPOS, dan HEMAT!',
    icon: '🔤',
    badge: 'Literasi Ekologi',
    hint: 'Pahami definisi membatasi, memakai kembali, dan mendaur ulang barang bekas.',
  },
  {
    number: 5,
    title: 'Mesin Capit 3R & Bank Sampah',
    objective: 'Kendalikan capit mekanik untuk menyalurkan barang ke stasiun 3R & kumpulkan saldo tabungan Bank Sampah rupiah!',
    icon: '🎯',
    badge: 'Ekonomi Sirkuler',
    hint: 'Setorkan barang bernilai daur ulang untuk menambah rupiah tabungan sekolah.',
  },
  {
    number: 6,
    title: 'Radar Krisis Ekologi Nusantara',
    objective: 'Analisis 5 titik krisis ekologi riil di kepulauan Nusantara dan tentukan solusi terbaik berbasis data jurnalistik!',
    icon: '🗺️',
    badge: 'Investigasi Nyata',
    hint: 'Termasuk kasus sedimentasi Waduk Gajah Mungkur Wonogiri, Jawa Tengah.',
  },
];

interface LevelTransitionNotificationProps {
  isOpen: boolean;
  levelIndex: number; // 0 to 5
  timeRemaining: number;
  onDismiss: () => void;
}

export const LevelTransitionNotification: React.FC<LevelTransitionNotificationProps> = ({
  isOpen,
  levelIndex,
  timeRemaining,
  onDismiss,
}) => {
  const level = LEVEL_INFO[levelIndex] || LEVEL_INFO[0];

  useEffect(() => {
    if (isOpen) {
      soundManager.playSuccess();
      const timer = window.setTimeout(() => {
        onDismiss();
      }, 3400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, levelIndex, onDismiss]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-400/90 rounded-3xl shadow-2xl shadow-emerald-500/25 p-5 sm:p-6 text-slate-100 overflow-hidden transform transition-all scale-100 animate-scale-up">
        {/* Animated glowing top strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 animate-pulse" />

        {/* Close icon button */}
        <button
          onClick={onDismiss}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          aria-label="Tutup Notifikasi"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Level Tag & Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border-2 border-emerald-400/80 flex items-center justify-center text-3xl shadow-inner shadow-emerald-500/30">
            {level.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> NOTIFIKASI LEVEL BARU
              </span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                {level.badge}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
              Level {level.number}: {level.title}
            </h2>
          </div>
        </div>

        {/* Objective & Description Box */}
        <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-2 mb-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-200 leading-snug">
              <strong className="text-emerald-300 font-bold">Tujuan Level:</strong> {level.objective}
            </p>
          </div>
          <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">💡 Petunjuk:</span>
            <span>{level.hint}</span>
          </div>
        </div>

        {/* Timing info & CTA button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono font-bold bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/40">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Waktu: {timeRemaining} Detik</span>
          </div>

          <button
            onClick={onDismiss}
            className="py-2 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition transform hover:scale-105 cursor-pointer"
          >
            <span>Mulai Misi Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
