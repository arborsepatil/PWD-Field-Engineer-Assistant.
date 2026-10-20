/* PWD 2023 RCC wall: exact source height/SBC lookup, dimensioned diagram,
 * project label and optional manual engineer-controlled draft BBS.
 * No extrapolated/derived type-plan quantities or automatic bar cut lengths.
 */
(function(){
'use strict';
const api=window.PWDRCC2023, section=window.PWDRCC2023Section;
const bbs=window.PWDRCC2023BBS, markSource=window.PWDRCC2023Rebar;
const $=id=>document.getElementById(id);
if(!api||!section||!bbs||!markSource||!$('rccSbc')||!$('rccHeight')||!$('rccResult'))return;
const sbcSelect=$('rccSbc'),heightSelect=$('rccHeight'),project=$('rccProject');
const q=new URLSearchParams(location.search);
const initialSbc=api.sbcs.includes(Number(q.get('sbc')))?String(Number(q.get('sbc'))):'10';
sbcSelect.value=initialSbc;
let selectedRow=null,selectedSchedule=null,draftValues={};
function draftKey(){
 // Keeps different project names and different source configurations isolated.
 const name=project.value.trim().toLowerCase().slice(0,180);
 return 'pwd-rcc-bbs-draft-v1:'+encodeURIComponent(name)+':'+sbcSelect.value+':'+heightSelect.value;
}
function readDraft(){
 try{
  const raw=window.localStorage.getItem(draftKey());
  const saved=raw?JSON.parse(raw):null;
  if(saved&&typeof saved==='object'&&!Array.isArray(saved))return saved;
 }catch(_e){ /* Storage might be disabled; worksheet remains usable in memory. */ }
 return {};
}
function saveDraft(){
 try{window.localStorage.setItem(draftKey(),JSON.stringify(draftValues));}
 catch(_e){ /* Do not break quantity calculations when storage is unavailable. */ }
}

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
function updateBbs(){
 if(!selectedSchedule)return;
 const result=bbs.worksheet(selectedSchedule,draftValues);
 const total=$('rccBbsTotal'),status=$('rccBbsStatus');
 total.textContent='Draft steel weight from entered bars: '+result.totalWeightKg.toFixed(3)+' kg';
 status.textContent=result.completed+' valid mark entries · '+result.pending.length+' not completed · '+
   result.invalid.length+' invalid. '+(result.allVerified?'All listed source marks entered; engineering review still required.':'Partial total only, not a completed BBS.');
 for(const item of selectedSchedule.marks){
  if(!item.present)continue;
  const weightCell=$('rccBbsMass_'+item.mark);
  const filled=result.items.find(x=>x.mark===item.mark);
  const bad=result.invalid.find(x=>x.mark===item.mark);
  weightCell.textContent=filled?filled.weightKg.toFixed(3):bad?'Check input':'—';
 }
}
function buildBbs(schedule){
 const tbody=$('rccBbsRows');
 tbody.replaceChildren();
 draftValues=readDraft();
 for(const entry of schedule.marks){
  const tr=document.createElement('tr');
  const mark=document.createElement('th');mark.scope='row';mark.textContent=entry.mark;
  const info=document.createElement('td');info.textContent=entry.present?entry.diameterMm+' mm @ '+entry.spacingMm+' C/C':'Not shown in source';
  const tdCount=document.createElement('td'),tdLength=document.createElement('td'),tdMass=document.createElement('td');
  const mass=document.createElement('span');mass.id='rccBbsMass_'+entry.mark;
  mass.textContent='—';tdMass.appendChild(mass);
  if(entry.present){
   const count=document.createElement('input');count.type='number';count.min='1';count.max='1000000';count.step='1';count.placeholder='Count';count.setAttribute('aria-label',entry.mark+' engineer-entered bar count');
   const len=document.createElement('input');len.type='number';len.min='0.001';len.max='100';len.step='0.001';len.placeholder='metres';len.setAttribute('aria-label',entry.mark+' engineer-verified cutting length in metres');
   const saved=draftValues[entry.mark]||{};
   count.value=String(saved.count??'');
   len.value=String(saved.cutLengthM??'');
   const update=()=>{
    draftValues[entry.mark]={count:count.value,cutLengthM:len.value};
    saveDraft();
    updateBbs();
   };
   count.addEventListener('input',update);len.addEventListener('input',update);
   tdCount.appendChild(count);tdLength.appendChild(len);
  }else{
   tdCount.textContent='—';tdLength.textContent='—';
  }
  tr.append(mark,info,tdCount,tdLength,tdMass);tbody.appendChild(tr);
 }
 updateBbs();
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
 $('rccBbsSection').hidden=!validSchedule;
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
  buildBbs(schedule);
 }else{
  $('rccRebarCount').textContent='';draftValues={};
 }
 refreshGeometryQuantity();
 $('rccDrawingLink').href='./pdf_viewer.html?doc=bridge2023&page='+row.pdfPage;
}
fillHeights(q.get('height'));
sbcSelect.addEventListener('change',()=>{const old=heightSelect.value;fillHeights(old);render();});
heightSelect.addEventListener('change',render);
project.addEventListener('input',refreshProject);
$('rccLength').addEventListener('input',refreshGeometryQuantity);
project.addEventListener('change',render); // Switch BBS draft context when project name changes.
$('rccBbsCsv').addEventListener('click',()=>{
 if(!selectedRow||!selectedSchedule)return;
 let planning=null;
 if($('rccLength').value!==''){
  try{planning=section.quantityForLength(selectedRow,$('rccLength').value);}
  catch(_e){ /* Invalid project length is reported on-screen; export BBS alone. */ }
 }
 const csv=bbs.draftCsv(project.value.trim(),selectedRow,selectedSchedule,draftValues,planning);
 const filename='PWD_RCC_2023_BBS_'+selectedRow.sbc+'_'+selectedRow.heightM.toFixed(1)+'m.csv';
 if(location.host==='appassets.androidplatform.net'){
   // Origin-restricted Android handler presents ACTION_CREATE_DOCUMENT.
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
