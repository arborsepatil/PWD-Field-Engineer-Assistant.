/** Independent limited numeric spot-check of IS 4923:2017 Amd.2 + Amd.3.
 * Checked against owner-held BIS consolidated PDF: pages 26 and 33.
 * The source PDF remains private and must never be added to the APK/repo.
 * This is NOT a substitute for a full code/design/material acceptance check.
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
const checked=[
 ['rhs-index-40x20x2',40,20,2,1.68],
 ['tata-legacy-rhs50x25x2',50,25,2,2.15],
 ['bis24-rhs120x60x5',120,60,5,12.84],
 ['bis24-rhs127x50x3.6',127,50,3.6,9.34],
 ['bis24-rhs150x100x4',150,100,4,14.88],
 ['bis24-rhs260x180x12',260,180,12,75.47],
];
assert.equal(cat.rhsAuditSampleCount,6);
for(const [id,h,w,t,mass] of checked){
 const row=cat.byId(id);
 assert.ok(row,'missing RHS sample '+id);
 assert.equal(row.series,'RHS');
 assert.equal(row.depthMm,h);
 assert.equal(row.widthMm,w);
 assert.equal(row.thicknessMm,t);
 assert.equal(row.kgPerM,mass);
 assert.equal(cat.standardAudit(row).status,'rhs-weight-checked');
 assert.match(cat.standardAudit(row).note,/Other section properties/);
 assert.deepEqual([...cat.auditRow(row)],[]);
}
assert.equal(cat.standardAudit({series:'RHS',depthMm:150,widthMm:100,thicknessMm:4,kgPerM:15.00}).status,'rhs-weight-conflict');
assert.equal(cat.standardAudit({series:'RHS',depthMm:40,widthMm:20,thicknessMm:2,kgPerM:1.68,areaCm2:2.50}).status,'rhs-weight-conflict');
assert.equal(cat.standardAudit({series:'RHS',depthMm:150,widthMm:100,thicknessMm:5,kgPerM:18.34}).status,'amendment3-review','Unreviewed size must not be declared checked even if plausible');
assert.equal(cat.standardAudit({series:'RHS',depthMm:100,widthMm:50,thicknessMm:2,kgPerM:5}).status,'amendment3-review');
assert.equal(cat.standardAudit({series:'RHS',depthMm:50,widthMm:25,thicknessMm:1.6,kgPerM:1.8}).status,'outside-current-scope');
assert.equal(cat.sections.filter(x=>x.series==='RHS').length,6,'Only six RHS records are present');
const app=read('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.match(app,/rhs-weight-checked/);
assert.match(app,/rhs-weight-conflict/);
assert.match(app,/Quantity blocked pending correction/);
assert.match(app,/BIS amended kg\/m checked/);
console.log('Steel V8: six RHS numeric mass samples checked, 12 corrections acknowledged, unsampled rows not certified, contradictions blocked.');
