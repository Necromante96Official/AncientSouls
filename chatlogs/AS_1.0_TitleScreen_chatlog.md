# Histórico - AS_1.0_TitleScreen

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.0_TitleScreen.js
**Ação:** Ajuste - Layout de fundo e comando "Sair"
**Detalhes:** Removido o gradiente adicional para deixar a arte principal visível,
ajustando a limpeza dos sprites e trocando o comando "Sair" para usar
`SceneManager.exit()` com fade-out de áudio.
**Versão:** v1.0.3 (anterior: v1.0.2)
**Backup criado:** backups/AS_1.0_TitleScreen/AS_1.0_TitleScreen - v1.0.2.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.0_TitleScreen.js
**Ação:** Ajuste - Integração de arte de fundo
**Detalhes:** Carregada a imagem `assets/resources/background.png` como plano de
fundo base da cena, adicionando ajuste dinâmico de escala, gradiente mais leve
e overlay sutil para manter legibilidade dos elementos da UI.
**Versão:** v1.0.2 (anterior: v1.0.1)
**Backup criado:** backups/AS_1.0_TitleScreen/AS_1.0_TitleScreen - v1.0.1.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.0_TitleScreen.js
**Ação:** Correção - Atualização de bitmap
**Detalhes:** Substituídas as chamadas inexistentes a `_setDirty()` por
`baseTexture.update()` durante a renderização dos gradientes para evitar o
TypeError disparado ao publicar o evento `titlescreen:scene:ready`.
**Versão:** v1.0.1 (anterior: v1.0.0)
**Backup criado:** backups/AS_1.0_TitleScreen/AS_1.0_TitleScreen - v1.0.0.js

---

## [19/10/2025]
**Autor:** GitHub Copilot
**Arquivo(s) afetado(s):** AS_1.0_TitleScreen.js
**Ação:** Criação - Orquestração da tela
**Detalhes:** Adicionadas rotinas de hook para Scene_Title, ocultando a janela
padrão, gerando novos fundos temáticos e orquestrando comandos via barramento
de eventos entre os agentes de UI.
**Versão:** v1.0.0 (anterior: --)
**Backup criado:** Nenhum (primeira versão)
