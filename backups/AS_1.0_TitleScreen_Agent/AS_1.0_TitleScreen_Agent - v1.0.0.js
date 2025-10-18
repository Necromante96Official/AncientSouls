//=============================================================================
// AS_1.0_TitleScreen_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] Gerenciador da Tela de Título - Ancient Souls
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.0
 * @orderAfter AS_0.0_PluginManager_Agent
 * @orderBefore AS_1.1_TitleScreenUI_Agent
 *
 * @param EnableCustomTitle
 * @text Ativar Título Customizado
 * @type boolean
 * @default true
 * @desc Ativa o sistema de título customizado do Ancient Souls.
 *
 * @param BackgroundColor
 * @text Cor de Fundo
 * @type string
 * @default #000000
 * @desc Cor de fundo da tela de título (formato hexadecimal).
 *
 * @param EnableParallax
 * @text Efeito Parallax
 * @type boolean
 * @default true
 * @desc Ativa efeito parallax no fundo da tela de título.
 *
 * @help
 * AS_1.0_TitleScreen_Agent [v1.0.0]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Plugin principal responsável por gerenciar toda a tela de título customizada
 * do Ancient Souls. Coordena os sub-agentes de UI e efeitos, substituindo
 * completamente o sistema padrão do RPG Maker MZ.
 * 
 * Características:
 *  - Substituição completa da Scene_Title padrão
 *  - Coordenação de sub-agentes (UI e Effects)
 *  - Sistema de camadas para elementos visuais
 *  - Gerenciamento de estado da tela de título
 *  - Sistema de transições suaves
 *  - Suporte para múltiplas resoluções
 * 
 * Como usar:
 *  1) Certifique-se de que AS_0.0_PluginManager_Agent está ativo
 *  2) Ative este plugin no Plugin Manager
 *  3) Configure os parâmetros conforme necessário
 *  4) Ative os sub-agentes AS_1.1 e AS_1.2 para funcionalidade completa
 * 
 * Dependências:
 *  - AS_0.0_PluginManager_Agent (obrigatório)
 * 
 * Sub-agentes:
 *  - AS_1.1_TitleScreenUI_Agent (Interface HTML/CSS)
 *  - AS_1.2_TitleScreenEffects_Agent (Animações e Efeitos)
 * 
 * Observações:
 *  - Este plugin sobrescreve Scene_Title
 *  - Mantém compatibilidade com sistema de saves padrão
 *  - Não altere a versão sem autorização de Necromante96Official
 * 
 * ============================================================================
 * Termos de Uso:
 * ============================================================================
 * 
 * Livre para uso em projetos comerciais e não-comerciais.
 * Créditos a Necromante96Official são apreciados, mas não obrigatórios.
 */

//=============================================================================
// Inicialização do Namespace
//=============================================================================

var AS = AS || {};
AS.TitleScreen = AS.TitleScreen || {};

//=============================================================================
// Configurações do Plugin
//=============================================================================

(() => {
    'use strict';
    
    const pluginName = "AS_1.0_TitleScreen_Agent";
    const parameters = PluginManager.parameters(pluginName);
    
    AS.TitleScreen.enabled = parameters.EnableCustomTitle === 'true';
    AS.TitleScreen.backgroundColor = parameters.BackgroundColor || '#000000';
    AS.TitleScreen.parallaxEnabled = parameters.EnableParallax === 'true';
    
    //=========================================================================
    // AS.TitleScreen.Manager - Gerenciador Principal
    //=========================================================================
    
    class TitleScreenManager {
        constructor() {
            this.initialized = false;
            this.layers = new Map();
            this.state = 'idle'; // idle, transitioning, active
            this.uiAgent = null;
            this.effectsAgent = null;
        }
        
        init() {
            if (this.initialized) {
                this.log('Manager já inicializado.');
                return this;
            }
            
            this.log('Inicializando TitleScreen Manager...');
            
            // Registra eventos do sistema
            this.setupEventListeners();
            
            // Cria sistema de camadas
            this.setupLayers();
            
            this.initialized = true;
            this.log('✓ TitleScreen Manager inicializado');
            
            return this;
        }
        
        setupEventListeners() {
            // Escuta eventos dos sub-agentes
            AS.PluginManager.subscribe('titlescreen:ui:ready', (data) => {
                this.log('UI Agent pronto');
                this.uiAgent = data.instance;
            });
            
            AS.PluginManager.subscribe('titlescreen:effects:ready', (data) => {
                this.log('Effects Agent pronto');
                this.effectsAgent = data.instance;
            });
            
            AS.PluginManager.subscribe('titlescreen:menu:selected', (data) => {
                this.log(`Menu selecionado: ${data.option}`);
                this.handleMenuSelection(data.option);
            });
        }
        
        setupLayers() {
            this.layers.set('background', { zIndex: 0, elements: [] });
            this.layers.set('middleground', { zIndex: 1, elements: [] });
            this.layers.set('foreground', { zIndex: 2, elements: [] });
            this.layers.set('ui', { zIndex: 3, elements: [] });
            this.layers.set('effects', { zIndex: 4, elements: [] });
            
            this.log('Sistema de camadas configurado');
        }
        
        handleMenuSelection(option) {
            switch(option) {
                case 'newGame':
                    this.startNewGame();
                    break;
                case 'continue':
                    this.continueGame();
                    break;
                case 'options':
                    this.openOptions();
                    break;
                default:
                    this.log(`Opção desconhecida: ${option}`);
            }
        }
        
        startNewGame() {
            this.log('Iniciando novo jogo...');
            this.state = 'transitioning';
            
            // Publica evento para animação de saída
            AS.PluginManager.publish('titlescreen:transition:out', {
                target: 'newGame'
            });
            
            // Aguarda animação e inicia jogo
            setTimeout(() => {
                DataManager.setupNewGame();
                SceneManager.goto(Scene_Map);
            }, 1000);
        }
        
        continueGame() {
            this.log('Continuando jogo...');
            SceneManager.push(Scene_Load);
        }
        
        openOptions() {
            this.log('Abrindo opções...');
            SceneManager.push(Scene_Options);
        }
        
        addToLayer(layerName, element) {
            if (!this.layers.has(layerName)) {
                this.log(`Camada ${layerName} não existe`);
                return false;
            }
            
            const layer = this.layers.get(layerName);
            layer.elements.push(element);
            return true;
        }
        
        getLayer(layerName) {
            return this.layers.get(layerName);
        }
        
        cleanup() {
            this.log('Limpando TitleScreen Manager...');
            
            // Limpa camadas
            for (const [name, layer] of this.layers) {
                layer.elements = [];
            }
            
            this.state = 'idle';
            this.initialized = false;
            
            this.log('✓ Cleanup concluído');
        }
        
        log(message) {
            AS.PluginManager.log(`[TitleScreen Manager] ${message}`);
        }
    }
    
    //=========================================================================
    // Scene_Title - Substituição Customizada
    //=========================================================================
    
    if (AS.TitleScreen.enabled) {
        
        // Salva referências originais
        AS.TitleScreen._Scene_Title_create = Scene_Title.prototype.create;
        AS.TitleScreen._Scene_Title_start = Scene_Title.prototype.start;
        AS.TitleScreen._Scene_Title_update = Scene_Title.prototype.update;
        AS.TitleScreen._Scene_Title_terminate = Scene_Title.prototype.terminate;
        
        /**
         * Criação da cena customizada
         */
        Scene_Title.prototype.create = function() {
            Scene_Base.prototype.create.call(this);
            
            const manager = AS.PluginManager.getAgentInstance('AS_1.0_TitleScreen');
            
            if (manager && AS.TitleScreen.enabled) {
                this.createCustomTitleScreen();
            } else {
                // Fallback para tela padrão
                AS.TitleScreen._Scene_Title_create.call(this);
            }
        };
        
        /**
         * Cria elementos customizados da tela de título
         */
        Scene_Title.prototype.createCustomTitleScreen = function() {
            this._customTitleActive = true;
            
            // Cria container HTML para elementos customizados
            this.createHTMLContainer();
            
            // Cria background customizado
            this.createCustomBackground();
            
            // Notifica sistema que a cena está pronta
            AS.PluginManager.publish('titlescreen:scene:ready', {
                scene: this
            });
            
            // Window layer ainda é necessário para diálogos/transições
            this.createWindowLayer();
        };
        
        /**
         * Cria container HTML
         */
        Scene_Title.prototype.createHTMLContainer = function() {
            const existingContainer = document.getElementById('as-titlescreen-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            
            const container = document.createElement('div');
            container.id = 'as-titlescreen-container';
            container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                pointer-events: auto;
            `;
            
            document.body.appendChild(container);
            this._htmlContainer = container;
        };
        
        /**
         * Cria background customizado
         */
        Scene_Title.prototype.createCustomBackground = function() {
            // Cria sprite de background com cor sólida
            this._customBackSprite = new Sprite();
            this._customBackSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._customBackSprite.bitmap.fillAll(AS.TitleScreen.backgroundColor);
            this.addChild(this._customBackSprite);
            
            // Adiciona imagem de fundo se configurada
            if ($dataSystem.title1Name) {
                this._backSprite1 = new Sprite(
                    ImageManager.loadTitle1($dataSystem.title1Name)
                );
                this.addChild(this._backSprite1);
            }
            
            if ($dataSystem.title2Name) {
                this._backSprite2 = new Sprite(
                    ImageManager.loadTitle2($dataSystem.title2Name)
                );
                this.addChild(this._backSprite2);
            }
        };
        
        /**
         * Início da cena
         */
        Scene_Title.prototype.start = function() {
            Scene_Base.prototype.start.call(this);
            SceneManager.clearStack();
            
            if (this._customTitleActive) {
                this.adjustCustomBackground();
                this.playTitleMusic();
                this.startFadeIn(this.fadeSpeed(), false);
                
                // Publica evento de início
                AS.PluginManager.publish('titlescreen:scene:start', {
                    scene: this
                });
            } else {
                AS.TitleScreen._Scene_Title_start.call(this);
            }
        };
        
        /**
         * Ajusta background customizado
         */
        Scene_Title.prototype.adjustCustomBackground = function() {
            if (this._backSprite1) {
                this.scaleSprite(this._backSprite1);
                this.centerSprite(this._backSprite1);
            }
            if (this._backSprite2) {
                this.scaleSprite(this._backSprite2);
                this.centerSprite(this._backSprite2);
            }
        };
        
        /**
         * Update da cena
         */
        Scene_Title.prototype.update = function() {
            Scene_Base.prototype.update.call(this);
            
            if (this._customTitleActive) {
                this.updateCustomTitle();
            }
        };
        
        /**
         * Update customizado
         */
        Scene_Title.prototype.updateCustomTitle = function() {
            // Efeito parallax simples no background
            if (AS.TitleScreen.parallaxEnabled && this._backSprite2) {
                this._backSprite2.origin.x += 0.5;
            }
        };
        
        /**
         * Término da cena
         */
        Scene_Title.prototype.terminate = function() {
            Scene_Base.prototype.terminate.call(this);
            
            if (this._customTitleActive) {
                // Remove container HTML
                if (this._htmlContainer) {
                    this._htmlContainer.remove();
                    this._htmlContainer = null;
                }
                
                // Publica evento de término
                AS.PluginManager.publish('titlescreen:scene:terminate', {
                    scene: this
                });
            }
            
            // Cleanup de bitmaps
            if (this._customBackSprite && this._customBackSprite.bitmap) {
                this._customBackSprite.bitmap.destroy();
            }
        };
    }
    
    //=========================================================================
    // Registro do Agente
    //=========================================================================
    
    AS.PluginManager.register('AS_1.0_TitleScreen', {
        name: 'TitleScreen Manager',
        version: '1.0.0',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Gerenciador principal da tela de título customizada',
        dependencies: ['AS_0.0_PluginManager'],
        init: () => {
            const manager = new TitleScreenManager();
            manager.init();
            
            // Publica evento de prontidão
            AS.PluginManager.publish('titlescreen:manager:ready', {
                instance: manager
            });
            
            return manager;
        },
        cleanup: () => {
            const manager = AS.PluginManager.getAgentInstance('AS_1.0_TitleScreen');
            if (manager) {
                manager.cleanup();
            }
        }
    });
    
})();

//=============================================================================
// Fim do AS_1.0_TitleScreen_Agent.js
//=============================================================================
