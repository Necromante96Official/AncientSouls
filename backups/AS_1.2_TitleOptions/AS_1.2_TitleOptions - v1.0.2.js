//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.2 ☆ Ajustes visuais das opções com estética medieval fantástica
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_1.1_TitleScreenUI
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Title Options (Sub-agente)
 * --------------------------------------------------------------------------
 * Reconfigura a Scene_Options para combinar com a identidade visual criada
 * para a tela de título, incluindo novo fundo, destaque de seleção e fonte.
 * ==========================================================================
 */

var AS = AS || {};
AS.TitleOptions = AS.TitleOptions || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.2_TitleOptions';
    const MODULE_VERSION = '1.0.2';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    const logger = {
        info(message) {
            console.log(`🛡️ [${MODULE_ID}] ${message}`);
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
        name: 'Ancient Souls - Options Styling',
        dependencies: DEPENDENCIES,
        init: () => {
            applyFontOverride();
            applySceneHooks();
            applyWindowHooks();
            logger.info('Hooks aplicados à Scene_Options e Window_Options.');
            return {};
        },
        cleanup: () => {
            logger.info('Nenhum recurso dinâmico para liberar.');
        }
    };

    function applyFontOverride() {
        const baseFontFace = Window_Base.prototype.standardFontFace;
        Window_Base.prototype.standardFontFace = function() {
            const fallback = baseFontFace ? baseFontFace.call(this) : 'GameFont';
            return fallback && fallback.includes('Pixel Times') ? fallback : 'Pixel Times';
        };
        if (window.FontManager && typeof FontManager.load === 'function') {
            FontManager.load('Pixel Times', 'pixel-times.ttf');
        }
    }

    function applySceneHooks() {
        const Scene_Options_createBackground = Scene_Options.prototype.createBackground;
        Scene_Options.prototype.createBackground = function() {
            Scene_Options_createBackground.call(this);
            this._asBackdrop = new Sprite(new Bitmap(Graphics.width, Graphics.height));
            this._asBackdrop.opacity = 220;
            renderOptionsBackdrop(this._asBackdrop.bitmap);
            this.addChild(this._asBackdrop);
        };

        const Scene_Options_terminate = Scene_Options.prototype.terminate;
        Scene_Options.prototype.terminate = function() {
            if (this._asBackdrop) {
                this.removeChild(this._asBackdrop);
                this._asBackdrop.destroy();
                this._asBackdrop = null;
            }
            Scene_Options_terminate.call(this);
        };
    }

    function renderOptionsBackdrop(bitmap) {
        bitmap.clear();
        const width = bitmap.width;
        const height = bitmap.height;
        const ctx = bitmap.context;

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1b2e');
        gradient.addColorStop(0.65, '#222038');
        gradient.addColorStop(1, '#1a1428');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(218, 187, 115, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(24, 24, width - 48, height - 48);
        bitmap.baseTexture.update();
    }

    function applyWindowHooks() {
        const Window_Options_initialize = Window_Options.prototype.initialize;
        Window_Options.prototype.initialize = function(rect) {
            Window_Options_initialize.call(this, rect);
            this.opacity = 0;
            this.backgroundOpacity = 0;
        };

        Window_Options.prototype.itemHeight = function() {
            return 48;
        };

        const Window_Options_drawItem = Window_Options.prototype.drawItem;
        Window_Options.prototype.drawItem = function(index) {
            const rect = this.itemLineRect(index);
            const text = this.commandName(index);
            const status = this.statusText(index);

            this.changeTextColor('rgba(218, 187, 115, 0.85)');
            this.changeOutlineColor('rgba(12, 8, 20, 0.9)');
            this.drawText(text, rect.x, rect.y, rect.width * 0.5);

            this.changeTextColor('rgba(255, 255, 255, 0.75)');
            this.drawText(status, rect.x, rect.y, rect.width, 'right');
        };

        const Window_Options_updateCursor = Window_Options.prototype._updateCursor;
        Window_Options.prototype._updateCursor = function() {
            Window_Options_updateCursor.call(this);
            if (!this._asHighlighter) {
                const baseIndex = this.index() >= 0 ? this.index() : (this.maxItems() > 0 ? 0 : -1);
                const templateRect = baseIndex >= 0 ? this.itemRect(baseIndex) : null;
                const initialWidth = templateRect ? templateRect.width : this.innerWidth;
                this._asHighlighter = new Sprite(new Bitmap(Math.max(1, initialWidth), this.itemHeight()));
                this._asHighlighter.bitmap.fillAll('rgba(218, 187, 115, 0.18)');
                this._asHighlighter.blendMode = Graphics.BLEND_ADD;
                this._windowContentsSprite.addChildAt(this._asHighlighter, 0);
            }
            if (this._cursorAll) {
                this._asHighlighter.visible = false;
                return;
            }
            const index = this.index();
            if (index < 0) {
                this._asHighlighter.visible = false;
                return;
            }
            const rect = this.itemRect(index);
            if (this._asHighlighter.bitmap.width !== rect.width || this._asHighlighter.bitmap.height !== rect.height) {
                this._asHighlighter.bitmap = new Bitmap(rect.width, rect.height);
                this._asHighlighter.bitmap.fillAll('rgba(218, 187, 115, 0.18)');
            }
            this._asHighlighter.visible = true;
            this._asHighlighter.x = rect.x;
            this._asHighlighter.y = rect.y;
        };
    }

    if (AS && AS.PluginManager && typeof AS.PluginManager.register === 'function') {
        AS.PluginManager.register(manifest);
    } else {
        logger.error('AS.PluginManager não encontrado. Verifique a ordem de carregamento.');
    }
})();

//=============================================================================
// Fim de AS_1.2_TitleOptions.js
//=============================================================================
