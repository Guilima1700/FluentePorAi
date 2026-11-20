import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { absoluteUrl, indexable } from '../lib/site.mjs';
const read = path=>readFileSync(`out/${path}`,'utf8');
for(const [file,url] of [['index.html','/'],['depoimentos/index.html','/depoimentos/']]){
  const html=read(file);
  const canonicals=[...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
  assert.equal(canonicals.length,1,`${file}: canonical único`);
  assert.ok(canonicals[0][0].includes(absoluteUrl(url)),`${file}: canonical correto`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: H1 único`);
  assert.equal(/<meta name="robots" content="noindex/.test(html),!indexable,`${file}: política de indexação do ambiente`);
  assert.ok(html.includes('og/site.png'),`${file}: imagem social`);
  const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length,`${file}: JSON-LD presente`);
  for(const [,data] of scripts){const parsed=JSON.parse(data);assert.equal(parsed['@context'],'https://schema.org');}
}
const home=read('index.html');
const graph=JSON.parse([...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)][0][1])['@graph'];
assert.equal(graph.filter(node=>node['@type']==='Course').length,4);
assert.equal(graph.find(node=>node['@type']==='FAQPage').mainEntity.length,7);
assert.ok(!graph.some(node=>node.aggregateRating),'Sem avaliações inventadas');
const sitemap=read('sitemap.xml');
assert.equal((sitemap.match(/<loc>/g)||[]).length,indexable?2:0);
if(indexable)assert.ok(sitemap.includes(absoluteUrl('/depoimentos/')));
assert.ok(!sitemap.includes('opcoes-mapa'));
assert.ok(read('robots.txt').includes(indexable?absoluteUrl('/sitemap.xml'):'Disallow: /'));
assert.ok(read('opcoes-mapa/index.html').includes('noindex'));
assert.ok(read('404.html').includes('noindex'));
assert.ok(read('404.html').includes('Esse caminho'));
assert.ok(read('llms.txt').includes(absoluteUrl('/')));
const image=readFileSync('out/og/site.png');
assert.equal(image.readUInt32BE(16),1200);assert.equal(image.readUInt32BE(20),630);
console.log('SEO validado: canonicals, H1, JSON-LD, 4 cursos, 7 FAQs, sitemap, robots, noindex, 404, llms.txt e imagem social.');
