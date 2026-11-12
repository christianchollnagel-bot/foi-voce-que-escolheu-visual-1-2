const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
process.chdir(path.resolve(__dirname,'..'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const manifest=JSON.parse(fs.readFileSync('docs/manifesto-entrega.json'));
for(const root of ['web','Entrega/netlify']){
 const files=walk(root).map(p=>path.relative(root,p).replaceAll('\\','/')).sort();
 assert.deepEqual(files,manifest.map(e=>e.file).sort(),root+': arquivos obsoletos ou ausentes');
 for(const e of manifest)assert.equal(hash(fs.readFileSync(path.join(root,e.file))),e.sha256,root+'/'+e.file);
 assert.ok(!files.some(p=>/(^|\/)(\.env[^/]*|node_modules|backup)(\/|$)|\.(zip|mp4)$/i.test(p)),'Arquivo não público na entrega');
}
const sw=fs.readFileSync('web/sw.js','utf8'),context={};vm.createContext(context);
vm.runInContext(sw.slice(0,sw.indexOf('const prefix ='))+';globalThis.entries=resources',context);
assert.equal(context.entries.length,manifest.length-2);
for(const [file,sha] of context.entries)assert.equal(sha,manifest.find(e=>e.file===file)?.sha256,file);
const version=require('../package.json').version;
assert.ok(fs.readFileSync('web/paginas.js','utf8').includes("revision='"+version+"'"),'Versão inconsistente');
console.log('Entrega '+version+': '+manifest.length+' arquivos, fonte/pasta/manifesto idênticos e '+context.entries.length+' recursos offline conferidos.');
