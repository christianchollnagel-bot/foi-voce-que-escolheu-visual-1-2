# Auditoria da edição 1.3.0

Data: 12/11/2026. Base de comparação: `adafaca3cd7a68d111d5db8b740776d5ec07b684`. Fonte canônica: `web/`. Revisão incremental para portfólio, preservando conteúdo, identidade e saves válidos.

## Diagnóstico e correções

| Prioridade | Evidência observada | Correção e verificação |
|---|---|---|
| Alta | `Storage.getItem` lançando `SecurityError` era tratado como save corrompido. “Nova partida” tentava preservar o registro inacessível e permanecia no menu. | Separar indisponibilidade de corrupção. Permitir jogar em memória com aviso; não tentar sobrescrever dados que não puderam ser lidos. Regressão em Chrome/WebKit em `tests/portfolio.cjs`. |
| Alta | A validação aceitava `world.log: [null]`, que não atende ao formato usado pelo histórico. | Validar as entradas antes de restaurar o mundo, preservar o registro inválido e manter recuperação explícita. Regressão preserva exatamente os bytes inválidos. |
| Média | As setas do transporte tratavam apenas eventos de ponteiro; ativação por Enter/click sem ponteiro não alterava a entrada. | Pulso de direção para ativação acessível, cancelado ao pausar/remover o componente. Toque e setas do teclado permanecem. |
| Média | Retomar uma consulta focava o controle sem garantir que estivesse na página exibida. | Revelar a página do controle antes de devolver o foco, sem rolar o documento. |
| Média | O teste de atualização usava funções assíncronas em `waitForFunction`; a implementação instalada testa a Promise como valor verdadeiro antes do resultado. | Esperar explicitamente o resultado de `page.evaluate` em uma condição com prazo. Atualização, espera e preservação de estado novamente executadas. |
| Média | O início padrão servia `Entrega/netlify`, que não existe em um clone por ser gerada e ignorada. | `npm start` agora serve `web/`. Não exige build nem dependências para abrir o jogo. |
| Média | O empacotador apenas copiava recursos e mantinha arquivos retirados da fonte. | Remover somente arquivos obsoletos dentro da pasta de publicação verificada; conferir lista e hashes completos. Um arquivo obsoleto de teste foi eliminado do pacote. |
| Baixa | A divisão no início do bloco seguinte podia deixar uma borda solta de retrato. | Cortar no intervalo entre blocos; validar novamente textos, controles e 240 layouts. |
| Baixa | Mensagem sem JavaScript ficava fora da moldura sem rolagem; apresentação não tinha descrição para compartilhamento. | Mensagem dentro do palco, metadados de título/descrição/autoria e cartaz existente. |

## Otimização com limites claros

A paginação agrupa leituras dos limites antes de atualizar os atributos dos controles. O objetivo é evitar alternância desnecessária entre leitura e escrita de estilos. No Chrome 157, 100 medições locais do catálogo mantiveram mediana de aproximadamente **0,6 ms**; o p95 observado passou de **1,3 para 1,1 ms**, diferença pequena e sujeita a ruído. Isso não comprova aceleração em iPhone nem autoriza uma promessa percentual de desempenho.

O conteúdo completo continua disponível offline: 906 recursos em cache, incluindo músicas, efeitos e variações dos personagens. A distribuição contém 908 arquivos e aproximadamente 46 MiB. Não foram removidos recursos para produzir uma redução artificial de tamanho. Atualizações reaproveitam bytes conferidos de caches anteriores.

## Validação

Ambiente: Windows, Node.js, Playwright 1.58.2, Chrome 157.0.8103.39 e WebKit 26.0. Testes automatizados usam perfis isolados e não alteram o save do usuário.

| Verificação | Comando/relatório |
|---|---|
| Percurso normal, retomada, armazenamento negado/corrompido, controles acessíveis, ausência de JavaScript | `npm run test:portfolio` · [portfolio.json](evidencias/portfolio.json) |
| 240 layouts, texto ampliado, toque, teclado/zoom/sensores simulados, rotação e Voltar | `npm run test:mobile` · [mobile.json](evidencias/mobile.json) |
| Fluxo completo, consultas, recibos, transporte, reset/cancelamento, nenhum texto inacessível pelas páginas | `npm run test:fluxos` · [fluxos-paginados.json](evidencias/fluxos-paginados.json) |
| 534 verificações de controles e variantes de personagem/turno | `npm run test:botoes` · [botoes.json](evidencias/botoes.json) e [botoes-variantes.json](evidencias/botoes-variantes.json) |
| 226 caminhos terminais da base, 178 do especial, 30 cenas de continuidade, idempotência e cadeias causais | `npm test` · [motores.json](evidencias/motores.json) |
| Sensor negado/sem dados, interrupção, progresso incompatível, reabertura do processo | `npm run test:robustez` · [robustez.json](evidencias/robustez.json) |
| Volume, mudo e suspensão/retomada com ganhos reais Web Audio | `npm run test:audio-mobile` · [audio-mobile.json](evidencias/audio-mobile.json) |
| Instalação, offline, espera pela atualização e preservação do progresso | `npm run test:pwa` · [pwa.json](evidencias/pwa.json) |
| Reabertura WebKit com servidor desligado | `npm run test:offline-webkit` · [offline-webkit.json](evidencias/offline-webkit.json) |
| Integridade, reutilização de cache e rejeição de recursos corrompidos | `node tests/integridade-host.cjs` e `npm run test:cache-atualizacao` |
| Fonte, pasta de distribuição e manifesto idênticos; 908 entradas do ZIP conferidas por SHA-256 | `npm run verify:release` · [entrega-1.3.json](evidencias/entrega-1.3.json) |

Capturas, logs transitórios e vídeos privados não fazem parte da distribuição. Somente capturas do próprio jogo selecionadas para apresentação estão em `docs/portfolio/`.

## Publicação e retorno

Branch: `codex/atualizacao-completa`, sem merge na `main`. Destino autorizado: o mesmo site `foivocequeescolheu.netlify.app`. Conferir `1.3.0` no rodapé e comparar os recursos com `docs/manifesto-entrega.json`; commit criado não equivale a deploy concluído. O teste `test:pwa-publicacao` confere um endereço real com `GAME_URL`, incluindo instalação completa e reabertura offline pelo menu normal.

Não há migração destrutiva do save. Reverter alterações pelo Git ou republicar um deploy anterior preserva os dados locais; não limpar dados do navegador para trocar a edição. Fechar todas as janelas do jogo permite ativar um worker já preparado.

## Pendências de validação física

Safari no iPhone e Chrome no Android reais: conferir barras do navegador, teclado, troca de aplicativo, saída de áudio e inclinação. Vibração depende de suporte do aparelho/navegador; sua ausência não bloqueia o jogo. Sem playtest com participantes, não há evidência de diversão ou compreensão. A edição é uma entrega executável de portfólio com limites documentados, não certificação universal de dispositivos.

Referências consultadas: [comportamento e bloqueios de localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) e [API de Page do Playwright](https://playwright.dev/docs/api/class-page#page-wait-for-function), complementadas pela inspeção do código da versão 1.58.2 instalada.
