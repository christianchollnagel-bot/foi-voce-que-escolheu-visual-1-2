const {click,reach}=require('./paginas-helper.cjs');
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.GAME_URL||'http://localhost:4176';
async function main(){
 const b=await chromium.launch({executablePath:require('./browser-options.cjs').chromeExecutable,headless:true,args:['--autoplay-policy=document-user-activation-required']});
 const report={checks:[],devices:[]};
 try{
  for(const touch of [false,true]){
   const c=await b.newContext({viewport:{width:320,height:740},isMobile:touch,hasTouch:touch,serviceWorkers:'block'});
   await c.addInitScript(()=>{window.audioAudit=[];window.forceAudioFailure='';window.audioPlayCalls=0;const Original=window.Audio;window.Audio=function(src){const a=new Original(src),play=a.play.bind(a);a.play=()=>{audioPlayCalls++;return forceAudioFailure?Promise.reject(new DOMException('Falha simulada',forceAudioFailure)):play();};audioAudit.push(a);return a;}});
   const p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
   await p.goto(base+'/?teste=1');await p.waitForFunction(()=>window.FVQE);
   const press=async name=>{const el=await reach(p,p.getByRole('button',{name,exact:true,includeHidden:true}));if(touch)await el.tap();else await el.click();};
   const audible=()=>p.waitForFunction(()=>audioAudit.some(a=>a.loop&&!a.paused&&a.volume>0&&a.currentTime>.2));
   const silent=async()=>assert.equal(await p.evaluate(()=>audioAudit.every(a=>a.paused)),true);
   const narrative=()=>p.evaluate(()=>{const {sound,...rest}=FVQE.estado();return rest;});
   assert.equal(await p.getByRole('button',{name:'Desativar som',exact:true}).count(),1);
   assert.equal(await p.evaluate(()=>FVQE.estado().sound.muted),false);
   assert.equal(await p.evaluate(()=>audioPlayCalls),0,'aguarda o gesto permitido pelo navegador');
   await press('Abrir o arquivo');await audible();
   await p.evaluate(()=>{Feedback.cancel();Feedback.fire('message')});
   await p.waitForFunction(()=>audioAudit.some(a=>!a.loop&&!a.paused&&a.currentTime>.1));
   report.devices.push({touch,initial:await p.evaluate(()=>audioAudit.map(a=>({loop:a.loop,time:a.currentTime,volume:a.volume,src:a.getAttribute('src')})))});
   const before=await narrative();
   await press('Desativar som');await silent();
   assert.deepEqual(await narrative(),before,'o botão não altera o percurso');
   assert.equal(await p.getByRole('button',{name:'Ativar som',exact:true}).count(),1);
   await p.evaluate(()=>document.body.click());await silent();
   await p.reload();await p.waitForFunction(()=>window.FVQE);
   assert.equal(await p.evaluate(()=>FVQE.estado().sound.muted),true);await silent();
   await press('Ativar som');await audible();
   await p.evaluate(()=>FVQE.abrir('config'));await silent();
   await (await reach(p,p.locator('[data-sound="music"]'))).uncheck();
   await press('Desativar som');await press('Ativar som');
   assert.equal(await p.evaluate(()=>FVQE.estado().sound.music),false,'liga/desliga preserva a escolha de música');
   assert.equal(await p.evaluate(()=>FVQE.estado().sound.effects),true);await silent();
   await (await reach(p,p.locator('[data-sound="effects"]'))).uncheck();await press('Ativar som');
   assert.equal(await p.locator('[data-sound="music"]').isChecked(),true);
   assert.equal(await p.locator('[data-sound="effects"]').isChecked(),true);
   await (await reach(p,p.locator('[data-sound="volume"]'))).fill('0');await press('Ativar som');
   assert.equal(await p.evaluate(()=>FVQE.estado().sound.volume),.55);await silent();
   await p.evaluate(()=>FVQE.iniciar(0));await audible();
   await p.evaluate(()=>{Feedback.cancel();Feedback.fire('message')});
   await p.waitForFunction(()=>audioAudit.some(a=>!a.loop&&a.currentTime>.1));
   assert.equal(await p.evaluate(()=>audioAudit.length),2,'canais reutilizados entre telas');
   for(const [context,file] of [['confusion','agora-explica'],['ending','fim-do-turno'],['opening','turno-comecou'],['route','era-so-entregar']]){
    await p.evaluate(value=>Feedback.context(value),context);
    await p.waitForFunction(file=>audioAudit.some(a=>a.loop&&a.getAttribute('src').includes(file)&&!a.paused&&a.currentTime>.15&&Number.isFinite(a.duration)),file);
    await p.evaluate(()=>{const music=audioAudit.find(a=>a.loop);music.currentTime=music.duration-.08;});
    await p.waitForFunction(()=>audioAudit.some(a=>a.loop&&!a.paused&&a.currentTime>.1&&a.currentTime<1));
   }
   assert.equal(await p.evaluate(()=>audioAudit.length),2,'trocas e retornos reutilizam os canais');
   await p.evaluate(()=>{const s=document.getElementById('stage');s.scrollTop=s.scrollHeight});
   const layout=await p.evaluate(()=>{const s=document.getElementById('stage').getBoundingClientRect(),b=document.getElementById('sound-toggle').getBoundingClientRect();return {visible:b.top>=Math.max(0,s.top)&&b.bottom<=Math.min(innerHeight,s.bottom),fits:document.documentElement.scrollWidth<=innerWidth};});
   assert.deepEqual(layout,{visible:true,fits:true});
   await p.screenshot({path:'tests/resultados/audio-'+(touch?'toque':'desktop')+'.png'});
   await press('Desativar som');await p.evaluate(()=>forceAudioFailure='NotAllowedError');await press('Ativar som');
   await p.waitForFunction(()=>document.getElementById('audio-status').textContent.includes('bloqueou'));
   await p.evaluate(()=>forceAudioFailure='');await p.locator('#audio-status').click();await audible();
   await p.waitForFunction(()=>!document.getElementById('audio-status').textContent.includes('bloqueou'));
   await press('Desativar som');await p.evaluate(()=>forceAudioFailure='NotSupportedError');await press('Ativar som');
   await p.waitForFunction(()=>document.getElementById('audio-status').textContent.includes('carregar'));
   await p.evaluate(()=>forceAudioFailure='');await press('Desativar som');await press('Ativar som');await audible();
   // Uma cópia antiga sem "muted" deve carregar com som ligado.
   const legacy=await p.evaluate(()=>{const d=FVQE.estado();delete d.sound.muted;return d;});
   await p.goto('about:blank');await c.addInitScript(d=>localStorage.setItem('fvqe-entregador-v1',JSON.stringify(d)),legacy);
   await p.goto(base+'/?teste=1');await p.waitForFunction(()=>window.FVQE);
   assert.equal(await p.evaluate(()=>FVQE.estado().sound.muted),false);
   // Desligar como primeira interação não deve produzir um trecho de áudio.
   await press('Desativar som');assert.equal(await p.evaluate(()=>audioPlayCalls),0);await silent();
   await p.getByRole('button',{name:'Ativar som',exact:true}).focus();await p.keyboard.press('Enter');await audible();
   await p.getByRole('button',{name:'Desativar som',exact:true}).focus();await p.keyboard.press('Space');await silent();
   assert.deepEqual(errors,[]);await c.close();
  }
  report.checks=['Som ligado por padrão; primeira ação do jogo inicia música sem botão de áudio','Música e efeito reproduzem com relógio avançando em clique e toque','Ativar/desativar interrompe ambos os canais sem alterar a narrativa','Mudo persiste ao recarregar; configurações individuais são preservadas','Recupera volume zero e canais desmarcados ao ativar','Pausa e retomada usam os mesmos dois canais','As quatro trilhas carregam, completam a emenda do loop e retomam após troca de contexto','Controle permanece visível na navegação por páginas e cabe em 320 px','Bloqueio de autoplay e falha de mídia informados; recuperação funciona','Salvamento anterior compatível; primeira ação de desligar não toca áudio','Botão funciona com Enter e Espaço'];
  fs.writeFileSync('tests/resultados/audio.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await b.close();}
}
fs.mkdirSync('tests/resultados',{recursive:true});main().catch(e=>{console.error(e);process.exitCode=1});
