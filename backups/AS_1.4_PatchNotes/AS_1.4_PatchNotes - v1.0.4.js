//=============================================================================
// AS_1.4_PatchNotes.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.4 ☆ Sistema de notas de atualização com interface medieval fantástica
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @orderAfter AS_1.1_TitleScreenUI
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Patch Notes (Sub-agente)
 * --------------------------------------------------------------------------
 * Sistema completo para exibir notas de atualização do jogo com interface
 * HTML moderna e tema medieval fantástico.
 * ==========================================================================
 * 
 * CARACTERÍSTICAS:
 * - Botão "Atualizações" na tela de título
 * - Interface HTML com design medieval
 * - Lista de atualizações organizada por versão
 * - Scroll suave e animações
 * - Suporte a markdown básico
 * - Sistema de categorias (Novo, Correção, Melhoria, etc.)
 * 
 * ==========================================================================
 */

var AS = AS || {};
AS.PatchNotes = AS.PatchNotes || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.4_PatchNotes';
    const MODULE_VERSION = '1.0.4';
    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    const logger = {
        info(message) {
            console.log(`📋 [${MODULE_ID}] ${message}`);
        },
        warn(message) {
            console.warn(`⚠️ [${MODULE_ID}] ${message}`);
        },
        error(message) {
            console.error(`❌ [${MODULE_ID}] ${message}`);
        }
    };

    const PATHS = {
        css: 'js/plugins/assets/contents/css/AS_1.4_PatchNotes.css',
        html: 'js/plugins/assets/contents/html/AS_1.4_PatchNotes.html'
    };

    let rootElement = null;
    let buttonElement = null;
    let detachKeyHandler = null;
    let contextRef = null;

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Patch Notes',
        dependencies: DEPENDENCIES,
        init: context => {
            contextRef = context;
            
            // Injetar markup quando a tela de título estiver pronta
            const sceneReadySubscription = context.subscribe('titlescreen:scene:ready', () => {
                injectMarkup();
                bindButton();
                showButton();
            });
            
            // Esconder botão quando sair da tela de título
            const sceneTerminateSubscription = context.subscribe('titlescreen:scene:terminate', () => {
                hideButton();
            });
            
            logger.info('Sistema de Patch Notes inicializado.');
            
            return {
                dispose() {
                    sceneReadySubscription();
                    sceneTerminateSubscription();
                    unbindButton();
                }
            };
        },
        cleanup: () => {
            destroyMarkup();
            logger.info('Interface de Patch Notes removida.');
        }
    };

    function bindButton() {
        if (!buttonElement) {
            logger.warn('Botão de Patch Notes não encontrado.');
            return;
        }

        buttonElement.addEventListener('click', onButtonClick);
        buttonElement.addEventListener('mouseenter', onButtonHover);
        logger.info('Eventos vinculados ao botão de Patch Notes.');
    }

    function unbindButton() {
        if (!buttonElement) return;
        
        buttonElement.removeEventListener('click', onButtonClick);
        buttonElement.removeEventListener('mouseenter', onButtonHover);
        buttonElement = null;
    }

    function onButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playOk();
        }
        
        openPatchNotes();
    }

    function onButtonHover() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playCursor();
        }
    }

    function showButton() {
        if (buttonElement) {
            buttonElement.style.display = '';
            buttonElement.classList.add('as-title--visible');
        }
    }

    function hideButton() {
        if (buttonElement) {
            buttonElement.classList.remove('as-title--visible');
            setTimeout(() => {
                if (buttonElement) buttonElement.style.display = 'none';
            }, 300);
        }
    }

    function openPatchNotes() {
        injectStyles();
        loadPatchNotes();
        showPatchNotes();
        attachKeyboardSupport();
    }

    function closePatchNotes() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playCancel();
        }
        
        hidePatchNotes();
        
        setTimeout(() => {
            destroyMarkup();
        }, 300);
    }

    function injectStyles() {
        if (document.getElementById(`${MODULE_ID}-style`)) {
            return;
        }
        
        let css = loadAsset(PATHS.css);
        
        // Se não conseguir carregar, usar CSS inline como fallback
        if (!css) {
            logger.warn('CSS não carregado, usando fallback inline.');
            css = getInlineCSSFallback();
        }
        
        const style = document.createElement('style');
        style.id = `${MODULE_ID}-style`;
        style.textContent = css;
        document.head.appendChild(style);
        logger.info('Estilos injetados.');
    }
    
    function getInlineCSSFallback() {
        return `
            #as-patchnotes-root {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                opacity: 0;
                pointer-events: none;
                transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 10000;
            }
            #as-patchnotes-root.as-patchnotes--visible {
                opacity: 1;
                pointer-events: auto;
            }
            .as-patchnotes__container {
                position: relative;
                width: 90%;
                max-width: 900px;
                max-height: 85vh;
                background: rgba(15, 8, 33, 0.98);
                border: 3px solid #ffd89f;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                overflow: hidden;
                transform: scale(0.9);
                transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            #as-patchnotes-root.as-patchnotes--visible .as-patchnotes__container {
                transform: scale(1);
            }
            .as-patchnotes__header {
                padding: 30px;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(109, 40, 217, 0.3) 100%);
                border-bottom: 2px solid #ffd89f;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .as-patchnotes__title {
                margin: 0;
                font-size: 32px;
                font-weight: bold;
                color: #ffe8c4;
                text-shadow: 0 0 20px rgba(255, 216, 159, 0.5);
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .as-patchnotes__close {
                background: rgba(239, 68, 68, 0.2);
                border: 2px solid #ef4444;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #fca5a5;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .as-patchnotes__content {
                padding: 30px;
                max-height: calc(85vh - 150px);
                overflow-y: auto;
                color: #e9d5ff;
            }
            .as-patchnote {
                background: rgba(30, 20, 60, 0.95);
                border: 2px solid rgba(139, 92, 246, 0.4);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
            }
            .as-patchnote__header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(139, 92, 246, 0.3);
            }
            .as-patchnote__version {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
                color: #ffd89f;
            }
            .as-patchnote__date {
                font-size: 14px;
                color: #c4b5fd;
                opacity: 0.8;
            }
            .as-patchnote__changes {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .as-patchnote__change {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 12px;
                margin-bottom: 10px;
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.3);
                color: #e9d5ff;
                font-size: 15px;
                line-height: 1.6;
            }
            .as-patchnote__badge {
                display: inline-flex;
                align-items: center;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                flex-shrink: 0;
            }
            .as-patchnote__change--new .as-patchnote__badge {
                background: linear-gradient(135deg, #10b981, #059669);
                color: #d1fae5;
            }
            .as-patchnote__change--fix .as-patchnote__badge {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: #fef3c7;
            }
            .as-patchnote__change--improvement .as-patchnote__badge {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: #dbeafe;
            }
        `;
    }

    function injectMarkup() {
        if (rootElement && buttonElement) {
            return;
        }
        
        const html = loadAsset(PATHS.html);
        if (!html) {
            logger.error('HTML não encontrado.');
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        
        // Extrair os dois elementos: botão e modal
        const elements = wrapper.children;
        buttonElement = elements[0]; // Primeiro elemento é o botão
        rootElement = elements[1];   // Segundo elemento é o modal
        
        if (!buttonElement || !rootElement) {
            logger.error('Falha ao criar elementos do patch notes.');
            return;
        }
        
        document.body.appendChild(buttonElement);
        document.body.appendChild(rootElement);
        
        // Inicialmente esconder o botão
        buttonElement.style.display = 'none';
        
        // Vincular botão de fechar do modal
        const closeButton = rootElement.querySelector('#patchNotesClose');
        if (closeButton) {
            closeButton.addEventListener('click', closePatchNotes);
        }
        
        logger.info('Markup HTML do Patch Notes inserido.');
    }

    function destroyMarkup() {
        detachKeyboardSupport();
        unbindButton();
        
        if (buttonElement && buttonElement.parentNode) {
            buttonElement.parentNode.removeChild(buttonElement);
        }
        buttonElement = null;
        
        if (rootElement && rootElement.parentNode) {
            rootElement.parentNode.removeChild(rootElement);
        }
        rootElement = null;
        
        const style = document.getElementById(`${MODULE_ID}-style`);
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }

    function loadPatchNotes() {
        if (!rootElement) {
            return;
        }
        
        const container = rootElement.querySelector('#patchNotesContent');
        if (!container) {
            return;
        }
        
        // Carregar notas de atualização
        const notes = getPatchNotesData();
        
        container.innerHTML = '';
        
        notes.forEach(note => {
            const noteElement = createPatchNoteElement(note);
            container.appendChild(noteElement);
        });
    }

    function getPatchNotesData() {
        // Por enquanto, dados mockados - depois você pode carregar de um arquivo JSON
        return [
            {
                version: '1.0.0',
                date: '28/10/2025',
                changes: [
                    { type: 'new', text: 'Sistema de tela de título customizada com design medieval' },
                    { type: 'new', text: 'Interface de opções avançadas com presets de qualidade' },
                    { type: 'new', text: 'Sistema de detecção automática de hardware' },
                    { type: 'new', text: 'Monitor de FPS configurável' },
                    { type: 'new', text: 'Estilos de cursor personalizáveis' },
                    { type: 'improvement', text: 'Otimizações no carregamento de recursos' },
                    { type: 'improvement', text: 'Transições suaves entre cenas' }
                ]
            }
        ];
    }

    function createPatchNoteElement(note) {
        const article = document.createElement('article');
        article.className = 'as-patchnote';
        
        const header = document.createElement('header');
        header.className = 'as-patchnote__header';
        header.innerHTML = `
            <h2 class="as-patchnote__version">Versão ${note.version}</h2>
            <time class="as-patchnote__date">${note.date}</time>
        `;
        
        const changesList = document.createElement('ul');
        changesList.className = 'as-patchnote__changes';
        
        note.changes.forEach(change => {
            const li = document.createElement('li');
            li.className = `as-patchnote__change as-patchnote__change--${change.type}`;
            
            const badge = document.createElement('span');
            badge.className = 'as-patchnote__badge';
            badge.textContent = getBadgeText(change.type);
            
            const text = document.createElement('span');
            text.textContent = change.text;
            
            li.appendChild(badge);
            li.appendChild(text);
            changesList.appendChild(li);
        });
        
        article.appendChild(header);
        article.appendChild(changesList);
        
        return article;
    }

    function getBadgeText(type) {
        const badges = {
            new: '✨ Novo',
            fix: '🔧 Correção',
            improvement: '⚡ Melhoria',
            balance: '⚖️ Balanceamento',
            removed: '❌ Removido'
        };
        return badges[type] || '📝 Alteração';
    }

    function showPatchNotes() {
        if (!rootElement) return;
        
        requestAnimationFrame(() => {
            rootElement.classList.add('as-patchnotes--visible');
            rootElement.setAttribute('aria-hidden', 'false');
        });
    }

    function hidePatchNotes() {
        if (!rootElement) return;
        
        rootElement.classList.remove('as-patchnotes--visible');
        rootElement.setAttribute('aria-hidden', 'true');
    }

    function attachKeyboardSupport() {
        const handler = (event) => {
            if (!rootElement || !rootElement.classList.contains('as-patchnotes--visible')) {
                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                closePatchNotes();
            }
        };

        document.addEventListener('keydown', handler);
        detachKeyHandler = () => document.removeEventListener('keydown', handler);
    }

    function detachKeyboardSupport() {
        if (typeof detachKeyHandler === 'function') {
            detachKeyHandler();
            detachKeyHandler = null;
        }
    }

    function loadAsset(relativePath) {
        if (!Utils.isNwjs()) {
            logger.warn('Ambiente sem Node.js.');
            return '';
        }

        try {
            const fs = require('fs');
            const path = require('path');
            const sanitized = relativePath.replace(/^[/\\]+/, '');
            const baseCandidates = collectBaseCandidates(path);
            const tried = new Set();

            for (const base of baseCandidates) {
                const candidates = buildCandidatePaths(path, base, sanitized);
                for (const candidate of candidates) {
                    if (tried.has(candidate)) {
                        continue;
                    }
                    tried.add(candidate);
                    if (fs.existsSync(candidate)) {
                        return fs.readFileSync(candidate, 'utf8');
                    }
                }
            }

            logger.error(`Erro ao localizar asset: ${relativePath}`);
        } catch (error) {
            logger.error(`Erro ao carregar ${relativePath}: ${error.message}`);
        }

        return '';
    }

    function collectBaseCandidates(pathLib) {
        const bases = [];

        if (typeof process !== 'undefined') {
            if (process.mainModule && process.mainModule.filename) {
                bases.push(pathLib.dirname(process.mainModule.filename));
            }
            if (typeof process.cwd === 'function') {
                bases.push(process.cwd());
            }
            if (process.execPath) {
                bases.push(pathLib.dirname(process.execPath));
            }
        }

        if (typeof require !== 'undefined' && require.main && require.main.filename) {
            bases.push(pathLib.dirname(require.main.filename));
        }

        if (typeof nw !== 'undefined') {
            if (nw.__dirname) {
                bases.push(nw.__dirname);
            }
            if (nw.App && nw.App.startPath) {
                bases.push(nw.App.startPath);
            }
        }

        return Array.from(new Set(bases.filter(Boolean)));
    }

    function buildCandidatePaths(pathLib, base, relative) {
        const candidates = [
            pathLib.resolve(base, relative),
            pathLib.resolve(base, 'www', relative),
            pathLib.resolve(base, '..', relative),
            pathLib.resolve(base, '..', 'www', relative)
        ];

        if (/www[\\/]/i.test(base)) {
            candidates.push(pathLib.resolve(base.replace(/www[\\/]?$/i, ''), 'www', relative));
        }

        return Array.from(new Set(candidates));
    }

    if (AS && AS.PluginManager && typeof AS.PluginManager.register === 'function') {
        AS.PluginManager.register(manifest);
    } else {
        logger.error('AS.PluginManager não encontrado.');
    }
})();

//=============================================================================
// Fim de AS_1.4_PatchNotes.js
//=============================================================================
