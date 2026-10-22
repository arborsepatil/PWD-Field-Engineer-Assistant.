/* PWD Field Assistant Steel Table V1 — entirely offline catalogue and calculator.
 * Material table rows are dated SAIL manufacturer records, NOT copyrighted
 * third-party APK content. Dimensional drawings are illustrative originals.
 * RCC retaining wall/BBS code is deliberately untouched.
 */
(function(){
'use strict';
const catalog=window.PWDSteelCatalog,math=window.PWDSteelMath,$=id=>document.getElementById(id);
if(!catalog||!math||!$('steelFamilies'))return;
let family='beam',selected=null,last=null,lastEntry=null,shownLimit=60;
const source=id=>catalog.SOURCES[id];
const format=(x,d=2)=>Number(x).toLocaleString('en-IN',{maximumFractionDigits:d,minimumFractionDigits:d});
const text=(el,value)=>{el.textContent=String(value)};
function shapeSvg(type,data={}){
 // Geometry is based on nominal source dimensions where available;
 // fillets, taper without a documented slope, and rolling tolerances remain schematic.
 const safe=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=v=>Number(v).toLocaleString('en-IN');
 const D=Number(data.depthMm)||100,B=Number(data.widthMm)||D;
 const height=174,top=84,bottom=top+height,cx=251;
 const width=Math.max(48,Math.min(210,height*B/D)),left=cx-width/2,right=cx+width/2;
 const label=safe(data.designation||type.replace('hollow-','').toUpperCase());
 const dim=(x1,y1,x2,y2,t,tx,ty)=>'<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" class="dim"/><text x="'+tx+'" y="'+ty+'" class="ink" font-size="13" text-anchor="middle">'+safe(t)+'</text>';
 let body='',info='',legend='',marks='';
 const dDims=()=>dim(left,60,right,60,'B '+fmt(B)+' mm',cx,50)+dim(112,top,112,bottom,'D '+fmt(D)+' mm',74,174);
 if(type==='beam'||type==='column'||type==='pile'){
  const web=Number(data.webMm)>0?Math.max(4,height*data.webMm/D):Math.max(8,width*.11);
  const thick=Number(data.flangeMm)>0?Math.max(5,height*data.flangeMm/D):Math.max(11,height*.095);
  const slope=Number.isFinite(data.flangeSlopeDeg)?Math.tan(Math.abs(90-data.flangeSlopeDeg)*Math.PI/180)*((width-web)/2):0;
  const edge=Math.max(4,thick-slope/2),root=thick+slope/2;
  body='<path d="M'+left+' '+top+'H'+right+'V'+(top+edge)+'L'+(cx+web/2)+' '+(top+root)+'V'+(bottom-root)+'L'+right+' '+(bottom-edge)+'V'+bottom+'H'+left+'V'+(bottom-edge)+'L'+(cx-web/2)+' '+(bottom-root)+'V'+(top+root)+'L'+left+' '+(top+edge)+'Z"/>';
  marks=dDims();
  legend='t '+(data.webMm??'not sourced')+' mm · T '+(data.flangeMm??'not sourced')+' mm';
  if(data.flangeSlopeDeg!=null)legend+=' · α '+data.flangeSlopeDeg+'°';
  info='I-section · section fillets schematic';
 }else if(type==='channel'){
  const web=Number(data.webMm)>0?Math.max(4,height*data.webMm/D):Math.max(8,width*.11);
  const thick=Number(data.flangeMm)>0?Math.max(5,height*data.flangeMm/D):Math.max(12,height*.10);
  const slope=Number.isFinite(data.flangeSlopeDeg)?Math.tan(Math.abs(90-data.flangeSlopeDeg)*Math.PI/180)*(width-web):0;
  const edge=Math.max(4,thick-slope/2),root=thick+slope/2;
  body='<path d="M'+left+' '+top+'H'+right+'V'+(top+edge)+'L'+(left+web)+' '+(top+root)+'V'+(bottom-root)+'L'+right+' '+(bottom-edge)+'V'+bottom+'H'+left+'Z"/>';
  marks=dDims();
  legend='t '+(data.webMm??'not sourced')+' mm · T '+(data.flangeMm??'not sourced')+' mm';
  if(data.flangeSlopeDeg!=null)legend+=' · α '+data.flangeSlopeDeg+'°';
  info='Channel · no centroid axes assumed';
 }else if(type==='angle'){
  const t=Number(data.thicknessMm),px=Number.isFinite(t)&&t>0?Math.max(4,Math.min(width*.4,height*t/D)):Math.max(8,width*.14);
  body='<path d="M'+left+' '+top+'H'+(left+px)+'V'+(bottom-px)+'H'+right+'V'+bottom+'H'+left+'Z"/>';
  marks=dDims();legend='t '+(data.thicknessMm??'not sourced')+' mm';
  info=(D===B?'Equal':'Unequal')+' leg angle · root/toe fillets schematic';
 }else if(type==='hollow'||type.startsWith('hollow-')){
  const kind=type==='hollow'?(data.series==='CHS'?'hollow-chs':data.series==='SHS'?'hollow-shs':'hollow-rhs'):type;
  const t=Number(data.thicknessMm),hasWall=Number.isFinite(t)&&t>0;
  if(kind==='hollow-chs'){
   const OD=Number(data.diameterMm??data.depthMm);
   const radius=86;
   // Wall is proportional to nominal t/OD where both are sourced.
   const wall=hasWall&&OD>0?Math.max(3,Math.min(radius*.4,2*radius*t/OD)):20;
   body='<circle cx="'+cx+'" cy="171" r="'+radius+'"/><circle class="cutout" cx="'+cx+'" cy="171" r="'+(radius-wall)+'"/>';
   if(OD>0)marks=dim(cx-radius,60,cx+radius,60,'OD '+fmt(OD)+' mm',cx,50);
   legend=hasWall?'t '+fmt(t)+' mm · nominal outside diameter':'Wall thickness not sourced';
   info='Circular hollow · wall shown approximately';
  }else{
   const outerW=kind==='hollow-shs'?174:width,outerLeft=cx-outerW/2,outerTop=top;
   const wall=hasWall&&D>0?Math.max(3,Math.min(outerW*.3,height*.3,height*t/D)):18;
   body='<rect x="'+outerLeft+'" y="'+outerTop+'" width="'+outerW+'" height="'+height+'"/><rect class="cutout" x="'+(outerLeft+wall)+'" y="'+(outerTop+wall)+'" width="'+(outerW-2*wall)+'" height="'+(height-2*wall)+'"/>';
   if(Number(data.depthMm)>0&&Number(data.widthMm)>0)
    marks=dim(outerLeft,60,outerLeft+outerW,60,'B '+fmt(B)+' mm',cx,50)+dim(112,top,112,bottom,'D '+fmt(D)+' mm',74,174);
   legend=hasWall?'t '+fmt(t)+' mm · nominal dimensions':'Wall thickness not sourced';
   info='Square / rectangular hollow · corner radii schematic';
  }
 }else if(type==='round'){
  body='<circle cx="'+cx+'" cy="171" r="85"/>';info='Solid round · theoretical geometry';
 }else if(type==='square'){
  body='<rect x="164" y="84" width="174" height="174"/>';info='Solid square · theoretical geometry';
 }else{
  body='<rect x="120" y="146" width="260" height="52"/>';info='Plate/flat · theoretical geometry';
 }
 return '<svg viewBox="0 0 500 348" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+safe(type)+' nominal section diagram; not a fabrication drawing">'+
  '<rect width="500" height="348" class="bg"/>'+
  '<text x="250" y="23" class="ink" text-anchor="middle" font-size="16" font-weight="700">'+label+'</text>'+
  '<g class="shape" stroke-width="2.5" stroke-linejoin="round">'+body+'</g>'+
  '<g fill="none" stroke="var(--figureInk)" stroke-width="1.4"><path id="unusedAxis" d="" />'+marks+'</g>'+
  '<text x="250" y="292" class="ink" font-size="12.5" text-anchor="middle">'+safe(legend)+'</text>'+
  '<text x="250" y="316" class="muted" font-size="12" text-anchor="middle">'+safe(info)+'</text>'+
  '<text x="250" y="337" class="muted" font-size="10.5" text-anchor="middle">Nominal dimensions · illustrative · not to scale</text></svg>';
}
function setFamily(next){
 family=next;selected=null;last=null;lastEntry=null;shownLimit=60;
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
 const bisAudit=selected?catalog.standardAudit(selected):{status:'not-checked'};
 $('steelPickedStatus').textContent=custom?'Theoretical weight':!selected?'':bisAudit.status==='spot-checked-match'?'BIS 2023 · sample checked':bisAudit.status==='spot-checked-conflict'?'⚠ BIS value conflict':bisAudit.status==='outside-current-scope'?'⚠ Below IS 4923 minimum':bisAudit.status==='amendment3-review'?'RHS · BIS Amd.3 review pending':bisAudit.status==='not-listed-in-replacement'?'⚠ Historical size · not current listed':selected.basis==='archived-manufacturer-only'?'Historic · BIS recheck needed':
  ['secondary-unverified','secondary-amendment-unverified'].includes(selected.basis)?'Secondary · BIS row not checked':
  selected.qualityFlag==='mass-area-inconsistent'?'⚠ Mass/area conflict':selected.basis==='osdag-open-unverified'?'Osdag · BIS row pending':source(selected.sourceId)?.label+' · '+source(selected.sourceId)?.date;
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
 const shown=Math.min(rows.length,shownLimit);
 $('steelCount').textContent=rows.length>shown?'Showing '+shown+' / '+rows.length+' sourced sizes':rows.length+' sourced sizes';
 const more=$('steelMoreSizes');
 more.hidden=shown>=rows.length;
 more.textContent='Show next '+Math.min(60,rows.length-shown)+' sizes';
 for(const row of rows.slice(0,shownLimit)){
  const btn=document.createElement('button');btn.className='pick';btn.type='button';
  btn.setAttribute('aria-pressed',String(selected?.id===row.id));
  const name=document.createElement('b');name.textContent=row.designation;
  const subtitle=document.createElement('span');
  const status=catalog.standardAudit(row).status;
  subtitle.textContent=format(row.kgPerM,2)+' kg/m'+(status==='spot-checked-match'?' · 2023 spot-check':status==='not-listed-in-replacement'?' · Historical / unlisted':status==='spot-checked-conflict'?' · BIS conflict':status==='outside-current-scope'?' · Outside IS 4923 scope':status==='amendment3-review'?' · Amd.3 not verified':row.basis==='archived-manufacturer-only'?' · Archive':
 row.basis==='osdag-open-unverified'?' · Open source':['secondary-unverified','secondary-amendment-unverified'].includes(row.basis)?' · Secondary':'');
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
 if(!selected){$('steelDetail').hidden=true;$('steelDetailsEmpty').hidden=false;return;}
 const src=source(selected.sourceId);
 $('steelDetail').hidden=false;$('steelDetailsEmpty').hidden=true;
 $('steelTitle').textContent=selected.designation;
 const bisAudit=catalog.standardAudit(selected);
 $('steelStatus').textContent=bisAudit.status==='spot-checked-match'?'IS 1161:2014 Amd.2 · sample checked':bisAudit.status==='spot-checked-conflict'?'⚠ Conflicts with BIS':bisAudit.status==='outside-current-scope'?'⚠ Below IS 4923 minimum':bisAudit.status==='amendment3-review'?'RHS · BIS Amd.3 not verified':bisAudit.status==='not-listed-in-replacement'?'⚠ Not listed in 2023 Table 1':selected.qualityFlag==='mass-area-inconsistent'?'⚠ Mass/area check':selected.basis==='osdag-open-unverified'?'Osdag · BIS row pending':selected.basis==='archived-manufacturer-only'?'Historical · verify current':selected.basis.startsWith('secondary-')?'Secondary · BIS review':'Manufacturer · '+src.date;
 $('steelMass').textContent=format(selected.kgPerM);
 $('steelSectionDiagram').innerHTML=shapeSvg(selected.family,selected);
 $('steelProperties').replaceChildren(propertyTable(selected));
 $('steelDataCaution').textContent=bisAudit.status!=='not-checked'?bisAudit.note:selected.basis==='archived-manufacturer-only'?
  'Historical manufacturer data. For RHS verify IS 4923:2017 Amendment 3 (2024); for SHS/CHS check the latest applicable standard.':
  selected.qualityFlag==='mass-area-inconsistent'?'Mass and section area disagree by '+selected.massAreaDeltaPct+'%. Weight calculation is blocked until the row is verified.':
  selected.basis==='osdag-open-unverified'?'Licensed open-source Osdag values; not independently checked against IS 808:2021 or current IS 1161.':
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
 const chsAudit=catalog.standardAudit(selected);
 if(chsAudit.status==='outside-current-scope')throw Error('IS 4923 Amendment 2: steel hollow sections below 2 mm are outside amended structural section scope. Do not use this record for structural quantity calculations.');
 if(['not-listed-in-replacement','spot-checked-conflict'].includes(chsAudit.status))
  throw Error('IS 1161 Amendment 2 review: not an approved current table weight for this size. Choose a listed section.');
 if(selected.qualityFlag==='mass-area-inconsistent'||catalog.auditRow(selected).includes('mass-vs-area'))throw Error('Mass/area conflict in source row — quantity blocked pending review.');
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
 shownLimit=60;
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
 shownLimit=60;selected=null;renderRows();renderDetail();updateSelectedSummary();updateResult();
});
$('steelMoreSizes').addEventListener('click',()=>{shownLimit+=60;renderRows();});
$('steelCustomShape').addEventListener('change',updateCustomInputs);
for(const id of ['steelLength','steelCountPieces','steelRate','steelWidth','steelThickness','steelDiameter','steelSide','steelHeight'])
 $(id).addEventListener('input',updateResult);
$('steelCalculate').addEventListener('click',updateResult);
$('steelExport').addEventListener('click',saveCsv);
$('steelPrint').addEventListener('click',()=>window.print());
setFamily('beam');
})();