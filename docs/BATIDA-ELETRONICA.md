# Batida eletrônica com groove brasileiro

Direção escolhida pelo usuário: eletrônica com groove brasileiro, baixo mais presente e percussão leve para acompanhar os diálogos. Quatro novos acompanhamentos substituem as trilhas de 108 BPM. Os seis efeitos/vinhetas e o controle Ativar som / Desativar som permanecem como estavam.

## Arranjo e integração

112 BPM, 4/4, oito compassos por loop. A sequência C6/9 – Am9 – Dm9 – G13 se repete duas vezes. O motivo anterior C5–E5–G5–A5–G5 / E5–D5–C5–G4 permanece reconhecível, com timbre de pluck e respostas mais espaçadas durante as entregas. O baixo usa fundamentais, quintas e oitavas; bumbo e baixo ficam no centro. Teclas elétricas e reflexos curtos ocupam discretamente as laterais, com boa compatibilidade mono.

Bumbo sincopado, palmas nos tempos 2 e 4, shaker em semicolcheias com acentos alternados, tamborim sintetizado em células de dois compassos e pequenos preenchimentos de aro no fim de frases. As semicolcheias alternadas atrasam 0,035 pulso. A redução de ganho após o bumbo tem ataque e retorno suaves; não há compressão pesada no master.

| Arquivo | Estado responsável | Densidade e repetição |
|---|---|---|
| `turno-comecou.wav` | Abertura/menu, por `Feedback.context('opening')` | Arranjo completo; oito compassos repetíveis |
| `era-so-entregar.wav` | Entregas, por `Feedback.context('route')` | Bateria e tema mais discretos; frases melódicas alternadas deixam espaço para leitura |
| `agora-explica.wav` | Cobrança já revelada, por `Feedback.context('confusion')` | Percussão mais presente e harmonia contida; não antecipa consequências ocultas |
| `fim-do-turno.wav` | Balanço, por `Feedback.context('ending')` | Menos ataques, tema uma oitava abaixo e menor nível médio |

As trocas continuam ocorrendo no evento de tela, por corte, sem sobrepor baixos de contextos diferentes. Não há promessa de transição quantizada por compasso. O percurso normal é abertura → entregas → cobrança revelada → entregas → fim do turno; um retorno inesperado ao menu volta à abertura. Pausa/configurações interrompem a música e conservam a posição quando o contexto retomado usa a mesma faixa. Os efeitos continuam prioritários e reduzem o volume da música pelo sistema já existente. Uma falha de mídia aparece no status sem bloquear a partida.

## Arquivos e reprodução

As mixes de integração/escuta ficam em `web/audio/`, com os mesmos nomes usados pelo jogo. São PCM estéreo de 16 bits e 44.100 Hz, com 756.000 quadros por loop (17,142857 segundos). O intervalo de loop é `[0, 756000)`. Caudas das notas e reflexos são renderizadas circularmente, sem fade a silêncio na emenda.

Recriar: `node scripts/compor-audio.cjs`. Com `--stems`, o mesmo comando produz quatro grupos por faixa — bateria, baixo, harmonia e tema — em `tests/resultados/audio-stems/`, com origem, duração e ganho comuns. Esses intermediários ficam fora do Git e da pasta pública. A soma recompõe a mix dentro da quantização de 16 bits; os stems não são normalizados separadamente. Não há sample ou execução instrumental de terceiros; partitura e síntese são originais, com assistência do Codex e direção do usuário.

## Verificação

`node tests/trilha.cjs` verifica a renderização determinística, formato, duração, pico de amostra, offset DC, emendas, janelas de 100 ms sem silêncio inesperado, compatibilidade mono, soma dos stems e identidade dos seis efeitos anteriores. `docs/evidencias/batida-eletronica.json` registra as medições.

`node tests/audio.cjs` verifica no Chrome a reprodução por clique/toque, as quatro faixas, a volta ao começo do loop, a troca e o retorno de contextos, a pausa, o controle geral, o volume zero e as falhas de mídia. Evidência em `docs/evidencias/batida-navegador.json`. Testes de arquivo e navegador não substituem escuta humana em fones/caixas ou teste em telefone físico.

O servidor local `scripts/servir.cjs` agora informa `Content-Length`, permitindo que o navegador determine a duração dos WAV e verifique sua repetição. Essa correção serve ao pacote local; o Netlify já fornece o tamanho dos arquivos estáticos.
