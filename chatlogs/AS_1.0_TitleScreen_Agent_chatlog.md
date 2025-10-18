# Chatlog - AS_1.0_TitleScreen_Agent

## Informações do Agente
- **Nome:** AS_1.0_TitleScreen_Agent
- **Versão Atual:** 1.1.1 ← ATUALIZADO!
- **Autor:** Necromante96Official & GitHub Copilot
- **Descrição:** Gerenciador da Tela de Título - Ancient Souls

---

## Histórico de Alterações

### Entrada #7 - v1.1.1 (ATUAL)
- **Data:** 2025-10-18
- **Autor:** Necromante96Official & GitHub Copilot
- **Arquivo(s) afetado(s):**
  - `js/plugins/AS_1.0_TitleScreen_Agent.js` (atualizado para v1.1.1)
- **Ação:** Implementação de parâmetros de ajuste da logo
- **Detalhes:**
  - **Parâmetros adicionados**:
    - `LogoScale` (0.05 a 2.00, padrão: 0.25) - Controla escala da logo
    - `LogoPositionX` (0 a 100%, padrão: 50) - Posição horizontal
    - `LogoPositionY` (0 a 100%, padrão: 30) - Posição vertical
  - **Sistema de posicionamento parametrizado**: Logo agora usa valores dos parâmetros
  - **Cálculo dinâmico**: Conversão de porcentagem para pixels com centralização automática
  - **Logs aprimorados**: Exibe escala e posições nos logs de debug
  - **Versões atualizadas**: @version, @plugindesc, @help e registro do agente
  - **Backup criado**: `AS_1.0_TitleScreen_Agent - v1.1.0.js`
  - **Flexibilidade total**: Usuário pode ajustar posição e tamanho via Plugin Manager sem editar código

### Entrada #6 - v1.0.9
- **Data:** 2025-10-18
- **Autor:** Necromante96Official & GitHub Copilot
- **Arquivo(s) afetado(s):**
  - `js/plugins/AS_1.0_TitleScreen_Agent.js` (atualizado para v1.0.9)
- **Ação:** Integração com sistema de Patch Notes e ajustes finais de logo
- **Detalhes:**
  - **Integração com AS_1.4_PatchNotesScreen**: Handler `openPatchNotes()` adicionado
  - **Logo centralizada perfeitamente**: Posicionamento em 50% vertical (centro exato do círculo)
  - **Navegação estendida**: Menu agora suporta opção 'updates'
  - **Cleanup aprimorado**: `cleanupHTMLElements()` chamado antes de abrir Patch Notes
  - **Validação de Scene**: Verificação se `Scene_PatchNotes` existe antes de navegar
  - **Backup criado**: `AS_1.0_TitleScreen_Agent - v1.0.9.js`

### Entrada #5 - v1.0.8
- **Data:** 2025-10-18
- **Autor:** Necromante96Official & GitHub Copilot
- **Arquivo(s) afetado(s):**
  - `js/plugins/AS_1.0_TitleScreen_Agent.js` (atualizado para v1.0.8)
- **Ação:** Ajuste de posicionamento da logo
- **Detalhes:**
  - Logo ajustada para 35% da altura (mais próxima do círculo da explosão)
  - Comentários atualizados para refletir alinhamento com explosão
  - Logs aprimorados com mensagem específica sobre posicionamento

### Entrada #4 - v1.0.7 (FINAL)
- **Data:** 2025-10-18
- **Autor:** Necromante96Official & GitHub Copilot
- **Arquivo(s) afetado(s):** 
  - `js/plugins/AS_1.0_TitleScreen_Agent.js` (atualizado para v1.0.7)
- **Ação:** Correções finais e otimizações
- **Detalhes:**
  - **Logo otimizado**: Reduzido para 25% do tamanho original (era 35%)
  - **Sistema de música corrigido**: 
    - Parâmetro `DisableTitleMusic` @default alterado de `true` para `false`
    - Música agora toca automaticamente por padrão
  - **Sistema de debug implementado**:
    ```javascript
    console.log('[AS TitleScreen] 🎵 Parâmetros carregados:');
    console.log(`  - DisableTitleMusic (raw): "${parameters.DisableTitleMusic}"`);
    console.log(`  - disableMusic (parsed): ${AS.TitleScreen.disableMusic}`);
    console.log(`  - Música vai tocar? ${!AS.TitleScreen.disableMusic ? 'SIM ✓' : 'NÃO ✗'}`);
    ```
  - **Versões sincronizadas**: Atualizadas em @plugindesc, @help e registro
  - **Backup criado**: `AS_1.0_TitleScreen_Agent - v1.0.7 (FINAL).js`

### Entrada #3 - v1.0.6
- **Data:** 2025-10-18
- **Autor:** Necromante96Official & GitHub Copilot
- **Arquivo(s) afetado(s):** 
  - `js/plugins/AS_1.0_TitleScreen_Agent.js` (atualizado para v1.0.6)
- **Ação:** Redução de logo e melhorias nos logs
- **Detalhes:**
  - Logo reduzido de 60% para 45% do tamanho original
  - Sistema de logs aprimorado com método `Scene_Title.log()` helper
  - Adicionado tratamento de erro para carregamento do logo
  - Logs com emojis para melhor visualização (✓, ⚠️)

### Entrada #2 - v1.0.5
- **Data:** 2025-10-18
- **Autor:** Necromante96Official & GitHub Copilot
- **Arquivo(s) afetado(s):** 
  - `js/plugins/AS_1.0_TitleScreen_Agent.js` (atualizado para v1.0.5)
- **Ação:** Ajustes visuais e correções
- **Detalhes:**
  - Logo reduzido para 60% do tamanho original
  - Background.png com suporte implementado
  - Opção para desabilitar música do título
  - Correção no sistema de backup
  - Menu horizontal de 4 botões implementado

### Entrada #1 - v1.0.0
- **Data:** 2025-10-18
- **Autor:** Necromante96Official & GitHub Copilot
- **Arquivo(s) afetado(s):** 
  - `js/plugins/AS_1.0_TitleScreen_Agent.js` (criado)
- **Ação:** Criação inicial do agente TitleScreen Manager
- **Detalhes:** 
  - Implementação do gerenciador principal da tela de título
  - Substituição customizada da Scene_Title padrão do RPG Maker MZ
  - Sistema de camadas para organização de elementos visuais (background, middleground, foreground, ui, effects)
  - Gerenciamento de estado da tela (idle, transitioning, active)
  - Sistema de eventos para comunicação com sub-agentes (UI e Effects)
  - Coordenação de sub-agentes AS_1.1 e AS_1.2
  - Handlers para seleção de menu (novo jogo, continuar, opções)
  - Sistema de transições com animações
  - Criação de container HTML para elementos customizados
  - Background customizado com suporte a imagens Title1 e Title2
  - Efeito parallax simples no background
  - Dependências: AS_0.0_PluginManager_Agent
  - Versão inicial: 1.0.0

---

## Metadados
- **Status:** ✅ Produção - Estável
- **Última Atualização:** 2025-10-18 (v1.1.1)
- **Problemas Conhecidos:** Nenhum
- **Próximas Atualizações Planejadas:** 
  - Sistema de múltiplas telas de título temáticas
  - Integração com sistema de conquistas
  - Animações de transição mais elaboradas

---

## Configurações Atuais (v1.1.1)
- **Logo Scale:** 25% (0.25) - AJUSTÁVEL via parâmetro
- **Logo Position X:** 50% da largura (centro horizontal) - AJUSTÁVEL via parâmetro
- **Logo Position Y:** 30% da altura (círculo da explosão) - AJUSTÁVEL via parâmetro
- **DisableTitleMusic:** false (música ATIVADA por padrão)
- **Background:** background.png com escala responsiva
- **Custom Background Path:** js/plugins/assets/resources/background.png
- **Menu Options:** newGame, continue, options, updates, exit

---

## Notas de Desenvolvimento
- Este é um agente de nível 1.0 - plugin principal
- Coordena os sub-agentes AS_1.1 (UI) e AS_1.2 (Effects)
- Sobrescreve Scene_Title mantendo compatibilidade com sistema padrão
- Sistema de debug robusto para rastreamento de parâmetros
- Alterações de versão requerem autorização explícita de Necromante96Official
