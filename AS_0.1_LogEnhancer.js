//=============================================================================
// AS_0.1_LogEnhancer.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.1 ☆ Consolida e enriquece a telemetria de logs do projeto
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Log Enhancer (Agente utilitário)
 * --------------------------------------------------------------------------
 * • Centraliza logs emitidos via console.* e SceneManager.onError.
 * • Formata cada entrada com carimbo temporal, cena ativa e stack resumido.
 * • Publica eventos `diagnostics:log:entry` para consumo por outros agentes.
 * • Captura falhas globais (window.onerror / unhandledrejection).
 * ==========================================================================
 * Nenhum comando de plugin ou parâmetro configurável.
 */

var AS = AS || {};
AS.LogEnhancer = AS.LogEnhancer || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_0.1_LogEnhancer';
    const MODULE_VERSION = '1.0.1';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    const MAX_ENTRIES = 400;
    const STACK_SKIP = 3;
    const LEVELS = {
        log: { icon: '🛈', label: 'LOG' },
        info: { icon: '🜂', label: 'INFO' },
        warn: { icon: '⚠️', label: 'WARN' },
        error: { icon: '🛑', label: 'ERROR' },
        debug: { icon: '🔍', label: 'DEBUG' }
    };

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Log Enhancer',
        dependencies: DEPENDENCIES,
        init: context => {
            return setupAgent(context);
        },
        cleanup: () => {
            if (AS.LogEnhancer.instance && typeof AS.LogEnhancer.instance.dispose === 'function') {
                AS.LogEnhancer.instance.dispose();
            }
        }
    };

    function setupAgent(context) {
        if (AS.LogEnhancer.instance) {
            return AS.LogEnhancer.instance;
        }

        const state = {
            buffer: [],
            originalConsole: {},
            subscriptions: [],
            context,
            listenersInstalled: false
        };

        hookConsole(state);
        hookSceneManager(state);
        hookGlobalErrors(state);

        const api = {
            getEntries: filter => getEntries(state, filter),
            flush: () => state.buffer.slice(),
            dispose: () => dispose(state)
        };

        AS.LogEnhancer.instance = api;
        return api;
    }

    function dispose(state) {
        restoreConsole(state);
        restoreSceneManager(state);
        restoreGlobalErrors(state);
        state.buffer.length = 0;
        state.subscriptions.length = 0;
        AS.LogEnhancer.instance = null;
    }

    function hookConsole(state) {
        if (state.listenersInstalled) {
            return;
        }
        state.listenersInstalled = true;
        ['log', 'info', 'warn', 'error', 'debug'].forEach(level => {
            const original = console[level] ? console[level].bind(console) : console.log.bind(console);
            state.originalConsole[level] = original;
            console[level] = (...args) => {
                const entry = buildEntry(state, level, args);
                storeEntry(state, entry);
                emitEntry(state, entry);
                original(prefix(entry), ...args);
            };
        });
    }

    function restoreConsole(state) {
        Object.keys(state.originalConsole).forEach(level => {
            console[level] = state.originalConsole[level];
        });
        state.listenersInstalled = false;
    }

    function hookSceneManager(state) {
        if (typeof SceneManager === 'undefined') {
            return;
        }
        if (state._originalSceneOnError) {
            return;
        }
        state._originalSceneOnError = SceneManager.onError;
        SceneManager.onError = function(error) {
            const normalized = normalizeError(error);
            const entry = buildEntry(state, 'error', [normalized.message], normalized.meta);
            storeEntry(state, entry);
            emitEntry(state, entry);
            if (state._originalSceneOnError) {
                state._originalSceneOnError.call(this, error);
            }
        };
    }

    function restoreSceneManager(state) {
        if (state._originalSceneOnError) {
            SceneManager.onError = state._originalSceneOnError;
            state._originalSceneOnError = null;
        }
    }

    function hookGlobalErrors(state) {
        if (typeof window === 'undefined') {
            return;
        }
        state._onWindowError = event => {
            const normalized = normalizeError(event.error || event.message || event);
            const entry = buildEntry(state, 'error', [normalized.message], {
                kind: 'window.onerror',
                detail: normalized.meta
            });
            storeEntry(state, entry);
            emitEntry(state, entry);
        };
        state._onUnhandledRejection = event => {
            const reason = event ? event.reason : null;
            const normalized = normalizeError(reason || 'Unhandled Rejection');
            const entry = buildEntry(state, 'error', [normalized.message], {
                kind: 'unhandledrejection',
                detail: normalized.meta
            });
            storeEntry(state, entry);
            emitEntry(state, entry);
        };
        window.addEventListener('error', state._onWindowError);
        window.addEventListener('unhandledrejection', state._onUnhandledRejection);
    }

    function restoreGlobalErrors(state) {
        if (typeof window === 'undefined') {
            return;
        }
        if (state._onWindowError) {
            window.removeEventListener('error', state._onWindowError);
            state._onWindowError = null;
        }
        if (state._onUnhandledRejection) {
            window.removeEventListener('unhandledrejection', state._onUnhandledRejection);
            state._onUnhandledRejection = null;
        }
    }

    function getEntries(state, filter) {
        if (!filter) {
            return state.buffer.slice();
        }
        const { level } = filter;
        if (!level) {
            return state.buffer.slice();
        }
        return state.buffer.filter(entry => entry.level === level);
    }

    function buildEntry(state, level, args, meta) {
        const { icon, label } = LEVELS[level] || LEVELS.log;
        const time = new Date();
        const frame = {
            timestamp: time.toISOString(),
            localeTime: formatTime(time),
            level,
            icon,
            label,
            scene: currentSceneName(),
            payload: args,
            meta: meta || {}
        };
        if (!frame.meta.stack) {
            frame.meta.stack = captureStack(level === 'error' ? 2 : STACK_SKIP);
        }
        frame.meta.memory = captureMemory();
        return frame;
    }

    function storeEntry(state, entry) {
        state.buffer.push(entry);
        if (state.buffer.length > MAX_ENTRIES) {
            state.buffer.shift();
        }
    }

    function emitEntry(state, entry) {
        try {
            state.context.publish('diagnostics:log:entry', entry);
        } catch (error) {
            state.originalConsole.error('[LogEnhancer] Falha ao publicar entrada.', error);
        }
    }

    function prefix(entry) {
        return `${entry.icon} [${entry.label}] ${entry.localeTime} • ${entry.scene}`;
    }

    function formatTime(time) {
        const pad = (value, length = 2) => String(value).padStart(length, '0');
        return `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}.${pad(time.getMilliseconds(), 3)}`;
    }

    function currentSceneName() {
        if (typeof SceneManager === 'undefined') {
            return 'Scene:Unknown';
        }
        const scene = SceneManager._scene;
        if (scene && scene.constructor && scene.constructor.name) {
            return scene.constructor.name;
        }
        const nextScene = SceneManager._nextScene;
        if (nextScene && nextScene.constructor && nextScene.constructor.name) {
            return `${nextScene.constructor.name} (pending)`;
        }
        if (SceneManager._sceneStack && SceneManager._sceneStack.length) {
            const last = SceneManager._sceneStack[SceneManager._sceneStack.length - 1];
            if (last && last.constructor && last.constructor.name) {
                return `${last.constructor.name} (stack)`;
            }
        }
        return 'Scene:Boot';
    }

    function captureStack(skip) {
        const stack = new Error().stack || '';
        return stack.split('\n').slice(skip).map(line => line.trim());
    }

    function captureMemory() {
        if (typeof window === 'undefined' || !window.performance || !performance.memory) {
            return null;
        }
        const { totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        return { totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit };
    }

    function normalizeError(error) {
        if (!error) {
            return { message: 'Erro desconhecido', meta: { stack: captureStack(4) } };
        }
        if (typeof error === 'string') {
            return { message: error, meta: { stack: captureStack(4) } };
        }
        const message = error.message || 'Erro sem mensagem';
        const meta = {
            name: error.name || 'Error',
            stack: error.stack ? error.stack.split('\n').map(line => line.trim()) : captureStack(4),
            detail: sanitizeProps(error)
        };
        return { message, meta };
    }

    function sanitizeProps(error) {
        const safe = {};
        Object.keys(error || {}).forEach(key => {
            if (key === 'stack') {
                return;
            }
            const value = error[key];
            if (typeof value === 'function') {
                return;
            }
            safe[key] = value;
        });
        return safe;
    }

    if (AS && AS.PluginManager && typeof AS.PluginManager.register === 'function') {
        AS.PluginManager.register(manifest);
    } else {
        console.error(`❌ [${MODULE_ID}] PluginManager não encontrado. Verifique ordem de carregamento.`);
    }
})();

//=============================================================================
// Fim de AS_0.1_LogEnhancer.js
//=============================================================================
