# Ancient Souls - Sistema Modular de Plugins para RPG Maker MZ

**Versão do Documento:** 2.0.0  
**Data de Atualização:** 19 de outubro de 2025  
**Autor:** Necromante96Official & GitHub Copilot  
**Status:** Pronto para Desenvolvimento de Plugins  
**Propósito:** Documento didático para ensinar IA a entender a arquitetura completa

---

## Sumário Executivo

O **Ancient Souls** é um **sistema de arquitetura modular escalável** para plugins de RPG Maker MZ. Todo o código é organizado em **agentes independentes** que se comunicam através de um **gerenciador central**. 

Este documento não descreve plugins específicos. Ele ensina a **lógica, conceitos e padrões** que qualquer novo plugin deve seguir, para que uma IA (ou desenvolvedor) possa criar novos plugins com consistência total.

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura Modular por Agentes](#estrutura-modular-por-agentes)
3. [Convenções de Nomenclatura e Organização](#convenções-de-nomenclatura-e-organização)
4. [Ciclo de Vida dos Agentes](#ciclo-de-vida-dos-agentes)
5. [Sistema de Comunicação (Pub/Sub)](#sistema-de-comunicação-pubsub)
6. [Versionamento e Controle de Versão](#versionamento-e-controle-de-versão)
7. [Política de Desenvolvimento Obrigatória](#política-de-desenvolvimento-obrigatória)
8. [Sistema de Logs e Debugging](#sistema-de-logs-e-debugging)
9. [Fluxo de Navegação e Integração](#fluxo-de-navegação-e-integração)
10. [Governança e Permissões](#governança-e-permissões)
11. [Próximos Passos e Roadmap](#próximos-passos-e-roadmap)

---

## Visão Geral da Arquitetura

### Princípios Fundamentais

O sistema Ancient Souls foi projetado com base em três pilares:

1. **Modularidade**: Cada funcionalidade é isolada em um agente independente que pode ser desenvolvido, testado e mantido sem impactar outros componentes.

2. **Escalabilidade**: A adição de novos agentes não requer alterações no núcleo do sistema; tudo funciona através de uma arquitetura de dependências automáticas.

3. **Rastreabilidade**: Todas as mudanças, versões e fluxos são registrados em logs estruturados (chatlogs) para fins de auditoria e reversibilidade.

### Diagrama Conceitual da Hierarquia

```
┌─────────────────────────────────────────────────────────────┐
│          AS_0.0_PluginManager_Agent (Núcleo Central)       │
│  Responsabilidades:                                         │
│  • Registro de agentes                                      │
│  • Resolução de dependências (topologia)                   │
│  • Sistema Pub/Sub de eventos                             │
│  • Controle de versões                                     │
│  • Ciclo de vida (init, cleanup)                           │
└─────────────────────────────────────────────────────────────┘
           │
           ├── Agentes Nível 1 ─────────────────────┐
           │                                         │
           ├─ AS_1.0_TitleScreen_Agent              │
           │   (Gerenciador Principal da UI)        │
           │   Dependências: AS_0.0                 │
           │                                         │
           │   Sub-agentes (Nível 1.x):             │
           │   ├─ AS_1.1_TitleScreenUI_Agent        │
           │   │  (Interface HTML/CSS)              │
           │   │                                     │
           │   └─ AS_1.2_TitleScreenEffects_Agent   │
           │      (Animações e Efeitos Visuais)     │
           │                                         │
           ├─ AS_1.3_OptionsScreen_Agent            │
           │   (Tela de Opções Customizada)         │
           │   Dependências: AS_0.0                 │
           │                                         │
           └─ AS_1.4_PatchNotesScreen_Agent         │
               (Tela de Atualizações)               │
               Dependências: AS_0.0, AS_1.0         │
```

---

## Estrutura Modular por Agentes

### O Que é um Agente?

Um **agente** é um arquivo JavaScript `.js` autocontido que:

- ✓ Representa uma **funcionalidade ou área específica** do jogo
- ✓ Implementa sua **própria lógica, estado e ciclo de vida**
- ✓ Se **registra no gerenciador central** (PluginManager)
- ✓ Comunica-se com **outros agentes via Pub/Sub**
- ✓ Segue **padrões rigorosos de versionamento e documentação**

### Exemplos Genéricos de Agentes

Para fins didáticos, aqui estão tipos genéricos de agentes que você criará:

#### **AS_0.0_NomeDoNucleo (Núcleo Central - Nível 0)**

**Tipo:** Gerenciador Central  
**Responsabilidade:** Orquestra todo o ecossistema

**Características Genéricas:**
- Mantém registro de todos os agentes
- Resolve dependências automaticamente (algoritmo topológico)
- Previne dependências circulares
- Inicializa agentes em ordem correta
- Fornece Event Bus (Pub/Sub) para comunicação
- Valida compatibilidade de versões
- Fornece logs estruturados
- Ciclo de vida completo

**Padrão:** Sem dependências, funciona de forma autônoma.

---

#### **AS_X.0_NomePrincipal (Agente Principal - Nível 1)**

**Tipo:** Agente independente com responsabilidade clara  
**Responsabilidade:** Gerenciar um domínio específico

**Características Genéricas:**
- Orquestra sub-agentes (X.1, X.2, etc)
- Gerencia fluxo de navegação
- Trata entrada do usuário
- Controla camadas visuais
- Transições suaves
- Responsividade

**Padrão:** Depende de AS_0.0_NomeDoNucleo

---

#### **AS_X.Y_NomeSubagente (Sub-agente - Nível 1.x)**

**Tipo:** Especialista em um aspecto específico  
**Responsabilidade:** Funcionalidade específica controlada por agente pai

**Características Genéricas:**
- Interface visual (HTML/CSS) ou lógica especializada
- Renderização de UI
- Gerenciamento de eventos
- Integração com sistemas do RPG Maker
- Cleanup eficiente
- Animações e transições

**Padrão:** Depende de AS_0.0 + agente pai (AS_X.0)

---

### Exemplo de Hierarquia Genérica

```
┌─────────────────────────────────────────────────────────────┐
│          AS_0.0_NomeDoNucleo (Núcleo Central)              │
│  - Gerencia tudo                                            │
│  - Sem dependências                                         │
└─────────────────────────────────────────────────────────────┘
           │
           ├── AS_1.0_DominioA
           │   ├─ Responsabilidade: X
           │   ├─ Depende: AS_0.0
           │   │
           │   ├─ AS_1.1_DominioA_Aspecto1
           │   │  (Especializa em X.1)
           │   │   Depende: AS_0.0, AS_1.0
           │   │
           │   └─ AS_1.2_DominioA_Aspecto2
           │      (Especializa em X.2)
           │       Depende: AS_0.0, AS_1.0
           │
           ├── AS_2.0_DominioB
           │   ├─ Responsabilidade: Y
           │   ├─ Depende: AS_0.0
           │   │
           │   └─ AS_2.1_DominioB_Aspecto1
           │      (Especializa em Y.1)
           │       Depende: AS_0.0, AS_2.0
           │
           └── AS_3.0_DominioC
               ├─ Responsabilidade: Z
               └─ Depende: AS_0.0, AS_1.0
```

---

### Convenção de Nomenclatura para Agentes

A hierarquia **AS_X.Y_Nome** reflete a **estrutura lógica**, não a versão:

- **AS** = Prefixo de namespace
- **X** = Nível hierárquico (0=Núcleo, 1=Principal, 2+=Secundário)
- **Y** = Número sequencial dentro do nível
- **Nome** = Descrição clara da responsabilidade

**Exemplos (didáticos, não reais):**
- `AS_0.0_CentralManager.js` ✓ Núcleo
- `AS_1.0_BattleSystem.js` ✓ Agente principal
- `AS_1.1_BattleUI.js` ✓ Sub-agente de 1.0
- `AS_2.0_InventorySystem.js` ✓ Outro agente principal
- `AS_2.1_InventoryUI.js` ✓ Sub-agente de 2.0

**Nunca fazer:**
- `AS_1.0_Battle_v1.0.0.js` ❌ (Versão no nome)
- `AS_1.0_Battle_Agent.js` ❌ (Sufixo redundante)
- `BattleSystem.js` ❌ (Sem hierarquia)

---

## Convenções de Nomenclatura e Organização

### Padrão Obrigatório de Nomes de Arquivo

**Formato Universal:**
```
AS_X.Y_NomeDescritivo.js
```

**Interpretação:**
- **AS** = Namespace Ancient Souls (sempre AS)
- **X.Y** = Hierarquia do agente (não é versão!)
  - X = Nível (0=Núcleo, 1=Principal, 2+=Secundário)
  - Y = Número sequencial dentro do nível
- **NomeDescritivo** = Descrição clara em CamelCase
- **.js** = Extensão JavaScript

⚠️ **Regra Crítica:** Nunca incluir sufixo "_Agent" ou versão no nome. A hierarquia X.Y já comunica tudo.

**Padrões Corretos:**
- `AS_0.0_PluginManager.js` ✓
- `AS_1.0_MainSystem.js` ✓
- `AS_1.1_SubComponent.js` ✓
- `AS_2.0_AnotherSystem.js` ✓

**Padrões Incorretos:**
- `AS_0_PluginManager.js` ❌ (Sem Y)
- `AS_1.0_PluginManager_Agent.js` ❌ (Sufixo Agent)
- `PluginManager.js` ❌ (Sem prefixo AS)
- `AS_1.0_PluginManager_v1.0.0.js` ❌ (Versão no nome)

### Estrutura de Pastas Padrão

```
js/plugins/
├── [Agentes de Plugin aqui]
│   ├── AS_0.0_NomeDoNucleo.js
│   ├── AS_1.0_NomePrincipal.js
│   ├── AS_1.1_NomeSub.js
│   └── ...
│
├── assets/
│   ├── contents/
│   │   ├── css/                 # Estilos CSS dos agentes
│   │   │   ├── AS_1.0_Principal.css
│   │   │   ├── AS_1.1_Sub.css
│   │   │   └── ...
│   │   │
│   │   └── html/                # Estruturas HTML dos agentes
│   │       ├── AS_1.0_Principal.html
│   │       ├── AS_1.1_Sub.html
│   │       └── ...
│   │
│   ├── patchnotes/              # Atualizações do jogo (formato .md)
│   │   ├── vX.X.X.X-tipo_descricao.md
│   │   └── ...
│   │
│   └── resources/               # Recursos gráficos
│       └── [imagens, etc]
│
├── chatlogs/                   # Histórico de desenvolvimento
│   ├── AS_0.0_NomeDoNucleo_chatlog.md
│   ├── AS_1.0_NomePrincipal_chatlog.md
│   ├── AS_1.1_NomeSub_chatlog.md
│   └── ...
│
├── corescript/                 # Scripts base do RPG Maker MZ
│   └── [Arquivos padrão do RPG Maker]
│
└── readme/                     # Documentação
    └── README.md (Este arquivo!)
```

### Padrão para Arquivos CSS/HTML

Se seu agente cria UI, sempre salve em `assets/contents/`:

```
assets/contents/
├── css/
│   └── AS_X.Y_NomeAgente.css
│
└── html/
    └── AS_X.Y_NomeAgente.html
```

**Nomenclatura:** Sempre use o mesmo nome do agente.

**Exemplo:**
- Agente: `AS_1.0_BattleUI.js`
- CSS: `assets/contents/css/AS_1.0_BattleUI.css`
- HTML: `assets/contents/html/AS_1.0_BattleUI.html`

## Ciclo de Vida dos Agentes

### Fases do Ciclo de Vida

Cada agente passa por fases bem definidas durante sua existência:

#### **1. Fase de Registro**

O agente se registra no PluginManager ao ser carregado.

**O que ocorre:**
- Arquivo `.js` é lido pelo RPG Maker MZ
- Código de inicialização (IIFE) é executado
- Manifesto do agente é criado com metadados
- `AS.PluginManager.register()` é chamado com ID e manifesto
- PluginManager valida o manifesto

**Manifesto Obrigatório Contém:**
```
{
  name: 'Nome Legível',
  version: 'X.Y.Z',
  author: 'Autor',
  description: 'Descrição',
  dependencies: ['AS_0.0_PluginManager', 'AS_1.0_TitleScreen'],
  init: () => { /* retorna instância */ },
  cleanup: () => { /* limpeza */ }
}
```

---

#### **2. Fase de Validação**

PluginManager valida o manifesto antes de inicializar.

**Validações Realizadas:**
- Manifesto completo e bem-formado
- Dependências declaradas existem e estão registradas
- Versão segue padrão semântico (X.Y.Z)
- Sem dependências circulares
- Função `init()` e `cleanup()` são válidas

**Se Falhar:** O agente não é inicializado e um erro é registrado.

---

#### **3. Fase de Resolução de Dependências**

PluginManager resolve a ordem correta de inicialização.

**Algoritmo:** Kahn's Algorithm (Topological Sort)

**Processo:**
1. Monta grafo de dependências (agente → seus dependentes)
2. Encontra nós sem dependências (fonte)
3. Adiciona à fila de inicialização
4. Remove nó do grafo
5. Repete até todos os nós serem processados
6. Se grafo ainda tiver nós = dependência circular (erro)

**Resultado:** Lista ordenada de agentes prontos para inicializar.

---

#### **4. Fase de Inicialização**

Cada agente é inicializado em ordem respeitando dependências.

**O que ocorre:**
- Função `init()` do manifesto é chamada
- Agente configura seu estado interno
- Se necessário, sub-agentes são inicializados
- Instância é armazenada no PluginManager
- Agente publica evento "ready"
- Logs de sucesso são gerados

**Estado do Agente:** `initialized = true`

---

#### **5. Fase de Operação**

Agente está ativo e funcionando normalmente.

**O que ocorre:**
- Agente responde a eventos do sistema
- Assina e publica eventos Pub/Sub
- Mantém seu estado interno
- Pode ser consultado por outros agentes
- Continua durante toda a execução do jogo

**Exemplos:**
- Scene_Title verifica entrada do usuário e reage
- OptionsScreen renderiza e atualiza configurações
- PatchNotes carrega e exibe dados

---

#### **6. Fase de Cleanup/Preparação de Transição**

Antes de desativar ou transicionar, agente limpa recursos.

**O que ocorre:**
- Função `cleanup()` é chamada
- Listeners de eventos são removidos
- Recursos visuais são destruídos (elementos HTML)
- Timers/Intervals são cancelados
- Listeners de teclado/mouse são removidos
- Referências são limpas
- Canvas e imagens são descartadas

**Objetivo:** Evitar memory leaks e conflitos entre cenas.

---

#### **7. Fase de Desregistro (Opcional)**

Em casos de recarregamento completo, agente é desregistrado.

**O que ocorre:**
- Manifesto é removido do registro
- Instância é descartada
- Todas as referências são limpas
- Agente pode ser re-registrado

---

### Transições Entre Fases

```
┌──────────────┐
│  Registro    │
└──────┬───────┘
       │
       v
┌──────────────┐
│  Validação   │
└──────┬───────┘
       │
       v
┌──────────────────────┐
│ Resolução Dependen.  │
└──────┬───────────────┘
       │
       v
┌──────────────┐
│ Inicialização│
└──────┬───────┘
       │
       v
┌──────────────┐◄─────────────────┐
│  Operação    │                  │
└──────┬───────┘                  │
       │                          │
       ├──► Transição de Cena ────┤
       │                          │
       ├──► Mudança de Estado     │
       │                          │
       │         ┌─────────────┐  │
       └────────►│  Cleanup    │──┘
                 └─────────────┘
```

---

## Sistema de Comunicação (Pub/Sub)

### O Padrão Pub/Sub (Publicação/Assinatura)

O Ancient Souls utiliza um padrão Event Bus baseado em Pub/Sub para comunicação entre agentes, eliminando acoplamento direto.

### Benefícios

1. **Desacoplamento:** Agentes não precisam conhecer uns aos outros
2. **Escalabilidade:** Novos agentes podem ouvir eventos sem modificar emissores
3. **Manutenibilidade:** Lógica de comunicação centralizada
4. **Debugging:** Todos os eventos passam pelo PluginManager

### Como Funciona

#### **Publicação (Publish)**

Um agente publica um evento para qualquer um que esteja ouvindo:

```
AS.PluginManager.publish('event:name', { data: 'informações' })
```

**Características:**
- Síncrono - todos os assinantes recebem imediatamente
- Dados podem ser qualquer objeto JavaScript
- Não há validação de tipo, confiança em contrato
- Event names seguem padrão kebab-case: `namespace:event:action`

**Exemplo Real:**
```
AS.PluginManager.publish('titlescreen:menu:selected', { 
  option: 'newgame',
  timestamp: Date.now()
})
```

---

#### **Assinatura (Subscribe)**

Um agente se inscreve para receber um evento:

```
AS.PluginManager.subscribe('event:name', (data) => {
  // Lida com o evento
})
```

**Características:**
- Callback é executado sempre que evento é publicado
- Múltiplos assinantes podem ouvir o mesmo evento
- Callbacks são armazenados em array
- Ordem de execução é FIFO (First In, First Out)

**Exemplo Real:**
```
AS.PluginManager.subscribe('titlescreen:scene:ready', (data) => {
  console.log('Tela de Título está pronta!');
  this.createUI();
})
```

---

#### **Desassinatura (Unsubscribe)**

Um agente remove sua assinatura:

```
AS.PluginManager.unsubscribe('event:name', callbackReference)
```

**Características:**
- Remove callback específico do array
- Callback deve ser uma referência válida
- Se callback não existir, nada acontece
- Essencial para cleanup durante terminate

**Exemplo Real:**
```
// Em cleanup()
AS.PluginManager.unsubscribe('scene:update', this.onSceneUpdate)
```

---

### Convenção de Nomes de Eventos

Events seguem hierarquia clara:

```
namespace:domain:action:target
   |        |      |      |
   |        |      |      └─ Opcional: alvo específico
   |        |      └─ Ação principal
   |        └─ Domínio (scene, ui, effects, etc)
   └─ Namespace do agente (titlescreen, options, etc)

Exemplos:
titlescreen:scene:ready           (Scene_Title está pronta)
titlescreen:scene:terminate       (Scene_Title está terminando)
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

## Versionamento e Controle de Versão

### ⚠️ LÓGICA DE VERSIONAMENTO - OBRIGATÓRIA E IMUTÁVEL

**Esta seção não pode ser alterada. A lógica abaixo é o padrão universal do projeto.**

---

## Versionamento de Plugins (SemVer Iterativo)

Todos os plugins seguem **SemVer com incremento iterativo obrigatório**:

**Formato:** `MAJOR.MINOR.PATCH`

### Regra de Incremento Iterativo (INVIOLÁVEL)

```
COMEÇA EM:  1.0.0

INCREMENTA PATCH:
1.0.0 → 1.0.1 → 1.0.2 → 1.0.3 → 1.0.4 → 1.0.5 → 1.0.6 → 1.0.7 → 1.0.8 → 1.0.9

QUANDO ATINGE 1.0.9, RESETA PATCH PARA 0 E INCREMENTA MINOR:
1.0.9 → 1.1.0

INCREMENTA PATCH NOVAMENTE:
1.1.0 → 1.1.1 → 1.1.2 → 1.1.3 → 1.1.4 → 1.1.5 → 1.1.6 → 1.1.7 → 1.1.8 → 1.1.9

QUANDO ATINGE 1.1.9, RESETA NOVAMENTE:
1.1.9 → 1.2.0

CONTINUA ATÉ:
1.2.0 → ... → 1.2.9 → 1.3.0 → ... → 1.9.9

QUANDO ATINGE 1.9.9, RESETA MINOR E PATCH, INCREMENTA MAJOR:
1.9.9 → 2.0.0

E O CICLO RECOMEÇA:
2.0.0 → 2.0.1 → ... → 2.0.9 → 2.1.0 → ... → 2.9.9 → 3.0.0
```

### Tabela Visual Completa do Ciclo

| De | Para | Motivo |
|---|---|---|
| 1.0.0 | 1.0.1 | Bug fix (PATCH++) |
| 1.0.8 | 1.0.9 | Bug fix (PATCH++) |
| **1.0.9** | **1.1.0** | PATCH atingiu 9, reseta para 0 e incrementa MINOR |
| 1.1.0 | 1.1.1 | Bug fix (PATCH++) |
| 1.1.8 | 1.1.9 | Bug fix (PATCH++) |
| **1.1.9** | **1.2.0** | PATCH atingiu 9, reseta para 0 e incrementa MINOR |
| 1.2.0 | 1.2.1 | Bug fix (PATCH++) |
| 1.2.9 | 1.3.0 | PATCH atingiu 9 |
| 1.3.0 | 1.3.1 | Bug fix |
| 1.8.9 | 1.9.0 | PATCH atingiu 9 |
| 1.9.0 | 1.9.1 | Bug fix |
| 1.9.8 | 1.9.9 | Bug fix |
| **1.9.9** | **2.0.0** | MINOR atingiu 9, reseta para 0, incrementa MAJOR |
| 2.0.0 | 2.0.1 | Ciclo recomeça |

### Quando Incrementar?

- **PATCH (1.0.X+1):** Correção de bugs, ajustes menores, melhorias de performance
- **MINOR (1.X+1.0):** Novas funcionalidades compatíveis com versão anterior
- **MAJOR (X+1.0.0):** Mudanças que quebram compatibilidade (raro, raramente ocorre)

⚠️ **IMPORTANTE:** Você não escolhe PATCH, MINOR ou MAJOR arbitrariamente. Você incrementa sequencialmente no PATCH até atingir 9, aí reseta e incrementa MINOR, etc.

---

## Versionamento do Jogo (Patch Notes - 4 Dígitos)

O jogo em si segue padrão **diferente** e mais granular que os plugins:

**Formato:** `MAJOR.MINOR.PATCH.BUILD-TIPO`

```
X.X.X.X-tipo
│ │ │ │  │
│ │ │ │  └─ Tipo: alfa, beta, rc, release
│ │ │ └──── Build (0+): Número sequencial dentro daquele patch
│ │ └────── Patch (0+): Correções dentro de uma versão minor
│ └──────── Minor (0+): Novas funcionalidades do jogo
└────────── Major (0+): Grandes marcos (v1.0, v2.0, etc)
```

### Regra de Incremento Iterativo para Game Version

**Começa em:** `v0.0.0.0-alfa`

```
INCREMENTA BUILD:
0.0.0.0-alfa → 0.0.0.1-alfa → 0.0.0.2-alfa → ... → 0.0.0.9-alfa

QUANDO BUILD ATINGE 9, RESETA PARA 0 E INCREMENTA PATCH:
0.0.0.9-alfa → 0.0.1.0-alfa

CONTINUA BUILD:
0.0.1.0-alfa → 0.0.1.1-alfa → ... → 0.0.1.9-alfa

QUANDO PATCH ATINGE 9, RESETA E INCREMENTA MINOR:
0.0.9.9-alfa → 0.1.0.0-alfa

CONTINUA CICLO:
0.1.0.0-alfa → 0.1.0.1-alfa → ... → 0.1.9.9-alfa

QUANDO MINOR ATINGE 9, RESETA E INCREMENTA MAJOR, MAS MUDA TIPO:
0.9.9.9-alfa → 1.0.0.0-beta ⬅️ Muda de alfa para beta!

CICLO BETA:
1.0.0.0-beta → 1.0.0.1-beta → ... → 1.0.0.9-beta → 1.0.1.0-beta → ... → 1.9.9.9-beta

QUANDO BETA ATINGE 1.9.9.9, MUDA PARA RELEASE:
1.9.9.9-beta → 2.0.0.0-release ⬅️ Muda para release!

CICLO RELEASE:
2.0.0.0-release → 2.0.0.1-release → ... → 2.9.9.9-release → 3.0.0.0-release
```

### Tabela Visual - Game Version

| De | Para | Motivo |
|---|---|---|
| 0.0.0.0-alfa | 0.0.0.1-alfa | BUILD++ |
| 0.0.0.8-alfa | 0.0.0.9-alfa | BUILD++ |
| **0.0.0.9-alfa** | **0.0.1.0-alfa** | BUILD atingiu 9, reseta para 0 e PATCH++ |
| 0.0.1.0-alfa | 0.0.1.1-alfa | BUILD++ |
| 0.0.1.9-alfa | 0.0.2.0-alfa | BUILD atingiu 9 |
| 0.0.9.9-alfa | **0.1.0.0-alfa** | PATCH atingiu 9, reseta e MINOR++ |
| 0.1.0.0-alfa | 0.1.0.1-alfa | BUILD++ |
| 0.1.9.9-alfa | 0.2.0.0-alfa | PATCH atingiu 9 |
| 0.9.9.9-alfa | **1.0.0.0-beta** | MAJOR++, reseta tudo, **MUDA PARA BETA** |
| 1.0.0.0-beta | 1.0.0.1-beta | BUILD++ (ciclo beta começa) |
| 1.0.0.9-beta | 1.0.1.0-beta | BUILD atingiu 9 |
| 1.9.9.9-beta | **2.0.0.0-release** | MAJOR++, reseta tudo, **MUDA PARA RELEASE** |
| 2.0.0.0-release | 2.0.0.1-release | BUILD++ (ciclo release começa) |
| 2.9.9.9-release | 3.0.0.0-release | MAJOR++ (novo ciclo release) |

### Fases de Tipo

```
FASE 1: ALFA (0.X.X.X-alfa)
  └─ Desenvolvimento inicial, muitos bugs, features experimentais

FASE 2: BETA (1.0.0.0-beta até 1.9.9.9-beta)
  └─ Features mais estáveis, bugs sendo corrigidos, beta testing

FASE 3: RELEASE (2.0.0.0-release em diante)
  └─ Versão estável pronta para produção
```

⚠️ **IMPORTANTE - Sequência de Tipo (INVIOLÁVEL):**
```
alfa → alfa → ... → alfa (0.X.X.X)
                      ↓
                     beta (1.X.X.X)
                      ↓
                    release (2.X.X.X+)
```

Você **não pula fases**. Você vai de alfa para beta apenas quando MAJOR atinge a mudança, depois de beta para release quando MAJOR incrementa novamente.

---

### Política de Alteração de Versão

⚠️ **REGRA OBRIGATÓRIA:** Versão só pode ser alterada com autorização do mantenedor.

**Por que existe essa regra?**
- Rastreabilidade de mudanças
- Integridade de backups
- Compatibilidade entre agentes
- Auditoria de desenvolvimento
- Prevenção de conflitos

**Procedimento para Alterar Versão:**

1. **Identificar Tipo de Mudança**
   - Correção de bug? → Incrementa PATCH (1.0.0 → 1.0.1)
   - Teste completo sem bugs críticos? → Respeita sequência iterativa
   - Quebra compatibilidade? → Raro, mas incrementa MAJOR apenas ao atingir X.9.9

2. **Solicitar Autorização**
   - Informar mudanças implementadas
   - Descrever impacto
   - Descrever testes realizados

3. **Após Aprovação: Ordem Obrigatória**
   ```
   PASSO 1: Implementar mudanças
   ├─ Alterar código
   ├─ Testar completamente
   └─ Validar dependências
   
   PASSO 2: Incrementar versão (sequencialmente)
   ├─ @version no cabeçalho (próximo número na sequência)
   ├─ version no manifesto (mesmo número)
   └─ Em 2 lugares!
   
   PASSO 3: Atualizar chatlog (APENAS AGORA!)
   ├─ Uma nova entrada
   ├─ Com data, autor, detalhes
   └─ Confirmar nova versão
   ```

---

### Exemplo: Fluxo Completo de Versão de Plugin

```
ESTADO INICIAL:
- Arquivo: AS_1.0_Battle.js (v1.0.5)
- Status: Funcionando

MUDANÇA 1 - Bug Fix #1:
1. FIX: Corrigir bug X
2. VERSION: 1.0.5 → 1.0.6 (próximo na sequência)
3. CHATLOG: Entrada com detalhes

MUDANÇA 2 - Bug Fix #2:
1. FIX: Corrigir bug Y
2. VERSION: 1.0.6 → 1.0.7
3. CHATLOG: Entrada nova

... (continua assim até 1.0.9)

MUDANÇA N - Bug Fix #N:
1. FIX: Corrigir bug Z
2. VERSION: 1.0.8 → 1.0.9
3. CHATLOG: Entrada

MUDANÇA N+1 - Nova Feature:
1. FEATURE: Adicionar nova funcionalidade
2. VERSION: 1.0.9 → 1.1.0 ← PATCH reseta para 0, MINOR incrementa
3. CHATLOG: Entrada

... (continua em 1.1.x até 1.1.9)

MUDANÇA M - Quando atingir 1.9.9:
1. MAJOR CHANGE: Mudança quebra compatibilidade
2. VERSION: 1.9.9 → 2.0.0 ← MAJOR incrementa, MINOR e PATCH resetam
3. CHATLOG: Entrada
```

---

### Exemplo: Fluxo Completo de Game Version

```
JOGO COMEÇA EM: v0.0.0.0-alfa

BUILD 1: v0.0.0.1-alfa
BUILD 2: v0.0.0.2-alfa
...
BUILD 9: v0.0.0.9-alfa

RESETA BUILD, INCREMENTA PATCH:
PATCH 1: v0.0.1.0-alfa
BUILD 1: v0.0.1.1-alfa
...
BUILD 9: v0.0.1.9-alfa

RESETA BUILD, INCREMENTA PATCH NOVAMENTE:
PATCH 2: v0.0.2.0-alfa
...
(continua até PATCH 9)

PATCH 9, BUILD 9: v0.0.9.9-alfa

RESETA PATCH, INCREMENTA MINOR:
MINOR 1: v0.1.0.0-alfa
...
(continua até MINOR 9)

MINOR 9, PATCH 9, BUILD 9: v0.9.9.9-alfa

TRANSIÇÃO PARA BETA! (MAJOR incrementa, tudo reseta):
BETA INÍCIO: v1.0.0.0-beta ← Muda de alfa para beta!

BUILD 1: v1.0.0.1-beta
...
BUILD 9: v1.0.0.9-beta

PATCH 1: v1.0.1.0-beta
...
(continua até 1.9.9.9-beta)

BETA FINAL: v1.9.9.9-beta

TRANSIÇÃO PARA RELEASE! (MAJOR incrementa):
RELEASE INÍCIO: v2.0.0.0-release ← Muda de beta para release!

BUILD 1: v2.0.0.1-release
...
(continua indefinidamente em release)
```

---

### Regra Importante: Um Único Chatlog por Plugin

❌ **PROIBIDO:** Criar novo arquivo de chatlog  
✅ **OBRIGATÓRIO:** Sempre atualizar o chatlog existente

```
Estrutura correta:
chatlogs/
  ├─ AS_0.0_PluginManager_chatlog.md        ← ÚNICO arquivo
  ├─ AS_1.0_TitleScreen_chatlog.md          ← ÚNICO arquivo
  ├─ AS_1.1_TitleScreenUI_chatlog.md        ← ÚNICO arquivo
  └─ AS_1.3_OptionsScreen_chatlog.md        ← ÚNICO arquivo

Estrutura ERRADA:
chatlogs/
  ├─ AS_1.3_OptionsScreen_chatlog.md        (original)
  ├─ AS_1.3_OptionsScreen_chatlog_v1.0.9.md (NÃO faça isso!)
  ├─ AS_1.3_OptionsScreen_changelog.md      (NÃO faça isso!)
  └─ AS_1.3_OptionsScreen_updates.md        (NÃO faça isso!)
```

**O chatlog é um arquivo de histórico contínuo**, não um arquivo por versão. Simplesmente adicione novas entradas ao final.

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

**Fim do Documento README.md**
