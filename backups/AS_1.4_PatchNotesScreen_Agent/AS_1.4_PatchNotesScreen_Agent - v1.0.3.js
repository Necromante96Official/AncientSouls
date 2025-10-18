//=============================================================================
// AS_1.4_PatchNotesScreen_Agent.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [v1.0.3] Tela de Atualizações (Patch Notes) - Ancient Souls
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version 1.0.3
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
 * AS_1.4_PatchNotesScreen_Agent [v1.0.3]
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
                
                // Seções
                if (line.includes('## ') && line.includes('Resumo')) {
                    currentSection = 'summary';
                    continue;
                }
                
                if (line.includes('## ') && line.includes('Adicionados')) {
                    currentSection = 'added';
                    continue;
                }
                
                if (line.includes('## ') && (line.includes('Correções') || line.includes('Correcoes'))) {
                    currentSection = 'fixed';
                    continue;
                }
                
                if (line.includes('## ') && line.includes('Removidos')) {
                    currentSection = 'removed';
                    continue;
                }
                
                // Conteúdo das seções
                if (currentSection === 'summary' && line && !line.startsWith('---') && !line.startsWith('##')) {
                    data.summary += (data.summary ? ' ' : '') + line;
                }
                
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
                overflow-y: auto;
                overflow-x: hidden;
            `;
            
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
                /* ANCIENT SOULS - REDESIGN MEDIEVAL/VINTAGE ÉPICO             */
                /* ═══════════════════════════════════════════════════════════ */
                
                /* Container Principal */
                #as-patchnotes-container {
                    font-family: 'GameFont', sans-serif;
                    color: #e8d4a0;
                    user-select: none;
                    background: 
                        radial-gradient(ellipse at top, rgba(139, 69, 19, 0.15) 0%, transparent 60%),
                        linear-gradient(135deg, #0a0a0f 0%, #1a1520 50%, #0f0f1a 100%);
                    padding: 0;
                    box-sizing: border-box;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow-x: hidden;
                }
                
                /* Ornamento de fundo sutil */
                #as-patchnotes-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: 
                        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 215, 0, 0.02) 2px, rgba(255, 215, 0, 0.02) 4px);
                    pointer-events: none;
                    z-index: 0;
                }
                
                /* Scrollbar Medieval Customizada */
                #as-patchnotes-container::-webkit-scrollbar {
                    width: 14px;
                }
                
                #as-patchnotes-container::-webkit-scrollbar-track {
                    background: linear-gradient(to right, 
                        rgba(139, 69, 19, 0.3) 0%, 
                        rgba(0, 0, 0, 0.5) 50%, 
                        rgba(139, 69, 19, 0.3) 100%);
                    border-left: 1px solid rgba(255, 215, 0, 0.2);
                    border-right: 1px solid rgba(255, 215, 0, 0.2);
                }
                
                #as-patchnotes-container::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 50%, 
                        #8b6914 100%);
                    border: 2px solid rgba(0, 0, 0, 0.5);
                    border-radius: 0;
                    box-shadow: 
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        0 0 10px rgba(255, 215, 0, 0.5);
                }
                
                #as-patchnotes-container::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, 
                        #ffed4e 0%, 
                        ${AS.PatchNotes.accentColor} 50%, 
                        #d4af37 100%);
                    box-shadow: 
                        inset 0 1px 0 rgba(255, 255, 255, 0.5),
                        0 0 15px rgba(255, 215, 0, 0.8);
                }
                
                /* Cabeçalho Medieval Ornamentado */
                .as-patchnotes-header {
                    position: relative;
                    text-align: center;
                    padding: 40px 20px 30px 20px;
                    margin-bottom: 40px;
                    background: linear-gradient(to bottom, 
                        rgba(139, 69, 19, 0.2) 0%, 
                        transparent 100%);
                    border-bottom: 3px double ${AS.PatchNotes.accentColor};
                    box-shadow: 
                        0 0 30px rgba(255, 215, 0, 0.1),
                        inset 0 -1px 0 rgba(255, 215, 0, 0.3);
                    animation: fadeInDown 0.8s ease-out;
                    z-index: 1;
                }
                
                /* Ornamento superior do título */
                .as-patchnotes-header::before {
                    content: '◆';
                    position: absolute;
                    top: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 20px;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 0 0 10px ${AS.PatchNotes.accentColor};
                }
                
                .as-patchnotes-title {
                    font-size: 48px;
                    font-weight: bold;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 
                        0 0 20px rgba(255, 215, 0, 0.8),
                        2px 2px 0 rgba(139, 69, 19, 0.5),
                        4px 4px 8px rgba(0, 0, 0, 0.9);
                    margin: 0 0 15px 0;
                    letter-spacing: 6px;
                    text-transform: uppercase;
                    position: relative;
                    display: inline-block;
                }
                
                /* Ornamentos laterais do título */
                .as-patchnotes-title::before,
                .as-patchnotes-title::after {
                    content: '═══';
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 24px;
                    color: ${AS.PatchNotes.accentColor};
                    opacity: 0.6;
                }
                
                .as-patchnotes-title::before {
                    left: -100px;
                }
                
                .as-patchnotes-title::after {
                    right: -100px;
                }
                
                .as-patchnotes-subtitle {
                    font-size: 18px;
                    color: rgba(232, 212, 160, 0.9);
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
                    font-style: italic;
                    letter-spacing: 2px;
                }
                
                /* Container de Versões com Moldura */
                .as-versions-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 30px 150px 30px;
                    position: relative;
                    z-index: 1;
                    animation: fadeInUp 1s ease-out;
                }
                
                /* Card de Versão Estilo Pergaminho Medieval */
                .as-version-card {
                    position: relative;
                    background: 
                        linear-gradient(135deg, 
                            rgba(42, 35, 28, 0.95) 0%, 
                            rgba(28, 24, 20, 0.98) 50%, 
                            rgba(35, 30, 25, 0.95) 100%);
                    border: 3px solid;
                    border-image: linear-gradient(135deg, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 25%,
                        ${AS.PatchNotes.accentColor} 50%, 
                        #8b6914 75%,
                        ${AS.PatchNotes.accentColor} 100%) 1;
                    padding: 35px;
                    margin-bottom: 35px;
                    box-shadow: 
                        0 15px 40px rgba(0, 0, 0, 0.7),
                        inset 0 0 60px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 215, 0, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    clip-path: polygon(
                        0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px,
                        100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px)
                    );
                }
                
                /* Efeito de textura de pergaminho */
                .as-version-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: 
                        repeating-linear-gradient(90deg, 
                            transparent, transparent 2px, 
                            rgba(255, 215, 0, 0.01) 2px, 
                            rgba(255, 215, 0, 0.01) 4px);
                    pointer-events: none;
                    opacity: 0.5;
                }
                
                /* Cantos ornamentados */
                .as-version-card::after {
                    content: '◆';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    font-size: 12px;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 0 0 10px ${AS.PatchNotes.accentColor};
                }
                
                .as-version-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 
                        0 20px 50px rgba(0, 0, 0, 0.9),
                        inset 0 0 80px rgba(0, 0, 0, 0.4),
                        0 0 30px rgba(255, 215, 0, 0.4),
                        0 0 0 2px ${AS.PatchNotes.accentColor};
                    border-image: linear-gradient(135deg, 
                        #ffed4e 0%, 
                        ${AS.PatchNotes.accentColor} 25%,
                        #ffed4e 50%, 
                        ${AS.PatchNotes.accentColor} 75%,
                        #ffed4e 100%) 1;
                }
                
                /* Header da Versão com Brasão */
                .as-version-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid;
                    border-image: linear-gradient(to right, 
                        transparent 0%, 
                        ${AS.PatchNotes.accentColor} 20%, 
                        ${AS.PatchNotes.accentColor} 80%, 
                        transparent 100%) 1;
                    flex-wrap: wrap;
                    gap: 15px;
                    position: relative;
                }
                
                /* Ornamento central do header */
                .as-version-header::after {
                    content: '◆';
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 14px;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 0 0 10px ${AS.PatchNotes.accentColor};
                    background: rgba(28, 24, 20, 1);
                    padding: 0 10px;
                }
                
                .as-version-number {
                    font-size: 34px;
                    font-weight: bold;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 
                        0 0 15px rgba(255, 215, 0, 0.8),
                        2px 2px 4px rgba(0, 0, 0, 0.9);
                    font-family: 'GameFont', monospace;
                    letter-spacing: 2px;
                }
                    font-size: 32px;
                    font-weight: bold;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 0 0 10px ${AS.PatchNotes.accentColor};
                }
                
                .as-version-date {
                    font-size: 18px;
                    color: rgba(212, 175, 55, 0.9);
                    font-style: italic;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .as-version-title {
                    font-size: 28px;
                    color: #e8d4a0;
                    margin-bottom: 25px;
                    text-shadow: 
                        1px 1px 0 rgba(139, 69, 19, 0.8),
                        3px 3px 6px rgba(0, 0, 0, 0.9);
                    font-weight: bold;
                    letter-spacing: 1px;
                    position: relative;
                    padding-left: 20px;
                }
                
                /* Marcador decorativo do título */
                .as-version-title::before {
                    content: '❖';
                    position: absolute;
                    left: 0;
                    color: ${AS.PatchNotes.accentColor};
                    text-shadow: 0 0 10px ${AS.PatchNotes.accentColor};
                }
                
                /* Badge de Categoria Estilo Brasão */
                .as-category-badge {
                    display: inline-block;
                    padding: 10px 25px;
                    margin-bottom: 25px;
                    color: #1a1520;
                    font-size: 16px;
                    font-weight: bold;
                    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
                    box-shadow: 
                        0 6px 15px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(0, 0, 0, 0.4);
                    position: relative;
                    clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%);
                    letter-spacing: 1px;
                }
                
                /* Ornamentos do badge */
                .as-category-badge::before {
                    content: '◆';
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 10px;
                    color: rgba(0, 0, 0, 0.5);
                }
                
                .as-category-badge::after {
                    content: '◆';
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 10px;
                    color: rgba(0, 0, 0, 0.5);
                }
                
                /* Resumo Estilo Pergaminho */
                .as-version-summary {
                    padding: 25px;
                    margin-bottom: 30px;
                    background: 
                        linear-gradient(to right, 
                            rgba(139, 69, 19, 0.15) 0%, 
                            rgba(255, 215, 0, 0.08) 50%, 
                            rgba(139, 69, 19, 0.15) 100%);
                    border-left: 4px solid ${AS.PatchNotes.accentColor};
                    border-right: 4px solid ${AS.PatchNotes.accentColor};
                    font-size: 18px;
                    line-height: 1.8;
                    color: rgba(232, 212, 160, 0.95);
                    font-style: italic;
                    box-shadow: 
                        inset 0 0 20px rgba(0, 0, 0, 0.3),
                        0 4px 10px rgba(0, 0, 0, 0.3);
                    position: relative;
                }
                
                /* Aspas decorativas */
                .as-version-summary::before {
                    content: '"';
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    font-size: 48px;
                    color: rgba(255, 215, 0, 0.2);
                    font-family: Georgia, serif;
                    line-height: 1;
                }
                
                .as-version-summary::after {
                    content: '"';
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    font-size: 48px;
                    color: rgba(255, 215, 0, 0.2);
                    font-family: Georgia, serif;
                    line-height: 1;
                }
                
                /* Seções de Mudanças com Ícones Medievais */
                .as-changes-section {
                    margin-bottom: 25px;
                    position: relative;
                    padding-left: 10px;
                }
                
                .as-changes-category {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                    position: relative;
                    padding-bottom: 10px;
                }
                
                /* Linha decorativa sob categoria */
                .as-changes-category::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 40px;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, 
                        currentColor 0%, 
                        transparent 100%);
                    opacity: 0.5;
                }
                
                .as-changes-category.added {
                    color: #7bc850;
                }
                
                .as-changes-category.fixed {
                    color: #5ba3d0;
                }
                
                .as-changes-category.removed {
                    color: #d66a5c;
                }
                
                .as-changes-category::before {
                    content: '';
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: currentColor;
                    box-shadow: 
                        0 0 20px currentColor,
                        inset 0 0 10px rgba(0, 0, 0, 0.5);
                    border: 2px solid rgba(0, 0, 0, 0.3);
                    flex-shrink: 0;
                }
                
                .as-changes-list {
                    list-style: none;
                    padding-left: 45px;
                }
                
                .as-changes-list li {
                    font-size: 18px;
                    color: rgba(232, 212, 160, 0.95);
                    margin-bottom: 12px;
                    position: relative;
                    padding-left: 30px;
                    line-height: 1.7;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .as-changes-list li::before {
                    content: '◈';
                    position: absolute;
                    left: 0;
                    color: ${AS.PatchNotes.accentColor};
                    font-size: 18px;
                    text-shadow: 0 0 8px ${AS.PatchNotes.accentColor};
                }
                
                /* Mensagem "Em breve" Estilizada */
                .as-coming-soon {
                    text-align: center;
                    padding: 100px 20px;
                    font-size: 28px;
                    color: rgba(212, 175, 55, 0.7);
                    font-style: italic;
                    animation: pulse 2s ease-in-out infinite;
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
                    letter-spacing: 2px;
                }
                
                .as-coming-soon::before,
                .as-coming-soon::after {
                    content: '◆◆◆';
                    display: block;
                    margin: 20px 0;
                    opacity: 0.5;
                    font-size: 20px;
                }
                
                /* Botão de Voltar Estilo Medieval Épico */
                .as-back-button {
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 18px 55px;
                    font-size: 24px;
                    font-weight: bold;
                    color: #1a1520;
                    background: linear-gradient(to bottom, 
                        ${AS.PatchNotes.accentColor} 0%, 
                        #d4af37 50%, 
                        #8b6914 100%);
                    border: 3px solid rgba(0, 0, 0, 0.6);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
                    box-shadow: 
                        0 8px 30px rgba(0, 0, 0, 0.7),
                        inset 0 1px 0 rgba(255, 255, 255, 0.4),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.4),
                        0 0 30px rgba(255, 215, 0, 0.3);
                    z-index: 1001;
                    animation: fadeInUp 1.2s ease-out;
                    clip-path: polygon(15px 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0% 50%);
                    letter-spacing: 3px;
                    text-transform: uppercase;
                }
                
                /* Ornamentos do botão */
                .as-back-button::before {
                    content: '◆';
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 16px;
                    color: rgba(0, 0, 0, 0.5);
                }
                
                .as-back-button::after {
                    content: '◆';
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 16px;
                    color: rgba(0, 0, 0, 0.5);
                }
                
                .as-back-button:hover {
                    background: linear-gradient(to bottom, 
                        #ffed4e 0%, 
                        ${AS.PatchNotes.accentColor} 50%, 
                        #d4af37 100%);
                    transform: translateX(-50%) translateY(-6px) scale(1.05);
                    box-shadow: 
                        0 12px 40px rgba(0, 0, 0, 0.9),
                        inset 0 2px 0 rgba(255, 255, 255, 0.6),
                        inset 0 -2px 0 rgba(0, 0, 0, 0.6),
                        0 0 50px rgba(255, 215, 0, 0.6);
                    border-color: rgba(0, 0, 0, 0.8);
                }
                
                .as-back-button:active {
                    transform: translateX(-50%) translateY(-2px) scale(1.02);
                    box-shadow: 
                        0 6px 20px rgba(0, 0, 0, 0.8),
                        inset 0 0 20px rgba(0, 0, 0, 0.3);
                }
                
                /* ═══════════════════════════════════════════════════════════ */
                /* ANIMAÇÕES MEDIEVAIS                                         */
                /* ═══════════════════════════════════════════════════════════ */
                
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.7;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.02);
                    }
                }
                
                /* ═══════════════════════════════════════════════════════════ */
                /* RESPONSIVIDADE                                               */
                /* ═══════════════════════════════════════════════════════════ */
                
                @media (max-width: 768px) {
                    #as-patchnotes-container {
                        padding: 0;
                    }
                    
                    .as-patchnotes-header {
                        padding: 30px 15px 25px 15px;
                        margin-bottom: 30px;
                    }
                    
                    .as-patchnotes-title {
                        font-size: 36px;
                        letter-spacing: 3px;
                    }
                    
                    .as-patchnotes-title::before,
                    .as-patchnotes-title::after {
                        content: '═';
                        font-size: 18px;
                    }
                    
                    .as-patchnotes-title::before {
                        left: -40px;
                    }
                    
                    .as-patchnotes-title::after {
                        right: -40px;
                    }
                    
                    .as-patchnotes-subtitle {
                        font-size: 16px;
                        letter-spacing: 1px;
                    }
                    
                    .as-versions-container {
                        padding: 0 15px 120px 15px;
                    }
                    
                    .as-version-card {
                        padding: 25px 20px;
                        margin-bottom: 25px;
                    }
                    
                    .as-version-number {
                        font-size: 28px;
                    }
                    
                    .as-version-title {
                        font-size: 24px;
                        padding-left: 18px;
                    }
                    
                    .as-changes-category {
                        font-size: 20px;
                        gap: 12px;
                    }
                    
                    .as-changes-list {
                        padding-left: 35px;
                    }
                    
                    .as-changes-list li {
                        font-size: 16px;
                        padding-left: 25px;
                    }
                    
                    .as-version-summary {
                        padding: 20px;
                        font-size: 16px;
                    }
                    
                    .as-back-button {
                        bottom: 25px;
                        font-size: 20px;
                        padding: 15px 45px;
                        letter-spacing: 2px;
                    }
                    
                    .as-coming-soon {
                        font-size: 22px;
                        padding: 70px 15px;
                    }
                }
                
                /* Telas menores */
                @media (max-width: 480px) {
                    .as-patchnotes-title {
                        font-size: 28px;
                        letter-spacing: 2px;
                    }
                    
                    .as-version-card {
                        padding: 20px 15px;
                    }
                    
                    .as-version-number {
                        font-size: 24px;
                    }
                    
                    .as-version-title {
                        font-size: 20px;
                    }
                    
                    .as-back-button {
                        font-size: 18px;
                        padding: 12px 35px;
                        clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%);
                    }
                }
            `;
            
            document.head.appendChild(style);
            this.log('✓ Estilos injetados');
        }
        
        createContent() {
            // Header
            const header = document.createElement('div');
            header.className = 'as-patchnotes-header';
            
            const title = document.createElement('div');
            title.className = 'as-patchnotes-title';
            title.textContent = AS.PatchNotes.windowTitle;
            
            const subtitle = document.createElement('div');
            subtitle.className = 'as-patchnotes-subtitle';
            subtitle.textContent = 'Histórico de mudanças e melhorias';
            
            header.appendChild(title);
            header.appendChild(subtitle);
            this._htmlContainer.appendChild(header);
            
            // Container de versões
            const versionsContainer = document.createElement('div');
            versionsContainer.className = 'as-versions-container';
            
            if (AS.PatchNotes.versions.length === 0) {
                // Mensagem de "em breve"
                const comingSoon = document.createElement('div');
                comingSoon.className = 'as-coming-soon';
                comingSoon.textContent = 'Em breve, as atualizações do jogo serão listadas aqui...';
                versionsContainer.appendChild(comingSoon);
            } else {
                // Renderiza versões
                for (const versionData of AS.PatchNotes.versions) {
                    const card = this.createVersionCard(versionData);
                    versionsContainer.appendChild(card);
                }
            }
            
            this._htmlContainer.appendChild(versionsContainer);
            
            // Botão de voltar
            const backButton = document.createElement('div');
            backButton.className = 'as-back-button';
            backButton.textContent = 'Voltar';
            backButton.addEventListener('click', () => this.onBackButton());
            backButton.addEventListener('mouseenter', () => this.playCursorSound());
            
            this._htmlContainer.appendChild(backButton);
            
            this.log('✓ Conteúdo criado');
        }
        
        createVersionCard(data) {
            const card = document.createElement('div');
            card.className = 'as-version-card';
            
            // Header da versão
            const header = document.createElement('div');
            header.className = 'as-version-header';
            
            const versionNumber = document.createElement('div');
            versionNumber.className = 'as-version-number';
            versionNumber.textContent = data.version;
            
            const versionDate = document.createElement('div');
            versionDate.className = 'as-version-date';
            versionDate.textContent = data.date;
            
            header.appendChild(versionNumber);
            header.appendChild(versionDate);
            card.appendChild(header);
            
            // Título da versão
            if (data.title) {
                const versionTitle = document.createElement('div');
                versionTitle.className = 'as-version-title';
                versionTitle.textContent = data.title;
                card.appendChild(versionTitle);
            }
            
            // Categoria
            if (data.category) {
                const categoryBadge = document.createElement('div');
                categoryBadge.className = 'as-category-badge';
                categoryBadge.textContent = data.category;
                categoryBadge.style.cssText = `
                    display: inline-block;
                    padding: 5px 15px;
                    margin-bottom: 15px;
                    border-radius: 20px;
                    background: ${this.getCategoryColor(data.category)};
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                `;
                card.appendChild(categoryBadge);
            }
            
            // Resumo
            if (data.summary) {
                const summary = document.createElement('div');
                summary.className = 'as-version-summary';
                summary.style.cssText = `
                    padding: 15px;
                    margin-bottom: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-left: 4px solid ${AS.PatchNotes.accentColor};
                    border-radius: 5px;
                    font-size: 16px;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.9);
                `;
                summary.textContent = data.summary;
                card.appendChild(summary);
            }
            
            // Seções de mudanças
            if (data.added && data.added.length > 0) {
                card.appendChild(this.createChangesSection('✨ Adicionados', data.added, 'added'));
            }
            
            if (data.fixed && data.fixed.length > 0) {
                card.appendChild(this.createChangesSection('🔧 Correções', data.fixed, 'fixed'));
            }
            
            if (data.removed && data.removed.length > 0) {
                card.appendChild(this.createChangesSection('🗑️ Removidos', data.removed, 'removed'));
            }
            
            return card;
        }
        
        getCategoryColor(category) {
            const colors = {
                'Grande Atualização': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'Pequena Atualização': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'Correções Importantes': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'Correções Pequenas': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                'Conteúdo Base': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            };
            
            return colors[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        createChangesSection(title, items, type) {
            const section = document.createElement('div');
            section.className = 'as-changes-section';
            
            const category = document.createElement('div');
            category.className = `as-changes-category ${type}`;
            category.textContent = title;
            
            const list = document.createElement('ul');
            list.className = 'as-changes-list';
            
            for (const item of items) {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            }
            
            section.appendChild(category);
            section.appendChild(list);
            
            return section;
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
        version: '1.0.3',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Gerenciador da tela de atualizações com parser de markdown',
        dependencies: ['AS_0.0_PluginManager', 'AS_1.0_TitleScreen'],
        init: () => {
            AS.PluginManager.log('[PatchNotes] Sistema de Patch Notes com Markdown Parser inicializado');
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
