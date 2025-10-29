//=============================================================================
// AS_1.5_SplashScreen.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.1 🎬 Tela de Splash com transições suaves e animações
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Splash Screen
 * --------------------------------------------------------------------------
 * Exibe uma tela de splash animada antes da tela de título com:
 * - Transição suave entre duas imagens
 * - Animações delicadas (fade, zoom, glow)
 * - Dimensões responsivas
 * - Configurações totalmente customizáveis
 * 
 * RECURSOS:
 * ✨ Transição suave entre imagens (fade)
 * ✨ Animações de entrada e saída
 * ✨ Efeito de glow/brilho nas imagens
 * ✨ Duração configurável para cada imagem
 * ✨ Suporte a som ao iniciar
 * ==========================================================================
 *
 * @param enableSplashScreen
 * @text Ativar Splash Screen
 * @desc Ativa ou desativa a exibição da tela de splash
 * @type boolean
 * @default true
 *
 * @param image1Path
 * @text Caminho da Primeira Imagem
 * @desc Caminho relativo da primeira imagem (ex: img/rpgmakermz.png)
 * @type string
 * @default assets/resources/rpgmakermz.png
 *
 * @param image2Path
 * @text Caminho da Segunda Imagem
 * @desc Caminho relativo da segunda imagem (ex: img/gamedev.png)
 * @type string
 * @default assets/resources/gamedev.png
 *
 * @param image1Duration
 * @text Duração 1ª Imagem (ms)
 * @desc Tempo que a primeira imagem fica na tela em milissegundos
 * @type number
 * @min 1000
 * @max 10000
 * @default 3000
 *
 * @param image2Duration
 * @text Duração 2ª Imagem (ms)
 * @desc Tempo que a segunda imagem fica na tela em milissegundos
 * @type number
 * @min 1000
 * @max 10000
 * @default 3000
 *
 * @param transitionDuration
 * @text Duração da Transição (ms)
 * @desc Tempo da transição entre imagens em milissegundos
 * @type number
 * @min 500
 * @max 5000
 * @default 1500
 *
 * @param enableGlowEffect
 * @text Ativar Efeito Glow
 * @desc Ativa o efeito de brilho nas imagens
 * @type boolean
 * @default true
 *
 * @param glowIntensity
 * @text Intensidade do Glow
 * @desc Intensidade do efeito de brilho (0-100%)
 * @type number
 * @min 0
 * @max 100
 * @default 30
 *
 * @param enableSound
 * @text Ativar Som
 * @desc Toca um som ao exibir a splash screen
 * @type boolean
 * @default true
 *
 * @param soundFile
 * @text Arquivo de Som
 * @desc Nome do arquivo de som (sem extensão, em SE)
 * @type string
 * @default
 *
 * @param soundVolume
 * @text Volume do Som
 * @desc Volume do som em porcentagem
 * @type number
 * @min 0
 * @max 100
 * @default 80
 *
 * @param enableZoomAnimation
 * @text Ativar Animação de Zoom
 * @desc Adiciona um leve efeito de zoom nas imagens
 * @type boolean
 * @default true
 *
 * @param zoomIntensity
 * @text Intensidade do Zoom
 * @desc Intensidade do zoom em porcentagem (ex: 5 = 1.05x scale)
 * @type number
 * @min 0
 * @max 20
 * @default 5
 *
 * @param enableAutoSkip
 * @text Pular ao Clicar/Pressionar Tecla
 * @desc Permite pular a splash screen ao clicar ou pressionar tecla
 * @type boolean
 * @default true
 */

var AS = AS || {};
AS.SplashScreen = AS.SplashScreen || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.5_SplashScreen';
    const MODULE_VERSION = '1.0.1';

    // Carregar parâmetros
    const pluginName = 'AS_1.5_SplashScreen';
    const params = PluginManager.parameters(pluginName);

    const ENABLED = String(params['enableSplashScreen'] || 'true').toLowerCase() === 'true';
    const IMAGE_1_PATH = String(params['image1Path'] || 'assets/resources/rpgmakermz.png');
    const IMAGE_2_PATH = String(params['image2Path'] || 'assets/resources/gamedev.png');
    const IMAGE_1_DURATION = Number(params['image1Duration'] || 3000);
    const IMAGE_2_DURATION = Number(params['image2Duration'] || 3000);
    const TRANSITION_DURATION = Number(params['transitionDuration'] || 1500);
    const ENABLE_GLOW = String(params['enableGlowEffect'] || 'true').toLowerCase() === 'true';
    const GLOW_INTENSITY = Number(params['glowIntensity'] || 30);
    const ENABLE_SOUND = String(params['enableSound'] || 'true').toLowerCase() === 'true';
    const SOUND_FILE = String(params['soundFile'] || '');
    const SOUND_VOLUME = Number(params['soundVolume'] || 80);
    const ENABLE_ZOOM = String(params['enableZoomAnimation'] || 'true').toLowerCase() === 'true';
    const ZOOM_INTENSITY = Number(params['zoomIntensity'] || 5);
    const ENABLE_AUTO_SKIP = String(params['enableAutoSkip'] || 'true').toLowerCase() === 'true';

    let splashShown = false;
    let splashContainer = null;
    let skipRequested = false;

    // Função para resolver o caminho correto da imagem
    function resolveImagePath(imagePath) {
        if (!imagePath) return '';
        
        // Se já é uma URL absoluta, retornar como está
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
            return imagePath;
        }
        
        // Tentar múltiplos caminhos possíveis
        const basePath = window.location.pathname;
        const baseDir = basePath.substring(0, basePath.lastIndexOf('/'));
        
        // Caminho relativo ao index.html (raiz do projeto)
        if (!imagePath.startsWith('/')) {
            return baseDir + '/' + imagePath;
        }
        
        return imagePath;
    }

    // Referência para Scene_Boot original
    const _Scene_Boot_start = Scene_Boot.prototype.start;

    // Substituir Scene_Boot.start para mostrar splash antes de continuar
    Scene_Boot.prototype.start = function() {
        if (ENABLED && !splashShown) {
            splashShown = true;
            return this.showSplashScreen();
        }
        _Scene_Boot_start.call(this);
    };

    Scene_Boot.prototype.showSplashScreen = function() {
        // Criar container da splash screen
        splashContainer = document.createElement('div');
        splashContainer.id = 'as-splash-screen';
        splashContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(10, 5, 20, 0.95) 0%, rgba(20, 10, 40, 0.95) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease-out;
            pointer-events: auto;
        `;

        // Criar imagem
        const splashImage = document.createElement('img');
        splashImage.id = 'as-splash-image';
        splashImage.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            width: auto;
            height: auto;
            object-fit: contain;
            opacity: 0;
            transform: scale(${1 - ZOOM_INTENSITY / 100});
            transition: opacity ${TRANSITION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                        transform ${TRANSITION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        filter 1s ease-out;
            filter: drop-shadow(0 0 ${GLOW_INTENSITY}px rgba(139, 92, 246, 0)) blur(2px);
            pointer-events: none;
            image-rendering: high-quality;
            image-rendering: crisp-edges;
        `;

        // Aplicar efeito glow se habilitado
        if (ENABLE_GLOW) {
            splashImage.style.filter = `drop-shadow(0 0 ${GLOW_INTENSITY}px rgba(139, 92, 246, 0.3)) blur(1px)`;
        }

        splashContainer.appendChild(splashImage);
        document.body.appendChild(splashContainer);

        // Adicionar evento de skip
        if (ENABLE_AUTO_SKIP) {
            const handleSkip = () => {
                skipRequested = true;
                removeEventListeners();
            };

            document.addEventListener('click', handleSkip, { once: true });
            document.addEventListener('keydown', handleSkip, { once: true });
            document.addEventListener('touchstart', handleSkip, { once: true });
        }

        // Reproduzir som se configurado
        if (ENABLE_SOUND && SOUND_FILE) {
            try {
                const se = {
                    name: SOUND_FILE,
                    volume: SOUND_VOLUME,
                    pitch: 100,
                    pan: 0
                };
                AudioManager.playSe(se);
            } catch (err) {
                console.warn(`[${MODULE_ID}] Erro ao reproduzir som:`, err);
            }
        }

        // Forçar reflow para iniciar animação
        splashImage.offsetHeight;

        // Carregar primeira imagem
        splashImage.src = resolveImagePath(IMAGE_1_PATH);
        splashImage.onload = () => {
            // Animar entrada
            requestAnimationFrame(() => {
                splashImage.style.opacity = '1';
                splashImage.style.transform = `scale(1)`;
                if (ENABLE_GLOW) {
                    splashImage.style.filter = `drop-shadow(0 0 ${GLOW_INTENSITY}px rgba(139, 92, 246, 0.8)) blur(1px)`;
                }
            });

            // Aguardar duração e fazer transição
            setTimeout(() => {
                if (skipRequested) {
                    finalizeSplash();
                    return;
                }

                // Fade out da primeira imagem
                splashImage.style.opacity = '0';
                splashImage.style.filter = `drop-shadow(0 0 ${GLOW_INTENSITY}px rgba(139, 92, 246, 0)) blur(5px)`;

                // Carregar segunda imagem
                setTimeout(() => {
                    splashImage.src = resolveImagePath(IMAGE_2_PATH);
                    splashImage.onload = () => {
                        // Reset opacity para animação
                        splashImage.style.opacity = '0';
                        splashImage.style.transform = `scale(${1 - ZOOM_INTENSITY / 100})`;

                        // Forçar reflow
                        splashImage.offsetHeight;

                        // Animar entrada segunda imagem
                        requestAnimationFrame(() => {
                            splashImage.style.opacity = '1';
                            splashImage.style.transform = 'scale(1)';
                            if (ENABLE_GLOW) {
                                splashImage.style.filter = `drop-shadow(0 0 ${GLOW_INTENSITY}px rgba(139, 92, 246, 0.8)) blur(1px)`;
                            }
                        });

                        // Aguardar duração segunda imagem
                        setTimeout(() => {
                            if (skipRequested) {
                                finalizeSplash();
                                return;
                            }

                            // Fade out
                            splashImage.style.opacity = '0';
                            splashImage.style.filter = `drop-shadow(0 0 ${GLOW_INTENSITY}px rgba(139, 92, 246, 0)) blur(5px)`;

                            // Finalizar splash
                            setTimeout(finalizeSplash, TRANSITION_DURATION);
                        }, IMAGE_2_DURATION);
                    };
                }, TRANSITION_DURATION);
            }, IMAGE_1_DURATION);
        };

        splashImage.onerror = () => {
            console.error(`[${MODULE_ID}] Erro ao carregar imagem: ${splashImage.src}`);
            finalizeSplash();
        };
    };

    function finalizeSplash() {
        if (!splashContainer) return;

        const container = splashContainer;
        container.style.opacity = '0';
        container.style.transition = 'opacity 1s ease-out';

        setTimeout(() => {
            if (container.parentElement) {
                container.parentElement.removeChild(container);
            }
            splashContainer = null;
            removeEventListeners();

            // Chamar Scene_Boot.start original
            Scene_Boot.prototype.start = _Scene_Boot_start;
            SceneManager._scene.start();
        }, 1000);
    }

    function removeEventListeners() {
        if (splashContainer) {
            document.removeEventListener('click', arguments.callee);
            document.removeEventListener('keydown', arguments.callee);
            document.removeEventListener('touchstart', arguments.callee);
        }
    }

})();
