async function settle(page){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function reach(page,locator,{touch=false}={}){
 await settle(page);
 const isReady=async()=>await locator.count()>0&&await locator.first().evaluate(el=>{
  const viewport=el.closest('.page-viewport');if(!viewport)return !el.hidden;
  const box=viewport.getBoundingClientRect(),r=el.getBoundingClientRect();
  return !el.closest('[inert]')&&r.width>0&&r.height>0&&r.left>=box.left-1&&r.right<=box.right+1&&r.top>=box.top-1&&r.bottom<=box.bottom+1;
 });
 if(await isReady())return locator.first();
 while(await page.locator('[data-page=previous]').isEnabled()){await page.locator('[data-page=previous]')[touch?'tap':'click']();await settle(page);}
 for(let i=0;i<150;i++){
  if(await isReady())return locator.first();
  if(!await page.locator('[data-page=next]').isEnabled())break;
  await page.locator('[data-page=next]')[touch?'tap':'click']();await settle(page);
 }
 throw Error('Controle inacessível pelas páginas: '+locator);
}
const named=(page,name)=>page.getByRole('button',{name,exact:true,includeHidden:true});
async function click(page,name){const target=await reach(page,named(page,name));await target.click();await settle(page);}
module.exports={settle,reach,named,click};
