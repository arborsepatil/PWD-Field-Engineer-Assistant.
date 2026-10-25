/* V48: selected Table 4 WPB first two physical PDF pages p15-16.
 * Regression and negative tests contain record IDs/fingerprints only, not BIS tables.
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

const ids=Array.from({length:22},(_,i)=>'OSD'+(125+i));
assert.equal(ids.length,22);
assert.equal(new Set(ids).size,22);
assert.equal(cat.is808V48AuditSampleCount,22);
assert.equal(cat.sections.length,757);
assert.equal(cat.byId('OSD124').designation,'WPB 100 X 100 X 12.24');
assert.equal(cat.standardAudit(cat.byId('OSD124')).status,
 'is808-mass-area-inertia-checked','Pre-checked WPB 100 must stay checked');
for(const id of ids){
 const row=cat.byId(id),number=Number(id.slice(3));
 assert.ok(row,'WPB entry missing: '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'beam');
 assert.equal(cat.resolveSeries(row),'WPB');
 const audit=cat.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked',id);
 assert.equal(audit.sourceTable,4,id);
 assert.equal(audit.sourcePdfPage,number<=135?15:16,id);
 assert.equal(audit.geometryChecked,false,'Unverified radii/slope not certified '+id);
 assert.equal(cmp.audit(cat,row).status,'checked',id);
 assert.equal(cmp.quantityGate(cat,row).allowed,true,id);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
  'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
  'zxCm3','zyCm3','webMm','flangeMm']){
  const original=row[key];
  const modified={...row,[key]:typeof original==='number'?original+1:
   original===null?'tampered':String(original)+'-tampered'};
  if(key!=='id')assert.equal(cat.standardAudit(modified).status,
   'is808-numeric-conflict',id+' '+key);
  else assert.notEqual(cat.standardAudit(modified).status,
   'is808-mass-area-inertia-checked','Changed ID must lose verification '+id);
  assert.equal(cmp.quantityGate(cat,modified).allowed,false,'Quantity gate '+id+' '+key);
 }
}
// Designation alone is not safe: nominal mass is part of variant identity.
const wpb100=[124,125,126,127].map(i=>cat.byId('OSD'+i));
assert.equal(new Set(wpb100.map(x=>x.kgPerM)).size,4);
assert.equal(new Set(wpb100.map(x=>x.designation)).size,4);
assert.equal(new Set(wpb100.map(x=>x.depthMm)).size,4);
// A parent search/category must retain every physically distinct listed mass variant.
for(const row of wpb100)assert.equal(cmp.quantityGate(cat,row).allowed,true);
const wpb=cat.sections.filter(x=>cat.resolveSeries(x)==='WPB');
assert.equal(wpb.length,124);
const onHold=['OSD193','OSD194','OSD195','OSD196'];
for(const id of onHold){
 const row=cat.byId(id);
 assert.ok(row,id+' must not disappear');
 assert.equal(cmp.audit(cat,row).status,'hold',id);
 assert.equal(cmp.quantityGate(cat,row).allowed,false,id);
}
const pending=cat.byId('OSD180');
assert.ok(pending);
assert.equal(cmp.quantityGate(cat,pending).allowed,false,
 'Next Table 4 page must not become eligible without audit');
const s=status.summarize(cat,cmp,cat.sections);
assert.ok(s.counts.checked>=265&&s.counts.review<=473);
assert.equal(s.counts.hold,19);
assert.equal(s.counts.checked+s.counts.review+s.counts.hold,757);
assert.equal(s.total,757);
const selected=s.records.filter(x=>cat.resolveSeries(x.row)==='WPB');
assert.deepEqual(selected.reduce((tot,x)=>(tot[x.status]++,tot),
 {checked:0,review:0,hold:0}),{checked:119,review:1,hold:4});
const src=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=src.split('/* V48: first 22 newly checked')[1]?.split('function auditIS808(row)')[0]||'';
assert.ok(ledger.includes('IS808_V48_ROW_CHECKS'));
assert.ok(ledger.includes('fingerprint'));
assert.ok(!/mass:\s*\d|area:\s*\d|ix:\s*\d/.test(ledger),'No BIS numerical tables allowed in public catalogue');
assert.ok(!fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')));
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes('pwd-tools-steel-v52-2026-10-25'));
console.log('STEEL V48 PASS: the 22 original WPB source checks remain intact; all four WPB holds stay blocked.');
