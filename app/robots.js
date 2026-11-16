import { absoluteUrl, indexable } from '../lib/site.mjs';
export const dynamic = 'force-static';
export default function robots(){
  return {rules:{userAgent:'*',...(indexable?{allow:'/'}:{disallow:'/'})},...(indexable?{sitemap:absoluteUrl('/sitemap.xml')}:{})};
}
