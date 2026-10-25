/* V57: exact CHS source checks against owner-held IS 1161:2014
 * Amendment 2 (Aug 2023) replacement Table 1; no BIS table distributed.
 * Verifies source provenance, current nominal weight gate, and post-audit tamper holds.
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
const source=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=source.split('const CHS_V57_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0];
assert.ok(ledger,'V57 source ledger exists');
const entries=[...ledger.matchAll(/id:'(OSD\d+)',fingerprint:'([0-9a-f]{8})',pdfPage:(\d+)/g)]
 .map(([,id,fp,page])=>({id,fp,page:Number(page)}));
assert.equal(entries.length,30);
assert.equal(new Set(entries.map(e=>e.id)).size,30);
assert.equal(cat.is1161V57AuditSampleCount,30);
assert.equal(cat.sections.length,757);
const props=['id','sourceId','family','series','designation','depthMm',
 'widthMm','diameterMm','thicknessMm','webMm','flangeMm','kgPerM',
 'areaCm2','ixCm4','iyCm4','zxCm3','zyCm3','qualityFlag'];
for(const {id,page} of entries){
 const row=cat.byId(id);
 assert.ok(row,id);
 assert.equal(row.family,'hollow',id);
 assert.equal(row.series,'CHS',id);
 assert.equal(row.sourceId,'osdagCHS',id);
 assert.ok(page>=3&&page<=7,id);
 assert.ok(Number.isFinite(row.kgPerM)&&row.kgPerM>0,id);
 assert.ok(Number.isFinite(row.areaCm2)&&row.areaCm2>0,id);
 assert.ok(Math.abs(row.kgPerM-row.areaCm2*0.785)/row.kgPerM<0.02,
  id+' internal mass/area density check');
 const a=cat.standardAudit(row);
 assert.equal(a.status,'spot-checked-match',id);
 assert.equal(a.sourceTable,1,id);
 assert.equal(a.sourcePdfPage,page,id);
 assert.equal(a.geometryChecked,false,id);
 assert.equal(comparison.audit(cat,row).status,'checked',id);
 assert.equal(comparison.quantityGate(cat,row).allowed,true,id);
 for(const key of props){
  const old=row[key];
  const altered={...row,[key]:typeof old==='number'?old+1:
    old===null||old===undefined?'changed':String(old)+'-changed'};
  const newStatus=cat.standardAudit(altered).status;
  if(key==='id')assert.notEqual(newStatus,'spot-checked-match',
   id+' replacement ID cannot inherit source approval');
  else assert.equal(newStatus,'spot-checked-conflict',id+' altered '+key);
  assert.equal(comparison.quantityGate(cat,altered).allowed,false,
   id+' quantity blocked after altered '+key);
 }
}
// Older 2014 size/thickness combinations are not automatically adopted.
for(const id of ['OSD561','OSD566']){
 const row=cat.byId(id);
 assert.equal(cat.standardAudit(row).status,'not-listed-in-replacement',id);
 assert.equal(comparison.quantityGate(cat,row).allowed,false,id);
}
const bad=cat.byId('OSD578');
assert.equal(bad.qualityFlag,'mass-area-inconsistent');
assert.equal(comparison.quantityGate(cat,bad).allowed,false);
const chs=status.summarize(cat,comparison,cat.sections.filter(r=>cat.resolveSeries(r)==='CHS'));
assert.ok(chs.counts.checked>=33&&chs.counts.review<=46&&chs.counts.hold>=4,
 'Later source-negative audits may move not-tabulated CHS from review to hold');
assert.equal(chs.total,83);
const all=status.summarize(cat,comparison,cat.sections);
assert.ok(all.counts.checked>=667&&all.counts.review<=71&&all.counts.hold>=19,
 'Later audited historical omissions can be held without claiming a numerical BIS match');
assert.equal(all.total,757);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8')
 .includes('pwd-tools-steel-v57-2026-10-25'));
assert.equal(fs.existsSync(path.join(root,'749441127-IS-1161-2014-STRUCTURAL-TUBE.pdf')),false);
console.log('STEEL V57 PASS: 30 exact CHS source matches, 667 limited checked, 71 review, 19 hold; current-source quantity gate intact.');
