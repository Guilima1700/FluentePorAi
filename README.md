# Fluente por Aí

Landing page em Next.js 14 / React 18. Domínio principal preparado: https://fluenteporai.com.br.

## Executar

Node.js 20 ou superior e npm. No Windows, INICIAR-WINDOWS.cmd verifica a instalação e inicia o desenvolvimento.

```sh
npm ci
npm run dev
npm run build
npm start
```

A compilação exporta o site para out/ e executa automaticamente a validação de SEO. Para validar novamente: npm run test:seo. O servidor estático aceita a variável PORT, usa loopback e preserva status 404.

## Domínio e Google

Siga o guia GUIA-DOMINIO-SEO.md. Ele cobre Vercel, DNS, www, HTTPS, Search Console, sitemap e manutenção. A conexão DNS e a verificação de propriedade precisam ser concluídas nas contas da cliente.

A configuração central está em lib/site.mjs. NEXT_PUBLIC_SITE_URL recebe a origem HTTPS completa; o padrão é o domínio acima. Mudanças de ambiente exigem novo build. GOOGLE_SITE_VERIFICATION é opcional para verificação por meta tag; propriedades Domínio do Search Console usam TXT no DNS.

## Estrutura

- components/ConversionLanding.jsx: página inicial simples, cursos em lista e benefícios.
- components/CommunitySections.jsx e components/testimonials.mjs: prévias e sete relatos reais.
- app/depoimentos/page.jsx: relatos completos com retratos compactos.
- components/SiteFooter.jsx: WhatsApp, e-mail e Instagram.
- lib/faq.mjs e components/FAQ.jsx: dados do FAQ compartilhados com a marcação estruturada.
- lib/structured-data.mjs e components/StructuredData.jsx: JSON-LD seguro e baseado no conteúdo visível.
- app/not-found.jsx: 404 personalizada.
- app/sitemap.js e app/robots.js: arquivos de rastreamento estáticos.
- app/llms.txt/route.js: resumo opcional para ferramentas de IA.
- app/conversion.css, app/refinements.css e app/seo.css: refinamentos atuais sobre os estilos anteriores.
- public/og/site.png: imagem social; scripts/generate-seo-image.ps1 é um gerador opcional para Windows, dispensado no deploy.
- scripts/check-seo.mjs: verificação do HTML exportado, executada no postbuild.
- scripts/check-seo-http.mjs: teste HTTP de um site publicado; aceita a origem como argumento.

A página /opcoes-mapa/ foi mantida somente como comparação antiga, não está na navegação nem no sitemap e usa noindex. A página inicial não carrega o mapa nem o motor 3D.

O projeto é exportado estaticamente. Não há formulário de cadastro, banco de dados ou envio automático de mensagens. Os botões de WhatsApp abrem o contato para o visitante enviar sua própria mensagem.

Os depoimentos, fotos, programas e contatos foram fornecidos no projeto. Não foram inventados preços, estrelas, resultados ou endereços físicos. SEO, GEO e dados estruturados não garantem indexação, posição no Google ou citação por sistemas de IA.