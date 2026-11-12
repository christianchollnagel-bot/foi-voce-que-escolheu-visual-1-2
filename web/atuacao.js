/* Direção de atuação. Os índices são os das ações do motor, antes da rotação dos botões.
   Cada marca identifica quem aparece naquele trecho. "-" reserva a cena ao narrador. */
window.Atelier = (() => {
  const catalog = ['Tranças','Óculos','Cachos','Prateado','Raspado','Lenço','Barba','Sardas','Liso longo','Black alto','Brincos','Pixie','Barba branca','Locs acobreados','Franja longa','Chanel prateado','Cabelo longo','Barba cheia','Tranças presas','Franja assimétrica','Ondas e barba','Afro e argolas','Ondas grisalhas','Bigode'];
  const cast = {dalva:'Dalva Pires',ines:'Inês Souto',isaura:'Isaura',dimas:'Dimas Ferraz',rui:'Rui',cida:'Cida',chapeu:'Rapaz do chapéu',mulher:'Mulher da escada',encarregada:'Encarregada',vizinho:'Vizinho',porteiro:'Porteiro',lia:'Lia',frete:'Rapaz do frete',crianca:'Criança da plateia',ministro:'Ministro aposentado',sindica:'Síndica'};
  // Rótulo, desenho facial, intensidade e inclinação do busto em graus.
  const cues = {
    neutro:['Neutro','neutro',0,0], atento:['Atenção','neutro',1,-3],
    curioso:['Curiosidade','surpresa',1,-6], surpresa:['Surpresa','surpresa',2,-2],
    choque:['Choque','surpresa',3,5], panico:['Pânico','panico',3,7],
    desconfiado:['Desconfiança','desconfianca',2,-4], hesitante:['Hesitação','desconfianca',1,4],
    concentrado:['Concentração','neutro',2,2], confiante:['Confiança','alegria',1,-2],
    alegria:['Alegria','alegria',3,-4], aliviado:['Alívio','alegria',1,4],
    ironia:['Ironia','constrangimento',2,-6], constrangido:['Constrangimento','constrangimento',2,4],
    impaciente:['Impaciência','irritacao',1,2], irritado:['Irritação','irritacao',3,-4],
    cansado:['Cansaço','tristeza',1,5], decepcao:['Decepção','tristeza',2,3],
    tristeza:['Tristeza','tristeza',3,6], reservado:['Reserva','neutro',1,4]
  };
  const official = {atento:'neutro',curioso:'desconfiado',surpresa:'panico',choque:'panico',hesitante:'desconfiado',concentrado:'neutro',alegria:'aliviado',impaciente:'cansado',irritado:'constrangido',decepcao:'cansado',tristeza:'cansado',reservado:'neutro'};
  const ask = ['dalva','chapeu','isaura','ines','frete','rui','dalva','cida','mulher','encarregada','ines','vizinho'];
  const openings = ['dalva','chapeu','isaura','ines','frete','rui','dalva','cida','mulher','encarregada','crianca','vizinho'];
  const social = ['ines','chapeu','isaura','dimas','frete','rui','cida','cida','mulher','encarregada','crianca','vizinho'];
  const echoes = ['dalva dalva','chapeu ministro','isaura isaura','ines dimas','dalva frete','rui rui','dalva cida','cida cida','mulher mulher','encarregada encarregada','ines ines','vizinho vizinho'];
  // Uma linha por capítulo. As cinco colunas seguem prep, social, delivery, repair e event.
  const reactions = [
    ['dalva:reservado dalva:atento','ines:atento -','ines:concentrado -','dalva:confiante ines:surpresa','dalva:aliviado -'],
    ['chapeu:confiante ministro:curioso','chapeu:atento ministro:curioso','chapeu:aliviado ministro:surpresa','chapeu:atento chapeu:decepcao'],
    ['isaura:concentrado isaura:surpresa','- isaura:ironia','- -','isaura:concentrado isaura:cansado','isaura:atento -'],
    ['ines:concentrado -','- dimas:ironia','ines:atento ines:impaciente','ines:concentrado -'],
    ['- frete:hesitante','frete:aliviado frete:ironia','frete:confiante -','dalva:atento -','frete:concentrado -'],
    ['rui:reservado -','- -','rui:aliviado rui:choque','rui:atento -','rui:atento rui:surpresa'],
    ['- -','dalva:atento cida:curioso','dalva:confiante dalva:reservado','dalva:concentrado dalva:decepcao'],
    ['cida:concentrado -','cida:confiante cida:surpresa','ines:atento ines:hesitante','cida:aliviado -'],
    ['mulher:atento -','mulher:atento mulher:reservado','mulher:aliviado mulher:decepcao','mulher:confiante mulher:tristeza'],
    ['- -','encarregada:concentrado encarregada:impaciente','- encarregada:irritado','encarregada:concentrado -','encarregada:aliviado -'],
    ['ines:atento crianca:curioso','- crianca:alegria','rui:aliviado -','ines:concentrado -'],
    ['vizinho:reservado -','vizinho:atento vizinho:ironia','ines:atento -','vizinho:confiante -','- vizinho:atento']
  ];
  const port = {P01:'porteiro:atento',P04:'porteiro:neutro',P05L:'porteiro:desconfiado',P05B:'porteiro:reservado',P05M:'porteiro:confiante',P05T:'porteiro:concentrado',P05R:'porteiro:neutro',P06Q:'porteiro:hesitante',P06B:'porteiro:cansado',P06C:'porteiro:concentrado',P06M:'lia:ironia',P06T:'porteiro:atento',P06W:'porteiro:reservado'};
  function read(mark) {
    if(!mark || mark==='-')return null;
    const [actor,cue='atento']=mark.split(':');
    return {actor,cue};
  }
  function current(s,phase) {
    if(s.id===12)return read(port[s.state.scene]);
    const id=s.id,k=s.state.step;
    if(phase==='entrada')return read(openings[id]);
    if(phase==='perguntar')return read(ask[id]);
    if(k==='delivery')return read(echoes[id].split(' ')[Number(s.state.awkward)]+(s.state.awkward?':ironia':':atento'));
    if(k==='repair')return null;
    if(k==='event')return read(['dalva','','isaura','','frete','rui','','','','encarregada','','vizinho'][id]);
    return read(k==='social'?social[id]:openings[id]);
  }
  function reaction(s) {
    const h=s.history.at(-1);
    if(!h)return null;
    if(s.id!==12){
      if(h.from==='delivery' && h.to==='repair')return h.index===2?null:read(['dalva:atento','chapeu:concentrado','-','ines:curioso','frete:hesitante','-','dalva:curioso','ines:curioso','mulher:atento','encarregada:atento','ines:concentrado','vizinho:reservado'][s.id]);
      return read(reactions[s.id][['prep','social','delivery','repair','event'].indexOf(h.from)]?.split(' ')[h.index]);
    }
    if(h.from==='P01')return read(['lia:aliviado','porteiro:hesitante','porteiro:atento'][h.index]);
    if(h.from==='P04')return read(h.index===0?'porteiro:atento':'sindica:concentrado');
    if(h.from==='P05B' && h.index===1)return read((h.previous?.desk||s.state.desk)==='janela'?'sindica:irritado':'porteiro:hesitante');
    if(h.from==='P06W' && h.index===1)return read('porteiro:irritado');
    if(h.to==='P09'||['P02','P03','P07','P05B'].includes(h.from))return null;
    return read(port[h.from]);
  }
    // Direção de cena baseada no gesto e na voz do roteiro, independente da aparência.
  const cards={
    dalva:['Aproxima a voz para o assunto ficar entre duas pessoas.','Olhar lateral para a fila, boca contida; quando fala do próprio prazo, sustenta o olhar.',-1.0],
    ines:['Confere uma diferença por vez.','Olhos nas duas vias e depois no interlocutor. A pergunta levanta uma sobrancelha.',0.65],
    isaura:['Conversa enquanto trabalha.','Queixo firme, olhos rápidos para as tampas. O sorriso acompanha a tirada seca.',0.8],
    dimas:['Oferece o polegar sem tocar a ficha.','Olhar de canto e sorriso pequeno, quase protocolar.',-0.65],
    rui:['Decide o que sai da cabine.','Olhar recolhido na conferência do nome. O riso escapa pelo canto da boca.',-0.8],
    cida:['Interrompe o corte para medir a situação.','Queixo adiante na pergunta e lábios apertados antes da ironia.',1.0],
    chapeu:['Quer receber o aviso sem perder a vez.','Acompanha o chapéu com os olhos. O alívio relaxa o maxilar.',0.9],
    mulher:['Espera pela devolução do prato.','Olhar firme no interlocutor; recolhe o queixo quando sugerem um leilão.',0.7],
    encarregada:['Examina a guia e preserva o lacre.','Foco baixo e boca quase imóvel ao conferir, sobrancelhas altas na interrupção.',0.55],
    vizinho:['Separa o que viu do que não sabe.','Inclina a cabeça para indicar o endereço, faz uma pausa antes de responder.',-0.95],
    porteiro:['Protege a precisão do registro do turno.','Alterna o olhar entre a sua letra e o recibo. Reserva o gesto maior para a conversa pública.',0.75],
    lia:['Confirma o que recebeu e brinca com a própria pressa.','Olhar direto na confirmação. Um canto da boca sobe ao lembrar do chinelo.',-0.85],
    frete:['Conversa com o peso do móvel nas mãos.','Inclina a cabeça como quem procura o vão; solta o maxilar quando o móvel é calçado.',1.05],
    crianca:['Faz a raposa aparecer com os dedos.','Olhos seguem a sombra. O sorriso abre quando a plateia reage.',-1.1],
    ministro:['Descobre o engano pelo número do aviso.','Queixo erguido e testa que se contrai antes da pergunta.',0.6],
    sindica:['Escuta da janela da administração.','Levanta os olhos das contas. Mantém o rosto parado por um instante antes da pergunta.',-0.7]
  };
  function sprite(kind,cue) {
    const drawn=window.FolhasAtuacao?.[kind]||[];
    const alias={desconfiado:'desconfianca',constrangido:'constrangimento',irritado:'irritacao'};
    const key=alias[cue]||cue;
    return drawn.includes(key)?key:(kind==='npc'&&cue==='panico'?'surpresa':cues[cue][1]);
  }
  return {catalog,cast,cues,official,cards,current,reaction,sprite};
})();



