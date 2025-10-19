# Histórico - AS_0.1_LogEnhancer

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_0.1_LogEnhancer.js
**Ação:** Ajuste - Identificação de cena
**Detalhes:** Aprimorada a detecção de cena corrente nos registros, consultando
`_scene`, `_nextScene` e pilha ativa para substituir o rótulo genérico
`Scene:Unknown`, mantendo o log mais contextualizado desde o boot.
**Versão:** v1.0.1 (anterior: v1.0.0)
**Backup criado:** backups/AS_0.1_LogEnhancer/AS_0.1_LogEnhancer - v1.0.0.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_0.1_LogEnhancer.js
**Ação:** Criação - Agente de telemetria
**Detalhes:** Implantado agente dedicado a interceptar console.*, SceneManager.onError,
window.onerror e rejeições não tratadas, adicionando carimbo temporal, cena ativa,
stack resumido e métricas de memória a cada registro. Entradas são armazenadas em buffer,
publicadas via `diagnostics:log:entry` e acessíveis através de API própria no contexto
do PluginManager.
**Versão:** v1.0.0 (anterior: --)
**Backup criado:** Nenhum (primeira versão)
