# SPACE TRIALS V7.4 — CHEFES APRIMORADOS

Esta edição parte diretamente do ZIP SPACE_TRIALS_V7_3_EQUILIBRADO.zip.

## Mudanças exclusivas nos chefes principais
- Vida dos chefes aumentada (fórmula escalonada pela fase e dificuldade; final recebe multiplicador adicional).
- Três etapas de combate por porcentagem da vida: 100–68%, 68–34%, abaixo de 34%.
- Cinco padrões de ataque alternados: leque, mira direcionada, torres laterais, onda oscilante e leque dirigido.
- Inimigos auxiliares (minions) invocados periodicamente. Limite de 5 nas primeiras etapas e 7 na terceira.
- Cadência e movimentação dos chefes ficam mais agressivas na terceira etapa.
- Blindagem temporária nas etapas 2 e 3 com efeito visível, reduzindo o dano recebido em 45% durante parte do ciclo.
- HUD do chefe indica claramente a etapa atual.
- Limite de projéteis inimigos por chefe para preservar corredores de esquiva.

## Mantido sem alterações
- Frequência e quantidade das ondas normais da V7.3.
- Dificuldade dos inimigos comuns, controles, armas do jogador, naves, níveis, cenários, menus e salvamento.

## Testes
- `node tests/smoke.js` valida combate básico, progressão, 3 etapas de chefe, invocação de minions, ataques e conclusão da missão.
- Teste de renderização interativa no navegador não confirmado neste ambiente.

Extraia a pasta e abra `SPACE_TRIALS_FINAL/index.html` no navegador.
