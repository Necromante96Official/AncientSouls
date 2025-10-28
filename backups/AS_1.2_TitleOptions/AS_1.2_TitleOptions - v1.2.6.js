//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.2.6 ☆ Interface HTML moderna para opções com estética medieval fantástica
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_1.1_TitleScreenUI
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Title Options (Sub-agente)
 * --------------------------------------------------------------------------
 * Interface HTML dinâmica e animada para tela de opções com design moderno
 * medieval fantasia, incluindo sistema de abas, sliders, toggles e selects.
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleOptions = AS.TitleOptions || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.2_TitleOptions';
    const MODULE_VERSION = '1.2.6';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    const logger = {
        info(message) {
            console.log(`🛡️ [${MODULE_ID}] ${message}`);
        },
        warn(message) {
            console.warn(`⚠️ [${MODULE_ID}] ${message}`);
        },
        error(message) {
            console.error(`❌ [${MODULE_ID}] ${message}`);
        }
    };

    const PATHS = {
        css: 'js/plugins/assets/contents/css/AS_1.2_TitleOptions.css',
        html: 'js/plugins/assets/contents/html/AS_1.2_TitleOptions.html'
    };

    const CONFIG_DEFAULTS = {
        masterVolume: 80,
        messageSpeed: 'normal',
        effectQuality: 'medium',
        enableLogoAnimation: true,
        animationSpeed: 4.0,
        enableMusicFade: true,
        musicFadeDuration: 1000,
        logoGroupOffsetX: 0,
        logoGroupOffsetY: 0,
        logoGroupScale: 1,
        logoBaseOffsetX: 0,
        logoBaseOffsetY: 0,
        logoBaseScale: 1,
        logoTextOffsetX: 0,
        logoTextOffsetY: 0,
        logoTextScale: 1,
        logoDarkOffsetX: 0,
        logoDarkOffsetY: 0,
        logoDarkScale: 1,
        logoLightOffsetX: 0,
        logoLightOffsetY: 0,
        logoLightScale: 1,
        bichimSpeed: 5,
        bichimAcceleration: 6,
        cameraSpeed: 5,
        controlMode: 'sensor'
    };

    const LOGO_LAYOUT_MAP = {
        group: {
            offsetXKey: 'logoGroupOffsetX',
            offsetYKey: 'logoGroupOffsetY',
            scaleKey: 'logoGroupScale'
        },
        base: {
            offsetXKey: 'logoBaseOffsetX',
            offsetYKey: 'logoBaseOffsetY',
            scaleKey: 'logoBaseScale'
        },
        text: {
            offsetXKey: 'logoTextOffsetX',
            offsetYKey: 'logoTextOffsetY',
            scaleKey: 'logoTextScale'
        },
        dark: {
            offsetXKey: 'logoDarkOffsetX',
            offsetYKey: 'logoDarkOffsetY',
            scaleKey: 'logoDarkScale'
        },
        light: {
            offsetXKey: 'logoLightOffsetX',
            offsetYKey: 'logoLightOffsetY',
            scaleKey: 'logoLightScale'
        }
    };

    const UI_RESET_DEFAULTS = Object.freeze({
        masterVolume: CONFIG_DEFAULTS.masterVolume,
        bgmVolume: 90,
        seVolume: 80,
        messageSpeed: CONFIG_DEFAULTS.messageSpeed,
        alwaysDash: true,
        fullscreen: false,
        effectQuality: CONFIG_DEFAULTS.effectQuality,
        enableLogoAnimation: CONFIG_DEFAULTS.enableLogoAnimation,
        animationSpeed: CONFIG_DEFAULTS.animationSpeed,
        enableMusicFade: CONFIG_DEFAULTS.enableMusicFade,
        musicFadeDuration: CONFIG_DEFAULTS.musicFadeDuration,
        bichimSpeed: CONFIG_DEFAULTS.bichimSpeed,
        bichimAcceleration: CONFIG_DEFAULTS.bichimAcceleration,
        cameraSpeed: CONFIG_DEFAULTS.cameraSpeed,
        controlMode: CONFIG_DEFAULTS.controlMode
    });

    const APPLY_CLOSE_DELAY = 240;
    const TOAST_DISPLAY_DURATION = 2000;

    ensureConfigExtensions();
    ensureMasterVolumeSupport();

    let rootElement = null;
    let tabs = [];
    let panels = [];
    let detachKeyHandler = null;
    let detachScrollHandler = null;
    let detachResizeHandler = null;
    let contextRef = null;
    let configValues = {};
    let toastTimer = null;
    let pendingCloseHandle = null;

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Options UI',
        dependencies: DEPENDENCIES,
        init: context => {
            contextRef = context;
            applySceneHooks();
            logger.info('Sistema de opções HTML inicializado.');
            return {};
        },
        cleanup: () => {
            destroyMarkup();
            logger.info('Interface de opções removida.');
        }
    };

    function ensureConfigExtensions() {
        if (ConfigManager._asTitleOptionsPatched) {
            return;
        }
        ConfigManager._asTitleOptionsPatched = true;

        Object.keys(CONFIG_DEFAULTS).forEach(key => {
            if (ConfigManager[key] === undefined) {
                ConfigManager[key] = CONFIG_DEFAULTS[key];
            }
        });

        const originalMakeData = ConfigManager.makeData.bind(ConfigManager);
        const originalApplyData = ConfigManager.applyData.bind(ConfigManager);

        ConfigManager.makeData = function() {
            const config = originalMakeData();
            config.masterVolume = resolveNumber(this.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100);
            config.messageSpeed = resolveString(this.messageSpeed, CONFIG_DEFAULTS.messageSpeed);
            config.effectQuality = resolveString(this.effectQuality, CONFIG_DEFAULTS.effectQuality);
            config.enableLogoAnimation = resolveBoolean(this.enableLogoAnimation, CONFIG_DEFAULTS.enableLogoAnimation);
            config.animationSpeed = resolveNumber(this.animationSpeed, CONFIG_DEFAULTS.animationSpeed, 1, 10);
            config.enableMusicFade = resolveBoolean(this.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade);
            config.musicFadeDuration = resolveNumber(this.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000);
            config.logoGroupOffsetX = resolveNumber(this.logoGroupOffsetX, CONFIG_DEFAULTS.logoGroupOffsetX, -2000, 2000);
            config.logoGroupOffsetY = resolveNumber(this.logoGroupOffsetY, CONFIG_DEFAULTS.logoGroupOffsetY, -2000, 2000);
            config.logoGroupScale = resolveNumber(this.logoGroupScale, CONFIG_DEFAULTS.logoGroupScale, 0.1, 4);
            config.logoBaseOffsetX = resolveNumber(this.logoBaseOffsetX, CONFIG_DEFAULTS.logoBaseOffsetX, -2000, 2000);
            config.logoBaseOffsetY = resolveNumber(this.logoBaseOffsetY, CONFIG_DEFAULTS.logoBaseOffsetY, -2000, 2000);
            config.logoBaseScale = resolveNumber(this.logoBaseScale, CONFIG_DEFAULTS.logoBaseScale, 0.1, 4);
            config.logoTextOffsetX = resolveNumber(this.logoTextOffsetX, CONFIG_DEFAULTS.logoTextOffsetX, -2000, 2000);
            config.logoTextOffsetY = resolveNumber(this.logoTextOffsetY, CONFIG_DEFAULTS.logoTextOffsetY, -2000, 2000);
            config.logoTextScale = resolveNumber(this.logoTextScale, CONFIG_DEFAULTS.logoTextScale, 0.1, 4);
            config.logoDarkOffsetX = resolveNumber(this.logoDarkOffsetX, CONFIG_DEFAULTS.logoDarkOffsetX, -2000, 2000);
            config.logoDarkOffsetY = resolveNumber(this.logoDarkOffsetY, CONFIG_DEFAULTS.logoDarkOffsetY, -2000, 2000);
            config.logoDarkScale = resolveNumber(this.logoDarkScale, CONFIG_DEFAULTS.logoDarkScale, 0.1, 4);
            config.logoLightOffsetX = resolveNumber(this.logoLightOffsetX, CONFIG_DEFAULTS.logoLightOffsetX, -2000, 2000);
            config.logoLightOffsetY = resolveNumber(this.logoLightOffsetY, CONFIG_DEFAULTS.logoLightOffsetY, -2000, 2000);
            config.logoLightScale = resolveNumber(this.logoLightScale, CONFIG_DEFAULTS.logoLightScale, 0.1, 4);
            config.bichimSpeed = resolveNumber(this.bichimSpeed, CONFIG_DEFAULTS.bichimSpeed, 0, 10);
            config.bichimAcceleration = resolveNumber(this.bichimAcceleration, CONFIG_DEFAULTS.bichimAcceleration, 0, 10);
            config.cameraSpeed = resolveNumber(this.cameraSpeed, CONFIG_DEFAULTS.cameraSpeed, 1, 10);
            config.controlMode = resolveString(this.controlMode, CONFIG_DEFAULTS.controlMode);
            return config;
        };

        ConfigManager.applyData = function(config) {
            originalApplyData(config);
            this.masterVolume = resolveNumber(config.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100);
            this.messageSpeed = resolveString(config.messageSpeed, CONFIG_DEFAULTS.messageSpeed);
            this.effectQuality = resolveString(config.effectQuality, CONFIG_DEFAULTS.effectQuality);
            this.enableLogoAnimation = resolveBoolean(config.enableLogoAnimation, CONFIG_DEFAULTS.enableLogoAnimation);
            this.animationSpeed = resolveNumber(config.animationSpeed, CONFIG_DEFAULTS.animationSpeed, 1, 10);
            this.enableMusicFade = resolveBoolean(config.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade);
            this.musicFadeDuration = resolveNumber(config.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000);
            this.logoGroupOffsetX = resolveNumber(config.logoGroupOffsetX, CONFIG_DEFAULTS.logoGroupOffsetX, -2000, 2000);
            this.logoGroupOffsetY = resolveNumber(config.logoGroupOffsetY, CONFIG_DEFAULTS.logoGroupOffsetY, -2000, 2000);
            this.logoGroupScale = resolveNumber(config.logoGroupScale, CONFIG_DEFAULTS.logoGroupScale, 0.1, 4);
            this.logoBaseOffsetX = resolveNumber(config.logoBaseOffsetX, CONFIG_DEFAULTS.logoBaseOffsetX, -2000, 2000);
            this.logoBaseOffsetY = resolveNumber(config.logoBaseOffsetY, CONFIG_DEFAULTS.logoBaseOffsetY, -2000, 2000);
            this.logoBaseScale = resolveNumber(config.logoBaseScale, CONFIG_DEFAULTS.logoBaseScale, 0.1, 4);
            this.logoTextOffsetX = resolveNumber(config.logoTextOffsetX, CONFIG_DEFAULTS.logoTextOffsetX, -2000, 2000);
            this.logoTextOffsetY = resolveNumber(config.logoTextOffsetY, CONFIG_DEFAULTS.logoTextOffsetY, -2000, 2000);
            this.logoTextScale = resolveNumber(config.logoTextScale, CONFIG_DEFAULTS.logoTextScale, 0.1, 4);
            this.logoDarkOffsetX = resolveNumber(config.logoDarkOffsetX, CONFIG_DEFAULTS.logoDarkOffsetX, -2000, 2000);
            this.logoDarkOffsetY = resolveNumber(config.logoDarkOffsetY, CONFIG_DEFAULTS.logoDarkOffsetY, -2000, 2000);
            this.logoDarkScale = resolveNumber(config.logoDarkScale, CONFIG_DEFAULTS.logoDarkScale, 0.1, 4);
            this.logoLightOffsetX = resolveNumber(config.logoLightOffsetX, CONFIG_DEFAULTS.logoLightOffsetX, -2000, 2000);
            this.logoLightOffsetY = resolveNumber(config.logoLightOffsetY, CONFIG_DEFAULTS.logoLightOffsetY, -2000, 2000);
            this.logoLightScale = resolveNumber(config.logoLightScale, CONFIG_DEFAULTS.logoLightScale, 0.1, 4);
            this.bichimSpeed = resolveNumber(config.bichimSpeed, CONFIG_DEFAULTS.bichimSpeed, 0, 10);
            this.bichimAcceleration = resolveNumber(config.bichimAcceleration, CONFIG_DEFAULTS.bichimAcceleration, 0, 10);
            this.cameraSpeed = resolveNumber(config.cameraSpeed, CONFIG_DEFAULTS.cameraSpeed, 1, 10);
            this.controlMode = resolveString(config.controlMode, CONFIG_DEFAULTS.controlMode);

            if (!Object.prototype.hasOwnProperty.call(config, 'bgsVolume')) {
                this.bgsVolume = this.bgmVolume;
            }
            if (!Object.prototype.hasOwnProperty.call(config, 'meVolume')) {
                this.meVolume = this.bgmVolume;
            }
        };
    }

    function ensureMasterVolumeSupport() {
        if (typeof AudioManager === 'undefined') {
            return;
        }
        if (AudioManager._asMasterVolumePatched) {
            syncMasterVolume(ConfigManager ? ConfigManager.masterVolume : CONFIG_DEFAULTS.masterVolume);
            return;
        }
        AudioManager._asMasterVolumePatched = true;

        const originalUpdateBufferParameters = AudioManager.updateBufferParameters;
        AudioManager.updateBufferParameters = function(buffer, configVolume, audio) {
            if (!buffer || !audio) {
                return originalUpdateBufferParameters.call(this, buffer, configVolume, audio);
            }
            const masterFactor = clampNumber(this._asMasterVolume !== undefined ? this._asMasterVolume : 1, 0, 1);
            const adjustedVolume = clampNumber(configVolume * masterFactor, 0, 100);
            return originalUpdateBufferParameters.call(this, buffer, adjustedVolume, audio);
        };

        const originalUpdateSeParameters = AudioManager.updateSeParameters;
        AudioManager.updateSeParameters = function(buffer, se) {
            if (buffer) {
                buffer._reservedSe = se;
            }
            return originalUpdateSeParameters.call(this, buffer, se);
        };

        if (!Array.isArray(AudioManager._staticBuffers)) {
            AudioManager._staticBuffers = [];
        }

        AudioManager._asMasterVolume = 1;
        syncMasterVolume(ConfigManager ? ConfigManager.masterVolume : CONFIG_DEFAULTS.masterVolume);
    }

    function syncMasterVolume(value) {
        if (typeof AudioManager === 'undefined') {
            return;
        }
        const normalized = resolveNumber(value, CONFIG_DEFAULTS.masterVolume, 0, 100);
        AudioManager._asMasterVolume = clampNumber(normalized / 100, 0, 1);
        refreshAudioMasterVolume();
    }

    function refreshAudioMasterVolume() {
        if (typeof AudioManager === 'undefined') {
            return;
        }
        try {
            if (AudioManager._currentBgm && AudioManager._bgmBuffer) {
                AudioManager.updateBgmParameters(AudioManager._currentBgm);
            }
            if (AudioManager._currentBgs && AudioManager._bgsBuffer) {
                AudioManager.updateBgsParameters(AudioManager._currentBgs);
            }
            if (AudioManager._currentMe && AudioManager._meBuffer) {
                AudioManager.updateMeParameters(AudioManager._currentMe);
            }
            if (Array.isArray(AudioManager._seBuffers)) {
                AudioManager._seBuffers.forEach(buffer => {
                    if (buffer && buffer._reservedSe) {
                        AudioManager.updateBufferParameters(buffer, AudioManager._seVolume, buffer._reservedSe);
                    }
                });
            }
            if (Array.isArray(AudioManager._staticBuffers)) {
                AudioManager._staticBuffers.forEach(buffer => {
                    if (buffer && buffer._reservedSe) {
                        AudioManager.updateBufferParameters(buffer, AudioManager._seVolume, buffer._reservedSe);
                    }
                });
            }
        } catch (error) {
            logger.warn(`[refreshAudioMasterVolume] Falha ao atualizar buffers: ${error.message}`);
        }
    }

    function resolveNumber(value, fallback, min, max) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return fallback;
        }
        return clampNumber(numeric, min, max);
    }

    function resolveBoolean(value, fallback) {
        if (value === undefined || value === null) {
            return fallback;
        }
        return !!value;
    }

    function resolveString(value, fallback) {
        if (typeof value === 'string' && value.length > 0) {
            return value;
        }
        return fallback;
    }

    function clampNumber(value, min, max) {
        let result = value;
        if (typeof min === 'number') {
            result = Math.max(min, result);
        }
        if (typeof max === 'number') {
            result = Math.min(max, result);
        }
        return result;
    }

    function applySceneHooks() {
        // Desabilitar botão de cancelar padrão do RPG Maker
        const Scene_Options_needsCancelButton = Scene_Options.prototype.needsCancelButton;
        Scene_Options.prototype.needsCancelButton = function() {
            return false; // Desabilita o botão padrão
        };

        const Scene_Options_create = Scene_Options.prototype.create;
        Scene_Options.prototype.create = function() {
            Scene_Options_create.call(this);
            this._asOptionsActive = false;
            if (this._cancelButton) {
                this._cancelButton.visible = false;
            }
        };

        const Scene_Options_start = Scene_Options.prototype.start;
        Scene_Options.prototype.start = function() {
            try {
                logger.info('[Scene_Options] Iniciando start...');
                Scene_Options_start.call(this);
                logger.info('[Scene_Options] Scene_Options_start concluído');

                if (this._optionsWindow) {
                    this._optionsWindow.deactivate();
                    this._optionsWindow.hide();
                    logger.info('[Scene_Options] Window escondida');
                }
                if (this._cancelButton) {
                    this._cancelButton.visible = false;
                    logger.info('[Scene_Options] Botão cancelar escondido');
                }

                logger.info('[Scene_Options] Injetando estilos...');
                injectStyles();
                logger.info('[Scene_Options] Injetando markup...');
                injectMarkup();
                logger.info('[Scene_Options] Carregando valores de config...');
                loadConfigValues();
                logger.info('[Scene_Options] Vinculando controles...');
                bindControls();
                logger.info('[Scene_Options] Mostrando opções...');
                showOptions();

                this._asOptionsActive = true;
                logger.info('[Scene_Options] Start concluído com sucesso!');
            } catch (error) {
                logger.error(`[Scene_Options] ERRO ao iniciar: ${error.message}`);
                logger.error(`[Scene_Options] Stack: ${error.stack}`);
                console.error('ERRO COMPLETO:', error);
                recoverVanillaOptions(this);
            }
        };

        const Scene_Options_terminate = Scene_Options.prototype.terminate;
        Scene_Options.prototype.terminate = function() {
            if (this._asOptionsActive) {
                hideOptions();
                destroyMarkup();
                this._asOptionsActive = false;
            }
            Scene_Options_terminate.call(this);
        };
    }

    function recoverVanillaOptions(scene) {
        try {
            hideOptions();
            destroyMarkup();

            if (scene && scene._optionsWindow) {
                scene._optionsWindow.show();
                scene._optionsWindow.activate();
                logger.warn('[Scene_Options] Fallback ativado: exibindo janela padrão de opções.');
            }

            if (scene && scene._cancelButton) {
                scene._cancelButton.visible = true;
            }

            if (scene) {
                scene._asOptionsActive = false;
            }
        } catch (fallbackError) {
            logger.error(`[Scene_Options] Falha ao restaurar fallback: ${fallbackError.message}`);
        }
    }

    function injectStyles() {
        const css = loadAsset(PATHS.css);
        if (!css) {
            logger.warn('CSS não carregado.');
            return;
        }
        const style = document.createElement('style');
        style.id = `${MODULE_ID}-style`;
        style.textContent = css;
        document.head.appendChild(style);
        logger.info('Estilos da tela de opções injetados.');
    }

    function injectMarkup() {
        const html = loadAsset(PATHS.html);
        if (!html) {
            logger.error('HTML não encontrado.');
            return;
        }
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        rootElement = wrapper.firstElementChild;
        
        if (!rootElement) {
            logger.error('Falha ao criar rootElement a partir do HTML.');
            return;
        }
        
        document.body.appendChild(rootElement);
        
        tabs = Array.from(rootElement.querySelectorAll('.as-options__tab'));
        panels = Array.from(rootElement.querySelectorAll('.as-options__panel'));

        initializeTabState();
        alignOverlayWithCanvas();

        logger.info('Markup HTML da tela de opções inserido.');
        logger.info(`Tabs encontradas: ${tabs.length}, Panels encontrados: ${panels.length}`);
    }

    function destroyMarkup() {
        detachKeyboardSupport();
        if (pendingCloseHandle) {
            clearTimeout(pendingCloseHandle);
            pendingCloseHandle = null;
        }
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
        if (detachScrollHandler) {
            detachScrollHandler();
            detachScrollHandler = null;
        }
        if (detachResizeHandler) {
            detachResizeHandler();
            detachResizeHandler = null;
        }
        if (rootElement) {
            const feedbackElement = rootElement.querySelector('#optionsFeedback');
            if (feedbackElement) {
                feedbackElement.classList.remove('as-options__feedback--visible');
                feedbackElement.textContent = '';
            }
        }
        if (rootElement && rootElement.parentNode) {
            rootElement.parentNode.removeChild(rootElement);
        }
        rootElement = null;
        tabs = [];
        panels = [];
        
        const style = document.getElementById(`${MODULE_ID}-style`);
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }

    function alignOverlayWithCanvas() {
        if (!rootElement) {
            return;
        }

        try {
            const canvas = (typeof Graphics !== 'undefined') ? Graphics._canvas : null;
            const docElement = document.documentElement;
            const body = document.body;
            const viewportWidth = window.innerWidth || (docElement ? docElement.clientWidth : 0) || (body ? body.clientWidth : 0);
            const viewportHeight = window.innerHeight || (docElement ? docElement.clientHeight : 0) || (body ? body.clientHeight : 0);

            if (canvas && typeof canvas.getBoundingClientRect === 'function') {
                const rect = canvas.getBoundingClientRect();
                rootElement.style.left = `${rect.left}px`;
                rootElement.style.right = `${Math.max(0, viewportWidth - rect.right)}px`;
                rootElement.style.top = `${rect.top}px`;
                rootElement.style.bottom = `${Math.max(0, viewportHeight - rect.bottom)}px`;
            } else {
                rootElement.style.left = '0';
                rootElement.style.right = '0';
                rootElement.style.top = '0';
                rootElement.style.bottom = '0';
            }
        } catch (error) {
            logger.warn(`[alignOverlayWithCanvas] Falha ao alinhar overlay: ${error.message}`);
        }
    }

    function attachResizeHandler() {
        if (detachResizeHandler) {
            return;
        }

        const handler = () => alignOverlayWithCanvas();
        window.addEventListener('resize', handler);

        if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
            window.visualViewport.addEventListener('resize', handler);
            detachResizeHandler = () => {
                window.removeEventListener('resize', handler);
                if (window.visualViewport && typeof window.visualViewport.removeEventListener === 'function') {
                    window.visualViewport.removeEventListener('resize', handler);
                }
            };
        } else {
            detachResizeHandler = () => {
                window.removeEventListener('resize', handler);
            };
        }

        alignOverlayWithCanvas();
    }

    function initializeTabState() {
        if (!tabs.length || !panels.length) {
            return;
        }
        const activeTab = tabs.find(tab => tab.classList.contains('as-options__tab--active')) || tabs[0];
        if (!activeTab) {
            return;
        }
        const targetTab = activeTab.dataset.tab;
        if (targetTab) {
            switchTab(targetTab, false);
        }
    }

    function loadConfigValues() {
        configValues = {
            alwaysDash: resolveBoolean(ConfigManager.alwaysDash, false),
            commandRemember: resolveBoolean(ConfigManager.commandRemember, false),
            touchUI: resolveBoolean(ConfigManager.touchUI, true),
            bgmVolume: resolveNumber(ConfigManager.bgmVolume, 90, 0, 100),
            bgsVolume: resolveNumber(ConfigManager.bgsVolume, 90, 0, 100),
            meVolume: resolveNumber(ConfigManager.meVolume, 90, 0, 100),
            seVolume: resolveNumber(ConfigManager.seVolume, 90, 0, 100),
            messageSpeed: resolveString(ConfigManager.messageSpeed, 'normal')
        };

        updateUIFromConfig();
    }

    function updateUIFromConfig() {
        if (!rootElement) {
            logger.warn('updateUIFromConfig: rootElement não existe ainda.');
            return;
        }
        
        const setValue = (id, value) => {
            const element = rootElement.querySelector(`#${id}`);
            if (!element) return;
            
            if (element.type === 'range') {
                const numericValue = Number(value);
                element.value = numericValue;
                setSliderFill(element, numericValue);
                const valueDisplay = rootElement.querySelector(`#${id}Value`);
                if (valueDisplay) {
                    valueDisplay.textContent = `${numericValue}%`;
                }
            } else if (element.type === 'checkbox') {
                element.checked = value;
            } else if (element.tagName === 'SELECT') {
                element.value = value;
            }
        };

        setValue('alwaysDash', configValues.alwaysDash);
        setValue('commandRemember', configValues.commandRemember);
        setValue('touchUI', configValues.touchUI);
        setValue('bgmVolume', configValues.bgmVolume);
        setValue('bgsVolume', configValues.bgsVolume);
        setValue('meVolume', configValues.meVolume);
        setValue('seVolume', configValues.seVolume);
        setValue('messageSpeed', configValues.messageSpeed);
    }

    function bindControls() {
        if (!rootElement) {
            logger.error('[bindControls] rootElement não existe!');
            return;
        }
        
        logger.info(`[bindControls] Vinculando ${tabs.length} tabs...`);
        tabs.forEach(tab => {
            tab.addEventListener('click', onTabClick);
        });

        // Vincular também os botões de segmento no header
        const segments = rootElement.querySelectorAll('.as-options__segment');
        segments.forEach(segment => {
            segment.addEventListener('click', onTabClick);
        });

        logger.info('[bindControls] Vinculando sliders...');
        bindSlider('bgmVolume');
        bindSlider('bgsVolume');
        bindSlider('meVolume');
        bindSlider('seVolume');

        logger.info('[bindControls] Vinculando selects...');
        bindSelect('messageSpeed');

        logger.info('[bindControls] Vinculando toggles...');
        bindToggle('alwaysDash');
        bindToggle('commandRemember');
        bindToggle('touchUI');

        enableScrollWheelSupport();

        logger.info('[bindControls] Botão Enter para salvar configurações...');
        const applyButton = rootElement.querySelector('#applyButton');
        if (applyButton) {
            applyButton.addEventListener('click', onApply);
            logger.info('[bindControls] Botão Apply vinculado');
        } else {
            logger.warn('[bindControls] Botão Apply não encontrado!');
        }

        const resetButton = rootElement.querySelector('#resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', onReset);
            logger.info('[bindControls] Botão Reset vinculado');
        }

        const cancelButton = rootElement.querySelector('#cancelButton');
        if (cancelButton) {
            cancelButton.addEventListener('click', onCancel);
            logger.info('[bindControls] Botão Cancel vinculado');
        }

        const closeButton = rootElement.querySelector('#closeButton');
        if (closeButton) {
            closeButton.addEventListener('click', onCancel);
            logger.info('[bindControls] Botão Close vinculado');
        }

        // Vincular botões da criatura
        const creatureButtons = rootElement.querySelectorAll('.as-options__creature-btn');
        creatureButtons.forEach(btn => {
            const label = btn.textContent.toLowerCase();
            if (label.includes('voltar')) {
                btn.addEventListener('click', onCancel);
            }
        });

        attachKeyboardSupport();
        logger.info('[bindControls] Controles vinculados com sucesso!');
    }

    function onTabClick(event) {
        const tabName = event.currentTarget.dataset.tab;
        switchTab(tabName);
    }

    function switchTab(tabName, playSound = true) {
        // Atualizar tabs laterais
        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabName;
            tab.classList.toggle('as-options__tab--active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });

        // Atualizar segmentos do header
        const segments = rootElement.querySelectorAll('.as-options__segment');
        segments.forEach(segment => {
            const isActive = segment.dataset.tab === tabName;
            segment.classList.toggle('as-options__segment--active', isActive);
            segment.setAttribute('aria-selected', String(isActive));
        });

        // Atualizar painéis
        panels.forEach(panel => {
            const isActive = panel.dataset.panel === tabName;
            panel.classList.toggle('as-options__panel--active', isActive);
            if (isActive) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });

        if (playSound) {
            SoundManager.playCursor();
        }
    }

    function handleTabNavigation(direction) {
        if (!tabs || tabs.length === 0) {
            return;
        }
        const currentIndex = tabs.findIndex(tab => tab.classList.contains('as-options__tab--active'));
        if (currentIndex < 0) {
            return;
        }
        const delta = direction === 'next' ? 1 : -1;
        const nextIndex = (currentIndex + delta + tabs.length) % tabs.length;
        const nextTab = tabs[nextIndex];
        if (nextTab) {
            nextTab.focus();
            switchTab(nextTab.dataset.tab);
        }
    }

    function formatSliderDisplay(id, value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            if (id === 'animationSpeed') {
                return '0.0s';
            }
            if (id === 'musicFadeDuration') {
                return '0ms';
            }
            return '0%';
        }
        if (id === 'animationSpeed') {
            return `${numeric.toFixed(1)}s`;
        }
        if (id === 'musicFadeDuration') {
            return `${Math.round(numeric)}ms`;
        }
        return `${Math.round(numeric)}%`;
    }

    function setSliderFill(slider, value) {
        if (!slider) {
            return;
        }
        const min = Number(slider.min || 0);
        const max = Number(slider.max || 100);
        const range = max - min;
        const percent = range > 0 ? ((value - min) / range) * 100 : 0;
        const safePercent = Number.isFinite(percent) ? percent : 0;
        const clamped = clampNumber(safePercent, 0, 100);
        slider.style.setProperty('--as-slider-progress', `${clamped}%`);
    }

    function bindSlider(id) {
        const slider = rootElement.querySelector(`#${id}`);
        const valueDisplay = rootElement.querySelector(`#${id}Value`);
        
        if (!slider || !valueDisplay) {
            logger.warn(`[bindSlider] Elementos não encontrados para: ${id}`);
            return;
        }

        const updateDisplay = value => {
            valueDisplay.textContent = formatSliderDisplay(id, value);
            setSliderFill(slider, value);
        };

        slider.addEventListener('input', event => {
            const value = Number(event.target.value);
            configValues[id] = value;
            updateDisplay(value);
            previewLiveChange(id, value);
        });

        updateDisplay(Number(slider.value));
        
        logger.info(`[bindSlider] Slider ${id} vinculado`);
    }

    function bindSelect(id) {
        const select = rootElement.querySelector(`#${id}`);
        if (!select) {
            logger.warn(`[bindSelect] Select não encontrado para: ${id}`);
            return;
        }

        select.addEventListener('change', (e) => {
            configValues[id] = e.target.value;
            SoundManager.playCursor();
        });
        
        logger.info(`[bindSelect] Select ${id} vinculado`);
    }

    function previewLiveChange(id, value) {
        try {
            switch (id) {
                case 'bgmVolume': {
                    const normalized = resolveNumber(value, ConfigManager.bgmVolume, 0, 100);
                    AudioManager.bgmVolume = normalized;
                    AudioManager.bgsVolume = normalized;
                    AudioManager.meVolume = normalized;
                    break;
                }
                case 'seVolume': {
                    const normalized = resolveNumber(value, ConfigManager.seVolume, 0, 100);
                    AudioManager.seVolume = normalized;
                    break;
                }
                case 'masterVolume':
                    syncMasterVolume(value);
                    break;
                default:
                    break;
            }
        } catch (error) {
            logger.warn(`[previewLiveChange] Falha ao aplicar prévia de ${id}: ${error.message}`);
        }
    }

    function bindToggle(id) {
        const toggle = rootElement.querySelector(`#${id}`);
        if (!toggle) {
            logger.warn(`[bindToggle] Toggle não encontrado para: ${id}`);
            return;
        }

        toggle.addEventListener('change', (e) => {
            configValues[id] = e.target.checked;
            
            if (id === 'fullscreen') {
                if (e.target.checked) {
                    Graphics._requestFullScreen();
                } else {
                    Graphics._cancelFullScreen();
                }
            }
            
            SoundManager.playCursor();
        });
        
        logger.info(`[bindToggle] Toggle ${id} vinculado`);
    }

    function bindControlModeButtons() {
        const modeButtons = rootElement.querySelectorAll('.as-options__mode-btn');
        if (!modeButtons || modeButtons.length === 0) {
            logger.warn('[bindControlModeButtons] Botões de modo não encontrados');
            return;
        }

        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                if (mode) {
                    configValues.controlMode = mode;
                    updateControlModeButtons(mode);
                    SoundManager.playCursor();
                }
            });
        });

        logger.info('[bindControlModeButtons] Botões de modo vinculados');
    }

    function updateControlModeButtons(mode) {
        const modeButtons = rootElement.querySelectorAll('.as-options__mode-btn');
        modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('as-options__mode-btn--active');
            } else {
                btn.classList.remove('as-options__mode-btn--active');
            }
        });
    }

    function bindSliderButtons() {
        const sliderButtons = rootElement.querySelectorAll('.as-options__slider-btn');
        
        sliderButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = e.currentTarget.closest('.as-options__slider-container');
                if (!container) return;
                
                const slider = container.querySelector('.as-options__slider');
                if (!slider) return;
                
                const label = e.currentTarget.getAttribute('aria-label');
                const currentValue = Number(slider.value);
                const min = Number(slider.min);
                const max = Number(slider.max);
                const step = Number(slider.step) || 1;
                
                let newValue = currentValue;
                if (label === 'Aumentar') {
                    newValue = Math.min(max, currentValue + step);
                } else if (label === 'Diminuir') {
                    newValue = Math.max(min, currentValue - step);
                }
                
                if (newValue !== currentValue) {
                    slider.value = newValue;
                    const id = slider.id;
                    configValues[id] = newValue;
                    
                    const valueDisplay = container.querySelector(`#${id}Value`);
                    if (valueDisplay) {
                        valueDisplay.textContent = newValue;
                    }
                    
                    setSliderFill(slider, newValue);
                    SoundManager.playCursor();
                }
            });
        });
        
        logger.info('[bindSliderButtons] Botões de slider vinculados');
    }

    function enableScrollWheelSupport() {
        if (detachScrollHandler) {
            detachScrollHandler();
            detachScrollHandler = null;
        }

        if (!rootElement) {
            logger.warn('[enableScrollWheelSupport] rootElement ausente.');
            return;
        }

        const scrollArea = rootElement.querySelector('.as-options__panels');
        if (!scrollArea) {
            logger.warn('[enableScrollWheelSupport] Área de rolagem não encontrada.');
            return;
        }

        const onWheel = event => {
            if (event.deltaY === 0 && event.deltaX === 0) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            scrollArea.scrollBy({
                top: event.deltaY,
                left: event.deltaX,
                behavior: 'auto'
            });
        };

        const onTouchMove = event => {
            event.stopPropagation();
        };

        scrollArea.addEventListener('wheel', onWheel, { passive: false });
        scrollArea.addEventListener('touchmove', onTouchMove, { passive: false });

        detachScrollHandler = () => {
            scrollArea.removeEventListener('wheel', onWheel);
            scrollArea.removeEventListener('touchmove', onTouchMove);
        };

        logger.info('[enableScrollWheelSupport] Rolagem com scroll do mouse habilitada.');
    }

    function onApply() {
        SoundManager.playOk();
        saveConfigValues();
        showFeedback('Configurações aplicadas!');
        if (pendingCloseHandle) {
            clearTimeout(pendingCloseHandle);
        }
        pendingCloseHandle = setTimeout(() => {
            pendingCloseHandle = null;
            SceneManager.pop();
        }, APPLY_CLOSE_DELAY);
    }

    function onReset() {
        SoundManager.playCancel();
        applyResetDefaults();
        showFeedback('Configurações restauradas. Aplique para confirmar.');
    }

    function onCancel() {
        SoundManager.playCancel();
        if (pendingCloseHandle) {
            clearTimeout(pendingCloseHandle);
            pendingCloseHandle = null;
        }
        SceneManager.pop();
    }

    function saveConfigValues() {
        const bgmVolume = resolveNumber(configValues.bgmVolume, 90, 0, 100);
        const bgsVolume = resolveNumber(configValues.bgsVolume, 90, 0, 100);
        const meVolume = resolveNumber(configValues.meVolume, 90, 0, 100);
        const seVolume = resolveNumber(configValues.seVolume, 90, 0, 100);

        ConfigManager.alwaysDash = resolveBoolean(configValues.alwaysDash, false);
        ConfigManager.commandRemember = resolveBoolean(configValues.commandRemember, false);
        ConfigManager.touchUI = resolveBoolean(configValues.touchUI, true);
        ConfigManager.bgmVolume = bgmVolume;
        ConfigManager.bgsVolume = bgsVolume;
        ConfigManager.meVolume = meVolume;
        ConfigManager.seVolume = seVolume;
        ConfigManager.messageSpeed = resolveString(configValues.messageSpeed, 'normal');

        const saveResult = ConfigManager.save();
        if (saveResult && typeof saveResult.catch === 'function') {
            saveResult.catch(error => logger.warn(`[saveConfigValues] Falha ao salvar config: ${error.message}`));
        }

        AudioManager.bgmVolume = bgmVolume;
        AudioManager.bgsVolume = bgsVolume;
        AudioManager.meVolume = meVolume;
        AudioManager.seVolume = seVolume;

        logger.info('Configurações salvas com sucesso.');
    }

    function applyResetDefaults() {
        configValues = Object.assign({}, UI_RESET_DEFAULTS);
        updateUIFromConfig();
        syncMasterVolume(configValues.masterVolume);
        previewLiveChange('bgmVolume', configValues.bgmVolume);
        previewLiveChange('seVolume', configValues.seVolume);
        if (Graphics._isFullScreen() && !configValues.fullscreen) {
            Graphics._cancelFullScreen();
        }
    }

    function collectLogoLayoutSettings() {
        const settings = {};
        if (!ConfigManager) {
            return settings;
        }
        Object.keys(LOGO_LAYOUT_MAP).forEach(key => {
            const mapping = LOGO_LAYOUT_MAP[key];
            settings[key] = {
                offsetX: resolveNumber(ConfigManager[mapping.offsetXKey], CONFIG_DEFAULTS[mapping.offsetXKey], -2000, 2000),
                offsetY: resolveNumber(ConfigManager[mapping.offsetYKey], CONFIG_DEFAULTS[mapping.offsetYKey], -2000, 2000),
                scale: resolveNumber(ConfigManager[mapping.scaleKey], CONFIG_DEFAULTS[mapping.scaleKey], 0.1, 4)
            };
        });
        return settings;
    }

    function broadcastLogoLayoutUpdate() {
        const settings = collectLogoLayoutSettings();
        try {
            if (contextRef && typeof contextRef.publish === 'function') {
                contextRef.publish('titlescreen:logo:layoutChanged', { settings });
            }
            if (AS && AS.PluginManager && typeof AS.PluginManager.publish === 'function') {
                AS.PluginManager.publish('titlescreen:logo:layoutChanged', { settings });
            }
        } catch (error) {
            logger.warn(`[broadcastLogoLayoutUpdate] Falha ao publicar layout: ${error.message}`);
        }
    }

    function showFeedback(message) {
        if (!rootElement) {
            return;
        }
        const feedbackElement = rootElement.querySelector('#optionsFeedback');
        if (!feedbackElement) {
            return;
        }
        feedbackElement.textContent = message;
        feedbackElement.classList.add('as-options__feedback--visible');
        if (toastTimer) {
            clearTimeout(toastTimer);
        }
        toastTimer = setTimeout(() => {
            feedbackElement.classList.remove('as-options__feedback--visible');
            toastTimer = null;
        }, TOAST_DISPLAY_DURATION);
    }

    function showOptions() {
        if (!rootElement) return;
        
        alignOverlayWithCanvas();
        attachResizeHandler();

        requestAnimationFrame(() => {
            rootElement.classList.add('as-options--visible');
            rootElement.setAttribute('aria-hidden', 'false');
        });
    }

    function hideOptions() {
        if (!rootElement) return;
        
        rootElement.classList.remove('as-options--visible');
        rootElement.setAttribute('aria-hidden', 'true');
    }

    function attachKeyboardSupport() {
        const handler = (event) => {
            if (!rootElement || !rootElement.classList.contains('as-options--visible')) {
                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                onCancel();
            } else if (event.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.id === 'applyButton') {
                    event.preventDefault();
                    onApply();
                } else if (activeElement && activeElement.id === 'cancelButton') {
                    event.preventDefault();
                    onCancel();
                }
            } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList && activeElement.classList.contains('as-options__tab')) {
                    event.preventDefault();
                    const direction = (event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 'next' : 'previous';
                    handleTabNavigation(direction);
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

    function loadAsset(relativePath) {
        if (!Utils.isNwjs()) {
            logger.warn('Ambiente sem Node.js.');
            return '';
        }

        try {
            const fs = require('fs');
            const path = require('path');
            const sanitized = relativePath.replace(/^[/\\]+/, '');
            const baseCandidates = collectBaseCandidates(path);
            const tried = new Set();

            for (const base of baseCandidates) {
                const candidates = buildCandidatePaths(path, base, sanitized);
                for (const candidate of candidates) {
                    if (tried.has(candidate)) {
                        continue;
                    }
                    tried.add(candidate);
                    if (fs.existsSync(candidate)) {
                        return fs.readFileSync(candidate, 'utf8');
                    }
                }
            }

            logger.error(`Erro ao localizar asset: ${relativePath}`);
        } catch (error) {
            logger.error(`Erro ao carregar ${relativePath}: ${error.message}`);
        }

        return '';
    }

    function collectBaseCandidates(pathLib) {
        const bases = [];

        if (typeof process !== 'undefined') {
            if (process.mainModule && process.mainModule.filename) {
                bases.push(pathLib.dirname(process.mainModule.filename));
            }
            if (typeof process.cwd === 'function') {
                bases.push(process.cwd());
            }
            if (process.execPath) {
                bases.push(pathLib.dirname(process.execPath));
            }
        }

        if (typeof require !== 'undefined' && require.main && require.main.filename) {
            bases.push(pathLib.dirname(require.main.filename));
        }

        if (typeof nw !== 'undefined') {
            if (nw.__dirname) {
                bases.push(nw.__dirname);
            }
            if (nw.App && nw.App.startPath) {
                bases.push(nw.App.startPath);
            }
        }

        const uniqueBases = Array.from(new Set(bases.filter(Boolean)));
        return uniqueBases;
    }

    function buildCandidatePaths(pathLib, base, relative) {
        const candidates = [
            pathLib.resolve(base, relative),
            pathLib.resolve(base, 'www', relative),
            pathLib.resolve(base, '..', relative),
            pathLib.resolve(base, '..', 'www', relative)
        ];

        if (/www[\\/]/i.test(base)) {
            candidates.push(pathLib.resolve(base.replace(/www[\\/]?$/i, ''), 'www', relative));
        }

        return Array.from(new Set(candidates));
    }

    if (AS && AS.PluginManager && typeof AS.PluginManager.register === 'function') {
        AS.PluginManager.register(manifest);
    } else {
        logger.error('AS.PluginManager não encontrado.');
    }
})();

//=============================================================================
// Fim de AS_1.2_TitleOptions.js
//=============================================================================
