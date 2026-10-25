/* Steel V59: direct source comparisons of 19 exact product records:
 * 15 nominal unit-weight matches, 4 documented old-manufacturer conflicts.
 * BIS numerical tables are not embedded and product/structural approvals
 * are not inferred from a nominal-weight match.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const catalog=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const statuses=require('../pwd-steel-status.js');
const raw=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const part=raw.split('const IS808_V59_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0];
assert.ok(part,'New V59 audited-source identities must exist');
const entries=[...part.matchAll(
 /id:'([^']+)',result:'(match|conflict)',table:(\d+),pdfPage:(\d+),fingerprint:'([0-9a-f]{8})'/g
)].map(([,id,result,table,pdfPage,fingerprint])=>({
 id,result,table:Number(table),pdfPage:Number(pdfPage),fingerprint
}));
assert.equal(entries.length,19,'15 BIS source matches and four manufacturer conflicts');
assert.equal(new Set(entries.map(x=>x.id)).size,19,'No duplicate approval identities');
assert.equal(entries.filter(x=>x.result==='match').length,15);
assert.equal(entries.filter(x=>x.result==='conflict').length,4);
assert.equal(catalog.is808V59AuditSampleCount,19);
assert.equal(catalog.sections.length,757);
const guardedFields=['sourceId','family','series','designation','depthMm',
 'widthMm','thicknessMm','webMm','flangeMm','kgPerM','areaCm2',
 'ixCm4','iyCm4','zxCm3','zyCm3','qualityFlag'];
for(const e of entries){
 const row=catalog.byId(e.id);
 assert.ok(row,e.id+' must retain original manufacturer reference');
 const a=catalog.standardAudit(row);
 assert.equal(a.sourceTable,e.table,e.id);
 assert.equal(a.sourcePdfPage,e.pdfPage,e.id);
 assert.equal(a.geometryChecked,false,e.id+' geometry not fully verified');
 if(e.result==='match'){
  assert.equal(a.status,'is808-mass-checked',e.id);
  assert.equal(compare.audit(catalog,row).status,'checked',e.id);
  assert.equal(compare.quantityGate(catalog,row).allowed,true,e.id);
 }else{
  assert.equal(a.status,'is808-numeric-conflict',e.id);
  assert.equal(compare.audit(catalog,row).status,'hold',e.id);
  assert.equal(compare.quantityGate(catalog,row).allowed,false,e.id);
  assert.match(a.note,/disagrees/,e.id);
 }
 const badId={...row,id:e.id+'-edited'};
 assert.notEqual(catalog.standardAudit(badId).status,'is808-mass-checked',
  e.id+' must not pass another ID source approval');
 assert.equal(compare.quantityGate(catalog,badId).allowed,false,e.id);
 for(const key of guardedFields){
  const val=row[key];
  const forged={...row,[key]:typeof val==='number'?val+1:
   val==null?'changed':String(val)+'-changed'};
  const changedSourceStatus=catalog.standardAudit(forged).status;
  if(key==='family')
   assert.notEqual(changedSourceStatus,'is808-mass-checked',
    e.id+' changed family cannot inherit BIS audit');
  else
   assert.equal(changedSourceStatus,'is808-numeric-conflict',
    e.id+' tamper '+key);
  assert.equal(compare.quantityGate(catalog,forged).allowed,false,
   e.id+' tampered quantity gate '+key);
 }
}
// A correct SAIL 2023 number must never validate its old conflicting sibling.
assert.equal(catalog.standardAudit(catalog.byId('ISA100x100x6')).status,'is808-numeric-conflict');
assert.equal(catalog.standardAudit(catalog.byId('sail23-ISA100x100x6')).status,'is808-mass-checked');
const subsequent=['OSD180','OSD329','OSD334','OSD338','OSD543','sail23-ISA200x200x18'];
for(const id of subsequent){
 const row=catalog.byId(id);
 assert.ok(row,id+' retained for future V60 adjudication');
 assert.notEqual(compare.audit(catalog,row).sourceStatus,'is808-numeric-conflict',id);
}
const all=statuses.summarize(catalog,compare,catalog.sections);
assert.ok(all.counts.checked>=682&&all.counts.review<=6&&all.counts.hold>=69,
 'A later source review can convert previously pending entries to checked/hold');
assert.equal(all.total,757);
assert.match(fs.readFileSync(path.join(root,'sw.js'),'utf8'),
 /pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/);
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
console.log('STEEL V59 HISTORICAL PASS: all 15 original source matches, four manufacturer weight conflicts and tamper gates remain intact.');
