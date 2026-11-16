const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fluenteporai.com.br';
const parsedUrl = new URL(configuredUrl);
if (parsedUrl.protocol !== 'https:' || parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash) {
  throw new Error('NEXT_PUBLIC_SITE_URL deve ser uma origem HTTPS completa, sem caminho, parâmetros ou fragmentos.');
}
export const siteUrl = parsedUrl.origin;
export const indexable = process.env.VERCEL_ENV !== 'preview';
export const siteName = 'Fluente por Aí';
export const siteDescription = 'Cursos de inglês online com foco em conversação e objetivos pessoais ou profissionais. Conheça Inglês Geral, Business English e inglês para viagens.';
export const absoluteUrl = (path = '/') => new URL(path, siteUrl).href;
export const socialImage = { url:absoluteUrl('/og/site.png'), width:1200, height:630, alt:'Fluente por Aí — Cursos de inglês online' };
export function pageMetadata(title,description,path){
  return {title,description,alternates:{canonical:absoluteUrl(path)},
    openGraph:{title,description,url:absoluteUrl(path),siteName,locale:'pt_BR',type:'website',images:[socialImage]},
    twitter:{card:'summary_large_image',title,description,images:[socialImage.url]},
  };
}
