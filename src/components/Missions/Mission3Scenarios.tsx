import React, { useState, useMemo } from 'react';
import { ScenarioItem, ScenarioOption } from '../../types/game';
import { ScenarioSceneSvg } from '../Svgs';
import { soundManager } from '../../utils/audio';
import { shuffleArray } from '../../utils/shuffle';

interface Mission3ScenariosProps {
  onScenarioAnswered: (isCorrect: boolean, feedback: string, points: number) => void;
  onMissionComplete: () => void;
}

// All options are crafted to have parallel, equal sentence length (~100-108 characters)
const SCENARIO_ITEMS: ScenarioItem[] = [
  {
    id: 1,
    location: '🏠 Lingkungan Rumah',
    title: 'Adab Hemat Energi & Air di Rumah',
    situation:
      'Kamu masuk ke kamar mandi dan melihat keran air terus meluber deras (membuang puluhan liter air bersih), serta lampu bohlam utama masih menyala terang padahal sinar matahari siang hari sudah masuk sangat terang melalui jendela.',
    svgKey: 'scene_rumah',
    options: [
      {
        id: '1a',
        text: 'Segera menutup keran air yang meluber serta mematikan lampu kamar mandi untuk menghemat energi.',
        isCorrect: true,
        explanation: 'Sikap Khalifah Terpuji! Menutup keran menghemat puluhan liter air tanah dan mematikan lampu siang hari menghemat daya listrik PLN.',
        pointValue: 120,
      },
      {
        id: '1b',
        text: 'Membiarkan keran air terus meluber dan membiarkan lampu menyala karena menganggap bukan urusan pribadi.',
        isCorrect: false,
        explanation: 'Perilaku Boros & Tidak Bertanggung Jawab! Sumber daya alam air bersih adalah amanah yang wajib dijaga bersama agar tidak krisis.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 2,
    location: '🏫 Lingkungan Sekolah',
    title: 'Gotong Royong Drainase & Cegah Genangan Banjir',
    situation:
      'Saat jam istirahat di SDN 2 Girimarto, kamu melihat saluran selokan depan ruang kelas tersumbat tumpukan bungkus plastik jajanan dan gelas minuman, sementara awan mendung gelap menandakan hujan lebat akan segera turun.',
    svgKey: 'scene_sekolah',
    options: [
      {
        id: '2a',
        text: 'Mengajak teman-teman bergotong royong membersihkan sampah selokan agar aliran air lancar dan tidak banjir.',
        isCorrect: true,
        explanation: 'Kerja Sama (Collaboration) & Aksi Nyata Luar Biasa! Melancarkan selokan mencegah banjir luapan air ke dalam kelas dan sarang jentik nyamuk.',
        pointValue: 120,
      },
      {
        id: '2b',
        text: 'Melangkah pergi meninggalkan selokan yang tersumbat karena merasa kebersihan sekolah bukan tugas giliranmu.',
        isCorrect: false,
        explanation: 'Sikap Pasif & Apatis! Menjaga kebersihan dan keamanan lingkungan sekolah adalah tanggung jawab moral seluruh warga sekolah.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 3,
    location: '🕌 Tempat Ibadah / Masjid',
    title: 'Adab Wudu: Menjauhi Sikap Mubazir',
    situation:
      'Menjelang salat zuhur berjamaah di musala, kamu melihat seorang teman membuka keran wudu secara maksimal sampai air menyembur ke mana-mana dan bercanda saling menyipratkan air wudu ke lantai.',
    svgKey: 'scene_masjid',
    options: [
      {
        id: '3a',
        text: 'Menegur dan menasihati teman secara santun agar mengecilkan putaran keran air wudu untuk mencegah mubazir.',
        isCorrect: true,
        explanation: 'Akhlak Mulia & Komunikasi Santun! Menggunakan air wudu secukupnya menjaga ketertiban tempat ibadah dan mencegah lantai licin.',
        pointValue: 120,
      },
      {
        id: '3b',
        text: 'Membiarkan teman bermain semprotan air wudu bersama-sama karena menganggap hal itu sebagai hiburan seru.',
        isCorrect: false,
        explanation: 'Perilaku Mubazir & Mengganggu Ibadah! Pemborosan air dan membuat lantai musala becek melanggar tata tertib dan adab kesucian.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 4,
    location: '🏞️ Sungai Desa & DAS',
    title: 'Pencemaran Ekosistem Air dari Jembatan',
    situation:
      'Saat melintasi jembatan sungai desa, kamu melihat seseorang hendak melempar kantong kresek besar berisi sampah sisa rumah tangga langsung ke aliran sungai yang mengalir ke hilir waduk.',
    svgKey: 'scene_sungai',
    options: [
      {
        id: '4a',
        text: 'Mengingatkan warga secara sopan agar tidak membuang sampah ke sungai dan mengarahkannya ke tempat sampah.',
        isCorrect: true,
        explanation: 'Keberanian Etis & Penyelamat Ekosistem! Menjaga sungai dari sampah melindungi biota air tawar dan mencegah sedimentasi Waduk Gajah Mungkur.',
        pointValue: 120,
      },
      {
        id: '4b',
        text: 'Membiarkan warga membuang sampah ke sungai bahkan ikut melempar sampah bungkus jajan sendiri ke aliran air.',
        isCorrect: false,
        explanation: 'Pelanggaran Lingkungan Serius! Membuang sampah ke sungai melanggar hukum dan memicu bencana banjir luapan di musim penghujan.',
        pointValue: 0,
      },
    ],
  },
  {
    id: 5,
    location: '🌳 Taman Kota & RTH',
    title: 'Pelestarian Ruang Terbuka Hijau & Tanaman Hias',
    situation:
      'Di taman kota yang asri, kamu melihat pengunjung menginjak-injak rumput hias dan bersiap mematahkan tangkai bunga indah di taman demi properti berfoto selfie.',
    svgKey: 'scene_taman',
    options: [
      {
        id: '5a',
        text: 'Mengingatkan pengunjung dengan sopan agar tidak merusak tanaman hias demi menjaga kelestarian taman kota.',
        isCorrect: true,
        explanation: 'Penjaga Bumi Sejati! Menjaga integritas ruang terbuka hijau memastikan paru-paru kota tetap sehat dan estetik untuk generasi penerus.',
        pointValue: 120,
      },
      {
        id: '5b',
        text: 'Membiarkan pengunjung memetik bunga dan ikut mengambil sekuntum bunga mekar untuk dibawa pulang ke rumah.',
        isCorrect: false,
        explanation: 'Tindakan Egois & Merusak Fasilitas Umum! Memetik bunga taman merusak keindahan ekologis yang dinikmati seluruh masyarakat.',
        pointValue: 0,
      },
    ],
  },
];

export const Mission3Scenarios: React.FC<Mission3ScenariosProps> = ({
  onScenarioAnswered,
  onMissionComplete,
}) => {
  // Scenarios shuffled on game start
  const [scenarios] = useState<ScenarioItem[]>(() => shuffleArray(SCENARIO_ITEMS));
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentScenario = scenarios[currentIndex];

  // Options shuffled randomly per scenario so correct answer is NOT fixed to option A
  const randomizedOptions = useMemo(() => {
    if (!currentScenario) return [];
    return shuffleArray(currentScenario.options);
  }, [currentScenario]);

  const handleSelectOption = (option: ScenarioOption) => {
    if (option.isCorrect) {
      soundManager.playSuccess();
      onScenarioAnswered(true, option.explanation, option.pointValue);
    } else {
      soundManager.playError();
      onScenarioAnswered(false, option.explanation, 0);
    }

    if (currentIndex + 1 < scenarios.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setTimeout(() => {
        onMissionComplete();
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-4xl mx-auto h-full min-h-[500px] p-4 text-slate-100">
      {/* Header Info */}
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
          Misi 3: Simulasi Sikap & Keputusan Etis HOTS
        </span>
        <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
          Analisis 5 kasus nyata di lingkungan sekitar kita. Tunjukkan akhlak terpuji sebagai Khalifah fil Ardh (Penjaga dan Pemakmur Bumi)!
        </p>
        <span className="text-xs text-slate-400 font-mono mt-0.5 block">
          Kasus #{currentIndex + 1} dari {scenarios.length}
        </span>
      </div>

      {/* Main Dilemma Card */}
      {currentScenario && (
        <div className="bg-slate-800/90 border-2 border-slate-700/80 rounded-2xl p-4 sm:p-6 w-full max-w-2xl shadow-2xl flex flex-col items-center text-center space-y-4 animate-fadeIn">
          {/* Location Badge */}
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400">
            {currentScenario.location} — {currentScenario.title}
          </div>

          {/* Large Scene Illustration */}
          <div className="w-full flex justify-center py-1">
            <ScenarioSceneSvg sceneKey={currentScenario.svgKey} size={220} />
          </div>

          {/* Narrative Case */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed text-left">
            <span className="font-bold text-emerald-400 block mb-1">Dilema Nyata:</span>
            {currentScenario.situation}
          </div>

          {/* Random Action Choices with Equal Sentence Lengths */}
          <div className="w-full space-y-2.5 pt-1">
            <span className="text-xs font-bold text-slate-400 block text-left">
              Pilihan Keputusan Sikap Kamu:
            </span>
            {randomizedOptions.map((opt, idx) => (
              <button
                key={`${opt.id}-${idx}`}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="w-full text-left p-3.5 rounded-xl border-2 border-slate-700 bg-slate-900 hover:bg-slate-850 hover:border-emerald-500 transition-all flex items-start gap-3 text-xs sm:text-sm text-slate-200 font-medium group cursor-pointer shadow-md"
              >
                <span className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white flex items-center justify-center text-xs font-bold shrink-0 transition-colors">
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
