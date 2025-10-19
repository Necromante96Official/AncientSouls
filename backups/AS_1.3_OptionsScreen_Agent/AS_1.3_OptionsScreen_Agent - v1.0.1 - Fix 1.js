//=============================================================================
// AS_1.3_OptionsScreen_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.1] Tela de Opções Personalizada - Ancient Souls
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.1
 * @orderAfter AS_1.2_TitleScreenEffects_Agent
 *
 * @param EnableCustomOptions
 * @text Ativar Opções Customizadas
 * @type boolean
 * @default true
 * @desc Ativa o sistema de opções customizado do Ancient Souls.
 *
 * @param BackgroundColor
 * @text Cor de Fundo
 * @type string
 * @default #1a1a2e
 * @desc Cor de fundo da tela de opções (formato hexadecimal).
 *
 * @param AccentColor
 * @text Cor de Destaque
 * @type string
 * @default #ffd700
 * @desc Cor de destaque para elementos ativos (formato hexadecimal).
 *
 * @param ShowBackgroundImage
 * @text Mostrar Imagem de Fundo
 * @type boolean
 * @default true
 * @desc Mostra a imagem de fundo (background.png) com overlay escuro.
 *
 * @help
 * AS_1.3_OptionsScreen_Agent [v1.0.1]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Plugin responsável por criar uma tela de opções personalizada e moderna
 * para o Ancient Souls, substituindo a Scene_Options padrão do RPG Maker MZ.
 * 
 * Características:
 *  - Interface HTML5/CSS3 moderna e responsiva
 *  - Controles deslizantes (sliders) para volume
 *  - Opções de Always Dash e Command Remember
 *  - Design consistente com a tela de título
 *  - Animações suaves e transições
 *  - Suporte para mouse, teclado e gamepad
 * 
 * Como usar:
 *  1) Certifique-se de que AS_0.0_PluginManager_Agent está ativo
 *  2) Ative este plugin no Plugin Manager
 *  3) Configure os parâmetros conforme necessário
 * 
 * Dependências:
 *  - AS_0.0_PluginManager_Agent (obrigatório)
 * 
 * Observações:
 *  - Este plugin sobrescreve Scene_Options
 *  - Mantém compatibilidade com sistema de configurações padrão
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
AS.OptionsScreen = AS.OptionsScreen || {};

//=============================================================================
// Configurações do Plugin
//=============================================================================

(() => {
    'use strict';
    
    const pluginName = "AS_1.3_OptionsScreen_Agent";
    const parameters = PluginManager.parameters(pluginName);
    
    AS.OptionsScreen.enabled = parameters.EnableCustomOptions === 'true';
    AS.OptionsScreen.backgroundColor = parameters.BackgroundColor || '#1a1a2e';
    AS.OptionsScreen.accentColor = parameters.AccentColor || '#ffd700';
    AS.OptionsScreen.showBackground = parameters.ShowBackgroundImage === 'true';
    
    //=========================================================================
    // AS.OptionsScreen.Manager - Gerenciador de Opções
    //=========================================================================
    
    class OptionsScreenManager {
        constructor() {
            this.initialized = false;
            this.container = null;
            this.elements = new Map();
            this.currentScene = null;
        }
        
        init() {
            if (this.initialized) {
                this.log('Options Manager já inicializado.');
                return this;
            }
            
            this.log('Inicializando Options Screen Manager...');
            
            this.initialized = true;
            this.log('✓ Options Screen Manager inicializado');
            
            return this;
        }
        
        createUI(scene) {
            this.log('🎨 ═══════════════════════════════════════');
            this.log('🎨 Criando interface de opções...');
            this.log(`📍 Scene recebida: ${scene ? scene.constructor.name : 'null'}`);
            this.log(`📍 SceneManager._scene: ${SceneManager._scene ? SceneManager._scene.constructor.name : 'null'}`);
            this.log(`📍 SceneManager._stack length: ${SceneManager._stack ? SceneManager._stack.length : 0}`);
            
            this.currentScene = scene;
            this.log(`✓ CurrentScene salva: ${this.currentScene ? this.currentScene.constructor.name : 'null'}`);
            
            // Cria container HTML
            this.createContainer();
            
            // Injeta estilos CSS
            this.injectStyles();
            
            // Cria elementos da UI
            this.createHeader();
            this.createOptionsPanel();
            this.createFooter();
            
            // Anima entrada
            this.animateIn();
            
            this.log('✓ Interface de opções criada com sucesso');
            this.log('🎨 ═══════════════════════════════════════');
        }
        
        createContainer() {
            // Remove container existente se houver
            const existing = document.getElementById('as-options-container');
            if (existing) {
                existing.remove();
            }
            
            this.container = document.createElement('div');
            this.container.id = 'as-options-container';
            this.container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                pointer-events: auto;
            `;
            
            document.body.appendChild(this.container);
        }
        
        injectStyles() {
            const oldStyle = document.getElementById('as-options-styles');
            if (oldStyle) {
                oldStyle.remove();
            }
            
            const style = document.createElement('style');
            style.id = 'as-options-styles';
            style.textContent = `
                /* Container Principal */
                #as-options-container {
                    font-family: 'GameFont', sans-serif;
                    color: #ffffff;
                    user-select: none;
                    background: linear-gradient(135deg, ${AS.OptionsScreen.backgroundColor} 0%, #16213e 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                /* Header */
                .as-options-header {
                    position: absolute;
                    top: 5%;
                    width: 100%;
                    text-align: center;
                }
                
                .as-options-title {
                    font-size: 48px;
                    font-weight: bold;
                    color: ${AS.OptionsScreen.accentColor};
                    text-shadow: 
                        0 0 10px rgba(255, 215, 0, 0.5),
                        2px 2px 8px rgba(0, 0, 0, 0.8);
                    letter-spacing: 4px;
                    margin: 0;
                }
                
                /* Painel de Opções */
                .as-options-panel {
                    background: rgba(0, 0, 0, 0.6);
                    border: 2px solid ${AS.OptionsScreen.accentColor};
                    border-radius: 15px;
                    padding: 40px;
                    width: 600px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                }
                
                /* Grupo de Opção */
                .as-option-group {
                    margin-bottom: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .as-option-label {
                    font-size: 20px;
                    font-weight: bold;
                    color: #ffffff;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
                }
                
                .as-option-value {
                    font-size: 18px;
                    color: ${AS.OptionsScreen.accentColor};
                    text-align: right;
                }
                
                /* Slider */
                .as-slider-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .as-slider {
                    flex: 1;
                    -webkit-appearance: none;
                    appearance: none;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 5px;
                    outline: none;
                    cursor: pointer;
                }
                
                .as-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: ${AS.OptionsScreen.accentColor};
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
                    transition: all 0.2s ease;
                }
                
                .as-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
                }
                
                .as-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: ${AS.OptionsScreen.accentColor};
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
                    transition: all 0.2s ease;
                }
                
                .as-slider::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
                }
                
                /* Toggle Switch */
                .as-toggle-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .as-toggle {
                    position: relative;
                    width: 60px;
                    height: 30px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 15px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                
                .as-toggle.active {
                    background: ${AS.OptionsScreen.accentColor};
                }
                
                .as-toggle-thumb {
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 24px;
                    height: 24px;
                    background: #ffffff;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                }
                
                .as-toggle.active .as-toggle-thumb {
                    transform: translateX(30px);
                }
                
                /* Footer */
                .as-options-footer {
                    position: absolute;
                    bottom: 5%;
                    display: flex;
                    gap: 20px;
                }
                
                .as-footer-button {
                    padding: 12px 40px;
                    font-size: 20px;
                    font-weight: bold;
                    color: #ffffff;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
                    border: 2px solid ${AS.OptionsScreen.accentColor};
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                }
                
                .as-footer-button:hover {
                    color: ${AS.OptionsScreen.accentColor};
                    transform: scale(1.05) translateY(-3px);
                    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
                }
                
                .as-footer-button:active {
                    transform: scale(0.98) translateY(0);
                }
                
                /* Animações */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                /* Responsividade */
                @media (max-width: 768px) {
                    .as-options-panel {
                        width: 90%;
                        padding: 30px 20px;
                    }
                    
                    .as-options-title {
                        font-size: 36px;
                    }
                    
                    .as-option-label {
                        font-size: 18px;
                    }
                }
            `;
            
            document.head.appendChild(style);
            this.log('✓ Estilos CSS injetados');
        }
        
        createHeader() {
            const header = document.createElement('div');
            header.className = 'as-options-header';
            
            const title = document.createElement('h1');
            title.className = 'as-options-title';
            title.textContent = 'OPÇÕES';
            
            header.appendChild(title);
            this.container.appendChild(header);
            this.elements.set('header', header);
        }
        
        createOptionsPanel() {
            const panel = document.createElement('div');
            panel.className = 'as-options-panel';
            
            // Volume BGM
            this.createSliderOption(panel, 'bgmVolume', 'Volume BGM', ConfigManager.bgmVolume);
            
            // Volume BGS
            this.createSliderOption(panel, 'bgsVolume', 'Volume BGS', ConfigManager.bgsVolume);
            
            // Volume ME
            this.createSliderOption(panel, 'meVolume', 'Volume ME', ConfigManager.meVolume);
            
            // Volume SE
            this.createSliderOption(panel, 'seVolume', 'Volume SE', ConfigManager.seVolume);
            
            // Always Dash
            this.createToggleOption(panel, 'alwaysDash', 'Sempre Correr', ConfigManager.alwaysDash);
            
            // Command Remember
            this.createToggleOption(panel, 'commandRemember', 'Lembrar Comandos', ConfigManager.commandRemember);
            
            this.container.appendChild(panel);
            this.elements.set('panel', panel);
        }
        
        createSliderOption(parent, id, label, initialValue) {
            const group = document.createElement('div');
            group.className = 'as-option-group';
            
            const labelEl = document.createElement('div');
            labelEl.className = 'as-option-label';
            labelEl.textContent = label;
            
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'as-slider-container';
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'as-slider';
            slider.id = `as-slider-${id}`;
            slider.min = '0';
            slider.max = '100';
            slider.value = initialValue;
            
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'as-option-value';
            valueDisplay.textContent = `${initialValue}%`;
            valueDisplay.style.minWidth = '50px';
            
            slider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                valueDisplay.textContent = `${value}%`;
                this.updateConfigValue(id, value);
            });
            
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(valueDisplay);
            
            group.appendChild(labelEl);
            group.appendChild(sliderContainer);
            parent.appendChild(group);
            
            this.elements.set(`slider_${id}`, slider);
        }
        
        createToggleOption(parent, id, label, initialValue) {
            const group = document.createElement('div');
            group.className = 'as-option-group';
            
            const container = document.createElement('div');
            container.className = 'as-toggle-container';
            
            const labelEl = document.createElement('div');
            labelEl.className = 'as-option-label';
            labelEl.textContent = label;
            
            const toggle = document.createElement('div');
            toggle.className = `as-toggle ${initialValue ? 'active' : ''}`;
            toggle.id = `as-toggle-${id}`;
            
            const thumb = document.createElement('div');
            thumb.className = 'as-toggle-thumb';
            
            toggle.appendChild(thumb);
            
            toggle.addEventListener('click', () => {
                const isActive = toggle.classList.toggle('active');
                this.updateConfigValue(id, isActive);
                SoundManager.playCursor();
            });
            
            container.appendChild(labelEl);
            container.appendChild(toggle);
            group.appendChild(container);
            parent.appendChild(group);
            
            this.elements.set(`toggle_${id}`, toggle);
        }
        
        createFooter() {
            const footer = document.createElement('div');
            footer.className = 'as-options-footer';
            
            // Botão Voltar
            const backButton = document.createElement('div');
            backButton.className = 'as-footer-button';
            backButton.textContent = 'Voltar';
            backButton.addEventListener('click', () => {
                SoundManager.playCancel();
                this.closeOptions();
            });
            
            footer.appendChild(backButton);
            this.container.appendChild(footer);
            this.elements.set('footer', footer);
        }
        
        updateConfigValue(key, value) {
            ConfigManager[key] = value;
            ConfigManager.save();
            
            // Aplica mudanças em tempo real
            switch(key) {
                case 'bgmVolume':
                    AudioManager.updateBgmParameters($dataSystem.bgm);
                    break;
                case 'bgsVolume':
                    AudioManager.updateBgsParameters($dataSystem.bgs);
                    break;
                case 'meVolume':
                case 'seVolume':
                    // ME e SE não precisam de atualização imediata
                    break;
            }
            
            this.log(`Configuração atualizada: ${key} = ${value}`);
        }
        
        animateIn() {
            // Animação controlada por CSS
            this.log('Animação de entrada iniciada');
        }
        
        closeOptions() {
            this.log('🔙 ═══════════════════════════════════════');
            this.log('🔙 Fechando tela de opções...');
            this.log(`📍 Container existe: ${!!this.container}`);
            this.log(`📍 CurrentScene existe: ${!!this.currentScene}`);
            this.log(`📍 SceneManager._scene: ${SceneManager._scene ? SceneManager._scene.constructor.name : 'null'}`);
            this.log(`📍 SceneManager._stack length: ${SceneManager._stack.length}`);
            
            // Mostra para onde vamos voltar (topo da stack)
            if (SceneManager._stack.length > 0) {
                const previousScene = SceneManager._stack[SceneManager._stack.length - 1];
                this.log(`📍 Voltando para: ${previousScene ? previousScene.constructor.name : 'unknown'}`);
            }
            
            // Salva referência da scene antes de destruir
            const sceneRef = this.currentScene;
            
            if (this.container) {
                this.container.style.transition = 'opacity 0.3s ease-out';
                this.container.style.opacity = '0';
                this.log('✓ Fade out iniciado');
                
                setTimeout(() => {
                    this.log('✓ Timeout completado, executando cleanup');
                    this.destroyUI();
                    
                    if (sceneRef && SceneManager._scene) {
                        this.log('✓ Executando SceneManager.pop()...');
                        SceneManager.pop();
                        this.log(`✓ Pop concluído! Scene atual: ${SceneManager._scene ? SceneManager._scene.constructor.name : 'null'}`);
                    } else {
                        this.log('⚠️ Não pode fazer pop - Scene inválida');
                        this.log(`  - sceneRef: ${!!sceneRef}`);
                        this.log(`  - SceneManager._scene: ${!!SceneManager._scene}`);
                    }
                    this.log('🔙 ═══════════════════════════════════════');
                }, 300);
            } else {
                this.log('⚠️ Container não existe, cleanup direto');
                this.destroyUI();
                if (sceneRef && SceneManager._scene) {
                    this.log('✓ Pop imediato');
                    SceneManager.pop();
                }
                this.log('🔙 ═══════════════════════════════════════');
            }
        }
        
        destroyUI() {
            this.log('🗑️ Destruindo interface de opções...');
            this.log(`Elementos registrados: ${this.elements.size}`);
            
            // Remove elementos
            let removedCount = 0;
            for (const [key, element] of this.elements) {
                if (element && element.parentNode) {
                    element.remove();
                    removedCount++;
                }
            }
            this.log(`✓ ${removedCount} elementos removidos`);
            this.elements.clear();
            
            // Remove estilos
            const style = document.getElementById('as-options-styles');
            if (style) {
                style.remove();
                this.log('✓ Estilos CSS removidos');
            }
            
            // Remove container
            if (this.container && this.container.parentNode) {
                this.container.remove();
                this.log('✓ Container removido do DOM');
            }
            
            this.container = null;
            this.currentScene = null;
            
            this.log('✓ Interface destruída completamente');
        }
        
        cleanup() {
            this.log('Limpando Options Manager...');
            this.destroyUI();
            this.initialized = false;
            this.log('✓ Cleanup concluído');
        }
        
        log(message) {
            AS.PluginManager.log(`[Options Screen] ${message}`);
        }
    }
    
    //=========================================================================
    // Scene_Options - Substituição Customizada
    //=========================================================================
    
    if (AS.OptionsScreen.enabled) {
        
        // Salva referências originais
        AS.OptionsScreen._Scene_Options_create = Scene_Options.prototype.create;
        AS.OptionsScreen._Scene_Options_terminate = Scene_Options.prototype.terminate;
        
        /**
         * Criação da cena customizada
         */
        Scene_Options.prototype.create = function() {
            console.log('[AS Options] ╔═══════════════════════════════════════');
            console.log('[AS Options] ║ Scene_Options.create() chamado');
            console.log('[AS Options] ║ SceneManager._scene:', SceneManager._scene ? SceneManager._scene.constructor.name : 'null');
            console.log('[AS Options] ║ SceneManager._stack length:', SceneManager._stack.length);
            console.log('[AS Options] ╚═══════════════════════════════════════');
            
            Scene_MenuBase.prototype.create.call(this);
            
            const manager = AS.PluginManager.getAgentInstance('AS_1.3_OptionsScreen');
            
            if (manager && AS.OptionsScreen.enabled) {
                this._customOptionsActive = true;
                this.createCustomOptions();
            } else {
                // Fallback para tela padrão
                AS.OptionsScreen._Scene_Options_create.call(this);
            }
        };
        
        /**
         * Cria tela de opções customizada
         */
        Scene_Options.prototype.createCustomOptions = function() {
            console.log('[AS Options] Criando opções customizadas...');
            
            // Cria background customizado se habilitado
            if (AS.OptionsScreen.showBackground) {
                this.createCustomBackground();
            }
            
            // Cria UI customizada
            const manager = AS.PluginManager.getAgentInstance('AS_1.3_OptionsScreen');
            if (manager) {
                manager.createUI(this);
            }
            
            console.log('[AS Options] ✓ Opções customizadas criadas');
        };
        
        /**
         * Cria background com overlay
         */
        Scene_Options.prototype.createCustomBackground = function() {
            // Background com cor sólida
            this._customBackSprite = new Sprite();
            this._customBackSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._customBackSprite.bitmap.fillAll(AS.OptionsScreen.backgroundColor);
            this.addChild(this._customBackSprite);
            
            // Carrega background.png com overlay escuro
            const bgPath = 'js/plugins/assets/resources/background.png';
            const bgImg = new Image();
            bgImg.onload = () => {
                const bitmap = new Bitmap(bgImg.width, bgImg.height);
                const context = bitmap.context;
                context.drawImage(bgImg, 0, 0);
                
                // Aplica overlay escuro
                context.fillStyle = 'rgba(0, 0, 0, 0.7)';
                context.fillRect(0, 0, bgImg.width, bgImg.height);
                
                bitmap.baseTexture.update();
                
                this._customBgSprite = new Sprite(bitmap);
                const scaleX = Graphics.width / bgImg.width;
                const scaleY = Graphics.height / bgImg.height;
                const scale = Math.max(scaleX, scaleY);
                this._customBgSprite.scale.x = scale;
                this._customBgSprite.scale.y = scale;
                this._customBgSprite.x = (Graphics.width - bgImg.width * scale) / 2;
                this._customBgSprite.y = (Graphics.height - bgImg.height * scale) / 2;
                
                this.addChild(this._customBgSprite);
            };
            bgImg.src = bgPath;
        };
        
        /**
         * Término da cena
         */
        Scene_Options.prototype.terminate = function() {
            console.log('[AS Options] ╔═══════════════════════════════════════');
            console.log('[AS Options] ║ Scene_Options.terminate() chamado');
            console.log('[AS Options] ║ _customOptionsActive:', this._customOptionsActive);
            console.log('[AS Options] ╚═══════════════════════════════════════');
            
            Scene_MenuBase.prototype.terminate.call(this);
            
            if (this._customOptionsActive) {
                const manager = AS.PluginManager.getAgentInstance('AS_1.3_OptionsScreen');
                if (manager) {
                    console.log('[AS Options] ✓ Chamando manager.destroyUI()');
                    manager.destroyUI();
                } else {
                    console.log('[AS Options] ⚠️ Manager não encontrado!');
                }
            }
            
            // Cleanup de bitmaps
            if (this._customBackSprite && this._customBackSprite.bitmap) {
                this._customBackSprite.bitmap.destroy();
            }
            if (this._customBgSprite && this._customBgSprite.bitmap) {
                this._customBgSprite.bitmap.destroy();
            }
            
            console.log('[AS Options] ✓ Terminate concluído');
        };
    }
    
    //=========================================================================
    // Registro do Agente
    //=========================================================================
    
    AS.PluginManager.register('AS_1.3_OptionsScreen', {
        name: 'Options Screen Manager',
        version: '1.0.1',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Gerenciador da tela de opções personalizada',
        dependencies: ['AS_0.0_PluginManager'],
        init: () => {
            const manager = new OptionsScreenManager();
            manager.init();
            return manager;
        },
        cleanup: () => {
            const manager = AS.PluginManager.getAgentInstance('AS_1.3_OptionsScreen');
            if (manager) {
                manager.cleanup();
            }
        }
    });
    
})();

//=============================================================================
// Fim do AS_2.0_OptionsScreen_Agent.js
//=============================================================================
