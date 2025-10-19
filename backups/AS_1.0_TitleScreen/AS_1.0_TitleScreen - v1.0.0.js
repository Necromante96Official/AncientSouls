//=============================================================================
// AS_1.0_TitleScreen.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.0 ☆ Redefine a cena de título com estética medieval fantástica
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
    const MODULE_VERSION = '1.0.0';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

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
            this._commandWindow.deactivate();
            this._commandWindow.close();
            this._commandWindow.hide();
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

        scene._backSprite1 = scene._backSprite1 || new Sprite();
        scene._backSprite2 = scene._backSprite2 || new Sprite();

        const color = new PIXI.Graphics();
        color.beginFill(0x0f101c);
        color.drawRect(0, 0, Graphics.width, Graphics.height);
        color.endFill();

        scene._backgroundFilter = new PIXI.filters.BlurFilter(2);
        color.filters = [scene._backgroundFilter];

        scene._asColorOverlay = color;
        scene._backgroundSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        scene.addChild(color);
        scene.addChild(scene._backgroundSprite);
        renderGradient(scene._backgroundSprite.bitmap);

        scene._foregroundOverlay = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        scene.addChild(scene._foregroundOverlay);
        renderForegroundDecor(scene._foregroundOverlay.bitmap);

        scene._asDecorReady = true;
        AudioManager.playBgm($dataSystem.titleBgm);
    }

    function restoreTitleScene() {
        const scene = SceneManager._scene;
        if (!(scene instanceof Scene_Title)) {
            return;
        }
        if (scene._foregroundOverlay) {
            scene.removeChild(scene._foregroundOverlay);
            scene._foregroundOverlay = null;
        }
        if (scene._backgroundSprite) {
            scene.removeChild(scene._backgroundSprite);
            scene._backgroundSprite = null;
        }
        if (scene._asColorOverlay) {
            scene.removeChild(scene._asColorOverlay);
            scene._asColorOverlay = null;
        }
        scene._asDecorReady = false;
    }

    function renderGradient(bitmap) {
        bitmap.clear();
        const width = bitmap.width;
        const height = bitmap.height;
        const gradientColors = [
            { stop: 0, color: '#1a1b2e' },
            { stop: 0.35, color: '#2e2a44' },
            { stop: 0.7, color: '#3b2947' },
            { stop: 1, color: '#2a1e36' }
        ];

        const ctx = bitmap.context;
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradientColors.forEach(stop => gradient.addColorStop(stop.stop, stop.color));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        bitmap._setDirty();
    }

    function renderForegroundDecor(bitmap) {
        const ctx = bitmap.context;
        ctx.clearRect(0, 0, bitmap.width, bitmap.height);

        ctx.strokeStyle = 'rgba(219, 191, 115, 0.35)';
        ctx.lineWidth = 2;
        const margin = 28;
        const offset = 14;

        ctx.strokeRect(margin, margin, bitmap.width - margin * 2, bitmap.height - margin * 2);
        ctx.strokeRect(margin + offset, margin + offset, bitmap.width - (margin + offset) * 2, bitmap.height - (margin + offset) * 2);
        bitmap._setDirty();
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
                scene.commandExit();
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
