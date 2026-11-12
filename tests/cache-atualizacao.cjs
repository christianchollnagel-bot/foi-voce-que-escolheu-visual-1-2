const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex'),base='https://jogo.example/',prefix='fvqe-v1|'+base+'|';
async function run(fail=false){
 const bodies={'keep.txt':'igual','changed.txt':'novo','corrupt.txt':'correto'},stores=new Map(),calls=[],events={};
 const open=async key=>{if(!stores.has(key))stores.set(key,new Map());const data=stores.get(key);return{match:async url=>data.get(url)?.clone(),put:async(url,response)=>data.set(url,response.clone())}};
 const old=await open(prefix+'old');for(const[file,body]of Object.entries({'keep.txt':'igual','changed.txt':'anterior','corrupt.txt':'corrompido'}))await old.put(base+file,new Response(body));
 await open('outro-aplicativo');
 const script=fs.readFileSync('web/sw.js','utf8'),tail=script.slice(script.indexOf('const prefix ='));
 const ctx={URL,Response,TextEncoder,TextDecoder,crypto:crypto.webcrypto,self:{registration:{scope:base},clients:{claim:async()=>{}},addEventListener:(name,fn)=>events[name]=fn},caches:{open,keys:async()=>[...stores.keys()],delete:async key=>stores.delete(key)},fetch:async url=>{calls.push(url);if(fail&&url.endsWith('corrupt.txt'))throw Error('offline');return new Response(bodies[new URL(url).pathname.slice(1)])}};
 vm.createContext(ctx);vm.runInContext('const resources='+JSON.stringify(Object.entries(bodies).map(([f,b])=>[f,hash(b)]))+';\n'+tail,ctx);
 let installing;events.install({waitUntil:p=>installing=p});
 if(fail){await assert.rejects(installing,/offline/);assert.deepEqual([...stores.keys()].sort(),[prefix+'old','outro-aplicativo'].sort());assert.equal(await(await old.match(base+'keep.txt')).text(),'igual');return;}
 await installing;assert.deepEqual(calls.sort(),[base+'changed.txt',base+'corrupt.txt'].sort());
 const current=await open(vm.runInContext('cacheName',ctx));for(const[file,body]of Object.entries(bodies))assert.equal(await(await current.match(base+file)).text(),body);
 let activating;events.activate({waitUntil:p=>activating=p});await activating;assert.equal(stores.has(prefix+'old'),false);assert.equal(stores.has('outro-aplicativo'),true);
}
(async()=>{await run();await run(true);console.log('Cache: reutiliza bytes válidos, baixa alterações/corrupção, conserva versão anterior se falhar e preserva caches alheios.');})().catch(e=>{console.error(e);process.exitCode=1});
