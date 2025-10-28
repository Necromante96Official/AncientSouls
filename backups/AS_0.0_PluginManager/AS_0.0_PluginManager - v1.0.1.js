//=============================================================================
// AS_0.0_PluginManager.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.1 ☆ Núcleo de agentes Ancient Souls (gerenciador central)
 * @author Necromante96Official & GitHub Copilot
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Plugin Manager
 * --------------------------------------------------------------------------
 * Este agente é o núcleo central responsável por registrar, validar e
 * inicializar todos os demais agentes do ecossistema Ancient Souls.
 * Ele também provê o barramento de eventos (Pub/Sub) e utilitários
 * compartilhados.
 * --------------------------------------------------------------------------
 * ❖ Não possui comandos de plugin nem parâmetros configuráveis.
 * ❖ Não possui dependências e deve ser carregado antes dos demais agentes.
 * ==========================================================================
 */

var AS = AS || {};
AS.PluginManager = AS.PluginManager || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_0.0_PluginManager';
    const MODULE_VERSION = '1.0.1';

    //=======================================================================
    // Estruturas internas
    //=======================================================================
    const manifests = new Map();
    const instances = new Map();
    const eventBus = new Map();
    let initializationInProgress = false;

    //=======================================================================
    // Utilidades internas
    //=======================================================================
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

    function normalizeId(id) {
        return String(id || '').trim();
    }

    function validateManifest(manifest) {
        if (!manifest || typeof manifest !== 'object') {
            throw new Error('Manifesto inválido (objeto obrigatório).');
        }

        const id = normalizeId(manifest.id);
        if (!id.length) {
            throw new Error('Manifesto sem identificador único (id).');
        }

        if (manifests.has(id)) {
            throw new Error(`Manifesto duplicado detectado: ${id}`);
        }

        if (typeof manifest.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
            throw new Error('Versão inválida, use o padrão X.Y.Z.');
        }

        if (typeof manifest.init !== 'function') {
            throw new Error(`Manifesto ${id} precisa expor função init().`);
        }

        if (typeof manifest.cleanup !== 'function') {
            throw new Error(`Manifesto ${id} precisa expor função cleanup().`);
        }

        if (manifest.dependencies && !Array.isArray(manifest.dependencies)) {
            throw new Error(`Manifesto ${id} deve declarar dependências em array.`);
        }
    }

    function bootstrapManifest(manifest) {
        if (instances.has(manifest.id)) {
            return; // Já inicializado
        }

        const context = createContext(manifest.id);
        const instance = manifest.init(context) || {};
        instances.set(manifest.id, instance);
        logger.info(`Agente ${manifest.id} inicializado (v${manifest.version}).`);
    }

    function createContext(agentId) {
        return {
            agentId,
            publish: (eventName, payload) => publish(eventName, payload, agentId),
            subscribe: (eventName, callback) => subscribe(eventName, callback, agentId),
            unsubscribe: (eventName, callback) => unsubscribe(eventName, callback, agentId),
            getAgent: id => instances.get(normalizeId(id)) || null,
            getManifest: id => manifests.get(normalizeId(id)) || null
        };
    }

    function publish(eventName, payload, emitterId) {
        const normalized = String(eventName || '').trim();
        if (!normalized.length) {
            logger.warn(`Evento ignorado por nome inválido (emissor: ${emitterId}).`);
            return;
        }

        const listeners = eventBus.get(normalized);
        if (!listeners || listeners.size === 0) {
            return;
        }

        listeners.forEach(listener => {
            try {
                listener(payload, emitterId);
            } catch (error) {
                logger.error(`Falha ao entregar evento ${normalized}: ${error}`);
            }
        });
    }

    function subscribe(eventName, callback, agentId) {
        const normalized = String(eventName || '').trim();
        if (!normalized.length || typeof callback !== 'function') {
            logger.warn(`Assinatura inválida requisitada por ${agentId}.`);
            return () => {};
        }

        if (!eventBus.has(normalized)) {
            eventBus.set(normalized, new Set());
        }
        eventBus.get(normalized).add(callback);
        logger.info(`Agente ${agentId} assinou evento ${normalized}.`);

        return () => unsubscribe(normalized, callback, agentId);
    }

    function unsubscribe(eventName, callback, agentId) {
        const normalized = String(eventName || '').trim();
        if (!eventBus.has(normalized)) {
            return;
        }

        const listeners = eventBus.get(normalized);
        listeners.delete(callback);
        logger.info(`Agente ${agentId} cancelou assinatura de ${normalized}.`);

        if (listeners.size === 0) {
            eventBus.delete(normalized);
        }
    }

    function cleanupAll() {
        manifests.forEach((manifest, id) => {
            try {
                manifest.cleanup();
            } catch (error) {
                logger.error(`Erro ao executar cleanup de ${id}: ${error}`);
            }
        });
        instances.clear();
        logger.info('Todos os agentes foram limpos.');
    }

    function initializeIfReady() {
        if (initializationInProgress) {
            return;
        }
        initializationInProgress = true;

        try {
            let progressMade;
            do {
                progressMade = false;

                manifests.forEach((manifest, id) => {
                    if (instances.has(id)) {
                        return;
                    }

                    const dependencies = (manifest.dependencies || []).map(normalizeId);
                    const missingManifests = dependencies.filter(depId => !manifests.has(depId));

                    if (missingManifests.length > 0) {
                        logger.warn(`Manifesto ${id} aguardando registro de dependências: ${missingManifests.join(', ')}.`);
                        return;
                    }

                    const unmet = dependencies.filter(depId => !instances.has(depId));
                    if (unmet.length > 0) {
                        return;
                    }

                    bootstrapManifest(manifest);
                    progressMade = true;
                });
            } while (progressMade);

            const unresolved = Array.from(manifests.keys()).filter(id => !instances.has(id));
            if (unresolved.length > 0) {
                const blocked = unresolved.filter(id => {
                    const manifest = manifests.get(id);
                    const deps = (manifest.dependencies || []).map(normalizeId);
                    return deps.every(depId => manifests.has(depId));
                });

                if (blocked.length > 0) {
                    logger.error(`Falha na inicialização: Dependências circulares detectadas entre agentes (${blocked.join(', ')}).`);
                }
            }
        } finally {
            initializationInProgress = false;
        }
    }

    //=======================================================================
    // API pública exposta para outros agentes
    //=======================================================================
    AS.PluginManager.register = function register(manifest) {
        try {
            validateManifest(manifest);
            manifests.set(manifest.id, manifest);
            logger.info(`Manifesto registrado: ${manifest.id} (v${manifest.version}).`);
            initializeIfReady();
        } catch (error) {
            logger.error(`Registro inválido: ${error.message}`);
        }
    };

    AS.PluginManager.publish = function apiPublish(eventName, payload) {
        publish(eventName, payload, MODULE_ID);
    };

    AS.PluginManager.subscribe = function apiSubscribe(eventName, callback) {
        return subscribe(eventName, callback, MODULE_ID);
    };

    AS.PluginManager.unsubscribe = function apiUnsubscribe(eventName, callback) {
        unsubscribe(eventName, callback, MODULE_ID);
    };

    AS.PluginManager.getAgent = function apiGetAgent(id) {
        return instances.get(normalizeId(id)) || null;
    };

    AS.PluginManager.getManifest = function apiGetManifest(id) {
        return manifests.get(normalizeId(id)) || null;
    };

    AS.PluginManager.cleanupAll = function apiCleanupAll() {
        cleanupAll();
    };

    logger.info(`Manifesto próprio registado (v${MODULE_VERSION}).`);

    AS.PluginManager.register({
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Plugin Manager',
        description: 'Gerenciador central do ecossistema Ancient Souls.',
        dependencies: [],
        init: () => {
            logger.info('Agente principal pronto para coordenar dependências.');
            return {};
        },
        cleanup: () => {
            eventBus.clear();
            logger.info('Barramento de eventos limpo.');
        }
    });
})();

//=============================================================================
// Fim de AS_0.0_PluginManager.js
//=============================================================================
