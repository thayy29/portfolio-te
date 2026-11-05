import React, { useRef, useEffect } from 'react';

/* Continent dot coordinates (lat, lon) mapped to canvas */
const CONTINENTS: [number, number][] = [
  // South America
  [-15, -55], [-23, -46], [-10, -65], [-33, -70], [-5, -50], [-20, -60], [-12, -77], [-3, -60],
  // North America
  [40, -100], [34, -118], [41, -87], [29, -95], [25, -80], [19, -99], [45, -73], [37, -122],
  // Europe
  [48, 2], [51, 0], [52, 13], [41, 12], [40, -3], [59, 18], [55, 37], [47, 19],
  // Africa
  [30, 31], [6, 3], [-1, 37], [-26, 28], [34, 9], [9, 38], [-4, 15], [12, -8],
  // Asia
  [35, 139], [31, 121], [28, 77], [37, 127], [1, 104], [13, 100], [39, 116], [22, 114],
  // Oceania
  [-34, 151], [-37, 145], [-28, 153], [-42, 173],
];

interface Props {
  size?: number;
}

export default function Globe({ size = 320 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let rotation = 0;
    let animId: number;

    const isDark = () => document.body.classList.contains('dark');

    const project = (lat: number, lon: number, rot: number): [number, number, boolean] => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + rot) * (Math.PI / 180);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      const r = size / 2 - 10;
      return [size / 2 + x * r, size / 2 - y * r, z > 0];
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2 - 10;
      const dark = isDark();

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = dark ? 'rgba(255,107,44,0.12)' : 'rgba(255,107,44,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Grid lines (longitude)
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 2) {
          const [px, py, vis] = project(lat, lon, rotation);
          if (!vis) continue;
          if (lat === -90) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = dark ? 'rgba(255,107,44,0.07)' : 'rgba(255,107,44,0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Grid lines (latitude)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lon = -180; lon <= 180; lon += 2) {
          const [px, py, vis] = project(lat, lon, rotation);
          if (!vis) continue;
          if (lon === -180) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = dark ? 'rgba(255,107,44,0.07)' : 'rgba(255,107,44,0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Continent dots
      for (const [lat, lon] of CONTINENTS) {
        const [px, py, vis] = project(lat, lon, rotation);
        if (!vis) continue;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,44,${dark ? 0.25 : 0.35})`;
        ctx.fill();
      }

      // São Paulo highlight
      const [spx, spy, spVis] = project(-23.55, -46.63, rotation);
      if (spVis) {
        ctx.beginPath();
        ctx.arc(spx, spy, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,107,44,0.7)';
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(spx, spy, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,107,44,0.08)';
        ctx.fill();
      }

      rotation += 0.15;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      aria-label="Interactive globe"
    />
  );
}
