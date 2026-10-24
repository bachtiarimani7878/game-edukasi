import React, { useEffect, useRef, useState } from 'react';
import { Download, X, Award, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalScore: number;
  difficulty: string;
  earthHealth: number;
  bankSavings: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  finalScore,
  difficulty,
  earthHealth,
  bankSavings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [studentName, setStudentName] = useState('Ananda Khalifah Bumi');
  const [schoolName, setSchoolName] = useState('SDN 2 Girimarto');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    renderCertificate();
  }, [isOpen, studentName, schoolName, finalScore, difficulty, earthHealth, bankSavings]);

  const renderCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 2000;
    const height = 1414;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Cream / Linen
    ctx.fillStyle = '#FCFBF7';
    ctx.fillRect(0, 0, width, height);

    // Decorative subtle Guilloché pattern
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.04)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.bezierCurveTo(i + 100, height * 0.5, i - 100, height * 0.5, i, height);
      ctx.stroke();
    }

    // 2. Ornate Emerald & Gold Outer Border
    ctx.strokeStyle = '#047857'; // Deep Emerald
    ctx.lineWidth = 28;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = '#D97706'; // Gold
    ctx.lineWidth = 6;
    ctx.strokeRect(65, 65, width - 130, height - 130);

    ctx.strokeStyle = '#10B981'; // Mint hairline
    ctx.lineWidth = 2;
    ctx.strokeRect(76, 76, width - 152, height - 152);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(60, 0);
      ctx.lineTo(60, 10);
      ctx.lineTo(10, 10);
      ctx.lineTo(10, 60);
      ctx.lineTo(0, 60);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawCorner(85, 85, 0);
    drawCorner(width - 85, 85, Math.PI / 2);
    drawCorner(width - 85, height - 85, Math.PI);
    drawCorner(85, height - 85, -Math.PI / 2);

    // 3. Official Vector Badges (Drawn purely in Canvas to prevent any CORS tainted canvas error!)
    // PGRI Badge Left
    drawPgriBadge(ctx, 240, 220, 85);
    // Wonogiri Badge Right
    drawWonogiriBadge(ctx, width - 240, 220, 85);

    // 4. Header Titles
    ctx.textAlign = 'center';

    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PERSATUAN GURU REPUBLIK INDONESIA (PGRI) KABUPATEN WONOGIRI', width / 2, 170);

    ctx.fillStyle = '#78350F';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HUT KE-81 PGRI & HARI GURU NASIONAL (HGN) TAHUN 2026', width / 2, 210);

    ctx.fillStyle = '#D97706';
    ctx.font = '900 68px "Outfit", sans-serif';
    ctx.fillText('SERTIFIKAT PENGHARGAAN', width / 2, 310);

    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PENJAGA BUMI NUSANTARA', width / 2, 370);

    ctx.fillStyle = '#475569';
    ctx.font = 'italic 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Diberikan kepada peserta didik teladan berprestasi:', width / 2, 450);

    // 5. Student Name (Large Bold Elegant)
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 76px "Outfit", serif';
    ctx.fillText(studentName.toUpperCase(), width / 2, 550);

    // Underline beneath name
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 400, 575);
    ctx.lineTo(width / 2 + 400, 575);
    ctx.stroke();

    // 6. School / Class
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Asal Sekolah: ${schoolName}`, width / 2, 630);

    // 7. Predicate & Description
    ctx.fillStyle = '#1E293B';
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Telah berhasil menyelesaikan seluruh 6 Misi Ekologi & Pembelajaran Abad 21 (4C) dengan predikat:', width / 2, 710);

    // Predikat Box
    ctx.fillStyle = '#065F46';
    ctx.fillRect(width / 2 - 500, 750, 1000, 75);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 2 - 500, 750, 1000, 75);

    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 38px "Outfit", sans-serif';
    ctx.fillText('★ KHALIFAH CILIK TELADAN PELESTARI LINGKUNGAN ★', width / 2, 802);

    // 8. Metrics Grid (Score, Health, Savings)
    const metricsY = 910;
    const cardWidth = 340;
    const gap = 60;
    const startX = width / 2 - (cardWidth * 3 + gap * 2) / 2;

    const metrics = [
      { label: 'Total Poin Amal', val: `${finalScore} Pts`, color: '#047857' },
      { label: 'Indeks Kesehatan Bumi', val: `${Math.round(earthHealth)}% Hijau`, color: '#0284C7' },
      { label: 'Tabungan Bank Sampah', val: `Rp${bankSavings.toLocaleString('id-ID')}`, color: '#D97706' },
    ];

    metrics.forEach((m, idx) => {
      const cx = startX + idx * (cardWidth + gap);
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(cx, metricsY, cardWidth, 120);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, metricsY, cardWidth, 120);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(m.label, cx + cardWidth / 2, metricsY + 45);

      ctx.fillStyle = m.color;
      ctx.font = '900 34px "Outfit", monospace';
      ctx.fillText(m.val, cx + cardWidth / 2, metricsY + 95);
    });

    // 9. Date & Official Signature Block
    const footerY = 1130;
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Left Seal / QR Code
    drawOfficialGoldSeal(ctx, 350, footerY + 60, 70);

    // Right Signature of Bachtiar Imani, S.Pd.
    ctx.textAlign = 'center';
    ctx.fillStyle = '#334155';
    ctx.font = '24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Wonogiri, ${today}`, width - 420, footerY);

    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Pendidik & Pengembang Game Edukasi,', width - 420, footerY + 35);

    // Decorative cursive signature stroke
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(width - 520, footerY + 80);
    ctx.bezierCurveTo(width - 480, footerY + 60, width - 450, footerY + 110, width - 410, footerY + 70);
    ctx.bezierCurveTo(width - 380, footerY + 50, width - 350, footerY + 90, width - 310, footerY + 75);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('BACHTIAR IMANI, S.Pd.', width - 420, footerY + 125);

    ctx.fillStyle = '#047857';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SDN 2 Girimarto (PGRI Cabang Girimarto)', width - 420, footerY + 155);

    ctx.fillStyle = '#64748B';
    ctx.font = '20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Kabupaten Wonogiri, Jawa Tengah', width - 420, footerY + 185);
  };

  const drawPgriBadge = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#047857';
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Torch & book
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.ellipse(0, -10, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.ellipse(0, -5, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PGRI', 0, 45);
    ctx.restore();
  };

  const drawWonogiriBadge = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#0284C7';
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#047857';
    ctx.fill();

    // Mountain & star
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', 0, -20);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('WONOGIRI', 0, 42);
    ctx.restore();
  };

  const drawOfficialGoldSeal = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.save();
    ctx.translate(x, y);
    // Outer jagged gold sunburst
    ctx.fillStyle = '#D97706';
    const points = 24;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? r : r * 0.85;
      const angle = (i * Math.PI) / points;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();

    // Inner gold circle
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL', 0, -12);
    ctx.fillText('VERIFIED', 0, 8);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('2026', 0, 26);
    ctx.restore();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Sertifikat_Penjaga_Bumi_${studentName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              Sertifikat Resmi Penjaga Bumi Nusantara (HD 2000x1414)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Customizer Bar */}
        <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Nama Lengkap Peserta Didik:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ketik nama siswa..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Kelas / Satuan Pendidikan:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Ketik sekolah..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>
        </div>

        {/* Canvas Preview Area */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl border border-slate-700"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Penandatangan Resmi: Bachtiar Imani, S.Pd. · SDN 2 Girimarto (Wonogiri)
          </span>
          <div className="flex items-center gap-3">
            {downloadSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Sertifikat HD Berhasil Diunduh!
              </span>
            )}
            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Sertifikat Resmi (PNG HD)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
