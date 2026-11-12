'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Check, Globe2, MessageCircle, Compass, Headphones, MapPin, Plus, Minus, Quote } from 'lucide-react';
import BrandSpark from '../components/BrandSpark';
import Header from '../components/Header';
import SiteFooter from '../components/SiteFooter';
import ConnectionMap from '../components/ConnectionMap';
import FlightJourney from '../components/FlightJourney';
import FAQ from '../components/FAQ';
import { Testimonials } from '../components/CommunitySections';
import { LAND } from '../components/worldLand';

const WA = 'https://wa.me/5592982021077';
const EMAIL = 'fluenteporai@fluenteporai.com';
const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return <Tag className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: .75, ease, delay }}>{children}</Tag>;
}

function Button({ children, href, light = false, outline = false, className = '' }) {
  const external = !href.startsWith('#');
  return <a className={`button ${light ? 'button-light' : ''} ${outline ? 'button-outline' : ''} ${className}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><span>{children}</span><span className="button-arrow"><ArrowUpRight size={19} aria-hidden="true" /></span>{external && <span className="sr-only"> (abre em nova aba)</span>}</a>;
}

function Eyebrow({ children, number }) { return <p className="eyebrow"><span className="tiny-cross" aria-hidden="true"><BrandSpark /></span>{children}{number && <span className="eyebrow-number">{number}</span>}</p>; }
function WorldMap({ className = '' }) { return <svg className={className} viewBox="-180 -90 360 180" aria-hidden="true"><g transform="scale(1,-1)">{LAND.map((p,i)=><polygon key={i} points={p.map(v=>v.join(',')).join(' ')} fill="currentColor" />)}</g></svg>; }

function Hero() {
  return <section id="inicio" className="hero section-anchor">
    <div className="container hero-grid">
      <div className="hero-copy">
        <Reveal><Eyebrow>Inglês para ir além</Eyebrow></Reveal>
        <Reveal delay={.08}><h1>English that<br/><em>takes you</em><br/><span className="hero-last">places.<span className="hero-spark" aria-hidden="true"><BrandSpark /></span></span></h1></Reveal>
        <Reveal delay={.18}><p className="hero-description">O próximo destino da sua vida começa com uma conversa. Aprenda inglês para explorar o mundo, crescer na carreira e se conectar de verdade.</p></Reveal>
        <Reveal delay={.26} className="hero-actions"><Button href={WA}>Fale conosco pelo WhatsApp</Button><a className="text-link" href="#metodologia">Como funciona <ArrowDown size={17}/></a></Reveal>
        <Reveal delay={.32} className="hero-proof"><span className="online-dot"/><span>Aulas online</span><span className="proof-divider"/><span>Aprendizado do seu jeito</span></Reveal>
      </div>
      <Reveal delay={.16} className="hero-visual">
        <ConnectionMap />
      </Reveal>
    </div>
    <div className="container hero-bottom"><span>DE ONDE VOCÊ ESTÁ. PARA ONDE QUISER.</span><a href="#sobre">Sua jornada começa aqui <ArrowDown size={15}/></a><span className="mono">FPA — WORLDWIDE</span></div>
  </section>;
}

function About() { return <section id="sobre" className="about section-anchor"><div className="container about-grid">
  <Reveal className="about-images"><div className="photo-main"><img src="/brand/references/viagem-vermelho.jpg" alt="Identidade Fluente por Aí sobre a fotografia de uma viajante com mochila e mapa" width="1024" height="1280" loading="lazy"/><span className="photo-caption mono">THE WORLD IS CALLING.</span></div><div className="photo-small"><img src="/brand/references/identidade.jpg" alt="Elementos da identidade visual Fluente por Aí em vermelho, azul e creme" width="1024" height="1280" loading="lazy"/><span>collect moments.</span></div><div className="round-stamp" aria-hidden="true"><Globe2 size={33}/><span>FLUENTE POR AÍ<br/>EXPLORE • CONNECT</span></div></Reveal>
  <Reveal className="about-copy"><Eyebrow>Muito além do idioma</Eyebrow><h2>Não é só sobre<br/>falar inglês.<br/><em>É sobre viver mais.</em></h2><p>A Fluente por Aí nasceu para conectar o aprendizado aos seus objetivos. Porque um novo idioma abre espaço para novas histórias, encontros e oportunidades.</p><p>Com aulas online, conteúdo contextualizado e acompanhamento individualizado, a gente ajuda você a transformar conhecimento em comunicação real.</p><div className="about-note"><span aria-hidden="true"><Quote size={34} strokeWidth={1.25} /></span><p>O inglês é o caminho.<br/><strong>O destino é você quem escolhe.</strong></p></div></Reveal>
</div></section>; }

const pillars = [
  { title:'Falar desde o primeiro encontro', label:'Abordagem comunicativa', desc:'O idioma acontece na prática. Você usa o inglês desde as primeiras aulas, desenvolvendo confiança em cada conversa.', phrase:'Nice to meet you!', reply:'The pleasure is mine.', icon:MessageCircle, stage:'01', note:'Conexões começam com um hello.' },
  { title:'Aprender para a vida real', label:'Aprendizagem contextualizada', desc:'Situações do cotidiano e do ambiente profissional dão sentido ao aprendizado. O que você aprende encontra espaço na sua vida.', phrase:'Can I have a coffee, please?', reply:'Of course. Anything else?', icon:Compass, stage:'02', note:'Pequenas conversas. Grandes experiências.' },
  { title:'Ter uma rota só sua', label:'Acompanhamento individualizado', desc:'Seu nível, seus objetivos e seu ritmo orientam o caminho. O conteúdo acompanha o seu desenvolvimento, com atenção a cada etapa.', phrase:'What is your goal?', reply:'To go a little further.', icon:MapPin, stage:'03', note:'Seu ponto de partida importa.' },
  { title:'Contar com quem sabe guiar', label:'Professores qualificados', desc:'Profissionais preparados e com experiência para orientar seu aprendizado, esclarecer dúvidas e ajudar você a avançar.', phrase:'Let’s try it together.', reply:'I’m ready. Let’s do it!', icon:Headphones, stage:'04', note:'O próximo passo fica mais leve, juntos.' },
];

function Method() {
  const [active,setActive]=useState(0); const p=pillars[active]; const reduce=useReducedMotion();
  return <section id="metodologia" className="method section-anchor"><div className="container"><Reveal className="section-heading"><div><Eyebrow>Aprender é uma jornada</Eyebrow><h2>Inglês que sai do papel.<br/><em>E entra na sua vida.</em></h2></div><p>Quatro pilares. Uma ideia em comum:<br/>você no centro do aprendizado.</p></Reveal><div className="method-grid"><Reveal className="method-scene"><div className="scene-top mono"><span><span className="online-dot"/> THE CONVERSATION IS OPEN</span><span>FPA / {p.stage}</span></div><WorldMap className="scene-map"/><div className="scene-orbit"/><div className="scene-globe"><Globe2 size={100} strokeWidth={.6}/></div><AnimatePresence mode="wait"><motion.div key={active} id="method-demo" role="region" aria-label={`Exemplo: ${p.label}`} className="scene-conversation" initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}><div className="scene-bubble bubble-first"><span className="bubble-person"><p.icon size={19}/></span><p lang="en">{p.phrase}</p><Check size={14}/></div><div className="scene-bubble bubble-second"><p lang="en">{p.reply}</p><span>you.</span></div><div className="scene-note">{p.note}</div></motion.div></AnimatePresence><div className="scene-bottom"><span className="mono">REAL ENGLISH. REAL CONNECTIONS.</span><span className="sound-bars"><i/><i/><i/><i/><i/></span></div></Reveal><div className="method-steps">{pillars.map((item,i)=><div className={`method-step ${active===i?'is-active':''}`} key={item.stage}><h3><button id={`method-button-${i}`} aria-expanded={active===i} aria-controls={`method-panel-${i}`} onClick={()=>setActive(i)}><span className="step-number mono">{item.stage}</span><span>{item.title}</span><span className="step-toggle">{active===i?<Minus size={18}/>:<Plus size={18}/>}</span></button></h3><div id={`method-panel-${i}`} role="region" aria-labelledby={`method-button-${i}`} hidden={active!==i}><div className="step-description"><span className="mono">{item.label}</span><p>{item.desc}</p><span className="step-line"/></div></div></div>)}</div></div></div></section>;
}


<<<<<<< HEAD
function Contact() { return <section id="contato" className="contact section-anchor"><div className="contact-bg" aria-hidden="true"><WorldMap/></div><div className="container contact-grid"><Reveal className="contact-copy"><Eyebrow number="05 / VAMOS CONVERSAR">Seu próximo capítulo</Eyebrow><h2>Ready for<br/><em>your next</em><br/>destination<span>?</span></h2><p>A sua próxima grande história pode começar com um simples <em>hello.</em> Vamos encontrar o melhor caminho para você?</p><Button href={contact('as aulas da Fluente por Aí')} light>Vamos começar essa jornada</Button><div className="contact-origin"><MapPin size={16}/> De Manaus para onde você quiser.</div></Reveal><Reveal className="contact-ticket" delay={.12}><div className="contact-ticket-header"><img src="/brand/logo-creme.png" alt="Fluente por Aí" width="506" height="541"/><span className="mono">BOARDING PASS<br/><b>UM MUNDO DE POSSIBILIDADES</b></span></div><div className="contact-ticket-route"><div><span className="mono">ORIGEM</span><strong>VOCÊ</strong><small>Seu momento de agora</small></div><Plane/><div><span className="mono">DESTINO</span><strong>MUNDO</strong><small>Sua próxima versão</small></div></div><div className="ticket-divider"><span/><span/></div><div className="contact-ticket-links"><a href={WA} target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/><span><small>FALE COM A GENTE</small><strong>+55 92 98202-1077</strong></span><ArrowUpRight size={20}/><span className="sr-only"> (abre WhatsApp em nova aba)</span></a><a href={`mailto:${EMAIL}`}><Mail size={21}/><span><small>E-MAIL</small><strong>{EMAIL}</strong></span><ArrowUpRight size={20}/></a><a href="https://instagram.com/fluenteporai" target="_blank" rel="noopener noreferrer"><Instagram size={21}/><span><small>ACOMPANHE A JORNADA</small><strong>@fluenteporai</strong></span><ArrowUpRight size={20}/><span className="sr-only"> (abre Instagram em nova aba)</span></a></div><div className="contact-ticket-bottom"><div><span className="mono">EMBARQUE</span><strong>O próximo passo é seu.</strong></div><span className="barcode" aria-hidden="true"/></div></Reveal></div></section>; }

function Footer() { return <footer className="footer"><div className="container"><div className="footer-top"><a href="#inicio" aria-label="Fluente por Aí, voltar ao início"><img src="/brand/logo-creme.png" alt="Fluente por Aí" width="506" height="541"/></a><p>English that<br/><em>takes you places.</em></p><nav aria-label="Rodapé"><a href="#sobre">Sobre nós</a><a href="#cursos">Cursos</a><a href="#metodologia">Metodologia</a><a href="#diferenciais">Diferenciais</a><a href="#depoimentos">Depoimentos</a><a href="#contato">Contato</a></nav><a className="back-top" href="#inicio" aria-label="Voltar ao início"><ArrowUpRight size={23}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Fluente por Aí. Todos os direitos reservados.</span><span>Esse site foi desenvolvido pela <a href="https://www.instagram.com/crystallcode/" target="_blank" rel="noopener noreferrer">Crystal Code</a>.</span><span>FEITO PARA CONECTAR VOCÊ AO MUNDO <span aria-hidden="true"><BrandSpark size={19} /></span></span></div></div></footer>; }

export default function Home() { return <><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><Header whatsappLink={WA}/><main id="conteudo" className="journey-main"><FlightJourney/><Hero/><About/><Courses/><Method/><Benefits/><Testimonials/><Contact/></main><Footer/></>; }
=======
export default function Home() { return <><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><Header whatsappLink={WA}/><main id="conteudo" className="journey-main"><FlightJourney/><Hero/><About/><Method/><Testimonials/><FAQ/></main><SiteFooter/></>; }
>>>>>>> a03ba9c (Downgrade site)
