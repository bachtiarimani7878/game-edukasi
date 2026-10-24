/**
 * Dynamic loader for MediaPipe Hands and Camera Utils via CDN.
 * Ensures conflict-free loading in Vite / modern browsers without bundling issues.
 */

declare global {
  interface Window {
    Hands?: any;
    Camera?: any;
  }
}

let loadPromise: Promise<boolean> | null = null;

export function loadMediaPipeHands(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Hands) return Promise.resolve(true);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    // Timeout fallback after 7 seconds if CDN is blocked/slow
    const timeout = setTimeout(() => {
      console.warn('MediaPipe CDN load timed out, falling back to mouse/touch mode.');
      resolve(false);
    }, 7000);

    const loadScript = (src: string): Promise<void> => {
      return new Promise((res, rej) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          res();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.async = true;
        script.onload = () => res();
        script.onerror = () => rej(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    // Load Camera Utils then Hands
    loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')
      .catch(() => {
        // camera_utils is optional if we use custom rAF loop with getUserMedia
        console.warn('camera_utils CDN skipped, continuing with Hands...');
      })
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'))
      .then(() => {
        clearTimeout(timeout);
        if (window.Hands) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.warn('Error loading MediaPipe Hands from CDN:', err);
        resolve(false);
      });
  });

  return loadPromise;
}
