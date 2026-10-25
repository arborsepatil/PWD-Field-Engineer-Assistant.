/* Steel V54: exact unequal-leg angles IS 808:2021 Tables 11–12.
 * Fingerprint-bound source checks only; BIS numerical tables not committed.
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
const ids=Array.from({length:108},(_,i)=>i+452).filter(n=>n!==542&&n!==543);
assert.equal(ids.length,106);
assert.equal(cat.sections.length,757);
assert.equal(cat.is808V54AuditSampleCount,106);
for(const n of ids){
 const id='OSD'+n,r=cat.byId(id);
 assert.ok(r,id);
 assert.equal(r.sourceId,'osdag808',id);
 assert.equal(r.family,'angle',id);
 assert.equal(cat.resolveSeries(r),'UE',id);
 const a=cat.standardAudit(r),page=n<=464?35:n<=488?36:n<=513?37:n<=530?38:39;
 assert.equal(a.status,'is808-mass-area-inertia-checked',id);
 assert.equal(a.sourceTable,n<=513?11:12,id);
 assert.equal(a.sourcePdfPage,page,id);
 assert.equal(a.geometryChecked,false,id);
 assert.equal(comparison.audit(cat,r).status,'checked',id);
 assert.equal(comparison.quantityGate(cat,r).allowed,true,id);
 for(const f of ['id','sourceId','series','designation','qualityFlag',
 'depthMm','widthMm','webMm','flangeMm','kgPerM','areaCm2',
 'ixCm4','iyCm4','zxCm3','zyCm3','family']){
  const original=r[f];
  const wrong={...r,[f]:typeof original==='number'?original+1:
   original===null?'modified':String(original)+'-modified'};
  const altered=cat.standardAudit(wrong);
  if(f!=='id'&&f!=='family')assert.equal(altered.status,'is808-numeric-conflict',id+' '+f);
  else assert.notEqual(altered.status,'is808-mass-area-inertia-checked',id+' '+f);
  assert.equal(comparison.quantityGate(cat,wrong).allowed,false,id+' '+f);
 }
}
// The source extraction around supplementary 100x50x10 has ambiguous
// designation formatting and requires independent manual review.
const uncertain=cat.byId('OSD543');
assert.ok(uncertain);
assert.equal(cat.resolveSeries(uncertain),'UE');
assert.equal(uncertain.kgPerM,11.13,'Preserve the original value');
assert.equal(cat.standardAudit(uncertain).status,'not-checked');
assert.equal(comparison.quantityGate(cat,uncertain).allowed,false);
assert.equal(cat.byId('OSD542'),null,'Previously de-duplicated source row must stay absent');
const ue=status.summarize(cat,comparison,cat.sections.filter(r=>cat.resolveSeries(r)==='UE'));
assert.deepEqual({...ue.counts},{checked:107,review:1,hold:0});
assert.equal(ue.total,108);
const all=status.summarize(cat,comparison,cat.sections);
assert.ok(all.counts.checked>=563&&all.counts.review<=175&&all.counts.hold===19,
 'Later BIS-audited families may raise checked totals without changing original V54 UE rows');
assert.equal(all.total,757);
const raw=fs.readFileSync(path.join(root,'pwd-steel-catalog.js'),'utf8');
const fragment=raw.split('IS808_V54_ROW_CHECKS=Object.freeze([')[1]?.split(']);')[0]||'';
assert.equal((fragment.match(/fingerprint:/g)||[]).length,106);
assert.equal(fs.existsSync(path.join(root,'IS_808_2021_Fourth_Revision_User_Copy.pdf')),false);
assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').match(/pwd-tools-steel-v\d{2,}-\d{4}-\d{2}-\d{2}/));
console.log('STEEL V54 PASS: 106 source-matched unequal angles; one unresolved OSD543 blocked. Total 563 checked, 175 pending, 19 held.');
