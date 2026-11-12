const {webkit,chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {reach,settle}=require('./paginas-helper.cjs'),{inspect}=require('./paginas.cjs');
const base=process.env.GAME_URL||'http://localhost:4180',report=[];
async function run(type){
 const browser=await type.launch(type===chromium?{executablePath:require('./browser-options.cjs').chromeExecutable}:{});
 try{
  const page=await browser.newPage({viewport:{width:393,height:724},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
  await page.goto(base+'/?teste=1');await page.evaluate(()=>document.body.classList.add('hosted-netlify'));
  const turn=async delta=>{
   const before=await page.locator('#stage').getAttribute('data-page');
   await page.locator(delta>0?'[data-page=next]':'[data-page=previous]').tap();await settle(page);
   assert.equal(Number(await page.locator('#stage').getAttribute('data-page')),Number(before)+delta,'toque não mudou a página');
  };
  const tap=async locator=>{await(await reach(page,locator,{touch:true})).tap();await settle(page);};
  for(const [width,height] of [[393,724],[393,640],[360,640],[844,390],[899,668]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>FVQE.abrir('base'));await settle(page);
   assert.ok(Number(await page.locator('#stage').getAttribute('data-pages'))>1,'catálogo cortado em página única');
   await turn(1);await turn(-1);
   await tap(page.locator('[data-action=set-base]').last());
   assert.equal(await page.locator('[data-action=set-base]').last().getAttribute('aria-pressed'),'true');
   const result=await inspect(page,type.name()+' catálogo '+width+'x'+height,{wheel:false});
   await tap(page.getByRole('button',{name:'Usar este avatar',exact:true,includeHidden:true}));
   assert.equal(await page.evaluate(()=>FVQE.estado().screen),'universo');
   report.push({engine:type.name(),width,height,...result});
  }
  // scrollWidth incompleto não pode tornar o catálogo uma única página.
  // A altura automática é normal nesta edição, sem fragmentação por colunas CSS.
  await page.setViewportSize({width:393,height:724});await page.evaluate(()=>{FVQE.abrir('base');const f=document.querySelector('.inside');f.style.height='auto';Object.defineProperty(f,'scrollWidth',{configurable:true,get(){return this.clientWidth}});GamePages.refresh()});await settle(page);
  assert.ok(Number(await page.locator('#stage').getAttribute('data-pages'))>1);
  await turn(1);await turn(-1);await inspect(page,type.name()+' recuperação de medição incompleta',{wheel:false});
  report.push({engine:type.name(),recovery:true});
  // Altura fracionária da barra do navegador e retorno do segundo plano.
  await page.evaluate(()=>{const v=new EventTarget();Object.assign(v,{height:615.625,offsetTop:0,scale:1});Object.defineProperty(window,'visualViewport',{configurable:true,value:v});GamePages.refresh();dispatchEvent(new Event('pageshow'))});await settle(page);
  await inspect(page,type.name()+' janela visual fracionária',{wheel:false});
  assert.deepEqual(errors,[]);console.log(type.name()+': anterior/próxima por toque, todos os retratos e confirmação sem scroll, recuperação de medidas e resize aprovados');
 }finally{await browser.close();}
}
(async()=>{fs.mkdirSync('tests/resultados',{recursive:true});for(const t of [webkit,chromium])await run(t);fs.writeFileSync('tests/resultados/paginacao-mobile.json',JSON.stringify({report,limits:'Simulação Chrome/WebKit no Windows; não é um teste físico de iPhone/Android.'},null,2));})().catch(e=>{console.error(e);process.exitCode=1});
