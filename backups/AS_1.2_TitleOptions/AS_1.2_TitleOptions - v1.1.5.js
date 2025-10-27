//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.1.5 ☆ Interface HTML moderna para opções com estética medieval fantástica
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
    const MODULE_VERSION = '1.1.5';
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
            masterVolume: ConfigManager.masterVolume || 80,
            bgmVolume: ConfigManager.bgmVolume || 90,
            seVolume: ConfigManager.seVolume || 80,
            messageSpeed: ConfigManager.messageSpeed || 'normal',
            battleMode: ConfigManager.battleMode || 'active',
            alwaysDash: ConfigManager.alwaysDash !== undefined ? ConfigManager.alwaysDash : true,
            fullscreen: Graphics._isFullScreen(),
            effectQuality: ConfigManager.effectQuality || 'medium',
            enableLogoAnimation: ConfigManager.enableLogoAnimation !== undefined ? ConfigManager.enableLogoAnimation : true,
            animationSpeed: ConfigManager.animationSpeed || 4.0,
            enableMusicFade: ConfigManager.enableMusicFade !== undefined ? ConfigManager.enableMusicFade : true,
            musicFadeDuration: ConfigManager.musicFadeDuration || 1000
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
                case 'bgmVolume':
                    AudioManager.bgmVolume = value;
                    break;
                case 'seVolume':
                    AudioManager.seVolume = value;
                    break;
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
        ConfigManager.masterVolume = configValues.masterVolume;
        ConfigManager.bgmVolume = configValues.bgmVolume;
        ConfigManager.seVolume = configValues.seVolume;
        ConfigManager.messageSpeed = configValues.messageSpeed;
        ConfigManager.battleMode = configValues.battleMode;
        ConfigManager.alwaysDash = configValues.alwaysDash;
        ConfigManager.effectQuality = configValues.effectQuality;
        ConfigManager.enableLogoAnimation = configValues.enableLogoAnimation;
        ConfigManager.animationSpeed = configValues.animationSpeed;
        ConfigManager.enableMusicFade = configValues.enableMusicFade;
        ConfigManager.musicFadeDuration = configValues.musicFadeDuration;
        
        ConfigManager.save();
        
        AudioManager.updateBgmParameters({ volume: configValues.bgmVolume });
        AudioManager.updateBgsParameters({ volume: configValues.bgmVolume });
        AudioManager.updateMeParameters({ volume: configValues.bgmVolume });
        AudioManager.updateSeParameters({ volume: configValues.seVolume });
        
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
