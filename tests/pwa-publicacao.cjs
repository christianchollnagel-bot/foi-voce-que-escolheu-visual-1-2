const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const {click,waitForAsync}=require('./paginas-helper.cjs'),{chromeExecutable}=require('./browser-options.cjs');
const base=process.env.GAME_URL||'http://localhost:4180',version=require('../package.json').version;
const source=fs.readFileSync('web/sw.js','utf8'),expected=source.match(/const cacheName = prefix \+ '([^']+)'/)[1];
(async()=>{const browser=await chromium.launch({executablePath:chromeExecutable});try{
 const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/');
 await waitForAsync(page,async suffix=>{const reg=await navigator.serviceWorker.getRegistration();return reg?.active?.state==='activated'&&!!navigator.serviceWorker.controller&&(await caches.keys()).some(n=>n.endsWith(suffix));},expected,{timeout:180000});
 const cached=await page.evaluate(async suffix=>{const name=(await caches.keys()).find(n=>n.endsWith(suffix));return(await(await caches.open(name)).keys()).length;},expected);
 assert.equal(cached,JSON.parse(fs.readFileSync('docs/manifesto-entrega.json')).length-2);
 await context.setOffline(true);await page.reload();await page.waitForFunction(v=>window.GamePages?.revision===v,version);
 // Reabrir com um registro válido leva ao menu, inclusive sem entrega começada.
 assert.equal(await page.locator('#stage').getAttribute('data-screen'),'menu');
 await click(page,'Nova partida');await click(page,'Pular introdução');assert.equal(await page.locator('#stage').getAttribute('data-screen'),'ajuda');
 assert.deepEqual(errors,[]);const report={url:base,version,cached,offline:'reabertura, menu, nova partida e introdução confirmados',errors};fs.writeFileSync('tests/resultados/pwa-publicacao.json',JSON.stringify(report,null,2));console.log(report);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
