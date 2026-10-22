/** Steel V16: direct IS 808:2021 Fourth Revision — selected seven unverified
 * hot-rolled families completed with owner's non-distributed BIS PDF.
 * Independent numeric expectations below are limited sample facts only.
 * This is NOT a transcription of the proprietary standard.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const read=p=>fs.readFileSync(path.resolve(import.meta.dirname,'..',p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(read('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const cat=ctx.module.exports;
const cases=[
 // series, table, physical D/B (mm), kg/m, area cm2, Iz/Iy cm4, web/flange mm
 ['NPB',3,100,55,8.10,10.3,171,15.9,4.1,5.7],
 ['WPB',4,91,100,12.24,15.5,236,92,4.2,5.5],
 ['JC',7,100,45,5.8,7.41,123,14.6,3,5.1],
 ['LC',7,150,75,14.4,18.3,697,101,4.8,7.8],
 ['MPC',8,150,75,16.8,21.3,792,120,5.7,9],
 ['UE',12,100,50,9.05,11.5,118,20.2,null,null],
 ['PBP',13,200,205,43.85,55.8,3990,1330,9.3,9.3]
];
assert.equal(cat.sections.length,127,'Preserve all 127 curated steel records');
assert.equal(cat.is808AuditSampleCount,30,'23 previous variants + 7 directly checked classes');
const direct=cat.sections.filter(x=>x.sourceId==='is808Spot2021');
assert.equal(direct.length,7,'Promote exactly seven section records into explicitly checked BIS attribution');
for(const [series,table,d,b,mass,area,ix,iy,web,flange] of cases){
 const rows=direct.filter(x=>x.series===series);
 assert.equal(rows.length,1,'One V16 selected direct BIS record required for '+series);
 const row=rows[0];
 for(const [k,v] of Object.entries({depthMm:d,widthMm:b,kgPerM:mass,areaCm2:area,ixCm4:ix,iyCm4:iy}))
  assert.equal(row[k],v,series+' '+k+' BIS Table '+table);
 if(web!==null){
  assert.equal(row.webMm,web,series+' web');
  assert.equal(row.flangeMm,flange,series+' flange');
 }else assert.equal(row.thicknessMm,8,'Supplementary unequal 100x50x8 thickness from Table 12');
 assert.equal(row.basis,'bis-table-spot-audited');
 if(web!==null){
  const geom={
   NPB:[90,7,0], WPB:[90,12,0], JC:[91.5,6,2], LC:[91.5,8,2.4],
   MPC:[90,10,5], PBP:[90,10,0]
  };
  assert.deepEqual([row.flangeSlopeDeg,row.r1Mm,row.r2Mm],geom[series],
   series+' printed flange slope and fillet radii');
 }
 assert.match(row.standard,/IS 808:2021/);
 assert.match(row.secondaryIndexUrl,/^https:\/\/quickboq\.in\/steel\/tables\//);
 assert.match(row.sourceUrl,/services\.bis\.gov\.in/);
 const check=cat.standardAudit(row);
 assert.equal(check.status,'is808-mass-area-inertia-checked',series+' BIS numeric check');
 assert.equal(check.geometryChecked,web!==null,series+' conditional geometry verification status');
 assert.deepEqual([...cat.auditRow(row)],[],'Basic data completeness '+series);
 assert.ok(Math.abs(mass-area*.785)/mass<.015,'Plausibility: density only, NOT a BIS tolerance');
 const brokenMass={...row,kgPerM:Number((mass+.01).toFixed(2))};
 assert.equal(cat.standardAudit(brokenMass).status,'is808-numeric-conflict',
  series+' mass error >=0.01kg/m must be rejected');
 assert.equal(cat.standardAudit({...row,iyCm4:Number((iy+.01).toFixed(2))}).status,'is808-numeric-conflict',
  series+' Iy mismatch must be rejected');
 if(web!==null){
  assert.equal(cat.standardAudit({...row,webMm:Number((web+.1).toFixed(2))}).status,'is808-numeric-conflict',
    series+' web mismatch must be rejected');
  assert.equal(cat.standardAudit({...row,r1Mm:Number((row.r1Mm+.1).toFixed(2))}).status,'is808-numeric-conflict',
    series+' fillet radius mismatch must be rejected');
 }
}
const channel=cat.search('MC 150','channel','MC').find(x=>x.id==='ISMC150');
const parallel=cat.search('MPC 150','channel','MPC').find(x=>x.sourceId==='is808Spot2021');
assert.ok(channel&&parallel,'Both MC and MPC 150 must be separately searchable');
assert.equal(channel.kgPerM,parallel.kgPerM,'Same nominal weight for two different channel shapes');
assert.notEqual(channel.ixCm4,parallel.ixCm4,'Sloping vs parallel flanges have different Iz');
assert.equal(cat.standardAudit(channel).status,'is808-mass-checked');
assert.equal(cat.standardAudit(parallel).status,'is808-mass-area-inertia-checked');
const legacy=cat.byId('ISA100x100x8');
assert.equal(legacy.kgPerM,12.1);
assert.equal(cat.standardAudit(legacy).status,'is808-numeric-conflict','Do not re-approve archived mass conflict');
const mc250=cat.byId('ISMC250');
assert.equal(mc250.widthMm,82);
assert.equal(mc250.kgPerM,34.2);
assert.equal(cat.standardAudit(mc250).status,'is808-mass-checked');
const last=cat.standardAudit({family:'column',series:'HB',depthMm:300,widthMm:250,kgPerM:57});
assert.equal(last.status,'not-checked','Unsampled standard sections remain unverified');
const app=read('pwd-steel-app.js');
new vm.Script(app);
const start=app.indexOf('function calculate(){'),end=app.indexOf('function updateResult(){',start);
assert.ok(start>=0&&end>start,'Real steel calculator function must remain available');
const calculate=new Function('selected','catalog','math','$','source','family',app.slice(start,end)+'\nreturn calculate();');
const $=id=>({value:id==='steelLength'?'6':id==='steelCountPieces'?'2':'0'});
const math={quantity:(row,L,N)=>({totalMassKg:row.kgPerM*Number(L)*Number(N),totalTonnes:row.kgPerM*Number(L)*Number(N)/1000,unitMassKgM:row.kgPerM,basis:'Verified nominal mass only',totalPrice:null})};
for(const row of direct){
 const result=calculate(row,cat,math,$,id=>cat.SOURCES[id],row.family);
 assert.equal(result.q.totalMassKg,row.kgPerM*12,
  row.series+' should calculate 6m x 2 pieces in the real calculator');
}
console.log('Steel V16 PASS: 7 additional IS 808 families and dimensions/properties checked, all 30 sample variants preserved; real calculator and variant distinctions passed.');
