# Ancient Souls - Sistema Modular de Plugins para RPG Maker MZ# Ancient Souls - Sistema Modular de Plugins para RPG Maker MZ# Ancient Souls - Sistema Modular de Plugins para RPG Maker MZ



**Versão do Documento:** 3.0.0  

**Data de Atualização:** 29 de outubro de 2025  

**Autor:** Necromante96Official & GitHub Copilot  **Versão do Documento:** 3.0.0  **Versão do Documento:** 2.0.0  

**Status:** Arquitetura Baseada em Plugins Existentes  

**Propósito:** Documento de referência para criação de novos plugins**Data de Atualização:** 29 de outubro de 2025  **Data de Atualização:** 19 de outubro de 2025  



---**Autor:** Necromante96Official & GitHub Copilot  **Autor:** Necromante96Official & GitHub Copilot  



## 📋 Sumário**Status:** Arquitetura Baseada em Plugins Existentes  **Status:** Pronto para Desenvolvimento de Plugins  



1. [Visão Geral do Sistema](#visão-geral-do-sistema)**Propósito:** Documento de referência para criação de novos plugins**Propósito:** Documento didático para ensinar IA a entender a arquitetura completa

2. [Estrutura de Arquivos](#estrutura-de-arquivos)

3. [Padrões de Nomenclatura](#padrões-de-nomenclatura)

4. [Anatomia de um Plugin](#anatomia-de-um-plugin)

5. [Sistema de Registro (PluginManager)](#sistema-de-registro-pluginmanager)------

6. [Sistema Pub/Sub de Eventos](#sistema-pubsub-de-eventos)

7. [Hooks em Cenas do RPG Maker](#hooks-em-cenas-do-rpg-maker)

8. [Template para Novo Plugin](#template-para-novo-plugin)

9. [Boas Práticas](#boas-práticas)## 📋 Sumário## Sumário Executivo



---



## Visão Geral do Sistema1. [Visão Geral do Sistema](#visão-geral-do-sistema)O **Ancient Souls** é um **sistema de arquitetura modular escalável** para plugins de RPG Maker MZ. Todo o código é organizado em **agentes independentes** que se comunicam através de um **gerenciador central**. 



O **Ancient Souls** utiliza uma arquitetura modular onde cada plugin (agente) é independente e se comunica através de um gerenciador central (`AS_0.0_PluginManager`).2. [Estrutura de Arquivos](#estrutura-de-arquivos)



### Princípios Fundamentais3. [Padrões de Nomenclatura](#padrões-de-nomenclatura)Este documento não descreve plugins específicos. Ele ensina a **lógica, conceitos e padrões** que qualquer novo plugin deve seguir, para que uma IA (ou desenvolvedor) possa criar novos plugins com consistência total.



1. **Modularidade**: Cada plugin tem responsabilidade única e clara4. [Anatomia de um Plugin](#anatomia-de-um-plugin)

2. **Desacoplamento**: Plugins se comunicam via Pub/Sub, não chamadas diretas

3. **Hierarquia**: Plugins principais (X.0) coordenam sub-plugins (X.1, X.2...)5. [Sistema de Registro (PluginManager)](#sistema-de-registro-pluginmanager)---

4. **Versionamento**: Cada plugin tem sua versão independente

6. [Sistema Pub/Sub de Eventos](#sistema-pubsub-de-eventos)

### Hierarquia Atual do Projeto

7. [Hooks em Cenas do RPG Maker](#hooks-em-cenas-do-rpg-maker)## 📋 Índice

```

AS_0.0_PluginManager  ← Núcleo central8. [Template para Novo Plugin](#template-para-novo-plugin)

    │

    ├── AS_0.1_LogEnhancer  ← Utilitário de logs9. [Boas Práticas](#boas-práticas)1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)

    │

    ├── AS_0.2_SplashScreen  ← Tela de splash inicial2. [Estrutura Modular por Agentes](#estrutura-modular-por-agentes)

    │

    ├── AS_1.0_TitleScreen  ← Agente principal da tela de título---3. [Convenções de Nomenclatura e Organização](#convenções-de-nomenclatura-e-organização)

    │   ├── AS_1.1_TitleScreenUI  ← Sub-agente de interface

    │   ├── AS_1.2_TitleOptions  ← Sub-agente de opções4. [Ciclo de Vida dos Agentes](#ciclo-de-vida-dos-agentes)

    │   ├── AS_1.3_TitleLogoEditor  ← Sub-agente de logo

    │   └── AS_1.4_PatchNotes  ← Sub-agente de patch notes## Visão Geral do Sistema5. [Sistema de Comunicação (Pub/Sub)](#sistema-de-comunicação-pubsub)

```

6. [Versionamento e Controle de Versão](#versionamento-e-controle-de-versão)

---

O **Ancient Souls** utiliza uma arquitetura modular onde cada plugin (agente) é independente e se comunica através de um gerenciador central (`AS_0.0_PluginManager`).7. [Política de Desenvolvimento Obrigatória](#política-de-desenvolvimento-obrigatória)

## Estrutura de Arquivos

8. [Sistema de Logs e Debugging](#sistema-de-logs-e-debugging)

```

js/plugins/### Princípios Fundamentais9. [Fluxo de Navegação e Integração](#fluxo-de-navegação-e-integração)

├── [Plugins principais aqui]

│   ├── AS_0.0_PluginManager.js10. [Governança e Permissões](#governança-e-permissões)

│   ├── AS_0.1_LogEnhancer.js

│   ├── AS_0.2_SplashScreen.js1. **Modularidade**: Cada plugin tem responsabilidade única e clara11. [Próximos Passos e Roadmap](#próximos-passos-e-roadmap)

│   ├── AS_1.0_TitleScreen.js

│   ├── AS_1.1_TitleScreenUI.js2. **Desacoplamento**: Plugins se comunicam via Pub/Sub, não chamadas diretas

│   ├── AS_1.2_TitleOptions.js

│   ├── AS_1.3_TitleLogoEditor.js3. **Hierarquia**: Plugins principais (X.0) coordenam sub-plugins (X.1, X.2...)---

│   ├── AS_1.4_PatchNotes.js

│   └── ...4. **Versionamento**: Cada plugin tem sua versão independente

│

├── assets/## Visão Geral da Arquitetura

│   ├── contents/

│   │   ├── css/           # Arquivos CSS dos plugins### Hierarquia Atual do Projeto

│   │   │   └── AS_1.1_TitleScreenUI.css

│   │   │### Princípios Fundamentais

│   │   ├── html/          # Arquivos HTML dos plugins

│   │   │   └── AS_1.1_TitleScreenUI.html```

│   │   │

│   │   └── patchnotes/    # Arquivos de patch notesAS_0.0_PluginManager  ← Núcleo centralO sistema Ancient Souls foi projetado com base em três pilares:

│   │       └── v1.0.0.0-release.md

│   │    │

│   └── resources/         # Imagens e recursos

│    ├── AS_0.1_LogEnhancer  ← Utilitário de logs1. **Modularidade**: Cada funcionalidade é isolada em um agente independente que pode ser desenvolvido, testado e mantido sem impactar outros componentes.

├── backups/               # Backups versionados

│   ├── AS_0.0_PluginManager/    │

│   ├── AS_0.2_SplashScreen/

│   ├── AS_1.0_TitleScreen/    ├── AS_1.0_TitleScreen  ← Agente principal da tela de título2. **Escalabilidade**: A adição de novos agentes não requer alterações no núcleo do sistema; tudo funciona através de uma arquitetura de dependências automáticas.

│   └── ...

│    │   ├── AS_1.1_TitleScreenUI  ← Sub-agente de interface

├── corescript/            # Scripts core do RPG Maker MZ

│   ├── main.js    │   ├── AS_1.2_TitleOptions  ← Sub-agente de opções3. **Rastreabilidade**: Todas as mudanças, versões e fluxos são registrados em logs estruturados (chatlogs) para fins de auditoria e reversibilidade.

│   ├── plugins.js

│   ├── rmmz_core.js    │   ├── AS_1.3_TitleLogoEditor  ← Sub-agente de logo

│   └── ...

│    │   └── AS_1.4_PatchNotes  ← Sub-agente de patch notes### Diagrama Conceitual da Hierarquia

└── readme/

    └── README.md          # Este arquivo    │

```

    └── AS_1.5_SplashScreen  ← Tela de splash antes do título```

---

```┌─────────────────────────────────────────────────────────────┐

## Padrões de Nomenclatura

│          AS_0.0_PluginManager_Agent (Núcleo Central)       │

### Formato de Nome de Arquivo

---│  Responsabilidades:                                         │

```

AS_X.Y_NomeDescritivo.js│  • Registro de agentes                                      │

```

## Estrutura de Arquivos│  • Resolução de dependências (topologia)                   │

**Onde:**

- `AS` = Prefixo do projeto (Ancient Souls)│  • Sistema Pub/Sub de eventos                             │

- `X` = Nível hierárquico

  - `0` = Núcleo/Utilitários```│  • Controle de versões                                     │

  - `1+` = Sistemas principais

- `Y` = Número sequencial dentro do níveljs/plugins/│  • Ciclo de vida (init, cleanup)                           │

- `NomeDescritivo` = Nome em CamelCase descrevendo a função

├── [Plugins principais aqui]└─────────────────────────────────────────────────────────────┘

**Exemplos Corretos:**

- `AS_0.0_PluginManager.js` ✓ Núcleo central│   ├── AS_0.0_PluginManager.js           │

- `AS_0.2_SplashScreen.js` ✓ Sistema utilitário

- `AS_1.0_TitleScreen.js` ✓ Sistema principal│   ├── AS_0.1_LogEnhancer.js           ├── Agentes Nível 1 ─────────────────────┐

- `AS_1.1_TitleScreenUI.js` ✓ Sub-sistema de UI

│   ├── AS_1.0_TitleScreen.js           │                                         │

**Exemplos Incorretos:**

- `PluginManager.js` ❌ Sem prefixo AS│   ├── AS_1.1_TitleScreenUI.js           ├─ AS_1.0_TitleScreen_Agent              │

- `AS_1_TitleScreen.js` ❌ Sem segundo número

- `AS_1.0_TitleScreen_v1.0.0.js` ❌ Versão no nome│   ├── AS_1.2_TitleOptions.js           │   (Gerenciador Principal da UI)        │



---│   ├── AS_1.3_TitleLogoEditor.js           │   Dependências: AS_0.0                 │



## Anatomia de um Plugin│   ├── AS_1.4_PatchNotes.js           │                                         │



Todos os plugins seguem a mesma estrutura base:│   ├── AS_1.5_SplashScreen.js           │   Sub-agentes (Nível 1.x):             │



### 1. Cabeçalho com Metadados│   └── ...           │   ├─ AS_1.1_TitleScreenUI_Agent        │



```javascript│           │   │  (Interface HTML/CSS)              │

//=============================================================================

// AS_X.Y_NomePlugin.js├── assets/           │   │                                     │

//=============================================================================

/*:│   ├── contents/           │   └─ AS_1.2_TitleScreenEffects_Agent   │

 * @target MZ

 * @plugindesc vX.Y.Z ☆ Descrição curta do plugin│   │   ├── css/           # Arquivos CSS dos plugins           │      (Animações e Efeitos Visuais)     │

 * @author Necromante96Official & GitHub Copilot

 * @orderAfter AS_0.0_PluginManager│   │   │   └── AS_1.1_TitleScreenUI.css           │                                         │

 * @help

 * ==========================================================================│   │   │           ├─ AS_1.3_OptionsScreen_Agent            │

 * 📜 Ancient Souls - Nome do Plugin

 * --------------------------------------------------------------------------│   │   ├── html/          # Arquivos HTML dos plugins           │   (Tela de Opções Customizada)         │

 * Descrição detalhada do que o plugin faz

 * ==========================================================================│   │   │   └── AS_1.1_TitleScreenUI.html           │   Dependências: AS_0.0                 │

 */

```│   │   │           │                                         │



### 2. Namespace Global│   │   └── patchnotes/    # Arquivos de patch notes           └─ AS_1.4_PatchNotesScreen_Agent         │



```javascript│   │       └── v1.0.0.0-release.md               (Tela de Atualizações)               │

var AS = AS || {};

AS.NomePlugin = AS.NomePlugin || {};│   │               Dependências: AS_0.0, AS_1.0         │

```

│   └── resources/         # Imagens e recursos```

### 3. IIFE (Immediately Invoked Function Expression)

│

```javascript

(() => {├── backups/               # Backups versionados---

    'use strict';

    │   ├── AS_0.0_PluginManager/

    const MODULE_ID = 'AS_X.Y_NomePlugin';

    const MODULE_VERSION = 'X.Y.Z';│   ├── AS_1.0_TitleScreen/## Estrutura Modular por Agentes

    const DEPENDENCIES = ['AS_0.0_PluginManager'];

    │   └── ...

    // Logger padronizado

    const logger = {│### O Que é um Agente?

        info(message) {

            console.log(`🎨 [${MODULE_ID}] ${message}`);├── corescript/            # Scripts core do RPG Maker MZ

        },

        warn(message) {│   ├── main.jsUm **agente** é um arquivo JavaScript `.js` autocontido que:

            console.warn(`⚠️ [${MODULE_ID}] ${message}`);

        },│   ├── plugins.js

        error(message) {

            console.error(`❌ [${MODULE_ID}] ${message}`);│   ├── rmmz_core.js- ✓ Representa uma **funcionalidade ou área específica** do jogo

        }

    };│   └── ...- ✓ Implementa sua **própria lógica, estado e ciclo de vida**

    

    // Código do plugin aqui...│- ✓ Se **registra no gerenciador central** (PluginManager)

    

})();└── readme/- ✓ Comunica-se com **outros agentes via Pub/Sub**

```

    └── README.md          # Este arquivo- ✓ Segue **padrões rigorosos de versionamento e documentação**

### 4. Manifesto de Registro

```

```javascript

const manifest = {### Exemplos Genéricos de Agentes

    id: MODULE_ID,

    version: MODULE_VERSION,---

    name: 'Nome Legível do Plugin',

    dependencies: DEPENDENCIES,Para fins didáticos, aqui estão tipos genéricos de agentes que você criará:

    init: context => {

        // Inicialização do plugin## Padrões de Nomenclatura

        logger.info('Inicializando...');

        #### **AS_0.0_NomeDoNucleo (Núcleo Central - Nível 0)**

        return {

            dispose() {### Formato de Nome de Arquivo

                // Limpeza ao desativar

            }**Tipo:** Gerenciador Central  

        };

    },```**Responsabilidade:** Orquestra todo o ecossistema

    cleanup: () => {

        logger.info('Cleanup concluído.');AS_X.Y_NomeDescritivo.js

    }

};```**Características Genéricas:**



AS.PluginManager.register(manifest);- Mantém registro de todos os agentes

```

**Onde:**- Resolve dependências automaticamente (algoritmo topológico)

---

- `AS` = Prefixo do projeto (Ancient Souls)- Previne dependências circulares

## Sistema de Registro (PluginManager)

- `X` = Nível hierárquico- Inicializa agentes em ordem correta

O `AS_0.0_PluginManager` é o núcleo que gerencia todos os plugins.

  - `0` = Núcleo/Utilitários- Fornece Event Bus (Pub/Sub) para comunicação

### Como Registrar um Plugin

  - `1+` = Sistemas principais- Valida compatibilidade de versões

```javascript

AS.PluginManager.register({- `Y` = Número sequencial dentro do nível- Fornece logs estruturados

    id: 'AS_X.Y_MeuPlugin',

    version: '1.0.0',- `NomeDescritivo` = Nome em CamelCase descrevendo a função- Ciclo de vida completo

    name: 'Meu Plugin',

    dependencies: ['AS_0.0_PluginManager'],

    init: context => {

        // context fornece:**Exemplos Corretos:****Padrão:** Sem dependências, funciona de forma autônoma.

        // - context.subscribe(event, callback)

        // - context.publish(event, data)- `AS_0.0_PluginManager.js` ✓ Núcleo central

        // - context.getAgent(id)

        - `AS_1.0_TitleScreen.js` ✓ Sistema principal---

        return {

            dispose() {- `AS_1.1_TitleScreenUI.js` ✓ Sub-sistema de UI

                // Cleanup opcional

            }- `AS_1.5_SplashScreen.js` ✓ Tela de splash#### **AS_X.0_NomePrincipal (Agente Principal - Nível 1)**

        };

    },

    cleanup: () => {

        // Cleanup final**Exemplos Incorretos:****Tipo:** Agente independente com responsabilidade clara  

    }

});- `PluginManager.js` ❌ Sem prefixo AS**Responsabilidade:** Gerenciar um domínio específico

```

- `AS_1_TitleScreen.js` ❌ Sem segundo número

### Dependências

- `AS_1.0_TitleScreen_v1.0.0.js` ❌ Versão no nome**Características Genéricas:**

Plugins podem declarar dependências:

- Orquestra sub-agentes (X.1, X.2, etc)

```javascript

dependencies: [---- Gerencia fluxo de navegação

    'AS_0.0_PluginManager',  // Sempre obrigatório

    'AS_1.0_TitleScreen'     // Outros plugins necessários- Trata entrada do usuário

]

```## Anatomia de um Plugin- Controla camadas visuais



O PluginManager garante que dependências sejam inicializadas primeiro.- Transições suaves



---Todos os plugins seguem a mesma estrutura base:- Responsividade



## Sistema Pub/Sub de Eventos



Os plugins se comunicam através de eventos publicados e assinados.### 1. Cabeçalho com Metadados**Padrão:** Depende de AS_0.0_NomeDoNucleo



### Publicar Evento



```javascript```javascript---

context.publish('nomedoplugin:dominio:acao', { 

    dados: 'aqui' //=============================================================================

});

```// AS_X.Y_NomePlugin.js#### **AS_X.Y_NomeSubagente (Sub-agente - Nível 1.x)**



### Assinar Evento//=============================================================================



```javascript/*:**Tipo:** Especialista em um aspecto específico  

const unsubscribe = context.subscribe('nomedoplugin:dominio:acao', data => {

    console.log('Evento recebido:', data); * @target MZ**Responsabilidade:** Funcionalidade específica controlada por agente pai

});

 * @plugindesc vX.Y.Z ☆ Descrição curta do plugin

// Guardar unsubscribe para cleanup

subscriptions.push(unsubscribe); * @author Necromante96Official & GitHub Copilot**Características Genéricas:**

```

 * @orderAfter AS_0.0_PluginManager- Interface visual (HTML/CSS) ou lógica especializada

### Convenção de Nomes de Eventos

 * @help- Renderização de UI

```

namespace:dominio:acao:alvo * ==========================================================================- Gerenciamento de eventos



Exemplos: * 📜 Ancient Souls - Nome do Plugin- Integração com sistemas do RPG Maker

titlescreen:ui:command        (UI enviou comando)

titlescreen:scene:ready       (Cena está pronta) * --------------------------------------------------------------------------- Cleanup eficiente

titlescreen:scene:terminate   (Cena terminando)

splashscreen:image:loaded     (Imagem carregada) * Descrição detalhada do que o plugin faz- Animações e transições

splashscreen:transition:complete  (Transição completa)

``` * ==========================================================================



### Exemplo Completo */**Padrão:** Depende de AS_0.0 + agente pai (AS_X.0)



```javascript```

init: context => {

    const subscriptions = [];---

    

    // Assinar evento### 2. Namespace Global

    subscriptions.push(

        context.subscribe('titlescreen:ui:command', payload => {### Exemplo de Hierarquia Genérica

            handleCommand(payload.command);

        })```javascript

    );

    var AS = AS || {};```

    // Publicar evento

    context.publish('myplugin:ready', { AS.NomePlugin = AS.NomePlugin || {};┌─────────────────────────────────────────────────────────────┐

        timestamp: Date.now() 

    });```│          AS_0.0_NomeDoNucleo (Núcleo Central)              │

    

    return {│  - Gerencia tudo                                            │

        dispose() {

            // Cancelar todas as assinaturas### 3. IIFE (Immediately Invoked Function Expression)│  - Sem dependências                                         │

            subscriptions.forEach(unsub => unsub());

        }└─────────────────────────────────────────────────────────────┘

    };

}```javascript           │

```

(() => {           ├── AS_1.0_DominioA

---

    'use strict';           │   ├─ Responsabilidade: X

## Hooks em Cenas do RPG Maker

               │   ├─ Depende: AS_0.0

Plugins podem modificar comportamento de cenas existentes.

    const MODULE_ID = 'AS_X.Y_NomePlugin';           │   │

### Padrão de Hook

    const MODULE_VERSION = 'X.Y.Z';           │   ├─ AS_1.1_DominioA_Aspecto1

```javascript

function applySceneHooks(context) {    const DEPENDENCIES = ['AS_0.0_PluginManager'];           │   │  (Especializa em X.1)

    // Salvar método original

    const Original_Method = Scene_Title.prototype.create;               │   │   Depende: AS_0.0, AS_1.0

    

    // Sobrescrever com nova implementação    // Logger padronizado           │   │

    Scene_Title.prototype.create = function() {

        // Chamar método original    const logger = {           │   └─ AS_1.2_DominioA_Aspecto2

        Original_Method.call(this);

                info(message) {           │      (Especializa em X.2)

        // Adicionar comportamento custom

        context.publish('titlescreen:scene:ready', { scene: this });            console.log(`🎨 [${MODULE_ID}] ${message}`);           │       Depende: AS_0.0, AS_1.0

    };

}        },           │

```

        warn(message) {           ├── AS_2.0_DominioB

### Hooks Comuns

            console.warn(`⚠️ [${MODULE_ID}] ${message}`);           │   ├─ Responsabilidade: Y

```javascript

// Hook em criação de cena        },           │   ├─ Depende: AS_0.0

const Scene_Title_create = Scene_Title.prototype.create;

Scene_Title.prototype.create = function() {        error(message) {           │   │

    Scene_Title_create.call(this);

    // Código adicional            console.error(`❌ [${MODULE_ID}] ${message}`);           │   └─ AS_2.1_DominioB_Aspecto1

};

        }           │      (Especializa em Y.1)

// Hook em início de cena

const Scene_Title_start = Scene_Title.prototype.start;    };           │       Depende: AS_0.0, AS_2.0

Scene_Title.prototype.start = function() {

    Scene_Title_start.call(this);               │

    // Código adicional

};    // Código do plugin aqui...           └── AS_3.0_DominioC



// Hook em atualização de cena                   ├─ Responsabilidade: Z

const Scene_Title_update = Scene_Title.prototype.update;

Scene_Title.prototype.update = function() {})();               └─ Depende: AS_0.0, AS_1.0

    Scene_Title_update.call(this);

    // Código adicional``````

};



// Hook em término de cena

const Scene_Title_terminate = Scene_Title.prototype.terminate;### 4. Manifesto de Registro---

Scene_Title.prototype.terminate = function() {

    Scene_Title_terminate.call(this);

    // Código adicional

};```javascript### Convenção de Nomenclatura para Agentes

```

const manifest = {

---

    id: MODULE_ID,A hierarquia **AS_X.Y_Nome** reflete a **estrutura lógica**, não a versão:

## Template para Novo Plugin

    version: MODULE_VERSION,

```javascript

//=============================================================================    name: 'Nome Legível do Plugin',- **AS** = Prefixo de namespace

// AS_X.Y_NomePlugin.js

//=============================================================================    dependencies: DEPENDENCIES,- **X** = Nível hierárquico (0=Núcleo, 1=Principal, 2+=Secundário)

/*:

 * @target MZ    init: context => {- **Y** = Número sequencial dentro do nível

 * @plugindesc v1.0.0 ☆ Descrição curta

 * @author Necromante96Official & GitHub Copilot        // Inicialização do plugin- **Nome** = Descrição clara da responsabilidade

 * @orderAfter AS_0.0_PluginManager

 * @help        logger.info('Inicializando...');

 * ==========================================================================

 * 📜 Ancient Souls - Nome do Plugin        **Exemplos (didáticos, não reais):**

 * --------------------------------------------------------------------------

 * Descrição completa do que o plugin faz e como usar        return {- `AS_0.0_CentralManager.js` ✓ Núcleo

 * ==========================================================================

 */            dispose() {- `AS_1.0_BattleSystem.js` ✓ Agente principal



var AS = AS || {};                // Limpeza ao desativar- `AS_1.1_BattleUI.js` ✓ Sub-agente de 1.0

AS.NomePlugin = AS.NomePlugin || {};

            }- `AS_2.0_InventorySystem.js` ✓ Outro agente principal

(() => {

    'use strict';        };- `AS_2.1_InventoryUI.js` ✓ Sub-agente de 2.0



    const MODULE_ID = 'AS_X.Y_NomePlugin';    },

    const MODULE_VERSION = '1.0.0';

    const DEPENDENCIES = ['AS_0.0_PluginManager'];    cleanup: () => {**Nunca fazer:**



    const logger = {        logger.info('Cleanup concluído.');- `AS_1.0_Battle_v1.0.0.js` ❌ (Versão no nome)

        info(message) {

            console.log(`✨ [${MODULE_ID}] ${message}`);    }- `AS_1.0_Battle_Agent.js` ❌ (Sufixo redundante)

        },

        warn(message) {};- `BattleSystem.js` ❌ (Sem hierarquia)

            console.warn(`⚠️ [${MODULE_ID}] ${message}`);

        },

        error(message) {

            console.error(`❌ [${MODULE_ID}] ${message}`);AS.PluginManager.register(manifest);---

        }

    };```



    const manifest = {## Convenções de Nomenclatura e Organização

        id: MODULE_ID,

        version: MODULE_VERSION,---

        name: 'Nome Legível',

        dependencies: DEPENDENCIES,### Padrão Obrigatório de Nomes de Arquivo

        init: context => {

            logger.info('Inicializando...');## Sistema de Registro (PluginManager)



            const subscriptions = [];**Formato Universal:**



            // Setup aquiO `AS_0.0_PluginManager` é o núcleo que gerencia todos os plugins.```

            setupPlugin(context);

AS_X.Y_NomeDescritivo.js

            // Hooks se necessário

            applyHooks(context);### Como Registrar um Plugin```



            logger.info('Inicialização completa.');



            return {```javascript**Interpretação:**

                dispose() {

                    subscriptions.forEach(unsub => unsub());AS.PluginManager.register({- **AS** = Namespace Ancient Souls (sempre AS)

                    logger.info('Recursos liberados.');

                }    id: 'AS_X.Y_MeuPlugin',- **X.Y** = Hierarquia do agente (não é versão!)

            };

        },    version: '1.0.0',  - X = Nível (0=Núcleo, 1=Principal, 2+=Secundário)

        cleanup: () => {

            logger.info('Cleanup final concluído.');    name: 'Meu Plugin',  - Y = Número sequencial dentro do nível

        }

    };    dependencies: ['AS_0.0_PluginManager'],- **NomeDescritivo** = Descrição clara em CamelCase



    function setupPlugin(context) {    init: context => {- **.js** = Extensão JavaScript

        // Implementar lógica do plugin

    }        // context fornece:



    function applyHooks(context) {        // - context.subscribe(event, callback)⚠️ **Regra Crítica:** Nunca incluir sufixo "_Agent" ou versão no nome. A hierarquia X.Y já comunica tudo.

        // Aplicar hooks se necessário

    }        // - context.publish(event, data)



    AS.PluginManager.register(manifest);        // - context.getAgent(id)**Padrões Corretos:**



})();        - `AS_0.0_PluginManager.js` ✓

```

        return {- `AS_1.0_MainSystem.js` ✓

---

            dispose() {- `AS_1.1_SubComponent.js` ✓

## Boas Práticas

                // Cleanup opcional- `AS_2.0_AnotherSystem.js` ✓

### 1. Sempre use Logger Padronizado

            }

```javascript

// ✓ Bom        };**Padrões Incorretos:**

logger.info('Carregando recursos...');

logger.warn('Recurso não encontrado, usando padrão');    },- `AS_0_PluginManager.js` ❌ (Sem Y)

logger.error('Falha crítica ao inicializar');

    cleanup: () => {- `AS_1.0_PluginManager_Agent.js` ❌ (Sufixo Agent)

// ❌ Ruim

console.log('Loading...');        // Cleanup final- `PluginManager.js` ❌ (Sem prefixo AS)

console.log('ERROR!');

```    }- `AS_1.0_PluginManager_v1.0.0.js` ❌ (Versão no nome)



### 2. Use Emojis Contextuais});



```javascript```### Estrutura de Pastas Padrão

🏰 - Tela de Título

🎨 - Interface/UI

🎬 - Animações/Efeitos/Splash

🎵 - Áudio/Música### Dependências```

⚙️ - Sistema/Configuração

📍 - Eventos importantesjs/plugins/

🗑️ - Cleanup/Limpeza

✨ - Geral/GenéricoPlugins podem declarar dependências:├── [Agentes de Plugin aqui]

```

│   ├── AS_0.0_NomeDoNucleo.js

### 3. Sempre Implemente Cleanup

```javascript│   ├── AS_1.0_NomePrincipal.js

```javascript

return {dependencies: [│   ├── AS_1.1_NomeSub.js

    dispose() {

        // Cancelar assinaturas    'AS_0.0_PluginManager',  // Sempre obrigatório│   └── ...

        subscriptions.forEach(unsub => unsub());

            'AS_1.0_TitleScreen'     // Outros plugins necessários│

        // Remover elementos DOM

        if (this.element) {]├── assets/

            this.element.remove();

        }```│   ├── contents/

        

        // Limpar timers│   │   ├── css/                 # Estilos CSS dos agentes

        if (this.timer) {

            clearInterval(this.timer);O PluginManager garante que dependências sejam inicializadas primeiro.│   │   │   ├── AS_1.0_Principal.css

        }

    }│   │   │   ├── AS_1.1_Sub.css

};

```---│   │   │   └── ...



### 4. Declare Dependências Corretas│   │   │



```javascript## Sistema Pub/Sub de Eventos│   │   └── html/                # Estruturas HTML dos agentes

// ✓ Bom - dependências claras

dependencies: [│   │       ├── AS_1.0_Principal.html

    'AS_0.0_PluginManager',

    'AS_1.0_TitleScreen'Os plugins se comunicam através de eventos publicados e assinados.│   │       ├── AS_1.1_Sub.html

]

│   │       └── ...

// ❌ Ruim - dependências faltando

dependencies: ['AS_0.0_PluginManager']### Publicar Evento│   │

// Mas usa AS_1.0_TitleScreen sem declarar

```│   ├── patchnotes/              # Atualizações do jogo (formato .md)



### 5. Valide Context no Init```javascript│   │   ├── vX.X.X.X-tipo_descricao.md



```javascriptcontext.publish('nomedoplugin:dominio:acao', { │   │   └── ...

init: context => {

    if (!context || !context.subscribe || !context.publish) {    dados: 'aqui' │   │

        throw new Error('Context inválido fornecido ao plugin');

    }});│   └── resources/               # Recursos gráficos

    

    // Continuar normalmente```│       └── [imagens, etc]

}

```│



### 6. Use Strict Mode### Assinar Evento├── chatlogs/                   # Histórico de desenvolvimento



```javascript│   ├── AS_0.0_NomeDoNucleo_chatlog.md

(() => {

    'use strict';  // ✓ Sempre no início da IIFE```javascript│   ├── AS_1.0_NomePrincipal_chatlog.md

    

    // Código do pluginconst unsubscribe = context.subscribe('nomedoplugin:dominio:acao', data => {│   ├── AS_1.1_NomeSub_chatlog.md

})();

```    console.log('Evento recebido:', data);│   └── ...



### 7. Versione Semanticamente});│



```├── corescript/                 # Scripts base do RPG Maker MZ

MAJOR.MINOR.PATCH

// Guardar unsubscribe para cleanup│   └── [Arquivos padrão do RPG Maker]

1.0.0 → 1.0.1  (Bug fix)

1.0.1 → 1.1.0  (Nova funcionalidade)subscriptions.push(unsubscribe);│

1.1.0 → 2.0.0  (Mudança incompatível)

``````└── readme/                     # Documentação



---    └── README.md (Este arquivo!)



## Metadados do Documento### Convenção de Nomes de Eventos```



- **Versão:** 3.0.0

- **Última Atualização:** 29 de outubro de 2025

- **Baseado em:** Plugins existentes do projeto```### Padrão para Arquivos CSS/HTML

- **Autor:** Necromante96Official & GitHub Copilot

namespace:dominio:acao:alvo

---

Se seu agente cria UI, sempre salve em `assets/contents/`:

**Fim do Documento README.md**

Exemplos:

titlescreen:ui:command        (UI enviou comando)```

titlescreen:scene:ready       (Cena está pronta)assets/contents/

titlescreen:scene:terminate   (Cena terminando)├── css/

splashscreen:image:loaded     (Imagem carregada)│   └── AS_X.Y_NomeAgente.css

splashscreen:transition:complete  (Transição completa)│

```└── html/

    └── AS_X.Y_NomeAgente.html

### Exemplo Completo```



```javascript**Nomenclatura:** Sempre use o mesmo nome do agente.

init: context => {

    const subscriptions = [];**Exemplo:**

    - Agente: `AS_1.0_BattleUI.js`

    // Assinar evento- CSS: `assets/contents/css/AS_1.0_BattleUI.css`

    subscriptions.push(- HTML: `assets/contents/html/AS_1.0_BattleUI.html`

        context.subscribe('titlescreen:ui:command', payload => {

            handleCommand(payload.command);## Ciclo de Vida dos Agentes

        })

    );### Fases do Ciclo de Vida

    

    // Publicar eventoCada agente passa por fases bem definidas durante sua existência:

    context.publish('myplugin:ready', { 

        timestamp: Date.now() #### **1. Fase de Registro**

    });

    O agente se registra no PluginManager ao ser carregado.

    return {

        dispose() {**O que ocorre:**

            // Cancelar todas as assinaturas- Arquivo `.js` é lido pelo RPG Maker MZ

            subscriptions.forEach(unsub => unsub());- Código de inicialização (IIFE) é executado

        }- Manifesto do agente é criado com metadados

    };- `AS.PluginManager.register()` é chamado com ID e manifesto

}- PluginManager valida o manifesto

```

**Manifesto Obrigatório Contém:**

---```

{

## Hooks em Cenas do RPG Maker  name: 'Nome Legível',

  version: 'X.Y.Z',

Plugins podem modificar comportamento de cenas existentes.  author: 'Autor',

  description: 'Descrição',

### Padrão de Hook  dependencies: ['AS_0.0_PluginManager', 'AS_1.0_TitleScreen'],

  init: () => { /* retorna instância */ },

```javascript  cleanup: () => { /* limpeza */ }

function applySceneHooks(context) {}

    // Salvar método original```

    const Original_Method = Scene_Title.prototype.create;

    ---

    // Sobrescrever com nova implementação

    Scene_Title.prototype.create = function() {#### **2. Fase de Validação**

        // Chamar método original

        Original_Method.call(this);PluginManager valida o manifesto antes de inicializar.

        

        // Adicionar comportamento custom**Validações Realizadas:**

        context.publish('titlescreen:scene:ready', { scene: this });- Manifesto completo e bem-formado

    };- Dependências declaradas existem e estão registradas

}- Versão segue padrão semântico (X.Y.Z)

```- Sem dependências circulares

- Função `init()` e `cleanup()` são válidas

### Hooks Comuns

**Se Falhar:** O agente não é inicializado e um erro é registrado.

```javascript

// Hook em criação de cena---

const Scene_Title_create = Scene_Title.prototype.create;

Scene_Title.prototype.create = function() {#### **3. Fase de Resolução de Dependências**

    Scene_Title_create.call(this);

    // Código adicionalPluginManager resolve a ordem correta de inicialização.

};

**Algoritmo:** Kahn's Algorithm (Topological Sort)

// Hook em início de cena

const Scene_Title_start = Scene_Title.prototype.start;**Processo:**

Scene_Title.prototype.start = function() {1. Monta grafo de dependências (agente → seus dependentes)

    Scene_Title_start.call(this);2. Encontra nós sem dependências (fonte)

    // Código adicional3. Adiciona à fila de inicialização

};4. Remove nó do grafo

5. Repete até todos os nós serem processados

// Hook em atualização de cena6. Se grafo ainda tiver nós = dependência circular (erro)

const Scene_Title_update = Scene_Title.prototype.update;

Scene_Title.prototype.update = function() {**Resultado:** Lista ordenada de agentes prontos para inicializar.

    Scene_Title_update.call(this);

    // Código adicional---

};

#### **4. Fase de Inicialização**

// Hook em término de cena

const Scene_Title_terminate = Scene_Title.prototype.terminate;Cada agente é inicializado em ordem respeitando dependências.

Scene_Title_terminate.call(this);

    // Código adicional**O que ocorre:**

};- Função `init()` do manifesto é chamada

```- Agente configura seu estado interno

- Se necessário, sub-agentes são inicializados

---- Instância é armazenada no PluginManager

- Agente publica evento "ready"

## Template para Novo Plugin- Logs de sucesso são gerados



```javascript**Estado do Agente:** `initialized = true`

//=============================================================================

// AS_X.Y_NomePlugin.js---

//=============================================================================

/*:#### **5. Fase de Operação**

 * @target MZ

 * @plugindesc v1.0.0 ☆ Descrição curtaAgente está ativo e funcionando normalmente.

 * @author Necromante96Official & GitHub Copilot

 * @orderAfter AS_0.0_PluginManager**O que ocorre:**

 * @help- Agente responde a eventos do sistema

 * ==========================================================================- Assina e publica eventos Pub/Sub

 * 📜 Ancient Souls - Nome do Plugin- Mantém seu estado interno

 * --------------------------------------------------------------------------- Pode ser consultado por outros agentes

 * Descrição completa do que o plugin faz e como usar- Continua durante toda a execução do jogo

 * ==========================================================================

 */**Exemplos:**

- Scene_Title verifica entrada do usuário e reage

var AS = AS || {};- OptionsScreen renderiza e atualiza configurações

AS.NomePlugin = AS.NomePlugin || {};- PatchNotes carrega e exibe dados



(() => {---

    'use strict';

#### **6. Fase de Cleanup/Preparação de Transição**

    const MODULE_ID = 'AS_X.Y_NomePlugin';

    const MODULE_VERSION = '1.0.0';Antes de desativar ou transicionar, agente limpa recursos.

    const DEPENDENCIES = ['AS_0.0_PluginManager'];

**O que ocorre:**

    const logger = {- Função `cleanup()` é chamada

        info(message) {- Listeners de eventos são removidos

            console.log(`✨ [${MODULE_ID}] ${message}`);- Recursos visuais são destruídos (elementos HTML)

        },- Timers/Intervals são cancelados

        warn(message) {- Listeners de teclado/mouse são removidos

            console.warn(`⚠️ [${MODULE_ID}] ${message}`);- Referências são limpas

        },- Canvas e imagens são descartadas

        error(message) {

            console.error(`❌ [${MODULE_ID}] ${message}`);**Objetivo:** Evitar memory leaks e conflitos entre cenas.

        }

    };---



    const manifest = {#### **7. Fase de Desregistro (Opcional)**

        id: MODULE_ID,

        version: MODULE_VERSION,Em casos de recarregamento completo, agente é desregistrado.

        name: 'Nome Legível',

        dependencies: DEPENDENCIES,**O que ocorre:**

        init: context => {- Manifesto é removido do registro

            logger.info('Inicializando...');- Instância é descartada

- Todas as referências são limpas

            const subscriptions = [];- Agente pode ser re-registrado



            // Setup aqui---

            setupPlugin(context);

### Transições Entre Fases

            // Hooks se necessário

            applyHooks(context);```

┌──────────────┐

            logger.info('Inicialização completa.');│  Registro    │

└──────┬───────┘

            return {       │

                dispose() {       v

                    subscriptions.forEach(unsub => unsub());┌──────────────┐

                    logger.info('Recursos liberados.');│  Validação   │

                }└──────┬───────┘

            };       │

        },       v

        cleanup: () => {┌──────────────────────┐

            logger.info('Cleanup final concluído.');│ Resolução Dependen.  │

        }└──────┬───────────────┘

    };       │

       v

    function setupPlugin(context) {┌──────────────┐

        // Implementar lógica do plugin│ Inicialização│

    }└──────┬───────┘

       │

    function applyHooks(context) {       v

        // Aplicar hooks se necessário┌──────────────┐◄─────────────────┐

    }│  Operação    │                  │

└──────┬───────┘                  │

    AS.PluginManager.register(manifest);       │                          │

       ├──► Transição de Cena ────┤

})();       │                          │

```       ├──► Mudança de Estado     │

       │                          │

---       │         ┌─────────────┐  │

       └────────►│  Cleanup    │──┘

## Boas Práticas                 └─────────────┘

```

### 1. Sempre use Logger Padronizado

---

```javascript

// ✓ Bom## Sistema de Comunicação (Pub/Sub)

logger.info('Carregando recursos...');

logger.warn('Recurso não encontrado, usando padrão');### O Padrão Pub/Sub (Publicação/Assinatura)

logger.error('Falha crítica ao inicializar');

O Ancient Souls utiliza um padrão Event Bus baseado em Pub/Sub para comunicação entre agentes, eliminando acoplamento direto.

// ❌ Ruim

console.log('Loading...');### Benefícios

console.log('ERROR!');

```1. **Desacoplamento:** Agentes não precisam conhecer uns aos outros

2. **Escalabilidade:** Novos agentes podem ouvir eventos sem modificar emissores

### 2. Use Emojis Contextuais3. **Manutenibilidade:** Lógica de comunicação centralizada

4. **Debugging:** Todos os eventos passam pelo PluginManager

```javascript

🏰 - Tela de Título### Como Funciona

🎨 - Interface/UI

🎬 - Animações/Efeitos#### **Publicação (Publish)**

🎵 - Áudio/Música

⚙️ - Sistema/ConfiguraçãoUm agente publica um evento para qualquer um que esteja ouvindo:

📍 - Eventos importantes

🗑️ - Cleanup/Limpeza```

✨ - Geral/GenéricoAS.PluginManager.publish('event:name', { data: 'informações' })

``````



### 3. Sempre Implemente Cleanup**Características:**

- Síncrono - todos os assinantes recebem imediatamente

```javascript- Dados podem ser qualquer objeto JavaScript

return {- Não há validação de tipo, confiança em contrato

    dispose() {- Event names seguem padrão kebab-case: `namespace:event:action`

        // Cancelar assinaturas

        subscriptions.forEach(unsub => unsub());**Exemplo Real:**

        ```

        // Remover elementos DOMAS.PluginManager.publish('titlescreen:menu:selected', { 

        if (this.element) {  option: 'newgame',

            this.element.remove();  timestamp: Date.now()

        }})

        ```

        // Limpar timers

        if (this.timer) {---

            clearInterval(this.timer);

        }#### **Assinatura (Subscribe)**

    }

};Um agente se inscreve para receber um evento:

```

```

### 4. Declare Dependências CorretasAS.PluginManager.subscribe('event:name', (data) => {

  // Lida com o evento

```javascript})

// ✓ Bom - dependências claras```

dependencies: [

    'AS_0.0_PluginManager',**Características:**

    'AS_1.0_TitleScreen'- Callback é executado sempre que evento é publicado

]- Múltiplos assinantes podem ouvir o mesmo evento

- Callbacks são armazenados em array

// ❌ Ruim - dependências faltando- Ordem de execução é FIFO (First In, First Out)

dependencies: ['AS_0.0_PluginManager']

// Mas usa AS_1.0_TitleScreen sem declarar**Exemplo Real:**

``````

AS.PluginManager.subscribe('titlescreen:scene:ready', (data) => {

### 5. Valide Context no Init  console.log('Tela de Título está pronta!');

  this.createUI();

```javascript})

init: context => {```

    if (!context || !context.subscribe || !context.publish) {

        throw new Error('Context inválido fornecido ao plugin');---

    }

    #### **Desassinatura (Unsubscribe)**

    // Continuar normalmente

}Um agente remove sua assinatura:

```

```

### 6. Use Strict ModeAS.PluginManager.unsubscribe('event:name', callbackReference)

```

```javascript

(() => {**Características:**

    'use strict';  // ✓ Sempre no início da IIFE- Remove callback específico do array

    - Callback deve ser uma referência válida

    // Código do plugin- Se callback não existir, nada acontece

})();- Essencial para cleanup durante terminate

```

**Exemplo Real:**

### 7. Versione Semanticamente```

// Em cleanup()

```AS.PluginManager.unsubscribe('scene:update', this.onSceneUpdate)

MAJOR.MINOR.PATCH```



1.0.0 → 1.0.1  (Bug fix)---

1.0.1 → 1.1.0  (Nova funcionalidade)

1.1.0 → 2.0.0  (Mudança incompatível)### Convenção de Nomes de Eventos

```

Events seguem hierarquia clara:

---

```

## Metadados do Documentonamespace:domain:action:target

   |        |      |      |

- **Versão:** 3.0.0   |        |      |      └─ Opcional: alvo específico

- **Última Atualização:** 29 de outubro de 2025   |        |      └─ Ação principal

- **Baseado em:** Plugins existentes do projeto   |        └─ Domínio (scene, ui, effects, etc)

- **Autor:** Necromante96Official & GitHub Copilot   └─ Namespace do agente (titlescreen, options, etc)



---Exemplos:

titlescreen:scene:ready           (Scene_Title está pronta)

**Fim do Documento README.md**titlescreen:scene:terminate       (Scene_Title está terminando)

titlescreen:menu:selected         (Menu teve opção selecionada)
titlescreen:cleanup:temp          (Cleanup temporário para transições)
options:slider:changed:volume     (Volume slider foi alterado)
patchnotes:loaded:all            (Todos os patch notes carregados)
```

---

### Mapa de Eventos Padrão (Convenção)

Events no sistema devem seguir este padrão hierárquico:

```
namespace:domain:action:target

Exemplos genéricos:
domain:scene:ready                    (Cena pronta para uso)
domain:scene:terminate                (Cena terminando)
domain:scene:transition               (Transição entre cenas)
domain:ui:element:created             (Elemento UI criado)
domain:ui:element:destroyed           (Elemento UI destruído)
domain:interaction:user:input         (Entrada do usuário)
domain:state:changed                  (Estado mudou)
domain:asset:loaded                   (Recurso carregado)
```

**Padrão de Nomes:**
- Sempre em snake-case (separado por dois-pontos)
- Começar com namespace (AS_X.Y_Nome)
- Depois domínio (scene, ui, game, etc)
- Depois ação (ready, terminate, changed, etc)
- Opcional: alvo específico
---

## Chatlogs - Histórico de Desenvolvimento

### Propósito dos Chatlogs

Cada plugin possui **um único arquivo de chatlog** que registra seu histórico completo de desenvolvimento. Este arquivo é um **histórico cronológico imutável** que documenta todas as mudanças significativas.

### Estrutura de Chatlogs

**Localização:** `js/plugins/chatlogs/`

**Um arquivo por plugin:**
```
chatlogs/
├── AS_0.0_PluginManager_chatlog.md          ← Histórico de Plugin Manager
├── AS_1.0_TitleScreen_chatlog.md            ← Histórico de TitleScreen
├── AS_1.1_TitleScreenUI_chatlog.md          ← Histórico de UI
├── AS_1.2_TitleScreenEffects_chatlog.md     ← Histórico de Effects
├── AS_1.3_OptionsScreen_chatlog.md          ← Histórico de OptionsScreen
└── AS_1.4_PatchNotesScreen_chatlog.md       ← Histórico de PatchNotes
```

⚠️ **REGRA CRÍTICA:** Um chatlog por plugin. Nunca crie `_v1.0.0.md`, `_changelog.md` ou variações.

### Formato de Entrada no Chatlog

**Estrutura Obrigatória:**

```markdown
## [Data: YYYY-MM-DD]
**Autor:** <nome do desenvolvedor>
**Arquivo(s) afetado(s):** <caminho completo do arquivo>
**Ação:** <descrição breve em 3-5 palavras>
**Detalhes:** <descrição completa do que foi feito>
**Versão:** vX.Y.Z (anterior: vX.Y.Z-1)
**Backup criado:** AS_X.Y_NomeDoPluign - vX.Y.Z-1.js
```

**Exemplo Real:**

```markdown
## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** js/plugins/AS_1.3_OptionsScreen.js
**Ação:** Correção - Slider de volume não salva
**Detalhes:** O slider de volume não persistia após salvar opções.
             Implementado callback correto para onChange event e validação
             de range. Testado com valores extremos (0, 100) e intermediários.
             Nenhuma regressão detectada nos demais sliders.
**Versão:** v1.0.10 (anterior: v1.0.9)

---

## [15/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** js/plugins/AS_1.3_OptionsScreen.js
**Ação:** Adição - Novo toggle para notificações
**Detalhes:** Adicionado novo toggle "Notificações" na aba Gameplay.
             UI criada em assets/contents/html/AS_1.3_OptionsScreen.html
             CSS estilizado em assets/contents/css/AS_1.3_OptionsScreen.css
             Compatível com sistema de saves existente.
**Versão:** v1.0.9 (anterior: v1.0.8)
```

### Quando Atualizar o Chatlog

**Atualize quando:**
- ✅ Incrementar versão do plugin (PATCH, MINOR, MAJOR)
- ✅ Corrigir bug importante
- ✅ Adicionar nova funcionalidade
- ✅ Refatorar código significativamente
- ✅ Melhorar performance

**Não é necessário:**
- ❌ Alterar comentários de código
- ❌ Mudar nomes de variáveis internas
- ❌ Adicionar logs de debug
- ❌ Reformatar código (whitespace)

### Exemplo de Evolução Completa

```markdown
# AS_1.3_OptionsScreen.js - Histórico de Desenvolvimento

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** js/plugins/AS_1.3_OptionsScreen.js
**Ação:** Correção - Slider volume
**Detalhes:** Slider de volume não salva valor. Fix implementado.
**Versão:** v1.0.10

---

## [18/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** js/plugins/AS_1.3_OptionsScreen.js, 
                       assets/contents/html/AS_1.3_OptionsScreen.html,
                       assets/contents/css/AS_1.3_OptionsScreen.css
**Ação:** Adição - Sistema de abas
**Detalhes:** Implementado sistema de 3 abas (Áudio, Vídeo, Gameplay).
             UI modularizada em HTML/CSS separado. Transições suaves.
             Compatível com navegação por teclado.
**Versão:** v1.0.9

---

## [10/10/2025]
**Autor:** Necromante96Official
**Arquivo(s) afetado(s):** js/plugins/AS_1.3_OptionsScreen.js
**Ação:** Criação inicial - Plugin
**Detalhes:** Plugin criado. Funcionalidades básicas implementadas.
             UI simples com sliders de volume e toggle de dash.
**Versão:** v1.0.0
```

---

---

---

## Template de Estrutura para Novo Plugin

Este é o **layout recomendado e dinâmico** para criar novos plugins no Ancient Souls.

### Estrutura Modular Completa

**Arquivo Principal:** `js/plugins/AS_X.Y_NomeDoPluign.js`

```javascript
//=============================================================================
// AS_X.Y_NomeDoPluign.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [vX.Y.Z] Descrição curta do plugin - Funcionalidade principal
 * @author 
 *   Necromante96Official & GitHub Copilot
 * @url https://github.com/Necromante96Official/AncientSouls
 * @version X.Y.Z
 * @orderAfter AS_0.0_PluginManager
 * @orderBefore AS_1.1_NomeDoProximo
 *
 * @param ParametroExemplo
 * @text Nome do Parâmetro
 * @type boolean
 * @default false
 * @desc Descrição clara do que este parâmetro controla.
 *
 * @help
 * AS_X.Y_NomeDoPluign [vX.Y.Z]
 * 
 * ============================================================================
 * Descrição:
 * ============================================================================
 * 
 * Descrição detalhada do que o plugin faz, suas responsabilidades
 * e como se integra com o resto do sistema.
 * 
 * Características:
 *  - Funcionalidade 1
 *  - Funcionalidade 2
 *  - Compatibilidade com XXX
 *
 * Como usar:
 *  1) Copie este arquivo para js/plugins/
 *  2) Ative o plugin no Plugin Manager
 *  3) Configure os parâmetros conforme necessário
 *  4) Teste no jogo
 *
 * Dependências:
 *  - AS_0.0_PluginManager (obrigatório)
 * 
 * Observações:
 *  - Informações técnicas importantes
 *  - Limitações conhecidas
 *  - Compatibilidade com outros plugins
 */

//=============================================================================
// NAMESPACE E CONFIGURAÇÃO
//=============================================================================

var AS = AS || {};
AS.NomeDoPluign = AS.NomeDoPluign || {};

(() => {
    'use strict';
    
    const pluginName = "AS_X.Y_NomeDoPluign";
    const parameters = PluginManager.parameters(pluginName);
    
    // Carregar parâmetros
    AS.NomeDoPluign.parametroExemplo = parameters.ParametroExemplo === 'true';
    
    //=========================================================================
    // CLASSE PRINCIPAL DO PLUGIN
    //=========================================================================
    
    /**
     * Classe NomeDoPluignManager
     * Responsabilidade: Gerenciar lógica principal do plugin
     */
    class NomeDoPluignManager {
        constructor() {
            // PT-BR: Inicializar estado do plugin
            this.initialized = false;
        }
        
        /**
         * Inicializar o plugin
         * PT-BR: Chamado ao plugin ser ativado
         */
        init() {
            // PT-BR: Verificar se já foi inicializado
            if (this.initialized) return;
            
            console.log('🎨 [AS_X.Y_NomeDoPluign] Inicializando...');
            
            // PT-BR: Setup de listeners, UI, etc
            this.setupUI();
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('✓ [AS_X.Y_NomeDoPluign] Inicializado com sucesso');
        }
        
        /**
         * Configurar interface do plugin
         */
        setupUI() {
            // PT-BR: Criar elementos HTML/CSS se necessário
            // Se usar HTML/CSS, criar em:
            //   assets/contents/html/AS_X.Y_NomeDoPluign.html
            //   assets/contents/css/AS_X.Y_NomeDoPluign.css
            
            console.log('🎨 UI Setup completo');
        }
        
        /**
         * Configurar listeners de eventos
         */
        setupEventListeners() {
            // PT-BR: Ouvir eventos do PluginManager
            AS.PluginManager.subscribe('evento:name', (data) => {
                this.onEventReceived(data);
            });
            
            console.log('📍 Event listeners configurados');
        }
        
        /**
         * Tratador de eventos
         */
        onEventReceived(data) {
            // PT-BR: Processar evento recebido
            console.log('📍 Evento recebido:', data);
        }
        
        /**
         * Limpeza ao plugin ser desativado
         */
        cleanup() {
            // PT-BR: Remover listeners e limpar recursos
            if (this.initialized) {
                console.log('🗑️ [AS_X.Y_NomeDoPluign] Limpando...');
                
                // PT-BR: Destruir elementos
                // PT-BR: Remover listeners
                // PT-BR: Limpar timers
                
                this.initialized = false;
                console.log('✓ [AS_X.Y_NomeDoPluign] Limpeza completa');
            }
        }
        
        /**
         * Log estruturado
         */
        log(message) {
            console.log(`[AS_X.Y_NomeDoPluign] ${message}`);
        }
    }
    
    //=========================================================================
    // REGISTRO DO PLUGIN NO GERENCIADOR
    //=========================================================================
    
    AS.PluginManager.register('AS_X.Y_NomeDoPluign', {
        name: 'Nome Legível do Plugin',
        version: 'X.Y.Z',
        author: 'Necromante96Official & GitHub Copilot',
        description: 'Descrição clara da responsabilidade do plugin',
        dependencies: ['AS_0.0_PluginManager'],
        init: () => {
            const manager = new NomeDoPluignManager();
            manager.init();
            return manager;
        },
        cleanup: () => {
            const manager = AS.PluginManager.getAgentInstance('AS_X.Y_NomeDoPluign');
            if (manager) {
                manager.cleanup();
            }
        }
    });
    
    //=========================================================================
    // FIM DO PLUGIN
    //=========================================================================
    
})();

//=============================================================================
// Fim de AS_X.Y_NomeDoPluign.js
//=============================================================================
```

### Arquivos Complementares

Se o plugin usa HTML/CSS, criar também:

**`assets/contents/html/AS_X.Y_NomeDoPluign.html`**
```html
<!-- PT-BR: Estrutura HTML do plugin -->
<div id="as-x-y-nomedopluign-container" class="as-container">
    <!-- Elementos aqui -->
</div>
```

**`assets/contents/css/AS_X.Y_NomeDoPluign.css`**
```css
/* PT-BR: Estilos CSS do plugin */
#as-x-y-nomedopluign-container {
    /* Estilos aqui */
}
```

### Checklist de Novo Plugin

Ao criar um novo plugin, verificar:

- [ ] Nome segue padrão: `AS_X.Y_NomeDoPluign.js`
- [ ] Cabeçalho com comentário obrigatório incluído
- [ ] `@version` preenchido com formato correto
- [ ] `@orderAfter` e `@orderBefore` configurados
- [ ] Manifesto completo e válido
- [ ] Funções `init()` e `cleanup()` implementadas
- [ ] Logs em PT-BR implementados com emojis apropriados
- [ ] Seções bem comentadas em PT-BR
- [ ] Registrado em `AS.PluginManager.register()`
- [ ] Sem dependências circulares
- [ ] Chatlog criado em `chatlogs/AS_X.Y_NomeDoPluign_chatlog.md`
- [ ] Se usa HTML/CSS, criar em `assets/contents/`
- [ ] Testado com modo debug ativo
- [ ] Documentação `@help` completa

### Boas Práticas de Modularização

**Separação de Concerns:**
```javascript
// ✓ Bom: Cada método tem responsabilidade clara
init()              // Inicializar
setupUI()           // Criar UI
setupEventListeners() // Configurar eventos
onEventReceived()   // Tratar eventos
cleanup()           // Limpar

// ❌ Ruim: Tudo em um método
init() {
    // Inicializar
    // Criar UI
    // Configurar eventos
    // Fazer tudo ao mesmo tempo
}
```

**Comentários em PT-BR:**
```javascript
// ✓ Bom: Claro e em português
// PT-BR: Carregar parâmetros da configuração
const value = parameters.Example === 'true';

// ❌ Ruim: Sem contexto
// Load parameter
const value = parameters.Example === 'true';
```

**Logs Estruturados:**
```javascript
// ✓ Bom: Com emoji e contexto
console.log('🎨 [NomeDoPluign] Inicializando UI...');
console.log('✓ [NomeDoPluign] Setup completo');
console.log('⚠️ [NomeDoPluign] Recurso não encontrado');

// ❌ Ruim: Logs genéricos
console.log('Starting...');
console.log('Done');
```

---

## Política de Desenvolvimento Obrigatória

### Princípios Fundamentais

O sistema Ancient Souls foi construído com rigor para garantir:

1. **Consistência** - Estrutura uniforme em todos os agentes
2. **Rastreabilidade** - Tudo é registrado e auditável
3. **Reversibilidade** - Qualquer mudança pode ser desfeita
4. **Escalabilidade** - Novos agentes seguem padrões estabelecidos

### Regras Obrigatórias

#### ❌ **PROIBIÇÕES ABSOLUTAS**

1. **Nunca alterar `@version` sem autorização explícita**
   - Pode quebrar integridade do sistema
   - Impede rastreamento de mudanças
   - Invalida backups

2. **Nunca criar novos arquivos `.md` na pasta `readme/` sem solicitação**
   - Proliferação de documentação
   - Duplicação de informações
   - Confusão de responsabilidades

3. **Nunca atualizar chatlogs sem registro completo de mudança**
   - Perder rastreabilidade
   - Histórico incompleto
   - Impossibilidade de auditoria

4. **Nunca modificar plugins sem backup prévio**
   - Perda irreversível de código
   - Impossibilidade de rollback
   - Risco de corrupção

---

#### ✅ **OBRIGAÇÕES ABSOLUTAS**

1. **Sempre criar backup antes de qualquer atualização**

   **Procedimento:**
   - Antes de editar arquivo `.js`
   - Copiar versão atual para `backups/NOME_DO_PLUGIN/`
   - Nomear com padrão: `PluginName - vX.Y.Z.js`
   - Se for fix: `PluginName - vX.Y.Z - Fix N.js`

2. **Sempre atualizar chatlog após modificação**

   **Formato de Entrada:**
   ```
   ## [Data: YYYY-MM-DD]
   **Autor:** <nome>
   **Arquivo(s) afetado(s):** <lista de caminhos>
   **Ação:** <descrição curta>
   **Detalhes:** <explicação breve>
   **Versão afetada:** X.Y.Z
   ```

2. **Sempre seguir template de cabeçalho obrigatório**

   Todos os plugins DEVEM iniciar com:
   ```javascript
   //=============================================================================
   // AS_X.Y_NomeDoPluign.js
   //=============================================================================
   /*:
    * @target MZ
    * @plugindesc [vX.Y.Z] Descrição curta
    * @author Necromante96Official & GitHub Copilot
    * @url https://github.com/Necromante96Official/AncientSouls
    * @version X.Y.Z
    * @orderAfter AS_0.0_PluginManager
    * @orderBefore AS_1.1_Proximo
    */
   ```

   Veja a seção "Template de Estrutura para Novo Plugin" acima para exemplo completo.

3. **Sempre incluir manifest completo no registro**

   ```javascript
   AS.PluginManager.register('AS_X.Y_NomeDoPluign', {
       name: 'Nome Legível',
       version: 'X.Y.Z',
       author: 'Necromante96Official & GitHub Copilot',
       description: 'Descrição',
       dependencies: ['AS_0.0_PluginManager', 'AS_1.0_Outro'],
       init: () => { 
           const manager = new MeuManager();
           manager.init();
           return manager;
       },
       cleanup: () => { 
           const manager = AS.PluginManager.getAgentInstance('AS_X.Y_NomeDoPluign');
           if (manager) manager.cleanup();
       }
   });
   ```

   Veja a seção "Template de Estrutura para Novo Plugin" acima para referência completa.

4. **Sempre manter compatibilidade com versionamento**

   - Incrementos PATCH = compatível com versões anteriores
   - Incrementos MINOR = compatível com versões anteriores
   - Incrementos MAJOR = pode quebrar compatibilidade

---

### Checklist de Novo Agente

Ao criar um novo agente, verificar:

- [ ] Arquivo nomeado conforme convenção `AS_X.Y_Nome_Agent.js`
- [ ] Cabeçalho obrigatório presente e completo
- [ ] Manifesto válido com todos os campos
- [ ] Implementa funções `init()` e `cleanup()` corretamente
- [ ] Registrado no PluginManager com `register()`
- [ ] Chatlog criado em `chatlogs/AS_X.Y_Nome_Agent_chatlog.md`
- [ ] Dependências declaradas corretamente
- [ ] Sem dependências circulares
- [ ] Logs estruturados implementados
- [ ] Testado com modo debug ativo
- [ ] Documentação no `@help` do plugin completa
- [ ] Ordem de ativação definida via `@orderAfter` e `@orderBefore`

---

## Backups e Segurança

### Princípio Fundamental dos Backups

**Uma mudança sem backup é uma mudança arriscada.**

O sistema de backups garante que você possa voltar atrás de qualquer mudança a qualquer momento, mantendo a integridade histórica de cada plugin.

### Fluxo Correto de Backup e Atualização

Este é o procedimento **obrigatório e inviolável** que deve ser seguido:

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1: PREPARAÇÃO DO BACKUP                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Plugin em Produção:                                            │
│  AS_1.3_OptionsScreen.js (v1.0.9)                              │
│  ├─ Funciona perfeitamente                                      │
│  ├─ Todas as funcionalidades ativas                             │
│  └─ Estado: SEGURO, NÃO ALTERAR                                │
│                                                                 │
│  ✓ AÇÃO: Copiar arquivo completo                               │
│          backups/AS_1.3_OptionsScreen/                          │
│          └─ AS_1.3_OptionsScreen - v1.0.9.js                   │
│                                                                 │
│  ✓ VERIFICAÇÃO: Confirmar que arquivo foi copiado              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 2: IMPLEMENTAR MUDANÇAS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Plugin Original Agora é Modificado:                            │
│  AS_1.3_OptionsScreen.js                                        │
│  ├─ Implementar correção/funcionalidade                         │
│  ├─ Testar completamente                                        │
│  ├─ Revisar código                                              │
│  ├─ Validar contra dependências                                 │
│  └─ Confirmar que funciona                                      │
│                                                                 │
│  Exemplo de mudança:
│  - Corrigir bug no slider de volume
│  - Adicionar validação de entrada
│  - Melhorar performance
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 3: ATUALIZAR VERSÃO                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Após Sucesso de Testes:                                        │
│  AS_1.3_OptionsScreen.js                                        │
│  ├─ @version 1.0.9  ──→  @version 1.0.10                       │
│  ├─ Atualizar manifesto  ──→  version: '1.0.10'                │
│  └─ Verificar mudança foi aplicada                              │
│                                                                 │
│  OBS: Não faça isso antes! Espere até tudo estar pronto.        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4: ATUALIZAR CHATLOG (APENAS AGORA!)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Chatlogs/AS_1.3_OptionsScreen_chatlog.md                       │
│  Adicione nova entrada:                                         │
│                                                                 │
│  ## [19/10/2025]                                                │
│  **Autor:** GitHub Copilot                                      │
│  **Arquivo(s) afetado(s):** AS_1.3_OptionsScreen.js             │
│  **Ação:** Correção - Slider de volume                          │
│  **Detalhes:** Slider de volume agora persiste o valor corr.    │
│  **Versão:** v1.0.10 (anterior: v1.0.9)                         │
│  **Backup criado:** AS_1.3_OptionsScreen - v1.0.9.js            │
│                                                                 │
│  IMPORTANTE: Apenas atualize chatlog DEPOIS de tudo pronto!     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ✓ PROCESSO CONCLUÍDO
                    Plugin versionado e documentado
                    Backup seguro em local conhecido
                    Histórico atualizado
```

### Estrutura de Pastas de Backup

**Localização:** `js/plugins/backups/`

```
backups/
├── AS_0.0_PluginManager/                    ← Pasta por plugin
│   ├── AS_0.0_PluginManager - v1.0.0.js    ← Backup versão 1.0.0
│   └── AS_0.0_PluginManager - v1.0.0 - Fix 1.js  ← Correção rápida
│
├── AS_1.0_TitleScreen/                      ← Pasta por plugin
│   ├── AS_1.0_TitleScreen - v1.0.0.js      ← Backup v1.0.0
│   ├── AS_1.0_TitleScreen - v1.0.1.js      ← Backup v1.0.1
│   ├── AS_1.0_TitleScreen - v1.1.0.js      ← Backup v1.1.0
│   ├── AS_1.0_TitleScreen - v1.1.1.js      ← Backup v1.1.1
│   └── AS_1.0_TitleScreen - v1.1.1 - Fix 1.js  ← Correção rápida
│
├── AS_1.3_OptionsScreen/                    ← Pasta por plugin
│   ├── AS_1.3_OptionsScreen - v1.0.0.js
│   ├── AS_1.3_OptionsScreen - v1.0.1.js
│   └── ...
│
└── AS_1.4_PatchNotesScreen/                 ← Pasta por plugin
    ├── AS_1.4_PatchNotesScreen - v1.0.0.js
    └── ...
```

### Padrão Obrigatório de Nomes de Backup

#### **Versão Completa**
```
AS_X.Y_NomeDoPluign - vX.Y.Z.js
```

**Componentes:**
- `AS_X.Y_NomeDoPluign` = Nome exato do arquivo original
- `vX.Y.Z` = Versão semântica (NUNCA inclua sufixos como -alfa ou -beta)
- `.js` = Extensão

**Exemplos Corretos:**
- `AS_1.3_OptionsScreen - v1.0.9.js` ✓
- `AS_1.0_TitleScreen - v1.1.1.js` ✓
- `AS_0.0_PluginManager - v1.0.0.js` ✓

**Exemplos Incorretos:**
- `AS_1.3_OptionsScreen - v1.0.9-alfa.js` ❌ (Não inclua tipo)
- `OptionsScreen - v1.0.9.js` ❌ (Sem prefixo AS)
- `AS_1.3_OptionsScreen.js` ❌ (Sem versão)

---

#### **Correção Rápida (Fix)**
```
AS_X.Y_NomeDoPluign - vX.Y.Z - Fix N.js
```

**Componentes:**
- `Fix N` = Número sequencial de correção (1, 2, 3...)

**Quando usar:**
- Você identificou um bug CRÍTICO após release
- Precisa fazer correção rápida da mesma versão
- Não quer incrementar versão ainda

**Exemplos Corretos:**
- `AS_1.3_OptionsScreen - v1.0.9 - Fix 1.js` ✓ (Primeira correção rápida)
- `AS_1.3_OptionsScreen - v1.0.9 - Fix 2.js` ✓ (Segunda correção rápida)
- `AS_1.0_TitleScreen - v1.1.1 - Fix 1.js` ✓

**Fluxo de Fix:**
```
v1.0.9 - Fix 1 ──→ v1.0.9 - Fix 2 ──→ [tudo testado] ──→ v1.0.10
                                          (próxima versão)
```

---

### Política de Limpeza de Backups

Para manter a pasta organizada, mantenha:

- ✅ **Últimas 5 versões** de cada plugin
- ✅ **Todas as fixes** da versão atual
- ❌ **Remova** versões muito antigas quando precisar de espaço

**Exemplo (ao limpar AS_1.3_OptionsScreen):**

```
Antes (muitas versões):
├── AS_1.3_OptionsScreen - v1.0.0.js
├── AS_1.3_OptionsScreen - v1.0.1.js
├── AS_1.3_OptionsScreen - v1.0.2.js
├── AS_1.3_OptionsScreen - v1.0.3.js
├── AS_1.3_OptionsScreen - v1.0.4.js
├── AS_1.3_OptionsScreen - v1.0.5.js  ← Remover
├── AS_1.3_OptionsScreen - v1.0.6.js  ← Remover
├── AS_1.3_OptionsScreen - v1.0.7.js  ← Remover
├── AS_1.3_OptionsScreen - v1.0.8.js
└── AS_1.3_OptionsScreen - v1.0.9.js

Depois (últimas 5 + fixes):
├── AS_1.3_OptionsScreen - v1.0.7.js
├── AS_1.3_OptionsScreen - v1.0.8.js
├── AS_1.3_OptionsScreen - v1.0.9.js
└── AS_1.3_OptionsScreen - v1.0.9 - Fix 1.js
```

---

### Checklist de Backup

Antes de fazer qualquer mudança, verifique:

- [ ] Versão atual do plugin identificada
- [ ] Arquivo copiado para `backups/AS_X.Y_Nome/`
- [ ] Nome segue padrão: `AS_X.Y_Nome - vX.Y.Z.js`
- [ ] Arquivo backup abre e é válido
- [ ] Tamanho do backup é similar ao original
- [ ] Arquivo original ainda está em `js/plugins/`

Após implementar mudanças:

- [ ] Todas as mudanças foram testadas
- [ ] Nenhum erro aparece no console
- [ ] Compatibilidade verificada com dependências
- [ ] Versão foi incrementada corretamente
- [ ] Chatlog foi atualizado com entrada completa
- [ ] Referência ao backup está no chatlog

---

## Sistema de Logs e Debugging

### Propósito do Sistema de Logs

Fornecer visibilidade completa do comportamento do sistema durante:

- Desenvolvimento e testes
- Identificação de bugs
- Rastreamento de fluxo de execução
- Auditoria de eventos

### Níveis de Log

| Nível | Emoji | Uso | Exemplos |
|-------|-------|-----|----------|
| **LOG** | ℹ️ | Informações gerais | "Scene carregada", "Valor atualizado" |
| **WARN** | ⚠️ | Avisos não-críticos | "Recurso não encontrado", "Comportamento inesperado" |
| **ERROR** | ❌ | Erros críticos | "Dependência faltando", "Falha ao carregar" |
| **SUCCESS** | ✓ | Confirmação de sucesso | "UI criada com sucesso", "Transição completa" |
| **DEBUG** | 🔍 | Informações de debugging | "Stack do SceneManager", "Valor de parâmetro" |

### Legenda de Emojis Especializados

Alguns domínios usam emojis específicos:

| Emoji | Significado | Contexto |
|-------|-----------|---------|
| 🎨 | UI/Estilo | Injeção de CSS, criação de elementos |
| 🔙 | Navegação/Retorno | Transição de cenas, pop do stack |
| 🗑️ | Limpeza/Reset | Cleanup, destruição de elementos |
| ✓ | Sucesso/Confirmação | Operação completada |
| ⚠️ | Atenção/Erro recuperável | Validação, erro que pode ser tratado |
| 📍 | Ponto de interesse | Checkpoint importante |
| 🎵 | Áudio/Música | Reprodução, pausa, volume |
| 🎬 | Animação/Efeitos | Transição, animação, efeito visual |

### Exemplo de Logs Estruturados

```javascript
// Inicialização
console.log('🎨 [TitleScreen] Inicializando UI Manager...');
console.log('✓ [TitleScreen] UI Manager inicializado com sucesso');

// Navegação
console.log('📍 [TitleScreen] Botão "Novo Jogo" clicado');
console.log('🔙 [Options] Retornando à Tela Inicial via pop');

// Limpeza
console.log('🗑️ [TitleScreenUI] Removendo 45 elementos HTML');
console.log('🗑️ [Effects] Destruindo canvas e listeners');

// Áudio
console.log('🎵 [TitleScreen] Reproduzindo música: Title_Theme.m4a');
console.log('🎵 [TitleScreen] Volume ajustado para 80%');

// Debug
console.log('🔍 [SceneManager] Stack atual: [Scene_Title, Scene_Options]');
console.log('⚠️ [TitleScreen] Parâmetro DisableTitleMusic = false');
```

---

## Fluxo de Navegação e Integração

## Fluxo de Navegação e Integração - Conceito Genérico

Quando agentes trabalham juntos, seguem este padrão lógico:

```
Jogo Inicia
     │
     v
┌──────────────────────────────────┐
│ PluginManager.initializeAll()    │
│ - Resolver dependências          │
│ - Inicializar em ordem           │
│ - Validar compatibilidade        │
└──────────────┬───────────────────┘
               │
               v
    ┌──────────────────────────────┐
    │ Agente Principal (AS_1.0)    │
    │ inicializa e publica         │
    │ "ready"                      │
    └──────────┬──────────┬────────┘
               │          │
    ┌──────────v──┐  ┌────v───────────┐
    │ Sub-agente  │  │ Sub-agente     │
    │ (AS_1.1)    │  │ (AS_1.2)       │
    │ Especializado│  │ Especializado  │
    │ em Aspecto1 │  │ em Aspecto2    │
    └──────────┬──┘  └────┬───────────┘
               │          │
               └────┬─────┘
                    │
                    v
         ┌──────────────────┐
         │ Sistema Pronto   │
         │ Aguarda Usuário  │
         └─────────┬────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        v                     v
   [Ação do Usuário]    [Publicar Eventos]
   (Entrada do Input)   (Pub/Sub Bus)
        │                     │
        └──────────┬──────────┘
                   │
                   v
        ┌──────────────────────┐
        │ Agentes Processam    │
        │ Evento e Reagem      │
        └──────────┬───────────┘
                   │
        ┌──────────v───────────┐
        │ Transição? Mudança?  │
        └──────────┬───────────┘
                   │
         ┌─────────v──────────┐
         │ Cleanup/Prepare    │
         │ (Se necessário)    │
         └─────────┬──────────┘
                   │
                   v
         ┌──────────────────┐
         │ Nova Scene       │
         │ OU               │
         │ Retornar ao      │
         │ Estado Anterior  │
         └──────────────────┘
```

**Padrão Recorrente:**
1. Agentes se inicializam em ordem (dependências resolvidas)
2. Publicam eventos "ready" quando prontos
3. Processam input/eventos do usuário
4. Publicam eventos via Pub/Sub
5. Todos os assinantes reagem
6. Transições acontecem via cleanup → pop/push de cenas
7. Novo ciclo recomeça

---

## Governança e Permissões

### Hierarquia de Decisão

```
┌─────────────────────────────────────────┐
│ Necromante96Official (Mantenedor Chefe) │
│ - Autorização de versões                │
│ - Aprovação de arquitetura              │
│ - Merges e releases                     │
│ - Decisões estratégicas                 │
└─────────────────────────────────────────┘
           ↑
           │ Autoriza
           │
┌─────────────────────────────────────────┐
│ GitHub Copilot (Desenvolvedor)          │
│ - Implementação de agentes              │
│ - Correções de bugs                     │
│ - Testes e debugging                    │
│ - Documentação técnica                  │
└─────────────────────────────────────────┘
```

### Matriz de Permissões

| Ação | Necromante96Official | GitHub Copilot |
|------|-------------------|-----------------|
| Criar novo agente | ✓ | ✓ (com aprovação) |
| Alterar versão | ✓✓ | ✓ (com autorização) |
| Atualizar chatlog | ✓ | ✓ |
| Criar backup | ✓ | ✓ |
| Merge em main | ✓✓ | ✗ |
| Revert de mudança | ✓✓ | ✓ (com justificativa) |
| Criar arquivo .md | ✓ | ✗ (sem solicitação) |
| Remover agente | ✓✓ | ✗ |

**Legenda:**
- ✓✓ = Responsável principal
- ✓ = Permitido
- ✗ = Não permitido

---

### Fluxo de Autorização para Versão

```
Desenvolvedor Identifica Mudança
(Bug Fix / Nova Funcionalidade / Refatoração)
        │
        v
Solicitar Aprovação
- Descrever mudanças
- Justificar tecnicamente
- Referenciar backups
        │
        v
Mantenedor Revisa
        │
    ┌───┴────┐
    │         │
    v         v
Aprova  Pede Ajustes
    │         │
    │   (Volta ao dev)
    │
    v
APENAS DEPOIS: Executar Mudança
├─ PASSO 1: Backup (versão anterior)
├─ PASSO 2: Implementar e testar
├─ PASSO 3: Incrementar versão (@version + manifesto)
└─ PASSO 4: Atualizar chatlog (com dados da mudança)
        │
        v
Mudança Completa e Documentada
```

**Regra de Ouro:** Versão é alterada APENAS COM APROVAÇÃO do mantenedor responsável.

---

## Próximos Passos e Roadmap - Conceito

À medida que o projeto evolui, novos agentes serão adicionados seguindo a mesma arquitetura.

### Estrutura de Expansão

Cada nova fase adiciona agentes em níveis hierárquicos:

```
Fase Atual: Camada de Base (AS_0.0 + AS_1.x)
  ├─ Núcleo funcional
  └─ Primeiro domínio implementado

Fase Seguinte: Segundo Domínio (AS_2.0 + AS_2.x)
  ├─ Novo agente principal
  └─ Sub-agentes especializados

Fase Posterior: Terceiro Domínio (AS_3.0 + AS_3.x)
  ├─ Agente adicional
  └─ Mais especializações

E assim por diante...
```

### Princi pais Padrões de Crescimento

1. **Cada novo domínio cria novo AS_N.0_Nome**
2. **Sub-agentes especializados em AS_N.x_Nome**
3. **Todos herdam AS_0.0 como dependência**
4. **Seguem mesmo ciclo de vida e versionamento**
5. **Mantêm mesmo padrão de nomenclatura**
6. **Documentação via chatlog idêntica**

### Exemplo de Expansão Teórica

```
Hoje:
AS_0.0_Manager
├─ AS_1.0_Primary
│  ├─ AS_1.1_Sub
│  └─ AS_1.2_Sub

Amanhã:
AS_0.0_Manager
├─ AS_1.0_Primary
│  ├─ AS_1.1_Sub
│  └─ AS_1.2_Sub
├─ AS_2.0_NewDomain      ← Adicionado
│  ├─ AS_2.1_Sub         ← Adicionado
│  └─ AS_2.2_Sub         ← Adicionado
└─ AS_3.0_Another        ← Adicionado
   └─ AS_3.1_Sub         ← Adicionado
```

A arquitetura é **escalável por design**. Novos agentes seguem os mesmos padrões estabelecidos.

#### **Fase 4: Beta e Estabilização** (v0.1.0.0-beta)

- [ ] Testes extensivos
- [ ] Otimização de performance
- [ ] Refatoração de código
- [ ] Documentação completa

#### **Fase 5: Release v1.0.0** (v1.0.0.0-release)

- [ ] Versão estável e completa
- [ ] Suporte completo
- [ ] Documentação finalizada

---

### Melhorias Planejadas no Sistema Atual

**UI/UX:**
- [ ] Animações mais suaves
- [ ] Novos efeitos visuais
- [ ] Tema dark/light customizável
- [ ] Responsividade melhor

**Performance:**
- [ ] Otimização de canvas
- [ ] Redução de memory footprint
- [ ] Lazy loading de recursos

**Developer Experience:**
- [ ] Melhor documentação de API
- [ ] Exemplos de uso
- [ ] Ferramentas de debug
- [ ] Testes automatizados

---

## Observações Finais e Boas Práticas

### Para Desenvolvedores

1. **Sempre leia o chatlog** antes de começar a trabalhar em um agente
2. **Teste com debug ativo** para ver toda a pilha de execução
3. **Comunique mudanças** via Issue ou comentário no chatlog
4. **Respeite dependências** - não crie ciclos
5. **Documente seu código** com comentários e help text

### Para Mantenedores

1. **Revise chatlogs** regularmente
2. **Monitore performance** do sistema
3. **Planeje releases** com antecedência
4. **Comunique mudanças** aos usuários via patch notes
5. **Mantenha backups** atualizados

### Escalabilidade Futura

O sistema foi projetado para crescer:

- **Agentes Novos:** Adicione sem modificar existentes
- **Dependências Complexas:** Algoritmo topológico já suporta
- **Múltiplas Cenas:** Cada cena pode ter seu próprio conjunto de agentes
- **Hot Reload:** Arquitetura permite recarregar sem reiniciar jogo
- **Plugins Terceiros:** Compatibilidade mantida via contrato de eventos

---

## Metadados do Documento

- **Versão:** 1.0.0
- **Data de Criação:** 19 de outubro de 2025
- **Data da Última Atualização:** 19 de outubro de 2025
- **Autor:** Necromante96Official & GitHub Copilot
- **Status:** Ativo e Completo
- **Revisor:** Necromante96Official

---

## Contato e Suporte

Para dúvidas, sugestões ou autorizações:

- **Mantenedor Chefe:** Necromante96Official
- **Repositório:** https://github.com/Necromante96Official/AncientSouls
- **Documentação:** `/js/plugins/readme/README.md`
- **Histórico:** `/js/plugins/chatlogs/`

---

## 📜 Sistema de Notas de Atualização (Patch Notes)

Este sistema gerencia como as atualizações do jogo são documentadas e apresentadas aos jogadores.

### ⚠️ REGRA DE OURO

**PATCH NOTES DESCREVEM O JOGO PRONTO, NÃO COMO FAZER O JOGO!**

- ✅ **CERTO**: "Batalhas agora são mais rápidas e fluidas"
- ❌ **ERRADO**: "Sistema de batalha implementado"
- ❌ **ERRADO**: "Motor de jogo completo rodando"

**Descreva o que o JOGADOR VAI ENCONTRAR, não o que foi desenvolvido!**

### 📁 Estrutura de Arquivos de Patch Notes

Cada atualização possui um arquivo seguindo este padrão:

```
VERSAO_NOME-DESCRITIVO.txt
```

**Exemplos:**
- `0.0.0.0-alfa_base-inicial.txt`
- `0.1.0.0-beta_nova-classe.txt`
- `1.0.0.0_lancamento-oficial.txt`

### 📂 Organização por Estágios

```
patchnotes/
├── alfa/           # Versões 0.0.x.x-alfa
├── beta/           # Versões 0.x.x.x-beta
├── pre-release/    # Versões 0.9.x.x-pre-release
└── release/        # Versões 1.x.x.x+
```

### 🎮 Navegação In-Game (Duas Camadas)

**1ª Camada - Seleção de Estágio:**
```
🔬 ALFA - Desenvolvimento Inicial
🧪 BETA - Testes Públicos
🎯 PRÉ-RELEASE - Versão Candidata
🏆 RELEASE - Versões Oficiais
```

**2ª Camada - Lista de Versões:**
Após selecionar estágio, mostra todas as versões daquele estágio

**3ª Camada - Conteúdo Completo:**
Exibe o patch note selecionado

### 🎨 Categorias Permitidas (APENAS 5)

1. **Base Inicial** - Primeira versão
2. **Grande Atualização** - Múltiplos sistemas novos
3. **Pequena Atualização** - Melhorias pontuais
4. **Correções Importantes** - Bugs críticos
5. **Correções Pequenas** - Pequenos ajustes

⚠️ **Nunca invente categorias além destas 5!**

### 📝 Estrutura Obrigatória de Patch Note

```markdown
# 🎮 Título da Atualização

**Versão:** X.X.X.X-sufixo
**Data:** DD/MM/AAAA
**Categoria:** [Uma das 5 categorias]

---

## 📖 Resumo
[Parágrafo empolgante descrevendo a atualização]

---

## ✨ Adicionados
[O que há de novo]

---

## 🔧 Melhorias
[O que ficou melhor]

---

## 🐛 Correções
[Bugs corrigidos]

---

## ❌ Removidos
[O que foi removido]

---

**🎮 Mensagem final motivacional!**
```

### ✅ Regras de Escrita

**SEMPRE:**
- Use linguagem simples (seu avô entenderia?)
- Foque na experiência do jogador
- Seja específico (números, nomes, detalhes)
- Use verbos de ação (explore, lute, colete)
- Mantenha tom empolgante

**NUNCA:**
- Use termos técnicos (plugin, script, engine)
- Mencione desenvolvimento ou ferramentas
- Fale sobre "criar" ou "implementar"
- Seja vago ("melhorias gerais")

### 🎯 Exemplo Correto

```markdown
## ✨ Adicionados

### ⚔️ Sistema de Combate Épico
- **Batalhas táticas por turnos** onde você comanda até 4 heróis
- **15 elementos mágicos** incluindo Fogo Infernal e Trovão Destruidor
- **Combos devastadores** ao usar habilidades na ordem certa
```

### ❌ Exemplo Errado

```markdown
## Adicionados
- Implementado plugin AS_CombatSystem v2.0
- Motor de jogo rodando a 60 FPS
- Arquitetura modular implementada
```

### 📊 Checklist Antes de Publicar

- [ ] Nome do arquivo segue padrão `VERSAO_nome-descritivo.txt`
- [ ] Arquivo salvo na pasta correta (alfa/, beta/, pre-release/, release/)
- [ ] Todas as 4 seções obrigatórias presentes
- [ ] Categoria é uma das 5 permitidas
- [ ] Linguagem 100% acessível para jogadores
- [ ] ZERO termos técnicos
- [ ] Foca na experiência, não no desenvolvimento

### 🎓 Para Documentação Completa

Consulte: `/js/plugins/assets/contents/patchnotes/README.md`

---

**Fim do Documento README.md**
