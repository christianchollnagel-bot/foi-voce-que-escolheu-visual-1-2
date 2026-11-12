const {webkit,chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {reach,settle}=require('./paginas-helper.cjs');
const base=process.env.GAME_URL||'http://localhost:4180',checks=[];
async function run(type){
 const browser=await type.launch(type===chromium?{executablePath:require('./browser-options.cjs').chromeExecutable}:{});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,serviceWorkers:'block'}),errors=[];
  page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto(base+'/?teste=1');await page.evaluate(()=>document.body.classList.add('hosted-netlify'));
  const state=()=>page.evaluate(()=>FVQE.estado());
  const tap=async locator=>{await(await reach(page,locator,{touch:true})).tap();await settle(page);};
  const named=name=>page.getByRole('button',{name,exact:true,includeHidden:true});
  const record=button=>checks.push({engine:type.name(),button});
  // Os retratos adicionais oferecem molduras, bordas e adereços próprios.
  await page.evaluate(()=>{FVQE.perfil({base:'4'});FVQE.abrir('rosto')});
  for(const screen of ['rosto','cabelo','roupa']){
   await page.evaluate(s=>FVQE.abrir(s),screen);
   const controls=await page.locator('button[data-action^="set-"]').evaluateAll(bs=>bs.map(b=>({a:b.dataset.action,v:b.dataset.value,label:b.textContent.trim()})));
   for(const d of controls){await tap(page.locator(`[data-action="${d.a}"][data-value="${d.v}"]`));assert.equal((await state()).draft[d.a.slice(4)],d.v);record(d.label);}
  }
  // Teclado e acionamentos de acessibilidade usam a mesma ação nativa.
  await page.evaluate(()=>FVQE.abrir('acessibilidade'));
  const contrast=await reach(page,page.locator('[data-action=pref][data-value=contrast]'),{touch:true});
  await contrast.focus();await page.keyboard.press('Enter');await settle(page);await page.keyboard.press('Space');assert.equal((await state()).prefs.contrast,false);record('Enter e Espaço');
  // Turno completo com toques reais, incluindo os botões exclusivos do balanço.
  await page.evaluate(()=>FVQE.abrir('turno'));await tap(named('Começar este turno'));await tap(named('Pular introdução'));
  for(let n=0;n<100&&(await state()).screen!=='turnofim';n++){
   const s=await state();
   if(s.screen==='transporte'){
    await(await reach(page,page.locator('fvqe-transporte select'),{touch:true})).selectOption('apoio');await tap(named('Começar transporte'));
    await page.waitForFunction(()=>FVQE.estado().screen!=='transporte',null,{timeout:16000});
   }else await tap(page.locator('.actions button').first());
  }
  assert.equal((await state()).screen,'turnofim');assert.equal((await state()).shift.receipts.length,3);record('Próxima entrega e balanço de três entregas');
  await tap(named('Ver capítulos e atos'));assert.equal((await state()).screen,'capitulos');record('Balanço: capítulos');
  await page.evaluate(()=>FVQE.abrir('turnofim'));await tap(named('Voltar ao menu'));assert.equal((await state()).screen,'menu');record('Balanço: menu');
  await page.evaluate(()=>FVQE.abrir('turnofim'));await tap(named('Jogar novo turno'));assert.equal((await state()).screen,'entrada');assert.equal((await state()).shift.receipts.length,0);record('Balanço: novo turno');
  await page.evaluate(()=>FVQE.abrir('turno'));await tap(named('Retomar meu turno'));assert.equal((await state()).screen,'entrada');record('Retomar meu turno');
  assert.deepEqual(errors,[]);console.log(type.name()+': variantes de personagem, teclado e turno aprovadas');
 }finally{await browser.close();}
}
(async()=>{fs.mkdirSync('tests/resultados',{recursive:true});for(const type of [webkit,chromium])await run(type);fs.writeFileSync('tests/resultados/botoes-variantes.json',JSON.stringify({checks},null,2));})().catch(e=>{console.error(e);process.exitCode=1});
