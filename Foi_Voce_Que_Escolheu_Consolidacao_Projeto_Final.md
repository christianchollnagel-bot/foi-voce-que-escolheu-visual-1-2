# FOI VOCÊ QUE ESCOLHEU — CONSOLIDAÇÃO COMPLETA DO PROJETO FINAL

Projeto Inovação Chris 2026/2  
Responsável acadêmico: **Christian Cândia Hollnagel**  
Disciplina: **Design de Produtos com Tecnologia Embutida — SMART**  
Professor: **Roberto Tietzmann**  
Data da consolidação: **12 de novembro de 2026**  
Natureza deste documento: escopo aprovado, direção criativa e especificação para desenvolvimento.

Este texto reúne as decisões e propostas discutidas para concluir o projeto final do jogo **Foi Você Que Escolheu**. Por determinação expressa do usuário, **todas as propostas compatíveis com as decisões mais recentes estão aprovadas**. Decisões posteriores substituem versões anteriores quando houver conflito. Assim, o jogo **terá salvamento para continuar depois**, **não terá uma camada de IA durante a partida** e **usará “você” em seus diálogos**.

A aprovação define o trabalho a realizar. Não significa que os recursos descritos já foram implementados, que os áudios já foram produzidos ou que o jogo já foi publicado e testado com pessoas. Esta consolidação não modifica o código nem substitui a entrega final por documentação.

## 1. Identidade, finalidade e separação dos trabalhos

O projeto final é **Foi Você Que Escolheu**, um jogo narrativo de entregas, encontros e decisões. O jogador ocupa o lugar de um entregador que circula pelo universo de **O Arquivo das Escolhas**, conhece personagens, resolve situações e convive com o que suas próprias decisões provocam. O nome precisa ser percebido no funcionamento: a partida deve fazer o jogador reconhecer que determinada situação existe porque ele escolheu agir de determinada maneira.

As atividades 4 e 5 da disciplina pertencem a outro trabalho. Elas tratam da criação e do aprofundamento de uma ferramenta para designers, discutida separadamente como **Craft Brand**. Seus requisitos, telas e funcionalidades não devem ser incorporados automaticamente ao jogo. Esta consolidação concentra-se no projeto final.

O trabalho acadêmico e seus materiais de identificação devem trazer **Christian Cândia Hollnagel**, com essa grafia e acentuação. A identificação como responsável acadêmico deve permanecer distinta dos créditos de ferramentas, materiais de terceiros, produção assistida por IA e demais participações que efetivamente ocorrerem.

O produto deve ser apresentado como **Foi Você Que Escolheu**. O episódio especial da portaria, **O nome no recibo**, integra a base analisada; ele não substitui o título do jogo nem passa a representar sozinho todo o projeto.

## 2. Base de desenvolvimento e situação de partida

A base escolhida é a pasta **V1_WebApp_PWA_Visual_v1_2**, indicada pelo usuário neste caminho:

```text
C:\Users\holln\OneDrive\Anexos de email\Área de Trabalho\V1_WebApp_PWA_Visual_v1_2
```

Essa versão é o **ponto de partida do desenvolvimento**, não a entrega final pronta. A existência de outras versões anteriores, de pastas chamadas V_FINAL ou de documentação produzida em outras etapas não altera essa escolha.

A cópia do ZIP examinada nesta conversa contém uma estrutura já desenvolvida: doze capítulos, organização em três atos, uma visita especial à portaria, abertura, instruções, personalização do jogador, cenas de decisão, respostas, desfechos, consulta ao histórico e materiais técnicos. O objetivo é evoluir essa base aproveitando o conteúdo e a identidade existentes.

Na versão examinada, o motor principal utiliza condições simples, como preparação, constrangimento, conferência e sucesso ou fracasso. Algumas decisões já alteram cenas e resultados. O especial da portaria também considera o que personagens sabem e escolhe iniciativas por regras. A principal ampliação aprovada é **transportar consequências relevantes entre entregas e encontros**, dando continuidade às relações e aos acontecimentos.

O código analisado já utilizava respostas previamente escritas e regras locais; não foram identificadas chamadas a uma IA generativa durante a partida naquela cópia. Portanto, remover a camada de IA significa abandonar a expansão generativa anteriormente cogitada e manter a implementação final livre dessa dependência. Não é necessário eliminar a memória e as regras de comportamento que sustentam a narrativa.

A inspeção realizada refere-se à cópia disponível do ZIP. Ela não equivale a uma auditoria de alterações posteriores feitas em outra máquina ou no repositório. Antes de implementar, deve-se conferir o estado real da cópia de trabalho, preservar o que já funciona e manter as mudanças rastreáveis.

## 3. Objetivo central da experiência

A meta declarada é **divertir o jogador e fazer com que ele queira passar mais tempo tomando escolhas e rindo entre as entregas**. Esse objetivo deve orientar a escrita, a organização das cenas, a interação, o som e as consequências.

O tempo de jogo deve crescer pelo interesse nas situações, pela curiosidade sobre os personagens, pela variedade de respostas e pelo desejo de descobrir o que acontece depois. Não deve depender de atrasos artificiais, repetição de telas ou excesso de leitura sem participação.

Cada entrega precisa oferecer um pequeno problema compreensível: alguém espera um pacote, uma informação precisa chegar à pessoa certa, um recibo precisa ser assinado ou uma situação exige cuidado. Ao redor desse objetivo aparecem as relações, as pressões, as tentativas de economizar trabalho, as desculpas, os favores e os mal-entendidos.

O jogador deve conseguir entender o que pretende fazer, tomar uma decisão e perceber alguma resposta. Em seguida, a história pode revelar uma complicação, abrir uma oportunidade ou guardar uma consequência para outro momento. A alternância entre decisão, reação, descoberta e nova decisão constitui o ritmo principal.

## 4. O que conta como consequência real

Uma consequência real altera algo que o jogador encontrará ou poderá fazer depois. Pode modificar uma relação, mudar a disponibilidade de ajuda, criar uma obrigação, revelar uma informação, alterar o estado de uma encomenda ou abrir uma situação adicional.

Trocar apenas a frase exibida após um clique não é suficiente para cumprir esse objetivo quando todas as condições seguintes permanecem idênticas. As respostas textuais devem acompanhar mudanças narrativas e, nos pontos importantes, mudanças no estado da partida.

As consequências aprovadas se organizam em três escalas:

| Escala | Funcionamento esperado | Exemplo de aplicação |
|---|---|---|
| Imediata | A pessoa reage à decisão e a cena muda. | O porteiro aceita guardar a caixa, exige um nome ou recusa a responsabilidade. |
| Dentro da entrega | Uma ação anterior altera uma possibilidade posterior. | Conferir o destinatário permite corrigir uma assinatura antes do encerramento. |
| Entre entregas | A decisão acompanha o jogador em outro encontro. | Um favor permite pedir ajuda; uma mentira provoca uma cobrança quando a pessoa reaparece. |

As principais famílias de consequência são confiança, favores, promessas, segredos, rumores, constrangimentos, acesso a informações, acesso a alternativas, condições das encomendas e resultados do turno. Elas não precisam aparecer como números na interface. O jogador pode percebê-las pela forma como é recebido, pelas opções que surgem e pelo que os personagens lembram.

As escolhas devem apresentar vantagens e custos situacionais. Um atalho pode resolver um problema e criar uma obrigação. Uma atitude cuidadosa pode preservar a confiança e, ao mesmo tempo, envolver uma conversa adicional. A alternativa mais responsável também deve produzir cenas interessantes; o jogo não deve reservar todo o humor à mentira ou à sabotagem.

Nem toda decisão precisa alterar todos os capítulos. A implementação pode fazer caminhos voltarem a se encontrar, desde que preserve diferenças relevantes de estado, tratamento, informação ou consequência. Isso mantém o escopo administrável e evita que as escolhas se tornem apenas decorativas.

## 5. Continuidade, memória e circulação de informações

O estado da partida deve registrar o que aconteceu e quem teve acesso a cada informação. É importante distinguir o fato ocorrido, o que o jogador sabe, o que cada personagem testemunhou, aquilo que ouviu de outra pessoa e uma eventual versão distorcida do acontecimento.

Um personagem não deve cobrar uma mentira que não teve como conhecer. Se uma notícia circulou pelo bairro, a narrativa precisa oferecer uma ponte compreensível: alguém ouviu a conversa, comentou no balcão, enviou uma mensagem ou encontrou outro personagem. A surpresa pode estar no momento em que a informação reaparece, mas deve haver coerência na forma como ela chegou até ali.

Para orientar a implementação, cada decisão relevante deve poder ser descrita pelos seguintes elementos:

| Elemento | O que registrar |
|---|---|
| Situação de origem | Entrega, cena e contexto em que a escolha aconteceu. |
| Ação do jogador | O que ele fez ou declarou. |
| Resultado imediato | O que mudou naquele momento. |
| Pessoas envolvidas | Quem presenciou, recebeu informação ou foi afetado. |
| Memória criada | Fato, promessa, favor, mentira ou impressão que poderá voltar. |
| Efeito futuro | Qual cena, reação ou opção pode ser alterada. |
| Condição de retorno | Em que circunstância a consequência reaparece. |
| Registro no salvamento | Dados necessários para preservar tudo isso ao continuar a partida. |

As relações devem ser específicas. O porteiro pode desconfiar do entregador enquanto Isaura continua disposta a ajudá-lo. Uma reputação geral pode existir se for útil, mas não deve apagar as diferenças entre os personagens.

O histórico precisa ajudar o jogador a recuperar o que fez. Consultar esse histórico não equivale a desfazer decisões. A possibilidade de salvar e continuar também não introduz automaticamente um comando para reescrever escolhas já confirmadas.

## 6. Erros, vitória, derrota e continuidade da diversão

O erro deve ter consequência, mas pode produzir uma situação jogável. Uma entrega atrapalhada pode exigir negociação, pedido de desculpas, reparo ou uma explicação embaraçosa. O jogador pode perder o objetivo daquela entrega e ainda encontrar conteúdo interessante depois.

Isso não significa garantir que qualquer erro será desfeito sem custo. Algumas consequências podem permanecer. O importante é que o jogo explique o resultado e preserve uma experiência interessante, evitando que toda falha leve ao mesmo bloqueio ou à repetição integral de uma sequência longa.

Sucesso e fracasso precisam ser definidos pelo objetivo da situação. Uma cena engraçada não é automaticamente uma vitória; uma conversa séria não é automaticamente uma derrota. A classificação usada pelos sons e pelo resultado visual deve corresponder ao que efetivamente ocorreu.

O encerramento de uma entrega pode combinar informações: o pacote chegou, mas uma promessa ficou pendente; a encomenda não foi entregue, porém uma relação foi preservada; o jogador resolveu o problema, mas passou vergonha. A indicação principal deve continuar clara, e o texto pode explicar essas nuances.

Ao final do turno, o balanço deve recuperar acontecimentos concretos da partida. Ele precisa mostrar o que deu certo, o que ficou complicado, quem ajudou, quem passou a desconfiar e quais escolhas produziram momentos marcantes. Deve haver reconhecimento do percurso jogado, não apenas uma mensagem genérica.

## 7. Exemplos de situações narrativas aprovadas como direção de desenvolvimento

Os exemplos abaixo pertencem ao repertório aprovado de situações e mecanismos. Sua adaptação ao roteiro deve respeitar os personagens, os fatos e os pontos de entrada disponíveis na base. Eles não são descrições de cenas já implementadas.

**A marmita “desconstruída”.** Uma encomenda chega desarrumada e o jogador decide apresentá-la como uma versão especial do prato. O cliente pode aceitar a explicação, mas recomendar a suposta novidade. Em outro encontro, alguém pede essa mesma especialidade. O jogador precisa decidir se sustenta a história, esclarece o engano ou pede ajuda à pessoa responsável pela comida. O humor reaparece porque a primeira desculpa mudou a expectativa de outra pessoa.

**O parentesco inventado.** Para facilitar uma passagem, o entregador afirma ser parente da síndica. O porteiro lembra dessa informação. Mais tarde, ao reencontrá-lo, avisa que a “tia” está descendo. A história cria uma nova escolha: confessar, tentar explicar a confusão ou sustentar a mentira. O efeito não pode surgir se o jogador nunca fez essa afirmação.

**O favor cobrado.** O entregador aceita uma pequena ajuda para resolver uma entrega. Em outro momento, a pessoa lembra o favor e pede uma contrapartida. O jogador pode retribuir, negociar ou recusar, e a relação deve reagir a essa decisão.

**A informação que virou fofoca.** Uma observação feita em público circula de forma incompleta. A versão que chega ao próximo personagem mistura um fato verdadeiro com uma interpretação errada. O jogador pode corrigir a história, aproveitar o mal-entendido ou descobrir quem a espalhou. A circulação precisa ter uma origem identificável dentro da narrativa.

**A ajuda sincera.** Um personagem percebe que o entregador está cansado e oferece comida, um lugar para apoiar a caixa ou uma informação útil. Esse tipo de cena dá variedade emocional ao turno. Nem toda interação precisa ser uma disputa ou terminar em uma frase de efeito.

## 8. Funcionamento sem IA durante a partida

Está aprovada a retirada da camada de IA do funcionamento do jogo. A versão final não dependerá de chamadas a modelos de linguagem para gerar falas, escolher consequências ou permitir que a partida avance. Também não deve substituir essa dependência por um modelo local oculto.

A escrita será previamente produzida e revisada. Durante a execução, o jogo selecionará falas, cenas e alternativas por regras relacionadas ao estado da partida. Os personagens poderão lembrar, reagir, tomar iniciativas e mudar de atitude por meio dessas regras.

As variações de resposta podem considerar a relação com o jogador, o que foi prometido, quem está presente, o estado da entrega e a informação disponível. Se houver sorteio entre falas equivalentes, ele deve preservar os fatos e ser controlado para que o salvamento não transforme uma resposta já estabelecida em outra contraditória.

As decisões importantes devem ser explicáveis pelo estado do jogo. A equipe deve conseguir identificar qual escolha criou uma memória, qual condição abriu uma cena e por que determinado personagem reagiu daquela forma.

A IA continuará podendo apoiar o desenvolvimento: planejamento, organização do roteiro, alternativas de diálogo, programação, revisão, produção de materiais e verificação. Os créditos devem informar as contribuições que realmente ocorreram. A apresentação acadêmica deve distinguir esse uso no processo de criação do comportamento programado do produto.

## 9. Linguagem e identidade dos diálogos

A linguagem aprovada é brasileira, coloquial e próxima da fala cotidiana, com inspiração no ritmo dos diálogos de novelas dos anos 2000 e 2010. Deve haver personalidade, humor, provocação, indiretas, fofoca, respostas atravessadas, negociação e espaço para afeto.

O pronome utilizado será **“você”**. Os diálogos originais e os textos dirigidos ao jogador não devem usar “tu”. Na revisão, também convém substituir “teu” e “tua” por “seu” e “sua” ou reescrever a frase para manter o tratamento escolhido e evitar ambiguidades.

“Você” não precisa aparecer em toda fala. Sujeitos podem ficar implícitos quando a frase soa natural. Expressões como “tá”, “tô”, “pra”, “olha só”, “qual é?”, “me explica isso” e “pelo amor de Deus” podem entrar conforme a voz do personagem. A oralidade deve preservar a leitura fácil no celular.

Cada personagem precisa de um repertório próprio. Um pode falar pouco e cobrar detalhes; outro inventar justificativas compridas; outro oferecer ajuda enquanto reclama; outro tentar parecer mais importante do que é. Idade, ocupação, proximidade, contexto e personalidade devem influenciar a fala sem reduzir ninguém a uma coleção de gírias.

O humor deve partir da situação. A pessoa comenta a assinatura errada, o pacote amassado, a promessa esquecida ou a desculpa que acabou de ouvir. Uma resposta deve aproveitar algo da fala anterior e fazer a conversa avançar. As piadas podem surgir de exagero, contradição, repetição com mudança de sentido, falsa gentileza ou de uma informação que volta na hora errada.

Também deve haver frases simples de preocupação, acolhimento, desapontamento e gratidão. Esses momentos ajudam a construir relações e dão contraste aos episódios mais expansivos. A linguagem de rua pretendida não obriga todos os personagens a gritar, ofender ou fazer piada o tempo inteiro.

## 10. Referências de novelas e aplicação ao jogo

O estudo realizado nesta conversa utilizou falas publicadas, descrições de cenas e perfis em fontes da Globo. Não foi apresentado como visualização integral de capítulos nem como análise de entonação a partir de vídeos assistidos. As relações entre as referências e o jogo são interpretações de escrita e direção narrativa.

| Referência | Mecanismo observado | Direção aprovada para o jogo |
|---|---|---|
| Senhora do Destino, 2004 | Autoimagem e vocabulário ajudam a identificar Nazaré e Giovanni. | Criar maneiras próprias de falar, com vaidade, tentativa de impressionar ou autoconfiança conforme o personagem. [R1–R2] |
| Cobras & Lagartos, 2006 | Um engano mantido transforma relações e cria possibilidades de pressão sobre quem esconde a verdade. | Fazer mentiras e omissões atravessarem encontros. A fonte consultada aqui sustenta principalmente a estrutura narrativa. [R3] |
| Ti-ti-ti, 2010 | Ariclenes e Jacques usam fatos do passado como material para provocações e respostas. | Fazer o histórico compartilhado alimentar o humor e as cobranças. [R4] |
| Avenida Brasil, 2012 | Monalisa e Olenka permitem observar confiança abalada, reconciliação e afeto expresso por meio de reclamação. | Construir personagens que possam discutir e continuar ligados por carinho e história em comum. [R5–R6] |
| Cheias de Charme, 2012 | A tentativa exagerada de agradar produz um desastre concreto e reações diferentes de cada pessoa envolvida. | Usar encomendas e tarefas como centro de confusões, com vozes distintas para quem promete, exige e tenta resolver. [R7] |
| Totalmente Demais, cenas de 2016 | Frases curtas e complementos sucessivos alteram a força e o sentido de uma cobrança. | Escrever respostas diretas, com cortes e pequenas reformulações que revelem a relação. [R8] |
| Pega Pega, 2017 | Expectativas de atendimento entram em conflito com a necessidade de quem trabalha de concluir o serviço. | Explorar a dinâmica entre cliente, entregador, porteiro e pessoas que interrompem a tarefa. [R9] |

As referências principais para a conversa cotidiana são **Avenida Brasil, Ti-ti-ti e Pega Pega**. **Cheias de Charme** orienta situações mais exageradas. As demais enriquecem a individualidade das vozes, a continuidade das mentiras e a construção das respostas.

Não serão importados diálogos extensos, personagens ou bordões reconhecíveis como substitutos de escrita própria. A contribuição das referências está nos mecanismos dramáticos e no ritmo. Os diálogos do jogo serão originais.

## 11. Exemplos de voz e direção de escrita

Os exemplos seguintes são originais e foram desenvolvidos como referência de tom. A continuidade do roteiro determinará seu encaixe.

**Memória e consequência**

> Porteiro: Você disse ontem que era sobrinho da síndica.  
> Entregador: E hoje eu vim entregar uma encomenda.  
> Porteiro: Pois espera. Sua tia tá descendo.

O porteiro usa uma informação que recebeu antes. A fala é curta, cria humor e abre um problema que o jogador terá de enfrentar.

**Afeto e pragmatismo**

> Isaura: Comeu alguma coisa hoje?  
> Entregador: Ainda não.  
> Isaura: Senta ali. E larga essa caixa da cadeira, que eu perguntei de você.

A personagem demonstra cuidado e mantém uma voz prática. A cena permite que o jogador se relacione com alguém sem que exista necessariamente uma armadilha.

**Cobrança de atendimento**

> Cliente: Eu pedi almoço, meu filho. Isso aqui já virou janta.

A reclamação está ligada ao objetivo da entrega e ao que aconteceu. A frase deve ser reservada a uma situação em que o atraso exista na narrativa.

**Improviso do entregador**

> Entregador: Tá tudo sob controle. Só não me pergunta de quem.

Esse tipo de resposta funciona quando o personagem tenta manter a pose diante de uma complicação. Não deve virar uma resposta genérica repetida em qualquer cena.

A revisão de diálogo deve verificar clareza, intenção, naturalidade, tratamento por “você”, diferença entre vozes, continuidade dos fatos e relação com a próxima escolha. A leitura em voz alta pode ajudar a localizar frases que parecem escritas para um relatório, embora o produto não precise ter dublagem.

## 12. Fluxo geral de jogo e experiência de uso

O fluxo deve aproveitar a estrutura existente e tornar clara a progressão entre abertura, menu, personalização, instruções, entrega, consequência, resultado e continuação. O jogador precisa reconhecer onde está, o que pode fazer e quando uma decisão foi confirmada.

O menu deverá oferecer acesso compreensível a **Nova partida**, **Continuar partida**, instruções, configurações e créditos. A forma exata de organizar esses elementos pode respeitar a interface existente, desde que a opção de continuar seja visível quando houver progresso válido.

Durante uma entrega, o objetivo e a situação devem ser apresentados em linguagem curta e concreta. As alternativas precisam representar ações identificáveis. Deve ser possível distinguir, por exemplo, admitir um erro, sustentar uma versão, pedir ajuda ou conferir uma informação. A intenção imediata da alternativa deve ser clara, mesmo quando o jogador ainda não conhece todas as consequências.

As falas devem chegar em blocos legíveis no celular, com espaço para as ações. O jogador deve controlar o avanço da leitura. O ritmo de uma conversa pode ser ágil sem impor contagem regressiva aos diálogos. Não foi definido um tempo limite geral para escolher.

O jogo deve continuar oferecendo consulta ao histórico quando isso ajudar a compreender o percurso. A leitura do histórico e a entrada nas configurações não devem alterar resultados. Voltar de uma tela auxiliar precisa devolver o jogador ao estado correto.

A identidade visual, os personagens, a personalização e os recursos já existentes devem ser aproveitados. Esta consolidação não autoriza interpretar o novo tom de diálogo como um pedido de reconstrução completa da arte ou de substituição do elenco.

## 13. Uso de sensores nas entregas

Está aprovada a aplicação dos aprendizados sobre sensores no projeto final. A interação escolhida na proposta é **usar a inclinação do celular para equilibrar encomendas em pequenos trechos de transporte**.

Esses trechos devem aparecer como parte do trabalho do entregador. A situação pode envolver uma pilha de caixas, marmitas ou outra carga coerente com o roteiro. Antes de transportar, o jogador poderá escolher uma estratégia, como levar tudo junto, dividir a carga ou improvisar um apoio. A estratégia deverá influenciar a situação de forma compreensível.

O resultado físico deve entrar na narrativa. Uma encomenda preservada, um pacote que bateu ou uma carga que se desorganizou pode alterar a recepção, as opções de explicação e o resultado da entrega. O trecho de sensor deve contribuir para o mesmo sistema de consequências que sustenta as conversas.

A interação será breve e terá instrução contextual. O jogador deve entender o movimento esperado e contar com uma posição inicial de referência confortável. A leitura do sensor precisa ser tratada para evitar que pequenas oscilações involuntárias produzam punições desproporcionais.

Haverá alternativa por **toque ou teclado**, com as mesmas possibilidades narrativas. Ausência de sensor, recusa de acesso ou escolha de outro controle não pode determinar automaticamente uma derrota. A alternativa também permite jogar no computador.

No navegador, os eventos de orientação dependem do suporte do dispositivo e de contexto seguro; alguns ambientes exigem uma solicitação de acesso iniciada por uma interação do usuário. A implementação deve detectar esses casos e explicar o uso do movimento apenas quando ele for necessário. Não deve presumir que todos os celulares responderão da mesma forma. [T1]

Na documentação acadêmica, será feita a distinção correta: **inclinação é uma entrada obtida de sensores; vibração é uma saída tátil produzida por um atuador**. Os dois recursos podem trabalhar juntos, mas têm funções diferentes.

## 14. Vibração obrigatória ao concluir uma entrega

O pedido confirmado é que **o telefone vibre quando uma entrega for finalizada** e que existam **sons diferentes quando o jogador ganha e perde**. Esse conjunto constitui o feedback principal de conclusão.

Ao revelar o resultado, o jogo deve coordenar a indicação visual, o texto, o som correspondente e a vibração disponível. O jogador precisa perceber que a entrega terminou e compreender seu resultado, mesmo que esteja com o som ou a vibração desligados.

Cada conclusão deve gerar seu feedback **uma única vez**. O evento não pode disparar novamente por causa de um clique repetido, de uma nova renderização da tela, da consulta ao histórico ou da restauração de um salvamento.

Os ritmos aprovados como ponto de partida são:

| Resultado | Vibração | Som | Informação visual |
|---|---|---|---|
| Entrega bem-sucedida | Dois pulsos curtos. | Vinheta curta de vitória. | Resultado positivo e explicação do que foi alcançado. |
| Entrega malsucedida | Um pulso um pouco mais longo, ainda breve. | Vinheta curta de derrota com tratamento cômico. | Resultado negativo e explicação do problema. |

Os tempos exatos dos pulsos são parâmetros de implementação a ajustar no aparelho real. O objetivo é produzir padrões distintos e confortáveis. A duração maior do segundo padrão não significa controlar a força do motor.

Quando o recibo carimbado for a representação visual da conclusão, o carimbo e o resultado devem compor um único evento de feedback. Não serão somadas duas vibrações de conclusão só porque existem dois elementos visuais na mesma transição.

## 15. Demais usos aprovados de haptics

Além da conclusão, estão aprovadas as opções de vibração discutidas para reforçar acontecimentos da história. Sua presença deve depender da cena e do contexto, sem transformar cada toque de interface em uma vibração.

| Evento | Padrão e sincronização | Finalidade | Condição de uso |
|---|---|---|---|
| Recibo carimbado | Pulso seco no contato do carimbo. | Dar sensação física ao fechamento burocrático da entrega. | Integrar ao feedback de resultado quando coincidirem. |
| Mensagem da central | Sequência curta reservada às mensagens. | Fazer o telefone real acompanhar o telefone do entregador. | Mostrar a mensagem na tela; a vibração não substitui seu conteúdo. |
| Consequência de escolha anterior | Pulso curto quando a consequência é revelada. | Destacar a ligação entre o que foi escolhido e o que voltou a acontecer. | Acionar depois da revelação, sem indicar antecipadamente uma resposta “certa”. |
| Encomenda bate ou cai | Pulso pontual no impacto. | Ligar movimento, efeito sonoro e resultado físico. | Usar nos trechos de transporte pertinentes e evitar repetição contínua. |
| Batidas na porta | Dois ou três pulsos sincronizados com as batidas. | Acrescentar presença e participar do ritmo de uma cena. | Reservar às situações de porta ou portaria em que o evento exista. |

O conjunto deve formar uma linguagem consistente. Se uma sequência representa uma mensagem, não deve ser reutilizada sem motivo para indicar uma derrota. A quantidade de padrões deve continuar pequena o suficiente para não se tornar um código que o jogador precise estudar.

A configuração aprovada inclui **Desligada**, **Somente resultados** e **Todos os efeitos**. O modo de resultados mantém a vibração pedida para as conclusões; o modo completo inclui os acontecimentos adicionais. O jogador deve poder alterar essa preferência sem reiniciar.

A vibração deve parar quando a partida for interrompida ou a página deixar de estar ativa. Eventos concorrentes precisam ser organizados para que um efeito secundário não interrompa indevidamente a conclusão principal. Cliques rápidos não devem empilhar pulsos e sons.

É necessário avaliar o uso de vibração durante a leitura de movimento: o próprio motor do telefone pode interferir na sensação física e, dependendo da situação, nos dados do sensor. O efeito deve ser pontual e não transformar um aviso em causa de falha no transporte.

A API de vibração do navegador trabalha com intervalos de duração e pausa, não com controle fino de amplitude. O suporte e o efeito percebido variam entre aparelhos, navegadores e configurações do sistema. Portanto, a especificação descreve a intenção do feedback; sua percepção precisa ser conferida fisicamente. [T2]

## 16. Direção musical e identidade sonora

A trilha aprovada segue a ideia de **comédia urbana instrumental**, com uma identidade que combine movimento, esperteza, pequenos imprevistos e personagens que convivem no mesmo universo.

A paleta sugerida e aprovada reúne **baixo saltitante, piano com frases curtas, percussão discreta e pequenos timbres de madeira**. A música deve ter personalidade sem disputar a atenção com a leitura. O humor pode aparecer na forma de uma frase que hesita, se interrompe ou responde a outra, assim como acontece nos diálogos.

Será composto um motivo reconhecível para o jogo. Esse motivo poderá aparecer na abertura, nas entregas, nas confusões, nos resultados e no fim do turno. As variações devem preservar uma identidade comum, em vez de transformar cada tela em um ambiente musical sem relação com o anterior.

As peças serão instrumentais. Não há necessidade de letra ou dublagem para cumprir o escopo aprovado. A decisão ajuda a manter a prioridade dos diálogos escritos e o funcionamento em celulares.

A música deve respeitar o que o jogador já sabe. Uma escolha ambígua não pode ser denunciada por um acorde de ameaça antes de sua consequência aparecer. O acompanhamento reage ao estado revelado da história e ao resultado das ações.

Momentos de cuidado, frustração ou vulnerabilidade podem reduzir a densidade musical e dar espaço à cena. Mesmo em um jogo de humor, a trilha não precisa transformar todo acontecimento em uma piada.

## 17. Conjunto de peças musicais aprovado

Os nomes abaixo funcionam como títulos de trabalho para organizar a produção. O conjunto combina quatro contextos de acompanhamento e duas vinhetas de resultado.

| Peça | Função | Direção musical | Comportamento esperado |
|---|---|---|---|
| **O turno começou** | Abertura e apresentação da identidade. | Tema principal simpático, com motivo reconhecível e pulso convidativo. | Iniciar após interação adequada e reduzir ao entrar na partida. |
| **Era só entregar** | Acompanhar o percurso e as entregas. | Versão mais discreta do tema, sustentada por baixo e percussão leve. | Permitir repetição sem emenda perceptível e reduzir densidade durante leitura prolongada. |
| **Agora explica** | Acompanhar uma confusão já revelada. | Respostas curtas do piano, pequenas interrupções e mudanças rítmicas controladas. | Entrar quando a situação justificar e sair quando o contexto mudar. |
| **Vitória** | Marcar a entrega bem-sucedida. | Frase curta que conclui o motivo principal de forma reconhecível. | Tocar uma vez, coordenada com a tela de resultado e a vibração. |
| **Derrota** | Marcar a entrega malsucedida. | Frase que tenta concluir e termina de maneira inesperada, com humor. | Tocar uma vez e deixar espaço para a reação do personagem. |
| **Fim do turno** | Acompanhar o balanço da partida. | Retorno do tema com variações relacionadas ao percurso. | Apoiar a leitura do resumo e terminar ou repetir suavemente conforme a tela. |

A quantidade de arquivos técnicos pode ser maior que a quantidade de peças: uma composição pode precisar de introdução, corpo repetível, saída, variação e camadas separadas. Isso não altera o conjunto conceitual aprovado.

As transições precisam ser compostas e verificadas. Duas peças não se encaixam automaticamente só por terem o mesmo andamento ou tonalidade. O arranjo deve prever sobreposição, pausa, corte ou passagem quando necessário.

Uma reação importante pode receber um efeito pontual imediato enquanto a música muda no próximo ponto adequado. Isso permite dar resposta rápida ao jogador e preservar a continuidade musical.

## 18. Efeitos sonoros e relação com a interface

Os sons de vitória e derrota são obrigatórios. Os demais efeitos aprovados acompanham os eventos já definidos: carimbo, mensagem da central, batidas na porta, contato ou queda da encomenda e elementos pontuais de manipulação que ajudem a compreender a ação.

Um efeito deve ter uma fonte reconhecível. O carimbo precisa parecer um contato curto com uma superfície; a batida deve pertencer à porta; o impacto da encomenda deve acompanhar o objeto mostrado. Não é necessário sonorizar toda mudança de tela.

Pequenas variações podem evitar a repetição mecânica de um mesmo ruído. Elas devem preservar a identidade do evento e não mudar a informação transmitida. O som de mensagem, por exemplo, precisa continuar identificável mesmo com uma variação discreta.

A prioridade de mixagem é clareza. A vinheta de resultado e os efeitos informativos devem ser percebidos sem exigir volume desconfortável. O acompanhamento pode diminuir por um momento para abrir espaço. Vários acontecimentos simultâneos precisam ser organizados, em vez de reproduzidos todos com o mesmo destaque.

O jogo deverá oferecer controle de volume e silêncio. As preferências de música, efeitos e vibração precisam ser compreensíveis e ficar preservadas no salvamento. Uma pessoa pode desejar ouvir efeitos e desligar a música, ou manter a música sem vibração.

O áudio será iniciado a partir de uma interação apropriada, respeitando as restrições do navegador à reprodução automática. Se a reprodução for bloqueada, a partida deve continuar com uma forma simples de ativar o som, sem insistência nem falha no fluxo. [T4]

Ao pausar, mudar de contexto ou retomar a página, a reprodução deve acompanhar o estado correto. Uma faixa não deve continuar em duplicidade porque a tela foi aberta duas vezes. As vinhetas já concluídas não devem ser tocadas novamente ao carregar o progresso.

## 19. Produção original e direitos dos materiais sonoros

O pedido do usuário é ter uma trilha para o jogo **sem violação de direitos autorais**. A direção aprovada é produzir composições e efeitos originais para este projeto, usando instrumentos sintetizados e material cuja origem seja conhecida.

Não se deve extrair música de novelas, reutilizar suas gravações ou reproduzir melodias reconhecíveis como se fossem originais. As novelas são referência para a escrita e a experiência narrativa, não uma biblioteca de áudio para incorporar ao jogo.

Composição e gravação precisam ser tratadas separadamente. Uma melodia criada para o projeto não elimina a necessidade de verificar a origem dos samples, instrumentos virtuais, gravações e ferramentas empregados para produzi-la. Se algum material de terceiro for utilizado, sua autorização precisa cobrir o uso efetivo no jogo e na distribuição pretendida.

Cada peça final deverá ter registro de identificação, função, origem, processo de produção, autoria ou créditos aplicáveis, licença ou autorização quando houver e arquivo utilizado na integração. A expressão “sem direitos autorais” não deve substituir esse registro.

O uso de IA na preparação de música, código ou materiais de desenvolvimento deverá ser informado quando efetivamente ocorrer. Não será alegado que uma peça foi composta, gravada, ouvida ou testada antes que essas etapas tenham acontecido.

A presente consolidação define a direção de produção. Ela não entrega uma trilha já renderizada nem certifica juridicamente arquivos que ainda serão produzidos.

## 20. Salvamento para continuar depois

A decisão mais recente determina que **o jogo terá recurso de salvar para continuar depois**. Essa definição substitui expressamente a orientação anterior de não oferecer retomada.

A solução aprovada é **salvamento local no próprio navegador, sem cadastro**, com salvamento automático após escolhas confirmadas e entregas concluídas. O jogador deve poder fechar a página e, ao voltar ao mesmo endereço no mesmo navegador e aparelho, encontrar a opção **Continuar partida**, desde que os dados permaneçam disponíveis.

A versão de base examinada utilizava armazenamento associado à sessão da janela. A evolução deverá utilizar persistência adequada à retomada entre sessões. Para um estado textual pequeno, o armazenamento local do navegador é uma possibilidade técnica compatível; a escolha final da implementação deve considerar o tamanho e a organização real dos dados. A documentação oficial diferencia essa persistência da duração limitada da sessão. [T3]

O salvamento deverá preservar, no mínimo:

| Grupo de informação | Conteúdo necessário |
|---|---|
| Jogador | Nome, opções de personalização e identificação utilizadas na partida. |
| Posição narrativa | Turno, entrega, cena e fase em que a pessoa parou. |
| Escolhas | Histórico das decisões e resultados já confirmados. |
| Consequências | Promessas, favores, mentiras, obrigações, itens e situações pendentes. |
| Relações | Memórias e atitudes relevantes de cada personagem. |
| Informação | Quem sabe o quê e quais rumores ou evidências já circularam. |
| Resultados | Entregas concluídas, classificação do resultado e balanço acumulado. |
| Preferências | Som, música, vibração e demais opções de interface existentes. |
| Continuidade técnica | Versão do formato e dados necessários para restaurar a mesma situação. |

Retomar precisa recuperar o estado completo. Restaurar apenas a tela ou o número da entrega, mas perder a confiança de um personagem ou uma promessa feita, quebraria o principal diferencial do projeto.

## 21. Comportamento de continuar, reiniciar e restaurar

O botão **Continuar partida** deverá levar ao ponto coerente com o progresso salvo. Se uma entrega já terminou, a restauração deve apresentá-la como concluída ou conduzir ao próximo ponto previsto, sem aplicar suas consequências novamente.

Os efeitos de uma decisão precisam ser registrados uma única vez. Reabrir a página não pode repetir um favor concedido, alterar novamente a reputação, duplicar um item, tocar outra vez a vinheta ou vibrar como se uma nova entrega tivesse acabado de acontecer.

Uma ação deve ser considerada salva somente depois que a gravação correspondente tiver sido concluída com sucesso. Se o navegador impedir o armazenamento ou ocorrer uma falha, a interface deve informar de forma simples que o progresso atual não pôde ser guardado. A partida pode continuar, mas não deve prometer uma retomada que não foi assegurada.

O comando **Nova partida** deverá pedir confirmação antes de substituir um progresso existente. A mensagem deve dizer claramente o que será perdido. Entrar no menu, abrir as configurações ou consultar o histórico não deve apagar o jogo.

O formato de salvamento precisa ter identificação de versão e tratamento para dados incompatíveis ou incompletos. Uma atualização não deve apagar silenciosamente um progresso válido. A implementação deverá migrar o que for compatível ou explicar o impedimento com uma opção segura para começar novamente.

Os trechos de sensor precisam de pontos coerentes de retomada. Se a página for fechada no meio de um transporte, o jogo pode restaurar o estado físico quando isso for robusto ou retomar o início daquele trecho a partir do último ponto confirmado. Em qualquer caso, consequências já consolidadas devem permanecer intactas.

O salvamento local ficará associado ao navegador e à origem do site. Ele não representa sincronização entre aparelhos. Limpar os dados do site, usar outro navegador ou mudar de endereço pode impedir o acesso ao progresso anterior. Em navegação privada, a retenção também pode ser limitada. A interface deve explicar a característica essencial sem transformar o início do jogo em uma aula técnica. [T3]

Publicar no Netlify é compatível com esse funcionamento. O salvamento não exige que as partidas sejam enviadas a um servidor. Não foram incluídos login, conta de jogador, sincronização em nuvem ou infraestrutura de IA como condições para entregar o projeto.

## 22. Acessibilidade, conforto e uso em celular e computador

A versão final deverá funcionar no navegador de celular e no computador. O celular é especialmente importante para demonstrar inclinação e vibração, enquanto o computador deve oferecer uma experiência completa por seus controles disponíveis.

O tamanho das áreas de toque, o comprimento dos textos e a posição dos botões precisam permitir o uso confortável. Ações importantes não devem ficar encobertas por elementos fixos ou depender de uma precisão incompatível com o toque.

Som, cor e vibração não serão a única forma de comunicar um resultado. A tela deve mostrar o que aconteceu, e o texto deve explicar o essencial. O jogador precisa conseguir concluir o percurso sem áudio e sem vibração.

As opções existentes de leitura, contraste ou redução de movimento deverão ser preservadas e compatibilizadas com os novos recursos. Efeitos visuais e transições não podem prejudicar quem usa essas configurações.

Os trechos de inclinação terão controles alternativos. A indisponibilidade de uma tecnologia deve levar a uma alternativa funcional, não a um aviso que impeça a continuação.

As preferências de conforto devem persistir. Ao voltar ao jogo, a pessoa não deverá precisar desligar novamente a vibração ou refazer toda a configuração de som.

Não será declarado que a experiência é acessível ou confortável para todas as pessoas apenas porque passou por uma inspeção visual. As verificações técnicas e os testes com jogadores, quando realizados, deverão ser descritos pelo que efetivamente demonstraram.

## 23. Publicação, organização dos arquivos e preservação da base

O destino de publicação aprovado é o **Netlify**, com acesso pelo navegador. A entrega deve priorizar uma versão web clara e demonstrável. O fato de a base conter um pacote Windows não cria, por si só, uma nova exigência de instalador para este escopo.

Os arquivos de publicação precisam estar organizados de modo que a entrada do jogo, seus scripts, estilos, fontes, imagens e áudios sejam encontrados corretamente. A pasta efetivamente publicada deve corresponder à versão final preparada.

As dependências desnecessárias de serviços externos devem ser evitadas. A ausência de IA durante a partida significa que nenhuma chave de modelo deve ser solicitada ao jogador para iniciar ou continuar.

Os recursos de PWA e cache já existentes na base precisam ser revistos ao atualizar o jogo. O navegador não deve combinar uma interface antiga com scripts ou áudios novos. A atualização de arquivos também deve respeitar a compatibilidade do salvamento.

Os dados da partida e o cache dos arquivos têm funções diferentes. Ter arquivos disponíveis em cache não equivale a ter o progresso salvo. A documentação e as verificações precisam tratar as duas coisas separadamente.

A evolução deve preservar uma referência recuperável da base escolhida. O projeto existente deve ser utilizado como fonte de trabalho, com registro de alterações e organização suficiente para localizar a versão publicada. Não é necessário criar uma nova identidade visual ou dispersar versões em múltiplas pastas sem função clara.

Uma configuração de publicação ou um processo de envio deverá ser documentado de forma simples, permitindo identificar qual pasta ou procedimento gera a versão disponível no endereço final. A publicação só poderá ser declarada concluída depois que o endereço tiver sido aberto e o funcionamento correspondente verificado.

## 24. Verificações necessárias para considerar a implementação pronta

As verificações devem ser proporcionais às mudanças e concentradas nas funções que sustentam a experiência. Não se pretende acumular números de testes sem relação com o uso do jogo.

| Área | Verificação concreta |
|---|---|
| Consequências | Uma escolha inicial altera uma cena, relação ou opção em uma entrega posterior. |
| Continuidade | A consequência só aparece quando sua condição ocorreu e não surge para uma pessoa sem acesso à informação. |
| Voz | Os diálogos usam “você”, mantêm a personalidade e não contradizem os fatos já estabelecidos. |
| Resultado | Sucesso e fracasso correspondem ao objetivo e recebem indicação visual compreensível. |
| Som | As duas vinhetas de resultado são diferentes e respeitam as preferências. |
| Vibração | O efeito de conclusão ocorre uma vez e é desligado pelas configurações apropriadas. |
| Salvamento | Fechar e reabrir restaura escolhas, relações, consequências e posição narrativa. |
| Retomada | Carregar não reaplica resultados, não duplica itens e não repete efeitos de conclusão. |
| Nova partida | Um progresso existente só é substituído após confirmação. |
| Sensor | O movimento responde de forma estável e a alternativa de controle permite completar o mesmo trecho. |
| Falhas de recursos | Ausência de vibração, áudio bloqueado ou sensor indisponível não impede jogar. |
| Publicação | A versão no endereço final carrega os recursos corretos e preserva o comportamento esperado. |
| Créditos | Nome, contribuições e origens dos materiais correspondem ao que realmente foi produzido. |

Para a vibração, é necessário testar em aparelho físico compatível. Uma simulação ou um teste de código pode confirmar que um evento foi solicitado, mas não comprova como ele foi sentido. Para o sensor, uma simulação ajuda a testar regras, mas não substitui a avaliação do movimento real.

Também é útil observar uma pessoa que ainda não conhece o jogo. O objetivo será descobrir se ela entende o que pode escolher, reconhece as consequências, encontra a opção de continuar e percebe o humor. Suas reações devem ser registradas como observações, sem inventar resultados ou generalizar a partir de uma única sessão.

As falhas encontradas deverão gerar ajustes concretos. Depois de corrigir o problema, será verificada a parte afetada e qualquer consequência relevante da mudança. Não é necessário repetir indiscriminadamente todas as verificações quando não houver nova razão para isso.

## 25. Enquadramento acadêmico e participação da IA

O material da aula 11 define o projeto final como uma proposta que aplique IA no desenvolvimento e/ou no funcionamento essencial. O documento admite formatos como aplicativo, jogo e proposta artística.

Para este projeto, a participação de IA será apresentada **no desenvolvimento**, conforme o processo efetivamente adotado. A experiência durante a partida será descrita como um sistema de escolhas, memória, condições e respostas previamente produzidas.

A explicação acadêmica deve mostrar como a assistência de IA foi utilizada e como as decisões humanas orientaram o resultado. É possível registrar exemplos de planejamento, alternativas de diálogo, programação, revisão ou elaboração de recursos, desde que correspondam ao trabalho real.

Não se deve apresentar falas previamente escritas como geração ao vivo nem chamar toda condição de programação de IA. Da mesma forma, o fato de não haver modelo durante a partida não elimina o uso de IA no processo de criação.

As propostas de sensores, haptics, áudio e consequências foram definidas para enriquecer este jogo. Elas devem ser demonstradas como escolhas de projeto. Não devem ser anunciadas como exigências literais do professor quando não houver essa obrigação no material.

## 26. Entregáveis acadêmicos e documentação final

A conclusão deverá resultar em um conjunto coerente de produto e materiais explicativos:

| Entregável | Conteúdo esperado |
|---|---|
| Jogo web | Versão funcional de Foi Você Que Escolheu com os recursos aprovados integrados. |
| Acesso para demonstração | Endereço da publicação e orientação simples para abrir e jogar. |
| Arquivos do projeto | Código, recursos necessários e organização que permita manter a versão entregue. |
| Instruções | Como começar, continuar, escolher controles e ajustar som e vibração. |
| Créditos | Christian Cândia Hollnagel como responsável acadêmico e registro das demais contribuições reais. |
| Registro de áudio | Identificação e origem das músicas e efeitos utilizados. |
| Explicação do projeto | Proposta, experiência pretendida, funcionamento das escolhas e tecnologias mobilizadas. |
| Registro do uso de IA | Participação real no desenvolvimento e distinção em relação à execução por regras. |
| Apresentação | Demonstração curta e compreensível do que o jogador faz e de como suas ações mudam o jogo. |
| Mapa da jornada | Documento posterior à conclusão do jogo, com os quatro eixos definidos pelo usuário. |

Os documentos deverão refletir a versão efetivamente entregue. Textos antigos da Visual 1.2, descrições que ainda digam que não existe salvamento ou planos que prometam IA durante a partida precisam ser atualizados quando integrarem o pacote final.

Uma pasta compactada pode reunir os arquivos necessários para envio, se esse for o formato adequado à entrega. Ela deve conter o que está sendo entregue, com instruções de acesso, sem apresentar rascunhos como componentes concluídos.

## 27. Apresentação do jogo

A apresentação acadêmica deverá permitir que alguém que nunca acompanhou o projeto entenda a proposta rapidamente: o jogador faz entregas, escolhe como lidar com as pessoas e encontra consequências que continuam depois daquele encontro.

A demonstração deve privilegiar uma sequência com relação causal visível. Primeiro aparece a escolha; depois, a reação imediata; em outro momento, a lembrança ou consequência. Dessa forma, o título do jogo ganha uma explicação concreta.

Também deverá ser mostrado um trecho da interação por inclinação, com menção à alternativa de controle, e uma conclusão de entrega com som e vibração quando o aparelho permitir. O recurso de continuar pode ser demonstrado fechando e retomando uma partida previamente preparada.

O roteiro de apresentação deve distinguir o que está pronto, o que foi testado e o que foi observado em jogadores. Não deve depender de alegações como “o jogo é sempre engraçado” ou “todos os usuários entendem”. O demonstrador pode mostrar as escolhas de projeto e relatar as evidências disponíveis.

A preparação deve prever uma alternativa de demonstração caso o ambiente da sala não permita algum recurso do aparelho ou da conexão. Essa alternativa não muda o produto; apenas evita que uma limitação circunstancial impeça explicar o trabalho.

## 28. Mapa da jornada: somente depois do jogo concluído

Está mantida a ordem expressamente definida pelo usuário: **primeiro concluir o jogo; depois criar o mapa da jornada**. O mapa anterior produzido durante a conversa não deve ser tratado como a versão final correspondente a esta consolidação.

O documento final será preparado em nome de **Christian Cândia Hollnagel** e deverá reunir o funcionamento efetivo do projeto concluído. Os quatro eixos obrigatórios definidos para esse mapa são:

1. **Pontos de contato:** telas, situações e canais pelos quais o jogador interage.
2. **Autonomia em cada ponto:** o que depende de decisão humana e o que o sistema executa automaticamente.
3. **Consequências dos erros:** o que acontece quando o jogador se engana, o sistema falha ou um recurso fica indisponível.
4. **Sentimentos do usuário:** percepção e experiência esperadas ou observadas em cada situação.

A retirada da IA durante a partida deve aparecer com transparência. Na jornada do jogador, as respostas automáticas serão descritas como ações do sistema programado. A IA usada no desenvolvimento será explicada em seu contexto próprio, sem inventar pontos de interação com um modelo inexistente.

O mapa deverá diferenciar uma consequência narrativa intencional de uma falha técnica. Perder uma entrega por uma escolha prevista faz parte do jogo; perder o salvamento por um defeito de implementação é um problema de uso. As duas situações podem provocar sentimentos diferentes e exigem formas distintas de recuperação.

Autonomia também envolve controle: a pessoa escolhe as ações, decide continuar ou começar novamente, ajusta som e vibração e utiliza controles alternativos. O sistema aplica consequências, seleciona respostas, registra o progresso e apresenta os resultados conforme as regras.

Os sentimentos deverão ser marcados como **hipóteses** enquanto não houver observação com usuários. Curiosidade, diversão, confiança, frustração, surpresa ou alívio não podem ser apresentados como resultados de pesquisa apenas porque foram previstos pela equipe.

O documento desta consolidação não executa essa etapa antecipadamente. Ele registra o compromisso, o conteúdo e a ordem de produção do mapa.

## 29. Sequência de desenvolvimento aprovada

A execução deverá avançar de forma integrada, a partir da base escolhida:

1. **Conferir a cópia de trabalho e preservar a referência da Visual 1.2.** Identificar o que já existe e organizar a versão que receberá as mudanças.
2. **Definir o estado das consequências e das relações.** Registrar escolhas, fatos, memórias, favores, promessas e condições de retorno.
3. **Mapear as ligações entre entregas.** Determinar onde uma decisão reaparece e como muda a experiência.
4. **Revisar e ampliar os diálogos.** Aplicar as vozes, o tratamento por “você” e as referências de ritmo, sempre com texto original.
5. **Integrar o salvamento ao estado completo.** Fazer a continuidade preservar as mesmas relações e consequências.
6. **Construir os trechos de transporte com sensores e controles alternativos.** Ligar seus resultados à narrativa.
7. **Produzir a trilha e os efeitos.** Compor, renderizar, documentar a origem e verificar a adequação ao jogo.
8. **Integrar áudio e vibração aos eventos.** Garantir prioridades, preferências, sincronização e ausência de repetição indevida.
9. **Verificar a experiência completa.** Corrigir falhas de compreensão, continuidade, navegação, retomada e funcionamento dos recursos.
10. **Preparar e conferir a publicação no Netlify.** Identificar a versão final e verificar o endereço publicado.
11. **Atualizar créditos, instruções e apresentação.** Descrever o produto real e a contribuição de IA no desenvolvimento.
12. **Produzir o mapa da jornada.** Usar a experiência concluída e separar sentimentos observados de hipóteses.

A sequência orienta as dependências, mas permite trabalho coordenado quando as partes forem independentes. Não é necessário pedir nova aprovação para escolhas rotineiras de implementação dentro desse escopo.

## 30. Registro das decisões vigentes e das orientações substituídas

| Tema | Decisão vigente | Orientação anterior que não deve prevalecer |
|---|---|---|
| Base | Visual 1.2 como ponto de partida. | Tratar a base como entrega final pronta ou trocar automaticamente por outra versão. |
| Projeto acadêmico | Foi Você Que Escolheu como projeto final. | Misturar os requisitos das atividades 4 e 5 com o jogo. |
| Consequências | Efeitos reais entre escolhas, cenas e entregas. | Encerrar toda repercussão no texto imediatamente posterior ao clique. |
| Diversão | Humor, relações, situações e novas escolhas sustentam o interesse. | Alongar a partida por repetição ou demora artificial. |
| IA durante a partida | Removida do escopo de funcionamento. | Integrar uma API de geração de falas ou consequências durante o jogo. |
| IA no desenvolvimento | Permitida e documentada conforme o uso real. | Apagar sua participação no processo ou confundi-la com geração ao vivo. |
| Personagens | Memória e reações programadas conforme fatos e relações. | Transformar a retirada da IA em personagens sem continuidade. |
| Linguagem | Coloquial brasileira, inspirada em mecanismos de diálogo das novelas estudadas. | Formalidade excessiva ou gírias iguais para todo o elenco. |
| Pronome | Você; adequação dos possessivos e da construção das frases. | Uso de tu nos diálogos originais ou textos para o jogador. |
| Sensores | Inclinação para equilibrar encomendas, com alternativas de controle. | Usar o sensor como requisito que exclua quem não pode utilizá-lo. |
| Haptics | Conclusão de entrega e demais eventos aprovados, com configurações. | Vibração repetida em toda ação ou duplicada ao restaurar o estado. |
| Sons de resultado | Vitória e derrota com vinhetas distintas. | Resultado comunicado somente por texto ou por um som genérico indiferenciado. |
| Trilha | Composições originais, com direção de comédia urbana e origem documentada. | Copiar músicas ou gravações das novelas de referência. |
| Salvamento | Automático, local, com Continuar partida e confirmação para substituir progresso. | A decisão anterior de não salvar para continuar depois. |
| Publicação | Web no Netlify, com funcionamento conferido. | Supor que o endereço publicado representa automaticamente uma entrega validada. |
| Jornada | Elaborada depois do jogo concluído, em nome de Christian Cândia Hollnagel. | Usar como final o mapa antecipado antes das mudanças. |
| Propostas desta conversa | Todas aprovadas, respeitada a prevalência das decisões posteriores. | Manter sensores, trilha ou padrões adicionais de haptics como sugestões aguardando aprovação. |

## 31. Resultado esperado da entrega

Ao concluir o desenvolvimento, o jogador deverá conseguir abrir o jogo, configurar sua experiência, iniciar ou continuar uma partida, escolher como lidar com as entregas e perceber que as pessoas se lembram dessas escolhas.

As conversas deverão soar naturais, com vozes diferentes e humor ligado ao que acontece. O transporte por inclinação deverá dialogar com o trabalho do entregador e oferecer alternativas equivalentes. As entregas deverão terminar com resultados claros, som apropriado e vibração quando habilitada e disponível.

A trilha deverá sustentar a identidade do jogo, acompanhar os contextos e deixar espaço para ler. O salvamento deverá conservar o percurso, inclusive as relações e consequências. A versão publicada deverá corresponder ao material apresentado academicamente.

O título **Foi Você Que Escolheu** deverá ser reconhecível na experiência: a pessoa toma uma decisão, vê o mundo reagir e encontra adiante uma situação que só existe daquele jeito porque ela participou de sua construção.

## 32. Fontes e base de referência

As decisões de escopo vêm da conversa com o usuário, incluindo a aprovação integral das propostas e as correções posteriores. As fontes abaixo sustentam o enquadramento acadêmico, a pesquisa de referências narrativas e as observações técnicas. Elas não comprovam implementação ou teste do jogo.

### Materiais da disciplina consultados

- **Lâminas da aula 11 — Começando o projeto final**, professor Roberto Tietzmann, outubro de 2026, no pacote Tecnologia embutida. A definição do projeto aparece na página 2.
- **Aula 13 — Jornada do Usuário com IA**, no mesmo pacote. Os quatro eixos da atividade estão na página 6; a apresentação do entregável aparece na página 7.
- **Cópia do ZIP V1_WebApp_PWA_Visual_v1_2**, examinada nesta conversa. A inspeção incluiu o motor principal, o aplicativo, os casos e o episódio da portaria. Trata-se da referência da base, não de uma certificação da versão final.

### Referências narrativas

- **[R1] Gshow — Senhora do Destino: Renata Sorrah conta curiosidades de Nazaré e se diverte com os memes.** Reúne comentários e falas publicadas da personagem. [Consultar](https://gshow.globo.com/novelas/mundo-de-novela/noticia/senhora-do-destino-renata-sorrah-conta-curiosidades-de-nazare-e-se-diverte-com-os-memes.ghtml).
- **[R2] Memória Globo — Senhora do Destino.** A apresentação dos personagens descreve a tentativa de Giovanni de falar de forma sofisticada. [Consultar](https://memoriaglobo.globo.com/entretenimento/novelas/senhora-do-destino/).
- **[R3] Memória Globo — Cobras & Lagartos: trama principal.** Referência para engano de identidade, manutenção da mentira e transformação das relações. [Consultar](https://memoriaglobo.globo.com/entretenimento/novelas/cobras-lagartos/noticia/trama-principal.ghtml).
- **[R4] Gshow — Jaques Leclair e Ariclenes se alfinetam**, publicado em 19/07/2010. Texto de cena com provocações baseadas no passado compartilhado. [Consultar](https://gshow.globo.com/novelas/ti-ti-ti/Vem-por-ai/noticia/2010/07/jaques-leclair-alexander-borges-e-ariclenes-murilo-benicio-se-alfinetam.html).
- **[R5] Gshow — Monalisa fica revoltada ao descobrir que Olenka e Iran sabiam da farsa de Silas**, publicado em 09/06/2012. [Consultar](https://gshow.globo.com/novelas/avenida-brasil/Vem-por-ai/noticia/2012/06/monalisa-fica-revoltada-ao-descobrir-que-olenka-e-iran-sabiam-da-farsa-de-silas.html).
- **[R6] Gshow — Monalisa perdoa Olenka**, publicado em 07/08/2012. Texto de reconciliação que combina afeto e reclamação. [Consultar](https://gshow.globo.com/novelas/avenida-brasil/Vem-por-ai/noticia/2012/08/monalisa-perdoa-olenka.html).
- **[R7] Gshow — Socorro prepara “grude assassino” e deixa Chayene com a boca colada**, publicado em 17/05/2012. [Consultar](https://gshow.globo.com/novelas/cheias-de-charme/Vem-por-ai/noticia/2012/05/socorro-prepara-grude-assassino-e-deixa-chayene-com-boca-colada.html).
- **[R8] Gshow — Cassandra foge de Fabinho e leva fora de Débora**, publicado em 30/03/2016. [Consultar](https://gshow.globo.com/novelas/totalmente-demais/vem-por-ai/noticia/2016/03/cassandra-foge-de-fabinho-e-leva-fora-de-debora.html).
- **[R9] Gshow — Nelito vira mordomo de Sandra Helena**, publicado em 21/08/2017. [Consultar](https://gshow.globo.com/google/amp/novelas/pega-pega/vem-por-ai/noticia/nelito-vira-mordomo-de-sandra-helena.ghtml).

### Referências técnicas

- **[T1] MDN — Detecting device orientation.** Eventos de orientação, contexto seguro e solicitação de acesso em ambientes que a exigem. [Consultar](https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Detecting_device_orientation).
- **[T2] MDN — Navigator.vibrate().** Padrões de duração e pausa, disponibilidade e interação prévia. [Consultar](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate).
- **[T3] MDN — Window.localStorage.** Persistência entre sessões, associação à origem e limites de disponibilidade do armazenamento. [Consultar](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- **[T4] MDN — Autoplay guide for media and Web Audio APIs.** Restrições à reprodução automática e tratamento da ativação de áudio. [Consultar](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).

Referências consultadas no contexto desta consolidação em 12/11/2026. As análises de escrita e as aplicações propostas ao jogo são interpretações do material consultado. Não houve, nesta etapa de consolidação, produção de áudio, alteração do código, publicação, playtest ou elaboração do mapa final da jornada.


