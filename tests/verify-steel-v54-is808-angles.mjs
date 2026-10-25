/* Steel V54: EQ/UE source-checked Table 9–12 variants. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
global.PWDSteelOsdag=require('../pwd-steel-osdag.js');
const c=require('../pwd-steel-catalog.js');
const cmp=require('../pwd-steel-compare.js');
const st=require('../pwd-steel-status.js');
assert.equal(c.is808V54AuditSampleCount,178);
const audited=c.sections.filter(r=>r.sourceId==='osdag808'&&r.family==='angle'&&
 c.standardAudit(r).note?.startsWith('Limited IS 808:2021 direct EQ/UE angle table comparison'));
assert.equal(audited.length,178);
for(const r of audited){
 const a=c.standardAudit(r);
 assert.equal(a.status,'is808-mass-area-inertia-checked',r.id);
 assert.ok([9,10,11,12].includes(a.sourceTable));
 assert.ok(a.sourcePdfPage>=29&&a.sourcePdfPage<=39);
 assert.equal(a.geometryChecked,false);
 assert.equal(cmp.quantityGate(c,r).allowed,true);
 for(const key of ['id','sourceId','series','designation','qualityFlag',
 'depthMm','widthMm','kgPerM','areaCm2','ixCm4','iyCm4',
 'zxCm3','zyCm3','webMm','flangeMm']){
  const v=r[key],changed={...r,[key]:typeof v==='number'?v+1:String(v)+'-modified'};
  if(key==='id')assert.notEqual(c.standardAudit(changed).status,'is808-mass-area-inertia-checked');
  else assert.equal(c.standardAudit(changed).status,'is808-numeric-conflict',r.id+' '+key);
  assert.equal(cmp.quantityGate(c,changed).allowed,false,r.id+' '+key);
 }
}
for(const id of ['OSD435','OSD436','OSD437']){
 const row=c.byId(id);
 assert.ok(row);
 assert.equal(c.standardAudit(row).status,'not-checked',id);
 assert.equal(cmp.quantityGate(c,row).allowed,false);
}
const eq=st.summarize(c,cmp,c.sections.filter(r=>c.resolveSeries(r)==='EQ'));
const ue=st.summarize(c,cmp,c.sections.filter(r=>c.resolveSeries(r)==='UE'));
assert.deepEqual({...eq.counts},{checked:105,review:22,hold:8});
assert.deepEqual({...ue.counts},{checked:108,review:0,hold:0});
const sum=st.summarize(c,cmp,c.sections);
assert.deepEqual({...sum.counts},{checked:635,review:103,hold:19});
assert.equal(sum.total,757);
console.log('Steel V54 PASS: 178 new angle records; UE complete, 3 unmatched EQ rows quarantined, 635 checked / 103 pending / 19 held.');
