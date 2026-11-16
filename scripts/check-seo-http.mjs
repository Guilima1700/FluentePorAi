import assert from 'node:assert/strict';
import { absoluteUrl } from '../lib/site.mjs';
const base = process.argv[2] || 'http://127.0.0.1:3002';
for(const [path,status,type] of [['/',200,'text/html'],['/depoimentos/',200,'text/html'],['/robots.txt',200,'text/plain'],['/sitemap.xml',200,'xml'],['/llms.txt',200,'text/plain'],['/og/site.png',200,'image/png'],['/caminho-inexistente-validacao-seo/',404,'text/html']]){
  const response=await fetch(new URL(path,base),{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,status,`${path}: status HTTP`);
  assert.ok(response.headers.get('content-type')?.includes(type),`${path}: Content-Type`);
  if(path==='/'){
    const html=await response.text();
    assert.ok(html.includes(`rel="canonical" href="${absoluteUrl('/')}"`),'Canonical da home');
  } else if(status===404){
    const html=await response.text();
    assert.ok(html.includes('Esse caminho'),'404 da marca');
    assert.ok(html.includes('noindex'),'404 fora da indexação');
  }
  console.log(`${status} ${path}`);
}
