// Aplicado uma vez sobre a base preservada; a fonte canônica passa a ser web/.
const fs=require('node:fs');
let a=fs.readFileSync('web/app.js','utf8').replace(/\r\n/g,'\n');
function replace(x,y){if(!a.includes(x))throw Error('Âncora ausente: '+x.slice(0,70));a=a.replace(x,y);}
replace("const gameScreens=['entrada','escolha','consequencia','desfecho'];","const gameScreens=['entrada','escolha','consequencia','desfecho','vinculo','transporte'];\n  let world=Continuidade.fresh(),saveBlocked=false,restoreMenu=false;\n  const audioDefaults={music:true,effects:true,volume:.55,haptics:'results'};\n  let sound={...audioDefaults};");
replace('({version:1,screen,profile','({version:2,world,sound,screen,profile');
replace("if(!s)return null;","if(!s)return null;\n    if(s.schema===2){\n      if(!Number.isInteger(s.id)||s.id<0||s.id>12||!gameScreens.includes(s.phase)||!Array.isArray(s.history)||s.history.length>100||!s.state||!Number.isFinite(s.metrics?.started)||!Array.isArray(s.bridges)||s.bridges.some(k=>!Continuidade.scenes[k]))throw Error('registro inválido');\n      if(s.id===12){PortariaIA.view(s.state)}else if(!['prep','social','event','delivery','repair','end'].includes(s.state.step))throw Error('cena inválida');\n      if(s.history.some(h=>typeof h.choice!=='string'||typeof h.reaction!=='string'))throw Error('histórico inválido');\n      return s;\n    }");
replace('const raw=!rehearsal&&sessionStorage.getItem(storageKey);',"const raw=!rehearsal&&(localStorage.getItem(storageKey)||sessionStorage.getItem(storageKey));");
replace("if(d?.version!==1)throw Error('formato desconhecido');", "if(![1,2].includes(d?.version))throw Error('formato desconhecido');\n      if(d.version===2){if(!d.world||!Array.isArray(d.world.log)||!Array.isArray(d.world.rumors)||['facts','knowledge','relations','favors','promises'].some(k=>!d.world[k]||typeof d.world[k]!=='object'||Array.isArray(d.world[k])))throw Error('memória inválida');world=d.world;sound={...audioDefaults,music:d.sound?.music!==false,effects:d.sound?.effects!==false,volume:Number.isFinite(d.sound?.volume)?Math.max(0,Math.min(1,d.sound.volume)):.55,haptics:['off','results','all'].includes(d.sound?.haptics)?d.sound.haptics:'results'};}\n      restoreMenu=true;");
replace("screen='menu';session=null;sessionNotice='O registro anterior desta aba não pôde ser lido. Você pode começar outra entrega.';", "screen='menu';session=null;saveBlocked=true;sessionNotice='Não foi possível ler o progresso anterior. Ele foi preservado. Você pode exportá-lo antes de confirmar uma nova partida.';");
replace('if(rehearsal)return;\n    try{sessionStorage.setItem(storageKey,JSON.stringify(saved()))}',"if(rehearsal)return;\n    try{if(!saveBlocked){localStorage.setItem(storageKey,JSON.stringify(saved()));sessionNotice='';}}" );
replace("function open(id){", "function open(id){if(screen==='transporte'&&id!==screen)Feedback.cancel();");
replace("session={id,state:","session={schema:2,uid:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),bridges:Continuidade.queue(world,id),bridgeIndex:0,bridgeReturn:'escolha',bridgeResponse:null,cargo:null,support:false,id,state:");
replace("if(screen==='entrada')phase('escolha');", "if(screen==='entrada'){if(session.bridges?.length)phase('vinculo');else beginTransport();}");
replace("if(result().ended){const at=clock();", "if(result().ended){if(!session.completed){session.completed=true;Feedback.fire(result().win?'win':'loss');}const at=clock();");
replace("book.push({id:cn()", "if(!book.some(r=>r.uid===session.uid&&r.uid))book.push({uid:session.uid,id:cn()");
replace("if(shift)shift.receipts.push", "if(shift&&!shift.receipts.some(r=>r.id===cn()))shift.receipts.push");
replace("else phase('escolha');\n    }\n  }", "else {if(special()&&session.state.scene==='P04'&&Continuidade.knows(world,'porteiro','parentesco')&&!session.returnLie){session.returnLie=true;session.bridges=['cobrar_parentesco'];session.bridgeIndex=0;session.bridgeReturn='escolha';phase('vinculo');Feedback.fire('reveal');}else phase('escolha');}\n    }\n  }");
replace('session.state=next;session.line=reaction;',"if(!special()){Continuidade.baseChoice(world,cn(),from,index,next);if(from==='prep'&&session.support){next.ready=true;reaction+=' Você também conta com a conferência feita junto de quem ajudou antes.';}if(next.step==='end'&&session.cargoRisk){next.win=false;reaction+=' A carga chegou sem conferência depois do impacto. A entrega fica pendente.';}}\n    session.state=next;session.line=reaction;");
replace('session.history.push({choice,index,from',"session.history.push({decisionId:cn()+':'+from+':'+index,choice,index,from");
replace("const id=cn(),c=kcase(),v=", "if(screen==='vinculo'){bridgeView();return}if(screen==='transporte'){present('Percurso','Carga em movimento',scenePlate(cn())+'<fvqe-transporte></fvqe-transporte>',[act('Pausar e voltar ao menu','menu','subtle')]);return;}\n    const id=cn(),c=kcase(),v=");
replace("const fmt=t=>", "if(!rehearsal)return '';\n    const fmt=t=>");
replace("$('stage').setAttribute('data-screen',screen);save();", "$('stage').setAttribute('data-screen',screen);\n    Feedback.configure(sound);Feedback.context(['pausa','config','acessibilidade'].includes(screen)?'paused':screen==='turnofim'?'ending':screen==='vinculo'&&Continuidade.scenes[session?.bridges?.[session.bridgeIndex]]?.requires?'confusion':session&&gameScreens.includes(screen)?'route':'opening');save();");
replace("opt(session?'Iniciar outra entrega':'Iniciar jogo',()=>introduce('ajuda'))", "opt('Nova partida',newGame),...(saveBlocked?[opt('Exportar progresso preservado',exportSave)]:[])");
replace("fileTab('Preferências','Nesta sessão')+para('Suas preferências valem enquanto esta aba estiver aberta. Para jogar pelo teclado, use Tab e Enter.')", "fileTab('Preferências','Neste navegador')+settingsHtml()+para('As preferências ficam neste navegador. Para jogar pelo teclado, use Tab e Enter.')");
replace("const tab=fileTab(screen", "if(screen==='historico'&&world.log.length)v.html+='<h2>Lembranças entre entregas</h2>'+world.log.map(e=>'<article class=\"memory-note\">'+para(e.choice)+para(e.reaction)+'</article>').join('');\n      const tab=fileTab(screen");
replace("summary,[opt('Jogar novo turno'", "summary+memoriesHtml(),[opt('Jogar novo turno'");
replace("function handle(e){", `function exportSave(){try{const raw=localStorage.getItem(storageKey)||sessionStorage.getItem(storageKey)||'';const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([raw],{type:'application/json'}));link.download='progresso-preservado.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000)}catch{sessionNotice='O navegador não permitiu acessar o registro.';draw()}}
  function newGame(){
    if((session||book.length||saveBlocked)&&!confirm('Nova partida substitui o progresso, as escolhas e o crachá. Suas configurações ficam. Quer começar de novo?'))return;
    if(saveBlocked){try{const raw=localStorage.getItem(storageKey);if(raw)localStorage.setItem(storageKey+'-recuperacao-'+Date.now(),raw)}catch{sessionNotice='Não foi possível preservar o registro. Exporte-o antes de tentar novamente.';draw();return;}}
    saveBlocked=false;sessionNotice='';world=Continuidade.fresh();session=null;book=[];shift=null;shiftSequence=0;profile={...initialProfile};draft={...profile};introduce('ajuda');
  }
  function settingsHtml(){return '<div class="audio-settings"><label><span>Música</span><input type="checkbox" data-sound="music" '+(sound.music?'checked':'')+'></label><label><span>Efeitos sonoros</span><input type="checkbox" data-sound="effects" '+(sound.effects?'checked':'')+'></label><label>Volume<input type="range" min="0" max="1" step=".05" value="'+sound.volume+'" data-sound="volume"></label><label>Vibração<select data-sound="haptics">'+[['off','Desligada'],['results','Somente resultados'],['all','Todos os efeitos']].map(([k,l])=>'<option value="'+k+'" '+(sound.haptics===k?'selected':'')+'>'+l+'</option>').join('')+'</select></label></div>';}
  function memoriesHtml(){return '<h2>O que ficou pelo caminho</h2>'+world.log.slice(-8).map(e=>para(e.reaction)).join('')+'<h3>Combinados</h3>'+para(Object.entries(world.promises).map(([k,v])=>({sigilo:'Discrição com a carta',comida:'Voltar para comer',referencia:'Referência de Inês',canhoto:'Canhoto do rapaz',marmitas:'Pedido de marmitas',copia:'Cópia para o vizinho'}[k]||'Combinado')+': '+v).join(' · ')||'Nenhuma promessa registrada.')+para(Object.entries(world.favors).map(([k,v])=>(Atelier.cast[k]||k)+': favor '+v).join(' · ')||'Nenhum favor pendente.');}
  function beginTransport(){if([2,8,9].includes(cn())&&!session.cargo){phase('transporte');return;}phase('escolha');}
  function bridgeView(){
    const key=session.bridges[session.bridgeIndex],s=Continuidade.scenes[key];if(!s){beginTransport();return;}
    const response=session.bridgeResponse;
    present('Encontros · '+title(cn()),s.title,actorImage({actor:cn()===8&&key==='avaria'?'mulher':s.actor,cue:response?'atento':'curioso'})+para(response||s.text),response?[opt('Continuar',()=>{session.bridgeResponse=null;session.bridgeIndex++;if(session.bridgeIndex<session.bridges.length){phase('vinculo');if(Continuidade.scenes[session.bridges[session.bridgeIndex]].requires)Feedback.fire('reveal');}else beginTransport();})]:s.choices.map(c=>opt(c.label,()=>{
      const token=session.uid+':'+key+':'+session.bridgeIndex;
      const effect=Continuidade.apply(world,key,c.id,token);if(!effect)return;
      session.support ||= !!effect.support;session.state.awkward ||= !!effect.awkward;session.cargoRisk ||= !!effect.cargoRisk;
      if(effect.repairCargo)session.cargoRisk=false;
      session.bridgeResponse=effect.text;session.history.push({decisionId:key+':'+c.id,choice:c.label,reaction:c.text,from:'vinculo',at:clock()});draw();
    })));
  }
  document.addEventListener('cargo-complete',e=>{if(screen!=='transporte'||session.cargo)return;session.cargo=e.detail;Continuidade.remember(world,'carga:'+session.uid,e.detail.condition,[],'transporte');session.history.push({decisionId:'transporte:'+e.detail.strategy,choice:'Transportar: '+({junto:'tudo junto',dividir:'dividir a carga',apoio:'improvisar apoio'}[e.detail.strategy]),reaction:e.detail.impacts?'A carga sofreu '+e.detail.impacts+' impactos.':'A carga chegou preservada.',from:'transporte',at:clock()});
    // A marmita é explicada depois de identificar as porções, no recibo; avarias das outras cargas exigem decisão.
    if(e.detail.impacts&&cn()!==2){session.bridges=['avaria'];session.bridgeIndex=0;phase('vinculo')}else phase('escolha');
  });
  document.addEventListener('change',e=>{const k=e.target.dataset.sound;if(!k)return;sound[k]=['music','effects'].includes(k)?e.target.checked:k==='volume'?Number(e.target.value):e.target.value;Feedback.configure(sound);save();});
  function handle(e){`);
// Marmita story only after the objective succeeded, preserving correct recipients and ingredients.
replace("if(result().ended){if(!session.completed)","if(result().ended){if(cn()===2&&session.state.win&&session.cargo?.impacts&&!session.marmitaExplained){session.marmitaExplained=true;session.bridges=['marmita'];session.bridgeIndex=0;session.bridgeReturn='consequencia';phase('vinculo');return;}if(!session.completed)");
replace("function beginTransport(){if([2,8,9]", "function beginTransport(){if(session.bridgeReturn==='consequencia'){session.bridgeReturn='escolha';phase('consequencia');return;}if([2,8,9]");
replace("if(rehearsal)window.FVQE", "if(rehearsal||new URLSearchParams(location.search).get('teste')==='1')window.FVQE");
replace("abrir:open,iniciar:start,escolher:choose,avancar:advance,estado:()=>clone(saved()),", "abrir:open,iniciar:start,escolher:choose,avancar:advance,nova:newGame,turno:startShift,proxima:nextShift,estado:()=>clone(saved()),");
replace('  draw();\n})();', "  if(restoreMenu)screen='menu';\n  draw();\n})();");
replace("open('entrada');", "open('entrada');Feedback.fire(id===12?'knock':'message');");
const texts={
 'Memória desta aba':'Memória neste navegador',
 'Se o navegador conseguir salvar, você pode atualizar esta aba e retomar do mesmo ponto.':'O progresso fica neste navegador e aparelho. Feche e volte ao mesmo endereço para continuar. Limpar os dados do site pode apagar a partida.',
 'Pode voltar ao menu. Sua entrega fica aqui na aba, no ponto em que você parou.':'Pode voltar ao menu ou fechar a página. O progresso fica neste navegador. Um transporte interrompido recomeça do início do trecho.',
 'Suas escolhas ficaram no caderno desta aba.':'Suas escolhas ficaram no caderno deste navegador.',
 'Ver recibos da sessão':'Ver recibos da partida',
 'Responsável acadêmico: Christian.':'Responsável acadêmico: Christian Cândia Hollnagel.',
 'Roteiro, programação, composição visual e testes com assistência de IA. Créditos técnicos e registro de produção acompanham o pacote.':'Base Visual 1.2 preservada. Atualização de roteiro, programação, testes e composição musical por síntese com assistência de IA (Codex). Durante a partida, personagens usam falas escritas e regras locais, sem IA. Música e efeitos originais sintetizados para este projeto, sem samples externos. Créditos e fontes de produção acompanham o projeto.',
 'O turno foi pensado para durar de 3 a 5 minutos. Você decide quando avançar.':'As escolhas acompanham você nas próximas entregas. Você decide quando avançar.'
};for(const [x,y]of Object.entries(texts))a=a.replaceAll(x,y);
fs.writeFileSync('web/app.js',a);
let html=fs.readFileSync('web/index.html','utf8').replace('</head>','<link rel="stylesheet" href="atualizacao.css"></head>').replace('<script src="app.js">','<script src="continuidade.js"></script><script src="feedback.js"></script><script src="transporte.js"></script><script src="app.js">');fs.writeFileSync('web/index.html',html);

