# Publicação estática no Netlify

## Envio manual

1. Extraia `Foi_Voce_Que_Escolheu_Netlify.zip`, na raiz do projeto.
2. Use a pasta extraída cujo `index.html` aparece diretamente na raiz. Também é possível enviar diretamente `Entrega/netlify`.
3. No Netlify, para atualizar um site existente, abra **esse mesmo projeto** e use a área de deploys para o envio manual da pasta. Não crie outro endereço para cada versão.

O ZIP não inclui `netlify.toml`: ele já é a raiz pública completa. Não envie a pasta inteira do projeto, `Entrega/` inteira, testes, backups ou `node_modules`.

## Integração Git

O `netlify.toml` na raiz configura `publish = "web"` e `command = ""`. Diretório-base: raiz do repositório. **Sem comando de build**. Os arquivos estáticos, incluindo áudio e o service worker gerado, já existem em `web/`. O pacote npm contém somente a ferramenta de testes e não é necessário para executar o site.

O jogo usa estado interno, sem rotas de SPA; não há redirecionamento genérico para encobrir arquivos ausentes. `_headers` vai na pasta pública. HTML e service worker pedem revalidação; não foram adicionadas políticas que bloqueiem inclinação ou áudio. `.gitattributes` conserva os bytes de `web/**` entre Windows e Linux, evitando que a conversão de quebras de linha invalide os hashes do cache.

Para gerar a distribuição no Windows, execute `node scripts/empacotar.cjs` na raiz. O script recalcula hashes SHA-256, gera o service worker, copia `web/` para `Entrega/netlify/` e compacta seu conteúdo na raiz do ZIP. Não execute duas cópias do empacotador ao mesmo tempo. O manifesto de integridade está em `docs/manifesto-entrega.json`.

## Atualização e progresso

O cache instala o conjunto completo conferindo seus hashes antes de ativar. Atualizações aguardam o fechamento das janelas que usam a versão antiga. O progresso usa a chave estável `fvqe-entregador-v1`, com formato versionado 2, separado do cache. Saves antigos de formato 1 são migrados por reconstrução do motor legado, sem efeitos transitórios. Registros incompatíveis ficam preservados e podem ser exportados; Nova partida oferece confirmação e guarda uma cópia recuperável quando o armazenamento permite.

Não troque de origem esperando que `localStorage` acompanhe a mudança. Atualizar o mesmo site conserva o armazenamento; a migração de formato é responsabilidade do jogo. Limpar dados do site apaga também o progresso.

O site atual é https://foivocequeescolheu.netlify.app/, atualizado pela branch `codex/atualizacao-completa`. O painel do Netlify confirmou o vínculo com este repositório. O endereço anterior `thunderous-eclair-21ac61.netlify.app` deixou de responder. A configuração de visibilidade não foi alterada.

Na conferência de produção em 12/11/2026, o Netlify acrescentou ao HTML um comentário da hospedagem e um script de identificação pública. A verificação do service worker reconhece exclusivamente esses dois trechos conhecidos em `index.html`, em origens `.netlify.app`, antes de comparar o SHA-256 com a fonte. Todo o conteúdo do jogo continua verificado; o cache guarda a resposta original com a identificação do provedor. Marcação desconhecida ou alteração em código permanece rejeitada. O identificador do cache inclui também o código do service worker, para que uma correção de instalação não reutilize o cache da versão anterior. Teste específico: `node tests/integridade-host.cjs`.

A documentação do Netlify descreve a [identificação pública e a inserção de conteúdo pela hospedagem](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/). Essa adição explica a diferença de bytes no HTML servido; scripts, estilos e demais recursos devem corresponder diretamente ao manifesto.

Referências consultadas: [configuração oficial do Netlify](https://docs.netlify.com/build/configure-builds/overview/), [orientação de dispositivo — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Detecting_device_orientation) e [vibração — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate).
