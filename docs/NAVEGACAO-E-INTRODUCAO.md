# Navegação sem rolagem, reset e introdução 2D

Atualização de 12/11/2026, sobre a branch `codex/atualizacao-completa`.

## Comportamento entregue

- A moldura usa a altura disponível da janela. Textos, ações, crachás e histórico são distribuídos em páginas, com **Anterior / Próxima** e indicador de página fixos. Não há rolagem do documento nem da área do jogo.
- A paginação recalcula ao redimensionar, abrir um ato, carregar imagens ou mudar a fonte. Não remove texto nem altera escolhas. Controles fora da página ficam fora da navegação por teclado; PageUp / PageDown também mudam páginas. A seleção do crachá preserva o foco no item escolhido.
- No transporte, configuração e instruções aparecem antes do início. Durante o equilíbrio, carga, setas e pausa permanecem juntos; a paginação fica bloqueada até pausar. O texto informa corretamente 9, 10 ou 12 segundos. As setas não interceptam mais o seletor antes de começar, e o status não é reescrito a cada quadro.
- **Resetar jogo** aparece logo após **Nova partida** no menu. Sempre pede confirmação. Cancela-se sem alterar o progresso. Ao confirmar, apaga partida, recibos, escolhas, turno e crachá, preserva som e acessibilidade, salva e volta ao menu. Não limpa dados de outros aplicativos. Registro ilegível continua protegido pela recuperação já existente.
- Uma animação 2D de **15 segundos** substitui as três telas do prólogo. São três cenas de cinco segundos: receber o pedido, escolher o caminho e consultar consequências. Avança automaticamente para preparar o crachá na nova partida. Não se repete a cada capítulo depois de vista/pulada; **Rever introdução** permite repetir. Nova partida/reset reinicia essa apresentação.
- A animação tem texto, progresso, pausa/retomada e pular. Perder foco ou ocultar a página pausa o relógio. Reduzir movimento mantém as ilustrações estáticas. Não exige áudio para entender.

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

- `tests/paginas.cjs`: 120 combinações de telas, tamanhos 320×568, 390×844, 844×390 e 1440×900, com fontes normal/ampliada. Verifica texto verticalmente íntegro, acesso a todos os controles por páginas e roda do mouse sem mover o documento/moldura. Até oito páginas nas telas testadas.
- `tests/fluxos-paginados.cjs`: percurso, consultas, recibo, histórico, atos expandidos, foco do crachá, janela reduzida durante edição, rotação, transporte em fonte ampliada, reset/cancelamento e persistência.
- `tests/introducao.cjs`: as três cenas nos quatro tamanhos e duas fontes; pausa, redução de movimento, duração real de aproximadamente 15 s, conclusão automática, replay, pular e persistência.
- `tests/navegador.cjs`: os 13 capítulos concluídos, rotas distintas, restauração de progresso e 10 WAV decodificados. Adaptação dos testes de interface para alcançar controles pela paginação.
- `tests/pwa.cjs` e `tests/pacote.cjs`: 906 recursos em cache offline; atualização preserva progresso; 908 arquivos do pacote/ZIP com hashes idênticos à fonte e ao manifesto, conferidos por HTTP.
- `tests/robustez.cjs`, `tests/rotas.cjs` e `tests/audio.cjs`: sensores simulados e fallback, transporte real, quatro turnos, recuperação de salvamento, reprodução por clique/toque emulado e botão global de som.
- `tests/motores.cjs`: 226 percursos terminais dos capítulos, 178 do especial e 30 cenas de continuidade.

Capturas e relatórios ficam em `tests/resultados`; cópias dos novos relatórios acompanham `docs/evidencias`. Execução em Chrome instalado, automatizado e isolado. A redução de janela simula espaço do teclado; não comprova teclado, sensores, haptics, Safari ou renderização em aparelho físico. Não houve teste com jogadores nem auditoria completa de leitor de tela.
