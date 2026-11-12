const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8'),app='/* jogo verificado */';
const note='\n<!-- This site is hosted on Netlify. Anyone can build and deploy a site\n     like this one for free: https://netlify.new/?utm_source=test\n     Netlify hosting facts for this site: static/SSR served via Netlify Edge. -->';
const hud='<script async src="/.netlify/scripts/hud?variant=public" data-nf-variant="public" data-netlify-site-id="00000000-0000-0000-0000-000000000000" data-app-host="app.netlify.com" data-account-tier="free"></script>\n';
const hosted=html.replace('<meta charset="utf-8">','<meta charset="utf-8">'+note)+hud;
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
async function install(body,script=app,scope='https://game.netlify.app/'){
 const handlers={},stored=new Map(),context={URL,TextEncoder,TextDecoder,crypto:crypto.webcrypto,Response,
  self:{registration:{scope},addEventListener:(name,fn)=>handlers[name]=fn},
  caches:{keys:async()=>[],open:async()=>({put:async(url,res)=>stored.set(url,await res.text())}),delete:async()=>stored.clear()},
  fetch:async url=>new Response(url.endsWith('index.html')?body:script,{status:200})};
 vm.createContext(context);const source=fs.readFileSync('web/sw.js','utf8').replace(/const resources = [\s\S]*?;\nconst prefix =/,'const resources = '+JSON.stringify([['index.html',hash(html)],['app.js',hash(app)]])+';\nconst prefix =');vm.runInContext(source,context);
 let pending;handlers.install({waitUntil:p=>pending=p});return {pending,stored};
}
async function main(){
 for(const body of [html,hosted]){const {pending,stored}=await install(body);await pending;assert.equal(stored.get('https://game.netlify.app/index.html'),body,'conserva HTML original e identificação do host');assert.equal(stored.size,2);}
 for(const [body,script,scope] of [[hosted.replace('Arquivo','CORROMPIDO'),app],[hosted,app+'alterado'],[hosted+'<script>erro()</script>',app],[hosted,app,'http://localhost/']]){
  const {pending,stored}=await install(body,script,scope);await assert.rejects(pending,/integridade inválida/i);assert.equal(stored.size,0,'remove cache incompleto');
 }
 console.log('Integridade: HTML original/Netlify aprovados, resposta preservada, alterações no jogo/scripts e marcação desconhecida rejeitadas.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
