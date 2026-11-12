const {webkit}=require('playwright'),{spawn}=require('node:child_process'),fs=require('node:fs'),assert=require('node:assert/strict');
const {click}=require('./paginas-helper.cjs');
// setOffline do WebKit/Playwright rejeita respostas do próprio worker (#42775).
// Encerrar o servidor testa a falta real de rede sem esse desvio da automação.
async function main(){
 const server=spawn(process.execPath,['scripts/servir.cjs','web','4182'],{windowsHide:true,stdio:['ignore','pipe','pipe']});let browser;
 try{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Servidor encerrou: '+code)))});
  browser=await webkit.launch();const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://localhost:4182/?teste=1');await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();await p.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const count=await p.evaluate(async()=>{const key=(await caches.keys()).find(k=>k.startsWith('fvqe-v1|'));return(await(await caches.open(key)).keys()).length});assert.equal(count,906);
  const closed=new Promise(resolve=>server.once('exit',resolve));server.kill();await closed;
  await assert.rejects(fetch('http://localhost:4182/sem-cache'));
  await p.reload();await p.waitForFunction(()=>!!window.FVQE);await click(p,'Nova partida');await p.waitForFunction(()=>!!document.querySelector('fvqe-introducao'));await click(p,'Pular introdução');assert.equal(await p.evaluate(()=>FVQE.estado().screen),'ajuda');assert.deepEqual(errors,[]);
  const result={engine:'WebKit '+browser.version(),cachedFiles:count,network:'servidor encerrado; conexão recusada confirmada',result:'jogo, introdução e navegação reabertos pelo cache',errors};fs.writeFileSync('tests/resultados/offline-webkit.json',JSON.stringify(result,null,2));console.log(result);
 }finally{await browser?.close();server.kill();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
