'use client';

import React, { useEffect, useRef } from 'react';
import { LAND } from './worldLand';

const NAVY = '#01304A';
const SKY = '#669BBB';
const CREAM = '#FEF0D5';
const RED = '#C1121F';
const DEG = Math.PI / 180;

// Manaus é a origem das rotas; as demais cidades são destinos.
const CITIES = [
  { name: 'Manaus', lat: -3.119, lon: -60.021, home: true },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
];

const toVec = (lat, lon) => [
  Math.cos(lat * DEG) * Math.sin(lon * DEG),
  Math.sin(lat * DEG),
  Math.cos(lat * DEG) * Math.cos(lon * DEG),
];

function inPolygon(lon, lat, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Malha de pontos (esfera de Fibonacci) separada em terra e oceano. Calculada uma única vez.
let cachedDots = null;
function getDots() {
  if (cachedDots) return cachedDots;
  const N = 6200;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const land = [];
  const sea = [];
  for (let i = 0; i < N; i++) {
    const sinLat = 1 - (2 * (i + 0.5)) / N;
    const lat = Math.asin(sinLat) / DEG;
    let lon = ((i * golden) / DEG) % 360;
    if (lon > 180) lon -= 360;
    const dot = { x: 0, y: sinLat, c: Math.sqrt(1 - sinLat * sinLat), lon: lon * DEG };
    const isLand = LAND.some((poly) => inPolygon(lon, lat, poly));
    if (isLand) land.push(dot);
    else if (i % 3 === 0) sea.push(dot);
  }
  cachedDots = { land, sea };
  return cachedDots;
}

// Arcos de grande círculo de Manaus até cada destino, levemente elevados da superfície.
let cachedArcs = null;
function getArcs() {
  if (cachedArcs) return cachedArcs;
  const home = CITIES[0];
  const a = toVec(home.lat, home.lon);
  cachedArcs = CITIES.slice(1).map((city, idx) => {
    const b = toVec(city.lat, city.lon);
    const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const omega = Math.acos(dot);
    const sinO = Math.sin(omega) || 1;
    const pts = [];
    const steps = 48;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const k1 = Math.sin((1 - t) * omega) / sinO;
      const k2 = Math.sin(t * omega) / sinO;
      const lift = 1 + 0.2 * Math.sin(Math.PI * t) * Math.min(1, omega / 1.6);
      pts.push([
        (k1 * a[0] + k2 * b[0]) * lift,
        (k1 * a[1] + k2 * b[1]) * lift,
        (k1 * a[2] + k2 * b[2]) * lift,
      ]);
    }
    return { pts, offset: idx * 0.23 };
  });
  return cachedArcs;
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function GlobeFallback({ className = '' }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const s = {
      lam: -58 * DEG, // longitude central (começa em Manaus)
      tilt: 0.36,
      size: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      visible: true,
      raf: 0,
      lastTime: 0,
      time: 0,
    };

    const { land, sea } = getDots();
    const arcs = getArcs();

    const rotate = (x, y, z) => {
      const cl = Math.cos(s.lam);
      const sl = Math.sin(s.lam);
      const x1 = x * cl - z * sl;
      const z1 = x * sl + z * cl;
      const ct = Math.cos(s.tilt);
      const st = Math.sin(s.tilt);
      return [x1, y * ct - z1 * st, y * st + z1 * ct];
    };

    const draw = () => {
      const size = s.size;
      if (!size) return;
      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.37;
      const k = R / 200;
      ctx.clearRect(0, 0, size, size);

      // Órbita tracejada: metade de trás fica atrás do globo, metade da frente por cima.
      const orbit = (from, to) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.38);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 1.3, R * 0.4, 0, from, to);
        ctx.strokeStyle = 'rgba(1,48,74,0.45)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.setLineDash([1, 9]);
        ctx.stroke();
        ctx.restore();
      };
      orbit(Math.PI, Math.PI * 2);

      // Oceano
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = SKY;
      ctx.fill();

      // Pontos do oceano (textura discreta)
      ctx.beginPath();
      for (let i = 0; i < sea.length; i++) {
        const d = sea[i];
        const [x, y, z] = rotate(d.c * Math.sin(d.lon), d.y, d.c * Math.cos(d.lon));
        if (z <= 0.04) continue;
        const px = cx + x * R;
        const py = cy - y * R;
        const r = 0.8 * k * (0.6 + 0.4 * z);
        ctx.moveTo(px + r, py);
        ctx.arc(px, py, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = 'rgba(254,240,213,0.38)';
      ctx.fill();

      // Continentes
      ctx.beginPath();
      for (let i = 0; i < land.length; i++) {
        const d = land[i];
        const [x, y, z] = rotate(d.c * Math.sin(d.lon), d.y, d.c * Math.cos(d.lon));
        if (z <= 0.02) continue;
        const px = cx + x * R;
        const py = cy - y * R;
        const r = 2.05 * k * (0.55 + 0.45 * z);
        ctx.moveTo(px + r, py);
        ctx.arc(px, py, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = NAVY;
      ctx.fill();

      // Sombra suave na borda para dar volume
      const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.2, cx, cy, R);
      grad.addColorStop(0, 'rgba(254,240,213,0.16)');
      grad.addColorStop(0.7, 'rgba(1,48,74,0)');
      grad.addColorStop(1, 'rgba(1,48,74,0.28)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = NAVY;
      ctx.stroke();

      orbit(0, Math.PI);

      // Rotas a partir de Manaus
      const animate = false;
      arcs.forEach((arc) => {
        const proj = arc.pts.map((p) => rotate(p[0], p[1], p[2]));
        ctx.beginPath();
        let pen = false;
        proj.forEach(([x, y, z]) => {
          if (z <= 0.02) {
            pen = false;
            return;
          }
          const px = cx + x * R;
          const py = cy - y * R;
          if (pen) ctx.lineTo(px, py);
          else ctx.moveTo(px, py);
          pen = true;
        });
        ctx.strokeStyle = CREAM;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([2, 7]);
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.setLineDash([]);

        // Viajante percorrendo a rota
        if (animate) {
          const t = (s.time * 0.00018 + arc.offset) % 1;
          const idx = Math.min(arc.pts.length - 1, Math.floor(t * (arc.pts.length - 1)));
          const [x, y, z] = proj[idx];
          if (z > 0.02) {
            ctx.beginPath();
            ctx.arc(cx + x * R, cy - y * R, 4.2, 0, Math.PI * 2);
            ctx.fillStyle = RED;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = CREAM;
            ctx.stroke();
          }
        }
      });

      // Cidades
      ctx.font = '700 13px Urbanist, system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      CITIES.forEach((city) => {
        const v = toVec(city.lat, city.lon);
        const [x, y, z] = rotate(v[0], v[1], v[2]);
        if (z <= 0.12) return;
        const px = cx + x * R;
        const py = cy - y * R;

        if (city.home) {
          const pulse = animate ? ((s.time / 1400) % 1) : 0.4;
          ctx.beginPath();
          ctx.arc(px, py, 7 + pulse * 14, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(193,18,31,${0.7 * (1 - pulse)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(px, py, city.home ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = city.home ? RED : CREAM;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = city.home ? CREAM : NAVY;
        ctx.stroke();

        const label = city.name;
        const w = ctx.measureText(label).width + 18;
        const h = 24;
        const lx = px + 12;
        const ly = py - h / 2;
        roundedRect(ctx, lx, ly, w, h, 12);
        ctx.fillStyle = city.home ? RED : CREAM;
        ctx.fill();
        ctx.fillStyle = city.home ? CREAM : NAVY;
        ctx.fillText(label, lx + 9, py + 0.5);
      });
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const size = Math.round(Math.min(rect.width, rect.height || rect.width));
      if (!size) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.size = size;
      draw();
    };

    const loop = (now) => {
      const dt = s.lastTime ? Math.min(now - s.lastTime, 64) : 16;
      s.lastTime = now;
      s.time += dt;
      if (!s.dragging) s.lam += dt * 0.000075;
      draw();
      s.raf = requestAnimationFrame(loop);
    };

    const start = () => {
      return; // The lightweight fallback is static until the visitor interacts.
      s.lastTime = 0;
      s.raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
    const redrawStatic = () => {
      if (!s.raf) draw();
    };

    const onDown = (e) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (err) {
        /* captura de ponteiro indisponível */
      }
    };
    const onMove = (e) => {
      if (!s.dragging) return;
      s.lam -= (e.clientX - s.lastX) * 0.006;
      s.tilt = Math.max(-0.5, Math.min(0.9, s.tilt + (e.clientY - s.lastY) * 0.004));
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      redrawStatic();
    };
    const onUp = () => {
      s.dragging = false;
    };
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') s.lam -= 0.18;
      else if (e.key === 'ArrowRight') s.lam += 0.18;
      else if (e.key === 'ArrowUp') s.tilt = Math.min(0.9, s.tilt + 0.1);
      else if (e.key === 'ArrowDown') s.tilt = Math.max(-0.5, s.tilt - 0.1);
      else return;
      e.preventDefault();
      redrawStatic();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => {
      if (motionQuery.matches) {
        stop();
        draw();
      } else {
        start();
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(
      ([entry]) => {
        s.visible = entry.isIntersecting;
        if (s.visible) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);

    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
      if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-square w-full select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label="Globo interativo com rotas de Manaus para Nova York, Londres, Toronto e Sydney. Arraste ou use as setas do teclado para girar."
        className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />
    </div>
  );
}
