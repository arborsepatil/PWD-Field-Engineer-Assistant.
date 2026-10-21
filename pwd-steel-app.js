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
 // Original vector illustration: D/B/t/T are proportioned where documented;
 // tapered edges and rolled corner radii remain schematic (not a shop drawing).
 const n=v=>Number(v).toLocaleString('en-IN');
 const escapeSvg=v=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const title=escapeSvg(data.designation||type.charAt(0).toUpperCase()+type.slice(1));
 const D=Number(data.depthMm)||100,B=Number(data.widthMm)||50;
 const top=79,bottom=250,cx=245,scale=171/D,w=Math.min(195,Math.max(42,B*scale));
 const left=cx-w/2,right=cx+w/2;
 let body='',legend='',label='',help='Illustrative section; not a fabrication drawing';
 const dimension=(x1,y1,x2,y2,text,tx,ty)=>'<g fill="none" stroke="var(--diagram-ink)" stroke-width="1.4"><path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" marker-start="url(#dimArrow)" marker-end="url(#dimArrow)"/></g><text x="'+tx+'" y="'+ty+'" fill="var(--diagram-ink)" font-size="14" text-anchor="middle" font-weight="650">'+escapeSvg(text)+'</text>';
 if(type==='beam'){
  const web=Math.min(w*.32,Math.max(7,Number(data.webMm)?data.webMm*scale:w*.075));
  const flange=Math.max(10,Number(data.flangeMm)?data.flangeMm*scale:171*.075);
  const taper=(Number(data.flangeSlopeDeg)===98)?Math.min(9,Math.tan(8*Math.PI/180)*(w-web)/2):Math.min(8,w*.05);
  const edge=Math.max(7,flange-taper/2),root=flange+taper/2;
  body='<path d="M'+left+' '+top+' H'+right+' V'+(top+edge)+' L'+(cx+web/2)+' '+(top+root)+' V'+(bottom-root)+' L'+right+' '+(bottom-edge)+' V'+bottom+' H'+left+' V'+(bottom-edge)+' L'+(cx-web/2)+' '+(bottom-root)+' V'+(top+root)+' L'+left+' '+(top+edge)+' Z"/>';
  legend='t '+(data.webMm??'n/a')+' mm   T '+(data.flangeMm??'n/a')+' mm';
  if(data.rootRadiusMm!=null)legend+='   R₁ '+data.rootRadiusMm+'   R₂ '+data.toeRadiusMm+' mm';
  if(data.flangeSlopeDeg!=null)legend+='   α '+data.flangeSlopeDeg+'°';
  label=dimension(left,54,right,54,'B '+n(B)+' mm',cx,46)+dimension(108,top,108,bottom,'D '+n(D)+' mm',73,169);
  help=data.flangeMm!=null?'Tapered flange shown; corner fillets schematic':'Flange/web gauges not published in this row';
 }else if(type==='channel'){
  // Flange slope and root/toe radii come from the SAIL channel catalogue when provided;
  // rolling fillets are deliberately not fabricated from missing radius coordinates.
  const web=Math.max(3.5,Number(data.webMm)?data.webMm*scale:w*.13);
  const flange=Math.max(4,Number(data.flangeMm)?data.flangeMm*scale:171*.095);
  const rise=Number(data.flangeSlopeDeg)===96?Math.tan(6*Math.PI/180)*(w-web)/2:Math.min(6,w*.07);
  const edge=Math.max(3.5,flange-rise),root=flange+rise;
  body='<path d="M'+left+' '+top+' H'+right+' V'+(top+edge)+' L'+(left+web)+' '+(top+root)+' V'+(bottom-root)+' L'+right+' '+(bottom-edge)+' V'+bottom+' H'+left+' Z"/>';
  label=dimension(left,54,right,54,'B '+n(B)+' mm',cx,46)+dimension(108,top,108,bottom,'D '+n(D)+' mm',73,169);
  if(data.webMm!=null){
   legend='t '+data.webMm+' mm   T '+data.flangeMm+' mm   α '+data.flangeSlopeDeg+'°';
   if(data.rootRadiusMm!=null)legend+='   R₁ '+data.rootRadiusMm+'   R₂ '+data.toeRadiusMm+' mm';
   help='Sloping flange profile; roots/toes shown schematically';
  }else{
   legend='Web / flange thickness unavailable';
   help='Only D, B and kg/m confirmed from SAIL range list';
  }
 }else if(type==='angle'){
  const size=169,bar=Math.min(50,Math.max(7,Number(data.thicknessMm)/D*size));
  const x=cx-size/2,y=top;
  body='<path d="M'+x+' '+y+' H'+(x+bar)+' V'+(bottom-bar)+' H'+(x+size)+' V'+bottom+' H'+x+' Z"/>';
  label=dimension(x,54,x+size,54,'B '+n(B)+' mm',cx,46)+dimension(108,top,108,bottom,'D '+n(D)+' mm',73,169);
  legend='Nominal leg thickness '+(data.thicknessMm??'—')+' mm';
  help='Rolled toe/root radii schematic; verify mill dimensions';
 }else if(type==='round'){
  body='<circle cx="245" cy="165" r="78"/>';label=dimension(167,165,323,165,'',245,155);help='Solid round · theoretical geometric weight';
 }else if(type==='square'){
  body='<rect x="163" y="83" width="164" height="164"/>';help='Solid square · theoretical geometric weight';
 }else{
  body='<rect x="119" y="138" width="255" height="58"/>';
  help=type==='plate'?'Plate / strip · theoretical geometric weight':'Flat bar · theoretical geometric weight';
 }
 const axes=type==='beam'?
   '<g stroke="var(--diagram-ink)" stroke-width="1" stroke-dasharray="5 5" opacity=".5"><line x1="134" y1="164.5" x2="356" y2="164.5"/><line x1="245" y1="69" x2="245" y2="259"/></g><g fill="var(--diagram-sub)" font-size="11"><text x="360" y="161">z–z</text><text x="251" y="75">y–y</text></g>':'';
 return '<svg viewBox="0 0 488 345" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+escapeSvg(type)+' section diagram; dimensions from the cited SAIL source where available; illustrative radii">'+
  '<defs><marker id="dimArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M8 0L0 4L8 8" fill="none" stroke="var(--diagram-ink)" stroke-width="1"/></marker></defs>'+
  '<rect width="488" height="345" fill="var(--diagram-bg)"/>'+
  '<text x="245" y="25" fill="var(--diagram-ink)" text-anchor="middle" font-size="17" font-weight="750">'+title+'</text>'+
  '<g fill="var(--diagram-metal)" stroke="var(--diagram-ink)" stroke-width="2.7" stroke-linejoin="round">'+body+'</g>'+axes+label+
  '<text x="245" y="289" fill="var(--diagram-ink)" text-anchor="middle" font-size="12.5" font-weight="650">'+escapeSvg(legend)+'</text>'+
  '<text x="245" y="313" fill="var(--diagram-sub)" text-anchor="middle" font-size="12">'+escapeSvg(help)+'</text>'+
  '<text x="245" y="331" fill="var(--diagram-sub)" text-anchor="middle" font-size="11">Catalogue dimensions are nominal · original schematic</text></svg>';
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
  ['Flange thickness T (mm)',row.flangeMm],
  ['Flange slope α (degrees)',row.flangeSlopeDeg],
  ['Root radius R₁ (mm)',row.rootRadiusMm],
  ['Toe radius R₂ (mm)',row.toeRadiusMm],
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
 $('steelStatus').textContent=archived?'SAIL · archived 2020':(selected.heavyVariant?'SAIL · HEAVY SECTION · '+src.date:'SAIL · published '+src.date);
 $('steelStatus').classList.toggle('archive',archived||Boolean(selected.heavyVariant));
 $('steelArchiveNote').hidden=!archived;
 $('steelMassCaption').textContent='Published mass per metre';
 $('steelMass').textContent=format(selected.kgPerM);
 $('steelSectionDiagram').innerHTML=shapeSvg(selected.family,selected);
 $('steelProperties').replaceChildren(propertyTable(selected));
 $('steelDataCaution').classList.toggle('variant-note',Boolean(selected.heavyVariant));
 $('steelDataCaution').textContent=archived?
   'This 2020 row is not rechecked against IS 808:2021 or current mill availability.':
   ((selected.orderNote ? selected.orderNote+' ' : '')+
   'SAIL manufacturer publication; not independent BIS row-by-row certification.');
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
 return {q,entry:{...selected,sourceLabel:src.label,sourceDate:src.date,sourceStatus:selected.basis,sourceUrl:src.url,standard:selected.standard,orderNote:selected.orderNote||''}};
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