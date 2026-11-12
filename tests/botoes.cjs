const {webkit,chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const {reach,settle}=require('./paginas-helper.cjs');const base=process.env.GAME_URL||'http://localhost:4180',checks=[];
fs.mkdirSync('tests/resultados',{recursive:true});
async function run(type){
 const b=await type.launch(type===chromium?{executablePath:require('./browser-options.cjs').chromeExecutable}:{});
 try{
  const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block',acceptDownloads:true});let accept=true,dialogs=0,downloads=0;const errors=[];
  p.setDefaultTimeout(12000);p.on('dialog',d=>{dialogs++;accept?d.accept():d.dismiss()});p.on('download',()=>downloads++);p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{const seed=sessionStorage.getItem('button-audit-seed');if(seed!==null){localStorage.setItem('fvqe-entregador-v1',seed);sessionStorage.removeItem('button-audit-seed')}});
  await p.goto(base+'/?teste=1');const state=()=>p.evaluate(()=>FVQE.estado()),fresh=await state();
  const record=(screen,button,extra={})=>checks.push({engine:type.name(),screen,button,...extra});
  async function restore(seed,screen){await p.evaluate(s=>sessionStorage.setItem('button-audit-seed',typeof s==='string'?s:JSON.stringify(s)),seed);await p.reload();await p.evaluate(s=>{document.body.classList.add('hosted-netlify');FVQE.abrir(s)},screen);await settle(p);}
  async function target(locator){const summary=locator.locator('xpath=ancestor::details[not(@open)][1]/summary');if(await summary.count())await(await reach(p,summary,{touch:true})).tap();return reach(p,locator,{touch:true});}
  async function tapName(name){await(await target(p.getByRole('button',{name,exact:true,includeHidden:true}))).tap();await settle(p);}
  async function audit(seed,screen){
   console.log(type.name()+': auditando '+screen);
   await restore(seed,screen);const list=await p.locator('#stage button[data-action]').evaluateAll(bs=>bs.map(b=>({a:b.dataset.action,v:b.dataset.value??'',label:b.textContent.trim()})));
   for(const d of list){
    await restore(seed,screen);
    const selector=d.a==='sound-toggle'?'#sound-toggle':'#stage button[data-action="'+d.a+'"][data-value="'+d.v+'"]';const control=await target(p.locator(selector));
    const before=await state(),previousDialogs=dialogs,previousDownloads=downloads;await control.tap();await settle(p);const after=await state();
    if(d.a.startsWith('set-'))assert.equal(after.draft[d.a.slice(4)],d.v,d.label);
    else if(d.a==='expr')assert.equal(after.shownExpression,d.v,d.label);
    else if(d.a==='pref')assert.equal(after.prefs[d.v],!before.prefs[d.v],d.label);
    else if(d.a==='open')assert.equal(after.screen,d.v,d.label);
    else if(d.a==='sound-toggle')assert.notEqual(after.sound.muted,before.sound.muted,d.label);
    else if(d.a==='start-case')assert.ok(after.session?.id===Number(d.v)||after.intro.id===Number(d.v),d.label);
    else if(d.label==='Resetar jogo'){assert.equal(dialogs,previousDialogs+1);assert.equal(after.session,null);assert.deepEqual(after.book,[]);}
    else if(d.label==='Exportar progresso preservado'){assert.ok(downloads>previousDownloads);}
    else assert.ok(JSON.stringify(after)!==JSON.stringify(before)||dialogs>previousDialogs,d.label+' não reagiu em '+screen);
    record(screen,d.label,{action:d.a,value:d.v});
   }
  }
  for(const screen of ['abertura','conteudo','menu','ajuda','config','acessibilidade','capitulos','base','rosto','cabelo','roupa','nome','previa','expressoes','creditos','universo','turno'])await audit(fresh,screen);
  // Toques consecutivos na mesma coordenada; sem pausas artificiais entre ativações.
  await restore(fresh,'acessibilidade');const c=await target(p.locator('[data-action=pref][data-value=contrast]')),r=await c.boundingBox();
  await p.touchscreen.tap(r.x+20,r.y+20);await p.touchscreen.tap(r.x+20,r.y+20);assert.equal((await state()).prefs.contrast,false);record('acessibilidade','dois toques rápidos no mesmo lugar');
  await p.locator('[data-action=pref][data-value=contrast]').dispatchEvent('click',{detail:2,bubbles:true});assert.equal((await state()).prefs.contrast,true);record('acessibilidade','ativação com click.detail=2');
  await restore(fresh,'menu');await tapName('Nova partida');await tapName('Pausar animação');assert.equal(await p.locator('fvqe-introducao').evaluate(e=>e.running),false);await tapName('Retomar animação');assert.equal(await p.locator('fvqe-introducao').evaluate(e=>e.running),true);await tapName('Pular introdução');assert.equal((await state()).screen,'ajuda');record('prologo','pausar / retomar / pular');
  await restore(fresh,'config');for(const key of ['music','effects']){const control=await target(p.locator('[data-sound='+key+']')),old=await control.isChecked();await control.tap();assert.equal((await state()).sound[key],!old);record('config',key);}
  const volume=await target(p.locator('[data-sound=volume]'));await volume.fill('0.25');assert.equal((await state()).sound.volume,.25);record('config','volume');
  const haptic=p.locator('[data-sound=haptics]');if(await haptic.isEnabled()){await(await target(haptic)).selectOption('all');assert.equal((await state()).sound.haptics,'all');record('config','vibração');}else{assert.ok(await p.locator('#haptic-support').count());record('config','vibração indisponível sinalizada',{disabled:true});}
  // Criar estados reais de um percurso; depois ativar cada botão desses estados.
  await restore(fresh,'menu');await p.evaluate(()=>FVQE.iniciar(0));const seeds=[];
  for(let i=0;i<25;i++){const s=await state();seeds.push(s);if(s.screen==='desfecho')break;const first=await target(p.locator('.actions button').first());await first.tap();await settle(p);}
  assert.equal((await state()).screen,'desfecho');const completed=await state();
  for(const seed of seeds)await audit(seed,seed.screen);
  for(const screen of ['pausa','continuar','historico','revisao','resumo','transicao','documento','observar','perguntar','encerrar'])await audit(completed,screen);
  await restore(completed,'menu');accept=false;const before=await state();await tapName('Resetar jogo');assert.deepEqual(await state(),before);accept=true;record('menu','cancelar reset preserva partida');
  await restore('{quebrado','menu');await tapName('Exportar progresso preservado');assert.ok(downloads);record('menu','exportar registro preservado');
  await restore(fresh,'menu');await p.evaluate(()=>FVQE.iniciar(8));await tapName('Receber o pedido');while((await state()).screen==='vinculo'){await(await target(p.locator('.actions button').first())).tap();await settle(p);}
  await p.evaluate(()=>{window.DeviceOrientationEvent ||= class extends Event{};DeviceOrientationEvent.requestPermission=()=>Promise.resolve('denied')});await tapName('Ativar inclinação e calibrar');assert.match(await p.locator('.sensor-status').innerText(),/não autorizado/);record('transporte','sensor: recusa mantém alternativas');
  await(await target(p.locator('fvqe-transporte select'))).selectOption('apoio');await tapName('Começar transporte');assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.strategy),'apoio');
  await p.locator('fvqe-transporte').evaluate(el=>{window.directionInputs=[];el.addEventListener('pointerdown',e=>{if(e.target.dataset.cargo==='left'||e.target.dataset.cargo==='right')directionInputs.push(el.controlInput)})});
  await tapName('Equilibrar para esquerda');await tapName('Equilibrar para direita');assert.deepEqual(await p.evaluate(()=>directionInputs),[-1,1]);assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.controlInput),0);await tapName('Pausar transporte');await tapName('Retomar transporte');assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.running),true);record('transporte','estratégia / iniciar / esquerda / direita / pausar / retomar');
  assert.deepEqual(errors,[]);console.log(type.name()+': '+checks.filter(x=>x.engine===type.name()).length+' verificações de controles aprovadas');
 }finally{await b.close();}
}
(async()=>{for(const type of [webkit,chromium])await run(type);fs.writeFileSync('tests/resultados/botoes.json',JSON.stringify({checks,method:'toques reais de automação, sem intervalo artificial; estados verificados após cada ação',limits:'WebKit/Chrome no Windows, sem iPhone físico'},null,2));})().catch(e=>{console.error(e);process.exitCode=1});
