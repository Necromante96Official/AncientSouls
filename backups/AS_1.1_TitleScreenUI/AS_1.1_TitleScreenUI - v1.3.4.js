//=============================================================================
// AS_1.1_TitleScreenUI.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.3.4 ☆ Interface HTML da tela de título (layout medieval fantástico)
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_1.0_TitleScreen
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
 * LAYOUT PERSONALIZADO:
 * - Todas as imagens utilizam posições fixas para replicar o layout oficial.
 * - O HTML/CSS carregado pelo plugin já aplica o design final.
 * 
 * PARÂMETROS DISPONÍVEIS:
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
    const MODULE_VERSION = '1.3.4';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    // Carregar parâmetros do plugin (padrões estáticos)
    const pluginName = 'AS_1.1_TitleScreenUI';
    const parameters = PluginManager.parameters(pluginName);

    const clamp = (value, min, max) => {
        if (min === undefined && max === undefined) {
            return value;
        }
        if (min === undefined) {
            return Math.min(value, max);
        }
        if (max === undefined) {
            return Math.max(value, min);
        }
        return Math.min(Math.max(value, min), max);
    };

    const getNumberParam = (key, defaultValue, min, max) => {
        const raw = parameters[key];
        if (raw === undefined || raw === null || raw === '') {
            return defaultValue;
        }
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) {
            return defaultValue;
        }
        return clamp(parsed, min, max);
    };

    const getBooleanParam = (key, defaultValue) => {
        const raw = parameters[key];
        if (raw === undefined || raw === null || raw === '') {
            return defaultValue;
        }
        if (raw === 'true') {
            return true;
        }
        if (raw === 'false') {
            return false;
        }
        return defaultValue;
    };

    const paramEnableLogoAnimation = getBooleanParam('enableLogoAnimation', true);
    const paramAnimationSpeed = getNumberParam('animationSpeed', 4.0, 1, 10);
    const paramEnableMusicFade = getBooleanParam('enableMusicFade', true);
    const paramMusicFadeDuration = getNumberParam('musicFadeDuration', 1000, 100, 5000);

    function getAnimationSettings() {
        const configEnableLogoAnimation = ConfigManager.enableLogoAnimation;
        const configAnimationSpeed = Number(ConfigManager.animationSpeed);
        const configEnableMusicFade = ConfigManager.enableMusicFade;
        const configMusicFadeDuration = Number(ConfigManager.musicFadeDuration);

        return {
            enableLogoAnimation: configEnableLogoAnimation !== undefined ? !!configEnableLogoAnimation : paramEnableLogoAnimation,
            animationSpeed: Number.isFinite(configAnimationSpeed) ? clamp(configAnimationSpeed, 1, 10) : paramAnimationSpeed,
            enableMusicFade: configEnableMusicFade !== undefined ? !!configEnableMusicFade : paramEnableMusicFade,
            musicFadeDuration: Number.isFinite(configMusicFadeDuration) ? clamp(configMusicFadeDuration, 100, 5000) : paramMusicFadeDuration
        };
    }

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

    const LAYOUT_MAP = {
        group: {
            selector: '.as-title__logo-group',
            offsetXKey: 'logoGroupOffsetX',
            offsetYKey: 'logoGroupOffsetY',
            scaleKey: 'logoGroupScale',
            baseTransform: 'translate(-50%, -50%)'
        },
        base: {
            selector: '.as-title__logo-node--base',
            offsetXKey: 'logoBaseOffsetX',
            offsetYKey: 'logoBaseOffsetY',
            scaleKey: 'logoBaseScale',
            baseTransform: ''
        },
        text: {
            selector: '.as-title__logo-node--text',
            offsetXKey: 'logoTextOffsetX',
            offsetYKey: 'logoTextOffsetY',
            scaleKey: 'logoTextScale',
            baseTransform: 'translate(-50%, -50%)'
        },
        dark: {
            selector: '.as-title__logo-node--dark',
            offsetXKey: 'logoDarkOffsetX',
            offsetYKey: 'logoDarkOffsetY',
            scaleKey: 'logoDarkScale',
            baseTransform: ''
        },
        light: {
            selector: '.as-title__logo-node--light',
            offsetXKey: 'logoLightOffsetX',
            offsetYKey: 'logoLightOffsetY',
            scaleKey: 'logoLightScale',
            baseTransform: ''
        }
    };

    const LAYOUT_DEFAULTS = {
        group: { offsetX: 0, offsetY: 0, scale: 1 },
        base: { offsetX: 0, offsetY: 0, scale: 1 },
        text: { offsetX: 0, offsetY: 0, scale: 1 },
        dark: { offsetX: 0, offsetY: 0, scale: 1 },
        light: { offsetX: 0, offsetY: 0, scale: 1 }
    };

    let rootElement = null;
    let buttons = [];
    let detachKeyHandler = null;
    let unsubscribeSceneReady = null;
    let unsubscribeSceneTerminate = null;
    let unsubscribeLayoutChanged = null;
    let contextRef = null;
    let layoutTargets = {};

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
        unsubscribeLayoutChanged = context.subscribe('titlescreen:logo:layoutChanged', applyLayoutAdjustments);
    }

    function handleSceneReady() {
        if (!rootElement) {
            return;
        }
        updateContinueState();
        rootElement.classList.add('as-title--visible');
        rootElement.setAttribute('aria-hidden', 'false');
        applyAnimationSettings();
        applyLayoutAdjustments();
        focusFirstButton();
        attachKeyboardSupport();
        requestFullscreenMode();
    }

    function handleSceneTerminate() {
        if (!rootElement) {
            return;
        }
        rootElement.classList.remove('as-title--visible');
        rootElement.setAttribute('aria-hidden', 'true');
        detachKeyboardSupport();
    }

    function requestFullscreenMode() {
        const docElement = document.documentElement;
        if (!document.fullscreenElement && docElement.requestFullscreen) {
            docElement.requestFullscreen().catch(err => {
                logger.warn(`Fullscreen request falhou: ${err.message}`);
            });
        }
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
        cacheLayoutTargets();
        applyAnimationSettings();
        applyLayoutAdjustments();
        logger.info('Markup HTML inserido na árvore DOM.');
    }

    function applyAnimationSettings() {
        if (!rootElement) {
            return;
        }

        const settings = getAnimationSettings();
        const animationValue = settings.enableLogoAnimation
            ? `as-logo-float ${settings.animationSpeed}s ease-in-out infinite`
            : 'none';

        const animatedElements = [];
        const logoSection = rootElement.querySelector('.as-title__logo-section');
        const logoImg = rootElement.querySelector('.as-title__logo');
        const baseLogo = rootElement.querySelector('.as-title__base-logo');
        const soulIcons = rootElement.querySelectorAll('.as-title__soul-icon');

        if (logoSection) {
            animatedElements.push(logoSection);
        }
        if (logoImg) {
            animatedElements.push(logoImg);
        }
        if (baseLogo) {
            animatedElements.push(baseLogo);
        }
        soulIcons.forEach(icon => animatedElements.push(icon));

        animatedElements.forEach(element => {
            element.style.animation = animationValue;
        });

        if (settings.enableLogoAnimation) {
            logger.info(`✨ Animação ativada: velocidade ${settings.animationSpeed}s`);
        } else {
            logger.info('🛑 Animação desativada pelas configurações do plugin.');
        }
    }

    function destroyMarkup() {
        detachKeyboardSupport();
        buttons.forEach(button => {
            button.removeEventListener('click', onButtonClick);
            button.removeEventListener('mouseenter', onButtonHover);
            button.removeEventListener('mouseleave', onButtonUnhover);
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
        if (unsubscribeLayoutChanged) {
            unsubscribeLayoutChanged();
            unsubscribeLayoutChanged = null;
        }
        layoutTargets = {};
    }

    function cacheLayoutTargets() {
        layoutTargets = {};
        if (!rootElement) {
            return;
        }
        Object.keys(LAYOUT_MAP).forEach(key => {
            const selector = LAYOUT_MAP[key].selector;
            const element = rootElement.querySelector(selector);
            if (element) {
                layoutTargets[key] = element;
            }
        });
    }

    function ensureLayoutTargets() {
        if (!rootElement) {
            return false;
        }
        const hasAll = Object.keys(LAYOUT_MAP).every(key => layoutTargets[key]);
        if (!hasAll) {
            cacheLayoutTargets();
        }
        return Object.keys(LAYOUT_MAP).every(key => layoutTargets[key]);
    }

    function loadLayoutSettings() {
        const result = {};
        Object.keys(LAYOUT_MAP).forEach(key => {
            const map = LAYOUT_MAP[key];
            result[key] = {
                offsetX: readLayoutNumber(map.offsetXKey, LAYOUT_DEFAULTS[key].offsetX),
                offsetY: readLayoutNumber(map.offsetYKey, LAYOUT_DEFAULTS[key].offsetY),
                scale: readLayoutScale(map.scaleKey, LAYOUT_DEFAULTS[key].scale)
            };
        });
        return result;
    }

    function readLayoutNumber(key, fallback) {
        if (typeof ConfigManager === 'undefined' || ConfigManager === null) {
            return fallback;
        }
        const value = Number(ConfigManager[key]);
        if (Number.isFinite(value)) {
            return value;
        }
        return fallback;
    }

    function readLayoutScale(key, fallback) {
        const value = readLayoutNumber(key, fallback);
        return clamp(value, 0.1, 3);
    }

    function composeTransform(baseTransform, offsetX, offsetY, scale) {
        const transforms = [];
        if (baseTransform && baseTransform.length > 0) {
            transforms.push(baseTransform);
        }
        transforms.push(`translate(${offsetX}px, ${offsetY}px)`);
        transforms.push(`scale(${scale})`);
        return transforms.join(' ');
    }

    function applyLayoutAdjustments(payload) {
        if (!rootElement) {
            return;
        }
        if (!ensureLayoutTargets()) {
            return;
        }
        const source = payload && payload.settings ? payload.settings : loadLayoutSettings();
        Object.keys(LAYOUT_MAP).forEach(key => {
            const element = layoutTargets[key];
            if (!element) {
                return;
            }
            const config = source[key] || LAYOUT_DEFAULTS[key];
            const offsetX = Number(config.offsetX) || 0;
            const offsetY = Number(config.offsetY) || 0;
            const scale = Number(config.scale);
            const normalizedScale = Number.isFinite(scale) ? clamp(scale, 0.1, 3) : 1;
            const transform = composeTransform(LAYOUT_MAP[key].baseTransform, offsetX, offsetY, normalizedScale);
            element.style.transform = transform;
        });
    }

    function bindButtons() {
        logger.info(`🔗 Vinculando eventos de clique a ${buttons.length} botões...`);
        buttons.forEach((button, index) => {
            const command = button.dataset.command;
            logger.info(`  [${index}] Botão: "${command}" - Habilitado: ${!button.disabled}`);
            
            button.addEventListener('click', onButtonClick, { passive: false });
            button.addEventListener('mouseenter', onButtonHover);
            button.addEventListener('mouseleave', onButtonUnhover);
            
            // Garantir que o botão seja focalizável e clicável
            button.tabIndex = 0;
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
        });
        logger.info('✅ Eventos de clique vinculados com sucesso.');
    }

    function onButtonHover(event) {
        // Som de hover (cursor)
        try {
            if (AudioManager && AudioManager.systemAudioContext && SoundManager && SoundManager.playCursor) {
                SoundManager.playCursor();
            }
        } catch (_) {}
        logger.info(`Hover no botão: ${event.currentTarget.dataset.command}`);
    }

    function onButtonUnhover() {
        // Sem efeitos - apenas feedback sonoro
    }

    function onButtonClick(event) {
        logger.info(`🖱️ Clique detectado no elemento: ${event.currentTarget.tagName} - ${event.currentTarget.className}`);
        
        const button = event.currentTarget;
        const command = button && button.dataset ? button.dataset.command : null;
        
        logger.info(`📍 Comando extraído: ${command}`);
        
        if (!command) {
            logger.warn('❌ Comando vazio ou indefinido - clique ignorado.');
            return;
        }

        // Evita que algum outro handler cancele o clique
        event.stopPropagation();
        event.preventDefault();

        // Som de confirmação (OK)
        try {
            if (AudioManager && AudioManager.systemAudioContext && SoundManager && SoundManager.playOk) {
                SoundManager.playOk();
            }
        } catch (_) {}

        // Obter configurações atuais
        const settings = getAnimationSettings();

        // Fade de música se habilitado e comando não for 'options'
        if (settings.enableMusicFade && command !== 'options') {
            fadeOutMusic(settings.musicFadeDuration);
        }

        // Log e dispara a ação via barramento (com fallback direto)
        logger.info(`✅ Comando acionado via UI: ${command}`);
        dispatchUiCommand(command);
    }

    function dispatchUiCommand(command) {
        let published = false;
        try {
            if (contextRef && typeof contextRef.publish === 'function') {
                contextRef.publish('titlescreen:ui:command', { command });
                published = true;
            }
        } catch (err) {
            logger.warn(`Falha ao publicar pelo contexto: ${err.message}`);
        }

        // Publicação redundante pelo hub global (caso algum agente tenha assinado por ele)
        try {
            if (AS && AS.PluginManager && typeof AS.PluginManager.publish === 'function') {
                AS.PluginManager.publish('titlescreen:ui:command', { command });
                published = true;
            }
        } catch (err) {
            logger.warn(`Falha ao publicar pelo gerenciador: ${err.message}`);
        }

        // Fallback final: executa diretamente na Scene_Title ativa
        if (!published) {
            try {
                executeCommandDirect(command);
            } catch (err) {
                logger.error(`Não foi possível executar o comando '${command}': ${err.message}`);
            }
        }
    }

    function executeCommandDirect(command) {
        const scene = SceneManager && SceneManager._scene;
        if (!(scene instanceof Scene_Title)) {
            return;
        }
        switch (command) {
            case 'newGame':
                scene.commandNewGame();
                break;
            case 'continue':
                if (DataManager.isAnySavefileExists()) {
                    scene.commandContinue();
                } else {
                    try { SoundManager.playBuzzer(); } catch (_) {}
                }
                break;
            case 'options':
                scene.commandOptions();
                break;
            case 'shutdown':
                try {
                    AudioManager.fadeOutBgm(60);
                    AudioManager.fadeOutBgs(60);
                    AudioManager.fadeOutMe(60);
                } catch (_) {}
                SceneManager.exit();
                break;
        }
    }

    function fadeOutMusic(duration) {
        // Aplicar fade out na BGM da tela de título
        if (AudioManager._bgmBuffer) {
            const durationSeconds = duration / 1000;
            AudioManager.fadeOutBgm(durationSeconds);
            logger.info(`🎵 Fade out de música aplicado (${duration}ms)`);
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
