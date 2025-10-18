//=============================================================================
// AS_0.0_PluginManager_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] Gerenciador Central de Plugins - Sistema de Agentes Ancient Souls
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.0
 * @orderAfter 
 * @orderBefore AS_1.0_TitleScreen_Agent
 *
 * @param EnableDebugMode
 * @text Modo de Debug
 * @type boolean
 * @default true
 * @desc Ativa logs detalhados do sistema de agentes.
 *
 * @param EnableVersionControl
 * @text Controle de Versão
 * @type boolean
 * @default true
 * @desc Ativa o sistema de controle de versão dos agentes.
 *
 * @help
 * AS_0.0_PluginManager_Agent [v1.0.0]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Plugin gerenciador central responsável por controlar, ativar e gerenciar 
 * todos os outros agentes do sistema Ancient Souls. Este é o núcleo do sistema
 * modular baseado em agentes.
 * 
 * Características:
 *  - Sistema Pub/Sub (Publicação/Assinatura) para comunicação entre agentes
 *  - Resolução automática de dependências via ordenação topológica
 *  - Controle de versionamento e validação
 *  - Ciclo de vida completo dos agentes (init, start, stop, cleanup)
 *  - Sistema de logs estruturado e debug
 *  - Detecção de dependências circulares
 *  - Gerenciamento de estado dos agentes
 * 
 * Como usar:
 *  1) Este plugin DEVE ser o primeiro na lista de plugins Ancient Souls
 *  2) Ative o plugin no Plugin Manager
 *  3) Configure o modo de debug conforme necessário
 *  4) Todos os outros agentes AS_X.Y dependem deste plugin
 * 
 * Convenção de Nomes:
 *  - Nível 0: AS_0.0_*_Agent (Gerenciador Central - ESTE PLUGIN)
 *  - Nível 1: AS_1.0_*_Agent (Plugins Principais)
 *  - Nível 1.x: AS_1.1_*_Agent, AS_1.2_*_Agent (Sub-agentes)
 * 
 * Observações:
 *  - Sempre mantenha este plugin ativo
 *  - Não altere a versão sem autorização de Necromante96Official
 *  - Este plugin não possui dependências
 *  - Todos os outros agentes dependem deste
 * 
 * ============================================================================
 * Termos de Uso:
 * ============================================================================
 * 
 * Livre para uso em projetos comerciais e não-comerciais.
 * Créditos a Necromante96Official são apreciados, mas não obrigatórios.
 */

//=============================================================================
// Namespace Global Ancient Souls
//=============================================================================

var AS = AS || {};
AS.PluginManager = AS.PluginManager || {};
AS.version = "1.0.0";

//=============================================================================
// Configurações do Plugin
//=============================================================================

(() => {
    'use strict';
    
    const pluginName = "AS_0.0_PluginManager_Agent";
    const parameters = PluginManager.parameters(pluginName);
    
    AS.PluginManager.debugMode = parameters.EnableDebugMode === 'true';
    AS.PluginManager.versionControl = parameters.EnableVersionControl === 'true';
    
    //=========================================================================
    // AS.PluginManager - Core do Sistema de Agentes
    //=========================================================================
    
    AS.PluginManager._agents = new Map();
    AS.PluginManager._eventBus = new Map();
    AS.PluginManager._initializationOrder = [];
    AS.PluginManager._initialized = false;
    
    /**
     * Registra um novo agente no sistema
     * @param {string} agentId - ID único do agente (ex: AS_1.0_TitleScreen)
     * @param {object} manifest - Manifesto do agente com metadados
     */
    AS.PluginManager.register = function(agentId, manifest) {
        if (this._agents.has(agentId)) {
            this.warn(`Agente ${agentId} já está registrado. Ignorando.`);
            return false;
        }
        
        // Valida manifesto obrigatório
        if (!this._validateManifest(agentId, manifest)) {
            this.error(`Manifesto inválido para agente ${agentId}`);
            return false;
        }
        
        // Cria objeto do agente
        const agent = {
            id: agentId,
            name: manifest.name || agentId,
            version: manifest.version || '1.0.0',
            author: manifest.author || 'Unknown',
            description: manifest.description || '',
            dependencies: manifest.dependencies || [],
            init: manifest.init || (() => {}),
            cleanup: manifest.cleanup || (() => {}),
            state: 'registered', // registered, initialized, running, stopped, error
            instance: null,
            manifest: manifest
        };
        
        this._agents.set(agentId, agent);
        this.log(`✓ Agente registrado: ${agentId} v${agent.version}`);
        
        return true;
    };
    
    /**
     * Valida o manifesto de um agente
     */
    AS.PluginManager._validateManifest = function(agentId, manifest) {
        if (!manifest || typeof manifest !== 'object') {
            return false;
        }
        
        // Campos obrigatórios
        const required = ['name', 'version', 'description'];
        for (const field of required) {
            if (!manifest[field]) {
                this.error(`Campo obrigatório '${field}' ausente no manifesto de ${agentId}`);
                return false;
            }
        }
        
        // Valida formato de versão (X.Y.Z)
        const versionRegex = /^\d+\.\d+\.\d+$/;
        if (!versionRegex.test(manifest.version)) {
            this.error(`Versão inválida '${manifest.version}' para ${agentId}. Use formato X.Y.Z`);
            return false;
        }
        
        return true;
    };
    
    /**
     * Inicializa todos os agentes registrados na ordem correta
     */
    AS.PluginManager.initializeAll = function() {
        if (this._initialized) {
            this.warn('Sistema já foi inicializado.');
            return;
        }
        
        this.log('='.repeat(60));
        this.log('Iniciando Sistema de Agentes Ancient Souls');
        this.log('='.repeat(60));
        
        // Resolve ordem de dependências
        const order = this._resolveDependencies();
        if (!order) {
            this.error('Falha ao resolver dependências. Sistema não inicializado.');
            return false;
        }
        
        this._initializationOrder = order;
        
        // Inicializa cada agente na ordem
        for (const agentId of order) {
            const agent = this._agents.get(agentId);
            if (!agent) continue;
            
            try {
                this.log(`Inicializando ${agentId}...`);
                
                // Verifica dependências
                if (!this._checkDependencies(agent)) {
                    throw new Error(`Dependências não satisfeitas para ${agentId}`);
                }
                
                // Executa inicialização do agente
                if (typeof agent.init === 'function') {
                    agent.instance = agent.init();
                }
                
                agent.state = 'initialized';
                this.log(`✓ ${agentId} inicializado com sucesso`);
                
            } catch (error) {
                agent.state = 'error';
                this.error(`✗ Erro ao inicializar ${agentId}: ${error.message}`);
                console.error(error);
            }
        }
        
        this._initialized = true;
        this.log('='.repeat(60));
        this.log(`Sistema inicializado com ${this._agents.size} agente(s)`);
        this.log('='.repeat(60));
        
        return true;
    };
    
    /**
     * Resolve a ordem de inicialização baseado em dependências
     * Usa algoritmo de ordenação topológica (Kahn's Algorithm)
     */
    AS.PluginManager._resolveDependencies = function() {
        const agentIds = Array.from(this._agents.keys());
        const graph = new Map();
        const inDegree = new Map();
        
        // Constrói grafo de dependências
        for (const agentId of agentIds) {
            graph.set(agentId, []);
            inDegree.set(agentId, 0);
        }
        
        for (const [agentId, agent] of this._agents) {
            for (const dep of agent.dependencies) {
                if (!this._agents.has(dep)) {
                    this.error(`Dependência não encontrada: ${dep} (requerida por ${agentId})`);
                    return null;
                }
                graph.get(dep).push(agentId);
                inDegree.set(agentId, inDegree.get(agentId) + 1);
            }
        }
        
        // Ordenação topológica
        const queue = [];
        const result = [];
        
        for (const [agentId, degree] of inDegree) {
            if (degree === 0) {
                queue.push(agentId);
            }
        }
        
        while (queue.length > 0) {
            const current = queue.shift();
            result.push(current);
            
            for (const neighbor of graph.get(current)) {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }
        
        // Detecta dependências circulares
        if (result.length !== agentIds.length) {
            this.error('Dependência circular detectada! Não é possível resolver ordem de inicialização.');
            this._debugDependencies();
            return null;
        }
        
        this.log(`Ordem de inicialização: ${result.join(' → ')}`);
        return result;
    };
    
    /**
     * Verifica se todas as dependências de um agente estão satisfeitas
     */
    AS.PluginManager._checkDependencies = function(agent) {
        for (const depId of agent.dependencies) {
            const dep = this._agents.get(depId);
            if (!dep || (dep.state !== 'initialized' && dep.state !== 'running')) {
                this.error(`Dependência ${depId} não está inicializada para ${agent.id}`);
                return false;
            }
        }
        return true;
    };
    
    /**
     * Debug de dependências
     */
    AS.PluginManager._debugDependencies = function() {
        this.log('--- Mapa de Dependências ---');
        for (const [agentId, agent] of this._agents) {
            this.log(`${agentId} → [${agent.dependencies.join(', ')}]`);
        }
    };
    
    /**
     * Obtém um agente registrado
     */
    AS.PluginManager.getAgent = function(agentId) {
        return this._agents.get(agentId);
    };
    
    /**
     * Obtém a instância de um agente
     */
    AS.PluginManager.getAgentInstance = function(agentId) {
        const agent = this._agents.get(agentId);
        return agent ? agent.instance : null;
    };
    
    /**
     * Lista todos os agentes registrados
     */
    AS.PluginManager.listAgents = function() {
        const agents = [];
        for (const [id, agent] of this._agents) {
            agents.push({
                id: id,
                name: agent.name,
                version: agent.version,
                state: agent.state,
                dependencies: agent.dependencies
            });
        }
        return agents;
    };
    
    //=========================================================================
    // Sistema Pub/Sub (Event Bus)
    //=========================================================================
    
    /**
     * Publica um evento para todos os assinantes
     */
    AS.PluginManager.publish = function(eventName, data) {
        if (!this._eventBus.has(eventName)) {
            return;
        }
        
        const subscribers = this._eventBus.get(eventName);
        this.log(`📢 Evento publicado: ${eventName} (${subscribers.length} assinante(s))`);
        
        for (const callback of subscribers) {
            try {
                callback(data);
            } catch (error) {
                this.error(`Erro ao processar evento ${eventName}: ${error.message}`);
            }
        }
    };
    
    /**
     * Assina um evento
     */
    AS.PluginManager.subscribe = function(eventName, callback) {
        if (!this._eventBus.has(eventName)) {
            this._eventBus.set(eventName, []);
        }
        
        this._eventBus.get(eventName).push(callback);
        this.log(`📩 Assinatura registrada: ${eventName}`);
    };
    
    /**
     * Remove assinatura de um evento
     */
    AS.PluginManager.unsubscribe = function(eventName, callback) {
        if (!this._eventBus.has(eventName)) {
            return;
        }
        
        const subscribers = this._eventBus.get(eventName);
        const index = subscribers.indexOf(callback);
        if (index > -1) {
            subscribers.splice(index, 1);
            this.log(`📤 Assinatura removida: ${eventName}`);
        }
    };
    
    //=========================================================================
    // Sistema de Controle de Versão
    //=========================================================================
    
    /**
     * Requisita mudança de versão (requer autorização)
     */
    AS.PluginManager.requestVersionChange = function(agentId, newVersion, reason) {
        if (!this.versionControl) {
            this.warn('Controle de versão está desabilitado.');
            return false;
        }
        
        const agent = this._agents.get(agentId);
        if (!agent) {
            this.error(`Agente ${agentId} não encontrado.`);
            return false;
        }
        
        this.log('='.repeat(60));
        this.log('⚠️  REQUISIÇÃO DE MUDANÇA DE VERSÃO');
        this.log(`Agente: ${agentId}`);
        this.log(`Versão Atual: ${agent.version}`);
        this.log(`Nova Versão: ${newVersion}`);
        this.log(`Razão: ${reason}`);
        this.log(`Status: AGUARDANDO AUTORIZAÇÃO DE Necromante96Official`);
        this.log('='.repeat(60));
        
        return false; // Sempre retorna false - requer autorização manual
    };
    
    //=========================================================================
    // Sistema de Logs
    //=========================================================================
    
    AS.PluginManager.log = function(message) {
        if (this.debugMode) {
            console.log(`[AS PluginManager] ${message}`);
        }
    };
    
    AS.PluginManager.warn = function(message) {
        console.warn(`[AS PluginManager] ⚠️  ${message}`);
    };
    
    AS.PluginManager.error = function(message) {
        console.error(`[AS PluginManager] ❌ ${message}`);
    };
    
    //=========================================================================
    // Cleanup do Sistema
    //=========================================================================
    
    AS.PluginManager.cleanupAll = function() {
        this.log('Executando cleanup de todos os agentes...');
        
        // Cleanup na ordem reversa
        const reverseOrder = [...this._initializationOrder].reverse();
        
        for (const agentId of reverseOrder) {
            const agent = this._agents.get(agentId);
            if (!agent) continue;
            
            try {
                if (typeof agent.cleanup === 'function') {
                    agent.cleanup();
                }
                agent.state = 'stopped';
                this.log(`✓ Cleanup de ${agentId} concluído`);
            } catch (error) {
                this.error(`✗ Erro no cleanup de ${agentId}: ${error.message}`);
            }
        }
        
        this._initialized = false;
        this.log('Sistema de agentes desligado.');
    };
    
    //=========================================================================
    // Inicialização Automática
    //=========================================================================
    
    // Hook no carregamento do jogo
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        
        // Inicializa sistema de agentes após boot
        if (!AS.PluginManager._initialized) {
            AS.PluginManager.initializeAll();
        }
    };
    
    // Hook no término do jogo
    const _SceneManager_terminate = SceneManager.terminate;
    SceneManager.terminate = function() {
        AS.PluginManager.cleanupAll();
        _SceneManager_terminate.call(this);
    };
    
    //=========================================================================
    // Auto-registro do Plugin Manager
    //=========================================================================
    
    AS.PluginManager.register('AS_0.0_PluginManager', {
        name: 'Plugin Manager Core',
        version: '1.0.0',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Gerenciador central do sistema de agentes Ancient Souls',
        dependencies: [],
        init: () => {
            AS.PluginManager.log('Plugin Manager inicializado.');
            return AS.PluginManager;
        },
        cleanup: () => {
            AS.PluginManager.log('Plugin Manager finalizado.');
        }
    });
    
})();

//=============================================================================
// Fim do AS_0.0_PluginManager_Agent.js
//=============================================================================
