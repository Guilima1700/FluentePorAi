# Entrega: domínio, Google e busca por IA — Fluente por Aí

Domínio principal: **https://fluenteporai.com.br**. Alternativa com redirecionamento: **https://www.fluenteporai.com.br**. Projeto Vercel: **fluente-por-ai**, conectado ao repositório **Guilima1700/FluentePorAi**, branch **main**.

Este guia distingue a implementação já entregue das ações que precisam ser feitas nas contas da proprietária. DNS, Search Console, verificação de propriedade e emissão do certificado dependem dessas configurações externas. SEO significa otimização para mecanismos de busca; GEO, neste contexto, significa tornar as informações claras para sistemas de busca e respostas com IA. Nenhum deles garante posição ou citação.

## 1. Conectar o endereço principal na Vercel

1. Entre na Vercel com a conta que administra o projeto.
2. Abra **fluente-por-ai → Settings → Domains → Add Domain**.
3. Digite **fluenteporai.com.br**, sem `https://`, sem caminho e sem espaços. Apenas `fluenteporai`, como na imagem enviada, é um endereço incompleto.
4. Para esse endereço principal, selecione **Connect to an environment / Conecte-se a um ambiente → Production / Produção**.
5. Não escolha **Redirect to another domain** para o principal. Essa seleção é a causa do aviso **Select a redirect destination** na imagem.
6. Clique em adicionar. A Vercel apresentará os registros DNS específicos exigidos para esse projeto. Mantenha essa tela aberta.
7. Se aparecer uma solicitação de propriedade do domínio, copie também o registro TXT de verificação fornecido pelo painel.

Não é necessário transferir a compra do domínio para a Vercel. Referência: [adicionar um domínio existente](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## 2. Configurar o DNS no painel responsável pelo domínio

Na consulta feita durante a implementação, o domínio respondeu com os servidores `a.auto.dns.br` e `b.auto.dns.br`. Isso indica uso do serviço automático de DNS do Registro.br; não comprova onde a compra foi intermediada. Faça a edição no painel que realmente controla esses servidores.

Se administra o domínio no Registro.br:

1. Entre na conta do titular e selecione **fluenteporai.com.br**.
2. Procure a seção **DNS** e a opção de configurar endereçamento, configurar zona DNS ou editar zona.
3. Se o modo básico só oferecer redirecionamento para um endereço de site, escolha o **modo avançado**, que permite criar registros individuais. Se houver transição de modo, espere o painel liberá-la.
4. Crie o registro solicitado pela Vercel para o domínio raiz. Geralmente será um **A**; o valor exato é o exibido no painel da Vercel, e não um IP fixo copiado de um tutorial.
5. O nome do domínio raiz costuma ficar vazio no Registro.br. Outros provedores usam `@`; respeite a convenção do seu painel.
6. Crie o registro do `www` conforme instrução da Vercel, normalmente um **CNAME**. Copie o destino inteiro informado, inclusive um ponto final quando o painel solicitar.
7. Se exigido, adicione o TXT de verificação com nome e conteúdo exatamente iguais aos indicados.
8. Salve. Não apague registros MX, SPF, DKIM ou DMARC usados por e-mail. Remova ou ajuste apenas entradas A/AAAA/CNAME conflitantes do mesmo endereço, depois de identificar sua finalidade.

| Finalidade | Nome no DNS | Tipo usual | Valor |
| --- | --- | --- | --- |
| Site principal | vazio ou `@` | A | Exatamente o valor da Vercel |
| Endereço alternativo | `www` | CNAME | Exatamente o destino da Vercel |
| Propriedade, se solicitado | fornecido no painel | TXT | Exatamente o conteúdo de verificação |

Não crie um CNAME comum no domínio raiz se o provedor não suportar essa configuração. Não mude os servidores NS inteiros para resolver apenas um apontamento, principalmente se já houver e-mail em uso. As instruções do painel de DNS e da Vercel prevalecem sobre exemplos genéricos.

Fontes: [DNS do Registro.br](https://registro.br/tecnologia/caracteristicas-tecnicas/), [registros DNS na Vercel](https://vercel.com/docs/domains/managing-dns-records).

## 3. Adicionar o www e finalizar HTTPS

1. Na Vercel, adicione **www.fluenteporai.com.br** ao mesmo projeto.
2. Escolha o redirecionamento para **fluenteporai.com.br**, usando o tipo permanente **308** quando disponível. O domínio raiz continua conectado à Produção.
3. Confira se os dois endereços exibem **Valid Configuration**. Se ainda não, use a opção de verificar/atualizar do painel e confira os registros.
4. Aguarde a propagação DNS. Ela depende do TTL e do provedor; pode levar de minutos a mais tempo. Não existe um prazo único garantido.
5. A Vercel emite o certificado HTTPS automaticamente após a configuração válida. Se falhar, examine o erro indicado, incluindo registros CAA e conflitos DNS. Não ignore avisos de certificado no navegador.
6. Abra em janela anônima `https://fluenteporai.com.br` e `https://www.fluenteporai.com.br`. O segundo deve terminar no primeiro.
7. Teste também `/depoimentos/`, incluindo uma visita pelo www para conferir se o caminho é preservado.

Depois que o domínio novo funcionar, configure o endereço antigo `fluente-por-ai.vercel.app` para redirecionar permanentemente ao novo, se a opção estiver disponível em Domains. Se não estiver, use a regra de host descrita na seção 8. Não ative esse redirecionamento antes de validar o domínio novo.

Fontes: [redirecionamento de domínios](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting), [solução de problemas](https://vercel.com/docs/domains/troubleshooting).

## 4. Confirmar a URL principal no projeto

1. Em **Settings → Environment Variables**, crie `NEXT_PUBLIC_SITE_URL` com o valor **https://fluenteporai.com.br** no ambiente **Production**.
2. Se a variável já existir apontando para outro endereço, atualize-a.
3. Não inclua `/depoimentos`, parâmetros ou fragmentos. A configuração central valida a origem HTTPS.
4. Faça **Redeploy** do último deployment de Produção. Como o site é exportado estaticamente, mudanças nessa variável exigem uma nova compilação.
5. O padrão do código já é o domínio confirmado acima; manter a variável explícita documenta a configuração da entrega.

Essa única configuração gera canonicals, URLs dos dados estruturados, referências de compartilhamento, sitemap e `llms.txt`. Variáveis em `.env.local` não são enviadas automaticamente à Vercel. O arquivo `.env.example` demonstra as opções disponíveis.

O e-mail de contato continua sendo **fluenteporai@fluenteporai.com**, conforme fornecido no projeto. Comprar o domínio `.com.br` não cria uma caixa postal nem muda esse endereço. Só altere o e-mail do site depois de criar e testar a nova caixa, se desejado.

## 5. Cadastrar no Google Search Console

1. Abra [Google Search Console](https://search.google.com/search-console) com uma conta que ficará sob controle da cliente.
2. Adicione uma propriedade do tipo **Domínio** e informe **fluenteporai.com.br**, sem protocolo ou caminho.
3. Copie o TXT `google-site-verification=...` fornecido pelo Google.
4. Na zona DNS do domínio, crie um registro **TXT** no domínio raiz com esse conteúdo. Ele pode coexistir com outros TXT; não substitua SPF ou verificações existentes.
5. Volte ao Search Console e clique em verificar. Se ainda não encontrar o TXT, espere a propagação e tente novamente. Mantenha o registro depois da verificação.
6. Abra **Sitemaps** e envie **https://fluenteporai.com.br/sitemap.xml**. Se a interface já mostrar o domínio antes do campo, informe apenas `sitemap.xml`.
7. Em **Inspeção de URL**, informe **https://fluenteporai.com.br/**. Faça o teste da URL publicada e solicite indexação, quando a opção estiver disponível.
8. Repita para **https://fluenteporai.com.br/depoimentos/**.
9. Acompanhe o relatório de indexação e eventuais problemas. Enviar um sitemap ou solicitar indexação não obriga o Google a incluir ou posicionar a página.
10. Confira a marcação em [Schema Markup Validator](https://validator.schema.org/) e use o [Rich Results Test](https://search.google.com/test/rich-results) para recursos que o Google suporte. Uma entidade Schema.org válida pode não ter um resultado visual específico no Google.

A alternativa **Prefixo do URL** permite verificação por meta tag. Nesse caso, configure apenas o token recebido em `GOOGLE_SITE_VERIFICATION` na Vercel e faça Redeploy antes de verificar. Para uma propriedade Domínio, a verificação é feita por DNS, não por essa meta tag.

Fontes: [verificação de propriedade](https://support.google.com/webmasters/answer/9008080?hl=pt-BR), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [relatório de indexação](https://support.google.com/webmasters/answer/7440203?hl=pt-BR).

## 6. O que está implementado no código

- Título e descrição em português relacionados a cursos de inglês online e à marca.
- Canonical específico da página inicial e da página de depoimentos.
- Open Graph, cartão para compartilhamento e imagem PNG de 1200 × 630.
- HTML em português, conteúdo principal renderizado no servidor, um H1 por página e links internos reais.
- Dados estruturados de organização educacional, site, página, quatro cursos e perguntas frequentes. Os dados do FAQ são compartilhados com o texto visível, evitando divergências.
- Página de depoimentos com seus próprios metadados, coleção e caminho de navegação estruturado.
- Nenhum preço, avaliação em estrelas, nota média, endereço físico, credencial ou prazo de fluência presumido.
- `robots.txt` e `sitemap.xml` gerados no build. O sitemap contém apenas as duas páginas públicas de conteúdo; não contém a 404 nem a página de comparação de mapas.
- `noindex` na página de comparação; o robô pode lê-la para reconhecer a diretiva. Não se usa robots.txt para tentar desindexá-la.
- Página 404 da marca, com retorno ao início e WhatsApp, preservando status HTTP 404.
- `llms.txt` como resumo opcional para sistemas que o consultam. Ele não é condição para aparecer em buscas ou respostas com IA.
- Canonical de produção nas prévias; em builds Vercel Preview, metadados de não indexação, robots restritivo e sitemap vazio. A Vercel também aplica seus próprios controles de preview.
- Cabeçalhos básicos de tipo de conteúdo e referência, sem bloquear recursos de renderização do site.

As marcações Schema.org ajudam a descrever o conteúdo; não garantem rich results. O FAQ de uma escola não deve ser vendido como garantia de expansão de resultados no Google.

## 7. Manutenção de SEO e GEO

1. Use sempre o mesmo nome **Fluente por Aí**, domínio principal e canais oficiais nas redes sociais e materiais da escola.
2. Atualize dúvidas reais dos alunos e descrições úteis dos programas. Não repita palavras-chave artificialmente.
3. Para buscar termos específicos, planeje páginas próprias por programa somente quando houver conteúdo original e validado sobre público, abordagem e funcionamento. Não crie páginas repetidas trocando apenas nomes de cidades.
4. Publique relatos com autorização dos alunos. Não invente resultados, número de matrículas ou notas.
5. Inclua conteúdos com autoria, revisão e datas reais quando houver artigos ou materiais didáticos. Evite textos genéricos produzidos apenas para ocupar resultados.
6. Quando fizer sentido para o negócio e ele for elegível, mantenha o Perfil da Empresa no Google. Não cadastre um endereço fictício para uma operação exclusivamente online.
7. Meça carregamento e experiência no [PageSpeed Insights](https://pagespeed.web.dev/) e acompanhe Core Web Vitals no Search Console. Testes de laboratório não substituem dados reais de visitantes.
8. Verifique se firewall, proteção de deployment e regras de bots não impedem acesso às páginas públicas. Controles de treinamento e controles de busca são decisões diferentes; não se deve liberar tudo em nome de GEO.
9. Não prometa colocação para “curso de inglês”: esse termo é amplo e competitivo. Marca, intenção da busca, qualidade do conteúdo, reputação e concorrência também influenciam.

O Google orienta aplicar os fundamentos de SEO às funções de IA; não há uma marcação especial que garanta menções. Fonte: [recursos de IA e seu site](https://developers.google.com/search/docs/appearance/ai-features).

## 8. Redirecionamento opcional do endereço antigo

Depois que o domínio novo estiver funcionando, esta regra pode ser **adicionada**, preservando os `headers` existentes, ao `vercel.json`:

```json
"redirects": [
  {
    "source": "/:path*",
    "has": [{ "type": "host", "value": "fluente-por-ai.vercel.app" }],
    "destination": "https://fluenteporai.com.br/:path*",
    "permanent": true
  }
]
```

Confirme que essa regra não conflita com redirecionamentos já configurados no painel e faça novo deploy. Ela não está ativada nesta entrega para não interromper o acesso antigo antes de o DNS novo estar pronto. Para mudança de endereço de uma propriedade anteriormente indexada, avalie também a ferramenta de alteração de endereço do Search Console após concluir os redirecionamentos.

## 9. Conferência antes de entregar à cliente

- [ ] Principal e www estão válidos na Vercel e HTTPS abre sem aviso.
- [ ] www redireciona permanentemente para o principal, preservando caminhos.
- [ ] Página inicial e `/depoimentos/` respondem 200.
- [ ] Um caminho inexistente responde 404 e exibe a página da marca, sem redirecionar tudo para a home.
- [ ] `/robots.txt`, `/sitemap.xml`, `/llms.txt` e `/og/site.png` abrem.
- [ ] Canonicals e sitemap mostram `https://fluenteporai.com.br`, sem localhost, `www` ou domínio de preview.
- [ ] Página inicial e depoimentos não têm `noindex`; comparação de mapas e 404 ficam fora da indexação.
- [ ] Search Console foi verificado e o sitemap enviado.
- [ ] Links de WhatsApp, e-mail e Instagram foram conferidos.
- [ ] Compartilhamento mostra nome, descrição e imagem corretos. Aplicativos podem manter cache após mudanças.
- [ ] O acesso às contas e ao domínio fica com a cliente, com renovação e recuperação configuradas.

Para verificar a exportação local:

```text
npm run build
node scripts/check-seo.mjs
npm start
# Em outro terminal, com o servidor estático em execução na porta 3000:
node scripts/check-seo-http.mjs http://127.0.0.1:3000
```

O script de SEO verifica o HTML compilado, canonicals, JSON-LD, sitemap, robots, imagem, 404 e exclusões. A confirmação de DNS, HTTPS, redirecionamentos e indexação exige verificar o domínio já configurado nas plataformas externas.
