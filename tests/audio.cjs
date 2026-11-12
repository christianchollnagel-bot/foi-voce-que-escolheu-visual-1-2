const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const base=process.env.GAME_URL||'http://localhost:4176';
async function main(){
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=document-user-activation-required']});const report={checks:[],devices:[]};
 for(const touch of [false,true]){
  const c=await b.newContext({viewport:{width:320,height:740},isMobile:touch,hasTouch:touch,serviceWorkers:'block'});
  await c.addInitScript(()=>{window.audioAudit=[];window.forceAudioFailure='';const Original=window.Audio;window.Audio=function(src){const a=new Original(src),play=a.play.bind(a);a.play=()=>forceAudioFailure?Promise.reject(new DOMException('Teste de bloqueio',forceAudioFailure)):play();audioAudit.push(a);return a;}});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/?teste=1');await p.waitForFunction(()=>window.FVQE);
  const activate=async()=>{const el=p.getByRole('button',{name:'Ativar e testar som',exact:true});if(touch)await el.tap();else await el.click();};
  await activate();await p.waitForFunction(()=>audioAudit.some(a=>a.loop&&!a.paused&&a.currentTime>.3));await p.waitForFunction(()=>audioAudit.some(a=>!a.loop&&a.currentTime>.1));
  const initial=await p.evaluate(()=>audioAudit.map(a=>({loop:a.loop,time:a.currentTime,volume:a.volume,src:a.getAttribute('src')})));report.devices.push({touch,initial});
  await p.waitForFunction(()=>document.getElementById('audio-status').textContent==='Música em reprodução.');
  await p.evaluate(()=>FVQE.iniciar(0));await p.waitForFunction(()=>audioAudit.find(a=>a.loop).getAttribute('src').includes('era-so-entregar')&&audioAudit.find(a=>a.loop).currentTime>.2);
  assert.equal(await p.evaluate(()=>audioAudit.length),2,'canais reutilizados');
  const before=await p.evaluate(()=>FVQE.estado().world);await p.evaluate(()=>FVQE.abrir('config'));assert.equal(await p.evaluate(()=>audioAudit.find(a=>a.loop).paused),true);
  await activate();await p.waitForFunction(()=>audioAudit.some(a=>!a.loop&&!a.paused));assert.equal(await p.evaluate(()=>audioAudit.find(a=>a.loop).paused),true);assert.deepEqual(await p.evaluate(()=>FVQE.estado().world),before);
  await p.locator('[data-sound="music"]').uncheck();await p.locator('[data-sound="effects"]').uncheck();await p.locator('[data-sound="volume"]').fill('0');
  assert.match(await p.locator('#audio-status').innerText(),/desligado/);await p.reload();await p.waitForFunction(()=>window.FVQE);assert.equal(await p.evaluate(()=>FVQE.estado().sound.volume),0);
  await activate();await p.waitForFunction(()=>audioAudit.some(a=>a.loop&&!a.paused&&a.currentTime>.2));assert.equal(await p.evaluate(()=>FVQE.estado().sound.volume),.55);
  await p.evaluate(()=>{forceAudioFailure='NotAllowedError';FVQE.abrir('config')});await p.waitForTimeout(300);await activate();await p.waitForFunction(()=>document.getElementById('audio-status').textContent.includes('bloqueou'));
  await p.evaluate(()=>forceAudioFailure='');await p.waitForTimeout(300);await activate();await p.waitForFunction(()=>audioAudit.some(a=>!a.loop&&!a.paused));await p.waitForFunction(()=>!document.getElementById('audio-status').textContent.includes('bloqueou'));assert.doesNotMatch(await p.locator('#audio-status').innerText(),/bloqueou/);
  await p.evaluate(()=>forceAudioFailure='NotSupportedError');await p.waitForTimeout(300);await activate();await p.waitForFunction(()=>document.getElementById('audio-status').textContent.includes('carregar'));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await p.screenshot({path:'tests/resultados/audio-'+(touch?'toque':'desktop')+'.png'});
  assert.deepEqual(errors,[]);await c.close();
 }
 report.checks=['Reprodução real com clique e toque sob política de autoplay restrita','Música e efeito com relógio avançando e sem erro de mídia','Dois canais reutilizados entre telas','Prévia nas configurações sem reativar música pausada','Mute/volume zero persistidos; botão explícito recupera áudio','Bloqueio de autoplay e falha de mídia informados; recuperação pelo botão','Preferências de som não alteram estado narrativo','Layout sem rolagem horizontal em 320 px'];
 const old=JSON.parse(cp.execFileSync('git',['show','c770142ee3ae4b31504c94bc85e4bf6833b2d106:docs/audio-medicoes.json'],{encoding:'utf8'}));const measurements=JSON.parse(fs.readFileSync('docs/audio-medicoes.json'));
 report.levels=measurements.map(m=>{const wav=fs.readFileSync('web/audio/'+m.file);let max=0;for(let i=44;i<wav.length;i+=2)max=Math.max(max,Math.abs(wav.readInt16LE(i))/32768);assert.ok(max>.7&&max<.81);const prior=old.find(x=>x.file===m.file);return {file:m.file,peak:max,rms:m.rms,changeDb:20*Math.log10(m.rms/prior.rms)+(m.loop?20*Math.log10(.55/.36):20*Math.log10(.9/.8))};});
 await b.close();fs.writeFileSync('tests/resultados/audio.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}
fs.mkdirSync('tests/resultados',{recursive:true});main().catch(e=>{console.error(e);process.exit(1)});
