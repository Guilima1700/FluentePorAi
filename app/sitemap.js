import { absoluteUrl, indexable } from '../lib/site.mjs';
export const dynamic = 'force-static';
export default function sitemap(){
  return indexable ? [{url:absoluteUrl('/')},{url:absoluteUrl('/depoimentos/')}]:[];
}
