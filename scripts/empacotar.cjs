const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=walk('web').filter(p=>path.basename(p)!=='sw.js'&&path.basename(p)!=='_headers').sort();
const entries=files.map(p=>[p.slice(4).replaceAll('\\','/'),hash(fs.readFileSync(p))]);
let sw=fs.readFileSync('web/sw.js','utf8');const tail=sw.slice(sw.indexOf('const prefix ='));
const cacheSeed=JSON.stringify(entries)+tail.replace(/const cacheName = prefix \+ '[^']+';/,"const cacheName = prefix + '';");
sw='/* Gerado por scripts/empacotar.cjs. Atualiza apenas após fechar as janelas antigas. */\nconst resources = '+JSON.stringify(entries,null,2)+';\n'+tail.replace(/const cacheName = prefix \+ '[^']+';/,"const cacheName = prefix + '"+hash(cacheSeed)+"';");
fs.writeFileSync('web/sw.js',sw);
const dest=path.join(root,'Entrega','netlify');fs.mkdirSync(dest,{recursive:true});
// Espelhar a fonte: um recurso removido não pode sobreviver no próximo ZIP.
const publicFiles=new Set(walk('web').map(p=>p.slice(4)));
for(const old of walk(dest)){
  const resolved=path.resolve(old);
  if(!resolved.startsWith(dest+path.sep))throw Error('Arquivo fora da pasta de publicação');
  if(!publicFiles.has(path.relative(dest,old)))fs.unlinkSync(resolved);
}
for(const p of walk('web')){const target=path.join(dest,p.slice(4));fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(p,target);}
// O pacote manual contém somente a raiz pública; netlify.toml pertence à raiz do repositório.
cp.execFileSync('powershell',['-NoProfile','-Command',"Compress-Archive -Path 'Entrega/netlify/*' -DestinationPath 'Foi_Voce_Que_Escolheu_Netlify.zip' -Force"],{stdio:'inherit'});
fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/manifesto-entrega.json',JSON.stringify(walk('web').map(p=>({file:p.slice(4).replaceAll('\\','/'),sha256:hash(fs.readFileSync(p)),bytes:fs.statSync(p).size})),null,2));console.log('Pasta e ZIP gerados com '+walk('web').length+' arquivos.');
