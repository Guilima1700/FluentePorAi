import { ArrowLeft, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import SiteFooter from '../components/SiteFooter';

export const metadata = {title:'Página não encontrada | Fluente por Aí',robots:{index:false,follow:true}};

export default function NotFound(){
  return <div className="conversion-site"><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><Header whatsappLink="https://wa.me/5592982021077" baseHref="/"/><main id="conteudo" className="not-found-page"><div className="container"><p className="conversion-eyebrow">ERRO 404 · FLUENTE POR AÍ</p><h1>Esse caminho<br/><em>não foi encontrado.</em></h1><p>O endereço pode ter mudado ou estar incompleto. Volte ao início para conhecer as aulas ou converse com a gente.</p><div className="not-found-actions"><a className="conversion-button" href="/"><ArrowLeft size={20} aria-hidden="true"/> Voltar ao início</a><a href="https://wa.me/5592982021077" target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true"/> Fale conosco<span className="sr-only"> (abre WhatsApp em nova aba)</span></a></div></div></main><SiteFooter baseHref="/"/></div>;
}
