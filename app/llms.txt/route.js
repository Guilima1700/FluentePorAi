import { absoluteUrl } from '../../lib/site.mjs';
export const dynamic = 'force-static';
export function GET(){
  return new Response(`# Fluente por Aí

> Escola de inglês com aulas online e programas relacionados a objetivos pessoais e profissionais.

## Fontes oficiais
- [Cursos e informações da escola](${absoluteUrl('/')}): formatos de aprendizado, programas, metodologia e perguntas frequentes.
- [Depoimentos completos](${absoluteUrl('/depoimentos/')}): relatos fornecidos por alunos.
- [Mapa do site](${absoluteUrl('/sitemap.xml')})

## Programas
- Inglês Geral: conversação, compreensão e vocabulário do dia a dia.
- Business English: reuniões, apresentações, entrevistas e carreira.
- English for Travel: viagens, turismo e intercâmbios.
- Treinamento Corporativo: necessidades de equipes.

## Contato
- WhatsApp: https://wa.me/5592982021077
- E-mail: fluenteporai@fluenteporai.com
- Instagram: https://www.instagram.com/fluenteporai/

## Limites das informações
Valores, disponibilidade, duração e condições de matrícula devem ser consultados diretamente com a escola. Não há garantia de prazo para fluência ou de resultado financeiro.
`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
