# SPACE TRIALS V7.3 — COMBATE EQUILIBRADO

A V7.2 mostrava inimigos e tiros demais nas primeiras fases. Esta atualização modifica a lógica do combate, não apenas os números exibidos no HUD.

- Fase 1: primeiro grupo com 2 inimigos, outros chegam em aproximadamente 2 segundos.
- Limite progressivo: 6–8 inimigos comuns simultâneos nas primeiras fases, com crescimento por fase e por tempo.
- Ondas alternam esquerda e direita para manter caminhos livres para esquiva.
- Disparos inimigos passam por um orçamento compartilhado que limita projéteis na tela e tiros por segundo, especialmente no começo.
- Inimigos da fase 1 disparam após um atraso variável, evitando rajadas simultâneas na entrada.
- Jogador recebe 1,5 segundo de invulnerabilidade após um impacto.
- HP, velocidade e dano inimigos ajustados para uma progressão mais suave.
- O jogo mantém os cenários e visuais da V7.2.

## Testes
Executado: node --check js/game.js e node tests/smoke.js. Os testes automatizados passaram, inclusive início da fase 1, limites de ondas, combate e progressão. A renderização visual no navegador não foi certificada nesta execução.
