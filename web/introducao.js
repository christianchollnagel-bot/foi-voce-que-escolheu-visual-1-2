/* Animação vetorial original de 15 s, sem vídeo externo ou dependência de áudio. */
class Introducao extends HTMLElement {
 connectedCallback(){
  this.elapsed=0;this.running=true;this.scene=-1;this.controller=new AbortController();const signal=this.controller.signal;
  this.innerHTML=`<div class="film-art"><svg viewBox="0 0 640 400" role="img" aria-label="Uma encomenda passa pelo balcão, segue uma escolha e deixa um recibo e uma lembrança.">
   <defs><pattern id="film-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#1a1d22" opacity=".08"/></pattern></defs>
   <rect width="640" height="400" fill="#98d7c7"/><rect width="640" height="400" fill="url(#film-grid)"/>
   <g data-scene="0"><path d="M60 302h520v65H60z" fill="#302ed4" stroke="#1a1d22" stroke-width="5"/><rect x="75" y="42" width="203" height="126" rx="3" fill="#f4ebdd" stroke="#1a1d22" stroke-width="4"/><text x="96" y="86">ARQUIVO DAS</text><text x="96" y="118">ESCOLHAS</text><path d="M53 226h127l34 24-34 27H53M587 225H462l-35 25 35 27h125" fill="#f4ebdd" stroke="#1a1d22" stroke-width="5" stroke-linejoin="round"/><g class="film-envelope"><rect x="-67" y="-43" width="134" height="86" fill="#f4ebdd" stroke="#1a1d22" stroke-width="5"/><path d="m-67-43 67 48 67-48" fill="none" stroke="#f24d3f" stroke-width="6"/><circle cx="42" cy="24" r="10" fill="#302ed4"/></g><text x="320" y="348" text-anchor="middle" fill="#f4ebdd">1 · RECEBA O PEDIDO</text></g>
   <g data-scene="1" style="display:none"><path d="M80 200h125l110-100h230M205 200l110 100h230" fill="none" stroke="#1a1d22" stroke-width="9" stroke-linecap="round"/><rect x="326" y="55" width="230" height="88" rx="8" fill="#f4ebdd" stroke="#302ed4" stroke-width="5"/><text x="441" y="108" text-anchor="middle">PERGUNTAR</text><rect x="326" y="257" width="230" height="88" rx="8" fill="#f4ebdd" stroke="#1a1d22" stroke-width="4"/><text x="441" y="309" text-anchor="middle">DECIDIR</text><g class="film-token"><circle r="25" fill="#f24d3f" stroke="#1a1d22" stroke-width="4"/><path d="m-9 0 7 8 13-17" fill="none" stroke="#f4ebdd" stroke-width="5"/></g><text x="320" y="382" text-anchor="middle">2 · ESCOLHA O QUE FAZER</text></g>
   <g data-scene="2" style="display:none"><g class="film-receipt"><path d="M70 45h225v299l-22-12-23 12-22-12-23 12-22-12-23 12-22-12-23 12-23-12-22 12z" fill="#f4ebdd" stroke="#1a1d22" stroke-width="4"/><text x="99" y="89">SEU RECIBO</text><path d="M99 116h164M99 141h135M99 166h151M99 273h164" stroke="#1a1d22" stroke-width="5"/><g class="film-stamp"><rect x="93" y="190" width="180" height="52" fill="#98d7c7" stroke="#302ed4" stroke-width="5"/><text x="183" y="224" text-anchor="middle" fill="#302ed4">REGISTRADO</text></g></g><path d="M330 188h60m-17-17 17 17-17 17" fill="none" stroke="#1a1d22" stroke-width="5"/><g class="film-memory"><path d="M418 52h153v210H418z" fill="#302ed4" stroke="#1a1d22" stroke-width="4"/><path d="M438 52v210" stroke="#f4ebdd" stroke-width="3"/><text x="505" y="112" text-anchor="middle" fill="#f4ebdd">CADERNO</text><circle cx="505" cy="171" r="27" fill="#f4ebdd"/><path d="m490 172 10 10 23-27" fill="none" stroke="#302ed4" stroke-width="6"/></g><text x="320" y="382" text-anchor="middle">3 · ACOMPANHE AS CONSEQUÊNCIAS</text></g>
  </svg></div><div class="film-caption" aria-live="polite"><h2></h2><p></p></div><div class="film-timeline" aria-hidden="true"><span></span></div><div class="film-controls"><button type="button" data-film="pause">Pausar animação</button><span class="film-time" aria-label="Duração: 15 segundos">15 s</span><button type="button" data-film="skip">Pular introdução</button></div>`;
  this.addEventListener('click',e=>{if(e.target.dataset.film==='skip')this.finish();if(e.target.dataset.film==='pause')this.toggle();},{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.pause();},{signal});window.addEventListener('blur',()=>this.pause(),{signal});
  this.last=performance.now();this.paint();
  this.tick=now=>{if(!this.running)return;this.elapsed=Math.min(15000,this.elapsed+Math.max(0,now-this.last));this.last=now;this.paint();if(this.elapsed>=15000){this.finish();return;}this.raf=requestAnimationFrame(this.tick);};
  this.raf=requestAnimationFrame(this.tick);
 }
 paint(){
  const scene=Math.min(2,Math.floor(this.elapsed/5000)),t=(this.elapsed%5000)/5000;
  if(scene!==this.scene){this.scene=scene;this.querySelectorAll('[data-scene]').forEach((g,i)=>g.style.display=i===scene?'':'none');const copy=[['Receba e entenda o pedido','Você é o entregador. Leia o pedido e observe os detalhes.'],['Pergunte. Depois, escolha.','Os botões decidem seu caminho. Nas cargas, use as setas ou incline o celular.'],['Cada escolha deixa uma marca','Abra o recibo: pessoas lembram do que você fez. O progresso é salvo automaticamente.']][scene];this.querySelector('h2').textContent=copy[0];this.querySelector('.film-caption p').textContent=copy[1];}
  const reduced=document.body.classList.contains('motion-off')||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const u=reduced?.65:Math.min(1,t*1.5),smooth=u*u*(3-2*u);
  this.querySelector('.film-envelope').setAttribute('transform',`translate(${180+280*smooth} ${238-38*Math.sin(smooth*Math.PI)}) rotate(${-8+16*smooth})`);
  const v=reduced?.8:Math.min(1,t*1.4),x=v<.4?80+125*v/.4:205+210*(v-.4)/.6,y=v<.4?200:200-100*(v-.4)/.6;
  this.querySelector('.film-token').setAttribute('transform',`translate(${x} ${y})`);
  this.querySelector('.film-stamp').setAttribute('opacity',reduced?1:Math.min(1,t*4));
  this.querySelector('.film-memory').setAttribute('transform',`translate(0 ${reduced?0:Math.max(0,1-t*2)*45})`);
  this.querySelector('.film-timeline span').style.width=(this.elapsed/150)+'%';
  const remaining=Math.ceil((15000-this.elapsed)/1000)+' s',clock=this.querySelector('.film-time');if(clock.textContent!==remaining)clock.textContent=remaining;
 }
 pause(){if(!this.running)return;this.running=false;cancelAnimationFrame(this.raf);this.querySelector('[data-film=pause]').textContent='Retomar animação';}
 toggle(){if(this.running){this.pause();return;}this.running=true;this.last=performance.now();this.querySelector('[data-film=pause]').textContent='Pausar animação';this.raf=requestAnimationFrame(this.tick);}
 finish(){this.running=false;cancelAnimationFrame(this.raf);this.dispatchEvent(new CustomEvent('intro-complete',{bubbles:true}));}
 disconnectedCallback(){cancelAnimationFrame(this.raf);this.controller?.abort();}
}
customElements.define('fvqe-introducao',Introducao);
