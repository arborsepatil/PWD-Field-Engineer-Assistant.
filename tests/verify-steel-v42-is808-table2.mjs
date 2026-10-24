/* V42: owner-held IS 808:2021 Table 2 limited source audit regression.
   No copyrighted table is bundled; the fingerprint binds existing Osdag data. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const checkedIDs=[2,3,4,5,6,7,8,9,10,11,14,15,16,17,18,19,20,21,22,23,24,25].map(n=>'OSD'+n);
assert.equal(new Set(checkedIDs).size,22);
assert.equal(catalog.is808V42AuditSampleCount,22);
assert.equal(catalog.sections.length,757);
for(const id of checkedIDs){
 const row=catalog.byId(id);
 assert.ok(row,'Missing Osdag row: '+id);
 assert.equal(row.sourceId,'osdag808','Only existing licensed open data is used');
 const bis=catalog.standardAudit(row);
 assert.equal(bis.status,'is808-mass-area-inertia-checked','Not a source-verified row: '+id);
 assert.equal(bis.sourceTable,2,'Incorrect BIS table tag: '+id);
 assert.ok([9,10].includes(bis.sourcePdfPage),'Wrong source page');
 assert.equal(bis.geometryChecked,false,'Flange slope / radii were not all checked');
 assert.match(bis.note,/MTC are not certified/);
 assert.equal(comparison.audit(catalog,row).status,'checked');
 assert.equal(comparison.quantityGate(catalog,row).allowed,true);
 for(const key of ['kgPerM','areaCm2','ixCm4','iyCm4','zxCm3','zyCm3','depthMm','widthMm','webMm','flangeMm']){
  const changed={...row,[key]:row[key]+1};
  const audit=catalog.standardAudit(changed);
  assert.equal(audit.status,'is808-numeric-conflict',id+' tampered '+key+' must be held');
  assert.equal(comparison.audit(catalog,changed).status,'hold');
  assert.equal(comparison.quantityGate(catalog,changed).allowed,false);
 }
 assert.equal(comparison.quantityGate(catalog,{...row,sourceId:'secondary808'}).allowed,false,'Source identity must be bound');
}
for(const id of ['OSD13']){
 const row=catalog.byId(id);
 assert.ok(row);
 assert.equal(comparison.audit(catalog,row).status,'hold','Unreviewed provisional variant remains held');
 assert.equal(comparison.quantityGate(catalog,row).allowed,false);
}
const totals=status.summarize(catalog,comparison,catalog.sections);
// V42 verified its own 22 rows above. Later batches may add further checked
// rows without changing these source locks or the historical held count.
assert.ok(totals.counts.checked>=171,'V42 source-checked minimum must not regress');
assert.ok(totals.counts.review<=566,'Later source checks may reduce pending records');
assert.equal(totals.counts.hold,20,'Historical numeric holds must remain blocked');
assert.equal(totals.counts.checked+totals.counts.review+totals.counts.hold,757);
assert.equal(totals.total,757);
// Confirm the licensed standard is not embedded, and table values are NOT duplicated.
const code=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const inserted=code.split('// V42: Twenty-two')[1]?.split('// Source-published nominal figures')[0]||'';
assert.ok(inserted.includes('fingerprint'));
assert.ok(!inserted.includes('mass:7.07'));
assert.ok(!inserted.includes('mass:99.39'));
assert.ok(!fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')));
console.log('STEEL V42 PASS: 22 added selected Table 2 checks; 171 checked, 566 pending, 20 hold; source-property tampering stays blocked.');
