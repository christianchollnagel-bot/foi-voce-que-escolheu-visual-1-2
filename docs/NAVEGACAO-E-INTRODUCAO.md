# Navegação sem rolagem, reset e introdução 2D

Atualização de 12/11/2026, sobre a branch `codex/atualizacao-completa`.

## Comportamento entregue

- A moldura usa a altura disponível da janela. No Netlify, reserva 48 px inferiores para que a identificação da hospedagem não cubra botões. Textos, ações, crachás e histórico são distribuídos em páginas, com **Anterior / Próxima** e indicador de página fixos. Não há rolagem do documento nem da área do jogo.
- A paginação recalcula ao redimensionar, abrir um ato, carregar imagens ou mudar a fonte. Não remove texto nem altera escolhas. Controles fora da página ficam fora da navegação por teclado; PageUp / PageDown também mudam páginas. A seleção do crachá preserva o foco no item escolhido.
- No transporte, configuração e instruções aparecem antes do início. Durante o equilíbrio, carga, setas e pausa permanecem juntos; a paginação fica bloqueada até pausar. O texto informa corretamente 9, 10 ou 12 segundos. As setas não interceptam mais o seletor antes de começar, e o status não é reescrito a cada quadro.
- **Resetar jogo** aparece logo após **Nova partida** no menu. Sempre pede confirmação. Cancela-se sem alterar o progresso. Ao confirmar, apaga partida, recibos, escolhas, turno e crachá, preserva som e acessibilidade, salva e volta ao menu. Não limpa dados de outros aplicativos. Registro ilegível continua protegido pela recuperação já existente.
- Uma animação 2D de **15 segundos** substitui as três telas do prólogo. São três cenas de cinco segundos: receber o pedido, escolher o caminho e consultar consequências. Avança automaticamente para preparar o crachá na nova partida. Não se repete a cada capítulo depois de vista/pulada; **Rever introdução** permite repetir. Nova partida/reset reinicia essa apresentação.
- A animação tem texto, progresso, pausa/retomada e pular. Perder foco ou ocultar a página pausa o relógio. Reduzir movimento mantém as ilustrações estáticas. Não exige áudio para entender.
- Corrigida a instalação offline no site publicado: a marcação acrescentada pelo Netlify é reconhecida na verificação do HTML, sem retirar a identificação do provedor nem deixar de conferir o código do jogo. Detalhes em `PUBLICACAO.md`.

## Recursos e integração

| Recurso | Função/formato | Origem e consumo |
|---|---|---|
| `paginas.js` / `paginas.css` | Colunas CSS contidas na janela; controle de foco e páginas | Código original desta atualização; carregado por `index.html`, montado por `present()` |
| `introducao.js` | SVG original em coordenadas 640 × 400, escalável; três camadas/cenas | Vetores criados para o projeto, sem imagens, samples ou vídeo externos; componente `fvqe-introducao` integrado ao prólogo |
| Cena 1 | Balcão, mãos, envelope em trajetória | Receber e entender o pedido; movimento suave de posição e rotação |
| Cena 2 | Dois caminhos, escolhas e marcador móvel | Perguntar/decidir; marcador acompanha uma bifurcação |
| Cena 3 | Recibo, carimbo e caderno | Resultado e memória; entrada do caderno e aparição do carimbo |

Paleta, tipografia e contornos seguem o jogo existente. Não há nova faixa, voz sintetizada ou download de mídia. A música existente continua sob o botão global de som. O componente cancela quadros e ouvintes ao sair; não cria recursos de áudio adicionais.

## Evidências

### Correção da paginação mobile após a captura do usuário

A captura recebida mostrou o catálogo de personagens cortado, contador `1 / 1` e os dois botões desativados. O cálculo anterior dependia de `height:100%` dentro de flex e somente de `scrollWidth`. A composição agora recebe a altura disponível em pixels; o total considera também os retângulos dos fragmentos renderizados. Uma medida momentaneamente vazia não é usada para repaginar. As regras antigas de `overflow:auto` da moldura e do catálogo foram removidas da folha base.

Também foi reproduzido um erro de arredondamento: em janela 899×668, a área de leitura tinha 347,75 px e `clientWidth` devolvia 348. A diferença acumulada entre colunas deixava “Pular personalização” inacessível no Chrome. O deslocamento agora conserva a largura fracionária obtida do retângulo real.

`tests/paginacao-mobile.cjs` confere Anterior/Próxima com toques, seleção do último retrato e confirmação em cinco tamanhos, nos dois motores. Injeta separadamente altura indefinida e largura de rolagem incompleta para verificar a recuperação do estado semelhante à captura. Essa injeção não é uma reprodução física do erro no telefone. A suíte também reduz a janela visual para 615,625 px e simula retorno à página. `tests/paginas.cjs` passou a procurar qualquer região interna que exija rolagem, além de conferir texto e controles alcançáveis.

A exigência de dimensão definida para a composição sequencial é descrita pela [especificação CSS Multicol](https://www.w3.org/TR/css-multicol-1/). A causa exata no aparelho da captura continua sem inspeção remota; os testes executam Chrome e WebKit no Windows. A revisão anterior dos botões validou eventos, mas não comprovava esse comportamento de layout no telefone.

Nesta revisão passaram os cinco tamanhos e a recuperação de medições em ambos os motores, as 240 combinações de layout de `tests/mobile.cjs`, os fluxos de `tests/fluxos-paginados.cjs` e a introdução de `tests/introducao.cjs`. As verificações incluem texto ampliado, orientação deitada, áreas seguras simuladas, transporte, edição de campos e salvamento.

- `tests/paginas.cjs`: 120 combinações de telas, tamanhos 320×568, 390×844, 844×390 e 1440×900, com fontes normal/ampliada. Verifica texto verticalmente íntegro, acesso a todos os controles por páginas e roda do mouse sem mover o documento/moldura. Até 14 páginas nas telas testadas, incluindo texto ampliado em paisagem com espaço reservado à identificação do host.
- `tests/fluxos-paginados.cjs`: percurso, consultas, recibo, histórico, atos expandidos, foco do crachá, janela reduzida durante edição, rotação, transporte em fonte ampliada, reset/cancelamento e persistência.
- `tests/introducao.cjs`: as três cenas nos quatro tamanhos e duas fontes; pausa, redução de movimento, duração real de aproximadamente 15 s, conclusão automática, replay, pular e persistência.
- `tests/integridade-host.cjs`: aceita HTML original e HTML com a marcação conhecida do Netlify, preserva a resposta e rejeita alterações no jogo, scripts e marcação desconhecida.
- `tests/navegador.cjs`: os 13 capítulos concluídos, rotas distintas, restauração de progresso e 10 WAV decodificados. Adaptação dos testes de interface para alcançar controles pela paginação.
- `tests/pwa.cjs` e `tests/pacote.cjs`: 906 recursos em cache offline; atualização preserva progresso; 908 arquivos do pacote/ZIP com hashes idênticos à fonte e ao manifesto, conferidos por HTTP.
- `tests/robustez.cjs`, `tests/rotas.cjs` e `tests/audio.cjs`: sensores simulados e fallback, transporte real, quatro turnos, recuperação de salvamento, reprodução por clique/toque emulado e botão global de som.
- `tests/motores.cjs`: 226 percursos terminais dos capítulos, 178 do especial e 30 cenas de continuidade.

Capturas e relatórios ficam em `tests/resultados`; cópias dos novos relatórios acompanham `docs/evidencias`. Execução em Chrome instalado, automatizado e isolado. A redução de janela simula espaço do teclado; não comprova teclado, sensores, haptics, Safari ou renderização em aparelho físico. Não houve teste com jogadores nem auditoria completa de leitor de tela.
