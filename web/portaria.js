/* Episódio autônomo. Motor puro e determinístico, disponível em arquivo local. */
(() => {
  'use strict';
  const title = 'O nome no recibo';
  const goal = 'Registrar o que dá pra comprovar sobre a entrega antes do fim do turno.';
  const copy = s => JSON.parse(JSON.stringify(s));
  const knows = (s, actor, fact) => s.memory[actor].some(e => e.fact === fact);
  function remember(s, fact, source, actors) {
    if (!s.events.some(e => e.fact === fact)) s.events.push({fact, source});
    for (const actor of actors) {
      if (!knows(s, actor, fact)) s.memory[actor].push({fact, source});
    }
  }
  function start() {
    return {scene:'P01', reaction:'', events:[], memory:{entregador:[], porteiro:[], lia:[]}, receiver:null,
      desk:null, bookAvailable:true, resolved:false, awkward:false, initiative:null, log:[], evidence:null, end:null};
  }
  // Pré-condições asseguram acesso à informação. Utilidades expressam preferências entre ações viáveis.
  function decide(s) {
    if (s.resolved) return {action:'rotina',scores:{rotina:1}};
    const clerk = fact => knows(s,'porteiro',fact);
    const concern = clerk('contestacao') && clerk('porteiro_assinou');
    const publicDesk = s.desk === 'janela';
    const scores = {rotina:1};
    if (concern && s.bookAvailable) scores.livro = 60 + (publicDesk ? -35 : 25);
    if (concern) scores.bilhete = 48 + (publicDesk ? 42 : 0);
    if (clerk('lia_assinou') && clerk('contestacao')) scores.chamar_lia = 72;
    if (clerk('saiu_com_pacote') && clerk('contestacao')) scores.pedir_comprovante = 68;
    const action = Object.keys(scores).reduce((best,k)=>scores[k]>scores[best]?k:best,'rotina');
    return {action,scores};
  }
  function encounter(s) {
    const decision = decide(s);
    s.initiative = decision.action;
    s.log.push({decision:decision.action,scores:decision.scores,desk:s.desk,
      known:s.memory.porteiro.map(e=>e.fact)});
    if (decision.action==='bilhete') remember(s,'bilhete_recebido','bilhete passado em mãos',['entregador','porteiro']);
    s.scene = {livro:'P05L',bilhete:'P05B',chamar_lia:'P05M',pedir_comprovante:'P05T',rotina:'P05R'}[decision.action];
  }
  function finish(s, id, win, text, awkward=false) {
    s.scene = 'P09'; s.end = {id,win}; s.resolved = win; s.awkward ||= awkward; s.reaction = text;
    remember(s,win?'relato_protocolado':'turno_encerrado_sem_prova','protocolo do turno',['entregador']);
  }
  const nodes = {
    P01: ['Primeira passagem','Portaria · 14h12','neutro',
      'O interfone do 402 chama, chama. Pela etiqueta, só Lia ou o funcionário de plantão pode assinar pelo pacote. O porteiro abaixa o rádio. “Toca de novo. Ela tá com o pai, demora um pouquinho.” Atrás de você, alguém buzina. A bicicleta ainda tá na rampa.',
      ['Tocar outra vez e esperar Lia','Pedir que o porteiro assine por Lia','Registrar a tentativa e voltar com o pacote']],
    P02: ['O papel que fica','Entrega · 14h12','confiante',
      'Dá tempo de conferir o documento no celular antes de sair. Até o fim do dia, o papel dessa entrega vai estar embaixo de outros vinte.',
      ['Conferir o documento antes de sair','Guardar o celular e seguir a rota']],
    P03: ['Uma linha em branco','Celular · fim da tarde','desconfiado',
      'Na volta à rua do prédio, chega um aviso da central. No painel consta “entregue”. Quem recebeu? O campo ficou em branco. Você tem até o fim do turno pra anexar o que sabe. Na guarita, o aviso ainda não chegou.',
      ['Encaminhar o aviso ao telefone da guarita','Ler o aviso e guardar o celular']],
    P04: ['Duas janelas, uma guarita','Condomínio · 17h40','neutro',
      'O balcão de dentro está vazio. Do outro lado, a síndica confere as contas na janela da administração. O porteiro atende dos dois lados. Atrás dele, na prateleira, fica o livro do turno.',
      ['Entrar pelo balcão vazio','Pedir atendimento junto à síndica']],
    P05L: ['O livro do turno','Porteiro · balcão','desconfiado',
      'Sem ninguém por perto, ele abre o livro numa página amassada. “Cê me pediu pra assinar, lembra? Agora veio essa reclamação e a letra é minha. Aqui eu pus 14h12. Que hora tá no seu recibo?” A ponta da caneta para embaixo do nome dele.',
      ['Comparar a hora do recibo com a do livro','Perguntar se alguém retirou o pacote depois','Agradecer e seguir sem conferir']],
    P05B: ['O bilhete dobrado','Porteiro · reencontro','desconfiado',
      'O livro fica fechado. Por baixo da sua mão, ele passa um bilhete. “Às seis eu passo as chaves. Se cê voltar, a gente confere sem plateia.” O papel cabe na capa do celular. Ainda falta a última entrega de hoje.',
      ['Guardar o bilhete e voltar às 18h','Pedir que ele abra o livro agora','Guardar o bilhete e continuar a rota']],
    P05M: ['A assinatura é dela','Porteiro · reencontro','confiante',
      '“Eu vi a dona Lia descer. Querem saber quem recebeu? Ela pode contar.” Ele aponta o interfone na sua direção. “Fala você. Sua voz ela já conhece.”',
      ['Chamar Lia para confirmar o recebimento','Perguntar o que o porteiro viu','Dizer que o porteiro assinou e encerrar']],
    P05T: ['Você saiu com o pacote','Porteiro · reencontro','desconfiado',
      '“Cê saiu daqui com o pacote debaixo do braço. Isso eu vi. Agora, que hora ficou no seu celular?” Ele afasta o livro e abre espaço no balcão.',
      ['Mostrar o comprovante da tentativa','Pedir que confirme apenas o que viu','Dizer que a moradora recusou a entrega']],
    P05R: ['Um atendimento comum','Porteiro · reencontro','neutro',
      'Ele levanta o trinco e aponta o interfone. “Mais uma pro 402?” Segura a escala na mão. Por enquanto, a reclamação só chegou no seu celular.',
      ['Mostrar ao porteiro o aviso da central','Usar a via do meu celular','Encerrar sem falar no aviso']],
    P06Q: ['Quem pegou depois?','Porteiro · livro aberto','desconfiado',
      'O porteiro corre a unha pela margem. “Aqui eu anotei a hora que você me entregou. Depois fui trocar a lâmpada da escada. Se alguém veio buscar, eu não vi.”',
      ['Conferir só a passagem pela portaria','Escrever que Lia retirou depois']],
    P06B: ['Depois da última entrega','Guarita · 18h','cansado',
      'A síndica já saiu. O porteiro segura a folha com duas canecas de boca pra baixo. “Olha a letra aqui. É minha. Bate com a sua via?” Ainda dá tempo de conferir antes da troca de chaves.',
      ['Comparar o livro com o recibo','Ir embora antes de conferir']],
    P06C: ['A hora no celular','Guarita · documentos','confiante',
      'No livro, 14h12. No recibo, também. Os dois dizem que o porteiro recebeu o pacote ali. No campo da retirada pela moradora, nem um rabisco. A central abre uma linha pro seu relato.',
      ['Protocolar o recebimento pelo porteiro','Afirmar que Lia levou o pacote para casa']],
    P06M: ['A voz da moradora','Interfone · Lia','ironia',
      'Lia atende no segundo toque. “É a Lia, do 402. Recebi em mãos, pode anotar. Desci tão depressa que voltei com o chinelo do avesso. Essa parte pode pular.”',
      ['Anexar a confirmação de Lia','Dizer que o porteiro assinou']],
    P06T: ['O que mostra a tela','Guarita · celular','confiante',
      '“Tentativa — 14h12.” Agora o porteiro também vê a hora. O comprovante não diz por que ninguém atendeu. O pacote voltou pra base com a etiqueta inteira.',
      ['Anexar a tentativa e corrigir o painel','Anotar que Lia recusou o pacote']],
    P06W: ['Até onde a vista alcança','Guarita · testemunha','neutro','', ['Registrar só o que o porteiro viu','Acrescentar o que ele não viu']],
    P06P: ['O documento particular','Celular · comprovante','confiante','', ['Registrar só o que a via comprova','Encerrar sem protocolar']],
    P07: ['A rota continua','Rua · bilhete no bolso','cansado',
      'Do outro lado da rua já vem o ônibus da sua próxima entrega. Sobra um minuto pra abrir o recibo no celular. Se você embarcar com o aplicativo fechado, o turno acaba sem o seu relato.',
      ['Abrir meu recibo e responder por escrito','Deixar o bilhete guardado e embarcar']],
    P09: ['Fim de turno','Protocolo · desfecho','neutro','',[]]
  };
  const proof = {
    porter:'Às 14h12, quem assinou o recibo foi o porteiro. O papel comprova que a caixa chegou à guarita. Pra dizer que Lia retirou, precisa de outro registro.',
    resident:'Lia assinou às 14h12. O recibo confirma que você entregou o pacote direto pra ela.',
    returned:'No comprovante ficou a tentativa das 14h12. Você voltou pra base com o pacote. Ninguém atendeu. Dali não dá pra tirar uma recusa.'
  };
  function view(s) {
    const [heading,speaker,face,body,options] = nodes[s.scene];
    let text = body;
    if (s.scene === 'P06W') text = s.receiver === 'resident'
      ? '“Eu vi a dona Lia voltar pro elevador com a caixa. Agora, o que ela falou na porta, só vocês dois ouviram.” Ele aceita dar o nome como testemunha da entrega em mãos.'
      : '“Da primeira vez, tocou. Você pegou o pacote e virou a esquina com ele. Por que ninguém atendeu? Aí já não sei.” Ele deixa registrar só o que viu.';
    let buttons = options.slice();
    if (s.scene === 'P06P') text = proof[s.receiver];
    if (s.scene === 'P05R' && knows(s,'entregador','via_conferida'))
      buttons[1]='Protocolar agora a via que já conferi';
    if (s.scene === 'P07' && !knows(s,'entregador','bilhete_recebido')){
      text='O galpão da central já está fechando. Aqui na esquina ainda dá pra abrir o documento no aplicativo e contar como foi a primeira passagem.';
      buttons[1]='Seguir sem protocolar';
    }
    const ended = s.scene === 'P09';
    return {id:s.scene,title:ended?(s.end.win?'O relato ficou':'O turno fechou'):heading,speaker,
      reaction:s.reaction,prompt:text,text:[s.reaction,text].filter(Boolean).join('\n\n'),options:buttons,
      expression:ended?(s.awkward?'constrangido':s.end.win?'aliviado':'cansado'):(s.scene==='P07'&&s.awkward?'panico':face),
      ended,win:ended?s.end.win:null,awkward:s.awkward,endingId:ended?s.end.id:null};
  }
  function choose(state,i) {
    if (!Number.isInteger(i) || i<0 || i>=view(state).options.length) return state;
    const s = copy(state), previous=s.scene;
    s.reaction = '';
    const next=(scene,text)=>{s.scene=scene;s.reaction=text};
    const both=['porteiro','entregador'];
    const evidence=kind=>{s.evidence=kind;remember(s,kind,'conferência presencial',both)};
    switch(previous){
      case 'P01':{
        s.receiver=['resident','porter','returned'][i];
        if(i===0){
          remember(s,'lia_assinou','assinatura diante do entregador e do porteiro',['lia',...both]);
          next('P02','Lia desce com a chave presa entre os dedos. Assina e pega o pacote. “Obrigada por esperar. Meu pai ainda acorda com esse interfone.” O porteiro vê Lia voltar com a encomenda.');
        }else if(i===1){
          remember(s,'pediu_assinatura','pedido do entregador',both); remember(s,'porteiro_assinou','assinatura do próprio funcionário',both);
          next('P02','“É o meu nome que vai aparecer?” Você vira a tela. O porteiro testa a caneta no canto do livro, assina o recibo e puxa o pacote pra dentro. A encomenda fica com ele.');
        }else{
          remember(s,'tentativa_1412','comprovante particular do aplicativo',['entregador']);remember(s,'saiu_com_pacote','saída observada da guarita',both);
          next('P02','O celular vibra. Tentativa registrada às 14h12. Pelo vidro, o porteiro vê você sair com o pacote debaixo do braço. Só você viu a hora na tela.');
        }break;}
      case 'P02':
        if(i===0){remember(s,'via_conferida','consulta ao celular',['entregador']); next('P03',proof[s.receiver]);}
        else next('P03','O celular volta para o bolso. O documento fica guardado no histórico da entrega.');
        remember(s,'contestacao','aviso enviado pela central ao entregador',['entregador']);break;
      case 'P03':
        if(i===0){remember(s,'contestacao','leitura do aviso encaminhado à guarita',['porteiro']);next('P04','Chega a confirmação de leitura da guarita. Agora o porteiro sabe que a central está questionando a entrega.');}
        else next('P04','Você apaga a tela. O aviso fica só no seu celular.');break;
      case 'P04':
        s.desk=i===0?'interno':'janela';s.reaction=i===0?'O porteiro te atende no balcão vazio.':'A síndica empilha as contas junto à janela. Dá para ouvir até o risco da caneta dela.';
        encounter(s);break;
      case 'P05L':
        if(i===0){evidence('livro_e_recibo');next('P06C','Você encosta a tela na margem do livro.');}
        else if(i===1) next('P06Q','Ele vira a página à procura de outra assinatura.');
        else next('P07','Você agradece. Ele recolhe a caneta e volta ao balcão.');break;
      case 'P05B':
        if(i===0){remember(s,'retorno_marcado','bilhete entregue em mãos',both);s.desk='interno';next('P06B','Você encaixa a última entrega no caminho de volta. Ao passar de novo pela guarita, sente o bilhete na capa do celular.');}
        else if(i===1){s.awkward=true;next('P07',state.desk==='janela'?'A síndica tira os óculos. “Essa conversa também precisa da minha rubrica?” O porteiro guarda o livro. Você sente a orelha esquentar.':'Ele fecha a gaveta vazia. “Com que livro?” Você ainda tem a via do aplicativo.');}
        else next('P07','Você dobra o bilhete sem prometer que volta. A janela da guarita fica para trás.');break;
      case 'P05R':
        if(i===0){remember(s,'contestacao','aviso mostrado pelo entregador no reencontro',['porteiro']);s.reaction='Ele apoia os óculos no nariz e lê o aviso até o fim.';encounter(s);}
        else if(i===1 && knows(s,'entregador','via_conferida'))
          finish(s,'via_particular',true,'O porteiro volta à escala. Você anexa a via que já conferiu. '+proof[s.receiver]);
        else if(i===1)next('P06P','O porteiro volta à escala. Você abre os documentos no celular.');
        else finish(s,'sem_relato',false,'Ninguém apresentou documento à central. O campo de quem recebeu continua em branco.');break;
      case 'P05M':
        if(i===0){remember(s,'lia_confirmou','resposta de Lia pelo interfone',['lia',...both]); next('P06M','Ele aperta o botão do 402 e passa o interfone pra você.');}
        else if(i===1)next('P06W','O porteiro encosta o interfone no gancho e olha o elevador.');
        else finish(s,'nome_errado',false,'Seu relato dá o nome do porteiro. No recibo, quem assinou foi Lia. A central devolve o documento.');break;
      case 'P05T':
        if(i===0){remember(s,'tentativa_1412','leitura do comprovante mostrado pelo entregador',['porteiro']);next('P06T','Ele aproxima o rosto da tela para ler o horário.');}
        else if(i===1)next('P06W','O celular fica no seu bolso. Ele conta o que viu do balcão.');
        else finish(s,'recusa_inventada',false,'No seu relato ficou “recusado pela moradora”. Ninguém chegou a falar com ela. A contestação continua aberta.');break;
      case 'P06Q': case 'P06B':
        if(i===0){evidence('livro_e_recibo');next('P06C','Você pede ao porteiro pra segurar a página aberta.');}
        else if(previous==='P06B')finish(s,'retorno_interrompido',false,'Você voltou na hora combinada. O livro fecha antes que vocês comparem as vias, e o relato fica em branco.');
        else finish(s,'retirada_inventada',false,'O relato diz que Lia retirou o pacote. Em nenhum dos documentos aparece o nome de quem saiu da guarita com ele.');break;
      case 'P06C': case 'P06M': case 'P06T': case 'P06W': case 'P06P':{
        const endings={
          P06C:['livro_protocolado','O nome do porteiro entra no protocolo. A hora bate nas duas vias. Ele guarda o livro. Se Lia retirou a caixa depois, continua em aberto.','retirada_inventada','A central pede a assinatura de retirada. Nenhuma das duas vias mostra a encomenda nas mãos de Lia.'],
          P06M:['lia_confirmada','A confirmação de Lia entra no protocolo. Na folha do turno, a participação do porteiro cabe numa linha. Foi ele que chamou o 402.','nome_errado','A central devolve a ficha. Lia confirmou a entrega, mas o relato atribuiu a assinatura à guarita.'],
          P06T:['tentativa_corrigida','O registro passa de “entregue” a “tentativa”. O pacote segue disponível para uma nova entrega.','recusa_inventada','O formulário volta com uma pergunta. Quem ouviu Lia recusar? Naquele horário, ninguém chegou a falar com ela.'],
          P06W:['testemunho_limitado','A central recebe o depoimento. Tem o nome do porteiro e o que ele viu do balcão. Dessa vez, ninguém precisou adivinhar o resto.','testemunho_excedido','O porteiro lê a declaração e recusa a última linha. Aquilo aconteceu fora do alcance da guarita.'],
          P06P:['via_particular','A central aceita a via e corrige o campo. Agora o que aparece no painel bate com o documento.','sem_relato','O turno fecha antes que o documento seja anexado. O painel fica do mesmo jeito.']
        };const e=endings[previous];finish(s,i===0?e[0]:e[2],i===0,i===0?e[1]:e[3]);break;}
      case 'P07':
        if(i===0)next('P06P','Você encosta a bicicleta no meio-fio e procura o documento da primeira passagem.');
        else finish(s,'sem_relato',false,knows(s,'entregador','bilhete_recebido')?'Você segue viagem. A guarita fica para trás. O bilhete não virou prova de quem recebeu o pacote.':'Você segue viagem. A central mantém a contestação em aberto.');break;
    }
    return s;
  }
  const demo = {
    livro:[1,0,0,0,0,0], bilhete:[1,0,0,1,0,0,0], moradora:[0,0,0,0,0,0],
    tentativa:[2,0,0,0,0,0], desconhece:[1,0,1,0,0,0,0]
  };
  globalThis.PortariaIA={title,goal,start,view,choose,decide,demo};
})();
