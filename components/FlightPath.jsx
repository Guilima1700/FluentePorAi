'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PlaneGlyph } from './Illustrations';

/*
 * Avião que atravessa a página inteira de seção em seção.
 *
 * - A rota é uma curva suave calculada a partir da posição real das seções (refeita em cada
 *   redimensionamento), então funciona em qualquer largura de tela.
 * - O avião acompanha a rolagem com suavização; a rota pontilhada à frente vira linha cheia atrás dele.
 * - A cor da rota muda conforme o fundo de cada seção.
 * - Decorativo: aria-hidden, sem eventos de ponteiro, e desligado com prefers-reduced-motion.
 */

const NAVY = '#01304A';
const CREAM = '#FEF0D5';

// [cor, opacidade] da rota sobre o fundo de cada seção
const SECTION_INK = {
  inicio: [NAVY, 0.6],
  sobre: [CREAM, 0.95],
  cursos: [NAVY, 0.6],
  metodologia: [CREAM, 0.9],
  diferenciais: [NAVY, 0.6],
  depoimentos: [NAVY, 0.6],
  contato: [CREAM, 0.95],
  rodape: [CREAM, 0.9],
};

// Pontos de passagem: seção, posição horizontal (0 a 1 da largura) e vertical (0 a 1 da altura da seção)
const STOPS = [
  { id: 'sobre', x: 0.9, y: 0.26 },
  { id: 'cursos', x: 0.08, y: 0.2 },
  { id: 'cursos', x: 0.92, y: 0.78 },
  { id: 'metodologia', x: 0.07, y: 0.16 },
  { id: 'metodologia', x: 0.93, y: 0.62 },
  { id: 'diferenciais', x: 0.08, y: 0.2 },
  { id: 'depoimentos', x: 0.9, y: 0.4 },
  { id: 'contato', x: 0.1, y: 0.22 },
  { id: 'contato', x: 0.92, y: 0.86 },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function buildPath(pts) {
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    // Tangentes quase horizontais nos pontos e y sempre crescente: o avião "desliza" de lado a lado
    d += ` C${(a.x + dx * 0.55).toFixed(1)},${(a.y + dy * 0.12).toFixed(1)} ${(b.x - dx * 0.55).toFixed(1)},${(b.y - dy * 0.12).toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  }
  return d;
}

export default function FlightPath() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const trailRef = useRef(null);
  const planeRef = useRef(null);
  const shadowRef = useRef(null);
  const [off, setOff] = useState(false);
  const [geo, setGeo] = useState(null);
  const live = useRef({
    xs: [],
    ys: [],
    step: 6,
    L: 0,
    s: 0,
    target: 0,
    raf: 0,
    angle: 0,
    dir: 1,
    scale: 0.8,
    rootTop: 0,
    first: true,
  });

  // 1) Mede a página e monta a rota
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setOff(true);
      return undefined;
    }
    const wrap = wrapRef.current;
    const root = wrap && wrap.parentElement;
    if (!root) return undefined;

    let raf = 0;
    const measure = () => {
      const W = root.clientWidth;
      const H = root.scrollHeight;
      if (!W || !H) return;
      const rootRect = root.getBoundingClientRect();
      const rootTop = rootRect.top + window.scrollY;
      live.current.rootTop = rootTop;
      const margin = W < 640 ? 34 : 56;

      const rects = {};
      Object.keys(SECTION_INK).forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        rects[id] = { top: r.top + window.scrollY - rootTop, height: r.height };
      });
      if (!rects.inicio) return;

      // O avião decola do globo da seção inicial (Manaus); sem o globo, entra pela esquerda
      const globe = document.querySelector('[data-globe]');
      let start = { x: -W * 0.08, y: Math.max(40, rects.inicio.top + rects.inicio.height * 0.04) };
      if (globe) {
        const g = globe.getBoundingClientRect();
        start = { x: g.left + g.width * 0.5, y: g.top + window.scrollY - rootTop + g.height * 0.52 };
      }
      const pts = [start];
      const small = W < 900;
      let n = 0;
      STOPS.forEach((s) => {
        const r = rects[s.id];
        if (!r) return;
        const y = r.top + r.height * s.y;
        if (y <= pts[pts.length - 1].y + 80) return;
        // Em telas pequenas o avião voa rente à borda direita para não cobrir o texto
        const x = small ? W * (n % 2 ? 0.93 : 0.8) : clamp(W * s.x, margin, W - margin);
        n += 1;
        pts.push({ x, y });
      });
      pts.push({ x: W * 1.1, y: H - 70 });

      // Degradê vertical: a cor da rota acompanha o fundo de cada seção
      const stops = [];
      let prev = 0;
      Object.keys(SECTION_INK).forEach((id) => {
        const r = rects[id];
        if (!r) return;
        const [color, opacity] = SECTION_INK[id];
        const a = Math.max(prev, clamp(r.top / H, 0, 1));
        const b = Math.max(a, clamp((r.top + r.height) / H, 0, 1));
        stops.push({ offset: a, color, opacity }, { offset: b, color, opacity });
        prev = b;
      });

      live.current.scale = W < 640 ? 0.5 : W < 900 ? 0.62 : W < 1100 ? 0.8 : 0.95;
      setGeo({ W, H, d: buildPath(pts), stops, small });
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    schedule();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      ro.disconnect();
    };
  }, []);

  // 2) Com a rota pronta, amostra a curva e liga o avião à rolagem
  useEffect(() => {
    if (!geo) return undefined;
    const st = live.current;
    const path = pathRef.current;
    const trail = trailRef.current;
    const plane = planeRef.current;
    const shadow = shadowRef.current;
    if (!path || !trail || !plane || !shadow) return undefined;

    const L = path.getTotalLength();
    const n = Math.ceil(L / st.step);
    const xs = new Float32Array(n + 1);
    const ys = new Float32Array(n + 1);
    for (let i = 0; i <= n; i++) {
      const p = path.getPointAtLength(Math.min(L, i * st.step));
      xs[i] = p.x;
      ys[i] = p.y;
    }
    st.xs = xs;
    st.ys = ys;
    st.L = L;
    trail.style.strokeDasharray = `0 ${L}`;

    const at = (s) => {
      const f = clamp(s / st.step, 0, n);
      const i = Math.min(n - 1, Math.floor(f));
      const t = f - i;
      return [xs[i] + (xs[i + 1] - xs[i]) * t, ys[i] + (ys[i + 1] - ys[i]) * t, i];
    };

    const sFromY = (y) => {
      let lo = 0;
      let hi = n;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid + 1;
        else hi = mid;
      }
      return lo * st.step;
    };

    const place = () => {
      const [x, y, i] = at(st.s);
      const j = Math.min(n, i + 2);
      const k = Math.max(0, i - 1);
      const tangent = Math.atan2(ys[j] - ys[k], xs[j] - xs[k]);
      const goal = tangent + (st.dir < 0 ? Math.PI : 0);
      let delta = goal - st.angle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      st.angle += delta * 0.18;
      const deg = (st.angle * 180) / Math.PI;
      plane.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)}) scale(${st.scale})`);
      shadow.setAttribute(
        'transform',
        `translate(${(x + 16).toFixed(1)} ${(y + 30).toFixed(1)}) rotate(${deg.toFixed(1)}) scale(${(st.scale * 0.86).toFixed(3)})`
      );
      trail.style.strokeDasharray = `${Math.max(0, st.s).toFixed(1)} ${L}`;
    };

    const frame = () => {
      const diff = st.target - st.s;
      if (Math.abs(diff) > 0.6) {
        st.dir = diff > 0 ? 1 : -1;
        st.s += diff * 0.075;
        place();
        st.raf = requestAnimationFrame(frame);
      } else {
        st.s = st.target;
        place();
        st.raf = 0;
      }
    };
    const kick = () => {
      if (!st.raf) st.raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.55 - st.rootTop;
      st.target = sFromY(y);
      kick();
    };

    if (st.first) {
      st.first = false;
      st.s = 0;
      st.angle = 0.4;
    }
    st.s = clamp(st.s, 0, L);
    onScroll();
    place();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
  }, [geo]);

  if (off) return null;

  const W = geo ? geo.W : 0;
  const H = geo ? geo.H : 0;
  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[35] overflow-hidden">
      {geo ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute left-0 top-0" focusable="false">
          <defs>
            <linearGradient id="rota-fluente" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H}>
              {geo.stops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
              ))}
            </linearGradient>
          </defs>
          {/* rota à frente: pontilhada */}
          <path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke="url(#rota-fluente)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="0.1 12"
            opacity={geo.small ? 0 : 0.55}
          />
          {/* rota percorrida: linha cheia */}
          <path
            ref={trailRef}
            d={geo.d}
            fill="none"
            stroke="url(#rota-fluente)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeOpacity={geo.small ? 0 : 1}
          />
          <g ref={shadowRef} opacity="0.16">
            <g transform="translate(-50 -50)">
              <PlaneGlyph body={NAVY} wing={NAVY} stroke={NAVY} />
            </g>
          </g>
          <g ref={planeRef}>
            <g transform="translate(-50 -50)">
              {/* contorno claro por baixo: o avião continua legível sobre fotos e fundos coloridos */}
              <PlaneGlyph body={CREAM} wing={CREAM} stroke={CREAM} strokeWidth={9} />
              <PlaneGlyph />
            </g>
          </g>
        </svg>
      ) : null}
    </div>
  );
}
