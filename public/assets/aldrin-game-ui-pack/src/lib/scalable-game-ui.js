const SECTION_NAMES={about:'About',experience:'Experience',projects:'Projects',achievements:'Achievements',tools:'Tools of the trade',contact:'Contact'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function queryItems(items,query='',category='all',page=0,pageSize=12){
 pageSize=Number.isFinite(pageSize)?Math.max(1,Math.floor(pageSize)):12;
 const term=query.trim().toLocaleLowerCase();
 const filtered=items.filter(i=>(category==='all'||i.category===category)&&(!term||[i.title,i.description,i.category,i.subtitle].filter(Boolean).join(' ').toLocaleLowerCase().includes(term)));
 const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
 const current=Math.min(Math.max(0,page),pages-1);
 return {items:filtered.slice(current*pageSize,(current+1)*pageSize),total:filtered.length,pages,page:current};
}

/** A reusable DOM overlay above a procedural game. Import scalable-game-ui.css too. */
export function createGameUI(host,options={}){
 let data=options.data??{},section='about',page=0,query='',category='all',selected=null,opener=null,opened=false;
 const skins=options.skins??{},icons=options.icons??{},pageSize=Math.max(1,Math.floor(options.pageSize??12));
 const abort=new AbortController(),signal=abort.signal;
 let draft={name:'',email:'',message:''};
 host.classList.add('game-ui');host.hidden=true;
 const items=()=>Array.isArray(data[section])?data[section]:[];
 function restoreFocus(key){const found=[...host.querySelectorAll('[data-item]')].find(el=>el.dataset.item===key);found?.focus();}
 function draw(){
  const source=skins[section]??skins.tools;const light=section==='about'||section==='experience'||section==='contact';
  host.innerHTML=`<div class="gui-shade"></div><section class="gui-window ${light?'gui-paper':''} gui-${section}" role="dialog" aria-modal="true" aria-labelledby="gui-title" tabindex="-1"><header class="gui-header"><div><small>${esc(options.worldName??"Aldrin's world")}</small><h1 id="gui-title">${SECTION_NAMES[section]}</h1></div><div class="gui-header-actions"><button class="gui-close" type="button" data-action="close" aria-label="Return to game">×</button></div></header><div class="gui-content"></div><nav class="gui-nav" aria-label="Portfolio sections">${Object.entries(SECTION_NAMES).map(([id,label])=>`<button type="button" data-section="${id}" aria-current="${id===section?'page':'false'}">${label}</button>`).join('')}</nav></section>`;
  if(source)host.querySelector('.gui-window').style.borderImageSource=`url("${source.replaceAll('"','%22')}")`;
  const content=host.querySelector('.gui-content');
  if(section==='about'){
   const p=data.about??{};content.innerHTML=`<div class="gui-profile">${p.photo?`<div class="gui-photo"><img src="${esc(p.photo)}" alt="${esc(p.name)}"></div>`:''}<article class="gui-biography"><h2>${esc(p.name??'About me')}</h2><p class="gui-subtitle">${esc(p.tagline??'')}</p><p>${esc(p.description??'')}</p><button type="button" data-section="experience">Open my journal</button></article></div>`;
  }else if(section==='contact'){
   content.innerHTML=`<div class="gui-correspondence"><form class="gui-letter"><h2>Leave a message</h2><label>Your name<input name="name" autocomplete="name" required value="${esc(draft.name)}"></label><label>Your email<input name="email" type="email" autocomplete="email" required value="${esc(draft.email)}"></label><label>Your message<textarea name="message" rows="5" required>${esc(draft.message)}</textarea></label><button type="submit">Copy letter</button><p class="gui-status" role="status"></p></form><aside class="gui-contact-card"><span class="gui-envelope" aria-hidden="true">✉</span><h2>To ${esc(data.about?.name??'Aldrin')}</h2><p>A conversation starts here.</p><small>This preview copies your letter. It sends nothing.</small></aside></div>`;
  }else renderCollection(content);
  options.onRender?.(host,section);
 }
 function renderCollection(content){
  const all=items(),cats=[...new Set(all.map(i=>i.category).filter(Boolean))];
  const results=queryItems(all,query,category,page,pageSize);page=results.page;
  if(!results.items.some(i=>String(i.id)===selected))selected=results.items[0]?String(results.items[0].id):null;
  const current=results.items.find(i=>String(i.id)===selected);
  content.innerHTML=`<div class="gui-toolbar"><label class="gui-search"><span>Search ${SECTION_NAMES[section].toLowerCase()}</span><input class="gui-query" type="search" value="${esc(query)}" placeholder="Search by name or description"></label><label class="gui-category"><span>Category</span><select>${['all',...cats].map(c=>`<option value="${esc(c)}" ${c===category?'selected':''}>${esc(c==='all'?'All categories':c)}</option>`).join('')}</select></label><span class="gui-count" aria-live="polite">${results.total} ${results.total===1?'item':'items'}</span></div><div class="gui-collection"><div class="gui-list"><div class="gui-grid ${section==='experience'?'gui-journal-list':''}">${results.items.map(i=>itemHTML(i)).join('')||'<div class="gui-empty"><h2>No items found</h2><p>Try another search or category.</p></div>'}</div></div><aside class="gui-inspector" aria-label="Selected item">${current?detailHTML(current):'<h2>Nothing selected</h2><p>Items you add will appear here.</p>'}</aside></div><footer class="gui-pagination"><button type="button" data-action="previous" ${page===0?'disabled':''}>Previous</button><span>Page ${page+1} of ${results.pages}</span><button type="button" data-action="next" ${page===results.pages-1?'disabled':''}>Next</button></footer>`;
 }
 function itemHTML(i){
  const src=icons[i.icon]??icons[i.id];const isAward=section==='achievements';
  return `<button type="button" class="gui-item ${isAward?'gui-award':''}" data-item="${esc(i.id)}" aria-pressed="${String(i.id)===selected}">${src?`<img class="gui-icon" src="${esc(src)}" alt="">`:`<span class="gui-token" aria-hidden="true">${esc(i.mark??(section==='projects'?'⌘':'◆'))}</span>`}<strong>${esc(i.title)}</strong><small>${esc(i.subtitle??i.category??'')}</small></button>`;
 }
 function detailHTML(i){
  const src=icons[i.icon]??icons[i.id];const url=safeLink(i.url);
  return `${src?`<img class="gui-detail-icon" src="${esc(src)}" alt="">`:''}<small>${esc(i.category??'Selected item')}</small><h2>${esc(i.title)}</h2><p class="gui-subtitle">${esc(i.subtitle??'')}</p><p>${esc(i.description??'')}</p>${i.tags?.length?`<ul class="gui-tags">${i.tags.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}${url?`<a class="gui-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(i.linkLabel??'View details')}</a>`:''}`;
 }
 function safeLink(value){try{if(!value)return null;const u=new URL(value,document.baseURI);return ['http:','https:','mailto:'].includes(u.protocol)?u.href:null;}catch{return null;}}
 function show(next){
  if(!SECTION_NAMES[next])throw new Error(`Unknown section: ${next}`);
  if(!opened){opener=document.activeElement;options.onOpen?.();}
  section=next;page=0;query='';category='all';selected=null;opened=true;host.hidden=false;draw();host.querySelector('.gui-window').focus();
 }
 function close(){if(!opened)return;opened=false;host.hidden=true;options.onClose?.();opener?.focus?.();}
 host.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.section)return show(b.dataset.section);
  if(b.dataset.item){selected=b.dataset.item;renderCollection(host.querySelector('.gui-content'));restoreFocus(selected);return;}
  if(b.dataset.action==='close')return close();
  if(b.dataset.action==='previous'||b.dataset.action==='next'){page+=b.dataset.action==='next'?1:-1;selected=null;renderCollection(host.querySelector('.gui-content'));const replacement=host.querySelector(`[data-action="${b.dataset.action}"]:not(:disabled)`);(replacement??host.querySelector('.gui-list button')??host.querySelector('.gui-window')).focus();}
 },{signal});
 host.addEventListener('input',e=>{
  if(e.target.classList.contains('gui-query')){const pos=e.target.selectionStart;query=e.target.value;page=0;renderCollection(host.querySelector('.gui-content'));const input=host.querySelector('.gui-query');input.focus();try{input.setSelectionRange(pos,pos);}catch{}}
  if(e.target.name in draft)draft[e.target.name]=e.target.value;
 },{signal});
 host.addEventListener('change',e=>{if(e.target.matches('.gui-category select')){category=e.target.value;page=0;selected=null;renderCollection(host.querySelector('.gui-content'));host.querySelector('.gui-category select').focus();}},{signal});
 host.addEventListener('submit',async e=>{
  e.preventDefault();const status=host.querySelector('.gui-status');const text=`To ${data.about?.name??'Aldrin'}\nFrom: ${draft.name} <${draft.email}>\n\n${draft.message}`;
  try{await navigator.clipboard.writeText(text);status.textContent='Letter copied. Nothing has been sent.';}catch{status.textContent='Clipboard unavailable. Select and copy the text in the fields.';}
 },{signal});
 host.addEventListener('keydown',e=>{
  e.stopPropagation();
  if(e.key==='Escape'){e.preventDefault();close();return;}
  if(e.key==='Tab'){
   const nodes=[...host.querySelectorAll('button:not(:disabled),a,input,textarea,select')].filter(el=>el.getClientRects().length);
   const first=nodes[0],last=nodes.at(-1);
   if(e.shiftKey&&(document.activeElement===first||!nodes.includes(document.activeElement))){e.preventDefault();last?.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||!nodes.includes(document.activeElement))){e.preventDefault();first?.focus();}
  }
 },{signal});
 return {open:show,close,updateData(next){data={...data,...next};if(opened){draw();host.querySelector('.gui-window').focus();}},get isOpen(){return opened;},destroy(){close();abort.abort();host.replaceChildren();host.classList.remove('game-ui');}};
}
