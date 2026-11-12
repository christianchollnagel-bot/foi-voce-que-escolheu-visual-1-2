const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');const {click,reach}=require('./paginas-helper.cjs');
async function main(){
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,serviceWorkers:'block'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{
   window.audioNodes=[];window.players=[];const OriginalAudio=window.Audio,OriginalContext=window.AudioContext;
   window.Audio=function(...args){const a=new OriginalAudio(...args);Object.defineProperty(a,'volume',{get:()=>1,set:()=>{}});players.push(a);return a};
   window.AudioContext=function(...args){const ctx=new OriginalContext(...args),gain=ctx.createGain.bind(ctx);window.mobileMixer=ctx;ctx.createGain=()=>{const node=gain();audioNodes.push(node);return node};return ctx};
  });
  await p.goto((process.env.GAME_URL||'http://localhost:4180')+'/?teste=1');await click(p,'Abrir o arquivo');await p.waitForFunction(()=>window.mobileMixer?.state==='running'&&players[0].currentTime>.1);
  assert.equal(await p.evaluate(()=>audioNodes.length),2);assert.ok(Math.abs(await p.evaluate(()=>audioNodes[0].gain.value)-.55*.55)<.001);
  await p.evaluate(()=>{Feedback.cancel();Feedback.fire('win')});await p.waitForFunction(()=>players[1].currentTime>.1&&!players[1].paused);assert.ok(Math.abs(await p.evaluate(()=>audioNodes[0].gain.value)-.55*.18)<.001);
  await click(p,'Desativar som');assert.ok(await p.evaluate(()=>players.every(a=>a.paused)&&audioNodes.every(n=>n.gain.value===0)));
  await click(p,'Ativar som');await p.evaluate(()=>FVQE.abrir('config'));const volume=await reach(p,p.locator('[data-sound=volume]'));await volume.fill('0.25');assert.ok(Math.abs(await p.evaluate(()=>audioNodes[1].gain.value)-.25*.9)<.001);
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});await p.waitForFunction(()=>mobileMixer.state==='suspended');assert.ok(await p.evaluate(()=>players.every(a=>a.paused)));
  await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await click(p,'Voltar');await p.waitForFunction(()=>mobileMixer.state==='running');assert.equal(await p.evaluate(()=>audioNodes.length),2);
  assert.deepEqual(errors,[]);const report={volumeReadOnly:'simulado',mixer:'dois ganhos reais de Web Audio; volume, redução sob efeito e mudo verificados',lifecycle:'suspende ao ocultar e retoma no gesto, sem duplicar canais',errors};fs.writeFileSync('tests/resultados/audio-mobile.json',JSON.stringify(report,null,2));console.log(report);
 }finally{await b.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
