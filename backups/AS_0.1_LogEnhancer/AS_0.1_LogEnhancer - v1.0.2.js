//=============================================================================
// AS_0.1_LogEnhancer.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.2 ☆ Sistema avançado de telemetria com agrupamento, performance e retry tracking
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Log Enhancer (Agente utilitário)
 * --------------------------------------------------------------------------
 * • Centraliza logs emitidos via console.* e SceneManager.onError.
 * • Formata cada entrada com carimbo temporal, cena ativa e stack detalhado.
 * • Publica eventos `diagnostics:log:entry` para consumo por outros agentes.
 * • Captura falhas globais (window.onerror / unhandledrejection).
 * • Agrupa erros similares para identificar padrões.
 * • Monitora performance com timestamps delta entre logs.
 * • Rastreia tentativas de retry em operações falhadas.
 * • Detecta padrões de erro e memory leaks.
 * ==========================================================================
 * 
 * RECURSOS AVANÇADOS:
 * - Stack traces completos e detalhados
 * - Agrupamento automático de erros similares
 * - Performance delta entre logs consecutivos
 * - Contadores de retry e failover
 * - Detecção de padrões de erro recorrentes
 * - Memory leak detection
 * - Scene transition tracking
 * ==========================================================================
 * Nenhum comando de plugin ou parâmetro configurável.
 */

var AS = AS || {};
AS.LogEnhancer = AS.LogEnhancer || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_0.1_LogEnhancer';
    const MODULE_VERSION = '1.0.2';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    const MAX_ENTRIES = 500; // Aumentado para tracking melhor
    const STACK_SKIP = 3;
    const MAX_ERROR_GROUPS = 50; // Máximo de grupos de erros únicos
    const PERFORMANCE_THRESHOLD_MS = 100; // Alerta se delta > 100ms
    const MEMORY_LEAK_THRESHOLD = 50 * 1024 * 1024; // 50MB de aumento
    
    const LEVELS = {
        log: { icon: '🛈', label: 'LOG' },
        info: { icon: '🜂', label: 'INFO' },
        warn: { icon: '⚠️', label: 'WARN' },
        error: { icon: '🛑', label: 'ERROR' },
        debug: { icon: '🔍', label: 'DEBUG' },
        perf: { icon: '⚡', label: 'PERF' },
        pattern: { icon: '🔁', label: 'PATTERN' }
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
            listenersInstalled: false,
            // Novos recursos avançados
            errorGroups: new Map(), // Agrupamento de erros similares
            retryCounters: new Map(), // Contador de retries por operação
            performanceBaseline: Date.now(), // Timestamp inicial
            lastEntryTime: Date.now(), // Último log
            memoryBaseline: null, // Baseline de memória
            sceneTransitions: [], // Histórico de transições
            errorPatterns: [] // Padrões de erro detectados
        };

        hookConsole(state);
        hookSceneManager(state);
        hookGlobalErrors(state);
        initMemoryBaseline(state);
        startPatternDetection(state);

        const api = {
            getEntries: filter => getEntries(state, filter),
            flush: () => state.buffer.slice(),
            dispose: () => dispose(state),
            // Novos métodos de análise
            getErrorGroups: () => Array.from(state.errorGroups.values()),
            getRetryStats: () => Array.from(state.retryCounters.entries()),
            getPerformanceReport: () => getPerformanceReport(state),
            getMemoryReport: () => getMemoryReport(state),
            getPatternReport: () => getPatternReport(state),
            trackRetry: (operationName) => trackRetry(state, operationName),
            detectMemoryLeak: () => detectMemoryLeak(state)
        };

        AS.LogEnhancer.instance = api;
        console.log(`✓ [LogEnhancer] v${MODULE_VERSION} inicializado com recursos avançados`);
        return api;
    }

    function dispose(state) {
        restoreConsole(state);
        restoreSceneManager(state);
        restoreGlobalErrors(state);
        
        // Limpar novos recursos
        if (state._patternInterval) {
            clearInterval(state._patternInterval);
            state._patternInterval = null;
        }
        
        state.buffer.length = 0;
        state.subscriptions.length = 0;
        state.errorGroups.clear();
        state.retryCounters.clear();
        state.sceneTransitions.length = 0;
        state.errorPatterns.length = 0;
        
        AS.LogEnhancer.instance = null;
        console.log('🗑️ [LogEnhancer] Recursos liberados');
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
        const now = Date.now();
        const deltaSinceLast = now - state.lastEntryTime;
        const deltaFromStart = now - state.performanceBaseline;
        
        const frame = {
            timestamp: time.toISOString(),
            localeTime: formatTime(time),
            level,
            icon,
            label,
            scene: currentSceneName(),
            payload: args,
            meta: meta || {},
            // Performance tracking
            performance: {
                deltaSinceLast,
                deltaFromStart,
                slowLog: deltaSinceLast > PERFORMANCE_THRESHOLD_MS
            }
        };
        
        // Stack trace completo
        if (!frame.meta.stack) {
            frame.meta.stack = captureDetailedStack(level === 'error' ? 2 : STACK_SKIP);
        }
        
        // Memory snapshot
        frame.meta.memory = captureMemory();
        
        // Scene tracking
        if (frame.scene !== state.lastScene) {
            trackSceneTransition(state, state.lastScene, frame.scene);
            state.lastScene = frame.scene;
        }
        
        // Error grouping
        if (level === 'error' || level === 'warn') {
            groupError(state, frame);
        }
        
        // Performance alert
        if (frame.performance.slowLog) {
            console.warn(`⚡ [LogEnhancer] Log lento detectado: ${deltaSinceLast}ms desde último log`);
        }
        
        state.lastEntryTime = now;
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

    // =========================================================================
    // RECURSOS AVANÇADOS DE ANÁLISE
    // =========================================================================

    function captureDetailedStack(skip) {
        const stack = new Error().stack || '';
        const lines = stack.split('\n').slice(skip);
        return lines.map((line, index) => {
            const trimmed = line.trim();
            // Extrair informações úteis da stack
            const match = trimmed.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
            if (match) {
                return {
                    raw: trimmed,
                    function: match[1],
                    file: match[2],
                    line: parseInt(match[3]),
                    column: parseInt(match[4]),
                    depth: index
                };
            }
            return { raw: trimmed, depth: index };
        });
    }

    function groupError(state, entry) {
        const message = entry.payload.join(' ');
        const signature = generateErrorSignature(message, entry.meta.stack);
        
        if (!state.errorGroups.has(signature)) {
            state.errorGroups.set(signature, {
                signature,
                message,
                count: 0,
                firstSeen: entry.timestamp,
                lastSeen: entry.timestamp,
                scenes: new Set(),
                samples: []
            });
        }
        
        const group = state.errorGroups.get(signature);
        group.count++;
        group.lastSeen = entry.timestamp;
        group.scenes.add(entry.scene);
        
        // Guardar apenas 3 amostras por grupo
        if (group.samples.length < 3) {
            group.samples.push(entry);
        }
        
        // Limitar grupos
        if (state.errorGroups.size > MAX_ERROR_GROUPS) {
            const oldestKey = Array.from(state.errorGroups.keys())[0];
            state.errorGroups.delete(oldestKey);
        }
        
        // Detectar padrão se erro se repete muito
        if (group.count >= 3) {
            detectErrorPattern(state, group);
        }
    }

    function generateErrorSignature(message, stack) {
        // Criar assinatura única baseada em mensagem + top 2 frames do stack
        const stackSig = Array.isArray(stack) 
            ? stack.slice(0, 2).map(f => typeof f === 'object' ? f.raw : f).join('|')
            : String(stack).slice(0, 100);
        return `${message.slice(0, 50)}::${stackSig}`.replace(/\s+/g, '_');
    }

    function detectErrorPattern(state, group) {
        const pattern = {
            signature: group.signature,
            message: group.message,
            count: group.count,
            frequency: calculateFrequency(group),
            scenes: Array.from(group.scenes),
            detectedAt: new Date().toISOString()
        };
        
        // Adicionar se não existe ainda
        const exists = state.errorPatterns.some(p => p.signature === pattern.signature);
        if (!exists) {
            state.errorPatterns.push(pattern);
            console.warn(`🔁 [LogEnhancer] Padrão de erro detectado: "${group.message}" (${group.count}x)`);
            
            // Publicar evento
            try {
                state.context.publish('diagnostics:pattern:detected', pattern);
            } catch (e) {}
        }
    }

    function calculateFrequency(group) {
        const first = new Date(group.firstSeen);
        const last = new Date(group.lastSeen);
        const durationMs = last - first;
        if (durationMs === 0) return 0;
        return (group.count / (durationMs / 1000)).toFixed(2); // erros por segundo
    }

    function trackRetry(state, operationName) {
        if (!state.retryCounters.has(operationName)) {
            state.retryCounters.set(operationName, {
                name: operationName,
                attempts: 0,
                successes: 0,
                failures: 0,
                lastAttempt: null
            });
        }
        
        const counter = state.retryCounters.get(operationName);
        counter.attempts++;
        counter.lastAttempt = new Date().toISOString();
        
        console.info(`🔁 [LogEnhancer] Retry #${counter.attempts} para "${operationName}"`);
        return counter;
    }

    function trackSceneTransition(state, fromScene, toScene) {
        const transition = {
            from: fromScene,
            to: toScene,
            timestamp: new Date().toISOString(),
            memory: captureMemory()
        };
        
        state.sceneTransitions.push(transition);
        
        // Manter apenas últimas 20 transições
        if (state.sceneTransitions.length > 20) {
            state.sceneTransitions.shift();
        }
        
        console.info(`🎬 [LogEnhancer] Transição: ${fromScene} → ${toScene}`);
    }

    function initMemoryBaseline(state) {
        const memory = captureMemory();
        if (memory) {
            state.memoryBaseline = memory.usedJSHeapSize;
        }
    }

    function detectMemoryLeak(state) {
        const current = captureMemory();
        if (!current || !state.memoryBaseline) {
            return null;
        }
        
        const increase = current.usedJSHeapSize - state.memoryBaseline;
        const leaked = increase > MEMORY_LEAK_THRESHOLD;
        
        if (leaked) {
            console.warn(`🛑 [LogEnhancer] Possível memory leak detectado! +${(increase / 1024 / 1024).toFixed(2)}MB`);
        }
        
        return {
            baseline: state.memoryBaseline,
            current: current.usedJSHeapSize,
            increase,
            leaked,
            increasePercent: ((increase / state.memoryBaseline) * 100).toFixed(2)
        };
    }

    function startPatternDetection(state) {
        // Verificar padrões a cada 10 segundos
        if (state._patternInterval) {
            clearInterval(state._patternInterval);
        }
        
        state._patternInterval = setInterval(() => {
            // Analisar se há grupos de erro crescendo
            state.errorGroups.forEach(group => {
                if (group.count >= 5) {
                    detectErrorPattern(state, group);
                }
            });
            
            // Verificar memory leak
            const leakReport = detectMemoryLeak(state);
            if (leakReport && leakReport.leaked) {
                try {
                    state.context.publish('diagnostics:memory:leak', leakReport);
                } catch (e) {}
            }
        }, 10000);
    }

    function getPerformanceReport(state) {
        const totalTime = Date.now() - state.performanceBaseline;
        const slowLogs = state.buffer.filter(e => e.performance && e.performance.slowLog).length;
        
        return {
            totalRuntime: totalTime,
            totalLogs: state.buffer.length,
            slowLogs,
            slowLogPercent: ((slowLogs / state.buffer.length) * 100).toFixed(2),
            averageLogInterval: (totalTime / state.buffer.length).toFixed(2)
        };
    }

    function getMemoryReport(state) {
        const current = captureMemory();
        if (!current || !state.memoryBaseline) {
            return { status: 'unavailable' };
        }
        
        return {
            baseline: state.memoryBaseline,
            current: current.usedJSHeapSize,
            total: current.totalJSHeapSize,
            limit: current.jsHeapSizeLimit,
            increase: current.usedJSHeapSize - state.memoryBaseline,
            usagePercent: ((current.usedJSHeapSize / current.jsHeapSizeLimit) * 100).toFixed(2)
        };
    }

    function getPatternReport(state) {
        return {
            totalPatterns: state.errorPatterns.length,
            patterns: state.errorPatterns,
            errorGroups: state.errorGroups.size,
            sceneTransitions: state.sceneTransitions.length
        };
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
