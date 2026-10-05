/** Draw a named atlas frame using JSON pixel runs only; no image fetch required. */
export function drawProcedural(ctx, atlas, frameName, x, y, scale=1) {
  const entry=atlas.frames[frameName];
  if(!entry)throw new Error(`Unknown UI frame: ${frameName}`);
  const frame=entry.frame, p=atlas.procedural;
  ctx.save();
  for(const [rx,ry,width,color] of p.runs){
    if(ry<frame.y||ry>=frame.y+frame.h)continue;
    const left=Math.max(rx,frame.x),right=Math.min(rx+width,frame.x+frame.w);
    if(right<=left)continue;
    ctx.fillStyle=p.palette[color];
    ctx.fillRect(x+(left-frame.x)*scale,y+(ry-frame.y)*scale,(right-left)*scale,scale);
  }
  ctx.restore();
}

/** Cache procedural artwork once, then drawImage the cached canvas each game tick. */
export function createProceduralCanvas(atlas,frameName='panel') {
  const f=atlas.frames[frameName]?.frame;
  if(!f)throw new Error(`Unknown UI frame: ${frameName}`);
  const canvas=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(f.w,f.h):document.createElement('canvas');
  canvas.width=f.w;canvas.height=f.h;
  drawProcedural(canvas.getContext('2d'),atlas,frameName,0,0);
  return canvas;
}

export function drawPNG(ctx,image,atlas,frameName,x,y,scale=1){
  const f=atlas.frames[frameName]?.frame;
  if(!f)throw new Error(`Unknown UI frame: ${frameName}`);
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.drawImage(image,f.x,f.y,f.w,f.h,x,y,f.w*scale,f.h*scale);
  ctx.restore();
}

/** Convert a DOM pointer position to a UI region on a uniformly fitted panel. */
export function hitTestRegion(atlas,regionName,point,panelRect){
  const r=atlas.ui.regions[regionName];
  if(!r)return false;
  const fit=Math.min(panelRect.width/atlas.meta.size.w,panelRect.height/atlas.meta.size.h);
  if(!(fit>0))return false;
  const left=panelRect.left+(panelRect.width-atlas.meta.size.w*fit)/2;
  const top=panelRect.top+(panelRect.height-atlas.meta.size.h*fit)/2;
  const x=(point.x-left)/fit,y=(point.y-top)/fit;
  return x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
}
