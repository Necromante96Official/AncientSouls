# Histórico - AS_1.1_TitleScreenUI

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
