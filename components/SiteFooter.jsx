import { ArrowUpRight, Instagram, Mail, MessageCircle } from 'lucide-react';
import BrandSpark from './BrandSpark';

export default function SiteFooter({ baseHref = '' }) {
  return <footer id="contato" className="footer section-anchor">
    <div className="container">
      <div className="footer-top">
        <a href={`${baseHref}#inicio`} aria-label="Fluente por Aí, voltar ao início"><img src="/brand/logo-creme.png" alt="Fluente por Aí" width="506" height="541"/></a>
        <p>English that<br/><em>takes you places.</em></p>
        <nav aria-label="Rodapé"><a href={`${baseHref}#sobre`}>Sobre nós</a><a href={`${baseHref}#metodologia`}>Metodologia</a><a href={`${baseHref}#depoimentos`}>Depoimentos</a><a href={`${baseHref}#faq`}>Dúvidas</a></nav>
        <a className="back-top" href={`${baseHref}#inicio`} aria-label="Voltar ao início"><ArrowUpRight size={23}/></a>
      </div>
      <section className="footer-contact" aria-labelledby="footer-contact-title">
        <h2 id="footer-contact-title">Vamos conversar?</h2>
        <address className="footer-contact-links">
          <a href="https://wa.me/5592982021077" target="_blank" rel="noopener noreferrer"><MessageCircle size={21} aria-hidden="true"/><span><small>WHATSAPP</small><strong>+55 92 98202-1077</strong></span><ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (abre WhatsApp em nova aba)</span></a>
          <a href="mailto:fluenteporai@fluenteporai.com"><Mail size={21} aria-hidden="true"/><span><small>E-MAIL</small><strong>fluenteporai@fluenteporai.com</strong></span><ArrowUpRight size={16} aria-hidden="true"/></a>
          <a href="https://instagram.com/fluenteporai" target="_blank" rel="noopener noreferrer"><Instagram size={21} aria-hidden="true"/><span><small>INSTAGRAM</small><strong>@fluenteporai</strong></span><ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (abre Instagram em nova aba)</span></a>
        </address>
      </section>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Fluente por Aí. Todos os direitos reservados.</span><span>Esse site foi desenvolvido pela <a href="https://www.instagram.com/crystallcode/" target="_blank" rel="noopener noreferrer">Crystal Code</a>.</span><span>FEITO PARA CONECTAR VOCÊ AO MUNDO <span aria-hidden="true"><BrandSpark size={19}/></span></span></div>
    </div>
  </footer>;
}
