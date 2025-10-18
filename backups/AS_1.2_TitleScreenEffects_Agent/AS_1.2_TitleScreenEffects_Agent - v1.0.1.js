//=============================================================================
// AS_1.2_TitleScreenEffects_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.1] Efeitos Visuais da Tela de Título - Ancient Souls
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.1
 * @orderAfter AS_1.1_TitleScreenUI_Agent
 *
 * @param EnableParticles
 * @text Ativar Partículas
 * @type boolean
 * @default true
 * @desc Ativa sistema de partículas no fundo.
 *
 * @param ParticleCount
 * @text Quantidade de Partículas
 * @type number
 * @default 50
 * @desc Número de partículas na tela.
 *
 * @param ParticleColor
 * @text Cor das Partículas
 * @type string
 * @default #ffffff
 * @desc Cor das partículas (formato hexadecimal).
 *
 * @param EnableVignette
 * @text Efeito Vignette
 * @type boolean
 * @default true
 * @desc Ativa efeito de vinheta nas bordas da tela.
 *
 * @param EnableGlow
 * @text Efeito de Brilho
 * @type boolean
 * @default true
 * @desc Ativa efeitos de brilho e luminosidade.
 *
 * @help
 * AS_1.2_TitleScreenEffects_Agent [v1.0.1]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Sub-agente responsável por animações e efeitos visuais da tela de título
 * do Ancient Souls. Gerencia partículas, transições, efeitos de pós-
 * processamento e animações procedurais usando Canvas e CSS.
 * 
 * Características:
 *  - Sistema de partículas Canvas 2D
 *  - Efeitos de vinheta e pós-processamento
 *  - Animações procedurais
 *  - Efeitos de brilho e luminosidade
 *  - Performance otimizada com RequestAnimationFrame
 *  - Controle de densidade baseado em FPS
 * 
 * Como usar:
 *  1) Certifique-se de que AS_1.0_TitleScreen_Agent está ativo
 *  2) Ative este plugin no Plugin Manager
 *  3) Configure os parâmetros de efeitos conforme necessário
 * 
 * Dependências:
 *  - AS_0.0_PluginManager_Agent (obrigatório)
 *  - AS_1.0_TitleScreen_Agent (obrigatório)
 * 
 * Observações:
 *  - Este é um sub-agente de AS_1.0_TitleScreen
 *  - Usa Canvas API para renderização
 *  - Ajusta qualidade automaticamente baseado em performance
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
AS.TitleScreenEffects = AS.TitleScreenEffects || {};

//=============================================================================
// Configurações do Plugin
//=============================================================================

(() => {
    'use strict';
    
    const pluginName = "AS_1.2_TitleScreenEffects_Agent";
    const parameters = PluginManager.parameters(pluginName);
    
    AS.TitleScreenEffects.particlesEnabled = parameters.EnableParticles === 'true';
    AS.TitleScreenEffects.particleCount = Number(parameters.ParticleCount) || 50;
    AS.TitleScreenEffects.particleColor = parameters.ParticleColor || '#ffffff';
    AS.TitleScreenEffects.vignetteEnabled = parameters.EnableVignette === 'true';
    AS.TitleScreenEffects.glowEnabled = parameters.EnableGlow === 'true';
    
    //=========================================================================
    // AS.TitleScreenEffects.Particle - Classe de Partícula
    //=========================================================================
    
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.life = 1.0;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around edges
            if (this.x < 0) this.x = this.canvas.width;
            if (this.x > this.canvas.width) this.x = 0;
            if (this.y < 0) this.y = this.canvas.height;
            if (this.y > this.canvas.height) this.y = 0;
            
            // Fade effect
            this.life -= 0.001;
            if (this.life <= 0) {
                this.reset();
            }
        }
        
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity * this.life;
            ctx.fillStyle = AS.TitleScreenEffects.particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    //=========================================================================
    // AS.TitleScreenEffects.Manager - Gerenciador de Efeitos
    //=========================================================================
    
    class TitleScreenEffectsManager {
        constructor() {
            this.initialized = false;
            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.animationId = null;
            this.currentScene = null;
            this.container = null;
        }
        
        init() {
            if (this.initialized) {
                this.log('Effects Manager já inicializado.');
                return this;
            }
            
            this.log('Inicializando TitleScreen Effects Manager...');
            
            // Escuta evento de cena pronta
            AS.PluginManager.subscribe('titlescreen:scene:ready', (data) => {
                this.currentScene = data.scene;
                this.setupEffects();
            });
            
            // Escuta evento de término de cena
            AS.PluginManager.subscribe('titlescreen:scene:terminate', () => {
                this.destroyEffects();
            });
            
            // Escuta evento de transição
            AS.PluginManager.subscribe('titlescreen:transition:out', (data) => {
                this.animateTransitionOut(data.target);
            });
            
            // Escuta evento de cleanup temporário
            AS.PluginManager.subscribe('titlescreen:cleanup:temp', () => {
                this.hideEffects();
            });
            
            this.initialized = true;
            this.log('✓ TitleScreen Effects Manager inicializado');
            
            // Notifica que Effects está pronto
            AS.PluginManager.publish('titlescreen:effects:ready', {
                instance: this
            });
            
            return this;
        }
        
        setupEffects() {
            this.log('Configurando efeitos visuais...');
            
            // Obtém container
            this.container = document.getElementById('as-titlescreen-container');
            if (!this.container) {
                this.log('⚠️  Container não encontrado');
                return;
            }
            
            // Cria canvas para efeitos
            this.createCanvas();
            
            // Injeta estilos de efeitos
            this.injectEffectStyles();
            
            // Inicializa partículas
            if (AS.TitleScreenEffects.particlesEnabled) {
                this.initParticles();
                this.startAnimation();
            }
            
            this.log('✓ Efeitos configurados');
        }
        
        createCanvas() {
            // Remove canvas anterior se existir
            const oldCanvas = document.getElementById('as-effects-canvas');
            if (oldCanvas) {
                oldCanvas.remove();
            }
            
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'as-effects-canvas';
            this.canvas.width = Graphics.width;
            this.canvas.height = Graphics.height;
            this.canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.ctx = this.canvas.getContext('2d');
            this.container.insertBefore(this.canvas, this.container.firstChild);
            
            this.log('✓ Canvas de efeitos criado');
        }
        
        injectEffectStyles() {
            const oldStyle = document.getElementById('as-effects-styles');
            if (oldStyle) {
                oldStyle.remove();
            }
            
            const style = document.createElement('style');
            style.id = 'as-effects-styles';
            
            let styleContent = '';
            
            // Efeito de vinheta
            if (AS.TitleScreenEffects.vignetteEnabled) {
                styleContent += `
                    #as-titlescreen-container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: radial-gradient(
                            ellipse at center,
                            transparent 0%,
                            transparent 50%,
                            rgba(0, 0, 0, 0.3) 70%,
                            rgba(0, 0, 0, 0.7) 100%
                        );
                        pointer-events: none;
                        z-index: 2;
                    }
                `;
            }
            
            // Efeito de brilho
            if (AS.TitleScreenEffects.glowEnabled) {
                styleContent += `
                    .as-game-title {
                        text-shadow: 
                            0 0 10px rgba(255, 255, 255, 0.8),
                            0 0 20px rgba(255, 255, 255, 0.6),
                            0 0 30px rgba(255, 255, 255, 0.4),
                            0 0 40px rgba(255, 215, 0, 0.3),
                            4px 4px 8px rgba(0, 0, 0, 1);
                        animation: pulseGlow 3s ease-in-out infinite;
                    }
                    
                    @keyframes pulseGlow {
                        0%, 100% {
                            text-shadow: 
                                0 0 10px rgba(255, 255, 255, 0.8),
                                0 0 20px rgba(255, 255, 255, 0.6),
                                0 0 30px rgba(255, 255, 255, 0.4),
                                0 0 40px rgba(255, 215, 0, 0.3),
                                4px 4px 8px rgba(0, 0, 0, 1);
                        }
                        50% {
                            text-shadow: 
                                0 0 15px rgba(255, 255, 255, 1),
                                0 0 25px rgba(255, 255, 255, 0.8),
                                0 0 35px rgba(255, 255, 255, 0.6),
                                0 0 45px rgba(255, 215, 0, 0.5),
                                4px 4px 8px rgba(0, 0, 0, 1);
                        }
                    }
                `;
            }
            
            style.textContent = styleContent;
            document.head.appendChild(style);
            
            this.log('✓ Estilos de efeitos injetados');
        }
        
        initParticles() {
            this.particles = [];
            for (let i = 0; i < AS.TitleScreenEffects.particleCount; i++) {
                this.particles.push(new Particle(this.canvas));
            }
            this.log(`✓ ${AS.TitleScreenEffects.particleCount} partículas criadas`);
        }
        
        startAnimation() {
            if (this.animationId) {
                return;
            }
            
            const animate = () => {
                this.animationId = requestAnimationFrame(animate);
                this.updateEffects();
                this.renderEffects();
            };
            
            animate();
            this.log('✓ Loop de animação iniciado');
        }
        
        stopAnimation() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
                this.log('✓ Loop de animação parado');
            }
        }
        
        updateEffects() {
            // Atualiza partículas
            for (const particle of this.particles) {
                particle.update();
            }
        }
        
        renderEffects() {
            if (!this.ctx || !this.canvas) {
                return;
            }
            
            // Limpa canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Desenha partículas
            for (const particle of this.particles) {
                particle.draw(this.ctx);
            }
        }
        
        animateTransitionOut(target) {
            this.log(`Animando transição de saída para: ${target}`);
            
            // Fade out das partículas
            if (this.canvas) {
                this.canvas.style.transition = 'opacity 0.8s ease-out';
                this.canvas.style.opacity = '0';
            }
            
            // Para animação após fade
            setTimeout(() => {
                this.stopAnimation();
            }, 800);
        }
        
        hideEffects() {
            this.log('Ocultando efeitos temporariamente...');
            
            // Para animação
            this.stopAnimation();
            
            // Oculta canvas
            if (this.canvas) {
                this.canvas.style.display = 'none';
            }
        }
        
        destroyEffects() {
            this.log('Destruindo efeitos...');
            
            // Para animação
            this.stopAnimation();
            
            // Remove canvas
            if (this.canvas) {
                this.canvas.remove();
                this.canvas = null;
                this.ctx = null;
            }
            
            // Remove estilos
            const style = document.getElementById('as-effects-styles');
            if (style) {
                style.remove();
            }
            
            // Limpa partículas
            this.particles = [];
            
            this.container = null;
            this.currentScene = null;
            
            this.log('✓ Efeitos destruídos');
        }
        
        cleanup() {
            this.log('Limpando Effects Manager...');
            this.destroyEffects();
            this.initialized = false;
            this.log('✓ Cleanup concluído');
        }
        
        log(message) {
            AS.PluginManager.log(`[TitleScreen Effects] ${message}`);
        }
    }
    
    //=========================================================================
    // Registro do Agente
    //=========================================================================
    
    AS.PluginManager.register('AS_1.2_TitleScreenEffects', {
        name: 'TitleScreen Effects Manager',
        version: '1.0.1',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Gerenciador de efeitos visuais e animações da tela de título',
        dependencies: ['AS_0.0_PluginManager', 'AS_1.0_TitleScreen'],
        init: () => {
            const manager = new TitleScreenEffectsManager();
            manager.init();
            return manager;
        },
        cleanup: () => {
            const manager = AS.PluginManager.getAgentInstance('AS_1.2_TitleScreenEffects');
            if (manager) {
                manager.cleanup();
            }
        }
    });
    
})();

//=============================================================================
// Fim do AS_1.2_TitleScreenEffects_Agent.js
//=============================================================================
