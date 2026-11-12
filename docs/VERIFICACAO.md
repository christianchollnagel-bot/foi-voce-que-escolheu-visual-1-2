# Verificação executada — 12/11/2026

Ambiente: Windows local, Node.js v24.19.0, Playwright 1.58.2 e Google Chrome instalado. Jogo servido por HTTP em localhost a partir de `Entrega/netlify`, e também de `Entrega/zip-verificado`, extraído do ZIP. Nenhuma implantação no Netlify foi feita.

## Evidências

| Verificação | Execução e resultado |
|---|---|
| Motores | `node tests/motores.cjs`: 226 caminhos terminais dos doze capítulos e 178 do especial; motores não mutam entrada; encerramentos e alternativas válidos |
| Continuidade | Mesmo teste cobre as 30 definições de encontros (19 cenas específicas e 11 de apoio por relação), identificadores únicos e reaplicação do mesmo token sem efeito; marmita, parentesco e favor só retornam sob as condições previstas |
| Conhecimento | Inês não conhece a marmita inventada antes do telefonema; a cobrança só abre após a transmissão e a promessa. Porteiro não cobra parentesco inexistente |
| Interface | `node tests/navegador.cjs`: nova partida por botões, doze capítulos e especial concluídos; rota discreta e rota de fofoca produzem cenas diferentes; ausência de erros de página e de recursos HTTP nos percursos executados |
| Turnos | `node tests/rotas.cjs`: quatro turnos completos, IDs internos [0,4,8], [1,5,9], [2,6,10], [3,7,11]. Inclui sequência completa de marmita com impacto → desculpa → pedido → cobrança |
| Persistência | Novo contexto conserva histórico, mundo, recibos e preferências. Chrome inteiro fechado e reaberto com o mesmo perfil também conserva o favor e a decisão; não depende apenas de importar storageState |
| Resultado | Carregar recibo não duplica histórico/recompensas nem solicita vibração de conclusão. Cancelar Nova partida preserva os dados |
| Falhas de armazenamento | `node tests/robustez.cjs`: dado corrompido e versão incompatível preservados; reinício confirmado guarda cópia recuperável; erro simulado de quota informa falha e mantém jogabilidade |
| Migração | `node tests/pacote.cjs`: registro de formato 1 reconstruído em formato 2, com nome e posição preservados e sem efeitos transitórios |
| Sensor e controles | Ausência de dados e permissão negada oferecem alternativa. Evento de orientação simulado calibra e altera entrada. Teclado real do navegador produz impacto; perda de foco pausa. Reabrir transporte reinicia do ponto estável sem derrota. Impacto abre conferência narrativa |
| Haptics | Modos desligado/resultados/todos, padrões e prioridade verificados com `navigator.vibrate` simulado; ausência da função não quebra o jogo; conclusão única e retomada silenciosa |
| Áudio | Dez WAV decodificados por AudioContext, MIME de áudio correto, controles de música e vibração persistidos. Medições de duração, RMS, pico e emendas em `audio-medicoes.json`; sem clipping ou faixas vazias |
| Layout | 320×740, 390×844 e 1440×900 em configurações; cenas em 320, 390 e 1440 px; sem rolagem horizontal, ações alcançáveis pela rolagem do painel. Capturas inspecionadas; retratos dos encontros reduzidos após revisão |
| Entradas | Nome contendo marcação HTML permanece dado; não cria elemento executável |
| PWA | `node tests/pwa.cjs`: 903 recursos do jogo armazenados após instalação com hash; retomada offline; atualização isolada de CSS/manifesto aguarda fechar a janela antiga, preserva mundo e mantém apenas o cache atual do jogo |
| Pacote | `node tests/pacote.cjs`: 905 arquivos e 39.504.317 bytes nas duas pastas, hashes idênticos à fonte/manifesto, todos obtidos por HTTP com conteúdo idêntico, MIME de JS/áudio correto e arquivo inexistente respondendo 404. Especial executado a partir do ZIP extraído |
| Linguagem | Busca por palavras inteiras tu/teu/tua/teus/tuas nos scripts públicos principais não encontrou ocorrências; diálogos novos usam você. Créditos trazem o nome completo aprovado |

Os testes de turnos usam avanço controlado do relógio do transporte para percorrer os ramos sem repetir esperas; o teste de robustez usa transporte em tempo real e eventos de teclado. Nenhum deles comprova o movimento ou a sensação de um aparelho físico.

Os registros JSON e capturas reproduzíveis ficam em `tests/resultados/`; uma cópia compacta dos relatórios desta execução acompanha `docs/evidencias/`. Esses arquivos não entram na pasta pública. Não foi medida cobertura percentual, performance com usuários, diversão ou acessibilidade universal.

## Correções encontradas durante a execução

- Recuperados 169 recursos ausentes do checkout a partir da pasta Visual 1.2 original indicada, sem substituir os que já existiam.
- Corrigido o uso da propriedade HTML reservada `dir` no controle de transporte; a entrada passou para `controlInput`, verificada por impacto real no teste de teclado.
- Ajustados histórico, migração, retorno após a explicação da marmita e prioridade do feedback de resultado.
- O teste que injetava corrupção antes do evento `pagehide` foi corrigido: o autosave legítimo sobrescrevia a injeção. Agora a corrupção é introduzida antes da inicialização seguinte, simulando corretamente dados ilegíveis em repouso.
- O teste de fofoca foi ajustado para atravessar uma oferta legítima de ajuda acumulada antes de conferir a cobrança de Dalva.
- Acrescentado `.gitattributes` para impedir conversão de bytes públicos entre Windows/Linux e quebra dos hashes da PWA.

## Limitações materiais

Não houve acesso a Android/iPhone físico para testar sensores e vibração, avaliação auditiva humana, teste com jogadores ou publicação em produção. Reprodução/decodificação e métricas de áudio não equivalem a escuta. O roteiro de checagem física está em `DEMONSTRACAO.md`. Não se afirma que todos os ramos narrativos integrados foram percorridos manualmente: houve percursos representativos de interface e exploração sistemática dos motores puros.
