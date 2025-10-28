//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.3.9 ☆ Interface HTML moderna para opções com estética medieval fantástica
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @orderAfter AS_1.0_TitleScreen
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
 * - Detecção automática de hardware e sugestão de preset
 * - Monitor de FPS em tempo real configurável
 * - Sistema de tooltips interativos
 * - Animação de confirmação ao salvar (check verde)
 * - Estilos de cursor customizáveis (padrão/retrô/moderno)
 * - Sistema de cache inteligente de recursos
 * - Scroll automático ao trocar de abas
 * - Labels de áudio amigáveis (sem termos técnicos)
 * 
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleOptions = AS.TitleOptions || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.2_TitleOptions';
    const MODULE_VERSION = '1.3.9';
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
        muteOnFocusLoss: false,
        
        // Jogabilidade
        alwaysDash: true,
        commandRemember: false,
        touchUI: true,
        windowOpacity: 192,
        fontSize: 'normal',
        autoSaveEnabled: true,
        confirmOnExit: true,
        
        // Otimização
        enableParticles: true,
        targetFPS: 60,
        graphicsQuality: 'high',
        smoothScaling: true,
        screenShake: true,
        showFPS: false,
        cacheStrategy: 'ondemand',
        
        // Visual
        screenFilter: 'none',
        screenBrightness: 100,
        uiScale: 100,
        cursorStyle: 'default',
        
        // Outros
        enableMusicFade: true,
        musicFadeDuration: 1000,
        fullscreen: false,
        language: 'pt-BR'
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
            
            // Aplicar FPS monitor se estiver ativado
            setTimeout(() => {
                if (ConfigManager.showFPS) {
                    toggleFPSDisplay(true);
                }
                if (ConfigManager.cursorStyle) {
                    applyCursorStyle(ConfigManager.cursorStyle);
                }
                if (ConfigManager.targetFPS && typeof Graphics !== 'undefined') {
                    Graphics._app._ticker.maxFPS = ConfigManager.targetFPS;
                    Graphics._app._ticker.minFPS = ConfigManager.targetFPS;
                    logger.info(`FPS carregado: ${ConfigManager.targetFPS}`);
                }
            }, 1000);
            
            logger.info('Sistema avançado de opções inicializado.');
            return {};
        },
        cleanup: () => {
            destroyMarkup();
            removeFPSMonitor();
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
            config.muteOnFocusLoss = resolveBoolean(this.muteOnFocusLoss, CONFIG_DEFAULTS.muteOnFocusLoss);
            
            // Jogabilidade
            config.windowOpacity = resolveNumber(this.windowOpacity, CONFIG_DEFAULTS.windowOpacity, 0, 255);
            config.fontSize = resolveString(this.fontSize, CONFIG_DEFAULTS.fontSize);
            config.autoSaveEnabled = resolveBoolean(this.autoSaveEnabled, CONFIG_DEFAULTS.autoSaveEnabled);
            config.confirmOnExit = resolveBoolean(this.confirmOnExit, CONFIG_DEFAULTS.confirmOnExit);
            
            // Otimização
            config.enableParticles = resolveBoolean(this.enableParticles, CONFIG_DEFAULTS.enableParticles);
            config.targetFPS = resolveNumber(this.targetFPS, CONFIG_DEFAULTS.targetFPS, 30, 120);
            config.graphicsQuality = resolveString(this.graphicsQuality, CONFIG_DEFAULTS.graphicsQuality);
            config.smoothScaling = resolveBoolean(this.smoothScaling, CONFIG_DEFAULTS.smoothScaling);
            config.screenShake = resolveBoolean(this.screenShake, CONFIG_DEFAULTS.screenShake);
            config.showFPS = resolveBoolean(this.showFPS, CONFIG_DEFAULTS.showFPS);
            config.cacheStrategy = resolveString(this.cacheStrategy, CONFIG_DEFAULTS.cacheStrategy);
            
            // Visual
            config.screenFilter = resolveString(this.screenFilter, CONFIG_DEFAULTS.screenFilter);
            config.screenBrightness = resolveNumber(this.screenBrightness, CONFIG_DEFAULTS.screenBrightness, 50, 150);
            config.uiScale = resolveNumber(this.uiScale, CONFIG_DEFAULTS.uiScale, 75, 150);
            config.cursorStyle = resolveString(this.cursorStyle, CONFIG_DEFAULTS.cursorStyle);
            
            // Outros
            config.enableMusicFade = resolveBoolean(this.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade);
            config.musicFadeDuration = resolveNumber(this.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000);
            config.language = resolveString(this.language, CONFIG_DEFAULTS.language);
            
            return config;
        };

        ConfigManager.applyData = function(config) {
            originalApplyData(config);
            
            // Áudio - usar valores salvos se existirem, senão usar padrão
            this.masterVolume = config.masterVolume !== undefined ? resolveNumber(config.masterVolume, CONFIG_DEFAULTS.masterVolume, 0, 100) : CONFIG_DEFAULTS.masterVolume;
            this.bgmVolume = config.bgmVolume !== undefined ? resolveNumber(config.bgmVolume, CONFIG_DEFAULTS.bgmVolume, 0, 100) : this.bgmVolume;
            this.bgsVolume = config.bgsVolume !== undefined ? resolveNumber(config.bgsVolume, CONFIG_DEFAULTS.bgsVolume, 0, 100) : this.bgsVolume;
            this.meVolume = config.meVolume !== undefined ? resolveNumber(config.meVolume, CONFIG_DEFAULTS.meVolume, 0, 100) : this.meVolume;
            this.seVolume = config.seVolume !== undefined ? resolveNumber(config.seVolume, CONFIG_DEFAULTS.seVolume, 0, 100) : this.seVolume;
            this.muteOnFocusLoss = config.muteOnFocusLoss !== undefined ? resolveBoolean(config.muteOnFocusLoss, CONFIG_DEFAULTS.muteOnFocusLoss) : CONFIG_DEFAULTS.muteOnFocusLoss;
            
            // Jogabilidade
            this.windowOpacity = config.windowOpacity !== undefined ? resolveNumber(config.windowOpacity, CONFIG_DEFAULTS.windowOpacity, 0, 255) : CONFIG_DEFAULTS.windowOpacity;
            this.fontSize = config.fontSize !== undefined ? resolveString(config.fontSize, CONFIG_DEFAULTS.fontSize) : CONFIG_DEFAULTS.fontSize;
            this.autoSaveEnabled = config.autoSaveEnabled !== undefined ? resolveBoolean(config.autoSaveEnabled, CONFIG_DEFAULTS.autoSaveEnabled) : CONFIG_DEFAULTS.autoSaveEnabled;
            this.confirmOnExit = config.confirmOnExit !== undefined ? resolveBoolean(config.confirmOnExit, CONFIG_DEFAULTS.confirmOnExit) : CONFIG_DEFAULTS.confirmOnExit;
            
            // Otimização
            this.enableParticles = config.enableParticles !== undefined ? resolveBoolean(config.enableParticles, CONFIG_DEFAULTS.enableParticles) : CONFIG_DEFAULTS.enableParticles;
            this.targetFPS = config.targetFPS !== undefined ? resolveNumber(config.targetFPS, CONFIG_DEFAULTS.targetFPS, 30, 120) : CONFIG_DEFAULTS.targetFPS;
            this.graphicsQuality = config.graphicsQuality !== undefined ? resolveString(config.graphicsQuality, CONFIG_DEFAULTS.graphicsQuality) : CONFIG_DEFAULTS.graphicsQuality;
            this.smoothScaling = config.smoothScaling !== undefined ? resolveBoolean(config.smoothScaling, CONFIG_DEFAULTS.smoothScaling) : CONFIG_DEFAULTS.smoothScaling;
            this.screenShake = config.screenShake !== undefined ? resolveBoolean(config.screenShake, CONFIG_DEFAULTS.screenShake) : CONFIG_DEFAULTS.screenShake;
            this.showFPS = config.showFPS !== undefined ? resolveBoolean(config.showFPS, CONFIG_DEFAULTS.showFPS) : CONFIG_DEFAULTS.showFPS;
            this.cacheStrategy = config.cacheStrategy !== undefined ? resolveString(config.cacheStrategy, CONFIG_DEFAULTS.cacheStrategy) : CONFIG_DEFAULTS.cacheStrategy;
            
            // Visual
            this.screenFilter = config.screenFilter !== undefined ? resolveString(config.screenFilter, CONFIG_DEFAULTS.screenFilter) : CONFIG_DEFAULTS.screenFilter;
            this.screenBrightness = config.screenBrightness !== undefined ? resolveNumber(config.screenBrightness, CONFIG_DEFAULTS.screenBrightness, 50, 150) : CONFIG_DEFAULTS.screenBrightness;
            this.uiScale = config.uiScale !== undefined ? resolveNumber(config.uiScale, CONFIG_DEFAULTS.uiScale, 75, 150) : CONFIG_DEFAULTS.uiScale;
            this.cursorStyle = config.cursorStyle !== undefined ? resolveString(config.cursorStyle, CONFIG_DEFAULTS.cursorStyle) : CONFIG_DEFAULTS.cursorStyle;
            
            // Outros
            this.enableMusicFade = config.enableMusicFade !== undefined ? resolveBoolean(config.enableMusicFade, CONFIG_DEFAULTS.enableMusicFade) : CONFIG_DEFAULTS.enableMusicFade;
            this.musicFadeDuration = config.musicFadeDuration !== undefined ? resolveNumber(config.musicFadeDuration, CONFIG_DEFAULTS.musicFadeDuration, 100, 5000) : CONFIG_DEFAULTS.musicFadeDuration;
            this.language = config.language !== undefined ? resolveString(config.language, CONFIG_DEFAULTS.language) : CONFIG_DEFAULTS.language;
            
            // Aplicar volumes do AudioManager imediatamente
            if (typeof AudioManager !== 'undefined') {
                AudioManager.bgmVolume = this.bgmVolume;
                AudioManager.bgsVolume = this.bgsVolume;
                AudioManager.meVolume = this.meVolume;
                AudioManager.seVolume = this.seVolume;
                syncMasterVolume(this.masterVolume);
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
        // Se o valor não existe (undefined/null), usa o fallback
        if (value === undefined || value === null) {
            return fallback;
        }
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
        if (value === undefined || value === null) {
            return fallback;
        }
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
                
                // Ocultar a UI da tela de título antes de mostrar as opções
                if (contextRef && typeof contextRef.publish === 'function') {
                    contextRef.publish('titlescreen:scene:terminate', { scene: SceneManager._scene });
                }
                
                // Injetar nossa interface personalizada
                injectStyles();
                injectMarkup();
                loadConfigValues();
                bindControls();
                showOptions();
                
                // Detectar hardware e sugerir preset (apenas na primeira vez)
                if (!ConfigManager._hardwareDetected) {
                    ConfigManager._hardwareDetected = true;
                    setTimeout(() => detectHardwareAndSuggestPreset(), 500);
                }
                
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
            windowOpacity: resolveNumber(ConfigManager.windowOpacity, CONFIG_DEFAULTS.windowOpacity, 0, 255),
            
            // Otimização
            enableParticles: resolveBoolean(ConfigManager.enableParticles, CONFIG_DEFAULTS.enableParticles),
            targetFPS: resolveNumber(ConfigManager.targetFPS, CONFIG_DEFAULTS.targetFPS, 30, 120),
            graphicsQuality: resolveString(ConfigManager.graphicsQuality, CONFIG_DEFAULTS.graphicsQuality),
            smoothScaling: resolveBoolean(ConfigManager.smoothScaling, CONFIG_DEFAULTS.smoothScaling),
            showFPS: resolveBoolean(ConfigManager.showFPS, CONFIG_DEFAULTS.showFPS),
            cacheStrategy: resolveString(ConfigManager.cacheStrategy, CONFIG_DEFAULTS.cacheStrategy),
            cursorStyle: resolveString(ConfigManager.cursorStyle, CONFIG_DEFAULTS.cursorStyle),
            
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
        bindSelect('graphicsQuality');
        bindSelect('cacheStrategy');
        bindSelect('cursorStyle');
        
        // Vincular sliders de otimização
        bindSlider('targetFPS');
        
        // Vincular toggles
        bindToggle('alwaysDash');
        bindToggle('commandRemember');
        bindToggle('touchUI');
        bindToggle('enableParticles');
        bindToggle('smoothScaling');
        bindToggle('fullscreen');
        bindToggle('showFPS');

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

        // Vincular botões de preset
        const presetButtons = rootElement.querySelectorAll('.as-options-adv__preset-btn');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', onPresetClick);
        });

        attachKeyboardSupport();
        initializeTooltips();
        bindCreditsSubTabs();
        logger.info('Controles vinculados.');
    }

    function bindCreditsSubTabs() {
        const creditsSubTabs = rootElement.querySelectorAll('.as-options-adv__credits-subtab');
        creditsSubTabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                const targetPanel = event.currentTarget.dataset.creditsPanel;
                
                // Desativar todas as sub-abas
                creditsSubTabs.forEach(t => {
                    t.classList.remove('as-options-adv__credits-subtab--active');
                    t.setAttribute('aria-selected', 'false');
                });
                
                // Ativar a sub-aba clicada
                event.currentTarget.classList.add('as-options-adv__credits-subtab--active');
                event.currentTarget.setAttribute('aria-selected', 'true');
                
                // Esconder todos os painéis
                const panels = rootElement.querySelectorAll('.as-options-adv__credits-subpanel');
                panels.forEach(panel => {
                    panel.hidden = true;
                });
                
                // Mostrar o painel alvo
                const activePanel = rootElement.querySelector(`.as-options-adv__credits-subpanel[data-credits-subpanel="${targetPanel}"]`);
                if (activePanel) {
                    activePanel.hidden = false;
                    
                    // Reset scroll para o topo
                    const creditsContainer = rootElement.querySelector('#panel-credits');
                    if (creditsContainer) {
                        const scrollableArea = creditsContainer.querySelector('.as-options-adv__credits');
                        if (scrollableArea) {
                            // Apenas scroll suave para a área de sub-abas, não para o topo completo
                            const subtabs = creditsContainer.querySelector('.as-options-adv__credits-subtabs');
                            if (subtabs) {
                                subtabs.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        }
                    }
                }
                
                // Som de feedback
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
            });
        });
    }

    function onPresetClick(event) {
        const preset = event.currentTarget.dataset.preset;
        applyPreset(preset);
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playOk();
        }
    }

    function applyPreset(preset) {
        const presets = {
            performance: {
                graphicsQuality: 'low',
                enableParticles: false,
                targetFPS: 30,
                smoothScaling: false,
                screenShake: false
            },
            balanced: {
                graphicsQuality: 'medium',
                enableParticles: false,
                targetFPS: 60,
                smoothScaling: true,
                screenShake: true
            },
            quality: {
                graphicsQuality: 'ultra',
                enableParticles: true,
                targetFPS: 60,
                smoothScaling: true,
                screenShake: true
            }
        };

        const config = presets[preset];
        if (!config) return;

        Object.keys(config).forEach(key => {
            configValues[key] = config[key];
        });

        updateUIFromConfig();
        markAsUnsaved();
        showFeedback(`✨ Preset "${preset === 'performance' ? 'Performance' : preset === 'balanced' ? 'Balanceado' : 'Qualidade'}" aplicado!`);
    }

    // Detecção automática de hardware e sugestão de preset
    function detectHardwareAndSuggestPreset() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            let score = 0;
            
            // Detectar GPU
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    logger.info(`GPU detectada: ${renderer}`);
                    
                    // GPUs high-end
                    if (renderer.match(/RTX|GeForce GTX (1[6-9]|[2-9])|Radeon RX (5|6|7)|AMD.*Vega|Intel.*Iris Xe/i)) {
                        score += 3;
                    }
                    // GPUs mid-range
                    else if (renderer.match(/GTX|Radeon|Intel.*HD|Intel.*UHD/i)) {
                        score += 2;
                    }
                    // GPUs low-end
                    else {
                        score += 1;
                    }
                }
            }
            
            // Detectar memória (RAM)
            if (navigator.deviceMemory) {
                const ram = navigator.deviceMemory; // em GB
                logger.info(`RAM detectada: ${ram}GB`);
                if (ram >= 8) score += 2;
                else if (ram >= 4) score += 1;
            }
            
            // Detectar número de núcleos do processador
            if (navigator.hardwareConcurrency) {
                const cores = navigator.hardwareConcurrency;
                logger.info(`CPU cores detectados: ${cores}`);
                if (cores >= 8) score += 2;
                else if (cores >= 4) score += 1;
            }
            
            // Determinar preset baseado no score
            let suggestedPreset = 'balanced';
            if (score >= 6) {
                suggestedPreset = 'quality';
            } else if (score <= 3) {
                suggestedPreset = 'performance';
            }
            
            logger.info(`Score de hardware: ${score}/7 - Preset sugerido: ${suggestedPreset}`);
            
            // Mostrar sugestão ao usuário
            const presetNames = {
                performance: 'Performance',
                balanced: 'Balanceado',
                quality: 'Qualidade'
            };
            
            showHardwareSuggestion(presetNames[suggestedPreset], suggestedPreset);
            
        } catch (error) {
            logger.warn(`Falha na detecção de hardware: ${error.message}`);
        }
    }

    function showHardwareSuggestion(presetName, presetId) {
        const suggestionHTML = `
            <div class="as-options-adv__hardware-suggestion" id="hardwareSuggestion">
                <div class="as-options-adv__suggestion-content">
                    <span class="as-options-adv__suggestion-icon">💡</span>
                    <div class="as-options-adv__suggestion-text">
                        <strong>Sugestão Automática</strong>
                        <p>Baseado no seu hardware, recomendamos o preset: <strong>${presetName}</strong></p>
                    </div>
                    <div class="as-options-adv__suggestion-actions">
                        <button class="as-options-adv__suggestion-btn as-options-adv__suggestion-btn--accept" data-preset="${presetId}">
                            ✓ Aplicar
                        </button>
                        <button class="as-options-adv__suggestion-btn as-options-adv__suggestion-btn--dismiss">
                            ✕ Dispensar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const container = rootElement.querySelector('.as-options-adv__container');
        if (container) {
            const suggestionElement = document.createElement('div');
            suggestionElement.innerHTML = suggestionHTML;
            container.appendChild(suggestionElement.firstElementChild);
            
            // Bind dos botões
            const acceptBtn = container.querySelector('.as-options-adv__suggestion-btn--accept');
            const dismissBtn = container.querySelector('.as-options-adv__suggestion-btn--dismiss');
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    applyPreset(presetId);
                    dismissHardwareSuggestion();
                    // Salvar automaticamente após aplicar preset
                    saveConfigValues();
                    markAsSaved();
                    if (typeof SoundManager !== 'undefined') {
                        SoundManager.playOk();
                    }
                    showFeedback('✨ Preset aplicado e salvo! Feche e reabra o jogo para aplicar completamente.');
                });
            }
            
            if (dismissBtn) {
                dismissBtn.addEventListener('click', () => {
                    dismissHardwareSuggestion();
                    if (typeof SoundManager !== 'undefined') {
                        SoundManager.playCancel();
                    }
                });
            }
        }
    }

    function dismissHardwareSuggestion() {
        const suggestion = rootElement.querySelector('#hardwareSuggestion');
        if (suggestion) {
            suggestion.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => suggestion.remove(), 300);
        }
    }

    function markAsUnsaved() {
        const indicator = rootElement.querySelector('#unsavedIndicator');
        if (indicator) {
            indicator.style.display = 'inline-flex';
        }
    }

    function markAsSaved() {
        const indicator = rootElement.querySelector('#unsavedIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
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

        // Resetar scroll para o topo ao trocar de aba
        const scrollArea = rootElement.querySelector('.as-options-adv__content');
        if (scrollArea) {
            scrollArea.scrollTop = 0;
        }

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
            markAsUnsaved();
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
            markAsUnsaved();
            
            // Aplicar cursor em tempo real
            if (id === 'cursorStyle') {
                applyCursorStyle(e.target.value);
            }
            
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCursor();
            }
        });
    }

    function applyCursorStyle(style) {
        const bodyStyle = document.body.style;
        
        switch (style) {
            case 'retro':
                // Seta pixel art estilo retrô
                bodyStyle.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFF' stroke='%23000' stroke-width='1' d='M3 3 L3 18 L8 13 L12 21 L14 20 L10 12 L17 12 Z'/%3E%3C/svg%3E") 3 3, pointer`;
                break;
            case 'modern':
                // Mão/dedo apontando estilo moderno
                bodyStyle.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath fill='%23F59E0B' stroke='%23000' stroke-width='1.5' d='M8 4 C6.8 4 5.8 4.8 5.8 6 L5.8 14 L4 14 C2.8 14 2 14.8 2 16 C2 17.2 2.8 18 4 18 L8 18 L12 22 L16 22 C18 22 20 20 20 18 L20 10 C20 8 18 6 16 6 C16 4.8 15.2 4 14 4 C12.8 4 12 4.8 12 6 C12 4.8 11.2 4 10 4 C9.2 4 8.4 4.4 8 5 L8 4 Z'/%3E%3C/svg%3E") 8 0, pointer`;
                break;
            default:
                // Seta padrão melhorada
                bodyStyle.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%23FFFFFF' stroke='%23000000' stroke-width='1' d='M2 2 L2 16 L6 11 L9 18 L11 17 L8 10 L14 10 Z'/%3E%3C/svg%3E") 2 2, default`;
        }
    }

    function bindToggle(id) {
        const toggle = rootElement.querySelector(`#${id}`);
        if (!toggle) {
            return;
        }

        toggle.addEventListener('change', (e) => {
            configValues[id] = e.target.checked;
            markAsUnsaved();
            
            if (id === 'fullscreen') {
                if (e.target.checked) {
                    Graphics._requestFullScreen();
                } else {
                    Graphics._cancelFullScreen();
                }
            }
            
            if (id === 'showFPS') {
                toggleFPSDisplay(e.target.checked);
            }
            
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCursor();
            }
        });
    }

    // Sistema de FPS Monitor
    let fpsMonitorElement = null;
    let fpsUpdateInterval = null;

    function toggleFPSDisplay(show) {
        if (show) {
            createFPSMonitor();
        } else {
            removeFPSMonitor();
        }
    }

    function createFPSMonitor() {
        if (fpsMonitorElement) return;

        fpsMonitorElement = document.createElement('div');
        fpsMonitorElement.id = 'as-fps-monitor';
        fpsMonitorElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(15, 8, 33, 0.9);
            border: 2px solid rgba(139, 92, 246, 0.6);
            border-radius: 8px;
            padding: 8px 12px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            color: #F59E0B;
            z-index: 9999;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            pointer-events: none;
        `;
        document.body.appendChild(fpsMonitorElement);

        let lastTime = performance.now();
        let frames = 0;
        let fps = 60;

        fpsUpdateInterval = setInterval(() => {
            const currentTime = performance.now();
            frames++;

            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
            }

            if (fpsMonitorElement) {
                const color = fps >= 55 ? '#10B981' : fps >= 30 ? '#F59E0B' : '#EF4444';
                fpsMonitorElement.style.color = color;
                fpsMonitorElement.textContent = `FPS: ${fps}`;
            }
        }, 100);

        logger.info('Monitor de FPS ativado');
    }

    function removeFPSMonitor() {
        if (fpsMonitorElement) {
            fpsMonitorElement.remove();
            fpsMonitorElement = null;
        }
        if (fpsUpdateInterval) {
            clearInterval(fpsUpdateInterval);
            fpsUpdateInterval = null;
        }
        logger.info('Monitor de FPS desativado');
    }

    // Sistema de Tooltips
    let tooltipElement = null;
    const tooltipTexts = {
        masterVolume: 'Controla o volume geral de todos os áudios do jogo',
        bgmVolume: 'Volume das músicas de fundo durante o jogo',
        bgsVolume: 'Volume dos sons ambientes (chuva, vento, etc.)',
        meVolume: 'Volume das músicas especiais (vitória, Game Over, etc.)',
        seVolume: 'Volume dos efeitos sonoros (ataques, itens, etc.)',
        windowOpacity: 'Transparência das janelas e menus',
        graphicsQuality: 'Qualidade gráfica geral do jogo',
        enableParticles: 'Mostrar partículas decorativas',
        targetFPS: 'Taxa de quadros por segundo (maior = mais suave)',
        smoothScaling: 'Suavizar imagens ao redimensionar',
        showFPS: 'Exibir contador de FPS no canto da tela',
        cacheStrategy: 'Estratégia de carregamento de recursos',
        cursorStyle: 'Aparência do cursor do mouse no jogo',
        fullscreen: 'Alternar entre tela cheia e janela'
    };

    function initializeTooltips() {
        if (!rootElement) return;

        const controlGroups = rootElement.querySelectorAll('.as-options-adv__control-group');
        
        controlGroups.forEach(group => {
            const input = group.querySelector('input, select');
            if (!input || !input.id) return;
            
            const tooltipText = tooltipTexts[input.id];
            if (!tooltipText) return;
            
            const label = group.querySelector('.as-options-adv__label');
            if (!label) return;
            
            label.addEventListener('mouseenter', (e) => {
                showTooltip(e, tooltipText);
            });
            
            label.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        });
    }

    function showTooltip(event, text) {
        if (!tooltipElement) {
            tooltipElement = document.createElement('div');
            tooltipElement.className = 'as-options-adv__tooltip';
            document.body.appendChild(tooltipElement);
        }
        
        tooltipElement.textContent = text;
        tooltipElement.classList.add('as-options-adv__tooltip--visible');
        
        // Posicionar tooltip
        const rect = event.target.getBoundingClientRect();
        tooltipElement.style.left = `${rect.left + rect.width / 2}px`;
        tooltipElement.style.top = `${rect.bottom + 10}px`;
        tooltipElement.style.transform = 'translateX(-50%)';
    }

    function hideTooltip() {
        if (tooltipElement) {
            tooltipElement.classList.remove('as-options-adv__tooltip--visible');
        }
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
        markAsSaved();
        showSaveConfirmation();
        showFeedback('✨ Configurações aplicadas com sucesso!');
        
        if (pendingCloseHandle) {
            clearTimeout(pendingCloseHandle);
        }
        pendingCloseHandle = setTimeout(() => {
            pendingCloseHandle = null;
            
            // Forçar limpeza da Scene_Title antes de voltar
            const titleScene = SceneManager._stack.find(scene => scene instanceof Scene_Title);
            if (titleScene && titleScene._asDecorReady) {
                titleScene._asDecorReady = false;
            }
            
            SceneManager.pop();
        }, APPLY_CLOSE_DELAY);
    }

    function showSaveConfirmation() {
        const confirmationHTML = `
            <div class="as-options-adv__save-confirmation" id="saveConfirmation">
                <div class="as-options-adv__check-icon">✓</div>
            </div>
        `;
        
        const container = rootElement.querySelector('.as-options-adv__container');
        if (container) {
            const existingConfirmation = container.querySelector('#saveConfirmation');
            if (existingConfirmation) {
                existingConfirmation.remove();
            }
            
            const confirmationElement = document.createElement('div');
            confirmationElement.innerHTML = confirmationHTML;
            container.appendChild(confirmationElement.firstElementChild);
            
            // Remover após animação
            setTimeout(() => {
                const confirmation = container.querySelector('#saveConfirmation');
                if (confirmation) {
                    confirmation.style.animation = 'checkFadeOut 0.5s ease forwards';
                    setTimeout(() => confirmation.remove(), 500);
                }
            }, 1500);
        }
    }

    function onReset() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playCancel();
        }
        applyResetDefaults();
        markAsUnsaved();
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
        
        // Forçar limpeza da Scene_Title antes de voltar
        const titleScene = SceneManager._stack.find(scene => scene instanceof Scene_Title);
        if (titleScene && titleScene._asDecorReady) {
            titleScene._asDecorReady = false;
        }
        
        // Esconder interface antes de sair
        hideOptions();
        detachKeyboardSupport();
        
        // Pequeno delay para animação
        setTimeout(() => {
            // Fecha a cena de opções
            SceneManager.pop();
        }, 150);
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
        ConfigManager.windowOpacity = configValues.windowOpacity;
        
        // Otimização
        ConfigManager.enableParticles = configValues.enableParticles;
        ConfigManager.targetFPS = configValues.targetFPS;
        ConfigManager.graphicsQuality = configValues.graphicsQuality;
        ConfigManager.smoothScaling = configValues.smoothScaling;
        ConfigManager.showFPS = configValues.showFPS;
        ConfigManager.cacheStrategy = configValues.cacheStrategy;
        ConfigManager.cursorStyle = configValues.cursorStyle;

        // Aplicar volumes em tempo real
        AudioManager.bgmVolume = configValues.bgmVolume;
        AudioManager.bgsVolume = configValues.bgsVolume;
        AudioManager.meVolume = configValues.meVolume;
        AudioManager.seVolume = configValues.seVolume;
        syncMasterVolume(configValues.masterVolume);

        // Aplicar FPS em tempo real (comentado para evitar problemas de renderização)
        // Será aplicado na próxima vez que o jogo for iniciado
        /*
        if (typeof Graphics !== 'undefined') {
            Graphics.setTickHandler(null);
            Graphics._tickHandler = null;
            Graphics._app._ticker.maxFPS = configValues.targetFPS;
            Graphics._app._ticker.minFPS = configValues.targetFPS;
            logger.info(`FPS definido para: ${configValues.targetFPS}`);
        }
        */
        
        logger.info(`FPS será aplicado na próxima inicialização: ${configValues.targetFPS}`);

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
