//=============================================================================
// AS_1.4_PatchNotesScreen_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.4] Tela de Atualizações (Patch Notes) - Ancient Souls
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.4
 * @orderAfter AS_1.0_TitleScreen_Agent
 *
 * @param WindowTitle
 * @text Título da Janela
 * @type string
 * @default Atualizações
 * @desc Título exibido na tela de patch notes.
 *
 * @param BackgroundColor
 * @text Cor de Fundo
 * @type string
 * @default #1a1a2e
 * @desc Cor de fundo da tela (formato hexadecimal).
 *
 * @param AccentColor
 * @text Cor de Destaque
 * @type string
 * @default #ffd700
 * @desc Cor de destaque para títulos e bordas (formato hexadecimal).
 *
 * @param PatchNotesPath
 * @text Caminho dos Patch Notes
 * @type string
 * @default js/plugins/assets/patchnotes/
 * @desc Pasta onde os arquivos .md de patch notes estão localizados.
 *
 * @help
 * AS_1.4_PatchNotesScreen_Agent [v1.0.4]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Plugin responsável pela tela de atualizações (Patch Notes) do Ancient Souls.
 * Lê arquivos markdown (.md) de uma pasta e renderiza automaticamente na
 * interface de forma organizada e visualmente atraente.
 * 
 * Características:
 *  - Interface HTML5/CSS3 moderna e elegante
 *  - Parser de arquivos markdown automático
 *  - Sistema de categorização (Grande/Pequena Atualização, Correções, Base)
 *  - Scroll suave para múltiplas versões
 *  - Design responsivo e animado
 *  - Suporte para emojis e formatação rica
 *  - Ordenação automática por versão (mais recente primeiro)
 * 
 * Formato dos arquivos markdown:
 *  Nome: vX.X.X.X-tipo_nome-da-atualizacao.md
 *  Exemplo: v0.0.1.0-alfa_lancamento-inicial.md
 *  
 *  Estrutura:
 *  # [Título]
 *  **Versão:** vX.X.X.X-tipo
 *  **Categoria:** [Categoria]
 *  **Data:** DD/MM/AAAA
 *  ## 📋 Resumo
 *  [Texto do resumo]
 *  ## ✨ Adicionados
 *  - Item 1
 *  ## 🔧 Correções
 *  - Item 1
 *  ## 🗑️ Removidos
 *  - Item 1
 * 
 * Categorias suportadas:
 *  - Grande Atualização
 *  - Pequena Atualização
 *  - Correções Importantes
 *  - Correções Pequenas
 *  - Conteúdo Base
 * 
 * Como usar:
 *  1) Certifique-se de que AS_0.0_PluginManager_Agent está ativo
 *  2) Ative este plugin no Plugin Manager
 *  3) Crie arquivos .md na pasta configurada
 *  4) O plugin lerá e exibirá automaticamente
 * 
 * Dependências:
 *  - AS_0.0_PluginManager_Agent (obrigatório)
 *  - AS_1.0_TitleScreen_Agent (obrigatório)
 * 
 * Observações:
 *  - Usa API do Node.js (fs) para ler arquivos
 *  - Funciona apenas em ambientes desktop (NW.js/Electron)
 *  - Não altere a versão sem autorização de Necromante96Official
 * 
 * ============================================================================
 * Termos de Uso:
 * ============================================================================
 * 
 * Livre para uso em projetos comerciais e não-comerciais.
 * Créditos a Necromante96Official são apreciados, mas não obrigatórios.
 */

//=============================================================================
// Inicialização do Namespace
//=============================================================================

var AS = AS || {};
AS.PatchNotes = AS.PatchNotes || {};

//=============================================================================
// Configurações do Plugin
//=============================================================================

(() => {
    'use strict';
    
    const pluginName = "AS_1.4_PatchNotesScreen_Agent";
    const parameters = PluginManager.parameters(pluginName);
    
    AS.PatchNotes.windowTitle = parameters.WindowTitle || 'Atualizações';
    AS.PatchNotes.backgroundColor = parameters.BackgroundColor || '#1a1a2e';
    AS.PatchNotes.accentColor = parameters.AccentColor || '#ffd700';
    AS.PatchNotes.patchNotesPath = parameters.PatchNotesPath || 'js/plugins/assets/patchnotes/';
    
    // Array para armazenar patch notes carregados
    AS.PatchNotes.versions = [];
    
    //=========================================================================
    // AS.PatchNotes.Parser - Parser de Markdown
    //=========================================================================
    
    class MarkdownParser {
        /**
         * Faz parse de um arquivo markdown de patch note
         * @param {string} content - Conteúdo do arquivo markdown
         * @param {string} filename - Nome do arquivo
         * @returns {object} - Objeto com dados parseados
         */
        static parse(content, filename) {
            const data = {
                filename: filename,
                version: '',
                versionNumber: '',
                title: '',
                category: '',
                date: '',
                summary: '',
                added: [],
                fixed: [],
                removed: []
            };
            
            // Extrai versão do nome do arquivo (vX.X.X.X-tipo)
            const versionMatch = filename.match(/v([\d.]+)-([\w-]+)/);
            if (versionMatch) {
                data.version = `v${versionMatch[1]}-${versionMatch[2]}`;
                data.versionNumber = versionMatch[1];
            }
            
            const lines = content.split('\n');
            let currentSection = null;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                // Título principal (# Título)
                if (line.startsWith('# ') && !data.title) {
                    data.title = line.replace(/^#\s+/, '');
                    continue;
                }
                
                // Metadata (Versão, Categoria, Data)
                if (line.startsWith('**Versão:**')) {
                    data.version = line.replace(/\*\*Versão:\*\*\s*/, '').trim();
                    continue;
                }
                
                if (line.startsWith('**Categoria:**')) {
                    data.category = line.replace(/\*\*Categoria:\*\*\s*/, '').trim();
                    continue;
                }
                
                if (line.startsWith('**Data:**')) {
                    data.date = line.replace(/\*\*Data:\*\*\s*/, '').trim();
                    continue;
                }
                
                // Seções - Formato antigo e novo
                if (line.startsWith('## ') && (
                    line.includes('Resumo') || 
                    line.includes('O que mudou') ||
                    line.includes('📋')
                )) {
                    currentSection = 'summary';
                    continue;
                }
                
                if (line.startsWith('## ') && (
                    line.includes('Adicionados') ||
                    line.includes('O que tem de novo') ||
                    line.includes('✨')
                )) {
                    currentSection = 'added';
                    continue;
                }
                
                if (line.startsWith('## ') && (
                    line.includes('Correções') || 
                    line.includes('Correcoes') ||
                    line.includes('Consertos') ||
                    line.includes('🔧')
                )) {
                    currentSection = 'fixed';
                    continue;
                }
                
                if (line.startsWith('## ') && (
                    line.includes('Removidos') ||
                    line.includes('O que saiu') ||
                    line.includes('🗑️')
                )) {
                    currentSection = 'removed';
                    continue;
                }
                
                // Conteúdo das seções
                if (currentSection === 'summary' && line && !line.startsWith('---') && !line.startsWith('##') && line.length > 0) {
                    data.summary += (data.summary ? ' ' : '') + line;
                }
                
                // Captura items com bullet points (- )
                if (line.startsWith('- ')) {
                    const item = line.replace(/^-\s+/, '').trim();
                    if (currentSection === 'added') {
                        data.added.push(item);
                    } else if (currentSection === 'fixed') {
                        data.fixed.push(item);
                    } else if (currentSection === 'removed') {
                        data.removed.push(item);
                    }
                }
            }
            
            return data;
        }
        
        /**
         * Compara versões para ordenação
         * @param {string} a - Versão A (ex: "0.0.1.0")
         * @param {string} b - Versão B
         * @returns {number} - Resultado da comparação
         */
        static compareVersions(a, b) {
            const partsA = a.split('.').map(Number);
            const partsB = b.split('.').map(Number);
            
            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                const numA = partsA[i] || 0;
                const numB = partsB[i] || 0;
                
                if (numA !== numB) {
                    return numB - numA; // Ordem decrescente (mais recente primeiro)
                }
            }
            
            return 0;
        }
    }
    
    //=========================================================================
    // AS.PatchNotes.FileLoader - Carregador de Arquivos
    //=========================================================================
    
    class PatchNotesFileLoader {
        /**
         * Carrega todos os arquivos .md da pasta de patch notes
         * @returns {Promise<Array>} - Promise com array de patch notes
         */
        static async loadAllPatchNotes() {
            const fs = require('fs');
            const path = require('path');
            
            try {
                // Caminho completo da pasta
                const basePath = path.dirname(process.mainModule.filename);
                const patchNotesDir = path.join(basePath, AS.PatchNotes.patchNotesPath);
                
                AS.PluginManager.log(`[PatchNotes] 📂 Carregando patch notes de: ${patchNotesDir}`);
                
                // Verifica se a pasta existe
                if (!fs.existsSync(patchNotesDir)) {
                    AS.PluginManager.log('[PatchNotes] ⚠️  Pasta de patch notes não encontrada');
                    return [];
                }
                
                // Lê todos os arquivos da pasta
                const files = fs.readdirSync(patchNotesDir);
                const mdFiles = files.filter(f => f.endsWith('.md') && !f.includes('README'));
                
                AS.PluginManager.log(`[PatchNotes] 📄 Encontrados ${mdFiles.length} arquivos .md`);
                
                // Carrega e faz parse de cada arquivo
                const patchNotes = [];
                for (const file of mdFiles) {
                    const filePath = path.join(patchNotesDir, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    const parsed = MarkdownParser.parse(content, file);
                    patchNotes.push(parsed);
                    AS.PluginManager.log(`[PatchNotes] ✓ Carregado: ${file}`);
                }
                
                // Ordena por versão (mais recente primeiro)
                patchNotes.sort((a, b) => {
                    return MarkdownParser.compareVersions(a.versionNumber, b.versionNumber);
                });
                
                AS.PluginManager.log(`[PatchNotes] ✓ ${patchNotes.length} patch notes carregados e ordenados`);
                
                return patchNotes;
                
            } catch (error) {
                AS.PluginManager.log(`[PatchNotes] ❌ Erro ao carregar patch notes: ${error.message}`);
                console.error(error);
                return [];
            }
        }
        
        /**
         * Carrega patch notes de forma síncrona (para inicialização)
         * @returns {Array} - Array de patch notes
         */
        static loadAllPatchNotesSync() {
            const fs = require('fs');
            const path = require('path');
            
            try {
                const basePath = path.dirname(process.mainModule.filename);
                const patchNotesDir = path.join(basePath, AS.PatchNotes.patchNotesPath);
                
                if (!fs.existsSync(patchNotesDir)) {
                    return [];
                }
                
                const files = fs.readdirSync(patchNotesDir);
                const mdFiles = files.filter(f => f.endsWith('.md') && !f.includes('README'));
                
                const patchNotes = [];
                for (const file of mdFiles) {
                    const filePath = path.join(patchNotesDir, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    const parsed = MarkdownParser.parse(content, file);
                    patchNotes.push(parsed);
                }
                
                patchNotes.sort((a, b) => {
                    return MarkdownParser.compareVersions(a.versionNumber, b.versionNumber);
                });
                
                return patchNotes;
                
            } catch (error) {
                console.error('[PatchNotes] Erro ao carregar:', error);
                return [];
            }
        }
    }
    
    //=========================================================================
    // Scene_PatchNotes - Cena de Patch Notes
    //=========================================================================
    
    class Scene_PatchNotes extends Scene_MenuBase {
        constructor() {
            super();
            this._htmlContainer = null;
        }
        
        create() {
            Scene_MenuBase.prototype.create.call(this);
            this.log('Criando Scene_PatchNotes...');
            
            // Carrega patch notes dos arquivos markdown
            this.loadPatchNotes();
            
            this.createCustomInterface();
        }
        
        loadPatchNotes() {
            this.log('📂 Carregando patch notes dos arquivos markdown...');
            
            try {
                AS.PatchNotes.versions = PatchNotesFileLoader.loadAllPatchNotesSync();
                this.log(`✓ ${AS.PatchNotes.versions.length} patch notes carregados`);
            } catch (error) {
                this.log(`❌ Erro ao carregar patch notes: ${error.message}`);
                AS.PatchNotes.versions = [];
            }
        }
        
        createBackground() {
            Scene_MenuBase.prototype.createBackground.call(this);
            // Aplica escurecimento ao background
            this.setBackgroundOpacity(220);
        }
        
        createCustomInterface() {
            this.log('Criando interface customizada de Patch Notes...');
            
            // Cria container HTML
            this.createHTMLContainer();
            
            // Injeta estilos
            this.injectStyles();
            
            // Cria conteúdo
            this.createContent();
            
            this.log('✓ Interface criada');
        }
        
        createHTMLContainer() {
            // Remove container antigo se existir
            const existingContainer = document.getElementById('as-patchnotes-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            
            this._htmlContainer = document.createElement('div');
            this._htmlContainer.id = 'as-patchnotes-container';
            this._htmlContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                pointer-events: auto;
                overflow: hidden;
            `;
            
            // Variável para armazenar categoria selecionada
            this._selectedCategory = 'all';
            
            document.body.appendChild(this._htmlContainer);
        }
        
        injectStyles() {
            // Remove estilos antigos
            const oldStyle = document.getElementById('as-patchnotes-styles');
            if (oldStyle) {
                oldStyle.remove();
            }
            
            const style = document.createElement('style');
            style.id = 'as-patchnotes-styles';
            style.textContent = `
                /* ═══════════════════════════════════════════════════════════ */
                /* ANCIENT SOULS - LAYOUT PATCH NOTES MEDIEVAL                */
                /* Layout: Sidebar + Content Area + Category Buttons           */
                /* ═══════════════════════════════════════════════════════════ */
                
                /* Fonte GameFont (Pixel Times) */
                @font-face {
                    font-family: 'GameFont';
                    src: url('fonts/GameFont.woff') format('woff'),
                         url('fonts/GameFont.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
                
                /* Container Principal */
                #as-patchnotes-container {
                    font-family: 'GameFont', sans-serif;
                    color: #e8d4a0;
                    user-select: none;
                    background: #0a0a0f;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow: hidden;
                }
                
                /* Header com Título e Botões de Categoria */
                .as-patchnotes-header {
                    padding: 25px 40px 20px 40px;
                    border-bottom: 2px solid ${AS.PatchNotes.accentColor};
                    background: linear-gradient(to bottom, 
                        rgba(20, 20, 25, 0.9) 0%, 
                        rgba(10, 10, 15, 0.95) 100%);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
                    z-index: 10;
                }
                
                .as-patchnotes-title {
                    font-size: 38px;
                    font-weight: bold;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 
                        0 0 15px rgba(255, 215, 0, 0.6),
                        2px 2px 4px rgba(0, 0, 0, 0.9);
                    margin: 0 0 18px 0;
                    letter-spacing: 8px;
                    text-transform: uppercase;
                    text-align: center;
                }
                
                /* Botões de Categoria (Filtros) */
                .as-category-filters {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                
                .as-filter-button {
                    padding: 10px 24px;
                    font-size: 16px;
                    font-weight: bold;
                    color: rgba(232, 212, 160, 0.8);
                    background: linear-gradient(to bottom, 
                        rgba(60, 55, 45, 0.8) 0%, 
                        rgba(40, 35, 28, 0.9) 100%);
                    border: 2px solid rgba(100, 85, 60, 0.6);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
                    box-shadow: 
                        0 3px 8px rgba(0, 0, 0, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.08);
                    letter-spacing: 1px;
                }
                
                .as-filter-button:hover {
                    color: ${AS.PatchNotes.accentColor};
                    border-color: rgba(255, 215, 0, 0.6);
                    transform: translateY(-2px);
                    box-shadow: 
                        0 5px 12px rgba(0, 0, 0, 0.8),
                        0 0 15px rgba(255, 215, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
                }
                
                .as-filter-button.active {
                    color: #1a1520;
                    background: linear-gradient(to bottom, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 100%);
                    border-color: rgba(180, 140, 50, 0.9);
                    box-shadow: 
                        0 5px 15px rgba(0, 0, 0, 0.8),
                        0 0 25px rgba(255, 215, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
                    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
                }
                
                /* Container Principal: Sidebar + Content */
                .as-main-container {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                    position: relative;
                }
                
                /* Sidebar de Versões */
                .as-versions-sidebar {
                    width: 280px;
                    background: linear-gradient(to right, 
                        rgba(60, 50, 35, 0.95) 0%, 
                        rgba(50, 42, 30, 0.92) 100%);
                    border-right: 2px solid ${AS.PatchNotes.accentColor};
                    overflow-y: auto;
                    overflow-x: hidden;
                    box-shadow: 4px 0 25px rgba(0, 0, 0, 0.9);
                    padding: 15px 0;
                }
                
                /* Scrollbar Sidebar */
                .as-versions-sidebar::-webkit-scrollbar {
                    width: 10px;
                }
                
                .as-versions-sidebar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.4);
                }
                
                .as-versions-sidebar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 100%);
                    border-radius: 5px;
                }
                
                .as-versions-sidebar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, 
                        #ffed4e 0%, 
                        ${AS.PatchNotes.accentColor} 100%);
                }
                
                /* Item de Versão na Sidebar */
                .as-version-item {
                    padding: 14px 18px;
                    margin: 4px 10px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    border-left: 3px solid transparent;
                    background: rgba(0, 0, 0, 0.25);
                    border-radius: 3px;
                }
                
                .as-version-item:hover {
                    background: rgba(255, 215, 0, 0.12);
                    border-left-color: ${AS.PatchNotes.accentColor};
                    transform: translateX(4px);
                }
                
                .as-version-item.active {
                    background: linear-gradient(to right, 
                        rgba(255, 215, 0, 0.25) 0%, 
                        rgba(255, 215, 0, 0.08) 100%);
                    border-left-color: ${AS.PatchNotes.accentColor};
                    box-shadow: 
                        inset 0 0 20px rgba(255, 215, 0, 0.15),
                        0 2px 8px rgba(0, 0, 0, 0.4);
                }
                
                .as-version-item-number {
                    font-size: 18px;
                    font-weight: bold;
                    color: ${AS.PatchNotes.accentColor};
                    margin-bottom: 4px;
                    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
                }
                
                .as-version-item-title {
                    font-size: 13px;
                    color: rgba(232, 212, 160, 0.85);
                    line-height: 1.3;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                
                .as-version-item-date {
                    font-size: 11px;
                    color: rgba(212, 175, 55, 0.65);
                    margin-top: 4px;
                    font-style: italic;
                }
                
                /* Área de Conteúdo */
                .as-content-area {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 35px 45px 120px 45px;
                    position: relative;
                    background: #0f0f14;
                    scroll-behavior: smooth;
                }
                
                /* Scrollbar do Conteúdo - MELHORADO */
                .as-content-area::-webkit-scrollbar {
                    width: 16px;
                }
                
                .as-content-area::-webkit-scrollbar-track {
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
                    border-left: 1px solid rgba(212, 175, 55, 0.2);
                }
                
                .as-content-area::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 50%, 
                        #8b6914 100%);
                    border-radius: 8px;
                    border: 2px solid rgba(212, 175, 55, 0.3);
                    box-shadow: 
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        0 0 10px rgba(255, 215, 0, 0.5),
                        inset 0 0 5px rgba(0, 0, 0, 0.3);
                    min-height: 40px;
                }
                
                .as-content-area::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, 
                        #ffed4e 0%, 
                        ${AS.PatchNotes.accentColor} 50%, 
                        #d4af37 100%);
                    border-color: rgba(255, 237, 78, 0.6);
                    box-shadow: 
                        inset 0 1px 0 rgba(255, 255, 255, 0.4),
                        0 0 15px rgba(255, 215, 0, 0.8),
                        inset 0 0 8px rgba(0, 0, 0, 0.3);
                }
                
                .as-content-area::-webkit-scrollbar-thumb:active {
                    background: linear-gradient(to bottom, 
                        #ffed4e 0%, 
                        #ffd700 50%, 
                        ${AS.PatchNotes.accentColor} 100%);
                    box-shadow: 
                        inset 0 1px 0 rgba(255, 255, 255, 0.5),
                        0 0 20px rgba(255, 215, 0, 1),
                        inset 0 0 10px rgba(0, 0, 0, 0.3);
                }
                
                /* Firefox Scrollbar */
                .as-content-area {
                    scrollbar-width: thin;
                    scrollbar-color: linear-gradient(to bottom, ${AS.PatchNotes.accentColor}, #8b6914) rgba(0, 0, 0, 0.4);
                }

                
                /* Card de Versão Detalhada */
                .as-version-detail {
                    display: none;
                    animation: fadeIn 0.5s ease-out;
                }
                
                .as-version-detail.active {
                    display: block;
                }
                
                .as-detail-header {
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid;
                    border-image: linear-gradient(to right, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        transparent 100%) 1;
                }
                
                .as-detail-version {
                    font-size: 38px;
                    font-weight: bold;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 
                        0 0 15px rgba(255, 215, 0, 0.8),
                        2px 2px 4px rgba(0, 0, 0, 0.9);
                    margin-bottom: 10px;
                }
                
                .as-detail-title {
                    font-size: 26px;
                    color: #e8d4a0;
                    margin-bottom: 15px;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
                }
                
                .as-detail-meta {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .as-detail-date {
                    font-size: 16px;
                    color: rgba(212, 175, 55, 0.9);
                    font-style: italic;
                }
                
                .as-detail-category {
                    display: inline-block;
                    padding: 8px 22px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #1a1520;
                    background: linear-gradient(to bottom, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 100%);
                    border: none;
                    border-radius: 20px;
                    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.25);
                    box-shadow: 
                        0 3px 10px rgba(0, 0, 0, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        0 0 20px rgba(255, 215, 0, 0.3);
                }
                
                /* Resumo */
                .as-detail-summary {
                    padding: 20px 25px;
                    margin: 25px 0;
                    background: rgba(255, 215, 0, 0.05);
                    border-left: 3px solid ${AS.PatchNotes.accentColor};
                    font-size: 16px;
                    line-height: 1.7;
                    color: rgba(232, 212, 160, 0.95);
                    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
                }
                
                /* Seções de Mudanças */
                .as-changes-section {
                    margin: 30px 0;
                }
                
                .as-changes-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                    position: relative;
                    padding-bottom: 10px;
                }
                
                .as-changes-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 36px;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, 
                        currentColor 0%, 
                        transparent 100%);
                    opacity: 0.5;
                }
                
                .as-changes-title.added {
                    color: #7bc850;
                }
                
                .as-changes-title.fixed {
                    color: #5ba3d0;
                }
                
                .as-changes-title.removed {
                    color: #d66a5c;
                }
                
                .as-changes-title::before {
                    content: '';
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: currentColor;
                    box-shadow: 
                        0 0 20px currentColor,
                        inset 0 0 10px rgba(0, 0, 0, 0.5);
                    flex-shrink: 0;
                }
                
                .as-changes-list {
                    list-style: none;
                    padding-left: 40px;
                }
                
                .as-changes-list li {
                    font-size: 18px;
                    color: rgba(232, 212, 160, 0.95);
                    margin-bottom: 12px;
                    position: relative;
                    padding-left: 25px;
                    line-height: 1.7;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .as-changes-list li::before {
                    content: '◈';
                    position: absolute;
                    left: 0;
                    color: ${AS.PatchNotes.accentColor};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${AS.PatchNotes.accentColor};
                }
                
                /* Mensagem de Seleção */
                .as-select-version {
                    text-align: center;
                    padding: 100px 20px;
                    font-size: 28px;
                    color: rgba(212, 175, 55, 0.7);
                    font-style: italic;
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
                    letter-spacing: 2px;
                }
                
                .as-select-version::before,
                .as-select-version::after {
                    content: '◆◆◆';
                    display: block;
                    margin: 20px 0;
                    opacity: 0.5;
                    font-size: 20px;
                }
                
                /* Botão de Fechar */
                .as-close-button {
                    position: fixed;
                    bottom: 35px;
                    right: 50px;
                    padding: 14px 45px;
                    font-size: 20px;
                    font-weight: bold;
                    color: #1a1520;
                    background: linear-gradient(to bottom, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 100%);
                    border: none;
                    cursor: pointer;
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.25);
                    box-shadow: 
                        0 6px 25px rgba(0, 0, 0, 0.8),
                        inset 0 1px 0 rgba(255, 255, 255, 0.35),
                        0 0 25px rgba(255, 215, 0, 0.25);
                    z-index: 1001;
                    clip-path: polygon(
                        12px 0%, calc(100% - 12px) 0%, 
                        100% 50%, 
                        calc(100% - 12px) 100%, 12px 100%, 
                        0% 50%
                    );
                    letter-spacing: 3px;
                    text-transform: uppercase;
                }
                
                .as-close-button::before {
                    content: '◆';
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.4);
                }
                
                .as-close-button::after {
                    content: '◆';
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.4);
                }
                
                .as-close-button:hover {
                    background: linear-gradient(to bottom, 
                        #ffed4e 0%, 
                        ${AS.PatchNotes.accentColor} 100%);
                    transform: translateY(-4px) scale(1.04);
                    box-shadow: 
                        0 10px 35px rgba(0, 0, 0, 0.9),
                        inset 0 2px 0 rgba(255, 255, 255, 0.5),
                        0 0 40px rgba(255, 215, 0, 0.5);
                }
                
                .as-close-button:active {
                    transform: translateY(-1px) scale(1.01);
                    box-shadow: 
                        0 4px 18px rgba(0, 0, 0, 0.8),
                        inset 0 0 15px rgba(0, 0, 0, 0.2);
                }
                
                /* Animações */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Responsividade */
                @media (max-width: 1024px) {
                    .as-versions-sidebar {
                        width: 220px;
                    }
                    
                    .as-content-area {
                        padding: 30px 35px 100px 35px;
                    }
                }
                
                @media (max-width: 768px) {
                    .as-patchnotes-header {
                        padding: 20px 20px 15px 20px;
                    }
                    
                    .as-patchnotes-title {
                        font-size: 32px;
                        letter-spacing: 2px;
                    }
                    
                    .as-filter-button {
                        font-size: 16px;
                        padding: 10px 20px;
                    }
                    
                    .as-main-container {
                        flex-direction: column;
                    }
                    
                    .as-versions-sidebar {
                        width: 100%;
                        max-height: 200px;
                        border-right: none;
                        border-bottom: 3px solid ${AS.PatchNotes.accentColor};
                    }
                    
                    .as-content-area {
                        padding: 20px 20px 100px 20px;
                    }
                    
                    .as-close-button {
                        bottom: 20px;
                        right: 20px;
                        font-size: 20px;
                        padding: 15px 40px;
                    }
                }
            `;
            
            document.head.appendChild(style);
            this.log('✓ Estilos injetados');
        }
        
        createContent() {
            // Header com Título e Filtros de Categoria
            const header = document.createElement('div');
            header.className = 'as-patchnotes-header';
            
            const title = document.createElement('div');
            title.className = 'as-patchnotes-title';
            title.textContent = AS.PatchNotes.windowTitle;
            
            // Botões de Categoria (Filtros)
            const filtersContainer = document.createElement('div');
            filtersContainer.className = 'as-category-filters';
            
            const categories = [
                { id: 'all', label: 'Todas' },
                { id: 'Grande Atualização', label: 'Grandes' },
                { id: 'Pequena Atualização', label: 'Pequenas' },
                { id: 'Correções Importantes', label: 'Correções' },
                { id: 'Correções Pequenas', label: 'Pequenas Correções' },
                { id: 'Conteúdo Base', label: 'Base' }
            ];
            
            categories.forEach((cat, index) => {
                const btn = document.createElement('div');
                btn.className = 'as-filter-button';
                if (index === 0) btn.classList.add('active'); // "Todas" ativo por padrão
                btn.textContent = cat.label;
                btn.setAttribute('data-category', cat.id);
                btn.addEventListener('click', () => {
                    this.filterVersions(cat.id);
                    // Atualiza visual dos botões
                    document.querySelectorAll('.as-filter-button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    SoundManager.playCursor();
                });
                filtersContainer.appendChild(btn);
            });
            
            header.appendChild(title);
            header.appendChild(filtersContainer);
            this._htmlContainer.appendChild(header);
            
            // Container Principal: Sidebar + Content
            const mainContainer = document.createElement('div');
            mainContainer.className = 'as-main-container';
            
            // Sidebar com lista de versões
            const sidebar = document.createElement('div');
            sidebar.className = 'as-versions-sidebar';
            sidebar.id = 'as-versions-sidebar';
            
            if (AS.PatchNotes.versions.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.style.padding = '40px 20px';
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.color = 'rgba(212, 175, 55, 0.7)';
                emptyMessage.style.fontStyle = 'italic';
                emptyMessage.textContent = 'Nenhuma atualização encontrada...';
                sidebar.appendChild(emptyMessage);
            } else {
                AS.PatchNotes.versions.forEach((versionData, index) => {
                    const item = this.createSidebarItem(versionData, index);
                    sidebar.appendChild(item);
                });
            }
            
            mainContainer.appendChild(sidebar);
            
            // Área de Conteúdo
            const contentArea = document.createElement('div');
            contentArea.className = 'as-content-area';
            contentArea.id = 'as-content-area';
            
            // Adiciona evento de scroll com o mouse
            contentArea.addEventListener('wheel', (e) => {
                e.preventDefault();
                contentArea.scrollTop += e.deltaY;
            }, { passive: false });
            
            if (AS.PatchNotes.versions.length === 0) {
                // Mensagem de "em breve"
                const selectMsg = document.createElement('div');
                selectMsg.className = 'as-select-version';
                selectMsg.textContent = 'Em breve, as atualizações do jogo serão listadas aqui...';
                contentArea.appendChild(selectMsg);
            } else {
                // Mensagem inicial de seleção
                const selectMsg = document.createElement('div');
                selectMsg.className = 'as-select-version';
                selectMsg.id = 'as-select-message';
                selectMsg.textContent = 'Selecione uma versão ao lado para ver os detalhes';
                contentArea.appendChild(selectMsg);
                
                // Cria detalhes de todas as versões (ocultos por padrão)
                AS.PatchNotes.versions.forEach((versionData, index) => {
                    const detail = this.createVersionDetail(versionData, index);
                    contentArea.appendChild(detail);
                });
            }
            
            mainContainer.appendChild(contentArea);
            this._htmlContainer.appendChild(mainContainer);
            
            // Botão de Fechar
            const closeButton = document.createElement('div');
            closeButton.className = 'as-close-button';
            closeButton.textContent = 'Fechar';
            closeButton.addEventListener('click', () => this.onBackButton());
            closeButton.addEventListener('mouseenter', () => this.playCursorSound());
            
            this._htmlContainer.appendChild(closeButton);
            
            this.log('✓ Conteúdo criado');
        }
        
        createSidebarItem(data, index) {
            const item = document.createElement('div');
            item.className = 'as-version-item';
            item.id = `as-sidebar-item-${index}`;
            item.setAttribute('data-category', data.category || 'Conteúdo Base');
            item.setAttribute('data-index', index);
            
            const versionNumber = document.createElement('div');
            versionNumber.className = 'as-version-item-number';
            versionNumber.textContent = data.version;
            
            const versionTitle = document.createElement('div');
            versionTitle.className = 'as-version-item-title';
            versionTitle.textContent = data.title || 'Atualização';
            versionTitle.title = data.title || 'Atualização'; // Tooltip com título completo
            
            const versionDate = document.createElement('div');
            versionDate.className = 'as-version-item-date';
            versionDate.textContent = data.date;
            
            item.appendChild(versionNumber);
            item.appendChild(versionTitle);
            item.appendChild(versionDate);
            
            // Evento de clique
            item.addEventListener('click', () => {
                this.showVersionDetail(index);
                SoundManager.playCursor();
            });
            
            return item;
        }
        
        createVersionDetail(data, index) {
            const detail = document.createElement('div');
            detail.className = 'as-version-detail';
            detail.id = `as-version-detail-${index}`;
            detail.setAttribute('data-category', data.category || 'Conteúdo Base');
            
            // Header do Detalhe
            const detailHeader = document.createElement('div');
            detailHeader.className = 'as-detail-header';
            
            const detailVersion = document.createElement('div');
            detailVersion.className = 'as-detail-version';
            detailVersion.textContent = data.version;
            
            const detailTitle = document.createElement('div');
            detailTitle.className = 'as-detail-title';
            detailTitle.textContent = data.title || 'Atualização';
            
            const detailMeta = document.createElement('div');
            detailMeta.className = 'as-detail-meta';
            
            const detailDate = document.createElement('div');
            detailDate.className = 'as-detail-date';
            detailDate.textContent = data.date;
            
            detailMeta.appendChild(detailDate);
            
            if (data.category) {
                const detailCategory = document.createElement('div');
                detailCategory.className = 'as-detail-category';
                detailCategory.textContent = data.category;
                detailMeta.appendChild(detailCategory);
            }
            
            detailHeader.appendChild(detailVersion);
            detailHeader.appendChild(detailTitle);
            detailHeader.appendChild(detailMeta);
            detail.appendChild(detailHeader);
            
            // Resumo
            if (data.summary) {
                const summary = document.createElement('div');
                summary.className = 'as-detail-summary';
                summary.textContent = data.summary;
                detail.appendChild(summary);
            }
            
            // Seções de Mudanças
            if (data.added && data.added.length > 0) {
                detail.appendChild(this.createChangesSection('✨ Adicionados', data.added, 'added'));
            }
            
            if (data.fixed && data.fixed.length > 0) {
                detail.appendChild(this.createChangesSection('🔧 Correções', data.fixed, 'fixed'));
            }
            
            if (data.removed && data.removed.length > 0) {
                detail.appendChild(this.createChangesSection('🗑️ Removidos', data.removed, 'removed'));
            }
            
            return detail;
        }
        
        createChangesSection(title, items, type) {
            const section = document.createElement('div');
            section.className = 'as-changes-section';
            
            const sectionTitle = document.createElement('div');
            sectionTitle.className = `as-changes-title ${type}`;
            sectionTitle.textContent = title;
            
            const list = document.createElement('ul');
            list.className = 'as-changes-list';
            
            for (const item of items) {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            }
            
            section.appendChild(sectionTitle);
            section.appendChild(list);
            
            return section;
        }
        
        showVersionDetail(index) {
            // Esconde mensagem de seleção
            const selectMsg = document.getElementById('as-select-message');
            if (selectMsg) {
                selectMsg.style.display = 'none';
            }
            
            // Esconde todos os detalhes
            document.querySelectorAll('.as-version-detail').forEach(detail => {
                detail.classList.remove('active');
            });
            
            // Remove "active" de todos os itens da sidebar
            document.querySelectorAll('.as-version-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Mostra detalhe selecionado
            const selectedDetail = document.getElementById(`as-version-detail-${index}`);
            if (selectedDetail) {
                selectedDetail.classList.add('active');
                
                // Scroll suave para o topo do conteúdo
                const contentArea = document.getElementById('as-content-area');
                if (contentArea) {
                    contentArea.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            
            // Marca item da sidebar como ativo
            const selectedItem = document.getElementById(`as-sidebar-item-${index}`);
            if (selectedItem) {
                selectedItem.classList.add('active');
            }
            
            this.log(`Versão ${index} selecionada`);
        }
        
        filterVersions(categoryId) {
            const sidebar = document.getElementById('as-versions-sidebar');
            const contentArea = document.getElementById('as-content-area');
            
            if (!sidebar || !contentArea) return;
            
            if (categoryId === 'all') {
                // Mostra todos
                document.querySelectorAll('.as-version-item, .as-version-detail').forEach(el => {
                    el.style.display = '';
                });
            } else {
                // Filtra por categoria
                document.querySelectorAll('.as-version-item').forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    item.style.display = (itemCategory === categoryId) ? '' : 'none';
                });
                
                document.querySelectorAll('.as-version-detail').forEach(detail => {
                    const detailCategory = detail.getAttribute('data-category');
                    detail.style.display = (detailCategory === categoryId) ? '' : 'none';
                });
                
                // Esconde todos os detalhes e mostra mensagem de seleção
                document.querySelectorAll('.as-version-detail').forEach(detail => {
                    detail.classList.remove('active');
                });
                
                const selectMsg = document.getElementById('as-select-message');
                if (selectMsg) {
                    selectMsg.style.display = '';
                }
                
                // Remove seleção da sidebar
                document.querySelectorAll('.as-version-item').forEach(item => {
                    item.classList.remove('active');
                });
            }
            
            this.log(`Filtro aplicado: ${categoryId}`);
        }
        
        onBackButton() {
            this.log('Voltando para tela anterior...');
            this.playOkSound();
            this.popScene();
        }
        
        update() {
            Scene_MenuBase.prototype.update.call(this);
            
            // Input de cancelamento (ESC, X, etc)
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                this.onBackButton();
            }
        }
        
        terminate() {
            Scene_MenuBase.prototype.terminate.call(this);
            
            // Remove container HTML
            if (this._htmlContainer && this._htmlContainer.parentNode) {
                this._htmlContainer.remove();
            }
            
            // Remove estilos
            const style = document.getElementById('as-patchnotes-styles');
            if (style) {
                style.remove();
            }
            
            this.log('Scene_PatchNotes terminada');
        }
        
        playCursorSound() {
            if (typeof SoundManager !== 'undefined' && SoundManager.playCursor) {
                SoundManager.playCursor();
            }
        }
        
        playOkSound() {
            if (typeof SoundManager !== 'undefined' && SoundManager.playOk) {
                SoundManager.playOk();
            }
        }
        
        log(message) {
            AS.PluginManager.log(`[PatchNotes Scene] ${message}`);
        }
    }
    
    // Registra a cena globalmente
    window.Scene_PatchNotes = Scene_PatchNotes;
    
    //=========================================================================
    // Registro do Agente
    //=========================================================================
    
    AS.PluginManager.register('AS_1.4_PatchNotesScreen', {
        name: 'PatchNotes Screen Manager',
        version: '1.0.4',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Gerenciador da tela de atualizações com layout sidebar + content area',
        dependencies: ['AS_0.0_PluginManager', 'AS_1.0_TitleScreen'],
        init: () => {
            AS.PluginManager.log('[PatchNotes] Sistema de Patch Notes com Sidebar Layout inicializado');
            return Scene_PatchNotes;
        },
        cleanup: () => {
            AS.PluginManager.log('[PatchNotes] Cleanup não necessário para Scene');
        }
    });
    
})();

//=============================================================================
// Fim do AS_1.4_PatchNotesScreen_Agent.js
//=============================================================================
