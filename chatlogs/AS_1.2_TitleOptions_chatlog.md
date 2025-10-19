# Histórico - AS_1.2_TitleOptions

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Ajuste - Legibilidade do painel
**Detalhes:** Reequilibrados gradientes, opacidades e tons tipográficos para
aumentar contraste, evitando que opções pareçam "apagadas" ao usuário.
**Versão:** v1.0.7 (anterior: v1.0.6)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.6.js
---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Redesign - Painel harmonizado
**Detalhes:** Reestruturado o layout da Scene_Options com painel central alinhado
à estética da tela de título, adicionando moldura dupla, cabeçalho informativo,
reposicionamento do botão de retorno e redefinição das linhas da Window_Options
com tipografia ampliada, faixa lateral dourada e destaque translúcido
reposicionado. Limpeza e métricas personalizadas garantem que o painel seja
recriado e destruído sem vazamentos. Versão incrementada após validação visual.
**Versão:** v1.0.5 (anterior: v1.0.4)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.4.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Correção - Blend mode inválido
**Detalhes:** Substituído o uso de `Graphics.BLEND_ADD` por `PIXI.BLEND_MODES.ADD`
com fallback seguro para preservar o destaque translúcido sem provocar a
exceção do `StateSystem.setBlendMode`. Destaque permanece incorporado ao
`_clientArea` e agora passa a usar valor de blend válido no renderer PIXI.
Versão incrementada após validação visual.
**Versão:** v1.0.4 (anterior: v1.0.3)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.3.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Correção - Destaque sem container
**Detalhes:** Realocado o sprite de destaque para o `_clientArea`, garantindo
compatibilidade com a hierarquia interna do Window_Options e evitando o
TypeError causado pela referência inexistente a `_windowContentsSprite`.
Bitmap agora redimensiona com `resize` mantendo o preenchimento translúcido.
Versão incrementada após validar o fluxo.
**Versão:** v1.0.3 (anterior: v1.0.2)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.2.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Correção - Cursor de seleção
**Detalhes:** Ajustado o destaque personalizado para usar `innerWidth` como
propriedade, prevenindo o TypeError ocorrido durante `_updateCursor` e
garantindo largura dinâmica baseada no item selecionado. Versão incrementada
após o patch.
**Versão:** v1.0.2 (anterior: v1.0.1)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.1.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Correção - Compatibilidade com Bitmap
**Detalhes:** Troca de `_setDirty()` por `baseTexture.update()` após a
renderização do degradê para alinhar com a API do MZ e impedir o erro em
Scene_Options. Incremento de versão aplicado.
**Versão:** v1.0.1 (anterior: v1.0.0)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.0.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Criação - Estilização de opções
**Detalhes:** Hooks adicionados para aplicar fundo em degradê, destaque de
seleção translúcido, fonte Pixel Times e ajustes de tipografia da Window_Options
mantendo a estética medieval da tela de título.
**Versão:** v1.0.0 (anterior: --)
**Backup criado:** Nenhum (primeira versão)
