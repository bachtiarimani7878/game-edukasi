import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ChevronDown, ChevronUp, Award, RefreshCw, LogOut, Coins } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VictoryViewProps {
  finalScore: number;
  bankSavings: number;
  earthHealth: number;
  difficulty: string;
  onOpenCertificate: () => void;
  onRestartGame: () => void;
  onExitGame: () => void;
}

export const VictoryView: React.FC<VictoryViewProps> = ({
  finalScore,
  bankSavings,
  earthHealth,
  difficulty,
  onOpenCertificate,
  onRestartGame,
  onExitGame,
}) => {
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    soundManager.playVictory();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 sm:p-6 text-slate-100 animate-fadeIn space-y-6">
      {/* Trophy & Star Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 shadow-2xl">
          <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
        </div>
        <div className="flex items-center justify-center gap-1 text-amber-400">
          <Star className="w-6 h-6 fill-amber-400" />
          <Star className="w-7 h-7 fill-amber-400" />
          <Star className="w-6 h-6 fill-amber-400" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
          SELAMAT! MISI PENJAGA BUMI SELESAI
        </h1>
        <p className="text-xs sm:text-sm text-emerald-400 font-semibold max-w-lg mx-auto">
          Kamu resmi dinobatkan sebagai <strong>Khalifah Cilik Teladan Pelestari Lingkungan</strong> Fase C (Kelas 5–6 SD/MI)!
        </p>
      </div>

      {/* 3 Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {/* Score */}
        <div className="bg-slate-800/80 border-2 border-emerald-500/50 p-4 rounded-2xl text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Poin Amal</span>
          <div className="text-3xl font-black font-mono text-emerald-400">{finalScore}</div>
          <span className="text-[11px] text-slate-400">Tingkat: {difficulty.toUpperCase()}</span>
        </div>

        {/* Earth Health */}
        <div className="bg-slate-800/80 border-2 border-cyan-500/50 p-4 rounded-2xl text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 uppercase font-semibold">Kesehatan Bumi</span>
          <div className="text-3xl font-black font-mono text-cyan-400">{Math.round(earthHealth)}%</div>
          <span className="text-[11px] text-emerald-400 font-semibold">Zamrud Nusantara Asri</span>
        </div>

        {/* Bank Savings */}
        <div className="bg-slate-800/80 border-2 border-amber-500/50 p-4 rounded-2xl text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> Tabungan Sampah
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
            Rp{bankSavings.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-400">Ekonomi Sirkuler Sekolah</span>
        </div>
      </div>

      {/* Certificate CTA Banner */}
      <div className="w-full max-w-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-amber-500/60 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
            Sertifikat Resmi Berpredikat Teladan
          </span>
          <h3 className="text-base font-bold text-white">
            Unduh Sertifikat Digital Resolusi Tinggi (PNG HD)
          </h3>
          <p className="text-xs text-slate-300">
            Dilengkapi Tanda Tangan Resmi Pendidik SDN 2 Girimarto (PGRI Wonogiri)
          </p>
        </div>
        <button
          onClick={onOpenCertificate}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/30 cursor-pointer shrink-0"
        >
          <Award className="w-5 h-5" />
          <span>Lihat & Unduh Sertifikat</span>
        </button>
      </div>

      {/* Collapsible Evaluation & Pedagogical Discussion (Mandatory Juknis Section J) */}
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setShowEvaluation(!showEvaluation)}
          className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span>📋 Rincian Evaluasi Jawaban & Pembahasan Materi 6 Misi (Juknis Bagian J)</span>
          {showEvaluation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showEvaluation && (
          <div className="p-4 border-t border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed max-h-80 overflow-y-auto">
            <div className="space-y-1">
              <strong className="text-white block">1. Pembahasan Misi 1 (Pemilahan Sampah SNI):</strong>
              <p>Sampah Organik (Tong Hijau) mudah terurai mikroba dalam 2–5 minggu menjadi humus. Sampah Anorganik (Tong Kuning) seperti plastik butuh ±450 tahun terurai dan wajib didaur ulang. Sampah B3 (Tong Merah) mengandung zat kimia berbahaya (merkuri, timbal) yang berisiko mencemari air tanah.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">2. Pembahasan Misi 2 (Aksi Konservasi Pohon):</strong>
              <p>Tahap pemulihan lahan kritis diawali dengan hidrasi akar menggunakan air bersih (2 liter/bibit) agar stomata dan sel akar segar, dilanjutkan dengan pemupukan kompos (500 gram/bibit) kaya bahan organik humus untuk memicu fotosintesis dan pembuahan.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">3. Pembahasan Misi 3 (Keputusan Etis HOTS):</strong>
              <p>Peran manusia sebagai Khalifah fil Ardh diwujudkan lewat pembiasaan hemat air & energi di rumah, kerja sama membersihkan selokan sekolah, adab hemat air wudu, menolak buang sampah ke sungai, dan merawat tanaman taman kota.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">4. Pembahasan Misi 4 (Konsep Kunci 3R):</strong>
              <p>Reduce (mengurangi timbulan sampah dari awal), Reuse (menggunakan kembali botol/kardus layak pakai), Recycle (daur ulang pabrik), Kompos (pupuk organik alami), dan Hemat (adab efisiensi sumber daya).</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">5. Pembahasan Misi 5 (Mesin Capit & Ekonomi Sirkuler):</strong>
              <p>Menyetor sampah anorganik terpilah ke Bank Sampah sekolah mengubah limbah menjadi tabungan bernilai ekonomis (Rp), mengurangi penebangan pohon (daur ulang kertas) dan pencemaran laut (daur ulang PET).</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">6. Pembahasan Misi 6 (Radar Kasus Krisis Nusantara):</strong>
              <p>Menganalisis kasus darurat pesisir Padang, sedimentasi Waduk Gajah Mungkur Wonogiri, restorasi gambut Karhutla Kalimantan, pariwisata hijau Nusa Dua Bali, dan hutan mangrove Selat Makassar Parepare melalui literasi berita resmi.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={onRestartGame}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Main Lagi</span>
        </button>
        <button
          onClick={onExitGame}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar ke Menu</span>
        </button>
      </div>
    </div>
  );
};
