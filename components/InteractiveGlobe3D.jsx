'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, X } from 'lucide-react';
import GlobeFallback from './GlobeFallback';
import { CITIES } from './globe/destinations.mjs';

export default function InteractiveGlobe({ className = '' }) {
  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const apiRef = useRef(null);
  const pinsRef = useRef(new Map());
  const cycleRef = useRef(0);
  const [status, setStatus] = useState('loading');
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const descriptionId = useId();
  const cardId = useId();
  const activeCity = CITIES.find(city => city.id === (hovered || selected));

  useEffect(() => {
    let cancelled = false;
    let started = false;
    let idle = null;
    let api = null;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const load = async () => {
      if (started || cancelled) return;
      started = true;
      try {
        const { createGlobe } = await import('./globe/createGlobe.mjs');
        if (cancelled) return;
        api = await createGlobe({
          host: sceneRef.current,
          pins: pinsRef.current,
          reducedMotion: media.matches,
          onReady: () => { if (!cancelled) setStatus('ready'); },
          onFailure: () => {
            if (!cancelled) {
              setStatus('fallback');
              apiRef.current = null;
              api?.destroy();
            }
          },
          onDragStart: () => { if (!cancelled) { setHovered(null); setSelected(null); } },
        });
        if (cancelled) api.destroy();
        else { apiRef.current = api; api.setReducedMotion(media.matches); }
      } catch {
        if (!cancelled) setStatus('fallback');
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(load, { timeout: 600 });
      else load();
    }, { rootMargin: '250px' });
    observer.observe(rootRef.current);
    const onMotionChange = () => apiRef.current?.setReducedMotion(media.matches);
    media.addEventListener('change', onMotionChange);
    return () => {
      cancelled = true;
      observer.disconnect();
      if (idle !== null && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      media.removeEventListener('change', onMotionChange);
      apiRef.current = null;
      api?.destroy();
    };
  }, []);

  useEffect(() => { apiRef.current?.setHighlight(hovered || selected); }, [hovered, selected]);

  const explore = city => {
    setSelected(city.id);
    setHovered(null);
    apiRef.current?.focusDestination(city.id);
  };
  const onKeyDown = event => {
    if (event.target !== rootRef.current || !apiRef.current) return;
    const keyRotations = { ArrowLeft: [-.13, 0], ArrowRight: [.13, 0], ArrowUp: [0, -.1], ArrowDown: [0, .1] };
    if (keyRotations[event.key]) {
      event.preventDefault();
      setHovered(null);
      setSelected(null);
      apiRef.current.rotate(...keyRotations[event.key]);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      explore(CITIES[1 + cycleRef.current++ % (CITIES.length - 1)]);
    } else if (event.key === 'Escape') {
      setSelected(null);
      setHovered(null);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`interactive-globe relative aspect-square w-full select-none ${className}`}
      data-globe-state={status}
      role="group"
      tabIndex={status === 'ready' ? 0 : -1}
      aria-label="Globo interativo com conexões de Manaus para Londres, Nova York, Toronto e Sydney"
      aria-describedby={descriptionId}
      onKeyDown={onKeyDown}
    >
      <p id={descriptionId} className="sr-only">Arraste para girar o globo. No teclado, use as setas para girar e Enter para explorar os destinos. Os marcadores mostram a cidade, o país e uma expressão em inglês. Escape fecha o cartão.</p>
      <div className="globe-fallback" aria-hidden={status === 'ready' ? true : undefined}>
        <GlobeFallback />
      </div>
      <div ref={sceneRef} className="globe-scene" />
      <div className="globe-pins">
        {CITIES.map(city => (
          <button
            key={city.id}
            ref={node => { if (node) pinsRef.current.set(city.id, node); else pinsRef.current.delete(city.id); }}
            className={`globe-pin globe-pin-${city.id}${activeCity?.id === city.id ? ' is-highlighted' : ''}`}
            type="button"
            aria-label={`Explorar ${city.name}, ${city.country}`}
            aria-describedby={activeCity?.id === city.id ? `${cardId}-${city.id}` : undefined}
            onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(city.id); }}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setHovered(city.id)}
            onBlur={() => setHovered(null)}
            onClick={() => explore(city)}
          >
            <span className="globe-pin-label">{city.name}</span>
          </button>
        ))}
      </div>
      {status === 'ready' && !reduced && (
        <button
          type="button"
          className="globe-motion-control"
          aria-label={paused ? 'Retomar animação do globo' : 'Pausar animação do globo'}
          aria-pressed={paused}
          onClick={() => { setPaused(!paused); apiRef.current?.setPaused(!paused); }}
        >
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
        </button>
      )}
      <AnimatePresence>
        {status === 'ready' && activeCity && (
          <motion.div
            id={`${cardId}-${activeCity.id}`}
            className="globe-city-card"
            role="region"
            aria-label={`Destino: ${activeCity.name}`}
            key={activeCity.id}
            initial={reduced ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: .24 }}
            onPointerEnter={() => setHovered(activeCity.id)}
            onPointerLeave={() => setHovered(null)}
          >
            <span className="globe-city-country">{activeCity.country} <span>{activeCity.code}</span></span>
            <h3>{activeCity.name}</h3>
            <p lang="en">{activeCity.phrase}</p>
            <button type="button" aria-label="Fechar cartão do destino" onClick={() => { setSelected(null); setHovered(null); }}><X size={14} aria-hidden="true" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
