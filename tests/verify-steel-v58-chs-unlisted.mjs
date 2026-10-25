/* Steel V58: negative-source audit of historical CHS pairings absent
 * from IS 1161:2014 + Amendment 2 (Aug 2023) Table 1.
 * A missing tabulated OD/thickness does NOT preclude procurement by
 * agreement under Clause 6.1.3; it means legacy kg/m is NOT source checked.
 * Do not distribute the restricted BIS original or numeric table here.
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
const status=require('../pwd-steel-status.js');
const raw=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=raw.split('const CHS_V58_UNLISTED=Object.freeze([')[1]?.split(']);')[0];
assert.ok(ledger,'V58 source-negative ledger must exist');
const entries=[...ledger.matchAll(/id:'(OSD\d+)',fingerprint:'([0-9a-f]{8})'/g)]
 .map(([,id,fingerprint])=>({id,fingerprint}));
assert.equal(entries.length,49);
assert.equal(new Set(entries.map(x=>x.id)).size,49);
assert.equal(catalog.is1161V58NonTabulatedCount,49);
assert.equal(catalog.is1161V57AuditSampleCount,30);
assert.equal(catalog.sections.length,757);
const fields=['sourceId','series','designation','qualityFlag','depthMm','widthMm',
 'diameterMm','thicknessMm','webMm','flangeMm','kgPerM','areaCm2',
 'ixCm4','iyCm4','zxCm3','zyCm3'];
for(const {id} of entries){
 const row=catalog.byId(id);
 assert.ok(row,id);
 assert.equal(row.family,'hollow',id);
 assert.equal(row.series,'CHS',id);
 assert.equal(row.sourceId,'osdagCHS',id);
 const check=catalog.standardAudit(row);
 assert.equal(check.status,'not-listed-in-replacement',id);
 assert.equal(check.sourceTable,1,id);
 assert.match(check.note,/Clause 6\.1\.3/,id);
 assert.match(check.note,/not automatically forbidden/,id);
 assert.equal(compare.audit(catalog,row).status,'hold',id);
 assert.equal(compare.quantityGate(catalog,row).allowed,false,id);
 const modifiedId={...row,id:id+'-changed'};
 assert.notEqual(catalog.standardAudit(modifiedId).status,'spot-checked-match');
 assert.equal(compare.quantityGate(catalog,modifiedId).allowed,false,id);
 for(const field of fields){
  const prior=row[field];
  const changed={...row,[field]:typeof prior==='number'?prior+1:
   prior===null||prior===undefined?'unexpected-change':
   String(prior)+'-changed'};
  assert.equal(catalog.standardAudit(changed).status,'spot-checked-conflict',
   id+' altered '+field);
  assert.equal(compare.quantityGate(catalog,changed).allowed,false,
   id+' quantity after tamper '+field);
 }
}
// The 30 V57 positive table matches must remain usable for provisional
// quantity arithmetic and not be incorrectly reclassified as unlisted.
const positive=raw.split('const CHS_V57_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0];
const selected=[...positive.matchAll(/id:'(OSD\d+)'/g)].map(x=>x[1]);
assert.equal(selected.length,30);
assert.equal(selected.filter(id=>entries.some(x=>x.id===id)).length,0);
for(const id of selected){
 const row=catalog.byId(id);
 assert.equal(catalog.standardAudit(row).status,'spot-checked-match',id);
 assert.equal(compare.quantityGate(catalog,row).allowed,true,id);
}
const anomalous=catalog.byId('OSD578');
assert.equal(anomalous.qualityFlag,'mass-area-inconsistent');
assert.equal(compare.quantityGate(catalog,anomalous).allowed,false);
const chs=status.summarize(catalog,compare,catalog.sections.filter(
 row=>catalog.resolveSeries(row)==='CHS'));
assert.deepEqual({...chs.counts},{checked:33,review:0,hold:50});
assert.equal(chs.total,83);
const all=status.summarize(catalog,compare,catalog.sections);
assert.ok(all.counts.checked>=667&&all.counts.review<=25&&all.counts.hold>=65,
 'Later explicit IS 808 source reviews may change totals but cannot undo prior CHS holds');
assert.equal(all.total,757);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8')
 .match(/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/));
assert.equal(fs.existsSync(path.join(root,'IS_1161_Amendment2_2023.pdf')),false);
console.log('STEEL V58 HISTORICAL PASS: 49 non-tabulated CHS remains held with agreement exception, all 30 V57 CHS matches preserved.');
