/* Steel V43: checked MC/JC/LC channel source rows from IS 808:2021,
 * Table 6 physical PDF pp.23–24 and Table 7 pp.25–26.
 * BIS table content is not present in this publicly packaged regression.
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
const expected={
 MC:[304,306,307,310,311,312,315,317,318,319],
 JC:[322,323,324,325],
 LC:[326,327,328,332,333,335,336,337,339,340]
};
assert.equal(catalog.sections.length,757,'Missing or extra steel source record');
assert.equal(catalog.is808V42AuditSampleCount,22,'Preserve Table 2 completed audit');
assert.equal(catalog.is808V43AuditSampleCount,24);
const allIDs=Object.values(expected).flat().map(num=>'OSD'+num);
assert.equal(new Set(allIDs).size,24);
for(const [series,ids] of Object.entries(expected)){
 for(const number of ids){
  const row=catalog.byId('OSD'+number);
  assert.ok(row,'Lost existing Osdag row '+number);
  assert.equal(row.sourceId,'osdag808');
  assert.equal(row.family,'channel');
  assert.equal(catalog.resolveSeries(row),series);
  const bis=catalog.standardAudit(row);
  assert.equal(bis.status,'is808-mass-area-inertia-checked',row.id+' BIS status');
  assert.equal(bis.sourceTable,series==='MC'?6:7);
  assert.ok([23,24,25,26].includes(bis.sourcePdfPage));
  assert.equal(bis.geometryChecked,false,'Untested geometry must not be certified');
  assert.match(bis.note,/Flange slope, root\/toe radii/);
  assert.equal(compare.audit(catalog,row).status,'checked','Limited verified row: '+row.id);
  assert.equal(compare.quantityGate(catalog,row).allowed,true);
  // The source check is bound to exact Osdag identity, series, designation,
  // nominal mass/dimensions, area and selected section properties.
  const auditedKeys=['sourceId','series','designation','depthMm','widthMm',
   'kgPerM','areaCm2','ixCm4','iyCm4','zxCm3','zyCm3','webMm','flangeMm'];
  for(const key of auditedKeys){
   const modified={...row,[key]:typeof row[key]==='number'?row[key]+1:String(row[key])+'-changed'};
   const altered=catalog.standardAudit(modified);
   assert.equal(altered.status,'is808-numeric-conflict',row.id+': altered '+key);
   assert.equal(compare.audit(catalog,modified).status,'hold',row.id+': '+key);
   assert.equal(compare.quantityGate(catalog,modified).allowed,false,row.id+': '+key);
  }
  const contaminated={...row,qualityFlag:'unverified'};
  assert.equal(compare.quantityGate(catalog,contaminated).allowed,false);
 }
}
for(const id of ['OSD308','OSD331']){
 const row=catalog.byId(id);
 assert.ok(row);
 assert.equal(compare.audit(catalog,row).status,'hold','Existing problem must remain held: '+id);
 assert.equal(compare.quantityGate(catalog,row).allowed,false);
}
for(const id of ['OSD329','OSD334','OSD338']){
 const row=catalog.byId(id);
 assert.ok(row);
 assert.equal(compare.audit(catalog,row).status,'review','Provisional LC variant remains pending: '+id);
 assert.equal(compare.quantityGate(catalog,row).allowed,false);
}
const result=status.summarize(catalog,compare,catalog.sections);
assert.ok(result.counts.checked>=195,'V43 checked rows must remain verified');
assert.ok(result.counts.review<=542,'Later source audit may reduce pending');
assert.ok(result.counts.hold>=19,'Remaining source conflicts must stay blocked after verified HB 200* correction');
assert.equal(result.counts.checked+result.counts.review+result.counts.hold,757);
assert.equal(result.total,757);
for(const type of ['checked','review','hold']){
 const selected=status.select(catalog,compare,catalog.sections,type);
 assert.equal(selected.rows.length,result.counts[type]);
}
const source=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=source.split('/* V43: 24 existing Osdag')[1]?.split('// Source-published nominal figures')[0]||'';
assert.match(ledger,/IS808_V43_ROW_CHECKS/);
assert.match(ledger,/fingerprint/);
assert.ok(!ledger.includes('mass:')&&!ledger.includes('area:')&&!ledger.includes('ix:'),'Licensed source table cannot be copied into the app audit ledger');
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').match(/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/));
console.log('STEEL V43 PASS: 24 channel source matches; '+result.counts.checked+' limited-checked, '+result.counts.review+' pending, '+result.counts.hold+' held. Quantity gate and provisional holds intact.');
