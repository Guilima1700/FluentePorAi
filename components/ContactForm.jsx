'use client';

import { useId, useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

export default function ContactForm(){
  const [name,setName]=useState('');
  const [goal,setGoal]=useState('Conhecer as aulas');
  const id=useId();
  const message=`Olá!${name.trim()?` Meu nome é ${name.trim()}.`:''} Quero saber mais sobre a Fluente por Aí. Meu interesse é: ${goal}.`;
  return <form className="quick-contact" action="https://wa.me/5592982021077" method="get" target="_blank" rel="noopener noreferrer">
    <h3>Vamos conversar?</h3><p>Conte um pouquinho sobre você e continue no WhatsApp.</p>
    <input type="hidden" name="text" value={message}/>
    <label htmlFor={`${id}-name`}>Seu nome <span>(opcional)</span></label>
    <input id={`${id}-name`} type="text" autoComplete="name" maxLength="80" value={name} onChange={event=>setName(event.target.value)} placeholder="Como podemos chamar você?"/>
    <label htmlFor={`${id}-goal`}>O que você procura?</label>
    <select id={`${id}-goal`} value={goal} onChange={event=>setGoal(event.target.value)}>
      {['Conhecer as aulas','Inglês Geral','Business English','English for Travel','Treinamento Corporativo'].map(option=><option key={option}>{option}</option>)}
    </select>
    <button className="button" type="submit"><MessageCircle size={18} aria-hidden="true"/><span>Conversar pelo WhatsApp</span><ArrowUpRight size={19} aria-hidden="true"/></button>
    <p className="quick-contact-note">Sua mensagem será aberta no WhatsApp para você enviar.</p>
  </form>;
}
