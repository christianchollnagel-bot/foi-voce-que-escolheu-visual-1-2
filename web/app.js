(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storageKey='fvqe-entregador-v1';
  const initialProfile={base:'a',face:'original',skin:'original',hair:'original',outfit:'original',headwear:'original',pin:'original',mount:'original',trim:'original',name:'',pronouns:''};
  const shifts=[[0,4,8],[1,5,9],[2,6,10],[3,7,11]];
  let shift=null,shiftSequence=0;
  const gameScreens=['entrada','escolha','consequencia','desfecho'];
  const cadernoScreens=['universo','capitulos','historico','revisao','resumo','transicao','documento'];
  const expressionLabels=Object.fromEntries(Object.entries(Atelier.cues).map(([k,v])=>[k,v[0]]));
  const steps={prep:'O primeiro gesto',social:'O encontro',event:'Um imprevisto',delivery:'A entrega',repair:'Última conferência',end:'Recibo'};
  const encounters=[
    'Inês termina um atendimento no guichê da ponta. A fila se aperta em volta de Dalva. Por onde dá pra chegar ao balcão?',
    'O chapéu já está em outra mão. Quem espera o aviso continua ali. Como chamar a pessoa certa?',
    'O vapor levanta as pontas do papel. Isaura ainda espera uma resposta. Pra onde vão as marmitas?',
    'Dimas vê a última ficha separada e chega mais perto. E agora, como fica a pilha?',
    'Debaixo do armário, o homem quer saber onde apoiar a quina. Os outros dois olham pra você.',
    'Do fundo da sala, alguém pede um teste. Rui ainda está na cabine com as duas caixas.',
    'Cida corta o tecido. Dalva continua com o pé no pedal. Pra ouvir você, uma das duas vai ter que parar.',
    'O recibo faz uma barriga no meio da mesa. Cida afasta a costura para abrir espaço.',
    'A mulher está no primeiro degrau. Entre vocês ainda passa gente levando as cadeiras da reunião.',
    'A caixa deve cruzar o balcão de mão em mão. A encarregada já espera do outro lado.',
    'A criança mantém a raposa contra a luz, enquanto Inês procura a ponta da bainha. Alguém precisa segurar a tela.',
    'A ficha ainda está com você. Debaixo da árvore, o vizinho espera saber se a visita acabou.'
  ];
  const chapterNames=['I · O balcão','II · Uma casa para trinta e oito','III · A entrega'];
  let screen='abertura',profile={...initialProfile},draft={...initialProfile},prefs={large:false,contrast:false,motion:false},session=null,book=[],shownExpression='neutro',configReturn='menu',avatarReturn='universo',sessionNotice='',lastPhysicalAction=-Infinity,lastPoint=null;
  let intro={page:0,origin:'menu',target:'menu',id:0};
  let currentActions=[];
  const clock=()=>performance.timeOrigin+performance.now();
  const clone=o=>JSON.parse(JSON.stringify(o));
  const rehearsal=window.FVQE_ENSAIO===true||new URLSearchParams(location.search).get('ensaio')==='1';
  const saved=()=>({version:1,screen,profile,draft,prefs,session,book,shift,shiftSequence,shownExpression,configReturn,avatarReturn,intro});
  function cleanProfile(p){
    return Object.fromEntries(Object.entries(initialProfile).map(([k,defaultValue])=>[k,typeof p?.[k]==='string'?p[k].slice(0,k==='pronouns'?32:48):defaultValue]));
  }
  function sameChoice(savedLabel,currentLabel){
    if(typeof savedLabel!=='string')return false;
    if(savedLabel===currentLabel)return true;
    return Object.hasOwn(window.ROTULOS_V1||{},savedLabel)&&window.ROTULOS_V1[savedLabel]===currentLabel;
  }
  function restoreAttempt(s){
    if(!s)return null;
    if(!Number.isInteger(s.id)||s.id<0||s.id>12||!gameScreens.includes(s.phase)||!Array.isArray(s.history)||s.history.length>16||!Number.isFinite(s.metrics?.started))throw Error('tentativa inválida');
    const isPortaria=s.id===12,c=CASOS[s.id];
    let replay=isPortaria?PortariaIA.start():{step:'prep',ready:false,awkward:false};
    for(const h of s.history){
      const labels=isPortaria?PortariaIA.view(replay).options:options(c,replay);
      if(!Number.isInteger(h?.index)||h.index<0||h.index>=labels.length||!sameChoice(h.choice,labels[h.index])||typeof h.reaction!=='string')throw Error('registro inválido');
      replay=isPortaria?PortariaIA.choose(replay,h.index):run(c,replay,h.index)[0];
    }
    const ended=isPortaria?PortariaIA.view(replay).ended:replay.step==='end';
    if(s.phase==='entrada'&&s.history.length||s.phase==='consequencia'&&!s.history.length||s.phase==='desfecho'&&!ended||s.phase==='escolha'&&ended)throw Error('fase inválida');
    const cleanMetrics={started:s.metrics.started};
    for(const k of ['firstChoice','firstConsequenceDOM','firstConsequenceFrame','ending'])cleanMetrics[k]=Number.isFinite(s.metrics[k])?s.metrics[k]:null;
    return {...s,state:replay,metrics:cleanMetrics,line:s.history.at(-1)?.reaction||'',expression:Object.hasOwn(expressionLabels,s.expression)?s.expression:'neutro',inspections:Array.isArray(s.inspections)?s.inspections.filter(x=>x&&typeof x.key==='string'):[]};
  }
  try{
    const raw=!rehearsal&&sessionStorage.getItem(storageKey);
    if(raw){
      const d=JSON.parse(raw);
      if(d?.version!==1)throw Error('formato desconhecido');
      if(d.intro && [0,1,2].includes(d.intro.page) && ['menu','ajuda','entrega','turno'].includes(d.intro.target))intro=d.intro;
      profile=cleanProfile(d.profile);draft=cleanProfile(d.draft||profile);
      for(const key of Object.keys(prefs))prefs[key]=d.prefs?.[key]===true;
      book=Array.isArray(d.book)?d.book.filter(r=>Number.isInteger(r?.id)&&r.id>=0&&r.id<=12&&typeof r.win==='boolean'&&Array.isArray(r.history)&&r.history.every(h=>typeof h?.choice==='string'&&typeof h.reaction==='string')):[];
      configReturn=d.configReturn==='pausa'?'pausa':'menu';avatarReturn=d.avatarReturn==='menu'?'menu':'universo';
      shownExpression=Object.hasOwn(expressionLabels,d.shownExpression)?d.shownExpression:'neutro';
      session=restoreAttempt(d.session);screen=typeof d.screen==='string'?d.screen:'menu';
      if(gameScreens.includes(screen))screen=session?.phase||'menu';
      shiftSequence=Number.isSafeInteger(d.shiftSequence)&&d.shiftSequence>=0?d.shiftSequence:0;
      if(d.shift&&session){
        const t=d.shift,ids=shifts[t.group];
        if(ids&&Number.isFinite(t.started)&&Array.isArray(t.receipts)&&t.receipts.length<=3&&t.receipts.every((r,i)=>r?.id===ids[i]&&typeof r.win==='boolean'&&typeof r.awkward==='boolean'&&Number.isFinite(r.at))){
          const index=session.phase==='desfecho'?t.receipts.length-1:t.receipts.length;
          if(session.id===ids[index])shift=t;
        }
      }
      if(screen==='turnofim'&&shift?.receipts.length!==3)screen='menu';
    }
  }catch{
    screen='menu';session=null;sessionNotice='O registro anterior desta aba não pôde ser lido. Você pode começar outra entrega.';
  }
  function save(){
    if(rehearsal)return;
    try{sessionStorage.setItem(storageKey,JSON.stringify(saved()))}
    catch{sessionNotice='O navegador ficou sem espaço ou não conseguiu salvar. A partida continua nesta página. Se você atualizar, pode perder o progresso.'}
    const status=$('storage-status');
    if(status){status.hidden=!sessionNotice;status.textContent=sessionNotice}
  }
  const visual=()=>window.FVQE_VISUAL;
  const name=()=>profile.name||'Entregador';
  const cn=()=>session?.id??0, special=()=>cn()===12;
  const chapter=id=>id===12?'O nome no recibo':CASOS[id].chapter;
  const title=id=>id===12?(window.PortariaIA?.title||'O nome no recibo'):CASOS[id].title;
  const goal=id=>id===12?(window.PortariaIA?.goal||'Responder à contestação com um registro do que aconteceu.'):CASOS[id].goal;
  const kcase=()=>CASOS[cn()];
  const note=()=>window.CADERNO?.[cn()];
  const avatarNumber=p=>/^(?:[4-9]|1[0-9]|2[0-4])$/.test(p.base)?Number(p.base):({a:1,b:2,c:3}[p.base]||1);
  const artNumber=n=>String(n).padStart(2,'0');
  function wear(kind){
    const scarf=kind==='colete'||kind==='jaqueta';
    const ink=scarf?(kind==='colete'?'#302ed4':'#98d7c7'):(kind==='faixa'?'#f24d3f':'#302ed4');
    const paths=scarf?'<path d="M-3 4 31 13 53 27 71 13 101 4 104 38H-4z"/><path d="m22 12 26 17 13-1-12 9-9-10zM57 28l19-16-9 18-8 4z"/><path d="M4 19q18 2 34 12m35-7 20-12m-21 17 26-10" fill="none"/>':
      kind==='faixa'?'<path d="M9 16Q42 1 92 8l1 9Q53 10 12 26z"/><path d="m12 17-9-9 1 12 7 2-7 13 12-10z"/><path d="m19 19 10-4m4-1 19-4m16 1 18 1" fill="none"/>':
      '<path d="M7 22Q12-4 49-4t44 26l-3 5Q47 15 9 30z"/><path d="M8 23q39-15 84-2l-1 8q-42-11-82 4z"/><path d="m17 22 7-13m4 9 6-14m9 12 3-15m11 14 1-14m9 15-2-14m12 17-4-13" fill="none"/>';
    return '<svg class="wardrobe '+(scarf?'scarf':'headpiece')+'" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true"><g fill="'+ink+'" stroke="#1a1d22" stroke-width="1.15" stroke-linejoin="round">'+paths+'</g></svg>';
  }
  function img(p,e){
    const n=avatarNumber(p), cue=Atelier.cues[e]||Atelier.cues.neutro;
    const original=n<=3 && Object.hasOwn(visual().expressionLabels,e);
    const src=original?visual().render({...p,expression:e}):
      'assets/avatares/'+artNumber(n)+'-'+Atelier.sprite('avatar',e)+'.webp';
    const pin=['domino','estrela','selo'].includes(p.pin)?p.pin:'';
    const trim=['menta','azul','vermelho'].includes(p.trim)?p.trim:'original';
    const mount=['redondo','postal'].includes(p.mount)?p.mount:'original';
    const head=n>3 && ['faixa','gorro'].includes(p.headwear)?wear(p.headwear):'';
    const cloth=!original && ['colete','jaqueta'].includes(p.outfit)?wear(p.outfit):'';
    const skin=['dourada','retinta'].includes(p.skin)?p.skin:'original',hair=['castanho','mecha'].includes(p.hair)?p.hair:'original';
    const shape=['a','b','c'].includes(p.face)?p.face:'original';
    const ink=!original?' data-forma="'+shape+'" data-tom="'+skin+'" data-fio="'+hair+'"':'';
    return '<span'+ink+' class="portrait '+mount+' trim-'+trim+'" style="--pose:'+cue[3]+'deg;--zoom:'+(1+cue[2]*.025)+'"><img src="'+esc(src)+'" alt="'+esc(p.name||'Entregador')+' · '+esc(cue[0])+'">'+head+cloth+(pin?'<i class="pin '+pin+'" aria-label="Broche '+pin+'"></i>':'')+'</span>';
  }
  function actorImage(mark){
    const cue=Atelier.cues[mark.cue], file=Atelier.sprite('npc',mark.cue);
    return '<span class="portrait actor" data-cue="'+mark.cue+'" style="--pose:'+(cue[3]*Atelier.cards[mark.actor][2])+'deg;--zoom:'+(1+cue[2]*.035)+'"><img src="assets/elenco/'+mark.actor+'-'+file+'.webp" alt="'+esc(Atelier.cast[mark.actor])+' · '+esc(cue[0])+'"></span>';
  }
  function sceneText(mark, line, spoken=false, featured=false){
    if(!mark)return para(line);
    const text=esc(line).replace(/“([^”]+)”/g,(q,words)=>spoken?'<q>'+words+'</q>':q);
    return '<article class="dialogue '+(featured?'featured':'')+'" data-personagem="'+mark.actor+'">'+(featured?'':actorImage(mark))+'<div><small class="overline">'+(spoken?'Com a palavra':'Em cena')+'</small><strong>'+esc(Atelier.cast[mark.actor])+(mark.actor==='lia'&&session?.state.scene==='P06M'?' · interfone':'')+'</strong><small>'+esc(expressionLabels[mark.cue])+'</small></div><p>'+text+'</p></article>';
  }
  const extra=p=>avatarNumber(p)>3;
  const opts=(pairs)=>pairs.map(([id,label])=>({id,label}));
  const mounts=opts([['original','Sem moldura'],['redondo','Medalhão'],['postal','Postal']]);
  const trims=opts([['original','Papel'],['menta','Menta'],['azul','Ultramarino'],['vermelho','Vermelhão']]);
  const headwear=opts([['original','Sem adereço'],['faixa','Faixa vermelha'],['gorro','Gorro ultramarino']]);
  const pins=opts([['original','Sem broche'],['domino','Dominó'],['estrela','Estrela'],['selo','Selo']]);
  function portraitGrid(){
    return '<div class="portrait-grid">'+Atelier.catalog.map((label,i)=>{
      const id=i<3?'abc'[i]:String(i+1), chosen=id===draft.base;
      const src=i<3?'assets/rostos/base-'+id+'.webp':'assets/avatares/'+artNumber(i+1)+'.webp';
      return '<button type="button" data-action="set-base" data-value="'+id+'" aria-pressed="'+chosen+'"><img src="'+src+'" alt=""><span>'+(chosen?'✓ ':'')+esc(label)+'</span></button>';
    }).join('')+'</div>';
  }
  const icon=id=>window.Grafismos.icon(id);
  function plate(art, label, caption, folio, detail='') {
    return '<figure class="plate"><div class="plate-art">'+art+'</div><figcaption><small>'+esc(label)+'</small><strong>'+esc(caption)+'</strong>'+detail+'<span class="folio">'+esc(folio)+'</span></figcaption></figure>';
  }
  function scenePlate(id, withPlayer=false) {
    const number=String(id+1).padStart(2,'0');
    const art='<img src="assets/cenas/'+number+'.webp" alt="">';
    const folio=id===12?'P':number;
    if(!withPlayer)return plate(art,'Folha de serviço',title(id),folio);
    const expression=playerCue();
    const detail=img(profile,expression)+'<small>'+esc(expressionLabels[expression])+(profile.pronouns?' · '+esc(profile.pronouns):'')+'</small>';
    return plate(art,'Quem entrega',name(),folio,detail);
  }
  function actingPlate(mark,spoken){
    return plate(actorImage(mark),spoken?'Com a palavra':'Em cena',Atelier.cast[mark.actor]+(mark.actor==='lia'&&session?.state.scene==='P06M'?' · interfone':''),expressionLabels[mark.cue],img(profile,playerCue())+'<small>'+esc(name())+'</small>');
  }
  function playerCue(){
    if(!session)return 'neutro';
    const s=session.state,h=session.history.at(-1);
    if(!h)return 'atento';
    if(special()){
      if(s.end)return s.end.win?'aliviado':s.awkward?'constrangido':'decepcao';
      const acts={P02:'concentrado',P03:'surpresa',P04:'reservado',P05L:'atento',P05B:'hesitante',P05M:'curioso',P05T:'desconfiado',P06W:'concentrado',P06M:'aliviado',P07:'cansado'};
      return s.awkward?'constrangido':acts[s.scene]||session.expression;
    }
    if(s.step==='end' && !s.win && h.from==='event')return 'panico';
    if(s.step==='end')return s.win?(s.awkward?'aliviado':'alegria'):(s.awkward?'constrangido':'decepcao');
    if(s.step==='event')return 'surpresa';
    if(s.step==='repair')return 'hesitante';
    if(h.from==='prep')return s.ready?'confiante':'curioso';
    return session.expression;
  }
  const coverPlate=()=>plate('<img src="assets/cartaz.webp" alt="">','Coleção','Foi você que escolheu','FV');
  const player=(ex,p=profile)=>plate(img(p,ex),screen==='desfecho'&&result().win&&result().awkward?'Alívio com vergonha':expressionLabels[ex]||ex,p.name||'Entregador','FV',p.pronouns?'<small>'+esc(p.pronouns)+'</small>':'');
  const avatar=(p,e)=>plate(img(p,e),'Prova de impressão',expressionLabels[e]||e,'FV');
  const opt=(label,fn,style='')=>({label,fn,style});
  const act=(label,id,style='')=>opt(label,()=>open(id),style);
  const para=s=>'<p>'+esc(s)+'</p>';
  function dataBtn(label,action,value='',pressed=null){return '<button type="button" data-action="'+esc(action)+'" data-value="'+esc(value)+'"'+(pressed===null?'':' aria-pressed="'+pressed+'"')+'>'+esc(label)+'</button>'}
  function widgets(id,labels){return Object.entries(labels).map(([k,v])=>dataBtn(v,id,k)).join('')}
  const toolIcons={
    observar:'<circle cx="9" cy="9" r="6"/><path d="m14 14 6 6M6 9a3 3 0 0 1 3-3"/>',
    perguntar:'<path d="M2 3h16v11H8l-5 4v-4H2zM8 17h7l5 4v-4h2V8M6 7h8M6 10h5"/>',
    historico:'<path d="M5 2h15v20H5zM8 2v20M3 6h4M3 12h4M3 18h4M11 7h6M11 10h4"/>'
  };
  function glyph(key){return '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">'+toolIcons[key]+'</svg>'}
  function askLabel(){
    const actor=Atelier.current(session,'perguntar').actor;
    const role={chapeu:'ao rapaz',frete:'ao rapaz do frete',mulher:'à mulher da escada',encarregada:'à encarregada',vizinho:'ao vizinho'};
    return 'Perguntar '+(role[actor]||'a '+Atelier.cast[actor].split(' ')[0]);
  }
  function toolsDuring(){
    const list=special()?[['historico','Caderno']]:[['observar','Examinar a cena'],['perguntar',askLabel()],['historico','Caderno']];
    const hint=special()?'Consulte seus registros. A decisão continua aberta.':'Examine a cena, faça uma pergunta ou consulte seus registros. A decisão continua aberta.';
    return '<section class="investigation" aria-label="Ferramentas de investigação"><h2>Antes de decidir</h2><p>'+hint+'</p><div>'+list.map(([key,label])=>'<button type="button" data-action="open" data-value="'+key+'">'+glyph(key)+'<span>'+esc(label)+'</span></button>').join('')+'</div></section>';
  }
  function fileTab(label,detail){
    return '<div class="file-tab">'+glyph('historico')+'<span>'+esc(label)+'</span><b>'+esc(detail)+'</b></div>';
  }
  function present(kicker,heading,html='',actions=[],tag='EDIÇÃO DE CAMPO'){
    const old=$('stage');currentActions=actions;
    const prior=old.querySelector('.portrait.actor img')?.cloneNode?.();
    const pauseButton=session&&!['desfecho','pausa','continuar','config','acessibilidade'].includes(screen)&&gameScreens.includes(screen)?dataBtn('Ⅱ Pausa','open','pausa'):'';
    old.innerHTML='<header class="band"><span>ARQUIVO DAS ESCOLHAS</span>'+ (pauseButton||'<span>FVQE / 26</span>')+'</header><div class="inside"><div class="kicker">'+esc(kicker)+'</div><h1 tabindex="-1">'+esc(heading)+'</h1><div class="bookbody">'+html+'</div><nav class="actions" aria-label="Ações da tela">'+(screen==='escolha'?'<h2 class="decision-label">Sua decisão</h2>':'')+actions.map((a,i)=>'<button type="button" data-action="item" data-value="'+i+'" class="'+esc(a.style||(i===0?'primary':''))+'"'+(a.choice==null?'':' data-choice="'+a.choice+'"')+'>'+((a.choice==null)?'':'<b aria-hidden="true">'+String(i+1).padStart(2,'0')+'</b>')+esc(a.label)+'</button>').join('')+'</nav></div><footer class="foot"><span>'+esc(tag)+'</span><span class="bars" aria-hidden="true"></span></footer><small id="storage-status" role="status" hidden></small>';
    window.RevelarRetratos?.(old);
    const arriving=old.querySelector('.portrait.actor');
    if(prior && arriving?.firstElementChild && prior.src!==arriving.firstElementChild.src && !prefs.motion && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      prior.className='leaving';prior.alt='';prior.setAttribute('aria-hidden','true');arriving.append(prior);
      const fade=prior.animate([{opacity:1},{opacity:0}],{duration:155,easing:'ease-out'});
      fade.onfinish=()=>prior.remove();
    }
    old.querySelector('h1').focus({preventScroll:true});old.scrollTop=0;
    const n=cn(),active=session&&(['escolha','entrada','consequencia','desfecho','pausa','observar','perguntar'].includes(screen)||cadernoScreens.includes(screen));
    $('leftRail').innerHTML='<div class="rule"></div><small class="binder">COLEÇÃO / FICÇÃO INTERATIVA</small><div class="arch">Foi você<br>que escolheu</div><hr><p>O Arquivo das Escolhas</p><small>INOVAÇÃO CHRIS · 2026/2</small>';
    $('rightRail').innerHTML='<small class="binder">'+(active?'FOLHA DE SERVIÇO':'CIRCULAÇÃO INTERNA')+'</small>'+icon(active?n:9)+'<hr><b>'+esc(active?chapter(n):'Caderno do entregador')+'</b><p>'+esc(active?goal(n):'A encomenda muda de mãos. Você decide o que vai pro papel.')+'</p>'+(active?dataBtn('Consultar histórico','open','historico'):'');
    $('rightRail').querySelectorAll('button').forEach(b=>b.className='rail-link');
    $('stage').setAttribute('data-screen',screen);save();
  }
  function open(id){if(id==='menu')intro.credit=false;if(id==='config'&&screen!=='acessibilidade')configReturn=screen==='pausa'?'pausa':'menu';if(id==='acessibilidade'&&screen!=='config')configReturn=session?'pausa':'menu';screen=id;draw()}
  function introduce(target,id=0){
    if(intro.credit && target==='entrega'){start(id);return}
    if(intro.credit && target==='turno'){startShift();return}
    intro={page:0,origin:screen,target,id};
    open('prologo');
  }
  function finishIntro(){
    intro.credit=intro.target==='ajuda';
    if(intro.target==='entrega'){start(intro.id);return}
    if(intro.target==='turno'){startShift();return}
    open(intro.target);
  }
  function introBack(){
    if(intro.page===0){open(intro.origin);return}
    intro.page--;draw();
  }
  function introView(){
    const n=intro.page,f=Prologo.frames[n];
    present('Prólogo · '+(n+1)+' / 3',f.title,Prologo.illustration(n)+para(f.text),[
      opt('Avançar',()=>{if(n===2)finishIntro();else{intro.page++;draw()}}),
      opt('Voltar',introBack,'subtle'),opt('Pular introdução',finishIntro,'subtle')
    ],'PORTO DO CEDRO');
  }
  function profileStart(from){avatarReturn=from;draft={...profile};shownExpression='neutro';open('base')}
  function start(id,inShift=false){
    if(!Number.isInteger(id)||id<0||id>12||(!window.PortariaIA&&id===12))return;
    if(!inShift){
      if(!rehearsal&&session&&(session.phase!=='desfecho'||(shift&&shift.receipts.length<3))&&!confirm('Se você começar outra entrega agora, o percurso atual termina aqui. Quer começar?'))return;
      shift=null;
    }
    intro.credit=false;
    session={id,state:id===12?PortariaIA.start():{step:'prep',ready:false,awkward:false},history:[],line:'',phase:'entrada',expression:'neutro',inspections:[],metrics:{started:clock(),firstChoice:null,firstConsequenceDOM:null,firstConsequenceFrame:null,ending:null}};
    open('entrada');
  }
  function startShift(){
    if(!rehearsal&&session&&(session.phase!=='desfecho'||(shift&&shift.receipts.length<3))&&!confirm('Se você começar o turno agora, a tentativa atual termina aqui. Quer começar?'))return;
    const group=shiftSequence%shifts.length;
    shiftSequence++;shift={group,started:clock(),receipts:[]};
    start(shifts[group][0],true);
  }
  function nextShift(){
    if(!shift)return;
    if(shift.receipts.length===3){open('turnofim');return}
    start(shifts[shift.group][shift.receipts.length],true);
  }
  function resume(){
    const from=screen;
    open(shift?.receipts.length===3?'turnofim':session?.phase||'menu');
    if(screen==='escolha' && ['observar','perguntar','historico'].includes(from)){
      const tool=$('stage').querySelector('.investigation [data-value="'+from+'"]');
      tool?.focus?.();
    }
  }
  function phase(id){session.phase=id;open(id)}
  function result(){
    if(!session)return {ended:false};
    if(special())return PortariaIA.view(session.state);
    return {ended:session.state.step==='end',win:session.state.win,awkward:session.state.awkward};
  }
  function fromId(s){return special()?PortariaIA.view(s).id:s.step}
  function advance(){
    if(!session)return;
    if(screen==='entrada')phase('escolha');
    else if(screen==='consequencia'){
      if(result().ended){const at=clock();session.metrics.ending??=at;const res=result();book.push({id:cn(),name:name(),at,win:!!res.win,awkward:!!res.awkward,history:clone(session.history),metrics:clone(session.metrics)});if(shift)shift.receipts.push({id:cn(),win:!!res.win,awkward:!!res.awkward,at});phase('desfecho')}
      else phase('escolha');
    }
  }
  function labels(){return special()?PortariaIA.view(session.state).options:options(kcase(),session.state)}
  function choose(index){
    if(!session||screen!=='escolha'||!Number.isInteger(index)||index<0||index>=labels().length)return;
    const previous=session.state,from=fromId(previous),choice=labels()[index],at=clock();session.metrics.firstChoice??=at;
    let next,reaction;
    if(special()){next=PortariaIA.choose(previous,index);const v=PortariaIA.view(next);reaction=v.reaction||v.text;session.expression=v.expression||'neutro'}
    else{[next,reaction]=run(kcase(),previous,index);session.expression=next.step==='end'?(next.win?'aliviado':next.awkward?'panico':'cansado'):from==='social'&&next.awkward?'constrangido':from==='event'?'ironia':next.step==='repair'?'desconfiado':next.ready?'confiante':'desconfiado'}
    session.state=next;session.line=reaction;
    session.history.push({choice,index,from,to:fromId(next),reaction,ready:next.ready,awkward:result().awkward,at,previous:clone(previous),next:clone(next)});
    phase('consequencia');
    if(session.history.length===1){
      const owner=session;owner.metrics.firstConsequenceDOM=clock();save();
      requestAnimationFrame(()=>requestAnimationFrame(()=>{if(owner===session){owner.metrics.firstConsequenceFrame??=clock();save()}}));
    }
  }
  function dataSelections(kind,list){
    return '<div class="chips">'+list.map(o=>dataBtn((draft[kind]===o.id?'✓ ':'')+o.label,'set-'+kind,o.id,draft[kind]===o.id)).join('')+'</div>';
  }
  function setup(page){
    const V=visual(),pages=['base','rosto','cabelo','roupa','nome','previa'],n=pages.indexOf(page),texts=['Personagem-base','Rosto e pele','Cabelo','Vestuário','Nome e pronomes','Seu crachá'];
    let h=avatar(draft,shownExpression);
    if(page==='base')h=para('Escolha seu retrato. Você pode usar o crachá como está ou mudar os detalhes.')+portraitGrid();
    if(page==='rosto'&&extra(draft)){texts[n]='Rosto e pele';h+=dataSelections('face',V.faces)+'<h3>Tonalidade</h3>'+dataSelections('skin',V.skins)+'<h3>Moldura</h3>'+dataSelections('mount',mounts)+dataSelections('trim',trims)}
    if(page==='rosto'&&!extra(draft))h+='<h3>Rosto</h3>'+dataSelections('face',V?.faces||[])+'<h3>Tonalidade</h3>'+dataSelections('skin',V?.skins||[]);
    if(page==='cabelo'&&extra(draft)){texts[n]='Cabelo e adereço';h+=dataSelections('hair',V.hairs)+dataSelections('headwear',headwear)}
    if(page==='cabelo'&&!extra(draft))h+=para('Como você quer o cabelo no retrato?')+dataSelections('hair',V?.hairs||[]);
    if(page==='roupa'){texts[n]='Roupa e broche';h+=dataSelections('pin',pins)}
    if(page==='roupa'&&extra(draft))h+=dataSelections('outfit',opts([['original','Roupa do retrato'],['colete','Lenço ultramarino'],['jaqueta','Lenço menta']]));
    if(page==='roupa'&&!extra(draft))h+=para('Com que roupa você vai fazer a entrega?')+dataSelections('outfit',V?.outfits||[]);
    if(page==='nome')h+='<label class="field">Nome no crachá<input id="playername" maxlength="48" autocomplete="off" value="'+esc(draft.name)+'" placeholder="Entregador"></label><label class="field">Pronomes (opcional)<input id="pronouns" maxlength="32" autocomplete="off" value="'+esc(draft.pronouns)+'" placeholder="Como você prefere"></label>';
    if(page==='previa')h=player(shownExpression,draft)+para('Esse crachá vale para as entregas desta aba. Dá pra mudar depois, pelo menu.');
    const actions=[opt(n===5?'Confirmar personagem':'Continuar',()=>{if(n===5){profile={...draft};open(avatarReturn)}else open(pages[n+1])})];
    if(n===0)actions.unshift(opt('Usar este avatar',()=>{profile={...draft};open(avatarReturn)}));
    if(n===5)actions.push(act('Ver repertório de expressões','expressoes','subtle'));
    if(n>0)actions.push(act('Voltar',pages[n-1],'subtle'));
    actions.push(opt('Pular personalização',()=>{draft={...profile};open(avatarReturn)},'subtle'));
    present('Crachá · '+(n+1)+' / 6',texts[n],h,actions);
  }
  function gameView(){
    if(!session){open('menu');return}
    const id=cn(),c=kcase(),v=special()?PortariaIA.view(session.state):null,e=playerCue(),k=session.state.step;
    const shiftPrefix=shift?'TURNO '+(shifts[shift.group].indexOf(id)+1)+'/3 · ':'';
    const lead=id===12?'ESPECIAL · PORTARIA':shiftPrefix+'ATO '+chapterNames[Math.floor(id/4)]+'　/　'+String(id+1).padStart(2,'0');
    if(screen==='entrada'){
      present(lead,chapter(id),scenePlate(id)+sceneText(Atelier.current(session,'entrada'),v?v.text:c.opening,[0,12].includes(id))+'<p class="goal">'+esc(goal(id))+'</p>',[opt('Receber o pedido',advance)]);return;
    }
    if(screen==='escolha'){
      const caption=v?v.title:(k==='event'?c.event.title:steps[k]);
      let scene=v?(v.speaker||'Portaria'):c.npc,info=v?(v.prompt||v.text):k==='prep'?c.goal:k==='social'?encounters[id]:k==='event'?c.event.line:k==='delivery'?c.echo[Number(session.state.awkward)]:k==='repair'?'Ainda dá tempo de conferir. Como você quer fechar a entrega?':session.line;
      const order=labels().map((_,i)=>i);if(!special()){const off=(id+['prep','social','delivery','event','repair'].indexOf(k))%order.length;order.push(...order.splice(0,off))}
      const mark=Atelier.current(session,'escolha');
      const spoken=!!mark && info.includes('“') && (k==='delivery'||(v&&['P01','P05L','P05B','P05M','P05T','P05R','P06Q','P06B','P06M','P06W'].includes(v.id)));
      present(lead,caption,(spoken?actingPlate(mark,true):scenePlate(id,true))+(v?'<small class="overline">'+esc(scene)+'</small>':'')+sceneText(mark,info,spoken,spoken)+toolsDuring(),order.map(i=>({...opt(labels()[i],()=>choose(i),'choice'),choice:i})),title(id));return;
    }
    const h=session.history.at(-1);
    if(screen==='consequencia'){
      const head=result().ended?'A última palavra':k==='event'?'Chamou atenção':e==='constrangido'?'Pegou mal':'O que aconteceu';
      const mark=Atelier.reaction(session),spoken=!!mark && session.line.includes('“');
      present(lead,head,(mark?actingPlate(mark,spoken):player(e))+'<small class="overline">SUA ESCOLHA</small>'+para(h.choice)+'<div class="quote">'+sceneText(mark,session.line,spoken,!!mark)+'</div>',[opt(result().ended?'Abrir o recibo':'Ver a próxima decisão',advance),act('Consultar histórico','historico','subtle')]);return;
    }
    const won=result().win,awk=result().awkward,reflection=note()?.conclusao;
    present(lead,won?'Entrega concluída':'Entrega pendente','<div class="receipt '+(won?'':'loss')+'"><span class="stamp">'+(won?'Vitória':'Derrota')+(awk?' com vergonha':'')+'</span></div>'+player(e)+para(session.line)+(shift?'<p class="goal">Turno · entregas concluídas: '+shift.receipts.filter(r=>r.win).length+'. Recibos: '+shift.receipts.length+' de 3. Meta: concluir 2.</p>':'')+metricsHtml(session.metrics)+(reflection?'<details><summary>Para pensar depois</summary>'+para(reflection)+'</details>':''),
      [(shift?opt(shift.receipts.length===3?'Ver balanço do turno':'Próxima entrega do turno',nextShift):opt('Jogar de novo',()=>introduce('entrega',id))),...(!shift&&id<11?[opt('Próxima entrega',()=>start(id+1))]:[]),act('Rever minhas escolhas','revisao','subtle'),...(shift?[]:[act('Fechar o recibo','encerrar','subtle')])],title(id));
  }
  function metricsHtml(m){
    const fmt=t=>t==null?'aguardando quadro':Math.max(0,t-m.started).toFixed(1)+' ms';
    return '<details class="metrics"><summary>Tempos desta partida</summary><p>Início do pedido: 0,0 ms<br>Primeira escolha: '+fmt(m.firstChoice)+'<br>Primeira consequência no DOM: '+fmt(m.firstConsequenceDOM)+'<br>Primeira janela de pintura (dois quadros): '+fmt(m.firstConsequenceFrame)+'<br>Recibo aberto: '+fmt(m.ending)+'</p><small>O relógio conta também o tempo de leitura e as pausas. Esses tempos não medem compreensão.</small></details>';
  }
  function draw(){

    document.body.classList.toggle('contrast',prefs.contrast);document.body.classList.toggle('large',prefs.large);document.body.classList.toggle('motion-off',prefs.motion);
    if(gameScreens.includes(screen)){gameView();return}
    if(['base','rosto','cabelo','roupa','nome','previa'].includes(screen)){setup(screen);return}
    if(cadernoScreens.includes(screen)){
      const v=Caderno.show(screen,{cases:CASOS,id:cn(),profile,session,book,open,start,resume,escape:esc,button:dataBtn});
      const acts=v.actions.map(x=>opt(x.label,x.do));
      if(screen==='capitulos'){acts.unshift(opt('Visita especial · A portaria',()=>introduce('entrega',12)));acts.push(act('Turno de três entregas','turno','subtle'))}
      if(screen==='historico'&&session&&!acts.some(x=>/retomar|partida|recibo/i.test(x.label)))acts.unshift(opt('Voltar à partida',resume));
      const tab=fileTab(screen==='capitulos'?'Índice da campanha':'Caderno de rota',screen==='capitulos'?'12 capítulos':session?title(cn()):'Arquivo');
      present(v.kicker,v.title,(screen==='universo'?coverPlate():tab)+v.html,acts);return;
    }
    switch(screen){
      case 'prologo':introView();break;
      case 'abertura':
        present('Coleção · Ficção interativa','Foi você que escolheu','<figure class="official-cover"><img src="assets/cartaz.webp" alt="Cartaz oficial. Uma mão aponta para um dominó entre dois caminhos. Foi você que escolheu. Você decide. O universo cobra."></figure><p>Você faz as entregas em <i>O Arquivo das Escolhas</i>. Quem assina o recibo?</p><fvqe-offline></fvqe-offline>',[act('Abrir o arquivo','conteudo')]);break;
      case 'conteudo':
        present('Antes de entrar','Aviso de conteúdo',coverPlate()+para('A história trata de remoção de moradores, perda de moradia, exposição pública e constrangimento. Há pressão no trabalho e humor sobre a burocracia.')+'<p class="note">O projeto foi pensado para quem tem 18 anos ou mais. Ainda não há classificação indicativa oficial.</p>',[act('Entendi · ir para o menu','menu')]);break;
      case 'menu':
        present('Arquivo · recepção','Caderno do entregador',coverPlate()+para('Você pega a encomenda com uma pessoa e entrega pra outra. Às vezes vai uma promessa junto. Essa não vem na etiqueta.'),
          [...(session?[act('Continuar partida','continuar')]:[]),opt(session?'Iniciar outra entrega':'Iniciar jogo',()=>introduce('ajuda')),act('Ver capítulos e atos','capitulos'),opt('Personalizar meu crachá',()=>profileStart('menu'),'subtle'),act('Configurações','config','subtle'),act('Créditos','creditos','subtle'),opt('Rever introdução',()=>introduce('menu'),'subtle')]);break;
      case 'ajuda':
        present('Guia rápido','Como se joga',coverPlate()+'<ol><li>Leia o pedido. O que a pessoa está esperando?</li><li>Escolha o que fazer. Repare em quem viu.</li><li>Abra o recibo pra ver o que chegou. Dá pra passar vergonha e ainda assim ganhar.</li></ol>'+para('Leia no seu ritmo. As escolhas não têm prazo.'),[opt('Montar meu crachá',()=>profileStart('universo')),act(Object.keys(initialProfile).some(k=>profile[k]!==initialProfile[k])?'Usar meu crachá atual':'Começar com o crachá padrão','universo'),act('Voltar ao menu','menu','subtle')]);break;
      case 'expressoes':
        present('Crachá · prova de impressão','Vinte expressões',avatar(draft,shownExpression)+'<div class="chips">'+Object.entries(expressionLabels).map(([key,label])=>dataBtn(label,'expr',key,key===shownExpression)).join('')+'</div>',[act('Voltar ao crachá','previa')]);break;
      case 'continuar':
        present('Memória desta aba','Continuar partida',session?scenePlate(cn())+para(title(cn())+' · '+session.history.length+' '+(session.history.length===1?'escolha registrada.':'escolhas registradas.'))+para('Se o navegador conseguir salvar, você pode atualizar esta aba e retomar do mesmo ponto.'):'<p>Ainda não há uma entrega em andamento.</p>',
          [...(session?[opt(session.phase==='desfecho'?'Abrir último recibo':'Retomar do mesmo ponto',resume)]:[]),act('Ver recibos da sessão','historico'),act('Voltar ao menu','menu','subtle')]);break;
      case 'pausa':
        present('Intervalo · serviço em espera','Partida pausada',session?scenePlate(cn())+para(title(cn()))+para('Pode voltar ao menu. Sua entrega fica aqui na aba, no ponto em que você parou.'):'<p>Escolha uma entrega no menu.</p>',[opt('Retomar partida',resume),act('Configurações','config'),act('Histórico das escolhas','historico','subtle'),act('Voltar ao menu','menu','subtle')]);break;
      case 'config':
        present('Preferências','Configurações',fileTab('Preferências','Nesta sessão')+para('Suas preferências valem enquanto esta aba estiver aberta. Para jogar pelo teclado, use Tab e Enter.')+'<fvqe-offline></fvqe-offline>',[act('Recursos de acessibilidade','acessibilidade'),act('Voltar',configReturn,'subtle')]);break;
      case 'acessibilidade':
        present('Leitura · controles','Acessibilidade',fileTab('Preferências','Leitura e controles')+'<p>As cores e as expressões também têm rótulos. Dá pra acompanhar todas as decisões sem som.</p><div class="chips">'+[['large','Texto ampliado'],['contrast','Contraste reforçado'],['motion','Reduzir movimento']].map(([k,l])=>dataBtn(l+' · '+(prefs[k]?'ativado':'desativado'),'pref',k,prefs[k])).join('')+'</div>'+para('Tab e Shift + Tab percorrem os controles. Enter ativa. Esc pausa ou retorna.'),[opt('Voltar às configurações',()=>{screen='config';draw()})]);break;
      case 'observar':case 'perguntar':{
        const n=note();if(!n){resume();return}
        const ask=screen==='perguntar',text=ask?n.resposta:n.detalhe;
        const mark=Atelier.current(session,'perguntar');
        const detail=ask?actingPlate(mark,true)+'<div class="inquiry"><small class="overline">Sua pergunta</small>'+para(n.pergunta)+'</div><div class="answer"><small class="overline">Resposta de '+esc(Atelier.cast[mark.actor])+'</small>'+sceneText(mark,text,true,true)+'</div>':
          '<figure class="detail-print"><img src="assets/cenas/'+artNumber(cn()+1)+'.webp" alt=""><figcaption>'+glyph('observar')+esc(n.observacao)+'</figcaption></figure><article class="finding"><small class="overline">O que você percebeu</small>'+para(text)+'</article>';
        present('Consulta opcional · '+n.lugar,ask?askLabel():'Examinar a cena',detail,[opt('Voltar à decisão',resume),act('Consultar documento da entrega','documento','subtle')]);break;
      }
      case 'turno':{
        const ids=shifts[shiftSequence%shifts.length];
        const h=para('Você faz uma entrega por ato. Conclua pelo menos duas das três pra ganhar o turno. O vexame aparece no recibo, mas não cancela a entrega.')+'<ol>'+ids.map(i=>'<li>'+esc(title(i))+'</li>').join('')+'</ol>'+para('O turno foi pensado para durar de 3 a 5 minutos. Você decide quando avançar.');
        const actions=[...(shift&&shift.receipts.length<3?[opt('Retomar meu turno',resume)]:[]),opt('Começar este turno',()=>introduce('turno')),act('Voltar aos capítulos','capitulos','subtle')];
        present('Três atos · um percurso','Turno de três entregas',h,actions);break;
      }
      case 'turnofim':{
        if(shift?.receipts.length!==3){open('menu');return}
        const wins=shift.receipts.filter(r=>r.win).length,awk=shift.receipts.filter(r=>r.awkward).length;
        const elapsed=(shift.receipts[2].at-shift.started)/1000;
        const summary='<div class="receipt"><span class="stamp">'+(wins>=2?'Vitória no turno':'Derrota no turno')+'</span></div><p class="goal">'+wins+' de 3 serviços concluídos · '+awk+' com vergonha.</p><ol>'+shift.receipts.map(r=>'<li><b>'+esc(title(r.id))+'</b> — '+(r.win?'concluída':'pendente')+(r.awkward?' · com vergonha':'')+'</li>').join('')+'</ol><small>Tempo corrido até o último recibo: '+(elapsed/60).toFixed(2).replace('.',',')+' min. Inclui pausas.</small>';
        present('Recibo · turno completo','Fechamento do turno',summary,[opt('Jogar novo turno',()=>introduce('turno')),act('Ver capítulos e atos','capitulos'),act('Voltar ao menu','menu','subtle')]);break;
      }
      case 'encerrar':
        present('Fim de serviço','Recibo arquivado',scenePlate(cn())+para('Suas escolhas ficaram no caderno desta aba. Você pode voltar e ler cada uma.'),[opt('Recomeçar esta entrega',()=>introduce('entrega',cn())),act('Revisitar escolhas','historico'),...(cn()<12?[act('Resumo deste ato','resumo')]:[]),act('Créditos','creditos','subtle'),act('Voltar ao menu','menu','subtle')]);break;
      case 'creditos':
        present('Expediente','Créditos','<p><b>FOI VOCÊ QUE ESCOLHEU</b><br>Projeto Inovação Chris · 2026/2. Responsável acadêmico: Christian.</p>'+para('Obra de referência: O Arquivo das Escolhas. Adaptação interativa com o Entregador, três atos e doze capítulos. A visita especial desta edição se chama O nome no recibo.')+para('Identidade visual v03 · Pop em Curto-Circuito. Três rostos, muitas escolhas é a arte-conceito dos personagens-base. O elenco, os crachás complementares e as ilustrações do prólogo foram produzidos para a edição Visual.')+para('Roteiro, programação, composição visual e testes com assistência de IA. Créditos técnicos e registro de produção acompanham o pacote.'),[act('Voltar ao menu','menu'),...(session?[opt('Voltar à entrega',resume,'subtle')]:[])]);break;
      default:screen='menu';draw();
    }
  }
  function handle(e){
    const b=e.target.closest('button[data-action]');if(!b)return;
    const a=b.dataset.action,v=b.dataset.value;
    // Controles substituídos sob o ponteiro ignoram o segundo clique físico da mesma sequência.
    const now=performance.now();
    if(e.detail>1||(e.detail>0&&now-lastPhysicalAction<260&&lastPoint&&Math.hypot(e.clientX-lastPoint[0],e.clientY-lastPoint[1])<6))return;
    if(e.detail>0){lastPhysicalAction=now;lastPoint=[e.clientX,e.clientY]}
    if(a==='item'){currentActions[Number(v)]?.fn();return}
    if(a==='open'){
      if(['observar','perguntar'].includes(v)&&session&&!session.inspections.some(x=>x.key===v&&x.step===fromId(session.state)))session.inspections.push({key:v,step:fromId(session.state),at:clock()});
      open(v);return;
    }
    if(a==='start-case'){introduce('entrega',Number(v));return}
    if(a.startsWith('set-')){
      const stage=$('stage'), grid=stage.querySelector('.portrait-grid');
      const scroll=stage.scrollTop, gridScroll=grid?.scrollTop||0;
      draft[a.slice(4)]=v;draw();
      stage.scrollTop=scroll;
      const nextGrid=stage.querySelector('.portrait-grid');
      if(nextGrid)nextGrid.scrollTop=gridScroll;
      focusControl(a,v);return;
    }
    if(a==='expr'){shownExpression=v;draw();focusControl(a,v);return}
    if(a==='pref'){prefs[v]=!prefs[v];draw();focusControl(a,v)}
  }
  function focusControl(action,value){
    const buttons=$('stage').querySelectorAll('button[data-action]');
    for(const b of buttons)if(b.dataset.action===action&&b.dataset.value===value){b.focus({preventScroll:true});break}
  }
  function back(){
    if(screen==='abertura')return;
    if(screen==='prologo'){introBack();return}
    if(gameScreens.includes(screen)){if(screen==='desfecho')open(shift?'continuar':'encerrar');else open('pausa');return}
    if(['observar','perguntar','pausa'].includes(screen)){resume();return}
    if(screen==='acessibilidade'){screen='config';draw();return}
    if(screen==='config'){open(configReturn);return}
    if(screen==='expressoes'){open('previa');return}
    if(['rosto','cabelo','roupa','nome','previa'].includes(screen)){open(['base','rosto','cabelo','roupa','nome'][['rosto','cabelo','roupa','nome','previa'].indexOf(screen)]);return}
    if(screen==='historico'&&session){resume();return}
    if(screen==='revisao'){open('historico');return}
    open('menu');
  }
  document.addEventListener('click',handle);
  document.addEventListener('input',e=>{if(e.target.id==='playername')draft.name=e.target.value.trimStart().slice(0,48);if(e.target.id==='pronouns')draft.pronouns=e.target.value.trimStart().slice(0,32);save()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.repeat){e.preventDefault();back()}if(e.repeat&&['Enter',' '].includes(e.key)&&e.target.closest('button'))e.preventDefault()});
  // Uma entrada sentinela permite que Voltar pause no navegador. No menu, Voltar sai da página.
  try{
    if(!history.state?.fvqeGuard)history.pushState({fvqeGuard:true},'',location.href);
    addEventListener('popstate',()=>{if(screen==='menu'||screen==='abertura')return;history.pushState({fvqeGuard:true},'',location.href);back()});
  }catch{/* Alguns navegadores restringem history para file://. Esc e Pausa continuam disponíveis. */}
  addEventListener('pagehide',save);
  if(rehearsal)window.FVQE=Object.freeze({
    abrir:open,iniciar:start,escolher:choose,avancar:advance,estado:()=>clone(saved()),
    perfil(p){profile={...initialProfile,...p};draft={...profile};draw()},
    expressao(key){if(expressionLabels[key]){shownExpression=key;if(session)session.expression=key;draw()}}
  });
  draw();
})();










