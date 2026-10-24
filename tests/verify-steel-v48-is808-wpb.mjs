/* Steel V48 — WPB first 23 entries of owner-held IS 808:2021 Table 4.
 * 22 additional existing rows are fingerprint-bound source-checked, while
 * the previously checked OSD124 stays checked. No copyrighted table content
 * is committed. Nominal kg/m calculations only (not structural clearance).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');

assert.equal(cat.sections.length,757);
assert.equal(cat.is808V48AuditSampleCount,22);
const prior=cat.byId('OSD124');
assert.equal(prior.designation,'WPB 100 X 100 X 12.24');
assert.equal(cat.standardAudit(prior).status,'is808-mass-area-inertia-checked');
assert.equal(cmp.quantityGate(cat,prior).allowed,true);

const ids=Array.from({length:22},(_,i)=>'OSD'+(i+125));
assert.equal(new Set(ids).size,22);
for(const id of ids){
 const row=cat.byId(id);
 assert.ok(row,'Previously pending WPB variant missing '+id);
 assert.equal(row.family,'beam');
 assert.equal(row.sourceId,'osdag808');
 assert.equal(cat.resolveSeries(row),'WPB');
 const a=cat.standardAudit(row);
 assert.equal(a.status,'is808-mass-area-inertia-checked',id);
 assert.equal(a.sourceTable,4,id);
 assert.equal(a.sourcePdfPage,Number(id.slice(3))<=135?16:17,id);
 assert.equal(a.geometryChecked,false,'Radii/slope NOT source-checked');
 assert.equal(cmp.audit(cat,row).status,'checked',id);
 assert.equal(cmp.quantityGate(cat,row).allowed,true,id);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
  'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
  'zxCm3','zyCm3','webMm','flangeMm']){
  const value=row[key];
  const edited={...row,[key]:typeof value==='number'?value+1:
   value===null?'mutated':String(value)+'-mutated'};
  if(key!=='id')
   assert.equal(cat.standardAudit(edited).status,'is808-numeric-conflict',id+' '+key);
  else assert.notEqual(cat.standardAudit(edited).status,'is808-mass-area-inertia-checked',
   'Changed row ID cannot retain a matched fingerprint');
  assert.equal(cmp.quantityGate(cat,edited).allowed,false,
   'Failed-open quantity for modified verified row '+id+' '+key);
 }
}
// Hold decisions are explicitly preserved, not overridden by a match to another
// nominal size. These four WPB rows need their OWN source evidence and re-audit.
for(const id of ['OSD193','OSD194','OSD195','OSD196']){
 const row=cat.byId(id);
 assert.ok(row,'Original WPB held record missing '+id);
 assert.equal(cat.resolveSeries(row),'WPB');
 assert.equal(cmp.audit(cat,row).status,'hold',id);
 assert.equal(cmp.quantityGate(cat,row).allowed,false,id);
}
for(const id of ['OSD147','OSD148','OSD149']){
 const row=cat.byId(id);
 assert.ok(row);
 assert.equal(cmp.audit(cat,row).status,'review',id);
 assert.equal(cmp.quantityGate(cat,row).allowed,false,id);
}
const result=status.summarize(cat,cmp,cat.sections);
assert.deepEqual({...result.counts},{checked:265,review:473,hold:19});
assert.equal(result.total,757);
const source=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=source.split('/* V48: 22 previously pending WPB')[1]?.split('function auditIS808(row)')[0]||'';
assert.ok(ledger.includes('IS808_V48_ROW_CHECKS'));
assert.ok(!/kgPerM\s*:\s*\d|areaCm2\s*:\s*\d/.test(ledger),'No BIS table reprint');
assert.ok(!fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')));
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(sw.includes('pwd-tools-steel-v48-2026-10-25'));
console.log('STEEL V48 PASS: 22 new WPB Table 4 source matches; 265 limited-checked, 473 pending, 19 held. All integrity and quantity blocks preserved.');
