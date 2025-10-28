//=============================================================================
// AS_1.4_PatchNotes.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.1.4 ☆ Sistema completo de patch notes com acordeão, BGM preservada, expandir tudo e contadores
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
 */

var AS = AS || {};
AS.PatchNotes = AS.PatchNotes || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.4_PatchNotes';
    const MODULE_VERSION = '1.1.4';
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
    let savedBgm = null;
    let isOpen = false;

    const manifest = {
        id: MODULE_ID,
        version: MODULE_VERSION,
        name: 'Ancient Souls - Patch Notes',
        dependencies: DEPENDENCIES,
        init: context => {
            contextRef = context;
            
            // Responder ao comando patchnotes da tela de título
            const commandSubscription = context.subscribe('titlescreen:command:patchnotes', () => {
                // Evitar abrir múltiplas vezes
                if (isOpen) {
                    logger.warn('Patch notes já está aberta. Ignorando comando duplicado.');
                    return;
                }
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
        // Evitar múltiplas aberturas
        if (isOpen) {
            logger.warn('Patch notes já está aberta.');
            return;
        }
        
        isOpen = true;
        
        // Salvar estado da música ANTES de fazer qualquer coisa
        if (typeof AudioManager !== 'undefined' && AudioManager._bgmBuffer) {
            const isPlaying = AudioManager._bgmBuffer.isPlaying();
            savedBgm = {
                name: AudioManager._currentBgm ? AudioManager._currentBgm.name : '',
                volume: AudioManager._currentBgm ? AudioManager._currentBgm.volume : 90,
                pitch: AudioManager._currentBgm ? AudioManager._currentBgm.pitch : 100,
                pan: AudioManager._currentBgm ? AudioManager._currentBgm.pan : 0,
                pos: AudioManager._bgmBuffer.seek(),
                isPlaying: isPlaying
            };
            
            logger.info(`BGM salva: "${savedBgm.name}" na posição ${savedBgm.pos}s (tocando: ${savedBgm.isPlaying})`);
        }
        
        injectStyles();
        injectMarkup(); // CRÍTICO: Criar modal antes de tentar mostrar
        loadPatchNotes();
        showPatchNotes();
        attachKeyboardSupport();
        
        // NÃO fazer nada com a música - deixar tocar normalmente
        logger.info('Patch notes aberta com sucesso.');
    }

    function closePatchNotes() {
        if (!isOpen) {
            return;
        }
        
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playCancel();
        }
        
        hidePatchNotes();
        
        // NÃO fazer nada com a música - deixar tocar normalmente
        
        setTimeout(() => {
            destroyMarkup();
            isOpen = false; // Permitir reabrir
            logger.info('Patch notes fechada. Pode ser reaberta.');
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
        
        // Vincular botão de expandir/colapsar tudo
        const toggleAllButton = rootElement.querySelector('#patchNotesToggleAll');
        if (toggleAllButton) {
            toggleAllButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                toggleAllPatchNotes(toggleAllButton);
            });
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
        
        // Vincular busca em tempo real
        const searchInput = rootElement.querySelector('#patchNotesSearch');
        const clearSearchBtn = rootElement.querySelector('#patchNotesClearSearch');
        if (searchInput) {
            // Proteger o input contra handlers globais do RPG Maker
            searchInput.addEventListener('keydown', (e) => {
                e.stopPropagation(); // Impede que eventos globais capturem as teclas
            }, true);
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                filterPatchNotes(query);
                
                // Mostrar/esconder botão de limpar
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
                }
            });
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    filterPatchNotes('');
                    clearSearchBtn.style.display = 'none';
                    searchInput.focus();
                }
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCancel();
                }
            });
        }
        
        logger.info('Markup HTML do Patch Notes (modal) inserido.');
    }

    function destroyMarkup() {
        detachKeyboardSupport();
        
        // Remover classe visible antes de destruir
        if (rootElement) {
            rootElement.classList.remove('as-patchnotes--visible');
        }
        
        // Aguardar animação antes de remover do DOM
        setTimeout(() => {
            if (rootElement && rootElement.parentNode) {
                rootElement.parentNode.removeChild(rootElement);
            }
            rootElement = null;
            logger.info('Modal de patch notes removido do DOM.');
        }, 100);
        
        // Não remover os estilos - mantê-los para próxima abertura
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
        
        const allNotes = getPatchNotesData();
        const tabs = rootElement.querySelectorAll('.as-patchnotes__tab');
        
        tabs.forEach(tab => {
            const tabCategory = tab.dataset.category;
            
            // Atualizar classe active
            if (tabCategory === activeCategory) {
                tab.classList.add('as-patchnotes__tab--active');
            } else {
                tab.classList.remove('as-patchnotes__tab--active');
            }
            
            // Adicionar contador
            const count = tabCategory === 'all' 
                ? allNotes.length 
                : allNotes.filter(note => note.category === tabCategory).length;
            
            // Verificar se já existe badge de contador
            let badge = tab.querySelector('.as-patchnotes__tab-count');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'as-patchnotes__tab-count';
                tab.appendChild(badge);
            }
            badge.textContent = count;
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
        article.className = 'as-patchnote as-patchnote--collapsed';
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
        categoryBadge.className = `as-patchnote__category-badge as-patchnote__category-badge--${note.category} as-badge--pulse`;
        categoryBadge.textContent = getCategoryName(note.category);
        
        titleContainer.appendChild(version);
        titleContainer.appendChild(title);
        titleContainer.appendChild(categoryBadge);
        
        const date = document.createElement('time');
        date.className = 'as-patchnote__date';
        date.textContent = note.date;
        
        header.appendChild(titleContainer);
        header.appendChild(date);
        
        // Adicionar evento de clique no header para expandir/colapsar
        header.addEventListener('click', () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCursor();
            }
            togglePatchNote(article);
        });
        
        article.appendChild(header);
        
        // Corpo (descrição + seções com abas)
        const body = document.createElement('div');
        body.className = 'as-patchnote__body';
        
        // Descrição melhorada
        if (note.description) {
            const desc = document.createElement('p');
            desc.className = 'as-patchnote__description as-patchnote__description--enhanced';
            desc.innerHTML = parseMarkdown(note.description);
            body.appendChild(desc);
        }
        
        // Sistema de abas para seções
        if (note.sections && note.sections.length > 0) {
            // Container das abas
            const tabsContainer = document.createElement('div');
            tabsContainer.className = 'as-patchnote__tabs';
            
            // Navegação das abas
            const tabNav = document.createElement('div');
            tabNav.className = 'as-patchnote__tab-nav';
            
            // Conteúdo das abas
            const tabContent = document.createElement('div');
            tabContent.className = 'as-patchnote__tab-content';
            
            note.sections.forEach((section, index) => {
                // Botão da aba
                const tabButton = document.createElement('button');
                tabButton.className = 'as-patchnote__tab-button';
                if (index === 0) tabButton.classList.add('active');
                
                // Extrair emoji do título
                const emojiMatch = section.title.match(/^([^\w\s]+)\s*/);
                if (emojiMatch) {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'as-patchnote__tab-icon';
                    iconSpan.textContent = emojiMatch[1];
                    tabButton.appendChild(iconSpan);
                    tabButton.appendChild(document.createTextNode(section.title.replace(emojiMatch[0], '')));
                } else {
                    tabButton.textContent = section.title;
                }
                
                // Evento de clique na aba
                tabButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evitar expandir/colapsar o patch note
                    if (typeof SoundManager !== 'undefined') {
                        SoundManager.playCursor();
                    }
                    
                    // Desativar todas as abas
                    tabNav.querySelectorAll('.as-patchnote__tab-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    tabContent.querySelectorAll('.as-patchnote__tab-panel').forEach(panel => {
                        panel.classList.remove('active');
                    });
                    
                    // Ativar aba clicada
                    tabButton.classList.add('active');
                    tabPanels[index].classList.add('active');
                });
                
                tabNav.appendChild(tabButton);
                
                // Painel da aba
                const tabPanel = document.createElement('div');
                tabPanel.className = 'as-patchnote__tab-panel';
                if (index === 0) tabPanel.classList.add('active');
                
                if (section.items && section.items.length > 0) {
                    const list = document.createElement('div');
                    list.className = 'as-patchnote__items--enhanced';
                    
                    section.items.forEach(item => {
                        const itemCard = document.createElement('div');
                        itemCard.className = `as-patchnote__item--card type-${item.type}`;
                        
                        // Badge com ícone
                        const badge = document.createElement('span');
                        badge.className = `as-badge as-badge--${item.type}`;
                        badge.innerHTML = `${getTypeIcon(item.type)} ${getBadgeText(item.type)}`;
                        
                        // Texto do item
                        const text = document.createElement('span');
                        text.className = 'as-patchnote__item-text';
                        text.innerHTML = parseMarkdown(item.text);
                        
                        itemCard.appendChild(badge);
                        itemCard.appendChild(text);
                        list.appendChild(itemCard);
                    });
                    
                    tabPanel.appendChild(list);
                }
                
                tabContent.appendChild(tabPanel);
            });
            
            // Armazenar referência aos painéis para o evento de clique
            const tabPanels = tabContent.querySelectorAll('.as-patchnote__tab-panel');
            
            tabsContainer.appendChild(tabNav);
            tabsContainer.appendChild(tabContent);
            body.appendChild(tabsContainer);
        }
        
        article.appendChild(body);
        
        return article;
    }
    
    function getTypeIcon(type) {
        const icons = {
            new: '✨',
            fix: '🔧',
            improvement: '⚡',
            balance: '⚖️',
            removal: '❌',
            security: '🛡️'
        };
        return icons[type] || '●';
    }
    
    /**
     * Converte markdown simples para HTML
     * Suporta: **negrito**, *itálico*, `código`
     */
    function parseMarkdown(text) {
        if (!text) return text;
        
        let parsed = text;
        
        // **negrito** -> <strong>negrito</strong>
        parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // *itálico* -> <em>itálico</em>
        parsed = parsed.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // `código` -> <code>código</code>
        parsed = parsed.replace(/`(.+?)`/g, '<code>$1</code>');
        
        return parsed;
    }

    function togglePatchNote(article) {
        const isCollapsed = article.classList.contains('as-patchnote--collapsed');
        
        if (isCollapsed) {
            article.classList.remove('as-patchnote--collapsed');
            article.classList.add('as-patchnote--expanded');
        } else {
            article.classList.remove('as-patchnote--expanded');
            article.classList.add('as-patchnote--collapsed');
        }
    }

    function toggleAllPatchNotes(button) {
        if (!rootElement) return;
        
        const allPatchNotes = rootElement.querySelectorAll('.as-patchnote');
        if (allPatchNotes.length === 0) return;
        
        // Verificar se todas estão expandidas
        const allExpanded = Array.from(allPatchNotes).every(note => 
            note.classList.contains('as-patchnote--expanded')
        );
        
        if (allExpanded) {
            // Colapsar todas
            allPatchNotes.forEach(note => {
                note.classList.remove('as-patchnote--expanded');
                note.classList.add('as-patchnote--collapsed');
            });
            button.classList.remove('all-expanded');
        } else {
            // Expandir todas
            allPatchNotes.forEach(note => {
                note.classList.remove('as-patchnote--collapsed');
                note.classList.add('as-patchnote--expanded');
            });
            button.classList.add('all-expanded');
        }
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
            
            // Garantir que o scroll funcione
            const content = rootElement.querySelector('.as-patchnotes__content');
            if (content) {
                // Forçar o foco no elemento para habilitar scroll
                content.setAttribute('tabindex', '-1');
                content.focus();
                
                // Permitir scroll com mouse wheel
                content.addEventListener('wheel', (e) => {
                    e.stopPropagation();
                }, { passive: true });
            }
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

    // =========================================================================
    // NOVAS FUNCIONALIDADES - BUSCA E EXPORT
    // =========================================================================

    function filterPatchNotes(query) {
        if (!rootElement) return;
        
        const allNotes = rootElement.querySelectorAll('.as-patchnote');
        let visibleCount = 0;
        
        allNotes.forEach(note => {
            const content = note.textContent.toLowerCase();
            const matches = content.includes(query);
            
            note.style.display = matches ? 'block' : 'none';
            if (matches) visibleCount++;
        });
        
        // Mostrar mensagem se nenhum resultado
        const container = rootElement.querySelector('#patchNotesContent');
        let noResults = container.querySelector('.as-patchnotes__no-results');
        
        if (visibleCount === 0 && query.length > 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'as-patchnotes__no-results';
                noResults.innerHTML = `
                    <p>🔍 Nenhuma atualização encontrada para "${query}"</p>
                    <p>Tente outro termo de busca.</p>
                `;
                container.appendChild(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
        
        logger.info(`Filtro aplicado: "${query}" - ${visibleCount} resultados`);
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
