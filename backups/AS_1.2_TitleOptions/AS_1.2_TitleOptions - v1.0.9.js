//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.9 ☆ Ajustes visuais das opções com estética medieval fantástica
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
    const MODULE_VERSION = '1.0.9';
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
        minWidth: 600,
        maxWidth: 720,
        horizontalPadding: 64,
        verticalPadding: 52,
        headerHeight: 132,
        extraWindowHeight: 36,
        cornerRadius: 28
    };

    const COLORS = {
        panelOuterTop: 'rgba(34, 22, 58, 0.96)',
        panelOuterBottom: 'rgba(16, 8, 30, 0.97)',
        panelStroke: 'rgba(255, 222, 182, 0.9)',
        panelInnerStroke: 'rgba(255, 224, 190, 0.48)',
        panelInnerFillTop: 'rgba(42, 26, 70, 0.98)',
        panelInnerFillBottom: 'rgba(26, 16, 48, 0.95)',
        headerTop: 'rgba(255, 232, 196, 0.95)',
        headerBottom: 'rgba(112, 76, 148, 0.62)',
        headerAccent: 'rgba(255, 214, 164, 0.65)',
        headerShadow: 'rgba(12, 6, 24, 0.55)',
        rowGradientStart: 'rgba(56, 36, 92, 0.96)',
        rowGradientEnd: 'rgba(38, 24, 66, 0.94)',
        rowAccent: 'rgba(255, 214, 156, 0.96)',
        rowDivider: 'rgba(255, 214, 156, 0.4)',
        rowStroke: 'rgba(12, 6, 18, 0.5)',
        textPrimary: '#fdf6e6',
        textSecondary: '#f7e5c8',
        outlinePrimary: 'rgba(18, 8, 32, 0.94)',
        outlineSecondary: 'rgba(12, 6, 26, 0.86)',
        highlightFillTop: 'rgba(255, 224, 178, 0.55)',
        highlightFillBottom: 'rgba(255, 194, 128, 0.28)',
        highlightOutline: 'rgba(255, 236, 205, 0.6)',
        backdropOuter: '#0d0718',
        backdropMid: '#1a1030',
        backdropInner: '#271b44',
        backdropBorder: 'rgba(255, 222, 182, 0.32)'
    };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        const r = Math.max(6, Math.min(radius, Math.min(width, height) / 2));
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

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
        const radius = LAYOUT.cornerRadius;

        ctx.save();
        ctx.shadowColor = 'rgba(8, 4, 16, 0.55)';
        ctx.shadowBlur = 28;
        ctx.shadowOffsetY = 18;
        drawRoundedRect(ctx, 12, 20, width - 24, height - 32, radius + 8);
        ctx.fillStyle = 'rgba(8, 4, 16, 0.35)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        drawRoundedRect(ctx, 0, 0, width, height, radius);
        const outerGradient = ctx.createLinearGradient(0, 0, 0, height);
        outerGradient.addColorStop(0, COLORS.panelOuterTop);
        outerGradient.addColorStop(1, COLORS.panelOuterBottom);
        ctx.fillStyle = outerGradient;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = COLORS.panelStroke;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        drawRoundedRect(ctx, 10, 14, width - 20, height - 28, radius - 6);
        const innerGradient = ctx.createLinearGradient(0, 14, 0, height - 14);
        innerGradient.addColorStop(0, COLORS.panelInnerFillTop);
        innerGradient.addColorStop(1, COLORS.panelInnerFillBottom);
        ctx.fillStyle = innerGradient;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = COLORS.panelInnerStroke;
        ctx.stroke();
        ctx.restore();

        const headerOffsetX = metrics.headerRect.x - metrics.frameRect.x;
        const headerOffsetY = metrics.headerRect.y - metrics.frameRect.y;
        const headerWidth = metrics.headerRect.width;
        const headerHeight = metrics.headerRect.height;
        const headerRadius = Math.max(16, radius - 10);
        ctx.save();
        drawRoundedRect(ctx, headerOffsetX, headerOffsetY, headerWidth, headerHeight, headerRadius);
        const headerGradient = ctx.createLinearGradient(
            0,
            headerOffsetY,
            0,
            headerOffsetY + headerHeight
        );
        headerGradient.addColorStop(0, COLORS.headerTop);
        headerGradient.addColorStop(1, COLORS.headerBottom);
        ctx.fillStyle = headerGradient;
        ctx.fill();
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 1;
        ctx.strokeStyle = COLORS.headerAccent;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = COLORS.headerShadow;
        ctx.lineWidth = 1;
        const headerBottom = headerOffsetY + headerHeight;
        ctx.beginPath();
        ctx.moveTo(headerOffsetX + 18, headerBottom + 0.5);
        ctx.lineTo(headerOffsetX + headerWidth - 18, headerBottom + 0.5);
        ctx.stroke();
        ctx.restore();

        const contentOffsetX = metrics.windowRect.x - metrics.frameRect.x;
        const contentOffsetY = metrics.windowRect.y - metrics.frameRect.y;
        ctx.save();
        drawRoundedRect(
            ctx,
            contentOffsetX,
            contentOffsetY,
            metrics.windowRect.width,
            metrics.windowRect.height,
            Math.max(14, radius - 8)
        );
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = COLORS.rowDivider;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        bitmap.baseTexture.update();
    }

    function renderOptionsHeader(bitmap) {
        bitmap.clear();
        const width = bitmap.width;
        const height = bitmap.height;
        bitmap.gradientFillRect(0, 0, width, height, COLORS.headerTop, COLORS.headerBottom, true);
        bitmap.gradientFillRect(0, height - 5, width, 5, COLORS.headerAccent, 'rgba(255, 214, 164, 0)', true);
        bitmap.fontFace = 'Pixel Times';
        bitmap.fontSize = 36;
        bitmap.outlineColor = COLORS.outlinePrimary;
        bitmap.outlineWidth = 4;
        bitmap.textColor = COLORS.textPrimary;
        bitmap.drawText('Configurações', 0, 6, width, 40, 'center');
        bitmap.fontSize = 20;
        bitmap.outlineWidth = 2;
        bitmap.textColor = COLORS.textSecondary;
        bitmap.drawText('Personalize áudio, controles e preferências gerais', 0, 48, width, 26, 'center');
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
            this._asBackdrop.opacity = 248;
            renderOptionsBackdrop(this._asBackdrop.bitmap);
            this.addChild(this._asBackdrop);
        };

        const Scene_Options_optionsWindowRect = Scene_Options.prototype.optionsWindowRect;
        Scene_Options.prototype.optionsWindowRect = function() {
            try {
                const rows = Math.min(this.maxCommands(), this.maxVisibleCommands());
                const computedWidth = clamp(Math.floor(Graphics.boxWidth * 0.62), LAYOUT.minWidth, LAYOUT.maxWidth);
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
                    this._cancelButton.x = frameRect.x + frameRect.width - this._cancelButton.width - 32;
                    this._cancelButton.y = headerRect.y + 12;
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

        ctx.fillStyle = COLORS.backdropOuter;
        ctx.fillRect(0, 0, width, height);

        const radial = ctx.createRadialGradient(
            width / 2,
            height / 2,
            Math.min(width, height) * 0.12,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.72
        );
        radial.addColorStop(0, COLORS.backdropInner);
        radial.addColorStop(0.55, COLORS.backdropMid);
        radial.addColorStop(1, COLORS.backdropOuter);
        ctx.globalAlpha = 0.96;
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.strokeStyle = COLORS.backdropBorder;
        ctx.strokeRect(24, 24, width - 48, height - 48);
        ctx.lineWidth = 1;
        ctx.strokeRect(36, 36, width - 72, height - 72);
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
            return 28;
        };

        Window_Options.prototype.itemPadding = function() {
            return 14;
        };

        Window_Options.prototype.lineHeight = function() {
            return 52;
        };

        Window_Options.prototype.spacing = function() {
            return 14;
        };

        Window_Options.prototype.itemHeight = function() {
            return this.lineHeight();
        };

        Window_Options.prototype.drawItem = function(index) {
            const rect = this.itemLineRect(index);
            const text = this.commandName(index);
            const status = this.statusText(index);
            const labelWidth = Math.floor(rect.width * 0.58);
            const statusWidth = rect.width - labelWidth;

            this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
            this.contents.gradientFillRect(
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                COLORS.rowGradientStart,
                COLORS.rowGradientEnd,
                true
            );
            this.contents.fillRect(rect.x, rect.y, rect.width, 1, COLORS.rowStroke);
            this.contents.fillRect(rect.x, rect.y + rect.height - 1, rect.width, 1, COLORS.rowDivider);
            this.contents.fillRect(rect.x, rect.y, 4, rect.height, COLORS.rowAccent);

            this.resetFontSettings();
            this.contents.fontFace = 'Pixel Times';
            this.contents.fontSize = 28;
            this.changeTextColor(COLORS.textPrimary);
            this.changeOutlineColor(COLORS.outlinePrimary);
            this.drawText(text, rect.x + 28, rect.y + 6, labelWidth - 12, 'left');

            this.contents.fontSize = 24;
            this.changeTextColor(COLORS.textSecondary);
            this.changeOutlineColor(COLORS.outlineSecondary);
            this.drawText(status, rect.x + labelWidth - 6, rect.y + 6, statusWidth + 6, 'right');
        };

        const Window_Options_updateCursor = Window_Options.prototype._updateCursor;
        Window_Options.prototype._updateCursor = function() {
            Window_Options_updateCursor.call(this);
            const highlightBlendMode = (typeof PIXI !== 'undefined' && PIXI.BLEND_MODES && typeof PIXI.BLEND_MODES.ADD === 'number') ? PIXI.BLEND_MODES.ADD : 1;
            const insetX = 6;
            const insetY = 4;
            if (!this._asHighlighter) {
                const baseIndex = this.index() >= 0 ? this.index() : (this.maxItems() > 0 ? 0 : -1);
                const templateRect = baseIndex >= 0 ? this.itemRect(baseIndex) : null;
                const initialWidth = (templateRect ? templateRect.width : this.innerWidth) - insetX * 2;
                const initialHeight = this.itemHeight() - insetY * 2;
                this._asHighlighter = new Sprite(new Bitmap(Math.max(1, initialWidth), Math.max(1, initialHeight)));
                this._asHighlighter.blendMode = highlightBlendMode;
                this._asHighlighter.alpha = 0.9;
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
            bitmap.gradientFillRect(0, 0, newWidth, newHeight, COLORS.highlightFillTop, COLORS.highlightFillBottom, true);
            bitmap.fillRect(0, 0, newWidth, 1, COLORS.highlightOutline);
            bitmap.fillRect(0, newHeight - 1, newWidth, 1, COLORS.highlightOutline);
            bitmap.fillRect(0, 0, 1, newHeight, COLORS.highlightOutline);
            bitmap.fillRect(newWidth - 1, 0, 1, newHeight, COLORS.highlightOutline);
            if (bitmap.baseTexture && typeof bitmap.baseTexture.update === 'function') {
                bitmap.baseTexture.update();
            }
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
