//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.2.7 ☆ Interface HTML moderna para opções com estética medieval fantástica
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Title Options (Sub-agente)
 * --------------------------------------------------------------------------
 * Interface HTML dinâmica e animada para tela de opções com design moderno
 * medieval fantasia, incluindo sistema de abas, sliders, toggles e selects.
 * ==========================================================================
 * 
 * CARACTERÍSTICAS:
 * - Sistema de abas (Áudio, Jogabilidade, Otimização, Créditos)
 * - Controles em tempo real com sliders animados
 * - Tema roxo e dourado com gradientes e brilhos
 * - Animações e transições suaves
 * - Suporte a scroll do mouse
 * - Botão de voltar e feedback visual
 * - Configurações persistentes
 * 
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleOptions = AS.TitleOptions || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.2_TitleOptions';
    const MODULE_VERSION = '1.2.7';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    const logger = {
        info(message) {
            console.log(`⚙️ [${MODULE_ID}] ${message}`);
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

    // Configurações padrão expandidas
    const CONFIG_DEFAULTS = {
        // Áudio
        masterVolume: 80,
        bgmVolume: 90,
        bgsVolume: 90,
        meVolume: 90,
        seVolume: 90,
        
        // Jogabilidade
        alwaysDash: true,
        commandRemember: false,
        touchUI: true,
        messageSpeed: 'normal',
        battleSpeed: 'normal',
        windowOpacity: 192,
        
        // Otimização
        enableAnimations: true,
        enableWeatherEffects: true,
        enableParticles: true,
        targetFPS: 60,
        graphicsQuality: 'high',
        smoothScaling: true,
        
        // Outros
        enableMusicFade: true,
        musicFadeDuration: 1000,
        fullscreen: false
    };

    const APPLY_CLOSE_DELAY = 300;
    const TOAST_DISPLAY_DURATION = 2500;

    // Estender ConfigManager
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
            logger.info('Sistema avançado de opções inicializado.');
            return {};
        },
        cleanup: () => {
            destroyMarkup();
            logger.info('Interface de opções avançada removida.');
        }
    };

    function ensureConfigExtensions() {
        if (ConfigManager._asAdvancedOptionsPatched) {
            return;
        }
        ConfigManager._asAdvancedOptionsPatched = true;

        Object.keys(CONFIG_DEFAULTS).forEach(key => {
            if (ConfigManager[key] === undefined) {
                ConfigManager[key] = CONFIG_DEFAULTS[key];
            }
        });

        const originalMakeData = ConfigManager.makeData.bind(ConfigManager);
        const originalApplyData = ConfigManager.applyData.bind(ConfigManager);

        ConfigManager.makeData = function() {
            const config = originalMakeData();
            
            // Áudio
            config.masterVolume = resolveNumber(this.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100);
            config.bgmVolume = resolveNumber(this.bgmVolume, CONFIG_DEFAULTS.bgmVolume, 0, 100);
            config.bgsVolume = resolveNumber(this.bgsVolume, CONFIG_DEFAULTS.bgsVolume, 0, 100);
            config.meVolume = resolveNumber(this.meVolume, CONFIG_DEFAULTS.meVolume, 0, 100);
            config.seVolume = resolveNumber(this.seVolume, CONFIG_DEFAULTS.seVolume, 0, 100);
            
            // Jogabilidade
            config.messageSpeed = resolveString(this.messageSpeed, CONFIG_DEFAULTS.messageSpeed);
            config.battleSpeed = resolveString(this.battleSpeed, CONFIG_DEFAULTS.battleSpeed);
            config.windowOpacity = resolveNumber(this.windowOpacity, CONFIG_DEFAULTS.windowOpacity, 0, 255);
            
            // Otimização
            config.enableAnimations = resolveBoolean(this.enableAnimations, CONFIG_DEFAULTS.enableAnimations);
            config.enableWeatherEffects = resolveBoolean(this.enableWeatherEffects, CONFIG_DEFAULTS.enableWeatherEffects);
            config.enableParticles = resolveBoolean(this.enableParticles, CONFIG_DEFAULTS.enableParticles);
            config.targetFPS = resolveNumber(this.targetFPS, CONFIG_DEFAULTS.targetFPS, 30, 120);
            config.graphicsQuality = resolveString(this.graphicsQuality, CONFIG_DEFAULTS.graphicsQuality);
            config.smoothScaling = resolveBoolean(this.smoothScaling, CONFIG_DEFAULTS.smoothScaling);
            
            // Outros
            config.enableMusicFade = resolveBoolean(this.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade);
            config.musicFadeDuration = resolveNumber(this.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000);
            
            return config;
        };

        ConfigManager.applyData = function(config) {
            originalApplyData(config);
            
            // Áudio
            this.masterVolume = resolveNumber(config.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100);
            this.bgmVolume = resolveNumber(config.bgmVolume, CONFIG_DEFAULTS.bgmVolume, 0, 100);
            this.bgsVolume = resolveNumber(config.bgsVolume, CONFIG_DEFAULTS.bgsVolume, 0, 100);
            this.meVolume = resolveNumber(config.meVolume, CONFIG_DEFAULTS.meVolume, 0, 100);
            this.seVolume = resolveNumber(config.seVolume, CONFIG_DEFAULTS.seVolume, 0, 100);
            
            // Jogabilidade
            this.messageSpeed = resolveString(config.messageSpeed, CONFIG_DEFAULTS.messageSpeed);
            this.battleSpeed = resolveString(config.battleSpeed, CONFIG_DEFAULTS.battleSpeed);
            this.windowOpacity = resolveNumber(config.windowOpacity, CONFIG_DEFAULTS.windowOpacity, 0, 255);
            
            // Otimização
            this.enableAnimations = resolveBoolean(config.enableAnimations, CONFIG_DEFAULTS.enableAnimations);
            this.enableWeatherEffects = resolveBoolean(config.enableWeatherEffects, CONFIG_DEFAULTS.enableWeatherEffects);
            this.enableParticles = resolveBoolean(config.enableParticles, CONFIG_DEFAULTS.enableParticles);
            this.targetFPS = resolveNumber(config.targetFPS, CONFIG_DEFAULTS.targetFPS, 30, 120);
            this.graphicsQuality = resolveString(config.graphicsQuality, CONFIG_DEFAULTS.graphicsQuality);
            this.smoothScaling = resolveBoolean(config.smoothScaling, CONFIG_DEFAULTS.smoothScaling);
            
            // Outros
            this.enableMusicFade = resolveBoolean(config.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade);
            this.musicFadeDuration = resolveNumber(config.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000);
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
        } catch (error) {
            logger.warn(`Falha ao atualizar volume master: ${error.message}`);
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
        // Sobrescrever Scene_Options completamente
        const Scene_Options_create = Scene_Options.prototype.create;
        Scene_Options.prototype.create = function() {
            Scene_Options_create.call(this);
            this._asOptionsActive = false;
            
            // Esconder elementos padrão
            if (this._optionsWindow) {
                this._optionsWindow.hide();
                this._optionsWindow.deactivate();
            }
            if (this._cancelButton) {
                this._cancelButton.visible = false;
            }
        };

        Scene_Options.prototype.needsCancelButton = function() {
            return false;
        };

        const Scene_Options_start = Scene_Options.prototype.start;
        Scene_Options.prototype.start = function() {
            try {
                Scene_Options_start.call(this);
                
                // Injetar nossa interface personalizada
                injectStyles();
                injectMarkup();
                loadConfigValues();
                bindControls();
                showOptions();
                
                this._asOptionsActive = true;
                logger.info('Interface avançada de opções ativada.');
            } catch (error) {
                logger.error(`Erro ao iniciar opções: ${error.message}`);
                logger.error(error.stack);
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
                logger.warn('Fallback: usando janela padrão de opções.');
            }

            if (scene && scene._cancelButton) {
                scene._cancelButton.visible = true;
            }

            if (scene) {
                scene._asOptionsActive = false;
            }
        } catch (fallbackError) {
            logger.error(`Falha no fallback: ${fallbackError.message}`);
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
        logger.info('Estilos injetados.');
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
            logger.error('Falha ao criar rootElement.');
            return;
        }
        
        document.body.appendChild(rootElement);
        
        tabs = Array.from(rootElement.querySelectorAll('.as-options-adv__tab'));
        panels = Array.from(rootElement.querySelectorAll('.as-options-adv__panel'));

        initializeTabState();
        alignOverlayWithCanvas();

        logger.info('Markup HTML inserido.');
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
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

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
            logger.warn(`Falha ao alinhar overlay: ${error.message}`);
        }
    }

    function attachResizeHandler() {
        if (detachResizeHandler) {
            return;
        }

        const handler = () => alignOverlayWithCanvas();
        window.addEventListener('resize', handler);

        detachResizeHandler = () => {
            window.removeEventListener('resize', handler);
        };

        alignOverlayWithCanvas();
    }

    function initializeTabState() {
        if (!tabs.length || !panels.length) {
            return;
        }
        const activeTab = tabs.find(tab => tab.classList.contains('as-options-adv__tab--active')) || tabs[0];
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
            // Áudio
            masterVolume: resolveNumber(ConfigManager.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100),
            bgmVolume: resolveNumber(ConfigManager.bgmVolume, CONFIG_DEFAULTS.bgmVolume, 0, 100),
            bgsVolume: resolveNumber(ConfigManager.bgsVolume, CONFIG_DEFAULTS.bgsVolume, 0, 100),
            meVolume: resolveNumber(ConfigManager.meVolume, CONFIG_DEFAULTS.meVolume, 0, 100),
            seVolume: resolveNumber(ConfigManager.seVolume, CONFIG_DEFAULTS.seVolume, 0, 100),
            
            // Jogabilidade
            alwaysDash: resolveBoolean(ConfigManager.alwaysDash, CONFIG_DEFAULTS.alwaysDash),
            commandRemember: resolveBoolean(ConfigManager.commandRemember, CONFIG_DEFAULTS.commandRemember),
            touchUI: resolveBoolean(ConfigManager.touchUI, CONFIG_DEFAULTS.touchUI),
            messageSpeed: resolveString(ConfigManager.messageSpeed, CONFIG_DEFAULTS.messageSpeed),
            battleSpeed: resolveString(ConfigManager.battleSpeed, CONFIG_DEFAULTS.battleSpeed),
            windowOpacity: resolveNumber(ConfigManager.windowOpacity, CONFIG_DEFAULTS.windowOpacity, 0, 255),
            
            // Otimização
            enableAnimations: resolveBoolean(ConfigManager.enableAnimations, CONFIG_DEFAULTS.enableAnimations),
            enableWeatherEffects: resolveBoolean(ConfigManager.enableWeatherEffects, CONFIG_DEFAULTS.enableWeatherEffects),
            enableParticles: resolveBoolean(ConfigManager.enableParticles, CONFIG_DEFAULTS.enableParticles),
            targetFPS: resolveNumber(ConfigManager.targetFPS, CONFIG_DEFAULTS.targetFPS, 30, 120),
            graphicsQuality: resolveString(ConfigManager.graphicsQuality, CONFIG_DEFAULTS.graphicsQuality),
            smoothScaling: resolveBoolean(ConfigManager.smoothScaling, CONFIG_DEFAULTS.smoothScaling),
            
            // Outros
            fullscreen: Graphics._isFullScreen ? Graphics._isFullScreen() : false
        };

        updateUIFromConfig();
    }

    function updateUIFromConfig() {
        if (!rootElement) {
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
                    valueDisplay.textContent = formatSliderDisplay(id, numericValue);
                }
            } else if (element.type === 'checkbox') {
                element.checked = value;
            } else if (element.tagName === 'SELECT') {
                element.value = value;
            }
        };

        // Aplicar todos os valores
        Object.keys(configValues).forEach(key => {
            setValue(key, configValues[key]);
        });
    }

    function bindControls() {
        if (!rootElement) {
            return;
        }
        
        // Vincular tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', onTabClick);
        });

        // Vincular sliders de áudio
        bindSlider('masterVolume');
        bindSlider('bgmVolume');
        bindSlider('bgsVolume');
        bindSlider('meVolume');
        bindSlider('seVolume');
        
        // Vincular sliders de jogabilidade
        bindSlider('windowOpacity');
        
        // Vincular selects
        bindSelect('messageSpeed');
        bindSelect('battleSpeed');
        bindSelect('graphicsQuality');
        
        // Vincular sliders de otimização
        bindSlider('targetFPS');
        
        // Vincular toggles
        bindToggle('alwaysDash');
        bindToggle('commandRemember');
        bindToggle('touchUI');
        bindToggle('enableAnimations');
        bindToggle('enableWeatherEffects');
        bindToggle('enableParticles');
        bindToggle('smoothScaling');
        bindToggle('fullscreen');

        enableScrollWheelSupport();

        // Botões de ação
        const applyButton = rootElement.querySelector('#applyButton');
        if (applyButton) {
            applyButton.addEventListener('click', onApply);
        }

        const resetButton = rootElement.querySelector('#resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', onReset);
        }

        const cancelButton = rootElement.querySelector('#cancelButton');
        if (cancelButton) {
            cancelButton.addEventListener('click', onCancel);
        }

        const closeButton = rootElement.querySelector('#closeButton');
        if (closeButton) {
            closeButton.addEventListener('click', onCancel);
        }

        attachKeyboardSupport();
        logger.info('Controles vinculados.');
    }

    function onTabClick(event) {
        const tabName = event.currentTarget.dataset.tab;
        switchTab(tabName);
    }

    function switchTab(tabName, playSound = true) {
        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabName;
            tab.classList.toggle('as-options-adv__tab--active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });

        panels.forEach(panel => {
            const isActive = panel.dataset.panel === tabName;
            panel.classList.toggle('as-options-adv__panel--active', isActive);
            if (isActive) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });

        if (playSound && typeof SoundManager !== 'undefined') {
            SoundManager.playCursor();
        }
    }

    function formatSliderDisplay(id, value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return '0';
        }
        
        if (id === 'windowOpacity') {
            return `${Math.round(numeric)}`;
        }
        if (id === 'targetFPS') {
            return `${Math.round(numeric)} FPS`;
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
        const clamped = clampNumber(percent, 0, 100);
        slider.style.setProperty('--slider-progress', `${clamped}%`);
    }

    function bindSlider(id) {
        const slider = rootElement.querySelector(`#${id}`);
        const valueDisplay = rootElement.querySelector(`#${id}Value`);
        
        if (!slider || !valueDisplay) {
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
    }

    function bindSelect(id) {
        const select = rootElement.querySelector(`#${id}`);
        if (!select) {
            return;
        }

        select.addEventListener('change', (e) => {
            configValues[id] = e.target.value;
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCursor();
            }
        });
    }

    function bindToggle(id) {
        const toggle = rootElement.querySelector(`#${id}`);
        if (!toggle) {
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
            
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCursor();
            }
        });
    }

    function previewLiveChange(id, value) {
        try {
            switch (id) {
                case 'masterVolume':
                    syncMasterVolume(value);
                    break;
                case 'bgmVolume':
                    AudioManager.bgmVolume = value;
                    break;
                case 'bgsVolume':
                    AudioManager.bgsVolume = value;
                    break;
                case 'meVolume':
                    AudioManager.meVolume = value;
                    break;
                case 'seVolume':
                    AudioManager.seVolume = value;
                    break;
                case 'windowOpacity':
                    // Atualizar opacidade em tempo real se possível
                    if (SceneManager._scene && SceneManager._scene._windowLayer) {
                        SceneManager._scene._windowLayer.children.forEach(window => {
                            if (window && window.setBackgroundOpacity) {
                                window.setBackgroundOpacity(value);
                            }
                        });
                    }
                    break;
            }
        } catch (error) {
            logger.warn(`Falha ao aplicar prévia de ${id}: ${error.message}`);
        }
    }

    function enableScrollWheelSupport() {
        if (detachScrollHandler) {
            detachScrollHandler();
            detachScrollHandler = null;
        }

        if (!rootElement) {
            return;
        }

        const scrollArea = rootElement.querySelector('.as-options-adv__content');
        if (!scrollArea) {
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

        scrollArea.addEventListener('wheel', onWheel, { passive: false });

        detachScrollHandler = () => {
            scrollArea.removeEventListener('wheel', onWheel);
        };
    }

    function onApply() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playOk();
        }
        saveConfigValues();
        showFeedback('✨ Configurações aplicadas com sucesso!');
        
        if (pendingCloseHandle) {
            clearTimeout(pendingCloseHandle);
        }
        pendingCloseHandle = setTimeout(() => {
            pendingCloseHandle = null;
            SceneManager.pop();
        }, APPLY_CLOSE_DELAY);
    }

    function onReset() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playCancel();
        }
        applyResetDefaults();
        showFeedback('🔄 Configurações restauradas para padrão. Aplique para confirmar.');
    }

    function onCancel() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playCancel();
        }
        if (pendingCloseHandle) {
            clearTimeout(pendingCloseHandle);
            pendingCloseHandle = null;
        }
        SceneManager.pop();
    }

    function saveConfigValues() {
        // Áudio
        ConfigManager.masterVolume = configValues.masterVolume;
        ConfigManager.bgmVolume = configValues.bgmVolume;
        ConfigManager.bgsVolume = configValues.bgsVolume;
        ConfigManager.meVolume = configValues.meVolume;
        ConfigManager.seVolume = configValues.seVolume;
        
        // Jogabilidade
        ConfigManager.alwaysDash = configValues.alwaysDash;
        ConfigManager.commandRemember = configValues.commandRemember;
        ConfigManager.touchUI = configValues.touchUI;
        ConfigManager.messageSpeed = configValues.messageSpeed;
        ConfigManager.battleSpeed = configValues.battleSpeed;
        ConfigManager.windowOpacity = configValues.windowOpacity;
        
        // Otimização
        ConfigManager.enableAnimations = configValues.enableAnimations;
        ConfigManager.enableWeatherEffects = configValues.enableWeatherEffects;
        ConfigManager.enableParticles = configValues.enableParticles;
        ConfigManager.targetFPS = configValues.targetFPS;
        ConfigManager.graphicsQuality = configValues.graphicsQuality;
        ConfigManager.smoothScaling = configValues.smoothScaling;

        // Aplicar volumes em tempo real
        AudioManager.bgmVolume = configValues.bgmVolume;
        AudioManager.bgsVolume = configValues.bgsVolume;
        AudioManager.meVolume = configValues.meVolume;
        AudioManager.seVolume = configValues.seVolume;
        syncMasterVolume(configValues.masterVolume);

        const saveResult = ConfigManager.save();
        if (saveResult && typeof saveResult.catch === 'function') {
            saveResult.catch(error => logger.warn(`Falha ao salvar: ${error.message}`));
        }

        logger.info('Configurações salvas.');
    }

    function applyResetDefaults() {
        configValues = Object.assign({}, CONFIG_DEFAULTS);
        updateUIFromConfig();
        syncMasterVolume(configValues.masterVolume);
        previewLiveChange('bgmVolume', configValues.bgmVolume);
        previewLiveChange('seVolume', configValues.seVolume);
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
        feedbackElement.classList.add('as-options-adv__feedback--visible');
        
        if (toastTimer) {
            clearTimeout(toastTimer);
        }
        toastTimer = setTimeout(() => {
            feedbackElement.classList.remove('as-options-adv__feedback--visible');
            toastTimer = null;
        }, TOAST_DISPLAY_DURATION);
    }

    function showOptions() {
        if (!rootElement) return;
        
        alignOverlayWithCanvas();
        attachResizeHandler();

        requestAnimationFrame(() => {
            rootElement.classList.add('as-options-adv--visible');
            rootElement.setAttribute('aria-hidden', 'false');
        });
    }

    function hideOptions() {
        if (!rootElement) return;
        
        rootElement.classList.remove('as-options-adv--visible');
        rootElement.setAttribute('aria-hidden', 'true');
    }

    function attachKeyboardSupport() {
        const handler = (event) => {
            if (!rootElement || !rootElement.classList.contains('as-options-adv--visible')) {
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

        return Array.from(new Set(bases.filter(Boolean)));
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
