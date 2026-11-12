'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ArrowDown, Check, Globe2, MessageCircle, BriefcaseBusiness, Compass, Users, Headphones, Instagram, Mail, MapPin, Plus, Minus, MoveUpRight, MoveHorizontal, Quote, Infinity as InfinityIcon } from 'lucide-react';
import BrandSpark from '../components/BrandSpark';
import Header from '../components/Header';
import InteractiveGlobe from '../components/InteractiveGlobe';
import FlightJourney from '../components/FlightJourney';
import { Benefits, Testimonials } from '../components/CommunitySections';
import { LAND } from '../components/worldLand';

const WA = 'https://wa.me/5592982021077';
const EMAIL = 'fluenteporai@fluenteporai.com';
const contact = (subject) => `${WA}?text=${encodeURIComponent(`Olá! Quero saber mais sobre ${subject}.`)}`;
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
function Plane({ className = '' }) { return <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="m68 10-8 32-9-1-8 17-6-1 5-19-16-10-13 6-5-4 16-13 24 6 12-12c4-4 10-5 8-1Z" fill="currentColor"/><path d="m27 28 23 9M48 23l12 18" stroke="var(--paper)" strokeWidth="1.6" opacity=".6"/></svg>; }

function Hero() {
  return <section id="inicio" className="hero section-anchor">
    <div className="container hero-grid">
      <div className="hero-copy">
        <Reveal><Eyebrow>Inglês para ir além</Eyebrow></Reveal>
        <Reveal delay={.08}><h1>English that<br/><em>takes you</em><br/><span className="hero-last">places.<span className="hero-spark" aria-hidden="true"><BrandSpark /></span></span></h1></Reveal>
        <Reveal delay={.18}><p className="hero-description">O próximo destino da sua vida começa com uma conversa. Aprenda inglês para explorar o mundo, crescer na carreira e se conectar de verdade.</p></Reveal>
        <Reveal delay={.26} className="hero-actions"><Button href="#cursos">Encontre o seu caminho</Button><a className="text-link" href={WA} target="_blank" rel="noopener noreferrer">Vamos conversar <ArrowUpRight size={17}/><span className="sr-only"> (abre em nova aba)</span></a></Reveal>
        <Reveal delay={.32} className="hero-proof"><span className="online-dot"/><span>Aulas online</span><span className="proof-divider"/><span>Aprendizado do seu jeito</span></Reveal>
      </div>
      <Reveal delay={.16} className="hero-visual">
        <div className="globe-orbit orbit-one"/><div className="globe-orbit orbit-two"/>
        <div className="globe-coordinate coord-top">03°07′ S &nbsp; 60°01′ W</div>
        <InteractiveGlobe className="hero-globe" />
        <div className="destination destination-london"><span className="destination-dot"/><span><small>PRÓXIMA CONEXÃO</small>London, hello.</span><span className="destination-flag">UK</span></div>
        <div className="destination destination-world"><Globe2 size={21}/><span>Um idioma.<br/><strong>Novas possibilidades.</strong></span></div>
        <div className="hero-ticket"><div><span className="mono">SEU PASSAPORTE PARA</span><strong>o mundo lá fora.</strong></div><MoveUpRight size={29}/><span className="ticket-punch"/></div>
        <p className="globe-caption"><span aria-hidden="true"><MoveHorizontal size={13} /></span> Arraste e explore suas próximas conexões</p>
      </Reveal>
    </div>
    <div className="container hero-bottom"><span>DE ONDE VOCÊ ESTÁ. PARA ONDE QUISER.</span><a href="#sobre">Sua jornada começa aqui <ArrowDown size={15}/></a><span className="mono">FPA — WORLDWIDE</span></div>
  </section>;
}

function About() { return <section id="sobre" className="about section-anchor"><div className="container about-grid">
  <Reveal className="about-images"><div className="photo-main"><img src="/photos/viajante-mapa.jpg" alt="Viajante com mochila explorando um novo caminho com um mapa" width="534" height="610" loading="lazy"/><span className="photo-caption mono">THE WORLD IS CALLING.</span></div><div className="photo-small"><img src="/photos/viajante-camera.jpg" alt="Viajante fotografando a arquitetura de uma cidade" width="548" height="733" loading="lazy"/><span>collect moments.</span></div><div className="round-stamp" aria-hidden="true"><Globe2 size={33}/><span>FLUENTE POR AÍ<br/>EXPLORE • CONNECT</span></div></Reveal>
  <Reveal className="about-copy"><Eyebrow number="01 / SOBRE NÓS">Muito além do idioma</Eyebrow><h2>Não é só sobre<br/>falar inglês.<br/><em>É sobre viver mais.</em></h2><p>A Fluente por Aí nasceu para conectar o aprendizado aos seus objetivos. Porque um novo idioma abre espaço para novas histórias, encontros e oportunidades.</p><p>Com aulas online, conteúdo contextualizado e acompanhamento individualizado, a gente ajuda você a transformar conhecimento em comunicação real.</p><div className="about-note"><span aria-hidden="true"><Quote size={34} strokeWidth={1.25} /></span><p>O inglês é o caminho.<br/><strong>O destino é você quem escolhe.</strong></p></div></Reveal>
</div></section>; }

const courses = [
  { id:'general', code:'FPA 01', tag:'PARA SE CONECTAR', title:'Inglês Geral', desc:'Mais confiança para se expressar. Conversação, compreensão e vocabulário que fazem parte da sua vida.', features:['Conversação','Do seu nível ao seu objetivo'], icon:MessageCircle, subject:'o curso de Inglês Geral' },
  { id:'business', code:'FPA 02', tag:'PARA CRESCER', title:'Business English', desc:'Sua próxima oportunidade fala inglês. Prepare-se para reuniões, apresentações, negociações e entrevistas.', features:['Carreira','Comunicação profissional'], icon:BriefcaseBusiness, subject:'o curso de Business English' },
  { id:'travel', code:'FPA 03', tag:'PARA EXPLORAR', title:'English for Travel', desc:'Do primeiro embarque à conversa que vira uma história. Inglês para viagens, turismo e intercâmbios.', features:['Viagens','Experiências internacionais'], icon:Compass, subject:'o curso English for Travel' },
  { id:'corporate', code:'FPA 04', tag:'PARA IR MAIS LONGE, JUNTOS', title:'Treinamento Corporativo', desc:'Conecte sua equipe às oportunidades do mundo. Capacitação em inglês para o contexto da sua empresa.', features:['Equipes','Objetivos da empresa'], icon:Users, subject:'o Treinamento Corporativo' },
];

function CourseArt({ type }) {
  if(type==='general') return <div className="course-art conversation-art" aria-hidden="true"><div className="conversation-label mono"><span className="online-dot"/> LET’S TALK</div><div className="chat chat-a"><span className="chat-avatar">Hi</span><span>Hello, new world! <span><BrandSpark size={18} /></span></span></div><div className="chat chat-b">Let’s go places. <span><ArrowUpRight size={20} /></span></div><div className="waveform">{Array.from({length:28},(_,i)=><i key={i} style={{'--bar':`${12+((i*17)%29)}px`,'--delay':`${i*.08}s`}}/>)}<span>your voice, everywhere.</span></div></div>;
  if(type==='business') return <div className="course-art business-art" aria-hidden="true"><div className="meeting-window"><div className="window-top"><span><i/><i/><i/></span><span className="mono">A WORLD OF OPPORTUNITIES</span><ArrowUpRight size={15}/></div><div className="meeting-body"><div className="presentation"><span className="mono">YOUR NEXT CHAPTER</span><div className="chart-bars"><i/><i/><i/><i/><ArrowUpRight size={48}/></div></div><div className="meeting-person"><BriefcaseBusiness size={28}/><span>Let’s make<br/><em>it happen.</em></span></div></div><div className="meeting-bottom"><span className="online-dot"/> You’re ready for the conversation.</div></div></div>;
  if(type==='travel') return <div className="course-art travel-art" aria-hidden="true"><WorldMap className="travel-map"/><div className="mini-boarding"><div className="mono">FLUENTE AIRLINES <Plane/></div><div className="boarding-route"><strong>YOU</strong><span>····<Plane/>····</span><strong>WLD</strong></div><div className="boarding-cities"><span>Onde você está</span><span>Onde quiser chegar</span></div><div className="boarding-dashed"/><div className="boarding-details mono"><span>PASSENGER<br/><b>YOUR FUTURE SELF</b></span><span>GATE<br/><b><InfinityIcon size={14} /></b></span><span className="barcode"/></div></div></div>;
  return <div className="course-art corporate-art" aria-hidden="true"><div className="connection-ring ring-a"/><div className="connection-ring ring-b"/><div className="team-node node-center"><img src="/brand/emblema-creme.png" alt="" width="196" height="260"/></div>{['Hello!','Let’s connect.','Together, further.'].map((t,i)=><div key={t} className={`team-node node-${i}`}><span className="team-avatar">{i===1 ? <BrandSpark size={17} /> : <ArrowUpRight size={17} />}</span><span>{t}</span></div>)}</div>;
}

function Courses() { return <section id="cursos" className="courses section-anchor"><div className="container"><Reveal className="section-heading"><div><Eyebrow number="02 / CURSOS E SERVIÇOS">Escolha seu próximo destino</Eyebrow><h2>Um novo mundo.<br/><em>O seu caminho.</em></h2></div><p>Para cada objetivo, uma rota.<br/>Encontre o programa que faz sentido<br className="desktop-break"/> para o seu momento.</p></Reveal><div className="course-grid">{courses.map((c,i)=><Reveal key={c.id} delay={i%2*.08} className={`course-card course-${c.id}`}><div className="course-top"><span className="mono">{c.code} <span>/</span> {c.tag}</span><c.icon size={20} strokeWidth={1.5}/></div><CourseArt type={c.id}/><div className="course-info"><h3>{c.title}</h3><p>{c.desc}</p><div className="course-tags">{c.features.map(f=><span key={f}>{f}</span>)}</div></div><a className="course-link" href={contact(c.subject)} target="_blank" rel="noopener noreferrer"><span>Essa é a minha rota<span className="sr-only">: {c.title} (abre WhatsApp em nova aba)</span></span><span><ArrowUpRight size={22}/></span></a></Reveal>)}</div><Reveal className="course-help"><span>Ainda não sabe por onde começar?</span><a href={contact('qual programa combina com meu objetivo')} target="_blank" rel="noopener noreferrer">A gente encontra a sua rota. <ArrowRight size={17}/></a></Reveal></div></section>; }

const pillars = [
  { title:'Falar desde o primeiro encontro', label:'Abordagem comunicativa', desc:'O idioma acontece na prática. Você usa o inglês desde as primeiras aulas, desenvolvendo confiança em cada conversa.', phrase:'Nice to meet you!', reply:'The pleasure is mine.', icon:MessageCircle, stage:'01', note:'Conexões começam com um hello.' },
  { title:'Aprender para a vida real', label:'Aprendizagem contextualizada', desc:'Situações do cotidiano e do ambiente profissional dão sentido ao aprendizado. O que você aprende encontra espaço na sua vida.', phrase:'Can I have a coffee, please?', reply:'Of course. Anything else?', icon:Compass, stage:'02', note:'Pequenas conversas. Grandes experiências.' },
  { title:'Ter uma rota só sua', label:'Acompanhamento individualizado', desc:'Seu nível, seus objetivos e seu ritmo orientam o caminho. O conteúdo acompanha o seu desenvolvimento, com atenção a cada etapa.', phrase:'What is your goal?', reply:'To go a little further.', icon:MapPin, stage:'03', note:'Seu ponto de partida importa.' },
  { title:'Contar com quem sabe guiar', label:'Professores qualificados', desc:'Profissionais preparados e com experiência para orientar seu aprendizado, esclarecer dúvidas e ajudar você a avançar.', phrase:'Let’s try it together.', reply:'I’m ready. Let’s do it!', icon:Headphones, stage:'04', note:'O próximo passo fica mais leve, juntos.' },
];

function Method() {
  const [active,setActive]=useState(0); const p=pillars[active]; const reduce=useReducedMotion();
  return <section id="metodologia" className="method section-anchor"><div className="container"><Reveal className="section-heading"><div><Eyebrow number="03 / METODOLOGIA">Aprender é uma jornada</Eyebrow><h2>Inglês que sai do papel.<br/><em>E entra na sua vida.</em></h2></div><p>Quatro pilares. Uma ideia em comum:<br/>você no centro do aprendizado.</p></Reveal><div className="method-grid"><Reveal className="method-scene"><div className="scene-top mono"><span><span className="online-dot"/> THE CONVERSATION IS OPEN</span><span>FPA / {p.stage}</span></div><WorldMap className="scene-map"/><div className="scene-orbit"/><div className="scene-globe"><Globe2 size={100} strokeWidth={.6}/></div><AnimatePresence mode="wait"><motion.div key={active} id="method-demo" role="region" aria-label={`Exemplo: ${p.label}`} className="scene-conversation" initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}><div className="scene-bubble bubble-first"><span className="bubble-person"><p.icon size={19}/></span><p lang="en">{p.phrase}</p><Check size={14}/></div><div className="scene-bubble bubble-second"><p lang="en">{p.reply}</p><span>you.</span></div><div className="scene-note">{p.note}</div></motion.div></AnimatePresence><div className="scene-bottom"><span className="mono">REAL ENGLISH. REAL CONNECTIONS.</span><span className="sound-bars"><i/><i/><i/><i/><i/></span></div></Reveal><div className="method-steps">{pillars.map((item,i)=><div className={`method-step ${active===i?'is-active':''}`} key={item.stage}><h3><button id={`method-button-${i}`} aria-expanded={active===i} aria-controls={`method-panel-${i}`} onClick={()=>setActive(i)}><span className="step-number mono">{item.stage}</span><span>{item.title}</span><span className="step-toggle">{active===i?<Minus size={18}/>:<Plus size={18}/>}</span></button></h3><div id={`method-panel-${i}`} role="region" aria-labelledby={`method-button-${i}`} hidden={active!==i}><div className="step-description"><span className="mono">{item.label}</span><p>{item.desc}</p><span className="step-line"/></div></div></div>)}</div></div></div></section>;
}


function Contact() { return <section id="contato" className="contact section-anchor"><div className="contact-bg" aria-hidden="true"><WorldMap/></div><div className="container contact-grid"><Reveal className="contact-copy"><Eyebrow number="05 / VAMOS CONVERSAR">Seu próximo capítulo</Eyebrow><h2>Ready for<br/><em>your next</em><br/>destination<span>?</span></h2><p>A sua próxima grande história pode começar com um simples <em>hello.</em> Vamos encontrar o melhor caminho para você?</p><Button href={contact('as aulas da Fluente por Aí')} light>Vamos começar essa jornada</Button><div className="contact-origin"><MapPin size={16}/> De Manaus para onde você quiser.</div></Reveal><Reveal className="contact-ticket" delay={.12}><div className="contact-ticket-header"><img src="/brand/logo-creme.png" alt="Fluente por Aí" width="506" height="541"/><span className="mono">BOARDING PASS<br/><b>UM MUNDO DE POSSIBILIDADES</b></span></div><div className="contact-ticket-route"><div><span className="mono">ORIGEM</span><strong>VOCÊ</strong><small>Seu momento de agora</small></div><Plane/><div><span className="mono">DESTINO</span><strong>MUNDO</strong><small>Sua próxima versão</small></div></div><div className="ticket-divider"><span/><span/></div><div className="contact-ticket-links"><a href={WA} target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/><span><small>FALE COM A GENTE</small><strong>+55 92 98202-1077</strong></span><ArrowUpRight size={20}/><span className="sr-only"> (abre WhatsApp em nova aba)</span></a><a href={`mailto:${EMAIL}`}><Mail size={21}/><span><small>E-MAIL</small><strong>{EMAIL}</strong></span><ArrowUpRight size={20}/></a><a href="https://instagram.com/fluenteporai" target="_blank" rel="noopener noreferrer"><Instagram size={21}/><span><small>ACOMPANHE A JORNADA</small><strong>@fluenteporai</strong></span><ArrowUpRight size={20}/><span className="sr-only"> (abre Instagram em nova aba)</span></a></div><div className="contact-ticket-bottom"><div><span className="mono">EMBARQUE</span><strong>O próximo passo é seu.</strong></div><span className="barcode" aria-hidden="true"/></div></Reveal></div></section>; }

function Footer() { return <footer className="footer"><div className="container"><div className="footer-top"><a href="#inicio" aria-label="Fluente por Aí, voltar ao início"><img src="/brand/logo-creme.png" alt="Fluente por Aí" width="506" height="541"/></a><p>English that<br/><em>takes you places.</em></p><nav aria-label="Rodapé"><a href="#sobre">Sobre nós</a><a href="#cursos">Cursos</a><a href="#metodologia">Metodologia</a><a href="#diferenciais">Diferenciais</a><a href="#depoimentos">Depoimentos</a><a href="#contato">Contato</a></nav><a className="back-top" href="#inicio" aria-label="Voltar ao início"><ArrowUpRight size={23}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Fluente por Aí. Todos os direitos reservados.</span><span>Esse site foi desenvolvido pela <a href="https://www.instagram.com/crystallcode/" target="_blank" rel="noopener noreferrer">Crystal Code</a>.</span><span>FEITO PARA CONECTAR VOCÊ AO MUNDO <span aria-hidden="true"><BrandSpark size={19} /></span></span></div></div></footer>; }

export default function Home() { return <><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><Header whatsappLink={WA}/><main id="conteudo" className="journey-main"><FlightJourney/><Hero/><About/><Courses/><Method/><Benefits/><Testimonials/><Contact/></main><Footer/></>; }
