//=============================================================================
// AS_1.4_PatchNotes.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.0 ☆ Sistema de notas de atualização com interface medieval fantástica
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
    const MODULE_VERSION = '1.0.0';
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
    let detachKeyHandler = null;
    let contextRef = null;

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Patch Notes',
        dependencies: DEPENDENCIES,
        init: context => {
            contextRef = context;
            
            // Adicionar botão na tela de título
            const subscription = context.subscribe('titlescreen:scene:ready', () => {
                addPatchNotesButton();
            });
            
            logger.info('Sistema de Patch Notes inicializado.');
            
            return {
                dispose() {
                    subscription();
                    removePatchNotesButton();
                }
            };
        },
        cleanup: () => {
            destroyMarkup();
            removePatchNotesButton();
            logger.info('Interface de Patch Notes removida.');
        }
    };

    function addPatchNotesButton() {
        // Verificar se o botão já existe
        const existingButton = document.getElementById('as-patchnotes-button');
        if (existingButton) {
            return;
        }

        // Criar botão
        const button = document.createElement('button');
        button.id = 'as-patchnotes-button';
        button.className = 'as-patchnotes-btn';
        button.innerHTML = `
            <span class="as-patchnotes-btn__icon">📋</span>
            <span class="as-patchnotes-btn__text">Atualizações</span>
        `;
        
        button.addEventListener('click', openPatchNotes);
        button.addEventListener('mouseenter', () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCursor();
            }
        });
        
        document.body.appendChild(button);
        
        logger.info('Botão de Patch Notes adicionado.');
    }

    function removePatchNotesButton() {
        const button = document.getElementById('as-patchnotes-button');
        if (button && button.parentNode) {
            button.parentNode.removeChild(button);
        }
    }

    function openPatchNotes() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playOk();
        }
        
        injectStyles();
        injectMarkup();
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
        
        const css = loadAsset(PATHS.css);
        if (!css) {
            logger.warn('CSS não carregado.');
            return;
        }
        
        const style = document.createElement('style');
        style.id = `${MODULE_ID}-style`;
        style.textContent = css;
        document.head.appendChild(style);
        logger.info('Estilos injetados.');
    }

    function injectMarkup() {
        if (rootElement) {
            return;
        }
        
        const html = loadAsset(PATHS.html);
        if (!html) {
            logger.error('HTML não encontrado.');
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        rootElement = wrapper.firstElementChild;
        
        if (!rootElement) {
            logger.error('Falha ao criar rootElement.');
            return;
        }
        
        document.body.appendChild(rootElement);
        
        // Vincular botão de fechar
        const closeButton = rootElement.querySelector('#patchNotesClose');
        if (closeButton) {
            closeButton.addEventListener('click', closePatchNotes);
        }
        
        logger.info('Markup HTML inserido.');
    }

    function destroyMarkup() {
        detachKeyboardSupport();
        
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
