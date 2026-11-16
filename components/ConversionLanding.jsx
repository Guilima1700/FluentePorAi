import { ArrowDown, ArrowUpRight, Check, Clock3, Compass, Laptop, MessageCircle, Users } from 'lucide-react';
import Header from './Header';
import SiteFooter from './SiteFooter';
import FAQ from './FAQ';
import { Testimonials } from './CommunitySections';

const whatsapp = 'https://wa.me/5592982021077';
const programs = [
  ['Inglês Geral', 'Conversação, compreensão e vocabulário para o dia a dia.'],
  ['Business English', 'Inglês para reuniões, apresentações, entrevistas e carreira.'],
  ['English for Travel', 'Comunicação para viagens, turismo e intercâmbios.'],
  ['Treinamento Corporativo', 'Aprendizado voltado às necessidades da sua equipe.'],
];
const benefits = [
  { icon:MessageCircle, title:'Comunicação na prática', text:'Use o inglês desde as primeiras aulas. Conversas e situações reais ajudam você a desenvolver confiança para se expressar.' },
  { icon:Clock3, title:'Flexibilidade', text:'Aprenda de onde estiver, com aulas online e flexibilidade de horários. Consulte a disponibilidade e encontre uma opção para a sua rotina.' },
  { icon:Compass, title:'Do seu jeito', text:'Seu nível e seus objetivos orientam o aprendizado. O conteúdo se conecta ao que você precisa na vida pessoal ou profissional.' },
  { icon:Users, title:'Acompanhamento próximo', text:'Conte com professores qualificados para praticar, esclarecer dúvidas e receber orientação em cada etapa do seu desenvolvimento.' },
];

function WhatsAppButton({ children = 'Fale conosco pelo WhatsApp' }) {
  return <a className="conversion-button" href={whatsapp} target="_blank" rel="noopener noreferrer"><span>{children}</span><ArrowUpRight size={23} aria-hidden="true"/><span className="sr-only"> (abre WhatsApp em nova aba)</span></a>;
}

export default function ConversionLanding() {
  return <div className="conversion-site">
    <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <Header whatsappLink={whatsapp}/>
    <main id="conteudo">
      <section id="inicio" className="conversion-hero section-anchor">
        <div className="container conversion-hero-inner">
          <p className="conversion-eyebrow">FLUENTE POR AÍ · INGLÊS PARA IR ALÉM</p>
          <h1>English that<br/><em>takes you places.</em></h1>
          <p className="conversion-lead">O próximo destino da sua vida começa com uma conversa. Aprenda inglês para explorar o mundo, crescer na carreira e se conectar de verdade.</p>
          <div className="conversion-actions"><WhatsAppButton/><a className="conversion-secondary" href="#sobre">Como funciona <ArrowDown size={22} aria-hidden="true"/></a></div>
          <div className="conversion-proof"><span><Laptop size={19} aria-hidden="true"/> Aulas online</span><span><Check size={19} aria-hidden="true"/> Aprendizado do seu jeito</span></div>
        </div>
      </section>

      <section id="sobre" className="conversion-about section-anchor">
        <div className="container conversion-about-grid">
          <div><p className="conversion-eyebrow">COMO FUNCIONA</p><h2>O inglês é o caminho.<br/><em>O destino é você quem escolhe.</em></h2><p>A Fluente por Aí oferece cursos de inglês online que conectam o aprendizado aos seus objetivos, com conteúdo contextualizado e acompanhamento individualizado.</p><p>Para as conversas do dia a dia, uma nova oportunidade profissional ou a viagem que você quer fazer: encontre o programa que combina com o seu momento.</p></div>
          <div className="conversion-programs"><h3>Qual é o seu objetivo?</h3><ul>{programs.map(([name,description])=><li key={name}><Check size={22} aria-hidden="true"/><div><strong>{name}</strong><p>{description}</p></div></li>)}</ul><a className="conversion-inline-link" href={whatsapp} target="_blank" rel="noopener noreferrer">Quero conhecer as aulas <ArrowUpRight size={21} aria-hidden="true"/><span className="sr-only"> (abre WhatsApp em nova aba)</span></a></div>
        </div>
      </section>

      <section id="metodologia" className="conversion-benefits section-anchor">
        <div className="container"><header className="conversion-section-heading"><p className="conversion-eyebrow">APRENDA COM A FLUENTE POR AÍ</p><h2>Inglês que faz parte<br/><em>da sua vida.</em></h2><p>Uma forma de aprender que considera o que importa para você.</p></header><div className="conversion-benefits-grid">{benefits.map(({icon:Icon,title,text})=><article className="conversion-benefit" key={title}><Icon size={35} strokeWidth={1.5} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div><div className="conversion-benefits-cta"><WhatsAppButton>Quero saber mais sobre as aulas</WhatsAppButton></div></div>
      </section>
      <Testimonials/>
      <FAQ/>
    </main>
    <SiteFooter/>
  </div>;
}
