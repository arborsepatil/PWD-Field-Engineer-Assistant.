/* Read-only PWD 2023 RCC retaining-wall source-table selector.
 * Never derives geometry, interpolates heights, or scales quantities by length.
 */
(function(){
'use strict';
const api=window.PWDRCC2023;
const $=id=>document.getElementById(id);
if(!api||!$('rccSbc')||!$('rccHeight')||!$('rccResult'))return;
const sbcSelect=$('rccSbc'),heightSelect=$('rccHeight');
const q=new URLSearchParams(location.search);
const initialSbc=api.sbcs.includes(Number(q.get('sbc')))?String(Number(q.get('sbc'))):'10';
sbcSelect.value=initialSbc;
function fillHeights(preferred) {
 const allowed=api.heightsFor(sbcSelect.value);
 heightSelect.replaceChildren();
 for(const height of allowed){
  const opt=document.createElement('option');
  opt.value=String(height);
  opt.textContent=height.toFixed(1)+' m';
  heightSelect.appendChild(opt);
 }
 if(allowed.includes(Number(preferred)))heightSelect.value=String(Number(preferred));
 else if(allowed.length)heightSelect.value=String(allowed[0]);
}
function render(){
 const row=api.recordFor(sbcSelect.value,heightSelect.value);
 if(!row){$('rccResult').hidden=true;return;}
 $('rccResult').hidden=false;
 $('rccSheet').textContent=row.drawing+' · Original 2023 Part 2, PDF page '+row.pdfPage+' · Height '+row.heightM.toFixed(1)+' m';
 $('rccConcrete').textContent=row.concreteM3.toFixed(row.concreteM3===1.035?3:2);
 $('rccSteel').textContent=row.steelKg.toFixed(2);
 $('rccRatio').textContent=row.printedSteelKgPerM3.toFixed(1);
 const dims=$('rccDims');
 dims.replaceChildren();
 for(const [letter,mm] of Object.entries(row.dimensionsMm)){
  const item=document.createElement('div');
  item.className='dim';
  const label=document.createElement('b');label.textContent=letter;
  const value=document.createElement('span');value.textContent=mm.toLocaleString('en-IN')+' mm';
  item.append(label,value);dims.appendChild(item);
 }
 const mismatch=$('rccMismatch');
 mismatch.hidden=!row.sourceRatioDiscrepancy;
 mismatch.textContent=row.sourceRatioDiscrepancy?
  'Printed source discrepancy: Concrete '+row.concreteM3+' m³ and steel '+row.steelKg.toFixed(2)+' kg give '+row.computedSteelKgPerM3.toFixed(1)+' kg/m³, but the drawing prints '+row.printedSteelKgPerM3.toFixed(1)+' kg/m³. All three original values are preserved; seek engineering clarification before relying on this ratio.':'';
 const markSource=window.PWDRCC2023Rebar;
 const schedule=markSource&&markSource.reinforcementFor(sbcSelect.value,heightSelect.value);
 const validSchedule=schedule&&schedule.sbc===row.sbc&&schedule.heightM===row.heightM&&schedule.pdfPage===row.pdfPage&&schedule.marks.length===11;
 $('rccRebarSection').hidden=!validSchedule;
 $('rccRebarUnavailable').hidden=Boolean(validSchedule);
 const barBody=$('rccRebarRows');
 barBody.replaceChildren();
 if(validSchedule){
  for(const entry of schedule.marks){
   const tr=document.createElement('tr');
   const mark=document.createElement('th');mark.scope='row';mark.textContent=entry.mark;
   const dia=document.createElement('td');dia.textContent=entry.present?String(entry.diameterMm):'—';
   const spacing=document.createElement('td');spacing.textContent=entry.present?String(entry.spacingMm):'—';
   tr.append(mark,dia,spacing);barBody.appendChild(tr);
  }
  const omitted=schedule.marks.filter(item=>!item.present).length;
  $('rccRebarCount').textContent='11 marks checked against PWD 2023 sheet · '+(11-omitted)+' shown · '+omitted+' not shown (—).';
 }else{
  $('rccRebarCount').textContent='';
 }
 $('rccDrawingLink').href='./pdf_viewer.html?doc=bridge2023&page='+row.pdfPage;
}
fillHeights(q.get('height'));
sbcSelect.addEventListener('change',()=>{
 const old=heightSelect.value;
 fillHeights(old);
 render();
});
heightSelect.addEventListener('change',render);
render();
})();
