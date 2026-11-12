// Partitura e síntese originais assistidas por Codex. Sem samples ou instrumentos externos.
const fs=require('node:fs');fs.mkdirSync('web/audio',{recursive:true});fs.mkdirSync('docs',{recursive:true});
const SR=22050,beat=60/108,bar=beat*4,TAU=Math.PI*2;
const freq=n=>440*2**((n-69)/12);let seed=87213;
const noise=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2147483648-1};
function buffer(seconds){return new Float64Array(Math.round(seconds*SR))}
function note(b,at,midi,duration,gain,instrument='piano',wrap=false){
 const f=freq(midi),len=Math.floor((duration+.25)*SR),start=Math.round(at*SR);
 for(let i=0;i<len;i++){const t=i/SR,release=Math.min(1,Math.max(0,(duration+.25-t)/.25));let v;
 if(instrument==='bass')v=(Math.sin(TAU*f*t)+.2*Math.sin(TAU*2*f*t))*Math.exp(-t*5);
 else if(instrument==='wood')v=(Math.sin(TAU*f*t)+.25*Math.sin(TAU*f*2.76*t))*Math.exp(-t*22);
 else v=(Math.sin(TAU*f*t)*Math.exp(-t*3)+.32*Math.sin(TAU*f*2*t)*Math.exp(-t*6)+.12*Math.sin(TAU*f*3*t)*Math.exp(-t*10));
 const attack=Math.min(1,t/.006);let k=start+i;if(wrap)k%=b.length;if(k<b.length)b[k]+=v*attack*release*gain;
 }
}
function drum(b,at,kind,gain,wrap=false){const start=Math.round(at*SR),dur=kind==='kick'?.15:.07;for(let i=0;i<dur*SR;i++){const t=i/SR;const v=kind==='kick'?Math.sin(TAU*(65*t-100*t*t))*Math.exp(-t*28):noise()*Math.exp(-t*80);let k=start+i;if(wrap)k%=b.length;if(k<b.length)b[k]+=gain*v*Math.min(1,t/.002);}}
const chords=[[48,52,55],[45,48,52],[50,53,57],[43,47,50]];
// Motivo de dois compassos: pausa, terça, quinta, sexta; resposta descendente com síncope.
const motif=[[.5,72,.35],[1,76,.4],[1.75,79,.25],[2.5,81,.35],[3.25,79,.3],[4.5,76,.35],[5.25,74,.3],[6,72,.7],[7,67,.35]];
function music(name,variant){const b=buffer(bar*8);for(let m=0;m<8;m++){const chord=chords[m%4];for(let k=0;k<4;k++){note(b,m*bar+k*beat,(k%2?chord[2]:chord[0])-12,beat*.6,.12,'bass',true);drum(b,m*bar+k*beat,'kick',variant===1?.025:.04,true);drum(b,m*bar+(k+.5)*beat,'hat',.018,true);}for(const k of [0,1.5,3])for(const n of chord)note(b,m*bar+k*beat,n+12,beat*.5,variant===1?.025:.038,'piano',true);note(b,m*bar+2.75*beat,chord[2]+24,.1,.045,'wood',true);}
 for(let pair=0;pair<4;pair++)for(const [t,n,d]of motif){if(variant===1&&pair%2)continue;const shifted=variant===2&&t===2.5?n-1:variant===3?n-12:n;note(b,(pair*8+t+(variant===2?.125:0))*beat,shifted,d*beat,variant===1?.055:.09,'piano',true);}return write(name,b,true);}
function write(name,b,loop=false){let peak=0,sum=0;for(const x of b){peak=Math.max(peak,Math.abs(x));sum+=x*x}const gain=peak>0?.8/peak:1;if(!loop){for(let i=0;i<Math.min(250,b.length);i++){b[i]*=i/250;b[b.length-1-i]*=i/250;}}
 const wav=Buffer.alloc(44+b.length*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(SR,24);wav.writeUInt32LE(SR*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(b.length*2,40);for(let i=0;i<b.length;i++)wav.writeInt16LE(Math.round(b[i]*gain*32767),44+i*2);fs.writeFileSync('web/audio/'+name+'.wav',wav);return {file:name+'.wav',seconds:b.length/SR,peak:peak*gain,rms:Math.sqrt(sum/b.length)*gain,loop,seam:Math.abs(b[0]-b[b.length-1])*gain};}
const report=[];['turno-comecou','era-so-entregar','agora-explica','fim-do-turno'].forEach((n,i)=>report.push(music(n,i)));
for(const win of [true,false]){const b=buffer(2.8);drum(b,.005,'kick',.22);drum(b,.005,'hat',.12);const notes=win?[72,76,79,84]:[72,76,79,73,60];notes.forEach((n,i)=>note(b,.05+i*.28,n,.5,.18));for(const n of win?[48,52,55]:[43,47,53])note(b,1.15,n,1,.08);report.push(write(win?'vitoria':'derrota',b));}
for(const name of ['carimbo','mensagem','batidas','impacto']){const b=buffer(name==='batidas'?.65:.5);if(name==='mensagem'){note(b,.02,79,.08,.2,'wood');note(b,.15,84,.1,.17,'wood');}else for(const t of name==='batidas'?[.02,.24]:[.02]){drum(b,t,'kick',.3);drum(b,t,'hat',name==='carimbo'?.18:.08);note(b,t,name==='impacto'?38:51,.09,.12,'wood');}report.push(write(name,b));}
fs.writeFileSync('docs/audio-medicoes.json',JSON.stringify(report,null,2));console.log(report);
