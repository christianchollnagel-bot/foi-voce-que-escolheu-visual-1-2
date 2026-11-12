const {webkit,chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {reach,settle}=require('./paginas-helper.cjs'),{inspect}=require('./paginas.cjs');
const base=process.env.GAME_URL||'http://localhost:4180',report=[];
(async()=>{for(const type of [webkit,chromium]){
 const browser=await type.launch(type===chromium?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
 try{
  const p=await browser.newPage({viewport:{width:384,height:660},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/');
  await p.evaluate(()=>{document.body.classList.add('hosted-netlify');document.documentElement.style.setProperty('--safe-top','47px');document.documentElement.style.setProperty('--safe-bottom','34px')});await settle(p);
  const tap=async name=>{await(await reach(p,p.getByRole('button',{name,exact:true,includeHidden:true}),{touch:true})).tap();await settle(p)};
  await tap('Abrir o arquivo');await tap('Entendi · ir para o menu');await inspect(p,type.name()+' menu do vídeo',{wheel:false});
  await tap('Nova partida');await tap('Pular introdução');await tap('Montar meu crachá');
  assert.match(await p.locator('.foot').innerText(),/12\.11-C/);assert.ok(Number(await p.locator('#stage').getAttribute('data-pages'))>1);
  const choice=p.locator('[data-action=set-base][data-value=b]');await(await reach(p,choice,{touch:true})).tap();await settle(p);assert.equal(await choice.getAttribute('aria-pressed'),'true');
  await inspect(p,type.name()+' catálogo do vídeo',{wheel:false});
  const last=p.locator('[data-action=set-base]').last();await(await reach(p,last,{touch:true})).tap();await settle(p);assert.equal(await last.getAttribute('aria-pressed'),'true');
  await tap('Usar este avatar');await inspect(p,type.name()+' universo do vídeo',{wheel:false});await tap('Levar a carta de Dalva');assert.equal(await p.locator('#stage').getAttribute('data-screen'),'entrada');
  await tap('Receber o pedido');for(let i=0;i<6&&await p.locator('#stage').getAttribute('data-screen')==='vinculo';i++){await(await reach(p,p.locator('.actions button').first(),{touch:true})).tap();await settle(p)}
  assert.equal(await p.locator('#stage').getAttribute('data-screen'),'escolha');await tap('Ⅱ Pausa');await tap('Retomar partida');assert.equal(await p.locator('#stage').getAttribute('data-screen'),'escolha');assert.deepEqual(errors,[]);
  report.push({engine:type.name(),version:browser.version(),flow:'menu, introdução, crachá, último retrato, confirmar, carta, pedido e pausa',productionMode:true,errors});
 }finally{await browser.close();}
}fs.writeFileSync('tests/resultados/videos-iphone.json',JSON.stringify({report,limits:'Fluxos dos vídeos reproduzidos em automação; sem inspeção no iPhone físico.'},null,2));console.log('Fluxos dos dois vídeos aprovados em modo normal (sem API de teste), por toque, em Chrome/WebKit.');})().catch(e=>{console.error(e);process.exitCode=1});
