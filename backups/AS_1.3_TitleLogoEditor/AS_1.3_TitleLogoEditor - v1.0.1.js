//=============================================================================
// AS_1.3_TitleLogoEditor.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.1 ☆ Editor interativo para posicionar e escalar a logo da tela de título
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_1.0_TitleScreen
 * @orderAfter AS_1.1_TitleScreenUI
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Title Logo Editor (Ferramenta de apoio)
 * --------------------------------------------------------------------------
 * • Atalho padrão: F8 (abre/fecha o painel de edição quando na tela de título).
 * • Botão flutuante "Editar Logo" também alterna o painel.
 * • Ajustes realizados são aplicados em tempo real e persistem no ConfigManager.
 * • Depende dos agentes AS_1.0_TitleScreen e AS_1.1_TitleScreenUI.
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleLogoEditor = AS.TitleLogoEditor || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.3_TitleLogoEditor';
    const MODULE_VERSION = '1.0.1';
    const DEPENDENCIES = ['AS_0.0_PluginManager', 'AS_1.0_TitleScreen', 'AS_1.1_TitleScreenUI'];
    const TOGGLE_KEY = 'F8';
    const OFFSET_MIN = -2000;
    const OFFSET_MAX = 2000;
    const SCALE_MIN = 0.1;
    const SCALE_MAX = 4;

    const NODE_DEFINITIONS = [
        {
            id: 'group',
            label: 'Grupo Geral',
            offsetXKey: 'logoGroupOffsetX',
            offsetYKey: 'logoGroupOffsetY',
            scaleKey: 'logoGroupScale'
        },
        {
            id: 'base',
            label: 'Moldura (Base)',
            offsetXKey: 'logoBaseOffsetX',
            offsetYKey: 'logoBaseOffsetY',
            scaleKey: 'logoBaseScale'
        },
        {
            id: 'text',
            label: 'Título (Texto)',
            offsetXKey: 'logoTextOffsetX',
            offsetYKey: 'logoTextOffsetY',
            scaleKey: 'logoTextScale'
        },
        {
            id: 'dark',
            label: 'Soul Esquerda',
            offsetXKey: 'logoDarkOffsetX',
            offsetYKey: 'logoDarkOffsetY',
            scaleKey: 'logoDarkScale'
        },
        {
            id: 'light',
            label: 'Soul Direita',
            offsetXKey: 'logoLightOffsetX',
            offsetYKey: 'logoLightOffsetY',
            scaleKey: 'logoLightScale'
        }
    ];

    const NODE_DEFAULTS = {
        group: { offsetX: 0, offsetY: 0, scale: 1 },
        base: { offsetX: 0, offsetY: 0, scale: 1 },
        text: { offsetX: 0, offsetY: 0, scale: 1 },
        dark: { offsetX: 0, offsetY: 0, scale: 1 },
        light: { offsetX: 0, offsetY: 0, scale: 1 }
    };

    const EDITOR_STYLE_CONTENT = `
#as-logo-editor-toggle {
    position: fixed;
    bottom: 28px;
    left: 28px;
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    background: rgba(38, 24, 60, 0.92);
    color: #ffe8c4;
    font-family: 'Pixel Times', 'Times New Roman', serif;
    font-size: 15px;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(6, 3, 12, 0.65);
    transition: transform 160ms ease, box-shadow 160ms ease;
    z-index: 11000;
    display: none;
}

#as-logo-editor-toggle:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 26px rgba(6, 3, 12, 0.75);
}

#as-logo-editor-toggle[data-visible="true"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

#as-logo-editor {
    position: fixed;
    top: 0;
    right: 0;
    width: 380px;
    max-width: 95vw;
    height: 100%;
    background: rgba(12, 8, 20, 0.94);
    backdrop-filter: blur(4px);
    color: #ffe8c4;
    transform: translateX(100%);
    opacity: 0;
    pointer-events: none;
    transition: transform 220ms ease, opacity 220ms ease;
    box-shadow: -12px 0 28px rgba(6, 3, 12, 0.65);
    z-index: 11001;
}

#as-logo-editor[data-open="true"] {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
}

.as-logo-editor__panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 26px 22px;
    gap: 18px;
}

.as-logo-editor__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    letter-spacing: 1px;
}

.as-logo-editor__body {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.as-logo-editor__section {
    border: 1px solid rgba(255, 232, 196, 0.25);
    border-radius: 8px;
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.as-logo-editor__section legend {
    padding: 0 8px;
    font-size: 14px;
    letter-spacing: 1px;
}

.as-logo-editor__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.as-logo-editor__field label {
    font-size: 12px;
    opacity: 0.85;
    letter-spacing: 0.5px;
}

.as-logo-editor__field input[type="number"] {
    width: 100%;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid rgba(255, 232, 196, 0.45);
    background: rgba(22, 14, 36, 0.85);
    color: #ffe8c4;
    font-size: 14px;
}

.as-logo-editor__footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.as-logo-editor__footer button {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: rgba(38, 24, 60, 0.85);
    color: #ffe8c4;
    font-size: 14px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: filter 140ms ease;
}

.as-logo-editor__footer button:hover {
    filter: brightness(1.12);
}

.as-logo-editor__close {
    background: transparent;
    border: none;
    color: #ffe8c4;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
}

.as-logo-editor__close:hover {
    filter: brightness(1.2);
}
`;

    const logger = {
        info(message) {
            console.log(`🧭 [${MODULE_ID}] ${message}`);
        },
        warn(message) {
            console.warn(`⚠️ [${MODULE_ID}] ${message}`);
        },
        error(message) {
            console.error(`❌ [${MODULE_ID}] ${message}`);
        }
    };

    let contextRef = null;
    let toggleButton = null;
    let panelElement = null;
    let controlRegistry = {};
    let subscriptions = [];
    let keydownHandler = null;
    let saveHandle = null;
    let styleElement = null;

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Title Logo Editor',
        dependencies: DEPENDENCIES,
        init: context => {
            contextRef = context;
            ensureConfigIntegration();
            injectEditorStyles();
            createEditorUi();
            registerKeyHandler();
            subscriptions.push(context.subscribe('titlescreen:scene:ready', handleSceneReady));
            subscriptions.push(context.subscribe('titlescreen:scene:terminate', handleSceneTerminate));
            logger.info('Editor de logo inicializado e aguardando Scene_Title.');
            return {
                dispose() {
                    teardown();
                }
            };
        },
        cleanup: () => {
            teardown();
        }
    };

    function ensureConfigIntegration() {
        if (typeof ConfigManager === 'undefined') {
            return;
        }
        if (!ConfigManager._asLogoEditorDefaults) {
            Object.keys(NODE_DEFAULTS).forEach(id => {
                const defaults = NODE_DEFAULTS[id];
                const definition = NODE_DEFINITIONS.find(entry => entry.id === id);
                if (!definition) {
                    return;
                }
                if (ConfigManager[definition.offsetXKey] === undefined) {
                    ConfigManager[definition.offsetXKey] = defaults.offsetX;
                }
                if (ConfigManager[definition.offsetYKey] === undefined) {
                    ConfigManager[definition.offsetYKey] = defaults.offsetY;
                }
                if (ConfigManager[definition.scaleKey] === undefined) {
                    ConfigManager[definition.scaleKey] = defaults.scale;
                }
            });
            ConfigManager._asLogoEditorDefaults = true;
        }

        if (!ConfigManager._asLogoEditorPatched) {
            ConfigManager._asLogoEditorPatched = true;
            const originalMakeData = ConfigManager.makeData.bind(ConfigManager);
            const originalApplyData = ConfigManager.applyData.bind(ConfigManager);

            ConfigManager.makeData = function() {
                const config = originalMakeData();
                NODE_DEFINITIONS.forEach(definition => {
                    config[definition.offsetXKey] = clampNumber(Number(this[definition.offsetXKey]), OFFSET_MIN, OFFSET_MAX, NODE_DEFAULTS[definition.id].offsetX);
                    config[definition.offsetYKey] = clampNumber(Number(this[definition.offsetYKey]), OFFSET_MIN, OFFSET_MAX, NODE_DEFAULTS[definition.id].offsetY);
                    config[definition.scaleKey] = clampNumber(Number(this[definition.scaleKey]), SCALE_MIN, SCALE_MAX, NODE_DEFAULTS[definition.id].scale);
                });
                return config;
            };

            ConfigManager.applyData = function(config) {
                originalApplyData(config);
                NODE_DEFINITIONS.forEach(definition => {
                    this[definition.offsetXKey] = clampNumber(Number(config[definition.offsetXKey]), OFFSET_MIN, OFFSET_MAX, NODE_DEFAULTS[definition.id].offsetX);
                    this[definition.offsetYKey] = clampNumber(Number(config[definition.offsetYKey]), OFFSET_MIN, OFFSET_MAX, NODE_DEFAULTS[definition.id].offsetY);
                    this[definition.scaleKey] = clampNumber(Number(config[definition.scaleKey]), SCALE_MIN, SCALE_MAX, NODE_DEFAULTS[definition.id].scale);
                });
            };
        }
    }

    function injectEditorStyles() {
        if (typeof document === 'undefined') {
            return;
        }
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = `${MODULE_ID}-style`;
            styleElement.textContent = EDITOR_STYLE_CONTENT;
            document.head.appendChild(styleElement);
        }
    }

    function createEditorUi() {
        if (typeof document === 'undefined') {
            return;
        }
        toggleButton = document.createElement('button');
        toggleButton.id = 'as-logo-editor-toggle';
        toggleButton.type = 'button';
        toggleButton.dataset.visible = 'false';
        toggleButton.textContent = `Editar Logo (${TOGGLE_KEY})`;
        toggleButton.addEventListener('click', toggleEditor);
        document.body.appendChild(toggleButton);

        panelElement = document.createElement('div');
        panelElement.id = 'as-logo-editor';
        panelElement.dataset.open = 'false';
        panelElement.setAttribute('aria-hidden', 'true');

        const panel = document.createElement('div');
        panel.className = 'as-logo-editor__panel';
        panelElement.appendChild(panel);

        const header = document.createElement('div');
        header.className = 'as-logo-editor__header';
        const title = document.createElement('span');
        title.textContent = 'Editor de Logo';
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'as-logo-editor__close';
        closeButton.setAttribute('aria-label', 'Fechar editor');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeEditor);
        header.appendChild(title);
        header.appendChild(closeButton);
        panel.appendChild(header);

        const body = document.createElement('div');
        body.className = 'as-logo-editor__body';
        panel.appendChild(body);

        controlRegistry = {};
        NODE_DEFINITIONS.forEach(definition => {
            const section = createNodeSection(definition);
            body.appendChild(section);
        });

        const footer = document.createElement('div');
        footer.className = 'as-logo-editor__footer';
        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.textContent = 'Resetar';
        resetButton.addEventListener('click', resetLayout);
        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.textContent = 'Salvar';
        saveButton.addEventListener('click', forcePersist);
        footer.appendChild(resetButton);
        footer.appendChild(saveButton);
        panel.appendChild(footer);

        document.body.appendChild(panelElement);
    }

    function createNodeSection(definition) {
        const section = document.createElement('fieldset');
        section.className = 'as-logo-editor__section';
        const legend = document.createElement('legend');
        legend.textContent = definition.label;
        section.appendChild(legend);

        controlRegistry[definition.id] = {};
        section.appendChild(createControl(definition, 'offsetX', 'Horizontal (px)'));
        section.appendChild(createControl(definition, 'offsetY', 'Vertical (px)'));
        section.appendChild(createControl(definition, 'scale', 'Escala'));
        return section;
    }

    function createControl(definition, property, labelText) {
        const row = document.createElement('div');
        row.className = 'as-logo-editor__field';
        const label = document.createElement('label');
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = 'number';
        if (property === 'scale') {
            input.step = '0.01';
            input.min = String(SCALE_MIN);
            input.max = String(SCALE_MAX);
        } else {
            input.step = '1';
            input.min = String(OFFSET_MIN);
            input.max = String(OFFSET_MAX);
        }
        input.addEventListener('input', () => handleControlInput(definition, property, input));
        label.appendChild(document.createElement('br'));
        label.appendChild(input);
        row.appendChild(label);
        controlRegistry[definition.id][property] = input;
        return row;
    }

    function registerKeyHandler() {
        if (typeof document === 'undefined') {
            return;
        }
        keydownHandler = event => {
            if (event.key === TOGGLE_KEY && !event.repeat) {
                if (toggleButton && toggleButton.dataset.visible === 'true') {
                    event.preventDefault();
                    toggleEditor();
                }
            }
        };
        document.addEventListener('keydown', keydownHandler);
    }

    function handleSceneReady() {
        setToggleVisibility(true);
        syncInputsWithConfig();
        broadcastLayoutUpdate();
    }

    function handleSceneTerminate() {
        setToggleVisibility(false);
        closeEditor();
    }

    function setToggleVisibility(visible) {
        if (!toggleButton) {
            return;
        }
        toggleButton.dataset.visible = visible ? 'true' : 'false';
        toggleButton.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    function toggleEditor() {
        if (!panelElement) {
            return;
        }
        if (panelElement.dataset.open === 'true') {
            closeEditor();
        } else {
            openEditor();
        }
    }

    function openEditor() {
        if (!panelElement) {
            return;
        }
        syncInputsWithConfig();
        panelElement.dataset.open = 'true';
        panelElement.setAttribute('aria-hidden', 'false');
        const firstControl = panelElement.querySelector('input');
        if (firstControl) {
            firstControl.focus();
        }
    }

    function closeEditor() {
        if (!panelElement) {
            return;
        }
        panelElement.dataset.open = 'false';
        panelElement.setAttribute('aria-hidden', 'true');
    }

    function syncInputsWithConfig() {
        if (!controlRegistry || !ConfigManager) {
            return;
        }
        NODE_DEFINITIONS.forEach(definition => {
            const controls = controlRegistry[definition.id];
            if (!controls) {
                return;
            }
            const offsets = NODE_DEFAULTS[definition.id];
            controls.offsetX.value = String(readConfigNumber(definition.offsetXKey, offsets.offsetX));
            controls.offsetY.value = String(readConfigNumber(definition.offsetYKey, offsets.offsetY));
            controls.scale.value = String(readConfigNumber(definition.scaleKey, offsets.scale));
        });
    }

    function handleControlInput(definition, property, input) {
        if (!ConfigManager) {
            return;
        }
        const raw = Number(input.value);
        let sanitized;
        if (property === 'scale') {
            sanitized = clampNumber(raw, SCALE_MIN, SCALE_MAX, NODE_DEFAULTS[definition.id].scale);
        } else {
            sanitized = clampNumber(raw, OFFSET_MIN, OFFSET_MAX, NODE_DEFAULTS[definition.id][property]);
        }
        input.value = String(sanitized);
        const key = property === 'offsetX'
            ? definition.offsetXKey
            : property === 'offsetY'
            ? definition.offsetYKey
            : definition.scaleKey;
        ConfigManager[key] = sanitized;
        broadcastLayoutUpdate();
        schedulePersist();
    }

    function broadcastLayoutUpdate() {
        const settings = collectLayoutSettings();
        try {
            if (contextRef && typeof contextRef.publish === 'function') {
                contextRef.publish('titlescreen:logo:layoutChanged', { settings });
            }
            if (AS && AS.PluginManager && typeof AS.PluginManager.publish === 'function') {
                AS.PluginManager.publish('titlescreen:logo:layoutChanged', { settings });
            }
        } catch (error) {
            logger.warn(`Não foi possível enviar atualização de layout: ${error.message}`);
        }
    }

    function collectLayoutSettings() {
        const settings = {};
        NODE_DEFINITIONS.forEach(definition => {
            const defaults = NODE_DEFAULTS[definition.id];
            settings[definition.id] = {
                offsetX: readConfigNumber(definition.offsetXKey, defaults.offsetX),
                offsetY: readConfigNumber(definition.offsetYKey, defaults.offsetY),
                scale: readConfigNumber(definition.scaleKey, defaults.scale)
            };
        });
        return settings;
    }

    function readConfigNumber(key, fallback) {
        if (!ConfigManager) {
            return fallback;
        }
        const value = Number(ConfigManager[key]);
        if (Number.isFinite(value)) {
            return value;
        }
        return fallback;
    }

    function schedulePersist() {
        if (saveHandle) {
            clearTimeout(saveHandle);
        }
        saveHandle = setTimeout(() => {
            saveHandle = null;
            if (ConfigManager && typeof ConfigManager.save === 'function') {
                ConfigManager.save();
            }
        }, 400);
    }

    function forcePersist() {
        if (saveHandle) {
            clearTimeout(saveHandle);
            saveHandle = null;
        }
        if (ConfigManager && typeof ConfigManager.save === 'function') {
            ConfigManager.save();
        }
    }

    function resetLayout() {
        if (!ConfigManager) {
            return;
        }
        NODE_DEFINITIONS.forEach(definition => {
            const defaults = NODE_DEFAULTS[definition.id];
            ConfigManager[definition.offsetXKey] = defaults.offsetX;
            ConfigManager[definition.offsetYKey] = defaults.offsetY;
            ConfigManager[definition.scaleKey] = defaults.scale;
        });
        syncInputsWithConfig();
        broadcastLayoutUpdate();
        forcePersist();
    }

    function clampNumber(value, min, max, fallback) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return fallback;
        }
        let result = numeric;
        if (typeof min === 'number') {
            result = Math.max(min, result);
        }
        if (typeof max === 'number') {
            result = Math.min(max, result);
        }
        return result;
    }

    function teardown() {
        if (saveHandle) {
            clearTimeout(saveHandle);
            saveHandle = null;
        }
        forcePersist();
        subscriptions.forEach(unsubscribe => {
            try {
                unsubscribe();
            } catch (_) {
                // ignorado
            }
        });
        subscriptions = [];
        if (keydownHandler && typeof document !== 'undefined') {
            document.removeEventListener('keydown', keydownHandler);
            keydownHandler = null;
        }
        if (toggleButton && toggleButton.parentNode) {
            toggleButton.parentNode.removeChild(toggleButton);
        }
        toggleButton = null;
        if (panelElement && panelElement.parentNode) {
            panelElement.parentNode.removeChild(panelElement);
        }
        panelElement = null;
        controlRegistry = {};
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
        styleElement = null;
        contextRef = null;
    }

    if (AS && AS.PluginManager && typeof AS.PluginManager.register === 'function') {
        AS.PluginManager.register(manifest);
    } else {
        console.error(`❌ [${MODULE_ID}] PluginManager não encontrado. Verifique a ordem de carregamento.`);
    }
})();
