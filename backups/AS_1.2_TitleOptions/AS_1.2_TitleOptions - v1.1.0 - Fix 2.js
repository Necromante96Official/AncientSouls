//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.1.0 ☆ Interface HTML moderna para opções com estética medieval fantástica
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
    const MODULE_VERSION = '1.1.0';
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

    function applySceneHooks() {
        const Scene_Options_create = Scene_Options.prototype.create;
        Scene_Options.prototype.create = function() {
            Scene_Options_create.call(this);
            this._asOptionsActive = false;
        };

        const Scene_Options_start = Scene_Options.prototype.start;
        Scene_Options.prototype.start = function() {
            Scene_Options_start.call(this);
            if (this._optionsWindow) {
                this._optionsWindow.deactivate();
                this._optionsWindow.hide();
            }
            injectStyles();
            injectMarkup();
            loadConfigValues();
            bindControls();
            showOptions();
            this._asOptionsActive = true;
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
        document.body.appendChild(rootElement);
        
        tabs = Array.from(rootElement.querySelectorAll('.as-options__tab'));
        panels = Array.from(rootElement.querySelectorAll('.as-options__panel'));
        
        logger.info('Markup HTML da tela de opções inserido.');
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
            masterVolume: ConfigManager.masterVolume || 80,
            bgmVolume: ConfigManager.bgmVolume || 90,
            seVolume: ConfigManager.seVolume || 80,
            messageSpeed: ConfigManager.messageSpeed || 'normal',
            battleMode: ConfigManager.battleMode || 'active',
            alwaysDash: ConfigManager.alwaysDash !== undefined ? ConfigManager.alwaysDash : true,
            fullscreen: Graphics._isFullScreen(),
            effectQuality: ConfigManager.effectQuality || 'medium'
        };

        updateUIFromConfig();
    }

    function updateUIFromConfig() {
        const setValue = (id, value) => {
            const element = rootElement.querySelector(`#${id}`);
            if (!element) return;
            
            if (element.type === 'range') {
                element.value = value;
                const valueDisplay = rootElement.querySelector(`#${id}Value`);
                if (valueDisplay) valueDisplay.textContent = `${value}%`;
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
    }

    function bindControls() {
        tabs.forEach(tab => {
            tab.addEventListener('click', onTabClick);
        });

        bindSlider('masterVolume');
        bindSlider('bgmVolume');
        bindSlider('seVolume');

        bindSelect('messageSpeed');
        bindSelect('battleMode');
        bindSelect('effectQuality');

        bindToggle('alwaysDash');
        bindToggle('fullscreen');

        const applyButton = rootElement.querySelector('#applyButton');
        if (applyButton) {
            applyButton.addEventListener('click', onApply);
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

    function bindSlider(id) {
        const slider = rootElement.querySelector(`#${id}`);
        const valueDisplay = rootElement.querySelector(`#${id}Value`);
        
        if (!slider || !valueDisplay) return;

        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            valueDisplay.textContent = `${value}%`;
            configValues[id] = value;
            
            if (id === 'bgmVolume') {
                AudioManager.updateBgmParameters({ volume: value });
            } else if (id === 'seVolume') {
                AudioManager.updateSeParameters({ volume: value });
            }
        });
    }

    function bindSelect(id) {
        const select = rootElement.querySelector(`#${id}`);
        if (!select) return;

        select.addEventListener('change', (e) => {
            configValues[id] = e.target.value;
            SoundManager.playCursor();
        });
    }

    function bindToggle(id) {
        const toggle = rootElement.querySelector(`#${id}`);
        if (!toggle) return;

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
        ConfigManager.masterVolume = configValues.masterVolume;
        ConfigManager.bgmVolume = configValues.bgmVolume;
        ConfigManager.seVolume = configValues.seVolume;
        ConfigManager.messageSpeed = configValues.messageSpeed;
        ConfigManager.battleMode = configValues.battleMode;
        ConfigManager.alwaysDash = configValues.alwaysDash;
        ConfigManager.effectQuality = configValues.effectQuality;
        
        ConfigManager.save();
        
        AudioManager.updateBgmParameters({ volume: configValues.bgmVolume });
        AudioManager.updateBgsParameters({ volume: configValues.bgmVolume });
        AudioManager.updateMeParameters({ volume: configValues.bgmVolume });
        AudioManager.updateSeParameters({ volume: configValues.seVolume });
        
        logger.info('Configurações salvas com sucesso.');
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
        try {
            if (!Utils.isNwjs()) {
                logger.warn('Ambiente sem Node.js.');
                return '';
            }
            const fs = require('fs');
            const path = require('path');
            const base = path.dirname(process.mainModule.filename);
            const target = path.join(base, relativePath);
            return fs.readFileSync(target, 'utf8');
        } catch (error) {
            logger.error(`Erro ao carregar ${relativePath}: ${error.message}`);
            return '';
        }
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
