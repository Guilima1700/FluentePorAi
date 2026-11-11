'use client';

import { motion, useReducedMotion } from 'framer-motion';
import BrandSpark from './BrandSpark';
import StudentStory from './StudentStory';
import { testimonials } from './testimonials.mjs';
import {
  ArrowUpRight, Check, Clock3, Compass, Globe2, Laptop,
  MessageCircle, Quote, Sparkles,
} from 'lucide-react';

function Enter({ children, className, delay = 0, as = 'div' }) {
  const reduced = useReducedMotion();
  const Element = motion[as];
  return (
    <Element
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Element>
  );
}

function SectionHeading({ number, label, children, description }) {
  return (
    <Enter className="section-heading">
      <div>
        <p className="eyebrow">
          <span className="tiny-cross" aria-hidden="true"><BrandSpark /></span>
          {label}<span className="eyebrow-number">{number}</span>
        </p>
        <h2>{children}</h2>
      </div>
      <p>{description}</p>
    </Enter>
  );
}

function CardHeader({ icon: Icon, label, number }) {
  return (
    <div className="advantage-card-header">
      <span className="advantage-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
      <span className="advantage-label">{label}</span>
      <span className="advantage-number" aria-hidden="true">{number}</span>
    </div>
  );
}

export function Benefits() {
  return (
    <section id="diferenciais" className="benefits section-anchor">
      <div className="container">
        <SectionHeading
          number="04 / POR QUE A FLUENTE POR AÍ?"
          label="Seu mundo pode ser maior"
          description={<>Aprender funciona melhor quando<br />combina com a sua vida.</>}
        >
          Mais perto de onde<br /><em>você quer chegar.</em>
        </SectionHeading>

        <div className="advantages-board">
          <Enter as="article" className="advantage-portrait">
            <img src="/photos/estudante.jpg" alt="Estudante sorrindo com seus cadernos" width="517" height="592" loading="lazy" />
            <div className="portrait-shade" />
            <div className="portrait-topline">
              <span><Sparkles size={14} aria-hidden="true" /> Sua próxima fase</span>
              <span className="portrait-arrow" aria-hidden="true"><ArrowUpRight size={23} /></span>
            </div>
            <div className="portrait-copy">
              <span className="advantage-label">MAIS CONFIANÇA. MAIS POSSIBILIDADES.</span>
              <h3>O mundo espera<br />a sua voz.</h3>
              <p>Para as conversas, os encontros<br />e as histórias que vêm por aí.</p>
              <div className="portrait-signature"><Globe2 size={17} aria-hidden="true" /><span>Fluente por Aí</span><span aria-hidden="true"><ArrowUpRight size={18} /></span></div>
            </div>
          </Enter>

          <Enter as="article" delay={0.06} className="advantage-card advantage-online">
            <div className="advantage-globe" aria-hidden="true"><Globe2 size={200} strokeWidth={0.55} /><span /><i /></div>
            <CardHeader icon={Laptop} label="Sem fronteiras" number="01" />
            <div className="advantage-copy">
              <h3>100% online.<br />De verdade,<br className="online-title-break" /> perto de você.</h3>
              <p>Aprenda de onde estiver, com atenção ao seu desenvolvimento em cada etapa.</p>
            </div>
            <div className="advantage-card-footer"><span className="connection-indicator" /><span>Distância nenhuma. Conexões reais.</span></div>
          </Enter>

          <Enter as="article" delay={0.12} className="advantage-card advantage-personal">
            <CardHeader icon={Compass} label="Do seu jeito" number="02" />
            <div className="advantage-copy">
              <h3>Seu objetivo.<br />Nossa direção.</h3>
              <p>Programas para diferentes níveis, com foco nos seus objetivos pessoais e profissionais.</p>
            </div>
            <div className="personal-route" aria-hidden="true">
              <svg viewBox="0 0 260 48" fill="none"><path d="M9 34C60 34 60 8 116 8S173 34 247 15" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 5" /><circle cx="9" cy="34" r="4" fill="currentColor" /><circle cx="247" cy="15" r="8" fill="var(--paper)" stroke="currentColor" /><path d="m243 15 3 3 5-6" stroke="currentColor" strokeWidth="1.5" /></svg>
              <div><span>Seu ponto de partida</span><span>Seu próximo passo</span></div>
            </div>
          </Enter>

          <Enter as="article" delay={0.08} className="advantage-card advantage-schedule">
            <div className="schedule-copy">
              <CardHeader icon={Clock3} label="No seu tempo" number="03" />
              <div className="advantage-copy">
                <h3>O inglês faz parte.<br />A rotina continua sua.</h3>
                <p>Flexibilidade de horários para aprender no ritmo da sua vida.</p>
              </div>
            </div>
            <div className="routine-stack" aria-hidden="true">
              <div className="routine-back" />
              <div className="routine-note">
                <div className="routine-heading"><span>ESPAÇO PARA IR ALÉM</span><Clock3 size={15} /></div>
                <div className="routine-row"><span className="routine-dot" /><span>Seu tempo</span><Check size={15} /></div>
                <div className="routine-row"><span className="routine-dot" /><span>Seu ritmo</span><Check size={15} /></div>
                <div className="routine-row is-highlighted"><span className="routine-dot" /><span>Sua próxima conversa</span><ArrowUpRight size={16} /></div>
              </div>
            </div>
          </Enter>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="depoimentos" className="testimonials-section section-anchor" aria-labelledby="testimonials-title">
      <div className="container">
        <Enter className="testimonials-heading">
          <p className="eyebrow"><span className="tiny-cross" aria-hidden="true"><BrandSpark /></span> Nossa comunidade <span className="eyebrow-number">DEPOIMENTOS</span></p>
          <div className="testimonials-heading-row">
            <h2 id="testimonials-title">Cada voz,<br /><em>uma nova história.</em></h2>
            <p>{testimonials.length ? 'As experiências de quem aprende com a Fluente por Aí.' : 'Em breve, você vai conhecer as experiências de quem aprende e vai além com a Fluente por Aí.'}</p>
          </div>
        </Enter>

        <div className="testimonials-grid">
          {testimonials.length ? testimonials.map((item, index) => (
            <Enter as="figure" key={item.id} delay={index * 0.06} className="testimonial-card testimonial-story">
              <StudentStory story={item} />
            </Enter>
          )) : [0, 1, 2].map(index => (
            <Enter as="article" key={index} delay={index * 0.06} className="testimonial-card testimonial-placeholder">
              <div className="testimonial-top"><Quote className="testimonial-quote-icon" size={30} strokeWidth={1.5} aria-hidden="true" /><span className="coming-soon-badge">Em breve</span></div>
              <div className="testimonial-blank-lines" aria-hidden="true"><span /><span /><span /></div>
              <div className="testimonial-pending"><span className="pending-avatar"><MessageCircle size={19} strokeWidth={1.5} aria-hidden="true" /></span><div><h3>Novas histórias a caminho</h3><p>Este espaço espera a voz dos nossos alunos.</p></div></div>
            </Enter>
          ))}
        </div>
        {!testimonials.length && <p className="testimonials-footnote"><span aria-hidden="true"><BrandSpark size={15} /></span> Conexões de verdade merecem ser compartilhadas.</p>}
      </div>
    </section>
  );
}
