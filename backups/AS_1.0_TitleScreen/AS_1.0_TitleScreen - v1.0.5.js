//=============================================================================
// AS_1.0_TitleScreen.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.5 ☆ Redefine a cena de título com estética medieval fantástica
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
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
    const MODULE_VERSION = '1.0.5';
    const DEPENDENCIES = ['AS_0.0_PluginManager', 'AS_1.1_TitleScreenUI'];
    const BACKGROUND_FOLDER = 'js/plugins/assets/resources/';
    const BACKGROUND_FILENAME = 'background';
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
    }

    function setupTitleScene() {
        const scene = SceneManager._scene;
        if (!(scene instanceof Scene_Title)) {
            return;
        }

        if (scene._asDecorReady) {
            AudioManager.playBgm($dataSystem.titleBgm);
            return;
        }

        if (scene._asUsingFallback) {
            logger.warn('UI não detectada. Cenário visual avançado não será aplicado nesta execução.');
        }

        scene._backSprite1 = scene._backSprite1 || new Sprite();
        scene._backSprite2 = scene._backSprite2 || new Sprite();

        const backgroundBitmap = ImageManager.loadBitmap(BACKGROUND_FOLDER, BACKGROUND_FILENAME);
        scene._asBackgroundImage = new Sprite(backgroundBitmap);
        scene._asBackgroundImage.anchor.x = 0.5;
        scene._asBackgroundImage.anchor.y = 0.5;
        scene._asBackgroundImage.x = Graphics.width / 2;
        scene._asBackgroundImage.y = Graphics.height / 2;
        fitBackground(scene._asBackgroundImage, backgroundBitmap);

        scene.addChild(scene._asBackgroundImage);

        scene._asDecorReady = true;
        AudioManager.playBgm($dataSystem.titleBgm);
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
                return;
            }
            const scaleX = Graphics.width / bitmap.width;
            const scaleY = Graphics.height / bitmap.height;
            const scale = Math.max(scaleX, scaleY);
            sprite.scale.set(scale, scale);
        };
        if (bitmap.isReady()) {
            applyFit();
        } else {
            bitmap.addLoadListener(applyFit);
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
