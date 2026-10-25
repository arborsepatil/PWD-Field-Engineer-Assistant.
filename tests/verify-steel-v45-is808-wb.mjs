/* Steel V45: regression for five Table 1 WB variants audited against
 * owner-held IS 808:2021, physical PDF p.8. No BIS tables bundled.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const cat=require('../pwd-steel-catalog.js');
const compare=require('../pwd-steel-compare.js');
const status=require('../pwd-steel-status.js');
const ids=['OSD119','OSD120','OSD121','OSD122','OSD123'];
assert.equal(cat.sections.length,757);
assert.equal(cat.is808V45AuditSampleCount,5);
assert.equal(new Set(ids).size,5);
for(const id of ids){
 const row=cat.byId(id);
 assert.ok(row,'Missing Osdag WB record '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'beam');
 assert.equal(cat.resolveSeries(row),'WB');
 assert.equal(cat.standardAudit(row).status,'is808-mass-area-inertia-checked');
 assert.equal(cat.standardAudit(row).sourceTable,1);
 assert.equal(cat.standardAudit(row).sourcePdfPage,8);
 assert.equal(cat.standardAudit(row).geometryChecked,false);
 assert.equal(compare.audit(cat,row).status,'checked');
 assert.equal(compare.quantityGate(cat,row).allowed,true);
 for(const key of ['sourceId','series','designation','qualityFlag','depthMm',
   'widthMm','kgPerM','areaCm2','ixCm4','iyCm4','zxCm3','zyCm3',
   'webMm','flangeMm']){
  const value=row[key];
  const altered={...row,[key]:typeof value==='number'?value+1:
    value===null?'altered':String(value)+'-tampered'};
  assert.equal(cat.standardAudit(altered).status,'is808-numeric-conflict',id+' '+key);
  assert.equal(compare.quantityGate(cat,altered).allowed,false,id+' '+key);
 }
}
const light=cat.byId('OSD122'),heavy=cat.byId('OSD123');
assert.equal(light.depthMm,heavy.depthMm);
assert.equal(light.widthMm,heavy.widthMm);
assert.notEqual(light.kgPerM,heavy.kgPerM);
assert.notEqual(light.flangeMm,heavy.flangeMm);
assert.notEqual(light.id,heavy.id);
assert.equal(cat.search('WB 600','beam','WB').filter(r=>r.id==='OSD122'||r.id==='OSD123').length,2);
const sum=status.summarize(cat,compare,cat.sections);
assert.ok(sum.counts.checked>=219&&sum.counts.review<=518);
assert.equal(sum.counts.hold,19);
assert.equal(sum.counts.checked+sum.counts.review+sum.counts.hold,757);
const script=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=script.split('/* V45: five remaining existing WB rows')[1]?.split('function auditIS808(row)')[0]||'';
assert.ok(ledger.includes('IS808_V45_ROW_CHECKS'));
assert.ok(ledger.includes('fingerprint'));
assert.ok(!/mass:\s*\d|area:\s*\d|ix:\s*\d/.test(ledger),'No licensed BIS numeric table is bundled');
assert.ok(!fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')));
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes('pwd-tools-steel-v53-2026-10-25'));
console.log('STEEL V45 PASS: five WB Table 1 source checks remain intact; both WB600 variants retained.');
