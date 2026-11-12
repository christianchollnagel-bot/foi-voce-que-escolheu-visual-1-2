# Foi Você Que Escolheu

Projeto Inovação Chris 2026/2. Responsável acadêmico: **Christian Cândia Hollnagel**.

Atualização da Visual 1.2: doze capítulos, três atos e o especial **O nome no recibo**, com consequências entre entregas, memória por personagem, salvamento local, transporte, música e vibração. As falas são escritas e selecionadas por regras; não há modelo ou API de IA durante a partida.

## Abrir

Na raiz deste projeto, com Node.js instalado:

```powershell
node scripts/servir.cjs Entrega/netlify 4173
```

Abra http://localhost:4173. Para servir diretamente a fonte, substitua `Entrega/netlify` por `web`. Não abra `index.html` por `file://`: sensores, instalação e cache precisam de HTTPS ou localhost.

Nova partida passa pela introdução e pelo crachá. Em **Ver capítulos e atos**, escolha qualquer capítulo, o especial ou o turno de três entregas. **Próxima entrega** mantém as escolhas anteriores. **Nova partida** limpa o percurso somente após confirmação. A seleção de capítulo mantém as memórias desta partida; começar uma partida nova e selecionar um capítulo dá um início sem escolhas anteriores inventadas.

O jogo salva automaticamente neste navegador e aparelho. Ao reabrir, use **Continuar partida**. A limpeza dos dados do site, a troca de navegador ou de endereço pode separar ou apagar o acesso ao progresso. Não há conta nem sincronização. Um transporte interrompido reinicia do começo do trecho, sem aplicar derrota.

No transporte, escolha a estratégia e use as setas, os botões de toque ou **Ativar inclinação e calibrar**. A referência é a posição em que você segura o aparelho na ativação. Para recalibrar, pressione o mesmo botão. Os diálogos não têm contagem regressiva. O equilíbrio dura 9–12 segundos conforme a estratégia.

Configurações permitem controlar música, efeitos, volume, vibração, texto ampliado, contraste e redução de movimento. Tab, Enter e Esc permitem navegar. Áudio e vibração não são necessários para compreender os resultados.

A trilha usa **eletrônica com groove brasileiro a 112 BPM**: baixo sincopado, bumbo encorpado, palmas, shaker e tamborim sintetizados, em quatro variações para abertura, entregas, cobrança e fim do turno. O tema do jogo permanece reconhecível. Arranjo, fontes e verificação em `docs/BATIDA-ELETRONICA.md`.

O som vem ligado por padrão e começa na primeira interação com o jogo, como **Abrir o arquivo**, respeitando a permissão de reprodução do navegador. Logo abaixo de **ARQUIVO DAS ESCOLHAS**, o botão **Desativar som / Ativar som** controla música e efeitos juntos e permanece visível durante a rolagem. Desligar o som preserva o volume e as escolhas individuais de música/efeitos; essa preferência fica salva neste navegador. Ativar recupera o volume padrão se estiver em zero e liga os dois canais caso ambos estivessem desmarcados. Nas configurações e na pausa, a música continua pausada. O status informa bloqueios ou falhas de carregamento. Consulte `docs/CORRECAO-SOM.md` para a verificação.

## Entrega e manutenção

- Fonte canônica: `web/`.
- Pasta de publicação: `Entrega/netlify/`, com `index.html` na raiz.
- ZIP: `Foi_Voce_Que_Escolheu_Netlify.zip` na raiz do projeto.
- Gerar novamente: `node scripts/empacotar.cjs` (Node.js e PowerShell; sem dependências npm).
- Recriar os áudios: `node scripts/compor-audio.cjs`, depois empacotar.
- Testes do motor: `node tests/motores.cjs`.
- Testes de navegador: `npm ci`, iniciar o servidor e executar os scripts `tests/navegador.cjs`, `tests/robustez.cjs`, `tests/rotas.cjs` e `tests/pwa.cjs`. Usam Chrome instalado no caminho documentado nos scripts. `?teste=1` habilita acesso ao estado para testes; não altera o funcionamento da partida. `?ensaio=1` é o modo legado sem persistência.

O script `scripts/integrar.cjs` registra a transformação inicial da base e **não deve ser reaplicado** à versão atual. A manutenção é feita nos arquivos de `web/`.

Consulte `docs/PUBLICACAO.md`, `docs/CONSEQUENCIAS.md`, `docs/AUDIO-E-CREDITOS.md`, `docs/VERIFICACAO.md` e `docs/DEMONSTRACAO.md`. Os documentos HTML antigos em `Entrega/` são evidências históricas da Visual 1.2; não descrevem esta atualização nem entram no pacote publicado. A consolidação aprovada foi preservada sem alterações. O mapa final da jornada permanece uma etapa posterior.
