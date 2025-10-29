# 📜 Sistema de Notas de Atualização (Patch Notes)

Este documento explica como funciona o sistema de notas de atualização do **Ancient Souls** e qual estrutura deve ser seguida ao criar ou modificar arquivos de patchnotes.

---

## 📁 Estrutura de Arquivos

Cada atualização do jogo possui um arquivo próprio na pasta `patchnotes`, seguindo este padrão de nomenclatura:

```
VERSAO_NOME-DESCRITIVO.txt
```

### Exemplos:
- `0.0.0.0-alfa_base-inicial.txt`
- `0.1.0.0-beta_nova-classe.txt`
- `1.0.0.0_lancamento-oficial.txt`

---

## 🏷️ Convenções de Nomenclatura

### Formato da Versão

A versão segue o padrão **MAJOR.MINOR.PATCH.HOTFIX**:

- **MAJOR** (primeiro número): Mudanças gigantes que transformam o jogo
- **MINOR** (segundo número): Novos conteúdos importantes (novas áreas, classes, sistemas)
- **PATCH** (terceiro número): Melhorias, balanceamento e pequenas adições
- **HOTFIX** (quarto número): Correções rápidas de bugs críticos

### Sufixos de Estágio

- `-alfa`: Versões em desenvolvimento inicial
- `-beta`: Versões em teste público
- _(sem sufixo)_: Versões oficiais lançadas

### Nome Descritivo

Após a versão, use um nome curto e claro separado por underline (`_`), usando hífens (`-`) entre palavras:

- ✅ `base-inicial`
- ✅ `nova-classe-necromante`
- ✅ `sistema-crafting`
- ❌ `NovaClasse` (sem hífen)
- ❌ `nova classe` (espaços não permitidos)

---

## 📝 Estrutura do Conteúdo

Cada arquivo de patchnote deve seguir esta estrutura em Markdown:

```markdown
# 🎮 Título da Atualização

**Versão:** X.X.X.X-sufixo  
**Data:** DD/MM/AAAA  
**Categoria:** Tipo de Atualização

---

## 📖 Resumo

Um parágrafo descrevendo de forma clara e empolgante o que esta atualização traz.
Use linguagem simples e acessível - escreva para jogadores, não para programadores!

---

## ✨ Adicionados

### 🎯 Nome do Sistema/Feature

- **Descrição clara** do que foi adicionado
- **Mais detalhes** explicando como funciona
- Continue listando novidades...

### 🗡️ Outro Sistema Novo

- Mais adições...

---

## 🔧 Melhorias

- **Sistema melhorado**: Explicação clara da melhoria
- **Outra melhoria**: Mais detalhes...

---

## 🐛 Correções

- **Corrigido bug crítico** que causava problema X
- **Resolvido problema** de comportamento Y
- **Ajustado comportamento** de sistema Z

---

## ❌ Removidos

- **Sistema removido** com explicação do motivo
- Se nada foi removido, escrever: "Nenhuma remoção nesta versão"

---

**🎮 Mensagem final motivacional para o jogador!**
```

---

## 🎨 Categorias de Atualização

Use uma destas categorias no campo **Categoria**:

- **Base Inicial**: Primeira versão, fundação do jogo
- **Grande Atualização**: Mudanças transformadoras com múltiplos sistemas novos
- **Atualização de Conteúdo**: Novos mapas, missões, personagens
- **Melhorias e Balanceamento**: Ajustes de gameplay e performance
- **Correção Crítica**: Hotfix para bugs graves
- **Atualização Técnica**: Mudanças no sistema, otimizações

---

## ✍️ Guia de Escrita

### ✅ SEMPRE FAÇA:

1. **Use linguagem simples e clara**
   - ❌ "Implementamos sistema de pathfinding com A* algorithm"
   - ✅ "Personagens agora caminham de forma mais inteligente pelo mapa"

2. **Foque no benefício para o jogador**
   - ❌ "Refatorado código do sistema de batalha"
   - ✅ "Batalhas agora são 30% mais rápidas e fluidas"

3. **Use emojis para organizar visualmente**
   - 🎮 Gameplay
   - ⚔️ Combate
   - 🗺️ Exploração
   - 👤 Personagens
   - 🎨 Visual
   - 🎵 Áudio
   - 💾 Salvamento

4. **Seja específico quando possível**
   - ❌ "Adicionadas novas habilidades"
   - ✅ "Adicionadas 15 novas habilidades de fogo, incluindo Meteoro e Explosão Solar"

5. **Mantenha tom empolgante e positivo**
   - Use palavras como: épico, incrível, espetacular, revolucionário
   - Crie expectativa e entusiasmo

### ❌ NUNCA FAÇA:

1. **Não use termos técnicos de programação**
   - Evite: plugins, scripts, classes JavaScript, hooks, callbacks
   - Use: sistemas, recursos, funcionalidades

2. **Não mencione nomes de arquivos ou código**
   - ❌ "Adicionado AS_1.5_NewSystem.js"
   - ✅ "Adicionado novo sistema de crafting"

3. **Não seja vago demais**
   - ❌ "Melhorias gerais"
   - ✅ "Combates 25% mais rápidos e interface mais responsiva"

4. **Não use jargões de game dev**
   - Evite: fps, hitbox, raycast, sprite atlas
   - Use: fluidez, colisão, detecção, gráficos

5. **Não escreva em tom técnico ou formal**
   - ❌ "Correção de bug que resultava em null pointer exception"
   - ✅ "Corrigido travamento que ocorria ao abrir inventário cheio"

---

## 🎯 Exemplos Práticos

### ❌ RUIM (Linguagem Técnica)
```markdown
## Adicionados

- Implementado plugin AS_CombatSystem v2.0
- Refatorado battle engine para usar event-driven architecture
- Adicionado buffering de sprite rendering
```

### ✅ BOM (Linguagem Acessível)
```markdown
## ✨ Adicionados

### ⚔️ Sistema de Combate Melhorado
- **Batalhas mais dinâmicas** com animações 60% mais fluidas
- **Combos especiais** que surgem ao usar habilidades em sequência inteligente
- **Efeitos visuais espetaculares** com explosões, raios e partículas mágicas
```

---

## 📊 Checklist Antes de Publicar

Antes de finalizar um arquivo de patchnote, verifique:

- [ ] Nome do arquivo segue padrão `VERSAO_nome-descritivo.txt`
- [ ] Versão, data e categoria estão preenchidas corretamente
- [ ] Resumo é claro e empolgante
- [ ] Todas as seções estão presentes (Adicionados, Melhorias, Correções, Removidos)
- [ ] Linguagem é acessível para jogadores comuns
- [ ] Nenhum termo técnico de programação foi usado
- [ ] Emojis estão sendo usados para organização visual
- [ ] Benefícios para o jogador estão claros
- [ ] Mensagem final motivacional está presente

---

## 🔄 Versionamento

Sempre que criar uma nova versão:

1. Crie um novo arquivo `.txt` na pasta `patchnotes`
2. Nunca delete versões antigas (elas formam o histórico)
3. Versões devem ser sequenciais e fazer sentido
4. Use hotfix (quarto número) apenas para correções urgentes

---

**📜 Mantenha as notas de atualização organizadas e acessíveis para que todos os jogadores possam acompanhar a evolução épica de Ancient Souls!**
