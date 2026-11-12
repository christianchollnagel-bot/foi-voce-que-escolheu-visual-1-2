// Partitura executável: eletrônica com groove brasileiro, sem samples externos.
const fs=require('node:fs'),path=require('node:path');
const SR=44100,BPM=112,BEAT=60/BPM,BARS=8,FRAMES=Math.round(BARS*4*BEAT*SR),TAU=Math.PI*2;
const frequency=n=>440*2**((n-69)/12);
const stereo=()=>[new Float32Array(FRAMES),new Float32Array(FRAMES)];
const variants=[
 {file:'turno-comecou',drums:1,bass:1,keys:1,lead:1,seed:74123},
 {file:'era-so-entregar',drums:.8,bass:.86,keys:.9,lead:.66,seed:42137},
 {file:'agora-explica',drums:1.02,bass:.96,keys:.77,lead:.82,seed:91357},
 {file:'fim-do-turno',drums:.7,bass:.8,keys:1,lead:.8,seed:53129}
];
const harmony=[
 {name:'C6/9',root:36,fifth:43,notes:[60,64,67,69,74]},
 {name:'Am9',root:33,fifth:40,notes:[57,60,64,67,71]},
 {name:'Dm9',root:38,fifth:45,notes:[62,65,69,72,76]},
 {name:'G13',root:31,fifth:38,notes:[55,59,62,64,69]}
];
// Mesmo motivo da edição anterior, com novo timbre e espaço entre as respostas.
const motif=[[.5,72,.35],[1,76,.4],[1.75,79,.25],[2.5,81,.35],[3.25,79,.3],[4.5,76,.35],[5.25,74,.3],[6,72,.7],[7,67,.35]];
function random(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/2147483648-1;};}
function place(bus,beat,duration,gain,pan,voice){
 const start=Math.round(beat*BEAT*SR),length=Math.round(duration*SR);
 const left=Math.cos((pan+1)*Math.PI/4),right=Math.sin((pan+1)*Math.PI/4);
 for(let i=0;i<length;i++){
  const t=i/SR,release=Math.min(1,(length-1-i)/(SR*.012));
  const value=voice(t,i)*Math.min(1,t/.0015)*release*gain;
  const frame=(start+i)%FRAMES;bus[0][frame]+=value*left;bus[1][frame]+=value*right;
 }
}
function pitched(bus,beat,midi,duration,gain,kind,pan=0){
 const f=frequency(midi),seconds=duration*BEAT;
 place(bus,beat,seconds+.16,gain,pan,t=>{
  const phase=TAU*f*t,release=Math.min(1,Math.max(0,(seconds+.16-t)/.16));
  let tone;
  if(kind==='bass')tone=(Math.sin(phase)+.3*Math.sin(2*phase)+.1*Math.sin(3*phase))*Math.exp(-t*3.5);
  else if(kind==='keys')tone=(Math.sin(phase+1.1*Math.exp(-t*9)*Math.sin(2*phase))+.09*Math.sin(3*phase))*Math.exp(-t*2.8);
  else tone=(Math.sin(phase)+.18*Math.sin(2*phase)+.05*Math.sin(3*phase))*Math.exp(-t*5);
  return tone*Math.min(1,t/(kind==='bass'?.009:.008))*release;
 });
}
function percussion(bus,beat,kind,gain,pan,rng){
 let low=0,soft=0;
 const filtered=(cutoff,lowpass)=>{
  const n=rng();low+=(1-Math.exp(-TAU*cutoff/SR))*(n-low);
  soft+=(1-Math.exp(-TAU*lowpass/SR))*((n-low)-soft);return soft;
 };
 if(kind==='kick')place(bus,beat,.34,gain,0,t=>{
  const phase=TAU*(49*t+(142-49)*.025*(1-Math.exp(-t/.025)));
  return (Math.sin(phase)+.1*Math.sin(2*phase))*Math.exp(-t*17)+filtered(2600,7000)*.12*Math.exp(-t*180);
 });
 else if(kind==='clap')place(bus,beat,.2,gain,pan,t=>{
  const burst=[0,.009,.021].reduce((s,offset)=>s+(t>=offset?Math.exp(-(t-offset)*75):0),0);
  return filtered(700,6300)*burst*.65+Math.sin(TAU*185*t)*Math.exp(-t*38)*.25;
 });
 else if(kind==='tamborim')place(bus,beat,.12,gain,pan,t=>
  (Math.sin(TAU*470*t)+.45*Math.sin(TAU*755*t)+.2*Math.sin(TAU*1190*t))*Math.exp(-t*46)+filtered(1800,7500)*.25*Math.exp(-t*90));
 else if(kind==='rim')place(bus,beat,.075,gain,pan,t=>
  (Math.sin(TAU*1680*t)+.4*Math.sin(TAU*2315*t))*Math.exp(-t*95));
 else place(bus,beat,kind==='open-hat'?.2:.075,gain,pan,t=>{
  const metal=(Math.sin(TAU*4320*t)+Math.sin(TAU*6175*t))*.08;
  return (filtered(3200,9500)+metal)*Math.exp(-t*(kind==='open-hat'?25:75));
 });
}
function echo(bus){
 // Reflexos curtos, circulares e cruzados: a cauda já está no começo do loop.
 const dry=bus.map(channel=>Float32Array.from(channel));
 for(const [beats,gain,cross] of [[.75,.15,true],[1.5,.055,false],[2.25,.02,true]]){
  const delay=Math.round(beats*BEAT*SR);
  for(let ch=0;ch<2;ch++)for(let i=0;i<FRAMES;i++)bus[ch][(i+delay)%FRAMES]+=dry[cross?1-ch:ch][i]*gain;
 }
}
function render(variant,index){
 const buses={bateria:stereo(),baixo:stereo(),harmonia:stereo(),tema:stereo()},rng=random(variant.seed),kicks=[];
 const swing=beat=>beat+((Math.round(beat*4)%2===1)?.035:0);
 for(let bar=0;bar<BARS;bar++){
  const at=bar*4,chord=harmony[bar%harmony.length];
  const kickPattern=index===3?[0,2.5]:bar%2?[0,1.75,2.5,3.5]:[0,1.5,2,3.25];
  for(const beat of kickPattern){kicks.push(at+beat);percussion(buses.bateria,at+beat,'kick',.46*variant.drums,0,rng);}
  for(const beat of [1,3])percussion(buses.bateria,at+beat+.012,'clap',.16*variant.drums,.04,rng);
  for(let step=0;step<16;step++){
   const ghost=step%2===1;if(index===3&&ghost)continue;
   percussion(buses.bateria,swing(at+step/4),'shaker',(ghost?.022:.035)*(step%4===2?1.2:1)*variant.drums,step%2?.25:-.22,rng);
  }
  if(index!==3)for(const beat of [.5,2.5])percussion(buses.bateria,at+beat,'open-hat',.03*variant.drums,.24,rng);
  const tamborim=bar%2?[.25,1,1.75,2.5,3.5]:[.5,1.25,2,2.75,3.5];
  for(const [j,beat] of tamborim.entries()){
   if(index===1&&j%2||index===3&&j!==1&&j!==4)continue;
   percussion(buses.bateria,swing(at+beat),'tamborim',.052*variant.drums*(j%2?.8:1),-.2,rng);
  }
  if(bar%4===3)for(const beat of [3.25,3.75])percussion(buses.bateria,swing(at+beat),'rim',.035*variant.drums,.25,rng);
  const bassNotes=[[0,chord.root,.48],[.75,chord.root,.32],[1.5,chord.root+12,.32],[2.5,chord.root,.4],[3.25,chord.fifth,.25],[3.75,chord.root+12,.2]];
  for(const [j,[beat,note,duration]] of bassNotes.entries()){
   if(index===3&&j%2)continue;
   pitched(buses.baixo,swing(at+beat),note,duration,.23*variant.bass,'bass');
  }
  for(const beat of [.25,1.75,2.75])for(const [j,note] of chord.notes.entries())
   pitched(buses.harmonia,swing(at+beat)+j*.006,note,.65,.035*variant.keys,'keys',(j-2)*.13);
 }
 for(let pair=0;pair<4;pair++)for(const [t,n,d] of motif){
  if(index===1&&pair%2||index===3&&pair===1)continue;
  pitched(buses.tema,swing(pair*8+t),index===3?n-12:n,d,.08*variant.lead,'pluck',.08);
 }
 echo(buses.harmonia);echo(buses.tema);
 // Respiração leve após cada bumbo; o baixo continua centralizado em mono.
 const duck=new Float32Array(FRAMES);duck.fill(1);
 for(const beat of kicks){const start=Math.round(beat*BEAT*SR);for(let i=0;i<.3*SR;i++){
  const t=i/SR,frame=(start+i)%FRAMES;
  const depth=.22*(1-Math.exp(-t/.004))*Math.exp(-t/.075)*Math.min(1,(.3-t)/.05);
  duck[frame]=Math.min(duck[frame],1-depth);
 }}
 for(const name of ['baixo','harmonia'])for(const channel of buses[name])for(let i=0;i<FRAMES;i++)channel[i]*=duck[i];
 for(const bus of Object.values(buses))for(const channel of bus){let mean=0;for(const x of channel)mean+=x;mean/=FRAMES;for(let i=0;i<FRAMES;i++)channel[i]-=mean;}
 const mix=stereo();for(const bus of Object.values(buses))for(let ch=0;ch<2;ch++)for(let i=0;i<FRAMES;i++)mix[ch][i]+=bus[ch][i];
 return {variant,buses,mix};
}
function wav(channels,gain){
 const data=Buffer.alloc(44+FRAMES*4);data.write('RIFF');data.writeUInt32LE(data.length-8,4);data.write('WAVEfmt ',8);
 data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(2,22);data.writeUInt32LE(SR,24);data.writeUInt32LE(SR*4,28);data.writeUInt16LE(4,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(FRAMES*4,40);
 for(let i=0;i<FRAMES;i++)for(let ch=0;ch<2;ch++){
  const sample=Math.round(channels[ch][i]*gain*32767);if(Math.abs(sample)>32767)throw Error('Clipping na renderização');
  data.writeInt16LE(sample,44+(i*2+ch)*2);
 }return data;
}
function measure(data){
 let peak=0,sum=0,monoSum=0,leftSum=0,rightSum=0,cross=0,seam=0;
 for(let i=0;i<FRAMES;i++){
  const left=data.readInt16LE(44+i*4)/32768,right=data.readInt16LE(46+i*4)/32768;
  peak=Math.max(peak,Math.abs(left),Math.abs(right));sum+=left*left+right*right;monoSum+=((left+right)/2)**2;
  leftSum+=left*left;rightSum+=right*right;cross+=left*right;
 }
 for(let ch=0;ch<2;ch++)seam=Math.max(seam,Math.abs(data.readInt16LE(44+ch*2)-data.readInt16LE(44+(FRAMES-1)*4+ch*2))/32768);
 const rms=Math.sqrt(sum/(FRAMES*2));
 return {seconds:FRAMES/SR,sampleRate:SR,channels:2,bits:16,bpm:BPM,bars:BARS,peak,rms,rmsDbFS:20*Math.log10(rms),loop:true,loopStartFrame:0,loopEndFrame:FRAMES,seam,monoRms:Math.sqrt(monoSum/FRAMES),stereoCorrelation:cross/Math.sqrt(leftSum*rightSum)};
}
function renderAll({stems=false}={}){
 const tracks=variants.map(render);let peak=0;
 for(const {mix} of tracks)for(const channel of mix)for(const x of channel)peak=Math.max(peak,Math.abs(x));
 // Um ganho comum mantém a diferença de intensidade entre as quatro versões.
 const gain=.76/peak,report=[];
 for(const {variant,mix,buses} of tracks){
  const data=wav(mix,gain);fs.writeFileSync(path.join('web/audio',variant.file+'.wav'),data);
  report.push({file:variant.file+'.wav',...measure(data),masterGain:gain});
  if(stems){const dest=path.join('tests/resultados/audio-stems',variant.file);fs.mkdirSync(dest,{recursive:true});
   for(const [name,bus] of Object.entries(buses))fs.writeFileSync(path.join(dest,name+'.wav'),wav(bus,gain));
   fs.writeFileSync(path.join(dest,'manifesto.json'),JSON.stringify({mix:variant.file+'.wav',sampleRate:SR,channels:2,frames:FRAMES,bpm:BPM,masterGain:gain,stems:Object.keys(buses)},null,2));
  }
 }
 return report;
}
module.exports={renderAll};
