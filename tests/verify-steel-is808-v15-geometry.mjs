/** V15 — owner-held BIS IS 808:2021 source verification of 13 geometries.
 * Compare selected Table 1 and Table 6 samples for nominal section web and
 * flange thickness, flange slope and two radii as well as mass, area and
 * second moments. No complete BIS table or private PDF is distributed.
 * Figures do not certify actual delivered products, grade or design approval.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const load=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(load('pwd-steel-catalog.js'),ctx,{filename:'pwd-steel-catalog.js'});
const cat=ctx.module.exports;
const geometries=[
 // id, family, web mm, flange mm, slope degrees, R1 mm, R2 mm,
 // source PDF page, nominal area cm², Izz/Iyy cm⁴
 ['ISMB100','beam',4.7,7.0,98,9,4.5,7,11.4,182,12.5],
 ['ISMB150','beam',5.0,8.0,98,9,4.5,7,19.0,718,46.7],
 ['ISMB200','beam',5.7,10.0,98,11,5.5,7,30.8,2110,136],
 ['ISMB250','beam',6.9,12.5,98,13,6.5,7,47.5,5130,334],
 ['ISMB300','beam',7.7,13.1,98,14,7,7,58.6,8990,486],
 ['ISMC75','channel',4.8,7.5,96,8.5,2.4,23,9.08,78.2,12.7],
 ['ISMC100','channel',5.0,7.7,96,9,2.4,23,12.1,191,26.3],
 ['ISMC125','channel',5.3,8.2,96,9.5,2.4,23,16.6,424,60.3],
 ['ISMC150','channel',5.7,9.0,96,10,2.4,23,21.3,786,102],
 ['ISMC200','channel',6.2,11.4,96,11,3.2,23,28.4,1820,139],
 ['ISMC250','channel',9,14.1,96,12,3.2,24,43.4,4060,242],
 ['sail23-ISMC300','channel',7.8,13.6,96,13,3.2,24,46.2,6400,311],
 ['sail23-ISMC400','channel',8.8,15.3,96,15,4.8,24,63.7,15100,504]
];
assert.equal(geometries.length,13);
assert.equal(new Set(geometries.map(x=>x[0])).size,13);
assert.equal(cat.is808AuditSampleCount,23,'No wholesale IS808 copyright table reproduction');
assert.equal(cat.sections.length,127,'Section totals preserved from V14');
let complete=0;
for(const [id,family,web,flange,slope,r1,r2,page,area,izz,iyy] of geometries){
 const row=cat.byId(id);
 assert.ok(row,'missing section '+id+' in IS808 PDF page '+page);
 assert.equal(row.family,family,'family of '+id);
 for(const [key,val] of Object.entries({
  webMm:web,flangeMm:flange,flangeSlopeDeg:slope,r1Mm:r1,r2Mm:r2,
  areaCm2:area,ixCm4:izz,iyCm4:iyy
 }))assert.equal(row[key],val,id+' '+key);
 const audit=cat.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked',id);
 assert.equal(audit.geometryChecked,true,id+' must not earn geometry status from mass alone');
 assert.match(audit.note,/flange slope|slope and radii/i);
 assert.match(audit.note,/MTC/i);
 assert.deepEqual([...cat.auditRow(row)],[]);
 for(const key of ['webMm','flangeMm','flangeSlopeDeg','r1Mm','r2Mm']){
  const corrupted={...row,[key]:row[key]+0.1};
  assert.equal(cat.standardAudit(corrupted).status,'is808-numeric-conflict',
   id+' '+key+' 0.1 discrepancy must block');
 }
 const absent={...row};delete absent.r1Mm;
 assert.equal(cat.standardAudit(absent).status,'is808-mass-area-inertia-checked');
 assert.equal(cat.standardAudit(absent).geometryChecked,false,'Missing fillet radius must not be certified');
 complete++;
}
assert.equal(complete,13);
const mc250=cat.byId('ISMC250');
assert.equal(mc250.widthMm,82,'Starred IS 808 Table 6 MC 250 variant');
assert.equal(mc250.webMm,9);
assert.equal(mc250.flangeMm,14.1);
assert.equal(cat.standardAudit({...mc250,widthMm:80}).status,'is808-numeric-conflict',
 'MC250 B80 and B82 are distinct variants, not interchangeable');
const archive=cat.byId('ISA90x90x6');
assert.equal(cat.standardAudit(archive).status,'is808-numeric-conflict');
const unverified=cat.standardAudit(cat.byId('ref-WB-WB-150-17.00'));
assert.equal(unverified.geometryChecked,false,'Weight/inertia matched is not geometry verified');
const app=load('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.match(app,/bisAudit\.geometryChecked/);
assert.match(app,/chsAudit\.geometryChecked/);
const start=app.indexOf('function calculate(){');
const end=app.indexOf('function updateResult(){',start);
assert.ok(start>=0&&end>start);
const calc=new Function('selected','catalog','math','$','source','family',app.slice(start,end)+'\nreturn calculate();');
const $=id=>({value:id==='steelLength'?'6':id==='steelCountPieces'?'2':'0'});
const math={quantity:(x,L,N)=>({unitMassKgM:x.kgPerM,totalMassKg:x.kgPerM*L*N,totalTonnes:x.kgPerM*L*N/1000,basis:'Nominal IS808',totalPrice:null})};
const source=id=>cat.SOURCES[id];
const run=(x,family)=>calc(x,cat,math,$,source,family);
assert.equal(run(cat.byId('ISMB200'),'beam').q.totalMassKg,24.17*12);
assert.equal(run(cat.byId('ISMC150'),'channel').q.totalMassKg,16.8*12);
assert.throws(()=>run({...cat.byId('ISMC150'),r1Mm:10.1},'channel'),/IS 808:2021.*conflicts/i);
console.log('Steel V15 PASS: 13 MB/MC source geometries, root radii and slopes individually checked, incomplete geom not certified, corrupted geometry blocked, beam/channel calculator preserved.');
