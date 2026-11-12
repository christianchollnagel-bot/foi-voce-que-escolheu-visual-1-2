# Áudio e créditos

Responsável acadêmico: **Christian Cândia Hollnagel**. Direção e requisitos: prompt mestre e consolidação aprovada. Base visual e universo: Visual 1.2 de Foi Você Que Escolheu / O Arquivo das Escolhas, preservados. Atualização de código, texto, composição por síntese e testes: assistência de IA com Codex. Isso não é geração de diálogo durante a partida.

## Produção sonora desta atualização

Os dez WAV foram produzidos pelo script `scripts/compor-audio.cjs`, que inclui a partitura, a harmonia, o arranjo e a síntese. Sem gravações, melodias de novelas, samples ou instrumentos de terceiros. Osciladores senoidais e harmônicos com envelopes simulam piano, baixo e madeira; ruído pseudoaleatório com semente fixa e envelopes produz a percussão. Não é atribuída composição humana exclusiva a essa produção assistida. Os arquivos são materiais originais criados para uso e distribuição neste projeto; não se promete certificação jurídica universal de exclusividade.

108 BPM; motivo de dois compassos; harmonia em torno de C, Am, Dm e G; quatro acompanhamentos de oito compassos. WAV PCM mono, 22.050 Hz, 16 bits, decodificados no navegador. Fontes de composição ficam fora da pasta pública.

| Peça | Arquivo em web/audio | Uso |
|---|---|---|
| O turno começou | turno-comecou.wav | Abertura/menu, repetível |
| Era só entregar | era-so-entregar.wav | Entregas, arranjo reduzido, repetível |
| Agora explica | agora-explica.wav | Cobranças já reveladas, repetível |
| Fim do turno | fim-do-turno.wav | Balanço, repetível |
| Vitória | vitoria.wav | Uma vez na conclusão positiva |
| Derrota | derrota.wav | Uma vez na conclusão negativa |
| Carimbo | carimbo.wav | Recibo do canhoto no protocolo |
| Mensagem | mensagem.wav | Central e revelação de consequência |
| Batidas | batidas.wav | Entrada da portaria |
| Impacto | impacto.wav | Contato da carga com a borda |

Os sons de resultado já contêm o contato do carimbo; não é tocado outro carimbo na mesma conclusão. Música e efeitos têm controles independentes. O acompanhamento diminui durante os efeitos; uma única instância de música e uma de efeito impedem empilhamento. Faixas só mudam ao mudar o contexto musical, e a pausa conserva a posição. A mudança entre contextos usa corte entre frases/contextos de tela; não há mixagem musical por compasso. Reprodução bloqueada não interrompe a partida.

`audio-medicoes.json` registra duração, pico, RMS e diferença entre as amostras de emenda. Foram verificados arquivos não vazios, decodificação, ausência de clipping e emendas numéricas. Não houve avaliação auditiva humana nem teste de alto-falante de celular; não se afirma que a qualidade percebida foi aprovada por escuta.

Na correção de som, os mesmos arquivos foram normalizados a pico 0,8 e a atenuação da música foi reduzida. O controle do topo agora alterna **Desativar som / Ativar som**, com áudio ligado por padrão e reprodução a partir da primeira interação. O modo mudo persiste e preserva as preferências individuais de música/efeitos e volume. `CORRECAO-SOM.md`, `evidencias/audio-correcao.json` e `evidencias/audio-controle.json` registram os testes de reprodução, controle, bloqueio e recuperação.

## Vibração

Padrões em milissegundos, alternando pulso e pausa: vitória `[45,65,45]`; derrota `[140]`; carimbo `[30]`; central `[25,50,25,50,40]`; revelação `[40]`; impacto `[35]`; porta `[40,120,40]`. Resultados têm prioridade; impactos têm intervalo mínimo de um segundo no transporte. A vibração é cancelada ao ocultar ou pausar. Modos: Desligada, Somente resultados e Todos os efeitos. Não há controle de intensidade. Testes de chamadas simuladas não comprovam percepção física.

## Recursos preservados e recuperados

O checkout tinha 169 recursos visuais/tipográficos ausentes. Eles foram copiados, somente quando faltavam, da pasta local `V1_WebApp_PWA_Visual_v1_2/web` indicada pelo usuário. Não foram substituídos recursos existentes por uma versão diferente. As fontes preservam suas licenças SIL Open Font License 1.1 em `web/assets/fontes/Barlow-OFL.txt` e `Noto-OFL.txt`. A arte é a da base fornecida; esta execução não refaz sua cadeia histórica de autoria.
