const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const names=['turno-comecou','era-so-entregar','agora-explica','fim-do-turno'];
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const before=Object.fromEntries(fs.readdirSync('web/audio').map(file=>[file,hash(fs.readFileSync('web/audio/'+file))]));
cp.execFileSync(process.execPath,['scripts/compor-audio.cjs','--stems'],{stdio:'pipe'});
for(const [file,digest] of Object.entries(before))assert.equal(hash(fs.readFileSync('web/audio/'+file)),digest,'renderização reproduzível: '+file);
function read(file){
 const data=fs.readFileSync(file);assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WAVE');
 assert.equal(data.readUInt16LE(20),1);assert.equal(data.readUInt16LE(22),2);assert.equal(data.readUInt32LE(24),44100);assert.equal(data.readUInt16LE(34),16);
 assert.equal(data.readUInt32LE(40),data.length-44);assert.equal(data.length-44,756000*4);
 return data;
}
const report={bpm:112,bars:8,sampleRate:44100,channels:2,bits:16,frames:756000,tracks:[],checks:[]};
for(const name of names){
 const mix=read('web/audio/'+name+'.wav'),stemDir=path.join('tests/resultados/audio-stems',name),manifest=JSON.parse(fs.readFileSync(path.join(stemDir,'manifesto.json')));
 const stems=manifest.stems.map(stem=>read(path.join(stemDir,stem+'.wav')));
 let peak=0,sum=0,dcLeft=0,dcRight=0,seam=0,maxReconstructionError=0,monoEnergy=0,minWindowRms=Infinity;
 const frames=(mix.length-44)/4;
 for(let i=0;i<frames;i++){
  const left=mix.readInt16LE(44+i*4)/32768,right=mix.readInt16LE(46+i*4)/32768;
  peak=Math.max(peak,Math.abs(left),Math.abs(right));sum+=left*left+right*right;dcLeft+=left;dcRight+=right;monoEnergy+=((left+right)/2)**2;
  for(let ch=0;ch<2;ch++){
   const at=44+i*4+ch*2,total=stems.reduce((n,stem)=>n+stem.readInt16LE(at),0);
   maxReconstructionError=Math.max(maxReconstructionError,Math.abs(mix.readInt16LE(at)-total));
  }
 }
 for(let start=0;start<frames;start+=4410){let energy=0,count=0;for(let i=start;i<Math.min(start+4410,frames);i++){energy+=(mix.readInt16LE(44+i*4)/32768)**2+(mix.readInt16LE(46+i*4)/32768)**2;count+=2;}minWindowRms=Math.min(minWindowRms,Math.sqrt(energy/count));}
 for(let ch=0;ch<2;ch++)seam=Math.max(seam,Math.abs(mix.readInt16LE(44+ch*2)-mix.readInt16LE(44+(frames-1)*4+ch*2))/32768);
 const rms=Math.sqrt(sum/(frames*2)),monoRms=Math.sqrt(monoEnergy/frames);
 assert.ok(peak<=.77&&peak>.4,'pico de amostra com margem: '+name);
 assert.ok(rms>.06&&rms<.2,'nível médio: '+name);assert.ok(seam<.004,'emenda sem salto significativo: '+name);
 assert.ok(Math.abs(dcLeft/frames)<.0001&&Math.abs(dcRight/frames)<.0001,'sem offset DC');
 assert.ok(minWindowRms>.003,'sem intervalo silencioso inesperado');assert.ok(monoRms/rms>.85,'soma mono sem cancelamento importante');
 assert.ok(maxReconstructionError<=3,'stems recompõem a mix dentro da quantização PCM');
 report.tracks.push({file:name+'.wav',seconds:frames/44100,peak,rms,rmsDbFS:20*Math.log10(rms),seam,monoRms,minWindowRms,maxStemErrorLSB:maxReconstructionError,sha256:hash(mix)});
}
// Os seis efeitos/vinhetas mantêm os bytes da edição anterior à nova batida.
const effectHashes={
  "vitoria": "3c35e428dbd1c1f5c07e165c561b953bd781287107cc517c8095e5f0f584a8fd",
  "derrota": "e76ea036e12c22bd78a6ca80bd85c537a9ab2d891f785e039a10cba164a07a89",
  "carimbo": "8486fd20248c28fe5d7fba84d41236f161420c094c55a91edcd70e2fd99b2375",
  "mensagem": "7b50fa73b5159ab4c8477f5b3b5d6720bc652d87a9ed699f86ef3028c206eee6",
  "batidas": "b811dd91241e0e385d560ac218ee2b711d8f9d8175c8506083776b77478a6395",
  "impacto": "611c7627579db00c363cac0134f4c4efd55088b4216c80abbaf74ac40bacad96"
};
for(const [name,digest] of Object.entries(effectHashes))assert.equal(hash(fs.readFileSync("web/audio/"+name+".wav")),digest);
report.checks=['Quatro loops estéreo PCM 44,1 kHz / 16 bits / oito compassos a 112 BPM','Picos de amostra com margem e emendas abaixo de 0,004 FS','Nenhuma janela de 100 ms inesperadamente silenciosa','Soma mono preserva a energia; offset DC desprezível','Quatro stems por faixa recompõem a mix com erro máximo de três LSB','Renderização determinística; seis efeitos e vinhetas anteriores idênticos'];
fs.writeFileSync('tests/resultados/trilha.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
