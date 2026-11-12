const {chromium,webkit}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const {inspect}=require('./paginas.cjs'),{reach,settle}=require('./paginas-helper.cjs');
const base=process.env.GAME_URL||'http://localhost:4180',report=[];
async function run(type){
 const browser=await type.launch(type===chromium?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}:{headless:true});
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());p.setDefaultTimeout(12000);
  await p.addInitScript(()=>{window.players=[];const AudioOriginal=window.Audio;window.Audio=function(...args){const a=new AudioOriginal(...args);players.push(a);return a;};});
  await p.goto(base+'/?teste=1');await p.evaluate(()=>document.body.classList.add('hosted-netlify'));
  const tap=async name=>{const b=await reach(p,p.getByRole('button',{name,exact:true,includeHidden:true}));await p.waitForTimeout(280);await b.tap();await settle(p);};
  await tap('Abrir o arquivo');await p.waitForFunction(()=>players.some(a=>a.loop&&!a.paused&&a.currentTime>.1));await tap('Entendi · ir para o menu');await tap('Nova partida');await tap('Pausar animação');await tap('Pular introdução');assert.equal(await p.evaluate(()=>FVQE.estado().screen),'ajuda');
  for(const [width,height,safe] of [[390,844,[47,0,34,0]],[360,640,[0,0,24,0]],[844,390,[0,44,21,44]],[320,568,[0,0,0,0]]]){
   await p.setViewportSize({width,height});await p.evaluate(values=>['top','right','bottom','left'].forEach((side,i)=>document.documentElement.style.setProperty('--safe-'+side,values[i]+'px')),safe);
   for(const large of [false,true]){
    await p.evaluate(large=>{FVQE.abrir('acessibilidade');const b=document.querySelector('[data-value=large]');if((b.getAttribute('aria-pressed')==='true')!==large)b.click()},large);
    for(const screen of ['abertura','conteudo','menu','config','acessibilidade','capitulos','base','rosto','cabelo','roupa','nome','previa','expressoes','creditos','universo']){
     await p.evaluate(s=>FVQE.abrir(s),screen);const result=await inspect(p,`${type.name()} ${width}x${height} ${large} ${screen}`,{wheel:false});report.push({engine:type.name(),version:browser.version(),width,height,safe,large,...result});
    }
   }
  }
  await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{for(const side of ['top','right','bottom','left'])document.documentElement.style.setProperty('--safe-'+side,'0px');FVQE.abrir('nome')});
  const input=await reach(p,p.locator('#playername'));await input.fill('Teste mobile');assert.ok(await input.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('fvqe-entregador-v1')).draft.name),'Teste mobile');
  await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});
  await p.evaluate(()=>{window.originalViewport=window.visualViewport;const v=new EventTarget();Object.assign(v,{height:320,offsetTop:75,scale:1});Object.defineProperty(window,'visualViewport',{configurable:true,value:v});GamePages.refresh()});await settle(p);
  assert.equal(await p.evaluate(()=>document.documentElement.style.getPropertyValue('--app-top')),'75px');assert.equal(await input.evaluate(e=>e.inert),false);
  await p.evaluate(()=>{visualViewport.scale=2;visualViewport.height=160;GamePages.refresh()});assert.equal(await p.evaluate(()=>document.documentElement.style.getPropertyValue('--app-height')),'320px');
  await p.evaluate(()=>{Object.defineProperty(window,'visualViewport',{configurable:true,value:originalViewport});GamePages.refresh();FVQE.iniciar(8)});await tap('Receber o pedido');
  while(await p.evaluate(()=>FVQE.estado().screen==='vinculo')){const b=await reach(p,p.locator('.actions button').first());await b.tap();await p.waitForTimeout(300);}
  await p.evaluate(()=>{window.DeviceOrientationEvent ||= class extends Event{};DeviceOrientationEvent.requestPermission=()=>Promise.resolve('denied')});await tap('Ativar inclinação e calibrar');assert.match(await p.locator('.sensor-status').innerText(),/não autorizado/);
  await p.evaluate(()=>DeviceOrientationEvent.requestPermission=()=>Promise.resolve('granted'));await tap('Ativar inclinação e calibrar');
  await p.evaluate(()=>{Object.defineProperty(screen.orientation,'angle',{configurable:true,value:0});for(const gamma of [5,20]){const e=new Event('deviceorientation');Object.assign(e,{gamma,beta:0});dispatchEvent(e)}});assert.ok(await p.locator('fvqe-transporte').evaluate(e=>e.tilt>0));
  await tap('Começar transporte');await p.evaluate(()=>{Object.defineProperty(screen.orientation,'angle',{configurable:true,value:90});dispatchEvent(new Event('orientationchange'));for(const beta of [10,30]){const e=new Event('deviceorientation');Object.assign(e,{gamma:0,beta});dispatchEvent(e)}});assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.running),false);assert.ok(await p.locator('fvqe-transporte').evaluate(e=>e.tilt>0));
  await tap('Retomar transporte');const right=await reach(p,p.locator('[data-cargo=right]')),box=await right.boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.controlInput),1);await p.mouse.up();assert.equal(await p.locator('fvqe-transporte').evaluate(e=>e.controlInput),0);
  await p.goBack();assert.equal(await p.evaluate(()=>FVQE.estado().screen),'pausa');await tap('Retomar partida');assert.equal(await p.evaluate(()=>FVQE.estado().screen),'transporte');
  await p.evaluate(()=>FVQE.abrir('config'));assert.equal(await p.locator('[data-sound=haptics]').isDisabled(),await p.evaluate(()=>typeof navigator.vibrate!=='function'));
  await p.screenshot({path:'tests/resultados/mobile-'+type.name()+'.png'});assert.deepEqual(errors,[]);console.log(type.name()+': layout, toque, áudio, teclado/zoom simulados, salvamento, sensores simulados, rotação e Voltar aprovados.');
 }finally{await browser.close();}
}
(async()=>{await run(chromium);await run(webkit);fs.writeFileSync('tests/resultados/mobile.json',JSON.stringify({report,limits:'Chrome/WebKit no Windows com toque e áreas seguras emuladas; sem aparelho Android/iPhone físico'},null,2));console.log('Telas verificadas: '+report.length)})().catch(e=>{console.error(e);process.exitCode=1});
