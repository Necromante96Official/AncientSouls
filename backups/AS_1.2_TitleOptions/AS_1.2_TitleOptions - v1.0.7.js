//=============================================================================
// AS_1.2_TitleOptions.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.7 ☆ Ajustes visuais das opções com estética medieval fantástica
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
    const MODULE_VERSION = '1.0.7';
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
        minWidth: 540,
        maxWidth: 760,
        horizontalPadding: 56,
        verticalPadding: 44,
        headerHeight: 118,
        extraWindowHeight: 28,
        cornerRadius: 26
    };

    const COLORS = {
        backdropTop: '#120a26',
        backdropMiddle: '#1b123a',
        backdropBottom: '#0c0618',
        backdropLine: 'rgba(245, 219, 162, 0.24)',
        frameOuterStart: 'rgba(44, 30, 74, 0.92)',
        frameOuterEnd: 'rgba(25, 16, 46, 0.94)',
        frameStroke: 'rgba(245, 219, 162, 0.75)',
        frameInnerStroke: 'rgba(245, 219, 162, 0.35)',
        frameInnerFillStart: 'rgba(57, 37, 95, 0.95)',
        frameInnerFillEnd: 'rgba(36, 22, 64, 0.92)',
        headerFillTop: 'rgba(255, 240, 210, 0.38)',
        headerFillBottom: 'rgba(42, 26, 70, 0.25)',
        headerDivider: 'rgba(245, 219, 162, 0.5)',
        headerTitle: '#fdf1d1',
        headerSubtitle: 'rgba(247, 230, 194, 0.85)',
        headerOutline: 'rgba(16, 6, 26, 0.95)',
        rowGradientStart: 'rgba(58, 40, 90, 0.75)',
        rowGradientEnd: 'rgba(41, 28, 75, 0.82)',
        rowAccent: 'rgba(245, 219, 162, 0.78)',
        rowDivider: 'rgba(245, 219, 162, 0.32)',
        textPrimary: '#fef4d3',
        textSecondary: 'rgba(228, 214, 255, 0.95)',
        outlinePrimary: 'rgba(20, 8, 32, 0.92)',
        outlineSecondary: 'rgba(24, 12, 36, 0.76)',
        highlightFill: 'rgba(255, 232, 196, 0.36)'
    };

    const EFFECTS = {
        glowPulseSpeed: 0.02,
        glowRotationSpeed: 0.004,
        highlightPulseSpeed: 0.08
    };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
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
        drawRoundedRect(ctx, 0, 0, width, height, radius);
        const outerGradient = ctx.createLinearGradient(0, 0, width, height);
        outerGradient.addColorStop(0, COLORS.frameOuterStart);
        outerGradient.addColorStop(1, COLORS.frameOuterEnd);
        ctx.fillStyle = outerGradient;
        ctx.fill();
        ctx.restore();

        ctx.save();
        drawRoundedRect(ctx, 1.5, 1.5, width - 3, height - 3, radius - 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = COLORS.frameStroke;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        drawRoundedRect(ctx, 10, 12, width - 20, height - 24, radius - 10);
        const innerGradient = ctx.createLinearGradient(0, 0, width, height);
        innerGradient.addColorStop(0, COLORS.frameInnerFillStart);
        innerGradient.addColorStop(1, COLORS.frameInnerFillEnd);
        ctx.fillStyle = innerGradient;
        ctx.fill();
        ctx.strokeStyle = COLORS.frameInnerStroke;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        const headerOffsetX = metrics.headerRect.x - metrics.frameRect.x;
        const headerOffsetY = metrics.headerRect.y - metrics.frameRect.y;
        const headerWidth = metrics.headerRect.width;
        const headerHeight = metrics.headerRect.height;
        ctx.save();
        drawRoundedRect(ctx, headerOffsetX, headerOffsetY, headerWidth, headerHeight, Math.max(14, radius - 12));
        const headerGradient = ctx.createLinearGradient(0, headerOffsetY, 0, headerOffsetY + headerHeight);
        headerGradient.addColorStop(0, COLORS.headerFillTop);
        headerGradient.addColorStop(1, COLORS.headerFillBottom);
        ctx.fillStyle = headerGradient;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = COLORS.headerDivider;
        ctx.lineWidth = 1;
        const headerBottom = headerOffsetY + headerHeight;
        ctx.beginPath();
        ctx.moveTo(headerOffsetX + 18, headerBottom);
        ctx.lineTo(headerOffsetX + headerWidth - 18, headerBottom);
        ctx.stroke();
        ctx.restore();

        const contentOffsetX = metrics.windowRect.x - metrics.frameRect.x;
        const contentOffsetY = metrics.windowRect.y - metrics.frameRect.y;
        ctx.save();
        drawRoundedRect(ctx, contentOffsetX, contentOffsetY, metrics.windowRect.width, metrics.windowRect.height, Math.max(10, radius - 14));
        ctx.strokeStyle = COLORS.rowDivider;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        bitmap.baseTexture.update();
    }

    function renderOptionsHeader(bitmap) {
        bitmap.clear();
        const width = bitmap.width;
        const height = bitmap.height;
        bitmap.gradientFillRect(0, height - 5, width, 5, COLORS.rowDivider, 'rgba(255, 255, 255, 0)');
        bitmap.fontFace = 'Pixel Times';
        bitmap.fontSize = 38;
        bitmap.outlineColor = COLORS.headerOutline;
        bitmap.outlineWidth = 5;
        bitmap.textColor = COLORS.headerTitle;
        bitmap.drawText('Configurações', 0, 6, width, 40, 'center');
        bitmap.fontSize = 22;
        bitmap.outlineWidth = 3;
        bitmap.textColor = COLORS.headerSubtitle;
        bitmap.drawText('Personalize controles, áudio e preferências gerais', 0, 48, width, 28, 'center');
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
            if (scene._asNoiseFilter) {
                scene._asBackdrop.filters = [];
            }
            scene.removeChild(scene._asBackdrop);
            scene._asBackdrop.destroy({ children: true, texture: true });
            scene._asBackdrop = null;
        }
        if (scene._asGlowSprite) {
            scene.removeChild(scene._asGlowSprite);
            scene._asGlowSprite.destroy({ children: true, texture: true });
            scene._asGlowSprite = null;
        }
        scene._asNoiseFilter = null;
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
            renderOptionsBackdrop(this._asBackdrop.bitmap);
            this.addChild(this._asBackdrop);
            this._asGlowSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
            renderOptionsGlow(this._asGlowSprite.bitmap);
            this._asGlowSprite.anchor.x = 0.5;
            this._asGlowSprite.anchor.y = 0.5;
            this._asGlowSprite.x = Graphics.width / 2;
            this._asGlowSprite.y = Graphics.height / 2;
            this._asGlowSprite.alpha = 0.32;
            if (typeof PIXI !== 'undefined' && PIXI.BLEND_MODES && typeof PIXI.BLEND_MODES.ADD === 'number') {
                this._asGlowSprite.blendMode = PIXI.BLEND_MODES.ADD;
            }
            this.addChild(this._asGlowSprite);

            if (typeof PIXI !== 'undefined' && PIXI.filters && PIXI.filters.NoiseFilter) {
                this._asNoiseFilter = new PIXI.filters.NoiseFilter(0.08);
                this._asNoiseFilter.seed = Math.random();
                this._asBackdrop.filters = [this._asNoiseFilter];
            } else {
                this._asNoiseFilter = null;
            }
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
                    this._cancelButton.x = frameRect.x + frameRect.width - this._cancelButton.width - 24;
                    this._cancelButton.y = headerRect.y + 8;
                }
                this._asDecorReady = true;
            } else {
                this._asDecorReady = false;
            }
        };

        const Scene_Options_update = Scene_Options.prototype.update;
        Scene_Options.prototype.update = function() {
            Scene_Options_update.call(this);
            animateSceneDecor(this);
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

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, COLORS.backdropTop);
        gradient.addColorStop(0.5, COLORS.backdropMiddle);
        gradient.addColorStop(1, COLORS.backdropBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = COLORS.backdropLine;
        ctx.lineWidth = 1;
        const spacing = 72;
        for (let i = -height; i < width + height; i += spacing) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + height, height);
            ctx.stroke();
        }
        ctx.restore();

        ctx.strokeStyle = COLORS.backdropLine;
        ctx.lineWidth = 2;
        ctx.strokeRect(24, 24, width - 48, height - 48);
        bitmap.baseTexture.update();
    }

    function renderOptionsGlow(bitmap) {
        bitmap.clear();
        const width = bitmap.width;
        const height = bitmap.height;
        const ctx = bitmap.context;
        const radius = Math.max(width, height);
        const gradient = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            radius / 1.2
        );
        gradient.addColorStop(0, 'rgba(255, 236, 189, 0.55)');
        gradient.addColorStop(0.25, 'rgba(204, 160, 255, 0.35)');
        gradient.addColorStop(0.6, 'rgba(120, 80, 168, 0.12)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        bitmap.baseTexture.update();
    }

    function animateSceneDecor(scene) {
        if (!scene || !scene._asDecorReady) {
            return;
        }
        const frameCount = Graphics.frameCount || 0;
        if (scene._asGlowSprite) {
            scene._asGlowSprite.alpha = 0.28 + 0.08 * Math.sin(frameCount * EFFECTS.glowPulseSpeed);
            scene._asGlowSprite.rotation = 0.02 * Math.sin(frameCount * EFFECTS.glowRotationSpeed);
        }
        if (scene._asOptionsFrame) {
            scene._asOptionsFrame.alpha = 0.94 + 0.04 * Math.sin(frameCount * EFFECTS.glowPulseSpeed * 1.3);
        }
        if (scene._asNoiseFilter) {
            scene._asNoiseFilter.seed = (frameCount % 120) / 120;
        }
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
