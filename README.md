# Fluente por Aí · Um mundo de possibilidades

Redesign da landing page original em Next.js 14, React 18 e Framer Motion. A identidade da marca, os quatro programas e os canais de contato foram preservados.

## Executar

Requisitos: Node.js 20 ou superior e npm.

```sh
npm ci
npm run dev
```

Para gerar e conferir a versão de produção:

```sh
npm run build
npm start
```

Abra http://localhost:3000. Se a porta estiver ocupada, use `npm run dev -- --port 3001`. O servidor estático de produção aceita a variável `PORT`.

## Entrega e hospedagem

`npm run build` gera a pasta `out/`, pronta para hospedagem estática. Publique o conteúdo completo dessa pasta, incluindo `_next/`, `brand/` e `photos/`. O arquivo ZIP estático incluído na entrega já contém essa versão compilada.

## Direção visual e interações

- Abertura editorial com globo interativo, coordenadas e cartões flutuantes.
- Avião ligado à rolagem: a rota é recalculada com as posições reais das seções e cruza a página nos intervalos entre elas. A animação e a trilha aparecem apenas no desktop; ficam ocultas em telas pequenas e em dispositivos com toque como interação principal, inclusive em paisagem.
- Quatro cursos com composições próprias: conversa animada, apresentação profissional, cartão de embarque e conexões de uma equipe.
- Metodologia com quatro painéis acessíveis. Cada escolha atualiza a conversa ilustrativa.
- Diferenciais em cards com tipografia Manrope padronizada e contato como cartão de embarque.
- Seção de depoimentos com três espaços identificados como Em breve, pronta para receber relatos autorizados.
- Menu móvel com fechamento por Escape, seleção de link e clique fora do cabeçalho.
- Preferência de movimento reduzido respeitada no globo, voo, entradas e animações CSS.
- Símbolos decorativos, setas e estrelas em SVG, sem substituição por emojis no iPhone ou em outros sistemas.

## Editar

- Conteúdo, programas, exemplos e contato: `app/page.jsx`.
- Diferenciais e depoimentos: `components/CommunitySections.jsx` (preencha a lista `testimonials` com nome, programa e relato autorizado).
- Estilos dos diferenciais e depoimentos: `app/community.css`.
- Layout, animações e pontos de quebra: `app/globals.css`.
- Navegação: `components/Header.jsx`.
- Rota do avião: `components/FlightJourney.jsx`.
- Globo: `components/InteractiveGlobe.jsx`.
- Metadados e fontes: `app/layout.jsx`.

Os exemplos de conversa são demonstrativos. A seção de depoimentos mostra espaços reservados enquanto a lista de relatos estiver vazia: não há avaliações ou métricas inventadas. O LinkedIn sem URL confirmada também não foi convertido em link.

A tipografia usa Instrument Serif e Urbanist na identidade do site, e Manrope nos cards de diferenciais e depoimentos, via Google Fonts; existem fontes de sistema como alternativa. As imagens e os logos são os arquivos fornecidos no projeto original.
