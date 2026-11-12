import { ArrowUpRight, MessageCircle, Plus } from 'lucide-react';

const questions = [
  {
    question: 'Como funcionam as aulas?',
    answer: 'As aulas são online, com foco em comunicação e situações da vida real. O conteúdo e o acompanhamento consideram seu nível, seus objetivos e seu ritmo de aprendizagem.',
  },
  {
    question: 'Preciso já falar inglês para começar?',
    answer: 'Os programas atendem a diferentes níveis. Conte à equipe o que você já conhece do idioma e o que deseja aprender para encontrar o caminho adequado ao seu momento.',
  },
  {
    question: 'Posso estudar de onde estiver?',
    answer: 'Sim. Como as aulas são online, você pode estudar de onde estiver, com acesso à internet e um ambiente adequado para participar das conversas.',
  },
  {
    question: 'Posso aprender inglês para viagens ou trabalho?',
    answer: 'Sim. A Fluente por Aí oferece Inglês Geral, Business English, English for Travel e Treinamento Corporativo. A equipe pode ajudar você a escolher o programa que combina com seu objetivo pessoal ou profissional.',
  },
  {
    question: 'Como posso combinar os horários?',
    answer: 'Há flexibilidade de horários para o inglês fazer parte da sua rotina. Converse com a equipe pelo WhatsApp para consultar a disponibilidade e encontrar uma opção para você.',
  },
  {
    question: 'Como saber os valores e a duração do curso?',
    answer: 'Converse com a equipe pelo WhatsApp para conhecer os valores, a duração e as condições do programa de seu interesse. Assim, você recebe as informações antes de decidir.',
  },
  {
    question: 'Como faço para começar?',
    answer: 'Clique em “Fale conosco pelo WhatsApp” e conte seu objetivo com o inglês. A equipe orienta você sobre os próximos passos. Você também encontra nossos canais de contato no rodapé da página.',
  },
];

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
