import React, { useRef, useEffect } from 'react';
import { GLOBE_POINTS, LAND_MASK_BASE64 } from '../data/landMask';

const DEG = Math.PI / 180;
const SAO_PAULO: [number, number] = [-23.55, -46.63];
const START_ROTATION = -SAO_PAULO[1]; // opens with Brazil facing the viewer
const TILT = -10 * DEG; // leans the south forward so São Paulo sits near the centre
const SPEED = 8; // degrees per second, eastward like the real Earth
const SCROLL_SPIN = 0.06; // extra degrees per pixel scrolled
const PULSE_MS = 2400;

type Vec3 = [number, number, number];

const toVec3 = (lat: number, lon: number): Vec3 => [
  Math.cos(lat * DEG) * Math.sin(lon * DEG),
  Math.sin(lat * DEG),
  Math.cos(lat * DEG) * Math.cos(lon * DEG),
];

/* Land points on a Fibonacci sphere: evenly spaced, so no bunching at the poles */
const LAND: Vec3[] = (() => {
  const mask = Uint8Array.from(atob(LAND_MASK_BASE64), (c) => c.charCodeAt(0));
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: Vec3[] = [];
  for (let i = 0; i < GLOBE_POINTS; i++) {
    if (!(mask[i >> 3] & (1 << (i & 7)))) continue;
    const y = 1 - (2 * (i + 0.5)) / GLOBE_POINTS;
    const ring = Math.sqrt(1 - y * y);
    points.push([ring * Math.sin(i * golden), y, ring * Math.cos(i * golden)]);
  }
  return points;
})();

/* Graticule as polylines, one per meridian/parallel */
const GRATICULE: Vec3[][] = (() => {
  const lines: Vec3[][] = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const line: Vec3[] = [];
    for (let lat = -90; lat <= 90; lat += 4) line.push(toVec3(lat, lon));
    lines.push(line);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const line: Vec3[] = [];
    for (let lon = -180; lon <= 180; lon += 4) line.push(toVec3(lat, lon));
    lines.push(line);
  }
  return lines;
})();

const MARKER = toVec3(SAO_PAULO[0], SAO_PAULO[1]);

/* Dots fade toward the limb to give the sphere depth */
const DEPTH_BUCKETS = [
  { maxZ: 0.35, alpha: 0.4 },
  { maxZ: 0.7, alpha: 0.7 },
  { maxZ: Infinity, alpha: 1 },
];

export default function Globe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let size = 0;
    let rotation = START_ROTATION;
    let colors = { land: '', grid: '', outline: '', fill: '', accent: '' };

    /* Colours live in CSS tokens, so both themes are defined in one place */
    const readColors = () => {
      const css = getComputedStyle(document.body);
      colors = {
        land: css.getPropertyValue('--globe-land'),
        grid: css.getPropertyValue('--globe-grid'),
        outline: css.getPropertyValue('--globe-outline'),
        fill: css.getPropertyValue('--globe-fill'),
        accent: css.getPropertyValue('--accent'),
      };
    };

    const draw = (now: number) => {
      if (!size) return;
      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2 - 8;

      const sinR = Math.sin(rotation * DEG);
      const cosR = Math.cos(rotation * DEG);
      const sinT = Math.sin(TILT);
      const cosT = Math.cos(TILT);

      const project = ([x, y, z]: Vec3): Vec3 => {
        const x1 = x * cosR + z * sinR;
        const z1 = -x * sinR + z * cosR;
        return [cx + x1 * r, cy - (y * cosT - z1 * sinT) * r, y * sinT + z1 * cosT];
      };

      ctx.clearRect(0, 0, size, size);

      // Sphere body
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = colors.fill;
      ctx.fill();
      ctx.strokeStyle = colors.outline;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Graticule: lift the pen on the far side so lines never cut across the sphere
      ctx.beginPath();
      for (const line of GRATICULE) {
        let penDown = false;
        for (const point of line) {
          const [px, py, pz] = project(point);
          if (pz <= 0) {
            penDown = false;
          } else if (penDown) {
            ctx.lineTo(px, py);
          } else {
            ctx.moveTo(px, py);
            penDown = true;
          }
        }
      }
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // Land, batched per depth bucket so a frame needs only three fills
      const dot = Math.max(1, r * 0.0065);
      const paths = DEPTH_BUCKETS.map(() => new Path2D());
      for (const point of LAND) {
        const [px, py, pz] = project(point);
        if (pz <= 0) continue;
        const bucket = DEPTH_BUCKETS.findIndex((b) => pz < b.maxZ);
        paths[bucket].moveTo(px + dot, py);
        paths[bucket].arc(px, py, dot, 0, Math.PI * 2);
      }
      ctx.fillStyle = colors.land;
      paths.forEach((path, i) => {
        ctx.globalAlpha = DEPTH_BUCKETS[i].alpha;
        ctx.fill(path);
      });
      ctx.globalAlpha = 1;

      // São Paulo
      const [sx, sy, sz] = project(MARKER);
      if (sz > 0) {
        const unit = Math.max(3, r * 0.018);
        if (!reducedMotion) {
          const pulse = (now % PULSE_MS) / PULSE_MS;
          ctx.beginPath();
          ctx.arc(sx, sy, unit + pulse * unit * 4, 0, Math.PI * 2);
          ctx.strokeStyle = colors.accent;
          ctx.globalAlpha = 1 - pulse;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(sx, sy, unit, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.fill();
      }
    };

    /* Loop runs only while the globe is on screen */
    let frameId = 0;
    let lastTime = 0;
    const frame = (now: number) => {
      rotation += (SPEED * Math.min(now - lastTime, 100)) / 1000;
      lastTime = now;
      draw(now);
      frameId = requestAnimationFrame(frame);
    };
    const start = () => {
      if (reducedMotion || frameId) return;
      lastTime = performance.now();
      frameId = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      size = entry.contentRect.width;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });

    const themeObserver = new MutationObserver(() => {
      readColors();
      draw(performance.now());
    });

    // Scrolling pushes the spin, so the globe feels tied to the page's movement
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      if (!reducedMotion) rotation += (window.scrollY - lastScrollY) * SCROLL_SPIN;
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    readColors();
    resizeObserver.observe(wrap);
    visibilityObserver.observe(wrap);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      stop();
      window.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', aspectRatio: '1 / 1' }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Globo terrestre girando, com São Paulo em destaque"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}
