/** RCC retaining-wall source schedule contract: compare exact values to printed 2023 drawings. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const source=read('rcc-wall-2023-data.js');
const ui=read('pwd_rcc_wall_reference.html');
const app=read('rcc-wall-2023-app.js');
const context={module:{exports:{}}};
vm.runInNewContext(source,context,{filename:'rcc-wall-2023-data.js'});
const api=context.module.exports;
assert.deepEqual(Array.from(api.sbcs),[10,15,25]);
assert.equal(api.count,27);
assert.deepEqual(Array.from(api.heightsFor(10)),[2,2.5,3,3.5,4,4.5,5]);
assert.deepEqual(Array.from(api.heightsFor(15)),[2,2.5,3,3.5,4,4.5,5,5.5,6,6.5]);
assert.deepEqual(Array.from(api.heightsFor(25)),[4,4.5,5,5.5,6,6.5,7,7.5,8,8.5]);
let count=0,discrepancies=[];
for(const sbc of api.sbcs){
 for(const height of api.heightsFor(sbc)){
  count++;
  const row=api.recordFor(sbc,height);
  assert.equal(row.sbc,sbc);
  assert.equal(row.heightM,height);
  assert.equal(row.dimensionsMm.A,height*1000);
  assert.equal(Object.keys(row.dimensionsMm).join(''),'ABCDEFGHI');
  assert.equal(row.dimensionsMm.H,300);
  assert.equal(row.dimensionsMm.I,300);
  assert.ok(Object.values(row.dimensionsMm).every(x=>Number.isInteger(x)&&x>0));
  assert.ok(row.concreteM3>0&&row.steelKg>0);
  assert.equal(row.pdfPage,({10:210,15:211,25:212})[sbc]);
  assert.equal(row.gadPage,209);
  assert.ok(row.drawing.includes('RETWALL/151-'));
  if(row.sourceRatioDiscrepancy)discrepancies.push({sbc,height});
 }
}
assert.equal(count,27);
assert.deepEqual(discrepancies,[{sbc:25,height:4.5}]);
const p10=api.recordFor(10,2);
assert.equal(p10.dimensionsMm.B,1750);
assert.equal(p10.dimensionsMm.C,1700);
assert.equal(p10.concreteM3,1.035);
assert.equal(p10.steelKg,57.28);
assert.equal(p10.printedSteelKgPerM3,55.4);
const p15=api.recordFor(15,6.5);
assert.equal(p15.dimensionsMm.D,1700);
assert.equal(p15.dimensionsMm.F,2650);
assert.equal(p15.concreteM3,5.15);
assert.equal(p15.steelKg,372.77);
assert.equal(p15.printedSteelKgPerM3,72.4);
const p25=api.recordFor(25,8.5);
assert.equal(p25.dimensionsMm.B,5700);
assert.equal(p25.dimensionsMm.C,8200);
assert.equal(p25.concreteM3,8.25);
assert.equal(p25.steelKg,651.59);
assert.equal(p25.printedSteelKgPerM3,79.0);
const mismatch=api.recordFor(25,4.5);
assert.equal(mismatch.concreteM3,2.82);
assert.equal(mismatch.steelKg,156.69);
assert.equal(mismatch.printedSteelKgPerM3,56.3);
assert.ok(Math.abs(mismatch.computedSteelKgPerM3-55.56382978723404)<1e-7);
assert.equal(api.recordFor(10,2.75),null,'No interpolated standard plan allowed');
assert.equal(api.recordFor(25,3),null,'Height outside table must not be selected');
assert.equal(api.recordFor(20,4),null,'Unsupported SBC must not auto-select nearest');
assert.equal(api.recordFor(25,''),null,'Blank height must never select a plan');
for(const id of ['rccSbc','rccHeight','rccResult','rccDims','rccMismatch','rccDrawingLink'])
 assert.match(ui,new RegExp('id="'+id+'"'));
assert.match(ui,/src="\.\/rcc-wall-2023-data\.js"/);
assert.match(ui,/src="\.\/rcc-wall-2023-app\.js"/);
assert.ok(!ui.includes('pdf_viewer.html')&&ui.includes('./library.html?section=design'),'Source-derived RCC data must not open a private PDF from the shared app');
assert.match(ui,/minor bridges\/culverts with raft foundations/i);
assert.match(ui,/no source-steel extrapolation or BBS calculations are included/);
assert.match(ui,/geometry-based length estimates are shown separately/i);
new vm.Script(app,{filename:'rcc-wall-2023-app.js'});
assert.match(app,/sourceRatioDiscrepancy/);
assert.match(app,/\.textContent=/);
assert.doesNotMatch(app,/Math\.round\(.*height|Math\.ceil\(.*height/i);
// Keep the engineering type-plan exact-height data and bar schedule aligned.
const rebarSrc=read('rcc-wall-2023-rebar.js');
const rebarContext={module:{exports:{}}};
vm.runInNewContext(rebarSrc,rebarContext,{filename:'rcc-wall-2023-rebar.js'});
const rebar=rebarContext.module.exports;
assert.equal(rebar.count,27);
assert.equal(rebar.markNames.length,11);
assert.deepEqual(Array.from(rebar.markNames),Array.from({length:11},(_,i)=>'MK'+(i+1)));
let cells=0,notShown=0;
for(const sbc of api.sbcs){
 for(const height of api.heightsFor(sbc)){
  const row=api.recordFor(sbc,height);
  const schedule=rebar.reinforcementFor(sbc,height);
  assert.equal(schedule.pdfPage,row.pdfPage,'Rebar sheet must match dimensions sheet');
  assert.equal(schedule.heightM,row.heightM);
  assert.equal(schedule.sbc,row.sbc);
  assert.equal(schedule.marks.length,11);
  assert.ok(schedule.marks.every(m=>typeof m.location==='string'&&m.location.length>12),'Missing GAD mark location');
  for(const mark of schedule.marks){
   cells++;
   if(mark.present){
    assert.ok([10,12,16,20].includes(mark.diameterMm),'Printed diameter must be transcribed');
    assert.ok(Number.isInteger(mark.spacingMm)&&mark.spacingMm>=110&&mark.spacingMm<=250);
   }else{
    notShown++;
    assert.equal(mark.diameterMm,null,'Absent bar diameter must remain unset');
    assert.equal(mark.spacingMm,null,'Absent bar spacing must remain unset');
   }
  }
 }
}
assert.equal(cells,297);
assert.equal(notShown,10,'Original MK2/MK8 absent cells must remain dashes');
const mk=(sbc,height,name)=>rebar.reinforcementFor(sbc,height).marks.find(x=>x.mark===name);
assert.equal(mk(10,2,'MK2').present,false);
assert.match(mk(10,2,'MK1').location,/Raft bottom/);
assert.match(mk(10,2,'MK2').location,/toe-side/);
assert.match(mk(15,6.5,'MK5').location,/heel-side/);
assert.match(mk(25,8,'MK11').location,/non-earth face/);
assert.equal(mk(10,3,'MK8').diameterMm,10);
assert.equal(mk(10,4,'MK7').diameterMm,12);
assert.equal(mk(15,2.5,'MK7').spacingMm,150);
assert.equal(mk(15,3.5,'MK2').spacingMm,220);
assert.equal(mk(15,6.5,'MK4').diameterMm,16);
assert.equal(mk(15,6.5,'MK10').spacingMm,150);
assert.equal(mk(25,5,'MK4').diameterMm,16);
assert.equal(mk(25,6.5,'MK10').spacingMm,170);
assert.equal(mk(25,7.5,'MK6').spacingMm,130);
assert.equal(mk(25,8.5,'MK2').diameterMm,16);
assert.equal(mk(25,8.5,'MK4').diameterMm,20);
assert.equal(mk(25,8.5,'MK10').spacingMm,110);
assert.equal(mk(25,8.5,'MK11').spacingMm,150);
assert.equal(rebar.reinforcementFor(25,6.75),null,'No interpolation of bar spacing');
assert.equal(rebar.reinforcementFor(20,6),null,'Unlisted SBC must not receive a schedule');
assert.equal(rebar.reinforcementFor(15,''),null,'Blank wall height must not receive reinforcement');
for(const id of ['rccRebarSection','rccRebarRows','rccRebarCount','rccRebarUnavailable'])
 assert.ok(ui.includes('id="'+id+'"'),'Missing RCC rebar UI '+id);
assert.match(ui,/src="\.\/rcc-wall-2023-rebar\.js"/);
assert.match(app,/PWDRCC2023Rebar/);
assert.match(app,/schedule\.pdfPage===row\.pdfPage/);
assert.match(app,/entry\.present\?String\(entry\.diameterMm\):'—'/);
assert.doesNotMatch(app,/barLength|barWeight|bendSchedule|calcBarMass/i);
assert.ok(read('sw.js').includes('./rcc-wall-2023-rebar.js'),'Rebar lookup not cached offline');
console.log('2023 reinforcement QA passed: 27 sets, 297 MK entries, 10 source dashes, no unsupported heights or fabricated BBS.');
console.log('RCC 2023 source schedule QA passed: 27 exact height/SBC records, A-I dimensions, concrete, steel, source page links, one printed inconsistency preserved.');
