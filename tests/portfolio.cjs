const {chromium,webkit}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const {click,reach,settle}=require('./paginas-helper.cjs'),{chromeExecutable}=require('./browser-options.cjs');
const base=process.env.GAME_URL||'http://localhost:4180',version=require('../package.json').version,report=[];
fs.mkdirSync('tests/resultados',{recursive:true});
(async()=>{
 for(const engine of [chromium,webkit]){
  const browser=await engine.launch(engine===chromium?{executablePath:chromeExecutable}:{});
  try{
   const p=await browser.newPage({viewport:{width:390,height:700},isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[];
   p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/');await settle(p);
   assert.equal(await p.evaluate(()=>typeof window.FVQE),'undefined');
   assert.ok((await p.locator('.foot').innerText()).includes(version));
   await p.screenshot({path:'tests/resultados/portfolio-'+engine.name()+'-abertura.png'});
   await click(p,'Abrir o arquivo');await click(p,'Entendi · ir para o menu');
   await click(p,'Nova partida');await click(p,'Pular introdução');await click(p,'Começar com o crachá padrão');await click(p,'Levar a carta de Dalva');await click(p,'Receber o pedido');
   for(let i=0;i<8&&(await p.locator('#stage').getAttribute('data-screen'))==='vinculo';i++){await(await reach(p,p.locator('.actions button').first())).click();await settle(p)}
   assert.equal(await p.locator('#stage').getAttribute('data-screen'),'escolha');
   await p.screenshot({path:'tests/resultados/portfolio-'+engine.name()+'-entrega.png'});
   await click(p,'Examinar a cena');await click(p,'Voltar à decisão');
   assert.equal(await p.evaluate(()=>document.activeElement.dataset.value),'observar');
   await p.reload();await click(p,'Continuar partida');await click(p,'Retomar do mesmo ponto');
   assert.equal(await p.locator('#stage').getAttribute('data-screen'),'escolha');
   // Bloqueio de acesso não é save corrompido e não pode impedir uma nova partida.
   const blocked=await browser.newPage({viewport:{width:390,height:700},serviceWorkers:'block'});
   await blocked.addInitScript(()=>{window.saveWrites=0;Storage.prototype.getItem=()=>{throw new DOMException('Blocked','SecurityError')};Storage.prototype.setItem=()=>{saveWrites++;throw new DOMException('Blocked','SecurityError')}});
   await blocked.goto(base+'/');assert.match(await blocked.locator('#storage-status').innerText(),/bloqueou o armazenamento/);
   await click(blocked,'Abrir o arquivo');await click(blocked,'Entendi · ir para o menu');await click(blocked,'Nova partida');await click(blocked,'Pular introdução');
   assert.equal(await blocked.locator('#stage').getAttribute('data-screen'),'ajuda');assert.equal(await blocked.evaluate(()=>saveWrites),0);
   await blocked.close();
   const corrupt=await browser.newPage({serviceWorkers:'block'});
   const broken=JSON.stringify({version:2,world:{facts:{},knowledge:{},relations:{},favors:{},promises:{},rumors:[],log:[null]}});
   await corrupt.addInitScript(raw=>localStorage.setItem('fvqe-entregador-v1',raw),broken);await corrupt.goto(base+'/');
   assert.match(await corrupt.locator('#storage-status').innerText(),/progresso anterior.*preservado/);
   assert.equal(await corrupt.evaluate(()=>localStorage.getItem('fvqe-entregador-v1')),broken);await corrupt.close();
   // A ativação acessível das setas deve produzir movimento sem eventos de ponteiro.
   const input=await browser.newPage({viewport:{width:390,height:700},serviceWorkers:'block'});await input.goto(base+'/?teste=1');
   await input.evaluate(()=>FVQE.iniciar(8));await click(input,'Receber o pedido');
   for(let i=0;i<8&&(await input.locator('#stage').getAttribute('data-screen'))==='vinculo';i++){await(await reach(input,input.locator('.actions button').first())).click();await settle(input)}
   await click(input,'Começar transporte');const right=await reach(input,input.getByRole('button',{name:'Equilibrar para direita',includeHidden:true}));await right.press('Enter');
   assert.equal(await input.locator('fvqe-transporte').evaluate(el=>el.controlInput),1);
   await input.waitForFunction(()=>document.querySelector('fvqe-transporte').controlInput===0);
   const left=await reach(input,input.getByRole('button',{name:'Equilibrar para esquerda',includeHidden:true}));await left.evaluate(el=>el.click());
   assert.equal(await input.locator('fvqe-transporte').evaluate(el=>el.controlInput),-1);
   await click(input,'Pausar transporte');assert.equal(await input.locator('fvqe-transporte').evaluate(el=>el.controlInput),0);await input.close();
   const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:320,height:568}});await nojs.goto(base+'/');assert.ok(await nojs.locator('noscript p').isVisible());await nojs.close();
   assert.deepEqual(errors,[]);report.push({engine:engine.name(),browser:browser.version(),productionFlow:true,reload:'mesma decisão recuperada',storageBlocked:'partida jogável, sem sobrescrita',accessibleTransport:'Enter e ativação sem ponteiro respondem; pausa zera entrada',noScript:'mensagem visível',errors});
  }finally{await browser.close();}
 }
 fs.writeFileSync('tests/resultados/portfolio.json',JSON.stringify({version,report},null,2));console.log(JSON.stringify({version,report},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
