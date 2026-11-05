import React, { useRef, useEffect } from 'react';

const NODE_COUNT = 16;
const HEAD_FOLLOW = 0.32; // how quickly the filament's head catches the pointer, per 60fps frame
const NODE_FOLLOW = 0.3; // how quickly each node catches the one ahead of it
const ACTIVE_MS = 500; // reticle stays lit this long after the last movement
const MOTE_LIFE_MS = 650;
const MOTE_EVERY_MS = 70;
const MAX_MOTES = 20;
const RETICLE_RADIUS = 11;
const RETICLE_RADIUS_HOVER = 18;
const INTERACTIVE = 'a, button, input, textarea, select, label';

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
}

/**
 * Thin filament that chases the native pointer, with a rotating reticle and a few fading
 * pixels. The native pointer stays visible, so this is purely decorative.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const supported =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!supported) return;

    const nodes = Array.from({ length: NODE_COUNT }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    let motes: Mote[] = [];
    let frameId = 0;
    let lastFrame = 0;
    let lastMove = -Infinity;
    let lastMote = 0;
    let activity = 0; // 0..1, eased brightness of the whole effect
    let radius = RETICLE_RADIUS;
    let hovering = false;
    let spin = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      const dt = Math.min(now - lastFrame, 50);
      const steps = dt / (1000 / 60); // keeps the easing speed independent of refresh rate
      lastFrame = now;

      const ease = (k: number) => 1 - Math.pow(1 - k, steps);
      const active = now - lastMove < ACTIVE_MS;
      activity += ((active ? 1 : 0) - activity) * ease(active ? 0.2 : 0.07);
      radius += ((hovering ? RETICLE_RADIUS_HOVER : RETICLE_RADIUS) - radius) * ease(0.18);
      spin += dt * (hovering ? 0.0032 : 0.0016);

      nodes[0].x += (target.x - nodes[0].x) * ease(HEAD_FOLLOW);
      nodes[0].y += (target.y - nodes[0].y) * ease(HEAD_FOLLOW);
      for (let i = 1; i < NODE_COUNT; i++) {
        nodes[i].x += (nodes[i - 1].x - nodes[i].x) * ease(NODE_FOLLOW);
        nodes[i].y += (nodes[i - 1].y - nodes[i].y) * ease(NODE_FOLLOW);
      }

      const tail = nodes[NODE_COUNT - 1];
      const stretch = Math.hypot(nodes[0].x - tail.x, nodes[0].y - tail.y);

      // Motes shed sideways from the filament, only while it is stretched by movement
      if (stretch > 30 && now - lastMote > MOTE_EVERY_MS && motes.length < MAX_MOTES) {
        lastMote = now;
        const from = nodes[Math.floor(NODE_COUNT / 2)];
        const side = Math.random() < 0.5 ? -1 : 1;
        const dx = (nodes[0].x - tail.x) / stretch;
        const dy = (nodes[0].y - tail.y) / stretch;
        motes.push({ x: from.x, y: from.y, vx: -dy * side * 0.02, vy: dx * side * 0.02, born: now });
      }
      motes = motes.filter((m) => now - m.born < MOTE_LIFE_MS);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.strokeStyle = ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--cursor-trail');
      ctx.lineCap = 'round';

      // Filament, with a wide faint pass under the thin one as a soft glow
      for (let i = 1; i < NODE_COUNT; i++) {
        const fade = Math.pow(1 - i / NODE_COUNT, 1.5);
        ctx.beginPath();
        ctx.moveTo(nodes[i - 1].x, nodes[i - 1].y);
        ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.globalAlpha = fade * activity * 0.1;
        ctx.lineWidth = 5 * fade + 1;
        ctx.stroke();
        ctx.globalAlpha = fade * activity * 0.65;
        ctx.lineWidth = 1.25 * fade + 0.25;
        ctx.stroke();
      }

      for (const m of motes) {
        const age = now - m.born;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        ctx.globalAlpha = (1 - age / MOTE_LIFE_MS) * activity * 0.5;
        ctx.fillRect(m.x - 0.75, m.y - 0.75, 1.5, 1.5);
      }

      // Reticle: three rotating arcs, slightly behind the pointer
      const center = nodes[1];
      ctx.globalAlpha = activity * 0.55;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const start = spin + (i * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, start, start + Math.PI / 3);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Stop once everything has faded, so a still mouse costs nothing
      const settled = !active && activity < 0.01 && motes.length === 0;
      if (settled) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        frameId = 0;
      } else {
        frameId = requestAnimationFrame(frame);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      hovering = e.target instanceof Element && e.target.closest(INTERACTIVE) !== null;
      lastMove = performance.now();
      if (!frameId) {
        // Waking up: start collapsed on the pointer rather than flying in from the last spot
        for (const node of nodes) {
          node.x = target.x;
          node.y = target.y;
        }
        lastFrame = lastMove;
        frameId = requestAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
