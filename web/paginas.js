window.GamePages=(()=>{
  document.body.classList.toggle('hosted-netlify',location.hostname.endsWith('.netlify.app'));
  let stage=null,viewport=null,flow=null,page=0,total=1,pages=[],contentHeight=0,frame=0,observer=null,mutations=null,anchor=null;
  const revision='1.3.1',originalTab=new WeakMap();
  const controls='button,input,select,textarea,a[href],summary,[tabindex]';
  function updateViewport(){
    const visual=window.visualViewport;
    // O zoom é do leitor: não repaginar enquanto ele amplia a página.
    if(visual?.scale>1.01)return;
    const height=Math.round(visual?.height||innerHeight);
    const editing=/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
    document.documentElement.style.setProperty('--app-height',height+'px');
    document.documentElement.style.setProperty('--app-top',(editing?Math.max(0,visual?.offsetTop||0):0)+'px');
    document.body.classList.toggle('editing-small',height<450&&editing);
  }
  function rectangles(el){return [...el.getClientRects()];}
  function rendered(el){
    if(el.closest('[hidden]')||el.checkVisibility?.({visibilityProperty:true})===false)return false;
    const closed=el.closest('details:not([open])');return !closed||closed.querySelector('summary')?.contains(el);
  }
  function visible(el,box,bottom){
    if(el.checkVisibility?.({visibilityProperty:true})===false)return false;
    const closed=el.closest('details:not([open])');if(closed&&!closed.querySelector('summary')?.contains(el))return false;
    return rectangles(el).some(r=>r.width>0&&r.height>0&&r.left>=box.left-1&&r.right<=box.right+1&&r.top>=box.top-1&&r.bottom<=bottom+1);
  }
  function updateControls(){
    const box=viewport.getBoundingClientRect(),current=pages[page];
    const bottom=box.top+Math.min(box.height,current?current.end-current.start:box.height);
    // Ler os limites antes de alterar atributos evita invalidar estilos a cada controle.
    const states=[...flow.querySelectorAll(controls)].map(el=>[el,visible(el,box,bottom)]);
    for(const [el,shown] of states){
      if(!originalTab.has(el))originalTab.set(el,el.getAttribute('tabindex'));
      el.inert=!shown;
      if(shown){const old=originalTab.get(el);if(old===null)el.removeAttribute('tabindex');else el.setAttribute('tabindex',old);el.removeAttribute('aria-hidden');}
      else{el.tabIndex=-1;el.setAttribute('aria-hidden','true');}
    }
  }
  function apply(){
    page=Math.max(0,Math.min(total-1,page));
    const current=pages[page]||{start:0,end:viewport.clientHeight};
    flow.style.setProperty('--page-offset',(-current.start)+'px');
    // Recortar entre linhas/controles inteiros, sem rolar ou remontar componentes.
    const clip='inset('+current.start+'px 0 '+Math.max(0,contentHeight-current.end)+'px 0)';
    flow.style.clipPath=clip;flow.style.webkitClipPath=clip;
    stage.dataset.pageStart=String(current.start);stage.dataset.pageEnd=String(current.end);
    const moving=!!stage.querySelector('fvqe-transporte')?.running;
    stage.querySelector('[data-page=previous]').disabled=page===0||moving;
    stage.querySelector('[data-page=next]').disabled=page===total-1||moving;
    stage.querySelector('#page-count').textContent=(page+1)+' / '+total;
    viewport.setAttribute('aria-label','Conteúdo: página '+(page+1)+' de '+total);
    stage.dataset.page=String(page+1);stage.dataset.pages=String(total);updateControls();
  }
  function locate(el){
    const box=flow.getBoundingClientRect(),rect=rectangles(el).find(r=>r.width&&r.height);
    if(!rect)return page;
    const top=rect.top-box.top,bottom=rect.bottom-box.top;
    const index=pages.findIndex(p=>top>=p.start-1&&bottom<=p.end+1);
    return index<0?Math.max(0,pages.findIndex(p=>top<p.end)):index;
  }
  function measure(height){
    const origin=flow.getBoundingClientRect().top,segments=[];
    const add=rect=>{if(rect.width>0&&rect.height>0)segments.push({start:Math.max(0,rect.top-origin),end:rect.bottom-origin});};
    // Linhas reais, em fluxo normal. A paginação não usa colunas CSS nem scrollWidth.
    const walker=document.createTreeWalker(flow,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode,el=node.parentElement;
      if(!node.textContent.trim()||el.closest('svg,script,style,.clipped')||!rendered(el))continue;
      if(stage.dataset.screen==='abertura'&&el.closest('h1'))continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const rect of range.getClientRects())add(rect);
    }
    // Nunca dividir um botão, uma imagem, um campo ou os controles da carga.
    for(const el of flow.querySelectorAll('button,input,select,textarea,summary,img,svg,h1,h2,h3,.kicker,.plate,.portrait,.file-tab,.official-cover,.detail-print,.dialogue:not(.featured),.field,.audio-settings>label,.cargo-play')){
      if(!rendered(el))continue;
      if(el.tagName==='IMG'&&el.closest('.portrait'))continue;
      for(const rect of rectangles(el))if(rect.height<=height+.5)add(rect);
    }
    segments.sort((a,b)=>a.start-b.start||a.end-b.end);
    const lines=[];
    for(const segment of segments){const last=lines.at(-1);if(last&&segment.start<last.end-.1)last.end=Math.max(last.end,segment.end);else lines.push({...segment});}
    contentHeight=Math.max(flow.getBoundingClientRect().height,lines.at(-1)?.end||0);
    const result=[];
    for(let i=0;i<lines.length;){
      const start=result.length?lines[i].start:0,limit=start+height;let next=i;
      while(next<lines.length&&lines[next].end<=limit+.5)next++;
      // Um elemento excepcionalmente alto continua paginado por intervalos finitos.
      if(next===i){const end=Math.min(lines[i].end,limit);result.push({start,end});if(end>=lines[i].end-.5)i++;else lines[i].start=end;continue;}
      // Cortar no espaço entre blocos impede que a borda do próximo retrato apareça solta.
      const end=next<lines.length?Math.min(limit,(lines[next-1].end+lines[next].start)/2):Math.min(limit,contentHeight);
      result.push({start,end});i=next;
    }
    return result.length?result:[{start:0,end:Math.min(height,contentHeight)}];
  }
  function refresh(){
    if(!flow?.isConnected)return;
    updateViewport();
    const focused=flow.contains(document.activeElement)?document.activeElement:null;
    const moving=stage.querySelector('fvqe-transporte');
    const keep=anchor||(moving?.running?moving.querySelector('.cargo-play'):focused);anchor=null;
    const box=viewport.getBoundingClientRect(),height=Math.floor(box.height);
    if(height<1||box.width<1)return;
    stage.style.setProperty('--page-height',height+'px');
    const film=stage.dataset.screen==='prologo';
    flow.style.height=film?height+'px':'auto';
    pages=film?[{start:0,end:height}]:measure(height);
    if(film)contentHeight=height;
    total=pages.length;
    if(keep?.isConnected)page=locate(keep);
    apply();
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(refresh);}
  function reveal(el){anchor=el;refresh();}
  function turn(delta){
    if(stage?.querySelector('fvqe-transporte')?.running)return;
    page+=delta;apply();viewport.focus({preventScroll:true});
  }
  function mount(root){
    observer?.disconnect();mutations?.disconnect();stage=root;viewport=root.querySelector('.page-viewport');flow=root.querySelector('.inside');page=0;anchor=null;
    const footer=root.querySelector('.foot>span');if(footer&&!footer.dataset.revision){footer.dataset.revision=revision;footer.textContent+=' · '+revision;}
    root.querySelector('[data-page=previous]').onclick=()=>turn(-1);
    root.querySelector('[data-page=next]').onclick=()=>turn(1);
    observer=new ResizeObserver(schedule);observer.observe(viewport);
    mutations=new MutationObserver(records=>{if(records.some(r=>!(r.target.nodeType===1?r.target:r.target.parentElement)?.closest('.film-time,.cargo-status')))schedule();});mutations.observe(flow,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','open']});
    refresh();document.fonts?.ready.then(schedule);
    for(const img of flow.querySelectorAll('img'))if(!img.complete)img.addEventListener('load',schedule,{once:true});
  }
  window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  document.addEventListener('focusin',schedule);document.addEventListener('focusout',schedule);
  document.addEventListener('toggle',e=>{if(flow?.contains(e.target))schedule();},true);
  document.addEventListener('keydown',e=>{
    if(!viewport||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
    if(e.key==='PageDown'||e.key==='PageUp'){e.preventDefault();turn(e.key==='PageDown'?1:-1);}
  });
  return {mount,refresh,reveal,revision};
})();
