// Run: node reference/build-preview.cjs from the extracted package root.
const fs=require('node:fs');
const out='public/assets/ui', data={atlases:{},images:{}};
for(const name of ['about','experience','achievements','tools','contact']){
 data.atlases[name]=JSON.parse(fs.readFileSync(`${out}/${name}.json`));
 data.images[name]='data:image/png;base64,'+fs.readFileSync(`${out}/${name}.png`).toString('base64');
}
data.photo='data:image/png;base64,'+fs.readFileSync(`${out}/aldrin-photo.png`).toString('base64');
data.world='';
const renderer=fs.readFileSync('src/lib/game-ui-atlas.js','utf8').replaceAll('export function','function');
const html=fs.readFileSync('reference/preview-template.html','utf8').replace('/*PACK_DATA*/',JSON.stringify(data)).replace('/*RENDERER*/',renderer);
fs.writeFileSync('preview.html',html);
console.log('Updated preview.html');
