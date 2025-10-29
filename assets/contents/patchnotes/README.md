# 📜 Sistema de Notas de Atualização (Patch Notes)

Este documento explica como funciona o sistema de notas de atualização do **Ancient Souls** e qual estrutura **OBRIGATÓRIA** deve ser seguida ao criar ou modificar arquivos de patchnotes.

---

## ⚠️ REGRA DE OURO

**PATCH NOTES DESCREVEM O JOGO PRONTO, NÃO COMO FAZER O JOGO!**

- ✅ **CERTO**: "Batalhas agora são mais rápidas e fluidas"
- ❌ **ERRADO**: "Sistema de batalha implementado"
- ❌ **ERRADO**: "Você pode criar batalhas táticas"
- ❌ **ERRADO**: "Motor de jogo completo rodando"

**VOCÊ ESTÁ DESCREVENDO O QUE O JOGADOR VAI ENCONTRAR QUANDO JOGAR, NÃO O QUE FOI DESENVOLVIDO!**

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

## 📝 Estrutura do Conteúdo (OBRIGATÓRIA E IMUTÁVEL)

**ESTA É A ÚNICA ESTRUTURA ACEITA. NÃO INVENTE, NÃO MODIFIQUE, NÃO ADICIONE SEÇÕES EXTRAS!**

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

### ⚠️ ATENÇÃO: Seções OBRIGATÓRIAS

**TODAS as seções abaixo DEVEM estar presentes, mesmo que vazias:**

1. ✅ **Adicionados** - O que há de novo nesta versão
2. ✅ **Melhorias** - O que ficou melhor (se for a primeira versão, escrever "Nenhuma melhoria nesta versão (é a primeira!)")
3. ✅ **Correções** - Bugs corrigidos (se for a primeira versão, escrever "Nenhuma correção nesta versão (é a primeira!)")
4. ✅ **Removidos** - O que foi removido (se nada foi removido, escrever "Nenhuma remoção nesta versão")

**NÃO CRIE SEÇÕES EXTRAS COMO:**
- ❌ "Sistemas Disponíveis"
- ❌ "Características Técnicas"
- ❌ "O Que Você Pode Fazer"
- ❌ "Próximos Passos"
- ❌ "Agradecimentos"

**APENAS as 4 seções acima são permitidas!**

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

### 🚨 REGRAS ABSOLUTAS - NUNCA QUEBRE ESTAS REGRAS

#### 1️⃣ VOCÊ ESTÁ DESCREVENDO UM JOGO PRONTO, NÃO UM PROJETO EM DESENVOLVIMENTO

**PROIBIDO:**
- ❌ "Motor de jogo completo"
- ❌ "Sistema implementado"
- ❌ "Arquitetura modular"
- ❌ "Você pode criar..."
- ❌ "Permite adicionar..."
- ❌ "Compatível com..."
- ❌ "Extensibilidade"
- ❌ "JavaScript puro"
- ❌ "Renderização por canvas"
- ❌ "Sistema de cache"
- ❌ "Carregamento assíncrono"

**PERMITIDO:**
- ✅ "Batalhas são rápidas e fluidas"
- ✅ "Você enfrenta inimigos poderosos"
- ✅ "Personagens aprendem magias devastadoras"
- ✅ "Explore masmorras perigosas"
- ✅ "Colete tesouros raros"

#### 2️⃣ FOQUE NA EXPERIÊNCIA DO JOGADOR, NÃO NO DESENVOLVIMENTO

**PROIBIDO:**
- ❌ "Banco de dados robusto armazenando elementos"
- ❌ "Sistema de notas que permite funcionalidades extras"
- ❌ "IDs únicos facilitando referências"
- ❌ "Organização por categorias"

**PERMITIDO:**
- ✅ "Mais de 100 inimigos diferentes para enfrentar"
- ✅ "50 habilidades únicas para dominar"
- ✅ "Equipamentos lendários esperando para serem descobertos"

#### 3️⃣ ZERO TERMOS TÉCNICOS - ESCREVA PARA SEU AVÔ ENTENDER

**PROIBIDO:**
- ❌ plugins, scripts, classes JavaScript, hooks, callbacks
- ❌ fps, hitbox, raycast, sprite atlas, canvas, buffer
- ❌ pathfinding, A* algorithm, event-driven, modular
- ❌ null pointer, exception, debugging, refatorado
- ❌ JSON, API, framework, engine, core

**PERMITIDO:**
- ✅ sistema, recurso, funcionalidade, característica
- ✅ fluidez, colisão, detecção, gráficos, animação
- ✅ rápido, suave, bonito, empolgante, épico

---

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
   - Use palavras como: épico, incrível, espetacular, revolucionário, devastador, lendário
   - Crie expectativa e entusiasmo

6. **Descreva o que o jogador VAI FAZER, não o que foi desenvolvido**
   - ❌ "Sistema de combate implementado"
   - ✅ "Enfrente inimigos em batalhas táticas por turnos"

---

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

6. **Não fale sobre desenvolvimento ou ferramentas**
   - ❌ "Motor de jogo completo rodando"
   - ❌ "Arquitetura modular implementada"
   - ❌ "Sistema de plugins robusto"
   - ✅ "Aventura épica esperando por você"

7. **Não use linguagem de "criação" ou "ferramentas"**
   - ❌ "Você pode criar mapas"
   - ❌ "Permite desenhar heróis"
   - ❌ "Ferramenta para compor trilha"
   - ✅ "Explore mapas gigantescos"
   - ✅ "Controle heróis únicos"
   - ✅ "Trilha sonora épica acompanha sua jornada"

---

## 🎯 Exemplos Práticos

### ❌ MUITO RUIM (Linguagem Técnica de Desenvolvimento)

```markdown
## Adicionados

- Implementado plugin AS_CombatSystem v2.0
- Refatorado battle engine para usar event-driven architecture
- Adicionado buffering de sprite rendering
- Motor de jogo completo rodando a 60 FPS
- Sistema de cache inteligente implementado
- Arquitetura modular onde cada sistema funciona independentemente
```

**POR QUE ESTÁ ERRADO:**
- Fala sobre implementação, não sobre o jogo
- Usa termos técnicos (plugin, engine, buffering, cache)
- Parece documentação de desenvolvedor
- O jogador não liga para arquitetura ou como foi feito

---

### ❌ RUIM (Linguagem de Ferramenta, não de Jogo)

```markdown
## Adicionados

- Você pode criar seu próprio RPG completo
- Desenhar mapas e conectá-los em um mundo aberto
- Criar heróis memoráveis com classes únicas
- Desenvolver inimigos desafiadores
- Escrever histórias épicas usando diálogos
- Banco de dados robusto armazenando elementos
```

**POR QUE ESTÁ ERRADO:**
- Fala sobre CRIAR o jogo, não JOGAR o jogo
- É linguagem de game maker/editor, não de jogo pronto
- Confunde o jogador fazendo parecer que é uma ferramenta

---

### ✅ PERFEITO (Linguagem de Jogo Pronto)

```markdown
## ✨ Adicionados

### ⚔️ Sistema de Combate Épico

- **Batalhas táticas por turnos** onde você comanda até 4 heróis contra hordas de monstros
- **Combos devastadores** que surgem ao usar habilidades na ordem certa
- **15 elementos mágicos** incluindo Fogo Infernal, Gelo Eterno e Trovão Destruidor
- **Animações espetaculares** com explosões, raios e partículas mágicas que iluminam a tela
- **Críticos brutais** que podem virar uma batalha perdida em vitória gloriosa

### 🗺️ Exploração de Mundo Vasto

- **Mais de 50 mapas únicos** incluindo florestas sombrias, masmorras traiçoeiras e cidades vibrantes
- **Segredos escondidos** em cada canto esperando serem descobertos
- **NPCs com histórias próprias** que contam lendas antigas e dão missões épicas
- **Baús de tesouro** repletos de armas lendárias e armaduras poderosas
- **Armadilhas mortais** que exigem reflexos rápidos para sobreviver

### 👥 Heróis Memoráveis

- **4 heróis únicos** cada um com personalidade, história de fundo e motivações próprias
- **Mais de 80 habilidades** para dominar, desde magias de cura até golpes que devastam exércitos
- **Progressão até nível 99** tornando seus heróis cada vez mais poderosos
- **Árvore de equipamentos** com centenas de armas, armaduras e acessórios para coletar
```

**POR QUE ESTÁ CERTO:**
- Descreve o que o jogador VAI FAZER (comandar heróis, explorar mapas, dominar habilidades)
- Usa linguagem empolgante (épico, devastador, lendário)
- Específico (50 mapas, 80 habilidades, 4 heróis)
- Zero termos técnicos
- Foca na experiência, não no desenvolvimento

---

## 📊 Checklist Antes de Publicar

Antes de finalizar um arquivo de patchnote, verifique:

### ✅ Estrutura e Formato
- [ ] Nome do arquivo segue padrão EXATO: `VERSAO_nome-descritivo.txt`
- [ ] Versão, data e categoria estão preenchidas corretamente
- [ ] Resumo é claro, empolgante e em 1-2 parágrafos
- [ ] Todas as 4 seções OBRIGATÓRIAS estão presentes: Adicionados, Melhorias, Correções, Removidos
- [ ] Nenhuma seção extra foi adicionada (como "Sistemas Disponíveis", "Características Técnicas", etc)
- [ ] Emojis estão sendo usados para organização visual
- [ ] Mensagem final motivacional está presente

### ✅ Linguagem e Tom
- [ ] Linguagem é 100% acessível para jogadores comuns (seu avô entenderia?)
- [ ] ZERO termos técnicos de programação foram usados
- [ ] ZERO menções a desenvolvimento, implementação ou ferramentas
- [ ] Tom é empolgante e positivo (épico, devastador, lendário)
- [ ] Benefícios para o jogador estão claros
- [ ] Usa verbos de ação do jogador (explore, lute, colete, domine)
- [ ] NÃO usa verbos de criação/desenvolvimento (criar, implementar, desenvolver, permitir)

### ✅ Conteúdo
- [ ] Descreve o JOGO PRONTO, não o projeto em desenvolvimento
- [ ] Foca na EXPERIÊNCIA DO JOGADOR, não em código ou arquitetura
- [ ] É específico quando possível (números, nomes de habilidades, locais)
- [ ] Não é vago ("melhorias gerais" é proibido)
- [ ] Se for versão 0.0.0.0-alfa, Melhorias e Correções dizem "Nenhuma X nesta versão (é a primeira!)"

### 🚨 VERIFICAÇÃO FINAL - PERGUNTAS CRÍTICAS

Antes de salvar, responda HONESTAMENTE:

1. **Um jogador de 12 anos que nunca programou entenderia tudo?**
   - Se NÃO → Reescreva em linguagem mais simples

2. **Parece descrição de um jogo pronto ou de uma ferramenta de desenvolvimento?**
   - Se parece ferramenta → Reescreva focando na experiência de jogar

3. **Tem alguma palavra que um desenvolvedor usaria mas um jogador não?**
   - Se SIM → Remova ou substitua

4. **Você usaria essas palavras para descrever Final Fantasy, Chrono Trigger ou Zelda?**
   - Se NÃO → Ajuste o tom

5. **Está empolgante? Dá vontade de jogar?**
   - Se NÃO → Adicione mais entusiasmo e detalhes épicos

---

## 🔄 Versionamento

Sempre que criar uma nova versão:

1. Crie um novo arquivo `.txt` na pasta `patchnotes`
2. Nunca delete versões antigas (elas formam o histórico)
3. Versões devem ser sequenciais e fazer sentido
4. Use hotfix (quarto número) apenas para correções urgentes

---

## 🎓 RESUMO EXECUTIVO PARA IA

**SE VOCÊ É UMA IA LENDO ISTO, MEMORIZE:**

### O QUE FAZER:
✅ Descrever o jogo PRONTO e JOGÁVEL
✅ Focar na EXPERIÊNCIA do jogador
✅ Usar linguagem SIMPLES e EMPOLGANTE
✅ Ser ESPECÍFICO (números, nomes, detalhes)
✅ Usar verbos de AÇÃO DO JOGADOR (explore, lute, colete)

### O QUE NÃO FAZER:
❌ Falar sobre desenvolvimento, implementação ou código
❌ Usar termos técnicos (plugin, script, engine, buffer, etc)
❌ Criar seções extras além das 4 obrigatórias
❌ Usar verbos de criação (criar, desenvolver, permitir, implementar)
❌ Falar sobre ferramentas ou capacidades de edição
❌ Mencionar arquitetura, motor, sistema de arquivos

### TESTE RÁPIDO:
**Antes de finalizar, pergunte:**
- "Isso soa como patch notes de Final Fantasy?" → Se SIM, está certo
- "Isso parece manual de RPG Maker?" → Se SIM, está ERRADO

---

**📜 Mantenha as notas de atualização RIGOROSAMENTE dentro deste padrão para que todos os jogadores possam acompanhar a evolução épica de Ancient Souls!**
