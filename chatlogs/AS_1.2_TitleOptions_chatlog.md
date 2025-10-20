# Histórico - AS_1.2_TitleOptions

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Correção - Fallback seguro e carregamento resiliente de assets
**Detalhes:**
- Adicionado plano de contingência que restaura a janela padrão caso a UI HTML falhe, evitando fechamento do jogo.
- Aprimorado o loader de assets para localizar CSS/HTML mesmo quando `process.mainModule` não está disponível no NW.js moderno.
- Mantidos logs detalhados no fluxo de inicialização para facilitar diagnósticos futuros.
- Fallback garante que o botão cancelar e a Window_Options voltem a ficar visíveis em erro crítico.
**Versão:** v1.1.4 (anterior: v1.1.3)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.1.3 - Fix 1.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Correção - Crash ao abrir tela de opções (tratamento de erros robusto)
**Detalhes:** Implementado sistema completo de tratamento de erros para prevenir crash:
- Try-catch envolvendo Scene_Options.prototype.start para capturar erros de inicialização
- Validação de rootElement em injectMarkup() antes de tentar appendChild
- Erro logado com stack trace completo para debug
- Warning logs adicionados em updateUIFromConfig quando rootElement não existe
- Sistema de log detalhado mostra exatamente onde falha ocorre
- Prevents game crash, throws error com informação completa para correção
**Versão:** v1.1.3 (anterior: v1.1.2)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.1.2.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Correção - Crash ao abrir tela de opções
**Detalhes:** Corrigido erro que causava o fechamento do jogo ao clicar em "Opções":
- Problema: updateUIFromConfig() chamada antes de rootElement existir
- Solução: Validação adicionada no início da função
- Verificação `if (!rootElement) return;` antes de tentar atualizar UI
- Warning log adicionado para debug
- Agora aguarda injeção completa do HTML antes de atualizar valores
**Versão:** v1.1.2 (anterior: v1.1.1)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.1.1.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js, assets/contents/html/AS_1.2_TitleOptions.html
**Ação:** Feature - Novas opções de animação e música
**Detalhes:** Adicionadas novas configurações na aba Visual para controlar animações e música:

**NOVAS OPÇÕES ADICIONADAS:**
1. **Animação do Logo (Tela Título)** - Toggle
   - Ativa/desativa flutuação do logo na tela de título
   - Salvo em ConfigManager.enableLogoAnimation

2. **Velocidade da Animação** - Slider (1-10s)
   - Controla velocidade da flutuação (menor = mais rápido)
   - Formato: X.Xs (ex: 4.0s)
   - Salvo em ConfigManager.animationSpeed

3. **Transição Musical (Fade)** - Toggle
   - Ativa/desativa fade out suave ao sair da tela de título
   - Salvo em ConfigManager.enableMusicFade

4. **Duração do Fade Musical** - Slider (100-5000ms)
   - Controla tempo do fade (100ms a 5s)
   - Formato: Xms (ex: 1000ms)
   - Salvo em ConfigManager.musicFadeDuration

**MELHORIAS TÉCNICAS:**
- bindSlider() atualizado com parâmetro suffix para 's' e 'ms'
- loadConfigValues() carrega valores do ConfigManager
- saveConfigValues() persiste novas configurações
- updateUIFromConfig() formata valores corretamente (%, s, ms)
- Todas as opções salvas no ConfigManager.save()

**Versão:** v1.1.1 (anterior: v1.1.0)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.1.0.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js, assets/contents/css/AS_1.2_TitleOptions.css, assets/contents/html/AS_1.2_TitleOptions.html
**Ação:** Reescrita Completa - Interface HTML Moderna Medieval Fantasia
**Detalhes:** Reescrita total do plugin conforme solicitação do usuário:
- Removido todo o código antigo baseado em Window_Options e sprites Canvas
- Criada interface HTML/CSS completamente nova e moderna
- Sistema de abas (Áudio, Jogabilidade, Visual) com transições suaves
- Sliders personalizados com estilo ember/fogo para controle de volume
- Toggles animados estilo medieval para opções booleanas
- Selects customizados com dropdown estilizado
- Design com gradientes púrpura escuro, bordas douradas e efeitos de brilho ember
- Animações modernas: entrada do modal, transições de abas, hover nos botões
- Backdrop com blur e gradiente radial escuro
- Botões "Aplicar" e "Cancelar" com efeitos de ripple
- Sistema completo de salvamento e carregamento de configurações via ConfigManager
- Navegação por teclado (Enter, Escape)
- Responsivo para mobile
- Integração total com AudioManager e Graphics do RPG Maker MZ
**Versão:** v1.1.0 (anterior: v1.0.9)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.9.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.2_TitleOptions.js
**Ação:** Redesign - Painel luminoso compacto
**Detalhes:** Simplificado o layout da Scene_Options com moldura retangular
compacta, cabeçalho redesenhado e painel com animações de brilho/ruído. Nova
paleta translúcida integra melhor com a tela de título e otimizações garantem
limpeza correta dos sprites decorativos via `_asDecorReady`. Versão incrementada
após validação visual.
**Versão:** v1.0.8 (anterior: v1.0.7)
**Backup criado:** backups/AS_1.2_TitleOptions/AS_1.2_TitleOptions - v1.0.7.js
---

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
