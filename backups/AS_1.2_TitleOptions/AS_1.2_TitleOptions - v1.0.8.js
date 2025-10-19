//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.8 ☆ Ajustes visuais das opções com estética medieval fantástica
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
    const MODULE_VERSION = '1.0.8';
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

    const LAYOUT = {
        minWidth: 440,
        maxWidth: 560,
        horizontalPadding: 48,
        verticalPadding: 36,
        headerHeight: 96,
        extraWindowHeight: 16
    };

    const COLORS = {
        panelGradientStart: 'rgba(84, 66, 116, 0.95)',
        panelGradientEnd: 'rgba(46, 34, 80, 0.98)',
        panelBorder: 'rgba(248, 222, 168, 0.88)',
        panelInnerBorder: 'rgba(248, 222, 168, 0.45)',
        panelFill: 'rgba(64, 48, 90, 0.62)',
        headerHighlightTop: 'rgba(255, 240, 196, 0.32)',
        headerHighlightBottom: 'rgba(48, 36, 74, 0.2)',
        rowBackground: 'rgba(108, 86, 140, 0.78)',
        rowLeftAccent: 'rgba(255, 229, 176, 0.68)',
        rowDivider: 'rgba(255, 229, 176, 0.55)',
        textPrimary: 'rgba(255, 247, 228, 1)',
        textSecondary: 'rgba(255, 236, 210, 0.98)',
        outlinePrimary: 'rgba(30, 20, 44, 0.88)',
        outlineSecondary: 'rgba(36, 24, 48, 0.72)',
        highlightFill: 'rgba(255, 229, 176, 0.4)'
    };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function buildOptionsLayout(scene, rows, windowWidth) {
        const baseHeight = Scene_MenuBase.prototype.calcWindowHeight.call(scene, rows, true);
        const windowHeight = baseHeight + LAYOUT.extraWindowHeight;
        const frameWidth = windowWidth + LAYOUT.horizontalPadding * 2;
        const frameHeight = windowHeight + LAYOUT.verticalPadding * 2 + LAYOUT.headerHeight;
        const frameX = Math.round((Graphics.boxWidth - frameWidth) / 2);
        const frameY = Math.round((Graphics.boxHeight - frameHeight) / 2);
        const windowX = frameX + LAYOUT.horizontalPadding;
        const windowY = frameY + LAYOUT.verticalPadding + LAYOUT.headerHeight;
        const headerWidth = windowWidth;
        const headerHeight = Math.max(64, LAYOUT.headerHeight - 12);
        const headerX = windowX;
        const headerY = frameY + LAYOUT.verticalPadding;
        return {
            windowRect: new Rectangle(windowX, windowY, windowWidth, windowHeight),
            frameRect: new Rectangle(frameX, frameY, frameWidth, frameHeight),
            headerRect: new Rectangle(headerX, headerY, headerWidth, headerHeight)
        };
    }

    function renderOptionsFrame(bitmap, metrics) {
        bitmap.clear();
        const width = bitmap.width;
        const height = bitmap.height;
        const ctx = bitmap.context;

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, COLORS.panelGradientStart);
        gradient.addColorStop(1, COLORS.panelGradientEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = COLORS.panelFill;
        ctx.fillRect(12, 12, width - 24, height - 24);

        ctx.lineWidth = 2;
        ctx.strokeStyle = COLORS.panelBorder;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        ctx.lineWidth = 1;
        ctx.strokeStyle = COLORS.panelInnerBorder;
        ctx.strokeRect(12, 12, width - 24, height - 24);

        const headerOffsetX = metrics.headerRect.x - metrics.frameRect.x;
        const headerOffsetY = metrics.headerRect.y - metrics.frameRect.y;
        const headerWidth = metrics.headerRect.width;
        const headerHeight = metrics.headerRect.height;
        const headerGradient = ctx.createLinearGradient(
            0,
            headerOffsetY,
            0,
            headerOffsetY + headerHeight
        );
        headerGradient.addColorStop(0, COLORS.headerHighlightTop);
        headerGradient.addColorStop(1, COLORS.headerHighlightBottom);
        ctx.fillStyle = headerGradient;
        ctx.fillRect(headerOffsetX, headerOffsetY, headerWidth, headerHeight);

        const contentOffsetX = metrics.windowRect.x - metrics.frameRect.x;
        const contentOffsetY = metrics.windowRect.y - metrics.frameRect.y;
        ctx.strokeStyle = COLORS.rowDivider;
        ctx.strokeRect(
            contentOffsetX,
            contentOffsetY,
            metrics.windowRect.width,
            metrics.windowRect.height
        );

        bitmap.baseTexture.update();
    }

    function renderOptionsHeader(bitmap) {
        bitmap.clear();
        const width = bitmap.width;
        const height = bitmap.height;
        bitmap.gradientFillRect(0, height - 4, width, 4, COLORS.rowDivider, 'rgba(218, 187, 115, 0)');
        bitmap.fontFace = 'Pixel Times';
        bitmap.fontSize = 34;
        bitmap.outlineColor = COLORS.outlinePrimary;
        bitmap.outlineWidth = 4;
        bitmap.textColor = COLORS.textPrimary;
        bitmap.drawText('Configurações', 0, 4, width, 36, 'center');
        bitmap.fontSize = 20;
        bitmap.outlineWidth = 2;
        bitmap.textColor = COLORS.textSecondary;
        bitmap.drawText('Personalize controles, áudio e preferências gerais', 0, 42, width, 26, 'center');
        bitmap.baseTexture.update();
    }

    function cleanupSceneDecor(scene) {
        if (scene._asOptionsHeader) {
            if (scene._windowLayer) {
                scene._windowLayer.removeChild(scene._asOptionsHeader);
            }
            scene._asOptionsHeader.destroy({ children: true, texture: true });
            scene._asOptionsHeader = null;
        }
        if (scene._asOptionsFrame) {
            if (scene._windowLayer) {
                scene._windowLayer.removeChild(scene._asOptionsFrame);
            }
            scene._asOptionsFrame.destroy({ children: true, texture: true });
            scene._asOptionsFrame = null;
        }
        if (scene._asBackdrop) {
            scene.removeChild(scene._asBackdrop);
            scene._asBackdrop.destroy({ children: true, texture: true });
            scene._asBackdrop = null;
        }
        scene._asLayoutMetrics = null;
    }

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
            this._asBackdrop.opacity = 208;
            renderOptionsBackdrop(this._asBackdrop.bitmap);
            this.addChild(this._asBackdrop);
        };

        const Scene_Options_optionsWindowRect = Scene_Options.prototype.optionsWindowRect;
        Scene_Options.prototype.optionsWindowRect = function() {
            try {
                const rows = Math.min(this.maxCommands(), this.maxVisibleCommands());
                const computedWidth = clamp(Math.floor(Graphics.boxWidth * 0.56), LAYOUT.minWidth, LAYOUT.maxWidth);
                const metrics = buildOptionsLayout(this, rows, computedWidth);
                this._asLayoutMetrics = metrics;
                return metrics.windowRect;
            } catch (error) {
                logger.warn('Falha ao aplicar layout personalizado das opções. Revertendo dimensões padrão.');
                this._asLayoutMetrics = null;
                return Scene_Options_optionsWindowRect.call(this);
            }
        };

        const Scene_Options_createOptionsWindow = Scene_Options.prototype.createOptionsWindow;
        Scene_Options.prototype.createOptionsWindow = function() {
            Scene_Options_createOptionsWindow.call(this);
            if (this._optionsWindow && this._asLayoutMetrics && this._windowLayer) {
                const { frameRect, headerRect } = this._asLayoutMetrics;
                this._asOptionsFrame = new Sprite(new Bitmap(frameRect.width, frameRect.height));
                this._asOptionsFrame.x = frameRect.x;
                this._asOptionsFrame.y = frameRect.y;
                renderOptionsFrame(this._asOptionsFrame.bitmap, this._asLayoutMetrics);
                const windowIndex = this._windowLayer.children.indexOf(this._optionsWindow);
                const insertIndex = windowIndex >= 0 ? windowIndex : this._windowLayer.children.length;
                this._windowLayer.addChildAt(this._asOptionsFrame, insertIndex);

                this._asOptionsHeader = new Sprite(new Bitmap(headerRect.width, headerRect.height));
                this._asOptionsHeader.x = headerRect.x;
                this._asOptionsHeader.y = headerRect.y;
                renderOptionsHeader(this._asOptionsHeader.bitmap);
                this._windowLayer.addChild(this._asOptionsHeader);

                if (this._cancelButton) {
                    this._cancelButton.x = frameRect.x + frameRect.width - this._cancelButton.width - 24;
                    this._cancelButton.y = headerRect.y + 8;
                }
                this._asDecorReady = true;
            } else {
                this._asDecorReady = false;
            }
         };
 
        const Scene_Options_terminate = Scene_Options.prototype.terminate;
        Scene_Options.prototype.terminate = function() {
            cleanupSceneDecor(this);
            Scene_Options_terminate.call(this);
        };
     }

     function renderOptionsBackdrop(bitmap) {
         bitmap.clear();
         const width = bitmap.width;
         const height = bitmap.height;
         const ctx = bitmap.context;
 
         const gradient = ctx.createLinearGradient(0, 0, width, height);
         gradient.addColorStop(0, '#322a52');
         gradient.addColorStop(0.65, '#3e3364');
         gradient.addColorStop(1, '#2c2248');
         ctx.fillStyle = gradient;
         ctx.fillRect(0, 0, width, height);
 
         ctx.strokeStyle = 'rgba(248, 222, 168, 0.45)';
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

         Window_Options.prototype.standardPadding = function() {
             return 24;
         };

         Window_Options.prototype.itemPadding = function() {
             return 12;
         };

         Window_Options.prototype.lineHeight = function() {
             return 48;
         };

         Window_Options.prototype.spacing = function() {
             return 12;
         };

         Window_Options.prototype.itemHeight = function() {
             return this.lineHeight();
         };

         Window_Options.prototype.drawItem = function(index) {
             const rect = this.itemLineRect(index);
             const text = this.commandName(index);
             const status = this.statusText(index);
             const labelWidth = Math.floor(rect.width * 0.6);
             const statusWidth = rect.width - labelWidth;

             this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
             this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, COLORS.rowBackground);
             this.contents.fillRect(rect.x, rect.y, 3, rect.height, COLORS.rowLeftAccent);
             this.contents.fillRect(rect.x, rect.y + rect.height - 1, rect.width, 1, COLORS.rowDivider);

             this.resetFontSettings();
             this.contents.fontFace = 'Pixel Times';
             this.contents.fontSize = 28;
             this.changeTextColor(COLORS.textPrimary);
             this.changeOutlineColor(COLORS.outlinePrimary);
             this.drawText(text, rect.x + 26, rect.y + 4, labelWidth, 'left');

             this.contents.fontSize = 24;
             this.changeTextColor(COLORS.textSecondary);
             this.changeOutlineColor(COLORS.outlineSecondary);
             this.drawText(status, rect.x + labelWidth - 8, rect.y + 4, statusWidth + 8, 'right');
         };

         const Window_Options_updateCursor = Window_Options.prototype._updateCursor;
         Window_Options.prototype._updateCursor = function() {
             Window_Options_updateCursor.call(this);
             const highlightColor = COLORS.highlightFill;
             const highlightBlendMode = (typeof PIXI !== 'undefined' && PIXI.BLEND_MODES && typeof PIXI.BLEND_MODES.ADD === 'number') ? PIXI.BLEND_MODES.ADD : 1;
             const insetX = 4;
             const insetY = 2;
             if (!this._asHighlighter) {
                 const baseIndex = this.index() >= 0 ? this.index() : (this.maxItems() > 0 ? 0 : -1);
                 const templateRect = baseIndex >= 0 ? this.itemRect(baseIndex) : null;
                 const initialWidth = (templateRect ? templateRect.width : this.innerWidth) - insetX * 2;
                 const initialHeight = this.itemHeight() - insetY * 2;
                 this._asHighlighter = new Sprite(new Bitmap(Math.max(1, initialWidth), Math.max(1, initialHeight)));
                 this._asHighlighter.bitmap.fillAll(highlightColor);
                 this._asHighlighter.blendMode = highlightBlendMode;
                 this._asHighlighter.visible = false;
                 if (this._clientArea && this._clientArea.children) {
                     const contentsIndex = this._clientArea.children.indexOf(this._contentsSprite);
                     const insertIndex = contentsIndex >= 0 ? contentsIndex : this._clientArea.children.length;
                     this._clientArea.addChildAt(this._asHighlighter, insertIndex);
                 } else {
                     this.addChild(this._asHighlighter);
                 }
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
             const bitmap = this._asHighlighter.bitmap;
             const newWidth = Math.max(1, rect.width - insetX * 2);
             const newHeight = Math.max(1, rect.height - insetY * 2);
             if (bitmap.width !== newWidth || bitmap.height !== newHeight) {
                 bitmap.resize(newWidth, newHeight);
             }
             bitmap.clear();
             bitmap.fillAll(highlightColor);
             this._asHighlighter.visible = true;
             this._asHighlighter.x = rect.x + insetX;
             this._asHighlighter.y = rect.y + insetY;
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
