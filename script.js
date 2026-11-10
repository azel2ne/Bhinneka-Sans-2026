'use strict';
// Bhinneka Sans — original, dependency-free kinetic type playground.
// Sections: playground model + rendering · export dialog · editor input · home word wall + static CTA · specimen grid.
const $=id=>document.getElementById(id);
const SETS={a:9,e:10,i:6,o:8,u:5};
const PROVINCES=[{"vowel":"a","set":"ss01","glyph":"a.ss01","province":"Banten","source_glyph":"a.ss03"},{"vowel":"a","set":"ss02","glyph":"a.ss02","province":"East Java","source_glyph":"a.ss02"},{"vowel":"a","set":"ss03","glyph":"a.ss03","province":"West Java","source_glyph":"a.ss01"},{"vowel":"a","set":"ss04","glyph":"a.ss04","province":"Central Java","source_glyph":"a.ss04"},{"vowel":"a","set":"ss05","glyph":"a.ss05","province":"DI Yogyakarta","source_glyph":"a.ss05"},{"vowel":"a","set":"ss06","glyph":"a.ss06","province":"Bali","source_glyph":"a.ss06"},{"vowel":"a","set":"ss07","glyph":"a.ss07","province":"East Nusa Tenggara","source_glyph":"a.ss07"},{"vowel":"a","set":"ss08","glyph":"a.ss08","province":"West Nusa Tenggara","source_glyph":"a.ss08"},{"vowel":"a","set":"ss09","glyph":"a.ss09","province":"DKI Jakarta","source_glyph":"a.ss09"},{"vowel":"e","set":"ss01","glyph":"e.ss01","province":"Aceh","source_glyph":"e.ss05"},{"vowel":"e","set":"ss02","glyph":"e.ss02","province":"North Sumatra","source_glyph":"e.ss03"},{"vowel":"e","set":"ss03","glyph":"e.ss03","province":"West Sumatra","source_glyph":"e.ss02"},{"vowel":"e","set":"ss04","glyph":"e.ss04","province":"Riau","source_glyph":"e.ss06"},{"vowel":"e","set":"ss05","glyph":"e.ss05","province":"Riau Islands","source_glyph":"e.ss04"},{"vowel":"e","set":"ss06","glyph":"e.ss06","province":"South Sumatra","source_glyph":"e.ss08"},{"vowel":"e","set":"ss07","glyph":"e.ss07","province":"Jambi","source_glyph":"e.ss07"},{"vowel":"e","set":"ss08","glyph":"e.ss08","province":"Bengkulu","source_glyph":"e.ss09"},{"vowel":"e","set":"ss09","glyph":"e.ss09","province":"Bangka Belitung","source_glyph":"e.ss10"},{"vowel":"e","set":"ss10","glyph":"e.ss10","province":"Lampung","source_glyph":"e.ss01"},{"vowel":"i","set":"ss01","glyph":"i.ss01","province":"South Sulawesi","source_glyph":"i.ss01"},{"vowel":"i","set":"ss02","glyph":"i.ss02","province":"West Sulawesi","source_glyph":"i.ss02"},{"vowel":"i","set":"ss03","glyph":"i.ss03","province":"Southeast Sulawesi","source_glyph":"i.ss04"},{"vowel":"i","set":"ss04","glyph":"i.ss04","province":"North Sulawesi","source_glyph":"i.ss03"},{"vowel":"i","set":"ss05","glyph":"i.ss05","province":"Central Sulawesi","source_glyph":"i.ss05"},{"vowel":"i","set":"ss06","glyph":"i.ss06","province":"Gorontalo","source_glyph":"i.ss06"},{"vowel":"o","set":"ss01","glyph":"o.ss01","province":"Papua","source_glyph":"o.ss01"},{"vowel":"o","set":"ss02","glyph":"o.ss02","province":"Central Papua","source_glyph":"o.ss05"},{"vowel":"o","set":"ss03","glyph":"o.ss03","province":"South Papua","source_glyph":"o.ss06"},{"vowel":"o","set":"ss04","glyph":"o.ss04","province":"West Papua","source_glyph":"o.ss02"},{"vowel":"o","set":"ss05","glyph":"o.ss05","province":"Maluku","source_glyph":"o.ss07"},{"vowel":"o","set":"ss06","glyph":"o.ss06","province":"North Maluku","source_glyph":"o.ss08"},{"vowel":"o","set":"ss07","glyph":"o.ss07","province":"Southwest Papua","source_glyph":"o.ss03"},{"vowel":"o","set":"ss08","glyph":"o.ss08","province":"Highland Papua","source_glyph":"o.ss04"},{"vowel":"u","set":"ss01","glyph":"u.ss01","province":"South Kalimantan","source_glyph":"u.ss01"},{"vowel":"u","set":"ss02","glyph":"u.ss02","province":"East Kalimantan","source_glyph":"u.ss02"},{"vowel":"u","set":"ss03","glyph":"u.ss03","province":"North Kalimantan","source_glyph":"u.ss03"},{"vowel":"u","set":"ss04","glyph":"u.ss04","province":"West Kalimantan","source_glyph":"u.ss04"},{"vowel":"u","set":"ss05","glyph":"u.ss05","province":"Central Kalimantan","source_glyph":"u.ss05"}];
const PROVINCE_BY_GLYPH=Object.fromEntries(PROVINCES.map(item=>[item.glyph,item.province]));

const WORDS=['keanekaragaman','nusantara','suasana','keindahan','Indonesia','beraneka','kebudayaan','persatuan','samudera','keluarga','keajaiban','bahasa','warisan','pesisir','sejuta','pulau','cerita','bhinneka','kemanusiaan','keberagaman','kehidupan','perayaan','merdeka','kebersamaan','aneka warna','sejahtera','maharaja','kepulauan','kemerdekaan','perjalanan'];
const editor=$('editor'),studio=$('studio'),screen=$('screensaver');
// After 2 seconds of no typing, unchosen vowels start their live preview.
const TYPING_PAUSE_MS=2000, VOWEL_CHANGE_MS=1100;
// Exhibition-screen sizing only: ordinary desktops retain the exact 240px default.
const IMAC_DISPLAY_QUERY='(min-width: 1400px) and (min-height: 780px)';
const isImacDisplay=()=>document.documentElement.classList.contains('imac-mode') && window.matchMedia(IMAC_DISPLAY_QUERY).matches;
let manuallyAdjustedTypeSize=false;
let chars=[],variants=[],locked=[],fontSize=isImacDisplay()?396:240,letterSpacing=-0.035,isDark=false,lastActivity=Date.now(),glyphPromise=null;
function syncExhibitionTypeSize(){
  if(manuallyAdjustedTypeSize)return;
  const target=isImacDisplay()?396:240;
  if(fontSize!==target){fontSize=target;if(!studio.hidden)render(getCaretOffset());}
}
let previewEnabled=true,previewActive=false,hoveredIndex=null,typingTimer=null,lastTypeAt=0,displaySize=240;
let tooltipHover=false,tooltipHideTimer=null;
const randomSet=ch=>SETS[ch.toLowerCase()]?Math.floor(Math.random()*(SETS[ch.toLowerCase()]+1)):0;
const feature=n=>n?`'ss${String(n).padStart(2,'0')}' 1`:'normal';
function markActivity(){lastActivity=Date.now()}
function status(s){$('status').textContent=s}
function syncVisibility(){$('counter').textContent=`${chars.length} CHARACTER${chars.length===1?'':'S'}`;$('editorHint').hidden=chars.length>0}
function text(){return chars.join('')}
function getCaretOffset(){const selection=getSelection();if(!selection||!selection.rangeCount||!editor.contains(selection.anchorNode))return chars.length;const range=selection.getRangeAt(0).cloneRange();range.selectNodeContents(editor);range.setEnd(selection.anchorNode,selection.anchorOffset);return range.toString().length}
function caretAt(offset){const selection=getSelection();if(!selection)return;const range=document.createRange();const walker=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT);let node,remaining=Math.max(0,Math.min(offset,chars.length));while((node=walker.nextNode())){if(remaining<=node.textContent.length){range.setStart(node,remaining);range.collapse(true);selection.removeAllRanges();selection.addRange(range);return}remaining-=node.textContent.length}range.selectNodeContents(editor);range.collapse(false);selection.removeAllRanges();selection.addRange(range)}
function glyphLabel(i){const ch=chars[i]?.toLowerCase(),set=variants[i]||0;return `${ch}.${set?`ss${String(set).padStart(2,'0')}`:'base'}`}
function updateLetter(i){
  const el=editor.querySelector(`.letter[data-index="${i}"]`); if(!el)return;
  el.style.fontFeatureSettings=feature(variants[i]||0);
  // Highlight unselected vowels as soon as they're typed, not after the preview delay.
  const pending=!!SETS[chars[i]?.toLowerCase()]&&!locked[i];
  el.classList.toggle('pending',pending);
  el.classList.toggle('chosen',!!locked[i]);
  if(SETS[chars[i]?.toLowerCase()])el.dataset.label=glyphLabel(i);if(hoveredIndex===i)showTooltip(i);
}
function showTooltip(i){
 const el=editor.querySelector(`.letter[data-index="${i}"]`),tip=$('glyphTooltip'),stage=editor.parentElement;
 if(!el||!SETS[chars[i]?.toLowerCase()]||!tip)return;
 clearTimeout(tooltipHideTimer);
 const r=el.getBoundingClientRect(),sr=stage.getBoundingClientRect();
 const glyph=glyphLabel(i),vowel=chars[i].toLowerCase(),variant=variants[i]||0,total=SETS[vowel];
 const province=PROVINCE_BY_GLYPH[glyph];
 tip.replaceChildren();
 const glyphLine=document.createElement('span');glyphLine.className='tooltip-glyph';
 glyphLine.textContent=`${glyph}  ·  ${String(variant).padStart(2,'0')}/${String(total).padStart(2,'0')}`;
 tip.appendChild(glyphLine);
 if(province){
   const provinceLink=document.createElement('button');
   provinceLink.type='button';provinceLink.className='tooltip-province';
   provinceLink.textContent=province;
   provinceLink.setAttribute('aria-label',`Discover ${province}, ${glyph}`);
   provinceLink.dataset.glyph=glyph;
   provinceLink.addEventListener('click',event=>{
     event.preventDefault();event.stopPropagation();
     if(typeof window.BHINNEKA_OPEN_LETTERFORM==='function'){
       window.BHINNEKA_OPEN_LETTERFORM(glyph);
       resetTooltipHover();
     }
   });
   tip.appendChild(provinceLink);
 } else {
   const baseLine=document.createElement('span');
   baseLine.className='tooltip-province-static';baseLine.textContent='Plus Jakarta Sans base';
   tip.appendChild(baseLine);
 }
 tip.hidden=false;
 // Keep the label over the glyph without letting it run off the viewport edge.
 const rawLeft=r.left-sr.left+r.width/2;
 tip.style.left=`${Math.min(Math.max(rawLeft,80),Math.max(80,sr.width-80))}px`;
 tip.style.top=`${Math.max(9,r.top-sr.top+50)}px`;
}
function hideTooltip(){clearTimeout(tooltipHideTimer);if($('glyphTooltip'))$('glyphTooltip').hidden=true}
function resetTooltipHover(){
 clearTimeout(tooltipHideTimer);tooltipHover=false;hoveredIndex=null;
 setVowelPicking(false);hideTooltip();
 editor.querySelectorAll('.letter.hovering').forEach(el=>el.classList.remove('hovering'));
}
function hideTooltipSoon(){
 clearTimeout(tooltipHideTimer);
 tooltipHideTimer=setTimeout(()=>{if(!tooltipHover)resetTooltipHover()},180);
}
function setVowelPicking(active){editor.classList.toggle('picking-vowel',active)}
// Fit the text within the available studio area, without changing the user's chosen size.
// Recalculate on text edits, Enter, resizing, and manual font-size changes.
function fitText(){
  const stage=editor.parentElement;
  if(!stage||stage.clientWidth<1||stage.clientHeight<1)return;
  editor.style.maxHeight='none';
  editor.style.overflow='visible';
  const maxHeight=Math.max(55,stage.clientHeight-12);
  const fits=size=>{
    editor.style.fontSize=`${size}px`;
    return editor.scrollHeight<=maxHeight+1 && editor.scrollWidth<=editor.clientWidth+2;
  };
  let low=32,high=fontSize;
  if(fits(high))displaySize=high;
  else{
    for(let i=0;i<10&&high-low>1;i++){
      const mid=Math.floor((low+high)/2);
      if(fits(mid))low=mid;else high=mid;
    }
    displaySize=low;
  }
  editor.style.fontSize=`${displaySize}px`;
  $('sizeValue').textContent=displaySize===fontSize?String(fontSize):`${displaySize} AUTO`;
}
// After a live-preview or lock changes glyph widths, shrink again only if the
// text no longer fits. (Never grow here, so the size doesn't jitter every cycle.)
function refitIfOverflowing(){
  const stage=editor.parentElement;
  if(!stage||studio.hidden)return;
  const maxHeight=Math.max(55,stage.clientHeight-12);
  if(editor.scrollHeight>maxHeight+1||editor.scrollWidth>editor.clientWidth+2)fitText();
}
function render(caret=null){
  const fragment=document.createDocumentFragment();
  chars.forEach((ch,i)=>{const span=document.createElement('span');span.className='letter'+(SETS[ch.toLowerCase()]?' vowel':'');span.textContent=ch;span.dataset.index=i;fragment.appendChild(span)});
  hideTooltip();hoveredIndex=null;setVowelPicking(false);editor.replaceChildren(fragment);editor.style.fontSize=`${fontSize}px`;editor.style.letterSpacing=`${letterSpacing}em`;
  $('sizeValue').textContent=fontSize;$('spacingValue').textContent=`${letterSpacing>=0?'+':''}${(letterSpacing*100).toFixed(1)}%`;
  chars.forEach((ch,i)=>updateLetter(i));syncVisibility();fitText();if(caret!==null)caretAt(caret);
}
function schedulePreview(){
  clearTimeout(typingTimer);previewActive=false;lastTypeAt=Date.now();
  chars.forEach((ch,i)=>{if(SETS[ch.toLowerCase()]&&!locked[i]){variants[i]=0;updateLetter(i)}});
  typingTimer=setTimeout(()=>{
    if(studio.hidden||!previewEnabled)return;
    previewActive=true;
    chars.forEach((ch,i)=>{if(SETS[ch.toLowerCase()]&&!locked[i])updateLetter(i)});
    if(hoveredIndex===null)animatePending();
    status('UNSELECTED VOWELS ARE LIVE PREVIEWS. HOVER FOR THEIR SET; CLICK TO KEEP ONE.');
  },TYPING_PAUSE_MS);
}
function animatePending(){
  if(!previewEnabled||!previewActive||hoveredIndex!==null||studio.hidden)return;
  chars.forEach((ch,i)=>{
    const max=SETS[ch.toLowerCase()];if(!max||locked[i])return;
    let next=1+Math.floor(Math.random()*max);
    if(next===variants[i])next=next%max+1;
    variants[i]=next;updateLetter(i);
  });
  refitIfOverflowing();
}
function setText(s){chars=[...s.slice(0,500)];variants=chars.map(()=>0);locked=chars.map(()=>false);render(chars.length);schedulePreview();status('TYPE FIRST. VOWELS WILL WAKE UP AFTER A 2-SECOND PAUSE.')}
function cycle(index){
  const ch=chars[index]?.toLowerCase();if(!SETS[ch])return;
  if(!locked[index]){locked[index]=true;} // First click keeps the visible live-preview form.
  else variants[index]=((variants[index]||0)+1)%(SETS[ch]+1); // Next clicks explore more sets.
  updateLetter(index);refitIfOverflowing();status(`${ch.toUpperCase()} / ${variants[index]?'SS'+String(variants[index]).padStart(2,'0'):'BASE'} LOCKED. CLICK AGAIN TO CHANGE.`);markActivity();
}
function shuffle(){
  chars.forEach((ch,i)=>{const max=SETS[ch.toLowerCase()];if(max){variants[i]=1+Math.floor(Math.random()*max);locked[i]=true;updateLetter(i)}});
  previewActive=true;refitIfOverflowing();status('ALL VOWELS HAVE BEEN CHOSEN. CLICK ANY ONE TO CHANGE IT.');markActivity();
}
// RESET restores every vowel (including manually selected or shuffled vowels)
// to the live red animation without changing the typed text or consonants.
function resetVowels(){
  clearTimeout(typingTimer);
  previewEnabled=true;
  previewActive=true;
  hoveredIndex=null;
  hideTooltip();
  setVowelPicking(false);
  editor.querySelectorAll('.letter.hovering').forEach(el=>el.classList.remove('hovering'));
  let count=0;
  chars.forEach((ch,i)=>{
    if(!SETS[ch.toLowerCase()])return;
    count++;
    locked[i]=false;
    variants[i]=0;
    updateLetter(i);
  });
  if(count){
    animatePending();
    status('ALL VOWELS RESET. RED LETTERFORMS ARE ANIMATING AGAIN.');
  } else status('TYPE A VOWEL (A E I O U) TO SEE THE RED ANIMATION.');
  markActivity();
}
function enter(){syncExhibitionTypeSize();screen.hidden=true;studio.hidden=false;document.body.style.overflow='auto';window.scrollTo(0,0);markActivity();if(chars.length&&previewEnabled)schedulePreview();requestAnimationFrame(()=>{fitText();editor.focus();caretAt(chars.length)})}
function screensaver(){studio.hidden=true;screen.hidden=false;document.body.style.overflow='hidden';clearTimeout(typingTimer);previewActive=false;startHomeSequence()}

// A browser-safe export: use pre-extracted TRUE font paths, not SVG foreignObject.
// Each span's on-screen position is preserved and every stylistic set has its own path.
function glyphData(){return glyphPromise||(glyphPromise=Promise.resolve(window.BHINNEKA_GLYPHS).then(data=>{if(!data)throw new Error('Glyph data missing. Keep glyphs-data.js in the same folder.');return data}))}
async function makeSvg(){await document.fonts.load(`${displaySize}px Bhinneka`);await document.fonts.ready;const atlas=await glyphData();const base=$('canvas');const r=base.getBoundingClientRect();const width=Math.max(400,Math.round(r.width)),height=Math.max(300,Math.round(r.height));const scale=displaySize/atlas.unitsPerEm;const ink=isDark?'#fff':'#000',paper=isDark?'#000':'#fff',pendingInk='#FF0000',dimInk='#6B6B6B';let paths='';const spans=[...editor.querySelectorAll('.letter')];for(let i=0;i<spans.length;i++){const ch=chars[i];if(ch==='\n'||ch==='\r'||ch==='\t'||ch===' ')continue;const mapping=atlas.substitutions[ch];if(!mapping)continue;const glyphName=mapping[String(variants[i]||0)]||mapping['0'];const data=atlas.glyphs[glyphName];if(!data||!data.d)continue;const rect=spans[i].getBoundingClientRect();const x=rect.left-r.left;const top=rect.top-r.top;
// Browser inline box starts at the font's ascent; measure actual browser font metrics.
const measure=document.createElement('canvas').getContext('2d');measure.font=`${displaySize}px Bhinneka`;const metrics=measure.measureText('Hg');const baseline=top+(metrics.fontBoundingBoxAscent||displaySize*atlas.ascender/atlas.unitsPerEm);
paths+=`<path fill="${hoveredIndex!==null&&hoveredIndex!==i&&!locked[i]?dimInk:SETS[ch.toLowerCase()]&&!locked[i]&&hoveredIndex!==i?pendingInk:ink}" d="${data.d}" transform="translate(${x.toFixed(3)} ${baseline.toFixed(3)}) scale(${scale.toFixed(6)} ${(-scale).toFixed(6)})"/>`}
return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>Bhinneka Sans composition</title><rect width="100%" height="100%" fill="${paper}"/><g>${paths}</g></svg>`}

function download(blob,filename){
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download=filename;link.style.display='none';
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}
// An exported file is prepared once and retained while the dialog is open.
// Browser security does not allow direct control of Mail/AirDrop targets.
let preparedExport=null,preparedPreviewUrl=null,exportReturnFocus=null;
function exportHelp(message){$('exportHelp').textContent=message}
function canSharePreparedFile(){
  if(!preparedExport||!navigator.share||!navigator.canShare)return false;
  try{return navigator.canShare({files:[preparedExport]})}catch(_){return false}
}
function closeExportDialog(){
  $('exportDialog').hidden=true;
  document.body.classList.remove('export-open');
  if(preparedPreviewUrl){URL.revokeObjectURL(preparedPreviewUrl);preparedPreviewUrl=null}
  $('exportPreview').removeAttribute('src');
  preparedExport=null;
  exportReturnFocus?.focus();
}
function openExportDialog(file){
  if(!file)return;
  preparedExport=file;
  exportReturnFocus=document.activeElement;
  if(preparedPreviewUrl)URL.revokeObjectURL(preparedPreviewUrl);
  preparedPreviewUrl=URL.createObjectURL(file);
  $('exportPreview').src=preparedPreviewUrl;
  $('exportFileName').textContent=file.name;
  $('exportFileSize').textContent=`${(file.size/1024).toFixed(0)} KB · ${file.name.split('.').pop().toUpperCase()}`;
  $('exportDialog').hidden=false;
  document.body.classList.add('export-open');
  const available=canSharePreparedFile();
  $('exportEmail').disabled=!available;
  $('exportAirdrop').disabled=!available;
  exportHelp(available
    ? 'Choose Mail or AirDrop in the device sharing menu. Available destinations depend on this computer and browser.'
    : 'File sharing is not supported here. Download the file and attach it to an email or send it with AirDrop from Finder. For native sharing, try Safari on HTTPS.');
  $('exportDownload').focus();
}
async function prepareExport(format){
  const button=$(format==='png'?'savePng':'saveSvg');
  if(button.disabled)return;
  button.disabled=true;
  try{
    status(`PREPARING ${format.toUpperCase()}…`);
    const svg=await makeSvg();
    if(format==='svg'){
      openExportDialog(new File([svg],'BhinnekaSans.svg',{type:'image/svg+xml'}));
    }else{
      const svgBlob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
      const svgUrl=URL.createObjectURL(svgBlob);
      try{
        const image=new Image();
        await new Promise((resolve,reject)=>{
          image.onload=resolve;
          image.onerror=()=>reject(new Error('Could not render SVG'));
          image.src=svgUrl;
        });
        const canvas=document.createElement('canvas');
        canvas.width=image.naturalWidth*2;canvas.height=image.naturalHeight*2;
        const ctx=canvas.getContext('2d');
        if(!ctx)throw new Error('Canvas is unavailable');
        ctx.scale(2,2);ctx.drawImage(image,0,0);
        const png=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Browser could not create PNG')),'image/png'));
        openExportDialog(new File([png],'BhinnekaSans.png',{type:'image/png'}));
      }finally{URL.revokeObjectURL(svgUrl)}
    }
    status(`${format.toUpperCase()} READY TO SAVE OR SHARE.`);
  }catch(error){
    console.error(error);
    status(`${format.toUpperCase()} ERROR: ${error.message}`);
  }finally{button.disabled=false}
}
function saveSvg(){return prepareExport('svg')}
function savePng(){return prepareExport('png')}
async function nativeShare(target){
  // Must be called directly from a click event; no awaiting before share().
  if(!preparedExport||!canSharePreparedFile()){
    exportHelp('Sharing is unavailable in this browser. Select DOWNLOAD and send your file using Mail or AirDrop yourself.');
    return;
  }
  try{
    await navigator.share({files:[preparedExport],title:'Bhinneka Sans composition'});
    exportHelp('Your device share menu has finished. The selected app controls whether the file was actually delivered.');
  }catch(error){
    if(error.name==='AbortError'){
      exportHelp('Sharing was canceled. You can try again or download the file.');
    }else{
      exportHelp(`Could not open the device sharing menu (${error.message}). Download the file instead.`);
    }
  }
}
$('exportEmail').addEventListener('click',()=>nativeShare('email'));
$('exportAirdrop').addEventListener('click',()=>nativeShare('airdrop'));
$('exportDownload').addEventListener('click',()=>{
  if(!preparedExport)return;
  download(preparedExport,preparedExport.name);
  exportHelp('Download started. You can now attach the file to an email or send it using AirDrop.');
  status('DOWNLOAD STARTED.');
});
$('exportClose').addEventListener('click',closeExportDialog);
$('exportDialog').addEventListener('pointerdown',event=>{
  if(event.target===$('exportDialog'))closeExportDialog();
});
window.addEventListener('keydown',event=>{
  if($('exportDialog').hidden)return;
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeExportDialog()}
  if(event.key==='Tab'){
    const controls=['exportClose','exportEmail','exportAirdrop','exportDownload'].map($).filter(el=>!el.disabled);
    const position=controls.indexOf(document.activeElement);
    if(event.shiftKey && position===0){event.preventDefault();controls.at(-1).focus()}
    else if(!event.shiftKey&&position===controls.length-1){event.preventDefault();controls[0].focus()}
  }
},true);
// Edit directly in the large canvas; restore caret after individual glyph spans rebuild.
// Store explicit newline characters in the model. Browsers otherwise insert
// inconsistent <div>/<br> elements into contenteditable on Enter.
function applyInput(raw,pos){
  const next=[...raw.replace(/\r/g,'').slice(0,500)],oldVariants=variants.slice(),oldLocked=locked.slice();
  let prefix=0;while(prefix<chars.length&&prefix<next.length&&chars[prefix]===next[prefix])prefix++;
  let suffix=0;while(suffix<chars.length-prefix&&suffix<next.length-prefix&&chars[chars.length-1-suffix]===next[next.length-1-suffix])suffix++;
  const oldLength=chars.length;
  variants=next.map((ch,i)=>i<prefix?oldVariants[i]:i>=next.length-suffix?oldVariants[oldLength-(next.length-i)]:0);
  locked=next.map((ch,i)=>i<prefix?oldLocked[i]:i>=next.length-suffix?oldLocked[oldLength-(next.length-i)]:false);
  chars=next;previewActive=false;render(Math.min(pos,chars.length));schedulePreview();
  status('TYPING… VOWELS START IN THEIR ORIGINAL FORM.');markActivity();
}
function selectionOffsets(){
  const selection=getSelection();
  if(!selection||!selection.rangeCount||!editor.contains(selection.anchorNode))return [chars.length,chars.length];
  const range=selection.getRangeAt(0);
  const offsetAt=(node,offset)=>{
    const probe=document.createRange();probe.selectNodeContents(editor);
    probe.setEnd(node,offset);return probe.toString().length;
  };
  return [offsetAt(range.startContainer,range.startOffset),offsetAt(range.endContainer,range.endOffset)];
}
function replaceSelection(value,backward=false,forward=false){
  let [start,end]=selectionOffsets();
  if(backward&&start===end)start=Math.max(0,start-1);
  if(forward&&start===end)end=Math.min(chars.length,end+1);
  const next=chars.slice(0,start).join('')+value+chars.slice(end).join('');
  applyInput(next,start+[...value].length);
}
function insertAtCaret(value){replaceSelection(value)}
editor.addEventListener('beforeinput',e=>{
  if(e.inputType==='insertText'||e.inputType==='insertParagraph'||e.inputType==='insertLineBreak'||e.inputType==='deleteContentBackward'||e.inputType==='deleteContentForward'){
    e.preventDefault();
    if(e.inputType==='insertParagraph'||e.inputType==='insertLineBreak')replaceSelection('\n');
    else if(e.inputType==='deleteContentBackward')replaceSelection('',true,false);
    else if(e.inputType==='deleteContentForward')replaceSelection('',false,true);
    else replaceSelection(e.data||'');
  }
});
editor.addEventListener('input',()=>{
  const pos=getCaretOffset();
  // Native typing creates spans or text nodes; preserve literal newline characters.
  const raw=editor.textContent;
  applyInput(raw,pos);
});
editor.addEventListener('pointerover',e=>{
  const el=e.target.closest?.('.letter.vowel');if(!el||!editor.contains(el))return;
  tooltipHover=false;clearTimeout(tooltipHideTimer);
  hoveredIndex=Number(el.dataset.index);setVowelPicking(true);el.classList.add('hovering');showTooltip(hoveredIndex);
});
editor.addEventListener('pointerout',e=>{
  const el=e.target.closest?.('.letter.vowel');if(!el)return;
  if(e.relatedTarget&&el.contains(e.relatedTarget))return;
  const next=e.relatedTarget?.closest?.('.letter.vowel');
  if(next&&editor.contains(next)){
    el.classList.remove('hovering');hoveredIndex=Number(next.dataset.index);
    setVowelPicking(true);next.classList.add('hovering');showTooltip(hoveredIndex);
  } else if(e.relatedTarget&&$('glyphTooltip').contains(e.relatedTarget)){
    tooltipHover=true;clearTimeout(tooltipHideTimer);
  } else hideTooltipSoon();
});
editor.addEventListener('pointerleave',e=>{
  if(e.relatedTarget&&$('glyphTooltip').contains(e.relatedTarget))return;
  hideTooltipSoon();
});
$('glyphTooltip').addEventListener('pointerenter',()=>{tooltipHover=true;clearTimeout(tooltipHideTimer)});
$('glyphTooltip').addEventListener('pointerleave',e=>{
  tooltipHover=false;
  const next=e.relatedTarget?.closest?.('.letter.vowel');
  if(next&&editor.contains(next))return;
  hideTooltipSoon();
});
editor.addEventListener('pointerdown',e=>{if(e.target.closest?.('.letter.vowel'))e.preventDefault()});
editor.addEventListener('click',e=>{const el=e.target.closest?.('.letter.vowel');if(el)cycle(Number(el.dataset.index))});
editor.addEventListener('paste',e=>{e.preventDefault();const content=(e.clipboardData||window.clipboardData).getData('text/plain');insertAtCaret(content)});

$('startButton').addEventListener('click',enter);
$('studioHome').addEventListener('click', screensaver);


$('sampleButton').addEventListener('click',()=>{setText(WORDS[Math.floor(Math.random()*WORDS.length)]);editor.focus()});$('clearButton').addEventListener('click',()=>{chars=[];variants=[];locked=[];hoveredIndex=null;clearTimeout(typingTimer);previewActive=false;render(0);editor.focus();status('START TYPING.')});$('shuffleButton').addEventListener('click',shuffle);$('resetButton').addEventListener('click',resetVowels);
$('smallerButton').addEventListener('click',()=>{manuallyAdjustedTypeSize=true;fontSize=Math.max(32,fontSize-16);render(getCaretOffset());markActivity()});$('largerButton').addEventListener('click',()=>{manuallyAdjustedTypeSize=true;fontSize=Math.min(isImacDisplay()?460:300,fontSize+16);render(getCaretOffset());markActivity()});
$('tighterButton').addEventListener('click',()=>{letterSpacing=Math.max(-.15,Math.round((letterSpacing-.01)*1000)/1000);render(getCaretOffset());markActivity()});$('looserButton').addEventListener('click',()=>{letterSpacing=Math.min(.25,Math.round((letterSpacing+.01)*1000)/1000);render(getCaretOffset());markActivity()});
$('invertButton').addEventListener('click',()=>{isDark=!isDark;studio.classList.toggle('invert',isDark);markActivity()});
$('saveSvg').addEventListener('click',saveSvg);$('savePng').addEventListener('click',savePng);

// A physical keyboard can enter the typewriter directly from Home.
// Printable keys carry their first character into the editor, so typing
// immediately after the home animation never loses the first keystroke.
window.addEventListener('keydown',e=>{
  if(!studio.hidden&&e.key==='Escape'){editor.blur();return}
  if(screen.hidden||e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey)return;
  // Preserve native keyboard activation of the centered CTA (Tab + Enter/Space).
  if(document.activeElement===$('startButton')&&(e.key==='Enter'||e.key===' '))return;
  const printable=e.key.length===1&&!e.isComposing;
  const opensEditor=['Enter','Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key);
  const compositionStart=e.isComposing||e.key==='Process'||e.key==='Dead';
  // Ignore Tab, modifier-only keys, Escape and browser/system shortcuts.
  if(!printable&&!opensEditor&&!compositionStart)return;
  if(!compositionStart)e.preventDefault();
  // A keyboard-initiated session starts with a fresh composition.
  chars=[];variants=[];locked=[];hoveredIndex=null;previewActive=false;
  render(0);
  enter();
  if(printable)applyInput(e.key,1);
  editor.focus();
});
// Exhibition inactivity: return to the animated home after 90 seconds without
// REAL visitor input, whether the visitor is in Typewriter, Discover, or Export.
// Pointer movement matters on a desktop/iMac: merely moving the mouse is activity.
const IDLE_RETURN_MS = 90 * 1000;
const activeSections = () => !studio.hidden || !$('discover').hidden;
['pointermove','pointerdown','keydown','wheel','touchstart','scroll'].forEach(type =>
  window.addEventListener(type, markActivity, {passive:true, capture:true}));
function checkIdleReturn(){
  if(!activeSections() || Date.now()-lastActivity < IDLE_RETURN_MS) return;
  // Close any overlay, including export, so Home becomes usable immediately.
  if(!$('exportDialog').hidden) closeExportDialog();
  const discover = $('discover');
  if(discover) discover.hidden = true;
  if(document.activeElement instanceof HTMLElement) document.activeElement.blur();
  screensaver();
}
setInterval(checkIdleReturn, 1000);
// Browser timers may be throttled when a tab is hidden; re-check on return.
document.addEventListener('visibilitychange', () => {
  if(!document.hidden) checkIdleReturn();
});

function createSpecimen(){
 const alternates=$('alternateGrid'),base=$('baseGrid');
 for(const item of PROVINCES){
   const {vowel,province,glyph,set}=item;
   const n=Number(set.slice(2));
   const cell=document.createElement('button');cell.type='button';cell.className='glyph-cell province-cell';
   cell.setAttribute('aria-label',`${province}, ${glyph}. Open in Discover X-ray viewer.`);
   const sample=document.createElement('span');sample.className='glyph-sample';sample.textContent=vowel;sample.style.fontFeatureSettings=feature(n);
   const meta=document.createElement('span');meta.className='glyph-meta';
   const provinceName=document.createElement('span');provinceName.className='province-name';provinceName.textContent=province;
   const glyphName=document.createElement('span');glyphName.className='glyph-name';glyphName.textContent=glyph;
   meta.append(provinceName,glyphName);
   cell.append(sample,meta);
   cell.addEventListener('click',()=>{
     // The same code identifies the province in Discover's bilingual 38-entry atlas.
     if(typeof window.BHINNEKA_OPEN_LETTERFORM === 'function'){
       window.BHINNEKA_OPEN_LETTERFORM(glyph);
     }
   });
   alternates.appendChild(cell);
 }
 const groups=['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz','0123456789','!?.,:;@#$%&*+-=/()[]'];
 for(const group of groups){for(const ch of group){
   const cell=document.createElement('div');cell.className='glyph-cell';
   const sample=document.createElement('span');sample.className='glyph-sample';sample.textContent=ch;
   const meta=document.createElement('span');meta.className='glyph-meta';meta.textContent=`U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`;
   cell.append(sample,meta);base.appendChild(cell);
 }}
}
window.addEventListener('resize',()=>{syncExhibitionTypeSize();if(!studio.hidden)fitText();else layoutHome()});
document.fonts.ready.then(()=>{if(!studio.hidden)fitText()});
$('backToTop').addEventListener('click',()=>{document.getElementById('discoverMain').scrollIntoView({behavior:'smooth',block:'start'})});


/* V3 — Responsive three-row word wall, keeping V1's playful jump animation.
 * 8 letters on desktop, reducing gracefully to 4 on phones.
 * Every 5 seconds: vowel variants jump. Every 60 seconds: ALL letters jump
 * while the full words change in place, without fading or blurring.
 */
const HOME_WORD_BANK = {
  8: ['anugerah','serenada','memesona','samudera','sukacita','akuarela','akuarium','aerobika','berirama','adikuasa'],
  7: ['bahagia','pelangi','seirama','suasana','mutiara','beranda','samudra','selaras'],
  6: ['cahaya','nuansa','serasi','selalu','bahari','sejati','melodi','istana'],
  5: ['ceria','indah','damai','sejuk','suara','dunia','udara','aroma','irama'],
  4: ['rasa','awan','aura','laut','riuh','usia','seni','emas','pagi','asri']
};
// Rows increase as columns shrink, filling tall/narrow screens.
// On exhibition-size displays fill the canvas with five or six rows.
// Laptops retain the existing three-row composition.
const HOME_ROWS_BY_COLUMNS={8:3,7:4,6:5,5:6,4:7};
function homeRowCount(){
  if(homeColumns===8){
    if(isImacDisplay() && window.innerWidth>=1900 && window.innerHeight>=960)return 6;
    if(isImacDisplay() && window.innerWidth>=1450 && window.innerHeight>=780)return 5;
    return 3;
  }
  return HOME_ROWS_BY_COLUMNS[homeColumns]||3;
}
const HOME_VOWEL_CYCLE_MS=5000;
const HOME_WORD_SWAP_MS=60000;
const HOME_JUMP_MS=780;
let homeCells=[];
let homeColumns=8;
let homeRenderedRows=0;
let homeWords=[];
let homeIntervals=[];
let homeTimeouts=[];
let homeBusy=false;
let homeAnimationEpoch=0;

function homeColumnCount(){
  const width=window.innerWidth;
  if(width<560) return 4;
  if(width<750) return 5;
  if(width<950) return 6;
  if(width<1100) return 7;
  return 8;
}
function clearHomeTimers(){
  homeIntervals.forEach(clearInterval);
  homeTimeouts.forEach(clearTimeout);
  homeIntervals=[];
  homeTimeouts=[];
  homeAnimationEpoch++;
  homeBusy=false;
}
function rememberHomeTimeout(id){homeTimeouts.push(id);return id;}
function randomWordPool(exclude=[]){
  const choices=[...(HOME_WORD_BANK[homeColumns]||HOME_WORD_BANK[8])];
  for(let i=choices.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [choices[i],choices[j]]=[choices[j],choices[i]];
  }
  const picked=[];
  for(let i=0;i<homeRowCount();i++){
    const previous=exclude[i];
    const preferred=choices.find(w=>w!==previous&&!picked.includes(w));
    const chosen=preferred||choices.find(w=>!picked.includes(w))||choices[0];
    picked.push(chosen);
  }
  return picked;
}
function randomVariantFor(ch,current=0){
  const max=SETS[ch.toLowerCase()]||0;
  if(!max)return 0;
  let next=1+Math.floor(Math.random()*max);
  if(max>1&&next===current)next=next%max+1;
  return next;
}
function applyHomeVariant(item){
  item.span.style.fontFeatureSettings=item.isVowel?feature(item.variant):'normal';
}
function setHomeLetter(item,ch){
  item.char=ch;
  item.isVowel=!!SETS[ch];
  item.variant=item.isVowel?randomVariantFor(ch,item.variant):0;
  item.span.textContent=ch;
  item.cell.classList.toggle('vowel',item.isVowel);
  item.cell.classList.toggle('consonant',!item.isVowel);
  applyHomeVariant(item);
}
function buildHomeBoard(words){
  const board=$('homeBoard');
  if(!board)return;
  board.replaceChildren();
  board.style.setProperty('--home-cols',String(homeColumns));
  board.style.setProperty('--home-rows',String(homeRowCount()));
  homeCells=[];
  homeWords=words;
  homeRenderedRows=words.length;
  words.forEach((word,row)=>{
    [...word].forEach((ch,col)=>{
      const cell=document.createElement('div');
      cell.className='home-cell'+(col===homeColumns-1?' last-column':'');
      cell.dataset.row=String(row);
      cell.dataset.col=String(col);
      const span=document.createElement('span');
      span.className='home-letter';
      cell.appendChild(span);
      const item={cell,span,char:'',isVowel:false,variant:0};
      setHomeLetter(item,ch);
      board.appendChild(cell);
      homeCells.push(item);
    });
  });
}
// Restart V1's bounce on each chosen glyph; no fade and no motion blur.
function jumpHomeLetter(item){
  item.span.classList.remove('spinning');
  void item.span.offsetWidth; // restart CSS keyframes even after earlier jumps
  item.span.classList.add('spinning');
}
function spinHomeVowels(){
  if(screen.hidden||homeBusy)return;
  homeBusy=true;
  const epoch=++homeAnimationEpoch;
  const vowels=homeCells.filter(item=>item.isVowel);
  vowels.forEach((item,index)=>{
    rememberHomeTimeout(setTimeout(()=>{
      if(epoch!==homeAnimationEpoch||screen.hidden)return;
      jumpHomeLetter(item);
      let tick=0;
      const interval=setInterval(()=>{
        if(epoch!==homeAnimationEpoch){clearInterval(interval);return;}
        item.variant=randomVariantFor(item.char,item.variant);
        applyHomeVariant(item);
        if(++tick>=7+index%3)clearInterval(interval);
      },65);
      homeIntervals.push(interval);
      rememberHomeTimeout(setTimeout(()=>item.span.classList.remove('spinning'),HOME_JUMP_MS));
    },index*55));
  });
  rememberHomeTimeout(setTimeout(()=>{if(epoch===homeAnimationEpoch)homeBusy=false;},HOME_JUMP_MS+vowels.length*55+100));
}
// Word changes use precisely the same individual letter bounce as the vowels.
// Each cell jumps once, updates near the top of its own jump, and settles in place.
// No board-scale motion, blur, opacity transition, or all-at-once shake.
// A deliberate domino-like sequence, one glyph at a time.
// Every cell uses EXACTLY the same homeJackpot jump as the vowel previews.
// The next word appears in place as each individual glyph reaches its jump peak.
function shuffleHomeWords(){
  if(screen.hidden)return; // Word changes take priority even if vowels are cycling.
  const epoch=++homeAnimationEpoch;
  homeBusy=true;
  homeCells.forEach(item=>item.span.classList.remove('spinning'));
  const nextWords=randomWordPool(homeWords);
  const nextChars=nextWords.flatMap(word=>[...word]);
  const perLetterDelay=125; // makes the progression visible rather than simultaneous
  homeCells.forEach((item,i)=>{
    rememberHomeTimeout(setTimeout(()=>{
      if(epoch!==homeAnimationEpoch||screen.hidden)return;
      // Cancel only this glyph's animation; restart the same V1 jump.
      jumpHomeLetter(item);
      rememberHomeTimeout(setTimeout(()=>{
        if(epoch!==homeAnimationEpoch||screen.hidden)return;
        setHomeLetter(item,nextChars[i]);
      },Math.round(HOME_JUMP_MS*.29)));
      rememberHomeTimeout(setTimeout(()=>item.span.classList.remove('spinning'),HOME_JUMP_MS));
    },i*perLetterDelay));
  });
  homeWords=nextWords;
  const total=(homeCells.length-1)*perLetterDelay+HOME_JUMP_MS+80;
  rememberHomeTimeout(setTimeout(()=>{
    if(epoch===homeAnimationEpoch)homeBusy=false;
  },total));
}

// The landing call-to-action is fixed at the center via CSS.
// The word wall retains its independent typography animations.
function createScreensaver(){
  homeColumns=homeColumnCount();
  buildHomeBoard(randomWordPool());
}
function startHomeSequence(){
  stopHomeSequence();
  const cols=homeColumnCount();
  if(cols!==homeColumns||homeRenderedRows!==homeRowCount()||!$('homeBoard')?.children.length){
    homeColumns=cols;
    buildHomeBoard(randomWordPool());
  }
  rememberHomeTimeout(setTimeout(spinHomeVowels,1400));
  homeIntervals.push(setInterval(spinHomeVowels,HOME_VOWEL_CYCLE_MS));
  homeIntervals.push(setInterval(shuffleHomeWords,HOME_WORD_SWAP_MS));
}
function stopHomeSequence(){
  clearHomeTimers();
  homeCells.forEach(item=>item.span.classList.remove('spinning'));
}
function layoutHome(){
  const cols=homeColumnCount();
  if(cols!==homeColumns||homeRenderedRows!==homeRowCount()){
    const wasActive=!screen.hidden;
    stopHomeSequence();
    homeColumns=cols;
    buildHomeBoard(randomWordPool());
    if(wasActive)startHomeSequence();
  }
}

createScreensaver();createSpecimen();render();screensaver();
setInterval(animatePending,VOWEL_CHANGE_MS);

