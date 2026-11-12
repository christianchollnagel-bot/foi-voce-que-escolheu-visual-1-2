const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const {settle,reach,click}=require('./paginas-helper.cjs');
const base=process.env.GAME_URL||'http://localhost:4180';
function textOnPage(){
 const stage=document.getElementById('stage'),flow=stage.querySelector('.inside'),view=flow.parentElement.getBoundingClientRect(),box=flow.getBoundingClientRect();
 const inset=getComputedStyle(flow).clipPath.match(/^inset\(([^)]+)\)/)?.[1].split(/\s+/).map(parseFloat)||[0];
 const top=Math.max(view.top,box.top+inset[0]),bottom=Math.min(view.bottom,box.bottom-(inset[2]??inset[0]));
 const walker=document.createTreeWalker(flow,NodeFilter.SHOW_TEXT),expected=[],seen=[],clipped=[];let nodeIndex=0;
 while(walker.nextNode()){
  const node=walker.currentNode,el=node.parentElement,id=nodeIndex++;if(!node.textContent.trim()||!el)continue;
  if(el.closest('svg,script,style,.clipped')||el.checkVisibility?.({visibilityProperty:true})===false)continue;
  if(stage.dataset.screen==='abertura'&&el.closest('h1'))continue;
  const closed=el.closest('details:not([open])');if(closed&&!closed.querySelector('summary')?.contains(el))continue;
  const range=document.createRange();range.selectNodeContents(node);let line=0;
  for(const r of range.getClientRects()){
   const key=id+':'+line++;if(!r.width||!r.height)continue;expected.push({key,text:node.textContent.trim().slice(0,80)});
   if(r.bottom<=top+.5||r.top>=bottom-.5)continue;
   if(r.top<top-1||r.bottom>bottom+1||r.left<view.left-1||r.right>view.right+1)clipped.push({key,text:node.textContent.trim().slice(0,80),top:r.top-top,bottom:r.bottom-bottom});else seen.push(key);
  }
 }
 return {expected,seen,clipped};
}
async function inspect(page,label,{wheel=true}={}){
 await settle(page);
 const findings=await page.evaluate(()=>{
  const stage=document.getElementById('stage'),view=stage.querySelector('.page-viewport'),flow=stage.querySelector('.inside'),box=view.getBoundingClientRect();
  const controls=[...flow.querySelectorAll('button,input,select,summary')].filter(el=>{
   if(el.checkVisibility?.({visibilityProperty:true})===false)return false;const closed=el.closest('details:not([open])');return !closed||closed.querySelector('summary')?.contains(el);
  });controls.forEach((el,i)=>el.dataset.auditId=String(i));
  const scrolling=[...stage.querySelectorAll('*')].filter(el=>{const s=getComputedStyle(el);return (/auto|scroll/.test(s.overflowY)&&el.scrollHeight>el.clientHeight+1)||(/auto|scroll/.test(s.overflowX)&&el.scrollWidth>el.clientWidth+1)}).map(el=>el.className);
  return {screen:stage.dataset.screen,pages:Number(stage.dataset.pages),scrolling,expected:controls.map(el=>({id:el.dataset.auditId,text:el.textContent.trim().slice(0,60)})),root:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight],stageOverflow:stage.scrollHeight-stage.clientHeight};
 });
 assert.ok(findings.root[0]<=findings.viewport[0]&&findings.root[1]<=findings.viewport[1],label+': documento excede a janela');
 assert.equal(findings.stageOverflow,0,label+': moldura excede a janela');
 assert.deepEqual(findings.scrolling,[],label+': conteúdo exige rolagem interna');
 const seen=new Set(),seenText=new Set(),expectedText=(await page.evaluate(textOnPage)).expected;
 while(await page.locator('[data-page=previous]').isEnabled()){await page.locator('[data-page=previous]').click();await settle(page);}
 for(let i=0;i<150;i++){
  const text=await page.evaluate(textOnPage);assert.deepEqual(text.clipped,[],label+': texto cortado na página '+(i+1));text.seen.forEach(key=>seenText.add(key));
  for(const id of await page.locator('[data-audit-id]').evaluateAll(elements=>elements.filter(el=>!el.inert).map(el=>el.dataset.auditId)))seen.add(id);
  if(wheel)await page.mouse.wheel(0,700);await settle(page);
  assert.equal(await page.evaluate(()=>scrollY+document.getElementById('stage').scrollTop+document.querySelector('.page-viewport').scrollTop),0,label+': roda do mouse rolou a tela');
  if(await page.locator('[data-page=next]').isEnabled()){await page.locator('[data-page=next]').click();await settle(page);}else break;
 }
 assert.deepEqual(findings.expected.filter(x=>!seen.has(x.id)),[],label+': controles sem página acessível');
 assert.deepEqual(expectedText.filter(x=>!seenText.has(x.key)),[],label+': texto sem página acessível');
 return {screen:findings.screen,pages:findings.pages,controls:seen.size};
}
async function main(){
 const browser=await chromium.launch({executablePath:require('./browser-options.cjs').chromeExecutable,headless:true});const report=[],errors=[];
 try{
  const p=await browser.newPage({serviceWorkers:'block'});p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/?teste=1');await p.evaluate(()=>document.body.classList.add('hosted-netlify'));await p.evaluate(()=>document.fonts.ready);
  for(const [width,height] of [[390,844],[320,568],[844,390],[1440,900]]){
   await p.setViewportSize({width,height});
   for(const large of [false,true]){
    await p.evaluate(large=>{FVQE.abrir('acessibilidade');const button=document.querySelector('[data-action=pref][data-value=large]');if((button.getAttribute('aria-pressed')==='true')!==large)button.click();},large);
    for(const screen of ['abertura','conteudo','menu','config','acessibilidade','capitulos','base','rosto','cabelo','roupa','nome','previa','expressoes','creditos','universo']){
     await p.evaluate(s=>FVQE.abrir(s),screen);const result=await inspect(p,width+'x'+height+(large?' ampliado ':' ')+screen);report.push({width,height,large,...result});
    }
   }
  }
  assert.deepEqual(errors,[]);fs.writeFileSync('tests/resultados/paginas.json',JSON.stringify({report,errors},null,2));console.log(JSON.stringify({screens:report.length,maxPages:Math.max(...report.map(x=>x.pages)),errors}));
 }finally{await browser.close();}
}
module.exports={inspect};
if(require.main===module){fs.mkdirSync('tests/resultados',{recursive:true});main().catch(e=>{console.error(e);process.exitCode=1});}
