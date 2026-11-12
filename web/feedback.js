window.Feedback = (()=>{
  let prefs={music:true,effects:true,volume:.55,haptics:'results'},track='',music=null,effect=null,unlocked=false,priorityUntil=0,duckTimer;
  const patterns={win:[45,65,45],loss:[140],stamp:[30],message:[25,50,25,50,40],reveal:[40],impact:[35],knock:[40,120,40]};
  const paths={opening:'turno-comecou',route:'era-so-entregar',confusion:'agora-explica',ending:'fim-do-turno',win:'vitoria',loss:'derrota',stamp:'carimbo',message:'mensagem',impact:'impacto',knock:'batidas',reveal:'mensagem'};
  function play(a){if(unlocked&&!document.hidden)a.play().catch(()=>{});}
  function levels(){if(music)music.volume=prefs.music?prefs.volume*.36:0;if(effect)effect.volume=prefs.effects?prefs.volume*.8:0;}
  function configure(p){prefs={...prefs,...p};levels();if(!prefs.music)music?.pause();else if(track!=='paused')play(music||{play:()=>Promise.resolve()});if(!prefs.effects)effect?.pause();if(prefs.haptics==='off')cancel();}
  function context(next){if(next===track)return;if(next==='paused'){track=next;music?.pause();effect?.pause();cancel();return;}const src='audio/'+paths[next]+'.wav';track=next;if(music?.getAttribute('src')===src){if(prefs.music)play(music);return;}music?.pause();music=null;if(paths[next]){music=new Audio(src);music.loop=true;levels();if(prefs.music)play(music);}}
  function cancel(){try{navigator.vibrate?.(0)}catch{}priorityUntil=0;}
  function fire(kind){
    const result=kind==='win'||kind==='loss';
    if(document.hidden||(!result&&Date.now()<priorityUntil))return;
    priorityUntil=Date.now()+(result?1800:kind==='impact'?650:250);
    if(prefs.haptics==='all'||(prefs.haptics==='results'&&result)){try{navigator.vibrate?.(patterns[kind]||[])}catch{}}
    if(prefs.effects&&paths[kind]){effect?.pause();effect=new Audio('audio/'+paths[kind]+'.wav');levels();play(effect);if(music)music.volume=prefs.volume*.1;clearTimeout(duckTimer);duckTimer=setTimeout(levels,result?2200:650);}
  }
  function unlock(){unlocked=true;if(prefs.music&&music)play(music);}
  document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',unlock);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){music?.pause();effect?.pause();cancel()}else if(prefs.music&&music)play(music)});
  return {configure,context,fire,cancel,patterns};
})();
