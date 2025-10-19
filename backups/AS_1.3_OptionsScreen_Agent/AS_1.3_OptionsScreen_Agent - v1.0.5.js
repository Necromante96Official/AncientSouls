//=============================================================================
// AS_1.3_OptionsScreen_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.5] Tela de Opções Personalizada - Ancient Souls (Redesignada)
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.5
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
 * @default #0a0a0f
 * @desc Cor de fundo da tela de opções (formato hexadecimal).
 *
 * @param AccentColor
 * @text Cor de Destaque
 * @type string
 * @default #d4af37
 * @desc Cor de destaque para elementos ativos (formato hexadecimal).
 *
 * @param ShowBackgroundImage
 * @text Mostrar Imagem de Fundo
 * @type boolean
 * @default true
 * @desc Mostra a imagem de fundo (background.png) com overlay escuro.
 *
 * @help
 * AS_1.3_OptionsScreen_Agent [v1.0.5]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Plugin responsável por criar uma tela de opções personalizada, dinâmica
 * e altamente animada para o Ancient Souls, substituindo a Scene_Options
 * padrão do RPG Maker MZ.
 * 
 * Características:
 *  - Interface HTML5/CSS3 moderna, dinâmica e animada
 *  - Sistema de abas (Áudio, Vídeo, Gameplay)
 *  - Sliders suaves com animações
 *  - Toggles com transições elegantes
 *  - Design medieval com ouro e cores warm
 *  - Efeitos hover e transições fluidas
 *  - Fonte Pixel Times (GameFont) em todos elementos
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
    AS.OptionsScreen.backgroundColor = parameters.BackgroundColor || '#0a0a0f';
    AS.OptionsScreen.accentColor = parameters.AccentColor || '#d4af37';
    AS.OptionsScreen.showBackground = parameters.ShowBackgroundImage === 'true';
    
    //=========================================================================
    // AS.OptionsScreen.Manager - Gerenciador de Opções
    //=========================================================================
    
    class OptionsScreenManager {
        constructor() {
            this.container = null;
            this._htmlContainer = null;
            this.currentScene = null;
            this.elements = new Map();
            this.currentTab = 'audio';
        }
        
        log(message) {
            AS.PluginManager.log(`[Options Screen] ${message}`);
        }
        
        createUI(scene) {
            this.currentScene = scene;
            this.log('🎨 Criando interface de opções...');
            
            // Criar container HTML
            this._htmlContainer = document.createElement('div');
            this._htmlContainer.id = 'as-options-container';
            document.body.appendChild(this._htmlContainer);

            // Garante carregamento da GameFont (Pixel Times do projeto)
            try {
                if (window.FontManager && FontManager.load) {
                    FontManager.load('GameFont');
                } else if (window.Graphics && Graphics.loadFont) {
                    Graphics.loadFont('GameFont');
                }
                if (document.fonts && document.fonts.load) {
                    document.fonts.load('12px "GameFont"').catch(() => {});
                }
            } catch (e) {
                this.log('⚠️ Não foi possível forçar o carregamento da GameFont: ' + e.message);
            }
            
            // Injetar estilos
            this.injectStyles();
            
            // Criar interface
            this.createContent();
            
            this.log('✓ Interface de opções criada com sucesso');
        }
        
        injectStyles() {
            const oldStyle = document.getElementById('as-options-styles');
            if (oldStyle) oldStyle.remove();
            
            const style = document.createElement('style');
            style.id = 'as-options-styles';
            style.textContent = `
                /* ═════════════════════════════════════════════════════════ */
                /* ANCIENT SOULS - TELA DE OPÇÕES v1.0.5                         */
                /* ═════════════════════════════════════════════════════════ */
                
                #as-options-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, ${AS.OptionsScreen.backgroundColor} 0%, #16213e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    animation: fadeIn 0.5s ease-out forwards;
                    font-family: 'GameFont', sans-serif;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* ═════════════════════════════════ HEADER ═════════════════ */
                .as-options-header {
                    position: absolute;
                    top: 40px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    animation: slideDown 0.6s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .as-options-title {
                    font-size: 52px;
                    font-weight: bold;
                    color: ${AS.OptionsScreen.accentColor};
                    text-shadow: 
                        0 0 20px rgba(212, 175, 55, 0.6),
                        2px 2px 10px rgba(0, 0, 0, 0.9),
                        -2px -2px 10px rgba(212, 175, 55, 0.2);
                    letter-spacing: 3px;
                    margin: 0;
                    font-family: 'GameFont', sans-serif;
                }
                
                /* ═════════════════════════ PAINEL PRINCIPAL ═══════════════ */
                .as-options-panel {
                    background: linear-gradient(180deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%);
                    border: 3px solid ${AS.OptionsScreen.accentColor};
                    border-radius: 12px;
                    padding: 40px;
                    width: 700px;
                    max-height: 70vh;
                    box-shadow: 
                        0 0 40px rgba(212, 175, 55, 0.3),
                        0 0 80px rgba(0, 0, 0, 0.8),
                        inset 0 0 20px rgba(212, 175, 55, 0.1);
                    backdrop-filter: blur(10px);
                    animation: panelSlideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                @keyframes panelSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                /* ════════════════════════ SISTEMA DE ABAS ═════════════════ */
                .as-tabs-container {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 30px;
                    border-bottom: 2px solid rgba(212, 175, 55, 0.3);
                    padding-bottom: 15px;
                    animation: fadeInTabs 0.8s ease-out;
                }
                
                @keyframes fadeInTabs {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .as-tab-button {
                    flex: 1;
                    padding: 14px 20px;
                    font-size: 18px;
                    font-weight: bold;
                    font-family: 'GameFont', sans-serif;
                    color: rgba(255, 255, 255, 0.6);
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
                    border: 2px solid rgba(212, 175, 55, 0.4);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
                    position: relative;
                    overflow: hidden;
                }
                
                .as-tab-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: rgba(212, 175, 55, 0.1);
                    transition: left 0.3s ease;
                    z-index: -1;
                }
                
                .as-tab-button:hover::before {
                    left: 0;
                }
                
                .as-tab-button:hover {
                    color: rgba(255, 255, 255, 0.95);
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%);
                    border-color: rgba(212, 175, 55, 0.7);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
                }
                
                .as-tab-button.active {
                    color: #ffd700;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.15) 100%);
                    border-color: #d4af37;
                    border-bottom: 3px solid #d4af37;
                    box-shadow: 
                        0 0 15px rgba(212, 175, 55, 0.4),
                        inset 0 0 10px rgba(212, 175, 55, 0.1);
                    transform: translateY(-3px);
                }
                
                .as-tab-button.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #d4af37, transparent);
                    animation: tabGlow 1s infinite;
                }
                
                @keyframes tabGlow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                
                /* ═══════════════════════ CONTEÚDO DAS ABAS ════════════════ */
                .as-tab-content {
                    position: relative;
                    min-height: 280px;
                    overflow-y: auto;
                    padding-right: 10px;
                }
                
                .as-tab-content::-webkit-scrollbar {
                    width: 8px;
                }
                
                .as-tab-content::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 4px;
                }
                
                .as-tab-content::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #d4af37, #8b6914);
                    border-radius: 4px;
                    box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
                }
                
                .as-tab-pane {
                    display: none;
                    animation: fadeInPane 0.4s ease-out;
                }
                
                @keyframes fadeInPane {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .as-tab-pane.active {
                    display: block;
                }
                
                /* ═══════════════════════════ OPÇÕES ═══════════════════════ */
                .as-option-group {
                    margin-bottom: 28px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.3);
                    border-left: 3px solid ${AS.OptionsScreen.accentColor};
                    border-radius: 6px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    animation: slideInOption 0.5s ease-out;
                }
                
                @keyframes slideInOption {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .as-option-label {
                    font-size: 18px;
                    font-weight: bold;
                    font-family: 'GameFont', sans-serif;
                    color: #ffffff;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
                }
                
                /* ══════════════════════════ SLIDERS ═══════════════════════ */
                .as-slider-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .as-slider {
                    flex: 1;
                    -webkit-appearance: none;
                    appearance: none;
                    height: 10px;
                    background: linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(212, 175, 55, 0.2));
                    border-radius: 5px;
                    outline: none;
                    cursor: pointer;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                }
                
                .as-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    background: linear-gradient(135deg, #d4af37, #8b6914);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 
                        0 0 12px rgba(212, 175, 55, 0.6),
                        inset 0 0 5px rgba(255, 255, 255, 0.3);
                    transition: all 0.2s ease;
                }
                
                .as-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.25);
                    box-shadow: 
                        0 0 20px rgba(212, 175, 55, 0.9),
                        inset 0 0 8px rgba(255, 255, 255, 0.5);
                }
                
                .as-slider::-webkit-slider-thumb:active {
                    transform: scale(1.15);
                }
                
                .as-slider::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    background: linear-gradient(135deg, #d4af37, #8b6914);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 
                        0 0 12px rgba(212, 175, 55, 0.6),
                        inset 0 0 5px rgba(255, 255, 255, 0.3);
                    transition: all 0.2s ease;
                }
                
                .as-slider::-moz-range-thumb:hover {
                    transform: scale(1.25);
                    box-shadow: 
                        0 0 20px rgba(212, 175, 55, 0.9),
                        inset 0 0 8px rgba(255, 255, 255, 0.5);
                }
                
                .as-option-value {
                    font-size: 16px;
                    font-weight: bold;
                    font-family: 'GameFont', sans-serif;
                    color: ${AS.OptionsScreen.accentColor};
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                    min-width: 45px;
                    text-align: right;
                }
                
                /* ══════════════════════════ TOGGLES ═══════════════════════ */
                .as-toggle-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .as-toggle {
                    position: relative;
                    width: 70px;
                    height: 36px;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
                    border: 2px solid rgba(212, 175, 55, 0.4);
                    border-radius: 18px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
                }
                
                .as-toggle:hover {
                    border-color: rgba(212, 175, 55, 0.7);
                    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.2);
                }
                
                .as-toggle.active {
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15));
                    border-color: #d4af37;
                    box-shadow: 
                        inset 0 0 8px rgba(0, 0, 0, 0.5),
                        0 0 15px rgba(212, 175, 55, 0.4);
                }
                
                .as-toggle-thumb {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 26px;
                    height: 26px;
                    background: linear-gradient(135deg, #ffffff, #f0f0f0);
                    border-radius: 50%;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
                }
                
                .as-toggle.active .as-toggle-thumb {
                    transform: translateX(34px);
                    background: linear-gradient(135deg, #d4af37, #8b6914);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 8px rgba(212, 175, 55, 0.5);
                }
                
                /* ═══════════════════════════ FOOTER ═══════════════════════ */
                .as-options-footer {
                    position: absolute;
                    bottom: 40px;
                    right: 40px;
                    animation: slideUp 0.7s ease-out 0.2s both;
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .as-close-button {
                    padding: 14px 50px;
                    font-size: 18px;
                    font-weight: bold;
                    font-family: 'GameFont', sans-serif;
                    color: #ffffff;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
                    border: 3px solid ${AS.OptionsScreen.accentColor};
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
                    box-shadow: 
                        0 4px 16px rgba(212, 175, 55, 0.3),
                        inset 0 0 10px rgba(212, 175, 55, 0.1);
                    position: relative;
                    overflow: hidden;
                }
                
                .as-close-button::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .as-close-button:hover {
                    color: #ffd700;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.2));
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 
                        0 6px 24px rgba(212, 175, 55, 0.5),
                        inset 0 0 15px rgba(212, 175, 55, 0.2);
                    border-color: #ffd700;
                }
                
                .as-close-button:hover::before {
                    opacity: 1;
                }
                
                .as-close-button:active {
                    transform: translateY(-1px) scale(0.98);
                    box-shadow: 
                        0 2px 8px rgba(212, 175, 55, 0.3),
                        inset 0 0 10px rgba(212, 175, 55, 0.1);
                }
                
                /* ════════════════════════ RESPONSIVIDADE ══════════════════ */
                @media (max-width: 900px) {
                    .as-options-panel {
                        width: 85%;
                        padding: 30px;
                    }
                    
                    .as-options-title {
                        font-size: 40px;
                    }
                }
                
                @media (max-width: 600px) {
                    .as-options-panel {
                        width: 95%;
                        padding: 20px;
                    }
                    
                    .as-option-group {
                        padding: 12px;
                    }
                    
                    .as-option-label {
                        font-size: 16px;
                    }
                }
            `;
            document.head.appendChild(style);
            this.log('✓ Estilos CSS injetados');
        }
        
        createContent() {
            const header = document.createElement('div');
            header.className = 'as-options-header';
            const title = document.createElement('h1');
            title.className = 'as-options-title';
            title.textContent = '⚙️ CONFIGURAÇÕES';
            header.appendChild(title);
            this._htmlContainer.appendChild(header);
            
            const panel = document.createElement('div');
            panel.className = 'as-options-panel';
            
            // Criar abas
            const tabsContainer = document.createElement('div');
            tabsContainer.className = 'as-tabs-container';
            
            const tabs = [
                { id: 'audio', label: '🎵 Áudio', icon: '🎵' },
                { id: 'video', label: '🎨 Vídeo', icon: '🎨' },
                { id: 'gameplay', label: '🎮 Gameplay', icon: '🎮' }
            ];
            
            tabs.forEach((tab, index) => {
                const btn = document.createElement('button');
                btn.className = `as-tab-button ${index === 0 ? 'active' : ''}`;
                btn.dataset.tab = tab.id;
                btn.textContent = tab.label;
                btn.addEventListener('click', () => this.switchTab(tab.id));
                tabsContainer.appendChild(btn);
            });
            
            panel.appendChild(tabsContainer);
            
            // Criar conteúdo das abas
            const tabContent = document.createElement('div');
            tabContent.className = 'as-tab-content';
            
            // Aba Áudio
            const audioTab = document.createElement('div');
            audioTab.className = 'as-tab-pane active';
            audioTab.id = 'tab-audio';
            
            this.createSliderOption(audioTab, 'bgmVolume', '🎵 Música de Fundo', ConfigManager.bgmVolume);
            this.createSliderOption(audioTab, 'bgsVolume', '🌊 Sons Ambiente', ConfigManager.bgsVolume);
            this.createSliderOption(audioTab, 'meVolume', '🎺 Efeitos Musicais', ConfigManager.meVolume);
            this.createSliderOption(audioTab, 'seVolume', '⚔️ Efeitos Sonoros', ConfigManager.seVolume);
            
            tabContent.appendChild(audioTab);
            
            // Aba Vídeo
            const videoTab = document.createElement('div');
            videoTab.className = 'as-tab-pane';
            videoTab.id = 'tab-video';
            
            const videoMsg = document.createElement('div');
            videoMsg.style.cssText = `
                text-align: center;
                padding: 60px 20px;
                color: rgba(255, 255, 255, 0.5);
                font-size: 20px;
                font-family: 'GameFont', sans-serif;
            `;
            videoMsg.textContent = '🎨 Configurações de vídeo em breve...';
            videoTab.appendChild(videoMsg);
            
            tabContent.appendChild(videoTab);
            
            // Aba Gameplay
            const gameplayTab = document.createElement('div');
            gameplayTab.className = 'as-tab-pane';
            gameplayTab.id = 'tab-gameplay';
            
            this.createToggleOption(gameplayTab, 'alwaysDash', '🏃 Sempre Correr', ConfigManager.alwaysDash);
            this.createToggleOption(gameplayTab, 'commandRemember', '💬 Lembrar Comandos', ConfigManager.commandRemember);
            
            tabContent.appendChild(gameplayTab);
            
            panel.appendChild(tabContent);
            
            // Botão Fechar
            const footer = document.createElement('div');
            footer.className = 'as-options-footer';
            const closeBtn = document.createElement('button');
            closeBtn.className = 'as-close-button';
            closeBtn.textContent = '✕ FECHAR';
            closeBtn.addEventListener('click', () => this.closeOptions());
            footer.appendChild(closeBtn);
            
            this._htmlContainer.appendChild(panel);
            this._htmlContainer.appendChild(footer);
        }
        
        createSliderOption(container, id, label, initialValue) {
            const group = document.createElement('div');
            group.className = 'as-option-group';
            
            const labelContainer = document.createElement('div');
            labelContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const labelEl = document.createElement('label');
            labelEl.className = 'as-option-label';
            labelEl.textContent = label;
            
            const valueEl = document.createElement('span');
            valueEl.className = 'as-option-value';
            {
                const percent = initialValue <= 1 ? Math.round(initialValue * 100) : Math.round(initialValue);
                valueEl.textContent = `${percent}%`;
            }
            
            labelContainer.appendChild(labelEl);
            labelContainer.appendChild(valueEl);
            group.appendChild(labelContainer);
            
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'as-slider-container';
            
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'as-slider';
            slider.min = '0';
            slider.max = '100';
            // Compat: se o valor vier no intervalo [0..1], normaliza para [0..100]
            const normalized = initialValue <= 1 ? Math.round(initialValue * 100) : Math.round(initialValue);
            slider.value = String(normalized);
            
            slider.addEventListener('input', (e) => {
                const percent = parseInt(e.target.value);
                valueEl.textContent = `${percent}%`;

                // No RMMZ, os volumes do ConfigManager são 0..100
                if (id === 'bgmVolume') ConfigManager.bgmVolume = percent;
                if (id === 'bgsVolume') ConfigManager.bgsVolume = percent;
                if (id === 'meVolume') ConfigManager.meVolume = percent;
                if (id === 'seVolume') ConfigManager.seVolume = percent;

                ConfigManager.save();
            });
            
            sliderContainer.appendChild(slider);
            group.appendChild(sliderContainer);
            container.appendChild(group);
        }
        
        createToggleOption(container, id, label, initialValue) {
            const group = document.createElement('div');
            group.className = 'as-option-group';
            
            const labelContainer = document.createElement('div');
            labelContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const labelEl = document.createElement('label');
            labelEl.className = 'as-option-label';
            labelEl.textContent = label;
            
            const toggle = document.createElement('div');
            toggle.className = `as-toggle ${initialValue ? 'active' : ''}`;
            
            const thumb = document.createElement('div');
            thumb.className = 'as-toggle-thumb';
            toggle.appendChild(thumb);
            
            toggle.addEventListener('click', () => {
                const isActive = toggle.classList.toggle('active');
                
                if (id === 'alwaysDash') ConfigManager.alwaysDash = isActive;
                if (id === 'commandRemember') ConfigManager.commandRemember = isActive;
                
                ConfigManager.save();
            });
            
            labelContainer.appendChild(labelEl);
            labelContainer.appendChild(toggle);
            group.appendChild(labelContainer);
            container.appendChild(group);
        }
        
        switchTab(tabId) {
            this.currentTab = tabId;
            
            // Remover active dos botões
            document.querySelectorAll('.as-tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Adicionar active ao botão clicado
            document.querySelector(`.as-tab-button[data-tab="${tabId}"]`).classList.add('active');
            
            // Remover active das abas
            document.querySelectorAll('.as-tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Adicionar active à aba
            document.getElementById(`tab-${tabId}`).classList.add('active');
        }
        
        closeOptions() {
            this.log('🔙 Fechando tela de opções...');
            
            const sceneRef = this.currentScene;
            this.destroyUI();
            
            if (sceneRef && SceneManager._scene) {
                this.log('✓ Executando SceneManager.pop()...');
                SceneManager.pop();
            }
        }
        
        destroyUI() {
            this.log('🗑️ Destruindo interface de opções...');
            
            if (this._htmlContainer) {
                this._htmlContainer.remove();
                this._htmlContainer = null;
            }
            
            const style = document.getElementById('as-options-styles');
            if (style) {
                style.remove();
            }
            
            this.elements.clear();
            this.currentScene = null;
            
            this.log('✓ Interface removida com sucesso');
        }
    }
    
    // Instância singleton
    let managerInstance = null;
    
    // Registro do Agente no PluginManager
    AS.PluginManager = AS.PluginManager || {};
    if (AS.PluginManager.register) {
        AS.PluginManager.register('AS_1.3_OptionsScreen', {
            name: 'Options Screen Manager',
            version: '1.0.5',
            author: 'Necromante96Official & GitHub Copilot',
            description: 'Tela de Opções customizada com abas, sliders e toggles',
            dependencies: ['AS_0.0_PluginManager'],
            init: () => {
                managerInstance = managerInstance || new OptionsScreenManager();
                return managerInstance;
            },
            cleanup: () => {
                if (managerInstance) managerInstance.destroyUI();
            }
        });
    }
    // Fallback para obter instância via PluginManager
    AS.PluginManager.getAgentInstance = AS.PluginManager.getAgentInstance || function(name) {
        if (name === 'AS_1.3_OptionsScreen' || name === 'AS_1.3_OptionsScreen_Agent') {
            managerInstance = managerInstance || new OptionsScreenManager();
            return managerInstance;
        }
        return null;
    };
    
    //=========================================================================
    // Scene_Options - Integração com RPG Maker
    //=========================================================================
    
    const _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        
        if (AS.OptionsScreen.enabled) {
            const manager = AS.PluginManager.getAgentInstance('AS_1.3_OptionsScreen');
            if (manager) {
                manager.createUI(this);
            }
        }
    };
    
    const _Scene_Options_terminate = Scene_Options.prototype.terminate;
    Scene_Options.prototype.terminate = function() {
        _Scene_Options_terminate.call(this);
        
        const manager = AS.PluginManager.getAgentInstance('AS_1.3_OptionsScreen');
        if (manager) {
            manager.destroyUI();
        }
    };
    
})();
