//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.1.7 ☆ Interface HTML moderna para opções com estética medieval fantástica
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
    const MODULE_VERSION = '1.1.7';
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
        battleMode: 'active',
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
        logoLightScale: 1
    };

    ensureConfigExtensions();

    let rootElement = null;
    let tabs = [];
    let panels = [];
    let detachKeyHandler = null;
    let contextRef = null;
    let configValues = {};

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
            config.battleMode = resolveString(this.battleMode, CONFIG_DEFAULTS.battleMode);
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
            return config;
        };

        ConfigManager.applyData = function(config) {
            originalApplyData(config);
            this.masterVolume = resolveNumber(config.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100);
            this.messageSpeed = resolveString(config.messageSpeed, CONFIG_DEFAULTS.messageSpeed);
            this.battleMode = resolveString(config.battleMode, CONFIG_DEFAULTS.battleMode);
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

            if (!Object.prototype.hasOwnProperty.call(config, 'bgsVolume')) {
                this.bgsVolume = this.bgmVolume;
            }
            if (!Object.prototype.hasOwnProperty.call(config, 'meVolume')) {
                this.meVolume = this.bgmVolume;
            }
        };
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
        
        logger.info('Markup HTML da tela de opções inserido.');
        logger.info(`Tabs encontradas: ${tabs.length}, Panels encontrados: ${panels.length}`);
    }

    function destroyMarkup() {
        detachKeyboardSupport();
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

    function loadConfigValues() {
        configValues = {
            masterVolume: resolveNumber(ConfigManager.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100),
            bgmVolume: resolveNumber(ConfigManager.bgmVolume, 90, 0, 100),
            seVolume: resolveNumber(ConfigManager.seVolume, 80, 0, 100),
            messageSpeed: resolveString(ConfigManager.messageSpeed, CONFIG_DEFAULTS.messageSpeed),
            battleMode: resolveString(ConfigManager.battleMode, CONFIG_DEFAULTS.battleMode),
            alwaysDash: resolveBoolean(ConfigManager.alwaysDash, true),
            fullscreen: Graphics._isFullScreen(),
            effectQuality: resolveString(ConfigManager.effectQuality, CONFIG_DEFAULTS.effectQuality),
            enableLogoAnimation: resolveBoolean(ConfigManager.enableLogoAnimation, CONFIG_DEFAULTS.enableLogoAnimation),
            animationSpeed: resolveNumber(ConfigManager.animationSpeed, CONFIG_DEFAULTS.animationSpeed, 1, 10),
            enableMusicFade: resolveBoolean(ConfigManager.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade),
            musicFadeDuration: resolveNumber(ConfigManager.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000)
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
                element.value = value;
                const valueDisplay = rootElement.querySelector(`#${id}Value`);
                if (valueDisplay) {
                    // Formatar valor de acordo com o tipo
                    if (id === 'animationSpeed') {
                        valueDisplay.textContent = `${value}s`;
                    } else if (id === 'musicFadeDuration') {
                        valueDisplay.textContent = `${value}ms`;
                    } else {
                        valueDisplay.textContent = `${value}%`;
                    }
                }
            } else if (element.type === 'checkbox') {
                element.checked = value;
            } else if (element.tagName === 'SELECT') {
                element.value = value;
            }
        };

        setValue('masterVolume', configValues.masterVolume);
        setValue('bgmVolume', configValues.bgmVolume);
        setValue('seVolume', configValues.seVolume);
        setValue('messageSpeed', configValues.messageSpeed);
        setValue('battleMode', configValues.battleMode);
        setValue('alwaysDash', configValues.alwaysDash);
        setValue('fullscreen', configValues.fullscreen);
        setValue('effectQuality', configValues.effectQuality);
        setValue('enableLogoAnimation', configValues.enableLogoAnimation);
        setValue('animationSpeed', configValues.animationSpeed);
        setValue('enableMusicFade', configValues.enableMusicFade);
        setValue('musicFadeDuration', configValues.musicFadeDuration);
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

        logger.info('[bindControls] Vinculando sliders...');
        bindSlider('masterVolume');
        bindSlider('bgmVolume');
        bindSlider('seVolume');
        bindSlider('animationSpeed', 's');
        bindSlider('musicFadeDuration', 'ms');

        logger.info('[bindControls] Vinculando selects...');
        bindSelect('messageSpeed');
        bindSelect('battleMode');
        bindSelect('effectQuality');

        logger.info('[bindControls] Vinculando toggles...');
        bindToggle('alwaysDash');
        bindToggle('fullscreen');
        bindToggle('enableLogoAnimation');
        bindToggle('enableMusicFade');

        logger.info('[bindControls] Vinculando botões...');
        const applyButton = rootElement.querySelector('#applyButton');
        if (applyButton) {
            applyButton.addEventListener('click', onApply);
            logger.info('[bindControls] Botão Apply vinculado');
        } else {
            logger.warn('[bindControls] Botão Apply não encontrado!');
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

        attachKeyboardSupport();
        logger.info('[bindControls] Controles vinculados com sucesso!');
    }

    function onTabClick(event) {
        const tabName = event.currentTarget.dataset.tab;
        switchTab(tabName);
    }

    function switchTab(tabName) {
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('as-options__tab--active');
            } else {
                tab.classList.remove('as-options__tab--active');
            }
        });

        panels.forEach(panel => {
            if (panel.dataset.panel === tabName) {
                panel.classList.add('as-options__panel--active');
            } else {
                panel.classList.remove('as-options__panel--active');
            }
        });

        SoundManager.playCursor();
    }

    function bindSlider(id, suffix = '%') {
        const slider = rootElement.querySelector(`#${id}`);
        const valueDisplay = rootElement.querySelector(`#${id}Value`);
        
        if (!slider || !valueDisplay) {
            logger.warn(`[bindSlider] Elementos não encontrados para: ${id}`);
            return;
        }

        slider.addEventListener('input', event => {
            const value = Number(event.target.value);
            valueDisplay.textContent = `${value}${suffix}`;
            configValues[id] = value;

            previewLiveChange(id, value);
        });
        
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
                    // Master volume preview deixado para implementação futura; mantido sem efeito imediato.
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

    function onApply() {
        SoundManager.playOk();
        saveConfigValues();
        SceneManager.pop();
    }

    function onCancel() {
        SoundManager.playCancel();
        SceneManager.pop();
    }

    function saveConfigValues() {
    const masterVolume = resolveNumber(configValues.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100);
    const bgmVolume = resolveNumber(configValues.bgmVolume, ConfigManager.bgmVolume, 0, 100);
    const seVolume = resolveNumber(configValues.seVolume, ConfigManager.seVolume, 0, 100);
    const animationSpeed = resolveNumber(configValues.animationSpeed, CONFIG_DEFAULTS.animationSpeed, 1, 10);
    const musicFadeDuration = resolveNumber(configValues.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000);

    ConfigManager.masterVolume = masterVolume;
    ConfigManager.bgmVolume = bgmVolume;
    ConfigManager.bgsVolume = bgmVolume;
    ConfigManager.meVolume = bgmVolume;
    ConfigManager.seVolume = seVolume;
    ConfigManager.messageSpeed = resolveString(configValues.messageSpeed, CONFIG_DEFAULTS.messageSpeed);
    ConfigManager.battleMode = resolveString(configValues.battleMode, CONFIG_DEFAULTS.battleMode);
    ConfigManager.alwaysDash = resolveBoolean(configValues.alwaysDash, true);
    ConfigManager.effectQuality = resolveString(configValues.effectQuality, CONFIG_DEFAULTS.effectQuality);
    ConfigManager.enableLogoAnimation = resolveBoolean(configValues.enableLogoAnimation, CONFIG_DEFAULTS.enableLogoAnimation);
    ConfigManager.animationSpeed = animationSpeed;
    ConfigManager.enableMusicFade = resolveBoolean(configValues.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade);
    ConfigManager.musicFadeDuration = musicFadeDuration;

    ConfigManager.save();

    AudioManager.bgmVolume = bgmVolume;
    AudioManager.bgsVolume = bgmVolume;
    AudioManager.meVolume = bgmVolume;
    AudioManager.seVolume = seVolume;

    logger.info('Configurações salvas com sucesso (incluindo animações e música).');
    }

    function showOptions() {
        if (!rootElement) return;
        
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
