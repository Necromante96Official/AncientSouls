//=============================================================================
// AS_1.1_TitleScreenUI.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.1.0 ☆ Interface HTML da tela de título (layout medieval fantástico)
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_1.0_TitleScreen
 * 
 * @param logoOffsetX
 * @text Deslocamento Horizontal do Logo
 * @desc Ajusta a posição horizontal do logo (valores negativos = esquerda, positivos = direita)
 * @type number
 * @min -500
 * @max 500
 * @default 0
 * 
 * @param logoOffsetY
 * @text Deslocamento Vertical do Logo
 * @desc Ajusta a posição vertical do logo (valores negativos = cima, positivos = baixo)
 * @type number
 * @min -500
 * @max 500
 * @default 0
 * 
 * @param logoScale
 * @text Escala do Logo
 * @desc Ajusta o tamanho do logo (1.0 = tamanho original, 0.5 = metade, 2.0 = dobro)
 * @type number
 * @min 0.1
 * @max 5.0
 * @decimals 2
 * @default 1.0
 * 
 * @param baseLogoEnabled
 * @text Exibir Fundo do Logo
 * @desc Ativa/desativa a imagem de fundo atrás do logo Ancient Souls
 * @type boolean
 * @default true
 * 
 * @param baseLogoOffsetX
 * @text Deslocamento Horizontal do Fundo
 * @desc Ajusta a posição horizontal da imagem de fundo
 * @type number
 * @min -500
 * @max 500
 * @default 0
 * 
 * @param baseLogoOffsetY
 * @text Deslocamento Vertical do Fundo
 * @desc Ajusta a posição vertical da imagem de fundo
 * @type number
 * @min -500
 * @max 500
 * @default 0
 * 
 * @param baseLogoScale
 * @text Escala do Fundo
 * @desc Ajusta o tamanho da imagem de fundo
 * @type number
 * @min 0.1
 * @max 5.0
 * @decimals 2
 * @default 1.0
 * 
 * @param baseLogoOpacity
 * @text Opacidade do Fundo
 * @desc Define a transparência da imagem de fundo (0 = invisível, 100 = opaco)
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * 
 * @param enableLogoAnimation
 * @text Ativar Animação do Logo
 * @desc Ativa animação de flutuação suave no logo e fundo
 * @type boolean
 * @default true
 * 
 * @param animationSpeed
 * @text Velocidade da Animação
 * @desc Velocidade da animação em segundos (menor = mais rápido)
 * @type number
 * @min 1
 * @max 10
 * @decimals 1
 * @default 4.0
 * 
 * @param enableMusicFade
 * @text Ativar Fade de Música
 * @desc Fade out suave da música ao sair da tela de título
 * @type boolean
 * @default true
 * 
 * @param musicFadeDuration
 * @text Duração do Fade (ms)
 * @desc Tempo do fade da música em milissegundos
 * @type number
 * @min 100
 * @max 5000
 * @default 1000
 * 
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Title Screen UI (Sub-agente)
 * --------------------------------------------------------------------------
 * Injeta a interface HTML estilizada da tela de título, controla os eventos
 * de clique/navegação e publica comandos para o agente principal.
 * 
 * PARÂMETROS DO LOGO PRINCIPAL:
 * - logoOffsetX: Move o logo horizontalmente (px)
 * - logoOffsetY: Move o logo verticalmente (px)
 * - logoScale: Redimensiona o logo (multiplicador)
 * 
 * PARÂMETROS DO FUNDO DO LOGO:
 * - baseLogoEnabled: Ativa/desativa o fundo
 * - baseLogoOffsetX: Move o fundo horizontalmente (px)
 * - baseLogoOffsetY: Move o fundo verticalmente (px)
 * - baseLogoScale: Redimensiona o fundo (multiplicador)
 * - baseLogoOpacity: Transparência do fundo (0-100)
 * 
 * ANIMAÇÕES E EFEITOS:
 * - enableLogoAnimation: Ativa/desativa animação de flutuação
 * - animationSpeed: Velocidade da animação (segundos)
 * - enableMusicFade: Ativa/desativa fade de música
 * - musicFadeDuration: Duração do fade (ms)
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleScreenUI = AS.TitleScreenUI || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.1_TitleScreenUI';
    const MODULE_VERSION = '1.1.0';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    // Carregar parâmetros do plugin
    const pluginName = 'AS_1.1_TitleScreenUI';
    const parameters = PluginManager.parameters(pluginName);
    const logoOffsetX = Number(parameters['logoOffsetX'] || 0);
    const logoOffsetY = Number(parameters['logoOffsetY'] || 0);
    const logoScale = Number(parameters['logoScale'] || 1.0);
    const baseLogoEnabled = parameters['baseLogoEnabled'] === 'true';
    const baseLogoOffsetX = Number(parameters['baseLogoOffsetX'] || 0);
    const baseLogoOffsetY = Number(parameters['baseLogoOffsetY'] || 0);
    const baseLogoScale = Number(parameters['baseLogoScale'] || 1.0);
    const baseLogoOpacity = Number(parameters['baseLogoOpacity'] || 100) / 100;
    const enableLogoAnimation = parameters['enableLogoAnimation'] !== 'false';
    const animationSpeed = Number(parameters['animationSpeed'] || 4.0);
    const enableMusicFade = parameters['enableMusicFade'] !== 'false';
    const musicFadeDuration = Number(parameters['musicFadeDuration'] || 1000);

    const logger = {
        info(message) {
            console.log(`🪄 [${MODULE_ID}] ${message}`);
        },
        warn(message) {
            console.warn(`⚠️ [${MODULE_ID}] ${message}`);
        },
        error(message) {
            console.error(`❌ [${MODULE_ID}] ${message}`);
        }
    };

    const PATHS = {
        css: 'js/plugins/assets/contents/css/AS_1.1_TitleScreenUI.css',
        html: 'js/plugins/assets/contents/html/AS_1.1_TitleScreenUI.html'
    };

    let rootElement = null;
    let buttons = [];
    let detachKeyHandler = null;
    let unsubscribeSceneReady = null;
    let unsubscribeSceneTerminate = null;
    let contextRef = null;

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Title Screen UI',
        dependencies: DEPENDENCIES,
        init: context => {
            contextRef = context;
            injectStyles();
            injectMarkup();
            bindButtons();
            monitorSceneLifecycle(context);
            logger.info('Interface preparada e aguardando Scene_Title.');
            return {};
        },
        cleanup: () => {
            destroyMarkup();
            logger.info('Markup HTML removido da árvore DOM.');
        }
    };

    function monitorSceneLifecycle(context) {
        unsubscribeSceneReady = context.subscribe('titlescreen:scene:ready', handleSceneReady);
        unsubscribeSceneTerminate = context.subscribe('titlescreen:scene:terminate', handleSceneTerminate);
    }

    function handleSceneReady() {
        if (!rootElement) {
            return;
        }
        updateContinueState();
        rootElement.classList.add('as-title--visible');
        rootElement.setAttribute('aria-hidden', 'false');
        focusFirstButton();
        attachKeyboardSupport();
    }

    function handleSceneTerminate() {
        if (!rootElement) {
            return;
        }
        rootElement.classList.remove('as-title--visible');
        rootElement.setAttribute('aria-hidden', 'true');
        detachKeyboardSupport();
    }

    function injectStyles() {
        const css = loadAsset(PATHS.css);
        if (!css) {
            logger.warn('CSS não carregado - arquivo vazio ou inexistente.');
            return;
        }
        const style = document.createElement('style');
        style.id = `${MODULE_ID}-style`;
        style.textContent = css;
        document.head.appendChild(style);
        logger.info('Estilos injetados no documento.');
    }

    function injectMarkup() {
        const html = loadAsset(PATHS.html);
        if (!html) {
            logger.error('HTML não encontrado - verifique assets.');
            return;
        }
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        rootElement = wrapper.firstElementChild;
        document.body.appendChild(rootElement);
        buttons = Array.from(rootElement.querySelectorAll('[data-command]'));
        applyLogoCustomization();
        logger.info('Markup HTML inserido na árvore DOM.');
    }

    function applyLogoCustomization() {
        // Aplicar customizações do logo baseado nos parâmetros
        if (!rootElement) {
            return;
        }
        const logoSection = rootElement.querySelector('.as-title__logo-section');
        const logoImg = rootElement.querySelector('.as-title__logo');
        
        if (!logoSection || !logoImg) {
            logger.warn('Elementos do logo não encontrados para customização.');
            return;
        }

        // Criar e aplicar imagem de fundo se habilitado (antes de modificar o logoSection)
        if (baseLogoEnabled) {
            createBaseLogo(logoSection);
        }

        // Aplicar deslocamento (offset) ao container do logo
        // Não aplicamos aqui porque afetaria o baseLogo também
        // Vamos aplicar diretamente no logoImg
        logoSection.style.transform = 'translate(-50%, -50%)';

        // Aplicar animação se habilitada
        if (enableLogoAnimation) {
            logoSection.style.animation = `as-logo-float ${animationSpeed}s ease-in-out infinite`;
        }

        // Aplicar deslocamento e escala ao logo principal
        const logoTransform = `translate(${logoOffsetX}px, ${logoOffsetY}px) scale(${logoScale})`;
        logoImg.style.transform = logoTransform;
        logoImg.style.transformOrigin = 'center center';
        
        // Melhorar qualidade da imagem
        logoImg.style.imageRendering = 'high-quality';
        logoImg.style.imageRendering = '-webkit-optimize-contrast';
        logoImg.style.backfaceVisibility = 'hidden';
        logoImg.style.willChange = 'transform';

        logger.info(`🎨 Logo customizado: offset(${logoOffsetX}px, ${logoOffsetY}px), escala(${logoScale})`);
        if (baseLogoEnabled) {
            logger.info(`🖼️ Fundo do logo: offset(${baseLogoOffsetX}px, ${baseLogoOffsetY}px), escala(${baseLogoScale}), opacidade(${baseLogoOpacity})`);
        }
        if (enableLogoAnimation) {
            logger.info(`✨ Animação ativada: velocidade ${animationSpeed}s`);
        }
    }

    function createBaseLogo(logoSection) {
        // Criar elemento de imagem de fundo
        const baseLogo = document.createElement('img');
        baseLogo.className = 'as-title__base-logo';
        baseLogo.src = 'js/plugins/assets/resources/base-logo.png';
        baseLogo.alt = '';
        baseLogo.draggable = false;
        
        // Aplicar estilos inline
        baseLogo.style.position = 'absolute';
        baseLogo.style.top = '0';
        baseLogo.style.left = '0';
        baseLogo.style.transform = `translate(${baseLogoOffsetX}px, ${baseLogoOffsetY}px) scale(${baseLogoScale})`;
        baseLogo.style.transformOrigin = 'center center';
        baseLogo.style.opacity = baseLogoOpacity;
        baseLogo.style.pointerEvents = 'none';
        baseLogo.style.userSelect = 'none';
        baseLogo.style.zIndex = '0';
        baseLogo.style.width = 'min(450px, 55vw)';
        baseLogo.style.maxWidth = '100%';
        baseLogo.style.height = 'auto';
        
        // Melhorar qualidade da imagem
        baseLogo.style.imageRendering = 'high-quality';
        baseLogo.style.imageRendering = '-webkit-optimize-contrast';
        baseLogo.style.backfaceVisibility = 'hidden';
        baseLogo.style.willChange = 'transform, opacity';
        
        // Animação de rotação suave se habilitada
        if (enableLogoAnimation) {
            baseLogo.style.animation = `as-base-rotate ${animationSpeed * 3}s linear infinite`;
        }
        
        // Inserir antes do logo principal
        logoSection.insertBefore(baseLogo, logoSection.firstChild);
    }

    function destroyMarkup() {
        detachKeyboardSupport();
        buttons.forEach(button => {
            button.removeEventListener('click', onButtonClick);
            button.removeEventListener('mouseenter', onButtonHover);
        });
        buttons.length = 0;
        if (rootElement && rootElement.parentNode) {
            rootElement.parentNode.removeChild(rootElement);
        }
        rootElement = null;
        const style = document.getElementById(`${MODULE_ID}-style`);
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
        if (unsubscribeSceneReady) {
            unsubscribeSceneReady();
            unsubscribeSceneReady = null;
        }
        if (unsubscribeSceneTerminate) {
            unsubscribeSceneTerminate();
            unsubscribeSceneTerminate = null;
        }
    }

    function bindButtons() {
        buttons.forEach(button => {
            button.addEventListener('click', onButtonClick);
            button.addEventListener('mouseenter', onButtonHover);
        });
    }

    function onButtonHover() {
        // Som de hover (cursor)
        if (AudioManager.systemAudioContext) {
            SoundManager.playCursor();
        }
    }

    function onButtonClick(event) {
        const command = event.currentTarget.dataset.command;
        if (!command) {
            return;
        }
        
        // Som de confirmação (OK)
        if (AudioManager.systemAudioContext) {
            SoundManager.playOk();
        }
        
        // Fade de música se habilitado e comando não for 'options'
        if (enableMusicFade && command !== 'options') {
            fadeOutMusic();
        }
        
        contextRef.publish('titlescreen:ui:command', { command });
    }

    function fadeOutMusic() {
        // Aplicar fade out na BGM da tela de título
        const currentBgm = AudioManager._currentBgs;
        if (AudioManager._bgmBuffer && enableMusicFade) {
            const duration = musicFadeDuration / 1000;
            AudioManager.fadeOutBgm(duration);
            logger.info(`🎵 Fade out de música aplicado (${musicFadeDuration}ms)`);
        }
    }

    function updateContinueState() {
        const continueButton = buttons.find(button => button.dataset.command === 'continue');
        if (!continueButton) {
            return;
        }
        const hasSave = DataManager.isAnySavefileExists();
        continueButton.disabled = !hasSave;
    }

    function focusFirstButton() {
        if (buttons.length === 0) {
            return;
        }
        const preferred = buttons.find(button => !button.disabled) || buttons[0];
        preferred.focus();
    }

    function attachKeyboardSupport() {
        const handler = event => {
            if (!rootElement || !rootElement.classList.contains('as-title--visible')) {
                return;
            }
            const active = document.activeElement;
            const currentIndex = buttons.indexOf(active);
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                event.preventDefault();
                focusRelative(currentIndex, -1);
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                event.preventDefault();
                focusRelative(currentIndex, 1);
            } else if (event.key === 'Enter' || event.key === ' ') {
                if (currentIndex >= 0) {
                    event.preventDefault();
                    buttons[currentIndex].click();
                }
            }
        };
        document.addEventListener('keydown', handler);
        detachKeyHandler = () => document.removeEventListener('keydown', handler);
    }

    function detachKeyboardSupport() {
        if (typeof detachKeyHandler === 'function') {
            detachKeyHandler();
            detachKeyHandler = null;
        }
    }

    function focusRelative(currentIndex, delta) {
        if (buttons.length === 0) {
            return;
        }
        let index = currentIndex;
        for (let i = 0; i < buttons.length; i += 1) {
            index = (index + delta + buttons.length) % buttons.length;
            if (!buttons[index].disabled) {
                buttons[index].focus();
                break;
            }
        }
    }

    function loadAsset(relativePath) {
        try {
            if (!Utils.isNwjs()) {
                logger.warn('Ambiente sem Node.js - carregamento de assets não suportado.');
                return '';
            }
            const fs = require('fs');
            const path = require('path');
            const base = path.dirname(process.mainModule.filename);
            const target = path.join(base, relativePath);
            return fs.readFileSync(target, 'utf8');
        } catch (error) {
            logger.error(`Erro ao carregar asset ${relativePath}: ${error.message}`);
            return '';
        }
    }

    if (AS && AS.PluginManager && typeof AS.PluginManager.register === 'function') {
        AS.PluginManager.register(manifest);
    } else {
        logger.error('AS.PluginManager não encontrado. Verifique a ordem de carregamento.');
    }
})();

//=============================================================================
// Fim de AS_1.1_TitleScreenUI.js
//=============================================================================
