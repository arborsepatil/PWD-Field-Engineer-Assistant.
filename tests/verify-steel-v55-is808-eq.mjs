/* Steel V56: regression and fail-closed checks for the V55 equal-angle
 * ledger. This file does not copy or redistribute BIS source tables.
 * The prior V55 source comparisons must still be reviewed against the
 * owner-held authorized IS 808:2021 when expanding the catalogue.
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

const raw=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const fragment=raw.split('const IS808_V55_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0];
assert.ok(fragment,'V55 source ledger must exist');
const entries=[...fragment.matchAll(
 /id:'(OSD\d+)',fingerprint:'([0-9a-f]{8})',table:(9|10),pdfPage:(\d+)/g
)].map(([,id,fingerprint,table,page])=>({
 id,fingerprint,table:Number(table),page:Number(page)
}));
assert.equal(entries.length,74,'All 74 independently recorded variants must remain listed');
assert.equal(new Set(entries.map(x=>x.id)).size,74,'No repeated section IDs');
assert.equal(cat.is808V55AuditSampleCount,74);
assert.equal(cat.sections.length,757,'No silent deletion or duplication of catalogue rows');

for(const item of entries){
 const row=cat.byId(item.id);
 assert.ok(row,item.id+' must exist');
 assert.equal(row.sourceId,'osdag808',item.id);
 assert.equal(row.family,'angle',item.id);
 assert.equal(cat.resolveSeries(row),'EQ',item.id);
 assert.ok(item.table===9?[29,30,31,32].includes(item.page):
  [33,34].includes(item.page),item.id+' PDF provenance');
 const a=cat.standardAudit(row);
 assert.equal(a.status,'is808-mass-area-inertia-checked',item.id);
 assert.equal(a.sourceTable,item.table,item.id);
 assert.equal(a.sourcePdfPage,item.page,item.id);
 assert.equal(a.geometryChecked,false,item.id+' unverified radii/geometry must not be certified');
 assert.equal(comparison.audit(cat,row).status,'checked',item.id);
 assert.equal(comparison.quantityGate(cat,row).allowed,true,item.id);

 // Simulate post-audit catalogue tampering: every checked identity and
 // nominal weight/property change must fail closed before quantity output.
 for(const field of ['sourceId','series','designation','qualityFlag',
   'depthMm','widthMm','webMm','flangeMm','kgPerM','areaCm2',
   'ixCm4','iyCm4','zxCm3','zyCm3']){
  const old=row[field];
  const altered={...row,[field]:typeof old==='number'?old+1:
   old===null||old===undefined?'unverified-change':String(old)+'-changed'};
  assert.equal(cat.standardAudit(altered).status,'is808-numeric-conflict',
   item.id+' tamper '+field);
  assert.equal(comparison.quantityGate(cat,altered).allowed,false,
   item.id+' quantity gate '+field);
 }
}
// Existing, conflicting or not-yet-reviewed variants must not inherit
// approval merely because the same nominal leg size was reviewed.
assert.equal(cat.byId('OSD383'),null,'De-duplicated source row stays absent');
for(const id of ['OSD180','OSD543']){
 const row=cat.byId(id);
 assert.ok(row,id+' unresolved source row retained');
 assert.equal(comparison.quantityGate(cat,row).allowed,false,id+' still blocked');
}
const all=status.summarize(cat,comparison,cat.sections);
assert.ok(all.counts.checked>=637&&all.counts.review<=101&&all.counts.hold>=19,
 'Subsequent source audits may either check rows or correctly quarantine unlisted CHS');
assert.equal(all.total,757);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8')
 .match(/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/),'New steel data must invalidate PWA cache');
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
console.log('STEEL V56 historical regression PASS: all 74 V55 equal-angle variants retain fail-closed source gates.');
