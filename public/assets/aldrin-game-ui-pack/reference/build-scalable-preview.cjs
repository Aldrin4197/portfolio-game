const fs=require('fs');
const root='.',out=root+'/public/assets/ui';
const data=JSON.parse(fs.readFileSync(out+'/portfolio-data.json'));
const packageData={data,atlases:{},images:{},photo:'data:image/png;base64,'+fs.readFileSync(out+'/aldrin-photo.png').toString('base64')};
for(const id of ['about','experience','achievements','tools','contact','medals','tech-stack']){
 const atlas=JSON.parse(fs.readFileSync(out+'/'+id+'.json'));
 if(atlas.ui){atlas.ui.scalable={strategy:'nine-slice-border',slice:{top:32,right:32,bottom:32,left:32},drawCenter:false,contentLayout:'DOM flow; do not use fixed ui.regions for scalable mode'};fs.writeFileSync(out+'/'+id+'.json',JSON.stringify(atlas));}
 packageData.atlases[id]=atlas;packageData.images[id]='data:image/png;base64,'+fs.readFileSync(out+'/'+id+'.png').toString('base64');
}
let manifest=JSON.parse(fs.readFileSync(out+'/manifest.json'));manifest.version=2;manifest.data='portfolio-data.json';manifest.iconAtlases.push({id:'tech-stack',image:'tech-stack.png',atlas:'tech-stack.json'});manifest.iconAtlases=manifest.iconAtlases.filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i);manifest.scalableLayout={projects:'tools',about:'about',experience:'about',achievements:'achievements',tools:'tools',contact:'about'};fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2));
const css=fs.readFileSync(root+'/src/lib/scalable-game-ui.css','utf8');
const lib=fs.readFileSync(root+'/src/lib/scalable-game-ui.js','utf8').replaceAll('export function','function');
const renderer=fs.readFileSync(root+'/src/lib/game-ui-atlas.js','utf8').replaceAll('export function','function');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aldrin · Scalable game UI</title><style>${css}\nbody{margin:0;background:#0c1b2a;color:#e9d9b0;font-family:monospace}.demo-launch{margin:12vh auto;text-align:center;max-width:800px;padding:30px}.demo-launch button{font:inherit;background:#a1cbb2;padding:16px 24px;border:3px solid #e5d9b1;cursor:pointer}.gui-header-actions{display:flex;gap:8px;align-items:center}.demo-toggle{font-size:12px!important;padding:8px!important}.gui-header{flex-wrap:wrap}.demo-label{color:#acd6b8;font-size:12px;padding-bottom:8px}</style>
<main class="demo-launch"><h1>Aldrin’s world</h1><p>Scalable inventory, project collection and achievement board.</p><p>Use the sample-item control inside the panel to try 36 items. This is demo data only.</p><button id="open">Open inventory</button></main><div id="ui"></div><script>
const PACK=${JSON.stringify(packageData)};
${renderer}\n${lib}
function raster(atlas,frame='panel'){const c=document.createElement('canvas'),f=atlas.frames[frame].frame;c.width=f.w;c.height=f.h;drawProcedural(c.getContext('2d'),atlas,frame,0,0);return c.toDataURL();}
const skins={about:raster(PACK.atlases.about),experience:raster(PACK.atlases.about),tools:raster(PACK.atlases.tools),projects:raster(PACK.atlases.tools),achievements:raster(PACK.atlases.achievements),contact:raster(PACK.atlases.about)};
const icons={};for(const id of ['tech-stack','medals'])for(const frame of Object.keys(PACK.atlases[id].frames))icons[frame]=raster(PACK.atlases[id],frame);
const original={...PACK.data,about:{...PACK.data.about,photo:PACK.photo}};
let samples=false;
const ui=createGameUI(document.querySelector('#ui'),{data:original,skins,icons,pageSize:12,onRender(host,section){
 if(!['tools','projects','achievements','experience'].includes(section))return;
 const b=document.createElement('button');b.className='demo-toggle';b.type='button';b.textContent=samples?'Restore real items':'Try 36 sample items';
 b.onclick=()=>{samples=!samples;const next={};for(const key of ['tools','projects','achievements','experience'])next[key]=samples?Array.from({length:36},(_,i)=>({...original[key][i%original[key].length],id:key+'-demo-'+i,title:'Sample '+(i+1)+' · '+original[key][i%original[key].length].title,description:'Sample data for checking a larger collection. '+original[key][i%original[key].length].description})):original[key];ui.updateData(next);};
 host.querySelector('.gui-header-actions').prepend(b);
 if(samples){const label=document.createElement('div');label.className='demo-label';label.textContent='Sample data is enabled — these are layout examples.';host.querySelector('.gui-content').prepend(label);}
}});
document.querySelector('#open').onclick=()=>ui.open('tools');ui.open('tools');
</script></html>`;
fs.writeFileSync(root+'/scalable-preview.html',html);fs.writeFileSync(root+'/preview.html',html);
console.log('Scalable preview and editable portfolio-data.json built.');
