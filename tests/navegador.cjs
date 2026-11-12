const {click,reach}=require('./paginas-helper.cjs');
const {chromium,webkit}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.GAME_URL||'http://localhost:4173',errors=[],results=[];
const executablePath=require('./browser-options.cjs').chromeExecutable;
fs.mkdirSync('tests/resultados',{recursive:true});
async function main(){
 const browser=await (process.env.GAME_BROWSER==='webkit'?webkit:chromium).launch(process.env.GAME_BROWSER==='webkit'?{headless:true}:{executablePath,headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});page.on('dialog',d=>d.accept());
 await page.goto(base+'/?teste=1');await page.waitForFunction(()=>window.FVQE);
 const state=()=>page.evaluate(()=>FVQE.estado());
 async function tap(text){await click(page,text);}
 async function finish(wantWin=true){for(let n=0;n<70;n++){const d=await state();if(d.screen==='desfecho')return d;
   if(d.screen==='entrada')await tap('Receber o pedido');
   else if(d.screen==='vinculo'){await (await reach(page,page.locator('.actions button').first())).click();}
   else if(d.screen==='transporte'){await (await reach(page,page.locator('fvqe-transporte select'))).selectOption('apoio');await tap('Começar transporte');await page.waitForFunction(()=>FVQE.estado().screen!=='transporte',{},{timeout:16000});}
   else if(d.screen==='escolha'){await (await reach(page,page.locator('[data-choice="'+(!wantWin&&['delivery','repair'].includes(d.session.state.step)?1:0)+'"]'))).click();}
   else if(d.screen==='consequencia')await (await reach(page,page.locator('.actions button').first())).click();
   else throw Error('Tela inesperada '+d.screen);
 }throw Error('Percurso não encerrou');}
 await tap('Abrir o arquivo');await tap('Entendi · ir para o menu');await tap('Nova partida');await tap('Pular introdução');await tap('Começar com o crachá padrão');await tap('Levar a carta de Dalva');
 let d=await finish();assert.equal(d.session.state.win,true);assert.equal(d.world.facts.discreto,true);results.push('Nova partida via interface e capítulo 1 concluído');
 await page.evaluate(()=>FVQE.iniciar(4));await tap('Receber o pedido');assert.match(await page.locator('#stage').innerText(),/Dessa vez/);await finish();results.push('Discrição retorna com ajuda real no capítulo 5');
 for(let id=0;id<=12;id++){await page.evaluate(id=>FVQE.iniciar(id),id);d=await finish();assert.equal(d.screen,'desfecho');results.push('Capítulo '+id+' acessível e concluído');}
 await page.evaluate(()=>FVQE.iniciar(0));d=await finish(false);assert.equal(d.session.state.win,false);assert.equal(d.world.facts.fofoca,true);
 await page.evaluate(()=>FVQE.iniciar(4));await tap('Receber o pedido');while((await state()).session.bridges[(await state()).session.bridgeIndex]?.startsWith('apoio_'))await (await reach(page,page.locator('.actions button').first())).click();assert.match(await page.locator('#stage').innerText(),/outra história/);results.push('Rota de fofoca difere da rota discreta');
 await finish();await page.evaluate(()=>FVQE.abrir('config'));if(!await page.locator('[data-sound="haptics"]').isDisabled())await (await reach(page,page.locator('[data-sound="haptics"]'))).selectOption('all');await (await reach(page,page.locator('[data-sound="music"]'))).uncheck();
 const before=await state();const saved=await context.storageState();await context.close();
 const c2=await browser.newContext({storageState:saved,serviceWorkers:'block'});const p2=await c2.newPage();p2.on('pageerror',e=>errors.push(e.message));await p2.goto(base+'/?teste=1');await p2.waitForFunction(()=>window.FVQE);const after=await p2.evaluate(()=>FVQE.estado());assert.deepEqual(after.world,before.world);assert.deepEqual(after.book,before.book);assert.deepEqual(after.sound,before.sound);assert.equal(after.screen,'menu');results.push('Novo contexto restaura histórico, consequências e configurações sem duplicar recibos');
 await click(p2,'Continuar partida');await click(p2,'Abrir último recibo');assert.deepEqual((await p2.evaluate(()=>FVQE.estado())).book,before.book);
 await p2.evaluate(()=>FVQE.abrir('menu'));p2.once('dialog',d=>d.dismiss());await click(p2,'Nova partida');assert.deepEqual((await p2.evaluate(()=>FVQE.estado())).world,before.world);results.push('Cancelar Nova partida preserva o progresso');
 for(const [width,height]of [[320,740],[390,844],[1440,900]]){await p2.setViewportSize({width,height});await p2.evaluate(()=>FVQE.abrir('config'));assert.equal(await p2.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await p2.screenshot({path:'tests/resultados/layout-'+width+'.png',fullPage:true});}results.push('Configurações sem rolagem horizontal em 320, 390 e 1440 px');
 const audio=await p2.evaluate(async()=>{const Engine=window.AudioContext||window.webkitAudioContext;if(!Engine)return null;const ac=new Engine();const names=['turno-comecou','era-so-entregar','agora-explica','fim-do-turno','vitoria','derrota','carimbo','mensagem','batidas','impacto'];const out=[];for(const n of names){const r=await fetch('audio/'+n+'.wav');if(!r.headers.get('content-type').includes('audio'))throw Error('MIME');const b=await ac.decodeAudioData(await r.arrayBuffer());out.push({name:n,duration:b.duration});}await ac.close();return out;});if(audio){assert.equal(audio.length,10);results.push('10 WAV decodificados pelo AudioContext; MIME de áudio correto')}else results.push('Este runtime não expõe Web Audio; reprodução HTML é verificada em tests/mobile.cjs');
 await c2.close();await browser.close();assert.deepEqual(errors,[]);fs.writeFileSync('tests/resultados/navegador.json',JSON.stringify({results,audio,errors},null,2));console.log(results.join('\n'));
}
main().catch(e=>{console.error(e);console.error(errors);process.exit(1)});

