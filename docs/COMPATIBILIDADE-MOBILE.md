# Chrome, Android e Safari no iPhone

Atualização de 12/11/2026. O pedido “iOS 25 em diante” foi interpretado como a geração lançada em 2025, oficialmente **iOS 26**, e versões posteriores. O código usa detecção de recursos, sem bloquear marcas ou versões de navegador. A validação automatizada usa Chrome instalado e WebKit 26.0 do Playwright, ambos executados no Windows; não equivale a executar Safari em um iPhone físico.

## Ajustes

- `viewport-fit=cover`, áreas seguras nas quatro bordas e área reservada ao selo da hospedagem. O documento continua sem rolagem e os controles ficam dentro da janela disponível. Nos formulários, fonte mínima de 16 px evita o gatilho usual de ampliação automática do Safari. Zoom manual continua permitido.
- A altura e o deslocamento da janela visual acompanham o teclado. Zoom por pinça não aciona uma nova paginação; orientação e retorno à página recalculam a disposição. `interactive-widget=resizes-content` também orienta o redimensionamento pelo teclado no Chrome Android.
- Toque, setas, paginação e botão Voltar continuam disponíveis. O transporte pausa ao girar o aparelho, zera a referência e recalibra a inclinação no novo eixo. A permissão de movimento continua solicitada somente no botão; recusa ou ausência de dados mantém os controles alternativos.
- O canal de efeitos é preparado com silêncio no primeiro gesto, para permitir efeitos disparados posteriormente pelo jogo. Quando o navegador ignora `HTMLMediaElement.volume`, dois ganhos Web Audio controlam os canais existentes. Mudo, volume e redução da música sob efeitos continuam funcionais. O contexto é suspenso quando a página fica oculta e pode ser retomado por gesto.
- Sem a API de vibração, as configurações informam indisponibilidade e mantêm avisos visuais/sonoros. No Android, a preferência e os padrões existentes permanecem; a disponibilidade física ainda depende do aparelho e do sistema.
- Digitação e arraste de volume agrupam gravações em 150 ms, evitando serializar a partida a cada evento. Decisões continuam salvas imediatamente. Ocultar a página ou sair dela força a gravação pendente, útil ao alternar aplicativos.
- A animação reutiliza referências aos elementos, atualiza somente a cena visível e desenha o progresso por transformação. Contadores de segundos não provocam novas medições de toda a paginação.
- O redimensionamento de janela da PWA é limitado a contextos com ponteiro fino, evitando tentativas de mover/redimensionar a janela no celular.

## Verificação reproduzível

Servir `web` em `http://localhost:4180` ou definir `GAME_URL` para outro endereço.

- `node tests/mobile.cjs`: Chrome e WebKit; 320×568, 360×640, 390×844 e 844×390; texto normal/ampliado; áreas seguras simuladas; acesso aos textos e controles por páginas. Exercita toque, música, introdução, teclado/zoom simulados, salvamento ao ocultar, permissão de sensores negada/concedida, rotação e Voltar.
- `node tests/audio-mobile.cjs`: simula o volume HTML somente leitura e usa ganhos reais de Web Audio para conferir volume, mudo, redução sob efeito, suspensão/retomada e reutilização dos dois canais.
- `node tests/audio.cjs`, `node tests/introducao.cjs`, `node tests/robustez.cjs` e `node tests/motores.cjs`: regressões de reprodução por clique/toque emulado, animação, sensores/recuperação de progresso e regras narrativas.
- `GAME_BROWSER=webkit` com `tests/navegador.cjs`: os 13 capítulos concluídos, rotas distintas e restauração do progresso. O WebKit deste pacote Windows não expõe Web Audio; nele a reprodução HTML é conferida pelo teste mobile, e os ganhos reais são conferidos no Chrome com volume HTML somente leitura simulado.
- `node tests/offline-webkit.cjs`: 906 recursos em cache; servidor encerrado e conexão recusada confirmada; jogo e animação reabertos no WebKit sem o servidor. Esse método evita o [problema conhecido da emulação offline do Playwright/WebKit](https://github.com/microsoft/playwright/issues/42775). `tests/pwa.cjs` também aprovou instalação offline e atualização no Chrome.

Resultado desta execução: **240 combinações de layout** aprovadas em Chrome **157.0.8103.39** e WebKit **26.0**, além dos fluxos descritos acima. Não houve erro JavaScript nos fluxos mobile.

Relatórios de compatibilidade em `docs/evidencias`. Capturas e detalhes transitórios em `tests/resultados`.

## Limites e conferência em aparelho

Não há certificação de todas as versões futuras. A versão de WebKit testada não reproduz a interface, o teclado, os recortes, a saída física de áudio ou o hardware do iPhone. Antes de uma demonstração em aparelho, conferir Safari/Chrome com barras abertas/fechadas, orientação deitada/em pé, teclado, zoom manual, saída/retorno de aplicativo, sensor nos dois sentidos e áudio com os controles físicos do telefone. No Android, conferir também Voltar e vibração disponível. Falhas de permissão ou de armazenamento têm mensagens e alternativas; não há dependência de sensores, áudio ou vibração para concluir a história.

## Referências oficiais

- [Apple: lançamento do iOS 26 em setembro de 2025](https://www.apple.com/newsroom/2025/09/new-versions-of-apples-software-platforms-are-available-today/).
- [WebKit: recursos do Safari 26](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/) e [áreas seguras](https://webkit.org/blog/7929/designing-websites-for-iphone-x/).
- [Apple: particularidades de áudio no iOS](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html), documento histórico usado como alerta; a implementação detecta o comportamento efetivo do navegador.
- [MDN: coordenadas de orientação](https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained), [evento/permissão](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) e [vibração](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate).
