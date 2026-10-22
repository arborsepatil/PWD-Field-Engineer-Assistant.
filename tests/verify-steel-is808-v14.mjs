/** Steel V14 source-limited verification against owner-held IS 808:2021.
 * Direct comparisons: Tables 1, 2, 5, 6 and 9 (PDF pp. 7, 10, 21, 23-24,
 * 31-32). Only 23 explicitly named reference variants examined, with 22
 * represented in the curated app catalogue. No complete copyright table
 * is copied or distributed, nor is actual supplier product certification.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const scope={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-catalog.js'),scope,{filename:'pwd-steel-catalog.js'});
const cat=scope.module.exports;
const audited=[
 // existing sample id, IS808 table, BIS kg/m, availability of Izz/Iyy
 ['ISMB100',1,8.95,true],
 ['ref-MB-MB-125-13.35',1,13.35,false],
 ['ISMB150',1,14.96,true],
 ['ISMB200',1,24.17,false],
 ['ISMB250',1,37.30,true],
 ['ISMB300',1,46.02,true],
 ['ISMC75',6,7.14,false],
 ['ISMC100',6,9.56,false],
 ['ISMC125',6,13.10,false],
 ['ISMC150',6,16.80,false],
 ['ISMC200',6,22.30,false],
 ['ISMC250',6,34.20,false],
 ['sail23-ISMC300',6,36.30,false],
 ['sail23-ISMC400',6,50.10,false],
 ['sail23-ISA90x90x6',9,8.32,false],
 ['sail23-ISA90x90x8',9,10.92,false],
 ['sail23-ISA100x100x8',9,12.18,false],
 ['sail23-ISA150x150x10',9,22.93,false],
 ['sail23-ISA200x200x12',9,36.85,false],
 ['ref-WB-WB-150-17.00',1,17.00,false],
 ['ref-HB-HB-200-37.31',5,37.31,false],
 ['ref-LB-LB-200-19.83',2,19.83,false]
];
// Explicitly selected values, not an exact reproduction of full IS 808.
assert.equal(cat.is808AuditSampleCount,23,'22 app sizes plus alternate MC 250 B80 reference');
assert.equal(audited.length,22);
assert.equal(cat.sections.length,127,'No other catalogue size changed');
assert.equal(cat.sections.filter(x=>x.series==='RHS').length,35);
assert.equal(cat.sections.filter(x=>x.series==='SHS').length,22);
let bothInertias=0;
for(const [id,table,mass,completeProps] of audited){
 const row=cat.byId(id);
 assert.ok(row,'Missing IS 808 audited catalogue sample: '+id);
 assert.equal(row.kgPerM,mass,id+' nominal mass');
 assert.equal(row.family==='hollow',false);
 const x=cat.standardAudit(row);
 assert.ok(x.status==='is808-mass-checked'||x.status==='is808-mass-area-inertia-checked',
  id+' must have a true positive status: '+x.status);
 assert.match(x.note,/IS 808:2021/);
 assert.match(x.note,/MTC|grade/i);
 if(completeProps){
  assert.equal(x.status,'is808-mass-area-inertia-checked',id);
  assert.ok(row.areaCm2>0&&row.ixCm4>0&&row.iyCm4>0);
  bothInertias++;
 }
 const wrong={...row,kgPerM:Number((mass+0.01).toFixed(2))};
 assert.equal(cat.standardAudit(wrong).status,'is808-numeric-conflict',
  'Difference of 0.01 kg/m from checked BIS table MUST block: '+id);
 const area=Number(row.areaCm2);
 if(Number.isFinite(area)&&area>0)
  assert.ok(Math.abs(mass-0.785*area)/mass<.015,'Nominal density plausibility only: '+id);
}
assert.equal(bothInertias,4,'Full selected numerical mass/area/Izz/Iyy comparison subset');
const historical=[
 ['ISA90x90x6',8.2],
 ['ISA90x90x8',10.8],
 ['ISA100x100x8',12.1],
 ['ISA150x150x10',22.9],
 ['ISA200x200x12',36.8]
];
for(const [id,mass] of historical){
 const row=cat.byId(id);
 assert.ok(row,id);
 assert.equal(row.kgPerM,mass);
 assert.equal(row.basis,'archived-manufacturer-only');
 assert.equal(cat.standardAudit(row).status,'is808-numeric-conflict',
  'Archived 2020 nominal mass does not match 2021 BIS Table 9: '+id);
}
const mc250=cat.byId('ISMC250');
assert.equal(mc250.widthMm,82);
assert.equal(mc250.kgPerM,34.2);
assert.equal(cat.standardAudit(mc250).status,'is808-mass-area-inertia-checked');
assert.equal(cat.standardAudit(mc250).geometryChecked,true,'MC250 B82 geometry now audited against BIS Table 6');
const alternate={...mc250,widthMm:80,kgPerM:30.6,areaCm2:38.9,ixCm4:3820,iyCm4:218};
assert.equal(cat.standardAudit(alternate).status,'is808-mass-area-inertia-checked');
assert.equal(cat.standardAudit({...mc250,widthMm:80}).status,'is808-numeric-conflict',
 'MC250 B80 cannot use the B82 variant 34.2 kg/m mass');
assert.equal(cat.standardAudit({...alternate,widthMm:82}).status,'is808-numeric-conflict',
 'MC250 B82 cannot use the B80 30.6 kg/m mass');
assert.equal(cat.standardAudit({family:'beam',series:'MB',depthMm:350,widthMm:140,kgPerM:52.33}).status,
 'not-checked','Unsampled IS808 sizes stay unverified despite plausible weights');
assert.equal(cat.standardAudit({family:'angle',series:'UE',depthMm:100,widthMm:50,thicknessMm:8,kgPerM:9.05}).status,
 'not-checked','Do not claim current unequal-angle BIS verification yet');
const app=read('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
for(const status of ['is808-mass-checked','is808-mass-area-inertia-checked','is808-numeric-conflict'])
 assert.match(app,new RegExp(status));
const start=app.indexOf('function calculate(){');
const end=app.indexOf('function updateResult(){',start);
assert.ok(start>=0&&end>start,'Cannot locate actual steel section calculator function');
const calculate=new Function('selected','catalog','math','$','source','family',app.slice(start,end)+'\nreturn calculate();');
const $=id=>({value:id==='steelLength'?'6':id==='steelCountPieces'?'3':'0'});
const math={quantity:(row,L,N)=>({unitMassKgM:row.kgPerM,totalMassKg:row.kgPerM*L*N,basis:'Nominal checked steel mass',totalTonnes:row.kgPerM*L*N/1000,totalPrice:null})};
const src=id=>cat.SOURCES[id];
const call=(id,family='angle')=>calculate(cat.byId(id),cat,math,$,src,family);
assert.equal(call('ISMB300','beam').q.totalMassKg,46.02*18);
assert.equal(call('sail23-ISA90x90x6').q.totalMassKg,8.32*18);
assert.throws(()=>call('ISA90x90x6'),/IS 808:2021.*conflicts/i,'Archive angle conflict must not produce quantity');
assert.throws(()=>call('ISA100x100x8'),/IS 808:2021.*conflicts/i);
assert.equal(call('ISMC250','channel').q.totalMassKg,34.2*18);
console.log('Steel V14 PASS: 22 IS 808:2021 catalogue samples, 23 variants, 5 archive-angle conflicts blocked, MC250 widths distinguished, normal beam/channel calculations intact.');
