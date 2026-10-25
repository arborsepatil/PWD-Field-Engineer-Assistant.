/* V47 — Existing Osdag heavy beam source checks against owner-held IS 808:2021
 * Table 5 (physical PDF p.22). Locked fingerprints, no BIS table reproduced.
 * The original checked HB 200 is a curated deduplicated partial-property row.
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

const ids=['OSD247','OSD248','OSD249',
 ...Array.from({length:13},(_,i)=>'OSD'+(251+i))];
assert.equal(ids.length,16);
assert.equal(new Set(ids).size,16);
assert.equal(cat.is808V47AuditSampleCount,16);
assert.equal(cat.sections.length,757);
const actualHB=cat.sections.filter(row=>cat.resolveSeries(row)==='HB');
assert.equal(actualHB.length,17);
assert.equal(cat.byId('OSD250'),null,'HB 200 duplicate must remain excluded');
const base=actualHB.find(r=>r.designation==='HB 200'&&r.kgPerM===37.31);
assert.ok(base,'Deduplicated base HB 200 must remain');
assert.equal(cat.standardAudit(base).status,'is808-mass-checked','Do not claim missing inertia as checked');
assert.equal(base.iyCm4,undefined,'Do not fabricate curated Iyy');
assert.equal(base.zyCm3,undefined,'Do not fabricate curated Zyy');
assert.equal(cmp.quantityGate(cat,base).allowed,true);

for(const id of ids){
 const row=cat.byId(id);
 assert.ok(row,'Existing Osdag variant missing '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'column');
 assert.equal(cat.resolveSeries(row),'HB');
 const audit=cat.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked',id);
 assert.equal(audit.sourceTable,5);
 assert.equal(audit.sourcePdfPage,22);
 assert.equal(audit.geometryChecked,false,'Slope/radii unverified');
 assert.equal(cmp.audit(cat,row).status,'checked',id);
 assert.equal(cmp.quantityGate(cat,row).allowed,true,id);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
   'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
   'zxCm3','zyCm3','webMm','flangeMm']){
  const original=row[key];
  const modified={...row,[key]:typeof original==='number'?original+1:
    original===null?'tampered':String(original)+'-tampered'};
  if(key!=='id')assert.equal(cat.standardAudit(modified).status,'is808-numeric-conflict',id+' '+key);
  else assert.notEqual(cat.standardAudit(modified).status,'is808-mass-area-inertia-checked','ID mutation must lose verification');
  assert.equal(cmp.quantityGate(cat,modified).allowed,false,id+' '+key);
 }
}
// Same designation can refer to different approved starred mass variants.
// Matching on depth/width alone previously (incorrectly) held OSD251.
const h150=actualHB.filter(r=>r.designation==='HB 150*');
assert.equal(h150.length,2,'Both heavier HB 150* roll variants retained');
assert.notEqual(h150[0].kgPerM,h150[1].kgPerM);
assert.notEqual(h150[0].webMm,h150[1].webMm);
const hb200Heavy=cat.byId('OSD251');
assert.equal(hb200Heavy.designation,'HB 200*');
assert.equal(base.depthMm,hb200Heavy.depthMm);
assert.equal(base.widthMm,hb200Heavy.widthMm);
assert.notEqual(base.kgPerM,hb200Heavy.kgPerM);
assert.notEqual(base.webMm,hb200Heavy.webMm);
assert.equal(cmp.quantityGate(cat,hb200Heavy).allowed,true,
 'Source-checked HB 200* is a distinct valid Table 5 variant');
assert.equal(cat.search('HB 150','column','HB').filter(r=>r.id==='OSD248'||r.id==='OSD249').length,2);
for(const id of ['OSD13','OSD308','OSD331']){
 const row=cat.byId(id);
 assert.ok(row);
 assert.equal(cmp.quantityGate(cat,row).allowed,false,'Unrelated hold must not be released '+id);
}
const count=status.summarize(cat,cmp,cat.sections);
assert.ok(count.counts.checked>=243&&count.counts.review<=495);
assert.equal(count.counts.hold,19);
assert.equal(count.counts.checked+count.counts.review+count.counts.hold,757);
assert.equal(count.total,757);
const script=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const sourceLedger=script.split('/* V47: 16 existing Osdag heavy-beam')[1]?.split('function auditIS808(row)')[0]||'';
assert.ok(sourceLedger.includes('IS808_V47_ROW_CHECKS'));
assert.ok(sourceLedger.includes('fingerprint'));
assert.ok(!/mass:\s*\d|area:\s*\d|ix:\s*\d/.test(sourceLedger),
 'Licensed numerical BIS table may not be bundled');
assert.ok(!fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')));
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes('pwd-tools-steel-v49-2026-10-25'));
console.log('STEEL V47 PASS: 16 HB source-audited variants, 243 checked, 495 pending, 19 held. HB 200* false hold resolved and remaining holds preserved.');
