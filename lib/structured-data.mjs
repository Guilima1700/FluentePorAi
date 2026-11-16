import { absoluteUrl, siteName, siteDescription } from './site.mjs';
import { questions } from './faq.mjs';

export const organization = {
  '@type':'EducationalOrganization', '@id':absoluteUrl('/#organization'), name:siteName,
  alternateName:'Fluente Por Ai', url:absoluteUrl(), description:siteDescription,
  logo:{'@type':'ImageObject',url:absoluteUrl('/brand/logo-creme.png'),width:506,height:541},
  telephone:'+55-92-98202-1077',email:'fluenteporai@fluenteporai.com',
  sameAs:['https://www.instagram.com/fluenteporai/'],
  contactPoint:{'@type':'ContactPoint',contactType:'Informações sobre cursos',telephone:'+55-92-98202-1077',url:'https://wa.me/5592982021077'},
};
export const website = {'@type':'WebSite','@id':absoluteUrl('/#website'),url:absoluteUrl(),name:siteName,inLanguage:'pt-BR',publisher:{'@id':organization['@id']}};
export const homepageData = {
  '@context':'https://schema.org', '@graph':[
    organization, website,
    {'@type':'WebPage','@id':absoluteUrl('/#webpage'),url:absoluteUrl(),name:'Fluente por Aí | Cursos de inglês online',description:siteDescription,inLanguage:'pt-BR',isPartOf:{'@id':website['@id']},about:{'@id':organization['@id']}},
    {'@type':'FAQPage','@id':absoluteUrl('/#faq'),inLanguage:'pt-BR',mainEntity:questions.map(({question,answer})=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))},
    ...[
      ['ingles-geral','Inglês Geral','Conversação, compreensão e vocabulário para o dia a dia.'],
      ['business-english','Business English','Inglês para reuniões, apresentações, entrevistas e carreira.'],
      ['english-for-travel','English for Travel','Comunicação para viagens, turismo e intercâmbios.'],
      ['treinamento-corporativo','Treinamento Corporativo','Aprendizado voltado às necessidades da sua equipe.'],
    ].map(([id,name,description])=>({'@type':'Course','@id':absoluteUrl(`/#${id}`),name,description,inLanguage:'pt-BR',url:absoluteUrl('/#sobre'),provider:{'@id':organization['@id']}})),
  ],
};
