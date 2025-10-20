# Histórico - AS_1.1_TitleScreenUI

## [NOVA ALTERAÇÃO - Data: Atual - v1.2.4]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- AS_1.1_TitleScreenUI.js
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** REMOÇÃO COMPLETA - Todas as animações dos botões removidas

**ANIMAÇÕES REMOVIDAS:**
- ❌ as-button-rise-in (entrada dos botões)
- ❌ as-button-breathe (respiração em idle)
- ❌ as-button-energy-wave (onda de energia no hover)
- ❌ as-button-text-glow (glow de texto no hover)
- ❌ as-button-impact (impacto ao clicar)
- ❌ as-button-vanish (desaparecimento ao clicar)

**CLASSES DINÂMICAS REMOVIDAS:**
- ❌ `.as-title__button--hovering`
- ❌ `.as-title__button--clicking`
- ❌ `.as-title__button--vanishing`

**COMPORTAMENTO FINAL:**
- Botões sem animações
- Hover apenas com som de cursor (nenhuma animação visual)
- Click executa comando imediatamente com som de OK
- Interface limpa e responsiva

**Versão:** v1.2.4 (anterior: v1.2.3)
**Backup criado:** 
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.2.3.js
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI.css - v1.2.3

---

## [NOVA ALTERAÇÃO - Data: Anterior - v1.2.3]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- AS_1.1_TitleScreenUI.js
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** REDESIGN COMPLETO - Sistema de Animações Criativas

**TODAS AS ANIMAÇÕES ANTIGAS REMOVIDAS:**
- ❌ as-button-entrance
- ❌ as-button-glow-idle
- ❌ as-button-disappear
- ❌ as-glow-text
- ❌ as-logo-float

**NOVO SISTEMA DE ANIMAÇÕES (6 Keyframes Profissionais):**

### 1️⃣ **as-button-rise-in** (ENTRADA - 700ms)
- **Efeito:** Botões ascendem suavemente com blur inicial
- **Timeline:**
  - 0%: opacity 0, translateY(+30px), scale(0.9), blur(4px)
  - 60%: opacity 1, translateY(-3px), scale(1.02) ← overshoot suave
  - 100%: opacity 1, translateY(0), scale(1), blur(0)
- **Easing:** cubic-bezier(0.34, 1.56, 0.64, 1) - bounce suave
- **Delay Cascata:** Cada botão tem delay +100ms (0ms, 100ms, 200ms, 300ms)

### 2️⃣ **as-button-breathe** (IDLE - 3000ms infinito)
- **Efeito:** Respiração sutil do brilho quando parado
- **Timeline:**
  - 0%: drop-shadow 12px (fraco)
  - 50%: drop-shadow 20px (médio)
  - 100%: drop-shadow 12px (fraco)
- **Inicia:** 800ms após entrada (quando botão já está em repouso)
- **Feeling:** Vivo, mas não invasivo

### 3️⃣ **as-button-energy-wave** (HOVER - 1200ms infinito)
- **Efeito:** Onda de energia expandindo quando mouse passa
- **Timeline:**
  - 0%: box-shadow 0-0 (nada)
  - 50%: box-shadow 0-15px com alpha 0.3
  - 100%: box-shadow 0-25px com alpha 0 (desaparece)
- **Resultado:** Parece que o botão irradia uma onda mágica
- **Ativado via:** classe `.as-title__button--hovering` + `::after` pseudo-elemento

### 4️⃣ **as-button-text-glow** (HOVER TEXT - 800ms infinito)
- **Efeito:** Texto fica mais brilhante e intenso
- **Timeline:**
  - 0%: text-shadow suave (glow 12px, alpha 0.5)
  - 50%: text-shadow intenso (glow 25px + 40px, alpha 1)
  - 100%: text-shadow suave (volta ao normal)
- **Sincronizado:** Roda junto com energy-wave

### 5️⃣ **as-button-impact** (CLICK IMPACTO - 400ms)
- **Efeito:** Compressão e salto quando clica
- **Timeline:**
  - 0%: scale(1) - normal
  - 20%: scale(0.95) translateY(-2px) - comprime e sobe
  - 40%: scale(1.05) translateY(0) - volta expandido
  - 60%: scale(1) - estabiliza
  - 100%: scale(1) - repouso
- **Feeling:** Impacto satisfatório, tipo um botão físico sendo pressionado

### 6️⃣ **as-button-vanish** (DESAPARECIMENTO - 700ms)
- **Efeito:** Desaparecimento com distorção mágica
- **Timeline:**
  - 0%: opacity 1, scale(1), rotate(0deg), glow forte
  - 50%: opacity 0.6, scale(1.1), rotate(1deg), glow máximo
  - 100%: opacity 0, scale(0.6), rotate(-2deg), glow zero
- **Resultado:** Botão se dissolve com efeito mágico

**FLUXO COMPLETO DO CLICK:**
1. 0ms: Click disparado → adiciona classe `--clicking`
2. 0-400ms: Animação `as-button-impact` (shake + bounce)
3. 400ms: Remove `--clicking`, adiciona `--vanishing`
4. 400-1100ms: Animação `as-button-vanish` (dissolução)
5. 1100ms: Publica comando de ação

**HOVER ATIVADO VIA JS:**
```javascript
onmouseenter: classList.add('as-title__button--hovering')
onmouseleave: classList.remove('as-title__button--hovering')
```

**RESULTADO VISUAL:**
- ✅ Entrada elegante com bounce suave
- ✅ Respiração contínua e hipnotizante (idle state)
- ✅ Hover com onda de energia + glow de texto
- ✅ Click com impacto satisfatório + desaparecimento mágico
- ✅ Sem conflitos, 100% fluido

**Versão:** v1.2.3 (anterior: v1.2.2)
**Backup criado:** 
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.2.3.js
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI.css - v1.2.3

---

## [ALTERAÇÃO ANTERIOR - v1.2.2]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- AS_1.1_TitleScreenUI.js
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** Fix Crítico - Reescrever sistema de eventos do hover/click usando JavaScript

**PROBLEMA IDENTIFICADO:**
- ❌ Pseudoclasse `:hover` do CSS não estava funcionando (nada muda ao passar mouse)
- ❌ Animação `:active` era muito brutal - desaparecia rápido demais
- ❌ Ao soltar mouse, botão não voltava ao estado normal

**SOLUÇÃO IMPLEMENTADA:**

### 1. **Substituição do Sistema `:hover` por Classes CSS Dinâmicas**
   - Criada nova classe `.as-title__button--hovering`
   - JavaScript adiciona a classe `onmouseenter`
   - JavaScript remove a classe `onmouseleave`
   - Resultado: Hover funciona 100% de forma previsível

### 2. **Melhoria do Sistema de Click**
   - Criada classe `.as-title__button--disappearing`
   - Animação aumentada: 400ms → **600ms** (mais suave)
   - Transição: `cubic-bezier(0.4, 0, 0.2, 1)` (easing suave)
   - Duração: 600ms com fade suave + scale reduzido

### 3. **Mudanças no Código:**

**CSS (AS_1.1_TitleScreenUI.css):**
```css
/* Antes (não funcionava): */
.as-title__button:hover { ... }
.as-title__button:active { animation: as-button-disappear 400ms... }

/* Depois (funcional): */
.as-title__button--hovering { transform: scale(1.15); ... }
.as-title__button--disappearing { animation: as-button-disappear 600ms... }
```

**JavaScript (AS_1.1_TitleScreenUI.js):**
```javascript
// Novo event listener
button.addEventListener('mouseleave', onButtonUnhover);

// Nova função
function onButtonUnhover() {
    this.classList.remove('as-title__button--hovering');
}

// Melhorado onButtonClick
function onButtonClick(event) {
    button.classList.add('as-title__button--disappearing');
    setTimeout(() => {
        contextRef.publish('titlescreen:ui:command', { command });
    }, 600); // Aguarda animação completa
}
```

**RESULTADO:**
- ✅ Hover agora funciona perfeitamente - botão aumenta suavemente ao passar mouse
- ✅ Click tem desaparecimento suave e gradual (600ms)
- ✅ Botão não fica travado ao clicar
- ✅ Animação glow-idle continua funcionando normalmente
- ✅ Sem conflitos entre eventos CSS e JS

**Versão:** v1.2.2 (anterior: v1.2.1)
**Backup criado:** 
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.2.2.js
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI.css - v1.2.2

---

## [ALTERAÇÃO ANTERIOR - v1.2.1]
**Autor:** Zencoder

**Ação:** Fix - Corrigir animação de hover dos botões
**Detalhes:** Tentativa anterior de correção usando `animation: none !important;` no `:hover`

**Versão:** v1.2.1 (anterior: v1.2.0)

---

## [NOVA ALTERAÇÃO - Data: Anterior]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- AS_1.1_TitleScreenUI.js
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** Reescrita Completa - Redesign das animações dos botões da tela de título
**Detalhes:** Reescritas todas as animações dos botões para melhor feedback visual e experiência do usuário:

**NOVAS ANIMAÇÕES:**

1. **as-button-glow-idle** (2500ms - suave e contínuo)
   - Ativada permanentemente quando o botão está em repouso
   - Animação: brilho suave pulsante ao redor do botão
   - **0%:** `filter: glow fraco (0 0 20px)`
   - **50%:** `filter: glow intenso (0 0 40px)` - pico do brilho
   - **100%:** retorna a `filter: glow fraco (0 0 20px)`
   - Inicia 600ms após o carregamento (após animação de entrada)

2. **as-button-disappear** (400ms - fade-out suave)
   - Ativada quando o botão é clicado (estado :active)
   - Animação: botão desaparece aos poucos com escala reduzida
   - **0%:** `opacity: 1, scale(1)` - botão visível e no tamanho normal
   - **100%:** `opacity: 0, scale(0.8)` - botão desaparece e reduz
   - Transição suave usando `cubic-bezier(0.4, 0, 0.2, 1)`

**ALTERAÇÕES NAS REGRAS CSS:**

- `.as-title__button` 
  - Adicionada múltipla animação: `as-button-entrance` + `as-button-glow-idle`
  - Mudada `transition: all 250ms` para `transition: transform 300ms, filter 300ms`

- `.as-title__button:hover`
  - Simplificado para apenas `transform: scale(1.15)` (sem animação keyframe)
  - Brilho aumentado dinamicamente via `filter: brightness(1.25)`
  - Transição suave em 300ms

- `.as-title__button:active`
  - Simplificado para apenas `animation: as-button-disappear 400ms`
  - Botão sumindo aos poucos com fade-out

**COMPORTAMENTO FINAL:**
- **Parado (idle):** Brilho suave contínuo e ritmado ao redor do botão (2.5s)
- **Ao passar mouse:** Aumenta para 115% com transição de 300ms + brilho mais forte
- **Ao tirar mouse:** Volta para tamanho original com transição suave de 300ms
- **Ao clicar:** Desaparece aos poucos em 400ms (fade-out + scale 0.8)
- **Fade-out geral:** Todos os elementos desaparecem sincronizados em 800ms

**Versão:** v1.2.0 (anterior: v1.1.9)
**Backup criado:** 
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.9.js
- backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.9.css

---

## [NOVA ALTERAÇÃO - Data: Anterior]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- AS_1.1_TitleScreenUI.js
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** Ajuste - Remover animações flutuantes e sincronizar fade-out de transição
**Detalhes:** Removidas as animações contínuas flutuantes dos botões e sincronizadas todas as transições de desaparecimento:

**ALTERAÇÕES NOS BOTÕES:**
- ✅ Removida animação `as-button-pulse` (glow respiratório)
- ✅ Removida animação `as-button-float` (flutuação contínua)
- ✅ Mantida animação `as-button-entrance` (aparição inicial suave)
- ✅ Hover mantido: botão fica maior (scale 1.08) mostrando seleção

**TRANSIÇÃO DE FADE-OUT (Ao iniciar novo jogo):**
- Logo: transition 800ms
- Base-logo: transition 800ms
- Botões: transition 800ms
- Container root: transition 800ms (antes: 500ms)
- **Resultado:** Todos os elementos desaparecem sincronizados e suavemente

**COMPORTAMENTO FINAL:**
- **Em repouso:** Botões imóveis, sem animações contínuas
- **Hover:** Botão sobe e fica 8% maior, mostrando ser selecionável
- **Ao iniciar jogo:** Logo, base-logo, botões e container desaparecem juntos em 800ms

**Versão:** v1.1.8 (anterior: v1.1.7)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.7.js

---

## [NOVA ALTERAÇÃO - Data: Anterior]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- AS_1.1_TitleScreenUI.js
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** Melhoria - Animações dinâmicas e movimento fluido dos botões
**Detalhes:** Adicionados efeitos de animação aos botões para torná-los mais dinâmicos e interativos:

**NOVAS ANIMAÇÕES:**

1. **as-button-entrance** (600ms)
   - Botões aparecem de forma suave ao carregar
   - Animação: aparecem de baixo para cima com fade-in
   - Transição: `opacity: 0 → 1`, `translateY(20px) → 0`, `scale(0.95) → 1`

2. **as-button-pulse** (3s, infinito)
   - Glow respiratório contínuo ao redor do botão
   - Animação: drop-shadow varia suavemente
   - Cria efeito de "pulso" luminoso em repouso

3. **as-button-float** (3s, infinito)
   - Flutuação suave do botão
   - Animação: movimento vertical sutil (-4px até 0px)
   - Cria sensação de levitação

4. **as-glow-text** (500ms, hover)
   - Brilho intenso do texto ao passar mouse
   - Animação: text-shadow aumenta e diminui suavemente
   - Sincronizado com hover effect

**COMPORTAMENTO:**
- **Em repouso:** Botões flutuam com pulso luminoso suave
- **Ao hover:** Animações param, botão sobe mais (+8px) e brilha intensamente
- **Ao clicar:** Scale ajustado, efeito comprimido
- **Desabilitado:** Sem animações, apenas opacity reduzida

**EFEITOS VISUAIS:**
- Drop-shadow base: rgba(255, 157, 66, 0.3)
- Drop-shadow hover: rgba(255, 157, 66, 0.7)
- Glow ao hover: até rgba(255, 157, 66, 0.4) com intensidade máxima
- Suavidade: cubic-bezier(0.4, 0, 0.2, 1)

**Versão:** v1.1.7 (anterior: v1.1.6)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.6.js

---

## [NOVA ALTERAÇÃO - Data: Anterior]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- AS_1.1_TitleScreenUI.js
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** Ajuste - Remoção de contorno e aumento dos botões
**Detalhes:** Removidos contornos padrão e aumentado tamanho dos botões para melhor visualização:

**MODIFICAÇÕES NO CSS:**
- Removido qualquer outline/border padrão do navegador
- Adicionado `outline: none` explícito
- Adicionado `box-shadow: none` para evitar sombras padrão
- Removidos `-webkit-appearance` e `-moz-appearance` (webkit)
- Alterado `background-color: transparent` para `background: transparent`

**AUMENTO DE TAMANHO:**
- Tamanho base: 220px × 100px (antes: 180px × 80px)
- Padding aumentado: 24px 48px (antes: 20px 40px)
- Font-size aumentado: 1.2rem (antes: 1.1rem)
- Media query 1000px: 200px × 90px (antes: 160px × 70px)
- Media query 768px: 240px × 90px (antes: 200px × 65px)
- Media query 640px: 200px × 80px (antes: mantinha 180px × 65px)

**RESULTADO VISUAL:**
- Botões sem contorno/border aparente
- Apenas imagem (botao.png) e texto visíveis
- Botões maiores e mais legíveis
- Efeitos hover e disabled mantidos

**Versão:** v1.1.6 (anterior: v1.1.5)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.5.js

---

## [NOVA ALTERAÇÃO - Data: Anterior]
**Autor:** Zencoder
**Arquivo(s) afetado(s):** 
- assets/contents/html/AS_1.1_TitleScreenUI.html
- assets/contents/css/AS_1.1_TitleScreenUI.css

**Ação:** Feature - Moldura de botão com imagem como elemento visual
**Detalhes:** Implementada moldura visual dos botões usando a imagem `botao.png` como frame decorativo:

**MODIFICAÇÕES NO HTML:**
- Adicionada `<img class="as-title__button-frame">` dentro de cada botão
- A imagem está posicionada atrás do texto (z-index: 0)
- Todos os 4 botões (Iniciar, Continuar, Opções, Sair) recebem a moldura
- Atributo `draggable="false"` para evitar comportamento indesejado

**MODIFICAÇÕES NO CSS:**
- Removido `background-image: url()` do `.as-title__button`
- Criada classe `.as-title__button-frame` com:
  - `position: absolute` centralizada (top 50%, left 50%, translate)
  - `z-index: 0` para ficar atrás do texto
  - `object-fit: contain` para manter proporção da imagem
  - `pointer-events: none` para não interferir com cliques
  - Otimizações de qualidade de imagem
- Adicionados efeitos de hover na moldura:
  - `filter: brightness(1.15) drop-shadow()` ao passar mouse
- Adicionado filtro desabilitado na moldura:
  - `filter: grayscale(0.8) brightness(0.6)` quando desabilitado

**RESULTADO VISUAL:**
- Botões agora têm a moldura `botao.png` como frame decorativo real
- Texto sobreposto à moldura com sombra e brilho próprio
- Animações de hover, active e disabled funcionam em ambos (moldura + texto)
- Manutenção total da estética medieval fantástica

**Versão:** v1.1.5 (anterior: v1.1.4)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.4.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Correção - Botões com asset direto e sem overlay branco
**Detalhes:**
- Mantido o caminho absoluto de `botao.png` para garantir carregamento via DOM injetado.
- Removidos pseudo-elementos de brilho que criavam faixa branca sobre o botão.
- Hover/active agora usam apenas a arte original com drop-shadow, sem filtros de brightness.
- Textos permanecem destacados (gold/brilho) respeitando a estética do menu.
**Versão:** v1.1.4 (anterior: v1.1.3)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.3 - Fix 1.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Correção - Caminho da imagem do botão
**Detalhes:** Corrigido caminho relativo da imagem botao.png:
- Antes: `url('../../resources/botao.png')` ❌
- Depois: `url('../resources/botao.png')` ✅
- Caminho correto a partir de `assets/contents/css/`
- Erro "Failed to load resource: net::ERR_FILE_NOT_FOUND" resolvido
**Versão:** v1.1.3 (anterior: v1.1.2)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.2.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Feature - Integração com ConfigManager e imagem de fundo nos botões
**Detalhes:** Implementadas melhorias visuais e integração com sistema de configurações:

**INTEGRAÇÃO COM CONFIGMANAGER:**
- Configurações de animação e música agora são lidas do ConfigManager
- Função getAnimationSettings() criada para obter valores dinâmicos
- Parâmetros do plugin servem como padrões (fallback)
- Sistema permite alterar configurações em tempo real via tela de opções

**IMAGEM DE FUNDO NOS BOTÕES:**
- Background dos botões substituído por botao.png
- background-image com background-size: 100% 100%
- Texto centralizado com flexbox (display: flex, align-items, justify-content)
- image-rendering: high-quality para qualidade máxima
- Hover usa filter: brightness + drop-shadow
- Disabled usa grayscale + brightness reduzido
- Mantida responsividade e acessibilidade

**OTIMIZAÇÕES:**
- Removido gradiente CSS em favor da imagem
- filter: drop-shadow() para sombras suaves
- Transições mantidas para feedback visual
- Compatível com todos os estados (hover, active, disabled)

**Versão:** v1.1.2 (anterior: v1.1.1)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.1.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Ajuste - Remoção de animação do base-logo
**Detalhes:** Removida animação de rotação da imagem base-logo.png conforme solicitado:
- Removida chamada de `baseLogo.style.animation` na função createBaseLogo()
- Removido @keyframes as-base-rotate do CSS
- Base-logo agora permanece estático (sem rotação)
- Logo principal mantém animação de flutuação (as-logo-float)
- Qualidade de imagem e otimizações mantidas
**Versão:** v1.1.1 (anterior: v1.1.0)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.1.0.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Feature - Animações, qualidade de imagem e transições musicais
**Detalhes:** Implementado sistema completo de animações e melhorias visuais/sonoras:

**ANIMAÇÕES:**
- Logo principal: animação de flutuação suave (as-logo-float)
- Fundo do logo: rotação contínua e elegante (as-base-rotate)
- Velocidade configurável via parâmetro (1-10 segundos)
- Animações podem ser desativadas via parâmetro

**QUALIDADE DE IMAGEM:**
- image-rendering: high-quality em logos
- backface-visibility: hidden para performance
- willChange: transform para otimização de GPU
- -webkit-optimize-contrast para renderização suave
- Aplicado em ancient-souls.png, base-logo.png e background.png

**TRANSIÇÕES MUSICAIS:**
- Fade out automático da BGM ao sair da tela de título
- Duração configurável (100-5000ms)
- Não aplica fade ao abrir menu de opções
- Sistema usa AudioManager.fadeOutBgm() nativo

**SONS DOS BOTÕES:**
- Hover: SoundManager.playCursor()
- Click: SoundManager.playOk()
- Listeners adicionados via addEventListener

**NOVOS PARÂMETROS:**
- enableLogoAnimation (boolean, padrão: true)
- animationSpeed (1-10s, padrão: 4.0)
- enableMusicFade (boolean, padrão: true)
- musicFadeDuration (100-5000ms, padrão: 1000)

**Versão:** v1.1.0 (anterior: v1.0.9)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.9.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js
**Ação:** Correção - Bug de posicionamento do logo e fundo
**Detalhes:** Corrigido erro de posicionamento causado por transforms conflitantes:
- Problema: aplicar transform na logoSection afetava todos os elementos filhos (incluindo baseLogo)
- Solução: logoSection mantém apenas translate(-50%, -50%) para centralização básica
- Logo principal (logoImg) recebe transform próprio: translate(offset) + scale
- Fundo (baseLogo) recebe transform independente: translate(offset) + scale
- Ambos os elementos agora usam position: absolute com top: 0 e left: 0 como base
- Ajustes de offset funcionam de forma independente e previsível
- Transform-origin mantido em 'center center' para escala correta
**Versão:** v1.0.9 (anterior: v1.0.8)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.8.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Adição - Imagem de fundo do logo e remoção de prefixos PT-BR
**Detalhes:** Implementado sistema de fundo configurável para o logo Ancient Souls:
- Adicionada imagem base-logo.png como camada de fundo atrás do logo principal
- Novos parâmetros: baseLogoEnabled, baseLogoOffsetX, baseLogoOffsetY, baseLogoScale, baseLogoOpacity
- Função createBaseLogo() cria dinamicamente elemento de fundo com estilos inline
- Fundo posicionado em z-index: 0, logo principal em z-index: 2
- Removidos todos os prefixos "PT-BR:" dos comentários (agora direto em português)
- Logs informativos mostram configurações aplicadas para logo e fundo
- Sistema de camadas permite ajuste independente de cada elemento
**Versão:** v1.0.8 (anterior: v1.0.7)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.7.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Adição - Parâmetros de customização do logo
**Detalhes:** Implementados parâmetros de plugin para ajustar posicionamento e escala do logo Ancient Souls:
- logoOffsetX: Deslocamento horizontal (-500 a 500px)
- logoOffsetY: Deslocamento vertical (-500 a 500px)
- logoScale: Escala do logo (0.1 a 5.0x)
- Removido fundo radial-gradient e animações (as-logo-float e as-logo-pulse)
- Criada função applyLogoCustomization() para aplicar configurações
- Logo mantém centralização base com ajustes via transform
- Logs informativos mostram valores aplicados
**Versão:** v1.0.7 (anterior: v1.0.6)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.6.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css, assets/contents/html/AS_1.1_TitleScreenUI.html
**Ação:** Reescrita - Layout limpo centralizado
**Detalhes:** Reescrita completa da tela de título conforme solicitação do usuário:
- Removido painel com fundo roxo e bordas
- Logo ancient-souls.png centralizada com animação de flutuação
- Botões em layout horizontal abaixo da logo (Iniciar, Continuar, Opções, Sair)
- Efeito de brilho ember (laranja/fogo) ao redor da logo
- Animações modernas e transições suaves em todos os botões
- Design minimalista e limpo focado na logo e background.png
- Responsivo para mobile (botões verticais em telas pequenas)
- Mantida navegação por teclado e acessibilidade
**Versão:** v1.0.6 (anterior: v1.0.5)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.5.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css, assets/contents/html/AS_1.1_TitleScreenUI.html
**Ação:** Ajuste - Comandos horizontais
**Detalhes:** Reformatado o painel para acomodar botões alinhados na horizontal,
com suporte a setas esquerda/direita, remoção do overlay adicional e renomeação
do primeiro comando para "Iniciar". Ajustes incluem espaçamentos, largura
mínima e foco inicial.
**Versão:** v1.0.3 (anterior: v1.0.2)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.2.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Ajuste - Forçando fonte Pixel Times
**Detalhes:** Declarado explicitamente o uso da fonte personalizada em todos
os elementos HTML e botões da tela de título para evitar quedas para fontes
do sistema. Versão incrementada para refletir o refinamento visual.
**Versão:** v1.0.2 (anterior: v1.0.1)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.1.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Ajuste - Centralização de layout
**Detalhes:** Atualizado o CSS para usar grid em tela cheia, garantindo que o
painel HTML permaneça centralizado em qualquer resolução e aplicando limites
responsivos de largura. Versão do agente incrementada para acompanhar o novo
empacotamento visual.
**Versão:** v1.0.1 (anterior: v1.0.0)
**Backup criado:** backups/AS_1.1_TitleScreenUI/AS_1.1_TitleScreenUI - v1.0.0.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.1_TitleScreenUI.js, assets/contents/html/AS_1.1_TitleScreenUI.html, assets/contents/css/AS_1.1_TitleScreenUI.css
**Ação:** Criação - Interface HTML/CSS
**Detalhes:** Injetada interface HTML tematizada, carregamento automático de
assets com fonte Pixel Times, preparação de navegação por teclado e publicação
de comandos para o agente principal da tela de título.
**Versão:** v1.0.0 (anterior: --)
**Backup criado:** Nenhum (primeira versão)
