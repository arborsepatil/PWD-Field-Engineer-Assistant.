/* V50 WPB sizes 260–340: owner-held IS 808:2021 Table 4.
 * Regression stores only variant IDs, page pointers and fingerprint-gate tests.
 * OSD180 is now explicitly held due to Table 4 mass/area versus section geometry contradiction.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const comparison=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');

const expected=Array.from({length:22},(_,i)=>'OSD'+(i+171)).filter(id=>id!=='OSD180');
assert.equal(expected.length,21);
assert.equal(new Set(expected).size,21);
assert.equal(cat.is808V50AuditSampleCount,21);
assert.equal(cat.sections.length,757);
for(const id of expected){
 const row=cat.byId(id),n=Number(id.slice(3));
 assert.ok(row,'Missing checked section: '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'beam');
 assert.equal(cat.resolveSeries(row),'WPB');
 const audit=cat.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked',id);
 assert.equal(audit.sourceTable,4,id);
 assert.equal(audit.sourcePdfPage,n<=184?17:18,id);
 assert.equal(audit.geometryChecked,false,'Remaining geometry is not certified');
 assert.equal(comparison.audit(cat,row).status,'checked');
 assert.equal(comparison.quantityGate(cat,row).allowed,true);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
    'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
    'zxCm3','zyCm3','webMm','flangeMm']){
  const v=row[key],changed={...row,[key]:typeof v==='number'?v+1:
    v===null?'tampered':String(v)+'-tampered'};
  const checked=cat.standardAudit(changed);
  if(key==='id')assert.notEqual(checked.status,'is808-mass-area-inertia-checked',
   'Changing ID must not retain source check '+id);
  else assert.equal(checked.status,'is808-numeric-conflict',id+' '+key);
  assert.equal(comparison.quantityGate(cat,changed).allowed,false,
   'Quantity must remain blocked after mutation '+id+' '+key);
 }
}
// Source has a malformed/ambiguous row; do NOT silently promote it.
const ambiguous=cat.byId('OSD180');
assert.ok(ambiguous);
assert.equal(ambiguous.sourceId,'osdag808');
assert.equal(ambiguous.kgPerM,284.13,'Do not rewrite original source');
assert.equal(cat.standardAudit(ambiguous).status,'source-numeric-hold');
assert.equal(comparison.audit(cat,ambiguous).status,'hold');
assert.equal(comparison.quantityGate(cat,ambiguous).allowed,false);
// Four previously held outliers remain unusable despite shared WPB family.
for(const id of ['OSD193','OSD194','OSD195','OSD196']){
 const row=cat.byId(id);
 assert.ok(row);
 assert.equal(comparison.audit(cat,row).status,'hold',id);
 assert.equal(comparison.quantityGate(cat,row).allowed,false,id);
}
// The ambiguous source row remains blocked even after later clean WPB batches.
for(const id of ['OSD180']){
 const row=cat.byId(id);
 assert.ok(row);
 assert.equal(comparison.audit(cat,row).status,'hold',id);
 assert.equal(comparison.quantityGate(cat,row).allowed,false,id);
}
const all=status.summarize(cat,comparison,cat.sections);
assert.ok(all.counts.checked>=360&&all.counts.review<=378);
assert.ok(all.counts.hold>=19);
assert.equal(all.counts.checked+all.counts.review+all.counts.hold,757);
assert.equal(all.total,757);
const wpb=all.records.filter(r=>cat.resolveSeries(r.row)==='WPB');
assert.deepEqual(wpb.reduce((z,r)=>(z[r.status]++,z),{checked:0,review:0,hold:0}),
 {checked:119,review:1,hold:4});
const catalogText=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=catalogText.split('/* V50: 21 exact Table 4 WPB')[1]?.split('/* V51: remaining 50 exact WPB')[0]||'';
assert.ok(ledger.includes('IS808_V50_ROW_CHECKS'));
assert.equal((ledger.match(/fingerprint:/g)||[]).length,21);
assert.ok(!/mass:\s*\d|area:\s*\d|ix:\s*\d/.test(ledger));
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').match(/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/));
console.log('STEEL V50 preservation PASS: all 21 V50 WPB checked rows retain their source and quantity gates; outstanding WPB exceptions blocked.');
