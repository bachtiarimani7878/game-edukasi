import { useEffect, useRef, useState, useCallback } from 'react';
import { loadMediaPipeHands } from '../utils/mediaPipeLoader';
import { HandLandmark } from '../utils/realisticCanvasDraw';

export interface HandPointerState {
  x: number; // Normalized [0, 1] mirrored
  y: number; // Normalized [0, 1]
  isGrabbing: boolean;
  isDetected: boolean;
  landmarks: HandLandmark[] | null;
}

export function useMediaPipeHands(autoStart: boolean = false) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsInstanceRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isGrabbingRef = useRef<boolean>(false);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [handState, setHandState] = useState<HandPointerState>({
    x: 0.5,
    y: 0.5,
    isGrabbing: false,
    isDetected: false,
    landmarks: null,
  });

  // Calculate pinch distance & normalize coords
  const processLandmarks = useCallback((rawLandmarks: any[]) => {
    if (!rawLandmarks || rawLandmarks.length === 0) {
      setHandState((prev) => ({
        ...prev,
        isDetected: false,
        landmarks: null,
      }));
      return;
    }

    const firstHand = rawLandmarks[0] as HandLandmark[];
    if (firstHand && firstHand.length >= 21) {
      const thumb = firstHand[4];
      const index = firstHand[8];

      // Distance between thumb tip and index fingertip
      const dx = thumb.x - index.x;
      const dy = thumb.y - index.y;
      const dz = (thumb.z || 0) - (index.z || 0);
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Pinch hysteresis: grab at < 0.085, release at > 0.125
      let grabbing = isGrabbingRef.current;
      if (dist < 0.085) {
        grabbing = true;
      } else if (dist > 0.125) {
        grabbing = false;
      }
      isGrabbingRef.current = grabbing;

      // Pinch midpoint (or index tip)
      const rawX = (thumb.x + index.x) / 2;
      const rawY = (thumb.y + index.y) / 2;

      // Mirrored X for natural user reflection
      const mirroredX = 1 - rawX;

      setHandState({
        x: Math.max(0, Math.min(1, mirroredX)),
        y: Math.max(0, Math.min(1, rawY)),
        isGrabbing: grabbing,
        isDetected: true,
        landmarks: firstHand,
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setHandState((prev) => ({ ...prev, isDetected: false, landmarks: null }));
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setIsModelLoading(true);

      // 1. Load MediaPipe script
      const loaded = await loadMediaPipeHands();
      if (!loaded || !window.Hands) {
        throw new Error('MediaPipe Hands SDK tidak tersedia dari CDN. Menggunakan simulasi sentuh.');
      }

      // 2. Initialize MediaPipe Hands if not already created
      if (!handsInstanceRef.current) {
        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        hands.onResults((results: any) => {
          if (results && results.multiHandLandmarks) {
            processLandmarks(results.multiHandLandmarks);
          }
        });
        handsInstanceRef.current = hands;
      }

      // 3. Request user webcam
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API tidak didukung di peramban ini.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      // Ensure hidden video element exists
      if (!videoRef.current) {
        const v = document.createElement('video');
        v.playsInline = true;
        v.muted = true;
        v.autoplay = true;
        videoRef.current = v;
      }

      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      setCameraActive(true);
      setIsModelLoading(false);

      // 4. Processing Loop
      let isSending = false;
      const onFrame = async () => {
        if (!video || video.paused || video.ended || !handsInstanceRef.current) return;

        if (!isSending && video.readyState >= 2) {
          isSending = true;
          try {
            await handsInstanceRef.current.send({ image: video });
          } catch (e) {
            // Ignore occasional frame send drops
          } finally {
            isSending = false;
          }
        }

        animFrameIdRef.current = requestAnimationFrame(onFrame);
      };

      animFrameIdRef.current = requestAnimationFrame(onFrame);
    } catch (err: any) {
      console.warn('Camera/MediaPipe error:', err);
      setIsModelLoading(false);
      setCameraError(err.message || 'Gagal menyalakan kamera. Mode sentuh/mouse tetap aktif!');
      stopCamera();
    }
  }, [processLandmarks, stopCamera]);

  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [autoStart, startCamera, stopCamera]);

  return {
    videoRef,
    cameraActive,
    cameraError,
    isModelLoading,
    handState,
    startCamera,
    stopCamera,
  };
}
