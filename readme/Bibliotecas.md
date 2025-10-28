# Bibliotecas JavaScript para RPG Maker MZ100 bibliotecas JS/Node que você pode usar em projetos com RPG Maker MZ (engine HTML5/JS). Cada linha: nome + o que faz (uma frase). Fontes de referência para algumas das mais importantes: PixiJS, Howler, GSAP, Matter.js, Lodash e Axios. 



Este documento lista bibliotecas úteis categorizadas por finalidade. RPG Maker MZ usa HTML5/JavaScript, permitindo integração com a maioria das bibliotecas JS/Node.PixiJS — renderização 2D WebGL rápida (sprites, contêineres, filtros).



---Howler.js — gerenciamento e playback de áudio (WebAudio + fallback).



## 📊 ÍndiceGSAP — animações/timelines profissionais e tweens de alto desempenho.



1. [Renderização 2D/3D e Gráficos](#renderização-2d3d-e-gráficos)Matter.js — motor de física 2D (rigid bodies, colisões).

2. [Áudio e Música](#áudio-e-música)

3. [Animações e Transições](#animações-e-transições)p5.js — utilitários criativos para gráficos e interatividade.

4. [Física e Colisões](#física-e-colisões)

5. [IA e Pathfinding](#ia-e-pathfinding)Three.js — renderização 3D/WebGL (se quiser objetos 3D dentro de HTML).

6. [Matemática e Vetores](#matemática-e-vetores)

7. [Armazenamento e Banco de Dados](#armazenamento-e-banco-de-dados)Phaser — framework de jogos 2D (pode ser usado modularmente).

8. [Requisições HTTP e Comunicação](#requisições-http-e-comunicação)

9. [Manipulação de Dados](#manipulação-de-dados)EaselJS (CreateJS) — manipulação de canvas e gráficos 2D.

10. [Internacionalização e Formatação](#internacionalização-e-formatação)

11. [Parsing e Serialização](#parsing-e-serialização)Tone.js — síntese e processamento de áudio avançado (sintetizadores, efeitos).

12. [Compressão e Criptografia](#compressão-e-criptografia)

13. [Validação e Schemas](#validação-e-schemas)tween.js — biblioteca simples de tweening para transições.

14. [Eventos e Reatividade](#eventos-e-reatividade)

15. [Gerenciamento de Estado](#gerenciamento-de-estado)anime.js — animações DOM/SVG/canvas com API simples.

16. [UI e Componentes](#ui-e-componentes)

17. [CSS e Estilos](#css-e-estilos)RxJS — programação reativa (streams/eventos complexos).

18. [Debugging e Testing](#debugging-e-testing)

19. [Build Tools e Bundlers](#build-tools-e-bundlers)Lodash — utilitários para arrays/objetos/funções (facilita lógica).

20. [Utilidades Gerais](#utilidades-gerais)

21. [Machine Learning](#machine-learning)Underscore.js — utilitários funcionais leves (similar ao Lodash).

22. [Desktop e Mobile](#desktop-e-mobile)

23. [Backend e Servidores](#backend-e-servidores)Immutable.js — estruturas de dados imutáveis (estado previsível).

24. [Procedural Generation](#procedural-generation)

25. [Engines de Jogos](#engines-de-jogos)Fuse.js — busca fuzzy (pesquisa por nomes/itens sem erro exato).



---pathfinding.js — algoritmos de pathfinding (A*, Dijkstra) em grids.



## Renderização 2D/3D e GráficosYuka — IA para jogos (comportamentos, steering, navegação).



### Renderização 2DJSZip — criar/ler arquivos ZIP (packs, hotloads).

- **PixiJS** — Renderização WebGL 2D de alto desempenho (sprites, containers, filtros, máscaras)

- **EaselJS (CreateJS)** — Biblioteca canvas 2D para gráficos e animaçõespako — compressão/decompressão zlib/deflate em JS.

- **Konva** — Framework canvas 2D com suporte a cenas, camadas e eventos

- **Fabric.js** — Camada de alto nível sobre canvas para objetos interativossocket.io-client — comunicação em tempo real (multiplayer, sync).

- **p5.js** — Framework criativo para gráficos generativos e interatividade

- **pixi-filters** — Coleção de filtros para PixiJS (blur, glow, displacement, etc)Axios — requisições HTTP/REST (promises).

- **pixi-particles** — Sistema de partículas para PixiJS

localForage — armazenamento assíncrono (IndexedDB com API simples).

### Renderização 3D

- **Three.js** — Biblioteca WebGL completa para renderização 3D (objetos, câmeras, luzes, shaders)Dexie.js — wrapper avançado para IndexedDB (queries fáceis).

- **regl** — Wrapper funcional para WebGL, facilita criação de shaders

- **twgl.js** — Utilitários WebGL para simplificar buffers e shadersidb — wrapper minimalista para IndexedDB (promessa-friendly).



### Manipulação de Imagensi18next — internacionalização / tradução de strings.

- **sharp** — Processamento de imagens em Node (redimensionar, crop, otimizar)

- **Jimp** — Processamento de imagem puro JS (browser e Node)dayjs — manipulação de datas leve (alternativa ao moment).

- **imagemin** — Pipeline de otimização de imagens para builds

- **imagemin-pngquant** — Plugin PNG para compressão eficientemoment.js — manipulação de datas (amplamente usado, pesado).

- **color-thief** — Extrai paleta de cores dominantes de imagens

- **svgo** — Otimizador SVG (remove metadados, reduz tamanho)numeral.js — formatação de números (moeda, porcentagem).

- **svgson** — Converte SVG para JSON para manipulação programática

dat.GUI — painel de debug/config em runtime (tweak params).

---

lil-gui — fork moderno/minimal do dat.GUI.

## Áudio e Música

stats.js — monitor FPS e perf metrics em dev.

### Playback e Gerenciamento

- **Howler.js** — Gerenciamento de áudio robusto (WebAudio + fallback HTML5)tmx-parser — parser de mapas TMX (Tiled) para uso JS.

- **Tone.js** — Síntese e processamento de áudio avançado (sintetizadores, efeitos, sequências)

- **soundfont-player** — Toca instrumentos SoundFont no browser (MIDI-like)spritesheet-js — ferramentas para gerar/ler spritesheets.

- **midi.js** — Carrega e reproduz arquivos MIDI

sharp — processamento de imagens em Node (tooling: redimensionar, crop).

### Análise e Processamento

- **fft.js** — Transformada rápida de Fourier para análise de frequênciasJimp — processamento de imagem puro JS (Node).

- **jsfft** — FFT/DFT para análise de sinais

- **ndarray-fft** — FFT para estruturas ndarray (científico)Fabric.js — camada de alto nível sobre canvas para objetos interativos.



### Reconhecimento e SínteseKonva — biblioteca para canvas 2D com suporte a cenas e eventos.

- **annyang** — Reconhecimento de voz simples (Web Speech API)

- **artyom.js** — Assistente de voz com TTS e reconhecimentopixi-particles — sistema de partículas integrado ao Pixi.

- **abcjs** — Renderiza e toca notação ABC (música)

- **scribbletune** — Geração algorítmica de música e MIDIsimplex-noise — ruído simplex para procedural generation.



---noisejs — Perlin/Simplex noise (mapas, terreno procedural).



## Animações e Transiçõesseedrandom — gerador RNG com seed determinística.



- **GSAP** — Biblioteca de animações profissionais de alto desempenho (timelines, tweens, efeitos)random-js — utilitários avançados para RNG.

- **anime.js** — Animações DOM/SVG/Canvas com API simples e fluente

- **tween.js** — Biblioteca leve de tweening para transições suavesuuid — geração de UUIDs (IDs únicos para entidades, saves).

- **Velocity.js** — Animações DOM performáticas (alternativa ao jQuery)

js-yaml — parse e geração YAML (configurações legíveis).

---

marked — parser Markdown rápido (documentação/descrições).

## Física e Colisões

Handlebars — templating HTML/strings para UIs e texto dinâmico.

### Física 2D

- **Matter.js** — Motor de física 2D completo (rigid bodies, colisões, constraints)Mustache — templating logic-less para textos/menus.

- **Planck.js** — Port JavaScript do Box2D (física 2D profissional)

- **box2dweb** — Box2D para web (alternativa clássica)@sentry/browser — captura de erros/client-side para monitoramento.

- **SAT.js** — Detecção de colisão usando Separating Axis Theorem

- **poly-decomp.js** — Decomposição de polígonos para colisões complexasRollup — bundler focado em pacotes e tree-shaking (tooling).



### Física 3DWebpack — bundler generalista (assets, loaders).

- **Cannon.js / cannon-es** — Motor de física 3D (rigid bodies, forças, constraints)

- **Ammo.js** — Port do Bullet Physics para JS (física complexa)Vite — dev server e bundler rápido (hot reload).

- **Oimo.js** — Motor de física 3D leve e simples

esbuild — bundler/transpiler ultrarrápido (tooling).

### Estruturas Espaciais

- **rbush** — Árvore R-tree para indexação espacial rápida (colisões, queries)Parcel — bundler zero-config (fácil pra protótipos).

- **quadtree-js** — Quadtree para particionamento espacial em 2D

- **earcut** — Triangulação rápida de polígonosBabel — transpiler JS (suporte a sintaxes modernas).

- **clipper-lib** — Operações booleanas com polígonos (união, interseção, offset)

TypeScript — tipagem estática para segurança em grandes projetos.

---

ESLint — linting/qualidade de código JS.

## IA e Pathfinding

Prettier — formatação automática de código.

### Pathfinding

- **pathfinding.js** — Algoritmos de pathfinding (A*, Dijkstra, JPS) para gridsJest — testes unitários (Node/browser).

- **easystar.js** — Pathfinding A* otimizado para tiles

- **graphlib** — Criação e manipulação de grafos + algoritmos (paths, topologia)Mocha — runner de testes flexível.

- **fastpriorityqueue** — Fila de prioridade rápida (útil em pathfinding)

- **heap-js** — Estruturas de heap/priority queueChai — assertions para testes (usado com Mocha).

- **tinyqueue** — Fila de prioridade extremamente leve

Puppeteer — automação/headless Chrome (testes e builds).

### Comportamentos e IA

- **Yuka** — Framework de IA para jogos (steering behaviors, navegação, decision making)Playwright — automação cross-browser (testes E2E).

- **rot.js** — Toolkit para roguelikes (geração de mapas, FOV, pathfinding)

pixi-filters — coleção de filtros para Pixi (blur, glow, etc.).

### NLP e Processamento de Texto

- **natural** — Toolkit NLP (tokenização, stemming, classificadores)regl — camada functional WebGL para shaders/rápido protótipo.

- **compromise** — NLP leve para extração de entidades e análise no browser

- **js-levenshtein** — Distância de Levenshtein para fuzzy matchingtwgl.js — utilitários WebGL para facilitar shaders e buffers.

- **Fuse.js** — Busca fuzzy para pesquisa tolerante a erros

gl-matrix — algebra linear (matrizes/vetores) otimizada.

---

Victor — biblioteca de vetores 2D simples (operações vetoriais).

## Matemática e Vetores

mathjs — funções matemáticas avançadas e parser de expressões.

### Vetores e Matrizes

- **gl-matrix** — Álgebra linear otimizada (vetores, matrizes, quaternions)rbush — árvore R para indexação espacial rápida (colisões, query).

- **Victor** — Biblioteca de vetores 2D simples

- **mathjs** — Funções matemáticas avançadas e parser de expressõesquadtree-js — quadtree para particionamento espacial em 2D.

- **ndarray** — Arrays N-dimensionais para cálculos numéricos

- **numjs** — Utilitários numéricos estilo NumPyearcut — triangulação rápida de polígonos (meshes, sombras).



### Precisão Numéricapoly-decomp.js — decomposição de polígonos (colisão complexa).

- **bignumber.js** — Operações numéricas com alta precisão

- **decimal.js** — Aritmética decimal precisa (evita erros de float)SAT.js — colisões por Separating Axis Theorem (entidades simples).



---Planck.js — port do Box2D para JavaScript (física 2D avançada).



## Armazenamento e Banco de Dadosbox2dweb — Box2D para web (alternativa física clássica).



### Browser Storageopentype.js — leitura/manipulação de fontes (text rendering custom).

- **localForage** — Armazenamento assíncrono (IndexedDB) com API simples tipo localStorage

- **Dexie.js** — Wrapper avançado para IndexedDB com queries fáceiswebfontloader — carregamento de fontes web com callbacks.

- **idb** — Wrapper minimalista para IndexedDB (promise-friendly)

- **idb-keyval** — Key-value simples e leve sobre IndexedDBfile-saver — salvar arquivos no cliente (exports, saves manuais).

- **store.js** — Wrapper para localStorage/sessionStorage com fallbacks

- **secure-ls** — localStorage com encriptação simplesdownloadjs — utilitário simples para disparar downloads do browser.

- **BrowserFS** — Emula sistema de arquivos POSIX no navegador

Hammer.js — gestures/touch (swipe, pinch) para mobile.

### Banco de Dados Embarcados

- **PouchDB** — Banco NoSQL offline-first que sincroniza com CouchDBscreenfull — API simplificada para fullscreen.

- **RxDB** — Banco reativo para apps offline/realtime com sync

- **LokiJS** — Banco em memória super-rápido com índices e persistênciaclipboard.js — copiar/colar programático.

- **NeDB** — Banco leve tipo MongoDB para protótipos

- **lowdb** — DB simples baseado em JSONchroma.js — manipulação e conversão de cores.

- **sql.js** — SQLite compilado em WASM para browser

- **sqlite-wasm** — SQLite via WASM (alternativa)tinycolor2 — utilitário menor para operações com cores.



### SQL (Node)color-thief — extrai paleta de cores de imagens.

- **sqlite3** — Driver SQLite para Node

- **better-sqlite3** — Wrapper SQLite síncrono e rápidoyjs — CRDT para sincronização colaborativa (multiplayer/offline sync).

- **pg (node-postgres)** — Cliente PostgreSQL

- **mysql2** — Cliente MySQL com PromisesAutomerge — CRDT para dados colaborativos/offline-first.

- **knex** — Query builder SQL para migrations e queries

- **sequelize** — ORM para bancos SQL (models, associations)protobufjs — Protobuf em JS (mensagens compactas, rede).

- **typeorm** — ORM TypeScript para SQL/NoSQL

- **objection** — ORM flexível baseado em Knexmsgpack-lite — MessagePack para JS (serialização binária leve).

- **Prisma** — ORM moderno com migrations e type safety

bignumber.js — operações numéricas com alta precisão.

### NoSQL (Node)

- **mongoose** — ODM para MongoDBdecimal.js — aritmética decimal precisa (evita erros de float).

- **redis / ioredis** — Cliente Redis para caching e pub/sub

serialize-javascript — serialização segura para injeção/transferência.

---

jsdom — DOM em Node (testes, tools sem browser).

## Requisições HTTP e Comunicação

node-fetch — fetch para Node (tooling/server).

### HTTP Clients

- **Axios** — Cliente HTTP com promises (browser e Node)cross-fetch — fetch isomórfico (node + browser).

- **node-fetch** — Fetch API para Node

- **cross-fetch** — Fetch isomórfico (browser + Node)detect-it — detectar touch vs mouse vs pointer capabilities.

- **got** — Cliente HTTP moderno com retries e streams

- **superagent** — Cliente HTTP leve para browser/NodeMousetrap — atalhos de teclado fáceis (combinações).

- **undici** — Cliente HTTP de alto desempenho para Node

keypress.js — detecção avançada de teclas/combos (alternative).

### Real-time

- **socket.io-client** — Comunicação em tempo real bidirecionalFingerprintJS — identificação/browser fingerprinting (anti-fraude/analytics).

- **ws** — WebSocket leve para Node

- **sockjs-client** — WebSocket com fallback para transports antigosBrowserFS — emula um sistema de arquivos no navegador (POSIX-like) para ler/escrever arquivos localmente.

- **engine.io-client** — Camada de transporte em tempo real

- **socketcluster-client** — Cliente para servidores escaláveisidb-keyval — key-value simples e leve sobre IndexedDB (armazenamento assíncrono fácil).

- **signalr-client** — Cliente SignalR (Microsoft)

store.js — wrapper para localStorage/sessionStorage com fallbacks e API simples.

### WebRTC

- **PeerJS** — Wrapper simplificado para WebRTC peer-to-peerfastpriorityqueue — implementação de fila de prioridade muito rápida (útil em pathfinding/IA).

- **simple-peer** — WebRTC P2P com API simples

heap-js — estruturas de heap/priority queue em JavaScript.

### CRDT e Sync

- **Yjs** — CRDT para sincronização colaborativa offline-firstgraphlib — criação e manipulação de grafos + algoritmos (paths, ordenação topológica).

- **y-websocket** — Backend WebSocket para Yjs

- **Automerge** — CRDT para dados colaborativosjs-levenshtein — cálculo da distância de Levenshtein (compara strings para fuzzy match).



---natural — toolkit NLP (tokenização, stemmers, classificadores básicos).



## Manipulação de Dadoscompromise — NLP leve para extração de entidades e análise de texto no browser.



### Utilitiesnearley — gerador de parsers para gramáticas com ambiguidades (parsing avançado).

- **Lodash** — Utilitários para arrays/objetos/funções (facilita lógica complexa)

- **Underscore.js** — Utilitários funcionais leveschevrotain — toolkit para construir parsers de alto desempenho em JS.

- **Ramda** — Programação funcional (currying, composição, imutabilidade)

- **Immutable.js** — Estruturas de dados imutáveispegjs — gerador de parsers PEG (criar parsers customizados para scripts/eventos).

- **immer** — Imutabilidade fácil (produce com sintaxe mutável)

- **collect.js** — Collections encadeáveis estilo Laraveldotenv — carrega variáveis de ambiente de arquivos .env (tooling/deploy).

- **deepmerge** — Mescla objetos profundamente

- **rfdc** — Clone profundo ultrarrápidocross-env — define variáveis de ambiente de forma cross-platform em scripts npm.

- **fast-deep-equal** — Checagem rápida de igualdade profunda

- **dequal** — Igualdade profunda pequena e confiávelconcurrently — roda vários comandos em paralelo (dev scripts).

- **Flatted** — stringify/parse JSON com suporte a referências circulares

nodemon — reinicia automaticamente apps Node durante desenvolvimento.

### Performance

- **memoizee** — Memoização configurável para funções caraspm2 — gerenciador de processos Node para produção (monitoramento/restart).

- **micro-memoize** — Memoização muito leve

- **lru-cache** — Cache LRU eficienteexpress — servidor HTTP minimalista para APIs e ferramentas locais.

- **quick-lru** — LRU minimalista

- **transducers-js** — Transducers para transformação de coleçõeskoa — framework web moderno baseado em middleware async (servers/tooling).



---fastify — framework Node orientado a performance e baixo overhead.



## Internacionalização e Formataçãows — implementação leve de WebSocket para Node (comunicação em tempo real).



### i18nsockjs-client — cliente WebSocket com fallback para transports antigos.

- **i18next** — Framework completo de internacionalização

- **dayjs** — Manipulação de datas leve (alternativa ao moment)engine.io-client — camada de transporte em tempo real (base para socket libs).

- **moment.js** — Manipulação de datas (amplamente usado, mas pesado)

- **numeral.js** — Formatação de números (moeda, porcentagem)query-string — parse/stringify de query strings com API simples.



---qs — parser/stringifier para queries complexas (arrays/objetos).



## Parsing e Serializaçãoform-data — construir formulários multipart/form-data programaticamente.



### Formatos de Textomulter — middleware para uploads multipart/form-data em Express.

- **marked** — Parser Markdown rápido

- **papaparse** — Parser CSV robusto (browser e Node)formidable — parser de uploads e formulários no Node.

- **csv-parse** — Parsing CSV em Node com streaming

- **js-yaml** — Parse e geração YAMLimagemin — pipeline de otimização de imagens para builds.

- **xml2js** — Parse e construção de XML

- **sax** — Parser XML streaming (baixo uso de memória)imagemin-pngquant — plugin PNG para compressão eficiente em imagemin.



### Templatingsvgo — otimiza SVGs removendo metadados e reduzindo tamanho.

- **Handlebars** — Templating HTML/strings para UIs

- **Mustache** — Templating logic-lesssvgson — converte SVG em JSON para manipulação programática.

- **nunjucks** — Templating eficiente para builds

- **ejs** — Templates simples embutidos em strings/HTMLxml2js — parse e construção de XML em JavaScript.



### Bináriossax — parser XML streaming (baixo uso de memória, alta velocidade).

- **protobufjs** — Protocol Buffers em JS (mensagens compactas)

- **msgpack-lite / msgpack5** — MessagePack para serialização binária levepapaparse — parser CSV robusto para browser e Node.

- **cbor** — Serialização CBOR compacta

- **flatbuffers** — Serialização eficiente para estruturas bináriascsv-parse — parsing CSV em Node com streaming e opções avançadas.

- **serialize-javascript** — Serialização segura para transferência

pouchdb — banco NoSQL offline-first que sincroniza com CouchDB.

### Parsers Customizados

- **nearley** — Gerador de parsers para gramáticas com ambiguidadeslokijs — banco em memória super-rápido com índices e persistência opcional.

- **chevrotain** — Toolkit para construir parsers de alto desempenho

- **pegjs** — Gerador de parsers PEG (criar parsers para scripts/eventos)nedb — banco leve tipo MongoDB para protótipos e pequenos servidores.



---lowdb — DB simples baseado em JSON para protótipos e tooling.



## Compressão e Criptografialevelup — interface para LevelDB (armazenamento embutido rápido).



### Compressãosqlite3 — driver SQLite para Node (armazenamento SQL local).

- **JSZip** — Criar/ler arquivos ZIP (packs, hotloads)

- **pako** — Compressão/decompressão zlib/deflatebetter-sqlite3 — wrapper SQLite síncrono e muito rápido para Node.

- **lz-string** — Compressão de strings leve para localStorage

- **lz4js / lz4** — LZ4 em JS (compressão rápida)knex — query builder SQL (multibanco) para migrations e consultas.

- **lzma-js** — LZMA (7zip) para compressão alta e lenta

sequelize — ORM para bancos SQL (models, associations, migrations).

### Criptografia

- **crypto-js** — Funções de criptografia (AES, SHA, HMAC)objection — ORM flexível baseado em Knex (mais controlável que alguns ORMs).

- **bcryptjs** — Hashing de senhas (browser/Node) sem deps nativas

- **jsonwebtoken** — Criação e verificação de JWTsjoi — validação de schemas para objetos (entrada/config).

- **jose** — Implementação moderna de JOSE/JWT/JWS/JWE

- **js-base64 / base64-js** — Codificação/decodificação Base64ajv — validador JSON Schema muito rápido (validação de saves/configs).



### Hashingyup — validação de schemas com API fluente (forms/inputs).

- **spark-md5** — MD5 rápido (files hashing incremental)

- **murmurhash-js** — MurmurHash para hashing rápidozod — validação + inferência de tipos para TypeScript/JS.

- **xxhashjs** — XXHash (hash muito rápido)

mitt — emitter de eventos minúsculo e rápido (pub/sub intra-app).

---

eventemitter3 — implementação leve e performática de EventEmitter.

## Validação e Schemas

pubsub-js — pub/sub simples para comunicação desacoplada entre módulos.

- **joi** — Validação de schemas para objetos (entrada/config)

- **ajv** — Validador JSON Schema muito rápidotiny-emitter — emitter mínimo para eventos (micro footprint).

- **yup** — Validação de schemas com API fluente (forms)

- **zod** — Validação + inferência de tipos para TypeScript/JStinyqueue — fila/priority queue extremamente leve (pathfinding útil).

- **validator** — Validações de strings (email, URL, etc)

soundfont-player — tocar instrumentos SoundFont no browser (MIDI-like).

---

midi.js — carregar e tocar arquivos MIDI no browser (playback musical).

## Eventos e Reatividade

WebMidi — API JS para interagir com dispositivos MIDI em browsers.

### Event Emitters

- **eventemitter3** — EventEmitter leve e performáticoabcjs — renderiza e toca notação ABC (música) no browser.

- **mitt** — Emitter de eventos minúsculo e rápido

- **pubsub-js** — Pub/sub simples para comunicação desacopladascribbletune — geração algorítmica de música e sequenciamento.

- **tiny-emitter** — Emitter mínimo para eventos

glslify — modulariza shaders GLSL para uso com bundlers.

### Programação Reativa

- **RxJS** — Programação reativa com streams/observablesclipper-lib — operações avançadas com polígonos (offsets, boolean ops).

- **Bluebird** — Promises poderosas com utilitários extras

- **async-retry** — Retry logic para promises com backoffdompurify — sanitização segura de HTML/SVG para evitar XSS.

- **p-limit** — Limita concorrência de Promises

- **p-map** — Mapeia Promises com controle de concorrênciaxss — filtro/sanitizador para prevenir XSS em inputs/HTML.

- **p-queue** — Fila de Promises com prioridades

jsonwebtoken — criação e verificação de JWTs (auth/tooling).

---

jose — implementação moderna de JOSE/JWT/JWS/JWE em JS.

## Gerenciamento de Estado

bcryptjs — hashing de senhas (browser/Node) sem dependências nativas.

- **Redux** — Gerenciador de estado previsível (fluxo unidirecional)

- **@reduxjs/toolkit** — Utilitários oficiais Redux mais rápidoscrypto-js — funções de criptografia (AES, SHA, HMAC) em JS.

- **MobX** — Reatividade e observáveis para estado

- **mobx-state-tree** — Modelo estruturado sobre MobXsecure-ls — wrapper de localStorage com encriptação simples.

- **Recoil** — Estado global reativo para React

- **Zustand** — State management minimalista e rápidojs-base64 — codificação/decodificação Base64 fácil em JS.

- **Effector** — Gerenciador funcional e performático

- **react-query (TanStack Query)** — Fetching e cache de dados reativosbase64-js — utilitários Base64 para TypedArrays e binários.

- **swr** — Busca de dados com cache e revalidação

react — biblioteca declarativa para construir interfaces reativas.

---

preact — alternativa compacta ao React com API similar.

## UI e Componentes

vue — framework progressivo para UIs reativas e componentes.

### Frameworks

- **React** — Biblioteca declarativa para UIs reativassvelte — compilador UI que gera código extremamente eficiente.

- **Preact** — Alternativa compacta ao React (3KB)

- **Vue** — Framework progressivo para UIs e componenteslit — biblioteca para criar Web Components leves e declarativos.

- **Svelte** — Compilador UI que gera código eficiente

- **Lit** — Web Components leves e declarativoselectron — runtime desktop (Chromium + Node) para empacotar jogos/tools.



### Bibliotecas de Componenteselectron-builder — empacotamento e criação de instaladores para Electron.

- **Material-UI (MUI)** — Componentes React com design Material

- **Ant Design** — Biblioteca rica de componentes UI Reactelectron-packager — empacotador simples para apps Electron.

- **Chakra UI** — Componentes React acessíveis e estilizados

- **Semantic UI React** — Componentes pré-feitos para Reactneutralinojs — runtime desktop minimalista e leve (alternativa ao Electron).

- **Reach UI** — Componentes acessíveis focados em usabilidade

- **Headless UI** — Primitives UI acessíveis (React/Vue)nwjs — executar apps web como aplicações desktop (Node + Chromium).

- **Bootstrap** — Framework UI CSS clássico (modals, grids)

- **Bulma** — Framework CSS simples e flexívelcordova — empacotar apps web para plataformas móveis nativas.

- **Foundation Sites** — Framework CSS responsivo

capacitor — runtime moderno para integrar código web com APIs nativas.

### Canvas e Interatividade

- **dat.GUI** — Painel de debug/config em runtime (tweak params)firebase (SDK) — autenticação, banco realtime, storage e hosting (BaaS).

- **lil-gui** — Fork moderno/minimal do dat.GUI

- **Hammer.js** — Gestures/touch (swipe, pinch) para mobilesupabase-js — cliente JS para Supabase (Postgres + realtime + auth).

- **nipplejs** — Joystick virtual para controles touch

- **gamepad.js** — Helpers para entradas de gamepadaws-sdk — SDK para serviços AWS (S3, Lambda, DynamoDB) no cliente/Node.



---pouchdb-find — plugin para PouchDB com queries tipo Mango.



## CSS e Estilosrxdb — banco reativo para apps offline/real-time com sync.



- **TailwindCSS** — Utilitários CSS para interfaces rápidasmicrobundle — bundler minimal para criar bibliotecas JS pequenas.

- **styled-components** — CSS-in-JS com styled tags (React)

- **Emotion** — CSS-in-JS performático e flexívelterser — minificador/uglifier moderno de JavaScript para produção.

- **PostCSS** — Processador CSS com plugins

- **autoprefixer** — Adiciona prefixes CSS automaticamentebrowserify — bundler tradicional para transformar módulos Node para browser.

- **Sass (dart-sass)** — Pré-processador CSS moderno

- **Less** — Pré-processador CSS alternativostacktrace-js — parse e limpeza de stack traces no browser.

- **Stylus** — Pré-processador CSS com sintaxe livre

- **chroma.js** — Manipulação e conversão de coressource-map — utilitários para gerar/consumir sourcemaps (debugging).

- **tinycolor2** — Utilitário menor para cores

- **classnames** — Montar classes CSS condicionalmenteworkbox — utilitários para service workers e caching offline.



---comlink — facilita comunicação entre main thread e web workers (RPC).



## Debugging e Testingmsgpack5 — implementação MessagePack para serialização binária eficiente.



### Debuggingchalk — estilo e cores para saída CLI (ferramentas e scripts).

- **stats.js** — Monitor FPS e métricas de performance

- **@sentry/browser** — Captura de erros client-side para monitoramentoinquirer — prompts interativos na linha de comando (tooling e builds).

- **Rollbar** — Monitoramento de erros

- **loglevel** — Logger leve com níveisora — spinners bonitos para CLI (feedback em scripts).

- **debug** — Logging seletivo via namespaces

- **stacktrace-js** — Parse e limpeza de stack tracesenquirer — alternativa a inquirer para prompts modernos e rápidos.

- **source-map** — Utilitários para gerar/consumir sourcemaps

Ramda — utilitários funcionais (currying, composição, imutabilidade).

### Testing

- **Jest** — Framework de testes unitários (Node/browser)Bluebird — implementação poderosa de Promises com utilitários extras.

- **Mocha** — Runner de testes flexível

- **Chai** — Assertions para testes (usado com Mocha)Flatted — stringify/parse JSON que suporta referências/ciclos.

- **Sinon** — Spies/mocks/stubs para testes unitários

- **nock** — Mock de requisições HTTP para testesdeepmerge — mescla objetos profundamente (configs, overrides).

- **Puppeteer** — Automação headless Chrome (testes E2E)

- **Playwright** — Automação cross-browser (testes E2E)rfdc — clone profundo ultrarrápido (zero-deps).



---fast-deep-equal — checagem rápida de igualdade profunda entre objetos.



## Build Tools e Bundlersdequal — igualdade profunda pequena e confiável (alternativa).



### Bundlersmemoizee — memoização configurável para funções caras.

- **Webpack** — Bundler generalista (assets, loaders, plugins)

- **Rollup** — Bundler focado em tree-shaking e pacotesmicro-memoize — memoização muito leve e rápida.

- **Vite** — Dev server e bundler ultrarrápido (hot reload)

- **esbuild** — Bundler/transpiler ultrarrápidolru-cache — cache LRU eficiente para objetos e resultados.

- **Parcel** — Bundler zero-config

- **Browserify** — Bundler tradicional para módulos Node → browserquick-lru — LRU minimalista e rápido em memória.

- **microbundle** — Bundler minimal para criar bibliotecas pequenas

collect.js — collections encadeáveis estilo Laravel (arrays/objetos).

### Transpilers e Linters

- **Babel** — Transpiler JS (suporte a sintaxes modernas)transducers-js — transducers para transformação de coleções com alto desempenho.

- **TypeScript** — Tipagem estática para segurança

- **ESLint** — Linting/qualidade de códigoundici — cliente HTTP de alto desempenho para Node.js.

- **Prettier** — Formatação automática de código

- **js-beautify** — Formatador de código JS/HTML/CSSgot — cliente HTTP moderno com retries e streams.

- **terser** — Minificador/uglifier moderno de JavaScript

superagent — cliente HTTP leve e simples para browser/Node.

### Ferramentas

- **glslify** — Modulariza shaders GLSL para uso com bundlersasync-retry — retry logic para promises (retry com backoff).

- **workbox** — Utilitários para service workers e caching offline

- **comlink** — Comunicação entre main thread e web workers (RPC)p-limit — limita concorrência de Promises (controle de paralelismo).



---p-map — mapeia Promises com controle de concorrência.



## Utilidades Geraisp-queue — fila de Promises com prioridades e taxa limitada.



### Clipboard e Fullscreenchokidar — watcher de arquivos eficiente (hot-reload/tooling).

- **clipboard.js / clipboard-polyfill** — Copiar/colar programático

- **screenfull** — API simplificada para fullscreenfs-extra — utilitários de filesystem (copy, remove, move com extras).



### Identificaçãorimraf — remover diretórios recursivamente (rm -rf).

- **uuid** — Geração de UUIDs

- **nanoid** — Geração de IDs curtos e únicosmkdirp — cria diretórios recursivos compatíveis cross-platform.

- **FingerprintJS** — Identificação/browser fingerprinting

fast-glob — globbing de arquivos muito rápido para builds.

### Input e Atalhos

- **Mousetrap** — Atalhos de teclado fáceis (combinações)glob — correspondência de padrões de arquivos (compatível).

- **keypress.js** — Detecção avançada de teclas

- **hotkeys-js** — Atalhos de teclado leves cross-browserminimatch — teste de correspondência de padrões (como glob).

- **detect-it** — Detectar touch vs mouse vs pointer capabilities

picomatch — matcher de glob rápido e pequeno.

### Utilitários de Arquivos

- **file-saver** — Salvar arquivos no clienteyargs — parsing de argumentos CLI com suporte a subcomandos.

- **downloadjs** — Disparar downloads do browser

- **chokidar** — Watcher de arquivos eficiente (hot-reload)commander — construir CLIs e parsers de argumentos simples.

- **fs-extra** — Utilitários de filesystem (copy, remove, move)

- **rimraf** — Remover diretórios recursivamente (rm -rf)validator — validações de strings (email, URL, etc.).

- **mkdirp** — Criar diretórios recursivos

- **fast-glob / glob** — Globbing de arquivosthrottle-debounce — utilitários de throttle e debounce para eventos.

- **minimatch / picomatch** — Teste de correspondência de padrões

tiny-debounce — debounce minimalista e rápido.

### CLI

- **yargs** — Parsing de argumentos CLI com subcomandoskaboom — engine de jogos 2D orientada a desenvolvimento rápido.

- **commander** — Construir CLIs e parsers de argumentos

- **inquirer / enquirer** — Prompts interativos na linha de comandorot.js — toolkit para roguelikes (mapas, FOV, RNG).

- **chalk** — Cores e estilos para saída CLI

- **ora** — Spinners bonitos para CLImelonJS — pequeno motor de jogos 2D para browser.



### Throttle/Debounceenchant.js — engine de jogos clássica e leve para web.

- **throttle-debounce** — Utilitários de throttle e debounce

- **tiny-debounce** — Debounce minimalistacraftyjs — engine JS para jogos baseados em entidades/componentes.



### Query Strings e Formsimpactjs — engine de jogos JS (comercial/histórica).

- **query-string** — Parse/stringify de query strings

- **qs** — Parser/stringifier para queries complexascannon-es — física 3D (rigid bodies) em JavaScript (ES module).

- **form-data** — Construir formulários multipart/form-data

- **multer** — Middleware para uploads multipart (Express)ammo.js — port do Bullet Physics para JS (física complexa).

- **formidable** — Parser de uploads e formulários (Node)

oimo.js — motor de física 3D leve e simples.

### Concorrência e Processos

- **dotenv** — Carrega variáveis de ambiente de .envnipplejs — joystick virtual para controles touch (mobile).

- **cross-env** — Define variáveis de ambiente cross-platform

- **concurrently** — Roda múltiplos comandos em paralelogamepad.js — helpers para entradas de gamepad e mapeamento.

- **nodemon** — Reinicia apps Node durante desenvolvimento

- **pm2** — Gerenciador de processos Node para produçãoeasystar.js — pathfinding A* otimizado para grids e tiles.



---spark-md5 — MD5 rápido (files hashing incremental).



## Machine Learningmurmurhash-js — MurmurHash para hashing rápido de strings.



- **@tensorflow/tfjs** — TensorFlow.js para treinar/inferir modelos no browserxxhashjs — XXHash (hash muito rápido) em JS.

- **onnxruntime-web** — Rodar modelos ONNX no browser com aceleração

- **ml5** — Wrapper amigável sobre TensorFlow.js com modelos pré-treinadosannyang — reconhecimento de voz simples para comandos (web speech).

- **brain.js** — Redes neurais simples em JS

- **synaptic** — Biblioteca neural para projetos experimentaisartyom.js — assistente de voz / TTS e reconhecimento com helpers.

- **tfjs-vis** — Visualização de métricas para TensorFlow.js

@tensorflow/tfjs — machine learning no browser (treinar/inferir).

---

onnxruntime-web — rodar modelos ONNX no browser com aceleração.

## Desktop e Mobile

ml5 — wrapper amigável sobre tfjs com modelos pré-treinados.

### Desktop

- **Electron** — Runtime desktop (Chromium + Node) para empacotar jogos/toolsbrain.js — redes neurais simples em JS (treinar no browser/Node).

- **electron-builder / electron-packager** — Empacotamento para Electron

- **NeutralinoJS** — Runtime desktop minimalista (alternativa ao Electron)synaptic — biblioteca neural para projetos experimentais.

- **NW.js** — Executar apps web como desktop (Node + Chromium)

tfjs-vis — visualização de métricas para TensorFlow.js.

### Mobile

- **Cordova** — Empacotar apps web para plataformas móveis nativaslunr — índice de busca full-text no cliente (search local).

- **Capacitor** — Runtime moderno para integrar código web com APIs nativas

elasticlunr — alternativa a Lunr com mais flexibilidade.

---

search-index — engine de busca local mais robusta (persistência).

## Backend e Servidores

ndarray — estruturas N-dimensionais para cálculos numéricos.

### Frameworks Web

- **Express** — Servidor HTTP minimalista para APIsnumjs — utilitários numéricos estilo NumPy em JS.

- **Koa** — Framework web moderno baseado em middleware async

- **Fastify** — Framework orientado a performance e baixo overheadfft.js — transformada rápida de Fourier em JavaScript.



### BaaS (Backend as a Service)jsfft — FFT/DFT para análise de sinais no browser.

- **Firebase SDK** — Autenticação, banco realtime, storage e hosting

- **Supabase JS** — Cliente para Supabase (Postgres + realtime + auth)ndarray-fft — FFT para estruturas ndarray (científico).

- **AWS SDK** — SDK para serviços AWS (S3, Lambda, DynamoDB)

cbor — serialização compacta (CBOR) para dados binários.

---

flatbuffers — serialização eficiente para estruturas binárias.

## Procedural Generation

lz-string — compressão de strings leve para localStorage/saves.

- **seedrandom** — Gerador RNG com seed determinística

- **random-js** — Utilitários avançados para RNGlz4js — LZ4 em JS para compressão rápida de blobs.

- **simplex-noise / noisejs** — Ruído Perlin/Simplex para geração procedural

- **spritesheet-js** — Ferramentas para gerar/ler spritesheetslzma-js — LZMA (7zip) em JS para compressão maior, lenta.

- **tmx-parser** — Parser de mapas TMX (Tiled Map Editor)

lz4 — bindings/implementações JS para LZ4 (variações).

---

js-beautify — formatador de código JS/HTML/CSS (tooling).

## Engines de Jogos

tailwindcss — utilitários CSS para interface rápida (UI de ferramentas).

### Engines Completas

- **Phaser** — Framework de jogos 2D completo (pode ser usado modularmente)bootstrap — framework UI CSS clássico (modals, grids).

- **Kaboom** — Engine 2D orientada a desenvolvimento rápido

- **melonJS** — Motor de jogos 2D pequeno para browserchart.js — gráficos simples para estatísticas e debug.

- **enchant.js** — Engine de jogos clássica e leve para web

- **CraftyJS** — Engine baseada em entidades/componentesrecharts — gráficos React (se usar React para ferramentas).

- **ImpactJS** — Engine comercial/histórica

vega-lite — expressões declarativas para visualização de dados.

### Roguelike

- **rot.js** — Toolkit completo para roguelikes (mapas, FOV, RNG, pathfinding)nunjucks — templating eficiente para builds e ferramentas.



---ejs — templates simples embutidos em strings/HTML.



## Gráficos e Visualizaçãomustache-express — integração Mustache com Express (tooling).



- **Chart.js** — Gráficos simples para estatísticas e debugsocketcluster-client — cliente para servidores em tempo real escaláveis.

- **Recharts** — Gráficos React

- **vega-lite** — Expressões declarativas para visualização de dadossignalr-client — cliente para SignalR (comunicação em tempo real MS).

- **D3.js** — Biblioteca de visualização de dados (manipulação DOM orientada a dados)

peerjs — wrapper simplificado para WebRTC peer-to-peer.

---

simple-peer — WebRTC P2P com API simples (multiplayer P2P).

## Busca e Indexação

y-websocket — backend WebSocket para Yjs CRDT (sync colaborativa).

- **Lunr** — Índice de busca full-text no cliente

- **elasticlunr** — Alternativa a Lunr com mais flexibilidadeidb — wrapper minimal para IndexedDB (promessa-friendly) — nota: complemento runtime.

- **search-index** — Engine de busca local mais robusta

localforage — armazenamento assíncrono com API similar a localStorage.

---

dexie — wrapper poderoso para IndexedDB (queries + migrations).

## GraphQL

sql.js — SQLite compilado em WASM para usar DB no browser.

- **Apollo Client** — Cliente GraphQL completo com cache e devtools

- **graphql-request** — Cliente GraphQL pequeno e diretobetter-sqlite3 — SQLite muito rápido para Node (tooling/servers).

- **graphql** — Referência para construir/parsear schemas GraphQL

sqlite-wasm — outra opção de SQLite via WASM para browser.

---

knex — query builder SQL (migrations e queries server-side).

## Sanitização e Segurança

sinon — spies/mocks/stubs para testes unitários.

- **DOMPurify** — Sanitização segura de HTML/SVG para evitar XSS

- **xss** — Filtro/sanitizador para prevenir XSSnock — mock de requisições HTTP para testes em Node.



---loglevel — logger leve para debug com níveis.



## WebMIDIdebug — logging selecional via namespaces (micro footprint).



- **WebMidi** — API JS para interagir com dispositivos MIDIrollbar — monitoramento de erros (client-side reporting).



---Sentry-JS — erro/monitoramento (se quiser substituir Rollbar).



## Geoespacialhotkeys-js — atalhos de teclado leves e cross-browser.



- **geobuf** — Compactar geometria geoespacial em Protobufvirtual-keyboard — teclado virtual para inputs touch (variações).



---nanoid — geração de IDs curtos, seguros e únicos.



## 📝 Observações Finaisimmer — imutabilidade fácil para estados (produce/padrão mutável por proxy).



### Como Escolher uma Bibliotecaredux — gerenciador de estado previsível (fluxo unidirecional).



1. **Tamanho**: Verifique o bundle size no [Bundlephobia](https://bundlephobia.com)@reduxjs/toolkit — utilitários oficiais para criar stores Redux mais rápido.

2. **Manutenção**: Prefira bibliotecas ativas (últimos commits recentes)

3. **Documentação**: Boa documentação economiza horas de debugmobx — reatividade e observáveis para gerenciar estado.

4. **Compatibilidade**: Teste com RPG Maker MZ antes de usar em produção

5. **Performance**: Use ferramentas como stats.js para medir impactomobx-state-tree — modelo estruturado e serializável sobre MobX.



### Instalaçãorecoil — estado global reativo para React com átomos/selectors.



Para usar em RPG Maker MZ:zustand — state management minimalista e rápido (hooks).



**Opção 1: CDN (Simples)**effector — gerenciador de estado funcional e performático.

```html

<script src="https://cdn.jsdelivr.net/npm/biblioteca@versao"></script>react-query (TanStack Query) — fetching e cache de dados reativos.

```

swr — busca de dados com cache e revalidação (Vercel).

**Opção 2: NPM + Bundler (Recomendado)**

```bashapollo-client — cliente GraphQL completo com cache e devtools.

npm install biblioteca

```graphql-request — cliente GraphQL pequeno e direto.



Depois use bundler (Webpack/Rollup/Vite) para gerar arquivo único.graphql — referência para construir/parsear schemas GraphQL.



### Suporteprisma — ORM moderno para bancos SQL com migrations.



Se encontrar uma biblioteca útil que não está nesta lista, adicione-a seguindo a mesma estrutura de categorização!typeorm — ORM TypeScript/Node para SQL/NoSQL.



---mongoose — ODM para MongoDB (models, schemas, validações).



**Última Atualização:** 28 de outubro de 2025  pg (node-postgres) — cliente PostgreSQL para Node.

**Mantenedor:** Necromante96Official & GitHub Copilot

mysql2 — cliente MySQL rápido com Promises.

redis — cliente Redis para caching e pub/sub.

ioredis — cliente Redis avançado com reconexão e clusters.

sequelize (já citado? Não repetir) — omitido se repetido anteriormente.

knex (já citado anteriormente) — omitido se repetido.

prismjs — highlight de sintaxe para UIs e docs.

highlight.js — outra opção de syntax highlighting.

clipboard-polyfill — compatibilidade mais ampla para clipboard.

classnames — montar classes CSS condicionalmente.

styled-components — CSS-in-JS com styled tags para React.

emotion — CSS-in-JS performático e flexível.

tailwindcss (já citado) — omitido se repetido anteriormente.

postcss — processador CSS e pipeline de plugins.

autoprefixer — adiciona prefixes CSS automaticamente (PostCSS).

sass (dart-sass) — pré-processador CSS (Sass moderno).

less — pré-processador CSS alternativo.

stylus — pré-processador CSS com sintaxe livre.

bootstrap (cit.) — omitido se repetido anteriormente.

bulma — framework CSS simples e flexível.

foundation-sites — framework CSS responsivo (Foundation).

material-ui (MUI) — componentes React com design Material.

ant-design — biblioteca de componentes UI rica para React.

chakra-ui — componentes React acessíveis e estilizados por props.

semantic-ui-react — componentes pré-feitos para React.

reach-ui — componentes acessíveis e focados em usabilidade.

headlessui — primitives UI acessíveis para React/Vue.

radix-ui — primitives UI acessíveis e headless.

downshift — helpers para comboboxes/autocomplete acessíveis.

react-virtualized — renderizar listas grandes eficientemente.

react-window — alternativa compacta para virtualização de listas.

react-beautiful-dnd — drag-and-drop elegante para React.

dnd-kit — toolkit moderno e acessível de drag-and-drop.

react-router — roteamento declarativo para aplicações React.

next.js — framework React para SSR/SSG (fácil deploy).

gatsby — gerador de sites estáticos com React.

nuxt (Nuxt.js) — framework Vue.js para SSR/SSG.

sapper — (Svelte) framework antigo de SSR para Svelte.

sveltekit — framework moderno para aplicações Svelte.

astro — framework para sites rápidos com islands architecture.

vitepress — documentação estática construído sobre Vite.

storybook — ambiente isolado para desenvolver componentes UI.

stylelint — lint e regras para CSS/SCSS.

lint-staged — rodar linters só em arquivos staged (pre-commit).

husky — ganchos Git (pre-commit, pre-push) fáceis de configurar.

commitizen — padrão para mensagens de commit padronizadas.

semantic-release — automatiza versionamento e releases.

msw (mock service worker) — mock de APIs no cliente para dev/testes.

cypress — testes end-to-end automatizados no navegador.

playwright (cit.) — omitido se repetido anteriormente.

puppeteer (cit.) — omitido se repetido anteriormente.

karma — test runner para ambientes browser.

enzyme — utilitários de testes para React (mount/shallow).

@testing-library/react — testes centrados no comportamento do usuário.

ava — runner de testes minimalista e rápido.

tap — framework de testes e assertions.

uvu — runner de testes extremamente rápido e leve.

c8 — cobertura de código baseada em V8 (coverage).

nyc (istanbul) — ferramentas de coverage para Node.js.

semver — utilitários para versionamento semântico.

node-sass (deprecated) — wrapper para libsass (evitar se possível).

sass-loader — integrar Sass em bundlers (Webpack).

cssnano — minificador CSS para produção.

purgecss — remove CSS não usado (tree-shaking CSS).

critical — extrair CSS crítico para performance.

modernizr — detectar features do navegador.

bowser — detectar browser/versão de forma leve.

ua-parser-js — parse de user-agent para informações detalhadas.

turf — análise espacial e geoprocessamento em JS.

leaflet — mapas interativos leves para web.

mapbox-gl-js — renderização de mapas vetoriais WebGL.

openlayers — biblioteca de mapa robusta e full-featured.

ol-geocoder — geocoding para OpenLayers.

proj4js — projeções cartográficas e conversões de coordenadas.

chartist — gráficos simples e responsivos SVG.

echarts — biblioteca poderosa de visualização de dados.

highcharts — gráficos comerciais com muitos recursos.

dygraphs — gráficos de séries temporais interativos.

three-stdlib — utilitários e helpers para Three.js.

cannon.js (original) — física 3D (legado).

ammo.js (cit.) — omitido se repetido anteriormente.

statsd-client — enviar métricas para StatsD/Graphite.

prom-client — expor métricas Prometheus no Node.

opossum — circuito breaker para chamadas de rede em Node.

bottleneck — rate limiting e controle de concorrência.

pino — logger Node ultrarrápido.

winston — logger configurável para Node.

bunyan — logger JSON para logs estruturados.

log4js — porta do log4j para Node.js.

rotating-file-stream — logs rotativos (arquivos com rotação).

morgan — middleware de logging HTTP para Express.

helmet — middleware de segurança para Express (headers).

cors — middleware para CORS em servidores Node.

rate-limiter-flexible — rate limiting robusto para APIs.

express-session — sessões server-side para Express.

passport — middleware de autenticação modular para Node.

passport-local — estratégia local (username/password) para Passport.

passport-jwt — estratégia JWT para Passport.

jsonwebtoken (cit.) — omitido se repetido anteriormente.

openid-client — cliente OpenID Connect para Node.js.

oauth2-server — implementar OAuth2 em Node (servidor).

simple-oauth2 — cliente OAuth2 simplificado.

openid-client (cit.) — omitido se repetido anteriormente.

bcrypt (native) — hashing de senhas (bindings nativos).

argon2 — algoritmo moderno de hashing de senhas.

scrypt-js — scrypt em JS para derivação de chaves.

tweetnacl (cit.) — omitido se repetido anteriormente.

libsodium-wrappers — libsodium compilado para JS/WASM.

sjcl (Stanford JS Crypto Library) — toolkit de criptografia em JS.

openpgpjs — PGP/OpenPGP em JavaScript.

webcrypto-shim — polyfill da Web Crypto API para Node.

jsonwebtoken (cit.) — omitido se repetido anteriormente.

passport-oauth2 — estratégia OAuth2 para Passport.

loopback — framework API-first para Node.js.

feathers — microservices e realtime APIs (socket-ready).

graphql-yoga — servidor GraphQL simples e configurável.

subscriptions-transport-ws — GraphQL subscriptions via WebSocket.

graphql-ws — alternativa moderna para subscriptions GraphQL.

apollo-server — servidor GraphQL com integrações fáceis.

hasura — engine GraphQL instantânea sobre Postgres (self-host/infra).

nexus — code-first GraphQL schema builder para Node/TypeScript.

type-graphql — construir schemas GraphQL com TypeScript classes.

class-validator — validação declarativa com decorators (TS).

class-transformer — transformar plain objects em classes/vice-versa.

reflect-metadata — metadata reflection API para TypeScript decorators.

inversify — injeção de dependência para TypeScript/Node.

awilix — container de injeção de dependência leve para Node.

typedi — DI para TypeScript inspirado em Angular.

bull — fila de jobs Redis para tarefas assíncronas.

bullmq — versão moderna do Bull com design baseado em Redis streams.

kue — fila de jobs para Node usando Redis.

agenda — agendador de jobs persistente (MongoDB).

node-cron — agendamento cron em apps Node.

bree — job scheduler baseado em workers/threads.

workerpool — pool de workers para executar CPU-bound tasks.

threads.js — abstração para web workers e worker threads.

comlink (cit.) — omitido se repetido anteriormente.

p2 — física 2D alternativa e simples.

chipmunk-js — port do motor de física Chipmunk para JS.

planck-js (cit.) — omitido se repetido anteriormente.

box2d.js — várias portas do Box2D para JavaScript.

glsl-canvas — playground/shaders para canvas WebGL.

regl (cit.) — omitido se repetido anteriormente.

post-robot — comunicação cross-domain entre janelas/iframes.

penpal — RPC entre iframes com API simples.

cross-storage — armazenar dados entre domínios via iframe.

jsdom (cit.) — omitido se repetido anteriormente.

cheerio — parse/seleção de HTML no Node (jQuery-like).

got (cit.) — omitido se repetido anteriormente.

supertest — testar APIs HTTP (Express/servers).

axios-mock-adapter — mock para axios em testes.

nock (cit.) — omitido se repetido anteriormente.

http-proxy-middleware — proxies em dev servers (bypass CORS).

localtunnel — expor server local via túnel público.

ngrok — túnel seguro para dev (ferramenta externa/CLI).

serve — servidor estático simples para builds.

http-server — servidor HTTP simples para arquivos estáticos.

static-server — similares acima (diversas opções).

dotenv-expand — expande variáveis de ambiente em .env.

cross-spawn — spawn cross-platform de processos em Node.

execa — wrapper de exec/spawn com Promises.

ora (cit.) — omitido se repetido anteriormente.

listr2 — listas de tarefas com progresso para CLIs.

prompts — prompts interativos mais modernos para CLI.

enquirer (cit.) — omitido se repetido anteriormente.

boxen — desenhar caixas bonitas no terminal (CLI UX).

terminal-kit — biblioteca completa para UIs em terminal.

blessed — construir UIs ricas no terminal (blessed-contrib).

ink — criar UIs de terminal com React.

node-pty — pseudo-terminal para executar shells/terminals.

ssh2 — cliente/servidor SSH para Node.js.

node-sass-middleware — servir Sass compilado em runtime (dev).

imagemin (cit.) — omitido se repetido anteriormente.

sharp (cit.) — omitido se repetido anteriormente.

jimp (cit.) — omitido se repetido anteriormente.

opencv4nodejs — bindings OpenCV para Node (visão computacional).

face-api.js — detecção/recognition facial no browser via TFJS.

tesseract.js — OCR no browser/Node (Tesseract compilado).

ffmpeg.wasm — FFmpeg compilado para WebAssembly (processamento mídia).

fluent-ffmpeg — wrapper de FFmpeg para Node.js.

sharp-cli — utilitários CLI baseados em Sharp (tooling).

exif-js — ler metadados EXIF de imagens no browser.

geotiff.js — leitura de arquivos GeoTIFF no browser/Node.

geobuf — compactar geometria geoespacial em Protobuf para performance.