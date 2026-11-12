const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {click,settle}=require('./paginas-helper.cjs');const base=process.env.GAME_URL||'http://localhost:4180';
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),out=[],errors=[];
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});p.on('dialog',d=>d.accept());p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/?teste=1');await click(p,'Abrir o arquivo');await click(p,'Entendi · ir para o menu');await click(p,'Nova partida');
  await p.waitForFunction(()=>document.querySelector('fvqe-introducao')?.elapsed>500);
  await click(p,'Pausar animação');const paused=await p.locator('fvqe-introducao').evaluate(e=>e.elapsed);await p.waitForTimeout(250);assert.equal(await p.locator('fvqe-introducao').evaluate(e=>e.elapsed),paused);
  for(const large of [false,true]){
   await p.evaluate(large=>document.body.classList.toggle('large',large),large);
   for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]){
    await p.setViewportSize({width,height});await settle(p);
    for(const elapsed of [1000,6000,11000]){
     await p.locator('fvqe-introducao').evaluate((e,t)=>{e.elapsed=t;e.paint()},elapsed);await settle(p);
     const layout=await p.evaluate(()=>{const box=document.querySelector('.page-viewport').getBoundingClientRect();return [...document.querySelectorAll('.film-art,.film-caption,.film-controls button')].map(e=>{const r=e.getBoundingClientRect();return {name:e.className||e.textContent,inside:r.top>=box.top-1&&r.bottom<=box.bottom+1&&r.left>=box.left-1&&r.right<=box.right+1,inert:e.inert,overflow:e.scrollHeight>e.clientHeight+1};});});
     assert.ok(layout.every(x=>x.inside&&!x.inert&&!x.overflow),`${width}x${height}, large=${large}, scene=${elapsed}: ${JSON.stringify(layout)}`);
    }
   }
  }
  out.push('Três cenas legíveis, controles acessíveis, quatro tamanhos de janela e fonte normal/ampliada');
  await p.setViewportSize({width:390,height:844});await p.evaluate(()=>document.body.classList.remove('large'));await p.locator('fvqe-introducao').evaluate(e=>{e.elapsed=6000;e.paint()});await p.screenshot({path:'tests/resultados/introducao-2d.png'});
  await p.evaluate(()=>document.body.classList.add('motion-off'));await p.locator('fvqe-introducao').evaluate(e=>{e.elapsed=6000;e.paint()});const transform=await p.locator('.film-token').getAttribute('transform');await p.locator('fvqe-introducao').evaluate(e=>{e.elapsed=7000;e.paint()});assert.equal(await p.locator('.film-token').getAttribute('transform'),transform);await p.evaluate(()=>document.body.classList.remove('motion-off'));out.push('Reduzir movimento mantém as ilustrações estáticas e as explicações disponíveis');
  await p.locator('fvqe-introducao').evaluate(e=>{e.elapsed=0;e.paint()});const start=Date.now();await click(p,'Retomar animação');await p.waitForFunction(()=>FVQE.estado().screen==='ajuda',{}, {timeout:18000});const duration=Date.now()-start;assert.ok(duration>=14800&&duration<17500,String(duration));assert.equal(await p.evaluate(()=>FVQE.estado().introSeen),true);out.push(`Animação completa avança automaticamente após ${duration} ms, sem incluir pausa`);
  await p.evaluate(()=>FVQE.abrir('menu'));await click(p,'Rever introdução');await p.waitForFunction(()=>document.querySelector('fvqe-introducao')?.running);await p.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await p.locator('fvqe-introducao').evaluate(e=>e.running),false);await click(p,'Pular introdução');assert.equal(await p.evaluate(()=>FVQE.estado().screen),'menu');
  await p.reload();assert.equal(await p.evaluate(()=>FVQE.estado().introSeen),true);out.push('Rever, pular, pausa ao perder foco e preferência persistente verificados');
  assert.deepEqual(errors,[]);fs.writeFileSync('tests/resultados/introducao.json',JSON.stringify({out,errors},null,2));console.log(out.join('\n'));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
