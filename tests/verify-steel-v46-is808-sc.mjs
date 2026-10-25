/* V46 — Seven SC columns compared with owner-held IS 808:2021
 * Table 5 physical PDF p.22; no licensed numeric table distributed.
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
const st=require('../pwd-steel-status.js');
const ids=['OSD294','OSD295','OSD296','OSD297','OSD298','OSD299','OSD300'];
assert.equal(cat.sections.length,757);
assert.equal(cat.is808V46AuditSampleCount,7);
assert.equal(new Set(ids).size,7);
assert.equal(cat.byId('OSD293'),null,'SC 100 must stay deduplicated to curated checked original');
const sc100=cat.sections.find(x=>cat.resolveSeries(x)==='SC'&&x.depthMm===100&&x.widthMm===100);
assert.ok(sc100,'Curated SC 100 missing');
assert.equal(cat.standardAudit(sc100).status,'is808-mass-checked');
assert.equal(cat.standardAudit(sc100).sourceTable,5);
assert.equal(cat.standardAudit(sc100).sourcePdfPage,22);
assert.equal(sc100.iyCm4,undefined,'Do not fabricate missing Iyy');
assert.equal(sc100.zyCm3,undefined,'Do not fabricate missing Zyy');
assert.equal(cat.standardAudit(sc100).geometryChecked,false);
assert.equal(cmp.quantityGate(cat,sc100).allowed,true,'Limited SC100 nominal weight now checked');
for(const key of ['id','sourceId','designation','kgPerM','areaCm2','depthMm','widthMm','ixCm4','zxCm3','webMm','flangeMm']){
 const v=sc100[key],changed={...sc100,[key]:typeof v==='number'?v+1:String(v)+'-changed'};
 assert.equal(cat.standardAudit(changed).status,key==='id'?'not-checked':'is808-numeric-conflict','SC100: '+key);
 assert.equal(cmp.quantityGate(cat,changed).allowed,false,'SC100: '+key);
}
for(const id of ids){
 const row=cat.byId(id);
 assert.ok(row,'Missing Osdag column '+id);
 assert.equal(row.sourceId,'osdag808');
 assert.equal(row.family,'column');
 assert.equal(cat.resolveSeries(row),'SC');
 const audit=cat.standardAudit(row);
 assert.equal(audit.status,'is808-mass-area-inertia-checked');
 assert.equal(audit.sourceTable,5);
 assert.equal(audit.sourcePdfPage,22);
 assert.equal(audit.geometryChecked,false);
 assert.equal(cmp.audit(cat,row).status,'checked');
 assert.equal(cmp.quantityGate(cat,row).allowed,true);
 const keys=['id','sourceId','series','designation','qualityFlag',
  'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4','zxCm3',
  'zyCm3','webMm','flangeMm'];
 for(const key of keys){
  const val=row[key];
  const changed={...row,[key]:typeof val==='number'?val+1:
   val===null?'changed':String(val)+'-changed'};
  assert.equal(cat.standardAudit(changed).status,key==='id'?'not-checked':'is808-numeric-conflict',id+': '+key);
  assert.equal(cmp.quantityGate(cat,changed).allowed,false,id+': '+key);
 }
}
const s=st.summarize(cat,cmp,cat.sections);
assert.ok(s.counts.checked>=227&&s.counts.review<=510);
assert.equal(s.counts.hold,19);
assert.equal(s.counts.checked+s.counts.review+s.counts.hold,757);
const script=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const ledger=script.split('/* V46: seven existing SC rows')[1]?.split('function auditIS808(row)')[0]||'';
assert.ok(ledger.includes('IS808_V46_ROW_CHECKS'));
assert.ok(!/mass:\s*\d|area:\s*\d|ix:\s*\d/.test(ledger),'Do not include licensed table values');
assert.ok(!fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')));
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes('pwd-tools-steel-v50-2026-10-25'));
console.log('STEEL V46 PASS: seven SC entries plus curated SC100 source checks remain intact.');
