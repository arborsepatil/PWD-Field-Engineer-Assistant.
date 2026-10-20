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
for(const id of ['rccProject','rccProjectTitle','rccDiagramViewport','rccDiagramContent','rccQuantityCsv','rccPrint'])
 assert.ok(page.includes('id="'+id+'"'),'Missing RCC Phase4 UI '+id);
for(const asset of ['rcc-wall-2023-section.js'])
 assert.ok(page.includes('src="./'+asset+'"'), 'Unlinked script '+asset);
assert.ok(page.includes('pinch'));
assert.ok(!page.includes('.links,.note.warn,'),'Source inconsistency warning must remain printable');
assert.match(page,/Print \/ Save PDF/);
assert.match(app,/section\.svg\(row\)/);
assert.doesNotMatch(app,/PWDRCC2023BBS/);
assert.doesNotMatch(app,/cutLengthM/);
assert.match(app,/setPointerCapture/);
assert.match(app,/window\.print\(\)/);
assert.match(app,/quantityStatementCsv/);
assert.doesNotMatch(app,/window\.localStorage\.setItem/);
assert.doesNotMatch(app,/window\.localStorage\.getItem/);
assert.doesNotMatch(app,/encodeURIComponent\(name\)/);
assert.doesNotMatch(app,/project\.addEventListener\('change',render\)/);
assert.match(app,/__PWD_ANDROID_CSV_EXPORT_V1__/);
assert.match(app,/appassets\.androidplatform\.net/);
assert.ok(!/\b(projectName|siteLength)\s*\*\s*row\.(concreteM3|steelKg)/.test(app));
assert.doesNotMatch(app,/auto[- ]?design|designApproval/i);
assert.doesNotMatch(page,/masonry/i);
for(const asset of ['rcc-wall-2023-section.js','rcc-wall-2023-bbs.js'])
 assert.ok(read('sw.js').includes("'./"+asset+"'"),'Offline cache excludes '+asset);
// Stage 5: arithmetic cross-check all 27 printed volumes against the
// A-I sectional polygon. This supports planning per-metre takeoff as an
// engineering inference rather than an unlabelled source statement.
let maxDeviation=0;
for(const sbc of data.sbcs)for(const height of data.heightsFor(sbc)){
 const source=data.recordFor(sbc,height);
 const areaM2=section.crossSectionAreaM2(source);
 assert.ok(Number.isFinite(areaM2)&&areaM2>0);
 const delta=Math.abs(areaM2-source.concreteM3);
 maxDeviation=Math.max(maxDeviation,delta);
 assert.ok(delta<=0.01,'Concrete section must reconcile source '+sbc+'/'+height+' by <=0.01 m³: '+delta);
 // Stage 6: the source GAD stem and raft geometry must partition exactly.
 const parts=section.componentAreasM2(source);
 assert.ok(parts.raftCrossSectionM2>0&&parts.stemCrossSectionM2>0,'Both RCC sub-sections are positive');
 assert.ok(Math.abs(parts.raftCrossSectionM2+parts.stemCrossSectionM2-areaM2)<1e-9,
  'Raft + stem areas must reconstruct the source polygon for '+sbc+'/'+height);
 assert.match(parts.raftMethod,/B×H/);
 assert.match(parts.stemMethod,/E\+I/);
 const takeoff=section.quantityForLength(source,12.5);
 assert.equal(takeoff.lengthM,12.5);
 assert.ok(Math.abs(takeoff.concretePlanningM3-areaM2*12.5)<1e-9);
 assert.ok(Math.abs(takeoff.raftConcretePlanningM3-parts.raftCrossSectionM2*12.5)<1e-9);
 assert.ok(Math.abs(takeoff.stemConcretePlanningM3-parts.stemCrossSectionM2*12.5)<1e-9);
 assert.ok(Math.abs(takeoff.raftConcretePlanningM3+takeoff.stemConcretePlanningM3-takeoff.concretePlanningM3)<1e-8,
  'Raft + stem RCC volume must equal original RCC volume, not double count');
 assert.ok(Math.abs(takeoff.pccLevellingPlanningM3-(source.dimensionsMm.B/1000)*0.1*12.5)<1e-9);
 assert.equal(takeoff.sourceConcreteM3,source.concreteM3);
}
assert.ok(Math.abs(maxDeviation-0.0075)<1e-8,'Worst source rounding difference must remain stable');
const projectArea=section.crossSectionAreaM2(original);
assert.ok(Math.abs(projectArea-2.4225)<1e-9);
const planned=section.quantityForLength(original,12);
assert.ok(Math.abs(planned.concretePlanningM3-29.07)<1e-9);
const componentExample=section.componentAreasM2(original);
assert.ok(Math.abs(componentExample.raftCrossSectionM2-1.0725)<1e-9);
assert.ok(Math.abs(componentExample.stemCrossSectionM2-1.35)<1e-9);
assert.ok(Math.abs(planned.raftConcretePlanningM3-12.87)<1e-9);
assert.ok(Math.abs(planned.stemConcretePlanningM3-16.2)<1e-9);
assert.ok(Math.abs(planned.pccLevellingPlanningM3-3.6)<1e-9);
assert.equal(original.concreteM3,2.42,'Printed book table must not be replaced by geometry takeoff');
assert.ok(planned.note.includes('PLANNING'));
for(const length of ['',0,-1,'negative',null,undefined,NaN,10001,Infinity])
 assert.throws(()=>section.quantityForLength(original,length),'Invalid length must reject: '+String(length));
const takenCsv=bbs.draftCsv('Culvert Approach',original,schedule,{MK7:{count:10,cutLengthM:5.2}},planned);
assert.ok(takenCsv.includes('GEOMETRY-BASED PLANNING QUANTITY'));
assert.ok(takenCsv.includes('29.070'));
assert.ok(takenCsv.includes('RAFT RCC volume'));
assert.ok(takenCsv.includes('STEM RCC volume'));
assert.ok(takenCsv.includes('12.870'));
assert.ok(takenCsv.includes('16.200'));
assert.ok(takenCsv.includes('3.600'));
assert.ok(takenCsv.includes('per running metre basis inferred'));
assert.ok(takenCsv.includes('No inferred project-length steel quantity'));
for(const id of ['rccLength','rccGeometryTakeoff','rccPlanRaft','rccPlanStem','rccPlanConcrete','rccPlanPcc','rccPlanArea','rccPlanBasis','rccPlanError'])
 assert.ok(page.includes('id="'+id+'"'),'Missing RCC length takeoff UI '+id);
assert.match(app,/section\.quantityForLength\(selectedRow/);
assert.match(app,/rccLength.*addEventListener\('input',refreshGeometryQuantity\)/);
assert.match(app,/quantityStatementCsv\(\)/);
assert.ok(!app.includes('row.steelKg*'),'Printed source steel MUST NOT be scaled by length');
console.log('RCC Phase 5 checked 27 original-to-geometry concrete matches (max diff '+maxDeviation+' m³), optional length, separate PCC and steel boundaries.');
console.log('RCC Phase 4 verified: 27 dimensioned cross-sections, optional project label, manual BBS mass, CSV injection guard, no false quantity scaling.');

console.log('RCC Phase 6 checked: all 27 GAD raft + stem volumes partition exactly; project report and CSV include both concrete items without double counting.');

// BBS code stays dormant in repository for future work but must not be callable
// or bundled as a UI capability in the CURRENT RCC retaining wall screen.
assert.doesNotMatch(page,/id="rccBbsSection"|id="rccBbsRows"|id="rccBbsCsv"|cut length \(m\)|bar count.*input/i);
assert.doesNotMatch(page,/src="\.\/rcc-wall-2023-bbs\.js"/);
assert.doesNotMatch(app,/buildBbs|updateBbs|draftKey|draftValues|rccBbsCsv|bbs\.worksheet/);
assert.match(app,/PWD_RCC_2023_QUANTITY_/);
assert.match(app,/Raft RCC volume/);
assert.match(app,/Stem RCC volume/);
assert.match(app,/Original PWD steel/);
assert.match(app,/__PWD_ANDROID_CSV_EXPORT_V1__/);
console.log('RCC Phase 7 scope verified: source MK1-MK11 table and concrete quantity CSV active, BBS cutting UI deferred.');
