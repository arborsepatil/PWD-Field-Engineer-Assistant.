/** RCC 2023 Phase 4: source-based section drawing and optional manual BBS.
 * No formula turns original standard quantities into unverified per-metre rates.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
function load(file){
 const context={module:{exports:{}}};
 vm.runInNewContext(read(file),context,{filename:file});
 return context.module.exports;
}
const data=load('rcc-wall-2023-data.js');
const section=load('rcc-wall-2023-section.js');
const rebar=load('rcc-wall-2023-rebar.js');
const bbs=load('rcc-wall-2023-bbs.js');
const page=read('pwd_rcc_wall_reference.html'),app=read('rcc-wall-2023-app.js');
let validated=0;
for(const sbc of [10,15,25])for(const height of data.heightsFor(sbc)){
 const row=data.recordFor(sbc,height);
 const d=section.geometry(row);
 assert.equal(d.B,d.F+d.E+d.D);
 assert.equal(d.A-d.C,d.H);
 assert.equal(d.A,height*1000);
 assert.equal(d.xHeel,d.F);
 assert.equal(d.xToe,d.F+d.E);
 assert.equal(d.xStemTop,d.xToe-d.I);
 assert.equal(d.pccThicknessMm,100);
 assert.ok(d.G>=d.H&&d.E>=d.I);
 const drawing=section.svg(row);
 assert.ok(drawing.startsWith('<svg '));
 assert.ok(drawing.endsWith('</svg>'));
 for(const label of ['A = '+d.A,'B = '+d.B,'C = '+d.C,'D = '+d.D,'E = '+d.E,'F = '+d.F,'G = '+d.G,'H = '+d.H,'I = '+d.I])
   assert.ok(drawing.includes(label),'Drawing label missing '+sbc+'/'+height+'/'+label);
 assert.ok(drawing.includes('SBC '+sbc+' t/m²'));
 assert.ok(drawing.includes('DIMENSIONED SCHEMATIC'));
 assert.doesNotMatch(drawing,/weep/i);
 validated++;
}
assert.equal(validated,27);
const original=data.recordFor(15,4);
const d=section.geometry(original);
assert.equal(d.B,3000);
assert.equal(d.F,1950);
assert.equal(d.E,450);
assert.equal(d.D,600);
assert.equal(d.G,400);
assert.equal(d.H,300);
assert.equal(d.I,300);
assert.throws(()=>section.geometry({heightM:4,dimensionsMm:{...original.dimensionsMm,B:5000}}),/add to B/);
assert.throws(()=>section.geometry({heightM:4,dimensionsMm:{...original.dimensionsMm,C:1500}}),/relationship/);
assert.ok(Math.abs(bbs.unitMassKgM(12)-0.88781364)<0.0001,'Mass uses steel density 7850 kg/m³');
const schedule=rebar.reinforcementFor(15,4);
const mk7=schedule.marks.find(x=>x.mark==='MK7');
assert.equal(mk7.diameterMm,12);
const result=bbs.estimate(mk7,10,5.2);
assert.equal(result.count,10);assert.equal(result.cutLengthM,5.2);
assert.ok(Math.abs(result.weightKg-(result.kgPerM*52))<1e-10);
for(const [cnt,len] of [[1,0],[1,-1],[0,1],[-1,5],[1.2,5],['',2],[1,''],[2,101]])
 assert.throws(()=>bbs.estimate(mk7,cnt,len));
const omitted=rebar.reinforcementFor(10,2).marks.find(x=>x.mark==='MK2');
assert.throws(()=>bbs.estimate(omitted,1,2),/not shown/);
const w=bbs.worksheet(schedule,{MK7:{count:'10',cutLengthM:'5.2'},MK9:{count:'two',cutLengthM:'3'}});
assert.equal(w.completed,1);assert.equal(w.invalid.length,1);
assert.equal(w.pending.length,schedule.marks.filter(m=>m.present).length-2);
assert.equal(w.allVerified,false);
assert.ok(Math.abs(w.totalWeightKg-result.weightKg)<1e-8);
const csv=bbs.draftCsv('=HYPERLINK("unsafe")',original,schedule,{MK7:{count:10,cutLengthM:5.2}});
assert.ok(csv.includes("'=HYPERLINK")); // spreadsheet formula prefixed with apostrophe
assert.ok(csv.includes('Printed material amounts are source-table values'));
assert.ok(csv.includes('Only completed and valid entries'));
assert.ok(csv.includes('DRAFT BBS TOTAL'));
assert.ok(!csv.includes('undefined'));
for(const id of ['rccProject','rccProjectTitle','rccDiagramViewport','rccDiagramContent','rccBbsSection','rccBbsRows','rccBbsTotal','rccBbsCsv','rccPrint'])
 assert.ok(page.includes('id="'+id+'"'),'Missing RCC Phase4 UI '+id);
for(const asset of ['rcc-wall-2023-section.js','rcc-wall-2023-bbs.js'])
 assert.ok(page.includes('src="./'+asset+'"'), 'Unlinked script '+asset);
assert.ok(page.includes('pinch'));
assert.match(page,/Print \/ Save PDF/);
assert.match(app,/section\.svg\(row\)/);
assert.match(app,/PWDRCC2023BBS/);
assert.match(app,/cutLengthM/);
assert.match(app,/setPointerCapture/);
assert.match(app,/window\.print\(\)/);
assert.match(app,/draftCsv/);
assert.ok(!/\b(projectName|siteLength)\s*\*\s*row\.(concreteM3|steelKg)/.test(app));
assert.doesNotMatch(app,/auto[- ]?design|designApproval/i);
assert.doesNotMatch(page,/masonry/i);
for(const asset of ['rcc-wall-2023-section.js','rcc-wall-2023-bbs.js'])
 assert.ok(read('sw.js').includes("'./"+asset+"'"),'Offline cache excludes '+asset);
console.log('RCC Phase 4 verified: 27 dimensioned cross-sections, optional project label, manual BBS mass, CSV injection guard, no false quantity scaling.');
