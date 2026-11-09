import React, { useId } from 'react';

/*
 * Elementos gráficos da identidade (balão, lápis, lupa, balão de fala, explosão).
 * Todos são decorativos: aria-hidden e sem foco.
 */

const C = {
  navy: '#01304A',
  sky: '#669BBB',
  cream: '#FEF0D5',
  red: '#C1121F',
  wine: '#780001',
};

const base = { 'aria-hidden': true, focusable: 'false' };

export function Starburst({ className = '', fill = C.red, points = 16, inner = 0.56 }) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 50 : 50 * inner;
    const a = (i * Math.PI) / points - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg {...base} viewBox="0 0 100 100" className={className}>
      <polygon points={pts.join(' ')} fill={fill} />
    </svg>
  );
}

export function BurstLines({ className = '', stroke = C.navy, rays = 22 }) {
  const lines = [];
  for (let i = 0; i < rays; i++) {
    const a = (i * 2 * Math.PI) / rays;
    const long = i % 2 === 0;
    const r1 = 24;
    const r2 = long ? 48 : 40;
    lines.push(
      <line
        key={i}
        x1={50 + r1 * Math.cos(a)}
        y1={50 + r1 * Math.sin(a)}
        x2={50 + r2 * Math.cos(a)}
        y2={50 + r2 * Math.sin(a)}
      />
    );
  }
  return (
    <svg {...base} viewBox="0 0 100 100" className={className} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round">
      {lines}
    </svg>
  );
}

export function ChatBubble({ className = '', body = C.navy, dots = C.cream }) {
  return (
    <svg {...base} viewBox="0 0 120 92" className={className}>
      <path
        d="M16 4h88a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12H90l8 20-30-20H16A12 12 0 0 1 4 56V16A12 12 0 0 1 16 4Z"
        fill={body}
      />
      {[30, 50, 70, 90].map((x) => (
        <circle key={x} cx={x} cy="36" r="6" fill={dots} />
      ))}
    </svg>
  );
}

export function Balloon({ className = '', outer = C.navy, mid = C.cream, core = C.red }) {
  const id = useId();
  const clip = `balloon-${id.replace(/:/g, '')}`;
  return (
    <svg {...base} viewBox="0 0 100 150" className={className}>
      <defs>
        <clipPath id={clip}>
          <path d="M50 4C18 4 3 30 8 54c3 15 18 30 33 38h18c15-8 30-23 33-38C97 30 82 4 50 4Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="100" height="100" fill={outer} />
        <ellipse cx="50" cy="48" rx="31" ry="50" fill={mid} />
        <ellipse cx="50" cy="48" rx="15" ry="50" fill={core} />
      </g>
      <path d="M41 92 44 112M59 92 56 112" stroke={outer} strokeWidth="2" strokeLinecap="round" />
      <rect x="40" y="110" width="20" height="16" rx="3" fill={outer} />
      <path d="M44 118h12" stroke={mid} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Pencil({ className = '', body = C.red, stripe = C.navy, tip = C.cream }) {
  return (
    <svg {...base} viewBox="0 0 44 170" className={className}>
      <rect x="8" y="14" width="28" height="108" rx="3" fill={body} />
      <rect x="18" y="14" width="8" height="108" fill={stripe} />
      <rect x="8" y="2" width="28" height="16" rx="5" fill={stripe} />
      <path d="M8 122h28L22 162 8 122Z" fill={tip} />
      <path d="M17 146h10L22 162Z" fill={stripe} />
    </svg>
  );
}

export function Magnifier({ className = '', ring = C.navy, handle = C.red, glass = C.cream, stripeA = C.sky, stripeB = C.red }) {
  const id = useId();
  const clip = `lens-${id.replace(/:/g, '')}`;
  return (
    <svg {...base} viewBox="0 0 120 120" className={className}>
      <defs>
        <clipPath id={clip}>
          <circle cx="48" cy="48" r="33" />
        </clipPath>
      </defs>
      <path d="M74 74 108 108" stroke={handle} strokeWidth="13" strokeLinecap="round" />
      <circle cx="48" cy="48" r="33" fill={glass} />
      <g clipPath={`url(#${clip})`}>
        <rect x="30" y="10" width="8" height="80" fill={stripeA} />
        <rect x="41" y="10" width="14" height="80" fill={ring} />
        <rect x="58" y="10" width="6" height="80" fill={stripeB} />
      </g>
      <circle cx="48" cy="48" r="34" fill="none" stroke={ring} strokeWidth="9" />
    </svg>
  );
}

/* Selo circular de texto, inspirado no selo do logotipo */
export function Seal({ className = '', text = 'fluente por aí • English that takes you places • ', ink = C.navy, center }) {
  const id = useId();
  const path = `seal-${id.replace(/:/g, '')}`;
  return (
    <svg {...base} viewBox="0 0 200 200" className={className}>
      <defs>
        <path id={path} d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0" />
      </defs>
      <text fill={ink} fontSize="15" fontWeight="700" fontFamily="Urbanist, system-ui, sans-serif">
        <textPath href={`#${path}`} startOffset="0" textLength="474" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      {center}
    </svg>
  );
}

/* Borda perfurada de selo postal: colore o topo de uma seção com a cor da seção anterior */
export function Edge({ color }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[14px]"
      style={{
        backgroundImage: `radial-gradient(circle at 14px 0, ${color} 0 10px, transparent 10.5px)`,
        backgroundSize: '28px 14px',
        backgroundRepeat: 'repeat-x',
      }}
    />
  );
}
