window.GamePages=(()=>{
  document.body.classList.toggle('hosted-netlify',location.hostname.endsWith('.netlify.app'));
  let stage=null,viewport=null,flow=null,page=0,total=1,step=0,frame=0,observer=null,mutations=null,anchor=null;
  const gap=24,originalTab=new WeakMap();
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
  function visible(el){
    if(el.checkVisibility?.({visibilityProperty:true})===false)return false;
    const closed=el.closest('details:not([open])');if(closed&&!closed.querySelector('summary')?.contains(el))return false;
    const box=viewport.getBoundingClientRect();
    return rectangles(el).some(r=>r.width>0&&r.height>0&&r.left>=box.left-1&&r.right<=box.right+1&&r.top>=box.top-1&&r.bottom<=box.bottom+1);
  }
  function updateControls(){
    for(const el of flow.querySelectorAll(controls)){
      if(!originalTab.has(el))originalTab.set(el,el.getAttribute('tabindex'));
      const shown=visible(el);el.inert=!shown;
      if(shown){const old=originalTab.get(el);if(old===null)el.removeAttribute('tabindex');else el.setAttribute('tabindex',old);el.removeAttribute('aria-hidden');}
      else{el.tabIndex=-1;el.setAttribute('aria-hidden','true');}
    }
  }
  function apply(){
    page=Math.max(0,Math.min(total-1,page));flow.style.setProperty('--page-offset',(-page*step)+'px');
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
    return Math.max(0,Math.floor((rect.left-box.left+1)/step));
  }
  function refresh(){
    if(!flow?.isConnected)return;
    updateViewport();
    const focused=flow.contains(document.activeElement)?document.activeElement:null;
    const moving=stage.querySelector('fvqe-transporte');
    const keep=anchor||(moving?.running?moving.querySelector('.cargo-play'):focused);anchor=null;
    // A altura percentual de um filho de flex pode ser indefinida durante a
    // composição mobile. Sem altura definida, as colunas viram um bloco vertical.
    const box=viewport.getBoundingClientRect(),height=Math.floor(box.height),width=box.width;
    if(height<1||width<1)return;
    stage.style.setProperty('--page-height',height+'px');
    flow.style.height=height+'px';
    step=width+gap;
    // Alguns motores não incluem todas as colunas em scrollWidth. Medir também
    // os fragmentos impede que "1 / 1" esconda conteúdo ainda fora da janela.
    const range=document.createRange();range.selectNodeContents(flow);
    const left=flow.getBoundingClientRect().left;
    let extent=flow.scrollWidth;
    for(const rect of range.getClientRects())extent=Math.max(extent,rect.right-left);
    total=Math.max(1,Math.ceil((extent+gap-2)/step));
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
  return {mount,refresh,reveal};
})();
