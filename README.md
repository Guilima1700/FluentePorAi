# Fluente por Aí · Um mundo de possibilidades

Redesign da landing page original em Next.js 14, React 18 e Framer Motion. A identidade da marca, os quatro programas e os canais de contato foram preservados.

## Executar

Requisitos: Node.js 20 ou superior e npm.

No Windows, `INICIAR-WINDOWS.cmd` verifica as dependências, instala as que estiverem faltando e inicia a página. Também é possível usar os comandos abaixo.

```sh
npm ci
npm run dev
```

Ao atualizar uma versão existente, substitua também `package.json` e `package-lock.json` e execute `npm install` antes de reiniciar o servidor. O erro `Can't resolve 'three'` significa que o motor 3D ainda não foi instalado nessa pasta, mesmo que esteja listado no `package.json`.

Para gerar e conferir a versão de produção:

```sh
npm run build
npm start
```

Abra http://localhost:3000. Se a porta estiver ocupada, use `npm run dev -- --port 3001`. O servidor estático de produção aceita a variável `PORT`.

## Entrega e hospedagem

`npm run build` gera a pasta `out/`, pronta para hospedagem estática. Publique o conteúdo completo dessa pasta, incluindo `_next/`, `brand/` e `photos/`. O arquivo ZIP estático incluído na entrega já contém essa versão compilada.

## Direção visual e interações

- Fundo vermelho com a fotografia de viagem fornecida pela cliente. Tipografia editorial, contraste em creme, azul vibrante e botão principal de WhatsApp em destaque.
- Abertura com mapa de conexões em SVG: sem WebGL ou carregamento de texturas. Toque ou use o teclado para escolher Londres, Nova York, Toronto e Sydney. Em telas pequenas, botões de 44 pixels facilitam a seleção.
- `/opcoes-mapa/`: página de comparação com mapa de conexões, globo ilustrado e o globo 3D anterior. A seleção é apenas uma prévia e não altera o mapa da página inicial. Essa página não aparece na navegação de visitantes e tem indexação desativada.
- Avião ligado à rolagem: a rota é recalculada com as posições reais das seções e cruza a página nos intervalos entre elas. A animação e a trilha aparecem apenas no desktop; ficam ocultas em telas pequenas e em dispositivos com toque como interação principal, inclusive em paisagem.
- Página mais curta para conversão, sem as antigas seções de cards de cursos e diferenciais nem o cartão de formulário. Apresentação, metodologia, depoimentos e FAQ conduzem ao WhatsApp.
- Metodologia com quatro painéis acessíveis. Cada escolha atualiza a conversa ilustrativa.
- FAQ no final com sete perguntas e respostas, abertura nativa por clique ou teclado e botão de contato. Informações comerciais não confirmadas são direcionadas à equipe.
- Comunidade compacta com avatares redondos e trechos em balões. O botão “Ver todos os depoimentos” abre `/depoimentos/`, com relatos completos e retratos pequenos para facilitar a rolagem. Os links individuais levam diretamente ao relato escolhido.
- Telefone, e-mail e Instagram ficam no rodapé compartilhado entre a página inicial e a página de depoimentos. Os botões de WhatsApp abrem o contato diretamente, sem formulário intermediário.
- Painel da metodologia em azul-marinho sólido, sem o mapa de fundo, com os dois balões na mesma cor creme.
- Menu móvel com fechamento por Escape, seleção de link e clique fora do cabeçalho.
- Preferência de movimento reduzido respeitada no globo, voo, entradas e animações CSS.
- Símbolos decorativos, setas e estrelas em SVG, sem substituição por emojis no iPhone ou em outros sistemas.

## Editar

- Conteúdo, exemplos e contato: `app/page.jsx`.
- Estrutura da comunidade: `components/CommunitySections.jsx`.
- Perguntas e respostas: `components/FAQ.jsx`; estilos: `app/faq.css`.
- Relatos e fotos da comunidade: `components/testimonials.mjs`; resumos: `components/StudentStory.jsx`; página completa: `app/depoimentos/page.jsx`.
- Mapa leve: `components/ConnectionMap.jsx`; comparação: `components/MapOptions.jsx` e `app/opcoes-mapa/page.jsx`.
- Contatos e rodapé: `components/SiteFooter.jsx`; refinamentos de cores e retratos: `app/refinements.css`.
- Estilos da comunidade: `app/community.css` e `app/vibrant.css`.
- Layout original: `app/globals.css`; nova direção vermelha e pontos de quebra: `app/vibrant.css`.
- Navegação: `components/Header.jsx`.
- Rota do avião: `components/FlightJourney.jsx`.
- Globo: `components/InteractiveGlobe.jsx`.
- Metadados e fontes: `app/layout.jsx`.

Os exemplos de conversa são demonstrativos. Os três depoimentos e as fotografias da comunidade foram fornecidos pelo cliente. Os emojis do relato familiar foram omitidos para preservar o padrão visual em SVG do site. Não foram acrescentadas notas, avaliações ou cursos não informados. O LinkedIn sem URL confirmada também não foi convertido em link.

A tipografia usa Instrument Serif nos títulos e Manrope nos textos e controles, via Google Fonts, com fontes de sistema como alternativa. As fotografias, as referências visuais e os logos foram fornecidos pelo cliente. A organização da página foi inspirada na clareza da referência Aliança América, sem copiar suas promessas, números, condições comerciais ou depoimentos.

## Alternativa de globo 3D

O componente `components/InteractiveGlobe.jsx` carrega `InteractiveGlobe3D.jsx`. Ele agora aparece apenas quando a opção “Globo em movimento” é escolhida em `/opcoes-mapa/`. O motor Three.js fica em um chunk separado, sem ser baixado pela página inicial.

- `components/globe/createGlobe.mjs`: esfera texturizada, iluminação, atmosfera, partículas, animação progressiva e controles. Libera materiais, geometrias, texturas e eventos ao desmontar.
- `components/globe/destinations.mjs`: cidades, países, coordenadas e expressões ilustrativas em inglês. Manaus é a origem das quatro rotas: Londres, Nova York, Toronto e Sydney.
- `components/globe/geometry.mjs`: projeção geográfica e arcos elevados sobre a superfície.
- `components/GlobeFallback.jsx`: visual 2D estático, com arraste manual, caso WebGL ou as texturas estejam indisponíveis.
- `app/globe.css`: estilos limitados ao globo e à entrada dos cartões existentes da Hero.

Clique ou toque em um marcador para explorar um destino. Arraste horizontalmente para girar; o gesto vertical de toque continua permitindo a rolagem da página. O controle de pausa interrompe as animações. Com o globo focado pelo teclado, as setas giram a esfera, Enter alterna entre os destinos e Escape fecha o cartão.

A preferência de movimento reduzido mostra rotas e marcadores completos, sem rotação automática. A renderização para quando a Hero sai de vista ou a aba fica oculta. Dispositivos menores usam menos polígonos e partículas, texturas de 1024 pixels, densidade de pixels limitada e não carregam o mapa de relevo. O desktop recebe uma aproximação muito sutil durante a rolagem; ela não fixa a página e fica desativada no perfil leve e com movimento reduzido.

As imagens geográficas são arquivos locais dos exemplos oficiais Three.js r187; fontes em `public/textures/README.md`. Não há serviços externos de mapas, tokens ou dependência de CDN em tempo de execução. A textura geográfica recebe a paleta azul da marca, mantendo os contornos reais.

Validação matemática das rotas e do movimento orbital:

```sh
node --test scripts/test-globe.mjs
```

A compilação e a revisão em navegador não substituem medições de Core Web Vitals em tráfego real, redes móveis e aparelhos físicos.
