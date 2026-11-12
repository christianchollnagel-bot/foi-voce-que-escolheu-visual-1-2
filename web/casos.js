/* Doze episódios do mapa aprovado, com pistas específicas na conferência. */
window.CASOS = [
  {
    "chapter": "As duas margens",
    "title": "Uma voz baixa",
    "goal": "Levar o pedido de Dalva até Inês sem contar pra fila o que diz a carta.",
    "opening": "Dalva enfia a meia debaixo da porta. A barra de sabão lá dentro segura a porta aberta. Esperou tanto lá fora que uma senhora já perguntou duas vezes que horas abre. Dalva te passa a carta e encosta o dedo no ouvido. “Chega pertinho dela pra falar, tá?”",
    "npc": "Dalva",
    "prep": [
      [
        "Perguntar como ela quer ser apresentada",
        "“Meu nome pode falar. O resto deixa comigo, que eu conto lá na frente.” Ela faz uma dobra que esconde o carimbo."
      ],
      [
        "Pegar a carta pela ponta",
        "O carimbo da quitação fica virado para o corredor. Dalva cobre a palavra com o polegar."
      ]
    ],
    "social": [
      [
        "Pedir licença na ponta do balcão",
        "Inês levanta a portinhola. Cabe uma pessoa de cada vez."
      ],
      [
        "Anunciar que chegou uma carta urgente",
        "Três pessoas levantam o braço. A última só quer saber se chegou a conta do gás."
      ]
    ],
    "delivery": [
      [
        "Passar a carta por baixo da portinhola",
        "Inês recolhe o envelope antes que a próxima senha encoste no vidro."
      ],
      [
        "Ler o carimbo para localizar o setor",
        "A primeira pessoa da fila repete a palavra “quitação”. A carta chega, mas o assunto já percorreu o corredor."
      ]
    ],
    "repair": [
      [
        "Levar Dalva ao guichê para ela mesma falar",
        "Dalva passa na frente. “Segura a porta pra mim um pouquinho?” Agora quem segura a meia é você."
      ],
      [
        "Anotar a quitação no quadro de avisos",
        "Quando Inês vem buscar a carta, o quadro já tem leitores."
      ]
    ],
    "echo": [
      "Dalva devolve a meia ao batente e te faz sinal para chegar mais perto.",
      "“Que é urgente a fila inteira já sabe. Chega aqui. Fala baixo.”"
    ],
    "event": {
      "title": "A fila ouviu o chamado",
      "line": "Uma senhora já vai repetir o carimbo para ajudar a encontrar o guichê. Dalva te olha. Ainda dá tempo de interromper.",
      "actions": [
        [
          "Pedir à senhora que só segure a porta",
          "A senhora pega a meia do jacaré. Dalva te puxa para a abertura do balcão."
        ],
        [
          "Ditar o que diz a carta pra andar mais rápido",
          "A palavra chega ao fim da fila antes da carta. O pedido de discrição se perdeu."
        ]
      ],
      "effects": [
        "delivery",
        "loss"
      ]
    },
    "missing": "A carta para na portinhola. A dobra abriu na sua mão e a fila está a um passo de ler o carimbo. Dalva já se levantou. Ainda dá pra chamar Dalva até o balcão."
  },
  {
    "chapter": "Uma cadeira para o público",
    "title": "O dono da senha",
    "goal": "Levar um aviso à pessoa que espera atendimento sem trocar sua posição na fila.",
    "opening": "Na entrada, quem tem senha branca espera atendimento. Com a cor de abóbora, dá pra sentar na cadeira do público. Um rapaz espera de pé, com um chapéu que nem é dele na mão. O aviso diz “entregar em mãos”.",
    "npc": "Rapaz do chapéu",
    "prep": [
      [
        "Conferir o número com o rapaz",
        "Ele mostra o canhoto branco escondido sob a aba do chapéu. Bate com o do envelope."
      ],
      [
        "Seguir o chapéu até a cadeira",
        "O senhor sentado pega o chapéu. O rapaz continua de pé e você continua com o aviso."
      ]
    ],
    "social": [
      [
        "Pedir em voz baixa pra ver o canhoto",
        "Só o rapaz se aproxima."
      ],
      [
        "Pedir que o dono do chapéu se apresente",
        "O ministro vem na sua direção, de mão estendida. “O chapéu ou o rapaz?”"
      ]
    ],
    "delivery": [
      [
        "Entregar pelo número conferido",
        "O rapaz guarda o aviso no bolso onde já estava a senha."
      ],
      [
        "Dar o aviso a quem ocupa a cadeira",
        "O ministro recebe com educação até descobrir que o papel tem o número de outra pessoa."
      ]
    ],
    "repair": [
      [
        "Comparar os dois canhotos ali mesmo",
        "O rapaz segura o chapéu entre os joelhos para ter as mãos livres. Ninguém perde a vez."
      ],
      [
        "Mandar o rapaz trocar a senha",
        "Ao voltar, ele encontra outra pessoa no lugar onde esperava."
      ]
    ],
    "echo": [
      "O rapaz te mostra onde está o número sem precisar soltar o chapéu.",
      "O ministro devolve o chapéu ao rapaz. “Dessa vez, guarda o cargo também.”"
    ],
    "missing": "Você estende o envelope. O rapaz está com as duas mãos no chapéu, e ainda falta comparar o número do aviso com o do canhoto. Ele apoia o chapéu no joelho."
  },
  {
    "chapter": "A ordem das camas",
    "title": "Duas sem pimentão",
    "goal": "Entregar as marmitas e usar o telefone só como Isaura combinou.",
    "opening": "Na cozinha de Isaura o vapor descola as etiquetas. Há duas marmitas sem pimentão e um número escrito no rodapé da encomenda. Isaura permite uma ligação feita ali. Uma gota cai da concha. Bem no último algarismo.",
    "npc": "Isaura",
    "prep": [
      [
        "Separar as duas tampas marcadas",
        "Isaura risca as duas com o cabo da colher. Dá para reconhecê-las pelo tato."
      ],
      [
        "Empilhar tudo para liberar espaço",
        "As quatro tampas batem uma na outra. Até Isaura para pra ver qual é qual."
      ]
    ],
    "social": [
      [
        "Telefonar ali e confirmar o ponto de entrega",
        "A pessoa atende mastigando. Antigo refeitório, mesa do fundo."
      ],
      [
        "Chamar pelo salão quem pediu comida especial",
        "Metade da cozinha levanta a mão. “Aqui, especial é tudo”, diz Isaura."
      ]
    ],
    "delivery": [
      [
        "Levar as duas porções identificadas ao refeitório",
        "Na mesa do fundo abrem as duas juntas. Nenhuma tira vermelha no meio do ovo."
      ],
      [
        "Despachar o lote misturado",
        "Na mesa do fundo alguém abre a primeira tampa e precisa procurar a cozinha de novo."
      ]
    ],
    "repair": [
      [
        "Pedir a Isaura que confira antes de sair",
        "Ela ergue uma tampa por vez. Agora dá até para sentir a diferença pelo cheiro."
      ],
      [
        "Distribuir cópias do telefone para agilizar",
        "O telefone toca sem parar enquanto Isaura tenta fechar a cozinha."
      ]
    ],
    "echo": [
      "Isaura te passa o papel. Você pega pelo lado seco.",
      "“Quem quiser comida especial descasca o próximo ovo”, avisa Isaura ao salão."
    ],
    "event": {
      "title": "Uma tampa fora do lugar",
      "line": "Com tanta mão levantada, uma tampa escorregou. Isaura consegue identificar as duas porções, se você devolver a pilha ao balcão.",
      "actions": [
        [
          "Voltar com a pilha para Isaura conferir",
          "Ela abre as duas sobre o vapor e reconhece os riscos do cabo da colher."
        ],
        [
          "Dar duas marmitas quaisquer ao primeiro que levantou a mão",
          "Um cliente que não fez o pedido leva as duas marmitas. O refeitório espera em vão."
        ]
      ],
      "effects": [
        "ready",
        "loss"
      ]
    },
    "missing": "Na soleira do refeitório, as duas marmitas que você pegou são idênticas às outras. O vapor descolou a última etiqueta. A cozinha de Isaura ainda está aberta."
  },
  {
    "chapter": "A oficina de empréstimos",
    "title": "A ficha que sobrou",
    "goal": "Levar a contagem das marcas até Inês e manter a ficha intacta.",
    "opening": "Na mesa de Inês há trinta e oito fichas. Trinta e sete têm uma meia-lua na ponta. A última continua fechada. Na guia, deixaram um quadrinho só pra quantidade. A ponta do lápis paira entre o sete e o oito.",
    "npc": "Inês",
    "prep": [
      [
        "Fazer duas linhas na guia",
        "Inês dita devagar. “Trinta e oito examinadas por fora. Trinta e sete com marca.”"
      ],
      [
        "Copiar só o total da pilha",
        "O número 38 cabe com folga. A exceção ficou sem lugar."
      ]
    ],
    "social": [
      [
        "Pôr uma divisória debaixo da ficha intacta",
        "A ficha continua no seu lugar e dá para contar as demais."
      ],
      [
        "Pedir uma meia-lua emprestada",
        "Dimas oferece a unha do polegar. “Com devolução até sexta.” Não chega a tocar no papel."
      ]
    ],
    "delivery": [
      [
        "Entregar a contagem separada por marca",
        "Inês guarda a guia e devolve a ficha fechada à gaveta."
      ],
      [
        "Assinalar que todas têm a marca",
        "Inês devolve a folha. Do jeito que ficou, quem ler vai achar que a última também tem marca."
      ]
    ],
    "repair": [
      [
        "Recontar com Inês sem abrir as fichas",
        "Ela põe um maço em cada uma das suas mãos. Quando sobra uma, vocês têm a resposta."
      ],
      [
        "Abrir a ficha restante para completar o relato",
        "O invólucro aberto já não pode ser devolvido como chegou."
      ]
    ],
    "echo": [
      "Inês segura a divisória enquanto você lê as duas linhas.",
      "Dimas recolhe o polegar. “Essa ferramenta é de uso pessoal.”"
    ],
    "missing": "Inês encontra um único número na guia. “Trinta e oito examinadas ou trinta e oito com marca?” Ela afasta o tinteiro para caberem os dois maços sobre a mesa."
  },
  {
    "chapter": "O tamanho da mudança",
    "title": "O armário faz a curva?",
    "goal": "Entregar ao pessoal do frete uma medida que permita tirar o armário da passagem.",
    "opening": "O armário está deitado na entrada do bloco B. A largura da porta já foi medida. Lá dentro o corredor dobra à esquerda. Um homem pergunta se pode levantar. Outro, lá embaixo, pergunta se pode respirar.",
    "npc": "Dalva",
    "prep": [
      [
        "Marcar no chão o giro do móvel",
        "A ponta da fita bate no rodapé muito antes de o armário apontar para a sala."
      ],
      [
        "Medir de novo a porta",
        "A fita diz que passa. Um dos homens pergunta se ela diz também como virar."
      ]
    ],
    "social": [
      [
        "Perguntar ao rapaz do frete onde apoiar o armário",
        "Ele calça o móvel. Até que enfim dá pra soltar as mãos."
      ],
      [
        "Oferecer o próprio ombro como nível",
        "O rapaz apoia a fita no seu ombro. “Agora cresce dois dedos.”"
      ]
    ],
    "delivery": [
      [
        "Entregar o desenho da curva",
        "O rapaz do frete pede a chave de fenda. Finalmente alguém pode sair do vestíbulo."
      ],
      [
        "Mandar levantar com base só na largura da porta",
        "A quina bate no mesmo rodapé. O móvel volta ao chão e o acesso continua fechado."
      ]
    ],
    "repair": [
      [
        "Fazer um molde com papelão e girá-lo",
        "Dalva segura uma ponta. A outra encalha exatamente onde está o armário."
      ],
      [
        "Tentar empurrar o móvel sem girar",
        "O homem lá de dentro avisa que agora também falta espaço para o sapato."
      ]
    ],
    "echo": [
      "Dalva segura o calço com o pé e suas mãos ficam livres.",
      "O rapaz recolhe a fita. “Pode voltar à altura normal.”"
    ],
    "event": {
      "title": "Passagem de serviço",
      "line": "Do lado de dentro alguém bate na madeira. Precisa sair. Mesmo sem o desenho da curva, há uma maneira de liberar a passagem agora.",
      "actions": [
        [
          "Chamar o frete para desmontar o móvel no chão",
          "O rapaz acha os parafusos e tira a lateral. Dalva passa com a fita ainda enrolada no pulso."
        ],
        [
          "Sustentar o armário e retomar a medição",
          "O vizinho sai por baixo e segura a sua fita enquanto o frete apoia o móvel outra vez."
        ]
      ],
      "effects": [
        "win",
        "delivery"
      ]
    },
    "missing": "O rapaz do frete olha o seu desenho. A largura da porta está lá, mas o papel acaba onde o móvel precisa virar. Dalva desenrola a fita."
  },
  {
    "chapter": "Sessão das quatro",
    "title": "A voz dentro da cabine",
    "goal": "Levar ao ensaio a conclusão que Rui autorizou. A gravação fica na cabine.",
    "opening": "Você encosta o envelope na mesa. O alto-falante do Íris chia. Rui deixa pôr no papel o que Inês descobriu. O nome dele, na voz dele, fica ali dentro. Do salão alguém pede som para acertar o volume.",
    "npc": "Rui, projecionista",
    "prep": [
      [
        "Pedir a Rui que confira o texto da autorização",
        "Ele lê de trás para a frente, à procura do próprio nome. “Escreveu. Tá bom.”"
      ],
      [
        "Pegar as duas caixas iguais",
        "Uma contém a conclusão em papel. A outra traz a gravação. As tampas são irmãs gêmeas."
      ]
    ],
    "social": [
      [
        "Testar o alto-falante contando até três",
        "Da última fila volta um quatro. O som funciona."
      ],
      [
        "Pedir que escutem o silêncio",
        "O cinema inteiro obedece. O primeiro solo da tarde é um ronco da sua barriga."
      ]
    ],
    "delivery": [
      [
        "Levar só o resumo conferido",
        "No salão, a folha passa de mão em mão. A gravação fica com Rui."
      ],
      [
        "Usar a gravação como teste de som",
        "A voz de Rui atravessa a tela. Desligar o aparelho não recolhe o que a sala ouviu."
      ]
    ],
    "repair": [
      [
        "Voltar à cabine e separar o papel com Rui",
        "Rui te entrega a folha e fecha a caixa da gravação antes de abrir a porta."
      ],
      [
        "Deixar as duas caixas ao lado do projetor do salão",
        "O operador abre a primeira para o teste. O nome sai antes da música."
      ]
    ],
    "echo": [
      "Rui baixa o volume depois do quatro que veio da plateia.",
      "Rui esconde o riso no ombro. “Pro próximo teste eu trago um sanduíche.”"
    ],
    "event": {
      "title": "O técnico ouviu um ruído",
      "line": "O operador estende a mão pela cortina. Pede qualquer som de referência. Rui segura a caixa que tem a gravação.",
      "actions": [
        [
          "Estalar os dedos perto do microfone",
          "O estalo chega até o fundo. Rui tira a caixa da mesa de teste."
        ],
        [
          "Entregar a gravação para tocar só o começo",
          "No começo está justamente o nome que Rui reservou só pra cabine. A primeira sílaba já sai no alto-falante."
        ]
      ],
      "effects": [
        "delivery",
        "loss"
      ]
    },
    "missing": "O operador te pergunta qual das duas caixas ele pode abrir no salão. Faltou conferir as tampas com Rui. Atrás da cortina, a cabine continua aberta."
  },
  {
    "chapter": "A tarifa do silêncio",
    "title": "A quinta-feira de Dalva",
    "goal": "Entregar a informação a tempo de Dalva decidir o que fazer com o prazo dela.",
    "opening": "Dalva espera na oficina. Na sua pasta há um envelope para hoje e um comunicado coletivo para amanhã. Uma funcionária sugere juntar os dois numa viagem. A correia da máquina de Dalva já começou a cantar do outro lado da rua.",
    "npc": "Dalva",
    "prep": [
      [
        "Conferir a data no envelope individual",
        "Quinta-feira. No coletivo está escrita sexta, com a mesma letra e outra tinta."
      ],
      [
        "Ordenar as entregas por endereço",
        "A oficina aparece uma vez só. As datas desaparecem debaixo do clipe."
      ]
    ],
    "social": [
      [
        "Pedir licença para interromper a máquina",
        "Dalva tira o pé do pedal. Até a próxima costura, ela é toda ouvidos."
      ],
      [
        "Gritar que o futuro da oficina chegou",
        "Cida olha o tamanho do envelope. “Veio desmontado?”"
      ]
    ],
    "delivery": [
      [
        "Entregar hoje o envelope individual datado",
        "Dalva lê a data, dobra o papel e guarda no próprio bolso. A decisão fica com ela."
      ],
      [
        "Guardar os dois papéis pra levar amanhã",
        "Quando você chega, Dalva já decidiu. Teve que fazer isso sem o papel."
      ]
    ],
    "repair": [
      [
        "Abrir a agenda com Dalva e separar a via de hoje",
        "Ela marca a quinta com a unha para ninguém empurrar o papel até sexta."
      ],
      [
        "Confirmar pela oficina que ela vai esperar",
        "Dalva recebe a notícia de uma promessa feita em seu nome."
      ]
    ],
    "echo": [
      "Dalva espera você acabar de falar. O pé continua fora do pedal.",
      "Cida põe a tesoura na mesa. “Se veio desmontado, confere se vieram as peças.”"
    ],
    "missing": "Dalva recebe dois papéis presos pelo clipe. “Qual dos dois era pra hoje?” A resposta sumiu debaixo do metal. Ela te estende o calendário."
  },
  {
    "chapter": "O avesso do recibo",
    "title": "A dobra que segurava tudo",
    "goal": "Levar uma cópia que dê pra ler dos dois lados. A emenda do original precisa ficar inteira.",
    "opening": "Cida abre espaço na mesa de corte. No recibo, quatro fitas de idades diferentes sustentam um rasgo. A frente coube inteira na primeira cópia. No verso ainda se vê a continuação da linha de carbono.",
    "npc": "Cida",
    "prep": [
      [
        "Apoiar as dobras antes de copiar frente e verso",
        "Cida aproxima duas tábuas até a sanfona ficar nivelada."
      ],
      [
        "Tirar uma cópia rápida da frente",
        "A cópia parece perfeita. No rodapé, uma linha acaba no meio de uma palavra."
      ]
    ],
    "social": [
      [
        "Pedir uma segunda tábua à oficina",
        "Cida empresta até os pesos que seguram os moldes."
      ],
      [
        "Perguntar se alguém na oficina sabe usar fita",
        "As duas sócias param no meio da costura para admirar a pergunta."
      ]
    ],
    "delivery": [
      [
        "Mandar as cópias depois de conferir frente e verso",
        "Inês segue a linha de carbono sem tirar o original da oficina."
      ],
      [
        "Mandar a frente como se fosse o recibo inteiro",
        "No balcão, Inês precisa pedir o verso que ficou na mesa de corte."
      ]
    ],
    "repair": [
      [
        "Conferir a continuidade com Cida e copiar de novo",
        "As duas metades da palavra voltam a se encontrar. Cida guarda o original."
      ],
      [
        "Arrancar as fitas para alisar melhor",
        "Uma letra fica no adesivo. Já não dá para devolver o papel nas mesmas condições."
      ]
    ],
    "echo": [
      "Cida guarda um peso para a última dobra.",
      "Cida põe quatro rolos de fita em ordem de tamanho. “Experiência com fita a gente tem.”"
    ],
    "missing": "Inês acompanha com o dedo a linha da sua cópia. A palavra termina no meio de uma sílaba. “E do outro lado?” O original ainda está na mesa de Cida."
  },
  {
    "chapter": "As pessoas na sala",
    "title": "O prato de vidro",
    "goal": "Devolver o prato a quem o trouxe. Deixar na mesa do Íris não foi doação.",
    "opening": "A reunião terminou sem votação. Na beirada do palco ficou um prato cor de mel. Você levanta o prato, e a borda bate no pé da mesa. Da escada vem uma voz pedindo cuidado. Já estão guardando cadeiras.",
    "npc": "Mulher da escada",
    "prep": [
      [
        "Perguntar à mulher onde quer o prato",
        "“Na minha mão, moço. O pano tá aqui.” Ela mostra um quadrado de tecido do tamanho certo."
      ],
      [
        "Procurar espaço na caixa de objetos da reunião",
        "O vão é redondo. O prato ia caber direitinho ali."
      ]
    ],
    "social": [
      [
        "Abrir passagem até a escada",
        "A mulher estende as duas mãos e espera."
      ],
      [
        "Anunciar o último item do leilão",
        "Alguém oferece meio pastel. A mulher guarda o pano de volta debaixo do braço."
      ]
    ],
    "delivery": [
      [
        "Entregar em mãos após confirmar o pedido",
        "Ela firma o pano na borda. Só aí você solta o prato."
      ],
      [
        "Registrar o prato como doação ao Íris",
        "A mulher precisa voltar ao balcão para pedir de volta o que era dela."
      ]
    ],
    "repair": [
      [
        "Levar o prato até a voz e perguntar outra vez",
        "Ela abre o pano, agora com o cotovelo. O prato encontra o caminho de casa."
      ],
      [
        "Embalar junto dos documentos da reunião",
        "A caixa segue para o Arquivo. A mulher segue sem o prato."
      ]
    ],
    "echo": [
      "A mulher espera no degrau que ficou livre.",
      "A mulher te olha e alisa o pano. “Eu não tava vendendo.”"
    ],
    "missing": "Você estende o prato. Todo mundo continua de mão na caixa. Ainda falta perguntar pra pessoa que trouxe o prato. A mulher ainda espera no último degrau."
  },
  {
    "chapter": "O peso do volume",
    "title": "Oito minutos",
    "goal": "Protocolar o conjunto completo antes das 17h sem expor a via de Rui.",
    "opening": "O relógio do protocolo marca 16h52. O carimbo ainda está no alto. Faltam oito minutos pras cinco. Na caixa há 37 invólucros marcados e a via de Rui em separado. A guia pede que alguém confira o volume inteiro.",
    "npc": "Encarregada",
    "prep": [
      [
        "Conferir os 37 e a bolsa interna sem romper o lacre",
        "O lacre roça o forro. A via separada está onde devia."
      ],
      [
        "Contar só o que está à vista",
        "Trinta e sete. A tampa parece vazia até ser erguida contra a luz."
      ]
    ],
    "social": [
      [
        "Apontar a guia antes de mover a caixa",
        "A encarregada já tem a linha certa sob o indicador."
      ],
      [
        "Dizer que a caixa não pesa nada",
        "Ela larga a outra alça por um segundo. Você retira o comentário."
      ]
    ],
    "delivery": [
      [
        "Protocolar com o conjunto conferido",
        "O carimbo desce. O volume está em guarda e a suspensão pode ser registrada."
      ],
      [
        "Romper o lacre para facilitar a conferência",
        "A via de Rui perdeu a proteção que a guia exigia. A encarregada devolve o volume."
      ]
    ],
    "repair": [
      [
        "Conferir a bolsa com a encarregada no balcão",
        "Ela sente o relevo pelo pano. Ainda há tempo para o carimbo."
      ],
      [
        "Voltar amanhã com uma guia mais bonita",
        "O balcão fecha. O prazo daquela sexta termina com a caixa do lado de fora."
      ]
    ],
    "echo": [
      "A encarregada acompanha a linha da guia com a unha.",
      "A encarregada volta a pegar na alça. “Levinha. Desde que tenha dois carregando.”"
    ],
    "event": {
      "title": "A alça escapa",
      "line": "Com a alça em uma só mão, a tampa começa a abrir. A encarregada está perto. A bolsa de Rui ainda está fechada.",
      "actions": [
        [
          "Pedir que ela segure a tampa pra você apoiar a caixa",
          "Ela encaixa a bolsa interna e termina a conferência com você. Os invólucros estão inteiros."
        ],
        [
          "Puxar a caixa pelo lacre da bolsa",
          "O papel rompe antes que o peso da caixa saia da sua mão. O volume chega com o lacre violado."
        ]
      ],
      "effects": [
        "ready",
        "loss"
      ]
    },
    "missing": "Trinta e sete invólucros na pilha. Falta conferir a via de Rui na bolsa interna. A encarregada te chama para o lado da mesa onde a tampa pode ser erguida inteira."
  },
  {
    "chapter": "O sábado do Íris",
    "title": "A bainha da tela",
    "goal": "Preparar a tela para a sessão sem estragar o pano do cinema.",
    "opening": "Pra quem olha de pé, o defeito parece ser da costura. Olhando rente ao palco, dá pra ver a barriga na madeira da bainha. Rui está na cabine. Uma criança projeta o focinho de uma raposa com dois dedos.",
    "npc": "Inês",
    "prep": [
      [
        "Abaixar e examinar a madeira",
        "O ponto de Inês está firme. A ripa é que empenou."
      ],
      [
        "Puxar a tela pelos cantos",
        "O focinho da raposa fica comprido. A barriga muda de lado."
      ]
    ],
    "social": [
      [
        "Pedir ajuda pra segurar o pano durante o conserto",
        "Duas mãos aparecem por baixo da tela e a seguram firme."
      ],
      [
        "Experimentar o papel de gigante na frente do foco",
        "A raposa morde a sua orelha na parede. A plateia pede bis."
      ]
    ],
    "delivery": [
      [
        "Entregar a tela com a ripa substituída",
        "A raposa volta ao tamanho de raposa. Rui consegue enquadrar a sessão."
      ],
      [
        "Cortar a bainha inteira para ganhar tempo",
        "A madeira cai. Agora há quase uma tela inteira para costurar antes da sessão."
      ]
    ],
    "repair": [
      [
        "Pedir a Inês que solte só a ponta necessária",
        "Ela passa a ripa por uma abertura de dois dedos e fecha o ponto de novo."
      ],
      [
        "Prender a dobra bem no meio da imagem",
        "O filme começa com uma montanha atravessando a cara dos atores."
      ]
    ],
    "echo": [
      "Inês segura o tecido pelas bordas até você terminar.",
      "A criança torna a fazer a raposa. Inês aponta para a bainha. “A artista pode esperar.”"
    ],
    "missing": "Você levanta a ponta do pano. Visto daí, tanto pode ser a costura quanto a madeira empenada. Inês já está de joelhos ao pé do palco com a agulha na mão."
  },
  {
    "chapter": "A casa de botão",
    "title": "Onde agora mora uma árvore",
    "goal": "Devolver ao Arquivo um registro honesto da tentativa de contato.",
    "opening": "No endereço da ficha cresceu uma caramboleira. Um vizinho te oferece uma fruta. Arrumar uma assinatura é fácil. Difícil é saber o que ela vai provar. Na pasta ainda restam quatro endereços sem contato no balanço.",
    "npc": "Vizinho",
    "prep": [
      [
        "Conferir o endereço e perguntar pela família",
        "O vizinho sabe apontar a antiga soleira. Sobre a família, só sabe que saiu."
      ],
      [
        "Perguntar quem pode assinar naquela rua",
        "Três pessoas sabem assinar. Nenhuma conhece o destinatário."
      ]
    ],
    "social": [
      [
        "Pedir uma indicação para uma nova visita",
        "Ele aponta a venda da esquina. Vale perguntar lá quando abrir."
      ],
      [
        "Oferecer a caneta à caramboleira",
        "O vizinho escolhe uma fruta bem madura. “Essa até carimba.”"
      ]
    ],
    "delivery": [
      [
        "Registrar a visita sem contato confirmado",
        "Inês deixa o caso aberto pra outra busca. O relatório não inventa um recebimento."
      ],
      [
        "Dar a entrega por recebida com a assinatura do vizinho",
        "O papel chega completo. A pessoa procurada continua desaparecida nas próprias contas."
      ]
    ],
    "repair": [
      [
        "Ler a ficha de volta e corrigir o campo de recebimento",
        "O vizinho assina só como informante. A família continua na lista de busca."
      ],
      [
        "Marcar que a família recusou a entrega",
        "A árvore acaba de virar testemunha de uma recusa que ninguém fez."
      ]
    ],
    "echo": [
      "O vizinho aponta a venda, que ainda está com a porta fechada.",
      "O vizinho limpa a caneta para não ficar fruta no formulário."
    ],
    "event": {
      "title": "Um endereço no verso",
      "line": "Ao limpar a caneta, o vizinho lembra onde costumavam chegar os recados. A pista serve para outra visita. A pessoa procurada continua ausente.",
      "actions": [
        [
          "Anotar a pista e encerrar como visita sem contato",
          "O próximo entregador terá por onde começar. O nome da família segue na busca."
        ],
        [
          "Seguir com a ficha para conferir o registro",
          "O vizinho te devolve a caneta. Agora a ficha pode receber o relato da visita."
        ]
      ],
      "effects": [
        "win",
        "delivery"
      ]
    },
    "missing": "A ficha pergunta quem recebeu. O vizinho só soube dizer onde era a soleira. Ainda dá tempo de anotar que você esteve aqui e deixar o recebimento em aberto."
  }
];
