import React, { useState } from 'react';
import { LogoWithFallback } from './Svgs';
import { BookOpen, HelpCircle, UserCheck, X } from 'lucide-react';

interface EducationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: number;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 1,
}) => {
  const [activeTab, setActiveTab] = useState<number>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <LogoWithFallback
                src="https://i.imgur.com/5isghy7.png"
                alt="Logo PGRI"
                type="pgri"
                size={34}
              />
              <LogoWithFallback
                src="https://i.imgur.com/RVQBxN6.png"
                alt="Logo Wonogiri"
                type="wonogiri"
                size={34}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-400 font-display">
                Petunjuk & Kurikulum Pembelajaran
              </h2>
              <p className="text-xs text-slate-400">
                Juknis Lomba Game AI PGRI Kab. Wonogiri 2026 — Fase C (Kelas 5–6 SD/MI)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2">
          <button
            onClick={() => setActiveTab(1)}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 1
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>1. Cara Bermain & Kontrol</span>
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 2
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Capaian Pembelajaran & 4C</span>
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 3
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>3. Profil Pengembang & Lisensi Aset</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          {/* TAB 1: CARA BERMAIN */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2 text-emerald-300">
                  <span>🎮 Panduan Mekanisme 6 Misi Interaktif:</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs leading-relaxed">
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-400 block mb-1">Misi 1: Pemilahan Sampah SNI</span>
                    Tarik (drag-and-drop) atau ketuk (tap) sampah yang muncul ke salah satu dari 3 tong standar: Tong Hijau (Organik), Tong Kuning (Anorganik), atau Tong Merah (B3 Beracun).
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-400 block mb-1">Misi 2: Reforestasi Taman</span>
                    Rawat 3 petak tanah kering retak secara berurutan: Siram dengan Gembor Air (Langkah 1), lalu beri Pupuk Kompos Organik (Langkah 2). Hindari alat perusak (kapak liar & api)!
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-400 block mb-1">Misi 3: Simulasi Sikap HOTS</span>
                    Hadapi 5 dilema nyata di Rumah, Sekolah, Masjid, Sungai, dan Taman Kota. Pilih keputusan etis yang bertanggung jawab menjaga alam sebagai Khalifah fil Ardh.
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-400 block mb-1">Misi 4: Susun Kata 3R</span>
                    Klik huruf-huruf acak untuk merangkai konsep ekologi (REDUCE, REUSE, RECYCLE, KOMPOS, HEMAT). Gunakan tombol Petunjuk Huruf atau Acak Ulang jika perlu bantuan.
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-400 block mb-1">Misi 5: Mesin Capit 3R & Bank Sampah</span>
                    Geser pencapit mekanik ke kiri/kanan, tekan [🎯 CAPIT BENDA], lalu pilih stasiun yang tepat (Reduce, Reuse, atau Recycle) untuk menambah Tabungan Bank Sampah (Rp).
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-400 block mb-1">Misi 6: Peta Radar Krisis Nusantara</span>
                    Klik 5 titik radar di peta kepulauan Indonesia (Padang, Wonogiri, Kalimantan, Bali, Parepare). Analisis fakta kasus, baca tautan berita resmi, dan tentukan solusi konservasi terbaik.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/80">
                  <h4 className="font-bold text-amber-400 mb-2">👥 Mode 2 Pemain (Split-Screen Duel)</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dua murid dapat berkompetisi secara bergantian atau berdampingan dalam satu layar. Setiap pemain memecahkan tantangan dan mengumpulkan Poin Amal. Pemain dengan skor tertinggi menjadi Pemenang Khalifah Utama!
                  </p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/80">
                  <h4 className="font-bold text-cyan-400 mb-2">📷 Mode AR Eco-Scanner</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mengaktifkan overlay kamera augmented reality untuk mensimulasikan pemindaian objek ramah lingkungan di ruang kelas dengan retikel futuristik holografis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CP & TP & 4C */}
          {activeTab === 2 && (
            <div className="space-y-6">
              {/* CP Box */}
              <div className="p-4 bg-emerald-950/40 border border-emerald-600/40 rounded-xl">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Capaian Pembelajaran (CP) — Fase C (SD/MI Kelas 5–6):
                </span>
                <p className="text-sm text-emerald-100 font-medium leading-relaxed italic">
                  &ldquo;Peserta didik memahami peran dan tanggung jawab manusia sebagai Khalifah fil Ardh (penjaga dan pemakmur bumi) dalam memelihara kelestarian lingkungan biotik (tumbuhan, hewan, manusia) dan abiotik (tanah, air, udara) sebagai wujud ibadah, rasa syukur, dan akhlak mulia kepada Tuhan Yang Maha Esa.&rdquo;
                </p>
              </div>

              {/* 5 TP */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-3 text-emerald-300">
                  🎯 5 Tujuan Pembelajaran (TP) Spesifik:
                </h4>
                <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong className="text-slate-100">Pemilahan Sampah Standar Nasional (SNI):</strong> Peserta didik mampu mengklasifikasikan sampah Organik (Tong Hijau), Anorganik (Tong Kuning/Biru), dan B3 (Tong Merah) serta menganalisis data waktu urai dekomposisinya (Integrasi Numerasi Lingkungan).
                  </li>
                  <li>
                    <strong className="text-slate-100">Konservasi Vegetasi & Reforestasi:</strong> Mempraktikkan tahapan perawatan pohon (penyiraman air 2L/bibit dan pemupukan kompos 500g/bibit) untuk menyuburkan tanah kritis.
                  </li>
                  <li>
                    <strong className="text-slate-100">Pengambilan Keputusan Etis (HOTS):</strong> Menganalisis dan menentukan sikap bertanggung jawab terhadap krisis lingkungan di 5 ruang kehidupan (rumah, sekolah, tempat ibadah, sungai, taman).
                  </li>
                  <li>
                    <strong className="text-slate-100">Literasi Konsep 3R & Energi:</strong> Menyusun dan mendefinisikan prinsip Reduce, Reuse, Recycle, Kompos, serta Efisiensi Energi & Air.
                  </li>
                  <li>
                    <strong className="text-slate-100">Ekonomi Sirkuler & Analisis Kasus Nusantara:</strong> Mengelola pemilahan barang pada Mesin Capit 3R, menghitung tabungan Bank Sampah sekolah, serta memecahkan 5 kasus nyata krisis ekologi di Indonesia melalui literasi berita resmi.
                  </li>
                </ol>
              </div>

              {/* 4C Integration */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <span className="text-emerald-400 font-bold text-xs block mb-1">Critical Thinking</span>
                  <p className="text-[11px] text-slate-400">Analisis dampak sampah, waktu urai plastik 450 thn, dan solusi sedimentasi Waduk Gajah Mungkur.</p>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <span className="text-amber-400 font-bold text-xs block mb-1">Creativity</span>
                  <p className="text-[11px] text-slate-400">Inovasi upcycling wadah bekas selai jadi toples dan kardus jadi rak alat tulis.</p>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <span className="text-blue-400 font-bold text-xs block mb-1">Collaboration</span>
                  <p className="text-[11px] text-slate-400">Mode 2 Pemain kompetitif-kooperatif serta gotong royong membersihkan selokan sekolah.</p>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <span className="text-purple-400 font-bold text-xs block mb-1">Communication</span>
                  <p className="text-[11px] text-slate-400">Menyampaikan nasihat adab hemat air wudu dan mengingatkan larangan buang sampah ke sungai.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IDENTITAS PENGEMBANG & LISENSI */}
          {activeTab === 3 && (
            <div className="space-y-6">
              {/* Creator Card */}
              <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-emerald-800/60 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-inner font-bold text-white shrink-0">
                  👨‍🏫
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
                    Peserta Lomba Pembuatan Game AI PGRI Kab. Wonogiri 2026
                  </div>
                  <h3 className="text-lg font-bold text-white">Bachtiar Imani, S.Pd.</h3>
                  <p className="text-xs text-slate-300">
                    Pendidik di <strong className="text-emerald-400">SDN 2 Girimarto</strong>
                  </p>
                  <p className="text-xs text-slate-400">
                    Utusan Cabang: <strong className="text-slate-200">PGRI Cabang Girimarto</strong> | Kabupaten Wonogiri, Jawa Tengah
                  </p>
                </div>
              </div>

              {/* Juknis Compliance Section I.2.b */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-white text-sm text-emerald-300">
                  📜 Pernyataan Orisinalitas & Lisensi Aset (Juknis Bagian I.2.b):
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                  <li>
                    <strong className="text-slate-100">Grafis Vektor & Ilustrasi 2D:</strong> Seluruh ilustrasi 9 sampah, 3 tong SNI, 4 alat kehutanan, 5 skenario HOTS, mesin capit, dan peta kepulauan Nusantara merupakan <em>karya grafis vektor inline SVG orisinal</em> yang dirancang bersama asisten AI Google Gemini. 100% bebas royalti dan bekerja mandiri tanpa koneksi internet (offline-ready).
                  </li>
                  <li>
                    <strong className="text-slate-100">Mesin Grafis 3D Bola Bumi:</strong> Menggunakan Three.js r160+ (Lisensi MIT) dengan generator tekstur kanvas prosedural serta cadangan otomatis Canvas 2D.
                  </li>
                  <li>
                    <strong className="text-slate-100">Tata Suara & Audio Efek:</strong> Disintesis secara prosedural langsung melalui Web Audio API browser (Public Domain, zero external audio download).
                  </li>
                  <li>
                    <strong className="text-slate-100">Referensi Berita Kasus Nusantara:</strong> Diambil dari publikasi jurnalistik resmi Republik Indonesia (LKBN Antara, Kompas, Detik, KKP, KLHK-BNPB) khusus untuk telaah literasi edukasi peserta didik.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-400">
          <span>HUT Ke-81 PGRI & Hari Guru Nasional (HGN) 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
