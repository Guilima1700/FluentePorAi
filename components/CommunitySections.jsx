'use client';

import { motion, useReducedMotion } from 'framer-motion';
import BrandSpark from './BrandSpark';
import StudentStory from './StudentStory';
import { testimonials } from './testimonials.mjs';
import {
  ArrowUpRight,
  MessageCircle, Quote,
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
        {testimonials.length > 0 && <div className="all-stories-cta"><p>Cada experiência merece ser contada por inteiro.</p><a className="button button-light" href="/depoimentos/">Ver todos os depoimentos <span className="button-arrow"><ArrowUpRight size={19} aria-hidden="true" /></span></a></div>}
        {!testimonials.length && <p className="testimonials-footnote"><span aria-hidden="true"><BrandSpark size={15} /></span> Conexões de verdade merecem ser compartilhadas.</p>}
      </div>
    </section>
  );
}
