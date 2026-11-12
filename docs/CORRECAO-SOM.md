# Correção de áudio após verificação do site

O endereço informado foi `https://thunderous-eclair-21ac61.netlify.app/`. Na inspeção, `app.js`, `feedback.js` e a faixa de abertura publicados correspondiam à versão local anterior. Os WAV retornaram HTTP 200 e MIME de áudio. Em contexto novo do Chrome, clique e toque iniciaram a música e seu relógio avançou. Isso não identifica as configurações nem a saída de som do aparelho do usuário.

Foram encontrados dois problemas de usabilidade no código: música excessivamente atenuada (volume do elemento 0,198 no padrão, sobre gravação já baixa) e rejeições de `play()` descartadas sem aviso. A tela de configurações também pausava a música sem oferecer uma prévia, dificultando perceber o efeito dos controles.

Correções:

- Botão **Desativar som / Ativar som** logo abaixo de **ARQUIVO DAS ESCOLHAS**, fixo no topo da área do jogo durante a rolagem. Substitui o antigo **Ativar e testar som**, sem alterar decisões ou progresso.
- Som ligado por padrão; a primeira interação com o jogo inicia a reprodução. O modo mudo escolhido pela pessoa fica salvo, preservando volume e controles individuais. Ativar recupera volume zero e habilita os dois canais se ambos estavam desmarcados.
- Status visível de reprodução, pausa, som desligado, bloqueio pelo navegador ou falha no carregamento. Não se afirma que o alto-falante do aparelho está emitindo som.
- Ativação por clique/toque concluído ou teclado; canais de música e efeito reutilizados entre telas.
- Configurações, acessibilidade e pausa mantêm a música pausada. O botão não toca mais uma prévia; controla o som geral. Desligá-lo como primeira interação não dispara nenhum áudio.
- WAV normalizados a pico 0,8 e mixagem menos atenuada. Mesmas composições, sem novos samples. O acompanhamento fica aproximadamente 12,5–15,4 dB acima da configuração anterior no volume padrão; continua reduzido durante efeitos.
- O botão de áudio não passa pelo bloqueio de duplo clique das decisões narrativas. Alternar rapidamente reutiliza os canais, sem empilhar reproduções.
- Volume responde enquanto o controle é movimentado. Preferências continuam persistentes; nenhuma mudança de formato de salvamento.

Verificação atual: `node tests/audio.cjs`, em Chrome com política restrita de autoplay, por mouse, emulação de toque, Enter e Espaço. Confirmados início na primeira ação do jogo sem botão de áudio, reprodução real com `currentTime` avançando, canais reutilizados, modo mudo persistido, recuperação do volume zero, preferências individuais preservadas, compatibilidade com salvamento anterior, restauração após bloqueio simulado, aviso de falha simulada, preservação do estado narrativo e botão visível durante rolagem em 320 px. Evidência em `docs/evidencias/audio-controle.json`. A verificação anterior de normalização e ausência de clipping permanece em `docs/evidencias/audio-correcao.json`; os WAV não foram alterados nesta troca de controle. Regressão dos motores também passou.

Não houve escuta humana nem teste de alto-falante/volume do sistema em telefone físico. Não confundir teste de reprodução no navegador com confirmação da saída física de som.

Esta correção é preparada na fonte e no pacote local. O endereço publicado só receberá a mudança após atualização do deploy no mesmo projeto Netlify. Referência técnica: [guia de autoplay da MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).
