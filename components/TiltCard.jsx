'use client';

import React, { useRef } from 'react';

/*
 * Cartão com inclinação 3D leve e brilho que acompanha o mouse.
 * Só reage a mouse (não interfere em toque) e respeita prefers-reduced-motion.
 */
export default function TiltCard({ children, className = '', max = 6, spotlight = 'rgba(254,240,213,0.22)' }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    });
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`group/tilt relative will-change-transform ${className}`}
      style={{
        transform: 'perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transition: 'transform 220ms ease-out',
      }}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${spotlight}, transparent 62%)`,
        }}
      />
    </div>
  );
}
