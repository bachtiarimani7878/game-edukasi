import React, { useEffect } from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, Map, Award, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface MissionCompleteModalProps {
  isOpen: boolean;
  missionIndex: number; // 0 to 5
  missionTitle: string;
  totalScore: number;
  earthHealth: number;
  bankSavings: number;
  timeRemaining: number;
  lives: number;
  maxLives: number;
  isFinalMission: boolean;
  onNextMission: () => void;
  onRetryMission: () => void;
  onOpenMap: () => void;
}

export const MISSION_PEDAGOGICAL_TAKEAWAY = [
  {
    lesson: 'Standar Nasional Pemilahan Sampah (SNI 19-3983)',
    reflection:
      'Kamu telah berhasil mengklasifikasikan sampah organik, anorganik, dan limbah B3 beracun. Mengetahui bahwa plastik butuh 450 tahun untuk terurai melatih berpikir kritis dalam membatasi sampah sekali pakai.',
    badge: 'Pakar Pemilah SNI',
  },
  {
    lesson: 'Konservasi Vegetasi & Pemulihan Tanah Kritis',
    reflection:
      'Tahapan penyiraman air (2 liter) lalu pemupukan kompos (500 gram) berhasil menyuburkan bibit pohon berbuah. Menghindari penebangan liar dan pembakaran lahan menyelamatkan ekosistem dari bencana longsor.',
    badge: 'Sahabat Pohon Rimbun',
  },
  {
    lesson: 'Pengambilan Keputusan Etis & Akhlak Khalifah',
    reflection:
      'Kamu memilih solusi terpuji di rumah, sekolah, masjid, sungai, dan taman kota. Menghemat air wudu dan membersihkan drainase adalah wujud nyata ibadah menjaga bumi ciptaan Tuhan.',
    badge: 'Khalifah Berakhlak Mulia',
  },
  {
    lesson: 'Literasi Ekologi: Konsep 3R, Kompos & Hemat',
    reflection:
      'Menyusun konsep Reduce, Reuse, Recycle, Kompos, dan Hemat melatih literasi sains kontekstual. Mengurangi sampah dari sumbernya jauh lebih efektif daripada sekadar membersihkannya.',
    badge: 'Master Konsep 3R',
  },
  {
    lesson: 'Ekonomi Sirkuler & Mesin Capit Bank Sampah',
    reflection:
      'Memilah sampah botol PET dan kardus untuk disetor ke Bank Sampah terbukti menambah pundi-pundi tabungan rupiah sekolah sekaligus mengurangi timbunan sampah di TPA.',
    badge: 'Pelopor Bank Sampah',
  },
  {
    lesson: 'Analisis Kasus Nyata Krisis Ekologi Nusantara',
    reflection:
      'Menelaah krisis pesisir Padang, sedimentasi Waduk Gajah Mungkur Wonogiri, Karhutla Kalimantan, pariwisata Bali, dan mangrove Parepare membuktikan pentingnya kolaborasi solusi nyata berakar data jurnalistik.',
    badge: 'Penjaga Nusantara Utama',
  },
];

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  isOpen,
  missionIndex,
  missionTitle,
  totalScore,
  earthHealth,
  bankSavings,
  timeRemaining,
  lives,
  maxLives,
  isFinalMission,
  onNextMission,
  onRetryMission,
  onOpenMap,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate Rank and Stars
  // Rank S: 3/3 lives and health >= 75%
  // Rank A: health >= 50%
  // Rank B: remaining
  let rank = 'A';
  let rankLabel = 'SANGAT BAIK';
  let rankColor = 'text-emerald-400 border-emerald-400 bg-emerald-950/80';
  let stars = 3;

  if (lives === maxLives && earthHealth >= 70) {
    rank = 'S';
    rankLabel = 'SEMPURNA (EXCELLENT)';
    rankColor = 'text-amber-400 border-amber-400 bg-amber-950/80';
    stars = 3;
  } else if (lives < 2 || earthHealth < 40) {
    rank = 'B';
    rankLabel = 'BAIK (GOOD)';
    rankColor = 'text-blue-400 border-blue-400 bg-blue-950/80';
    stars = 2;
  }

  const takeaway = MISSION_PEDAGOGICAL_TAKEAWAY[missionIndex] || MISSION_PEDAGOGICAL_TAKEAWAY[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[95vh] bg-gradient-to-b from-slate-900 to-slate-950 border-3 border-emerald-500/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Header Banner */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-400">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                EVALUASI HASIL MISI {missionIndex + 1}/6
              </span>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                {missionTitle.toUpperCase()} — SELESAI!
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-xs font-bold text-emerald-300">
            {takeaway.badge}
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-center">
          {/* Rank & Star Rating Showcase (Like professional AAA game scorecard) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
            {/* Big Rank Badge */}
            <div
              className={`w-24 h-24 rounded-3xl border-3 flex flex-col items-center justify-center shadow-xl ${rankColor}`}
            >
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80">
                PERINGKAT
              </span>
              <span className="text-4xl font-black font-display leading-none">{rank}</span>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              {/* Stars */}
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 transition-transform ${
                      i < stars ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <h3 className="text-base font-extrabold text-white font-display">
                PREDIKAT: {rankLabel}
              </h3>
              <p className="text-xs text-slate-300">
                Torehan amal dan pemikiran kritis kamu luar biasa dalam misi ini!
              </p>
            </div>
          </div>

          {/* 4 Performance Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Skor</span>
              <span className="text-xl font-black font-mono text-amber-300">{totalScore}</span>
              <span className="text-[9px] text-slate-400 block">Poin Amal</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kesehatan Bumi</span>
              <span className="text-xl font-black font-mono text-emerald-400">{Math.round(earthHealth)}%</span>
              <span className="text-[9px] text-emerald-400 block font-semibold">Zamrud Asri</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sisa Waktu</span>
              <span className="text-xl font-black font-mono text-cyan-300">{timeRemaining}s</span>
              <span className="text-[9px] text-slate-400 block">Tersisa</span>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sisa Nyawa</span>
              <span className="text-base font-black font-mono text-rose-400">
                {'❤️'.repeat(Math.max(1, lives))}
              </span>
              <span className="text-[9px] text-slate-400 block">Ketahanan</span>
            </div>
          </div>

          {/* Pedagogical Reflection Callout */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-600/40 rounded-2xl text-left space-y-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Refleksi Pembelajaran: {takeaway.lesson}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              &ldquo;{takeaway.reflection}&rdquo;
            </p>
          </div>
        </div>

        {/* Footer Actions (Professional Game Control Layout) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onRetryMission}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Ulangi Misi Ini untuk Meraih Skor Lebih Tinggi"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Misi</span>
            </button>
            <button
              onClick={onOpenMap}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Buka Peta Misi"
            >
              <Map className="w-4 h-4" />
              <span>Peta Misi</span>
            </button>
          </div>

          <button
            onClick={onNextMission}
            className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-transform hover:scale-102 cursor-pointer"
          >
            <span>
              {isFinalMission
                ? '🏆 LIHAT HASIL AKHIR & SERTIFIKAT'
                : `🚀 LANJUT KE MISI ${missionIndex + 2}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
