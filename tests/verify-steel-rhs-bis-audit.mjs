/** IS 4923:2017 + Amendment 3 (June 2024) limited nominal RHS mass audit.
 * Data source: owner-held consolidated BIS text; Amendment 2 Table 2 p.26;
 * Amendment 3 correction list, document p.33. The original private BIS PDF
 * is not copied, shipped or quoted in full.
 *
 * Compliance boundary: nominal kg/m checked, NOT dimensional tolerance,
 * moment of inertia, mechanical grade, MTC or delivered material acceptance.
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

// Two earlier catalogue RHS weights are unchanged by Amendment 3.
// All twelve specific Amendment 3 corrections are audited below.
const unchanged=[
 ['rhs-index-40x20x2',40,20,2,1.68],
 ['tata-legacy-rhs50x25x2',50,25,2,2.15]
];
const corrected=[
 ['bis24-rhs120x60x5',120,60,5,12.84],
 ['bis24-rhs127x50x3',127,50,3,7.87],
 ['bis24-rhs127x50x3.6',127,50,3.6,9.34],
 ['bis24-rhs150x100x4',150,100,4,14.88],
 ['bis24-rhs150x100x5',150,100,5,18.34],
 ['bis24-rhs150x100x6',150,100,6,21.69],
 ['bis24-rhs150x100x6.3',150,100,6.3,22.68],
 ['bis24-rhs150x100x8',150,100,8,28.10],
 ['bis24-rhs150x100x10',150,100,10,34.09],
 ['bis24-rhs150x100x12',150,100,12,39.67],
 ['bis24-rhs150x100x12.5',150,100,12.5,41.00],
 ['bis24-rhs260x180x12',260,180,12,75.47]
];
assert.equal(corrected.length,12,'All 12 amended RHS corrections must be represented');
assert.equal(cat.rhsAuditSampleCount,29,'Two existing RHS + all 12 corrected records');
assert.equal(cat.sections.length,115,'Other catalogue rows remain unchanged');
assert.equal(cat.sections.filter(x=>x.family==='hollow').length,47);
assert.equal(cat.sections.filter(x=>x.series==='RHS').length,29);

const signatures=new Set();
for(const [id,h,w,t,mass] of [...unchanged,...corrected]){
 const row=cat.byId(id);
 assert.ok(row,'Missing audited RHS row '+id);
 assert.equal(row.series,'RHS');
 assert.equal(row.depthMm,h);
 assert.equal(row.widthMm,w);
 assert.equal(row.thicknessMm,t);
 assert.equal(row.kgPerM,mass);
 const signature=[h,w,t].join('/');
 assert.ok(!signatures.has(signature),'Duplicate size in audit ledger '+signature);
 signatures.add(signature);
 assert.equal(cat.standardAudit(row).status,'rhs-weight-checked');
 assert.match(cat.standardAudit(row).note,/Other section properties/);
 assert.deepEqual([...cat.auditRow(row)],[]);
 if(id.startsWith('bis24-')){
  assert.equal(row.basis,'bis-spot-audited-mass');
  assert.equal(row.sourceId,'rhsBisSpot2024');
  assert.equal(row.areaCm2,undefined,'Do not invent section area based on amended weight');
  assert.match(row.standard,/nominal kg\/m audited only/);
 }
}
assert.equal(signatures.size,14);

// Verify exact two-decimal weights: a difference of 0.01 kg/m must NOT pass.
for(const [id,h,w,t,mass] of corrected){
 const bad={series:'RHS',depthMm:h,widthMm:w,thicknessMm:t,kgPerM:Number((mass+0.01).toFixed(2))};
 assert.equal(cat.standardAudit(bad).status,'rhs-weight-conflict',
  'Nominal weight differs by 0.01 kg/m for '+id);
}
assert.equal(cat.standardAudit({series:'RHS',depthMm:150,widthMm:100,thicknessMm:4,kgPerM:14.88,areaCm2:25}).status,'mass-area-conflict','Self-inconsistent supplied area must fail even when amended nominal mass is checked');
assert.equal(cat.standardAudit({series:'RHS',depthMm:40,widthMm:20,thicknessMm:2,kgPerM:1.68,areaCm2:2.5}).status,'mass-area-conflict','Sampled Amendment 2 area inconsistency must be blocked');
assert.equal(cat.standardAudit({series:'RHS',depthMm:150,widthMm:100,thicknessMm:4.5,kgPerM:17}).status,'amendment3-review','Do not certify non-audited sizes');
assert.equal(cat.standardAudit({series:'RHS',depthMm:100,widthMm:50,thicknessMm:2,kgPerM:5}).status,'amendment3-review');
assert.equal(cat.standardAudit({series:'RHS',depthMm:50,widthMm:25,thicknessMm:1.6,kgPerM:1.8}).status,'outside-current-scope');

// Verify that the calculator has a guard for verified-value conflicts.
const app=read('pwd-steel-app.js');
new vm.Script(app,{filename:'pwd-steel-app.js'});
assert.match(app,/rhs-weight-checked/);
assert.match(app,/rhs-weight-conflict/);
assert.match(app,/Quantity blocked pending correction/);
assert.match(app,/BIS amended kg\/m checked/);
console.log('Steel V9 PASS: 12/12 Amendment 3 RHS masses, 2 unchanged existing weights, 14 unique checks; 0.01 kg/m conflicts rejected; unverified sections remain unverified.');
