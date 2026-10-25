/* PWD Field Assistant Steel Table V1 — entirely offline catalogue and calculator.
 * Material table rows are dated SAIL manufacturer records, NOT copyrighted
 * third-party APK content. Dimensional drawings are illustrative originals.
 * RCC retaining wall/BBS code is deliberately untouched.
 */
(function(){
'use strict';
const catalog=window.PWDSteelCatalog,math=window.PWDSteelMath,comparison=window.PWDSteelCompare,steelStatus=window.PWDSteelStatus,$=id=>document.getElementById(id);
if(!catalog||!math||!comparison||!steelStatus||!window.PWDSteelDiagram||!$('steelFamilies'))return;
let family='beam',selected=null,last=null,lastEntry=null,shownLimit=60,compareIds=[];
const source=id=>catalog.SOURCES[id];
const format=(x,d=2)=>Number(x).toLocaleString('en-IN',{maximumFractionDigits:d,minimumFractionDigits:d});
const text=(el,value)=>{el.textContent=String(value)};
function shapeSvg(type,data={}){
 // Engineering envelope at one scale, with source-status limitations in SVG <desc>.
 return window.PWDSteelDiagram.svg(type,data);
}
function setFamily(next){
 if(next!==family)compareIds=[];
 family=next;selected=null;last=null;lastEntry=null;shownLimit=60;
 $('steelCompareCard').hidden=next==='calculated';
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
 $('steelKeyAudit').dataset.audit='review';$('steelKeyAudit').textContent='Theoretical geometry only · not a BIS published nominal section.';
  $('steelQuantitySourceGate').textContent='Theoretical calculation from user-entered geometry only; no published BIS nominal mass.';
  $('steelCalculate').disabled=false;
  updateCustomInputs();
 }else{
  $('sourceLinks').hidden=false;
  renderRows();
  renderDetail();
 }
 updateSelectedSummary();
 updateResult();
 renderComparison();
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
 $('steelCompareAdd').hidden=custom||!selected;
 if(!custom&&selected)$('steelCompareAdd').textContent=compareIds.includes(selected.id)?'− Remove from comparison':'+ Add this size to comparison';
 $('steelPickedStatus').textContent=custom?'Theoretical weight':!selected?'':bisAudit.status==='is808-numeric-conflict'?'⚠ IS 808:2021 source mismatch':bisAudit.geometryChecked?'IS 808:2021 · geometric dimensions checked':bisAudit.status==='is808-mass-area-inertia-checked'?'IS 808:2021 · mass/area/inertia checked':bisAudit.status==='is808-mass-checked'?'IS 808:2021 · nominal kg/m checked':bisAudit.status==='spot-checked-match'?'BIS 2023 · sample checked':bisAudit.status==='spot-checked-conflict'?'⚠ BIS value conflict':bisAudit.status==='outside-current-scope'?'⚠ Below IS 4923 minimum':bisAudit.status==='source-numeric-hold'?'⚠ Source row on hold':bisAudit.status==='mass-area-conflict'?'⚠ Mass/area conflict':bisAudit.status==='shs-row-checked'?'SHS · BIS nominal data checked':bisAudit.status==='shs-row-conflict'?'⚠ SHS BIS numeric conflict':bisAudit.status==='rhs-weight-checked'?'RHS · BIS amended kg/m checked':bisAudit.status==='rhs-weight-conflict'?'⚠ RHS BIS mass conflict':bisAudit.status==='amendment3-review'?'RHS · BIS Amd.3 review pending':bisAudit.status==='not-listed-in-replacement'?'⚠ Historical size · not current listed':selected.basis==='archived-manufacturer-only'?'Historic · BIS recheck needed':
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
 const rawRows=catalog.search($('steelSearch').value,family,$('steelSeries').value||'all');
 const snapshot=steelStatus.select(catalog,comparison,rawRows,$('steelAuditFilter').value);
 const rows=snapshot.rows;
 const counts=snapshot.counts;
 $('steelAuditSummary').textContent='Matches: '+snapshot.total+' sections · '+counts.checked+' limited source-checked · '+counts.review+' pending · '+counts.hold+' on hold. Only limited-checked records allow provisional quantity arithmetic.';
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
  subtitle.textContent=format(row.kgPerM,2)+' kg/m'+(status==='is808-numeric-conflict'?' · IS 808 source conflict':status==='is808-mass-area-inertia-checked'?' · IS 808 mass/area/inertia checked':status==='is808-mass-checked'?' · IS 808 kg/m checked':status==='spot-checked-match'?' · 2023 spot-check':status==='not-listed-in-replacement'?' · Historical / unlisted':status==='spot-checked-conflict'?' · BIS conflict':status==='outside-current-scope'?' · Outside IS 4923 scope':status==='source-numeric-hold'?' · Source table row on hold':status==='mass-area-conflict'?' · Mass/area inconsistency':status==='shs-row-checked'?' · BIS numeric sample checked':status==='shs-row-conflict'?' · BIS numeric conflict':status==='rhs-weight-checked'?' · BIS kg/m checked':status==='rhs-weight-conflict'?' · BIS kg/m conflict':status==='amendment3-review'?' · Amd.3 not verified':row.basis==='archived-manufacturer-only'?' · Archive':
 row.basis==='osdag-open-unverified'?' · Open source':['secondary-unverified','secondary-amendment-unverified'].includes(row.basis)?' · Secondary':'');
  const quantityState=comparison.quantityGate(catalog,row);
  if(!quantityState.allowed)subtitle.textContent+=' · '+(quantityState.category==='hold'?'HOLD · no quantity':'Reference only · no quantity');
  btn.append(name,subtitle);
  btn.addEventListener('click',()=>{selected=row;renderRows();renderDetail();updateSelectedSummary();updateResult();});
  const holder=document.createElement('div');holder.className='size-row';
  const add=document.createElement('button');add.type='button';add.className='size-compare';
  add.textContent=compareIds.includes(row.id)?'✓ Added':'+ Compare';
  add.setAttribute('aria-label',(compareIds.includes(row.id)?'Remove ':'Add ')+row.designation+(compareIds.includes(row.id)?' from':' to')+' comparison');
  add.setAttribute('aria-pressed',String(compareIds.includes(row.id)));
  add.addEventListener('click',()=>toggleCompare(row));
  holder.append(btn,add);root.append(holder);
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
  ['Root radius R₁ (mm)',row.r1Mm],
  ['Toe radius R₂ (mm)',row.r2Mm],
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
 $('steelStatus').textContent=bisAudit.status==='is808-numeric-conflict'?'⚠ IS 808 numeric conflict':bisAudit.geometryChecked?'IS 808:2021 · dimensions and section properties checked':bisAudit.status==='is808-mass-area-inertia-checked'?'IS 808:2021 · mass/area/inertia checked':bisAudit.status==='is808-mass-checked'?'IS 808:2021 · nominal kg/m checked':bisAudit.status==='spot-checked-match'?'IS 1161:2014 Amd.2 · sample checked':bisAudit.status==='spot-checked-conflict'?'⚠ Conflicts with BIS':bisAudit.status==='outside-current-scope'?'⚠ Below IS 4923 minimum':bisAudit.status==='source-numeric-hold'?'⚠ BIS source discrepancy · hold':bisAudit.status==='mass-area-conflict'?'⚠ Mass/area inconsistency':bisAudit.status==='shs-row-checked'?'IS 4923 · SHS checked sample':bisAudit.status==='shs-row-conflict'?'⚠ SHS BIS conflict':bisAudit.status==='rhs-weight-checked'?'IS 4923 · nominal mass checked':bisAudit.status==='rhs-weight-conflict'?'⚠ RHS BIS mass conflict':bisAudit.status==='amendment3-review'?'RHS · BIS Amd.3 not verified':bisAudit.status==='not-listed-in-replacement'?'⚠ Not listed in 2023 Table 1':selected.qualityFlag==='mass-area-inconsistent'?'⚠ Mass/area check':selected.basis==='osdag-open-unverified'?'Osdag · BIS row pending':selected.basis==='archived-manufacturer-only'?'Historical · verify current':selected.basis.startsWith('secondary-')?'Secondary · BIS review':'Manufacturer · '+src.date;
 const auditState=comparison.audit(catalog,selected);
 $('steelKeyAudit').dataset.audit=auditState.status;
 $('steelKeyAudit').textContent=auditState.status==='hold'?'HOLD · Source conflict or incomplete record. Do not use this nominal weight for quantity calculations.':auditState.status==='checked'?'Selected numerical values checked · NOT a complete standard, material or design certification.':'Source-only weight · BIS row still needs verification before approval use.';
 $('steelMass').textContent=format(selected.kgPerM);
 const quantityState=comparison.quantityGate(catalog,selected);
 $('steelCalculate').disabled=!quantityState.allowed;
 $('steelQuantitySourceGate').textContent=quantityState.message;
 $('steelQuantitySourceGate').dataset.status=quantityState.category;
 const dim=comparison.dimension(selected);
 $('steelDepthLabel').textContent=dim.first;
 $('steelWidthLabel').textContent=dim.second;
 $('steelMainDepth').textContent=dim.depth===null?'—':format(dim.depth,2).replace(/\.00$/,'');
 $('steelMainWidth').textContent=dim.width===null?'—':format(dim.width,2).replace(/\.00$/,'');
 $('steelMainThicknessLabel').textContent=['beam','column','channel','pile'].includes(selected.family)?'Web thickness':selected.family==='hollow'?'Wall thickness':'Thickness';
 $('steelMainThickness').textContent=dim.thickness===null?'—':format(dim.thickness,2).replace(/\.00$/,'');
 $('steelSectionDiagram').innerHTML=shapeSvg(selected.family,selected);
 const diagram=window.PWDSteelDiagram.model(selected.family,selected);
 $('steelDiagramStatus').textContent=diagram.warnings.length?diagram.warnings.join(' '):'Source-proportional schematic; nominal dimensions only.';
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
 $('steelDepthLabel').textContent='Nominal depth / size';
 $('steelWidthLabel').textContent='Width';
 $('steelMainThicknessLabel').textContent='Thickness';
 $('steelMainDepth').textContent='User entered';
 $('steelMainWidth').textContent='—';
 $('steelMainThickness').textContent='—';
 $('steelSectionDiagram').innerHTML=shapeSvg(type);
 $('steelDiagramStatus').textContent='Theoretical illustration · user-entered geometry is not BIS-certified.';
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
 if(chsAudit.status==='is808-numeric-conflict')throw Error('IS 808:2021: this archived or secondary steel profile conflicts with the checked BIS mass or section properties. Quantity blocked. Select the current checked matching variant.');
 if(chsAudit.status==='source-numeric-hold')throw Error('IS 4923:2017 RHS 120×80×6 has an unresolved numeric source-table discrepancy. Weight calculation is on hold; do not use an inferred area as a BIS correction.');
 if(chsAudit.status==='mass-area-conflict')throw Error('IS 4923:2017 nominal mass and area are inconsistent in this source record. Calculation blocked for engineering review.');
 if(chsAudit.status==='rhs-weight-conflict')throw Error('IS 4923:2017 amended RHS numeric record conflicts with BIS source. Quantity blocked pending correction.');
 if(chsAudit.status==='shs-row-conflict')throw Error('IS 4923:2017 amended SHS nominal record conflicts with BIS source. Quantity blocked pending correction.');
 if(chsAudit.status==='outside-current-scope')throw Error('IS 4923 Amendment 2: steel hollow sections below 2 mm are outside amended structural section scope. Do not use this record for structural quantity calculations.');
 if(['not-listed-in-replacement','spot-checked-conflict'].includes(chsAudit.status))
  throw Error('IS 1161 Amendment 2 review: not an approved current table weight for this size. This OD/thickness combination is not tabulated in the replacement Table 1. Clause 6.1.3 may allow a thicker tube by purchaser–manufacturer agreement; this archival kg/m still requires separate technical verification, so calculation stays blocked.');
 if(selected.qualityFlag==='mass-area-inconsistent'||catalog.auditRow(selected).includes('mass-vs-area'))throw Error('Mass/area conflict in source row — quantity blocked pending review.');
 // Selected BIS source check is mandatory for preliminary nominal quantity arithmetic.
 // All historic, secondary, unsampled and internally conflicting rows remain reference only.
 const eligibility=comparison.quantityGate(catalog,selected);
 if(!eligibility.allowed)throw Error(eligibility.message);
 const q=math.quantity(selected,L,N,rate),src=source(selected.sourceId);
 return {q,entry:{...selected,sourceLabel:src.label+' · '+(selected.sourceUrl||src.url),sourceDate:src.date,sourceStatus:chsAudit.geometryChecked?'IS 808:2021 selected mass, area, inertia and web/flange/radius geometry checked; NOT design/MTC certified':chsAudit.status==='is808-mass-area-inertia-checked'?'IS 808:2021 selected mass/area/Izz/Iyy checked; NOT design/MTC certified':chsAudit.status==='is808-mass-checked'?'IS 808:2021 selected nominal mass checked; other properties and MTC not certified':chsAudit.status==='rhs-weight-checked'?'BIS amended nominal kg/m spot-check; not product/design certification':chsAudit.status==='shs-row-checked'?'BIS SHS nominal table spot-check; not product/design certification':selected.basis}};
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
function toggleCompare(row){
 if(family==='calculated'||row.family!==family)return;
 const idx=compareIds.indexOf(row.id);
 if(idx>=0)compareIds.splice(idx,1);
 else if(compareIds.length<8)compareIds.push(row.id);
 else {$('steelCompareSummary').textContent='Up to 8 sizes can be shown together. Remove one before adding another.';return;}
 renderRows();renderComparison();
}
function renderComparison(){
 const chipBox=$('steelCompareChips'),result=$('steelCompareResults');
 chipBox.replaceChildren();result.replaceChildren();
 const items=compareIds.map(id=>catalog.byId(id)).filter(row=>row&&row.family===family);
 compareIds=items.map(row=>row.id);
 $('steelCompareEmpty').hidden=items.length!==0;
 $('steelCompareClear').hidden=items.length===0;
 $('steelCompareCard').hidden=family==='calculated';
 const message=$('steelCompareSummary');
 if(items.length===0){message.textContent='';result.hidden=true;return;}
 for(const row of items){
  const chip=document.createElement('div');chip.className='compare-chip';
  const label=document.createElement('span');label.textContent=row.designation;
  const button=document.createElement('button');button.type='button';button.textContent='×';
  button.setAttribute('aria-label','Remove '+row.designation+' from comparison');
  button.addEventListener('click',()=>toggleCompare(row));
  chip.append(label,button);chipBox.append(chip);
 }
 if(items.length<2){result.hidden=true;message.textContent='1 size added · select at least one more size of this member type.';return;}
 const rows=comparison.build(catalog,items);
 message.textContent=rows.length+' sizes compared · scroll sideways on mobile · not a design or load-capacity comparison.';
 const table=document.createElement('table');
 const heading=document.createElement('thead'),header=document.createElement('tr');
 for(const label of ['Property',...rows.map(x=>x.designation)]){
  const th=document.createElement('th');th.textContent=label;header.append(th);
 }
 heading.append(header);table.append(heading);
 const tbody=document.createElement('tbody');
 const v=x=>x===null||x===undefined||!Number.isFinite(Number(x))?'—':format(x,3).replace(/0+$/,'').replace(/\.$/,'');
 const properties=[
  ['Weight (kg/m)',x=>x.audit.status==='hold'?format(x.kgPerM,2)+' · HOLD':x.audit.status==='review'?format(x.kgPerM,2)+' · UNVERIFIED':format(x.kgPerM,2)+' · limited check'],
  ['Depth / leg (mm)',x=>v(x.depthMm)],
  ['Width / leg (mm)',x=>v(x.widthMm)],
  ['Web/wall/leg thickness (mm)',x=>v(x.thicknessMm)],
  ['Flange thickness (mm)',x=>v(x.flangeMm)],
  ['Area (cm²)',x=>v(x.areaCm2)],
  ['Izz (cm⁴)',x=>v(x.ixCm4)],
  ['Iyy (cm⁴)',x=>v(x.iyCm4)],
  ['Source audit',x=>x.audit.label],
  ['Source reference',x=>x.designationSource]
 ];
 for(const [label,value] of properties){
  if(['Flange thickness (mm)','Area (cm²)','Izz (cm⁴)','Iyy (cm⁴)'].includes(label)&&rows.every(x=>{
   const key=label==='Flange thickness (mm)'?'flangeMm':label==='Area (cm²)'?'areaCm2':label==='Izz (cm⁴)'?'ixCm4':'iyCm4';
   return x[key]===null;
  }))continue;
  const tr=document.createElement('tr'),th=document.createElement('td');th.textContent=label;tr.append(th);
  for(const row of rows){const td=document.createElement('td');td.textContent=value(row);tr.append(td)}
  tbody.append(tr);
 }
 table.append(tbody);result.append(table);result.hidden=false;
}
function showStandards(){
 const all=steelStatus.summarize(catalog,comparison,catalog.sections);
 $('steelCatalogueAudit').textContent='Catalogue: '+all.total+' records · '+all.counts.checked+' limited source-checked · '+all.counts.review+' pending verification · '+all.counts.hold+' on hold. Quantity calculations remain restricted to checked source rows only.';
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
$('steelAuditFilter').addEventListener('change',()=>{shownLimit=60;renderRows();renderDetail();updateSelectedSummary();updateResult();});
$('steelSeries').addEventListener('change',()=>{
 shownLimit=60;selected=null;renderRows();renderDetail();updateSelectedSummary();updateResult();
});
$('steelMoreSizes').addEventListener('click',()=>{shownLimit+=60;renderRows();});
$('steelCustomShape').addEventListener('change',updateCustomInputs);
for(const id of ['steelLength','steelCountPieces','steelRate','steelWidth','steelThickness','steelDiameter','steelSide','steelHeight'])
 $(id).addEventListener('input',updateResult);
$('steelCalculate').addEventListener('click',updateResult);
$('steelCompareAdd').addEventListener('click',()=>{if(selected)toggleCompare(selected)});
$('steelCompareClear').addEventListener('click',()=>{compareIds=[];renderRows();renderComparison();});
setFamily('beam');
})();