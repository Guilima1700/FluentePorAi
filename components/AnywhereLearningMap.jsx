"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BriefcaseBusiness, Home, MapPin, Plane, Wifi } from "lucide-react";

const places = [
  {
    id: "casa",
    eyebrow: "Em casa",
    label: "Conforto para aprender",
    detail: "Sua aula ao vivo, no seu espaço.",
    Icon: Home,
    point: [258, 245],
    card: "left-[3%] top-[18%]",
  },
  {
    id: "trabalho",
    eyebrow: "No trabalho",
    label: "Inglês conectado à carreira",
    detail: "Comunicação para a vida profissional.",
    Icon: BriefcaseBusiness,
    point: [438, 485],
    card: "left-[8%] bottom-[9%]",
  },
  {
    id: "viagem",
    eyebrow: "Em viagem",
    label: "Prática para situações reais",
    detail: "Mais confiança para explorar o mundo.",
    Icon: Plane,
    point: [910, 210],
    card: "right-[4%] top-[14%]",
  },
  {
    id: "qualquer-lugar",
    eyebrow: "Onde você estiver",
    label: "Aulas 100% online",
    detail: "O aprendizado acompanha a sua rotina.",
    Icon: Wifi,
    point: [930, 490],
    card: "right-[2%] bottom-[8%]",
  },
];

function useSafeReducedMotion() {
  const systemPreference = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && systemPreference;
}

const paths = [
  "M600 350 Q430 135 258 245",
  "M600 350 Q500 550 438 485",
  "M600 350 Q770 95 910 210",
  "M600 350 Q770 555 930 490",
];

export default function AnywhereLearningMap() {
  const [activeId, setActiveId] = useState("casa");
  const reduceMotion = useSafeReducedMotion();
  const activeIndex = places.findIndex((place) => place.id === activeId);
  const activePlace = places[activeIndex];

  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] border border-brand-navy/10 bg-[#F7FBFD] shadow-soft"
      aria-label="Mapa interativo: aprenda inglês de qualquer lugar"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-45" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.035]" />

      <div className="relative min-h-[600px] sm:min-h-[680px] lg:min-h-[720px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 700"
          fill="none"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="map-fill" x1="165" y1="120" x2="1040" y2="590" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DDF0F7" />
              <stop offset="1" stopColor="#B9DCEB" />
            </linearGradient>
            <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#07354A" floodOpacity="0.1" />
            </filter>
            <filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          <g filter="url(#map-shadow)" opacity="0.92">
            <path d="M136 186L184 133L258 111L327 137L357 183L332 220L287 227L270 269L223 292L179 266L150 226Z" fill="url(#map-fill)" stroke="#6FA6C5" strokeWidth="2" />
            <path d="M285 294L332 308L361 356L350 405L324 443L312 511L279 550L252 504L258 449L235 402L246 349Z" fill="url(#map-fill)" stroke="#6FA6C5" strokeWidth="2" />
            <path d="M510 163L556 136L620 142L650 177L631 211L582 206L553 231L511 216L489 190Z" fill="url(#map-fill)" stroke="#6FA6C5" strokeWidth="2" />
            <path d="M530 244L605 226L663 255L681 316L650 365L633 440L588 512L546 474L530 408L489 353L492 291Z" fill="url(#map-fill)" stroke="#6FA6C5" strokeWidth="2" />
            <path d="M659 171L731 128L836 135L907 172L984 183L1035 229L1003 267L931 266L890 295L826 269L776 284L734 244L681 227Z" fill="url(#map-fill)" stroke="#6FA6C5" strokeWidth="2" />
            <path d="M913 412L976 392L1038 426L1056 480L1014 519L944 512L903 468Z" fill="url(#map-fill)" stroke="#6FA6C5" strokeWidth="2" />
            <path d="M1057 298L1078 286L1094 305L1081 328L1059 321Z" fill="url(#map-fill)" stroke="#6FA6C5" strokeWidth="2" />
          </g>

          <ellipse cx="600" cy="350" rx="246" ry="112" stroke="#6FA6C5" strokeOpacity="0.22" strokeWidth="2" strokeDasharray="8 10" transform="rotate(-8 600 350)" />
          <ellipse cx="600" cy="350" rx="183" ry="82" stroke="#C8102E" strokeOpacity="0.16" strokeWidth="2" transform="rotate(14 600 350)" />

          {paths.map((path, index) => (
            <g key={path}>
              <path d={path} stroke="#6FA6C5" strokeOpacity="0.25" strokeWidth="3" />
              <motion.path
                d={path}
                stroke={activeIndex === index ? "#C8102E" : "#6FA6C5"}
                strokeOpacity={activeIndex === index ? 1 : 0.35}
                strokeWidth={activeIndex === index ? 4 : 2}
                strokeLinecap="round"
                strokeDasharray="4 13"
                initial={reduceMotion ? false : { strokeDashoffset: 34 }}
                animate={reduceMotion ? undefined : { strokeDashoffset: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              />
            </g>
          ))}

          {places.map((place, index) => {
            const active = index === activeIndex;
            return (
              <g key={place.id}>
                {active && (
                  <motion.circle
                    cx={place.point[0]}
                    cy={place.point[1]}
                    r="24"
                    fill="#C8102E"
                    opacity="0.2"
                    filter="url(#node-glow)"
                    initial={reduceMotion ? false : { scale: 0.8, opacity: 0.12 }}
                    animate={reduceMotion ? undefined : { scale: [0.8, 1.35, 0.8], opacity: [0.12, 0.28, 0.12] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    style={{ transformOrigin: `${place.point[0]}px ${place.point[1]}px` }}
                  />
                )}
                <circle cx={place.point[0]} cy={place.point[1]} r={active ? 10 : 7} fill={active ? "#C8102E" : "#07354A"} stroke="#FFF9EF" strokeWidth="5" />
              </g>
            );
          })}

          <circle cx="600" cy="350" r="70" fill="#FFF9EF" stroke="#07354A" strokeWidth="2" />
          <circle cx="600" cy="350" r="54" fill="#07354A" />
          <path d="M583 350H617M600 333V367" stroke="#FFF0D6" strokeWidth="4" strokeLinecap="round" />
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-52 -translate-x-1/2 -translate-y-1/2 text-center">
          <MapPin className="mx-auto h-5 w-5 text-brand-red" />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[.18em] text-brand-navy/55">Fluente por Aí</p>
          <motion.p
            key={activePlace.id}
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 font-serif text-xl italic text-brand-navy"
          >
            {activePlace.eyebrow}
          </motion.p>
        </div>

        <div className="hidden lg:block">
          {places.map((place, index) => {
            const active = index === activeIndex;
            const Icon = place.Icon;
            return (
              <motion.button
                key={place.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveId(place.id)}
                onFocus={() => setActiveId(place.id)}
                onMouseEnter={() => setActiveId(place.id)}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className={`absolute z-20 w-[245px] rounded-2xl border p-4 text-left shadow-soft backdrop-blur-md transition-colors ${place.card} ${
                  active
                    ? "border-brand-red bg-brand-paper text-brand-navy"
                    : "border-white/80 bg-white/75 text-brand-navy hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-brand-red text-white" : "bg-brand-blue/25 text-brand-navy"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-brand-red">{place.eyebrow}</span>
                    <span className="mt-1 block text-sm font-bold leading-5">{place.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-brand-navy/60">{place.detail}</span>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="absolute inset-x-4 bottom-4 z-20 grid grid-cols-2 gap-2 lg:hidden">
          {places.map((place, index) => {
            const active = index === activeIndex;
            const Icon = place.Icon;
            return (
              <button
                key={place.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveId(place.id)}
                className={`flex min-h-14 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold shadow-sm ${
                  active ? "border-brand-red bg-brand-red text-white" : "border-brand-navy/10 bg-white/90 text-brand-navy"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {place.eyebrow}
              </button>
            );
          })}
        </div>

        <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-brand-navy/10 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-brand-navy/65 backdrop-blur-md">
          Selecione um ponto no mapa
        </div>
      </div>
    </div>
  );
}
