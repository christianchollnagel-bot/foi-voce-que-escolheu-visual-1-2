# Áudio e créditos

Responsável acadêmico: **Christian Cândia Hollnagel**. Direção e requisitos: prompt mestre e consolidação aprovada. Base visual e universo: Visual 1.2 de Foi Você Que Escolheu / O Arquivo das Escolhas, preservados. Atualização de código, texto, composição por síntese e testes: assistência de IA com Codex. Isso não é geração de diálogo durante a partida.

## Produção sonora desta atualização

Os dez WAV são produzidos por `scripts/compor-audio.cjs`; as quatro trilhas usam o arranjo e o sintetizador de `scripts/trilha-eletronica.cjs`. Sem gravações, melodias de novelas, samples ou instrumentos de terceiros. Osciladores e ruído pseudoaleatório determinístico produzem baixo, teclas elétricas, motivo melódico e percussão eletrônica com inspiração brasileira. Não há instrumentistas gravados. Não é atribuída composição humana exclusiva a essa produção assistida. Os arquivos são materiais originais criados para uso e distribuição neste projeto; não se promete certificação jurídica universal de exclusividade.

Nova batida: **112 BPM, 4/4**, motivo de dois compassos preservado, baixo sincopado e acordes C6/9, Am9, Dm9 e G13. Bumbo eletrônico, palmas suaves, shaker, tamborim e aro sintetizados, com pequeno atraso nas semicolcheias alternadas. As quatro trilhas têm oito compassos, 756.000 quadros, **17,142857 segundos**, em WAV PCM estéreo, **44.100 Hz / 16 bits**. Efeitos e vinhetas anteriores permanecem idênticos, em mono, 22.050 Hz / 16 bits. A partitura reproduzível fica fora da pasta pública. Veja `BATIDA-ELETRONICA.md`.

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

`audio-medicoes.json` registra duração, pico de amostra, RMS e diferença entre as amostras de emenda. As trilhas modernas também registram RMS em dBFS, correlação estéreo e energia mono; essas medidas não são LUFS nem true peak. O ganho de masterização é comum às quatro trilhas e aos stems, mantendo as diferenças de intensidade. Foram verificados arquivos não vazios, decodificação, ausência de clipping de amostra, soma dos stems e emendas numéricas. Não houve avaliação auditiva humana nem teste de alto-falante de celular; não se afirma que a qualidade percebida foi aprovada por escuta.

Na correção de som, os mesmos arquivos foram normalizados a pico 0,8 e a atenuação da música foi reduzida. O controle do topo agora alterna **Desativar som / Ativar som**, com áudio ligado por padrão e reprodução a partir da primeira interação. O modo mudo persiste e preserva as preferências individuais de música/efeitos e volume. `CORRECAO-SOM.md`, `evidencias/audio-correcao.json` e `evidencias/audio-controle.json` registram os testes de reprodução, controle, bloqueio e recuperação.

## Vibração

Padrões em milissegundos, alternando pulso e pausa: vitória `[45,65,45]`; derrota `[140]`; carimbo `[30]`; central `[25,50,25,50,40]`; revelação `[40]`; impacto `[35]`; porta `[40,120,40]`. Resultados têm prioridade; impactos têm intervalo mínimo de um segundo no transporte. A vibração é cancelada ao ocultar ou pausar. Modos: Desligada, Somente resultados e Todos os efeitos. Não há controle de intensidade. Testes de chamadas simuladas não comprovam percepção física.

## Recursos preservados e recuperados

O checkout tinha 169 recursos visuais/tipográficos ausentes. Eles foram copiados, somente quando faltavam, da pasta local `V1_WebApp_PWA_Visual_v1_2/web` indicada pelo usuário. Não foram substituídos recursos existentes por uma versão diferente. As fontes preservam suas licenças SIL Open Font License 1.1 em `web/assets/fontes/Barlow-OFL.txt` e `Noto-OFL.txt`. A arte é a da base fornecida; esta execução não refaz sua cadeia histórica de autoria.
