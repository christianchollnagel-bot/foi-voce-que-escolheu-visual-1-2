/* Um trecho reinicia do último ponto estável se a página for fechada. */
class Transporte extends HTMLElement {
  connectedCallback(){
    this.innerHTML='<section class="cargo"><div class="cargo-setup"><h2>Equilibre a encomenda</h2><p>Escolha o apoio. Mantenha a caixa perto do centro por 9–12 segundos, conforme a estratégia. Use as setas ← → ou os botões; no celular, também é possível inclinar.</p><label>Como levar <select aria-label="Estratégia de transporte"><option value="junto">Tudo junto · 9 segundos</option><option value="dividir">Dividir a carga · 12 segundos</option><option value="apoio">Improvisar apoio · 10 segundos</option></select></label><p class="sensor-status" role="status">Toque e teclado disponíveis.</p><button type="button" data-cargo="sensor">Ativar inclinação e calibrar</button></div><div class="cargo-play"><div class="cargo-live" hidden><div class="cargo-track"><span class="cargo-box" aria-hidden="true">▣</span></div><p class="cargo-status" aria-live="polite">Pronto para sair.</p></div><div class="cargo-buttons"><button type="button" data-cargo="left" aria-label="Equilibrar para esquerda" hidden>←</button><button type="button" data-cargo="right" aria-label="Equilibrar para direita" hidden>→</button><button type="button" data-cargo="start">Começar transporte</button><button type="button" data-cargo="pause" hidden>Pausar transporte</button></div></div></section>';
    this.x=0;this.v=0;this.elapsed=0;this.impacts=0;this.controlInput=0;this.tilt=0;this.running=false;this.started=false;this.lastImpact=-100;this.controller=new AbortController();const signal=this.controller.signal;
    this.addEventListener('click',e=>{const a=e.target.dataset.cargo;if(a==='sensor')this.sensor();if(a==='start')this.start();if(a==='pause')this.pause();},{signal});
    for(const b of this.querySelectorAll('[data-cargo="left"],[data-cargo="right"]')){
      const dir=b.dataset.cargo==='left'?-1:1;
      b.addEventListener('pointerdown',e=>{if(!this.running)return;e.preventDefault();b.setPointerCapture(e.pointerId);this.controlInput=dir},{signal});
      for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>this.controlInput=0,{signal});
    }
    document.addEventListener('keydown',e=>{if(this.running&&!/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();this.controlInput=e.key==='ArrowLeft'?-1:1}},{signal});
    document.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key))this.controlInput=0},{signal});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.pause()},{signal});window.addEventListener('blur',()=>this.pause(),{signal});
    this.frame=now=>{if(!this.running)return;const dt=Math.min((now-this.last)/1000,.05);this.last=now;this.elapsed+=dt;
      const force=this.strategy==='junto'?.56:this.strategy==='dividir'?.27:.18;
      const input=this.controlInput||this.tilt;this.v+=(Math.sin(this.elapsed*2.3)*force+input*1.8-this.x*.42-this.v*1.6)*dt;this.x+=this.v*dt;
      if(Math.abs(this.x)>.92){this.x=Math.sign(this.x)*.9;this.v*=-.25;if(this.elapsed-this.lastImpact>1){this.impacts++;this.lastImpact=this.elapsed;Feedback.fire('impact');this.tilt=0;}}
      this.querySelector('.cargo-box').style.left=(50+this.x*44)+'%';
      const status=this.querySelector('.cargo-status'),message=Math.ceil(Math.max(0,this.duration-this.elapsed))+' segundos · '+this.impacts+' impactos'+(this.elapsed-this.lastImpact<.6?' · A caixa bateu!':'');
      if(status.textContent!==message)status.textContent=message;
      if(this.elapsed>=this.duration){this.running=false;this.querySelector('[data-cargo="pause"]').hidden=true;this.dispatchEvent(new CustomEvent('cargo-complete',{bubbles:true,detail:{impacts:this.impacts,strategy:this.strategy,condition:this.impacts?'desarrumada':'preservada'}}));return;}
      this.raf=requestAnimationFrame(this.frame);
    };
  }
  start(){if(this.running)return;if(!this.started){this.strategy=this.querySelector('select').value;this.duration=this.strategy==='dividir'?12:this.strategy==='apoio'?10:9;this.started=true;this.querySelector('select').disabled=true;}this.running=true;this.last=performance.now();this.querySelector('.cargo-setup').hidden=true;this.querySelector('.cargo-live').hidden=false;this.querySelectorAll('[data-cargo="left"],[data-cargo="right"]').forEach(b=>b.hidden=false);this.querySelector('[data-cargo="start"]').hidden=true;this.querySelector('[data-cargo="pause"]').hidden=false;window.GamePages?.reveal(this.querySelector('.cargo-play'));this.querySelector('[data-cargo="pause"]').focus({preventScroll:true});this.raf=requestAnimationFrame(this.frame);}
  pause(){if(!this.running)return;this.running=false;cancelAnimationFrame(this.raf);this.controlInput=0;this.tilt=0;this.querySelector('[data-cargo="start"]').hidden=false;this.querySelector('[data-cargo="start"]').textContent='Retomar transporte';this.querySelector('[data-cargo="pause"]').hidden=true;this.querySelector('.cargo-status').textContent='Transporte pausado. Retome quando estiver pronto.';Feedback.cancel();window.GamePages?.reveal(this.querySelector('.cargo-play'));}
  async sensor(){
    const status=this.querySelector('.sensor-status');const api=window.DeviceOrientationEvent;
    if(!api){status.textContent='Inclinação indisponível. Use os botões ou as setas.';return;}
    try{if(typeof api.requestPermission==='function'&&await api.requestPermission()!=='granted')throw Error();}
    catch{status.textContent='Acesso não autorizado. Os botões e as setas continuam funcionando.';return;}
    if(!this.isConnected)return;this.baseline=null;this.samples=0;this.sensorController?.abort();this.sensorController=new AbortController();clearTimeout(this.sensorTimer);
    status.textContent='Segure o celular numa posição confortável. Aguardando movimento…';
    window.addEventListener('deviceorientation',e=>{if(!Number.isFinite(e.gamma))return;this.samples++;if(this.baseline===null)this.baseline=e.gamma;const angle=Math.max(-1,Math.min(1,(e.gamma-this.baseline)/20));this.tilt=this.tilt*.8+(Math.abs(angle)<.08?0:angle)*.2;if(this.samples===1)status.textContent='Inclinação ativa. Incline suavemente; o botão permite recalibrar.';},{signal:this.sensorController.signal});
    this.sensorTimer=setTimeout(()=>{if(!this.samples){status.textContent='O sensor não respondeu. Use os botões ou as setas.';this.sensorController.abort();}},2500);
  }
  disconnectedCallback(){cancelAnimationFrame(this.raf);clearTimeout(this.sensorTimer);this.controller?.abort();this.sensorController?.abort();Feedback.cancel();}
}
customElements.define('fvqe-transporte',Transporte);

