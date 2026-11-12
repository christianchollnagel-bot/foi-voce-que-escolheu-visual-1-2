const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {settle,reach,click}=require('./paginas-helper.cjs'),{inspect}=require('./paginas.cjs');
const base=process.env.GAME_URL||'http://localhost:4180',out=[],errors=[];
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const p=await browser.newPage({viewport:{width:320,height:568},serviceWorkers:'block'});p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
  let accept=true;p.on('dialog',d=>accept?d.accept():d.dismiss());
  await p.goto(base+'/?teste=1');await p.evaluate(()=>document.body.classList.add('hosted-netlify'));await p.evaluate(()=>document.fonts.ready);
  const state=()=>p.evaluate(()=>FVQE.estado());
  const first=async()=>{await (await reach(p,p.locator('.actions button').first())).click();await settle(p);};
  await p.evaluate(()=>FVQE.iniciar(0));
  for(let n=0;n<25&&(await state()).screen!=='desfecho';n++){
   const before=await state();await inspect(p,'percurso '+before.screen);assert.deepEqual(await state(),before,'Paginar altera a partida');
   if(before.screen==='escolha'){
    for(const screen of ['observar','perguntar','documento','historico']){await p.evaluate(s=>FVQE.abrir(s),screen);await inspect(p,screen);}
    await p.evaluate(()=>FVQE.abrir('escolha'));
   }
   await first();
  }
  assert.equal((await state()).screen,'desfecho');await inspect(p,'recibo');out.push('Percurso completo, consultas, recibo e paginação sem mutar a partida');
  for(const screen of ['historico','revisao','resumo','transicao','encerrar','pausa','continuar']){await p.evaluate(s=>FVQE.abrir(s),screen);await inspect(p,screen);}
  await p.evaluate(()=>FVQE.abrir('capitulos'));
  for(let i=0;i<3;i++){
   const summary=await reach(p,p.locator('summary').nth(i));if(!await summary.evaluate(e=>e.parentElement.open))await summary.click();await settle(p);
  }
  await inspect(p,'todos os atos expandidos');out.push('Histórico, consultas e três atos expandidos com todos os controles acessíveis');
  await p.evaluate(()=>FVQE.abrir('base'));const lastAvatar=p.locator('[data-action=set-base]').last();await (await reach(p,lastAvatar)).click();await settle(p);
  assert.equal(await p.evaluate(()=>document.activeElement.dataset.action),'set-base');assert.equal(await lastAvatar.evaluate(e=>e.inert),false);out.push('Seleção de avatar preserva foco e página');
  await p.evaluate(()=>FVQE.abrir('nome'));const name=await reach(p,p.locator('#playername'));await name.fill('Entregador teste');
  await p.setViewportSize({width:320,height:300});await settle(p);await inspect(p,'teclado virtual simulado');assert.equal(await p.locator('#playername').inputValue(),'Entregador teste');
  await p.setViewportSize({width:844,height:390});await settle(p);await inspect(p,'rotação durante edição');out.push('Janela reduzida durante edição e troca de orientação preservam o texto');
  for(const large of [false,true]){
   await p.evaluate(large=>{FVQE.abrir('acessibilidade');const b=document.querySelector('[data-value=large]');if((b.getAttribute('aria-pressed')==='true')!==large)b.click();},large);
   for(const [width,height] of [[320,568],[844,390]]){
    await p.setViewportSize({width,height});await p.evaluate(()=>FVQE.iniciar(8));await click(p,'Receber o pedido');while((await state()).screen==='vinculo')await first();
    assert.equal((await state()).screen,'transporte');await inspect(p,`preparo ${width} ${large}`);await click(p,'Começar transporte');await settle(p);
    for(const action of ['left','right','pause'])assert.equal(await p.locator(`[data-cargo=${action}]`).evaluate(e=>!e.inert),true,`transporte ${width} ${large}: ${action} invisível`);
    assert.equal(await p.locator('[data-page=next]').isDisabled(),true);
    await p.keyboard.down('ArrowRight');assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.controlInput),1);await p.keyboard.up('ArrowRight');
    await click(p,'Pausar transporte');await inspect(p,`transporte pausado ${width} ${large}`);await click(p,'Retomar transporte');assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.running),true);
    await p.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.running),false);
   }
  }
  out.push('Transporte com teclado, pausa, retomada e controles juntos em tela estreita/deitada e fonte ampliada');
  await p.evaluate(()=>{FVQE.abrir('menu');localStorage.setItem('outro-aplicativo','preservar')});
  const before=await state();accept=false;await click(p,'Resetar jogo');assert.deepEqual(await state(),before,'Cancelar reset apagou dados');
  accept=true;await p.waitForTimeout(300);await click(p,'Resetar jogo');let clean=await state();assert.equal(clean.session,null);assert.deepEqual(clean.book,[]);assert.deepEqual(clean.world,await p.evaluate(()=>Continuidade.fresh()));assert.equal(clean.profile.name,'');assert.deepEqual(clean.prefs,before.prefs);assert.deepEqual(clean.sound,before.sound);assert.equal(clean.screen,'menu');
  await p.reload();clean=await state();assert.equal(clean.session,null);assert.deepEqual(clean.book,[]);assert.deepEqual(clean.sound,before.sound);assert.deepEqual(clean.prefs,before.prefs);assert.equal(await p.evaluate(()=>localStorage.getItem('outro-aplicativo')),'preservar');
  out.push('Resetar jogo confirma, cancelamento preserva estado, reset persiste e mantém preferências/dados alheios');
  await p.setViewportSize({width:390,height:844});await p.evaluate(()=>FVQE.abrir('menu'));await settle(p);await p.screenshot({path:'tests/resultados/menu-paginado.png'});
  assert.deepEqual(errors,[]);fs.writeFileSync('tests/resultados/fluxos-paginados.json',JSON.stringify({out,errors},null,2));console.log(out.join('\n'));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
