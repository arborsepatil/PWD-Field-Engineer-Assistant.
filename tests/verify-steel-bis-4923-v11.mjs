/** Steel V11 — independently sampled IS 4923:2017 Amendment 2 Table 1/2.
 * Ten new SHS and ten new RHS rows, privately checked with source document.
 * The complete BIS standard must never be bundled in the public APK.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const context={module:{exports:{}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8'),context,{filename:'pwd-steel-catalog.js'});
const cat=context.module.exports;
const shs=[
 [30,2,1.68,2.14,2.72],[40,3,3.30,4.21,9.32],[50,2.5,3.60,4.59,16.94],[50,4,5.45,6.95,23.74],
 [60,4,6.71,8.55,43.55],[70,3,6.13,7.81,57.53],[75,4.5,9.55,12.17,98.55],
 [80,4,9.22,11.75,111.04],[90,5,12.84,16.36,192.93],[100,6,16.98,21.63,311.47]
];
const rhs=[
 [40,20,3,2.36,3.01,5.21,1.68],[50,25,2.9,2.98,3.80,10.93,3.60],
 [50,30,3,3.30,4.21,12.83,5.70],[60,40,2.5,3.60,4.59,22.07,11.74],
 [60,40,4,5.45,6.95,30.99,16.28],[70,30,4,5.45,6.95,37.23,9.42],
 [80,40,4,6.71,8.55,64.79,21.49],[90,50,3,6.13,7.81,81.85,32.74],
 [100,60,4,9.22,11.75,152.58,68.68],[120,80,4,11.73,14.95,294.59,157.29]
];
const close=(a,b)=>Math.abs(a-b)<1e-9;
assert.equal(cat.sections.length,115);
assert.equal(cat.sections.filter(x=>x.family==='hollow').length,47);
assert.equal(cat.sections.filter(x=>x.series==='SHS').length,16);
assert.equal(cat.sections.filter(x=>x.series==='RHS').length,29);
assert.equal(cat.shsAuditSampleCount,16);
assert.equal(cat.rhsAuditSampleCount,29);
for(const [size,t,kg,area,ix] of shs){
 const id='bis22-shs'+size+'x'+size+'x'+t;
 const row=cat.byId(id);
 assert.ok(row,'SHS not found: '+id);
 for(const [actual,expected] of [[row.depthMm,size],[row.widthMm,size],[row.thicknessMm,t],
  [row.kgPerM,kg],[row.areaCm2,area],[row.ixCm4,ix],[row.iyCm4,ix]])assert.ok(close(actual,expected),id+': '+actual+' != '+expected);
 assert.equal(row.basis,'bis-table-spot-audited');
 assert.equal(cat.standardAudit(row).status,'shs-row-checked');
 assert.deepEqual([...cat.auditRow(row)],[]);
 assert.ok(Math.abs(kg-area*0.785)<0.02,'Mass-area consistency: '+id);
}
for(const [h,w,t,kg,area,ix,iy] of rhs){
 const id='bis22-rhs'+h+'x'+w+'x'+t;
 const row=cat.byId(id);
 assert.ok(row,'RHS not found: '+id);
 for(const [actual,expected] of [[row.depthMm,h],[row.widthMm,w],[row.thicknessMm,t],
  [row.kgPerM,kg],[row.areaCm2,area],[row.ixCm4,ix],[row.iyCm4,iy]])assert.ok(close(actual,expected),id+': '+actual+' != '+expected);
 assert.equal(row.basis,'bis-table-spot-audited');
 assert.equal(cat.standardAudit(row).status,'rhs-weight-checked');
 assert.deepEqual([...cat.auditRow(row)],[]);
 assert.ok(Math.abs(kg-area*0.785)<0.02,'Mass-area consistency: '+id);
}
// Source typo: consolidated Amd 2 Table 2, RHS 120x80x6 lists 16.98
// kg/m with printed 2.63 cm2, an impossible ~8x mass discrepancy.
// Do not silently revise or certify any questionable physical table row.
assert.equal(cat.sections.filter(x=>x.series==='RHS'&&x.depthMm===120&&x.widthMm===80&&x.thicknessMm===6).length,0,
 '120x80x6 must remain excluded until authoritative source area correction');
assert.equal(cat.standardAudit({series:'RHS',depthMm:120,widthMm:80,thicknessMm:6,kgPerM:16.98,areaCm2:2.63}).status,'source-numeric-hold');
assert.equal(cat.standardAudit({series:'RHS',depthMm:120,widthMm:80,thicknessMm:4,kgPerM:11.74,areaCm2:14.95,ixCm4:294.59,iyCm4:157.29}).status,'rhs-weight-conflict');
assert.equal(cat.standardAudit({series:'SHS',depthMm:80,widthMm:80,thicknessMm:4,kgPerM:9.22}).status,'shs-row-conflict',
 'Mass only must not masquerade as complete SHS area/inertia verification');
assert.equal(cat.standardAudit({series:'RHS',depthMm:80,widthMm:40,thicknessMm:4,kgPerM:6.71}).status,'rhs-weight-conflict',
 'Mass only must not masquerade as complete RHS area/inertia verification');
assert.equal(cat.standardAudit({series:'RHS',depthMm:150,widthMm:100,thicknessMm:5,kgPerM:18.34}).status,'rhs-weight-checked',
 'Amendment 3 specific corrections are mass-only, not fabricated geometry');
assert.equal(cat.standardAudit({series:'SHS',depthMm:90,widthMm:90,thicknessMm:1.5,kgPerM:4}).status,'outside-current-scope');
console.log('Steel V11: 20 new BIS Table 1/2 samples checked; 16 SHS and 29 RHS total; source anomaly excluded; audit-completeness guard passed.');
