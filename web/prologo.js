/* Três ilustrações e selos vetoriais originais. As peças animadas têm movimento único e curto. */
window.Prologo = (() => {
 const frames=[
   {title:'O balcão de Porto do Cedro',text:'Em Porto do Cedro, o Arquivo guarda até o som de uma chave. Pra saber que porta ela abria, às vezes é preciso perguntar a quem ainda se lembra.'},
   {title:'Vai na sua mão',text:'O pedido sai do balcão com você. No envelope cabe o endereço. O recado de falar baixinho, esse vai por sua conta.'},
   {title:'Quem mais ouviu?',text:'Você chama uma pessoa pelo nome. Três levantam a cabeça. Quando a carta chega ao destino, a conversa já virou a esquina.'}
 ];
 const descriptions=['O balcão do Arquivo, suas gavetas e uma chave sobre a ficha.','Duas mãos passam um envelope por cima do balcão.','Um envelope encosta na primeira peça de dominó. Ao fundo, três pessoas se viram.'];
 const icons=['<path d="M4 5h23v28H4zM8 12h14m-14 6h14m-14 6h9"/>','<path d="M2 8h29v21H2zM2 8l14 12L31 8"/>','<rect x="8" y="3" width="17" height="30" rx="2"/><path d="M8 18h17"/><circle cx="13" cy="9" r="1"/><circle cx="20" cy="13" r="1"/><circle cx="16" cy="25" r="1"/>'];
 function illustration(n){
   return '<figure class="prologue-print"><img src="assets/prologo/'+(n+1)+'.webp" alt="'+descriptions[n]+'"><figcaption><svg aria-hidden="true" class="peca" viewBox="0 0 34 36">'+icons[n]+'</svg>ARQUIVO / PORTO DO CEDRO <b>0'+(n+1)+'</b></figcaption></figure>';
 }
 return {frames,illustration};
})();

