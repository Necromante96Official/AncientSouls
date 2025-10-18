//=============================================================================
// AS_1.1_TitleScreenUI_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.0] Interface da Tela de Título - Ancient Souls
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.0
 * @orderAfter AS_1.0_TitleScreen_Agent
 *
 * @param GameTitle
 * @text Título do Jogo
 * @type string
 * @default Ancient Souls
 * @desc Nome do jogo exibido na tela de título.
 *
 * @param TitleFontSize
 * @text Tamanho da Fonte do Título
 * @type number
 * @default 72
 * @desc Tamanho da fonte do título (em pixels).
 *
 * @param MenuButtonColor
 * @text Cor dos Botões
 * @type string
 * @default #ffffff
 * @desc Cor dos botões do menu (formato hexadecimal).
 *
 * @param MenuButtonHoverColor
 * @text Cor dos Botões (Hover)
 * @type string
 * @default #ffd700
 * @desc Cor dos botões ao passar o mouse (formato hexadecimal).
 *
 * @param EnableAnimatedMenu
 * @text Menu Animado
 * @type boolean
 * @default true
 * @desc Ativa animações nos botões do menu.
 *
 * @help
 * AS_1.1_TitleScreenUI_Agent [v1.0.0]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Sub-agente responsável pela interface HTML/CSS da tela de título do 
 * Ancient Souls. Cria e gerencia todos os elementos visuais da UI, incluindo
 * menu de opções, título do jogo e elementos interativos.
 * 
 * Características:
 *  - Interface HTML5/CSS3 moderna e responsiva
 *  - Botões animados e interativos
 *  - Design customizável via parâmetros
 *  - Suporte para múltiplas resoluções
 *  - Animações suaves com CSS transitions
 *  - Sistema de hover effects
 * 
 * Como usar:
 *  1) Certifique-se de que AS_1.0_TitleScreen_Agent está ativo
 *  2) Ative este plugin no Plugin Manager
 *  3) Configure os parâmetros de estilo conforme necessário
 * 
 * Dependências:
 *  - AS_0.0_PluginManager_Agent (obrigatório)
 *  - AS_1.0_TitleScreen_Agent (obrigatório)
 * 
 * Observações:
 *  - Este é um sub-agente de AS_1.0_TitleScreen
 *  - Requer navegador com suporte a CSS3
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
AS.TitleScreenUI = AS.TitleScreenUI || {};

//=============================================================================
// Configurações do Plugin
//=============================================================================

(() => {
    'use strict';
    
    const pluginName = "AS_1.1_TitleScreenUI_Agent";
    const parameters = PluginManager.parameters(pluginName);
    
    AS.TitleScreenUI.gameTitle = parameters.GameTitle || 'Ancient Souls';
    AS.TitleScreenUI.titleFontSize = Number(parameters.TitleFontSize) || 72;
    AS.TitleScreenUI.buttonColor = parameters.MenuButtonColor || '#ffffff';
    AS.TitleScreenUI.buttonHoverColor = parameters.MenuButtonHoverColor || '#ffd700';
    AS.TitleScreenUI.animatedMenu = parameters.EnableAnimatedMenu === 'true';
    
    //=========================================================================
    // AS.TitleScreenUI.Manager - Gerenciador de UI
    //=========================================================================
    
    class TitleScreenUIManager {
        constructor() {
            this.initialized = false;
            this.container = null;
            this.elements = new Map();
            this.currentScene = null;
        }
        
        init() {
            if (this.initialized) {
                this.log('UI Manager já inicializado.');
                return this;
            }
            
            this.log('Inicializando TitleScreen UI Manager...');
            
            // Escuta evento de cena pronta
            AS.PluginManager.subscribe('titlescreen:scene:ready', (data) => {
                this.currentScene = data.scene;
                this.createUI();
            });
            
            // Escuta evento de término de cena
            AS.PluginManager.subscribe('titlescreen:scene:terminate', () => {
                this.destroyUI();
            });
            
            this.initialized = true;
            this.log('✓ TitleScreen UI Manager inicializado');
            
            // Notifica que UI está pronta
            AS.PluginManager.publish('titlescreen:ui:ready', {
                instance: this
            });
            
            return this;
        }
        
        createUI() {
            this.log('Criando interface da tela de título...');
            
            // Obtém ou cria container
            this.container = document.getElementById('as-titlescreen-container');
            if (!this.container) {
                this.log('⚠️  Container não encontrado, criando novo...');
                this.container = this.createContainer();
            }
            
            // Injeta estilos CSS
            this.injectStyles();
            
            // Cria elementos da UI
            this.createTitleElement();
            this.createMenuElement();
            
            // Anima entrada
            this.animateIn();
            
            this.log('✓ Interface criada com sucesso');
        }
        
        createContainer() {
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
            return container;
        }
        
        injectStyles() {
            // Remove estilos antigos se existirem
            const oldStyle = document.getElementById('as-titlescreen-styles');
            if (oldStyle) {
                oldStyle.remove();
            }
            
            const style = document.createElement('style');
            style.id = 'as-titlescreen-styles';
            style.textContent = `
                /* Container Principal */
                #as-titlescreen-container {
                    font-family: 'GameFont', sans-serif;
                    color: #ffffff;
                    user-select: none;
                }
                
                /* Título do Jogo */
                .as-game-title {
                    position: absolute;
                    top: 20%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: ${AS.TitleScreenUI.titleFontSize}px;
                    font-weight: bold;
                    text-align: center;
                    text-shadow: 
                        0 0 10px rgba(0, 0, 0, 0.8),
                        0 0 20px rgba(0, 0, 0, 0.6),
                        0 0 30px rgba(0, 0, 0, 0.4),
                        4px 4px 8px rgba(0, 0, 0, 1);
                    letter-spacing: 4px;
                    opacity: 0;
                    animation: ${AS.TitleScreenUI.animatedMenu ? 'fadeInTitle 1.5s ease-out forwards' : 'none'};
                    animation-delay: 0.3s;
                }
                
                /* Container do Menu */
                .as-menu-container {
                    position: absolute;
                    bottom: 15%;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                    opacity: 0;
                    animation: ${AS.TitleScreenUI.animatedMenu ? 'fadeInMenu 1s ease-out forwards' : 'none'};
                    animation-delay: 1s;
                }
                
                /* Botões do Menu */
                .as-menu-button {
                    padding: 15px 50px;
                    font-size: 24px;
                    font-weight: bold;
                    color: ${AS.TitleScreenUI.buttonColor};
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
                    border: 2px solid ${AS.TitleScreenUI.buttonColor};
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                    position: relative;
                    overflow: hidden;
                }
                
                .as-menu-button::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    transform: translate(-50%, -50%);
                    transition: width 0.6s, height 0.6s;
                }
                
                .as-menu-button:hover {
                    color: ${AS.TitleScreenUI.buttonHoverColor};
                    border-color: ${AS.TitleScreenUI.buttonHoverColor};
                    transform: scale(1.05) translateY(-3px);
                    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
                }
                
                .as-menu-button:hover::before {
                    width: 300px;
                    height: 300px;
                }
                
                .as-menu-button:active {
                    transform: scale(0.98) translateY(0);
                }
                
                .as-menu-button.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    pointer-events: none;
                }
                
                /* Animações */
                @keyframes fadeInTitle {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                
                @keyframes fadeInMenu {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
                
                /* Responsividade */
                @media (max-width: 768px) {
                    .as-game-title {
                        font-size: 48px;
                    }
                    
                    .as-menu-button {
                        font-size: 18px;
                        padding: 12px 40px;
                    }
                }
            `;
            
            document.head.appendChild(style);
            this.log('✓ Estilos CSS injetados');
        }
        
        createTitleElement() {
            const title = document.createElement('div');
            title.className = 'as-game-title';
            title.textContent = AS.TitleScreenUI.gameTitle;
            
            this.container.appendChild(title);
            this.elements.set('title', title);
            
            this.log('✓ Elemento de título criado');
        }
        
        createMenuElement() {
            const menuContainer = document.createElement('div');
            menuContainer.className = 'as-menu-container';
            
            // Cria botões do menu
            const buttons = [
                { id: 'newGame', text: 'Novo Jogo', enabled: true },
                { id: 'continue', text: 'Continuar', enabled: DataManager.isAnySavefileExists() },
                { id: 'options', text: 'Opções', enabled: true }
            ];
            
            for (const buttonData of buttons) {
                const button = this.createMenuButton(buttonData);
                menuContainer.appendChild(button);
                this.elements.set(`button_${buttonData.id}`, button);
            }
            
            this.container.appendChild(menuContainer);
            this.elements.set('menu', menuContainer);
            
            this.log('✓ Elemento de menu criado');
        }
        
        createMenuButton(data) {
            const button = document.createElement('div');
            button.className = 'as-menu-button';
            button.textContent = data.text;
            button.dataset.action = data.id;
            
            if (!data.enabled) {
                button.classList.add('disabled');
            }
            
            // Event listeners
            button.addEventListener('click', () => this.onButtonClick(data.id));
            button.addEventListener('mouseenter', () => this.onButtonHover(data.id));
            
            // Suporte para gamepad/teclado seria adicionado aqui
            
            return button;
        }
        
        onButtonClick(action) {
            if (!this.isButtonEnabled(action)) {
                return;
            }
            
            this.log(`Botão clicado: ${action}`);
            
            // Toca som de seleção
            this.playSelectionSound();
            
            // Publica evento de seleção
            AS.PluginManager.publish('titlescreen:menu:selected', {
                option: action
            });
        }
        
        onButtonHover(action) {
            this.log(`Hover no botão: ${action}`);
            
            // Toca som de cursor
            this.playCursorSound();
        }
        
        isButtonEnabled(action) {
            const button = this.elements.get(`button_${action}`);
            return button && !button.classList.contains('disabled');
        }
        
        playSelectionSound() {
            if (typeof SoundManager !== 'undefined' && SoundManager.playOk) {
                SoundManager.playOk();
            }
        }
        
        playCursorSound() {
            if (typeof SoundManager !== 'undefined' && SoundManager.playCursor) {
                SoundManager.playCursor();
            }
        }
        
        animateIn() {
            // As animações são feitas via CSS, mas podemos adicionar lógica extra aqui
            this.log('Animação de entrada iniciada');
        }
        
        animateOut(callback) {
            this.log('Animação de saída iniciada');
            
            // Fade out simples
            if (this.container) {
                this.container.style.transition = 'opacity 0.5s ease-out';
                this.container.style.opacity = '0';
                
                setTimeout(() => {
                    if (callback) callback();
                }, 500);
            }
        }
        
        destroyUI() {
            this.log('Destruindo interface...');
            
            // Remove elementos
            for (const [key, element] of this.elements) {
                if (element && element.parentNode) {
                    element.remove();
                }
            }
            this.elements.clear();
            
            // Remove estilos
            const style = document.getElementById('as-titlescreen-styles');
            if (style) {
                style.remove();
            }
            
            this.container = null;
            this.currentScene = null;
            
            this.log('✓ Interface destruída');
        }
        
        cleanup() {
            this.log('Limpando UI Manager...');
            this.destroyUI();
            this.initialized = false;
            this.log('✓ Cleanup concluído');
        }
        
        log(message) {
            AS.PluginManager.log(`[TitleScreen UI] ${message}`);
        }
    }
    
    //=========================================================================
    // Registro do Agente
    //=========================================================================
    
    AS.PluginManager.register('AS_1.1_TitleScreenUI', {
        name: 'TitleScreen UI Manager',
        version: '1.0.0',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Gerenciador de interface HTML/CSS da tela de título',
        dependencies: ['AS_0.0_PluginManager', 'AS_1.0_TitleScreen'],
        init: () => {
            const manager = new TitleScreenUIManager();
            manager.init();
            return manager;
        },
        cleanup: () => {
            const manager = AS.PluginManager.getAgentInstance('AS_1.1_TitleScreenUI');
            if (manager) {
                manager.cleanup();
            }
        }
    });
    
})();

//=============================================================================
// Fim do AS_1.1_TitleScreenUI_Agent.js
//=============================================================================
