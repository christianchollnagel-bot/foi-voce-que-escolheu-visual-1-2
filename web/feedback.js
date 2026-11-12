window.Feedback = (()=>{
  let prefs={muted:false,music:true,effects:true,volume:.55,haptics:'results'},track='',music=null,effect=null,unlocked=false,priorityUntil=0,duckTimer,duckUntil=0;
  let playbackIssue='';
  let mixer=null,needsMixer=false,primed=false;
  const gains=new WeakMap(),silence='data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQIAAAAAAA==';
  const patterns={win:[45,65,45],loss:[140],stamp:[30],message:[25,50,25,50,40],reveal:[40],impact:[35],knock:[40,120,40]};
  const paths={opening:'turno-comecou',route:'era-so-entregar',confusion:'agora-explica',ending:'fim-do-turno',win:'vitoria',loss:'derrota',stamp:'carimbo',message:'mensagem',impact:'impacto',knock:'batidas',reveal:'mensagem'};
  function enabled(){return !prefs.muted&&prefs.volume>0&&(prefs.music||prefs.effects);}
  function status(){
    if(!enabled())return 'Som desligado.';
    if(playbackIssue)return playbackIssue;
    if(mixer&&mixer.state!=='running'&&unlocked&&!document.hidden)return 'Som pausado pelo sistema. Toque na tela para retomar.';
    if(!unlocked)return 'Som ligado. Comece a jogar para ouvir.';
    if(effect&&!effect.paused)return 'Efeito sonoro em reprodução.';
    if(document.hidden||track==='paused')return 'Som ligado. Música pausada nesta tela.';
    if(music&&!music.paused&&prefs.music)return 'Música em reprodução.';
    return prefs.effects?'Efeitos sonoros ligados.':'Som pronto para reproduzir.';
  }
  function notify(){
    const el=document.getElementById?.('audio-status');if(el)el.textContent=status();
    const button=document.getElementById?.('sound-toggle');
    if(button){button.textContent=enabled()?'Desativar som':'Ativar som';button.dataset.enabled=String(enabled());}
  }
  function report(error){
    if(error?.name==='AbortError')return;
    playbackIssue=error?.name==='NotAllowedError'?'O navegador bloqueou o som. Toque novamente na tela para tentar.':'Não foi possível carregar o áudio. Confira a conexão e tente novamente.';
    notify();
  }
  function player(loop=false){
    const a=new Audio();a.loop=loop;a.preload='auto';
    a.setAttribute?.('playsinline','');
    // Algumas versões móveis ignoram HTMLMediaElement.volume; usar ganho real nesse caso.
    a.volume=.5;needsMixer ||= Math.abs(a.volume-.5)>.01;a.volume=1;
    a.addEventListener?.('ended',notify);a.addEventListener?.('error',()=>report(a.error));
    return a;
  }
  function prepareMixer(){
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!needsMixer||!Context)return;
    try{
      mixer??=new Context();
      for(const a of [music,effect])if(a&&!gains.has(a)){
        const gain=mixer.createGain(),source=mixer.createMediaElementSource(a);
        source.connect(gain);gain.connect(mixer.destination);gains.set(a,gain);a.volume=1;
      }
      if(mixer.state!=='running')mixer.resume().then(notify,report);
    }catch(error){report(error);}
  }
  function level(a,value){if(!a)return;const gain=gains.get(a);if(gain)gain.gain.value=value;else a.volume=value;}
  function play(a){
    if(!a||!unlocked||document.hidden||!enabled())return Promise.resolve(false);
    try{return Promise.resolve(a.play()).then(()=>{playbackIssue='';notify();return true},error=>{report(error);return false});}
    catch(error){report(error);return Promise.resolve(false);}
  }
  function levels(){
    level(music,!prefs.muted&&prefs.music?prefs.volume*(Date.now()<duckUntil?.18:.55):0);
    level(effect,!prefs.muted&&prefs.effects?prefs.volume*.9:0);
  }
  function configure(p){
    prefs={...prefs,...p};levels();
    if(!enabled()||!prefs.music)music?.pause();else if(track!=='paused')play(music);
    if(!enabled()||!prefs.effects)effect?.pause();if(prefs.haptics==='off')cancel();notify();
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
    if(enabled()&&prefs.effects&&paths[kind])playEffect(kind);
  }
  function unlock(){
    unlocked=true;
    if(enabled()){
      effect??=player();prepareMixer();levels();
      // Preparar o segundo elemento no gesto permite efeitos posteriores, como o fim do transporte.
      if(!primed&&prefs.effects){primed=true;effect.src=silence;play(effect).then(ok=>{if(effect.getAttribute('src')===silence)effect.pause();if(!ok)primed=false;});}
      if(prefs.music&&track!=='paused')play(music);
    }
    notify();
  }
  // Click inclui o toque concluído: pointerdown ainda pode ocorrer antes da ativação no celular.
  // O botão cuida da própria ativação; desligá-lo nunca deve iniciar um trecho de música.
  const isToggle=e=>e.target.closest?.('[data-action="sound-toggle"]');
  const needsUnlock=()=>!unlocked||playbackIssue||mixer&&mixer.state!=='running';
  document.addEventListener('click',e=>{if(!isToggle(e)&&needsUnlock())unlock()},{capture:true});
  document.addEventListener('keydown',e=>{if(!isToggle(e)&&['Enter',' '].includes(e.key)&&needsUnlock())unlock()},{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){music?.pause();effect?.pause();mixer?.suspend().catch(()=>{});cancel()}else{if(enabled()&&unlocked)prepareMixer();if(prefs.music&&track!=='paused')play(music);}notify();});
  return {configure,context,fire,cancel,patterns,unlock,enabled,status};
})();
