import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeEarthProps {
  healthIndex: number; // 0 (polluted) to 100 (flourishing green & blue)
  size?: number;
  className?: string;
  interactive?: boolean;
}

export const ThreeEarth: React.FC<ThreeEarthProps> = ({
  healthIndex,
  size = 240,
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const healthRef = useRef<number>(healthIndex);
  healthRef.current = healthIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const isGlAvailable = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    })();

    if (!isGlAvailable) {
      render2DFallback(container, size, healthRef.current);
      return;
    }

    let frameId: number = 0;
    const finalSize = size;

    // Scene & Camera - Strictly 1:1 Aspect Ratio to guarantee a PERFECT SPHERE
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 2.85); // Safe distance so halo/clouds never clip at edges

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(finalSize, finalSize, false);
      
      // Explicit DOM styling to prevent any external CSS flex stretching
      renderer.domElement.style.width = `${finalSize}px`;
      renderer.domElement.style.height = `${finalSize}px`;
      renderer.domElement.style.aspectRatio = '1 / 1';
      renderer.domElement.style.borderRadius = '50%'; // Absolute circle boundary
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.overflow = 'hidden';
      renderer.domElement.style.boxShadow =
        '0 15px 35px -5px rgba(2, 132, 199, 0.4), inset 0 0 25px rgba(0, 0, 0, 0.5)';

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch {
      render2DFallback(container, size, healthRef.current);
      return;
    }

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const atmosphereLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    atmosphereLight.position.set(-5, -2, -3);
    scene.add(atmosphereLight);

    // Procedural High-Detail Equirectangular Earth Texture
    function createEarthTexture(health: number): THREE.CanvasTexture {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      const ratio = Math.max(0, Math.min(1, health / 100));

      // 1. Deep Ocean Base
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
      if (ratio > 0.5) {
        oceanGrad.addColorStop(0, '#024A86');
        oceanGrad.addColorStop(0.5, '#0284C7');
        oceanGrad.addColorStop(1, '#024A86');
      } else {
        oceanGrad.addColorStop(0, '#2D1F17');
        oceanGrad.addColorStop(0.5, '#523A28');
        oceanGrad.addColorStop(1, '#2D1F17');
      }
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Shallow coastal shelves around landmasses
      if (ratio > 0.4) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        // Equatorial shelf
        ctx.fillRect(0, 220, 1024, 70);
      }

      // 2. Polar Ice Caps (White at North and South poles)
      ctx.fillStyle = ratio > 0.4 ? '#F8FAFC' : '#CBD5E1';
      // North Pole Cap
      ctx.beginPath();
      ctx.ellipse(512, 20, 512, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      // South Pole Cap (Antarctica)
      ctx.beginPath();
      ctx.ellipse(512, 490, 512, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Continents (Landmasses)
      // Health color: 100% -> Lush Emerald Green (#059669), 0% -> Barren Ash Brown (#5C4D3C)
      const landR = Math.round(92 * (1 - ratio) + 5 * ratio);
      const landG = Math.round(77 * (1 - ratio) + 150 * ratio);
      const landB = Math.round(60 * (1 - ratio) + 105 * ratio);
      ctx.fillStyle = `rgb(${landR}, ${landG}, ${landB})`;

      // Eurasia & Middle East
      ctx.beginPath();
      ctx.ellipse(580, 150, 170, 75, 0.1, 0, Math.PI * 2);
      ctx.ellipse(650, 170, 130, 80, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Africa
      ctx.beginPath();
      ctx.ellipse(510, 280, 75, 100, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // North America
      ctx.beginPath();
      ctx.ellipse(220, 140, 110, 75, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // South America
      ctx.beginPath();
      ctx.ellipse(290, 320, 70, 95, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Australia
      ctx.beginPath();
      ctx.ellipse(820, 350, 75, 55, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. NUSANTARA / INDONESIA ARCHIPELAGO (Prominently Highlighted!)
      ctx.fillStyle = ratio > 0.4 ? '#10B981' : '#785E43';
      // Sumatera
      ctx.beginPath();
      ctx.ellipse(710, 260, 24, 10, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // Jawa
      ctx.beginPath();
      ctx.ellipse(740, 285, 26, 7, 0.1, 0, Math.PI * 2);
      ctx.fill();
      // Kalimantan
      ctx.beginPath();
      ctx.ellipse(750, 245, 20, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      // Sulawesi
      ctx.beginPath();
      ctx.ellipse(780, 255, 14, 16, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Papua
      ctx.beginPath();
      ctx.ellipse(835, 265, 30, 12, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Coasts & Golden Highlights
      if (ratio > 0.5) {
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Smog & Air Pollution Layer if health is low
      if (ratio < 0.6) {
        ctx.fillStyle = `rgba(130, 85, 50, ${(0.6 - ratio) * 0.85})`;
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.ellipse((i * 105) % 1024, 160 + (i % 3) * 50, 80, 22, 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // 1. Earth Sphere Mesh (Ultra-high 64x64 segments for perfectly round curvature)
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: createEarthTexture(healthRef.current),
      roughness: 0.65,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    // Initial tilt to show Nusantara / Indonesia proudly
    earthMesh.rotation.y = 3.6;
    earthMesh.rotation.x = 0.2;
    scene.add(earthMesh);

    // 2. Swirling Cloud Sphere Layer
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cCtx = cloudCanvas.getContext('2d')!;
    cCtx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 28; i++) {
      cCtx.beginPath();
      cCtx.ellipse(
        Math.random() * 1024,
        Math.random() * 512,
        30 + Math.random() * 60,
        15 + Math.random() * 25,
        Math.random() * 0.5,
        0,
        Math.PI * 2
      );
      cCtx.fill();
    }
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.018, 48, 48), cloudMat);
    scene.add(cloudMesh);

    // 3. Subtle Outer Atmospheric Glow Halo
    const haloGeo = new THREE.SphereGeometry(1.035, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // Mouse / Touch 360-Degree Drag Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      earthMesh.rotation.y += deltaX * 0.008;
      earthMesh.rotation.x = Math.max(-0.6, Math.min(0.6, earthMesh.rotation.x + deltaY * 0.005));
      cloudMesh.rotation.y += deltaX * 0.008;

      prevX = clientX;
      prevY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const el = renderer.domElement;
    el.addEventListener('mousedown', handlePointerDown);
    el.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    el.addEventListener('touchstart', handlePointerDown, { passive: true });
    el.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop
    let lastHealth = healthRef.current;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isDragging) {
        earthMesh.rotation.y += 0.0035;
        cloudMesh.rotation.y += 0.005;
      }

      // Live health texture update
      if (Math.abs(healthRef.current - lastHealth) > 3) {
        lastHealth = healthRef.current;
        material.map?.dispose();
        material.map = createEarthTexture(lastHealth);
        material.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener('mousedown', handlePointerDown);
      el.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      el.removeEventListener('touchstart', handlePointerDown);
      el.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      cloudTex.dispose();
      cloudMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, size]);

  return (
    <div
      ref={mountRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`relative w-[${size}px] h-[${size}px] aspect-square shrink-0 rounded-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
    />
  );
};

// 2D Canvas Fallback (100% mathematically round)
function render2DFallback(container: HTMLElement, size: number, health: number) {
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.style.borderRadius = '50%';
  canvas.style.display = 'block';
  canvas.style.aspectRatio = '1 / 1';
  canvas.style.boxShadow = '0 10px 25px rgba(2, 132, 199, 0.4)';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const ratio = Math.max(0, Math.min(1, health / 100));
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.48;

  // Ocean Gradient
  const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
  if (ratio > 0.5) {
    grad.addColorStop(0, '#38BDF8');
    grad.addColorStop(0.7, '#0284C7');
    grad.addColorStop(1, '#034E7B');
  } else {
    grad.addColorStop(0, '#78350F');
    grad.addColorStop(0.7, '#523A28');
    grad.addColorStop(1, '#2D1F17');
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Continents
  ctx.fillStyle = ratio > 0.5 ? '#10B981' : '#5C4D3C';
  ctx.beginPath();
  ctx.ellipse(cx - 15, cy - 10, r * 0.5, r * 0.35, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx + 25, cy + 20, r * 0.32, r * 0.22, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Outer Atmosphere Ring
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  container.appendChild(canvas);
}
