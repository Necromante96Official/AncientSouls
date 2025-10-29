//=============================================================================
// AS_1.0_TitleScreen.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.1.5 ☆ Redefine a cena de título com estética medieval fantástica
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @orderAfter AS_0.1_LogEnhancer
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Title Screen (Agente Principal)
 * --------------------------------------------------------------------------
 * Responsável por orquestrar a nova cena de título do projeto Ancient Souls.
 * Este agente aplica hooks na Scene_Title, integra o fluxo de comandos com a
 * interface HTML fornecida pelo sub-agente AS_1.1_TitleScreenUI e garante a
 * compatibilidade com Continue, Opções e Sair.
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleScreen = AS.TitleScreen || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.0_TitleScreen';
    const MODULE_VERSION = '1.1.5';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];
    const UI_ROOT_ID = 'as-title-root';
    const REQUIRED_UI_PLUGIN_ID = 'AS_1.1_TitleScreenUI';

    const logger = {
        info(message) {
            console.log(`🏰 [${MODULE_ID}] ${message}`);
        },
        warn(message) {
            console.warn(`⚠️ [${MODULE_ID}] ${message}`);
        },
        error(message) {
            console.error(`❌ [${MODULE_ID}] ${message}`);
        }
    };

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Title Screen',
        dependencies: DEPENDENCIES,
        init: context => {
            const subscriptions = [];

            const handleUiCommand = payload => {
                if (!payload || !payload.command) {
                    return;
                }
                executeCommand(payload.command);
            };

            const handleSceneReady = () => {
                setupTitleScene();
            };

            const handleSceneTerminate = () => {
                restoreTitleScene();
            };

            subscriptions.push(context.subscribe('titlescreen:ui:command', handleUiCommand));
            subscriptions.push(context.subscribe('titlescreen:scene:ready', handleSceneReady));
            subscriptions.push(context.subscribe('titlescreen:scene:terminate', handleSceneTerminate));

            applySceneHooks(context);
            logger.info('Hooks aplicados e aguardando Scene_Title.');

            return {
                dispose() {
                    subscriptions.forEach(unsubscribe => unsubscribe());
                    restoreTitleScene();
                }
            };
        },
        cleanup: () => {
            logger.info('Cleanup concluído - nada adicional a limpar.');
        }
    };

    function applySceneHooks(context) {
        const Scene_Title_create = Scene_Title.prototype.create;
        Scene_Title.prototype.create = function() {
            Scene_Title_create.call(this);
            context.publish('titlescreen:scene:ready', { scene: this });
        };

        const Scene_Title_start = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function() {
            Scene_Title_start.call(this);
            this._asUsingFallback = !shouldUseHtmlUi();

            if (this._asUsingFallback) {
                logger.warn('Interface HTML indisponível. Mantendo comandos padrão.');
                this._commandWindow.activate();
                this._commandWindow.open();
                this._commandWindow.show();
            } else {
                this._commandWindow.deactivate();
                this._commandWindow.close();
                this._commandWindow.hide();
            }

            // Garantir que a UI seja reativada quando a cena iniciar (inclui retorno de outras cenas)
            try {
                context.publish('titlescreen:scene:ready', { scene: this });
            } catch (e) {
                // Não interromper o fluxo da cena
                if (console && console.warn) {
                    console.warn(`[${MODULE_ID}] Falha ao publicar scene:ready no start:`, e);
                }
            }
            
            // Forçar verificação e criação do background se necessário
            if (!this._asBackgroundImage || !this._asBackgroundImage.parent) {
                logger.warn('Background não detectado no start, forçando recriação...');
                this._asDecorReady = false;
                setupTitleScene();
            }
        };

        const Scene_Title_terminate = Scene_Title.prototype.terminate;
        Scene_Title.prototype.terminate = function() {
            context.publish('titlescreen:scene:terminate', { scene: this });
            Scene_Title_terminate.call(this);
        };

        const Scene_Title_createBackground = Scene_Title.prototype.createBackground;
        Scene_Title.prototype.createBackground = function() {
            Scene_Title_createBackground.call(this);
            if (this._backSprite1) {
                this._backSprite1.visible = false;
            }
            if (this._backSprite2) {
                this._backSprite2.visible = false;
            }
        };

        // Hook para restaurar os backgrounds ao retornar das cenas de opções
        const Scene_Title_resume = Scene_Title.prototype.resume;
        Scene_Title.prototype.resume = function() {
            // Restaurar visibilidade dos backgrounds quando retorna
            if (this._backSprite1) {
                this._backSprite1.visible = false;
            }
            if (this._backSprite2) {
                this._backSprite2.visible = false;
            }
            if (Scene_Title_resume) {
                Scene_Title_resume.call(this);
            }
            
            // Forçar recriação do background customizado
            this._asDecorReady = false;
            if (this._asBackgroundImage) {
                this.removeChild(this._asBackgroundImage);
                this._asBackgroundImage.destroy({ children: true, texture: false });
                this._asBackgroundImage = null;
            }
            
            setupTitleScene();
            // Republicar o evento de cena pronta para reativar a UI
            context.publish('titlescreen:scene:ready', { scene: this });
        };
    }

    function setupTitleScene() {
        const scene = SceneManager._scene;
        if (!(scene instanceof Scene_Title)) {
            logger.warn('setupTitleScene chamado fora de Scene_Title');
            return;
        }

        if (scene._asDecorReady) {
            logger.info('Background já está pronto.');
            return;
        }

        if (scene._asUsingFallback) {
            logger.warn('UI não detectada. Cenário visual avançado não será aplicado nesta execução.');
        }

        // Garantir que os sprites padrão estejam ocultos
        if (scene._backSprite1) {
            scene._backSprite1.visible = false;
        }
        if (scene._backSprite2) {
            scene._backSprite2.visible = false;
        }

        // Remover background anterior se existir
        if (scene._asBackgroundImage) {
            scene.removeChild(scene._asBackgroundImage);
            scene._asBackgroundImage.destroy({ children: true, texture: false });
            scene._asBackgroundImage = null;
        }

        // Usar ImageManager padrão do RPG Maker para carregar da pasta img/titles1/
        const backgroundBitmap = ImageManager.loadTitle1('AS_Background');
        
        // Criar sprite com configurações otimizadas
        scene._asBackgroundImage = new Sprite(backgroundBitmap);
        scene._asBackgroundImage.anchor.x = 0.5;
        scene._asBackgroundImage.anchor.y = 0.5;
        scene._asBackgroundImage.x = Graphics.width / 2;
        scene._asBackgroundImage.y = Graphics.height / 2;
        
        // Garantir que o sprite esteja visível e com z-index correto
        scene._asBackgroundImage.visible = true;
        scene._asBackgroundImage.opacity = 255;
        scene._asBackgroundImage.z = -1000; // Garantir que fique atrás de tudo
        
        // Log de debug
        logger.info(`Background criado: ${Graphics.width}x${Graphics.height}, bitmap ready: ${backgroundBitmap.isReady()}`);
        
        // Aplicar ajuste de tamanho
        fitBackground(scene._asBackgroundImage, backgroundBitmap);

        // Adicionar na posição 0 (atrás de tudo) e garantir que está no layer correto
        const targetIndex = 0;
        if (scene.children.length > 0) {
            scene.addChildAt(scene._asBackgroundImage, targetIndex);
        } else {
            scene.addChild(scene._asBackgroundImage);
        }
        
        // Forçar atualização do z-index
        scene.children.sort((a, b) => (a.z || 0) - (b.z || 0));

        scene._asDecorReady = true;
        logger.info(`Background customizado criado com sucesso. Índice: ${scene.getChildIndex(scene._asBackgroundImage)}, Total children: ${scene.children.length}`);
        
        // Tocar música apenas se ainda não estiver tocando
        if (!AudioManager.isCurrentBgm($dataSystem.titleBgm)) {
            AudioManager.playBgm($dataSystem.titleBgm);
        }
    }

    function restoreTitleScene() {
        const scene = SceneManager._scene;
        if (!(scene instanceof Scene_Title)) {
            return;
        }
        if (scene._asBackgroundImage) {
            scene.removeChild(scene._asBackgroundImage);
            scene._asBackgroundImage.destroy({ children: true, texture: false });
            scene._asBackgroundImage = null;
        }
        scene._asDecorReady = false;
        delete scene._asUsingFallback;
    }

    function fitBackground(sprite, bitmap) {
        const applyFit = () => {
            if (!bitmap.width || !bitmap.height) {
                logger.warn(`Bitmap ainda não carregado: ${bitmap.width}x${bitmap.height}`);
                return;
            }
            
            const scaleX = Graphics.width / bitmap.width;
            const scaleY = Graphics.height / bitmap.height;
            const scale = Math.max(scaleX, scaleY);
            
            sprite.scale.set(scale, scale);
            
            logger.info(`Background ajustado: escala=${scale.toFixed(3)}, screen=${Graphics.width}x${Graphics.height}, bitmap=${bitmap.width}x${bitmap.height}`);
        };
        
        if (bitmap.isReady()) {
            applyFit();
        } else {
            logger.info('Aguardando carregamento do bitmap...');
            bitmap.addLoadListener(() => {
                applyFit();
                logger.info('Bitmap carregado e aplicado.');
            });
        }
    }

    function shouldUseHtmlUi() {
        if (!isUiAgentAvailable()) {
            return false;
        }
        if (typeof document === 'undefined') {
            return false;
        }
        const root = document.getElementById(UI_ROOT_ID);
        return !!root;
    }

    function isUiAgentAvailable() {
        try {
            if (!AS || !AS.PluginManager || typeof AS.PluginManager.getManifest !== 'function') {
                return false;
            }
            const manifest = AS.PluginManager.getManifest(REQUIRED_UI_PLUGIN_ID);
            if (!manifest) {
                return false;
            }
            const agent = typeof AS.PluginManager.getAgent === 'function'
                ? AS.PluginManager.getAgent(REQUIRED_UI_PLUGIN_ID)
                : null;
            return manifest !== null && agent !== null;
        } catch (error) {
            logger.warn(`Falha ao verificar disponibilidade da UI: ${error.message}`);
            return false;
        }
    }

    function executeCommand(command) {
        const scene = SceneManager._scene;
        if (!(scene instanceof Scene_Title)) {
            logger.warn(`Comando ${command} ignorado - cena ativa não é título.`);
            return;
        }

        switch (command) {
            case 'newGame':
                SoundManager.playOk();
                scene.commandNewGame();
                break;
            case 'continue':
                SoundManager.playOk();
                if (DataManager.isAnySavefileExists()) {
                    scene.commandContinue();
                } else {
                    SoundManager.playBuzzer();
                }
                break;
            case 'options':
                SoundManager.playOk();
                scene.commandOptions();
                break;
            case 'patchnotes':
                SoundManager.playOk();
                logger.info('Comando patchnotes acionado - publicando evento.');
                if (AS.PluginManager && typeof AS.PluginManager.publish === 'function') {
                    AS.PluginManager.publish('titlescreen:command:patchnotes', { source: 'TitleScreen' });
                }
                break;
            case 'shutdown':
                SoundManager.playOk();
                AudioManager.fadeOutBgm(60);
                AudioManager.fadeOutBgs(60);
                AudioManager.fadeOutMe(60);
                SceneManager.exit();
                break;
            default:
                logger.warn(`Comando desconhecido recebido: ${command}`);
                break;
        }
    }

    if (AS && AS.PluginManager && typeof AS.PluginManager.register === 'function') {
        AS.PluginManager.register(manifest);
    } else {
        logger.error('AS.PluginManager não encontrado. Verifique a carga dos plugins.');
    }
})();

//=============================================================================
// Fim de AS_1.0_TitleScreen.js
//=============================================================================
