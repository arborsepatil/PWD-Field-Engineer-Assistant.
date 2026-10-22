/** V10: explicitly limited independent IS 4923 amended-table comparisons.
 * BIS source: privately held IS 4923:2017 consolidated, Amd 2 Table 1
 * (document pp.21–25) and Table 2 (pp.26–30), updated by Amd 3 (p.33).
 * No bulk copyrighted standard data is bundled in the app.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx={module:{exports:{}}};
vm.runInNewContext(text('pwd-steel-catalog.js'),ctx);
const cat=ctx.module.exports;
const SHS=[
 ['tata-legacy-shs25x25x2',25,2,1.36,1.74,1.48],
 ['tata-legacy-shs32x32x2',32,2,1.80,2.30,3.36],
 ['bis22-shs40x40x2',40,2,2.31,2.94,6.94],
 ['bis22-shs50x50x2',50,2,2.93,3.74,14.15],
 ['bis22-shs60x60x3',60,3,5.19,6.61,35.13],
 ['bis22-shs100x100x4',100,4,11.73,14.95,226.35],
];
const RHS=[
 ['bis22-rhs40x20x2.5',40,20,2.5,2.03,2.59,4.69,1.54],
 ['bis22-rhs50x25x2.5',50,25,2.5,2.62,3.34,9.89,3.28],
 ['bis22-rhs80x40x3',80,40,3,5.19,6.61,52.25,17.56],
 ['bis22-rhs100x50x4',100,50,4,8.59,10.95,134.14,44.95],
 ['bis22-rhs200x100x6',200,100,6,26.40,33.63,1703,577],
];
assert.equal(cat.shsAuditSampleCount,16);
assert.equal(cat.rhsAuditSampleCount,29,'14 V9 samples + 5 non-corrected RHS Table 2 checks');
assert.equal(cat.sections.length,115);
assert.equal(cat.sections.filter(x=>x.family==='hollow').length,47);
assert.equal(cat.sections.filter(x=>x.series==='SHS').length,16);
assert.equal(cat.sections.filter(x=>x.series==='RHS').length,29);
for(const [id,size,t,kg,area,ix] of SHS){
 const row=cat.byId(id);
 assert.ok(row,'Missing SHS audit record '+id);
 assert.equal(row.depthMm,size);
 assert.equal(row.widthMm,size);
 assert.equal(row.thicknessMm,t);
 assert.equal(row.kgPerM,kg);
 assert.equal(row.areaCm2,area);
 assert.equal(row.ixCm4,ix);
 assert.equal(row.iyCm4,ix);
 assert.equal(cat.standardAudit(row).status,'shs-row-checked',id);
 assert.deepEqual([...cat.auditRow(row)],[]);
}
for(const [id,h,w,t,kg,area,ix,iy] of RHS){
 const row=cat.byId(id);
 assert.ok(row,'Missing RHS audit record '+id);
 assert.equal(row.depthMm,h);
 assert.equal(row.widthMm,w);
 assert.equal(row.thicknessMm,t);
 assert.equal(row.kgPerM,kg);
 assert.equal(row.areaCm2,area);
 assert.equal(row.ixCm4,ix);
 assert.equal(row.iyCm4,iy);
 assert.equal(cat.standardAudit(row).status,'rhs-weight-checked',id);
 assert.equal(row.basis,'bis-table-spot-audited');
 assert.deepEqual([...cat.auditRow(row)],[]);
}
assert.equal(cat.standardAudit({series:'SHS',depthMm:50,widthMm:50,thicknessMm:2,kgPerM:2.94}).status,'shs-row-conflict','0.01 kg/m discrepancy must be rejected');
assert.equal(cat.standardAudit({series:'SHS',depthMm:50,widthMm:50,thicknessMm:2,kgPerM:2.93,areaCm2:3.75}).status,'shs-row-conflict','0.01 cm² discrepancy must be rejected');
assert.equal(cat.standardAudit({series:'SHS',depthMm:50,widthMm:50,thicknessMm:2,kgPerM:2.93,ixCm4:14.16}).status,'shs-row-conflict','0.01 cm⁴ discrepancy must be rejected');
assert.equal(cat.standardAudit({series:'RHS',depthMm:100,widthMm:50,thicknessMm:4,kgPerM:8.59,ixCm4:134.15}).status,'rhs-weight-conflict');
assert.equal(cat.standardAudit({series:'RHS',depthMm:100,widthMm:50,thicknessMm:4,kgPerM:8.60}).status,'rhs-weight-conflict');
assert.equal(cat.standardAudit({series:'SHS',depthMm:120,widthMm:120,thicknessMm:5,kgPerM:20}).status,'not-checked','Other SHS must remain unverified');
assert.equal(cat.standardAudit({series:'RHS',depthMm:120,widthMm:80,thicknessMm:4,kgPerM:15}).status,'amendment3-review','Other RHS remain unverified');
assert.equal(cat.standardAudit({series:'SHS',depthMm:30,widthMm:30,thicknessMm:1.9,kgPerM:2}).status,'outside-current-scope');
const app=text('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
for(const status of ['shs-row-checked','shs-row-conflict','rhs-weight-checked','rhs-weight-conflict'])assert.match(app,new RegExp(status));
assert.match(app,/IS 4923:2017 amended SHS nominal record conflicts/);
console.log('Steel V10: 6 SHS and 19 RHS compared to amended BIS tables; 12 corrected RHS preserved; strict mismatch gates passed.');
