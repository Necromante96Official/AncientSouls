//=============================================================================
// AS_1.4_PatchNotes.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0.6 ☆ Sistema de notas de atualização com interface medieval fantástica
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
 * - Botão "Atualizações" no canto superior esquerdo da tela de título
 * - Interface HTML com design medieval e abas de categorias
 * - Sistema de leitura de arquivos markdown (.md)
 * - Filtros por categoria (Base, Grandes, Pequenas, Críticas, Correções)
 * - Lista de atualizações organizada por versão (formato: X.X.X.X-stage_nome.md)
 * - Scroll suave e animações elegantes
 * - Suporte a markdown com parsing automático
 * - Sistema de categorias (Novo, Correção, Melhoria, etc.)
 * - BGM continua tocando durante visualização
 * 
 * ==========================================================================
 */

var AS = AS || {};
AS.PatchNotes = AS.PatchNotes || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.4_PatchNotes';
    const MODULE_VERSION = '1.0.6';
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
        html: 'js/plugins/assets/contents/html/AS_1.4_PatchNotes.html',
        patchnotesDir: 'js/plugins/assets/contents/patchnotes'
    };

    let rootElement = null;
    let detachKeyHandler = null;
    let contextRef = null;
    let currentCategory = 'all';
    let patchNotesCache = null;

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Patch Notes',
        dependencies: DEPENDENCIES,
        init: context => {
            contextRef = context;
            
            // Responder ao comando patchnotes da tela de título
            const commandSubscription = context.subscribe('titlescreen:command:patchnotes', () => {
                logger.info('Comando patchnotes recebido. Abrindo interface.');
                openPatchNotes();
            });
            
            // Injetar markup quando a tela de título estiver pronta
            const sceneReadySubscription = context.subscribe('titlescreen:scene:ready', () => {
                injectMarkup();
            });
            
            // Limpar interface quando sair da tela de título
            const sceneTerminateSubscription = context.subscribe('titlescreen:scene:terminate', () => {
                closePatchNotesIfOpen();
            });
            
            logger.info('Sistema de Patch Notes inicializado.');
            
            return {
                dispose() {
                    commandSubscription();
                    sceneReadySubscription();
                    sceneTerminateSubscription();
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
        
        // Garantir que a música de fundo continue tocando
        if (typeof AudioManager !== 'undefined' && AudioManager._currentBgm) {
            const currentBgm = AudioManager._currentBgm;
            setTimeout(() => {
                if (!AudioManager.isCurrentBgm(currentBgm)) {
                    AudioManager.playBgm(currentBgm);
                }
            }, 100);
        }
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

    function closePatchNotesIfOpen() {
        if (rootElement && rootElement.classList.contains('as-patchnotes--visible')) {
            closePatchNotes();
        }
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
        
        // O HTML contém apenas o modal agora (não mais o botão)
        rootElement = wrapper.children[wrapper.children.length - 1]; // Pegar o último elemento (modal)
        
        if (!rootElement) {
            logger.error('Falha ao criar elemento do patch notes modal.');
            return;
        }
        
        document.body.appendChild(rootElement);
        
        // Vincular botão de fechar do modal
        const closeButton = rootElement.querySelector('#patchNotesClose');
        if (closeButton) {
            closeButton.addEventListener('click', closePatchNotes);
        }
        
        // Vincular abas de categoria
        const tabs = rootElement.querySelectorAll('.as-patchnotes__tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const category = tab.dataset.category;
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                loadPatchNotes(category);
            });
        });
        
        logger.info('Markup HTML do Patch Notes (modal) inserido.');
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

    function loadPatchNotes(category = 'all') {
        if (!rootElement) {
            return;
        }
        
        currentCategory = category;
        const container = rootElement.querySelector('#patchNotesContent');
        if (!container) {
            return;
        }
        
        // Carregar notas de atualização
        const allNotes = getPatchNotesData();
        
        // Filtrar por categoria
        const filteredNotes = category === 'all' 
            ? allNotes 
            : allNotes.filter(note => note.category === category);
        
        container.innerHTML = '';
        
        if (filteredNotes.length === 0) {
            container.innerHTML = '<p class="as-patchnotes__empty">Nenhuma atualização encontrada nesta categoria.</p>';
            return;
        }
        
        filteredNotes.forEach(note => {
            const noteElement = createPatchNoteElement(note);
            container.appendChild(noteElement);
        });
        
        // Atualizar abas ativas
        updateCategoryTabs(category);
    }

    function updateCategoryTabs(activeCategory) {
        if (!rootElement) return;
        
        const tabs = rootElement.querySelectorAll('.as-patchnotes__tab');
        tabs.forEach(tab => {
            const tabCategory = tab.dataset.category;
            if (tabCategory === activeCategory) {
                tab.classList.add('as-patchnotes__tab--active');
            } else {
                tab.classList.remove('as-patchnotes__tab--active');
            }
        });
    }

    function getPatchNotesData() {
        if (patchNotesCache) {
            return patchNotesCache;
        }

        if (!Utils.isNwjs()) {
            logger.warn('Sistema de arquivos não disponível. Usando dados mockados.');
            return getMockPatchNotes();
        }

        try {
            const fs = require('fs');
            const path = require('path');
            const baseCandidates = collectBaseCandidates(path);
            let patchnotesDir = null;

            // Encontrar o diretório de patchnotes
            for (const base of baseCandidates) {
                const candidates = buildCandidatePaths(path, base, PATHS.patchnotesDir);
                for (const candidate of candidates) {
                    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
                        patchnotesDir = candidate;
                        break;
                    }
                }
                if (patchnotesDir) break;
            }

            if (!patchnotesDir) {
                logger.warn('Diretório de patch notes não encontrado. Usando dados mockados.');
                return getMockPatchNotes();
            }

            // Ler todos os arquivos .md do diretório
            const files = fs.readdirSync(patchnotesDir)
                .filter(file => file.endsWith('.md'))
                .sort((a, b) => b.localeCompare(a)); // Ordem decrescente (mais recente primeiro)

            const patchNotes = [];

            for (const file of files) {
                const filePath = path.join(patchnotesDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const parsed = parseMarkdownPatchNote(content, file);
                if (parsed) {
                    patchNotes.push(parsed);
                }
            }

            patchNotesCache = patchNotes;
            logger.info(`${patchNotes.length} patch notes carregadas.`);
            return patchNotes;

        } catch (error) {
            logger.error(`Erro ao carregar patch notes: ${error.message}`);
            return getMockPatchNotes();
        }
    }

    function parseMarkdownPatchNote(content, filename) {
        try {
            // Extrair metadados do nome do arquivo: 0.0.0.1-alfa_sistema-de-plugins.md
            const filenameMatch = filename.match(/^(\d+\.\d+\.\d+\.\d+)-([^_]+)_(.+)\.md$/);
            if (!filenameMatch) {
                logger.warn(`Nome de arquivo inválido: ${filename}`);
                return null;
            }

            const version = filenameMatch[1];
            const stage = filenameMatch[2]; // alfa, beta, release
            const slug = filenameMatch[3];

            // Extrair informações do conteúdo markdown
            const lines = content.split('\n');
            let title = '';
            let date = '';
            let category = '';
            let type = '';
            let description = '';
            let sections = [];
            let currentSection = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                // Título (primeira linha # )
                if (!title && line.startsWith('# ')) {
                    title = line.substring(2).trim();
                    continue;
                }

                // Metadados (linhas **Key:** value)
                if (line.startsWith('**Data:**')) {
                    date = line.replace('**Data:**', '').trim();
                    continue;
                }
                if (line.startsWith('**Categoria:**')) {
                    category = line.replace('**Categoria:**', '').trim();
                    continue;
                }
                if (line.startsWith('**Tipo:**')) {
                    type = line.replace('**Tipo:**', '').trim();
                    continue;
                }

                // Descrição (após ## 📖 Descrição)
                if (line.startsWith('## 📖 Descrição') || line.startsWith('## Descrição')) {
                    let descLines = [];
                    for (let j = i + 1; j < lines.length; j++) {
                        const descLine = lines[j].trim();
                        if (descLine.startsWith('##') || descLine === '---') break;
                        if (descLine) descLines.push(descLine);
                    }
                    description = descLines.join(' ');
                }

                // Seções (## ou ###)
                if (line.startsWith('## ') && !line.includes('Descrição')) {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        title: line.substring(3).trim(),
                        items: []
                    };
                    continue;
                }

                // Items de lista (- ou * )
                if (currentSection && (line.startsWith('- ') || line.startsWith('* '))) {
                    const item = line.substring(2).trim();
                    
                    // Detectar tipo de mudança por prefixo
                    let changeType = 'change';
                    let cleanItem = item;
                    
                    if (item.startsWith('**') || item.includes('✨') || item.includes('Novo')) {
                        changeType = 'new';
                    } else if (item.includes('🔧') || item.includes('Correção') || item.includes('Corrigido')) {
                        changeType = 'fix';
                    } else if (item.includes('⚡') || item.includes('Melhoria')) {
                        changeType = 'improvement';
                    } else if (item.includes('⚖️') || item.includes('Balanceamento')) {
                        changeType = 'balance';
                    } else if (item.includes('❌') || item.includes('Removido')) {
                        changeType = 'removed';
                    }
                    
                    // Limpar markdown do texto
                    cleanItem = cleanItem.replace(/\*\*/g, '').replace(/\*/g, '');
                    
                    currentSection.items.push({
                        type: changeType,
                        text: cleanItem
                    });
                }
            }

            if (currentSection && currentSection.items.length > 0) {
                sections.push(currentSection);
            }

            // Mapear categoria para sistema de filtros
            const categoryMap = {
                'Base Inicial': 'base',
                'Grandes Atualizações': 'major',
                'Pequenas Atualizações': 'minor',
                'Correções Importantes': 'critical',
                'Correções Pequenas': 'fix'
            };

            return {
                version,
                stage,
                title,
                date,
                category: categoryMap[category] || 'other',
                type,
                description,
                sections,
                filename
            };

        } catch (error) {
            logger.error(`Erro ao parsear ${filename}: ${error.message}`);
            return null;
        }
    }

    function getMockPatchNotes() {
        // Dados mockados caso não consiga carregar arquivos
        return [
            {
                version: '0.0.0.1',
                stage: 'alfa',
                title: 'Sistema de Plugins Customizados',
                date: '15/01/2025',
                category: 'major',
                type: 'Grande Atualização',
                description: 'Sistema completo de plugins com gerenciamento de dependências',
                sections: [
                    {
                        title: '✨ Novos Recursos',
                        items: [
                            { type: 'new', text: 'AS_0.0 - Gerenciador de Plugins' },
                            { type: 'new', text: 'AS_0.1 - Melhorias de Log' },
                            { type: 'new', text: 'AS_1.0 - Tela de Título Medieval' },
                            { type: 'new', text: 'AS_1.1 - Interface da Tela de Título' },
                            { type: 'new', text: 'AS_1.2 - Sistema de Opções' },
                            { type: 'new', text: 'AS_1.3 - Editor de Logo do Título' },
                            { type: 'new', text: 'AS_1.4 - Notas de Atualização' }
                        ]
                    }
                ]
            },
            {
                version: '0.0.0.0',
                stage: 'alfa',
                title: 'Versão Inicial - Base do Sistema',
                date: '01/01/2025',
                category: 'base',
                type: 'Base Inicial',
                description: 'Versão base do Ancient Souls com RPG Maker MZ',
                sections: [
                    {
                        title: '🎮 Sistema Base',
                        items: [
                            { type: 'new', text: 'Sistema de combate por turnos' },
                            { type: 'new', text: 'Sistema de exploração de mapas' },
                            { type: 'new', text: 'Sistema de personagens e classes' },
                            { type: 'new', text: 'Sistema de salvamento' }
                        ]
                    }
                ]
            }
        ];
    }

    function createPatchNoteElement(note) {
        const article = document.createElement('article');
        article.className = 'as-patchnote';
        article.dataset.category = note.category;
        
        const header = document.createElement('header');
        header.className = 'as-patchnote__header';
        
        const titleContainer = document.createElement('div');
        titleContainer.className = 'as-patchnote__title-container';
        
        const version = document.createElement('h2');
        version.className = 'as-patchnote__version';
        version.innerHTML = `
            <span class="as-patchnote__version-number">v${note.version}</span>
            <span class="as-patchnote__stage">${note.stage}</span>
        `;
        
        const title = document.createElement('h3');
        title.className = 'as-patchnote__title';
        title.textContent = note.title;
        
        const categoryBadge = document.createElement('span');
        categoryBadge.className = `as-patchnote__category-badge as-patchnote__category-badge--${note.category}`;
        categoryBadge.textContent = getCategoryName(note.category);
        
        titleContainer.appendChild(version);
        titleContainer.appendChild(title);
        titleContainer.appendChild(categoryBadge);
        
        const date = document.createElement('time');
        date.className = 'as-patchnote__date';
        date.textContent = note.date;
        
        header.appendChild(titleContainer);
        header.appendChild(date);
        
        article.appendChild(header);
        
        // Descrição
        if (note.description) {
            const desc = document.createElement('p');
            desc.className = 'as-patchnote__description';
            desc.textContent = note.description;
            article.appendChild(desc);
        }
        
        // Seções
        if (note.sections && note.sections.length > 0) {
            note.sections.forEach(section => {
                const sectionElement = document.createElement('section');
                sectionElement.className = 'as-patchnote__section';
                
                const sectionTitle = document.createElement('h4');
                sectionTitle.className = 'as-patchnote__section-title';
                sectionTitle.textContent = section.title;
                sectionElement.appendChild(sectionTitle);
                
                if (section.items && section.items.length > 0) {
                    const list = document.createElement('ul');
                    list.className = 'as-patchnote__changes';
                    
                    section.items.forEach(item => {
                        const li = document.createElement('li');
                        li.className = `as-patchnote__change as-patchnote__change--${item.type}`;
                        
                        const badge = document.createElement('span');
                        badge.className = 'as-patchnote__badge';
                        badge.textContent = getBadgeText(item.type);
                        
                        const text = document.createElement('span');
                        text.textContent = item.text;
                        
                        li.appendChild(badge);
                        li.appendChild(text);
                        list.appendChild(li);
                    });
                    
                    sectionElement.appendChild(list);
                }
                
                article.appendChild(sectionElement);
            });
        }
        
        return article;
    }

    function getCategoryName(category) {
        const categories = {
            'base': 'Base Inicial',
            'major': 'Grande Atualização',
            'minor': 'Pequena Atualização',
            'critical': 'Correção Importante',
            'fix': 'Correção',
            'other': 'Outro'
        };
        return categories[category] || 'Outro';
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
