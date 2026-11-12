/* O caderno lê o mesmo estado de sessão que produz a cena. Ele nunca altera um recibo. */
(() => {
  'use strict';
  const atos = ['O balcão', 'Uma casa para trinta e oito', 'A entrega'];
  const objetos = ['carta de Dalva', 'senha branca', 'comanda da cozinha', 'guia de contagem', 'medida do frete', 'autorização de Rui', 'envelope datado', 'via do recibo', 'registro de objetos', 'guia de depósito', 'ordem de conserto', 'ficha de visita'];
  const notas = [
    ['Pedido de Dalva', 'Dalva pediu discrição. Antes da dobra, quem passa consegue ler o carimbo.'],
    ['Quem recebe', 'O número de atendimento está no canhoto. Chapéu e cadeira podem mudar de mãos.'],
    ['Na cozinha de Isaura', 'Duas porções sem pimentão. Isaura autorizou ligar dali pro número da encomenda.'],
    ['Contagem da pilha', 'Há 38 fichas. Trinta e sete trazem meia-lua. A ficha intacta permanece fechada.'],
    ['Entrada do bloco B', 'A porta tem uma largura. Quanto espaço o armário precisa pra virar lá dentro é outra medida.'],
    ['Termos da cabine', 'Rui autorizou a conclusão por escrito. A gravação da voz dele fica na cabine.'],
    ['Prazo individual', 'O prazo de Dalva é quinta. O comunicado coletivo de sexta não dá a ela um dia a mais.'],
    ['Suporte original', 'Quatro fitas unem um rasgo. A linha de carbono continua no verso.'],
    ['Após a reunião', 'A reunião terminou sem votação. Quem trouxe o prato ainda espera na escada.'],
    ['Conteúdo do volume', '37 invólucros marcados. Uma via em separado, na bolsa interna. Conferir sem romper o lacre.'],
    ['Sessão do Íris', 'A bainha está costurada. A madeira que mantém a tela esticada empenou.'],
    ['Contato pendente', 'No antigo endereço há uma caramboleira. A ficha tem lugar pra registrar a visita mesmo quando ninguém recebeu a entrega.']
  ];
  const Roman = i => ['I','II','III'][i];
  function show(screen,ctx){
    const esc=ctx.escape, cases=ctx.cases, id=Number.isInteger(ctx.id)&&ctx.id>=0&&ctx.id<12?ctx.id:0;
    const act=Math.floor(id/4), c=cases[id], session=ctx.session, book=ctx.book||[];
    const past=book.at(-1), record=session?.history?.length?session:past;
    const choices=record?.history||[], cur=choices.at(-1);
    const action=(label,fn)=>({label,do:fn}),go=(label,key)=>action(label,()=>ctx.open(key));
    const button=(label,key,value)=>'<button type="button" data-action="'+key+'" data-value="'+esc(String(value))+'">'+esc(label)+'</button>';
    const li=(body)=>'<li>'+body+'</li>';
    const chain=(x,n)=>'<article class="cd-chain"><small>PASSO '+String(n+1).padStart(2,'0')+'</small><h3>'+esc(x?.choice||'Escolha')+'</h3><p>'+esc(x?.reaction||'')+'</p></article>';
    const outcome=r=>r.win?'Entrega concluída':'Entrega pendente';
    const nav=[go('Voltar ao menu','menu')];
    const view=(kicker,title,markup,actions)=>({kicker,title,html:'<div class="cd">'+markup+'</div>',actions:actions||nav});
    if(screen==='universo')return view('ANTES DA PRIMEIRA ENTREGA','O Arquivo das Escolhas','<p>No Arquivo, uma ficha guarda o som de uma chave. Quem escuta pode jurar que havia uma casa esperando por alguém.</p><p>Você faz as entregas. Dalva é a primeira a te procurar. Ela precisa levar uma carta até o balcão de Inês. O assunto é das duas. A fila vai ter que segurar a curiosidade.</p>',[action('Levar a carta de Dalva',()=>ctx.start(0)),go('Escolher outro capítulo','capitulos')]);
    if(screen==='capitulos'){
      const chapter=(x,i)=>button(String(i+1).padStart(2,'0')+' · '+x.chapter,'start-case',i);
      return view('CADERNO DE ROTA','Capítulos e atos',atos.map((a,n)=>'<details class="cd-act" '+(n===act?'open':'')+'><summary>Ato '+Roman(n)+' · '+esc(a)+'</summary><div>'+cases.slice(n*4,n*4+4).map((x,j)=>chapter(x,n*4+j)).join('')+'</div></details>').join(''),[go('Abrir o histórico','historico'),...nav]);
    }
    if(ctx.id===12 && ['resumo','transicao','documento'].includes(screen)){
      if(screen==='documento')return view('PORTARIA · FOLHA DE SERVIÇO','Recibo da portaria','<p>O porteiro pode contar o que viu no balcão. Quem autoriza a entrada é a moradora.</p>',[...(session?[action('Voltar à partida',ctx.resume)]:[]),go('Consultar histórico','historico')]);
      return view('PORTARIA · EPISÓDIO ESPECIAL','Registro do reencontro',choices.length?choices.map(chain).join(''):'<p>Comece a entrega para consultar esse registro.</p>',[go('Consultar histórico','historico'),go('Voltar aos capítulos','capitulos')]);
    }
    if(screen==='historico'){
      let info=choices.length?'<p>Escolhas da '+(record===session?'tentativa atual':'última tentativa')+'.</p>'+choices.map(chain).join(''):'<p>As escolhas aparecem aqui assim que a primeira entrega começa.</p>';
      const previous=book.length?'<h3>Recibos desta partida</h3><ol>'+book.map(r=>li(esc(cases[r.id]?.title||'A portaria')+' · '+esc(outcome(r)))).join('')+'</ol>':'';
      return view('MEMÓRIA DA PARTIDA','Histórico de escolhas',info+previous,[...(cur?[go('Revisar a última escolha','revisao')]:[]),...(session&&session.phase!=='desfecho'?[action('Retomar partida',ctx.resume)]:session?[action('Voltar ao recibo',ctx.resume)]:[]),...nav]);
    }
    if(screen==='revisao'){
      const pair=choices.slice(-2);
      const body=pair.length?'<p>Foi assim que as escolhas ficaram registradas nessa tentativa.</p>'+pair.map((x,n)=>chain(x,choices.length-pair.length+n)).join(''):'<p>Faça uma entrega para ver aqui sua primeira escolha e a reação que ela provocou.</p>';
      return view('CADERNO · SEQUÊNCIA','Uma escolha puxa a outra',body,[go('Ver todo o histórico','historico'),...nav]);
    }
    if(screen==='documento'){
      const [heading,body]=notas[id];return view('ARQUIVO · DOCUMENTO '+String(id+1).padStart(2,'0'),heading,'<article class="cd-doc"><small>'+esc(objetos[id].toUpperCase())+'</small><h3>'+esc(c.chapter)+'</h3><p>'+esc(body)+'</p><hr><p><b>Pedido do serviço</b><br>'+esc(c.goal)+'</p></article>',[...(session?[action('Voltar à partida',ctx.resume)]:[action('Abrir este capítulo',()=>ctx.start(id))]),go('Capítulos e atos','capitulos')]);
    }
    if(screen==='resumo'){
      const recs=book.filter(r=>r.id>=act*4&&r.id<act*4+4);
      const history=recs.length?recs.map(r=>'<li><b>'+esc(cases[r.id]?.title||'Entrega')+'</b> · '+esc(outcome(r))+'<br>'+esc(r.history?.at(-1)?.reaction||'Recibo fechado.')+'</li>').join(''):'<li>Ainda não há recibos deste ato neste navegador.</li>';
      return view('CADERNO · ATO '+Roman(act),'O que ficou registrado','<p>'+esc(atos[act])+'</p><ul>'+history+'</ul>',[...(act<2?[go('Ver o próximo ato','transicao')]:[]),go('Escolher um capítulo','capitulos'),...nav]);
    }
    if(screen==='transicao'){
      const next=Math.min(act+1,2),desc=['','Uma única chave entrou em muitas fichas. As entregas agora passam pelas portas do Conjunto das Amoras, pela cabine do Íris e pela mesa de corte da oficina.','Chegou a hora de levar o que foi reunido. Entre o palco do Íris e o balcão do Arquivo, cada recibo precisa dizer o que de fato mudou de mãos.'][next];
      return view('PASSAGEM · ATO '+Roman(next),atos[next],'<p>'+esc(desc)+'</p><p><b>Próxima entrega</b><br>'+esc(cases[next*4].title)+'</p>',[action('Entrar no ato '+Roman(next),()=>ctx.start(next*4)),go('Ver o caderno','capitulos')]);
    }
    return view('CADERNO','Caderno de rota','<p>Escolha uma entrega para começar.</p>',[go('Abrir capítulos','capitulos')]);
  }
  window.Caderno={show};
})();
