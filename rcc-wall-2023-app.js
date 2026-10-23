/* PWD 2023 RCC wall: exact source height/SBC lookup, dimensioned diagram,
 * project label, source reinforcement reference and quantity export.
 * BBS cutting lengths and bar weight calculations deferred.
 */
(function(){
'use strict';
const api=window.PWDRCC2023, section=window.PWDRCC2023Section;
const markSource=window.PWDRCC2023Rebar;
const $=id=>document.getElementById(id);
if(!api||!section||!markSource||!$('rccSbc')||!$('rccHeight')||!$('rccResult'))return;
const sbcSelect=$('rccSbc'),heightSelect=$('rccHeight'),project=$('rccProject');
const q=new URLSearchParams(location.search);
const initialSbc=api.sbcs.includes(Number(q.get('sbc')))?String(Number(q.get('sbc'))):'10';
sbcSelect.value=initialSbc;
let selectedRow=null,selectedSchedule=null;
function fillHeights(preferred){
 const allowed=api.heightsFor(sbcSelect.value);
 heightSelect.replaceChildren();
 for(const height of allowed){
  const option=document.createElement('option');
  option.value=String(height);option.textContent=height.toFixed(1)+' m';
  heightSelect.appendChild(option);
 }
 if(allowed.includes(Number(preferred)))heightSelect.value=String(Number(preferred));
 else if(allowed.length)heightSelect.value=String(allowed[0]);
}
function refreshGeometryQuantity(){
 const report=$('rccGeometryTakeoff'),error=$('rccPlanError');
 const lengthField=$('rccLength');
 report.hidden=true;error.hidden=true;
 if(!selectedRow||lengthField.value==='')return;
 try{
  const q=section.quantityForLength(selectedRow,lengthField.value);
  $('rccPlanRaft').textContent=q.raftConcretePlanningM3.toFixed(3);
  $('rccPlanStem').textContent=q.stemConcretePlanningM3.toFixed(3);
  $('rccPlanConcrete').textContent=q.concretePlanningM3.toFixed(3);
  $('rccPlanPcc').textContent=q.pccLevellingPlanningM3.toFixed(3);
  $('rccPlanArea').textContent=q.crossSectionAreaM2.toFixed(4);
  $('rccPlanBasis').textContent='Entered L: '+q.lengthM+' m · Footing B: '+q.pccLevellingWidthM.toFixed(3)+' m · Levelling PCC: 0.100 m · Source/GAD geometric agreement: ±'+q.sourceDifferenceM3PerM.toFixed(4)+' m³ for a 1 m section.';
  report.hidden=false;
 }catch(e){
  error.textContent='Length-based takeoff unavailable: '+e.message;
  error.hidden=false;
 }
}
function refreshProject(){
 const label=$('rccProjectTitle');
 label.textContent=project.value.trim()?'Work: '+project.value.trim():'';
 label.hidden=!project.value.trim();
}
// Native finger-gesture panning/pinching; no on-screen zoom buttons.
(function enableGestures(){
 const view=$('rccDiagramViewport'),pointers=new Map();
 let zoom=1,dx=0,dy=0;
 function apply(){
  const target=view.querySelector('svg');if(!target)return;
  target.style.transform='translate('+dx+'px,'+dy+'px) scale('+zoom+')';
 }
 function reset(){zoom=1;dx=0;dy=0;apply();}
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 view.addEventListener('pointerdown',e=>{
  view.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 });
 view.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId))return;
  const previous=[...pointers.values()].map(p=>({...p}));
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const current=[...pointers.values()];
  if(current.length===1){
   dx+=current[0].x-previous[0].x;dy+=current[0].y-previous[0].y;
  }else if(current.length===2&&previous.length===2){
   const before=distance(previous[0],previous[1]),after=distance(current[0],current[1]);
   if(before>0)zoom=Math.min(6,Math.max(1,zoom*after/before));
   dx+=((current[0].x+current[1].x)-(previous[0].x+previous[1].x))/2;
   dy+=((current[0].y+current[1].y)-(previous[0].y+previous[1].y))/2;
  }
  apply();
 });
 function stop(e){pointers.delete(e.pointerId);}
 view.addEventListener('pointerup',stop);
 view.addEventListener('pointercancel',stop);
 view.addEventListener('lostpointercapture',stop);
 window.resetRccSectionGesture=reset;
})();
function render(){
 const row=api.recordFor(sbcSelect.value,heightSelect.value);
 if(!row){$('rccResult').hidden=true;selectedRow=null;selectedSchedule=null;return;}
 $('rccResult').hidden=false;selectedRow=row;
 refreshProject();
 $('rccSheet').textContent=row.drawing+' · Original 2023 Part 2, PDF page '+row.pdfPage+' · Height '+row.heightM.toFixed(1)+' m';
 $('rccConcrete').textContent=row.concreteM3.toFixed(row.concreteM3===1.035?3:2);
 $('rccSteel').textContent=row.steelKg.toFixed(2);
 $('rccRatio').textContent=row.printedSteelKgPerM3.toFixed(1);
 const dims=$('rccDims');dims.replaceChildren();
 for(const [letter,mm] of Object.entries(row.dimensionsMm)){
  const item=document.createElement('div');item.className='dim';
  const label=document.createElement('b');label.textContent=letter;
  const value=document.createElement('span');value.textContent=mm.toLocaleString('en-IN')+' mm';
  item.append(label,value);dims.appendChild(item);
 }
 $('rccDiagramContent').innerHTML=section.svg(row); // svg() returns fixed app-authored tags and numeric source-table dimensions only
 window.resetRccSectionGesture();
 const mismatch=$('rccMismatch');
 mismatch.hidden=!row.sourceRatioDiscrepancy;
 mismatch.textContent=row.sourceRatioDiscrepancy?
  'Printed source discrepancy: Concrete '+row.concreteM3+' m³ and steel '+row.steelKg.toFixed(2)+' kg give '+row.computedSteelKgPerM3.toFixed(1)+' kg/m³, but the drawing prints '+row.printedSteelKgPerM3.toFixed(1)+' kg/m³. All three original values are preserved; seek engineering clarification before relying on this ratio.':'';
 const schedule=markSource.reinforcementFor(sbcSelect.value,heightSelect.value);
 const validSchedule=schedule&&schedule.sbc===row.sbc&&schedule.heightM===row.heightM&&schedule.pdfPage===row.pdfPage&&schedule.marks.length===11;
 selectedSchedule=validSchedule?schedule:null;
 $('rccRebarSection').hidden=!validSchedule;
 $('rccRebarUnavailable').hidden=Boolean(validSchedule);
 const tbody=$('rccRebarRows');tbody.replaceChildren();
 if(validSchedule){
  for(const entry of schedule.marks){
   const tr=document.createElement('tr');
   const mark=document.createElement('th');mark.scope='row';mark.textContent=entry.mark;
   const loc=document.createElement('td');loc.textContent=entry.location;
   const dia=document.createElement('td');dia.textContent=entry.present?String(entry.diameterMm):'—';
   const spacing=document.createElement('td');spacing.textContent=entry.present?String(entry.spacingMm):'—';
   tr.append(mark,loc,dia,spacing);tbody.appendChild(tr);
  }
  const omitted=schedule.marks.filter(item=>!item.present).length;
  $('rccRebarCount').textContent='11 marks checked against PWD 2023 sheet · '+(11-omitted)+' shown · '+omitted+' not shown (—).';
 }else{
  $('rccRebarCount').textContent='';
 }
 refreshGeometryQuantity();
 $('rccDrawingLink').href='./library.html?section=design'; // Private original drawing not distributed.
}
fillHeights(q.get('height'));
sbcSelect.addEventListener('change',()=>{const old=heightSelect.value;fillHeights(old);render();});
heightSelect.addEventListener('change',render);
project.addEventListener('input',refreshProject);
$('rccLength').addEventListener('input',refreshGeometryQuantity);
// Export source schedules plus optional GAD-derived concrete quantities, not a BBS.
function csvCell(value){
 let s=String(value??'');
 if(/^\s*[=+\-@\t\r]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function quantityStatementCsv(){
 if(!selectedRow)return null;
 const row=selectedRow,lines=[];
 const add=(...values)=>lines.push(values.map(csvCell).join(','));
 add('PWD 2023 RCC RETAINING WALL · DRAFT QUANTITY STATEMENT');
 add('Work name (optional)',project.value.trim());
 add('Drawing reference',row.drawing);
 add('Original PDF page',row.pdfPage);
 add('SBC · standard drawing (t/m²)',row.sbc);
 add('Standard wall height (m)',row.heightM);
 add('Original PWD concrete (m³ · source table)',row.concreteM3);
 add('Original PWD steel (kg · source table)',row.steelKg);
 add('Printed steel ratio (kg/m³)',row.printedSteelKgPerM3);
 if(row.sourceRatioDiscrepancy)add('CAUTION','Source steel ratio does not reconcile with steel ÷ concrete; verify original drawing');
 add('GAD dimension','Value (mm)');
 for(const [mark,mm] of Object.entries(row.dimensionsMm))add(mark,mm);
 const enteredLength=$('rccLength').value;
 if(enteredLength!==''){
  let qty;
  try{qty=section.quantityForLength(row,enteredLength);}
  catch(error){
   $('rccPlanError').textContent='Cannot export quantity statement: '+error.message;
   $('rccPlanError').hidden=false;
   return null;
  }
  add('GEOMETRY-BASED PLANNING QUANTITIES','Not source-certified bill quantities');
  add('Entered wall length (m)',qty.lengthM);
  add('Raft RCC volume (m³)',qty.raftConcretePlanningM3.toFixed(3));
  add('Stem RCC volume (m³)',qty.stemConcretePlanningM3.toFixed(3));
  add('Total structural RCC (m³)',qty.concretePlanningM3.toFixed(3));
  add('M15 PCC levelling (m³; separate)',qty.pccLevellingPlanningM3.toFixed(3));
  add('Method','A–I geometry area × length; original PWD table values unchanged');
 }
 add('Reinforcement source-only reference','No BBS cutting or project steel calculations');
 add('Mark','GAD location','Diameter (mm)','C/C spacing (mm)');
 if(selectedSchedule)for(const bar of selectedSchedule.marks)
  add(bar.mark,bar.location,bar.present?bar.diameterMm:'—',bar.present?bar.spacingMm:'—');
 add('Excluded','Bar bending, bar counts, cutting lengths, laps, waste, and structural design checks');
 return '\ufeff'+lines.join('\r\n')+'\r\n';
}
$('rccQuantityCsv').addEventListener('click',()=>{
 const csv=quantityStatementCsv();
 if(!csv||!selectedRow)return;
 const filename='PWD_RCC_2023_QUANTITY_'+selectedRow.sbc+'_'+selectedRow.heightM.toFixed(1)+'m.csv';
 if(location.host==='appassets.androidplatform.net'){
  window.prompt('__PWD_ANDROID_CSV_EXPORT_V1__'+JSON.stringify({filename,content:csv}));
  return;
 }
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
 const href=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=href;a.download=filename;
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(href),60000);
});
$('rccPrint').addEventListener('click',()=>window.print());
render();
})();
