/* Tintas transparentes sobre os pixels da impressão. A luminância e o grão da arte
   são conservados. A máscara elíptica suaviza a borda e protege o papel do cartaz. */
window.RevelarRetratos = function(root){
  if(!root.querySelectorAll || typeof Image==='undefined')return;
  for(const holder of root.querySelectorAll('.portrait[data-tom]')){
    const source=holder.querySelector('img'), skin=holder.dataset.tom,hair=holder.dataset.fio,shape=holder.dataset.forma;
    if(!source || (skin==='original' && hair==='original' && shape==='original'))continue;
    const draw=()=>{
      if(!source.naturalWidth || !holder.isConnected)return;
      const layer=document.createElement('canvas');
      layer.width=source.naturalWidth;layer.height=source.naturalHeight;
      const ctx=layer.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);
      let bitmap;
      try { bitmap=ctx.getImageData(0,0,layer.width,layer.height); }
      catch(error) {
        if(error.name!=='SecurityError')throw error;
        // file:// pode impedir a leitura dos pixels mesmo de uma imagem vizinha.
        // Composição local por máscaras CSS mantém a prévia operável nesse modo.
        for(const [region,value] of [['skin',skin],['hair',hair]]){
          if(value==='original')continue;
          const overlay=source.cloneNode();overlay.alt='';overlay.setAttribute('aria-hidden','true');
          overlay.className='tinta-local '+region+' '+value;source.after(overlay);
        }
        if(shape!=='original')holder.style.setProperty('--face-width',shape==='a'?'.95':'1.06');
        return;
      }
      const px=bitmap.data;
      for(let y=0;y<layer.height;y++)for(let x=0;x<layer.width;x++){
        const i=(y*layer.width+x)*4, r=px[i],g=px[i+1],b=px[i+2];
        const nx=x/layer.width,ny=y/layer.height,lum=.30*r+.59*g+.11*b;
        const mid=Math.max(0,Math.min(1,2.3-((nx-.5)/.42)**2-((ny-.49)/.50)**2));
        // Deixa os brancos, as sombras pretas, o contorno e as áreas frias intactos.
        const ink=mid*Math.max(0,Math.min(1,(r-g-8)/20,(g-b+2)/12,(lum-32)/30,(235-lum)/30));
        if(skin!=='original' && ink>0){
          const shift=skin==='dourada'?[14,6,-10]:[-26,-22,-18];
          for(let c=0;c<3;c++)px[i+c]+=shift[c]*ink;
        }
        const crown=Math.max(0,Math.min(1,(.40-ny)*8, (nx-.05)*9,(.95-nx)*9));
        if(hair!=='original'&&crown && lum<88 && r>=b*.85){
          const strength=crown*Math.min(1,(88-lum)/32);
          const lift=hair==='castanho'?[30,11,1]:[40,27,11];
          for(let c=0;c<3;c++)px[i+c]+=lift[c]*strength;
        }
      }
      if(shape!=='original'){
        const original=new Uint8ClampedArray(px),w=layer.width,h=layer.height;
        const offsets={a:[.060,-.062],b:[-.076,.048],c:[-.065,.019]}[shape];
        for(let y=0;y<h;y++)for(let x=0;x<w;x++){
          const dx=(x/w-.51)/.30,dy=(y/h-.48)/.31;
          const fall=Math.exp(-(dx*dx*1.3+dy*dy*1.5));
          const sx=Math.max(0,Math.min(w-1,Math.round(x+w*offsets[0]*dx*fall)));
          const sy=Math.max(0,Math.min(h-1,Math.round(y+h*offsets[1]*dy*fall)));
          const src=(sy*w+sx)*4,dst=(y*w+x)*4;
          for(let c=0;c<3;c++)px[dst+c]=original[src+c];
        }
      }
      ctx.putImageData(bitmap,0,0);layer.setAttribute('aria-hidden','true');source.after(layer);
    };
    if(source.complete)draw();else source.addEventListener('load',draw,{once:true});
  }
};


