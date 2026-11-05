# SPACE TRIALS — Atualização visual V5

Este pacote **modifica o jogo da edição anterior** e preserva campanhas, naves, inimigos, recompensas e salvamento.

## Mudanças realmente implementadas
- Substituição dos asteroides planos por malhas tridimensionais com dezenas de segmentos, deformações e material procedural de superfície (granulação, estratos, crateras estilizadas).
- Renderizador WebGL atualizado com diferentes tratamentos de material para rocha, cascos metálicos e planetas; iluminação direcional e brilhos especulares estilizados.
- 20 fundos de fase completamente regenerados em maior resolução (780 × 1200), cada um com nebulosas, estrelas, tons setoriais e planetas com detalhes.
- Mais painéis, tubos, asas, canhões, propulsores e cabines nas naves jogáveis; algumas variantes têm estruturas adicionais.
- Inimigos com acessórios adicionais por arquétipo e chefes com elementos orbitais e módulos específicos de silhueta.
- Destroços de estação mais trabalhados, novos planetas e luas no ambiente e disparos com rastros tridimensionais.
- Power-ups com diferentes símbolos geométricos em seus núcleos.
- HUD mais legível, fundos animados e bordas aprimoradas.
- Correção do índice negativo do nome de mini-chefe em fases iniciais.

## Verificações realizadas
- `node --check js/game.js` — aprovado.
- `node tests/smoke.js` — aprovado, incluindo armas, 20 chefes, 20 fases, mísseis, progressão e final de campanha.
- Todos os 20 JPGs foram gerados, e os arquivos e diretórios do jogo foram conservados.

## Limitações importantes
- Teste gráfico de navegador **não confirmado**: o ambiente de teste bloqueou navegação local em Chromium, mesmo via `localhost`.
- Os modelos 3D continuam sendo **procedurais estilizados**. Não há recursos GLB, texturas PBR comerciais, esqueleto de animação ou cinemáticas de nível de estúdio.
- Os 40 inimigos permanecem organizados em famílias de comportamento e geometria, e não são 40 modelos 3D artesanais separados.
- Esta atualização é um avanço visual e funcional **verificado por testes de lógica**, não um jogo comercial completamente finalizado.

## Executar
Extraia a pasta completa e abra `index.html` no Chrome/Edge com WebGL ativado. Se políticas de arquivos locais bloquearem carregamento, rode `python -m http.server 8000` na pasta e abra `http://localhost:8000`.
