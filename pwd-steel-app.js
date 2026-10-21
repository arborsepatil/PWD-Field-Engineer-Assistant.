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
const text=(el,value)=>{el.textContent=String(value)};
function shapeSvg(type,data={}){
 // Section diagrams use CSS tokens so white backgrounds never glare in dark mode.
 let body='',info='';
 const n=v=>Number(v).toLocaleString('en-IN');
 if(type==='beam'||type==='column'||type==='pile'){
  body='<path d="M138 42H342V77H261V210H342V245H138V210H219V77H138Z" />';
  info='Depth D = '+n(data.depthMm)+' mm · Flange B = '+n(data.widthMm)+' mm';
 }else if(type==='channel'){
  body='<path d="M150 42H340V80H194V208H340V246H150Z"/>';
  info='Depth D = '+n(data.depthMm)+' mm · Flange B = '+n(data.widthMm)+' mm';
 }else if(type==='angle'){
  body='<path d="M164 45H205V209H340V250H164Z"/>';
  info=(data.depthMm===data.widthMm?'Equal':'Unequal')+' angle · '+n(data.depthMm)+'×'+n(data.widthMm)+' mm';
 }else if(type==='hollow'||type.startsWith('hollow-')){
  const shape=type==='hollow'?(data.series==='CHS'?'hollow-chs':data.series==='SHS'?'hollow-shs':'hollow-rhs'):type;
  body=shape==='hollow-chs'?'<circle cx="244" cy="147" r="92"/><circle cx="244" cy="147" r="68" class="cutout"/>':
   '<rect x="138" y="66" width="212" height="155"/><rect x="161" y="89" width="166" height="109" class="cutout"/>';
  info=shape==='hollow-chs'?'Circular hollow · outside diameter':
    shape==='hollow-shs'?'Square hollow · outside dimensions':'Rectangular hollow · outside dimensions';
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
  '<rect width="488" height="310" class="bg"/><g class="shape" stroke-width="3" stroke-linejoin="round">'+body+'</g>'+
  '<text x="244" y="25" class="ink" text-anchor="middle" font-size="15" font-weight="700">'+label.replace(/&/g,'&amp;')+'</text>'+
  '<text x="244" y="286" class="ink" text-anchor="middle" font-size="12">'+info+'</text>'+
  '<text x="244" y="304" class="muted" text-anchor="middle" font-size="10">Illustrative · not to scale</text></svg>';
}
function setFamily(next){
 family=next;selected=null;last=null;lastEntry=null;
 updateSeries();
 for(const button of $('steelFamilies').querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.family===next));
 const custom=next==='calculated';
 $('catalogDetails').hidden=custom;$('customDetails').hidden=!custom;
 if(custom){
  $('steelDetail').hidden=false;$('steelDetailsEmpty').hidden=true;
  $('steelTitle').textContent='Theoretical section';
  $('steelStatus').textContent='Calculated';
  $('steelMass').textContent='—';
  $('steelSource').removeAttribute('href');$('sourceLinks').hidden=true;
  $('steelDataCaution').textContent='Theoretical weight uses assumed density: 7850 kg/m³. Not a nominal BIS value.';
  updateCustomInputs();
 }else{
  $('sourceLinks').hidden=false;
  renderRows();
  renderDetail();
 }
 updateSelectedSummary();
 updateResult();
}
function updateSeries(){
 const select=$('steelSeries');
 select.replaceChildren();
 const options=[{id:'all',label:'All series'},...catalog.availableSeries(family)];
 for(const series of options){
  const option=document.createElement('option');
  option.value=series.id;
  option.textContent=series.label;
  select.append(option);
 }
 $('steelSeriesField').hidden=family==='calculated';
 select.value='all';
}
function updateSelectedSummary(){
 const custom=family==='calculated';
 $('steelPicked').hidden=!custom&&!selected;
 const conflicts=selected?catalog.collisionGroups().some(group=>group.some(x=>x.id===selected.id)):false;
 $('steelWeightConflict').hidden=!conflicts;
 $('steelPickedName').textContent=custom?$('steelCustomShape').selectedOptions[0].textContent:selected?.designation||'';
 $('steelPickedStatus').textContent=custom?'Theoretical weight':!selected?'':selected.basis==='archived-manufacturer-only'?'Historic · BIS recheck needed':
  ['secondary-unverified','secondary-amendment-unverified'].includes(selected.basis)?'Secondary · BIS row not checked':
  source(selected.sourceId)?.label+' · '+source(selected.sourceId)?.date;
}
function makeFamilyButtons(){
 for(const cat of catalog.categories){
  const button=document.createElement('button');
  button.type='button';button.dataset.family=cat.id;button.textContent=cat.label;
  button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>setFamily(cat.id));
  $('steelFamilies').append(button);
 }
}
function renderRows(){
 const rows=catalog.search($('steelSearch').value,family,$('steelSeries').value||'all');
 if(!selected||!rows.some(x=>x.id===selected.id))selected=rows[0]||null;
 const root=$('steelResults');root.replaceChildren();
 $('noResults').hidden=rows.length!==0;
 $('steelCount').textContent=rows.length+' sourced sizes · full standards audit pending';
 for(const row of rows){
  const btn=document.createElement('button');btn.className='pick';btn.type='button';
  btn.setAttribute('aria-pressed',String(selected?.id===row.id));
  const name=document.createElement('b');name.textContent=row.designation;
  const subtitle=document.createElement('span');
  subtitle.textContent=format(row.kgPerM,2)+' kg/m'+(row.basis==='archived-manufacturer-only'?' · Archive':
 ['secondary-unverified','secondary-amendment-unverified'].includes(row.basis)?' · Secondary':'');
  btn.append(name,subtitle);
  btn.addEventListener('click',()=>{selected=row;renderRows();renderDetail();updateSelectedSummary();updateResult();});
  root.append(btn);
 }
 updateSelectedSummary();
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
 if(!selected){$('steelDetail').hidden=true;$('steelDetailsEmpty').hidden=false;return;}
 const src=source(selected.sourceId);
 $('steelDetail').hidden=false;$('steelDetailsEmpty').hidden=true;
 $('steelTitle').textContent=selected.designation;
 $('steelStatus').textContent=selected.basis==='archived-manufacturer-only'?'Historical · verify current':selected.basis.startsWith('secondary-')?'Secondary · BIS review':'Manufacturer · '+src.date;
 $('steelMass').textContent=format(selected.kgPerM);
 $('steelSectionDiagram').innerHTML=shapeSvg(selected.family,selected);
 $('steelProperties').replaceChildren(propertyTable(selected));
 $('steelDataCaution').textContent=selected.basis==='archived-manufacturer-only'?
  'Historical manufacturer data. For RHS verify IS 4923:2017 Amendment 3 (2024); for SHS/CHS check the latest applicable standard.':
  selected.basis.startsWith('secondary-')?'Secondary reference, not independently checked against an authoritative BIS numeric row.':
  'Manufacturer mass; project-standard and mill test certificate checks remain necessary.';
 const a=$('steelSource');a.href=selected.sourceUrl||src.url;a.textContent=src.label;
 $('steelSourceDate').textContent=src.date+' · Reference value; check the current official standard and MTC';
 $('sourceLinks').hidden=false;
}
function updateCustomInputs(){
 const type=$('steelCustomShape').value;
 const rectangle=type==='plate'||type==='flat';
 $('steelWidthField').hidden=!(rectangle||type==='hollow-rhs');
 $('steelThickField').hidden=!(rectangle||type.startsWith('hollow-'));
 $('steelDiameterField').hidden=!(type==='round'||type==='hollow-chs');
 $('steelSideField').hidden=!(type==='square'||type==='hollow-shs');
 $('steelHeightField').hidden=type!=='hollow-rhs';
 $('steelCustomCaution').hidden=!type.startsWith('hollow-');
 $('steelSectionDiagram').innerHTML=shapeSvg(type);
 $('steelProperties').textContent='User-entered dimensions';
 updateSelectedSummary();
 updateResult();
}
function calculate(){
 const L=$('steelLength').value,N=$('steelCountPieces').value,rate=$('steelRate').value;
 if(family==='calculated'){
  const shape=$('steelCustomShape').value;
  const dims={widthMm:$('steelWidth').value,thicknessMm:$('steelThickness').value,
   diameterMm:$('steelDiameter').value,sideMm:$('steelSide').value,heightMm:$('steelHeight').value};
  const q=math.geometricMass(shape,dims,L,N,rate);
  return {q,entry:{type:shape,designation:shape+' (user dimensions)',sourceLabel:'User dimensions · theoretical',sourceStatus:'Calculated only'}};
 }
 if(!selected)throw Error('Choose a steel section from the search results.');
 const q=math.quantity(selected,L,N,rate),src=source(selected.sourceId);
 return {q,entry:{...selected,sourceLabel:src.label+' · '+(selected.sourceUrl||src.url),sourceDate:src.date,sourceStatus:selected.basis}};
}
function updateResult(){
 try{
  const {q,entry}=calculate();
  last=q;lastEntry=entry;
  $('steelEmpty').hidden=true;$('steelError').hidden=true;$('output').hidden=false;
  $('outUnit').textContent=format(q.unitMassKgM,3);
  $('outKg').textContent=format(q.totalMassKg,2);
  $('outTonne').textContent=format(q.totalTonnes,4);
  $('outMethod').textContent=q.basis;
  $('outPrice').hidden=q.totalPrice===null;
  $('outPrice').textContent=q.totalPrice===null?'':'Approx. material cost ₹'+format(q.totalPrice,2);
  if(family==='calculated')$('steelMass').textContent=format(q.unitMassKgM,3);
 }catch(err){
  last=null;lastEntry=null;$('output').hidden=true;
  const missing=!selected&&family!=='calculated';
  $('steelEmpty').hidden=!missing;
  $('steelError').hidden=missing;
  $('steelError').textContent=missing?'':err.message;
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
$('steelSearch').addEventListener('input',()=>{
 const input=$('steelSearch').value.trim().toUpperCase();
 const prefix=input.match(/^(?:IS)?(JB|LB|MB|WB|NPB|WPB|SC|HB|JC|LC|MC|MPC|MCP|PBP|SHS|RHS|CHS)\b/);
 if(prefix){
  const canonical=prefix[1]==='MCP'?'MPC':prefix[1];
  const match=catalog.SERIES.find(s=>s.id===canonical);
  if(match&&match.family!==family)setFamily(match.family);
  if(match&&$('steelSeries').value!==canonical)$('steelSeries').value=canonical;
 }
 renderRows();renderDetail();updateSelectedSummary();updateResult();
});
$('steelSeries').addEventListener('change',()=>{
 selected=null;renderRows();renderDetail();updateSelectedSummary();updateResult();
});
$('steelCustomShape').addEventListener('change',updateCustomInputs);
for(const id of ['steelLength','steelCountPieces','steelRate','steelWidth','steelThickness','steelDiameter','steelSide','steelHeight'])
 $(id).addEventListener('input',updateResult);
$('steelCalculate').addEventListener('click',updateResult);
$('steelExport').addEventListener('click',saveCsv);
$('steelPrint').addEventListener('click',()=>window.print());
setFamily('beam');
})();