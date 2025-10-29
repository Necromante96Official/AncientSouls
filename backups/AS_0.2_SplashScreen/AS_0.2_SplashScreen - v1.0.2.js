//=============================================================================
// AS_0.2_SplashScreen.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.2 ☆ Sistema de Splash Screen antes da tela de título
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @orderAfter AS_0.1_LogEnhancer
 * @orderBefore AS_1.0_TitleScreen
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Splash Screen
 * --------------------------------------------------------------------------
 * Exibe telas de splash com transições suaves antes da tela de título.
 * 
 * IMAGENS NECESSÁRIAS:
 * - js/plugins/assets/resources/rpgmakermz.png  (primeira imagem)
 * - js/plugins/assets/resources/gamedev.png     (segunda imagem)
 * 
 * As imagens serão automaticamente redimensionadas para preencher a tela
 * mantendo a proporção. Transições suaves de fade in/out são aplicadas.
 * 
 * CONTROLES:
 * - Pressione Enter, Espaço ou clique para pular
 * ==========================================================================
 */

var AS = AS || {};
AS.SplashScreen = AS.SplashScreen || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_0.2_SplashScreen';
    const MODULE_VERSION = '1.0.2';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];
    
    // Caminho base para as imagens de splash
    const SPLASH_PATH = 'js/plugins/assets/resources/';

    const logger = {
        info(message) {
            console.log(`🎬 [${MODULE_ID}] ${message}`);
        },
        warn(message) {
            console.warn(`⚠️ [${MODULE_ID}] ${message}`);
        },
        error(message) {
            console.error(`❌ [${MODULE_ID}] ${message}`);
        }
    };

    // Configuração das imagens de splash
    const SPLASH_IMAGES = [
        { name: 'rpgmakermz', fadeIn: 60, display: 120, fadeOut: 60 },
        { name: 'gamedev', fadeIn: 60, display: 120, fadeOut: 60 }
    ];

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Splash Screen',
        dependencies: DEPENDENCIES,
        init: context => {
            logger.info('Inicializando sistema de splash screen...');

            applySceneBootHook();
            registerSplashScene();

            logger.info('Sistema de splash screen pronto.');

            return {
                dispose() {
                    logger.info('Splash screen desativado.');
                }
            };
        },
        cleanup: () => {
            logger.info('Cleanup concluído.');
        }
    };

    /**
     * Hook em Scene_Boot para redirecionar para splash
     */
    function applySceneBootHook() {
        const Scene_Boot_startNormalGame = Scene_Boot.prototype.startNormalGame;
        Scene_Boot.prototype.startNormalGame = function() {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            Window_TitleCommand.initCommandPosition();
            
            // Ir para splash ao invés de Scene_Title
            SceneManager.goto(Scene_SplashScreen);
            logger.info('Redirecionando para splash screen...');
        };
    }

    /**
     * Registra a nova cena de splash
     */
    function registerSplashScene() {
        window.Scene_SplashScreen = Scene_SplashScreen;
        logger.info('Scene_SplashScreen registrada globalmente.');
    }

    //=========================================================================
    // Scene_SplashScreen - Cena de Splash
    //=========================================================================

    function Scene_SplashScreen() {
        this.initialize(...arguments);
    }

    Scene_SplashScreen.prototype = Object.create(Scene_Base.prototype);
    Scene_SplashScreen.prototype.constructor = Scene_SplashScreen;

    Scene_SplashScreen.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this._imageIndex = 0;
        this._phase = 'fadeIn';
        this._phaseFrames = 0;
        this._sprite = null;
        this._backgroundSprite = null;
        
        // Forçar tela cheia ao iniciar
        Graphics._requestFullScreen();
        
        logger.info('Scene_SplashScreen inicializada.');
    };

    Scene_SplashScreen.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createSplashSprite();
    };

    Scene_SplashScreen.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._backgroundSprite.bitmap.fillAll('#000000');
        this.addChild(this._backgroundSprite);
    };

    Scene_SplashScreen.prototype.createSplashSprite = function() {
        this._sprite = new Sprite();
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        this._sprite.x = Graphics.width / 2;
        this._sprite.y = Graphics.height / 2;
        this._sprite.opacity = 0;
        this.addChild(this._sprite);
        
        this.loadCurrentImage();
    };

    Scene_SplashScreen.prototype.loadCurrentImage = function() {
        const config = SPLASH_IMAGES[this._imageIndex];
        if (!config) {
            this.goToTitle();
            return;
        }

        logger.info(`Carregando imagem: ${config.name}`);
        
        // Carregar imagem do caminho customizado
        const imagePath = SPLASH_PATH + config.name + '.png';
        const bitmap = new Bitmap();
        bitmap._url = imagePath;
        bitmap._loadingState = 'loading';
        
        const image = new Image();
        image.onload = () => {
            bitmap._image = image;
            bitmap._loadingState = 'loaded';
            bitmap.resize(image.naturalWidth, image.naturalHeight);
            bitmap._context.drawImage(image, 0, 0);
            bitmap._baseTexture.update();
            this.adjustSpriteScale();
            this.startPhase('fadeIn');
            logger.info(`Imagem ${config.name} carregada e ajustada.`);
        };
        image.onerror = () => {
            logger.error(`Erro ao carregar imagem: ${imagePath}`);
            bitmap._loadingState = 'error';
        };
        image.src = imagePath;
        
        this._sprite.bitmap = bitmap;
    };

    Scene_SplashScreen.prototype.adjustSpriteScale = function() {
        if (!this._sprite.bitmap) return;

        const bitmap = this._sprite.bitmap;
        const scaleX = Graphics.width / bitmap.width;
        const scaleY = Graphics.height / bitmap.height;
        // Usar Math.max para preencher toda a tela, mesmo que corte partes da imagem
        const scale = Math.max(scaleX, scaleY);

        this._sprite.scale.x = scale;
        this._sprite.scale.y = scale;
    };

    Scene_SplashScreen.prototype.startPhase = function(phase) {
        this._phase = phase;
        this._phaseFrames = 0;
        
        const config = SPLASH_IMAGES[this._imageIndex];
        if (!config) return;

        if (phase === 'fadeIn') {
            this._phaseDuration = config.fadeIn;
        } else if (phase === 'display') {
            this._phaseDuration = config.display;
        } else if (phase === 'fadeOut') {
            this._phaseDuration = config.fadeOut;
        }
    };

    Scene_SplashScreen.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        
        if (!this.isBusy()) {
            this.updateInput();
            this.updatePhase();
        }
    };

    Scene_SplashScreen.prototype.updateInput = function() {
        if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered()) {
            logger.info('Splash pulado pelo usuário.');
            this.goToTitle();
        }
    };

    Scene_SplashScreen.prototype.updatePhase = function() {
        if (!this._sprite || !this._sprite.bitmap) return;

        this._phaseFrames++;
        const progress = Math.min(this._phaseFrames / this._phaseDuration, 1);

        switch (this._phase) {
            case 'fadeIn':
                this._sprite.opacity = Math.floor(255 * progress);
                if (progress >= 1) {
                    this.startPhase('display');
                }
                break;

            case 'display':
                if (progress >= 1) {
                    this.startPhase('fadeOut');
                }
                break;

            case 'fadeOut':
                this._sprite.opacity = Math.floor(255 * (1 - progress));
                if (progress >= 1) {
                    this.nextImage();
                }
                break;
        }
    };

    Scene_SplashScreen.prototype.nextImage = function() {
        this._imageIndex++;
        
        if (this._imageIndex >= SPLASH_IMAGES.length) {
            logger.info('Todas as imagens exibidas, indo para tela de título.');
            this.goToTitle();
        } else {
            this._sprite.opacity = 0;
            this.loadCurrentImage();
        }
    };

    Scene_SplashScreen.prototype.goToTitle = function() {
        SceneManager.goto(Scene_Title);
    };

    Scene_SplashScreen.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        logger.info('Scene_SplashScreen terminada.');
    };

    // Registrar plugin no gerenciador
    AS.PluginManager.register(manifest);

})();
