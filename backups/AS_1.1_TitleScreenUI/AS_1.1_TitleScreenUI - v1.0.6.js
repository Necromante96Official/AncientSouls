//=============================================================================
// AS_1.1_TitleScreenUI.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.6 ☆ Interface HTML da tela de título (layout medieval fantástico)
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_1.0_TitleScreen
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Title Screen UI (Sub-agente)
 * --------------------------------------------------------------------------
 * Injeta a interface HTML estilizada da tela de título, controla os eventos
 * de clique/navegação e publica comandos para o agente principal.
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleScreenUI = AS.TitleScreenUI || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.1_TitleScreenUI';
    const MODULE_VERSION = '1.0.6';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

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
        logger.info('Markup HTML inserido na árvore DOM.');
    }

    function destroyMarkup() {
        detachKeyboardSupport();
        buttons.forEach(button => button.removeEventListener('click', onButtonClick));
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
        });
    }

    function onButtonClick(event) {
        const command = event.currentTarget.dataset.command;
        if (!command) {
            return;
        }
        contextRef.publish('titlescreen:ui:command', { command });
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
