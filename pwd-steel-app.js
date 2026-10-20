/* PWD Field Assistant Steel Table V1 — entirely offline catalogue and calculator.
 * Material table rows are dated SAIL manufacturer records, NOT copyrighted
 * third-party APK content. Dimensional drawings are illustrative originals.
 * RCC retaining wall/BBS code is deliberately untouched.
 */
(function(){
'use strict';
const catalog=window.PWDSteelCatalog,math=window.PWDSteelMath,$=id=>document.getElementById(id);
if(!catalog||!math||!$('steelFamilies'))return;
let family='beam',selected=null,last=null,lastEntry=null;
const source=id=>catalog.SOURCES[id];
const format=(x,d=2)=>Number(x).toLocaleString('en-IN',{maximumFractionDigits:d,minimumFractionDigits:d});
function shapeSvg(type,data={}){
 const blue='var(--diagram-ink)',steel='var(--diagram-metal)',ink='var(--diagram-ink)';
 let body='',info='';
 const n=v=>Number(v).toLocaleString('en-IN');
 if(type==='beam'){
  body='<path d="M138 42H342V77H261V210H342V245H138V210H219V77H138Z" />';
  info='Depth D = '+n(data.depthMm)+' mm · Flange B = '+n(data.widthMm)+' mm';
 }else if(type==='channel'){
  body='<path d="M150 42H340V80H194V208H340V246H150Z"/>';
  info='Depth D = '+n(data.depthMm)+' mm · Flange B = '+n(data.widthMm)+' mm';
 }else if(type==='angle'){
  body='<path d="M164 45H205V209H340V250H164Z"/>';
  info='Equal leg '+n(data.depthMm)+' mm · nominal t '+n(data.thicknessMm)+' mm';
 }else if(type==='round'){
  body='<circle cx="244" cy="146" r="91"/>';
  info='Solid round · theoretical geometric estimate';
 }else if(type==='square'){
  body='<rect x="151" y="53" width="186" height="186"/>';
  info='Solid square · theoretical geometric estimate';
 }else{
  body='<rect x="105" y="115" width="275" height="70"/>';
  info=type==='plate'?'Plate / strip · rectangular section':'Flat bar · rectangular section';
 }
 const label=data.designation||type.charAt(0).toUpperCase()+type.slice(1);
 // All text originates in app-authored names; SVG only has known static shapes.
 return '<svg viewBox="0 0 488 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrative '+type+' cross-section, not a fabrication drawing">'+
  '<rect width="488" height="310" fill="var(--diagram-bg)"/><g fill="'+steel+'" stroke="'+ink+'" stroke-width="3" stroke-linejoin="round">'+body+'</g>'+
  '<text x="244" y="25" fill="'+blue+'" text-anchor="middle" font-size="15" font-weight="700">'+label.replace(/&/g,'&amp;')+'</text>'+
  '<text x="244" y="286" fill="'+ink+'" text-anchor="middle" font-size="12">'+info+'</text>'+
  '<text x="244" y="304" fill="var(--diagram-sub)" text-anchor="middle" font-size="10">Schematic only · not to scale</text></svg>';
}
function setFamily(next){
 family=next;selected=null;last=null;lastEntry=null;
 for(const button of $('steelFamilies').querySelectorAll('button'))
  button.setAttribute('aria-pressed',String(button.dataset.family===next));
 const custom=next==='calculated';
 $('catalogDetails').hidden=custom;$('customDetails').hidden=!custom;
 if(custom){
  $('steelDetail').hidden=false;
  $('steelTitle').textContent='Custom shape';
  $('steelStatus').textContent='Calculated · 7,850 kg/m³';
  $('steelStatus').classList.remove('archive');
  $('steelMassCaption').textContent='Calculated mass per metre';
  $('steelSource').removeAttribute('href');
  $('sourceLinks').hidden=true;
  $('steelArchiveNote').hidden=true;
  $('steelDataCaution').textContent='Theoretical geometry, not a published section mass.';
  updateCustomInputs();
 }else{
  $('sourceLinks').hidden=false;
  renderRows();
 }
 updateResult();
}
function makeFamilyButtons(){
 for(const cat of catalog.categories){
  const button=document.createElement('button');
  button.type='button';button.dataset.family=cat.id;
  button.textContent=cat.label==='Plates & bars'?'Plate / bar':cat.label;
  button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>setFamily(cat.id));
  $('steelFamilies').append(button);
 }
}
function renderRows(){
 const rows=catalog.search($('steelSearch').value,family);
 const field=$('steelResults');
 // Keep the last selection if it still belongs to the current filtered result.
 const wanted=rows.some(x=>x.id===selected?.id)?selected.id:
   (!selected&&family==='beam'&&rows.some(x=>x.id==='ISMB200')?'ISMB200':rows[0]?.id);
 field.replaceChildren();
 for(const row of rows){
  const option=document.createElement('option');
  option.value=row.id;
  option.textContent=row.designation+' · '+format(row.kgPerM)+' kg/m';
  field.append(option);
 }
 if(wanted)field.value=wanted;
 field.disabled=rows.length===0;
 selected=rows.find(x=>x.id===wanted)||null;
 $('noResults').hidden=rows.length>0;
 $('steelCount').textContent=rows.length?rows.length+' sizes available':'';
 renderDetail();
 updateResult();
}
function propertyTable(row){
 const tbody=document.createElement('tbody');
 const entries=[
  ['Nominal depth / leg (mm)',row.depthMm],
  ['Nominal width / leg (mm)',row.widthMm],
  ['Nominal thickness (mm)',row.thicknessMm],
  ['Web thickness (mm)',row.webMm],
  ['Flange thickness (mm)',row.flangeMm],
  ['Area (cm²)',row.areaCm2],
  ['Izz / major axis (cm⁴)',row.ixCm4],
  ['Iyy / minor axis (cm⁴)',row.iyCm4],
  ['Zzz / major axis (cm³)',row.zxCm3],
  ['Zyy / minor axis (cm³)',row.zyCm3]
 ];
 for(const [label,value] of entries){
  if(value===undefined||value===null)continue;
  const tr=document.createElement('tr'),a=document.createElement('td'),b=document.createElement('td');
  a.textContent=label;b.textContent=Number(value).toLocaleString('en-IN');
  tr.append(a,b);tbody.append(tr);
 }
 const table=document.createElement('table');table.append(tbody);return table;
}
function renderDetail(){
 if(!selected){$('steelDetail').hidden=true;return;}
 const src=source(selected.sourceId);
 const archived=selected.basis==='archived-manufacturer-only';
 $('steelDetail').hidden=false;
 $('steelTitle').textContent=selected.designation;
 $('steelStatus').textContent=archived?'Archive · 2020':'SAIL · 2023';
 $('steelStatus').classList.toggle('archive',archived);
 $('steelArchiveNote').hidden=!archived;
 $('steelMassCaption').textContent='Published mass per metre';
 $('steelMass').textContent=format(selected.kgPerM);
 $('steelSectionDiagram').innerHTML=shapeSvg(selected.family,selected);
 $('steelProperties').replaceChildren(propertyTable(selected));
 $('steelDataCaution').textContent=archived?
   'This 2020 row is not rechecked against IS 808:2021 or current mill availability.':
   'Manufacturer data (2023), not independently verified against each row of IS 808:2021.';
 const a=$('steelSource');a.href=src.url;a.textContent=src.label;
 $('steelSourceDate').textContent='Published '+src.date+' · '+src.note;
 $('sourceLinks').hidden=false;
}
function updateCustomInputs(){
 const type=$('steelCustomShape').value;
 const rectangle=type==='plate'||type==='flat';
 $('steelWidthField').hidden=!rectangle;$('steelThickField').hidden=!rectangle;
 $('steelDiameterField').hidden=type!=='round';$('steelSideField').hidden=type!=='square';
 $('steelSectionDiagram').innerHTML=shapeSvg(type);
 $('steelProperties').textContent='User-entered dimensions · theoretical density 7,850 kg/m³.';
 updateResult();
}
function calculate(){
 const L=$('steelLength').value,N=$('steelCountPieces').value,rate=$('steelRate').value;
 if(family==='calculated'){
  const shape=$('steelCustomShape').value;
  const dims={widthMm:$('steelWidth').value,thicknessMm:$('steelThickness').value,
   diameterMm:$('steelDiameter').value,sideMm:$('steelSide').value};
  const q=math.geometricMass(shape,dims,L,N,rate);
  return {q,entry:{type:shape,designation:shape+' (user dimensions)',sourceLabel:'User dimensions · theoretical',sourceStatus:'Calculated only'}};
 }
 if(!selected)throw Error('Choose a steel section from the search results.');
 const q=math.quantity(selected,L,N,rate),src=source(selected.sourceId);
 return {q,entry:{...selected,sourceLabel:src.label,sourceDate:src.date,sourceStatus:selected.basis}};
}
function updateResult(){
 try{
  const {q,entry}=calculate();
  last=q;lastEntry=entry;
  $('steelError').hidden=true;$('output').hidden=false;
  $('outUnit').textContent=format(q.unitMassKgM,3);
  $('outKg').textContent=format(q.totalMassKg,2);
  $('outTonne').textContent=format(q.totalTonnes,4);
  $('outMethod').textContent=q.basis;
  $('outPrice').textContent=q.totalPrice===null?'':'Cost: ₹'+format(q.totalPrice,2)+' · before taxes/transport';
  if(family==='calculated')$('steelMass').textContent=format(q.unitMassKgM,3);
 }catch(err){
  last=null;lastEntry=null;$('output').hidden=true;
  $('steelError').textContent=err.message;$('steelError').hidden=false;
 }
}
function saveCsv(){
 updateResult();
 if(!last||!lastEntry)return;
 const csv=math.exportCsv(lastEntry,last);
 const filename='PWD_Steel_Quantity_'+(lastEntry.id||lastEntry.type||'section').replace(/[^a-zA-Z0-9_-]/g,'_')+'.csv';
 if(location.host==='appassets.androidplatform.net'){
  window.prompt('__PWD_ANDROID_CSV_EXPORT_V1__'+JSON.stringify({filename,content:csv}));return;
 }
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.download=filename;a.href=url;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function showStandards(){
 const c=$('steelStandards');
 for(const s of catalog.codeReferences){
  const p=document.createElement('p');p.className='small';
  const strong=document.createElement('b');strong.textContent=s.standard+': ';
  const a=document.createElement('a');a.href=s.uri;a.rel='noopener noreferrer';a.textContent=s.title;
  p.append(strong,a,document.createTextNode(' — '+s.scope));c.append(p);
 }
}
makeFamilyButtons();showStandards();
$('steelSearch').addEventListener('input',renderRows);
$('steelResults').addEventListener('change',()=>{
 selected=catalog.byId($('steelResults').value);
 renderDetail();updateResult();
});
$('steelCustomShape').addEventListener('change',updateCustomInputs);
for(const id of ['steelLength','steelCountPieces','steelRate','steelWidth','steelThickness','steelDiameter','steelSide'])
 $(id).addEventListener('input',updateResult);
$('steelCalculate').addEventListener('click',updateResult);
$('steelExport').addEventListener('click',saveCsv);
$('steelPrint').addEventListener('click',()=>{
 const details=$('steelMore');const wasOpen=details.open;
 details.open=true;
 window.print();
 window.addEventListener('afterprint',()=>{details.open=wasOpen;},{once:true});
});
setFamily('beam');
})();