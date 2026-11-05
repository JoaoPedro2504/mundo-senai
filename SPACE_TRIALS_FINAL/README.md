# SPACE TRIALS — GALACTIC REBIRTH · V5 VISUAL UPGRADE

Atualização V5 com modelos e cenários melhorados. Jogo arcade espacial tridimensional construído a partir da versão V3 do projeto. Esta edição pode ser executada **offline**, sem dependências de internet ou instalações, em navegadores com WebGL habilitado.

## Executar
1. Extraia o ZIP completo para uma pasta.
2. Abra `index.html` no Chrome, Edge ou Firefox, com WebGL/aceleração gráfica ativada.
3. Clique em **DECOLAR MISSÃO**.
4. Caso a página fique em branco ou WebGL seja bloqueado, experimente outro navegador, ative a aceleração de hardware ou use um servidor local (`python -m http.server 8000`) e entre em `http://localhost:8000`.

## Controles
- **WASD / setas:** movimentação nas 4 direções e diagonais; a nave continua apontando para frente.
- **Espaço:** disparar continuamente.
- **Q:** alternar entre oito tipos de armas.
- **E:** disparar mísseis secundários teleguiados (gasta energia especial).
- **Shift:** habilidade especial da nave atual, com tempo de recarga.
- **Esc:** pausar ou continuar.
- **Celular:** arraste sobre a tela para movimentação; use os botões de disparo, armas, mísseis, especial e pausa.

## Conteúdo e progressão
- 20 fases com nomes, fundos próprios, variações de ambientes e chefe ao final.
- 20 chefes nomeados com padrões de ataque progressivos e módulos visuais diferentes.
- 15 mini-chefes nomeados, distribuídos em missões de meio de campanha em diante.
- 40 tipos de inimigos com variações de atributos e padrões; várias famílias compartilham partes 3D procedurais.
- 12 naves disponíveis, cada qual com atributos, custo e comportamento especial.
- 30 tipos de power-ups coletáveis.
- 8 modos de armamento com comportamento distinto e míssil secundário.
- 7 trilhas ambientes originais e geradas localmente, uma por setor; volumes independentes para música e efeitos.
- Oficina de melhorias, hangar, seleção de fases, conquistas, configurações, telas de vitória/derrota e resultado de missão.
- XP, nível, sucata, progressão e desbloqueios com persistência no `localStorage` (continuidade dos dados compatíveis com o formato da V3).

## Organização
- `index.html` — interface
- `css/style.css` — interface e estilos adaptáveis
- `js/game.js` — renderizador WebGL, física arcade, inimigos, chefes e lógica
- `assets/backgrounds/` — 20 cenários panorâmicos procedurais, um por missão
- `assets/audio/` — sete músicas originais OGG
- `assets/ships/` — recursos SVG de referência e prévias do hangar
- `assets/enemies/`, `assets/powerups/` — recursos SVG organizados para edição futura
- `tests/smoke.js` — testes de lógica executáveis com Node.js

## Verificação
Executado `node --check js/game.js` e `node tests/smoke.js`, com aprovação dos testes de cadastros, transição de fases, chefes, disparos, armas, mísseis e finalização da campanha. Também foi verificada a existência dos arquivos de mídia.

**Limitação do teste:** a execução gráfica completa em navegador não pôde ser validada automaticamente neste ambiente, porque o navegador local bloqueou a navegação. Recomenda-se abrir `index.html` e verificar o desempenho/compatibilidade visual no dispositivo.

## Escopo visual real
O jogo renderiza modelos tridimensionais com WebGL e iluminação por faces, usa 20 fundos próprios e arquivos vetoriais no hangar. **Os modelos 3D são procedurais estilizados**, não modelos de alta complexidade com texturas PBR/GLB. Os 20 chefes possuem nomes e variações estruturais/padrões, mas compartilham famílias de geometria. Não há campanha narrativa dublada, cinemáticas pré-renderizadas ou ativos gráficos com acabamento AAA. O jogo é uma edição arcade expandida, não um produto comercial inteiramente polido.


Consulte `ATUALIZACAO_VISUAL_V5.md` para descrição honesta das mudanças e limitações de teste.
