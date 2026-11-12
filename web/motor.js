function run(c,state,choice) {
 const s={...state}, k=s.step;
 if(k==='prep'){s.ready=choice===0;s.step='social';return [s,c.prep[choice][1]]}
 if(k==='social'){s.awkward=choice===1;s.step=c.event && s.awkward?'event':'delivery';return [s,c.social[choice][1]]}
 if(k==='event'){
  const effect=c.event.effects[choice];s.step=['win','loss'].includes(effect)?'end':'delivery';
  if(s.step==='end')s.win=effect==='win';
  if(effect==='ready')s.ready=true;
  return [s,c.event.actions[choice][1]]
 }
 if(k==='delivery' && choice===2){s.step='repair';return [s,'Você pede pra conferir antes de encerrar a entrega.']}
 if(k==='delivery' && choice===0 && !s.ready){s.step='repair';return [s,c.missing]}
 if(k!=='delivery' && k!=='repair')throw Error('Estado encerrado');
 s.step='end';s.win=choice===0;
 return [s,(k==='repair'?c.repair:c.delivery)[choice][1]]
}
function options(c,s){switch(s.step){
 case 'event':return c.event.actions.map(a=>a[0]);
 case 'prep':return c.prep.map(a=>a[0]);
 case 'social':return c.social.map(a=>a[0]);
 case 'delivery':return [...c.delivery.map(a=>a[0]),'Conferir antes de decidir'];
 case 'repair':return c.repair.map(a=>a[0]);
 default:return []}}
