import { ArrowLeft, ArrowUpRight, Quote } from 'lucide-react';
import Header from '../../components/Header';
import BrandSpark from '../../components/BrandSpark';
import SiteFooter from '../../components/SiteFooter';
import { testimonials } from '../../components/testimonials.mjs';

export const metadata = { title:'Depoimentos da nossa comunidade | Fluente por Aí',description:'Leia os depoimentos de alunos da Fluente por Aí: Jairo Oliveira, Sophia Cruz, Renata e família, Jeffeson Encarnação, Paulo Hiroyuki, Ana Vitória Macena e Luiz Felipe.' };

export default function TestimonialsPage(){
  return <><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><Header whatsappLink="https://wa.me/5592982021077" baseHref="/"/>
    <main id="conteudo" className="stories-page">
      <div className="container"><a className="page-back" href="/#depoimentos"><ArrowLeft size={17}/> Voltar ao site</a>
        <header className="stories-page-heading"><p className="eyebrow"><BrandSpark size={20} aria-hidden="true"/> NOSSA COMUNIDADE</p><h1>Histórias reais.<br/><em>Novos horizontes.</em></h1><p>Conheça as experiências de quem aprende com a Fluente por Aí. Aqui, cada voz tem seu espaço.</p><nav aria-label="Escolher depoimento">{testimonials.map(story=><a key={story.id} href={`#${story.id}`}>{story.name}<ArrowUpRight size={15}/></a>)}</nav></header>
        <div className="complete-stories">{testimonials.map((story,index)=><article className="complete-story section-anchor" key={story.id} id={story.id} aria-labelledby={`title-${story.id}`}>
          <div className="complete-story-photo"><img src={story.photo} alt={story.name==='Renata e família'?'Renata com Sophia e Davi':`Retrato de ${story.name}`} width={story.width} height={story.height} loading={index===0?'eager':'lazy'} decoding="async" style={{objectPosition:story.position}}/></div>
          <header className="complete-story-heading"><h2 id={`title-${story.id}`}>{story.name}</h2><p className="complete-story-byline">{story.byline}</p><Quote size={21} strokeWidth={1.3} aria-hidden="true"/></header>
          <blockquote>{story.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</blockquote>
        </article>)}</div>
        <div className="stories-page-cta"><div><span className="eyebrow">SUA PRÓXIMA CONVERSA</span><h2>O próximo capítulo<br/>pode ser <em>o seu.</em></h2></div><a href="https://wa.me/5592982021077" className="button button-light" target="_blank" rel="noopener noreferrer">Vamos conversar<ArrowUpRight size={20}/><span className="sr-only"> (abre WhatsApp em nova aba)</span></a></div>
      </div>
    </main><SiteFooter baseHref="/"/></>;
}
