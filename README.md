# Foi Você Que Escolheu

Projeto Inovação Chris 2026/2. Responsável acadêmico: **Christian Cândia Hollnagel**.

**Edição 1.3.0 · portfólio.** Um jogo narrativo sobre o que acompanha uma encomenda: promessas, favores e histórias que voltam no próximo encontro. Doze capítulos, três atos e o especial **O nome no recibo**, com consequências entre entregas, memória por personagem, salvamento local, transporte, música e vibração. As falas são escritas e selecionadas por regras; não há modelo ou API de IA durante a partida.

[Jogar no navegador](https://foivocequeescolheu.netlify.app/) · [Apresentação para portfólio](docs/PORTFOLIO.md) · [Auditoria e evidências da edição](docs/AUDITORIA-1.3.md)

## Abrir

Na raiz deste projeto, com Node.js instalado (não precisa instalar dependências para jogar):

```powershell
npm start
```

Abra http://localhost:4173. O servidor usa a fonte versionada em `web/`; uma cópia recém-clonada não depende da pasta gerada `Entrega/netlify/`. Não abra `index.html` por `file://`: sensores, instalação e cache precisam de HTTPS ou localhost.

Nova partida começa com uma animação 2D de 15 segundos: receba o pedido, escolha o caminho e acompanhe as consequências. Pode pausar, pular ou usar **Rever introdução** no menu. Depois, prepare seu crachá. Em **Ver capítulos e atos**, escolha qualquer capítulo, o especial ou o turno de três entregas. **Próxima entrega** mantém as escolhas anteriores. **Nova partida** limpa um percurso existente somente após confirmação. **Resetar jogo**, logo após Nova partida no menu, confirma antes de apagar partida, recibos, escolhas e crachá; mantém som e acessibilidade e retorna ao menu. A seleção de capítulo mantém as memórias desta partida; começar uma partida nova e selecionar um capítulo dá um início sem escolhas anteriores inventadas.

O jogo salva automaticamente neste navegador e aparelho. Ao reabrir, use **Continuar partida**. A limpeza dos dados do site, a troca de navegador ou de endereço pode separar ou apagar o acesso ao progresso. Não há conta nem sincronização. Um transporte interrompido reinicia do começo do trecho, sem aplicar derrota.

No transporte, escolha a estratégia e use as setas, os botões de toque ou **Ativar inclinação e calibrar**. A referência é a posição em que você segura o aparelho na ativação. Para recalibrar, pressione o mesmo botão. Os diálogos não têm contagem regressiva. O equilíbrio dura 9–12 segundos conforme a estratégia.

Configurações permitem controlar música, efeitos, volume, vibração, texto ampliado, contraste e redução de movimento. Tab, Enter e Esc permitem navegar. O site e a área do jogo não precisam de rolagem: use **Anterior / Próxima**, ou PageUp / PageDown, para ler as páginas. O tamanho da janela e a fonte ampliada determinam quantas páginas são necessárias. Áudio e vibração não são necessários para compreender os resultados.

A trilha usa **eletrônica com groove brasileiro a 112 BPM**: baixo sincopado, bumbo encorpado, palmas, shaker e tamborim sintetizados, em quatro variações para abertura, entregas, cobrança e fim do turno. O tema do jogo permanece reconhecível. Arranjo, fontes e verificação em `docs/BATIDA-ELETRONICA.md`.

O som vem ligado por padrão e começa na primeira interação com o jogo, como **Abrir o arquivo**, respeitando a permissão de reprodução do navegador. Logo abaixo de **ARQUIVO DAS ESCOLHAS**, o botão **Desativar som / Ativar som** controla música e efeitos juntos e permanece visível durante a navegação. Desligar o som preserva o volume e as escolhas individuais de música/efeitos; essa preferência fica salva neste navegador. Ativar recupera o volume padrão se estiver em zero e liga os dois canais caso ambos estivessem desmarcados. Nas configurações e na pausa, a música continua pausada. O status informa bloqueios ou falhas de carregamento. Consulte `docs/CORRECAO-SOM.md` para a verificação.

## Entrega e manutenção

- Fonte canônica: `web/`.
- Pasta de publicação: `Entrega/netlify/`, com `index.html` na raiz.
- ZIP: `Foi_Voce_Que_Escolheu_Netlify.zip` na raiz do projeto.
- Gerar novamente: `node scripts/empacotar.cjs` (Node.js e PowerShell; sem dependências npm).
- Recriar os áudios: `node scripts/compor-audio.cjs`, depois empacotar.
- Testes do motor: `node tests/motores.cjs`.
- Testes de navegador: `npm ci`, iniciar o servidor e executar os scripts `tests/navegador.cjs`, `tests/robustez.cjs`, `tests/rotas.cjs` e `tests/pwa.cjs`. Usam Chrome instalado no caminho documentado nos scripts. `?teste=1` habilita acesso ao estado para testes; não altera o funcionamento da partida. `?ensaio=1` é o modo legado sem persistência.

O script `scripts/integrar.cjs` registra a transformação inicial da base e **não deve ser reaplicado** à versão atual. A manutenção é feita nos arquivos de `web/`.

## Conferir esta edição

Com Node.js e npm instalados:

```sh
npm ci
npx playwright install chromium webkit
node scripts/servir.cjs web 4180
```

Em outro terminal: `npm run test:portfolio`, `npm run test:mobile` e `npm run test:botoes`. `npm test` verifica as regras e os caminhos narrativos sem navegador. No Windows, os testes usam o Chrome instalado quando disponível; `CHROME_PATH` permite escolher outro executável. Nos demais ambientes, usam o Chromium do Playwright. A execução desta edição foi validada no Windows, não em todos os sistemas operacionais.

Para gerar a distribuição no Windows: `npm run package`, seguido de `npm run verify:release`. O verificador confere a lista completa de arquivos, os hashes e o manifesto offline. A geração do ZIP usa PowerShell. A publicação via Git/Netlify serve `web/` diretamente e não exige o ZIP.

Para conferir instalação e reabertura sem rede em um endereço publicado: definir `GAME_URL` para esse endereço e executar `npm run test:pwa-publicacao`. Esse teste usa um perfil isolado, prepara o cache completo e confere o menu e a introdução offline. O download inicial completo tem aproximadamente 46 MiB; atualizações reutilizam recursos já verificados.

Consulte `docs/PUBLICACAO.md`, `docs/CONSEQUENCIAS.md`, `docs/AUDIO-E-CREDITOS.md`, `docs/VERIFICACAO.md` e `docs/DEMONSTRACAO.md`. Os documentos HTML antigos em `Entrega/` são evidências históricas da Visual 1.2; não descrevem esta atualização nem entram no pacote publicado. A consolidação aprovada foi preservada sem alterações. O mapa final da jornada permanece uma etapa posterior.

A atualização de navegação, reset e animação está documentada em docs/NAVEGACAO-E-INTRODUCAO.md. Testes específicos: node tests/paginas.cjs, node tests/fluxos-paginados.cjs e node tests/introducao.cjs (servidor local na porta 4180 ou variável GAME_URL).

Compatibilidade com Chrome/Android e Safari/iOS: consulte docs/COMPATIBILIDADE-MOBILE.md. A atualização respeita áreas seguras, teclado e zoom, mantém controles alternativos aos sensores e informa quando a vibração não está disponível.
