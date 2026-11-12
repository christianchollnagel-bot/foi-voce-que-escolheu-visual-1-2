window.Feedback = (()=>{
  let prefs={music:true,effects:true,volume:.55,haptics:'results'},track='',music=null,effect=null,unlocked=false,priorityUntil=0,duckTimer,duckUntil=0;
  let playbackIssue='';
  const patterns={win:[45,65,45],loss:[140],stamp:[30],message:[25,50,25,50,40],reveal:[40],impact:[35],knock:[40,120,40]};
  const paths={opening:'turno-comecou',route:'era-so-entregar',confusion:'agora-explica',ending:'fim-do-turno',win:'vitoria',loss:'derrota',stamp:'carimbo',message:'mensagem',impact:'impacto',knock:'batidas',reveal:'mensagem'};
  function status(){
    if(prefs.volume===0||(!prefs.music&&!prefs.effects))return 'Som desligado nas configurações.';
    if(playbackIssue)return playbackIssue;
    if(!unlocked)return 'Ative o som ou comece a jogar.';
    if(effect&&!effect.paused)return 'Efeito sonoro em reprodução.';
    if(document.hidden||track==='paused')return 'Música pausada nesta tela. Você pode testar o som.';
    if(music&&!music.paused&&prefs.music)return 'Música em reprodução.';
    return prefs.effects?'Efeitos sonoros ligados.':'Som pronto para reproduzir.';
  }
  function notify(){const el=document.getElementById?.('audio-status');if(el)el.textContent=status();}
  function report(error){
    if(error?.name==='AbortError')return;
    playbackIssue=error?.name==='NotAllowedError'?'O navegador bloqueou o som. Toque em Ativar e testar som.':'Não foi possível carregar o áudio. Confira a conexão e tente novamente.';
    notify();
  }
  function player(loop=false){
    const a=new Audio();a.loop=loop;a.preload='auto';
    a.addEventListener?.('ended',notify);a.addEventListener?.('error',()=>report(a.error));
    return a;
  }
  function play(a){
    if(!a||!unlocked||document.hidden)return Promise.resolve(false);
    try{return Promise.resolve(a.play()).then(()=>{playbackIssue='';notify();return true},error=>{report(error);return false});}
    catch(error){report(error);return Promise.resolve(false);}
  }
  function levels(){
    if(music)music.volume=prefs.music?prefs.volume*(Date.now()<duckUntil?.18:.55):0;
    if(effect)effect.volume=prefs.effects?prefs.volume*.9:0;
  }
  function configure(p){
    prefs={...prefs,...p};levels();
    if(!prefs.music)music?.pause();else if(track!=='paused')play(music);
    if(!prefs.effects)effect?.pause();if(prefs.haptics==='off')cancel();notify();
  }
  function context(next){
    if(next===track){notify();return;}track=next;
    if(next==='paused'){music?.pause();effect?.pause();cancel();notify();return;}
    if(paths[next]){
      music??=player(true);const src='audio/'+paths[next]+'.wav';
      if(music.getAttribute('src')!==src){music.pause();music.src=src;}
      levels();if(prefs.music)play(music);
    }
    notify();
  }
  function cancel(){try{navigator.vibrate?.(0)}catch{}priorityUntil=0;}
  function playEffect(kind){
    effect??=player();effect.pause();effect.src='audio/'+paths[kind]+'.wav';
    duckUntil=Date.now()+(['win','loss'].includes(kind)?2800:650);levels();
    clearTimeout(duckTimer);duckTimer=setTimeout(()=>{levels();notify()},duckUntil-Date.now());
    return play(effect);
  }
  function fire(kind){
    const result=kind==='win'||kind==='loss';
    if(document.hidden||(!result&&Date.now()<priorityUntil))return;
    priorityUntil=Date.now()+(result?2800:kind==='impact'?650:250);
    if(prefs.haptics==='all'||(prefs.haptics==='results'&&result)){try{navigator.vibrate?.(patterns[kind]||[])}catch{}}
    if(prefs.effects&&paths[kind])playEffect(kind);
  }
  function unlock(){unlocked=true;if(prefs.music&&track!=='paused')play(music);notify();}
  function preview(){unlock();return playEffect('message');}
  // Click inclui o toque concluído: pointerdown ainda pode ocorrer antes da ativação no celular.
  document.addEventListener('click',()=>{if(!unlocked||playbackIssue)unlock()},{capture:true});
  document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&(!unlocked||playbackIssue))unlock()},{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){music?.pause();effect?.pause();cancel()}else if(prefs.music&&track!=='paused')play(music);notify();});
  return {configure,context,fire,cancel,patterns,preview,status};
})();
