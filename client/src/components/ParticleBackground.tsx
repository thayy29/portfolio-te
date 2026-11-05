import React, { useRef, useEffect } from 'react';

const SCROLL_DEPTH = 0.12;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      const count = window.innerWidth < 768 ? 40 : 90;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      }));
    };

    const isDark = () => document.body.classList.contains('dark');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dark = isDark();
      const dotAlpha = dark ? 0.045 : 0.08;
      const lineAlpha = dark ? 0.025 : 0.04;
      const baseColor = dark ? '242,240,235' : '26,26,26';
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scrollShift = reducedMotion ? 0 : window.scrollY * SCROLL_DEPTH;

      // Deepest parallax layer: drifts slower than the page and wraps around vertically
      const screenY = particles.map((p) => {
        const y = (p.y - scrollShift) % canvas.height;
        return y < 0 ? y + canvas.height : y;
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, screenY[i], p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor},${dotAlpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = screenY[i] - screenY[j];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, screenY[i]);
            ctx.lineTo(particles[j].x, screenY[j]);
            ctx.strokeStyle = `rgba(${baseColor},${lineAlpha * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
