import { ArrowUpRight, MessageCircle, Plus } from 'lucide-react';

import { questions } from '../lib/faq.mjs';

export default function FAQ() {
  return (
    <section id="faq" className="faq-section section-anchor" aria-labelledby="faq-title">
      <div className="container faq-container">
        <header className="faq-heading">
          <p className="eyebrow">PERGUNTAS FREQUENTES</p>
          <h2 id="faq-title">Ainda tem <em>dúvidas?</em></h2>
          <p>O essencial para dar o seu próximo passo com confiança.</p>
        </header>
        <div className="faq-list">
          {questions.map(item => (
            <details className="faq-item" name="fluente-faq" key={item.question}>
              <summary><span>{item.question}</span><Plus size={20} strokeWidth={1.5} aria-hidden="true" /></summary>
              <div className="faq-answer"><p>{item.answer}</p></div>
            </details>
          ))}
        </div>
        <div className="faq-contact">
          <h3>Prefere conversar com a gente?</h3>
          <p>Conte seu objetivo. A gente ajuda você a encontrar o caminho.</p>
          <a className="button button-light" href="https://wa.me/5592982021077" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={19} aria-hidden="true"/><span>Fale conosco pelo WhatsApp</span><ArrowUpRight size={19} aria-hidden="true"/>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
