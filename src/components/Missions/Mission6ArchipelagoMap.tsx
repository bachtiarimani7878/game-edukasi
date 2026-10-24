import React, { useState, useMemo } from 'react';
import { RadarHotspot, ScenarioOption } from '../../types/game';
import { ArchipelagoMapSvg } from '../Svgs';
import { soundManager } from '../../utils/audio';
import { ExternalLink, MapPin, CheckCircle } from 'lucide-react';
import { shuffleArray } from '../../utils/shuffle';

interface Mission6ArchipelagoMapProps {
  onHotspotResolved: (isCorrect: boolean, feedback: string, points: number) => void;
  onMissionComplete: () => void;
}

// All option sentences are crafted with parallel syntax and identical character lengths (~110-115 chars)
const RADAR_HOTSPOTS: RadarHotspot[] = [
  {
    id: 1,
    city: 'Padang',
    island: 'Sumatera Barat',
    title: 'Darurat Sampah Pesisir Pantai & Ancaman Abrasi',
    coords: { x: 18, y: 44 },
    fact: 'Tonase sampah kiriman dari hulu sungai yang bermuara ke Pantai Padang saat musim penghujan mencapai puluhan ton per hari, mengancam kelestarian biota laut karang dan mempercepat laju abrasi pesisir.',
    newsTitle: 'Gerakan Bersih Pantai & Laut KKP di Pesisir Pantai Padang',
    newsUrl: 'https://sumbar.antaranews.com',
    newsSource: 'LKBN Antara Sumbar & KKP',
    svgKey: 'hotspot_padang',
    options: [
      {
        id: '1a',
        text: 'Menghentikan pembuangan sampah ke sungai dan menanam sabuk cemara udang untuk menahan laju abrasi pesisir pantai.',
        isCorrect: true,
        explanation: 'Solusi Holistik Tepat! Mengatasi akar masalah dari hulu, memasang filter di muara, dan sabuk hijau melindungi garis pantai dari ombak.',
        pointValue: 150,
      },
      {
        id: '1b',
        text: 'Mengumpulkan sampah di sepanjang tepi pantai lalu membakarnya beramai-ramai agar pasir segera terlihat bersih.',
        isCorrect: false,
        explanation: 'Keliru & Berbahaya! Membakar sampah plastik di pantai menghasilkan asap beracun dioksin dan merusak pasir pantai serta mencemari udara.',
        pointValue: 0,
      },
      {
        id: '1c',
        text: 'Membiarkan gelombang pasang menghanyutkan seluruh tumpukan sampah ke tengah laut lepas agar pantai bersih kembali.',
        isCorrect: false,
        explanation: 'Sangat Keliru! Menghanyutkan sampah ke laut meracuni ikan, membunuh penyu karena memakan plastik, dan merusak terumbu karang.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 2,
    city: 'Wonogiri',
    island: 'Jawa Tengah',
    title: 'Konservasi Sabuk Hijau & Sedimentasi Waduk Gajah Mungkur (WGM)',
    coords: { x: 42, y: 78 },
    fact: 'Erosi tanah dari lahan hulu Daerah Aliran Sungai (DAS) Keduang mengalirkan jutaan meter kubik endapan lumpur (sedimentasi) ke Waduk Gajah Mungkur, mengancam kapasitas pasokan air irigasi pertanian dan PLTA Wonogiri.',
    newsTitle: 'Konservasi DAS Keduang & Pengendalian Sedimentasi WGM Wonogiri',
    newsUrl: 'https://regional.kompas.com',
    newsSource: 'Kompas Regional Jawa Tengah',
    svgKey: 'hotspot_wonogiri',
    options: [
      {
        id: '2a',
        text: 'Melakukan reboisasi pohon keras di hulu DAS Keduang dan membuat terasering guna mencegah erosi lumpur ke waduk.',
        isCorrect: true,
        explanation: 'Aksi Konservasi Wonogiri Unggul! Akar tanaman keras mengikat tanah agar tidak tergerus air hujan ke waduk, menjaga umur waduk kebanggaan Wonogiri.',
        pointValue: 150,
      },
      {
        id: '2b',
        text: 'Menebangi semua pohon perbukitan hulu untuk dijadikan lahan parkir dan membiarkan tanah terbuka terkena hujan.',
        isCorrect: false,
        explanation: 'Pemicu Bencana Longsor! Lahan gundul tanpa akar pohon akan langsung tergerus erosi saat hujan lebat dan menimbun dasar waduk.',
        pointValue: 0,
      },
      {
        id: '2c',
        text: 'Menutup seluruh saluran pintu air waduk ke areal sawah petani agar kapasitas tampungan waduk tidak berkurang.',
        isCorrect: false,
        explanation: 'Keputusan Kurang Tepat! Petani membutuhkan air irigasi, solusinya adalah konservasi tangkapan air di hulu, bukan mematikan irigasi.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 3,
    city: 'Kalimantan',
    island: 'Pulau Kalimantan',
    title: 'Pencegahan Karhutla & Restorasi Ekosistem Gambut',
    coords: { x: 46, y: 42 },
    fact: 'Pengeringan rawa gambut dan pembukaan lahan liar dengan api memicu kebakaran hutan dan lahan (Karhutla) hebat yang menghasilkan kabut asap lintas batas negara dan mengancam satwa langka Orangutan.',
    newsTitle: 'Restorasi Ekosistem Gambut & Penanganan Karhutla Kalimantan',
    newsUrl: 'https://www.kompas.com',
    newsSource: 'Kompas Nasional / KLHK-BNPB',
    svgKey: 'hotspot_kalimantan',
    options: [
      {
        id: '3a',
        text: 'Melarang pembakaran lahan dan membangun sekat kanal agar lahan gambut tetap basah terhidrasi sepanjang musim.',
        isCorrect: true,
        explanation: 'Keputusan HOTS Teruji! Menjaga gambut tetap terhidrasi basah adalah kunci mutlak memadamkan potensi kebakaran bawah tanah yang sulit padam.',
        pointValue: 150,
      },
      {
        id: '3b',
        text: 'Mengeringkan seluruh air sungai di sekitar hutan gambut agar kendaraan bermotor mudah melintasi kawasan hutan.',
        isCorrect: false,
        explanation: 'Fatal! Gambut yang kering kerontang menjadi bahan bakar yang mudah terbakar seperti batu bara dan sangat sulit dipadamkan.',
        pointValue: 0,
      },
      {
        id: '3c',
        text: 'Menangkap satwa liar yang kehilangan tempat tinggal untuk dijual ke pasar hewan komersial demi keuntungan uang.',
        isCorrect: false,
        explanation: 'Tindakan Kriminal & Merusak Biodiversitas! Satwa endemik dilindungi undang-undang dan wajib dijaga kelestarian habitat liarnya.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 4,
    city: 'Nusa Dua',
    island: 'Bali',
    title: 'Kawasan Wisata Hijau & Pengendalian Sampah Plastik Laut',
    coords: { x: 53, y: 82 },
    fact: 'Aktivitas pariwisata internasional di pesisir menghasilkan timbulan sampah plastik sekali pakai (kresek, sedotan) yang berisiko hanyut mencemari terumbu karang laut tropis Bali.',
    newsTitle: 'Pariwisata Berkelanjutan & Pembatasan Plastik Sekali Pakai di Bali',
    newsUrl: 'https://www.detik.com/bali',
    newsSource: 'Detik Bali / Dinas LHK Bali',
    svgKey: 'hotspot_bali',
    options: [
      {
        id: '4a',
        text: 'Menerapkan pembatasan plastik sekali pakai dan mewajibkan penggunaan wadah guna ulang di area objek wisata pantai.',
        isCorrect: true,
        explanation: 'Pariwisata Hijau Berkelanjutan! Menghilangkan sumber plastik sekali pakai melindungi biota laut dan mempertahankan keindahan Pulau Dewata.',
        pointValue: 150,
      },
      {
        id: '4b',
        text: 'Membagikan kantong plastik sekali pakai gratis kepada semua turis agar barang bawaan mereka aman dari air laut.',
        isCorrect: false,
        explanation: 'Kebijakan yang Salah Arah! Menambah peredaran kantong plastik memperparah krisis sampah laut dunia.',
        pointValue: 0,
      },
      {
        id: '4c',
        text: 'Menutup akses pesisir pantai untuk semua pengunjung secara sepihak tanpa menyediakan fasilitas pemilahan sampah.',
        isCorrect: false,
        explanation: 'Kurang Bijaksana! Solusi terbaik adalah edukasi pembiasaan ramah lingkungan dan penyediaan sarana pilah sampah, bukan isolasi total.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 5,
    city: 'Parepare',
    island: 'Sulawesi Selatan',
    title: 'Konservasi Hutan Mangrove & Kebersihan Selat Makassar',
    coords: { x: 62, y: 55 },
    fact: 'Saluran pembuangan kota yang belum tersaring membawa sampah plastik menyangkut di akar-akar tunjang pohon mangrove (bakau) muara, merusak tempat pemijahan udang dan kepiting bakau.',
    newsTitle: 'Aksi Bersih Muara & Penanaman Mangrove Pesisir Kota Parepare',
    newsUrl: 'https://makassar.antaranews.com',
    newsSource: 'LKBN Antara Sulsel',
    svgKey: 'hotspot_parepare',
    options: [
      {
        id: '5a',
        text: 'Memasang jaring penahan sampah di muara dan menanam bibit mangrove baru demi melindungi zona pemijahan biota laut.',
        isCorrect: true,
        explanation: 'Penyelamat Sabuk Pesisir Sulawesi! Akar mangrove yang bersih menjadi tempat berkembang biak ikan dan pelindung alami dari abrasi dan gelombang badai.',
        pointValue: 150,
      },
      {
        id: '5b',
        text: 'Menebang seluruh tegakan pohon mangrove muara agar sampah plastik yang menyangkut bisa langsung hanyut ke laut.',
        isCorrect: false,
        explanation: 'Bencana Ekologi Besar! Menghancurkan mangrove melenyapkan pelindung abrasi pantai dan memusnahkan habitat perikanan pesisir.',
        pointValue: 0,
      },
      {
        id: '5c',
        text: 'Menimbun seluruh rawa hutan mangrove muara dengan adukan semen beton untuk membangun kawasan pergudangan niaga.',
        isCorrect: false,
        explanation: 'Merusak Ekosistem Pantai! Pembangunan tanpa amdal di zona konservasi memicu kepunahan keanekaragaman hayati pesisir.',
        pointValue: 0,
      },
    ],
  },
];

export const Mission6ArchipelagoMap: React.FC<Mission6ArchipelagoMapProps> = ({
  onHotspotResolved,
  onMissionComplete,
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<number | null>(1);
  const [resolvedIds, setResolvedIds] = useState<number[]>([]);

  const activeHotspot = RADAR_HOTSPOTS.find((h) => h.id === activeHotspotId) || RADAR_HOTSPOTS[0];

  // Options shuffled randomly per hotspot so correct answer is NOT locked to option A
  const randomizedOptions = useMemo(() => {
    if (!activeHotspot) return [];
    return shuffleArray(activeHotspot.options);
  }, [activeHotspot?.id]);

  const handleSelectOption = (option: ScenarioOption) => {
    if (!activeHotspot) return;

    if (option.isCorrect) {
      soundManager.playSuccess();
      const nextResolved = [...resolvedIds, activeHotspot.id];
      setResolvedIds(nextResolved);
      onHotspotResolved(true, option.explanation, option.pointValue);

      if (nextResolved.length === RADAR_HOTSPOTS.length) {
        setTimeout(() => {
          onMissionComplete();
        }, 800);
      } else {
        const nextUnresolved = RADAR_HOTSPOTS.find((h) => !nextResolved.includes(h.id));
        if (nextUnresolved) {
          setActiveHotspotId(nextUnresolved.id);
        }
      }
    } else {
      soundManager.playError();
      onHotspotResolved(false, option.explanation, 0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-5xl mx-auto h-full min-h-[520px] p-4 text-slate-100">
      {/* Header Info */}
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
          Misi 6: Peta Radar Kasus Lingkungan Nusantara
        </span>
        <p className="text-xs text-slate-300 mt-1 max-w-xl mx-auto">
          Klik titik-titik radar di kepulauan Indonesia, pelajari kasus nyata dan referensi berita resminya, lalu tetapkan solusi konservasi HOTS terbaik!
        </p>
        <div className="flex items-center justify-center gap-2 mt-1">
          {RADAR_HOTSPOTS.map((h) => (
            <span
              key={h.id}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                resolvedIds.includes(h.id)
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : activeHotspotId === h.id
                  ? 'bg-amber-950 text-amber-300 border-amber-500 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              #{h.id} {h.city} {resolvedIds.includes(h.id) ? '✓' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* INTERACTIVE ARCHIPELAGO SVG MAP */}
      <div className="w-full my-2">
        <ArchipelagoMapSvg
          activeHotspotId={activeHotspotId}
          onSelectHotspot={(id) => {
            soundManager.playClick();
            setActiveHotspotId(id);
          }}
        />
      </div>

      {/* SELECTED HOTSPOT CASE STUDY MODAL / PANEL */}
      {activeHotspot && (
        <div className="bg-slate-800/95 border-2 border-slate-700/80 rounded-2xl p-4 sm:p-5 w-full shadow-2xl flex flex-col md:flex-row items-center gap-5 mt-2 animate-fadeIn">
          {/* Left Case Info & Link */}
          <div className="space-y-2 flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-display">
                  Titik #{activeHotspot.id}: {activeHotspot.city} ({activeHotspot.island})
                </h3>
                <span className="text-xs text-amber-400 font-semibold">
                  {activeHotspot.title}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <strong className="text-emerald-400 block mb-0.5">Fakta Kasus Nyata:</strong>
              {activeHotspot.fact}
            </p>

            {/* MANDATORY OFFICIAL NEWS LINK */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={activeHotspot.newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-300 hover:text-cyan-200 text-xs font-bold border border-slate-600 transition-colors cursor-pointer shadow-sm"
              >
                <span>📰 Baca Referensi Berita Resmi ({activeHotspot.newsSource})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                (Buka tab baru jika online)
              </span>
            </div>
          </div>

          {/* Right Action Choices - Shuffled randomly with equal sentence lengths */}
          <div className="w-full md:w-1/2 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              Pilih Solusi Konservasi HOTS Terbaik:
            </span>
            {randomizedOptions.map((opt, idx) => (
              <button
                key={`${opt.id}-${idx}`}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={resolvedIds.includes(activeHotspot.id)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 text-xs text-slate-200 font-medium group cursor-pointer shadow-md ${
                  resolvedIds.includes(activeHotspot.id)
                    ? opt.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900/40 border-slate-800 opacity-50'
                    : 'border-slate-700 bg-slate-900 hover:bg-slate-850 hover:border-emerald-500'
                }`}
              >
                <span className="w-5 h-5 rounded-md bg-slate-800 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors">
                  {['A', 'B', 'C'][idx]}
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
              </button>
            ))}

            {resolvedIds.includes(activeHotspot.id) && (
              <div className="text-center p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Titik Ini Berhasil Diselesaikan!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
