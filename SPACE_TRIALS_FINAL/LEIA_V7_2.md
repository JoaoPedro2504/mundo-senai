# SPACE TRIALS V7.2 — COMBATE INTENSO

Esta versão foi feita diretamente sobre a V6 e é identificada no menu por um selo **VERSÃO V7.2 • COMBATE INTENSO** e durante a partida por **V7.2**.

## Correções na jogabilidade
- Primeiro grupo de inimigos começa a nascer depois de apenas 0,18 s, próximo à área visível (Y 7,65–8,45).
- Mais inimigos por onda (mínimo de quatro nos primeiros minutos), com grupos em V, flancos alternados e linhas.
- Limites maiores de inimigos simultâneos, com novas ondas aproximadamente a cada 0,55–1,2 s conforme a intensidade.
- Resistência dos inimigos aumentada; os inimigos atacam mais cedo e com frequência maior.
- Progressão da dificuldade por fase e tempo da missão.
- Invulnerabilidade após impacto reduzida a 1 segundo.
- Chance de coletáveis ajustada para evitar excesso de poderes.

## Gráficos
- Materiais metálicos procedurais foram aplicados a mais peças (cones, cilindros e anéis), não apenas caixas.
- O shader inclui granulação, riscos e microdetalhes, mantendo a base WebGL offline.
- Obstáculos têm mais camadas e peças do que os blocos simples antigos.

## Verificações técnicas
- `node --check js/game.js` passou.
- `node tests/smoke.js` passou.
- Teste de geração: 4 inimigos nos primeiros 0,4 segundo; 20 gerados nos primeiros ~9,4 segundos em simulação, divididos em 10 ondas.
- Não foi possível inspecionar uma partida real via Chromium headless (EGL/WebGL indisponível no ambiente de teste).

## Como abrir
Extraia tudo e abra `index.html` em Chrome/Edge. Confira o selo **V7.2**. Se ainda aparecer V6/V5, provavelmente você está abrindo uma pasta ou aba antiga. O progresso salvo continua no mesmo navegador.
