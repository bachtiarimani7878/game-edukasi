import React, { useEffect, useRef, useState } from 'react';

interface ARCameraOverlayProps {
  enabled: boolean;
  onClose: () => void;
}

export const ARCameraOverlay: React.FC<ARCameraOverlayProps> = ({ enabled, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setStreamActive(false);
      return;
    }

    // Attempt WebRTC camera stream
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      })
      .catch((err) => {
        console.warn('AR Camera stream access fallback:', err);
        setErrorMsg('Simulasi AR Aktif (Kamera nyata memerlukan izin browser)');
        setStreamActive(true);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6">
      {/* Video Background Layer */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`fixed inset-0 w-full h-full object-cover z-[-1] opacity-25 filter contrast-125 ${
          !streamActive ? 'hidden' : ''
        }`}
      />

      {/* Holographic HUD Reticle & Corner Brackets */}
      <div className="absolute inset-8 border border-emerald-500/30 rounded-3xl pointer-events-none">
        {/* Top-left bracket */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
        {/* Top-right bracket */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
        {/* Bottom-left bracket */}
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
        {/* Bottom-right bracket */}
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

        {/* Center Scanner Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-2 border-emerald-400/40 border-dashed animate-spin" style={{ animationDuration: '18s' }} />
          <div className="absolute w-28 h-28 rounded-full border border-emerald-400/60" />
          <div className="absolute w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
      </div>

      {/* Header Badge */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="bg-slate-900/90 border border-emerald-500/50 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>MODE AR ECO-SCANNER: AKTIF</span>
          {errorMsg && <span className="text-amber-400 text-[11px]">({errorMsg})</span>}
        </div>
        <button
          onClick={onClose}
          className="bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg cursor-pointer transition-colors"
        >
          ✕ Tutup AR
        </button>
      </div>

      {/* Bottom AR Guidance */}
      <div className="text-center pointer-events-auto">
        <div className="inline-block bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-slate-200 shadow-xl">
          AR Hand-Tracking & Eco-Detection: Arahkan ke objek atau kendalikan dengan sentuhan layar.
        </div>
      </div>
    </div>
  );
};
