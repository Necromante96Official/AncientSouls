//=============================================================================
// AS_1.4_PatchNotes.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.2.5 ☆ Sistema completo de patch notes com acordeão, BGM preservada, expandir tudo e contadores
 * @author Necromante96Official & GitHub Copilot
 * @orderAfter AS_0.0_PluginManager
 * @orderAfter AS_1.1_TitleScreenUI
 * @help
 * ==========================================================================
 * 📜 Ancient Souls - Patch Notes (Sub-agente)
 * --------------------------------------------------------------------------
 * Sistema completo para exibir notas de atualização do jogo com interface
 * HTML moderna e tema medieval fantástico.
 * 
 * ==========================================================================
 */

var AS = AS || {};
AS.PatchNotes = AS.PatchNotes || {};

(() => {
    'use strict';

    const MODULE_ID = 'AS_1.4_PatchNotes';
    const MODULE_VERSION = '1.2.5';
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

    const STAGES = {
        alfa: {
            emoji: '🔬',
            title: 'ALFA',
            description: 'Desenvolvimento Inicial',
            folder: 'alfa'
        },
        beta: {
            emoji: '🧪',
            title: 'BETA',
            description: 'Testes Públicos',
            folder: 'beta'
        },
        preRelease: {
            emoji: '🎯',
            title: 'PRÉ-RELEASE',
            description: 'Versão Candidata',
            folder: 'pre-release'
        },
        release: {
            emoji: '🏆',
            title: 'RELEASE',
            description: 'Versões Oficiais',
            folder: 'release'
        }
    };

    let rootElement = null;
    let detachKeyHandler = null;
    let contextRef = null;
    let currentCategory = 'all';
    let currentStage = null;
    let patchNotesCache = null;
    let savedBgm = null;
    let isOpen = false;
    
    // Função utilitária para atualizar indicadores de scroll
    function updateScrollIndicators(panel) {
        if (!panel) return;
        
        const hasScrollTop = panel.scrollTop > 20;
        const hasScrollBottom = panel.scrollTop < (panel.scrollHeight - panel.clientHeight - 20);
        
        if (hasScrollTop) {
            panel.classList.add('has-scroll-top');
        } else {
            panel.classList.remove('has-scroll-top');
        }
        
        if (hasScrollBottom) {
            panel.classList.add('has-scroll-bottom');
        } else {
            panel.classList.remove('has-scroll-bottom');
        }
    }
    
    // Função para atualizar indicadores de todos os painéis
    function updateAllScrollIndicators() {
        if (!rootElement) return;
        
        const versionList = rootElement.querySelector('.as-patchnotes__version-list');
        const detailPanel = rootElement.querySelector('.as-patchnotes__detail-panel');
        
        if (versionList) updateScrollIndicators(versionList);
        if (detailPanel) updateScrollIndicators(detailPanel);
    }

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
        showStageSelection(); // Mostrar seleção de estágios (1ª camada)
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
                
                // Se estamos em um estágio específico, filtrar por categoria
                if (currentStage) {
                    filterVersionsByCategory(category, currentStage);
                } else {
                    // Caso contrário, usar o comportamento antigo
                    loadPatchNotes(category);
                }
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
        
        // Vincular botão de scroll ao topo
        const scrollTopBtn = rootElement.querySelector('#patchNotesScrollTop');
        const versionList = rootElement.querySelector('.as-patchnotes__version-list');
        const detailPanel = rootElement.querySelector('.as-patchnotes__detail-panel');
        
        if (scrollTopBtn && versionList && detailPanel) {
            // Função para atualizar indicadores de scroll
            const updateScrollIndicators = (panel) => {
                const hasScrollTop = panel.scrollTop > 20;
                const hasScrollBottom = panel.scrollTop < (panel.scrollHeight - panel.clientHeight - 20);
                
                if (hasScrollTop) {
                    panel.classList.add('has-scroll-top');
                } else {
                    panel.classList.remove('has-scroll-top');
                }
                
                if (hasScrollBottom) {
                    panel.classList.add('has-scroll-bottom');
                } else {
                    panel.classList.remove('has-scroll-bottom');
                }
            };
            
            // Mostrar/esconder botão baseado no scroll
            const handleScroll = (panel) => {
                updateScrollIndicators(panel);
                
                if (panel.scrollTop > 300) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            };
            
            versionList.addEventListener('scroll', () => handleScroll(versionList));
            detailPanel.addEventListener('scroll', () => handleScroll(detailPanel));
            
            // Atualizar indicadores na inicialização
            setTimeout(() => {
                updateScrollIndicators(versionList);
                updateScrollIndicators(detailPanel);
            }, 100);
            
            // Clicar no botão volta ao topo do painel ativo
            scrollTopBtn.addEventListener('click', () => {
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                
                // Rolar para o topo do painel que tem scroll
                if (versionList.scrollTop > 0) {
                    versionList.scrollTo({ top: 0, behavior: 'smooth' });
                }
                if (detailPanel.scrollTop > 0) {
                    detailPanel.scrollTo({ top: 0, behavior: 'smooth' });
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
        const versionList = rootElement.querySelector('#patchNotesVersionList');
        const detailPanel = rootElement.querySelector('#patchNotesDetailPanel');
        
        if (!versionList || !detailPanel) {
            return;
        }
        
        // Carregar notas de atualização
        const allNotes = getPatchNotesData();
        
        // Filtrar por categoria
        const filteredNotes = category === 'all' 
            ? allNotes 
            : allNotes.filter(note => note.category === category);
        
        versionList.innerHTML = '';
        
        if (filteredNotes.length === 0) {
            versionList.innerHTML = '<p class="as-patchnotes__empty">Nenhuma atualização encontrada nesta categoria.</p>';
            detailPanel.innerHTML = `
                <div class="as-patchnotes__detail-empty">
                    <span class="as-patchnotes__detail-empty-icon">📋</span>
                    <p>Nenhuma versão disponível</p>
                </div>
            `;
            return;
        }
        
        // Renderizar lista de versões
        filteredNotes.forEach((note, index) => {
            const versionItem = createVersionItem(note);
            
            // Selecionar automaticamente a primeira versão
            if (index === 0) {
                versionItem.classList.add('active');
                showVersionDetails(note);
            }
            
            // Adicionar evento de clique
            versionItem.addEventListener('click', () => {
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                
                // Remover active de todos
                versionList.querySelectorAll('.as-version-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Ativar clicado
                versionItem.classList.add('active');
                showVersionDetails(note);
            });
            
            versionList.appendChild(versionItem);
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

    function getPatchNotesData(stage = null) {
        // Se stage não especificado e já tem cache, retornar
        if (!stage && patchNotesCache) {
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
            let patchnotesBaseDir = null;

            // Encontrar o diretório base de patchnotes
            for (const base of baseCandidates) {
                const candidates = buildCandidatePaths(path, base, PATHS.patchnotesDir);
                for (const candidate of candidates) {
                    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
                        patchnotesBaseDir = candidate;
                        break;
                    }
                }
                if (patchnotesBaseDir) break;
            }

            if (!patchnotesBaseDir) {
                logger.warn('Diretório de patch notes não encontrado. Usando dados mockados.');
                return getMockPatchNotes();
            }

            const patchNotes = [];

            // Se stage especificado, ler apenas daquela pasta
            if (stage) {
                const stageInfo = Object.values(STAGES).find(s => s.folder === stage);
                if (!stageInfo) {
                    logger.warn(`Estágio inválido: ${stage}`);
                    return [];
                }

                const stageDir = path.join(patchnotesBaseDir, stage);
                
                if (!fs.existsSync(stageDir) || !fs.statSync(stageDir).isDirectory()) {
                    logger.warn(`Pasta do estágio não encontrada: ${stageDir}`);
                    return [];
                }

                const files = fs.readdirSync(stageDir)
                    .filter(file => file.endsWith('.txt'))
                    .sort((a, b) => b.localeCompare(a)); // Ordem decrescente (mais recente primeiro)

                logger.info(`Encontrados ${files.length} arquivos em ${stage}/: ${files.join(', ')}`);

                for (const file of files) {
                    const filePath = path.join(stageDir, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    logger.info(`Lendo arquivo: ${file} (${content.length} caracteres)`);
                    const parsed = parseMarkdownPatchNote(content, file, stage);
                    if (parsed) {
                        logger.info(`✓ Arquivo ${file} parseado com sucesso: ${parsed.title}`);
                        patchNotes.push(parsed);
                    } else {
                        logger.warn(`✗ Falha ao parsear arquivo: ${file}`);
                    }
                }

            } else {
                // Ler de todas as pastas de estágios
                for (const stageKey in STAGES) {
                    const stageInfo = STAGES[stageKey];
                    const stageDir = path.join(patchnotesBaseDir, stageInfo.folder);
                    
                    if (!fs.existsSync(stageDir) || !fs.statSync(stageDir).isDirectory()) {
                        continue;
                    }

                    const files = fs.readdirSync(stageDir)
                        .filter(file => file.endsWith('.txt'))
                        .sort((a, b) => b.localeCompare(a));

                    for (const file of files) {
                        const filePath = path.join(stageDir, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        const parsed = parseMarkdownPatchNote(content, file, stageInfo.folder);
                        if (parsed) {
                            patchNotes.push(parsed);
                        }
                    }
                }
            }

            // Ordenar por versão (mais recente primeiro)
            patchNotes.sort((a, b) => b.version.localeCompare(a.version));

            if (!stage) {
                patchNotesCache = patchNotes;
            }
            
            logger.info(`${patchNotes.length} patch notes carregadas${stage ? ` do estágio ${stage}` : ''}.`);
            return patchNotes;

        } catch (error) {
            logger.error(`Erro ao carregar patch notes: ${error.message}`);
            return getMockPatchNotes();
        }
    }

    function parseMarkdownPatchNote(content, filename, stageFolder) {
        try {
            // Extrair metadados do nome do arquivo: 0.0.0.1-alfa_sistema-de-plugins.txt
            const filenameMatch = filename.match(/^(\d+\.\d+\.\d+\.\d+)-([^_]+)_(.+)\.txt$/);
            if (!filenameMatch) {
                logger.warn(`Nome de arquivo inválido: ${filename}`);
                return null;
            }

            let version = filenameMatch[1];
            let stageSuffix = filenameMatch[2]; // alfa, beta, pre-release
            const slug = filenameMatch[3];

            // Usar stageFolder passado como parâmetro (alfa, beta, pre-release, release)
            let stage = stageFolder || stageSuffix;

            // Extrair informações do conteúdo markdown
            const lines = content.split('\n');
            let title = '';
            let date = '';
            let category = '';
            let type = '';
            let description = '';
            let sections = [];
            let currentSection = null;
            let currentSubsection = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                // Título (primeira linha # )
                if (!title && line.startsWith('# ')) {
                    title = line.substring(2).trim();
                    continue;
                }

                // Metadados (linhas **Key:** value)
                if (line.startsWith('**Versão:**')) {
                    const versionFull = line.replace('**Versão:**', '').trim();
                    const match = versionFull.match(/^(\d+\.\d+\.\d+\.\d+)-(\w+)/);
                    if (match) {
                        version = match[1];
                        stage = match[2];
                    }
                    continue;
                }
                if (line.startsWith('**Data:**')) {
                    date = line.replace('**Data:**', '').trim();
                    continue;
                }
                if (line.startsWith('**Categoria:**')) {
                    category = line.replace('**Categoria:**', '').trim();
                    continue;
                }

                // Resumo (após ## 📖 Resumo)
                if (line.startsWith('## 📖 Resumo') || line.startsWith('## Resumo')) {
                    let descLines = [];
                    for (let j = i + 1; j < lines.length; j++) {
                        const descLine = lines[j].trim();
                        if (descLine.startsWith('##') || descLine === '---') break;
                        if (descLine) descLines.push(descLine);
                    }
                    description = descLines.join(' ');
                }

                // Seções por categoria
                if (line.startsWith('## ✨ Adicionados') || line.startsWith('## Adicionados')) {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        title: 'Adicionados',
                        category: 'added',
                        items: []
                    };
                    continue;
                }
                
                if (line.startsWith('## 🔧 Melhorias') || line.startsWith('## Melhorias')) {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        title: 'Melhorias',
                        category: 'improvements',
                        items: []
                    };
                    continue;
                }
                
                if (line.startsWith('## 🐛 Correções') || line.startsWith('## Correções')) {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        title: 'Correções',
                        category: 'fixes',
                        items: []
                    };
                    continue;
                }
                
                if (line.startsWith('## ❌ Removidos') || line.startsWith('## Removidos')) {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        title: 'Removidos',
                        category: 'removed',
                        items: []
                    };
                    continue;
                }

                // Subseções (###)
                if (currentSection && line.startsWith('### ')) {
                    currentSubsection = line.substring(4).trim();
                    continue;
                }

                // Items de lista (- ou * )
                if (currentSection && (line.startsWith('- ') || line.startsWith('* '))) {
                    const item = line.substring(2).trim();
                    
                    // Determinar tipo baseado na categoria da seção
                    let changeType = 'change';
                    if (currentSection.category === 'added') changeType = 'new';
                    else if (currentSection.category === 'fixes') changeType = 'fix';
                    else if (currentSection.category === 'improvements') changeType = 'improvement';
                    else if (currentSection.category === 'removed') changeType = 'removal';
                    
                    currentSection.items.push({
                        type: changeType,
                        text: item,
                        subsection: currentSubsection
                    });
                }
            }

            if (currentSection && currentSection.items.length > 0) {
                sections.push(currentSection);
            }

            const result = {
                version,
                stage,
                title,
                date,
                category: category, // Manter categoria original
                type: category,
                description,
                sections,
                filename
            };

            logger.info(`Parser resultado para ${filename}:`, {
                version: result.version,
                title: result.title,
                category: result.category,
                sectionsCount: result.sections.length
            });

            return result;

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
                category: 'Grande Atualização',
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
                category: 'Base Inicial',
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
                        badge.innerHTML = getBadgeText(item.type);
                        
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
    
    /**
     * Cria elemento de versão para lista lateral
     */
    function createVersionItem(note) {
        const item = document.createElement('div');
        item.className = 'as-version-item';
        item.dataset.category = note.category;
        
        const header = document.createElement('div');
        header.className = 'as-version-item__header';
        
        const version = document.createElement('div');
        version.className = 'as-version-item__version';
        version.textContent = `v${note.version}-${note.stage}`;
        
        const categoryBadge = document.createElement('span');
        categoryBadge.className = `as-version-item__category as-badge--${getCategoryClass(note.category)}`;
        categoryBadge.textContent = getCategoryName(note.category);
        
        header.appendChild(version);
        header.appendChild(categoryBadge);
        
        const date = document.createElement('div');
        date.className = 'as-version-item__date';
        date.textContent = note.date;
        
        const title = document.createElement('div');
        title.className = 'as-version-item__title';
        title.textContent = note.title;
        
        item.appendChild(header);
        item.appendChild(date);
        item.appendChild(title);
        
        return item;
    }
    
    /**
     * Mostra detalhes da versão no painel direito
     */
    function showVersionDetails(note) {
        const detailPanel = rootElement.querySelector('#patchNotesDetailPanel');
        if (!detailPanel) return;
        
        detailPanel.innerHTML = '';
        
        // Header com versão e data
        const header = document.createElement('div');
        header.className = 'as-detail-header';
        header.innerHTML = `
            <h2 class="as-detail-title">${note.title}</h2>
            <div class="as-detail-meta">
                <span class="as-detail-version">v${note.version}-${note.stage}</span>
                <span class="as-detail-date">${note.date}</span>
            </div>
        `;
        detailPanel.appendChild(header);
        
        // NÃO adicionar resumo aqui - ele vai aparecer só na aba Resumo
        
        // Organizar seções por categoria
        const categorizedSections = {
            summary: { title: 'Resumo', icon: '📖', items: [] },
            added: { title: 'Adicionados', icon: '✨', items: [] },
            removed: { title: 'Removidos', icon: '❌', items: [] },
            improvements: { title: 'Melhorias', icon: '🔧', items: [] },
            fixes: { title: 'Correções', icon: '🐛', items: [] }
        };
        
        // Agrupar items por categoria
        note.sections.forEach(section => {
            const category = section.category || 'summary';
            if (categorizedSections[category]) {
                categorizedSections[category].items.push(...section.items);
            }
        });
        
        // Criar abas de categoria
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'as-detail-tabs';
        
        const contentContainer = document.createElement('div');
        contentContainer.className = 'as-detail-contents';
        
        let firstTab = true;
        Object.entries(categorizedSections).forEach(([key, data]) => {
            // Pular categorias vazias
            if (data.items.length === 0 && key !== 'summary') return;
            
            // Criar aba
            const tab = document.createElement('button');
            tab.className = 'as-detail-tab' + (firstTab ? ' active' : '');
            tab.dataset.category = key;
            tab.innerHTML = `
                <span class="as-detail-tab__icon">${data.icon}</span>
                <span class="as-detail-tab__text">${data.title}</span>
                ${data.items.length > 0 ? `<span class="as-detail-tab__count">${data.items.length}</span>` : ''}
            `;
            
            tabsContainer.appendChild(tab);
            
            // Criar conteúdo
            const content = document.createElement('div');
            content.className = 'as-detail-content' + (firstTab ? ' active' : '');
            content.dataset.category = key;
            
            // Evento de clique (após content ser criado)
            tab.addEventListener('click', (e) => {
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                
                // Desativar todas
                tabsContainer.querySelectorAll('.as-detail-tab').forEach(t => t.classList.remove('active'));
                contentContainer.querySelectorAll('.as-detail-content').forEach(c => c.classList.remove('active'));
                
                // Ativar clicada
                tab.classList.add('active');
                content.classList.add('active');
                
                logger.info(`Aba ativada: ${data.title} (${key})`);
            });
            
            if (key === 'summary' && note.description) {
                content.innerHTML = `<div class="as-detail-summary-content">${parseMarkdown(note.description)}</div>`;
            } else if (data.items.length > 0) {
                const itemsList = document.createElement('div');
                itemsList.className = 'as-patchnote__items--enhanced';
                
                // Agrupar por subseção
                const bySubsection = {};
                data.items.forEach(item => {
                    const sub = item.subsection || 'Geral';
                    if (!bySubsection[sub]) bySubsection[sub] = [];
                    bySubsection[sub].push(item);
                });
                
                Object.entries(bySubsection).forEach(([subsection, items]) => {
                    if (Object.keys(bySubsection).length > 1) {
                        const subHeader = document.createElement('h4');
                        subHeader.className = 'as-detail-subsection';
                        subHeader.textContent = subsection;
                        itemsList.appendChild(subHeader);
                    }
                    
                    items.forEach(item => {
                        const itemCard = document.createElement('div');
                        itemCard.className = `as-patchnote__item--card type-${item.type}`;
                        
                        const badge = document.createElement('span');
                        badge.className = `as-badge as-badge--${item.type}`;
                        badge.innerHTML = getBadgeText(item.type);
                        
                        const text = document.createElement('span');
                        text.className = 'as-patchnote__item-text';
                        text.innerHTML = parseMarkdown(item.text);
                        
                        itemCard.appendChild(badge);
                        itemCard.appendChild(text);
                        itemsList.appendChild(itemCard);
                    });
                });
                
                content.appendChild(itemsList);
            }
            
            contentContainer.appendChild(content);
            firstTab = false;
        });
        
        detailPanel.appendChild(tabsContainer);
        detailPanel.appendChild(contentContainer);
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
        // Se já for um nome completo, retornar direto
        const fullNames = [
            'Base Inicial',
            'Grande Atualização',
            'Pequena Atualização',
            'Correções Importantes',
            'Correções Pequenas'
        ];
        
        if (fullNames.includes(category)) {
            return category;
        }
        
        // Caso contrário, mapear códigos para nomes
        const categories = {
            'base': 'Base Inicial',
            'major': 'Grande Atualização',
            'minor': 'Pequena Atualização',
            'critical': 'Correções Importantes',
            'fix': 'Correções Pequenas',
            'other': 'Outro'
        };
        return categories[category] || 'Outro';
    }
    
    function getCategoryClass(category) {
        // Mapear nome completo para código CSS
        const classMap = {
            'Base Inicial': 'base',
            'Grande Atualização': 'major',
            'Pequena Atualização': 'minor',
            'Correções Importantes': 'critical',
            'Correções Pequenas': 'fix'
        };
        
        return classMap[category] || 'other';
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

    function showStageSelection() {
        if (!rootElement) {
            return;
        }

        // Limpar estágio atual
        currentStage = null;
        currentCategory = 'all';

        const versionList = rootElement.querySelector('#patchNotesVersionList');
        const detailPanel = rootElement.querySelector('#patchNotesDetailPanel');
        const titleElement = rootElement.querySelector('.as-patchnotes__title');
        
        if (!versionList || !detailPanel) {
            return;
        }

        // Atualizar título
        if (titleElement) {
            titleElement.textContent = '📜 NOTAS DE ATUALIZAÇÃO';
        }

        // Limpar lista de versões
        versionList.innerHTML = '';

        // Criar botões de seleção de estágios
        for (const stageKey in STAGES) {
            const stage = STAGES[stageKey];
            
            const stageButton = document.createElement('div');
            stageButton.className = 'as-stage-button';
            stageButton.innerHTML = `
                <span class="as-stage-button__emoji">${stage.emoji}</span>
                <div class="as-stage-button__content">
                    <div class="as-stage-button__title">${stage.title}</div>
                    <div class="as-stage-button__description">${stage.description}</div>
                </div>
            `;

            stageButton.addEventListener('click', () => {
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                showVersionList(stage.folder);
            });

            versionList.appendChild(stageButton);
        }

        // Adicionar botão de voltar
        const backButton = document.createElement('div');
        backButton.className = 'as-stage-button as-stage-button--back';
        backButton.innerHTML = `
            <span class="as-stage-button__emoji">⬅️</span>
            <div class="as-stage-button__content">
                <div class="as-stage-button__title">Voltar</div>
            </div>
        `;

        backButton.addEventListener('click', () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCancel();
            }
            closePatchNotes();
        });

        versionList.appendChild(backButton);

        // Limpar painel de detalhes e adicionar instruções
        detailPanel.innerHTML = `
            <div class="as-patchnotes__detail-empty">
                <span class="as-patchnotes__detail-empty-icon">📜</span>
                <p>Selecione um estágio para ver as atualizações</p>
            </div>
        `;
    }

    function showVersionList(stage) {
        if (!rootElement) {
            return;
        }

        const versionList = rootElement.querySelector('#patchNotesVersionList');
        const detailPanel = rootElement.querySelector('#patchNotesDetailPanel');
        const titleElement = rootElement.querySelector('.as-patchnotes__title');
        
        if (!versionList || !detailPanel) {
            return;
        }

        // Encontrar informações do estágio
        const stageInfo = Object.values(STAGES).find(s => s.folder === stage);
        if (!stageInfo) {
            logger.error(`Estágio inválido: ${stage}`);
            return;
        }

        // Definir estágio atual
        currentStage = stage;
        currentCategory = 'all';

        // Atualizar título
        if (titleElement) {
            titleElement.textContent = `${stageInfo.emoji} ${stageInfo.title} - Todas as Versões`;
        }

        // Carregar notas do estágio
        const notes = getPatchNotesData(stage);

        versionList.innerHTML = '';

        if (notes.length === 0) {
            versionList.innerHTML = '<p class="as-patchnotes__empty">Nenhuma atualização neste estágio ainda.</p>';
            detailPanel.innerHTML = `
                <div class="as-patchnotes__detail-empty">
                    <span class="as-patchnotes__detail-empty-icon">${stageInfo.emoji}</span>
                    <p>Nenhuma versão disponível</p>
                </div>
            `;
            
            // Adicionar botão de voltar
            addBackToStagesButton(versionList);
            return;
        }

        // Renderizar lista de versões
        notes.forEach((note, index) => {
            const versionItem = createVersionItem(note);
            
            // Selecionar automaticamente a primeira versão
            if (index === 0) {
                versionItem.classList.add('active');
                showVersionDetails(note);
            }
            
            // Adicionar evento de clique
            versionItem.addEventListener('click', () => {
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                
                // Remover active de todos
                versionList.querySelectorAll('.as-version-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Ativar clicado
                versionItem.classList.add('active');
                showVersionDetails(note);
            });
            
            versionList.appendChild(versionItem);
        });

        // Adicionar botão de voltar
        addBackToStagesButton(versionList);
        
        // Atualizar contadores das abas de categoria
        updateCategoryTabsForStage(notes);
        
        // Atualizar classe active nas abas
        updateActiveTab('all');
        
        // Atualizar indicadores de scroll após renderizar
        setTimeout(() => {
            updateAllScrollIndicators();
        }, 100);
    }

    function filterVersionsByCategory(category, stage) {
        if (!rootElement) return;
        
        currentCategory = category;
        
        const versionList = rootElement.querySelector('#patchNotesVersionList');
        const detailPanel = rootElement.querySelector('#patchNotesDetailPanel');
        
        if (!versionList || !detailPanel) return;
        
        // Carregar todas as notas do estágio
        const allNotes = getPatchNotesData(stage);
        
        // Filtrar por categoria
        const filteredNotes = category === 'all' 
            ? allNotes 
            : allNotes.filter(note => note.category === category);
        
        versionList.innerHTML = '';
        
        if (filteredNotes.length === 0) {
            versionList.innerHTML = '<p class="as-patchnotes__empty">Nenhuma atualização nesta categoria.</p>';
            detailPanel.innerHTML = `
                <div class="as-patchnotes__detail-empty">
                    <span class="as-patchnotes__detail-empty-icon">📋</span>
                    <p>Nenhuma versão disponível</p>
                </div>
            `;
            addBackToStagesButton(versionList);
            return;
        }
        
        // Renderizar lista filtrada
        filteredNotes.forEach((note, index) => {
            const versionItem = createVersionItem(note);
            
            // Selecionar automaticamente a primeira versão
            if (index === 0) {
                versionItem.classList.add('active');
                showVersionDetails(note);
            }
            
            // Adicionar evento de clique
            versionItem.addEventListener('click', () => {
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.playCursor();
                }
                
                versionList.querySelectorAll('.as-version-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                versionItem.classList.add('active');
                showVersionDetails(note);
            });
            
            versionList.appendChild(versionItem);
        });
        
        addBackToStagesButton(versionList);
        updateActiveTab(category);
        
        // Atualizar indicadores de scroll após renderizar
        setTimeout(() => {
            updateAllScrollIndicators();
        }, 100);
    }

    function updateActiveTab(category) {
        if (!rootElement) return;
        
        const tabs = rootElement.querySelectorAll('.as-patchnotes__tab');
        tabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('as-patchnotes__tab--active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('as-patchnotes__tab--active');
                tab.setAttribute('aria-selected', 'false');
            }
        });
    }

    function updateCategoryTabsForStage(notes) {
        if (!rootElement) return;
        
        const tabs = rootElement.querySelectorAll('.as-patchnotes__tab');
        
        tabs.forEach(tab => {
            const tabCategory = tab.dataset.category;
            
            // Calcular contador baseado nas notas do estágio
            const count = tabCategory === 'all' 
                ? notes.length 
                : notes.filter(note => note.category === tabCategory).length;
            
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

    function addBackToStagesButton(container) {
        const backButton = document.createElement('div');
        backButton.className = 'as-version-item as-version-item--back';
        backButton.innerHTML = `
            <div class="as-version-item__header">
                <span class="as-version-item__emoji">⬅️</span>
                <span class="as-version-item__version">Voltar para Estágios</span>
            </div>
        `;

        backButton.addEventListener('click', () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playCancel();
            }
            showStageSelection();
        });

        container.appendChild(backButton);
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
            
            // Habilitar scroll com wheel nos painéis principais
            const versionList = rootElement.querySelector('.as-patchnotes__version-list');
            const detailPanel = rootElement.querySelector('.as-patchnotes__detail-panel');
            
            [versionList, detailPanel].forEach(panel => {
                if (panel) {
                    panel.setAttribute('tabindex', '-1');
                    panel.addEventListener('wheel', (e) => {
                        // Permitir scroll natural
                        const delta = e.deltaY;
                        panel.scrollTop += delta;
                        e.preventDefault();
                        e.stopPropagation();
                    }, { passive: false });
                }
            });
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

            // Verificar se o foco está em um input de texto
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable
            );

            // ESC sempre fecha
            if (event.key === 'Escape') {
                event.preventDefault();
                closePatchNotes();
                return;
            }

            // Backspace volta (apenas se não estiver em input)
            if (event.key === 'Backspace' && !isInputFocused) {
                event.preventDefault();
                
                // Se está em detalhe de versão, volta para lista
                const detailPanel = rootElement.querySelector('#patchNotesDetailPanel');
                const hasVersionDetails = detailPanel && detailPanel.querySelector('.as-detail-header');
                
                if (hasVersionDetails && currentStage) {
                    // Volta para lista de versões do estágio
                    showVersionList(currentStage);
                } else if (currentStage) {
                    // Volta para seleção de estágios
                    showStageSelection();
                } else {
                    // Está na seleção de estágios, fecha
                    closePatchNotes();
                }
                return;
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
